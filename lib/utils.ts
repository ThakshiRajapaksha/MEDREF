import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally merge TailwindCSS classes
 * @param inputs Class names or conditions for class inclusion
 * @returns Merged and deduplicated class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
