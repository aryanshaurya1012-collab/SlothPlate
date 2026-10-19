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
  const plans = safeParse<SavedMealPlan[]>(localStorage.getItem(STORAGE_KEYS.MEAL_PLANS), []);
  if (!Array.isArray(plans)) return [];
  // Ensure each plan has minimal valid fields
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

  const updated = [newPlan, ...existing.slice(0, 19)]; // Keep up to 20 plans
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(updated));
  } catch (e) {
    console.error('SlothPlate: Failed to save meal plan to localStorage', e);
  }
  return newPlan;
}

export function updateSavedPlan(planId: string, updates: Partial<SavedMealPlan>): boolean {
  const existing = getSavedPlans();
  const index = existing.findIndex((p) => p.id === planId);
  if (index === -1) return false;

  existing[index] = { ...existing[index], ...updates };
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(existing));
    return true;
  } catch (e) {
    console.error('SlothPlate: Failed to update meal plan', e);
    return false;
  }
}

export function deleteSavedPlan(id: string): boolean {
  const existing = getSavedPlans();
  const filtered = existing.filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('SlothPlate: Failed to delete meal plan', e);
    return false;
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.MEAL_PLANS);
    localStorage.removeItem(STORAGE_KEYS.PANTRY);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  } catch (e) {
    console.error('SlothPlate: Failed to clear local storage', e);
  }
}

export function getLastPantry(): Ingredient[] {
  const pantry = safeParse<Ingredient[]>(localStorage.getItem(STORAGE_KEYS.PANTRY), []);
  return Array.isArray(pantry) ? pantry : [];
}

export function saveLastPantry(pantry: Ingredient[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(pantry));
  } catch (e) {
    console.warn('SlothPlate: Failed to save pantry to localStorage', e);
  }
}

export function getLastPreferences(): UserPreferences {
  const saved = safeParse<Partial<UserPreferences>>(
    localStorage.getItem(STORAGE_KEYS.PREFERENCES),
    DEFAULT_PREFERENCES
  );
  return { ...DEFAULT_PREFERENCES, ...saved };
}

export function saveLastPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.warn('SlothPlate: Failed to save preferences to localStorage', e);
  }
}
