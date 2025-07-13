import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';

const HomeSettings = () => {
  const navigation = useNavigation();
  const [currency, setCurrency] = useState<string>('');
  const [costType, setCostType] = useState<'electricity' | 'water'>('electricity');
  const [cost, setCost] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'English' | 'Urdu' | 'Arabic' | 'Japanese' | 'Chinese' | 'Hindi'>('English');


  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedCurrency = await AsyncStorage.getItem('currency');
      const storedCostType = await AsyncStorage.getItem('costType');
      const storedCost = await AsyncStorage.getItem('cost');
      const storedTheme = await AsyncStorage.getItem('theme');
      const storedLanguage = await AsyncStorage.getItem('language');

      if (storedCurrency) setCurrency(storedCurrency);
      if (storedCostType) setCostType(storedCostType as 'electricity' | 'water');
      if (storedCost) setCost(storedCost);
      if (storedTheme) setTheme(storedTheme as 'light' | 'dark');
      if (storedLanguage) setLanguage(storedLanguage as 'English' | 'Urdu' | 'Arabic');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('currency', currency);
      await AsyncStorage.setItem('costType', costType);
      await AsyncStorage.setItem('cost', cost);
      await AsyncStorage.setItem('theme', theme);
      await AsyncStorage.setItem('language', language);
      Alert.alert('Settings Saved', 'Your preferences have been updated.');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Currency Selection */}
      <Text style={styles.label}>Select Currency:</Text>
      <RNPickerSelect
        onValueChange={(value: string) => setCurrency(value)}
        items={[
          { label: 'US Dollar (USD)', value: 'USD' },
          { label: 'Euro (EUR)', value: 'EUR' },
          { label: 'Saudi Riyal (SAR)', value: 'SAR' },
          { label: 'Indian Rupee (INR)', value: 'INR' },
          { label: 'Pakistani Rupee (PKR)', value: 'PKR' },
          { label: 'Bangladeshi Taka (BDT)', value: 'BDT' },
          { label: 'Sri Lankan Rupee (LKR)', value: 'LKR' },
          { label: 'Chinese Yuan (CNY)', value: 'CNY' },
          { label: 'Japanese Yen (JPY)', value: 'JPY' },
        ]}
        value={currency}
        placeholder={{ label: 'Select Currency', value: '' }}
        style={{ inputAndroid: styles.dropdown, inputIOS: styles.dropdown }}
      />


      {/* Cost Type Selection */}
      <Text style={styles.label}>Cost Type:</Text>
      <View style={styles.buttonContainer}>
        {['electricity', 'water'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.button, costType === type && styles.selectedButton]}
            onPress={() => setCostType(type as 'electricity' | 'water')}
          >
            <Text style={[styles.buttonText, costType === type && styles.selectedText]}>
              {type === 'electricity' ? 'Electricity (per unit)' : 'Water (per liter)'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Field for Cost */}
      <TextInput
        style={styles.input}
        placeholder={`Enter ${costType === 'electricity' ? 'electricity unit price' : 'per liter water price'}`}
        keyboardType="numeric"
        value={cost}
        onChangeText={setCost}
      />

      {/* Theme Selection */}
      <Text style={styles.label}>Theme:</Text>
      <View style={styles.buttonContainer}>
        {['light', 'dark'].map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.button, theme === mode && styles.selectedButton]}
            onPress={() => setTheme(mode as 'light' | 'dark')}
          >
            <Text style={[styles.buttonText, theme === mode && styles.selectedText]}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Language Selection */}
      <Text style={styles.label}>Select Language:</Text>
      <RNPickerSelect
        onValueChange={(value: 'English' | 'Urdu' | 'Arabic' | 'Japanese' | 'Chinese' | 'Hindi') => setLanguage(value)}
        items={[
          { label: 'English', value: 'English' },
          { label: 'Urdu', value: 'Urdu' },
          { label: 'Arabic', value: 'Arabic' },
          { label: 'Hindi', value: 'Hindi' },
          { label: 'Chinese', value: 'Chinese' },
          { label: 'Japanese', value: 'Japanese' },
        ]}
        value={language}
        style={{
          inputAndroid: styles.picker,
          inputIOS: styles.picker,
        }}
/>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },  
  picker: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 18, marginVertical: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  button: { padding: 12, borderRadius: 8, backgroundColor: '#E0E0E0' },
  selectedButton: { backgroundColor: '#007AFF' },
  buttonText: { fontSize: 16 },
  selectedText: { color: 'white', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 16 },
  saveButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  logoutButton: { backgroundColor: 'red', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  logoutText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default HomeSettings;
