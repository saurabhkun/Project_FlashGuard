import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../theme/sealed_ledger_theme.dart';
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
      if (barcode.rawValue != null) {
        setState(() {
          _scanned = true;
        });
        final String rawCode = barcode.rawValue!;
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => SendMoneyScreen(initialRecipient: rawCode),
          ),
        );
        break;
      }
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
          'SCAN CERTIFIED UPI QR',
          style: SealedLedgerTheme.plexMono(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: SealedLedgerColors.brassGold,
          ),
        ),
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: _controller,
            onDetect: _onDetect,
          ),
          // Rubber Stamp Notch Frame Overlay
          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: SealedLedgerColors.brassGold, width: 2.5),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: 10,
                    left: 10,
                    child: Text(
                      'SCANNING LEDGER QR...',
                      style: SealedLedgerTheme.plexMono(fontSize: 10, color: SealedLedgerColors.brassGold),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: SealedLedgerColors.inkNavy,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                  side: const BorderSide(color: SealedLedgerColors.brassGold, width: 1.2),
                ),
              ),
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const SendMoneyScreen(initialRecipient: 'merchant_qr@upi'),
                  ),
                );
              },
              child: Text(
                'SIMULATE TEST QR SCAN (MERCHANT@UPI)',
                style: SealedLedgerTheme.plexMono(fontSize: 11, fontWeight: FontWeight.bold, color: SealedLedgerColors.warmOffWhite),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
