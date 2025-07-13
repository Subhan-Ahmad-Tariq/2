import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import Welcome from '../screens/auth/Welcome';
import AuthScreen from '../screens/auth/AuthScreen';
import DeviceSetup from '../screens/auth/DeviceSetup';
import MainNavigator from '../navigation/MainNavigator'; 
import EditProfile from '../screens/settings/EditProfile';
import { MainStackParamList } from '../Navigation/MainNavigator';
import HomeSettings from '../screens/main/HomeSettings';

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  DeviceSetup: undefined;
  Main?: { screen?: keyof MainStackParamList }; // 👈 Allow screen parameter
  EditProfile: undefined;
  HomeSettings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem('first_time');
        setIsFirstTime(firstLaunch === null);

        const userToken = await AsyncStorage.getItem('user_token');
        setIsLoggedIn(!!userToken);
      } catch (error) {
        console.error('Error checking app state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAppState();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstTime ? (
          // First-Time User Flow: Welcome → Auth → Setup → Home → Main (Tabs)
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="DeviceSetup" component={DeviceSetup} />
            <Stack.Screen name="Main">
              {() => <MainNavigator />}
            </Stack.Screen>

          </>
        ) : isLoggedIn ? (
          // Returning Users Flow: Home → Main (Tabs)
          <>
            <Stack.Screen name="Main">
              {() => <MainNavigator />}
            </Stack.Screen>

          </>
        ) : (
          // If Not Logged In, Show Auth Screen
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}

        {/* Always Available Screens */}
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="HomeSettings" component={HomeSettings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
