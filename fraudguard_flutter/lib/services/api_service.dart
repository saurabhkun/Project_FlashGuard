import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/transaction_model.dart';
import 'api_config.dart';

class ApiService {
  // Resolved at runtime — see ApiConfig
  static String baseUrl = ApiConfig.baseUrl;
  static bool _urlResolved = false;

  /// Try each candidate URL and use the first that responds.
  /// Android emulator: 10.0.2.2 → host machine's localhost
  /// Physical device: use your LAN IP in ApiConfig.candidateUrls
  static Future<HealthStatus> checkHealth() async {
    for (final candidate in ApiConfig.candidateUrls) {
      try {
        final response = await http
            .get(Uri.parse('$candidate/health'))
            .timeout(ApiConfig.connectTimeout);
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body) as Map<String, dynamic>;
          if (!_urlResolved) {
            baseUrl = candidate;
            _urlResolved = true;
          }
          return HealthStatus.fromJson(data);
        }
      } catch (_) {
        // Try next candidate
      }
    }
    return HealthStatus.offline();
  }

  /// POST /predict — core fraud evaluation
  static Future<RiskEvaluationResult> evaluateTransaction({
    required double amount,
    required String recipient,
    required String type,
    double oldBalanceOrg = 50000.0,
    String location = 'Mumbai, India',
    String deviceId = 'FLUTTER_ANDROID',
  }) async {
    // Ensure we have a working URL
    if (!_urlResolved) {
      await checkHealth();
    }

    final payload = {
      'step': 1,
      'type': type,
      'amount': amount,
      'nameOrig': 'USER_FLASHGUARD_MOBILE',
      'oldbalanceOrg': oldBalanceOrg,
      'newbalanceOrig': (oldBalanceOrg - amount).clamp(0.0, double.infinity),
      'nameDest': recipient,
      'oldbalanceDest': 0.0,
      'newbalanceDest': amount,
      'location': location,
      'gps_coordinates': '19.0760, 72.8777', // Default Mumbai
      'device_id': deviceId,
      'ip_address': '10.0.2.2',
      'is_fraud_label': 0,
    };

    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/predict'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: jsonEncode(payload),
          )
          .timeout(ApiConfig.requestTimeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return RiskEvaluationResult.fromJson(data);
      } else if (response.statusCode == 429) {
        // Rate limited — wait and retry once
        await Future.delayed(const Duration(milliseconds: 500));
        final retryResponse = await http
            .post(
              Uri.parse('$baseUrl/predict'),
              headers: {'Content-Type': 'application/json'},
              body: jsonEncode(payload),
            )
            .timeout(ApiConfig.requestTimeout);
        if (retryResponse.statusCode == 200) {
          return RiskEvaluationResult.fromJson(
            jsonDecode(retryResponse.body) as Map<String, dynamic>,
          );
        }
        throw Exception('Rate limited (429). Please wait a moment.');
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } catch (e) {
      // Local heuristic fallback when backend is unavailable
      return _localFallback(amount, recipient);
    }
  }

  /// GET /history — transaction history from SQLite
  static Future<List<TransactionItem>> getTransactionHistory({int limit = 20}) async {
    if (!_urlResolved) await checkHealth();
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/history'))
          .timeout(ApiConfig.requestTimeout);
      if (response.statusCode == 200) {
        final list = jsonDecode(response.body) as List<dynamic>;
        return list
            .take(limit)
            .map((e) => TransactionItem.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {}
    return [];
  }

  /// GET /dashboard/stats
  static Future<DashboardStats> getDashboardStats() async {
    if (!_urlResolved) await checkHealth();
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/dashboard/stats'))
          .timeout(ApiConfig.requestTimeout);
      if (response.statusCode == 200) {
        return DashboardStats.fromJson(
          jsonDecode(response.body) as Map<String, dynamic>,
        );
      }
    } catch (_) {}
    return DashboardStats.empty();
  }

  /// Local heuristic fallback — used ONLY when backend is unreachable
  static RiskEvaluationResult _localFallback(double amount, String recipient) {
    int score = 0;
    final reasons = <String>['⚠ Security engine offline — local evaluation only'];
    final recipientUpper = recipient.toUpperCase();

    if (recipientUpper.contains('MULE') ||
        recipientUpper.contains('SUSPICIOUS') ||
        recipientUpper.contains('M999')) {
      score += 50;
      reasons.add('Flagged recipient identifier detected');
    }
    if (amount >= 100000) {
      score += 40;
      reasons.add('High transfer amount (₹1,00,000+) requires server verification');
    } else if (amount >= 50000) {
      score += 25;
      reasons.add('Substantial amount (₹50,000+)');
    } else if (amount >= 10000) {
      score += 10;
    }

    score = score.clamp(0, 100);
    String level, decision;
    if (score <= 40) {
      level = 'SAFE';
      decision = 'ACCEPT';
    } else if (score <= 80) {
      level = 'SUSPICIOUS';
      decision = 'REVIEW';
    } else {
      level = 'FRAUD';
      decision = 'BLOCK';
    }

    return RiskEvaluationResult(
      riskScore: score,
      level: level,
      decision: decision,
      reasons: reasons,
      transactionId: 'TXN-OFFLINE-${DateTime.now().millisecondsSinceEpoch % 100000}',
      isNewUser: true,
      amountDeviation: 0.0,
      behavioralInsight: 'Offline mode — connect to FraudGuard backend for full AI analysis',
    );
  }
}
