// src/hooks/useNotificationSystem.ts
import { useCallback } from "react";

export function useNotificationSystem() {
  const sendNotification = useCallback((title: string, message: string) => {
    console.log(`[Notification] ${title}: ${message}`);
  }, []);

  return { sendNotification };
}
