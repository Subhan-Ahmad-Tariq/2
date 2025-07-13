import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_KEY = '@smart_tank_sync';

export const saveSyncData = async (data: any) => {
  try {
    await AsyncStorage.setItem(SYNC_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save sync data:', error);
  }
};

export const getSyncData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SYNC_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Failed to fetch sync data:', error);
    return null;
  }
};

export const clearSyncData = async () => {
  try {
    await AsyncStorage.removeItem(SYNC_KEY);
  } catch (error) {
    console.error('Failed to clear sync data:', error);
  }
};