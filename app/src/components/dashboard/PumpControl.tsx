import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Card from '../common/Card';

const PumpControl = () => {
  const [isOn, setIsOn] = useState(false);

  const togglePump = () => {
    setIsOn(!isOn);
    // Here you'll implement the actual pump control logic
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Pump Control</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.statusText}>
          Pump is {isOn ? 'ON' : 'OFF'}
        </Text>
        <Switch
          value={isOn}
          onValueChange={togglePump}
          trackColor={{ false: '#E5E5EA', true: '#34C759' }}
        />
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
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PumpControl;