import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: 'en' | 'ur';
  theme: 'light' | 'dark';
  temperatureUnit: 'celsius' | 'fahrenheit';
  waterUnit: 'percentage' | 'liters';
  notifications: boolean;
  offlineMode: boolean;
}

const initialState: SettingsState = {
  language: 'en',
  theme: 'light',
  temperatureUnit: 'celsius',
  waterUnit: 'percentage',
  notifications: true,
  offlineMode: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'ur'>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setTemperatureUnit: (state, action: PayloadAction<'celsius' | 'fahrenheit'>) => {
      state.temperatureUnit = action.payload;
    },
    setWaterUnit: (state, action: PayloadAction<'percentage' | 'liters'>) => {
      state.waterUnit = action.payload;
    },
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload;
    },
    resetSettings: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setLanguage,
  setTheme,
  setTemperatureUnit,
  setWaterUnit,
  setNotifications,
  setOfflineMode,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;