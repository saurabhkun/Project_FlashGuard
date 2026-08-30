import 'package:flutter/material.dart';
import '../models/transaction_model.dart';
import '../services/api_service.dart';
import '../services/biometric_service.dart';
import '../theme/sealed_ledger_theme.dart';
import '../widgets/verdict_seal.dart';

class SendMoneyScreen extends StatefulWidget {
  final String? initialRecipient;

  const SendMoneyScreen({super.key, this.initialRecipient});

  @override
  State<SendMoneyScreen> createState() => _SendMoneyScreenState();
}

class _SendMoneyScreenState extends State<SendMoneyScreen> with SingleTickerProviderStateMixin {
  final TextEditingController _recipientController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  final String _txnType = 'TRANSFER';
  bool _certifying = false;
  RiskEvaluationResult? _riskResult;

  late AnimationController _progressController;
  late Animation<double> _progressAnim;

  @override
  void initState() {
    super.initState();
    if (widget.initialRecipient != null) {
      _recipientController.text = widget.initialRecipient!;
    }

    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _progressAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _progressController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _recipientController.dispose();
    _amountController.dispose();
    _progressController.dispose();
    super.dispose();
  }

  Future<void> _handleCertifyAndSubmit() async {
    final String recipient = _recipientController.text.trim();
    final double? amount = double.tryParse(_amountController.text.trim());

    if (recipient.isEmpty || amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: SealedLedgerColors.brickRed,
          content: Text(
            'Invalid Entry: Please enter a valid recipient UPI handle and amount',
            style: SealedLedgerTheme.plexMono(fontSize: 12, color: Colors.white),
          ),
        ),
      );
      return;
    }

    setState(() {
      _certifying = true;
      _riskResult = null;
    });

    _progressController.reset();
    _progressController.forward();

    // 1. Send transaction payload to FraudGuard Backend
    final evalResult = await ApiService.evaluateTransaction(
      amount: amount,
      recipient: recipient,
      type: _txnType,
      oldBalanceOrg: 84500.0,
    );

    if (mounted) {
      setState(() {
        _certifying = false;
        _riskResult = evalResult;
      });

      // 2. Evaluate Verdict
      if (evalResult.decision == 'BLOCK' || evalResult.level == 'FRAUD') {
        _showVerdictDialog(evalResult, amount, recipient, isBlocked: true);
      } else {
        // Check if biometric verification is needed
        bool requireBiometrics = (evalResult.decision == 'REVIEW' || evalResult.riskScore > 25 || amount >= 25000);
        if (requireBiometrics) {
          _showBiometricStepUpDialog(evalResult, amount, recipient);
        } else {
          _showVerdictDialog(evalResult, amount, recipient, isBlocked: false);
        }
      }
    }
  }

  void _showBiometricStepUpDialog(RiskEvaluationResult res, double amount, String recipient) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: SealedLedgerColors.ledgerParchment,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
          side: const BorderSide(color: SealedLedgerColors.brassGold, width: 1.5),
        ),
        title: Row(
          children: [
            const Icon(Icons.fingerprint, color: SealedLedgerColors.amberOchre, size: 24),
            const SizedBox(width: 10),
            Text(
              'BIOMETRIC STEP-UP REQUIRED',
              style: SealedLedgerTheme.plexMono(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: SealedLedgerColors.inkNavyText,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Risk Score ${res.riskScore}/100 requires user biometric confirmation.',
              style: SealedLedgerTheme.plexSans(fontSize: 13, color: SealedLedgerColors.inkNavyText),
            ),
            const SizedBox(height: 12),
            Text(
              'REASONS: ${res.reasons.join(", ")}',
              style: SealedLedgerTheme.plexMono(fontSize: 11, color: SealedLedgerColors.amberOchre),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('CANCEL', style: SealedLedgerTheme.plexMono(color: SealedLedgerColors.brickRed)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: SealedLedgerColors.inkNavy,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              final authSuccess = await BiometricService.authenticate(
                reason: 'Confirm transaction of Rs. $amount to $recipient',
              );
              if (mounted) {
                if (authSuccess) {
                  _showVerdictDialog(res, amount, recipient, isBlocked: false);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      backgroundColor: SealedLedgerColors.brickRed,
                      content: Text('Biometric Authentication Failed', style: SealedLedgerTheme.plexMono(color: Colors.white)),
                    ),
                  );
                }
              }
            },
            child: Text('AUTHENTICATE', style: SealedLedgerTheme.plexMono(color: SealedLedgerColors.warmOffWhite)),
          ),
        ],
      ),
    );
  }

  void _showVerdictDialog(RiskEvaluationResult res, double amount, String recipient, {required bool isBlocked}) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: SealedLedgerColors.ledgerParchment,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
          side: const BorderSide(color: SealedLedgerColors.brassGold, width: 1.5),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 10),
            // Stamp Animation
            VerdictSeal.fromStatus(res.level, size: 100.0, animate: true),
            const SizedBox(height: 16),
            Text(
              isBlocked ? 'TRANSACTION TERMINATED' : 'TRANSACTION CERTIFIED',
              style: SealedLedgerTheme.frauncesHeader(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isBlocked ? SealedLedgerColors.brickRed : SealedLedgerColors.mossGreen,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Rs. ${amount.toStringAsFixed(2)} to $recipient',
              style: SealedLedgerTheme.plexMono(fontSize: 14, fontWeight: FontWeight.bold, color: SealedLedgerColors.inkNavyText),
            ),
            const SizedBox(height: 12),
            Text(
              'RISK SCORE: ${res.riskScore} / 100',
              style: SealedLedgerTheme.plexMono(fontSize: 12, fontWeight: FontWeight.bold, color: SealedLedgerColors.brassGold),
            ),
            const SizedBox(height: 8),
            Text(
              res.reasons.join('\n'),
              style: SealedLedgerTheme.plexMono(fontSize: 11, color: SealedLedgerColors.parchmentMuted),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: SealedLedgerColors.inkNavy,
                minimumSize: const Size(double.infinity, 44),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
              ),
              onPressed: () {
                Navigator.pop(ctx);
                Navigator.pop(context);
              },
              child: Text('CLOSE LEDGER ENTRY', style: SealedLedgerTheme.plexMono(color: SealedLedgerColors.warmOffWhite)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: SealedLedgerColors.inkNavy,
      appBar: AppBar(
        backgroundColor: SealedLedgerColors.inkNavy,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: SealedLedgerColors.warmOffWhite),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'NEW LEDGER ENTRY',
          style: SealedLedgerTheme.plexMono(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: SealedLedgerColors.brassGold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // Parchment Form Sheet
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                color: SealedLedgerColors.ledgerParchment,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: SealedLedgerColors.brassGold, width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'PAYMENT SPECIFICATION',
                    style: SealedLedgerTheme.plexMono(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: SealedLedgerColors.brassGold,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Recipient Field
                  Text('Recipient UPI Handle', style: SealedLedgerTheme.plexSans(fontSize: 12, color: SealedLedgerColors.inkNavyText)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _recipientController,
                    style: SealedLedgerTheme.plexMono(color: SealedLedgerColors.inkNavyText),
                    decoration: InputDecoration(
                      hintText: 'e.g. merchant@upi or M999_SUSPICIOUS',
                      hintStyle: SealedLedgerTheme.plexMono(fontSize: 12, color: SealedLedgerColors.parchmentMuted),
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(4), borderSide: const BorderSide(color: SealedLedgerColors.brassGold)),
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Amount Field
                  Text('Amount (INR)', style: SealedLedgerTheme.plexSans(fontSize: 12, color: SealedLedgerColors.inkNavyText)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _amountController,
                    keyboardType: TextInputType.number,
                    style: SealedLedgerTheme.plexMono(fontSize: 18, fontWeight: FontWeight.bold, color: SealedLedgerColors.inkNavyText),
                    decoration: InputDecoration(
                      prefixText: 'Rs. ',
                      prefixStyle: SealedLedgerTheme.plexMono(fontSize: 18, fontWeight: FontWeight.bold, color: SealedLedgerColors.brassGold),
                      hintText: '0.00',
                      hintStyle: SealedLedgerTheme.plexMono(fontSize: 18, color: SealedLedgerColors.parchmentMuted),
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(4), borderSide: const BorderSide(color: SealedLedgerColors.brassGold)),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Progress / Certifying State
                  if (_certifying) ...[
                    Text(
                      'CERTIFYING TRANSACTION WITH FRAUDGUARD ML...',
                      style: SealedLedgerTheme.plexMono(fontSize: 10, fontWeight: FontWeight.bold, color: SealedLedgerColors.brassGold),
                    ),
                    const SizedBox(height: 8),
                    // Thin brass line filling left-to-right
                    AnimatedBuilder(
                      animation: _progressAnim,
                      builder: (context, child) {
                        return LinearProgressIndicator(
                          value: _progressAnim.value,
                          minHeight: 3,
                          backgroundColor: SealedLedgerColors.brassGold.withValues(alpha: 0.2),
                          valueColor: const AlwaysStoppedAnimation<Color>(SealedLedgerColors.brassGold),
                        );
                      },
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Submit Action Button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: SealedLedgerColors.inkNavy,
                      minimumSize: const Size(double.infinity, 48),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                        side: const BorderSide(color: SealedLedgerColors.brassGold, width: 1.2),
                      ),
                    ),
                    onPressed: _certifying ? null : _handleCertifyAndSubmit,
                    child: Text(
                      'CERTIFY & EXECUTE PAYMENT',
                      style: SealedLedgerTheme.plexMono(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: SealedLedgerColors.warmOffWhite,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
