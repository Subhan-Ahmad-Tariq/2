import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@smart_tank_queue';

export const enqueue = async (item: any) => {
  try {
    const queue = await getQueue();
    queue.push(item);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to enqueue item:', error);
  }
};

export const dequeue = async () => {
  try {
    const queue = await getQueue();
    const item = queue.shift();
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return item;
  } catch (error) {
    console.error('Failed to dequeue item:', error);
    return null;
  }
};

export const getQueue = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(QUEUE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Failed to fetch queue:', error);
    return [];
  }
};

export const clearQueue = async () => {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    console.error('Failed to clear queue:', error);
  }
};