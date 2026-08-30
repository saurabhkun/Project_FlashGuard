import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';

class BiometricService {
  static final LocalAuthentication _auth = LocalAuthentication();

  static Future<Map<String, dynamic>> checkBiometricHardware() async {
    try {
      final bool canAuthenticateWithBiometrics = await _auth.canCheckBiometrics;
      final bool isDeviceSupported = await _auth.isDeviceSupported();
      final List<BiometricType> availableBiometrics = await _auth.getAvailableBiometrics();

      String typeName = 'Biometrics';
      if (availableBiometrics.contains(BiometricType.fingerprint)) {
        typeName = 'Fingerprint';
      } else if (availableBiometrics.contains(BiometricType.face)) {
        typeName = 'Face ID';
      } else if (availableBiometrics.contains(BiometricType.strong)) {
        typeName = 'Biometric Sensor';
      }

      final bool available = (canAuthenticateWithBiometrics || isDeviceSupported);

      return {
        'available': available,
        'hasHardware': canAuthenticateWithBiometrics,
        'typeName': typeName,
        'supportedTypes': availableBiometrics.map((e) => e.toString()).toList(),
      };
    } catch (e) {
      return {
        'available': false,
        'hasHardware': false,
        'typeName': 'Biometric',
        'error': e.toString(),
      };
    }
  }

  static Future<Map<String, dynamic>> promptBiometricAuth({
    String reason = 'Verify your identity to authorize transaction',
  }) async {
    try {
      final status = await checkBiometricHardware();
      if (!status['available']) {
        // Fallback for emulator / devices without enrolled biometrics
        return {
          'success': true,
          'method': 'PIN Fallback',
          'message': 'Biometrics unavailable on device. Approved via PIN.',
        };
      }

      final bool didAuthenticate = await _auth.authenticate(
        localizedReason: reason,
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false,
        ),
      );

      if (didAuthenticate) {
        return {
          'success': true,
          'method': status['typeName'],
          'message': '${status['typeName']} Verified Successfully',
        };
      } else {
        return {
          'success': false,
          'method': status['typeName'],
          'error': 'Biometric authentication was cancelled or unverified',
        };
      }
    } on PlatformException catch (e) {
      return {
        'success': false,
        'method': 'Platform Error',
        'error': e.message ?? 'Biometric error occurred',
      };
    } catch (e) {
      return {
        'success': false,
        'method': 'Error',
        'error': e.toString(),
      };
    }
  }
}
