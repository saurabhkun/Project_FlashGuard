import * as Location from 'expo-location';
import * as Device from 'expo-device';

// Default backend endpoint (adjust IP if running on physical device e.g. http://192.168.x.x:8000)
export const BACKEND_URL = 'http://127.0.0.1:8000';

export async function fetchDeviceTelemetry() {
  let locationStr = 'Mumbai, India';
  let gpsCoords = '19.0760, 72.8777';

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      gpsCoords = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
      locationStr = `GPS (${gpsCoords})`;
    }
  } catch (err) {
    console.log('Location permission/fetch note:', err.message);
  }

  const deviceId = Device.modelName || Device.designName || 'MOBILE_DEVICE_NATIVE';

  return {
    location: locationStr,
    gps_coordinates: gpsCoords,
    device_id: deviceId,
    os_name: Device.osName || 'Android/iOS'
  };
}

export async function evaluateTransactionRisk(transactionData) {
  try {
    const telemetry = await fetchDeviceTelemetry();
    const payload = {
      step: 1,
      type: transactionData.type || 'PAYMENT',
      amount: parseFloat(transactionData.amount || 0),
      nameOrig: transactionData.nameOrig || 'USER_MOBILE_01',
      oldbalanceOrg: parseFloat(transactionData.oldbalanceOrg || 10000),
      newbalanceOrig: Math.max(0, parseFloat(transactionData.oldbalanceOrg || 10000) - parseFloat(transactionData.amount || 0)),
      nameDest: transactionData.nameDest || 'RECIPIENT_ACCOUNT',
      oldbalanceDest: 0.0,
      newbalanceDest: parseFloat(transactionData.amount || 0),
      location: telemetry.location,
      gps_coordinates: telemetry.gps_coordinates,
      device_id: telemetry.device_id,
      ip_address: '192.168.1.100'
    };

    console.log('[MOBILE API] Sending transaction to FraudGuard backend:', payload);

    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[MOBILE API ERROR]:', error);
    // Fallback heuristic simulation if backend server is unreachable
    return {
      success: false,
      error: error.message,
      data: {
        risk_score: transactionData.amount > 50000 ? 45 : 5,
        level: transactionData.amount > 50000 ? 'SUSPICIOUS' : 'SAFE',
        decision: transactionData.amount > 50000 ? 'REVIEW' : 'ACCEPT',
        reasons: ['Offline mobile security evaluation (Backend disconnected)']
      }
    };
  }
}
