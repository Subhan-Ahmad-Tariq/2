import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type EditProfileScreenProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const EditProfile: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Load profile data from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      const savedName = await AsyncStorage.getItem('user_name');
      const savedEmail = await AsyncStorage.getItem('user_email');
      if (savedName) setName(savedName);
      if (savedEmail) setEmail(savedEmail);
    };
    loadProfile();
  }, []);

  // Save profile data
  const saveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Both fields are required.');
      return;
    }

    try {
      await AsyncStorage.setItem('user_name', name);
      await AsyncStorage.setItem('user_email', email);
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfile;
