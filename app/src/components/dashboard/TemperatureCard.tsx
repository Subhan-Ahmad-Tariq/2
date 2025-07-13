import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TemperatureCard = () => {
  const temperature = 25; // This will come from your device
  const unit = '°C';

  const getColorByTemperature = (temp: number) => {
    if (temp > 30) return '#FF4444'; // Hot
    if (temp < 15) return '#4444FF'; // Cold
    return '#44FF44'; // Normal
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Temperature</Text>
        <Icon name="thermometer" size={24} color={getColorByTemperature(temperature)} />
      </View>
      <Text style={styles.value}>{temperature}{unit}</Text>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default TemperatureCard;