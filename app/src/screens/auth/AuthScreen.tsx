import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator'; // ✅ Correct import
import { login, register } from '../../services/api/auth';
import { AuthResponse } from '../../services/api/auth';

type Props = {
  navigation: StackNavigationProp<RootStackParamList >;
};

const AuthScreen: React.FC<Props> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleAuth = useCallback(async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
  
    setLoading(true);
    try {
      let response: AuthResponse;
  
      const start = Date.now();
      response = isLogin ? await login(email, password) : await register(name, email, password);
      const end = Date.now();
      console.log(`API Response Time: ${end - start}ms`);
  
      // 🚀 Navigate first to avoid UI delay
      setTimeout(() => {
        navigation.replace(isLogin ? 'Main' : 'DeviceSetup');
      }, 200); 
  
      // ✅ Store user data after navigation
      await AsyncStorage.setItem('user_token', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
  
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [email, password, name, isLogin, navigation]);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMART Device</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, !isLogin && styles.activeButton]} 
          onPress={() => setIsLogin(false)}
        >
          <Text style={[styles.toggleText, !isLogin && styles.activeText]}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, isLogin && styles.activeButton]} 
          onPress={() => setIsLogin(true)}
        >
          <Text style={[styles.toggleText, isLogin && styles.activeText]}>Login</Text>
        </TouchableOpacity>
      </View>

      {!isLogin && (
        <TextInput 
          style={styles.input} 
          placeholder="Name" 
          value={name} 
          onChangeText={setName} 
        />
      )}
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        keyboardType="email-address"
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleAuth} 
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  toggleContainer: { flexDirection: 'row', marginBottom: 20 },
  toggleButton: { padding: 10, marginHorizontal: 5, borderWidth: 1, borderColor: '#007AFF', borderRadius: 5 },
  activeButton: { backgroundColor: '#007AFF' },
  toggleText: { color: '#007AFF', fontWeight: 'bold' },
  activeText: { color: '#fff' },
  input: { width: '100%', padding: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#fff' },
  submitButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: 'bold' },
});

export default AuthScreen;
