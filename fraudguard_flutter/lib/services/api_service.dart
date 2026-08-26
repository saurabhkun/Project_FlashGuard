import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/transaction_model.dart';
import 'telemetry_service.dart';

class ApiService {
  // Configurable base URL. Use 10.0.2.2 for Android Emulator, 127.0.0.1 for Desktop/Web, or your Local IP
  static String baseUrl = 'http://127.0.0.1:8000';

  static Future<Map<String, dynamic>> checkHealth() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/health')).timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'online': true,
          'model': data['model'] ?? 'FraudGuard',
          'version': data['model_version'] ?? 'fraudguard-dataset-v1',
          'status': data['status'] ?? 'healthy',
        };
      }
    } catch (e) {
      // Try Android emulator loopback host if 127.0.0.1 fails
      try {
        final response = await http.get(Uri.parse('http://10.0.2.2:8000/health')).timeout(const Duration(seconds: 2));
        if (response.statusCode == 200) {
          baseUrl = 'http://10.0.2.2:8000';
          final data = jsonDecode(response.body);
          return {
            'online': true,
            'model': data['model'] ?? 'FraudGuard',
            'version': data['model_version'] ?? 'fraudguard-dataset-v1',
            'status': data['status'] ?? 'healthy',
          };
        }
      } catch (_) {}
    }
    return {
      'online': false,
      'model': 'FraudGuard (Local Cache)',
      'version': 'fraudguard-dataset-v1',
      'status': 'offline',
    };
  }

  static Future<RiskEvaluationResult> evaluateTransaction({
    required double amount,
    required String recipient,
    required String type,
    double oldBalanceOrg = 50000.0,
  }) async {
    final telemetry = await TelemetryService.getDeviceTelemetry();

    final payload = {
      'step': 1,
      'type': type,
      'amount': amount,
      'nameOrig': 'USER_MOBILE_FLUTTER',
      'oldbalanceOrg': oldBalanceOrg,
      'newbalanceOrig': (oldBalanceOrg - amount).clamp(0.0, double.infinity),
      'nameDest': recipient,
      'oldbalanceDest': 0.0,
      'newbalanceDest': amount,
      'location': telemetry['location'],
      'gps_coordinates': telemetry['gps_coordinates'],
      'device_id': telemetry['device_id'],
      'ip_address': telemetry['ip_address'],
    };

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/predict'),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return RiskEvaluationResult.fromJson(data);
      } else {
        throw Exception('Server returned ${response.statusCode}');
      }
    } catch (e) {
      // Local Heuristic Fallback if network is disconnected
      int fallbackScore = 0;
      String fallbackLevel = 'SAFE';
      String fallbackDecision = 'ACCEPT';
      List<String> fallbackReasons = ['Offline evaluation (Server disconnected)'];

      if (amount >= 100000) {
        fallbackScore = 85;
        fallbackLevel = 'FRAUD';
        fallbackDecision = 'BLOCK';
        fallbackReasons.add('High transfer amount (?100,000+) flagged locally');
      } else if (amount >= 50000) {
        fallbackScore = 45;
        fallbackLevel = 'SUSPICIOUS';
        fallbackDecision = 'REVIEW';
        fallbackReasons.add('Substantial transfer amount (?50,000+) requires step-up auth');
      }

      return RiskEvaluationResult(
        riskScore: fallbackScore,
        level: fallbackLevel,
        decision: fallbackDecision,
        reasons: fallbackReasons,
        transactionId: 'TXN-OFFLINE-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
        isNewUser: true,
        amountDeviation: 0.0,
      );
    }
  }
}
