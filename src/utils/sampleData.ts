import { Ingredient, Recipe, UserPreferences } from '../types';

export const SAMPLE_PANTRY_INGREDIENTS: Ingredient[] = [
  {
    id: 'sample-ing-1',
    name: 'Eggs',
    estimatedQuantity: '6 pcs',
    confidence: 'high',
    notes: 'Carton on top shelf',
    category: 'Dairy & Eggs',
  },
  {
    id: 'sample-ing-2',
    name: 'Sharp Cheddar Cheese',
    estimatedQuantity: '200g block',
    confidence: 'high',
    notes: 'In cheese drawer',
    category: 'Dairy & Eggs',
  },
  {
    id: 'sample-ing-3',
    name: 'Baby Spinach',
    estimatedQuantity: '1 bag (150g)',
    confidence: 'high',
    notes: 'Crisper drawer, fresh',
    category: 'Produce',
  },
  {
    id: 'sample-ing-4',
    name: 'Cherry Tomatoes',
    estimatedQuantity: '1 punnet (~250g)',
    confidence: 'high',
    notes: 'Ripe and firm',
    category: 'Produce',
  },
  {
    id: 'sample-ing-5',
    name: 'Sourdough Bread',
    estimatedQuantity: '4-6 slices',
    confidence: 'high',
    notes: 'In bread bin',
    category: 'Bakery & Grains',
  },
  {
    id: 'sample-ing-6',
    name: 'Garlic',
    estimatedQuantity: '4 cloves',
    confidence: 'medium',
    notes: 'Pantry basket',
    category: 'Produce',
  },
];

export const SAMPLE_PREFERENCES: UserPreferences = {
  servings: 2,
  cookingTimeMinutes: 15,
  effortLevel: 'Almost no effort',
  cleanup: 'One-pot or one-pan',
  dietary: 'Vegetarian',
  dietaryNotes: 'Quick weeknight dinner',
  allergiesToAvoid: [],
  cuisine: 'Comfort food',
  budget: 'Budget-friendly',
  pantryStaples: ['Salt', 'Black pepper', 'Olive oil', 'Butter'],
};

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'sample-rec-1',
    title: 'One-Pan Cheesy Spinach & Egg Fold',
    description: 'A plush, 12-minute folded egg scramble loaded with wilted greens and melted sharp cheddar. Zero dirty prep bowls.',
    servings: 2,
    prepTimeMinutes: 3,
    cookTimeMinutes: 9,
    totalTimeMinutes: 12,
    effortLevel: 'Almost no effort',
    dishCount: 1,
    isSample: true,
    ingredients: [
      { name: 'Eggs', quantity: '4 pcs', isAvailable: true, needToBuy: false, category: 'Dairy & Eggs' },
      { name: 'Baby Spinach', quantity: '2 handfuls (~80g)', isAvailable: true, needToBuy: false, category: 'Produce' },
      { name: 'Sharp Cheddar Cheese', quantity: '50g grated or sliced', isAvailable: true, needToBuy: false, category: 'Dairy & Eggs' },
      { name: 'Butter or Olive Oil', quantity: '1 tbsp', isAvailable: true, needToBuy: false, category: 'Pantry & Spices' },
      { name: 'Salt & Black Pepper', quantity: 'Pinch each', isAvailable: true, needToBuy: false, category: 'Pantry & Spices' },
      { name: 'Sourdough Bread', quantity: '2 slices (toasted)', isAvailable: true, needToBuy: false, category: 'Bakery & Grains' },
    ],
    steps: [
      'Warm a medium non-stick skillet over medium-low heat with 1 tbsp butter or olive oil.',
      'Toss in 2 big handfuls of baby spinach. Stir for 60 seconds until just wilted.',
      'Crack the 4 eggs directly into the pan right over the spinach. Season with a pinch of salt and pepper.',
      'Using a spatula, gently break the yolks and fold in slow circular sweeps for 2 minutes until soft curds form.',
      'Scatter the cheddar over the top. Turn off heat, cover with a lid or plate for 1 minute to melt.',
      'Slide directly onto plates alongside toasted sourdough bread.'
    ],
    equipment: ['Medium non-stick skillet', 'Silicone spatula'],
    substitutions: [
      'Substitute cheddar with mozzarella, feta, or goat cheese if available.',
      'Substitute baby spinach with kale or arugula.'
    ],
    leftoverSuggestion: 'Any extra eggs can be tucked inside a warm tortilla or pita for breakfast tomorrow.'
  },
  {
    id: 'sample-rec-2',
    title: '10-Minute Crispy Garlic Blistered Tomato Toast',
    description: 'Crunchy olive oil pan-toasted sourdough rubbed with raw garlic, topped with bursting sweet cherry tomatoes and melted cheddar.',
    servings: 2,
    prepTimeMinutes: 2,
    cookTimeMinutes: 8,
    totalTimeMinutes: 10,
    effortLevel: 'Almost no effort',
    dishCount: 1,
    isSample: true,
    ingredients: [
      { name: 'Sourdough Bread', quantity: '4 thick slices', isAvailable: true, needToBuy: false, category: 'Bakery & Grains' },
      { name: 'Cherry Tomatoes', quantity: '1 cup (~150g)', isAvailable: true, needToBuy: false, category: 'Produce' },
      { name: 'Garlic', quantity: '2 cloves (peeled)', isAvailable: true, needToBuy: false, category: 'Produce' },
      { name: 'Olive Oil', quantity: '2 tbsp', isAvailable: true, needToBuy: false, category: 'Pantry & Spices' },
      { name: 'Sharp Cheddar Cheese', quantity: '40g', isAvailable: true, needToBuy: false, category: 'Dairy & Eggs' },
      { name: 'Fresh Basil or Oregano', quantity: '1 sprig (optional)', isAvailable: false, needToBuy: true, category: 'Produce' },
    ],
    steps: [
      'In a wide skillet, heat 1 tbsp olive oil over medium-high heat. Add bread slices and toast 2-3 minutes per side until deeply golden.',
      'Remove bread to plates. While piping hot, vigorously rub a peeled garlic clove across the rough crust of each slice.',
      'In the same hot skillet, add remaining 1 tbsp olive oil and whole cherry tomatoes with a pinch of salt.',
      'Sauté 4 minutes, pressing down lightly with a wooden spoon so tomatoes burst and create a saucy glaze.',
      'Spoon bursting hot tomatoes over the garlic toasts and crown with thin shavings of cheddar.'
    ],
    equipment: ['Wide skillet or frying pan', 'Wooden spoon or tongs'],
    substitutions: [
      'Works wonderfully with rustic baguette or pita if sourdough runs out.',
      'Add a drizzle of balsamic glaze or chili flakes if in your cupboard.'
    ],
    leftoverSuggestion: 'Blistered tomatoes keep in a sealed jar for up to 3 days and make an instant pasta topper.'
  },
  {
    id: 'sample-rec-3',
    title: 'Skillet Eggs in Savory Tomato Meltdown',
    description: 'A cozy low-fuss Shakshuka cousin: whole eggs poached gently in bursting garlicky cherry tomatoes with wilted spinach.',
    servings: 2,
    prepTimeMinutes: 3,
    cookTimeMinutes: 12,
    totalTimeMinutes: 15,
    effortLevel: 'Easy',
    dishCount: 1,
    isSample: true,
    ingredients: [
      { name: 'Eggs', quantity: '4 pcs', isAvailable: true, needToBuy: false, category: 'Dairy & Eggs' },
      { name: 'Cherry Tomatoes', quantity: '1 cup (~150g halved)', isAvailable: true, needToBuy: false, category: 'Produce' },
      { name: 'Baby Spinach', quantity: '1 generous cup (~60g)', isAvailable: true, needToBuy: false, category: 'Produce' },
      { name: 'Garlic', quantity: '2 cloves (minced or smashed)', isAvailable: true, needToBuy: false, category: 'Produce' },
      { name: 'Olive Oil', quantity: '1 tbsp', isAvailable: true, needToBuy: false, category: 'Pantry & Spices' },
      { name: 'Crushed Red Pepper Flakes', quantity: '1/4 tsp (optional)', isAvailable: false, needToBuy: true, category: 'Pantry & Spices' },
    ],
    steps: [
      'Heat olive oil in a skillet over medium heat. Add smashed garlic and halved cherry tomatoes; cook 4 minutes until juices run freely.',
      'Stir in the baby spinach until it wilts down into the warm tomato sauce (about 1 minute).',
      'Use a spoon to create 4 small wells in the tomato mixture.',
      'Crack one egg into each well. Season the tops with salt and black pepper.',
      'Cover the pan with a lid, reduce heat to low, and let cook 4-5 minutes until whites are firm and yolks are still delightfully runny.',
      'Bring the skillet right to the table and serve straight from the pan with crusty bread for dipping.'
    ],
    equipment: ['Skillet with a lid', 'Spoon'],
    substitutions: [
      'Add a handful of canned chickpeas or white beans for extra heartiness.',
      'Top with feta or grated cheddar.'
    ],
    leftoverSuggestion: 'Any leftover sauce can be warmed up and folded into cooked pasta or rice.'
  }
];
