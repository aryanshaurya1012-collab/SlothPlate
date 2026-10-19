import React, { useState } from 'react';
import { X, Clock, Utensils, CheckCircle, Plus, Minus, AlertCircle, Sparkles, ChefHat } from 'lucide-react';
import { Recipe } from '../types';
import { parseQuantityString, formatAmount } from '../utils/groceryConsolidator';

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelect: (recipeId: string) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  isOpen,
  onClose,
  isSelected,
  onToggleSelect,
}) => {
  if (!isOpen || !recipe) return null;

  // Local serving adjustment for this recipe view
  const [currentServings, setCurrentServings] = useState<number>(recipe.servings || 2);
  const baseServings = recipe.servings || 2;
  const ratio = currentServings / (baseServings > 0 ? baseServings : 2);

  const adjustQuantity = (qtyStr: string): string => {
    const parsed = parseQuantityString(qtyStr);
    if (parsed.amount === null) return qtyStr;
    const adjustedNum = parsed.amount * ratio;
    const formatted = formatAmount(adjustedNum);
    return parsed.unit ? `${formatted} ${parsed.unit}` : formatted;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7DF] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5E7DF] flex items-start justify-between gap-4 bg-[#F7F6F0]/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCE8D8] text-[#355E46]">
                {recipe.effortLevel}
              </span>
              <span className="text-xs text-[#607266] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {recipe.totalTimeMinutes} mins total
              </span>
              <span className="text-xs text-[#607266] flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" />
                {recipe.dishCount} {recipe.dishCount === 1 ? 'dish' : 'dishes'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#26352B] tracking-tight">
              {recipe.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#607266] leading-relaxed">
              {recipe.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#607266] hover:text-[#26352B] hover:bg-white transition-colors"
            title="Close recipe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* Servings Adjuster */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F6F0] border border-[#E5E7DF]">
            <div>
              <span className="font-semibold text-xs text-[#26352B] uppercase tracking-wider block">
                Portion Size
              </span>
              <span className="text-xs text-[#607266]">
                Adjust servings (quantities update automatically)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentServings((s) => Math.max(1, s - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-[#E5E7DF] flex items-center justify-center text-[#26352B] hover:bg-[#DCE8D8] transition-colors"
                title="Decrease servings"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm text-[#26352B] w-12 text-center">
                {currentServings} {currentServings === 1 ? 'serving' : 'servings'}
              </span>
              <button
                onClick={() => setCurrentServings((s) => Math.min(12, s + 1))}
                className="w-8 h-8 rounded-lg bg-white border border-[#E5E7DF] flex items-center justify-center text-[#26352B] hover:bg-[#DCE8D8] transition-colors"
                title="Increase servings"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-[#26352B] flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#355E46]" />
              Ingredients Needed
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    ing.isAvailable
                      ? 'bg-white border-[#E5E7DF]'
                      : 'bg-[#FBEFE8]/60 border-[#EDAD85]/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        ing.isAvailable ? 'bg-[#355E46]' : 'bg-[#EDAD85]'
                      }`}
                    />
                    <span className="font-medium text-[#26352B] truncate">
                      {ing.name}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-semibold text-[#26352B]">
                      {adjustQuantity(ing.quantity)}
                    </span>
                    {!ing.isAvailable && (
                      <span className="block text-[10px] text-[#EDAD85] font-semibold">
                        Need to buy
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-[#26352B]">
              Step-by-Step Cooking Steps
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-[#26352B]">
              {recipe.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F6F0]/50 border border-[#E5E7DF]"
                >
                  <span className="w-6 h-6 rounded-full bg-[#DCE8D8] text-[#355E46] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Equipment & Substitutions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {recipe.equipment.length > 0 && (
              <div className="p-3.5 rounded-xl bg-white border border-[#E5E7DF] space-y-1.5">
                <span className="font-bold text-[#26352B] uppercase tracking-wider block">
                  Equipment Needed
                </span>
                <ul className="list-disc list-inside text-[#607266] space-y-1">
                  {recipe.equipment.map((eq, i) => (
                    <li key={i}>{eq}</li>
                  ))}
                </ul>
              </div>
            )}

            {recipe.substitutions.length > 0 && (
              <div className="p-3.5 rounded-xl bg-white border border-[#E5E7DF] space-y-1.5">
                <span className="font-bold text-[#26352B] uppercase tracking-wider block">
                  Plausible Substitutions
                </span>
                <ul className="list-disc list-inside text-[#607266] space-y-1">
                  {recipe.substitutions.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Leftover Suggestion */}
          {recipe.leftoverSuggestion && (
            <div className="p-3.5 rounded-xl bg-[#DCE8D8]/40 border border-[#DCE8D8] text-xs text-[#26352B] space-y-1">
              <span className="font-bold text-[#355E46] uppercase tracking-wider block">
                Leftover & Repurpose Idea
              </span>
              <p className="leading-relaxed text-[#26352B]">
                {recipe.leftoverSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E5E7DF] bg-[#F7F6F0]/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#607266] hover:text-[#26352B] transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onToggleSelect(recipe.id);
            }}
            className={`px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer ${
              isSelected
                ? 'bg-[#355E46] text-white hover:bg-[#23402F]'
                : 'bg-white text-[#26352B] border border-[#E5E7DF] hover:border-[#355E46]'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#607266]'}`} />
            <span>{isSelected ? 'Selected for Meal Plan' : 'Select This Meal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
