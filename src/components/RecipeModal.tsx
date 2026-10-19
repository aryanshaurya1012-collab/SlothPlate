import React, { useState } from 'react';
import { X, Clock, Utensils, Plus, Minus, ChefHat, CheckCircle2 } from 'lucide-react';
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
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E4E8E2] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E4E8E2] flex items-start justify-between gap-4 bg-[#FAF8F1]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#BCEBFA]/40 text-[#087E8B] border border-[#45D6C7]/40">
                {recipe.effortLevel}
              </span>
              <span className="text-xs font-medium text-[#586B63] flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-[#E4E8E2]">
                <Clock className="w-3.5 h-3.5 text-[#087E8B]" />
                {recipe.totalTimeMinutes} mins total
              </span>
              <span className="text-xs font-medium text-[#586B63] flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-[#E4E8E2]">
                <Utensils className="w-3.5 h-3.5 text-[#087E8B]" />
                {recipe.dishCount} {recipe.dishCount === 1 ? 'pan/dish' : 'dishes'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#24352F] tracking-tight">
              {recipe.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#586B63] leading-relaxed">
              {recipe.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#586B63] hover:text-[#24352F] hover:bg-white transition-colors cursor-pointer"
            title="Close recipe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* Servings Adjuster */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FEF9EB] border border-[#F5D778]">
            <div>
              <span className="font-bold text-xs text-[#24352F] uppercase tracking-wider block">
                Portion Size
              </span>
              <span className="text-xs text-[#586B63]">
                Adjust servings (quantities update dynamically below)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentServings((s) => Math.max(1, s - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-[#E4E8E2] flex items-center justify-center text-[#24352F] hover:bg-[#FAF8F1] transition-colors cursor-pointer shadow-2xs font-bold"
                title="Decrease servings"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-sm text-[#24352F] w-14 text-center">
                {currentServings} {currentServings === 1 ? 'serving' : 'servings'}
              </span>
              <button
                onClick={() => setCurrentServings((s) => Math.min(12, s + 1))}
                className="w-8 h-8 rounded-lg bg-white border border-[#E4E8E2] flex items-center justify-center text-[#24352F] hover:bg-[#FAF8F1] transition-colors cursor-pointer shadow-2xs font-bold"
                title="Increase servings"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-[#24352F] flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#087E8B]" />
              Ingredients Needed
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                    ing.isAvailable
                      ? 'bg-[#BCEBFA]/20 border-[#45D6C7]/50'
                      : 'bg-[#FDF3F0] border-[#F28B78]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        ing.isAvailable ? 'bg-[#45D6C7]' : 'bg-[#F28B78]'
                      }`}
                    />
                    <span className="font-bold text-[#24352F] truncate">
                      {ing.name}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-[#24352F]">
                      {adjustQuantity(ing.quantity)}
                    </span>
                    {!ing.isAvailable && (
                      <span className="block text-[10px] text-[#F28B78] font-bold">
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
            <h3 className="font-extrabold text-base text-[#24352F]">
              Step-by-Step Instructions
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-[#24352F]">
              {recipe.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F1] border border-[#E4E8E2]"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#BCEBFA] text-[#087E8B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
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
              <div className="p-4 rounded-xl bg-[#FAF8F1] border border-[#BCEBFA] space-y-1.5">
                <span className="font-bold text-[#24352F] uppercase tracking-wider block">
                  Equipment Needed
                </span>
                <ul className="list-disc list-inside text-[#586B63] space-y-1">
                  {recipe.equipment.map((eq, i) => (
                    <li key={i}>{eq}</li>
                  ))}
                </ul>
              </div>
            )}

            {recipe.substitutions.length > 0 && (
              <div className="p-4 rounded-xl bg-[#FAF8F1] border border-[#E4E8E2] space-y-1.5">
                <span className="font-bold text-[#24352F] uppercase tracking-wider block">
                  Plausible Substitutions
                </span>
                <ul className="list-disc list-inside text-[#586B63] space-y-1">
                  {recipe.substitutions.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Leftover Suggestion */}
          {recipe.leftoverSuggestion && (
            <div className="p-4 rounded-xl bg-[#BCEBFA]/20 border border-[#45D6C7]/50 text-xs text-[#24352F] space-y-1">
              <span className="font-bold text-[#087E8B] uppercase tracking-wider block">
                Leftover & Repurpose Idea
              </span>
              <p className="leading-relaxed text-[#24352F]">
                {recipe.leftoverSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E4E8E2] bg-[#FAF8F1] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#586B63] hover:text-[#24352F] transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => onToggleSelect(recipe.id)}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isSelected
                ? 'bg-[#087E8B] text-white hover:bg-[#06626D]'
                : 'bg-white text-[#24352F] border border-[#E4E8E2] hover:border-[#087E8B]'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#45D6C7]'}`} />
            <span>{isSelected ? 'Selected for Meal Plan' : 'Select This Meal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
