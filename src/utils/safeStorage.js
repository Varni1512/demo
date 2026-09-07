/**
 * Safe Browser Storage Utility
 * Prevents DOMExceptions in Incognito / Private Browsing / Restricted Mobile environments
 * by automatically falling back to an in-memory Map when localStorage or sessionStorage is blocked or full.
 */

const memoryStore = new Map();
const sessionMemoryStore = new Map();

export const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const value = window.localStorage.getItem(key);
        if (value !== null) return value;
      }
    } catch (e) {
      // localStorage is blocked or restricted (e.g. Incognito / Safari Private)
    }
    return memoryStore.has(key) ? memoryStore.get(key) : null;
  },

  setItem: (key, value) => {
    const strValue = typeof value === "string" ? value : JSON.stringify(value);
    memoryStore.set(key, strValue);

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, strValue);
      }
    } catch (e) {
      // QuotaExceededError or SecurityError in Incognito mode
    }
  },

  removeItem: (key) => {
    memoryStore.delete(key);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
  },

  clear: () => {
    memoryStore.clear();
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {}
  },
};

export const safeSessionStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const value = window.sessionStorage.getItem(key);
        if (value !== null) return value;
      }
    } catch (e) {}
    return sessionMemoryStore.has(key) ? sessionMemoryStore.get(key) : null;
  },

  setItem: (key, value) => {
    const strValue = typeof value === "string" ? value : JSON.stringify(value);
    sessionMemoryStore.set(key, strValue);

    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(key, strValue);
      }
    } catch (e) {}
  },

  removeItem: (key) => {
    sessionMemoryStore.delete(key);
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch (e) {}
  },

  clear: () => {
    sessionMemoryStore.clear();
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.clear();
      }
    } catch (e) {}
  },
};

export default safeStorage;

