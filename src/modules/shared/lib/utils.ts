import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Prepend Vite's base URL to a runtime asset path.
// Vite rewrites string literals in HTML/JSX but not in data files,
// so anything stored as a plain string must go through this.
export function publicAssetUrl(p: string): string {
    return `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;
}
