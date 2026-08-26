import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:geolocator/geolocator.dart';

class TelemetryService {
  static final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin();

  static Future<Map<String, String>> getDeviceTelemetry() async {
    String deviceId = 'FLUTTER_MOBILE_DEVICE';
    String locationStr = 'Mumbai, India';
    String gpsCoords = '19.0760, 72.8777';

    try {
      if (Platform.isAndroid) {
        AndroidDeviceInfo androidInfo = await _deviceInfo.androidInfo;
        deviceId = '${androidInfo.manufacturer} ${androidInfo.model} (${androidInfo.id})';
      } else if (Platform.isIOS) {
        IosDeviceInfo iosInfo = await _deviceInfo.iosInfo;
        deviceId = '${iosInfo.name} ${iosInfo.model}';
      }
    } catch (e) {
      deviceId = 'FLUTTER_MOBILE_APP';
    }

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (serviceEnabled) {
        LocationPermission permission = await Geolocator.checkPermission();
        if (permission == LocationPermission.denied) {
          permission = await Geolocator.requestPermission();
        }
        if (permission == LocationPermission.whileInUse || permission == LocationPermission.always) {
          Position pos = await Geolocator.getCurrentPosition(
            desiredAccuracy: LocationAccuracy.medium,
            timeLimit: const Duration(seconds: 3),
          );
          gpsCoords = '${pos.latitude.toStringAsFixed(4)}, ${pos.longitude.toStringAsFixed(4)}';
          locationStr = 'GPS ($gpsCoords)';
        }
      }
    } catch (e) {
      // Fallback location
    }

    return {
      'device_id': deviceId,
      'location': locationStr,
      'gps_coordinates': gpsCoords,
      'ip_address': '192.168.1.100',
    };
  }
}
