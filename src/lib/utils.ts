import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Safely renders markdown-like content for lyrics
 * This is a simple implementation - you can enhance with react-markdown later
 */
export function sanitizeLyrics(content: string): string {
  // Basic sanitization - escape HTML but preserve line breaks
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Splits lyrics content into verses for ad placement
 */
export function splitIntoVerses(content: string): string[] {
  return content.split(/\n\s*\n/).filter((verse) => verse.trim().length > 0)
}

