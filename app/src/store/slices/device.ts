import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SensorData {
  temperature: number;
  waterLevel: number;
  waterPurity: number;
  powerConsumption: number;
}

interface PumpStatus {
  isOn: boolean;
  isAutoMode: boolean;
  nextSchedule: string | null;
}

interface DeviceState {
  connected: boolean;
  name: string;
  sensorData: SensorData;
  pumpStatus: PumpStatus;
  lastSync: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  connected: false,
  name: '',
  sensorData: {
    temperature: 0,
    waterLevel: 0,
    waterPurity: 0,
    powerConsumption: 0,
  },
  pumpStatus: {
    isOn: false,
    isAutoMode: true,
    nextSchedule: null,
  },
  lastSync: null,
  loading: false,
  error: null,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setDeviceName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updateSensorData: (state, action: PayloadAction<Partial<SensorData>>) => {
      state.sensorData = { ...state.sensorData, ...action.payload };
    },
    updatePumpStatus: (state, action: PayloadAction<Partial<PumpStatus>>) => {
      state.pumpStatus = { ...state.pumpStatus, ...action.payload };
    },
    setLastSync: (state, action: PayloadAction<string>) => {
      state.lastSync = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetDevice: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setConnected,
  setDeviceName,
  updateSensorData,
  updatePumpStatus,
  setLastSync,
  setLoading,
  setError,
  resetDevice,
} = deviceSlice.actions;

export default deviceSlice.reducer;