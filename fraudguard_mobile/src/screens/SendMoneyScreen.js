import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { evaluateTransactionRisk } from '../services/api';
import { promptBiometricAuth } from '../services/biometrics';

export default function SendMoneyScreen({ navigation }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txnType, setTxnType] = useState('TRANSFER');
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState(null);

  const handleVerifyAndPay = async () => {
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid recipient and amount');
      return;
    }

    setLoading(true);
    setRiskData(null);

    const payload = {
      amount: parseFloat(amount),
      nameDest: recipient,
      type: txnType,
      oldbalanceOrg: 50000.0
    };

    // 1. Send payload to FraudGuard AI Backend Engine
    const evalResult = await evaluateTransactionRisk(payload);
    setLoading(false);

    if (!evalResult.data) {
      Alert.alert('Error', 'Unable to connect to FraudGuard Risk Engine');
      return;
    }

    const res = evalResult.data;
    setRiskData(res);

    // 2. Evaluate Decision Flow
    if (res.decision === 'BLOCK' || res.level === 'FRAUD') {
      Alert.alert(
        '?? Transaction Blocked',
        `FraudGuard AI flagged this transfer as high risk (Score: ${res.risk_score}/100).\n\nReasons:\n${res.reasons.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    // 3. Step-up Authentication (Fingerprint / Touch ID / Face ID)
    let requireBiometrics = (res.decision === 'REVIEW' || res.risk_score > 25 || parseFloat(amount) >= 25000);

    if (requireBiometrics) {
      Alert.alert(
        '?? Security Step-up Required',
        `FraudGuard Risk Score: ${res.risk_score}/100 (${res.level}).\n\nPlease verify your Fingerprint or Face ID to authorize this payment.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Authenticate Hardware',
            onPress: async () => {
              const bioResult = await promptBiometricAuth(`Authorize ?${amount} transfer to ${recipient}`);
              if (bioResult.success) {
                completePaymentSuccess(res, bioResult.method);
              } else {
                Alert.alert('Authentication Failed', bioResult.error || 'Biometric verification did not pass.');
              }
            }
          }
        ]
      );
    } else {
      // Auto-approve low risk payments
      completePaymentSuccess(res, 'Auto Pass (Low Risk)');
    }
  };

  const completePaymentSuccess = (res, method) => {
    Alert.alert(
      '? Payment Successful',
      `Amount: ?${amount}\nRecipient: ${recipient}\nSecurity Check: ${method}\nFraud Score: ${res.risk_score}/100 (SAFE)`,
      [{ text: 'Done', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Money</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Recipient Name / UPI ID</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. rahul@upi or STORE_ELECTRONICS"
            placeholderTextColor="#64748B"
            value={recipient}
            onChangeText={setRecipient}
          />

          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Amount (?)</Text>
          <TextInput
            style={[styles.textInput, styles.amountInput]}
            placeholder="0.00"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Quick Amounts */}
          <View style={styles.quickRow}>
            {['500', '1000', '5000', '50000'].map((amt) => (
              <TouchableOpacity key={amt} style={styles.quickPill} onPress={() => setAmount(amt)}>
                <Text style={styles.quickPillText}>+?{amt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Risk Assessment Card if evaluated */}
        {riskData && (
          <View style={[
            styles.riskCard,
            riskData.level === 'SAFE' ? styles.safeBorder : (riskData.level === 'SUSPICIOUS' ? styles.suspiciousBorder : styles.fraudBorder)
          ]}>
            <View style={styles.riskHeader}>
              <Ionicons
                name={riskData.level === 'SAFE' ? "shield-checkmark" : "warning"}
                size={22}
                color={riskData.level === 'SAFE' ? "#22C55E" : (riskData.level === 'SUSPICIOUS' ? "#EAB308" : "#EF4444")}
              />
              <Text style={styles.riskTitle}>FraudGuard AI Evaluation</Text>
            </View>
            <Text style={styles.riskDetail}>Score: {riskData.risk_score}/100 | Status: {riskData.level} ({riskData.decision})</Text>
            {riskData.reasons.map((r, i) => (
              <Text key={i} style={styles.reasonText}>• {r}</Text>
            ))}
          </View>
        )}

        {/* Pay Action Button */}
        <TouchableOpacity
          style={[styles.payBtn, loading && styles.disabledBtn]}
          onPress={handleVerifyAndPay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <View style={styles.btnRow}>
              <Ionicons name="finger-print" size={20} color="#0B0F19" style={{ marginRight: 8 }} />
              <Text style={styles.payBtnText}>Analyze & Pay Safely</Text>
            </View>
          )}
        </TouchableOpacity>

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
  card: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  inputLabel: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  textInput: { backgroundColor: '#0F172A', borderRadius: 12, padding: 14, color: '#FFFFFF', fontSize: 15, borderWidth: 1, borderColor: '#334155' },
  amountInput: { fontSize: 24, fontWeight: '700', color: '#00F2FE' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  quickPill: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  quickPillText: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' },
  riskCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1 },
  safeBorder: { borderColor: '#22C55E' },
  suspiciousBorder: { borderColor: '#EAB308' },
  fraudBorder: { borderColor: '#EF4444' },
  riskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  riskTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginLeft: 8 },
  riskDetail: { color: '#CBD5E1', fontSize: 13, marginBottom: 8, fontWeight: '600' },
  reasonText: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  payBtn: { backgroundColor: '#00F2FE', borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  disabledBtn: { opacity: 0.6 },
  btnRow: { flexDirection: 'row', alignItems: 'center' },
  payBtnText: { color: '#0B0F19', fontSize: 16, fontWeight: '700' }
});
