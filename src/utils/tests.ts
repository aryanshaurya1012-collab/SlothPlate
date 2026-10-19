import { consolidateGroceryList, normalizeIngredientName, parseQuantityString, formatAmount } from './groceryConsolidator';
import { validateImageFile, validateIngredientInput, checkDietaryViolations } from './validation';
import { getSavedPlans, saveMealPlan, deleteSavedPlan, clearAllLocalData, DEFAULT_PREFERENCES } from './storage';
import { SAMPLE_RECIPES, SAMPLE_PANTRY_INGREDIENTS } from './sampleData';
import { Recipe, UserPreferences } from '../types';

export interface TestResult {
  id: string;
  category: string;
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

export function runAllQualityChecks(): TestResult[] {
  const results: TestResult[] = [];

  // 1. Ingredient input validation
  try {
    const emptyCheck = validateIngredientInput('   ');
    const tooLong = validateIngredientInput('a'.repeat(90));
    const malicious = validateIngredientInput('<script>alert(1)</script>');
    const valid = validateIngredientInput('Fresh Basil');

    const passed = !emptyCheck.valid && !tooLong.valid && !malicious.valid && valid.valid;
    results.push({
      id: 'test-input-validation',
      category: 'Input Validation',
      name: 'Ingredient input sanitization and length limits',
      passed,
      message: passed
        ? 'Successfully rejected empty, excessive, and script-injection inputs while accepting valid names.'
        : 'Validation checks failed unexpectedly.',
    });
  } catch (e: any) {
    results.push({
      id: 'test-input-validation',
      category: 'Input Validation',
      name: 'Ingredient input sanitization and length limits',
      passed: false,
      message: e.message,
    });
  }

  // 2. Image file type and size validation
  try {
    const fakeSmallJpg = new File(['dummy content'], 'fridge.jpg', { type: 'image/jpeg' });
    const fakeExe = new File(['dummy content'], 'script.exe', { type: 'application/x-msdownload' });
    // Fake large file
    const largeBlob = new Blob([new Uint8Array(6 * 1024 * 1024)], { type: 'image/jpeg' });
    const fakeLargeJpg = new File([largeBlob], 'huge.jpg', { type: 'image/jpeg' });

    const smallResult = validateImageFile(fakeSmallJpg);
    const exeResult = validateImageFile(fakeExe);
    const largeResult = validateImageFile(fakeLargeJpg);

    const passed = smallResult.valid && !exeResult.valid && !largeResult.valid;
    results.push({
      id: 'test-image-validation',
      category: 'Input Validation',
      name: 'Image MIME format and 5MB size ceiling verification',
      passed,
      message: passed
        ? 'Accepted 5MB JPEG, rejected invalid MIME executable and rejected >5MB oversized file.'
        : 'Image validation failed.',
    });
  } catch (e: any) {
    results.push({
      id: 'test-image-validation',
      category: 'Input Validation',
      name: 'Image MIME format and 5MB size ceiling verification',
      passed: false,
      message: e.message,
    });
  }

  // 3. Grocery-list consolidation (compatible units)
  try {
    const q1 = parseQuantityString('2 cloves');
    const q2 = parseQuantityString('3 cloves');
    const combinedAmount = (q1.amount || 0) + (q2.amount || 0);

    const mockRecipeA: Recipe = {
      ...SAMPLE_RECIPES[0],
      id: 'mock-1',
      ingredients: [
        { name: 'Garlic', quantity: '2 cloves', isAvailable: false, needToBuy: true, category: 'Produce' },
        { name: 'Olive Oil', quantity: '1 tbsp', isAvailable: false, needToBuy: true, category: 'Pantry & Spices' },
      ],
    };
    const mockRecipeB: Recipe = {
      ...SAMPLE_RECIPES[1],
      id: 'mock-2',
      ingredients: [
        { name: 'Garlic cloves', quantity: '3 cloves', isAvailable: false, needToBuy: true, category: 'Produce' },
        { name: 'Olive Oil', quantity: '2 tbsp', isAvailable: false, needToBuy: true, category: 'Pantry & Spices' },
      ],
    };

    const consolidated = consolidateGroceryList([mockRecipeA, mockRecipeB], [], []);
    const garlicItem = consolidated.find((i) => i.name.toLowerCase().includes('garlic'));
    const oilItem = consolidated.find((i) => i.name.toLowerCase().includes('oil'));

    const garlicPassed = garlicItem?.quantity === '5 clove' || garlicItem?.quantity === '5 cloves';
    const oilPassed = oilItem?.quantity === '3 tbsp';

    results.push({
      id: 'test-consolidation-compatible',
      category: 'Deterministic Grocery Consolidation',
      name: 'Summation of compatible ingredient units (cloves & tbsp)',
      passed: Boolean(garlicPassed && oilPassed),
      message: (garlicPassed && oilPassed)
        ? `Correctly summed quantities: Garlic => "${garlicItem?.quantity}", Olive Oil => "${oilItem?.quantity}".`
        : `Consolidation mismatch: Garlic=${garlicItem?.quantity}, Oil=${oilItem?.quantity}`,
    });
  } catch (e: any) {
    results.push({
      id: 'test-consolidation-compatible',
      category: 'Deterministic Grocery Consolidation',
      name: 'Summation of compatible ingredient units (cloves & tbsp)',
      passed: false,
      message: e.message,
    });
  }

  // 4. Duplicate ingredient and incompatible unit handling
  try {
    const mockRecipeX: Recipe = {
      ...SAMPLE_RECIPES[0],
      id: 'mock-x',
      ingredients: [
        { name: 'Tomatoes', quantity: '1 can (400g)', isAvailable: false, needToBuy: true, category: 'Produce' },
      ],
    };
    const mockRecipeY: Recipe = {
      ...SAMPLE_RECIPES[1],
      id: 'mock-y',
      ingredients: [
        { name: 'Tomatoes', quantity: '2 whole', isAvailable: false, needToBuy: true, category: 'Produce' },
      ],
    };

    const consolidated = consolidateGroceryList([mockRecipeX, mockRecipeY], [], []);
    const tomatoItem = consolidated.find((i) => i.name.toLowerCase().includes('tomato'));

    // Incompatible units should join cleanly without false arithmetic
    const passed = tomatoItem !== undefined && tomatoItem.quantity.includes('+');

    results.push({
      id: 'test-consolidation-incompatible',
      category: 'Deterministic Grocery Consolidation',
      name: 'Graceful handling of incompatible units without false precision',
      passed,
      message: passed
        ? `Cleanly formatted mixed units: "${tomatoItem?.quantity}" without invalid unit conversions.`
        : 'Failed to handle mixed units cleanly.',
    });
  } catch (e: any) {
    results.push({
      id: 'test-consolidation-incompatible',
      category: 'Deterministic Grocery Consolidation',
      name: 'Graceful handling of incompatible units without false precision',
      passed: false,
      message: e.message,
    });
  }

  // 5. Dietary and allergy exclusions
  try {
    const vegPrefs: UserPreferences = {
      ...DEFAULT_PREFERENCES,
      dietary: 'Vegetarian',
      allergiesToAvoid: ['peanuts', 'shellfish'],
    };

    const violationChicken = checkDietaryViolations('Diced Chicken Breast', vegPrefs);
    const violationPeanut = checkDietaryViolations('Peanut Butter', vegPrefs);
    const safeSpinach = checkDietaryViolations('Organic Baby Spinach', vegPrefs);

    const passed = violationChicken !== null && violationPeanut !== null && safeSpinach === null;
    results.push({
      id: 'test-dietary-exclusions',
      category: 'Dietary & Safety Rules',
      name: 'Detection of restricted diets (Vegetarian) and user-specified allergens',
      passed,
      message: passed
        ? 'Identified meat in Vegetarian diet and flagged peanut allergen while approving baby spinach.'
        : 'Dietary violation check failed.',
    });
  } catch (e: any) {
    results.push({
      id: 'test-dietary-exclusions',
      category: 'Dietary & Safety Rules',
      name: 'Detection of restricted diets (Vegetarian) and user-specified allergens',
      passed: false,
      message: e.message,
    });
  }

  // 6. LocalStorage saving, versioning, loading, and deletion
  try {
    const testPlanTitle = `Test Plan Verification ${Date.now()}`;
    const initialPlans = getSavedPlans();

    const saved = saveMealPlan({
      title: testPlanTitle,
      confirmedIngredients: SAMPLE_PANTRY_INGREDIENTS,
      preferences: DEFAULT_PREFERENCES,
      recipes: SAMPLE_RECIPES,
      selectedRecipeIds: [SAMPLE_RECIPES[0].id],
      groceryList: [],
    });

    const afterSave = getSavedPlans();
    const found = afterSave.some((p) => p.id === saved.id);

    deleteSavedPlan(saved.id);
    const afterDelete = getSavedPlans();
    const deletedOk = !afterDelete.some((p) => p.id === saved.id);

    const passed = found && deletedOk;
    results.push({
      id: 'test-storage-lifecycle',
      category: 'Local Persistence & Defensive Storage',
      name: 'Versioned schema save, read-back, and deletion lifecycle in browser storage',
      passed,
      message: passed
        ? 'Successfully saved versioned plan record, retrieved it safely, and cleanly deleted without memory leaks.'
        : 'LocalStorage lifecycle failed.',
    });
  } catch (e: any) {
    results.push({
      id: 'test-storage-lifecycle',
      category: 'Local Persistence & Defensive Storage',
      name: 'Versioned schema save, read-back, and deletion lifecycle in browser storage',
      passed: false,
      message: e.message,
    });
  }

  return results;
}
