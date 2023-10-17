import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fallbackDisplayname (displayName?: string) {
  if(!displayName) return "UN"
  return displayName?.slice(0, 2).toUpperCase()
}
