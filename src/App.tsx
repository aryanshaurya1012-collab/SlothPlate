import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { IngredientScanner } from './components/IngredientScanner';
import { PreferenceForm } from './components/PreferenceForm';
import { MealSelection } from './components/MealSelection';
import { GroceryListScreen } from './components/GroceryListScreen';
import { SavedPlansModal } from './components/SavedPlansModal';
import { PrivacyModal } from './components/PrivacyModal';
import { QualityModal } from './components/QualityModal';
import { WaterBackground } from './components/WaterBackground';
import { Ingredient, Recipe, UserPreferences, GroceryItem, SavedMealPlan } from './types';
import { consolidateGroceryList } from './utils/groceryConsolidator';
import {
  getLastPantry,
  saveLastPantry,
  getLastPreferences,
  saveLastPreferences,
  getSavedPlans,
  saveMealPlan,
  deleteSavedPlan,
  clearAllLocalData,
  DEFAULT_PREFERENCES,
} from './utils/storage';
import {
  SAMPLE_PANTRY_INGREDIENTS,
  SAMPLE_PREFERENCES,
  SAMPLE_RECIPES,
} from './utils/sampleData';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation step state
  const [currentStep, setCurrentStep] = useState<
    'landing' | 'scanner' | 'preferences' | 'meals' | 'grocery'
  >('landing');

  // Theme state with localStorage persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('slothplate_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('slothplate_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('slothplate_theme', 'light');
      }
    } catch (e) {
      console.warn('Theme storage unavailable', e);
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Core application data state
  const [confirmedIngredients, setConfirmedIngredients] = useState<Ingredient[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);

  // State flags
  const [isGeneratingMeals, setIsGeneratingMeals] = useState(false);
  const [isSampleMode, setIsSampleMode] = useState(false);
  const [isCurrentPlanSaved, setIsCurrentPlanSaved] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);
  const [generationError, setGenerationError] = useState<{
    message: string;
    canUseSample: boolean;
  } | null>(null);

  // Modal visibility
  const [isSavedPlansModalOpen, setIsSavedPlansModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);

  // Load initial preferences and saved plans on mount
  useEffect(() => {
    const plans = getSavedPlans();
    setSavedPlans(plans);

    const savedPrefs = getLastPreferences();
    setPreferences(savedPrefs);

    const savedPantry = getLastPantry();
    if (savedPantry && savedPantry.length > 0) {
      setConfirmedIngredients(savedPantry);
    }
  }, []);

  // Update grocery list whenever selected recipes change
  const rebuildGroceryList = (
    currentRecipes: Recipe[],
    selectedIds: string[],
    pantry: Ingredient[],
    staples: string[]
  ) => {
    const active = currentRecipes.filter((r) => selectedIds.includes(r.id));
    const consolidated = consolidateGroceryList(active, pantry, staples);
    setGroceryList(consolidated);
  };

  // Flow handlers
  const handleStartPlanning = () => {
    setIsSampleMode(false);
    setGenerationError(null);
    setCurrentStep('scanner');
  };

  const handleTrySamplePlan = () => {
    setIsSampleMode(true);
    setGenerationError(null);
    setConfirmedIngredients(SAMPLE_PANTRY_INGREDIENTS);
    setPreferences(SAMPLE_PREFERENCES);
    setRecipes(SAMPLE_RECIPES);
    const initialSelectedIds = [SAMPLE_RECIPES[0].id, SAMPLE_RECIPES[1].id];
    setSelectedRecipeIds(initialSelectedIds);
    rebuildGroceryList(
      SAMPLE_RECIPES,
      initialSelectedIds,
      SAMPLE_PANTRY_INGREDIENTS,
      SAMPLE_PREFERENCES.pantryStaples
    );
    setIsCurrentPlanSaved(false);
    setCurrentStep('meals');
  };

  const handleConfirmIngredients = (ingredients: Ingredient[]) => {
    setConfirmedIngredients(ingredients);
    saveLastPantry(ingredients);
    setCurrentStep('preferences');
  };

  const handleGenerateMeals = async (customPrefs: UserPreferences) => {
    setPreferences(customPrefs);
    saveLastPreferences(customPrefs);
    setIsGeneratingMeals(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: confirmedIngredients,
          preferences: customPrefs,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate meals with open-weight AI model.');
      }

      const generatedRecipes: Recipe[] = data.data;
      if (!Array.isArray(generatedRecipes) || generatedRecipes.length === 0) {
        throw new Error('Model did not produce valid recipe suggestions.');
      }

      setRecipes(generatedRecipes);
      // Pre-select all generated meals by default
      const allIds = generatedRecipes.map((r) => r.id);
      setSelectedRecipeIds(allIds);
      rebuildGroceryList(
        generatedRecipes,
        allIds,
        confirmedIngredients,
        customPrefs.pantryStaples
      );
      setIsSampleMode(false);
      setIsCurrentPlanSaved(false);
      setCurrentStep('meals');
    } catch (err: any) {
      console.error('Meal generation error:', err);
      setGenerationError({
        message: err.message || 'AI meal planning service is temporarily unavailable.',
        canUseSample: true,
      });
    } finally {
      setIsGeneratingMeals(false);
    }
  };

  const handleToggleRecipeSelect = (recipeId: string) => {
    const updatedIds = selectedRecipeIds.includes(recipeId)
      ? selectedRecipeIds.filter((id) => id !== recipeId)
      : [...selectedRecipeIds, recipeId];

    setSelectedRecipeIds(updatedIds);
    rebuildGroceryList(recipes, updatedIds, confirmedIngredients, preferences.pantryStaples);
  };

  const handleExcludeRecipe = (recipeId: string) => {
    const remainingRecipes = recipes.filter((r) => r.id !== recipeId);
    const updatedSelectedIds = selectedRecipeIds.filter((id) => id !== recipeId);

    setRecipes(remainingRecipes);
    setSelectedRecipeIds(updatedSelectedIds);
    rebuildGroceryList(
      remainingRecipes,
      updatedSelectedIds,
      confirmedIngredients,
      preferences.pantryStaples
    );
  };

  const handleSaveCurrentPlan = () => {
    const activeRecipes = recipes.filter((r) => selectedRecipeIds.includes(r.id));
    const title =
      activeRecipes.length > 0
        ? activeRecipes.map((r) => r.title).join(' & ')
        : 'My SlothPlate Plan';

    saveMealPlan({
      title,
      confirmedIngredients,
      preferences,
      recipes,
      selectedRecipeIds,
      groceryList,
    });

    setSavedPlans(getSavedPlans());
    setIsCurrentPlanSaved(true);
  };

  const handleLoadSavedPlan = (plan: SavedMealPlan) => {
    setConfirmedIngredients(plan.confirmedIngredients || []);
    setPreferences(plan.preferences || DEFAULT_PREFERENCES);
    setRecipes(plan.recipes || []);
    setSelectedRecipeIds(plan.selectedRecipeIds || []);
    setGroceryList(plan.groceryList || []);
    setIsSampleMode(false);
    setIsCurrentPlanSaved(true);
    setCurrentStep('meals');
  };

  const handleDeleteSavedPlan = (id: string) => {
    deleteSavedPlan(id);
    setSavedPlans(getSavedPlans());
  };

  const handleClearAllData = () => {
    clearAllLocalData();
    setSavedPlans([]);
    setConfirmedIngredients([]);
    setPreferences(DEFAULT_PREFERENCES);
    setIsCurrentPlanSaved(false);
    setCurrentStep('landing');
  };

  return (
    <div className="min-h-screen flex flex-col relative text-[#24352F] dark:text-[#E9F4F0] selection:bg-[#BCEBFA] selection:text-[#087E8B] transition-colors duration-300">
      {/* Real Animated Liquid Water Background with Parallax & Dark Mode */}
      <WaterBackground subdued={currentStep !== 'landing'} isDark={isDark} />

      {/* App Navigation Bar with Theme Toggle */}
      <Header
        onGoHome={() => setCurrentStep('landing')}
        onOpenSavedPlans={() => setIsSavedPlansModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenQuality={() => setIsQualityModalOpen(true)}
        savedPlansCount={savedPlans.length}
        currentStep={currentStep}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Viewport with Step Transitions */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 relative z-10 transition-all duration-300">
        {/* Error Banner when generation fails */}
        {generationError && (
          <div className="my-4 p-4 rounded-2xl bg-[#FDF3F0] dark:bg-[#2A1715] border border-[#F28B78] text-[#24352F] dark:text-[#E9F4F0] text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#F28B78] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{generationError.message}</p>
                <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
                  Your ingredients and preferences are safely preserved. You can retry with Gemma or explore the realistic sample plan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleGenerateMeals(preferences)}
                disabled={isGeneratingMeals}
                className="px-3.5 py-1.5 text-xs font-bold bg-white dark:bg-[#13241F] border border-[#E4E8E2] dark:border-[#223D35] hover:border-[#087E8B]/60 rounded-xl transition-colors cursor-pointer btn-interactive"
              >
                Retry Request
              </button>
              {generationError.canUseSample && (
                <button
                  onClick={handleTrySamplePlan}
                  className="px-3.5 py-1.5 text-xs font-bold bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl transition-colors cursor-pointer shadow-2xs btn-interactive"
                >
                  Switch to Sample Plan
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step Routing with Smooth View Transitions */}
        <div key={currentStep} className="transition-all duration-300 ease-out">
          {currentStep === 'landing' && (
            <LandingHero
              onStartPlanning={handleStartPlanning}
              onTrySamplePlan={handleTrySamplePlan}
            />
          )}

          {currentStep === 'scanner' && (
            <IngredientScanner
              initialIngredients={confirmedIngredients}
              onConfirmIngredients={handleConfirmIngredients}
              onBack={() => setCurrentStep('landing')}
              onUseSampleIngredients={() => {
                setConfirmedIngredients(SAMPLE_PANTRY_INGREDIENTS);
              }}
            />
          )}

          {currentStep === 'preferences' && (
            <PreferenceForm
              initialPreferences={preferences}
              onGenerateMeals={handleGenerateMeals}
              onBack={() => setCurrentStep('scanner')}
              isGenerating={isGeneratingMeals}
            />
          )}

          {currentStep === 'meals' && (
            <MealSelection
              recipes={recipes}
              selectedRecipeIds={selectedRecipeIds}
              onToggleSelect={handleToggleRecipeSelect}
              onExcludeRecipe={handleExcludeRecipe}
              onRegenerate={() => handleGenerateMeals(preferences)}
              onBackToIngredients={() => setCurrentStep('scanner')}
              onProceedToGrocery={() => setCurrentStep('grocery')}
              isRegenerating={isGeneratingMeals}
              isSampleMode={isSampleMode}
            />
          )}

          {currentStep === 'grocery' && (
            <GroceryListScreen
              groceryList={groceryList}
              selectedRecipes={recipes.filter((r) => selectedRecipeIds.includes(r.id))}
              onUpdateGroceryList={(newList) => setGroceryList(newList)}
              onSavePlan={handleSaveCurrentPlan}
              onBackToMeals={() => setCurrentStep('meals')}
              isSaved={isCurrentPlanSaved}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E4E8E2] dark:border-[#223D35] bg-[#FAF8F1]/85 dark:bg-[#0B1613]/85 backdrop-blur-md py-8 transition-colors duration-300 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#586B63] dark:text-[#97ADA4]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#24352F] dark:text-[#E9F4F0]">SlothPlate</span>
            <span>•</span>
            <span>Hacktoberfest 2026 Open-Source AI Challenge (Week 3: Slow and Steady)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-[#087E8B] dark:hover:text-[#45D6C7] transition-colors cursor-pointer"
            >
              Open AI & Privacy
            </button>
            <button
              onClick={() => setIsQualityModalOpen(true)}
              className="hover:text-[#087E8B] dark:hover:text-[#45D6C7] transition-colors cursor-pointer"
            >
              Quality & Tests
            </button>
            <button
              onClick={() => setIsSavedPlansModalOpen(true)}
              className="hover:text-[#087E8B] dark:hover:text-[#45D6C7] transition-colors cursor-pointer"
            >
              Saved Plans ({savedPlans.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SavedPlansModal
        isOpen={isSavedPlansModalOpen}
        onClose={() => setIsSavedPlansModalOpen(false)}
        plans={savedPlans}
        onLoadPlan={handleLoadSavedPlan}
        onDeletePlan={handleDeleteSavedPlan}
        onClearAll={handleClearAllData}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <QualityModal
        isOpen={isQualityModalOpen}
        onClose={() => setIsQualityModalOpen(false)}
      />
    </div>
  );
}
