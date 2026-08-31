import 'package:flutter/material.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';
import '../services/api_service.dart';
import '../models/transaction_model.dart';
import '../widgets/protection_shield.dart';
import '../widgets/flashguard_logo.dart';
import 'send_money_screen.dart';
import 'fraud_analytics_screen.dart';
import 'settings_screen.dart';
import 'transaction_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  HealthStatus? _health;
  DashboardStats _stats = DashboardStats.empty();
  List<TransactionItem> _recentTransactions = [];
  bool _loading = true;

  static final List<TransactionItem> _fallbackTransactions = [
    TransactionItem(
      id: '1',
      title: 'Rahul Kumar (rahul@okicici)',
      amount: 500.0,
      status: 'SAFE',
      riskScore: 0,
      date: 'Today, 2:15 PM',
      type: 'TRANSFER',
    ),
    TransactionItem(
      id: '2',
      title: 'Electronics Merchant Store',
      amount: 8500.0,
      status: 'SUSPICIOUS',
      riskScore: 55,
      date: 'Yesterday, 6:40 PM',
      type: 'PAYMENT',
    ),
    TransactionItem(
      id: '3',
      title: 'Quarantined: M999_SUSPICIOUS@upi',
      amount: 15000.0,
      status: 'FRAUD',
      riskScore: 92,
      date: '25 Aug, 11:30 PM',
      type: 'TRANSFER',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final health = await ApiService.checkHealth();
    final stats = await ApiService.getDashboardStats();
    final history = await ApiService.getTransactionHistory(limit: 10);

    if (mounted) {
      setState(() {
        _health = health;
        _stats = stats;
        _recentTransactions = history.isEmpty ? _fallbackTransactions : history;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = AppLanguage();

    return AnimatedBuilder(
      animation: lang,
      builder: (_, __) {
        return Scaffold(
          backgroundColor: AntivirusColors.warmBeige,
          body: SafeArea(
            child: _buildCurrentTab(),
          ),
          bottomNavigationBar: _buildBottomNav(),
        );
      },
    );
  }

  Widget _buildCurrentTab() {
    switch (_currentIndex) {
      case 0:
        return _buildHomeTab();
      case 1:
        return const SendMoneyScreen();
      case 2:
        return const FraudAnalyticsScreen();
      case 3:
        return const SettingsScreen();
      default:
        return _buildHomeTab();
    }
  }

  Widget _buildHomeTab() {
    final isOnline = _health?.isOnline ?? false;

    return RefreshIndicator(
      onRefresh: _loadData,
      color: AntivirusColors.forestGreen,
      backgroundColor: AntivirusColors.softIvory,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Bar
            _buildTopBar(isOnline),

            const SizedBox(height: 20),

            // Large Protection Shield Hero Card
            _buildProtectionHeroCard(isOnline),

            const SizedBox(height: 18),

            // Stats Tiles
            _buildStatsRow(),

            const SizedBox(height: 22),

            // Demo Scenario Shortcuts
            _buildDemoPresetsSection(),

            const SizedBox(height: 24),

            // Recent Scans & Protection Log
            _buildRecentScansSection(),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar(bool isOnline) {
    final lang = AppLanguage();
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const FlashGuardLogo(size: 40, showWordmark: true),
        Row(
          children: [
            // Online status tag
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: (isOnline ? AntivirusColors.forestGreen : AntivirusColors.amberOchre)
                    .withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isOnline ? AntivirusColors.forestGreen : AntivirusColors.amberOchre,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    isOnline ? Icons.shield : Icons.wifi_off,
                    size: 14,
                    color: isOnline ? AntivirusColors.forestGreen : AntivirusColors.amberOchre,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    isOnline ? 'AI Online' : 'Offline Mode',
                    style: AntivirusTheme.body(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isOnline ? AntivirusColors.forestGreen : AntivirusColors.amberOchre,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            // Language Toggle
            InkWell(
              onTap: () => lang.toggleLanguage(),
              borderRadius: BorderRadius.circular(8),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AntivirusColors.softIvory,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AntivirusColors.borderSubtle),
                ),
                child: Text(
                  lang.isHindi ? 'English' : 'हिंदी',
                  style: AntivirusTheme.body(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AntivirusColors.forestGreen,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildProtectionHeroCard(bool isOnline) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AntivirusColors.softIvory,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isOnline ? AntivirusColors.forestGreen : AntivirusColors.amberOchre,
          width: 2,
        ),
      ),
      child: Column(
        children: [
          Text(
            AppLanguage.t('protectionStatus'),
            style: AntivirusTheme.body(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AntivirusColors.textMuted,
            ),
          ),
          const SizedBox(height: 14),

          // Big ~140px ProtectionShield
          ProtectionShield(
            verdict: isOnline ? ProtectionVerdict.safe : ProtectionVerdict.review,
            size: 110,
            animateOnEntry: true,
          ),

          const SizedBox(height: 16),

          Text(
            isOnline
                ? AppLanguage.t('protected')
                : AppLanguage.t('limitedProtection'),
            style: AntivirusTheme.header(
              fontSize: 26,
              fontWeight: FontWeight.w700,
              color: isOnline ? AntivirusColors.forestGreen : AntivirusColors.amberOchre,
            ),
          ),

          const SizedBox(height: 4),

          Text(
            isOnline
                ? AppLanguage.t('protectedSub')
                : AppLanguage.t('limitedSub'),
            textAlign: TextAlign.center,
            style: AntivirusTheme.body(
              fontSize: 15,
              color: AntivirusColors.inkText,
            ),
          ),

          const SizedBox(height: 14),

          // Threat level display
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AntivirusColors.warmBeige,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AntivirusColors.borderSubtle),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.security, size: 18, color: AntivirusColors.forestGreen),
                const SizedBox(width: 8),
                Text(
                  '${AppLanguage.t('threatLevel')}: ',
                  style: AntivirusTheme.body(fontSize: 14, color: AntivirusColors.textMuted),
                ),
                Text(
                  _stats.overallRiskScore <= 30
                      ? AppLanguage.t('threatLow')
                      : AppLanguage.t('threatHigh'),
                  style: AntivirusTheme.amount(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AntivirusColors.forestGreen,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    return Row(
      children: [
        _statTile(
          AppLanguage.t('scansToday'),
          '${_stats.totalTransactions}',
          Icons.shield_outlined,
          AntivirusColors.forestGreen,
        ),
        const SizedBox(width: 12),
        _statTile(
          AppLanguage.t('blockedToday'),
          '${_stats.blockedToday}',
          Icons.block,
          AntivirusColors.deepCrimson,
        ),
      ],
    );
  }

  Widget _statTile(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AntivirusColors.softIvory,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AntivirusColors.borderSubtle),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    value,
                    style: AntivirusTheme.amount(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: color,
                    ),
                  ),
                  Text(
                    label,
                    style: AntivirusTheme.body(
                      fontSize: 14,
                      color: AntivirusColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDemoPresetsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppLanguage.t('demoPresets'),
          style: AntivirusTheme.body(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AntivirusColors.textMuted,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            _demoChip(
              AppLanguage.t('safeDemo'),
              AntivirusColors.forestGreen,
              () => _launchDemo('rahul@okicici', '500', 'Mumbai, India'),
            ),
            const SizedBox(width: 8),
            _demoChip(
              AppLanguage.t('reviewDemo'),
              AntivirusColors.amberOchre,
              () => _launchDemo('newmerchant@upi', '8500', 'Unknown Location'),
            ),
            const SizedBox(width: 8),
            _demoChip(
              AppLanguage.t('blockDemo'),
              AntivirusColors.deepCrimson,
              () => _launchDemo('M999_SUSPICIOUS@upi', '15000', 'High Risk Region'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _demoChip(String label, Color color, VoidCallback onTap) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: color.withValues(alpha: 0.4), width: 1.2),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: AntivirusTheme.body(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ),
      ),
    );
  }

  void _launchDemo(String recipient, String amount, String location) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => SendMoneyScreen(
          initialRecipient: recipient,
          initialAmount: amount,
          initialLocation: location,
        ),
      ),
    );
  }

  Widget _buildRecentScansSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              AppLanguage.t('recentScans'),
              style: AntivirusTheme.header(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            TextButton(
              onPressed: () => setState(() => _currentIndex = 2),
              child: Text(
                '${AppLanguage.t('viewAll')} →',
                style: AntivirusTheme.body(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AntivirusColors.forestGreen,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        if (_loading)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(20),
              child: CircularProgressIndicator(color: AntivirusColors.forestGreen),
            ),
          )
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _recentTransactions.length,
            separatorBuilder: (_, __) => Divider(
              color: AntivirusColors.borderSubtle,
              height: 1,
            ),
            itemBuilder: (_, i) => _buildTransactionRow(_recentTransactions[i]),
          ),
      ],
    );
  }

  Widget _buildTransactionRow(TransactionItem item) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      decoration: BoxDecoration(
        color: AntivirusColors.softIvory,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AntivirusColors.borderSubtle),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        leading: ProtectionShield.fromStatus(item.status, size: 28),
        title: Text(
          item.title,
          style: AntivirusTheme.body(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(
          item.date,
          style: AntivirusTheme.body(
            fontSize: 13,
            color: AntivirusColors.textMuted,
          ),
        ),
        trailing: Text(
          '₹${item.amount.toStringAsFixed(0)}',
          style: AntivirusTheme.amount(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AntivirusColors.inkText,
          ),
        ),
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => TransactionDetailScreen(item: item)),
        ),
      ),
    );
  }

  Widget _buildBottomNav() {
    return NavigationBar(
      selectedIndex: _currentIndex,
      onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
      backgroundColor: AntivirusColors.softIvory,
      indicatorColor: AntivirusColors.forestGreen.withValues(alpha: 0.15),
      elevation: 4,
      height: 68,
      destinations: [
        NavigationDestination(
          icon: const Icon(Icons.home_outlined, color: AntivirusColors.inkText, size: 26),
          selectedIcon: const Icon(Icons.home, color: AntivirusColors.forestGreen, size: 26),
          label: AppLanguage.t('home'),
        ),
        NavigationDestination(
          icon: const Icon(Icons.qr_code_scanner_outlined, color: AntivirusColors.inkText, size: 26),
          selectedIcon: const Icon(Icons.qr_code_scanner, color: AntivirusColors.forestGreen, size: 26),
          label: AppLanguage.t('payScan'),
        ),
        NavigationDestination(
          icon: const Icon(Icons.history_outlined, color: AntivirusColors.inkText, size: 26),
          selectedIcon: const Icon(Icons.history, color: AntivirusColors.forestGreen, size: 26),
          label: AppLanguage.t('history'),
        ),
        NavigationDestination(
          icon: const Icon(Icons.settings_outlined, color: AntivirusColors.inkText, size: 26),
          selectedIcon: const Icon(Icons.settings, color: AntivirusColors.forestGreen, size: 26),
          label: AppLanguage.t('settings'),
        ),
      ],
    );
  }
}
