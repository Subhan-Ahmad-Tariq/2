import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { DeviceProvider } from './src/context/DeviceProvider'; // Import DeviceProvider

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <DeviceProvider> {/* Wrap AppNavigator with DeviceProvider */}
          <AppNavigator />
        </DeviceProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
