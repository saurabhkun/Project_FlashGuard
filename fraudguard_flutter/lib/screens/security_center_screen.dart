import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../services/api_service.dart';
import '../services/biometric_service.dart';
import '../services/telemetry_service.dart';

class SecurityCenterScreen extends StatefulWidget {
  const SecurityCenterScreen({super.key});

  @override
  State<SecurityCenterScreen> createState() => _SecurityCenterScreenState();
}

class _SecurityCenterScreenState extends State<SecurityCenterScreen> {
  Map<String, dynamic> _bioInfo = {};
  Map<String, String> _telemetry = {};
  Map<String, dynamic> _backendHealth = {};

  @override
  void initState() {
    super.initState();
    _loadSecurityData();
  }

  Future<void> _loadSecurityData() async {
    final bInfo = await BiometricService.checkBiometricHardware();
    final tInfo = await TelemetryService.getDeviceTelemetry();
    final hInfo = await ApiService.checkHealth();

    if (mounted) {
      setState(() {
        _bioInfo = bInfo;
        _telemetry = tInfo;
        _backendHealth = hInfo;
      });
    }
  }

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
        title: Text('Hardware & AI Security', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAlignment.start,
          children: [
            // Banner Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF00F2FE)),
              ),
              child: Column(
                children: [
                  const Icon(Icons.shield_outlined, color: Color(0xFF00F2FE), size: 48),
                  const SizedBox(height: 12),
                  Text('FlashGuard AI Active', style: GoogleFonts.inter(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(
                    'Real-Time Hardware Enclave + ML Threat Detection',
                    style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 12),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            Text('Device Hardware Posture', style: GoogleFonts.inter(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),

            _buildSecurityItem(
              icon: Icons.fingerprint_rounded,
              color: const Color(0xFF00F2FE),
              title: 'Biometric Authentication',
              subtitle: _bioInfo['available'] == true
                  ? '${_bioInfo['typeName']} Enrolled & Hardware Enforced'
                  : 'Biometrics Offline / PIN Protected',
              badgeText: _bioInfo['available'] == true ? 'ACTIVE' : 'PIN',
              badgeColor: _bioInfo['available'] == true ? const Color(0xFF22C55E) : const Color(0xFF94A3B8),
            ),

            _buildSecurityItem(
              icon: Icons.my_location_rounded,
              color: const Color(0xFF4FACFE),
              title: 'GPS Geolocation Telemetry',
              subtitle: _telemetry['location'] ?? 'Fetching GPS coordinates...',
              badgeText: 'LIVE',
              badgeColor: const Color(0xFF22C55E),
            ),

            _buildSecurityItem(
              icon: Icons.phonelink_setup_rounded,
              color: const Color(0xFFA855F7),
              title: 'Hardware Fingerprint ID',
              subtitle: _telemetry['device_id'] ?? 'Mobile Device',
              badgeText: 'VERIFIED',
              badgeColor: const Color(0xFF22C55E),
            ),

            const SizedBox(height: 16),

            Text('FraudGuard AI Model Engine', style: GoogleFonts.inter(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),

            _buildSecurityItem(
              icon: Icons.psychology_rounded,
              color: const Color(0xFF22C55E),
              title: 'FastAPI Backend Connection',
              subtitle: _backendHealth['online'] == true
                  ? 'Model: ${_backendHealth['model']} (${_backendHealth['version']})'
                  : 'Offline Mode (Local Fallback Engine)',
              badgeText: _backendHealth['online'] == true ? 'ONLINE' : 'CACHED',
              badgeColor: _backendHealth['online'] == true ? const Color(0xFF22C55E) : const Color(0xFFEAB308),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSecurityItem({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required String badgeText,
    required Color badgeColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Text(title, style: GoogleFonts.inter(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
                const SizedBox(height: 2),
                Text(subtitle, style: GoogleFonts.inter(color: const Color(0xFF64748B), fontSize: 12)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: badgeColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(badgeText, style: GoogleFonts.inter(color: badgeColor, fontSize: 10, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
