import 'package:flutter/material.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';
import '../services/api_service.dart';
import '../models/transaction_model.dart';
import '../widgets/protection_shield.dart';
import 'transaction_detail_screen.dart';

class FraudAnalyticsScreen extends StatefulWidget {
  const FraudAnalyticsScreen({super.key});

  @override
  State<FraudAnalyticsScreen> createState() => _FraudAnalyticsScreenState();
}

class _FraudAnalyticsScreenState extends State<FraudAnalyticsScreen> {
  List<TransactionItem> _transactions = [];
  DashboardStats _stats = DashboardStats.empty();
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final txns = await ApiService.getTransactionHistory(limit: 50);
    final stats = await ApiService.getDashboardStats();
    if (mounted) {
      setState(() {
        _transactions = txns;
        _stats = stats;
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
          appBar: AppBar(
            backgroundColor: AntivirusColors.warmBeige,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: AntivirusColors.inkText, size: 20),
              onPressed: () => Navigator.pop(context),
            ),
            title: Text(
              AppLanguage.t('recentScans'),
              style: AntivirusTheme.header(fontSize: 20, fontWeight: FontWeight.w600),
            ),
            centerTitle: true,
          ),
          body: _loading
              ? const Center(child: CircularProgressIndicator(color: AntivirusColors.forestGreen))
              : RefreshIndicator(
                  onRefresh: _loadData,
                  color: AntivirusColors.forestGreen,
                  backgroundColor: AntivirusColors.softIvory,
                  child: ListView(
                    padding: const EdgeInsets.all(20),
                    children: [
                      _buildSummaryRow(),
                      const SizedBox(height: 20),
                      _buildScanList(),
                    ],
                  ),
                ),
        );
      },
    );
  }

  Widget _buildSummaryRow() {
    return Row(
      children: [
        _summaryCard(
          AppLanguage.t('safeTitle'),
          '${_stats.safeCount}',
          AntivirusColors.forestGreen,
        ),
        const SizedBox(width: 8),
        _summaryCard(
          AppLanguage.t('reviewTitle'),
          '${_stats.suspiciousCount}',
          AntivirusColors.amberOchre,
        ),
        const SizedBox(width: 8),
        _summaryCard(
          AppLanguage.t('quarantinedTitle'),
          '${_stats.fraudulentCount}',
          AntivirusColors.deepCrimson,
        ),
      ],
    );
  }

  Widget _summaryCard(String label, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AntivirusColors.softIvory,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.4), width: 1.5),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: AntivirusTheme.amount(
                fontSize: 24,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: AntivirusTheme.body(
                fontSize: 13,
                color: AntivirusColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScanList() {
    if (_transactions.isEmpty) {
      return Center(
        child: Column(
          children: [
            const SizedBox(height: 40),
            Icon(Icons.shield_outlined, size: 54, color: AntivirusColors.textMuted),
            const SizedBox(height: 12),
            Text(
              'No payment scans recorded yet.',
              style: AntivirusTheme.body(fontSize: 16, color: AntivirusColors.textMuted),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'PROTECTION LOG',
          style: AntivirusTheme.body(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AntivirusColors.textMuted,
          ),
        ),
        const SizedBox(height: 10),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _transactions.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (_, i) => _scanRow(_transactions[i]),
        ),
      ],
    );
  }

  Widget _scanRow(TransactionItem item) {
    return Container(
      decoration: BoxDecoration(
        color: AntivirusColors.softIvory,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AntivirusColors.borderSubtle),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        leading: ProtectionShield.fromStatus(item.status, size: 30),
        title: Text(
          item.title,
          style: AntivirusTheme.body(fontSize: 16, fontWeight: FontWeight.w600),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(
          item.date,
          style: AntivirusTheme.body(fontSize: 13, color: AntivirusColors.textMuted),
        ),
        trailing: Text(
          '₹${item.amount.toStringAsFixed(0)}',
          style: AntivirusTheme.amount(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => TransactionDetailScreen(item: item)),
        ),
      ),
    );
  }
}
