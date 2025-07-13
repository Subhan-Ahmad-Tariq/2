import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WaterPurityCard = () => {
  const purity = 95; // This will come from your device

  const getColorByPurity = (level: number) => {
    if (level < 60) return '#FF3B30'; // Unsafe
    if (level < 80) return '#FF9500'; // Concerning
    return '#34C759'; // Safe
  };

  const getStatusByPurity = (level: number) => {
    if (level < 60) return 'Unsafe';
    if (level < 80) return 'Fair';
    return 'Safe';
  };

  const color = getColorByPurity(purity);
  const status = getStatusByPurity(purity);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Water Purity</Text>
        <Icon name="water-check" size={24} color={color} />
      </View>
      <Text style={[styles.value, { color }]}>
        {purity}%
      </Text>
      <Text style={[styles.status, { color }]}>
        {status}
      </Text>
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
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WaterPurityCard;