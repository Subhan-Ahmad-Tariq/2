export const formatTemperature = (temp: number, unit: 'C' | 'F') => {
    return unit === 'C' ? `${temp}°C` : `${(temp * 9/5) + 32}°F`;
  };