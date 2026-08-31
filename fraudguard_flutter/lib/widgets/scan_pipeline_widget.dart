import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';

/// AntivirusScanWidget — animated multi-stage Payment Antivirus scan visualization
class AntivirusScanWidget extends StatefulWidget {
  final VoidCallback? onComplete;

  const AntivirusScanWidget({super.key, this.onComplete});

  @override
  State<AntivirusScanWidget> createState() => _AntivirusScanWidgetState();
}

class _AntivirusScanWidgetState extends State<AntivirusScanWidget>
    with SingleTickerProviderStateMixin {
  int _currentStage = 0;
  late AnimationController _pulseController;

  static const List<Map<String, dynamic>> _stages = [
    {'label': 'Payment details received', 'icon': Icons.receipt_long},
    {'label': 'Amount deviation checked', 'icon': Icons.currency_rupee},
    {'label': 'Behavioral pattern analyzed', 'icon': Icons.psychology},
    {'label': 'Payment frequency & velocity verified', 'icon': Icons.speed},
    {'label': 'Location risk evaluated', 'icon': Icons.location_on},
    {'label': 'Recipient risk & registry checked', 'icon': Icons.person_search},
    {'label': 'FlashGuard AI Security evaluated', 'icon': Icons.security},
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..repeat(reverse: true);
    _runStages();
  }

  Future<void> _runStages() async {
    for (int i = 0; i < _stages.length; i++) {
      await Future.delayed(const Duration(milliseconds: 380));
      if (mounted) setState(() => _currentStage = i);
      HapticFeedback.selectionClick();
    }
    await Future.delayed(const Duration(milliseconds: 400));
    widget.onComplete?.call();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AntivirusColors.softIvory,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AntivirusColors.borderSubtle, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AnimatedBuilder(
                animation: _pulseController,
                builder: (_, __) => Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: AntivirusColors.forestGreen
                        .withValues(alpha: 0.4 + _pulseController.value * 0.6),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Text(
                AppLanguage.t('scanning'),
                style: AntivirusTheme.header(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AntivirusColors.forestGreen,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ..._stages.asMap().entries.map((entry) {
            final idx = entry.key;
            final stage = entry.value;
            final isDone = idx < _currentStage;
            final isActive = idx == _currentStage;

            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Row(
                children: [
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isDone
                          ? AntivirusColors.forestGreen
                          : isActive
                              ? AntivirusColors.amberOchre
                              : AntivirusColors.borderSubtle,
                    ),
                    child: Icon(
                      isDone ? Icons.check : (stage['icon'] as IconData),
                      size: 14,
                      color: isDone || isActive ? Colors.white : AntivirusColors.inkText,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      stage['label'] as String,
                      style: AntivirusTheme.body(
                        fontSize: 15,
                        color: isDone
                            ? AntivirusColors.forestGreen
                            : isActive
                                ? AntivirusColors.inkText
                                : AntivirusColors.textMuted,
                        fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

/// ThreatLevelBar — plain language 0-100 Threat Level display
class ThreatLevelBar extends StatelessWidget {
  final int score;
  final double height;

  const ThreatLevelBar({super.key, required this.score, this.height = 14});

  Color get _color {
    if (score <= 40) return AntivirusColors.forestGreen;
    if (score <= 70) return AntivirusColors.amberOchre;
    return AntivirusColors.deepCrimson;
  }

  String get _labelKey {
    if (score <= 40) return 'threatLow';
    if (score <= 70) return 'threatMed';
    return 'threatHigh';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const Icon(Icons.shield, size: 18, color: AntivirusColors.inkText),
                const SizedBox(width: 6),
                Text(
                  AppLanguage.t('threatLevel'),
                  style: AntivirusTheme.body(fontSize: 15, fontWeight: FontWeight.w600),
                ),
              ],
            ),
            Text(
              '$score / 100 — ${AppLanguage.t(_labelKey)}',
              style: AntivirusTheme.amount(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: _color,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          height: height,
          decoration: BoxDecoration(
            color: AntivirusColors.borderSubtle,
            borderRadius: BorderRadius.circular(7),
          ),
          child: FractionallySizedBox(
            widthFactor: (score / 100).clamp(0.05, 1.0),
            alignment: Alignment.centerLeft,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(7),
                color: _color,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
