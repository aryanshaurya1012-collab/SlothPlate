export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type IngredientCategory = 
  | 'Produce'
  | 'Dairy & Eggs'
  | 'Pantry & Spices'
  | 'Bakery & Grains'
  | 'Proteins'
  | 'Beverages & Condiments'
  | 'Other';

export interface Ingredient {
  id: string;
  name: string;
  estimatedQuantity: string;
  confidence: ConfidenceLevel;
  notes?: string;
  category?: IngredientCategory;
}

export type EffortLevel = 'Almost no effort' | 'Easy' | 'Normal';
export type CleanupPreference = 'One-pot or one-pan' | 'Minimal dishes' | 'No preference';
export type DietaryOption = 'No preference' | 'Vegetarian' | 'Vegan' | 'Custom';
export type BudgetPreference = 'Budget-friendly' | 'Moderate' | 'Any';

export interface UserPreferences {
  servings: number;
  cookingTimeMinutes: number; // 10, 20, 30, 45
  effortLevel: EffortLevel;
  cleanup: CleanupPreference;
  dietary: DietaryOption;
  dietaryNotes: string;
  allergiesToAvoid: string[];
  cuisine: string; // Indian, Asian, Mediterranean, Comfort food, No preference, or custom
  budget: BudgetPreference;
  pantryStaples: string[]; // e.g., ["Salt", "Black Pepper", "Olive Oil", "Garlic", "Soy Sauce"]
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  isAvailable: boolean;
  needToBuy: boolean;
  category?: IngredientCategory;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  effortLevel: EffortLevel;
  dishCount: number; // Approx cookware / dishes
  ingredients: RecipeIngredient[];
  steps: string[];
  equipment: string[];
  substitutions: string[];
  leftoverSuggestion?: string;
  isSample?: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: IngredientCategory;
  isChecked: boolean;
  isAvailable: boolean; // can be marked as already in pantry
  recipeSources: string[];
}

export interface SavedMealPlan {
  id: string;
  version: number;
  createdAt: string;
  title: string;
  confirmedIngredients: Ingredient[];
  preferences: UserPreferences;
  recipes: Recipe[];
  selectedRecipeIds: string[];
  groceryList: GroceryItem[];
}

export interface PantryAnalysisRequest {
  images: Array<{
    data: string; // Base64 without data:image/... prefix
    mimeType: string;
  }>;
  manualNotes?: string;
}

export interface MealPlanRequest {
  ingredients: Ingredient[];
  preferences: UserPreferences;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isSample?: boolean;
  modelUsed?: string;
}
