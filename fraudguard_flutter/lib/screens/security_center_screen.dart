import 'package:flutter/material.dart';
import '../theme/antivirus_theme.dart';
import '../services/localization_service.dart';
import '../services/api_service.dart';
import '../models/transaction_model.dart';

class SecurityCenterScreen extends StatefulWidget {
  const SecurityCenterScreen({super.key});

  @override
  State<SecurityCenterScreen> createState() => _SecurityCenterScreenState();
}

class _SecurityCenterScreenState extends State<SecurityCenterScreen> {
  HealthStatus? _health;
  DashboardStats _stats = DashboardStats.empty();
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final health = await ApiService.checkHealth();
    final stats = await ApiService.getDashboardStats();
    if (mounted) {
      setState(() {
        _health = health;
        _stats = stats;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isOnline = _health?.isOnline ?? false;

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
          AppLanguage.t('developerMode'),
          style: AntivirusTheme.header(fontSize: 20, fontWeight: FontWeight.w600),
        ),
        centerTitle: true,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AntivirusColors.forestGreen))
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                _buildStatusCard(isOnline),
                const SizedBox(height: 16),
                _buildModelCard(),
                const SizedBox(height: 16),
                _buildArchitectureCard(),
              ],
            ),
    );
  }

  Widget _buildStatusCard(bool isOnline) {
    final color = isOnline ? AntivirusColors.forestGreen : AntivirusColors.amberOchre;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AntivirusColors.softIvory,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color, width: 2),
      ),
      child: Row(
        children: [
          Icon(isOnline ? Icons.shield : Icons.wifi_off, color: color, size: 36),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isOnline ? 'FlashGuard AI Online' : 'Offline Mode Active',
                  style: AntivirusTheme.header(fontSize: 18, color: color),
                ),
                Text(
                  isOnline
                      ? 'Connected to backend server. Real-time scanning active.'
                      : 'Local heuristic engine active.',
                  style: AntivirusTheme.body(fontSize: 14, color: AntivirusColors.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModelCard() {
    return Container(
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
            AppLanguage.t('aiEngineStatus'),
            style: AntivirusTheme.header(fontSize: 18, color: AntivirusColors.forestGreen),
          ),
          const SizedBox(height: 14),
          _row(AppLanguage.t('version'), _health?.modelVersion ?? 'fraudguard-dataset-v1'),
          _row(AppLanguage.t('modelType'), _health?.modelType ?? 'HistGradientBoostingClassifier'),
          _row(AppLanguage.t('features'), '${_health?.selectedFeatures ?? 100} parameters'),
          _row('Dataset', 'Bank of India Dataset'),
          _row(AppLanguage.t('modelLoaded'), _health?.modelLoaded == true ? 'Loaded ✓' : 'Not Loaded'),
        ],
      ),
    );
  }

  Widget _buildArchitectureCard() {
    return Container(
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
            'System Architecture',
            style: AntivirusTheme.header(fontSize: 18, color: AntivirusColors.forestGreen),
          ),
          const SizedBox(height: 14),
          _row('Backend', 'FastAPI (Python)'),
          _row('Emulator Host API', '10.0.2.2:8000'),
          _row('Storage', 'SQLite Local Ledger'),
          _row('Alert System', 'WebSocket /ws/alerts'),
        ],
      ),
    );
  }

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AntivirusTheme.body(fontSize: 15, color: AntivirusColors.textMuted)),
          Text(value, style: AntivirusTheme.body(fontSize: 15, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
