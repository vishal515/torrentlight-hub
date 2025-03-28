import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatSpeed(bytesPerSecond: number): string {
  return formatBytes(bytesPerSecond);
}

export function formatTimeRemaining(milliseconds: number): string {
  if (!milliseconds || !isFinite(milliseconds)) return 'Unknown';
  
  // Convert to seconds
  let seconds = Math.floor(milliseconds / 1000);
  
  // If less than a minute, show seconds
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  // Convert to minutes
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  
  // If less than an hour, show minutes and seconds
  if (minutes < 60) {
    return `${minutes}m ${seconds}s`;
  }
  
  // Convert to hours
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  // If less than a day, show hours, minutes
  if (hours < 24) {
    return `${hours}h ${remainingMinutes}m`;
  }
  
  // Convert to days
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return `${days}d ${remainingHours}h`;
}

export function shortenFileName(filename: string, maxLength: number = 40): string {
  if (!filename) return 'Unknown';
  
  if (filename.length <= maxLength) {
    return filename;
  }
  
  const extension = filename.includes('.') 
    ? filename.substring(filename.lastIndexOf('.')) 
    : '';
    
  const nameWithoutExt = filename.includes('.')
    ? filename.substring(0, filename.lastIndexOf('.'))
    : filename;
    
  // Calculate how many characters we can keep from the name
  const availableChars = maxLength - extension.length - 3; // 3 for the ellipsis
  
  if (availableChars <= 0) {
    // If we can't fit even a single character with the extension, just truncate
    return filename.substring(0, maxLength - 3) + '...';
  }
  
  const half = Math.floor(availableChars / 2);
  
  const start = nameWithoutExt.substring(0, half);
  const end = nameWithoutExt.substring(nameWithoutExt.length - half);
  
  return start + '...' + end + extension;
}
