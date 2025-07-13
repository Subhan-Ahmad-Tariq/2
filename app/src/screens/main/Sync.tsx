import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Sync = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  // Simulated sync function
  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastSync(new Date().toLocaleString());
      setPendingChanges(0);
    } catch (err) {
      setError('Failed to sync data. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sync Status */}
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Sync Status</Text>
          <Icon 
            name={syncing ? "sync" : "sync-off"} 
            size={24} 
            color={syncing ? "#007AFF" : "#8E8E93"} 
          />
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.label}>Last Sync:</Text>
          <Text style={styles.value}>
            {lastSync || 'Never'}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.label}>Pending Changes:</Text>
          <Text style={styles.value}>
            {pendingChanges}
          </Text>
        </View>

        <Button 
          title={syncing ? "Syncing..." : "Sync Now"} 
          onPress={handleSync}
          disabled={syncing}
        />
      </Card>

      {/* Sync Settings */}
      <Card style={styles.card}>
        <Text style={styles.title}>Sync Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Auto Sync</Text>
          <TouchableOpacity>
            <Icon 
              name="toggle-switch" 
              size={24} 
              color="#34C759" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sync Frequency</Text>
          <Text style={styles.settingValue}>Every 30 mins</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sync on WiFi Only</Text>
          <TouchableOpacity>
            <Icon 
              name="toggle-switch-off" 
              size={24} 
              color="#8E8E93" 
            />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Sync History */}
      <Card style={styles.card}>
        <Text style={styles.title}>Sync History</Text>
        
        <View style={styles.historyItem}>
          <Icon name="check-circle" size={20} color="#34C759" />
          <Text style={styles.historyText}>
            Successfully synced 5 minutes ago
          </Text>
        </View>

        <View style={styles.historyItem}>
          <Icon name="alert-circle" size={20} color="#FF3B30" />
          <Text style={styles.historyText}>
            Sync failed 2 hours ago
          </Text>
        </View>
      </Card>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  card: {
    marginBottom: 15,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#8E8E93',
  },
  value: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
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
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default Sync;