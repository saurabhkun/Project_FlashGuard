import 'package:flutter/material.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';
import '../services/api_service.dart';
import '../widgets/flashguard_logo.dart';
import 'demo_login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  late Animation<double> _fadeAnim;

  String _statusMessage = 'Initializing Payment Security…';
  bool _isHealthy = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _scaleAnim = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
    );
    _fadeAnim = CurvedAnimation(parent: _controller, curve: Curves.easeIn);

    _startSequence();
  }

  Future<void> _startSequence() async {
    _controller.forward();
    await Future.delayed(const Duration(milliseconds: 400));

    final health = await ApiService.checkHealth();
    if (mounted) {
      setState(() {
        _isHealthy = health.isOnline;
        _statusMessage = health.isOnline
            ? '✓ FlashGuard AI Active  •  ${health.modelVersion}'
            : '⚠ Offline Mode — Local Heuristic Protection Active';
      });
    }

    await Future.delayed(const Duration(milliseconds: 1000));

    if (mounted) {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (_, __, ___) => const DemoLoginScreen(),
          transitionsBuilder: (_, animation, __, child) =>
              FadeTransition(opacity: animation, child: child),
          transitionDuration: const Duration(milliseconds: 400),
        ),
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AntivirusColors.warmBeige,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedBuilder(
                animation: _controller,
                builder: (_, __) => ScaleTransition(
                  scale: _scaleAnim,
                  child: FadeTransition(
                    opacity: _fadeAnim,
                    child: const FlashGuardLogo(size: 96, showWordmark: false),
                  ),
                ),
              ),

              const SizedBox(height: 28),

              Text(
                AppLanguage.t('appName'),
                style: AntivirusTheme.header(
                  fontSize: 34,
                  fontWeight: FontWeight.w700,
                  color: AntivirusColors.inkText,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                AppLanguage.t('tagline'),
                style: AntivirusTheme.body(
                  fontSize: 16,
                  color: AntivirusColors.forestGreen,
                ),
              ),

              const SizedBox(height: 60),

              SizedBox(
                width: 180,
                child: LinearProgressIndicator(
                  backgroundColor: AntivirusColors.borderSubtle,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    _isHealthy ? AntivirusColors.forestGreen : AntivirusColors.amberOchre,
                  ),
                  minHeight: 3,
                ),
              ),
              const SizedBox(height: 14),

              Text(
                _statusMessage,
                style: AntivirusTheme.body(
                  fontSize: 14,
                  color: _isHealthy ? AntivirusColors.forestGreen : AntivirusColors.amberOchre,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 80),

              Text(
                'Bank of India  •  IIT Hyderabad',
                style: AntivirusTheme.body(
                  fontSize: 13,
                  color: AntivirusColors.textMuted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
