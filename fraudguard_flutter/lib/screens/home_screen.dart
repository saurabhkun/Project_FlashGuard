import 'package:flutter/material.dart';
import '../models/transaction_model.dart';
import '../theme/sealed_ledger_theme.dart';
import '../widgets/verdict_seal.dart';
import 'send_money_screen.dart';
import 'qr_scanner_screen.dart';
import 'security_center_screen.dart';
import 'fraud_analytics_screen.dart';
import 'transaction_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  final double _balance = 84500.00;
  late AnimationController _pulseController;
  late Animation<double> _pulseScaleAnim;
  late Animation<double> _pulseOpacityAnim;

  final List<TransactionItem> _recentTransactions = [
    TransactionItem(
      id: '1',
      title: 'Starbucks Cyber Hub',
      amount: 350.0,
      status: 'SAFE',
      riskScore: 0,
      date: 'Today, 2:15 PM',
      type: 'PAYMENT',
    ),
    TransactionItem(
      id: '2',
      title: 'UPI Transfer to Rahul',
      amount: 1500.0,
      status: 'SAFE',
      riskScore: 5,
      date: 'Yesterday, 6:40 PM',
      type: 'TRANSFER',
    ),
    TransactionItem(
      id: '3',
      title: 'Electronics Superstore',
      amount: 45000.0,
      status: 'SUSPICIOUS',
      riskScore: 48,
      date: '25 Aug 2026',
      type: 'TRANSFER',
    ),
    TransactionItem(
      id: '4',
      title: 'Flagged Overseas Transfer',
      amount: 100000.0,
      status: 'FRAUD',
      riskScore: 85,
      date: '24 Aug 2026',
      type: 'TRANSFER',
    ),
  ];

  @override
  void initState() {
    super.initState();
    // Ambient slow pulse (~2s cycle, subtle scale + opacity only, no glow)
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);

    _pulseScaleAnim = Tween<double>(begin: 0.85, end: 1.15).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _pulseOpacityAnim = Tween<double>(begin: 0.45, end: 0.95).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: SealedLedgerColors.inkNavy,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar & Live Monitoring Pulse
              _buildHeader(),
              const SizedBox(height: 18),

              // Bank of India IIT Hyd Notarized Certification Banner
              _buildBOINotarizedBanner(),
              const SizedBox(height: 18),

              // Account Balance Parchment Sheet Card
              _buildBalanceCard(),
              const SizedBox(height: 22),

              // Action Buttons Row (Flat Brass Outlined)
              _buildActionRow(),
              const SizedBox(height: 28),

              // Ledger Transactions Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'CERTIFIED LEDGER FEED',
                    style: SealedLedgerTheme.plexMono(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: SealedLedgerColors.brassGold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const FraudAnalyticsScreen()),
                      );
                    },
                    child: Text(
                      'Audit & Metrics >',
                      style: SealedLedgerTheme.plexMono(
                        fontSize: 11,
                        color: SealedLedgerColors.warmOffWhite,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Vertical Ledger Rows with Hairline Dividers
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _recentTransactions.length,
                separatorBuilder: (context, index) => Divider(
                  color: SealedLedgerColors.brassDivider,
                  height: 1,
                ),
                itemBuilder: (context, index) {
                  final item = _recentTransactions[index];
                  return _buildLedgerRow(item);
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'FLASHGUARD PRO',
              style: SealedLedgerTheme.frauncesHeader(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: SealedLedgerColors.warmOffWhite,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'Cryptographic Financial Ledger',
              style: SealedLedgerTheme.plexSans(
                fontSize: 12,
                color: SealedLedgerColors.brassGold,
              ),
            ),
          ],
        ),
        // Live Monitoring Ambient Pulse Indicator
        Row(
          children: [
            AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                return Transform.scale(
                  scale: _pulseScaleAnim.value,
                  child: Opacity(
                    opacity: _pulseOpacityAnim.value,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: SealedLedgerColors.mossGreen,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(width: 8),
            Text(
              'Monitoring active',
              style: SealedLedgerTheme.plexMono(
                fontSize: 11,
                color: SealedLedgerColors.mossGreen,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBOINotarizedBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: SealedLedgerColors.ledgerParchment,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: SealedLedgerColors.brassGold, width: 1.2),
      ),
      child: Row(
        children: [
          const Icon(Icons.verified, color: SealedLedgerColors.brassGold, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'BANK OF INDIA HACKATHON â€¢ IIT HYDERABAD',
                  style: SealedLedgerTheme.plexMono(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: SealedLedgerColors.inkNavyText,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Model trained & certified on official Selection Round Dataset',
                  style: SealedLedgerTheme.plexSans(
                    fontSize: 11,
                    color: SealedLedgerColors.parchmentMuted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBalanceCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: SealedLedgerColors.ledgerParchment,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: SealedLedgerColors.brassGold, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'CERTIFIED UPI LEDGER BALANCE',
                style: SealedLedgerTheme.plexMono(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: SealedLedgerColors.brassGold,
                ),
              ),
              Text(
                'SLA: 1.51 ms',
                style: SealedLedgerTheme.plexMono(
                  fontSize: 11,
                  color: SealedLedgerColors.parchmentMuted,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            'Rs. ${_balance.toStringAsFixed(2)}',
            style: SealedLedgerTheme.plexMono(
              fontSize: 30,
              fontWeight: FontWeight.bold,
              color: SealedLedgerColors.inkNavyText,
            ),
          ),
          const SizedBox(height: 14),
          Divider(color: SealedLedgerColors.brassGold.withValues(alpha: 0.3), height: 1),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildParchmentDetail('ACCOUNT ID', '9876****4321'),
              _buildParchmentDetail('DAILY LIMIT', 'Rs. 1,00,000'),
              _buildParchmentDetail('RISK STATE', '0 / 100 (Safe)'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildParchmentDetail(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: SealedLedgerTheme.plexMono(fontSize: 10, color: SealedLedgerColors.parchmentMuted),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: SealedLedgerTheme.plexMono(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: SealedLedgerColors.inkNavyText,
          ),
        ),
      ],
    );
  }

  Widget _buildActionRow() {
    return Row(
      children: [
        Expanded(
          child: _buildFlatBrassButton(
            label: 'Send Money',
            icon: Icons.north_east,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SendMoneyScreen()),
              );
            },
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildFlatBrassButton(
            label: 'Scan QR',
            icon: Icons.qr_code_scanner,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const QrScannerScreen()),
              );
            },
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildFlatBrassButton(
            label: 'Security',
            icon: Icons.shield,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SecurityCenterScreen()),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFlatBrassButton({required String label, required IconData icon, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: SealedLedgerColors.inkNavy,
          borderRadius: BorderRadius.circular(4),
          border: Border.all(color: SealedLedgerColors.brassGold, width: 1.2),
        ),
        child: Column(
          children: [
            Icon(icon, color: SealedLedgerColors.brassGold, size: 20),
            const SizedBox(height: 4),
            Text(
              label,
              style: SealedLedgerTheme.plexMono(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: SealedLedgerColors.warmOffWhite,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLedgerRow(TransactionItem item) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => TransactionDetailScreen(item: item),
          ),
        );
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 14.0),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.title,
                    style: SealedLedgerTheme.plexSans(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: SealedLedgerColors.warmOffWhite,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${item.date} â€¢ ${item.type}',
                    style: SealedLedgerTheme.plexMono(
                      fontSize: 11,
                      color: SealedLedgerColors.brassGold.withValues(alpha: 0.7),
                    ),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'Rs. ${item.amount.toStringAsFixed(2)}',
                  style: SealedLedgerTheme.plexMono(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: SealedLedgerColors.warmOffWhite,
                  ),
                ),
              ],
            ),
            const SizedBox(width: 14),
            // Signature Element: Verdict Stamp Seal
            VerdictSeal.fromStatus(item.status, size: 36.0),
          ],
        ),
      ),
    );
  }
}
