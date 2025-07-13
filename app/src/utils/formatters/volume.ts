export const formatVolume = (volume: number, unit: 'L' | 'mL') => {
    return unit === 'L' ? `${volume}L` : `${volume * 1000}mL`;
  };