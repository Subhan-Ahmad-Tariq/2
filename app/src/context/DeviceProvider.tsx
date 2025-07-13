import React, { createContext, useContext, useState, ReactNode } from 'react';

type DeviceContextType = {
  deviceId: string | null;
  setDeviceId: (id: string | null) => void;
};

// ✅ Ensure DeviceContext is declared properly
const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  return (
    <DeviceContext.Provider value={{ deviceId, setDeviceId }}>
      {children} {/* ✅ FIXED: No need to check for text */}
    </DeviceContext.Provider>
  );
};

// ✅ Ensure useDevice hook is correctly implemented
export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
};
