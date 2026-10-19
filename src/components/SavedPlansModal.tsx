import React, { useState } from 'react';
import { X, Bookmark, Trash2, Calendar, ArrowRight } from 'lucide-react';
import { SavedMealPlan } from '../types';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SavedMealPlan[];
  onLoadPlan: (plan: SavedMealPlan) => void;
  onDeletePlan: (id: string) => void;
  onClearAll: () => void;
}

const RECIPE_TAG_STYLES = [
  'bg-[#BCEBFA]/30 dark:bg-[#45D6C7]/15 text-[#087E8B] dark:text-[#45D6C7] border-[#45D6C7]/50',
  'bg-[#FEF9EB] dark:bg-[#F5D778]/15 text-[#24352F] dark:text-[#F5D778] border-[#F5D778]',
  'bg-[#FDF3F0] dark:bg-[#F28B78]/15 text-[#F28B78] border-[#F28B78]/40',
  'bg-[#FAF8F1] dark:bg-[#4F8FE8]/15 text-[#087E8B] dark:text-[#4F8FE8] border-[#BCEBFA] dark:border-[#4F8FE8]/30',
];

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  onLoadPlan,
  onDeletePlan,
  onClearAll,
}) => {
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-[#13241F] w-full max-w-2xl rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] shadow-xl overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#E4E8E2] dark:border-[#223D35] flex items-center justify-between bg-[#FAF8F1] dark:bg-[#1A3029]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087E8B] text-white flex items-center justify-center shadow-2xs">
              <Bookmark className="w-4 h-4 text-[#F5D778]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#24352F] dark:text-[#E9F4F0]">
                Saved Meal Plans ({plans.length})
              </h2>
              <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
                Stored locally on this device via browser localStorage.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#586B63] dark:text-[#97ADA4] hover:text-[#24352F] dark:hover:text-white hover:bg-white dark:hover:bg-[#13241F] transition-colors cursor-pointer btn-interactive"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          {plans.length === 0 ? (
            <div className="py-14 text-center text-[#586B63] dark:text-[#97ADA4] space-y-2">
              <Bookmark className="w-10 h-10 text-[#E4E8E2] dark:text-[#223D35] mx-auto" />
              <p className="font-bold text-sm text-[#24352F] dark:text-[#E9F4F0]">
                No saved meal plans yet.
              </p>
              <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
                When you create a plan and grocery list, click "Save Plan & List" to store it here for later reference.
              </p>
            </div>
          ) : (
            plans.map((plan) => {
              const dateStr = new Date(plan.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={plan.id}
                  className="p-4 sm:p-5 rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] bg-[#FAF8F1] dark:bg-[#1A3029] hover:bg-white dark:hover:bg-[#1E352F] transition-all space-y-3.5 shadow-2xs hover:shadow-xs card-interactive"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#24352F] dark:text-[#E9F4F0]">
                        {plan.title || 'Untitled Meal Plan'}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-[#586B63] dark:text-[#97ADA4] mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#087E8B] dark:text-[#45D6C7]" />
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>{plan.recipes.length} recipes</span>
                        <span>•</span>
                        <span>{plan.confirmedIngredients.length} ingredients</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="p-1.5 text-[#586B63] dark:text-[#97ADA4] hover:text-[#F28B78] rounded-lg hover:bg-white dark:hover:bg-[#13241F] transition-colors cursor-pointer btn-interactive"
                      title="Delete this saved plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Recipes preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {plan.recipes.map((r, rIdx) => {
                      const tagStyle = RECIPE_TAG_STYLES[rIdx % RECIPE_TAG_STYLES.length];
                      return (
                        <span
                          key={r.id}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${tagStyle}`}
                        >
                          {r.title}
                        </span>
                      );
                    })}
                  </div>

                  <div className="pt-2.5 border-t border-[#E4E8E2] dark:border-[#223D35] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#586B63] dark:text-[#97ADA4]">
                      {plan.groceryList.filter((g) => !g.isAvailable).length} grocery items
                    </span>

                    <button
                      onClick={() => {
                        onLoadPlan(plan);
                        onClose();
                      }}
                      className="px-4 py-2 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs btn-interactive"
                    >
                      <span>Reopen Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Privacy Note */}
        <div className="p-4 border-t border-[#E4E8E2] dark:border-[#223D35] bg-[#FAF8F1] dark:bg-[#1A3029] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-[#586B63] dark:text-[#97ADA4] text-[11px]">
            Data is strictly stored in your local browser. No cloud sync or accounts.
          </p>

          {plans.length > 0 && (
            <div>
              {confirmClearAll ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#F28B78]">Confirm delete all?</span>
                  <button
                    onClick={() => {
                      onClearAll();
                      setConfirmClearAll(false);
                    }}
                    className="px-2 py-1 bg-[#F28B78] text-white rounded-md text-[11px] font-bold btn-interactive"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setConfirmClearAll(false)}
                    className="px-2 py-1 bg-white dark:bg-[#13241F] border border-[#E4E8E2] dark:border-[#223D35] text-[#24352F] dark:text-[#E9F4F0] rounded-md text-[11px] btn-interactive"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClearAll(true)}
                  className="text-xs font-bold text-[#F28B78] hover:underline cursor-pointer"
                >
                  Clear all saved data
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
