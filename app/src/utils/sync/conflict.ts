export const resolveConflict = (localData: any, remoteData: any) => {
    // Implement conflict resolution logic
    // For example, prefer remote data or merge changes
    return { ...localData, ...remoteData }; // Simple merge example
  };