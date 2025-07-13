import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WaterLevelCard = () => {
  const waterLevel = 75; // This will come from your device

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Water Level</Text>
        <Icon name="water" size={24} color="#007AFF" />
      </View>
      <Text style={styles.value}>{waterLevel}%</Text>
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

export default WaterLevelCard;