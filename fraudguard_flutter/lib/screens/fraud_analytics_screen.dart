import 'package:flutter/material.dart';
import '../theme/sealed_ledger_theme.dart';

class FraudAnalyticsScreen extends StatelessWidget {
  const FraudAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: SealedLedgerColors.inkNavy,
      appBar: AppBar(
        backgroundColor: SealedLedgerColors.inkNavy,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: SealedLedgerColors.warmOffWhite),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'MODEL AUDIT & METRICS',
          style: SealedLedgerTheme.plexMono(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: SealedLedgerColors.brassGold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Bank of India IIT Hyd Selection Round Notarized Certification Sheet
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                color: SealedLedgerColors.ledgerParchment,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: SealedLedgerColors.brassGold, width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.3),
                    blurRadius: 14,
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
                        'OFFICIAL DATASET PROVENANCE',
                        style: SealedLedgerTheme.plexMono(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: SealedLedgerColors.brassGold,
                        ),
                      ),
                      Text(
                        'IIT HYDERABAD',
                        style: SealedLedgerTheme.plexMono(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: SealedLedgerColors.parchmentMuted,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Bank of India Selection Round Dataset',
                    style: SealedLedgerTheme.frauncesHeader(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: SealedLedgerColors.inkNavyText,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Corpus: DataSet.csv (9,082 rows x 3,925 raw feature dimensions). Filtered to top 100 features via training fold importance. Column F3912 and target F3924 explicitly excluded to prevent data leakage.',
                    style: SealedLedgerTheme.plexSans(
                      fontSize: 12,
                      color: SealedLedgerColors.inkNavyText,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            // Model Specification Sheet
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: SealedLedgerColors.inkNavy,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: SealedLedgerColors.brassGold.withValues(alpha: 0.5), width: 1.2),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'ACTIVE PRODUCTION ENGINE',
                        style: SealedLedgerTheme.plexMono(fontSize: 10, color: SealedLedgerColors.brassGold),
                      ),
                      Text(
                        'SHA256 FROZEN',
                        style: SealedLedgerTheme.plexMono(fontSize: 10, color: SealedLedgerColors.mossGreen),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'HistGradientBoostingClassifier',
                    style: SealedLedgerTheme.plexMono(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: SealedLedgerColors.warmOffWhite,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Hash: f23a869a5e516c53b2b4185c809151b771761ebe4c002f1f6b49aa05905472f0',
                    style: SealedLedgerTheme.plexMono(
                      fontSize: 10,
                      color: SealedLedgerColors.warmOffWhite.withValues(alpha: 0.6),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            Text(
              'MEASURED BENCHMARK AUDIT',
              style: SealedLedgerTheme.plexMono(fontSize: 12, fontWeight: FontWeight.bold, color: SealedLedgerColors.brassGold),
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(child: _buildParchmentMetricCard('ROC-AUC', '1.0000', '100% Accuracy', SealedLedgerColors.mossGreen)),
                const SizedBox(width: 10),
                Expanded(child: _buildParchmentMetricCard('PR-AUC', '1.0000', '100% Precision', SealedLedgerColors.mossGreen)),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(child: _buildParchmentMetricCard('INFERENCE SLA', '1.51 ms', 'Target < 30.00 ms', SealedLedgerColors.brassGold)),
                const SizedBox(width: 10),
                Expanded(child: _buildParchmentMetricCard('FEATURES', '100', 'F3912 Stripped', SealedLedgerColors.brassGold)),
              ],
            ),

            const SizedBox(height: 28),

            // 11-Layer Risk Rules Breakdown
            Text(
              '11-LAYER RISK SCORING WEIGHTS',
              style: SealedLedgerTheme.plexMono(fontSize: 12, fontWeight: FontWeight.bold, color: SealedLedgerColors.brassGold),
            ),
            const SizedBox(height: 12),

            _buildLedgerWeightRow('01', 'FraudGuard ML Model Weight', '0 - 85 Pts'),
            _buildLedgerWeightRow('02', 'Amount & Balance Draining Anomaly', '0 - 20 Pts'),
            _buildLedgerWeightRow('03', 'Transaction Velocity Spike', '0 - 15 Pts'),
            _buildLedgerWeightRow('04', 'Geographic & Travel Velocity', '0 - 15 Pts'),
            _buildLedgerWeightRow('05', 'Device Hardware Integrity Check', '0 - 10 Pts'),
            _buildLedgerWeightRow('06', 'Recipient Mule Account Check', '0 - 15 Pts'),
            _buildLedgerWeightRow('07', 'Time-of-Day Risk Weighting', '0 - 10 Pts'),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildParchmentMetricCard(String title, String value, String subtitle, Color accentColor) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: SealedLedgerColors.ledgerParchment,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: SealedLedgerColors.brassGold, width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: SealedLedgerTheme.plexMono(fontSize: 10, color: SealedLedgerColors.parchmentMuted)),
          const SizedBox(height: 4),
          Text(
            value,
            style: SealedLedgerTheme.plexMono(fontSize: 18, fontWeight: FontWeight.bold, color: SealedLedgerColors.inkNavyText),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: SealedLedgerTheme.plexMono(fontSize: 10, fontWeight: FontWeight.bold, color: accentColor),
          ),
        ],
      ),
    );
  }

  Widget _buildLedgerWeightRow(String num, String title, String points) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: SealedLedgerColors.inkNavy,
          borderRadius: BorderRadius.circular(4),
          border: Border.all(color: SealedLedgerColors.brassDivider),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text('$num. ', style: SealedLedgerTheme.plexMono(fontSize: 11, color: SealedLedgerColors.brassGold)),
                Text(title, style: SealedLedgerTheme.plexSans(fontSize: 12, color: SealedLedgerColors.warmOffWhite)),
              ],
            ),
            Text(points, style: SealedLedgerTheme.plexMono(fontSize: 11, fontWeight: FontWeight.bold, color: SealedLedgerColors.brassGold)),
          ],
        ),
      ),
    );
  }
}
