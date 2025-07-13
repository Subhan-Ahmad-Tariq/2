import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocalIP } from '../../utils/network'; // ✅ Relative import
 // ✅ Import the function

// 🟢 Define the type for authentication responses
export type AuthResponse = {
  token: string;
  user: { _id: string; email: string; name: string };
  requiresDeviceSetup?: boolean;
};

// 🟢 Function to set API URL dynamically
let BASE_URL = 'http://192.168.10.12:5000/api'; // Default fallback

const initAPI = async () => {
  const localIP = await getLocalIP();
  if (localIP) {
    BASE_URL = `http://${localIP}:5000/api`; // ✅ Auto-update IP
  }
};

initAPI(); // Run on startup

const getBaseUrl = () => BASE_URL; // Always returns the latest BASE_URL

export const endpoints = {
  login: () => `${getBaseUrl()}/auth/login`,
  register: () => `${getBaseUrl()}/auth/register`,
  logout: () => `${getBaseUrl()}/auth/logout`,
  device: () => `${getBaseUrl()}/devices`,
};

// 🟢 Store Token and User Data
const storeAuthData = async (data: AuthResponse) => {
  await AsyncStorage.setItem('user_token', data.token);
  await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
};

// 🟢 Login API Call
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(endpoints.login(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }

    const data: AuthResponse = await response.json();
    await storeAuthData(data); // ✅ Store token and user data
    return data;
  } catch (error: any) {
    console.error('❌ Login Error:', error.message);
    throw new Error('Login request failed. Please check your network and try again.');
  }
};

// 🟢 Register API Call
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(endpoints.register(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
    }

    const data: AuthResponse = await response.json();
    await storeAuthData(data); // ✅ Store token and user data
    return data;
  } catch (error: any) {
    console.error('❌ Register Error:', error.message);
    throw new Error('Registration request failed. Please check your network and try again.');
  }
};

// 🟢 Logout API Call
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_data');
  } catch (error) {
    console.error('❌ Logout Error:', error);
  }
};
