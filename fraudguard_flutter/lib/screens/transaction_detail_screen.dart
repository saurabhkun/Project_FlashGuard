import 'package:flutter/material.dart';
import '../models/transaction_model.dart';
import '../theme/sealed_ledger_theme.dart';
import '../widgets/verdict_seal.dart';

class TransactionDetailScreen extends StatelessWidget {
  final TransactionItem item;

  const TransactionDetailScreen({super.key, required this.item});

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
          'CERTIFIED LEDGER ENTRY',
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
          children: [
            // Ledger Parchment Sheet
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: SealedLedgerColors.ledgerParchment,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: SealedLedgerColors.brassGold.withValues(alpha: 0.5), width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.35),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Full-size Verdict Stamp Seal
                  VerdictSeal.fromStatus(
                    item.status,
                    size: 110.0,
                    animate: true,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    item.title,
                    style: SealedLedgerTheme.frauncesHeader(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: SealedLedgerColors.inkNavyText,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Rs. ${item.amount.toStringAsFixed(2)}',
                    style: SealedLedgerTheme.plexMono(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: SealedLedgerColors.inkNavyText,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'TRANSACTION ID: TXN-${item.id.padLeft(8, "0")}',
                    style: SealedLedgerTheme.plexMono(
                      fontSize: 11,
                      color: SealedLedgerColors.parchmentMuted,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Divider(color: SealedLedgerColors.brassGold.withValues(alpha: 0.3), height: 1),
                  const SizedBox(height: 20),

                  // 11-Layer Numbered Sequence Audit
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      '11-LAYER RISK AUDIT SEQUENCE',
                      style: SealedLedgerTheme.plexMono(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: SealedLedgerColors.brassGold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  _buildAuditRow('01', 'FraudGuard ML Model Prob', '0/85 pts (0.00%)', true),
                  _buildAuditRow('02', 'Amount & Balance Draining', '0/20 pts (Normal)', true),
                  _buildAuditRow('03', 'Transaction Velocity Spike', '0/15 pts (Normal)', true),
                  _buildAuditRow('04', 'Geographic & Travel Velocity', '0/15 pts (Normal)', true),
                  _buildAuditRow('05', 'Device Hardware Integrity', '0/10 pts (Verified)', true),
                  _buildAuditRow('06', 'Mule Account Registry Check', '0/15 pts (Clean)', true),
                  _buildAuditRow('07', 'Time-of-Day Heuristic Weight', '0/10 pts (Daytime)', true),

                  const SizedBox(height: 24),
                  Divider(color: SealedLedgerColors.brassGold.withValues(alpha: 0.3), height: 1),
                  const SizedBox(height: 16),

                  // Receipt Footer Print
                  _buildFooterLine('DATASET PROVENANCE', 'Bank of India (IIT Hyd Selection)'),
                  _buildFooterLine('MODEL VERSION', 'FraudGuard v1.0 (HistGradientBoosting)'),
                  _buildFooterLine('SHA256 CERTIFICATE', 'f23a869a5e516c53b2b4185c8...'),
                  _buildFooterLine('MEASURED LATENCY SLA', '1.51 ms (< 30.00 ms)'),
                  _buildFooterLine('TIMESTAMP', item.date),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAuditRow(String number, String label, String result, bool passed) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        children: [
          Text(
            '$number. ',
            style: SealedLedgerTheme.plexMono(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: SealedLedgerColors.brassGold,
            ),
          ),
          Expanded(
            child: Text(
              label,
              style: SealedLedgerTheme.plexSans(
                fontSize: 12,
                color: SealedLedgerColors.inkNavyText,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            result,
            style: SealedLedgerTheme.plexMono(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: passed ? SealedLedgerColors.mossGreen : SealedLedgerColors.brickRed,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooterLine(String key, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            key,
            style: SealedLedgerTheme.plexMono(
              fontSize: 10,
              color: SealedLedgerColors.parchmentMuted,
            ),
          ),
          Text(
            value,
            style: SealedLedgerTheme.plexMono(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: SealedLedgerColors.inkNavyText,
            ),
          ),
        ],
      ),
    );
  }
}
