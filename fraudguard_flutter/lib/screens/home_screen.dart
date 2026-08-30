import 'package:flutter/material';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';

import '../models/transaction_model.dart';
import '../services/biometric_service.dart';
import 'send_money_screen.dart';
import 'qr_scanner_screen.dart';
import 'security_center_screen.dart';
import 'fraud_analytics_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final double _balance = 84500.00;
  Map<String, dynamic> _biometricStatus = {};

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
    _loadBiometricStatus();
  }

  Future<void> _loadBiometricStatus() async {
    final status = await BiometricService.checkBiometricHardware();
    if (mounted) {
      setState(() {
        _biometricStatus = status;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTopBar(),
              const SizedBox(height: 20),
              _buildBOIHackathonBadge(),
              const SizedBox(height: 18),
              _buildBalanceCard(),
              const SizedBox(height: 22),
              _buildLiveProtectionStatus(),
              const SizedBox(height: 24),
              Text(
                'Quick Actions',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 14),
              _buildQuickActionsGrid(context),
              const SizedBox(height: 28),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Real-Time Surveillance Feed',
                    style: GoogleFonts.plusJakartaSans(
                      color: Colors.white,
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const FraudAnalyticsScreen(),
                        ),
                      );
                    },
                    child: Text(
                      'Analytics',
                      style: GoogleFonts.plusJakartaSans(
                        color: const Color(0xFF00F2FE),
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _recentTransactions.length,
                separatorBuilder: (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final item = _recentTransactions[index];
                  return _buildTransactionCard(item)
                      .animate()
                      .fadeIn(duration: 400.ms, delay: (index * 100).ms)
                      .slideY(begin: 0.1, end: 0);
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [Color(0xFF00F2FE), Color(0xFF4FACFE)],
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF00F2FE).withOpacity(0.3),
                    blurRadius: 12,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: const Center(
                child: Icon(Icons.security, color: Color(0xFF0B0F19), size: 26),
              ),
            ),
            const SizedBox(width: 14),
            Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Text(
                  'Welcome back',
                  style: GoogleFonts.plusJakartaSans(
                    color: const Color(0xFF94A3B8),
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  'Saurabh Kumar',
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
        IconButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const SecurityCenterScreen()),
            );
          },
          icon: Container(
            padding: const EdgeInsets.all(9),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF334155)),
            ),
            child: const Icon(Icons.shield_outlined, color: Color(0xFF00F2FE), size: 22),
          ),
        ),
      ],
    );
  }

  Widget _buildBOIHackathonBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF0284C7).withOpacity(0.2),
            const Color(0xFF0D9488).withOpacity(0.2),
          ],
        ),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.5)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: const BoxDecoration(
              color: Color(0xFF0284C7),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.workspace_premium, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Text(
                  'BANK OF INDIA HACKATHON - IIT HYDERABAD',
                  style: GoogleFonts.plusJakartaSans(
                    color: const Color(0xFF38BDF8),
                    fontSize: 10,
                    fontWeight: FontWeight.extrabold,
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Model Trained on Selection Round Dataset',
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
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
        gradient: const LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF00F2FE).withOpacity(0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF00F2FE).withOpacity(0.12),
            blurRadius: 24,
            spreadRadius: 2,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Available UPI Balance',
                style: GoogleFonts.plusJakartaSans(
                  color: const Color(0xFF94A3B8),
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: Color(0xFF10B981),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'AI Protected',
                      style: GoogleFonts.plusJakartaSans(
                        color: const Color(0xFF10B981),
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            'Rs. ${_balance.toStringAsFixed(2)}',
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 16),
          const Divider(color: Color(0xFF334155), height: 1),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildBalanceDetail('Account ID', '9876****4321'),
              _buildBalanceDetail('Daily Limit', 'Rs. 1,00,000'),
              _buildBalanceDetail('Risk Level', '0 / 100 (Safe)'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBalanceDetail(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(color: const Color(0xFF64748B), fontSize: 11),
        ),
        const SizedBox(height: 3),
        Text(
          value,
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildLiveProtectionStatus() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withOpacity(0.7),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF00F2FE).withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.bolt_rounded, color: Color(0xFF00F2FE), size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Text(
                  '1.51 ms Real-Time Inference SLA',
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'FraudGuard HistGradientBoosting Engine Active',
                  style: GoogleFonts.plusJakartaSans(
                    color: const Color(0xFF94A3B8),
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionsGrid(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildActionButton(
            context,
            icon: Icons.send_rounded,
            label: 'Send Money',
            color: const Color(0xFF00F2FE),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SendMoneyScreen()),
              );
            },
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionButton(
            context,
            icon: Icons.qr_code_scanner_rounded,
            label: 'Scan QR',
            color: const Color(0xFF4FACFE),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const QRScannerScreen()),
              );
            },
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionButton(
            context,
            icon: Icons.analytics_rounded,
            label: 'Analytics',
            color: const Color(0xFFA855F7),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const FraudAnalyticsScreen()),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFF334155)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 10),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionCard(TransactionItem item) {
    Color badgeColor;
    Color badgeBg;
    if (item.status == 'SAFE') {
      badgeColor = const Color(0xFF10B981);
      badgeBg = const Color(0xFF10B981).withOpacity(0.15);
    } else if (item.status == 'SUSPICIOUS') {
      badgeColor = const Color(0xFFF59E0B);
      badgeBg = const Color(0xFFF59E0B).withOpacity(0.15);
    } else {
      badgeColor = const Color(0xFFEF4444);
      badgeBg = const Color(0xFFEF4444).withOpacity(0.15);
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: badgeBg,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              item.status == 'SAFE'
                  ? Icons.check_circle_outline_rounded
                  : (item.status == 'SUSPICIOUS' ? Icons.warning_amber_rounded : Icons.block_rounded),
              color: badgeColor,
              size: 22,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Text(
                  item.title,
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${item.date} | ${item.type}',
                  style: GoogleFonts.plusJakartaSans(
                    color: const Color(0xFF94A3B8),
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAlignment.end,
            children: [
              Text(
                'Rs. ${item.amount.toStringAsFixed(2)}',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: badgeBg,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: badgeColor.withOpacity(0.5)),
                ),
                child: Text(
                  '${item.status} (${item.riskScore})',
                  style: GoogleFonts.plusJakartaSans(
                    color: badgeColor,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
