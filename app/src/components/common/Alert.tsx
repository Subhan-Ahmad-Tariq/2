import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose }) => {
  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'warning':
        return styles.warning;
      default:
        return styles.info;
    }
  };

  return (
    <View style={[styles.container, getAlertStyle()]}>
      <Text style={styles.message}>{message}</Text>
      {onClose && (
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  success: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  error: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  warning: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
  },
  info: {
    backgroundColor: '#cce5ff',
    borderColor: '#b8daff',
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  closeButton: {
    fontSize: 20,
    marginLeft: 10,
  },
});

export default Alert;
