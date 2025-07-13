import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Card from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CostCalculator = () => {
  const [waterRate, setWaterRate] = useState('0.50'); // PKR per liter
  const [powerRate, setPowerRate] = useState('20'); // PKR per kWh
  
  // These would come from your usage tracking
  const dailyWaterUsage = 275; // liters
  const dailyPowerUsage = 0.89; // kWh

  const calculateDailyCost = () => {
    const waterCost = dailyWaterUsage * parseFloat(waterRate);
    const powerCost = dailyPowerUsage * parseFloat(powerRate);
    return (waterCost + powerCost).toFixed(2);
  };

  const calculateMonthlyCost = () => {
    return (parseFloat(calculateDailyCost()) * 30).toFixed(2);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Cost Calculator</Text>
        <Icon name="calculator" size={24} color="#007AFF" />
      </View>

      <View style={styles.ratesContainer}>
        <View style={styles.rateInput}>
          <Text style={styles.rateLabel}>Water Rate (PKR/L)</Text>
          <TextInput
            style={styles.input}
            value={waterRate}
            onChangeText={setWaterRate}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.rateInput}>
          <Text style={styles.rateLabel}>Power Rate (PKR/kWh)</Text>
          <TextInput
            style={styles.input}
            value={powerRate}
            onChangeText={setPowerRate}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.costBreakdown}>
        <View style={styles.costItem}>
          <Text style={styles.costLabel}>Daily Usage:</Text>
          <View style={styles.costDetails}>
            <Text style={styles.costValue}>{dailyWaterUsage}L water</Text>
            <Text style={styles.costValue}>{dailyPowerUsage}kWh power</Text>
          </View>
        </View>

        <View style={styles.costItem}>
          <Text style={styles.costLabel}>Daily Cost:</Text>
          <Text style={styles.costTotal}>PKR {calculateDailyCost()}</Text>
        </View>

        <View style={styles.costItem}>
          <Text style={styles.costLabel}>Monthly Estimate:</Text>
          <Text style={styles.costTotal}>PKR {calculateMonthlyCost()}</Text>
        </View>
      </View>

      <View style={styles.savingsTip}>
        <Icon name="lightbulb-on" size={20} color="#FF9500" />
        <Text style={styles.tipText}>
          Tip: Running your pump during off-peak hours could save up to 20% on power costs.
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
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
  },
  ratesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rateInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  rateLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F2F2F7',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  costBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 15,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  },
  costDetails: {
    alignItems: 'flex-end',
  },
  costValue: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  costTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  savingsTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  tipText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: '#FF9500',
  },
});

export default CostCalculator;