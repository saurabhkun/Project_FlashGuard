import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { checkBiometricHardware } from '../services/biometrics';

export default function HomeScreen({ navigation }) {
  const [balance, setBalance] = useState(48500.00);
  const [bioStatus, setBioStatus] = useState(null);

  useEffect(() => {
    (async () => {
      const status = await checkBiometricHardware();
      setBioStatus(status);
    })();
  }, []);

  const recentTxns = [
    { id: '1', title: 'Starbucks Coffee', amount: '?350', status: 'SAFE', risk: 0, date: 'Today, 2:15 PM', type: 'PAYMENT' },
    { id: '2', title: 'UPI Transfer to Rahul', amount: '?1,500', status: 'SAFE', risk: 5, date: 'Yesterday', type: 'TRANSFER' },
    { id: '3', title: 'Electronics Store', amount: '?45,000', status: 'SUSPICIOUS', risk: 48, date: '25 Aug', type: 'TRANSFER' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back ??</Text>
            <Text style={styles.userName}>Saurabh Kumar</Text>
          </View>
          <TouchableOpacity style={styles.shieldBadge} onPress={() => navigation.navigate('Security')}>
            <ShieldCheckIcon color="#00F2FE" size={24} />
            <Text style={styles.shieldText}>AI Guard Active</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>?{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          
          <View style={styles.cardFooter}>
            <View style={styles.hardwarePill}>
              <Ionicons name="finger-print-outline" size={16} color="#00F2FE" />
              <Text style={styles.hardwareText}>
                {bioStatus?.available ? `${bioStatus.typeName} Enabled` : 'PIN Protected'}
              </Text>
            </View>
            <Text style={styles.accountNo}>Acc: •••• 9821</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('SendMoney')}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(0, 242, 254, 0.15)' }]}>
              <FontAwesome5 name="paper-plane" size={20} color="#00F2FE" />
            </View>
            <Text style={styles.actionText}>Send Money</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Scanner')}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(79, 172, 254, 0.15)' }]}>
              <MaterialCommunityIcons name="qrcode-scan" size={22} color="#4FACFE" />
            </View>
            <Text style={styles.actionText}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Security')}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Ionicons name="shield-checkmark" size={22} color="#A855F7" />
            </View>
            <Text style={styles.actionText}>Security</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.txnHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.subTitle}>Live AI Monitored</Text>
        </View>

        {recentTxns.map((item) => (
          <View key={item.id} style={styles.txnItem}>
            <View style={styles.txnLeft}>
              <View style={styles.txnIconCircle}>
                <MaterialCommunityIcons name="bank-transfer" size={22} color="#94A3B8" />
              </View>
              <View>
                <Text style={styles.txnTitle}>{item.title}</Text>
                <Text style={styles.txnDate}>{item.date}</Text>
              </View>
            </View>

            <View style={styles.txnRight}>
              <Text style={styles.txnAmount}>{item.amount}</Text>
              <View style={[styles.riskTag, item.status === 'SAFE' ? styles.safeTag : styles.suspiciousTag]}>
                <Text style={[styles.riskTagText, item.status === 'SAFE' ? styles.safeTagText : styles.suspiciousTagText]}>
                  {item.status} ({item.risk}%)
                </Text>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

function ShieldCheckIcon({ color, size }) {
  return <Ionicons name="shield-checkmark" size={size} color={color} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { color: '#94A3B8', fontSize: 14 },
  userName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  shieldBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#00F2FE' },
  shieldText: { color: '#00F2FE', marginLeft: 6, fontSize: 12, fontWeight: '600' },
  balanceCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#334155' },
  balanceLabel: { color: '#94A3B8', fontSize: 14 },
  balanceAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginVertical: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  hardwarePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 242, 254, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  hardwareText: { color: '#00F2FE', fontSize: 12, marginLeft: 6, fontWeight: '500' },
  accountNo: { color: '#64748B', fontSize: 13 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 15 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  actionBtn: { width: '30%', backgroundColor: '#1E293B', padding: 15, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' },
  txnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subTitle: { color: '#64748B', fontSize: 12 },
  txnItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  txnLeft: { flexDirection: 'row', alignItems: 'center' },
  txnIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txnTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  txnDate: { color: '#64748B', fontSize: 12, marginTop: 2 },
  txnRight: { alignItems: 'flex-end' },
  txnAmount: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  riskTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  safeTag: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  safeTagText: { color: '#22C55E', fontSize: 11, fontWeight: '600' },
  suspiciousTag: { backgroundColor: 'rgba(234, 179, 8, 0.15)' },
  suspiciousTagText: { color: '#EAB308', fontSize: 11, fontWeight: '600' }
});
