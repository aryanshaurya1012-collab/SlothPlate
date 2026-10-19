import React, { useState } from 'react';
import { Clock, Utensils, RefreshCw, ArrowLeft, ArrowRight, Eye, Trash2, Sparkles, ChefHat, Flame, Salad, CheckCircle2 } from 'lucide-react';
import { Recipe } from '../types';
import { RecipeModal } from './RecipeModal';
import { useScrollRevealGroup } from '../utils/useScrollReveal';

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

// Coordinated card palette variants matching liquid water aesthetic
const CARD_PALETTES = [
  {
    headerBg: 'bg-[#BCEBFA]/30 dark:bg-[#45D6C7]/15',
    border: 'border-[#45D6C7]/50 hover:border-[#087E8B]',
    badgeBg: 'bg-[#087E8B] text-white',
    iconColor: 'text-[#087E8B] dark:text-[#45D6C7]',
    icon: Flame,
    accentBorder: 'border-l-4 border-l-[#087E8B]',
  },
  {
    headerBg: 'bg-[#FEF9EB] dark:bg-[#F5D778]/15',
    border: 'border-[#F5D778]/70 hover:border-amber-400',
    badgeBg: 'bg-[#F5D778] text-[#24352F]',
    iconColor: 'text-amber-700 dark:text-[#F5D778]',
    icon: ChefHat,
    accentBorder: 'border-l-4 border-l-[#F5D778]',
  },
  {
    headerBg: 'bg-[#FDF3F0] dark:bg-[#F28B78]/15',
    border: 'border-[#F28B78]/50 hover:border-[#F28B78]',
    badgeBg: 'bg-[#F28B78] text-white',
    iconColor: 'text-[#F28B78]',
    icon: Utensils,
    accentBorder: 'border-l-4 border-l-[#F28B78]',
  },
  {
    headerBg: 'bg-[#FAF8F1] dark:bg-[#4F8FE8]/15',
    border: 'border-[#4F8FE8]/40 hover:border-[#4F8FE8]',
    badgeBg: 'bg-[#4F8FE8] text-white',
    iconColor: 'text-[#4F8FE8]',
    icon: Salad,
    accentBorder: 'border-l-4 border-l-[#4F8FE8]',
  },
];

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
  const containerRef = useScrollRevealGroup<HTMLDivElement>();

  const selectedCount = selectedRecipeIds.length;

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto py-4 sm:py-8 space-y-7">
      {/* Sample Mode Banner */}
      {isSampleMode && (
        <div className="p-4 rounded-2xl bg-[#FEF9EB] dark:bg-[#1A2E25] border border-[#F5D778] dark:border-[#F5D778]/40 flex items-start gap-3 text-xs sm:text-sm text-[#24352F] dark:text-[#E9F4F0] shadow-2xs">
          <Sparkles className="w-5 h-5 text-amber-700 dark:text-[#F5D778] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-[#24352F] dark:text-[#E9F4F0]">Sample Plan Active</span>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
              Showing curated low-effort recipes based on verified pantry staples. Gemma open-weight inference was not called for this preview.
            </p>
          </div>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E8E2] dark:border-[#223D35] pb-4">
        <div>
          <span className="text-xs font-bold text-[#087E8B] dark:text-[#45D6C7] uppercase tracking-wider">
            Step 3 of 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F] dark:text-[#E9F4F0] tracking-tight">
            Choose your meals
          </h2>
          <p className="text-xs sm:text-sm text-[#586B63] dark:text-[#97ADA4] mt-1">
            Select one or more recipes. Missing ingredients across your choices will be combined into your shopping list.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToIngredients}
            className="text-xs sm:text-sm font-semibold text-[#586B63] dark:text-[#97ADA4] hover:text-[#24352F] dark:hover:text-white px-3.5 py-2 rounded-xl hover:bg-[#E4E8E2]/40 dark:hover:bg-[#1E352F] transition-colors flex items-center gap-1.5 cursor-pointer btn-interactive"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Ingredients</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="text-xs sm:text-sm font-bold text-[#087E8B] dark:text-[#45D6C7] hover:text-[#06626D] bg-white dark:bg-[#13241F] border border-[#E4E8E2] dark:border-[#223D35] hover:border-[#087E8B]/50 px-3.5 py-2 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer btn-interactive"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-[#F5D778]' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Recipes Cards Grid */}
      {recipes.length === 0 ? (
        <div className="bg-white dark:bg-[#13241F] rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] p-12 text-center space-y-3.5 shadow-xs">
          <p className="font-bold text-base text-[#24352F] dark:text-[#E9F4F0]">
            All suggested recipes have been excluded.
          </p>
          <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
            Click "Regenerate" to request 3 fresh meal designs from your confirmed ingredients.
          </p>
          <button
            onClick={onRegenerate}
            className="px-6 py-2.5 bg-[#087E8B] text-white rounded-xl font-bold text-xs hover:bg-[#06626D] transition-colors cursor-pointer shadow-xs btn-interactive"
          >
            Regenerate Meal Options
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recipes.map((recipe, idx) => {
            const isSelected = selectedRecipeIds.includes(recipe.id);
            const availableCount = recipe.ingredients.filter((i) => i.isAvailable).length;
            const missingCount = recipe.ingredients.filter((i) => !i.isAvailable).length;
            const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
            const IconComponent = palette.icon;
            const delayClass = `reveal-delay-${(idx % 3) + 1}`;

            return (
              <div
                key={recipe.id}
                className={`bg-white dark:bg-[#13241F] rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${palette.accentBorder} card-interactive reveal-item ${delayClass} ${
                  isSelected
                    ? 'border-[#087E8B] dark:border-[#45D6C7] ring-2 ring-[#087E8B]/30 dark:ring-[#45D6C7]/30 bg-[#BCEBFA]/10 dark:bg-[#45D6C7]/5'
                    : palette.border
                }`}
              >
                {/* Card Top Section */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Card Header & Badges */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-lg ${palette.badgeBg} flex items-center justify-center shadow-2xs`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-[#24352F] dark:text-[#E9F4F0]">
                        {recipe.effortLevel}
                      </span>
                    </div>

                    <button
                      onClick={() => onExcludeRecipe(recipe.id)}
                      className="text-[#586B63] dark:text-[#97ADA4] hover:text-[#F28B78] p-1.5 rounded-lg hover:bg-[#FAF8F1] dark:hover:bg-[#1A3029] transition-colors cursor-pointer btn-interactive"
                      title="Exclude this recipe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-lg text-[#24352F] dark:text-[#E9F4F0] leading-snug line-clamp-2">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-[#586B63] dark:text-[#97ADA4] line-clamp-3 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Cooking Time & Cookware metrics */}
                  <div className="flex items-center gap-2.5 text-xs pt-1">
                    <span className="flex items-center gap-1.5 font-bold text-[#24352F] dark:text-[#E9F4F0] bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#E4E8E2] dark:border-[#223D35] px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-[#087E8B] dark:text-[#45D6C7]" />
                      {recipe.totalTimeMinutes} mins
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-[#24352F] dark:text-[#E9F4F0] bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#E4E8E2] dark:border-[#223D35] px-2.5 py-1 rounded-lg">
                      <Utensils className="w-3.5 h-3.5 text-[#087E8B] dark:text-[#45D6C7]" />
                      {recipe.dishCount} {recipe.dishCount === 1 ? 'pan/dish' : 'dishes'}
                    </span>
                  </div>

                  {/* Ingredients Availability Breakdown */}
                  <div className="bg-[#FAF8F1] dark:bg-[#1A3029] rounded-xl p-3 border border-[#E4E8E2] dark:border-[#223D35] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#087E8B] dark:text-[#45D6C7] font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#45D6C7]" />
                        {availableCount} in fridge
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                          missingCount > 0
                            ? 'text-[#F28B78] bg-[#FDF3F0] dark:bg-[#F28B78]/20'
                            : 'text-[#087E8B] dark:text-[#45D6C7] bg-[#BCEBFA]/30 dark:bg-[#45D6C7]/20'
                        }`}
                      >
                        {missingCount > 0 ? `${missingCount} to buy` : '100% on hand'}
                      </span>
                    </div>

                    {recipe.steps[0] && (
                      <p className="text-[11px] text-[#586B63] dark:text-[#97ADA4] italic truncate pt-1.5 border-t border-[#E4E8E2] dark:border-[#223D35]">
                        Method: {recipe.steps[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="p-4 bg-[#FAF8F1]/60 dark:bg-[#1A3029]/60 border-t border-[#E4E8E2] dark:border-[#223D35] space-y-2">
                  <button
                    onClick={() => onToggleSelect(recipe.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs btn-interactive ${
                      isSelected
                        ? 'bg-[#087E8B] text-white hover:bg-[#06626D]'
                        : 'bg-white dark:bg-[#13241F] text-[#24352F] dark:text-[#E9F4F0] border border-[#E4E8E2] dark:border-[#223D35] hover:border-[#087E8B]'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#45D6C7]'}`} />
                    <span>{isSelected ? 'Selected ✓' : 'Select for Plan'}</span>
                  </button>

                  <button
                    onClick={() => setViewingRecipe(recipe)}
                    className="w-full py-1.5 text-xs font-semibold text-[#586B63] dark:text-[#97ADA4] hover:text-[#24352F] dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
      <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-[#13241F]/95 backdrop-blur-md rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] p-4.5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3.5 transition-colors duration-300">
        <div className="text-center sm:text-left">
          <div className="text-sm font-extrabold text-[#24352F] dark:text-[#E9F4F0]">
            {selectedCount === 0
              ? 'Select at least 1 meal to build your grocery list'
              : `${selectedCount} meal${selectedCount > 1 ? 's' : ''} selected for your plan`}
          </div>
          <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
            {selectedCount > 0
              ? 'Missing items will be combined across all selected dishes into one clean list.'
              : 'Pick your favorites from the cards above.'}
          </p>
        </div>

        <button
          onClick={onProceedToGrocery}
          disabled={selectedCount === 0}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all btn-interactive ${
            selectedCount === 0
              ? 'bg-[#E4E8E2] dark:bg-[#223D35] text-[#586B63] dark:text-[#97ADA4] cursor-not-allowed'
              : 'bg-[#087E8B] hover:bg-[#06626D] text-white cursor-pointer hover:shadow-md'
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
