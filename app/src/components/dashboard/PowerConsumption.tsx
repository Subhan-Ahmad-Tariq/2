import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PowerConsumption = () => {
  const currentWatts = 120; // Current power consumption
  const dailyAverage = 95; // Daily average consumption

  const getColorByUsage = (current: number, average: number) => {
    if (current > average * 1.5) return '#FF3B30'; // High usage
    if (current > average * 1.2) return '#FF9500'; // Above average
    return '#34C759'; // Normal usage
  };

  const color = getColorByUsage(currentWatts, dailyAverage);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Power Usage</Text>
        <Icon 
          name="flash" 
          size={24} 
          color={color}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.value, { color }]}>
          {currentWatts}W
        </Text>
        <Text style={styles.label}>Current Usage</Text>

        <View style={styles.averageContainer}>
          <Text style={styles.averageText}>
            Daily Avg: {dailyAverage}W
          </Text>
          {currentWatts > dailyAverage && (
            <Text style={styles.warningText}>
              {((currentWatts - dailyAverage) / dailyAverage * 100).toFixed(0)}% above average
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  content: {
    alignItems: 'center',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 15,
  },
  averageContainer: {
    alignItems: 'center',
  },
  averageText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  warningText: {
    fontSize: 12,
    color: '#FF9500',
  },
});

export default PowerConsumption;