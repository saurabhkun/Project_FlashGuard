class TransactionItem {
  final String id;
  final String title;
  final double amount;
  final String status;
  final int riskScore;
  final String date;
  final String type;

  TransactionItem({
    required this.id,
    required this.title,
    required this.amount,
    required this.status,
    required this.riskScore,
    required this.date,
    required this.type,
  });
}

class RiskEvaluationResult {
  final int riskScore;
  final String level; // SAFE, SUSPICIOUS, FRAUD
  final String decision; // ACCEPT, REVIEW, BLOCK
  final List<String> reasons;
  final String transactionId;
  final bool isNewUser;
  final double amountDeviation;

  RiskEvaluationResult({
    required this.riskScore,
    required this.level,
    required this.decision,
    required this.reasons,
    required this.transactionId,
    required this.isNewUser,
    required this.amountDeviation,
  });

  factory RiskEvaluationResult.fromJson(Map<String, dynamic> json) {
    return RiskEvaluationResult(
      riskScore: json['risk_score'] ?? 0,
      level: json['level'] ?? 'SAFE',
      decision: json['decision'] ?? 'ACCEPT',
      reasons: List<String>.from(json['reasons'] ?? ['Normal parameters']),
      transactionId: json['transaction_id'] ?? '',
      isNewUser: json['is_new_user'] ?? true,
      amountDeviation: (json['amount_deviation'] ?? 0.0).toDouble(),
    );
  }
}
