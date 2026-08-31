import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';
import 'send_money_screen.dart';

class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({super.key});

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> {
  final MobileScannerController _controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
  );
  bool _scanned = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_scanned) return;
    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      final rawValue = barcode.rawValue;
      if (rawValue != null && rawValue.isNotEmpty) {
        setState(() => _scanned = true);

        String recipient = rawValue;
        String? amount;

        if (rawValue.startsWith('upi://pay')) {
          final uri = Uri.parse(rawValue);
          recipient = uri.queryParameters['pa'] ?? uri.queryParameters['pn'] ?? rawValue;
          amount = uri.queryParameters['am'];
        }

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => SendMoneyScreen(
              initialRecipient: recipient,
              initialAmount: amount,
            ),
          ),
        );
        break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          AppLanguage.t('payScan'),
          style: AntivirusTheme.header(fontSize: 20, color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: _controller,
            onDetect: _onDetect,
          ),
          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: AntivirusColors.forestGreen, width: 3),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AntivirusColors.softIvory,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'Point camera at any UPI QR code to scan and verify payment security.',
                textAlign: TextAlign.center,
                style: AntivirusTheme.body(fontSize: 15, color: AntivirusColors.inkText),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
