import React, { useState } from 'react';
import { Clock, Utensils, CheckCircle, RefreshCw, ArrowLeft, ArrowRight, Eye, Trash2, Sparkles, AlertCircle, ChefHat, Flame, Salad, CheckCircle2 } from 'lucide-react';
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

// Alternating card styles using the cohesive 6-color system
const CARD_PALETTES = [
  {
    headerBg: 'bg-[#F0F5F0]',
    border: 'border-[#78A878]/40 hover:border-[#78A878]',
    badgeBg: 'bg-[#78A878] text-white',
    iconColor: 'text-[#285943]',
    icon: Flame,
    accentBorder: 'border-l-4 border-l-[#78A878]',
  },
  {
    headerBg: 'bg-[#FEF9EB]',
    border: 'border-[#F4CF77]/50 hover:border-[#F4CF77]',
    badgeBg: 'bg-[#F4CF77] text-[#26342D]',
    iconColor: 'text-amber-700',
    icon: ChefHat,
    accentBorder: 'border-l-4 border-l-[#F4CF77]',
  },
  {
    headerBg: 'bg-[#F2F8FA]',
    border: 'border-[#BFDDE8]/60 hover:border-[#BFDDE8]',
    badgeBg: 'bg-[#BFDDE8] text-[#285943]',
    iconColor: 'text-[#285943]',
    icon: Utensils,
    accentBorder: 'border-l-4 border-l-[#BFDDE8]',
  },
  {
    headerBg: 'bg-[#F7F5FC]',
    border: 'border-[#D9CFF0]/60 hover:border-[#D9CFF0]',
    badgeBg: 'bg-[#D9CFF0] text-[#285943]',
    iconColor: 'text-purple-700',
    icon: Salad,
    accentBorder: 'border-l-4 border-l-[#D9CFF0]',
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

  const selectedCount = selectedRecipeIds.length;

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-7">
      {/* Sample Mode Banner */}
      {isSampleMode && (
        <div className="p-4 rounded-2xl bg-[#FEF9EB] border border-[#F4CF77] flex items-start gap-3 text-xs sm:text-sm text-[#26342D] shadow-2xs">
          <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-[#26342D]">Sample Plan Active</span>
            <p className="text-xs text-[#66746B]">
              Showing curated low-effort recipes based on verified pantry staples. Gemma open-weight inference was not called for this preview.
            </p>
          </div>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6DC] pb-4">
        <div>
          <span className="text-xs font-bold text-[#285943] uppercase tracking-wider">
            Step 3 of 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26342D] tracking-tight">
            Choose your meals
          </h2>
          <p className="text-xs sm:text-sm text-[#66746B] mt-1">
            Select one or more recipes. Missing ingredients across your choices will be combined into your shopping list.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToIngredients}
            className="text-xs sm:text-sm font-semibold text-[#66746B] hover:text-[#26342D] px-3.5 py-2 rounded-xl hover:bg-[#E8E6DC]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Ingredients</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="text-xs sm:text-sm font-bold text-[#285943] hover:text-[#1E4332] bg-white border border-[#E8E6DC] hover:border-[#285943]/40 px-3.5 py-2 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-[#F4CF77]' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Recipes Cards Grid */}
      {recipes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E6DC] p-12 text-center space-y-3.5 shadow-xs">
          <p className="font-bold text-base text-[#26342D]">
            All suggested recipes have been excluded.
          </p>
          <p className="text-xs text-[#66746B]">
            Click "Regenerate" to request 3 fresh meal designs from your confirmed ingredients.
          </p>
          <button
            onClick={onRegenerate}
            className="px-6 py-2.5 bg-[#285943] text-white rounded-xl font-bold text-xs hover:bg-[#1E4332] transition-colors cursor-pointer shadow-xs"
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

            return (
              <div
                key={recipe.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${palette.accentBorder} ${
                  isSelected
                    ? 'border-[#285943] ring-2 ring-[#285943]/30 bg-[#F0F5F0]/20'
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
                      <span className="font-bold text-xs text-[#26342D]">
                        {recipe.effortLevel}
                      </span>
                    </div>

                    <button
                      onClick={() => onExcludeRecipe(recipe.id)}
                      className="text-[#66746B] hover:text-[#E98B70] p-1.5 rounded-lg hover:bg-[#FAF8F1] transition-colors cursor-pointer"
                      title="Exclude this recipe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-lg text-[#26342D] leading-snug line-clamp-2">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-[#66746B] line-clamp-3 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Cooking Time & Cookware metrics */}
                  <div className="flex items-center gap-2.5 text-xs pt-1">
                    <span className="flex items-center gap-1.5 font-bold text-[#26342D] bg-[#FAF8F1] border border-[#E8E6DC] px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-[#285943]" />
                      {recipe.totalTimeMinutes} mins
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-[#26342D] bg-[#FAF8F1] border border-[#E8E6DC] px-2.5 py-1 rounded-lg">
                      <Utensils className="w-3.5 h-3.5 text-[#285943]" />
                      {recipe.dishCount} {recipe.dishCount === 1 ? 'pan/dish' : 'dishes'}
                    </span>
                  </div>

                  {/* Ingredients Availability Breakdown */}
                  <div className="bg-[#FAF8F1] rounded-xl p-3 border border-[#E8E6DC] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#285943] font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#78A878]" />
                        {availableCount} in fridge
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                          missingCount > 0
                            ? 'text-[#E98B70] bg-[#FDF3F0]'
                            : 'text-[#285943] bg-[#F0F5F0]'
                        }`}
                      >
                        {missingCount > 0 ? `${missingCount} to buy` : '100% on hand'}
                      </span>
                    </div>

                    {recipe.steps[0] && (
                      <p className="text-[11px] text-[#66746B] italic truncate pt-1.5 border-t border-[#E8E6DC]/80">
                        Method: {recipe.steps[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="p-4 bg-[#FAF8F1]/60 border-t border-[#E8E6DC] space-y-2">
                  <button
                    onClick={() => onToggleSelect(recipe.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-[#285943] text-white hover:bg-[#1E4332]'
                        : 'bg-white text-[#26342D] border border-[#E8E6DC] hover:border-[#285943]'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#78A878]'}`} />
                    <span>{isSelected ? 'Selected' : 'Select for Plan'}</span>
                  </button>

                  <button
                    onClick={() => setViewingRecipe(recipe)}
                    className="w-full py-1.5 text-xs font-semibold text-[#66746B] hover:text-[#26342D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E6DC] p-4.5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3.5">
        <div className="text-center sm:text-left">
          <div className="text-sm font-extrabold text-[#26342D]">
            {selectedCount === 0
              ? 'Select at least 1 meal to build your grocery list'
              : `${selectedCount} meal${selectedCount > 1 ? 's' : ''} selected for your plan`}
          </div>
          <p className="text-xs text-[#66746B]">
            {selectedCount > 0
              ? 'Missing items will be combined across all selected dishes into one clean list.'
              : 'Pick your favorites from the cards above.'}
          </p>
        </div>

        <button
          onClick={onProceedToGrocery}
          disabled={selectedCount === 0}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
            selectedCount === 0
              ? 'bg-[#E8E6DC] text-[#66746B] cursor-not-allowed'
              : 'bg-[#285943] hover:bg-[#1E4332] text-white cursor-pointer hover:shadow-md'
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
