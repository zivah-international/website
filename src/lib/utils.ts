import { twMerge } from 'tailwind-merge';

type ClassName = string | false | null | undefined;

export function cn(...inputs: ClassName[]) {
  return twMerge(inputs.filter(Boolean).join(' '));
}
