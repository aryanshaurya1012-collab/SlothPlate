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
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation step state
  const [currentStep, setCurrentStep] = useState<
    'landing' | 'scanner' | 'preferences' | 'meals' | 'grocery'
  >('landing');

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
        message:
          err.message ||
          'The open-weight Gemma model inference service is temporarily unavailable.',
        canUseSample: true,
      });
    } finally {
      setIsGeneratingMeals(false);
    }
  };

  // Recipe toggle selection
  const handleToggleRecipeSelect = (recipeId: string) => {
    const isSelected = selectedRecipeIds.includes(recipeId);
    const updatedIds = isSelected
      ? selectedRecipeIds.filter((id) => id !== recipeId)
      : [...selectedRecipeIds, recipeId];

    setSelectedRecipeIds(updatedIds);
    rebuildGroceryList(recipes, updatedIds, confirmedIngredients, preferences.pantryStaples);
  };

  const handleExcludeRecipe = (recipeId: string) => {
    const updatedRecipes = recipes.filter((r) => r.id !== recipeId);
    setRecipes(updatedRecipes);
    const updatedIds = selectedRecipeIds.filter((id) => id !== recipeId);
    setSelectedRecipeIds(updatedIds);
    rebuildGroceryList(updatedRecipes, updatedIds, confirmedIngredients, preferences.pantryStaples);
  };

  // Save plan to localStorage
  const handleSaveCurrentPlan = () => {
    const selectedMeals = recipes.filter((r) => selectedRecipeIds.includes(r.id));
    const title =
      selectedMeals.length > 0
        ? `${selectedMeals[0].title} + ${selectedMeals.length - 1} more`
        : 'Weekly Low-Effort Meal Plan';

    const saved = saveMealPlan({
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
    <div className="min-h-screen flex flex-col bg-[#FAF8F1] text-[#26342D]">
      {/* App Navigation Bar */}
      <Header
        onGoHome={() => setCurrentStep('landing')}
        onOpenSavedPlans={() => setIsSavedPlansModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenQuality={() => setIsQualityModalOpen(true)}
        savedPlansCount={savedPlans.length}
        currentStep={currentStep}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
        {/* Error Banner when generation fails */}
        {generationError && (
          <div className="my-4 p-4 rounded-2xl bg-[#FDF3F0] border border-[#E98B70] text-[#26342D] text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#E98B70] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{generationError.message}</p>
                <p className="text-xs text-[#66746B]">
                  Your ingredients and preferences are safely preserved. You can retry with Gemma or explore the realistic sample plan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleGenerateMeals(preferences)}
                disabled={isGeneratingMeals}
                className="px-3.5 py-1.5 text-xs font-bold bg-white border border-[#E8E6DC] hover:border-[#285943]/40 rounded-xl transition-colors cursor-pointer"
              >
                Retry Request
              </button>
              {generationError.canUseSample && (
                <button
                  onClick={handleTrySamplePlan}
                  className="px-3.5 py-1.5 text-xs font-bold bg-[#285943] hover:bg-[#1E4332] text-white rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  Switch to Sample Plan
                </button>
              )}
            </div>
          </div>
        )}

        {/* Screen Routing */}
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
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E8E6DC] bg-[#FAF8F1]/90 py-8 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#66746B]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#26342D]">SlothPlate</span>
            <span>•</span>
            <span>Hacktoberfest 2026 Open-Source AI Challenge (Week 3: Slow and Steady)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-[#285943] transition-colors cursor-pointer"
            >
              Open AI & Privacy
            </button>
            <button
              onClick={() => setIsQualityModalOpen(true)}
              className="hover:text-[#285943] transition-colors cursor-pointer"
            >
              Quality & Tests
            </button>
            <button
              onClick={() => setIsSavedPlansModalOpen(true)}
              className="hover:text-[#285943] transition-colors cursor-pointer"
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
