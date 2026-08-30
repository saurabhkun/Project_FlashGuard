import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme/sealed_ledger_theme.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: SealedLedgerColors.inkNavy,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const FlashGuardApp());
}

class FlashGuardApp extends StatelessWidget {
  const FlashGuardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FlashGuard Pro - Sealed Ledger',
      debugShowCheckedModeBanner: false,
      theme: SealedLedgerTheme.themeData(),
      home: const HomeScreen(),
    );
  }
}
