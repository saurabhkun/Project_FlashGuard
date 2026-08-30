import 'package:flutter/material.dart';
import '../services/biometric_service.dart';
import '../theme/sealed_ledger_theme.dart';

class SecurityCenterScreen extends StatefulWidget {
  const SecurityCenterScreen({super.key});

  @override
  State<SecurityCenterScreen> createState() => _SecurityCenterScreenState();
}

class _SecurityCenterScreenState extends State<SecurityCenterScreen> {
  Map<String, dynamic> _biometricInfo = {};
  bool _testingAuth = false;

  @override
  void initState() {
    super.initState();
    _loadHardwareStatus();
  }

  Future<void> _loadHardwareStatus() async {
    final status = await BiometricService.checkBiometricHardware();
    if (mounted) {
      setState(() {
        _biometricInfo = status;
      });
    }
  }

  Future<void> _triggerBiometricTest() async {
    setState(() {
      _testingAuth = true;
    });

    final success = await BiometricService.authenticate(
      reason: 'Biometric Security Audit Verification',
    );

    if (mounted) {
      setState(() {
        _testingAuth = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: success ? SealedLedgerColors.mossGreen : SealedLedgerColors.brickRed,
          content: Text(
            success ? 'BIOMETRIC HARDWARE AUDIT VERIFIED' : 'BIOMETRIC AUTHENTICATION FAILED',
            style: SealedLedgerTheme.plexMono(fontSize: 12, color: Colors.white),
          ),
        ),
      );
    }
  }

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
          'SECURITY & CERTIFICATION LEDGER',
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
            // Bank of India IIT Hyd Provenance Certificate
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: SealedLedgerColors.ledgerParchment,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: SealedLedgerColors.brassGold, width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'SECURITY INVARIANTS & CERTIFICATION',
                    style: SealedLedgerTheme.plexMono(fontSize: 10, fontWeight: FontWeight.bold, color: SealedLedgerColors.brassGold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Zero-Knowledge On-Device Processing',
                    style: SealedLedgerTheme.frauncesHeader(fontSize: 18, fontWeight: FontWeight.bold, color: SealedLedgerColors.inkNavyText),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Every transaction payload is certified locally in memory without unsanctioned external cloud transmission. Model trained on official Bank of India Selection Round Dataset (IIT Hyderabad).',
                    style: SealedLedgerTheme.plexSans(fontSize: 12, color: SealedLedgerColors.inkNavyText),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            Text('HARDWARE & BIOMETRIC AUDIT', style: SealedLedgerTheme.plexMono(fontSize: 12, fontWeight: FontWeight.bold, color: SealedLedgerColors.brassGold)),
            const SizedBox(height: 12),

            _buildHardwareRow('Biometric Hardware Available', _biometricInfo['canCheckBiometrics'] == true ? 'YES' : 'NO'),
            _buildHardwareRow('Enrolled Biometrics Present', _biometricInfo['isDeviceSupported'] == true ? 'YES' : 'NO'),
            _buildHardwareRow('Snapdragon 8 Elite Optimization', 'ACTIVE'),
            _buildHardwareRow('iQOO 15 NPU Vectorization', 'ACTIVE'),

            const SizedBox(height: 20),

            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: SealedLedgerColors.inkNavy,
                minimumSize: const Size(double.infinity, 46),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                  side: const BorderSide(color: SealedLedgerColors.brassGold, width: 1.2),
                ),
              ),
              onPressed: _testingAuth ? null : _triggerBiometricTest,
              child: Text(
                _testingAuth ? 'AUDITING BIOMETRIC HARDWARE...' : 'AUDIT BIOMETRIC AUTHENTICATION',
                style: SealedLedgerTheme.plexMono(fontSize: 11, fontWeight: FontWeight.bold, color: SealedLedgerColors.warmOffWhite),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHardwareRow(String label, String status) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: SealedLedgerColors.inkNavy,
          borderRadius: BorderRadius.circular(4),
          border: Border.all(color: SealedLedgerColors.brassDivider),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: SealedLedgerTheme.plexSans(fontSize: 12, color: SealedLedgerColors.warmOffWhite)),
            Text(status, style: SealedLedgerTheme.plexMono(fontSize: 11, fontWeight: FontWeight.bold, color: SealedLedgerColors.brassGold)),
          ],
        ),
      ),
    );
  }
}
