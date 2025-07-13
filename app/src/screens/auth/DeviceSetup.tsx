import {
  View,
  Text,
  StyleSheet,
  StatusBar, 
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/common/Button';
import AlertBox from '../../components/common/Alert';
import { RootStackParamList } from '../../navigation/AppNavigator'; 
import { StackScreenProps } from '@react-navigation/stack';
import { BleManager, Device } from 'react-native-ble-plx';
import React, { useState, useEffect, useRef } from 'react';
import { Buffer } from 'buffer';
import WifiManager from 'react-native-wifi-reborn';

type MeasurementUnit = 'cm' | 'ft' | 'inches';
type Props = StackScreenProps<RootStackParamList, 'DeviceSetup'>;

const DeviceSetup: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const UNITS: MeasurementUnit[] = ['cm', 'ft', 'inches']; // Array of valid units
  const [tankHeight, setTankHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<MeasurementUnit>('cm');
  const [tankDiameter, setTankDiameter] = useState('');
const [diameterUnit, setDiameterUnit] = useState<MeasurementUnit>('cm');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [costType, setCostType] = useState<'electricity' | 'water'>('electricity');
  const [cost, setCost] = useState<string>('');
  const bleManagerRef = useRef(new BleManager());
  const [appState, setAppState] = useState(AppState.currentState);
  const base64Encoded = Buffer.from('Hello ESP32', 'utf-8').toString('base64');
console.log(base64Encoded);


useEffect(() => {
  console.log("📡 Component Mounted: DeviceSetup");

  requestPermissions().then((granted) => {
    if (granted) {
      console.log("✅ Permissions granted. Ready to scan.");
    } else {
      console.log("❌ Permissions denied.");
    }
  });

  const appStateListener = AppState.addEventListener("change", (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("🔄 App returned from background. Rechecking permissions...");
      requestPermissions();
    }
    setAppState(nextAppState);
  });

  return () => {
    console.log("🔌 Cleaning up BLE scanner...");
    bleManagerRef.current?.stopDeviceScan();
    appStateListener.remove();
  };
}, []);


const requestPermissions = async () => {
  if (Platform.OS !== 'android') {
    console.log("✅ Not Android, permissions are not required.");
    return true;
  }

  const androidVersion = Number(Platform.constants.Release);
  console.log(`🔹 Android Version Detected: ${androidVersion}`);

  try {
    if (androidVersion < 12) {
      console.log("🔹 Requesting Location Permissions...");

      const locationFineGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      const locationCoarseGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );

      console.log("✅ Location Permissions:", { fine: locationFineGranted, coarse: locationCoarseGranted });

      if (
        locationFineGranted !== PermissionsAndroid.RESULTS.GRANTED ||
        locationCoarseGranted !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("❌ Location permission denied.");
        Alert.alert("Permission Denied", "Location is required for BLE scanning.");
        return false;
      }
    } else {
      console.log("🔹 Requesting multiple permissions for Android 12+...");
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      console.log("✅ Permission Results:", granted);

      // ✅ Check if any permission is "never_ask_again"
      if (
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'never_ask_again' ||
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'never_ask_again'
      ) {
        console.log("⚠️ Permissions permanently denied. Asking user to enable them manually.");
        Alert.alert(
          "Permission Required",
          "Bluetooth permissions are required for BLE scanning. Please enable them in App Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: openAppSettings },
          ]
        );
        return false;
      }

      if (
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("❌ One or more permissions denied.");
        Alert.alert("Permissions Denied", "You must grant all permissions for BLE to work.");
        return false;
      }
    }

    console.log("✅ All required permissions granted.");
    return true;
  } catch (error) {
    console.error("❌ Error requesting permissions:", error);
    Alert.alert("Error", "Failed to request permissions.");
    return false;
  }
};

// ✅ Function to open App Settings
const openAppSettings = () => {
  Linking.openSettings();
};

  

  const sendBLECommand = async (command: string): Promise<boolean> => {
    if (!selectedDevice) return false;

    try {
      await selectedDevice.writeCharacteristicWithoutResponseForService(
        'your-service-uuid',
        'your-characteristic-uuid',
        Buffer.from(command, 'utf-8').toString('base64')
      );
      console.log(`✅ Sent command: ${command}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send command:', error);
      setError('Failed to send command to ESP32.');
      return false;
    }
  };

  const handleScanDevices = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;
  
    const isBluetoothOn = await bleManagerRef.current.state();
    console.log("BLE State:", isBluetoothOn);
    if (isBluetoothOn !== 'PoweredOn') {
      Alert.alert("Bluetooth Disabled", "Please turn on Bluetooth to scan for devices.");
      return;
    }
  
    setScanning(true);
    setError('');
    setDevices([]); // ✅ Clear previous devices before scanning
    let foundDevices: Device[] = [];
  
    bleManagerRef.current.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("BLE Scan Error:", error);
        setError('Bluetooth scan failed.');
        setScanning(false);
        bleManagerRef.current.stopDeviceScan();
        return;
      }
  
      if (device && (device.name?.includes('ESP32') || device.name?.includes('SmartTank'))) {
        setDevices(prevDevices => {
          if (!prevDevices.some(d => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });
  
    setTimeout(() => {
      bleManagerRef.current.stopDeviceScan();
      setScanning(false);
      if (foundDevices.length === 0) {
        setError('No ESP32 devices found.');
      }
    }, 5000);
  };
  
  

  const handleNextStep = async () => {
    try {
      if (step === 2 && selectedDevice) {
        let connectedDevice: Device | null = null;
        let attempts = 0;
  
        while (attempts < 3 && !connectedDevice) {
          try {
            console.log(`🔄 Attempting to connect to ${selectedDevice.id} (Attempt ${attempts + 1})`);
            connectedDevice = await bleManagerRef.current.connectToDevice(selectedDevice.id, { timeout: 10000 });
            await new Promise(res => setTimeout(res, 1000)); // ✅ Ensure delay between attempts
          } catch (err) {
            console.warn(`⚠️ Attempt ${attempts + 1} failed.`);
            attempts++;
          }
        }
  
        if (!connectedDevice) throw new Error('❌ Device connection failed.');
  
        console.log("✅ Connected! Discovering services...");
        await connectedDevice.discoverAllServicesAndCharacteristics();
  
        await AsyncStorage.setItem('last_connected_device', selectedDevice.id);
  
        console.log("✅ Sending setup command...");
        const commandSent = await sendBLECommand(`SETUP_MODE`);
        if (!commandSent) throw new Error('❌ Failed to notify ESP32 about setup.');
        
// Add to your state variables at the top of the component
const [tankDiameter, setTankDiameter] = useState('');
const [diameterUnit, setDiameterUnit] = useState<'cm' | 'ft' | 'inches'>('cm');

// Update the step 3 handler
} else if (step === 3) {
    if (!tankHeight || isNaN(parseFloat(tankHeight)) || 
        !tankDiameter || isNaN(parseFloat(tankDiameter))) {
      throw new Error('Please enter valid tank dimensions');
    }

    const heightValue = parseFloat(tankHeight);
    const diameterValue = parseFloat(tankDiameter);
    
    let safetyDeductedHeight = 0;
    let diameterCm = 0;
    
    switch(heightUnit) {
      case 'cm': 
        safetyDeductedHeight = heightValue - 30;
        diameterCm = diameterValue;
        break;
      case 'ft': 
        safetyDeductedHeight = (heightValue * 30.48) - 30.48;
        diameterCm = diameterValue * 30.48;
        break;
      case 'inches': 
        safetyDeductedHeight = (heightValue * 2.54) - 30.48;
        diameterCm = diameterValue * 2.54;
        break;
    }

    const command = `SET_TANK_DIMENSIONS:${safetyDeductedHeight.toFixed(1)}:${diameterCm.toFixed(1)}`;
    const commandSent = await sendBLECommand(command);
    if (!commandSent) throw new Error('Failed to save tank dimensions');

    await AsyncStorage.multiSet([
      ['tank_height', safetyDeductedHeight.toString()],
      ['tank_height_unit', heightUnit],
      ['tank_diameter', diameterCm.toString()],
      ['tank_diameter_unit', diameterUnit]
    ]);
    
    setStep(4);
           
      } else if (step === 4) {
        const commandSent = await sendBLECommand(`SET_COST:${costType}:${cost}`);
        if (!commandSent) throw new Error('❌ Failed to send cost configuration.');
  
        await AsyncStorage.setItem('device_costType', costType);
        await AsyncStorage.setItem('device_cost', cost);
        setStep(5);
      } else if (step === 5) {
        const commandSent = await sendBLECommand(`SETUP_DONE`);
        if (!commandSent) throw new Error('❌ Failed to finalize setup.');
  
        await AsyncStorage.setItem('device_setup_done', 'true');
  
        console.log('📡 Checking for available WiFi networks...');
        try {
          const wifiList = await WifiManager.loadWifiList();
          const savedWiFi = wifiList.find(network => network.SSID === 'YourWiFiSSID');
  
          if (savedWiFi) {
            console.log('✅ WiFi available, switching from BLE to WiFi mode.');
            await sendBLECommand(`CONNECT_WIFI:YourWiFiSSID:YourWiFiPassword`);
  
            // ✅ Disconnect BLE after WiFi connection
            if (selectedDevice) {
              await selectedDevice.cancelConnection();
              console.log('🔌 Disconnected from BLE');
            }
  
            await AsyncStorage.setItem('wifi_connected', 'true');
          } else {
            console.log('❌ No saved WiFi networks found.');
          }
        } catch (wifiError) {
          console.error("⚠️ Error loading WiFi list:", wifiError);
        }
  
        navigation.replace('Main');
      }
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Error', err.message);
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };
  
  
  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepsContainer}>
        {[1, 2, 3, 4].map(num => (
          <View key={num} style={[styles.step, step >= num && styles.activeStep]}>
            <Text style={[styles.stepText, step >= num && styles.activeStepText]}>{num}</Text>
          </View>
        ))}
      </View>

      <View style={styles.content}>
        {step === 1 && (
          <>
            <Text style={styles.title}>Connect Your Device</Text>
            <Text style={styles.instruction}>
              1. Ensure your Smart Tank device is powered on{'\n'}
              2. Stay within 5 meters of the device{'\n'}
              3. Enable Bluetooth on your phone
            </Text>
            <Button
              title={scanning ? 'Scanning...' : 'Scan for Devices'}
              onPress={handleScanDevices} // ✅ Call function here
              disabled={scanning}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Select a Device</Text>
            <Text style={styles.instruction}>Choose your Smart Tank device from the list below.</Text>

            {scanning ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.deviceItem,
                      selectedDevice?.id === item.id && styles.selectedDevice,
                    ]}
                    onPress={() => setSelectedDevice(item)}
                  >
                    <Text
                      style={[
                        styles.deviceText,
                        selectedDevice?.id === item.id && { color: '#fff', fontWeight: 'bold' },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}

            <Button title="Next" onPress={() => setStep(3)} disabled={!selectedDevice} />
          </>
        )}
{step === 3 && (
  <>
    <Text style={styles.title}>Configure Your Tank</Text>
    
    {/* Height Configuration */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Tank Height</Text>
      <View style={styles.buttonContainer}>
      {UNITS.map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[styles.button, heightUnit === unit && styles.selectedButton]}
            onPress={() => setHeightUnit(unit)}
          >
            <Text style={[styles.buttonText, heightUnit === unit && styles.selectedText]}>
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder={`Enter height (${heightUnit})`}
        keyboardType="numeric"
        value={tankHeight}
        onChangeText={setTankHeight}
      />
    </View>

    {/* Diameter Configuration */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Tank Diameter</Text>
      <View style={styles.buttonContainer}>
      {UNITS.map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[styles.button, diameterUnit === unit && styles.selectedButton]}
            onPress={() => setDiameterUnit(unit)}
          >
            <Text style={[styles.buttonText, diameterUnit === unit && styles.selectedText]}>
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder={`Enter diameter (${diameterUnit})`}
        keyboardType="numeric"
        value={tankDiameter}
        onChangeText={setTankDiameter}
      />
    </View>

    <Text style={styles.note}>
      Note: We'll automatically deduct {heightUnit === 'cm' ? '30cm' : heightUnit === 'ft' ? '1ft' : '12in'} from height for sensor safety
    </Text>

    <Button 
      title="Next" 
      onPress={async () => {
        if (!tankHeight || isNaN(parseFloat(tankHeight)) || 
            !tankDiameter || isNaN(parseFloat(tankDiameter))) {
          Alert.alert('Error', 'Please enter valid tank dimensions');
          return;
        }
        
        // Convert both to cm and apply safety deduction to height
        const heightValue = parseFloat(tankHeight);
        const diameterValue = parseFloat(tankDiameter);
        
        let safetyDeductedHeight = 0;
        let diameterCm = 0;
        
        // Height conversion
        switch(heightUnit) {
          case 'cm': 
            safetyDeductedHeight = heightValue - 30; 
            diameterCm = diameterValue;
            break;
          case 'ft': 
            safetyDeductedHeight = (heightValue * 30.48) - 30.48; 
            diameterCm = diameterValue * 30.48;
            break;
          case 'inches': 
            safetyDeductedHeight = (heightValue * 2.54) - 30.48; 
            diameterCm = diameterValue * 2.54;
            break;
        }
        
        // Send to ESP32
        const command = `SET_TANK_DIMENSIONS:${safetyDeductedHeight.toFixed(1)}:${diameterCm.toFixed(1)}`;
        const success = await sendBLECommand(command);
        
        if (success) {
          await AsyncStorage.multiSet([
            ['tank_height', safetyDeductedHeight.toString()],
            ['tank_height_unit', heightUnit],
            ['tank_diameter', diameterCm.toString()],
            ['tank_diameter_unit', diameterUnit]
          ]);
          setStep(4);
        }
      }}
    />
  </>
)}
        {step === 4 && (
          <>
            <Text style={styles.title}>Set Electricity/Water Cost</Text>
            <Text style={styles.instruction}>Optionally, enter your cost per unit.</Text>

            {/* Cost Type Selection */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, costType === 'electricity' && styles.selectedButton]}
                onPress={() => setCostType('electricity')}
              >
                <Text style={[styles.buttonText, costType === 'electricity' && styles.selectedText]}>
                  Electricity (per unit)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, costType === 'water' && styles.selectedButton]}
                onPress={() => setCostType('water')}
              >
                <Text style={[styles.buttonText, costType === 'water' && styles.selectedText]}>
                  Water (per liter)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Cost Input */}
            <TextInput
              style={styles.input}
              placeholder={`Enter ${costType === 'electricity' ? 'electricity unit price' : 'per liter water price'}`}
              keyboardType="numeric"
              value={cost}
              onChangeText={setCost}
            />

            <Button title="Next" onPress={() => setStep(4)} />
          </>
        )}

        {step === 5 && (
          <>
            <Text style={styles.title}>Finalizing Setup...</Text>
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
            <Button title="Finish Setup" onPress={() => Alert.alert('Setup Complete')} />
          </>
        )}

          {error !== '' && <AlertBox type="error" message={error} onClose={() => setError('')} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Layout
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  content: { 
    flex: 1, 
    padding: 20, 
    alignItems: 'center',
    justifyContent: 'flex-start' 
  },

  // Step Indicator
  stepsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    paddingVertical: 20,
    marginBottom: 10 
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  activeStep: { 
    backgroundColor: '#007AFF' 
  },
  stepText: { 
    color: '#8E8E93', 
    fontWeight: 'bold',
    fontSize: 14 
  },
  activeStepText: { 
    color: '#fff',
    fontSize: 14 
  },

  // Typography
  title: { 
    fontSize: 22, 
    fontWeight: '600', 
    marginBottom: 16, 
    textAlign: 'center',
    color: '#1C1C1E'
  },
  instruction: { 
    fontSize: 15, 
    color: '#666', 
    lineHeight: 22, 
    textAlign: 'center', 
    marginBottom: 24,
    paddingHorizontal: 20
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
    alignSelf: 'flex-start'
  },
  note: {
    color: '#666',
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20
  },
  error: { 
    color: '#FF3B30', 
    fontSize: 14, 
    textAlign: 'center', 
    marginTop: 10,
    marginBottom: 16
  },

  // Input Groups
  inputGroup: {
    marginBottom: 24,
    width: '100%'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#D1D1D6', 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 8, 
    fontSize: 16,
    backgroundColor: '#FAFAFA'
  },

  // Buttons
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16,
    width: '100%'
  },
  button: { 
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    minWidth: '30%',
    alignItems: 'center'
  },
  selectedButton: { 
    backgroundColor: '#007AFF' 
  },
  buttonText: { 
    fontSize: 15,
    color: '#1C1C1E'
  },
  selectedText: { 
    color: 'white', 
    fontWeight: '500' 
  },

  // Device List
  deviceItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  selectedDevice: { 
    backgroundColor: '#007AFF20', // 20% opacity
    borderColor: '#007AFF' 
  },
  deviceText: { 
    fontSize: 16, 
    color: '#1C1C1E' 
  },
  selectedDeviceText: {
    color: '#007AFF',
    fontWeight: '500'
  },

  // Loader
  loader: { 
    marginVertical: 32 
  },

  // Utility
  fullWidth: {
    width: '100%'
  },
  section: {
    marginBottom: 32,
    width: '100%'
  }
});

export default DeviceSetup;
