import { GroceryItem, Ingredient, SavedMealPlan, UserPreferences } from '../types';

const STORAGE_VERSION = 1;
const STORAGE_KEYS = {
  MEAL_PLANS: 'slothplate_saved_plans_v1',
  PANTRY: 'slothplate_pantry_v1',
  PREFERENCES: 'slothplate_preferences_v1',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  servings: 2,
  cookingTimeMinutes: 20,
  effortLevel: 'Almost no effort',
  cleanup: 'One-pot or one-pan',
  dietary: 'No preference',
  dietaryNotes: '',
  allergiesToAvoid: [],
  cuisine: 'No preference',
  budget: 'Budget-friendly',
  pantryStaples: ['Salt', 'Black pepper', 'Olive oil', 'Garlic'],
};

// In-memory fallback for environments where browser localStorage is unavailable (e.g. CLI tests)
const memoryStore = new Map<string, string>();

function getStorageItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch (e) {
    console.warn('Storage read warning', e);
  }
  return memoryStore.get(key) ?? null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
  } catch (e) {
    console.warn('Storage write warning', e);
  }
  memoryStore.set(key, value);
}

function removeStorageItem(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
  } catch (e) {
    console.warn('Storage remove warning', e);
  }
  memoryStore.delete(key);
}

/**
 * Defensive JSON parse that never throws and validates basic structure.
 */
function safeParse<T>(jsonStr: string | null, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed ?? fallback;
  } catch (err) {
    console.warn('SlothPlate: Corrupted localStorage item encountered, resetting to fallback.', err);
    return fallback;
  }
}

export function getSavedPlans(): SavedMealPlan[] {
  const plans = safeParse<SavedMealPlan[]>(getStorageItem(STORAGE_KEYS.MEAL_PLANS), []);
  if (!Array.isArray(plans)) return [];
  return plans.filter((p) => p && typeof p.id === 'string' && Array.isArray(p.recipes));
}

export function saveMealPlan(plan: Omit<SavedMealPlan, 'id' | 'version' | 'createdAt'>): SavedMealPlan {
  const existing = getSavedPlans();
  const newPlan: SavedMealPlan = {
    ...plan,
    id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    version: STORAGE_VERSION,
    createdAt: new Date().toISOString(),
  };

  const updated = [newPlan, ...existing.slice(0, 19)];
  setStorageItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(updated));
  return newPlan;
}

export function updateSavedPlan(planId: string, updates: Partial<SavedMealPlan>): boolean {
  const existing = getSavedPlans();
  const index = existing.findIndex((p) => p.id === planId);
  if (index === -1) return false;

  existing[index] = { ...existing[index], ...updates };
  setStorageItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(existing));
  return true;
}

export function deleteSavedPlan(id: string): boolean {
  const existing = getSavedPlans();
  const filtered = existing.filter((p) => p.id !== id);
  setStorageItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(filtered));
  return true;
}

export function clearAllLocalData(): void {
  removeStorageItem(STORAGE_KEYS.MEAL_PLANS);
  removeStorageItem(STORAGE_KEYS.PANTRY);
  removeStorageItem(STORAGE_KEYS.PREFERENCES);
  memoryStore.clear();
}

export function getLastPantry(): Ingredient[] {
  const pantry = safeParse<Ingredient[]>(getStorageItem(STORAGE_KEYS.PANTRY), []);
  return Array.isArray(pantry) ? pantry : [];
}

export function saveLastPantry(pantry: Ingredient[]): void {
  setStorageItem(STORAGE_KEYS.PANTRY, JSON.stringify(pantry));
}

export function getLastPreferences(): UserPreferences {
  const saved = safeParse<Partial<UserPreferences>>(
    getStorageItem(STORAGE_KEYS.PREFERENCES),
    DEFAULT_PREFERENCES
  );
  return { ...DEFAULT_PREFERENCES, ...saved };
}

export function saveLastPreferences(prefs: UserPreferences): void {
  setStorageItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
}
