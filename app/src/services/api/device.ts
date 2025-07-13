import axios, { AxiosResponse } from 'axios';

const API_URL = 'https://api.example.com/device';

export const getDeviceData = async (deviceId: string): Promise<any> => {
  const response: AxiosResponse = await axios.get(`${API_URL}/${deviceId}`);
  return response.data;
};

export const updateDeviceSettings = async (deviceId: string, settings: any): Promise<any> => {
  const response: AxiosResponse = await axios.put(`${API_URL}/${deviceId}/settings`, settings);
  return response.data;
};
