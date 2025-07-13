import WifiManager from "react-native-wifi-reborn";
import { BleManager } from "react-native-ble-plx";

const bleManager = new BleManager();
let connectedDevice = null;

export const connectToDevice = async () => {
  try {
    // Check if WiFi is available
    const wifiSSID = await WifiManager.getCurrentWifiSSID();

    if (wifiSSID) {
      console.log("✅ WiFi available, using VPS mode...");
      return "WIFI_MODE";
    } else {
      console.log("⚠️ No WiFi, switching to BLE...");
      
      // Start BLE scan
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error("BLE Scan Error:", error);
          return;
        }
        if (device.name === "ESP32_BLE") {
          bleManager.stopDeviceScan();
          connectedDevice = device;
          device.connect().then(() => {
            console.log("✅ Connected to ESP32 via BLE");
          });
        }
      });
      return "BLE_MODE";
    }
  } catch (error) {
    console.error("Error in connection:", error);
  }
};

export const disconnectFromDevice = async () => {
  if (connectedDevice) {
    await connectedDevice.disconnect();
    console.log("Disconnected from ESP32");
  }
};
