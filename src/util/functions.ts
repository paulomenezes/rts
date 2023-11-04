import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 } from 'uuid';
import { Position } from './types.ts';

export function uuid() {
  return v4();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateDistance(from: Position, to: Position) {
  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

export function calculateDistance2(from: Position, to: Position) {
  return Math.sqrt(
    (from.x - to.x) * (from.x - to.x) + (from.y - to.y) * (from.y - to.y),
  );
}

export function findClosest<T extends { position: Position }>(
  items: Array<T>,
  position: Position,
  filter?: (item: T) => boolean,
) {
  return findNClosest(items, position, 1, filter).at(0);
}

export function findNClosest<T extends { position: Position }>(
  items: Array<T>,
  position: Position,
  quantity: number,
  filter?: (item: T) => boolean,
) {
  const closestItems: Record<number, T> = {};

  for (const item of items) {
    const x = item.position.x;
    const y = item.position.y;

    if (filter && !filter(item)) {
      continue;
    }

    const distance = calculateDistance(position, { x, y });

    if (!closestItems[distance]) {
      closestItems[distance] = item;
    }
  }

  return Object.values(closestItems).slice(0, quantity);
}
