import React from 'react';
import { X, Bookmark, Trash2, Calendar, ArrowRight, AlertTriangle } from 'lucide-react';
import { SavedMealPlan } from '../types';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SavedMealPlan[];
  onLoadPlan: (plan: SavedMealPlan) => void;
  onDeletePlan: (id: string) => void;
  onClearAll: () => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  onLoadPlan,
  onDeletePlan,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7DF] shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7DF] flex items-center justify-between bg-[#F7F6F0]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#355E46] text-white flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#26352B]">
                Saved Meal Plans ({plans.length})
              </h2>
              <p className="text-xs text-[#607266]">
                Stored locally in this browser via localStorage.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#607266] hover:text-[#26352B] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          {plans.length === 0 ? (
            <div className="py-12 text-center text-[#607266] space-y-2">
              <Bookmark className="w-8 h-8 text-[#E5E7DF] mx-auto" />
              <p className="font-semibold text-sm text-[#26352B]">
                No saved meal plans yet.
              </p>
              <p className="text-xs">
                When you create a plan and grocery list, click "Save Plan & List" to store it here for later.
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
                  className="p-4 rounded-xl border border-[#E5E7DF] bg-[#F7F6F0]/40 hover:bg-[#F7F6F0] transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-sm text-[#26352B]">
                        {plan.title || 'Untitled Meal Plan'}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-[#607266] mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>{plan.recipes.length} recipes</span>
                        <span>•</span>
                        <span>{plan.confirmedIngredients.length} ingredients</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="p-1.5 text-[#607266] hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                      title="Delete this saved plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Recipes preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {plan.recipes.map((r) => (
                      <span
                        key={r.id}
                        className="px-2 py-0.5 rounded-md bg-white border border-[#E5E7DF] text-[11px] text-[#26352B] font-medium"
                      >
                        {r.title}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E5E7DF]/70 flex items-center justify-between">
                    <span className="text-[11px] text-[#607266]">
                      {plan.groceryList.filter((g) => !g.isAvailable).length} grocery items
                    </span>

                    <button
                      onClick={() => {
                        onLoadPlan(plan);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#355E46] hover:bg-[#23402F] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
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
        <div className="p-4 border-t border-[#E5E7DF] bg-[#F7F6F0]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-[#607266] text-[11px]">
            Data is stored strictly in your current browser. No accounts or cloud sync.
          </p>

          {plans.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all saved meal plans?')) {
                  onClearAll();
                }
              }}
              className="text-xs text-rose-600 hover:underline"
            >
              Clear all saved data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
