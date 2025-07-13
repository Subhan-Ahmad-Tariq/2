import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Card from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScheduleItem {
  id: number;
  time: string;
  duration: number;
  enabled: boolean;
}

const Schedule = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: 1, time: '06:00', duration: 30, enabled: true },
    { id: 2, time: '18:00', duration: 45, enabled: true },
    { id: 3, time: '23:00', duration: 20, enabled: false },
  ]);

  const toggleSchedule = (id: number) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id 
        ? { ...schedule, enabled: !schedule.enabled }
        : schedule
    ));
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Pump Schedule</Text>
        <TouchableOpacity>
          <Icon name="plus" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {schedules.map(schedule => (
        <View key={schedule.id} style={styles.scheduleItem}>
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleTime}>{schedule.time}</Text>
            <Text style={styles.scheduleDuration}>
              {schedule.duration} minutes
            </Text>
          </View>

          <Switch
            value={schedule.enabled}
            onValueChange={() => toggleSchedule(schedule.id)}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
          />
        </View>
      ))}

      <View style={styles.footer}>
        <Icon name="information" size={16} color="#8E8E93" />
        <Text style={styles.footerText}>
          Schedules are automatically optimized based on usage patterns
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
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  scheduleDuration: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#8E8E93',
    flex: 1,
  },
});

export default Schedule;