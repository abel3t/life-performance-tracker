import { ActivityType } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPointFromActivityType(type: ActivityType) {
  switch (type) {
    case ActivityType.X1:
      return 1;
    case ActivityType.X2:
      return 2;
    case ActivityType.X3:
      return 3;
    case ActivityType.X5:
      return 5;
    case ActivityType.X10:
      return 10;
  }
}