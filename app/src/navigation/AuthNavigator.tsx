import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../screens/auth/AuthScreen';
import DeviceSetup from '../screens/auth/DeviceSetup';
import MainNavigator from '../navigation/MainNavigator';
import Welcome from '../screens/auth/Welcome'; // ✅ Import Welcome Screen

export type AuthStackParamList = {
  Welcome: undefined;  // ✅ Add Welcome
  Auth: undefined;
  DeviceSetup: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={Welcome} />  {/* ✅ Add Welcome */}
    <Stack.Screen name="Auth" component={AuthScreen} />
    <Stack.Screen name="DeviceSetup" component={DeviceSetup} />
    <Stack.Screen name="Main" component={MainNavigator} />
  </Stack.Navigator>
);

export default AuthNavigator;
