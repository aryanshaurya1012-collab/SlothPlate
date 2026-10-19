import { Ingredient, UserPreferences } from '../types';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format "${file.type || 'unknown'}". Allowed formats: JPEG, PNG, WebP.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum size per photo is 5 MB.`,
    };
  }

  return { valid: true };
}

export function validateIngredientInput(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: 'Ingredient name cannot be empty.' };
  }
  if (trimmed.length > 80) {
    return { valid: false, error: 'Ingredient name is too long (maximum 80 characters).' };
  }
  // Basic security check against potential prompt injection or HTML tags
  if (/[<>{}]/.test(trimmed)) {
    return { valid: false, error: 'Ingredient name contains invalid characters.' };
  }
  return { valid: true };
}

export function sanitizeIngredientName(name: string): string {
  return name.replace(/[<>{}]/g, '').trim();
}

export function checkDietaryViolations(
  ingredientName: string,
  preferences: UserPreferences
): string | null {
  const lower = ingredientName.toLowerCase();
  
  // Vegetarian check
  if (preferences.dietary === 'Vegetarian') {
    if (/(chicken|beef|pork|bacon|fish|salmon|tuna|turkey|meat|steak|gelatin|lard|anchovy)/i.test(lower)) {
      return `Vegetarian restriction: "${ingredientName}" is typically animal-based.`;
    }
  }

  // Vegan check
  if (preferences.dietary === 'Vegan') {
    if (/(chicken|beef|pork|bacon|fish|salmon|tuna|turkey|meat|cheese|milk|butter|egg|yogurt|honey|cream|whey|gelatin)/i.test(lower)) {
      return `Vegan restriction: "${ingredientName}" contains animal or dairy products.`;
    }
  }

  // Allergy / Avoid check
  for (const avoid of preferences.allergiesToAvoid) {
    const avoidClean = avoid.trim().toLowerCase();
    if (avoidClean && lower.includes(avoidClean)) {
      return `Allergy exclusion: "${ingredientName}" matches excluded item "${avoid}".`;
    }
  }

  return null;
}
