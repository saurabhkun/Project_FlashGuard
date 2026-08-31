import 'package:flutter/material.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';
import '../widgets/flashguard_logo.dart';
import 'security_center_screen.dart';
import 'demo_login_screen.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final lang = AppLanguage();

    return AnimatedBuilder(
      animation: lang,
      builder: (_, __) {
        return Scaffold(
          backgroundColor: AntivirusColors.warmBeige,
          appBar: AppBar(
            backgroundColor: AntivirusColors.warmBeige,
            elevation: 0,
            title: Text(
              AppLanguage.t('settings'),
              style: AntivirusTheme.header(fontSize: 22, fontWeight: FontWeight.w600),
            ),
            centerTitle: true,
          ),
          body: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Logo & App Name
              const Center(child: FlashGuardLogo(size: 56, showWordmark: true)),
              const SizedBox(height: 24),

              // Language Setting
              _settingCard(
                title: AppLanguage.t('language'),
                icon: Icons.language,
                child: Row(
                  children: [
                    Expanded(
                      child: _langOption(
                        label: 'English',
                        selected: !lang.isHindi,
                        onTap: () => lang.setLanguage('en'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _langOption(
                        label: 'हिंदी',
                        selected: lang.isHindi,
                        onTap: () => lang.setLanguage('hi'),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Advanced Developer Details link
              _settingCard(
                title: AppLanguage.t('developerMode'),
                icon: Icons.tune,
                child: ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(
                    AppLanguage.t('aiEngineStatus'),
                    style: AntivirusTheme.body(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  subtitle: Text(
                    'View technical parameters, features, and model metrics.',
                    style: AntivirusTheme.body(fontSize: 14, color: AntivirusColors.textMuted),
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: AntivirusColors.forestGreen),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const SecurityCenterScreen()),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Logout / Demo Account Switch
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AntivirusColors.deepCrimson, width: 1.5),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () => Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const DemoLoginScreen()),
                    (r) => false,
                  ),
                  child: Text(
                    AppLanguage.t('logout'),
                    style: AntivirusTheme.body(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AntivirusColors.deepCrimson,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _settingCard({required String title, required IconData icon, required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AntivirusColors.softIvory,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AntivirusColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AntivirusColors.forestGreen, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: AntivirusTheme.body(fontSize: 16, fontWeight: FontWeight.w600),
              ),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _langOption({required String label, required bool selected, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: selected ? AntivirusColors.forestGreen : AntivirusColors.warmBeige,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: selected ? AntivirusColors.forestGreen : AntivirusColors.borderSubtle,
          ),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: AntivirusTheme.body(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: selected ? Colors.white : AntivirusColors.inkText,
          ),
        ),
      ),
    );
  }
}
