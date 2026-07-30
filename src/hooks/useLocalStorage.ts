// src/hooks/useLocalStorage.ts
import { useState, useCallback } from "react";

/*
  useLocalStorage Hook
  
  مثل useState عمل می‌کنه ولی مقدار رو توی localStorage ذخیره می‌کنه.
  وقتی صفحه رفرش بشه، مقدار از بین نمیره.
  
  کاربرد: ذخیره watchlist، تنظیمات کاربر، تم و...
*/

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          console.warn(`Failed to save "${key}" to localStorage`);
        }
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {
      console.warn(`Failed to remove "${key}" from localStorage`);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
