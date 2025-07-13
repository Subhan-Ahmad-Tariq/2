import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Card from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../common/Button';

const TankCleaning = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const lastCleaning = '2023-09-15'; // This will come from device
  const recommendedDate = '2023-10-15'; // Calculate based on last cleaning

  const startCleaning = () => {
    setCleaning(true);
    setShowConfirmModal(false);
    // Here you'll implement the actual cleaning cycle logic
    setTimeout(() => {
      setCleaning(false);
    }, 5000); // Simulate cleaning cycle
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Tank Cleaning</Text>
        <Icon 
          name="water-pump" 
          size={24} 
          color="#007AFF"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Last Cleaned:</Text>
          <Text style={styles.value}>{lastCleaning}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Recommended:</Text>
          <Text style={styles.recommendedValue}>{recommendedDate}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.cleanButton, cleaning && styles.cleaningActive]}
          onPress={() => setShowConfirmModal(true)}
          disabled={cleaning}
        >
          <Icon 
            name={cleaning ? "autorenew" : "spray-bottle"} 
            size={28} 
            color={cleaning ? "#fff" : "#007AFF"}
          />
          <Text style={[styles.buttonText, cleaning && styles.buttonTextActive]}>
            {cleaning ? "Cleaning..." : "Start Cleaning"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Start Cleaning Cycle?</Text>
            <Text style={styles.modalMessage}>
              This will initiate the automatic cleaning cycle. Make sure the tank has sufficient water.
            </Text>
            <View style={styles.modalButtons}>
              <Button 
                title="Cancel"
                onPress={() => setShowConfirmModal(false)}
              />
              <Button 
                title="Start"
                onPress={startCleaning}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  content: {
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
  },
  value: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  recommendedValue: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  cleanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  cleaningActive: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 10,
  },
  buttonTextActive: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TankCleaning;