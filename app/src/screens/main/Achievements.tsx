import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '../../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unlocked: boolean;
}

const Achievements = () => {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Water Saver',
      description: 'Save 1000 liters of water through efficient pump scheduling',
      progress: 750,
      target: 1000,
      unlocked: false,
    },
    {
      id: '2',
      title: 'Power Optimizer',
      description: 'Reduce power consumption by 20% compared to last month',
      progress: 15,
      target: 20,
      unlocked: false,
    },
    {
      id: '3',
      title: 'Maintenance Master',
      description: 'Complete 5 tank cleaning cycles',
      progress: 5,
      target: 5,
      unlocked: true,
    },
    {
      id: '4',
      title: 'Smart Scheduler',
      description: 'Use auto-scheduling for 30 days',
      progress: 23,
      target: 30,
      unlocked: false,
    },
  ];

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <Card style={styles.card}>
      <View style={styles.achievementContent}>
        <Icon 
          name={item.unlocked ? "trophy" : "trophy-outline"} 
          size={24} 
          color={item.unlocked ? '#FFD700' : '#8E8E93'} 
        />
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Text style={styles.achievementDescription}>{item.description}</Text>
          <Text style={styles.progressText}>
            {item.progress} / {item.target}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={achievements}
        renderItem={renderAchievement}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer} // ✅ Fix applied here
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1C1C1E',
  },
  listContainer: { // ✅ Added missing style
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
    padding: 15,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    marginLeft: 10,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  progressText: {
    fontSize: 14,
    color: '#007AFF',
  },
});

export default Achievements;
