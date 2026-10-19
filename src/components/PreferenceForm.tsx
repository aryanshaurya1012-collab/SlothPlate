import React, { useState } from 'react';
import { Clock, Sparkles, AlertTriangle, ShieldCheck, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { CleanupPreference, DietaryOption, EffortLevel, UserPreferences } from '../types';

interface PreferenceFormProps {
  initialPreferences: UserPreferences;
  onGenerateMeals: (preferences: UserPreferences) => void;
  onBack: () => void;
  isGenerating: boolean;
}

const COMMON_PANTRY_STAPLES = [
  'Salt',
  'Black pepper',
  'Olive oil',
  'Cooking oil',
  'Butter',
  'Garlic',
  'Onion',
  'Soy sauce',
  'Rice',
  'Pasta',
  'Sugar / Honey',
];

const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree nuts',
  'Dairy / Lactose',
  'Gluten / Wheat',
  'Shellfish',
  'Eggs',
  'Soy',
  'Cilantro',
];

export const PreferenceForm: React.FC<PreferenceFormProps> = ({
  initialPreferences,
  onGenerateMeals,
  onBack,
  isGenerating,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [customAvoidInput, setCustomAvoidInput] = useState('');

  const handleStapleToggle = (staple: string) => {
    setPreferences((prev) => {
      const exists = prev.pantryStaples.includes(staple);
      const updated = exists
        ? prev.pantryStaples.filter((s) => s !== staple)
        : [...prev.pantryStaples, staple];
      return { ...prev, pantryStaples: updated };
    });
  };

  const handleAllergyToggle = (allergy: string) => {
    setPreferences((prev) => {
      const exists = prev.allergiesToAvoid.includes(allergy);
      const updated = exists
        ? prev.allergiesToAvoid.filter((a) => a !== allergy)
        : [...prev.allergiesToAvoid, allergy];
      return { ...prev, allergiesToAvoid: updated };
    });
  };

  const handleAddCustomAvoid = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customAvoidInput.trim();
    if (!clean) return;
    if (!preferences.allergiesToAvoid.includes(clean)) {
      setPreferences((prev) => ({
        ...prev,
        allergiesToAvoid: [...prev.allergiesToAvoid, clean],
      }));
    }
    setCustomAvoidInput('');
  };

  const handleRemoveAvoid = (item: string) => {
    setPreferences((prev) => ({
      ...prev,
      allergiesToAvoid: prev.allergiesToAvoid.filter((a) => a !== item),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateMeals(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto py-4 sm:py-8 space-y-7">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-[#E4E8E2] pb-4">
        <div>
          <span className="text-xs font-bold text-[#087E8B] uppercase tracking-wider">
            Step 2 of 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F] tracking-tight">
            How much effort do you want to spend?
          </h2>
          <p className="text-xs sm:text-sm text-[#586B63] mt-1">
            Set your cooking limits, cleanup rules, and dietary boundaries.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs sm:text-sm font-semibold text-[#586B63] hover:text-[#24352F] px-3 py-1.5 rounded-xl hover:bg-[#E4E8E2]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to ingredients</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-[#E4E8E2] p-5 sm:p-7 space-y-6 shadow-xs">
        {/* Servings & Total Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Servings */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#24352F] uppercase tracking-wider block">
              Servings Needed
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, servings: s }))}
                  className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    preferences.servings === s
                      ? 'bg-[#087E8B] text-white border-[#087E8B] shadow-2xs'
                      : 'bg-white text-[#24352F] border-[#E4E8E2] hover:border-[#087E8B]/50 hover:bg-[#FAF8F1]'
                  }`}
                >
                  {s === 5 ? '5+' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Cooking Time */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#24352F] uppercase tracking-wider block flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#087E8B]" />
              Max Cooking Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 45].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, cookingTimeMinutes: t }))}
                  className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    preferences.cookingTimeMinutes === t
                      ? 'bg-[#087E8B] text-white border-[#087E8B] shadow-2xs'
                      : 'bg-white text-[#24352F] border-[#E4E8E2] hover:border-[#087E8B]/50 hover:bg-[#FAF8F1]'
                  }`}
                >
                  {t} mins
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Effort & Cleanup Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#E4E8E2]">
          {/* Effort Level */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#24352F] uppercase tracking-wider block">
              Effort Preference
            </label>
            <div className="space-y-2">
              {(['Almost no effort', 'Easy', 'Normal'] as EffortLevel[]).map((level) => {
                const isSelected = preferences.effortLevel === level;
                return (
                  <label
                    key={level}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#BCEBFA]/25 border-[#087E8B] shadow-2xs'
                        : 'border-[#E4E8E2] hover:bg-[#FAF8F1]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="effortLevel"
                      checked={isSelected}
                      onChange={() => setPreferences((p) => ({ ...p, effortLevel: level }))}
                      className="mt-0.5 text-[#087E8B] focus:ring-[#087E8B]"
                    />
                    <div>
                      <span className="text-sm font-bold text-[#24352F] block">
                        {level}
                      </span>
                      <span className="text-xs text-[#586B63]">
                        {level === 'Almost no effort' && 'Quick assembly, 1-2 steps, minimal chopping'}
                        {level === 'Easy' && 'Straightforward cooking, light chopping, standard weeknight'}
                        {level === 'Normal' && 'Standard recipe balance with full flavor focus'}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Cleanup Preference */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#24352F] uppercase tracking-wider block">
              Cleanup Preference
            </label>
            <div className="space-y-2">
              {(['One-pot or one-pan', 'Minimal dishes', 'No preference'] as CleanupPreference[]).map(
                (c) => {
                  const isSelected = preferences.cleanup === c;
                  return (
                    <label
                      key={c}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#BCEBFA]/25 border-[#087E8B] shadow-2xs'
                          : 'border-[#E4E8E2] hover:bg-[#FAF8F1]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cleanup"
                        checked={isSelected}
                        onChange={() => setPreferences((p) => ({ ...p, cleanup: c }))}
                        className="mt-0.5 text-[#087E8B] focus:ring-[#087E8B]"
                      />
                      <div>
                        <span className="text-sm font-bold text-[#24352F] block">
                          {c}
                        </span>
                        <span className="text-xs text-[#586B63]">
                          {c === 'One-pot or one-pan' && 'Everything cooked in a single skillet, pot, or sheet'}
                          {c === 'Minimal dishes' && 'Keep prep bowls and dirty utensils to a minimum'}
                          {c === 'No preference' && 'Standard kitchen pots and pans usage'}
                        </span>
                      </div>
                    </label>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Dietary & Cuisine Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#E4E8E2]">
          {/* Dietary Option */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#24352F] uppercase tracking-wider block">
              Dietary Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['No preference', 'Vegetarian', 'Vegan'] as DietaryOption[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, dietary: d }))}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    preferences.dietary === d
                      ? 'bg-[#087E8B] text-white border-[#087E8B] shadow-2xs'
                      : 'bg-white text-[#24352F] border-[#E4E8E2] hover:border-[#087E8B]/50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={preferences.dietaryNotes}
              onChange={(e) => setPreferences((p) => ({ ...p, dietaryNotes: e.target.value }))}
              placeholder="Other dietary requirement (e.g. low-carb, high-protein)"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E4E8E2] focus:outline-none focus:border-[#087E8B] transition-colors"
            />
          </div>

          {/* Cuisine Preference */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#24352F] uppercase tracking-wider block">
              Cuisine Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['No preference', 'Indian', 'Asian', 'Mediterranean', 'Comfort food'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, cuisine: c }))}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    preferences.cuisine === c
                      ? 'bg-[#087E8B] text-white border-[#087E8B] shadow-2xs'
                      : 'bg-white text-[#24352F] border-[#E4E8E2] hover:border-[#087E8B]/50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Allergies and Ingredients to Avoid */}
        <div className="space-y-3 pt-4 border-t border-[#E4E8E2]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#24352F] uppercase tracking-wider block flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F28B78]" />
              Allergies & Ingredients to Avoid
            </label>
            <span className="text-[11px] font-semibold text-[#F28B78]">Strictly excluded by AI</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {COMMON_ALLERGIES.map((allergy) => {
              const isSelected = preferences.allergiesToAvoid.includes(allergy);
              return (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => handleAllergyToggle(allergy)}
                  className={`px-3 py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-[#FDF3F0] text-[#F28B78] border-[#F28B78] font-bold shadow-2xs'
                      : 'bg-[#FAF8F1] text-[#24352F] border-[#E4E8E2] hover:border-[#F28B78]'
                  }`}
                >
                  {isSelected ? `✓ Exclude ${allergy}` : `+ ${allergy}`}
                </button>
              );
            })}
          </div>

          {/* Custom avoid input */}
          <div className="flex gap-2 max-w-md pt-1">
            <input
              type="text"
              value={customAvoidInput}
              onChange={(e) => setCustomAvoidInput(e.target.value)}
              placeholder="Add specific ingredient to avoid (e.g. mushrooms, bell peppers)"
              className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-[#E4E8E2] focus:outline-none focus:border-[#087E8B]"
            />
            <button
              type="button"
              onClick={handleAddCustomAvoid}
              className="px-4 py-2 text-xs bg-[#FAF8F1] hover:bg-[#E4E8E2] text-[#24352F] font-bold rounded-xl border border-[#E4E8E2] transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Active avoid tags */}
          {preferences.allergiesToAvoid.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {preferences.allergiesToAvoid.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FDF3F0] text-[#F28B78] text-xs font-bold border border-[#F28B78]/40"
                >
                  <span>Excluding: {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAvoid(item)}
                    className="hover:text-rose-900 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Basic Pantry Staples */}
        <div className="space-y-2 pt-4 border-t border-[#E4E8E2]">
          <label className="text-xs font-bold text-[#24352F] uppercase tracking-wider block">
            Confirmed Basic Staples (Select all you already have)
          </label>
          <p className="text-xs text-[#586B63]">
            SlothPlate assumes you have these in your cupboards and won't put them on your grocery list.
          </p>
          <div className="flex flex-wrap gap-2 pt-1.5">
            {COMMON_PANTRY_STAPLES.map((staple) => {
              const hasIt = preferences.pantryStaples.includes(staple);
              return (
                <button
                  key={staple}
                  type="button"
                  onClick={() => handleStapleToggle(staple)}
                  className={`px-3 py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-medium ${
                    hasIt
                      ? 'bg-[#BCEBFA]/30 text-[#087E8B] border-[#45D6C7] font-bold shadow-2xs'
                      : 'bg-white text-[#586B63] border-[#E4E8E2] hover:border-[#45D6C7]/60'
                  }`}
                >
                  {hasIt ? `✓ ${staple}` : staple}
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety & Allergy Disclaimer */}
        <div className="p-4 rounded-xl bg-[#FAF8F1] border border-[#BCEBFA] flex items-start gap-2.5 text-xs text-[#24352F]">
          <ShieldCheck className="w-4 h-4 text-[#087E8B] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#24352F]">Safety disclaimer:</strong> Recipe suggestions are AI estimates based on your input. Never assume a recipe is guaranteed 100% allergen-free. Always inspect all packaged foods, seasonings, and raw ingredients yourself before consumption.
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <p className="text-xs text-[#586B63]">
            Ready to design 3 low-effort meals with your confirmed ingredients.
          </p>
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all ${
              isGenerating
                ? 'bg-[#E4E8E2] text-[#586B63] cursor-not-allowed'
                : 'bg-[#087E8B] hover:bg-[#06626D] text-white cursor-pointer hover:shadow-md'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                <span>Gemma 4 is designing meals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#F5D778]" />
                <span>Generate 3 Meal Suggestions</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
