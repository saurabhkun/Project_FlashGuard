import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';
import '../models/transaction_model.dart';
import '../widgets/protection_shield.dart';
import '../widgets/scan_pipeline_widget.dart';
import 'home_screen.dart';

class ResultScreen extends StatefulWidget {
  final RiskEvaluationResult result;
  final double amount;
  final String recipient;

  const ResultScreen({
    super.key,
    required this.result,
    required this.amount,
    required this.recipient,
  });

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  @override
  void initState() {
    super.initState();
    // Haptic feedback based on verdict
    switch (widget.result.decision) {
      case 'BLOCK':
        HapticFeedback.vibrate();
        break;
      case 'REVIEW':
        HapticFeedback.mediumImpact();
        break;
      default:
        HapticFeedback.lightImpact();
    }
  }

  Color get _color {
    switch (widget.result.level) {
      case 'FRAUD':
        return AntivirusColors.deepCrimson;
      case 'SUSPICIOUS':
        return AntivirusColors.amberOchre;
      default:
        return AntivirusColors.forestGreen;
    }
  }

  String get _titleKey {
    switch (widget.result.decision) {
      case 'BLOCK':
        return 'verdictBlock';
      case 'REVIEW':
        return 'verdictReview';
      default:
        return 'verdictSafe';
    }
  }

  String get _subKey {
    switch (widget.result.decision) {
      case 'BLOCK':
        return 'blockSub';
      case 'REVIEW':
        return 'reviewSub';
      default:
        return 'safeSub';
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = AppLanguage();

    return AnimatedBuilder(
      animation: lang,
      builder: (_, __) {
        return Scaffold(
          backgroundColor: AntivirusColors.warmBeige,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const SizedBox(height: 16),

                  // Solid Protection Shield with pulse animation
                  ProtectionShield.fromStatus(
                    widget.result.level,
                    size: 110,
                    animate: true,
                    showLabel: true,
                  ),

                  const SizedBox(height: 20),

                  // Verdict Headline
                  Text(
                    AppLanguage.t(_titleKey),
                    style: AntivirusTheme.header(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: _color,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 8),

                  Text(
                    AppLanguage.t(_subKey),
                    style: AntivirusTheme.body(
                      fontSize: 16,
                      color: AntivirusColors.inkText,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 24),

                  // Amount Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AntivirusColors.softIvory,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: _color, width: 2),
                    ),
                    child: Column(
                      children: [
                        Text(
                          '₹${widget.amount.toStringAsFixed(0)}',
                          style: AntivirusTheme.amount(
                            fontSize: 32,
                            fontWeight: FontWeight.w700,
                            color: _color,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'To: ${widget.recipient}',
                          style: AntivirusTheme.body(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AntivirusColors.inkText,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Threat Level Bar
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: AntivirusColors.softIvory,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AntivirusColors.borderSubtle),
                    ),
                    child: ThreatLevelBar(score: widget.result.riskScore),
                  ),

                  const SizedBox(height: 16),

                  // Security Findings / Reasons
                  if (widget.result.reasons.isNotEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: AntivirusColors.softIvory,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AntivirusColors.borderSubtle),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Security Scan Findings',
                            style: AntivirusTheme.body(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: _color,
                            ),
                          ),
                          const SizedBox(height: 10),
                          ...widget.result.reasons.map(
                            (r) => Padding(
                              padding: const EdgeInsets.only(bottom: 6),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Icon(Icons.shield_outlined, size: 18, color: _color),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      r,
                                      style: AntivirusTheme.body(
                                        fontSize: 15,
                                        color: AntivirusColors.inkText,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                  const SizedBox(height: 28),

                  // Action Buttons
                  _buildActionButtons(context),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    if (widget.result.decision == 'BLOCK') {
      return SizedBox(
        width: double.infinity,
        height: 54,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: AntivirusColors.deepCrimson,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 0,
          ),
          onPressed: () => Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const HomeScreen()),
            (r) => false,
          ),
          child: Text(
            AppLanguage.t('returnHome'),
            style: AntivirusTheme.body(
              fontSize: 17,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ),
      );
    }

    if (widget.result.decision == 'REVIEW') {
      return Column(
        children: [
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AntivirusColors.amberOchre,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              onPressed: () => Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const HomeScreen()),
                (r) => false,
              ),
              child: Text(
                AppLanguage.t('continueBtn'),
                style: AntivirusTheme.body(
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AntivirusColors.deepCrimson, width: 1.5),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () => Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const HomeScreen()),
                (r) => false,
              ),
              child: Text(
                AppLanguage.t('cancelBtn'),
                style: AntivirusTheme.body(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AntivirusColors.deepCrimson,
                ),
              ),
            ),
          ),
        ],
      );
    }

    // SAFE
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: AntivirusColors.forestGreen,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          elevation: 0,
        ),
        onPressed: () => Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const HomeScreen()),
          (r) => false,
        ),
        child: Text(
          '✓ ${AppLanguage.t('continueBtn')}',
          style: AntivirusTheme.body(
            fontSize: 17,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
