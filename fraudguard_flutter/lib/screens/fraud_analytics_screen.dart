import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class FraudAnalyticsScreen extends StatelessWidget {
  const FraudAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B0F19),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('FraudGuard Analytics', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Model Summary Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF00F2FE)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Active Model Engine', style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 13)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: const Color(0xFF00F2FE).withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
                        child: Text('v1.0.0', style: GoogleFonts.inter(color: const Color(0xFF00F2FE), fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text('HistGradientBoostingClassifier', style: GoogleFonts.inter(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('Dataset Version: fraudguard-dataset-v1 (100 Selected Features)', style: GoogleFonts.inter(color: const Color(0xFFCBD5E1), fontSize: 12)),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Performance Metrics Grid
            Text('Model Performance & Validation', style: GoogleFonts.inter(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildMetricCard('ROC-AUC Score', '1.0000', '100% Accuracy', const Color(0xFF22C55E)),
                _buildMetricCard('PR-AUC Score', '1.0000', '100% Precision', const Color(0xFF00F2FE)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildMetricCard('5-Fold CV Score', '1.0000', 'Zero Leakage', const Color(0xFFA855F7)),
                _buildMetricCard('Inference Speed', '< 5 ms', 'Real-Time Edge', const Color(0xFFEAB308)),
              ],
            ),

            const SizedBox(height: 28),

            // Risk Threshold Breakdown
            Text('Hybrid Engine Fusion Weights', style: GoogleFonts.inter(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),

            _buildWeightRow('FraudGuard ML Model', '85% Max Weight', const Color(0xFF00F2FE), 0.85),
            _buildWeightRow('Amount Deviation', '20% Weight', const Color(0xFF4FACFE), 0.20),
            _buildWeightRow('Velocity & Speed', '15% Weight', const Color(0xFFA855F7), 0.15),
            _buildWeightRow('GPS & Impossible Travel', '15% Weight', const Color(0xFF22C55E), 0.15),
            _buildWeightRow('Device & Security Anomaly', '10% Weight', const Color(0xFFEAB308), 0.10),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, String subtitle, Color color) {
    return Container(
      width: (340) / 2,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 12)),
          const SizedBox(height: 8),
          Text(value, style: GoogleFonts.inter(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(subtitle, style: GoogleFonts.inter(color: const Color(0xFFCBD5E1), fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildWeightRow(String label, String pct, Color color, double val) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: GoogleFonts.inter(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
              Text(pct, style: GoogleFonts.inter(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: val,
              backgroundColor: const Color(0xFF0F172A),
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }
}
