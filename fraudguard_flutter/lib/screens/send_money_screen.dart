import 'package:flutter/material.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';
import '../services/api_service.dart';
import '../widgets/scan_pipeline_widget.dart';
import 'result_screen.dart';

class SendMoneyScreen extends StatefulWidget {
  final String? initialRecipient;
  final String? initialAmount;
  final String? initialLocation;

  const SendMoneyScreen({
    super.key,
    this.initialRecipient,
    this.initialAmount,
    this.initialLocation,
  });

  @override
  State<SendMoneyScreen> createState() => _SendMoneyScreenState();
}

class _SendMoneyScreenState extends State<SendMoneyScreen> {
  final _recipientController = TextEditingController();
  final _amountController = TextEditingController();
  final _locationController = TextEditingController();

  String _selectedType = 'TRANSFER';
  bool _isScanning = false;

  @override
  void initState() {
    super.initState();
    _recipientController.text = widget.initialRecipient ?? '';
    _amountController.text = widget.initialAmount ?? '';
    _locationController.text = widget.initialLocation ?? 'Mumbai, India';
  }

  @override
  void dispose() {
    _recipientController.dispose();
    _amountController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  void _loadScenario(String recipient, String amount, String location) {
    setState(() {
      _recipientController.text = recipient;
      _amountController.text = amount;
      _locationController.text = location;
      _isScanning = false;
    });
  }

  void _startScanAndProtect() {
    final recipient = _recipientController.text.trim();
    final amountStr = _amountController.text.trim();
    final amount = double.tryParse(amountStr);

    if (recipient.isEmpty || amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AntivirusColors.deepCrimson,
          content: Text(
            'Please enter recipient details and a valid amount.',
            style: AntivirusTheme.body(color: Colors.white),
          ),
        ),
      );
      return;
    }

    setState(() => _isScanning = true);
  }

  void _onScanComplete() async {
    if (!mounted) return;

    final recipient = _recipientController.text.trim();
    final amount = double.tryParse(_amountController.text.trim()) ?? 0;
    final location = _locationController.text.trim().isEmpty
        ? 'Mumbai, India'
        : _locationController.text.trim();

    final result = await ApiService.evaluateTransaction(
      amount: amount,
      recipient: recipient,
      type: _selectedType,
      oldBalanceOrg: 84500.0,
      location: location,
    );

    if (!mounted) return;
    setState(() => _isScanning = false);

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ResultScreen(
          result: result,
          amount: amount,
          recipient: recipient,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lang = AppLanguage();

    return AnimatedBuilder(
      animation: lang,
      builder: (_, __) {
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
              AppLanguage.t('payScan'),
              style: AntivirusTheme.header(fontSize: 20, fontWeight: FontWeight.w600),
            ),
            centerTitle: true,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Demo presets
                if (!_isScanning) _buildDemoScenarios(),
                if (!_isScanning) const SizedBox(height: 20),

                // Form or Scan pipeline
                if (_isScanning)
                  AntivirusScanWidget(onComplete: _onScanComplete)
                else
                  _buildFormCard(),

                const SizedBox(height: 24),

                if (!_isScanning) _buildScanButton(),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDemoScenarios() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppLanguage.t('demoPresets'),
          style: AntivirusTheme.body(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AntivirusColors.textMuted,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            _chip(AppLanguage.t('safeDemo'), AntivirusColors.forestGreen,
                () => _loadScenario('rahul@okicici', '500', 'Mumbai, India')),
            const SizedBox(width: 8),
            _chip(AppLanguage.t('reviewDemo'), AntivirusColors.amberOchre,
                () => _loadScenario('newmerchant@upi', '8500', 'Unknown Location')),
            const SizedBox(width: 8),
            _chip(AppLanguage.t('blockDemo'), AntivirusColors.deepCrimson,
                () => _loadScenario('M999_SUSPICIOUS@upi', '15000', 'High Risk Region')),
          ],
        ),
      ],
    );
  }

  Widget _chip(String label, Color color, VoidCallback onTap) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: color.withValues(alpha: 0.4), width: 1),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: AntivirusTheme.body(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFormCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AntivirusColors.softIvory,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AntivirusColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _fieldLabel(AppLanguage.t('recipientLabel')),
          const SizedBox(height: 6),
          _inputField(
            _recipientController,
            hint: 'e.g. 9876543210 or merchant@upi',
            icon: Icons.person_outline,
          ),

          const SizedBox(height: 18),

          _fieldLabel(AppLanguage.t('amountLabel')),
          const SizedBox(height: 6),
          _inputField(
            _amountController,
            hint: '0',
            icon: Icons.currency_rupee,
            keyboardType: TextInputType.number,
            isAmount: true,
          ),

          const SizedBox(height: 18),

          _fieldLabel(AppLanguage.t('locationLabel')),
          const SizedBox(height: 6),
          _inputField(
            _locationController,
            hint: 'Mumbai, India',
            icon: Icons.location_on_outlined,
          ),
        ],
      ),
    );
  }

  Widget _fieldLabel(String label) {
    return Text(
      label,
      style: AntivirusTheme.body(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AntivirusColors.inkText,
      ),
    );
  }

  Widget _inputField(
    TextEditingController controller, {
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    bool isAmount = false,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      style: isAmount
          ? AntivirusTheme.amount(fontSize: 24, color: AntivirusColors.inkText)
          : AntivirusTheme.body(fontSize: 16, color: AntivirusColors.inkText),
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: AntivirusColors.forestGreen),
        hintText: hint,
        filled: true,
        fillColor: AntivirusColors.warmBeige,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: AntivirusColors.borderSubtle),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: AntivirusColors.borderSubtle),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AntivirusColors.forestGreen, width: 2),
        ),
      ),
    );
  }

  Widget _buildScanButton() {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: AntivirusColors.forestGreen,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          elevation: 0,
        ),
        onPressed: _startScanAndProtect,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.shield_outlined, size: 22),
            const SizedBox(width: 10),
            Text(
              AppLanguage.t('analyzeBtn'),
              style: AntivirusTheme.body(
                fontSize: 17,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
