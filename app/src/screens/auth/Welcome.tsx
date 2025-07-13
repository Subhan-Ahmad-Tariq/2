import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Button from '../../components/common/Button';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Auth'>;
};

const Welcome: React.FC<Props> = ({ navigation }) => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const firstTime = await AsyncStorage.getItem('first_time');
        const savedLanguage = await AsyncStorage.getItem('app_language');

        if (savedLanguage) setSelectedLanguage(savedLanguage);

        if (firstTime === null) {
          await AsyncStorage.setItem('first_time', 'false');
          setIsFirstTime(true);
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error('Error checking first-time status:', error);
      }
    };

    checkFirstTime();
  }, []);

  const handleGetStarted = useCallback(async () => {
    try {
      await AsyncStorage.setItem('first_time', 'false');
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error setting first_time:', error);
    }
  }, [navigation]);

  const selectLanguage = async (language: string) => {
    try {
      setSelectedLanguage(language);
      await AsyncStorage.setItem('app_language', language);
      setShowDropdown(false); // Hide dropdown after selection
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Logo */}
      <Image 
        source={require('../../assets/icons/dashboard/water-drop.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Welcome Text */}
      <Text style={styles.title}>Smart Tank</Text>
      <Text style={styles.subtitle}>Monitor and control your water tank efficiently</Text>

      {/* Features List */}
      <View style={styles.featuresList}>
        <Text style={styles.feature}>• Real-time tank monitoring</Text>
        <Text style={styles.feature}>• Automated pump control</Text>
        <Text style={styles.feature}>• Water quality tracking</Text>
        <Text style={styles.feature}>• Usage analytics</Text>
      </View>

      {/* Language Selection */}
      <TouchableOpacity style={styles.languageButton} onPress={() => setShowDropdown(!showDropdown)}>
        <Text style={styles.languageText}>Language: {selectedLanguage} ▼</Text>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {showDropdown && (
        <View style={styles.dropdown}>
          {['English', 'Urdu', 'Arabic'].map((lang) => (
            <TouchableOpacity key={lang} style={styles.dropdownItem} onPress={() => selectLanguage(lang)}>
              <Text style={styles.dropdownText}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Get Started Button */}
      <View style={styles.buttonContainer}>
        <Button 
          title="Get Started"
          onPress={handleGetStarted}
          accessibilityLabel="Get started with Smart Tank"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    tintColor: '#007AFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  feature: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
    paddingLeft: 10,
  },
  languageButton: {
    backgroundColor: '#E0E0E0',
    padding: 12,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    marginBottom: 10,
  },
  languageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    position: 'absolute',
    top: '60%',
    width: 200,
    paddingVertical: 5,
  },
  dropdownItem: {
    padding: 12,
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#007AFF',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default Welcome;
