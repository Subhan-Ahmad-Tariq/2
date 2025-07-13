import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import deviceReducer from './slices/device';
import settingsReducer from './slices/settings';
import syncReducer from './slices/sync';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
    settings: settingsReducer,
    sync: syncReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;