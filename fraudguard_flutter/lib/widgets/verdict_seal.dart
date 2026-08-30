import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme/sealed_ledger_theme.dart';

enum VerdictType { safe, review, blocked }

class VerdictSeal extends StatefulWidget {
  final VerdictType verdict;
  final double size;
  final bool animateOnEntry;
  final String? customText;

  const VerdictSeal({
    super.key,
    required this.verdict,
    this.size = 36.0,
    this.animateOnEntry = false,
    this.customText,
  });

  factory VerdictSeal.fromStatus(String status, {double size = 36.0, bool animate = false}) {
    final s = status.toUpperCase();
    if (s.contains('SAFE') || s.contains('ACCEPT')) {
      return VerdictSeal(verdict: VerdictType.safe, size: size, animateOnEntry: animate);
    } else if (s.contains('SUSPICIOUS') || s.contains('REVIEW')) {
      return VerdictSeal(verdict: VerdictType.review, size: size, animateOnEntry: animate);
    } else {
      return VerdictSeal(verdict: VerdictType.blocked, size: size, animateOnEntry: animate);
    }
  }

  @override
  State<VerdictSeal> createState() => _VerdictSealState();
}

class _VerdictSealState extends State<VerdictSeal> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  late Animation<double> _rotationAnim;
  late Animation<double> _opacityAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 280),
    );

    _scaleAnim = Tween<double>(begin: 1.35, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );

    _rotationAnim = Tween<double>(begin: -0.06, end: 0.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutQuad),
    );

    _opacityAnim = TweenSequence<double>([
      TweenSequenceItem(tween: Tween<double>(begin: 0.2, end: 1.0), weight: 40),
      TweenSequenceItem(tween: Tween<double>(begin: 1.0, end: 0.85), weight: 30),
      TweenSequenceItem(tween: Tween<double>(begin: 0.85, end: 1.0), weight: 30),
    ]).animate(_controller);

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

  Color get _sealColor {
    switch (widget.verdict) {
      case VerdictType.safe:
        return SealedLedgerColors.mossGreen;
      case VerdictType.review:
        return SealedLedgerColors.amberOchre;
      case VerdictType.blocked:
        return SealedLedgerColors.brickRed;
    }
  }

  String get _text {
    if (widget.customText != null) return widget.customText!;
    switch (widget.verdict) {
      case VerdictType.safe:
        return 'VERIFIED SAFE';
      case VerdictType.review:
        return 'UNDER REVIEW';
      case VerdictType.blocked:
        return 'BLOCKED';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Verdict Seal: $_text',
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: widget.animateOnEntry ? _scaleAnim.value : 1.0,
            child: Transform.rotate(
              angle: widget.animateOnEntry ? _rotationAnim.value : 0.0,
              child: Opacity(
                opacity: widget.animateOnEntry ? _opacityAnim.value : 1.0,
                child: SizedBox(
                  width: widget.size,
                  height: widget.size,
                  child: CustomPaint(
                    painter: _RubberStampPainter(
                      color: _sealColor,
                      text: _text,
                      isCompact: widget.size < 60,
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _RubberStampPainter extends CustomPainter {
  final Color color;
  final String text;
  final bool isCompact;

  _RubberStampPainter({required this.color, required this.text, required this.isCompact});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = math.min(size.width, size.height) / 2 - 1.5;

    final outerPaint = Paint()
      ..color = color.withValues(alpha: 0.88)
      ..style = PaintingStyle.stroke
      ..strokeWidth = isCompact ? 1.5 : 2.5;

    final innerPaint = Paint()
      ..color = color.withValues(alpha: 0.65)
      ..style = PaintingStyle.stroke
      ..strokeWidth = isCompact ? 0.8 : 1.2;

    // Draw slightly irregular double circular stamp border
    canvas.drawCircle(center, radius, outerPaint);
    canvas.drawCircle(center, radius * 0.84, innerPaint);

    // Draw small notches / ink imperfections
    final notchPaint = Paint()
      ..color = color.withValues(alpha: 0.40)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      0.4,
      0.3,
      false,
      notchPaint,
    );
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius * 0.84),
      2.1,
      0.4,
      false,
      notchPaint,
    );

    // Draw Stamp Text inside Seal
    if (isCompact) {
      // Small icon / initials representation for 32-36px rows
      final textStyle = SealedLedgerTheme.plexMono(
        fontSize: size.width * 0.24,
        fontWeight: FontWeight.bold,
        color: color,
      );
      final shortText = text.startsWith('VERIFIED')
          ? 'OK'
          : (text.startsWith('UNDER') ? 'REV' : 'BLK');
      final textSpan = TextSpan(text: shortText, style: textStyle);
      final textPainter = TextPainter(
        text: textSpan,
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(center.dx - textPainter.width / 2, center.dy - textPainter.height / 2),
      );
    } else {
      // Full stamp text in small caps for detail views
      final textStyle = SealedLedgerTheme.plexMono(
        fontSize: size.width * 0.12,
        fontWeight: FontWeight.w700,
        color: color,
      );
      final textSpan = TextSpan(text: text.toUpperCase(), style: textStyle);
      final textPainter = TextPainter(
        text: textSpan,
        textAlign: TextAlign.center,
        textDirection: TextDirection.ltr,
      );
      textPainter.layout(maxWidth: radius * 1.5);
      textPainter.paint(
        canvas,
        Offset(center.dx - textPainter.width / 2, center.dy - textPainter.height / 2),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _RubberStampPainter oldDelegate) {
    return oldDelegate.color != color || oldDelegate.text != text || oldDelegate.isCompact != isCompact;
  }
}
