// Central API configuration for FlashGuard Pro
// Android emulator uses 10.0.2.2 to reach host machine's localhost
// Physical device: set to your LAN IP (e.g., 192.168.1.5)
// Web/Desktop: 127.0.0.1

class ApiConfig {
  // Primary host — automatically resolved by ApiService.checkHealth()
  static String baseUrl = 'http://10.0.2.2:8000';

  // Fallback candidates tried in order
  static const List<String> candidateUrls = [
    'http://10.0.2.2:8000',  // Android Emulator (host machine localhost)
    'http://127.0.0.1:8000', // Web / Desktop / direct
    'http://192.168.1.100:8000', // LAN (update to your machine's IP)
  ];

  static const Duration connectTimeout = Duration(seconds: 5);
  static const Duration requestTimeout = Duration(seconds: 8);
}
