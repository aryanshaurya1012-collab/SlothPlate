import { GroceryItem, Ingredient, IngredientCategory, Recipe } from '../types';

interface ParsedQuantity {
  amount: number | null;
  unit: string;
  originalText: string;
}

// Common unit normalizations
const UNIT_MAP: Record<string, string> = {
  tbsp: 'tbsp',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  tsp: 'tsp',
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  cup: 'cup',
  cups: 'cup',
  clove: 'clove',
  cloves: 'clove',
  can: 'can',
  cans: 'can',
  g: 'g',
  gram: 'g',
  grams: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'L',
  liter: 'L',
  liters: 'L',
  oz: 'oz',
  ounce: 'oz',
  ounces: 'oz',
  slice: 'slice',
  slices: 'slice',
  bunch: 'bunch',
  bunches: 'bunch',
  pinch: 'pinch',
  pinches: 'pinch',
  piece: 'pc',
  pieces: 'pc',
  stalk: 'stalk',
  stalks: 'stalk',
};

// Normalize ingredient names for grouping
export function normalizeIngredientName(name: string): string {
  let cleaned = name.toLowerCase().trim();
  // Strip common qualifiers
  cleaned = cleaned.replace(/^(fresh|dried|chopped|diced|minced|grated|sliced|canned|organic)\s+/i, '');
  cleaned = cleaned.replace(/\s+(chopped|diced|minced|grated|sliced|to taste|for garnish)$/i, '');
  
  // Singularization heuristics
  if (cleaned.endsWith('tomatoes')) cleaned = cleaned.replace(/tomatoes$/, 'tomato');
  else if (cleaned.endsWith('potatoes')) cleaned = cleaned.replace(/potatoes$/, 'potato');
  else if (cleaned.endsWith('berries')) cleaned = cleaned.replace(/berries$/, 'berry');
  else if (cleaned.endsWith('leaves')) cleaned = cleaned.replace(/leaves$/, 'leaf');
  else if (cleaned.endsWith('es') && !cleaned.endsWith('cheese') && !cleaned.endsWith('sauce')) {
    cleaned = cleaned.slice(0, -2);
  } else if (cleaned.endsWith('s') && !cleaned.endsWith('ss') && !cleaned.endsWith('couscous') && !cleaned.endsWith('hummus')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned.trim();
}

// Parse fractional and decimal strings like "1 1/2", "1/2", "3.5", "2"
export function parseQuantityString(str: string): ParsedQuantity {
  const trimmed = (str || '').trim().toLowerCase();
  if (!trimmed) {
    return { amount: null, unit: '', originalText: '' };
  }

  // Regex pattern for: [whole] [fraction] or [decimal] followed by unit
  // e.g. "1 1/2 cups", "2.5 tbsp", "4 cloves", "1 can (400g)"
  const regex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/i;
  const match = trimmed.match(regex);

  if (!match) {
    return { amount: null, unit: '', originalText: trimmed };
  }

  const rawNum = match[1];
  const rawUnit = match[2] ? match[2].toLowerCase() : '';
  const normalizedUnit = UNIT_MAP[rawUnit] || rawUnit || '';

  let amount: number | null = null;
  if (rawNum.includes('/')) {
    if (rawNum.includes(' ')) {
      const [whole, frac] = rawNum.split(' ');
      const [num, den] = frac.split('/');
      amount = parseFloat(whole) + parseFloat(num) / parseFloat(den);
    } else {
      const [num, den] = rawNum.split('/');
      amount = parseFloat(num) / parseFloat(den);
    }
  } else {
    amount = parseFloat(rawNum);
  }

  return {
    amount: isNaN(amount) ? null : amount,
    unit: normalizedUnit,
    originalText: trimmed,
  };
}

export function formatAmount(amount: number): string {
  if (Math.abs(amount - Math.round(amount)) < 0.05) {
    return Math.round(amount).toString();
  }
  const frac = amount - Math.floor(amount);
  const whole = Math.floor(amount);
  const wholeStr = whole > 0 ? `${whole} ` : '';

  if (Math.abs(frac - 0.5) < 0.06) return `${wholeStr}1/2`;
  if (Math.abs(frac - 0.25) < 0.06) return `${wholeStr}1/4`;
  if (Math.abs(frac - 0.75) < 0.06) return `${wholeStr}3/4`;
  if (Math.abs(frac - 0.33) < 0.06) return `${wholeStr}1/3`;
  if (Math.abs(frac - 0.67) < 0.06) return `${wholeStr}2/3`;

  return amount.toFixed(1).replace(/\.0$/, '');
}

// Assign default category based on ingredient name
export function inferCategory(name: string): IngredientCategory {
  const lower = name.toLowerCase();
  
  if (/(tomato|onion|garlic|spinach|carrot|broccoli|pepper|cucumber|potato|ginger|cilantro|parsley|lettuce|lemon|lime|avocado|mushroom|zucchini|cabbage|apple|banana|berry|basil)/.test(lower)) {
    return 'Produce';
  }
  if (/(cheese|milk|butter|egg|yogurt|cream|parmesan|mozzarella|paneer|cheddar)/.test(lower)) {
    return 'Dairy & Eggs';
  }
  if (/(rice|pasta|noodle|bread|flour|oat|quinoa|tortilla|sourdough|spaghetti)/.test(lower)) {
    return 'Bakery & Grains';
  }
  if (/(chicken|beef|pork|fish|salmon|tofu|lentil|bean|chickpea|tuna|shrimp|turkey|tempeh)/.test(lower)) {
    return 'Proteins';
  }
  if (/(oil|olive oil|salt|black pepper|cumin|turmeric|paprika|chili|oregano|sugar|vinegar|soy sauce|curry|cinnamon|mustard|honey)/.test(lower)) {
    return 'Pantry & Spices';
  }
  return 'Other';
}

/**
 * Deterministically consolidate ingredients from selected recipes into a shopping list.
 */
export function consolidateGroceryList(
  selectedRecipes: Recipe[],
  confirmedPantry: Ingredient[] = [],
  pantryStaples: string[] = []
): GroceryItem[] {
  const pantryNames = new Set(
    confirmedPantry.map((i) => normalizeIngredientName(i.name))
  );
  const stapleNames = new Set(
    pantryStaples.map((s) => normalizeIngredientName(s))
  );

  // Group by normalized name
  const grouped = new Map<
    string,
    {
      displayName: string;
      category: IngredientCategory;
      sources: Set<string>;
      quantities: ParsedQuantity[];
      isAlreadyInPantry: boolean;
    }
  >();

  selectedRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      const norm = normalizeIngredientName(ing.name);
      if (!norm) return;

      const isPantry = pantryNames.has(norm) || stapleNames.has(norm) || ing.isAvailable;

      if (!grouped.has(norm)) {
        grouped.set(norm, {
          displayName: ing.name.charAt(0).toUpperCase() + ing.name.slice(1),
          category: ing.category || inferCategory(ing.name),
          sources: new Set([recipe.title]),
          quantities: [],
          isAlreadyInPantry: isPantry,
        });
      }

      const entry = grouped.get(norm)!;
      entry.sources.add(recipe.title);
      // If either recipe marks it as not available, user might need to buy it unless it's in pantry
      if (ing.isAvailable && !entry.isAlreadyInPantry) {
        entry.isAlreadyInPantry = true;
      }

      const parsed = parseQuantityString(ing.quantity);
      entry.quantities.push(parsed);
    });
  });

  const groceryItems: GroceryItem[] = [];

  grouped.forEach((data, normKey) => {
    // Attempt deterministic combination of quantities
    let consolidatedQuantity = '';
    const hasOnlyNumericWithSameUnit =
      data.quantities.length > 0 &&
      data.quantities.every((q) => q.amount !== null && q.unit === data.quantities[0].unit);

    if (hasOnlyNumericWithSameUnit && data.quantities[0].amount !== null) {
      const totalAmount = data.quantities.reduce((acc, q) => acc + (q.amount || 0), 0);
      const unit = data.quantities[0].unit;
      consolidatedQuantity = unit ? `${formatAmount(totalAmount)} ${unit}` : `${formatAmount(totalAmount)}`;
    } else {
      // Incompatible units or descriptive quantities: join distinct textual representations cleanly
      const distinctTexts = Array.from(
        new Set(
          data.quantities
            .map((q) => q.originalText)
            .filter((t) => t && t.length > 0)
        )
      );
      consolidatedQuantity = distinctTexts.length > 0 ? distinctTexts.join(' + ') : 'As needed';
    }

    groceryItems.push({
      id: `grocery-${normKey}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.displayName,
      quantity: consolidatedQuantity,
      category: data.category,
      isChecked: false,
      isAvailable: data.isAlreadyInPantry,
      recipeSources: Array.from(data.sources),
    });
  });

  // Sort by category order then name
  const categoryOrder: Record<IngredientCategory, number> = {
    Produce: 1,
    'Dairy & Eggs': 2,
    'Bakery & Grains': 3,
    Proteins: 4,
    'Pantry & Spices': 5,
    'Beverages & Condiments': 6,
    Other: 7,
  };

  return groceryItems.sort((a, b) => {
    const catDiff = (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
    if (catDiff !== 0) return catDiff;
    return a.name.localeCompare(b.name);
  });
}
