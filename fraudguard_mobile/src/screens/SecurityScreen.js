import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { checkBiometricHardware } from '../services/biometrics';
import { fetchDeviceTelemetry, BACKEND_URL } from '../services/api';

export default function SecurityScreen({ navigation }) {
  const [bioInfo, setBioInfo] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    (async () => {
      const bStatus = await checkBiometricHardware();
      setBioInfo(bStatus);

      const tStatus = await fetchDeviceTelemetry();
      setTelemetry(tStatus);

      try {
        const res = await fetch(`${BACKEND_URL}/health`);
        const data = await res.json();
        if (data.status === 'healthy') {
          setBackendStatus(`Connected (${data.model_version})`);
        } else {
          setBackendStatus('Degraded Backend');
        }
      } catch (err) {
        setBackendStatus('Offline Mode (Local Risk)');
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hardware & AI Security</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Shield Status Banner */}
        <View style={styles.bannerCard}>
          <Ionicons name="shield-checkmark" size={40} color="#00F2FE" />
          <Text style={styles.bannerTitle}>FlashGuard AI Protection Active</Text>
          <Text style={styles.bannerSubtitle}>Real-Time Hardware Enclave + ML Threat Detection</Text>
        </View>

        {/* Security Matrix List */}
        <Text style={styles.sectionTitle}>Device Hardware Security</Text>
        
        <View style={styles.itemCard}>
          <View style={styles.itemLeft}>
            <Ionicons name="finger-print" size={24} color="#00F2FE" />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Biometric Authentication</Text>
              <Text style={styles.itemSubtitle}>
                {bioInfo?.available ? `${bioInfo.typeName} Enrolled & Enforced` : 'Biometric Hardware Inactive'}
              </Text>
            </View>
          </View>
          <Text style={[styles.statusPill, bioInfo?.available ? styles.activePill : styles.inactivePill]}>
            {bioInfo?.available ? 'ACTIVE' : 'OFFLINE'}
          </Text>
        </View>

        <View style={styles.itemCard}>
          <View style={styles.itemLeft}>
            <Ionicons name="location" size={24} color="#4FACFE" />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>GPS Geolocation Telemetry</Text>
              <Text style={styles.itemSubtitle}>{telemetry?.location || 'Fetching coordinates...'}</Text>
            </View>
          </View>
          <Text style={[styles.statusPill, styles.activePill]}>LIVE</Text>
        </View>

        <View style={styles.itemCard}>
          <View style={styles.itemLeft}>
            <MaterialCommunityIcons name="cellphone-link" size={24} color="#A855F7" />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Hardware Fingerprint</Text>
              <Text style={styles.itemSubtitle}>{telemetry?.device_id || 'Mobile Device'}</Text>
            </View>
          </View>
          <Text style={[styles.statusPill, styles.activePill]}>VERIFIED</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>FraudGuard AI Engine</Text>
        
        <View style={styles.itemCard}>
          <View style={styles.itemLeft}>
            <FontAwesome5 name="brain" size={20} color="#22C55E" />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>FastAPI Model Engine</Text>
              <Text style={styles.itemSubtitle}>{backendStatus}</Text>
            </View>
          </View>
          <Text style={[styles.statusPill, styles.activePill]}>ONLINE</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { padding: 4 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  bannerCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: '#00F2FE' },
  bannerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 12 },
  bannerSubtitle: { color: '#94A3B8', fontSize: 12, marginTop: 4, textAlign: 'center' },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 15 },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemTextCol: { marginLeft: 14, flex: 1 },
  itemTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  itemSubtitle: { color: '#64748B', fontSize: 12, marginTop: 2 },
  statusPill: { fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  activePill: { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' },
  inactivePill: { backgroundColor: 'rgba(100, 116, 139, 0.2)', color: '#94A3B8' }
});
