import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme/antivirus_theme.dart';
import 'services/localization_service.dart';
import 'screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: AntivirusColors.warmBeige,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const FlashGuardApp());
}

class FlashGuardApp extends StatelessWidget {
  const FlashGuardApp({super.key});

  @override
  Widget build(BuildContext context) {
    final lang = AppLanguage();

    return AnimatedBuilder(
      animation: lang,
      builder: (context, _) {
        return MaterialApp(
          title: 'FlashGuard — Antivirus for Payments',
          debugShowCheckedModeBanner: false,
          theme: AntivirusTheme.themeData(),
          home: const SplashScreen(),
        );
      },
    );
  }
}
