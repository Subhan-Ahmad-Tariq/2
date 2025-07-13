import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDevice } from '../../context/DeviceProvider';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { endpoints } from '../../services/api/auth';
import NetInfo from '@react-native-community/netinfo';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList,'Main'>;

interface Device {
  _id: string;
  name: string;
}

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { setDeviceId } = useDevice();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

NetInfo.fetch().then(state => {
  console.log("📡 Internet connection:", state.isConnected);
  console.log("🌍 Local IP: 192.168.10.12");  // Debug local IP
  if (!state.isConnected) {
    Alert.alert('No Internet', 'Please check your internet connection.');
  } else {
    fetchDevices();  // Only fetch if connected
  }
});

  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('user_token');
      if (!token) throw new Error('No authentication token found. Please log in again.');
      
      const apiUrl = "http://192.168.10.12:5000/api/devices";  // Use working local IP
      console.log('🌍 Fetching from:', apiUrl); // Debugging
  
      let response;
      try {
        response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (networkError) {
        console.error('🚨 Network request failed:', networkError);
        Alert.alert('Error', 'Network request failed. Please check your Wi-Fi or backend.');
        setLoading(false);
        return;  // Stop execution
      }
      
  
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
  
      const rawResponse = await response.text();
      console.log('📢 API Response Body:', rawResponse);
  
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server did not return JSON. Received: ${contentType}`);
      }
  
      const data = rawResponse ? JSON.parse(rawResponse) : null;
      if (Array.isArray(data)) {
        const formattedDevices = data.map((device) => ({
          _id: device._id ?? '',
          name: device.name ?? 'Unnamed Device',
        }));
        setDevices(formattedDevices);
      } else {
        console.error('🚨 Unexpected API response format:', data);
        setDevices([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching devices:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  const addDevice = () => {
    navigation.navigate('DeviceSetup');
  };

  const openSettings = () => {
    navigation.navigate('HomeSettings');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['user_token', 'selected_device']); // ✅ Remove only necessary keys
      navigation.replace('Welcome');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      Alert.alert('Error', 'Logout failed.');
    }
  };
  

  const handleDevicePress = async (deviceId: string) => {
    try {
      if (!deviceId) {
        console.warn('⚠️ No valid device ID provided');
        Alert.alert('Error', 'Device ID is missing.');
        return;
      }
  
      await AsyncStorage.setItem('selected_device', deviceId);
      setDeviceId(deviceId);
  
      console.log("✅ Navigating to Main with Device ID:", deviceId);
      navigation.replace('Main', { screen: 'Tabs' }); // Pass `Tabs` as the initial screen
    } catch (error) {
      console.error('❌ Error saving device:', error);
      Alert.alert('Error', 'Failed to save selected device.');
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Smart Tanks</Text>
        <TouchableOpacity onPress={openSettings} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Device List */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
      ) : devices.length > 0 ? (
        <FlatList
          data={devices}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.deviceCard} onPress={() => handleDevicePress(item._id)}>
              <Text style={styles.deviceName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noDeviceText}>No device connected yet</Text>
      )}

      {/* Add Device Button */}
      <TouchableOpacity style={styles.addButton} onPress={addDevice}>
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  settingsButton: { padding: 8 },
  deviceCard: { padding: 20, backgroundColor: '#ddd', marginVertical: 10, borderRadius: 10 },
  deviceName: { fontSize: 18, fontWeight: '600' },
  noDeviceText: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
  loadingIndicator: { marginTop: 20 },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
  },
  logoutText: { color: 'white', fontWeight: 'bold' },
});

export default Home;
