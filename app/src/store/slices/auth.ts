import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  deviceSetupComplete: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  deviceSetupComplete: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setDeviceSetupComplete: (state, action: PayloadAction<boolean>) => {
      state.deviceSetupComplete = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetAuth: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setAuthenticated,
  setDeviceSetupComplete,
  setLoading,
  setError,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;