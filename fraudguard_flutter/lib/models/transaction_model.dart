class TransactionItem {
  final String id;
  final String title;
  final double amount;
  final String status;
  final int riskScore;
  final String date;
  final String type;
  final List<String> reasons;
  final String? recipient;

  TransactionItem({
    required this.id,
    required this.title,
    required this.amount,
    required this.status,
    required this.riskScore,
    required this.date,
    required this.type,
    this.reasons = const [],
    this.recipient,
  });

  factory TransactionItem.fromJson(Map<String, dynamic> json) {
    return TransactionItem(
      id: json['id']?.toString() ?? '',
      title: json['nameDest']?.toString() ?? json['title']?.toString() ?? 'Unknown Recipient',
      amount: (json['amount'] ?? 0.0).toDouble(),
      status: json['status']?.toString() ?? 'SAFE',
      riskScore: (json['risk_score'] ?? 0).toInt(),
      date: json['timestamp']?.toString() ?? '',
      type: json['type']?.toString() ?? 'TRANSFER',
      reasons: List<String>.from(json['reasons'] ?? []),
      recipient: json['nameDest']?.toString(),
    );
  }
}

class RiskEvaluationResult {
  final int riskScore;
  final String level; // SAFE, SUSPICIOUS, FRAUD
  final String decision; // ACCEPT, REVIEW, BLOCK
  final List<String> reasons;
  final String transactionId;
  final bool isNewUser;
  final double amountDeviation;
  final String? behavioralInsight;
  final bool? velocityAnomaly;

  RiskEvaluationResult({
    required this.riskScore,
    required this.level,
    required this.decision,
    required this.reasons,
    required this.transactionId,
    required this.isNewUser,
    required this.amountDeviation,
    this.behavioralInsight,
    this.velocityAnomaly,
  });

  factory RiskEvaluationResult.fromJson(Map<String, dynamic> json) {
    return RiskEvaluationResult(
      riskScore: (json['risk_score'] ?? 0).toInt(),
      level: json['level']?.toString() ?? 'SAFE',
      decision: json['decision']?.toString() ?? 'ACCEPT',
      reasons: List<String>.from(json['reasons'] ?? ['All parameters within normal range']),
      transactionId: json['transaction_id']?.toString() ?? '',
      isNewUser: json['is_new_user'] ?? true,
      amountDeviation: (json['amount_deviation'] ?? 0.0).toDouble(),
      behavioralInsight: json['behavioral_insight']?.toString(),
      velocityAnomaly: json['velocity_anomaly'] as bool?,
    );
  }
}

class HealthStatus {
  final bool isOnline;
  final String model;
  final String modelVersion;
  final String modelType;
  final bool modelLoaded;
  final int selectedFeatures;

  const HealthStatus({
    required this.isOnline,
    required this.model,
    required this.modelVersion,
    required this.modelType,
    required this.modelLoaded,
    required this.selectedFeatures,
  });

  factory HealthStatus.offline() => const HealthStatus(
    isOnline: false,
    model: 'FraudGuard',
    modelVersion: 'fraudguard-dataset-v1',
    modelType: 'HistGradientBoostingClassifier',
    modelLoaded: false,
    selectedFeatures: 100,
  );

  factory HealthStatus.fromJson(Map<String, dynamic> json) {
    return HealthStatus(
      isOnline: json['status'] == 'healthy',
      model: json['model']?.toString() ?? 'FraudGuard',
      modelVersion: json['model_version']?.toString() ?? 'fraudguard-dataset-v1',
      modelType: json['model_type']?.toString() ?? 'HistGradientBoostingClassifier',
      modelLoaded: json['model_loaded'] as bool? ?? true,
      selectedFeatures: (json['selected_features'] ?? 100).toInt(),
    );
  }
}

class DashboardStats {
  final int totalTransactions;
  final int blockedToday;
  final double averageTransaction;
  final double fraudDetectionRate;
  final int overallRiskScore;
  final int safeCount;
  final int suspiciousCount;
  final int fraudulentCount;

  const DashboardStats({
    required this.totalTransactions,
    required this.blockedToday,
    required this.averageTransaction,
    required this.fraudDetectionRate,
    required this.overallRiskScore,
    required this.safeCount,
    required this.suspiciousCount,
    required this.fraudulentCount,
  });

  factory DashboardStats.empty() => const DashboardStats(
    totalTransactions: 0,
    blockedToday: 0,
    averageTransaction: 0,
    fraudDetectionRate: 0,
    overallRiskScore: 0,
    safeCount: 0,
    suspiciousCount: 0,
    fraudulentCount: 0,
  );

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      totalTransactions: (json['total_transactions'] ?? 0).toInt(),
      blockedToday: (json['blocked_today'] ?? 0).toInt(),
      averageTransaction: (json['average_transaction'] ?? 0.0).toDouble(),
      fraudDetectionRate: (json['fraud_detection_rate'] ?? 0.0).toDouble(),
      overallRiskScore: (json['overall_risk_score'] ?? 0).toInt(),
      safeCount: (json['safe_count'] ?? 0).toInt(),
      suspiciousCount: (json['suspicious_count'] ?? 0).toInt(),
      fraudulentCount: (json['fraudulent_count'] ?? 0).toInt(),
    );
  }
}
