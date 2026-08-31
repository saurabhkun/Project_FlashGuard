import 'package:flutter/material.dart';
import '../theme/antivirus_theme.dart';
import '../models/transaction_model.dart';
import '../widgets/protection_shield.dart';
import '../widgets/scan_pipeline_widget.dart';

class TransactionDetailScreen extends StatelessWidget {
  final TransactionItem item;

  const TransactionDetailScreen({super.key, required this.item});

  Color get _color {
    final s = item.status.toUpperCase();
    if (s.contains('SAFE') || s.contains('ACCEPT')) return AntivirusColors.forestGreen;
    if (s.contains('SUSPICIOUS') || s.contains('REVIEW')) return AntivirusColors.amberOchre;
    return AntivirusColors.deepCrimson;
  }

  @override
  Widget build(BuildContext context) {
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
          'Scan Details',
          style: AntivirusTheme.header(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AntivirusColors.softIvory,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _color, width: 2),
              ),
              child: Column(
                children: [
                  ProtectionShield.fromStatus(item.status, size: 80, showLabel: true),
                  const SizedBox(height: 16),
                  Text(
                    '₹${item.amount.toStringAsFixed(0)}',
                    style: AntivirusTheme.amount(
                      fontSize: 32,
                      fontWeight: FontWeight.w700,
                      color: _color,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item.title,
                    style: AntivirusTheme.body(fontSize: 16, fontWeight: FontWeight.w600),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${item.date}  •  ${item.type}',
                    style: AntivirusTheme.body(fontSize: 14, color: AntivirusColors.textMuted),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AntivirusColors.softIvory,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AntivirusColors.borderSubtle),
              ),
              child: ThreatLevelBar(score: item.riskScore),
            ),

            if (item.reasons.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AntivirusColors.softIvory,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AntivirusColors.borderSubtle),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Scan Reasons & Signals',
                      style: AntivirusTheme.body(fontSize: 16, fontWeight: FontWeight.w600, color: _color),
                    ),
                    const SizedBox(height: 10),
                    ...item.reasons.map(
                      (r) => Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Row(
                          children: [
                            Icon(Icons.shield_outlined, size: 16, color: _color),
                            const SizedBox(width: 8),
                            Expanded(child: Text(r, style: AntivirusTheme.body(fontSize: 15))),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
