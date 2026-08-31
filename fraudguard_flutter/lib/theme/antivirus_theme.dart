import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AntivirusColors {
  // Base background (warm beige)
  static const Color warmBeige = Color(0xFFEDE6D6);

  // Card / surface fill (soft ivory)
  static const Color softIvory = Color(0xFFF7F3EA);

  // Primary text on light background
  static const Color inkText = Color(0xFF2B2620);

  // Protection / trust / primary accent (Protected color)
  static const Color forestGreen = Color(0xFF2F5233);

  // Review / suspicious accent
  static const Color amberOchre = Color(0xFFC68A2E);

  // Blocked / quarantined accent (Deep crimson)
  static const Color deepCrimson = Color(0xFF8C2F2F);

  // Muted text & dividers
  static Color textMuted = const Color(0xFF2B2620).withValues(alpha: 0.60);
  static Color borderSubtle = const Color(0xFF2B2620).withValues(alpha: 0.15);
}

class AntivirusTheme {
  // Header text using Mukta (Font weight 600)
  static TextStyle header({
    double fontSize = 22,
    FontWeight fontWeight = FontWeight.w600,
    Color color = AntivirusColors.inkText,
  }) {
    return GoogleFonts.mukta(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: 1.2,
    );
  }

  // Body text using Mukta (Font weight 400, min 16sp for readability)
  static TextStyle body({
    double fontSize = 16,
    FontWeight fontWeight = FontWeight.w400,
    Color color = AntivirusColors.inkText,
  }) {
    return GoogleFonts.mukta(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: 1.35,
    );
  }

  // Numbers & Amounts using IBM Plex Mono (min 20sp for amounts)
  static TextStyle amount({
    double fontSize = 22,
    FontWeight fontWeight = FontWeight.w700,
    Color color = AntivirusColors.inkText,
  }) {
    return GoogleFonts.ibmPlexMono(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
    );
  }

  static ThemeData themeData() {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: AntivirusColors.warmBeige,
      primaryColor: AntivirusColors.forestGreen,
      colorScheme: const ColorScheme.light(
        primary: AntivirusColors.forestGreen,
        surface: AntivirusColors.softIvory,
        error: AntivirusColors.deepCrimson,
        onPrimary: Colors.white,
        onSurface: AntivirusColors.inkText,
      ),
      textTheme: GoogleFonts.muktaTextTheme(ThemeData.light().textTheme),
      useMaterial3: true,
    );
  }
}
