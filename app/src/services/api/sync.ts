import axios from 'axios';
import { endpoints } from '../../config/api';

export const syncData = async (data: any) => {
  try {
    const response = await axios.post(endpoints.sync, data);
    return response.data;
  } catch (error) {
    console.error('Error syncing data:', error);
    throw error;
  }
};