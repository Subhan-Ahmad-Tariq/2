import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SyncStatus = () => {
  const isConnected = true; // This will come from your device state
  const lastSync = '2 minutes ago'; // This will come from your device state

  return (
    <View style={styles.container}>
      <Icon 
        name={isConnected ? "bluetooth-connect" : "bluetooth-off"} 
        size={20} 
        color={isConnected ? '#34C759' : '#FF3B30'} 
      />
      <Text style={[styles.statusText, { color: isConnected ? '#34C759' : '#FF3B30' }]}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </Text>
      <Text style={styles.syncText}>Last sync: {lastSync}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  syncText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default SyncStatus;