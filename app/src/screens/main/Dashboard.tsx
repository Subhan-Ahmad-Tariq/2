import React, { useCallback, useState } from 'react';
import { 
  View, ScrollView, StyleSheet, RefreshControl, Text, TouchableOpacity 
} from 'react-native';
import { useDevice } from '../../context/DeviceProvider';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator'; // Corrected Import
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import TemperatureCard from '../../components/dashboard/TemperatureCard';
import WaterPurityCard from '../../components/dashboard/WaterPurityCard';
import WaterLevelCard from '../../components/dashboard/WaterLevelCard';
import PumpControl from '../../components/dashboard/PumpControl';
import TankCleaning from '../../components/dashboard/TankCleaning';
import PowerConsumption from '../../components/dashboard/PowerConsumption';
import SyncStatus from '../../components/dashboard/SyncStatus';

// Use the correct BottomTabNavigator type
type DeviceTabsParamList = {
  Dashboard: undefined;
  'Smart Usage': undefined;
  Alerts: undefined;
  Achievements: undefined;
  Settings: undefined;
};

type DashboardProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<DeviceTabsParamList, 'Dashboard'>,
    BottomTabNavigationProp<MainStackParamList>
  >;
};

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const { deviceId } = useDevice() ?? {}; // Ensure safe fallback
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Sync Status */}
      <View style={styles.statusContainer}>
        <SyncStatus />
      </View>

      {/* Device Info */}
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceText}>
          Connected Device: {deviceId || 'No Device'}
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={styles.buttonContainer} 
        onPress={() => console.log('Button clicked')}
      >
        <Text style={styles.buttonText}>Perform Some Action</Text>
      </TouchableOpacity>

      {/* Dashboard Widgets */}
      <View style={styles.grid}>
        <View style={styles.row}>
          <TemperatureCard />
          <WaterPurityCard />
        </View>

        <View style={styles.fullWidth}>
          <WaterLevelCard />
        </View>

        <View style={styles.row}>
          <PumpControl />
          <PowerConsumption />
        </View>

        <View style={styles.fullWidth}>
          <TankCleaning />
        </View>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  deviceInfo: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 10,
  },
  deviceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  grid: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fullWidth: {
    alignSelf: 'stretch', // Ensures it takes full width
    marginBottom: 10,
  },
});

export default Dashboard;
