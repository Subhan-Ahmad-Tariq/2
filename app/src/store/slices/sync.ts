import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingChanges: number;
  error: string | null;
}

const initialState: SyncState = {
  isSyncing: false,
  lastSyncTime: null,
  pendingChanges: 0,
  error: null,
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
    setLastSyncTime: (state, action: PayloadAction<string>) => {
      state.lastSyncTime = action.payload;
    },
    setPendingChanges: (state, action: PayloadAction<number>) => {
      state.pendingChanges = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetSync: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSyncing,
  setLastSyncTime,
  setPendingChanges,
  setError,
  resetSync,
} = syncSlice.actions;

export default syncSlice.reducer;