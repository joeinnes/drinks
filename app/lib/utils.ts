import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiKey = "user@example.com";
export const appName = "Drinks";
export const appDescription = "Log your drinks and estimate your BAC";
export const DECAY_RATE = 0.016;
