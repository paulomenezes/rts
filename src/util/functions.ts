import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 } from 'uuid';

export function uuid() {
  return v4();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
