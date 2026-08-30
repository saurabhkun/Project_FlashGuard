import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SealedLedgerColors {
  // Base background
  static const Color inkNavy = Color(0xFF12213B);
  
  // Elevated surface / cards
  static const Color ledgerParchment = Color(0xFFEFE9DA);
  
  // Primary text on navy
  static const Color warmOffWhite = Color(0xFFEDEAE0);
  
  // Primary text on parchment
  static const Color inkNavyText = Color(0xFF12213B);
  
  // Brand / seal accent
  static const Color brassGold = Color(0xFFB8934A);
  
  // Verdicts
  static const Color mossGreen = Color(0xFF3F7A56);
  static const Color amberOchre = Color(0xFFC98A2C);
  static const Color brickRed = Color(0xFFA23B34);
  
  // Dividers & borders
  static Color brassDivider = const Color(0xFFB8934A).withValues(alpha: 0.20);
  static Color parchmentMuted = const Color(0xFF12213B).withValues(alpha: 0.65);
}

class SealedLedgerTheme {
  static TextStyle frauncesHeader({double fontSize = 20, FontWeight fontWeight = FontWeight.w600, Color color = SealedLedgerColors.warmOffWhite}) {
    return GoogleFonts.fraunces(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
    );
  }

  static TextStyle plexSans({double fontSize = 14, FontWeight fontWeight = FontWeight.w400, Color color = SealedLedgerColors.warmOffWhite}) {
    return GoogleFonts.ibmPlexSans(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
    );
  }

  static TextStyle plexMono({double fontSize = 13, FontWeight fontWeight = FontWeight.w500, Color color = SealedLedgerColors.warmOffWhite}) {
    return GoogleFonts.ibmPlexMono(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
    );
  }

  static ThemeData themeData() {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: SealedLedgerColors.inkNavy,
      primaryColor: SealedLedgerColors.brassGold,
      colorScheme: const ColorScheme.dark(
        primary: SealedLedgerColors.brassGold,
        surface: SealedLedgerColors.ledgerParchment,
        error: SealedLedgerColors.brickRed,
      ),
      textTheme: GoogleFonts.ibmPlexSansTextTheme(ThemeData.dark().textTheme),
      useMaterial3: true,
    );
  }
}
