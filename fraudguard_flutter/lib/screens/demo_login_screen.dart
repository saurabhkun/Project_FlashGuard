import 'package:flutter/material.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';
import '../widgets/flashguard_logo.dart';
import 'home_screen.dart';

class DemoLoginScreen extends StatefulWidget {
  const DemoLoginScreen({super.key});

  @override
  State<DemoLoginScreen> createState() => _DemoLoginScreenState();
}

class _DemoLoginScreenState extends State<DemoLoginScreen> {
  final _phoneController = TextEditingController(text: '9876543210');
  final _otpController = TextEditingController();
  bool _otpSent = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _handleSendOtp() {
    if (_phoneController.text.trim().length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AntivirusColors.deepCrimson,
          content: Text(
            'Please enter a valid 10-digit mobile number.',
            style: AntivirusTheme.body(color: Colors.white),
          ),
        ),
      );
      return;
    }
    setState(() => _otpSent = true);
  }

  void _handleVerifyAndLogin() {
    final otp = _otpController.text.trim();
    if (otp.length != 6 && otp != '123456') {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AntivirusColors.deepCrimson,
          content: Text(
            'Please enter any 6-digit code (e.g. 123456).',
            style: AntivirusTheme.body(color: Colors.white),
          ),
        ),
      );
      return;
    }

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AntivirusColors.warmBeige,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Top Bar — Language Switcher Toggle
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AntivirusColors.forestGreen.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AntivirusColors.forestGreen.withValues(alpha: 0.3)),
                    ),
                    child: Text(
                      AppLanguage.t('demoLogin'),
                      style: AntivirusTheme.body(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AntivirusColors.forestGreen,
                      ),
                    ),
                  ),
                  _buildLanguageToggle(),
                ],
              ),

              const SizedBox(height: 36),

              // Logo Lockup
              const FlashGuardLogo(size: 64, showWordmark: true),

              const SizedBox(height: 12),

              Text(
                AppLanguage.t('tagline'),
                textAlign: TextAlign.center,
                style: AntivirusTheme.body(
                  fontSize: 16,
                  color: AntivirusColors.textMuted,
                ),
              ),

              const SizedBox(height: 32),

              // Demo Disclaimer Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AntivirusColors.amberOchre.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AntivirusColors.amberOchre, width: 1.2),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, color: AntivirusColors.amberOchre, size: 22),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        AppLanguage.t('demoNotice'),
                        style: AntivirusTheme.body(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AntivirusColors.inkText,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // Login Form Card
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AntivirusColors.softIvory,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AntivirusColors.borderSubtle, width: 1),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      AppLanguage.t('enterPhone'),
                      style: AntivirusTheme.body(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Phone input
                    TextField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      readOnly: _otpSent,
                      style: AntivirusTheme.amount(fontSize: 20, color: AntivirusColors.inkText),
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.phone_android, color: AntivirusColors.forestGreen),
                        prefixText: '+91 ',
                        prefixStyle: AntivirusTheme.amount(fontSize: 20, color: AntivirusColors.forestGreen),
                        filled: true,
                        fillColor: AntivirusColors.warmBeige,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide(color: AntivirusColors.borderSubtle),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide(color: AntivirusColors.borderSubtle),
                        ),
                      ),
                    ),

                    if (_otpSent) ...[
                      const SizedBox(height: 20),
                      Text(
                        AppLanguage.t('enterOtp'),
                        style: AntivirusTheme.body(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        maxLength: 6,
                        style: AntivirusTheme.amount(fontSize: 24, color: AntivirusColors.inkText),
                        decoration: InputDecoration(
                          hintText: '123456',
                          prefixIcon: const Icon(Icons.lock_outline, color: AntivirusColors.forestGreen),
                          filled: true,
                          fillColor: AntivirusColors.warmBeige,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide(color: AntivirusColors.borderSubtle),
                          ),
                        ),
                      ),
                    ],

                    const SizedBox(height: 24),

                    // Action Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AntivirusColors.forestGreen,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          elevation: 0,
                        ),
                        onPressed: _otpSent ? _handleVerifyAndLogin : _handleSendOtp,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(_otpSent ? Icons.check_circle : Icons.send, size: 20),
                            const SizedBox(width: 10),
                            Text(
                              AppLanguage.t(_otpSent ? 'verifyLogin' : 'sendOtp'),
                              style: AntivirusTheme.body(
                                fontSize: 17,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLanguageToggle() {
    final lang = AppLanguage();
    return AnimatedBuilder(
      animation: lang,
      builder: (_, __) => InkWell(
        onTap: () => lang.toggleLanguage(),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: AntivirusColors.softIvory,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AntivirusColors.borderSubtle, width: 1),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.language, size: 18, color: AntivirusColors.forestGreen),
              const SizedBox(width: 6),
              Text(
                lang.isHindi ? 'English' : 'हिंदी',
                style: AntivirusTheme.body(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AntivirusColors.forestGreen,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
