import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Card from '../../components/common/Card';
import UsageGraph from '../../components/smart-usage/UsageGraph';
import CostCalculator from '../../components/smart-usage/CostCalculator';
import Schedule from '../../components/smart-usage/Schedule';

const SmartUsage = () => {
  const waterData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      data: [250, 280, 260, 300, 270, 290, 255] // Liters per day
    }]
  };

  const powerData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      data: [85, 90, 87, 95, 88, 92, 86] // Watts per day
    }]
  };

  return (
    <ScrollView style={styles.container}>
      {/* Water Usage Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Water Consumption</Text>
        <Card style={styles.card}>
          <UsageGraph 
            data={waterData}
            title="Weekly Water Usage"
            unit="L"
          />
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>275L</Text>
              <Text style={styles.statLabel}>Daily Average</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>1,925L</Text>
              <Text style={styles.statLabel}>Weekly Total</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>-5%</Text>
              <Text style={styles.statLabel}>vs Last Week</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Power Usage Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Power Consumption</Text>
        <Card style={styles.card}>
          <UsageGraph 
            data={powerData}
            title="Weekly Power Usage"
            unit="W"
          />
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>89W</Text>
              <Text style={styles.statLabel}>Daily Average</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>623W</Text>
              <Text style={styles.statLabel}>Weekly Total</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>+2%</Text>
              <Text style={styles.statLabel}>vs Last Week</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Cost Calculator */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cost Analysis</Text>
        <CostCalculator />
      </View>

      {/* Pump Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pump Schedule</Text>
        <Schedule />
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Card style={styles.recommendationsCard}>
          <Text style={styles.recommendationItem}>
            • Consider scheduling pump operation during off-peak hours (11 PM - 5 AM)
          </Text>
          <Text style={styles.recommendationItem}>
            • Reduce pump runtime by 15 minutes to optimize power usage
          </Text>
          <Text style={styles.recommendationItem}>
            • Tank cleaning recommended within next 5 days
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1C1C1E',
  },
  card: {
    padding: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  recommendationsCard: {
    padding: 15,
  },
  recommendationItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
});

export default SmartUsage;