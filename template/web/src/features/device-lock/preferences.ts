import { appConfig } from "@/config/app";
export function deviceLockCookie(userId: number) {
  return `${appConfig.storagePrefix}.device-lock.${userId}`;
}
