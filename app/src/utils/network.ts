import DeviceInfo from 'react-native-device-info';

export const getLocalIP = async () => {
  try {
    const ip = await DeviceInfo.getIpAddress();
    console.log('🌍 Local IP:', ip);
    return ip;
  } catch (error) {
    console.error('❌ Error getting local IP:', error);
    return null;
  }
};
