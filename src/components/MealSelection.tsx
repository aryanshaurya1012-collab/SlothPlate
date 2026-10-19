import React, { useState } from 'react';
import { Clock, Utensils, CheckCircle, RefreshCw, ArrowLeft, ArrowRight, Eye, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { Recipe } from '../types';
import { RecipeModal } from './RecipeModal';

interface MealSelectionProps {
  recipes: Recipe[];
  selectedRecipeIds: string[];
  onToggleSelect: (id: string) => void;
  onExcludeRecipe: (id: string) => void;
  onRegenerate: () => void;
  onBackToIngredients: () => void;
  onProceedToGrocery: () => void;
  isRegenerating: boolean;
  isSampleMode?: boolean;
}

export const MealSelection: React.FC<MealSelectionProps> = ({
  recipes,
  selectedRecipeIds,
  onToggleSelect,
  onExcludeRecipe,
  onRegenerate,
  onBackToIngredients,
  onProceedToGrocery,
  isRegenerating,
  isSampleMode,
}) => {
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const selectedCount = selectedRecipeIds.length;

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Sample Mode Banner if active */}
      {isSampleMode && (
        <div className="p-3.5 rounded-2xl bg-[#FBEFE8] border border-[#EDAD85]/50 flex items-start gap-3 text-xs sm:text-sm text-[#26352B]">
          <AlertCircle className="w-5 h-5 text-[#EDAD85] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Offline Sample Mode Active</span>
            <p className="text-xs text-[#607266]">
              Showing curated low-effort recipes based on standard fridge staples. The Gemma open-weight API was not invoked for these sample meals.
            </p>
          </div>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7DF] pb-4">
        <div>
          <span className="text-xs font-semibold text-[#355E46] uppercase tracking-wider">
            Step 3 of 3
          </span>
          <h2 className="text-2xl font-bold text-[#26352B] tracking-tight">
            Choose your meals
          </h2>
          <p className="text-xs sm:text-sm text-[#607266] mt-0.5">
            Select one or more recipes to automatically combine missing ingredients into your grocery list.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToIngredients}
            className="text-xs sm:text-sm text-[#607266] hover:text-[#26352B] px-3 py-1.5 rounded-lg hover:bg-[#E5E7DF]/40 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Ingredients</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="text-xs sm:text-sm font-medium text-[#355E46] hover:text-[#23402F] bg-white border border-[#E5E7DF] hover:border-[#355E46]/40 px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Recipes Cards Grid */}
      {recipes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7DF] p-12 text-center space-y-3">
          <p className="font-semibold text-base text-[#26352B]">
            All suggested recipes have been excluded.
          </p>
          <p className="text-xs text-[#607266]">
            Click "Regenerate" to generate 3 fresh suggestions from your fridge ingredients.
          </p>
          <button
            onClick={onRegenerate}
            className="px-5 py-2.5 bg-[#355E46] text-white rounded-xl font-semibold text-xs hover:bg-[#23402F] transition-colors"
          >
            Regenerate Meal Options
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recipes.map((recipe) => {
            const isSelected = selectedRecipeIds.includes(recipe.id);
            const availableCount = recipe.ingredients.filter((i) => i.isAvailable).length;
            const missingCount = recipe.ingredients.filter((i) => !i.isAvailable).length;

            return (
              <div
                key={recipe.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs ${
                  isSelected
                    ? 'border-[#355E46] ring-2 ring-[#355E46]/20'
                    : 'border-[#E5E7DF] hover:border-[#355E46]/40'
                }`}
              >
                {/* Card Top Section */}
                <div className="p-5 space-y-3.5">
                  {/* Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full font-semibold bg-[#DCE8D8] text-[#355E46] text-[11px]">
                      {recipe.effortLevel}
                    </span>
                    <button
                      onClick={() => onExcludeRecipe(recipe.id)}
                      className="text-[#607266] hover:text-rose-600 p-1 rounded transition-colors"
                      title="Exclude this meal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="font-bold text-lg text-[#26352B] leading-snug">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-[#607266] mt-1.5 line-clamp-3 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Time & Cookware metrics */}
                  <div className="flex items-center gap-3 text-xs text-[#26352B] pt-1">
                    <span className="flex items-center gap-1 font-medium bg-[#F7F6F0] px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-[#355E46]" />
                      {recipe.totalTimeMinutes} mins
                    </span>
                    <span className="flex items-center gap-1 font-medium bg-[#F7F6F0] px-2.5 py-1 rounded-lg">
                      <Utensils className="w-3.5 h-3.5 text-[#355E46]" />
                      {recipe.dishCount} {recipe.dishCount === 1 ? 'pan/dish' : 'dishes'}
                    </span>
                  </div>

                  {/* Ingredients status indicator */}
                  <div className="bg-[#F7F6F0]/60 rounded-xl p-2.5 border border-[#E5E7DF] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#355E46] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#355E46]" />
                        {availableCount} in fridge
                      </span>
                      <span className={`font-semibold ${missingCount > 0 ? 'text-[#EDAD85]' : 'text-[#355E46]'}`}>
                        {missingCount > 0 ? `${missingCount} to buy` : '100% on hand'}
                      </span>
                    </div>

                    {/* Method preview snippet */}
                    {recipe.steps[0] && (
                      <p className="text-[11px] text-[#607266] italic truncate pt-1 border-t border-[#E5E7DF]/60">
                        Method: {recipe.steps[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="p-4 bg-[#F7F6F0]/40 border-t border-[#E5E7DF] space-y-2">
                  <button
                    onClick={() => onToggleSelect(recipe.id)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#355E46] text-white hover:bg-[#23402F]'
                        : 'bg-white text-[#26352B] border border-[#E5E7DF] hover:border-[#355E46]'
                    }`}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#607266]'}`} />
                    <span>{isSelected ? 'Selected' : 'Select for Plan'}</span>
                  </button>

                  <button
                    onClick={() => setViewingRecipe(recipe)}
                    className="w-full py-1.5 text-xs text-[#607266] hover:text-[#26352B] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View full recipe & steps</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Navigation / Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E7DF] p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <div className="text-sm font-bold text-[#26352B]">
            {selectedCount === 0
              ? 'Select at least 1 meal to build your shopping list'
              : `${selectedCount} meal${selectedCount > 1 ? 's' : ''} selected`}
          </div>
          <p className="text-xs text-[#607266]">
            {selectedCount > 0
              ? 'Missing ingredients will be consolidated across all selected recipes.'
              : 'Choose the dishes you would like to cook this week.'}
          </p>
        </div>

        <button
          onClick={onProceedToGrocery}
          disabled={selectedCount === 0}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
            selectedCount === 0
              ? 'bg-[#E5E7DF] text-[#607266] cursor-not-allowed'
              : 'bg-[#355E46] hover:bg-[#23402F] text-white cursor-pointer'
          }`}
        >
          <span>Generate shopping list ({selectedCount})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Full Recipe Modal */}
      <RecipeModal
        recipe={viewingRecipe}
        isOpen={viewingRecipe !== null}
        onClose={() => setViewingRecipe(null)}
        isSelected={viewingRecipe ? selectedRecipeIds.includes(viewingRecipe.id) : false}
        onToggleSelect={onToggleSelect}
      />
    </div>
  );
};
