import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  PIN: 'rm_pin',
  ENTRIES: 'rm_entries',
  SETTINGS: 'rm_settings',
  MOMENTS: 'rm_moments',
};

export const Storage = {
  get: async (key) => {
    try {
      const v = await AsyncStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  },
  set: async (key, val) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(val));
    } catch {}
  },
  remove: async (key) => {
    try { await AsyncStorage.removeItem(key); } catch {}
  },
};
