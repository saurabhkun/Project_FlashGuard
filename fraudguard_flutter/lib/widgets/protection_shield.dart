import 'package:flutter/material.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';

enum ProtectionVerdict { safe, review, quarantined }

class ProtectionShield extends StatefulWidget {
  final ProtectionVerdict verdict;
  final double size;
  final bool animateOnEntry;
  final bool showLabel;

  const ProtectionShield({
    super.key,
    required this.verdict,
    this.size = 32.0,
    this.animateOnEntry = false,
    this.showLabel = false,
  });

  factory ProtectionShield.fromStatus(String status, {double size = 32.0, bool animate = false, bool showLabel = false}) {
    final s = status.toUpperCase();
    if (s.contains('SAFE') || s.contains('ACCEPT') || s.contains('CLEAN')) {
      return ProtectionShield(verdict: ProtectionVerdict.safe, size: size, animateOnEntry: animate, showLabel: showLabel);
    } else if (s.contains('SUSPICIOUS') || s.contains('REVIEW')) {
      return ProtectionShield(verdict: ProtectionVerdict.review, size: size, animateOnEntry: animate, showLabel: showLabel);
    } else {
      return ProtectionShield(verdict: ProtectionVerdict.quarantined, size: size, animateOnEntry: animate, showLabel: showLabel);
    }
  }

  @override
  State<ProtectionShield> createState() => _ProtectionShieldState();
}

class _ProtectionShieldState extends State<ProtectionShield>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _scaleAnim = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    if (widget.animateOnEntry) {
      _controller.forward();
    } else {
      _controller.value = 1.0;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Color get _color {
    switch (widget.verdict) {
      case ProtectionVerdict.safe:
        return AntivirusColors.forestGreen;
      case ProtectionVerdict.review:
        return AntivirusColors.amberOchre;
      case ProtectionVerdict.quarantined:
        return AntivirusColors.deepCrimson;
    }
  }

  IconData get _icon {
    switch (widget.verdict) {
      case ProtectionVerdict.safe:
        return Icons.check;
      case ProtectionVerdict.review:
        return Icons.priority_high;
      case ProtectionVerdict.quarantined:
        return Icons.close;
    }
  }

  String get _labelKey {
    switch (widget.verdict) {
      case ProtectionVerdict.safe:
        return 'safeTitle';
      case ProtectionVerdict.review:
        return 'reviewTitle';
      case ProtectionVerdict.quarantined:
        return 'quarantinedTitle';
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = widget.size;

    final shieldWidget = AnimatedBuilder(
      animation: _controller,
      builder: (_, __) => Transform.scale(
        scale: widget.animateOnEntry ? _scaleAnim.value : 1.0,
        child: Container(
          width: s,
          height: s * 1.15,
          decoration: BoxDecoration(
            color: _color,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(s * 0.25),
              topRight: Radius.circular(s * 0.25),
              bottomLeft: Radius.circular(s * 0.5),
              bottomRight: Radius.circular(s * 0.5),
            ),
          ),
          child: Center(
            child: Icon(
              _icon,
              size: s * 0.55,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );

    if (!widget.showLabel) {
      return shieldWidget;
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        shieldWidget,
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: _color.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: _color.withValues(alpha: 0.4), width: 1),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(_icon, size: 14, color: _color),
              const SizedBox(width: 4),
              Text(
                AppLanguage.t(_labelKey),
                style: AntivirusTheme.body(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: _color,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
