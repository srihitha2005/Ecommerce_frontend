// LocalStorage utility functions

/**
 * Set item in localStorage with JSON stringification
 */
export const setStorageItem = (key: string, value: any): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
};

/**
 * Get item from localStorage with JSON parsing
 */
export const getStorageItem = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return null;
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Check if key exists in localStorage
 */
export const hasStorageItem = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};

/**
 * Get all keys from localStorage
 */
export const getStorageKeys = (): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  return keys;
};

// Session storage helpers
export const setSessionItem = (key: string, value: any): void => {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error setting session item ${key}:`, error);
  }
};

export const getSessionItem = (key: string): any => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting session item ${key}:`, error);
    return null;
  }
};

export const removeSessionItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing session item ${key}:`, error);
  }
};
