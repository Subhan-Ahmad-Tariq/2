import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {  // ✅ Extends TouchableOpacityProps
  title: string | React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;  // ✅ Added explicitly for accessibility
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled = false, accessibilityLabel, ...props }) => (
  <TouchableOpacity 
    style={[styles.button, disabled && styles.disabled]} 
    onPress={onPress} 
    disabled={disabled}
    accessibilityLabel={accessibilityLabel}  // ✅ Fixes accessibility issue
    {...props}  // ✅ Spreads any additional props
  >
    {typeof title === "string" ? (
      <Text style={styles.text}>{title}</Text>
    ) : (
      title
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#A0A0A0',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
