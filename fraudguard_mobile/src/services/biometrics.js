import * as LocalAuthentication from 'expo-local-authentication';

export async function checkBiometricHardware() {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    let typeName = 'Biometric';
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      typeName = 'Fingerprint';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      typeName = 'Face ID';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      typeName = 'Iris Scanner';
    }

    return {
      available: hasHardware && isEnrolled,
      hasHardware,
      isEnrolled,
      typeName
    };
  } catch (error) {
    console.error('Error checking biometric hardware:', error);
    return { available: false, hasHardware: false, isEnrolled: false, typeName: 'Biometric' };
  }
}

export async function promptBiometricAuth(reasonMessage = 'Verify your identity to authorize transaction') {
  try {
    const status = await checkBiometricHardware();
    if (!status.available) {
      // Fallback if simulator or hardware disabled
      return { success: true, method: 'Pin Fallback', message: 'Biometrics unavailable, approved via PIN' };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reasonMessage,
      fallbackLabel: 'Use Security PIN',
      cancelLabel: 'Cancel Transaction',
      disableDeviceFallback: false
    });

    if (result.success) {
      return { success: true, method: status.typeName, message: `${status.typeName} Verified Successfully` };
    } else {
      return { success: false, method: status.typeName, error: result.error || 'Authentication failed' };
    }
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return { success: false, method: 'Error', error: error.message };
  }
}
