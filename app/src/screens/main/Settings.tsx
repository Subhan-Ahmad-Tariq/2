import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../../components/common/Card';

const Settings = () => {
  const [currency, setCurrency] = useState('USD');
  const [useElectricity, setUseElectricity] = useState(true);
  const [cost, setCost] = useState('');

  const handleCurrencyChange = () => {
    Alert.alert(
      'Select Currency',
      'Choose your preferred currency',
      [
        { text: 'USD', onPress: () => setCurrency('USD') },
        { text: 'PKR', onPress: () => setCurrency('PKR') },
        { text: 'Riyal', onPress: () => setCurrency('Riyal') },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Currency Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency Settings</Text>
        <Card style={styles.card}>
          <TouchableOpacity style={styles.settingRow} onPress={handleCurrencyChange}>
            <Text style={styles.settingLabel}>Currency</Text>
            <View style={styles.settingAction}>
              <Text style={styles.settingValue}>{currency}</Text>
              <Icon name="chevron-right" size={20} color="#8E8E93" />
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Cost Input Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cost Settings</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Use Electricity</Text>
            <Switch
              value={useElectricity}
              onValueChange={setUseElectricity}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{useElectricity ? 'Electricity Cost (per unit)' : 'Water Cost (per liter)'}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={cost}
              onChangeText={setCost}
              placeholder={useElectricity ? 'Enter cost per unit' : 'Enter cost per liter'}
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1C1C1E',
  },
  card: {
    padding: 0,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  settingValue: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 10,
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#8E8E93',
    padding: 5,
    fontSize: 16,
    width: 100,
    textAlign: 'right',
  },
});

export default Settings;
