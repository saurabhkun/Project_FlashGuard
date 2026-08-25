import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    navigation.navigate('SendMoney', { scannedData: data });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan UPI QR Code</Text>
        <View style={{ width: 26 }} />
      </View>

      {hasPermission === null ? (
        <View style={styles.centerContainer}>
          <Text style={styles.infoText}>Requesting camera permission...</Text>
        </View>
      ) : hasPermission === false ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="camera-off" size={48} color="#EF4444" />
          <Text style={styles.infoText}>Camera access denied in Phone Settings</Text>
        </View>
      ) : (
        <View style={styles.cameraFrame}>
          <Camera
            style={StyleSheet.absoluteFillObject}
            type={Camera.Constants.Type.back}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View style={styles.overlayBox}>
            <View style={styles.scanCornerTL} />
            <View style={styles.scanCornerTR} />
            <View style={styles.scanCornerBL} />
            <View style={styles.scanCornerBR} />
          </View>
          <Text style={styles.overlayText}>Align merchant QR code within frame</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backBtn: { padding: 4 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  infoText: { color: '#94A3B8', fontSize: 15, marginTop: 12, textAlign: 'center' },
  cameraFrame: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlayBox: { width: 250, height: 250, borderRadius: 20, borderWidth: 2, borderColor: '#00F2FE', position: 'relative' },
  scanCornerTL: { position: 'absolute', top: -4, left: -4, width: 24, height: 24, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#00F2FE' },
  scanCornerTR: { position: 'absolute', top: -4, right: -4, width: 24, height: 24, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#00F2FE' },
  scanCornerBL: { position: 'absolute', bottom: -4, left: -4, width: 24, height: 24, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#00F2FE' },
  scanCornerBR: { position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#00F2FE' },
  overlayText: { color: '#CBD5E1', marginTop: 30, fontSize: 14, fontWeight: '500' }
});
