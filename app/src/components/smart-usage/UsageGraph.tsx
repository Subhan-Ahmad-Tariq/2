import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface UsageGraphProps {
  data: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  title: string;
  unit: string;
}

const UsageGraph = ({ data, title, unit }: UsageGraphProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 60}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#007AFF',
          },
        }}
        bezier
        style={styles.chart}
        yAxisSuffix={unit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1C1C1E',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default UsageGraph;