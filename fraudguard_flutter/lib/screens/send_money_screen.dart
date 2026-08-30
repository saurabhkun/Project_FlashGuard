import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../models/transaction_model.dart';
import '../services/api_service.dart';
import '../services/biometric_service.dart';

class SendMoneyScreen extends StatefulWidget {
  final String? initialRecipient;

  const SendMoneyScreen({super.key, this.initialRecipient});

  @override
  State<SendMoneyScreen> createState() => _SendMoneyScreenState();
}

class _SendMoneyScreenState extends State<SendMoneyScreen> {
  final TextEditingController _recipientController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  String _txnType = 'TRANSFER';
  bool _loading = false;
  RiskEvaluationResult? _riskResult;

  @override
  void initState() {
    super.initState();
    if (widget.initialRecipient != null) {
      _recipientController.text = widget.initialRecipient!;
    }
  }

  @override
  void dispose() {
    _recipientController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _handleVerifyAndPay() async {
    final String recipient = _recipientController.text.trim();
    final double? amount = double.tryParse(_amountController.text.trim());

    if (recipient.isEmpty || amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid recipient and amount')),
      );
      return;
    }

    setState(() {
      _loading = true;
      _riskResult = null;
    });

    // 1. Send transaction payload + hardware telemetry to FraudGuard FastAPI Backend Engine
    final evalResult = await ApiService.evaluateTransaction(
      amount: amount,
      recipient: recipient,
      type: _txnType,
      oldBalanceOrg: 50000.0,
    );

    setState(() {
      _loading = false;
      _riskResult = evalResult;
    });

    // 2. Evaluate FraudGuard Decision Boundaries
    if (evalResult.decision == 'BLOCK' || evalResult.level == 'FRAUD') {
      _showBlockedDialog(evalResult);
      return;
    }

    // 3. Check if Step-up Biometric Authentication (Fingerprint / Face ID) is Required
    bool requireBiometrics = (evalResult.decision == 'REVIEW' || evalResult.riskScore > 25 || amount >= 25000);

    if (requireBiometrics) {
      _showBiometricStepUpDialog(evalResult, amount, recipient);
    } else {
      _showSuccessDialog(evalResult, amount, recipient, 'Auto Approved (Low Risk)');
    }
  }

  void _showBiometricStepUpDialog(RiskEvaluationResult res, double amount, String recipient) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: Color(0xFFEAB308))),
        title: Row(
          children: [
            const Icon(Icons.security_rounded, color: Color(0xFFEAB308), size: 28),
            const SizedBox(width: 10),
            Text('Biometric Verification', style: GoogleFonts.inter(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'FraudGuard Risk Score: ${res.riskScore}/100 (${res.level})',
              style: GoogleFonts.inter(color: const Color(0xFFEAB308), fontSize: 14, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text(
              'Please authenticate using your Phone Fingerprint or Face ID to approve this transfer of ?${amount.toStringAsFixed(0)} to $recipient.',
              style: GoogleFonts.inter(color: const Color(0xFFCBD5E1), fontSize: 13),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: GoogleFonts.inter(color: const Color(0xFF94A3B8))),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF00F2FE),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            icon: const Icon(Icons.fingerprint, color: Color(0xFF0B0F19)),
            label: Text('Scan Fingerprint', style: GoogleFonts.inter(color: const Color(0xFF0B0F19), fontWeight: FontWeight.bold)),
            onPressed: () async {
              Navigator.pop(ctx);
              final bioResult = await BiometricService.promptBiometricAuth(
                reason: 'Authorize ?${amount.toStringAsFixed(0)} transfer to $recipient',
              );

              if (bioResult['success'] == true) {
                _showSuccessDialog(res, amount, recipient, bioResult['method'] ?? 'Fingerprint');
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: const Color(0xFFEF4444),
                    content: Text(bioResult['error'] ?? 'Biometric verification failed.'),
                  ),
                );
              }
            },
          ),
        ],
      ),
    );
  }

  void _showBlockedDialog(RiskEvaluationResult res) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: Color(0xFFEF4444))),
        title: Row(
          children: [
            const Icon(Icons.block_rounded, color: Color(0xFFEF4444), size: 28),
            const SizedBox(width: 10),
            Text('Transaction Blocked', style: GoogleFonts.inter(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'FraudGuard AI Score: ${res.riskScore}/100 (HIGH RISK)',
              style: GoogleFonts.inter(color: const Color(0xFFEF4444), fontSize: 14, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text('Reasons for Real-Time Block:', style: GoogleFonts.inter(color: const Color(0xFFCBD5E1), fontSize: 12, fontWeight: FontWeight.w600)),
            const SizedBox(height: 6),
            ...res.reasons.map((r) => Text('• $r', style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 12))),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444)),
            onPressed: () => Navigator.pop(ctx),
            child: Text('Close', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(RiskEvaluationResult res, double amount, String recipient, String authMethod) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: Color(0xFF22C55E))),
        title: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Color(0xFF22C55E), size: 28),
            const SizedBox(width: 10),
            Text('Payment Approved', style: GoogleFonts.inter(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Amount: ?${amount.toStringAsFixed(2)}', style: GoogleFonts.inter(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
            Text('Recipient: $recipient', style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 13)),
            const SizedBox(height: 10),
            Text('Security Check: $authMethod', style: GoogleFonts.inter(color: const Color(0xFF00F2FE), fontSize: 12, fontWeight: FontWeight.w600)),
            Text('FraudGuard Risk: ${res.riskScore}/100 (${res.level})', style: GoogleFonts.inter(color: const Color(0xFF22C55E), fontSize: 12)),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF22C55E)),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pop(context);
            },
            child: Text('Done', style: GoogleFonts.inter(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B0F19),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('Send Money', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Card Input
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Recipient Name / UPI ID', style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 13, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _recipientController,
                    style: GoogleFonts.inter(color: Colors.white, fontSize: 15),
                    decoration: InputDecoration(
                      hintText: 'e.g. rahul@upi or STORE_ELECTRONICS',
                      hintStyle: GoogleFonts.inter(color: const Color(0xFF64748B)),
                      filled: true,
                      fillColor: const Color(0xFF0F172A),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF334155))),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    ),
                  ),

                  const SizedBox(height: 16),

                  Text('Amount (?)', style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 13, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _amountController,
                    keyboardType: TextInputType.number,
                    style: GoogleFonts.inter(color: const Color(0xFF00F2FE), fontSize: 24, fontWeight: FontWeight.bold),
                    decoration: InputDecoration(
                      hintText: '0.00',
                      hintStyle: GoogleFonts.inter(color: const Color(0xFF64748B)),
                      filled: true,
                      fillColor: const Color(0xFF0F172A),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF334155))),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Quick Amounts Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: ['500', '1000', '5000', '50000', '100000'].map((amt) {
                      return InkWell(
                        onTap: () => setState(() => _amountController.text = amt),
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF334155),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text('+?$amt', style: GoogleFonts.inter(color: const Color(0xFFCBD5E1), fontSize: 11, fontWeight: FontWeight.w600)),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Live Risk Card Preview if evaluated
            if (_riskResult != null)
              Container(
                margin: const EdgeInsets.only(bottom: 20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _riskResult!.level == 'SAFE'
                        ? const Color(0xFF22C55E)
                        : (_riskResult!.level == 'SUSPICIOUS' ? const Color(0xFFEAB308) : const Color(0xFFEF4444)),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _riskResult!.level == 'SAFE' ? Icons.shield_outlined : Icons.warning_amber_rounded,
                          color: _riskResult!.level == 'SAFE'
                              ? const Color(0xFF22C55E)
                              : (_riskResult!.level == 'SUSPICIOUS' ? const Color(0xFFEAB308) : const Color(0xFFEF4444)),
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text('FraudGuard AI Evaluation', style: GoogleFonts.inter(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Score: ${_riskResult!.riskScore}/100 | Status: ${_riskResult!.level} (${_riskResult!.decision})',
                      style: GoogleFonts.inter(color: const Color(0xFFCBD5E1), fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 6),
                    ..._riskResult!.reasons.map((r) => Text('• $r', style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 12))),
                  ],
                ),
              ),

            // Action Pay Button
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00F2FE),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: _loading ? null : _handleVerifyAndPay,
                child: _loading
                    ? const CircularProgressIndicator(color: Colors.black)
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.fingerprint, color: Color(0xFF0B0F19), size: 22),
                          const SizedBox(width: 8),
                          Text('Analyze & Pay Safely', style: GoogleFonts.inter(color: const Color(0xFF0B0F19), fontSize: 16, fontWeight: FontWeight.bold)),
                        ],
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
