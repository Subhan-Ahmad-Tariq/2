export const calculateDailyWaterUsage = (readings: number[]) => {
    const totalUsage = readings.reduce((acc, curr) => acc + curr, 0);
    return totalUsage / readings.length; // Average daily usage
  };
  
  export const calculateWeeklyWaterUsage = (dailyUsages: number[]) => {
    return dailyUsages.reduce((acc, curr) => acc + curr, 0); // Total weekly usage
  };