import 'package:flutter/material.dart';
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
  final double _balance = 48500.00;
  Map<String, dynamic> _biometricStatus = {};

  final List<TransactionItem> _recentTransactions = [
    TransactionItem(id: '1', title: 'Starbucks Coffee', amount: 350.0, status: 'SAFE', riskScore: 0, date: 'Today, 2:15 PM', type: 'PAYMENT'),
    TransactionItem(id: '2', title: 'UPI Transfer to Rahul', amount: 1500.0, status: 'SAFE', riskScore: 5, date: 'Yesterday', type: 'TRANSFER'),
    TransactionItem(id: '3', title: 'Electronics Store', amount: 45000.0, status: 'SUSPICIOUS', riskScore: 48, date: '25 Aug', type: 'TRANSFER'),
    TransactionItem(id: '4', title: 'Unknown Overseas Wire', amount: 100000.0, status: 'FRAUD', riskScore: 85, date: '24 Aug', type: 'TRANSFER'),
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
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome back ??',
                        style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 13),
                      ),
                      Text(
                        'Saurabh Kumar',
                        style: GoogleFonts.inter(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  InkWell(
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SecurityCenterScreen())),
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF00F2FE)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.shield_outlined, color: Color(0xFF00F2FE), size: 18),
                          const SizedBox(width: 6),
                          Text(
                            'AI Guard Active',
                            style: GoogleFonts.inter(color: const Color(0xFF00F2FE), fontSize: 11, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ).animate().fadeIn(duration: 400.ms),

              const SizedBox(height: 24),

              // Wallet Balance Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(22.0),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFF334155)),
                  boxShadow: [
                    BoxShadow(color: const Color(0xFF00F2FE).withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAlignment.start,
                  children: [
                    Text('Available Balance', style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 13)),
                    const SizedBox(height: 8),
                    Text(
                      '?${_balance.toStringAsFixed(2)}',
                      style: GoogleFonts.inter(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF00F2FE).withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.fingerprint, color: Color(0xFF00F2FE), size: 16),
                              const SizedBox(width: 6),
                              Text(
                                _biometricStatus['available'] == true
                                    ? '${_biometricStatus['typeName']} Hardware Protected'
                                    : 'PIN Protected',
                                style: GoogleFonts.inter(color: const Color(0xFF00F2FE), fontSize: 11, fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ),
                        Text('Acc: •••• 9821', style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 12)),
                      ],
                    ),
                  ],
                ),
              ).animate().slideY(begin: 0.1, duration: 500.ms),

              const SizedBox(height: 28),

              // Quick Actions Header
              Text(
                'Quick Actions',
                style: GoogleFonts.inter(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              // Grid of Quick Actions
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildActionBtn(
                    context,
                    icon: Icons.send_rounded,
                    color: const Color(0xFF00F2FE),
                    label: 'Send Money',
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SendMoneyScreen())),
                  ),
                  _buildActionBtn(
                    context,
                    icon: Icons.qr_code_scanner_rounded,
                    color: const Color(0xFF4FACFE),
                    label: 'Scan QR',
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const QrScannerScreen())),
                  ),
                  _buildActionBtn(
                    context,
                    icon: Icons.shield_moon_rounded,
                    color: const Color(0xFFA855F7),
                    label: 'Security',
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SecurityCenterScreen())),
                  ),
                  _buildActionBtn(
                    context,
                    icon: Icons.analytics_rounded,
                    color: const Color(0xFF22C55E),
                    label: 'Analytics',
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const FraudAnalyticsScreen())),
                  ),
                ],
              ).animate().fadeIn(delay: 200.ms, duration: 400.ms),

              const SizedBox(height: 32),

              // Recent Transactions Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Live Monitored Activity',
                    style: GoogleFonts.inter(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'FraudGuard ML',
                    style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Transaction Items List
              ..._recentTransactions.map((item) => _buildTransactionCard(item)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionBtn(BuildContext context, {required IconData icon, required Color color, required String label, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        width: (MediaQuery.of(context).size.width - 70) / 4,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Column(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: GoogleFonts.inter(color: const Color(0xFFCBD5E1), fontSize: 11, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionCard(TransactionItem item) {
    Color tagBg;
    Color tagText;
    if (item.status == 'SAFE') {
      tagBg = const Color(0xFF22C55E).withValues(alpha: 0.15);
      tagText = const Color(0xFF22C55E);
    } else if (item.status == 'SUSPICIOUS') {
      tagBg = const Color(0xFFEAB308).withValues(alpha: 0.15);
      tagText = const Color(0xFFEAB308);
    } else {
      tagBg = const Color(0xFFEF4444).withValues(alpha: 0.15);
      tagText = const Color(0xFFEF4444);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: const BoxDecoration(
                  color: Color(0xFF334155),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.swap_horiz_rounded, color: Color(0xFF94A3B8), size: 22),
              ),
              const SizedBox(width: 14),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.title, style: GoogleFonts.inter(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 2),
                  Text(item.date, style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 12)),
                ],
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAlignment.end,
            children: [
              Text('?${item.amount.toStringAsFixed(0)}', style: GoogleFonts.inter(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: tagBg, borderRadius: BorderRadius.circular(6)),
                child: Text(
                  '${item.status} (${item.riskScore}%)',
                  style: GoogleFonts.inter(color: tagText, fontSize: 10, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
