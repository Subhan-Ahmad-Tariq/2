import AsyncStorage from '@react-native-async-storage/async-storage';

const DATABASE_KEY = '@smart_tank_db';

export const saveData = async (data: any) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(DATABASE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save data', e);
  }
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(DATABASE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to fetch data', e);
  }
};