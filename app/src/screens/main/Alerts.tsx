import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../../components/common/Card';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Low Water Level',
      message: 'Tank water level is below 20%. Consider turning on the pump.',
      timestamp: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'error',
      title: 'High Turbidity',
      message: 'Water turbidity levels are above normal. Check water quality.',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Pump Schedule',
      message: 'Next automated pump cycle scheduled for 6:00 AM tomorrow.',
      timestamp: '3 hours ago',
      read: true,
    },
    {
      id: '4',
      type: 'success',
      title: 'Tank Cleaned',
      message: 'Automatic tank cleaning cycle completed successfully.',
      timestamp: '1 day ago',
      read: true,
    },
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return { name: 'alert', color: '#FF9500' };
      case 'error':
        return { name: 'alert-circle', color: '#FF3B30' };
      case 'info':
        return { name: 'information', color: '#007AFF' };
      case 'success':
        return { name: 'check-circle', color: '#34C759' };
      default:
        return { name: 'bell', color: '#8E8E93' };
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const renderAlert = ({ item }: { item: Alert }) => {
    const icon = getAlertIcon(item.type);
    
    return (
      <TouchableOpacity 
        style={[styles.alertCard, !item.read && styles.unreadCard]}
        onPress={() => markAsRead(item.id)}
      >
        <Card style={styles.cardContent}>
          <View style={styles.alertHeader}>
            <View style={styles.alertTitleContainer}>
              <Icon name={icon.name} size={24} color={icon.color} />
              <Text style={styles.alertTitle}>{item.title}</Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          
          <Text style={styles.message}>{item.message}</Text>
          
          {!item.read && (
            <View style={styles.unreadIndicator} />
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 15,
  },
  alertCard: {
    marginBottom: 10,
  },
  unreadCard: {
    opacity: 1,
  },
  cardContent: {
    padding: 15,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    color: '#1C1C1E',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
});

export default Alerts;