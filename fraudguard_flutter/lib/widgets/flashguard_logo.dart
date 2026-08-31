import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/antivirus_theme.dart';

class FlashGuardLogo extends StatelessWidget {
  final double size;
  final bool showWordmark;
  final Color shieldColor;
  final Color iconColor;

  const FlashGuardLogo({
    super.key,
    this.size = 56,
    this.showWordmark = true,
    this.shieldColor = AntivirusColors.forestGreen,
    this.iconColor = AntivirusColors.warmBeige,
  });

  @override
  Widget build(BuildContext context) {
    if (!showWordmark) {
      return _buildShieldMark(size);
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        _buildShieldMark(size),
        SizedBox(width: size * 0.25),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'FlashGuard',
              style: GoogleFonts.mukta(
                fontSize: size * 0.52,
                fontWeight: FontWeight.w700,
                color: AntivirusColors.inkText,
                height: 1.0,
              ),
            ),
            Text(
              'PAYMENT DEFENSE',
              style: GoogleFonts.ibmPlexMono(
                fontSize: size * 0.18,
                fontWeight: FontWeight.w600,
                color: AntivirusColors.forestGreen,
                letterSpacing: 1.2,
                height: 1.1,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildShieldMark(double s) {
    return Container(
      width: s,
      height: s * 1.15,
      decoration: BoxDecoration(
        color: shieldColor,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(s * 0.25),
          topRight: Radius.circular(s * 0.25),
          bottomLeft: Radius.circular(s * 0.5),
          bottomRight: Radius.circular(s * 0.5),
        ),
      ),
      child: Center(
        child: Icon(
          Icons.shield,
          size: s * 0.65,
          color: iconColor,
        ),
      ),
    );
  }
}
