import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../screens/main/Home';
import Dashboard from '../screens/main/Dashboard';
import SmartUsage from '../screens/main/SmartUsage';
import Alerts from '../screens/main/Alerts';
import Achievements from '../screens/main/Achievements';
import Settings from '../screens/main/Settings';
import HomeSettings from '../screens/main/HomeSettings';

export type MainStackParamList = {
  Home: undefined;
  Tabs?: { screen?: keyof MainTabParamList }; // ✅ Allow screen parameter
  HomeSettings: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  SmartUsage: undefined;
  Alerts: undefined;
  Achievements: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TabNavigator = ({ initialRouteName }: { initialRouteName?: keyof MainTabParamList }) => (
  <Tab.Navigator
    initialRouteName={initialRouteName || 'Dashboard'} // ✅ Default to 'Dashboard'
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        elevation: 8,
        height: 60,
        paddingBottom: 10,
      },
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName = '';
        switch (route.name) {
          case 'Dashboard':
            iconName = 'view-dashboard';
            break;
          case 'SmartUsage':
            iconName = 'chart-line';
            break;
          case 'Alerts':
            iconName = 'bell';
            break;
          case 'Achievements':
            iconName = 'trophy';
            break;
          case 'Settings':
            iconName = 'cog';
            break;
          default:
            iconName = 'help-circle';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="SmartUsage" component={SmartUsage} />
    <Tab.Screen name="Alerts" component={Alerts} />
    <Tab.Screen name="Achievements" component={Achievements} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);


const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen
      name="Tabs"
      component={({ route }: { route: { params?: { screen?: keyof MainTabParamList } } }) => (
        <TabNavigator initialRouteName={route?.params?.screen || 'Dashboard'} />
      )}
    />
    <Stack.Screen name="HomeSettings" component={HomeSettings} />
  </Stack.Navigator>
);



export default MainNavigator;

