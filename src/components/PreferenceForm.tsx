import React, { useState } from 'react';
import { Clock, Utensils, Sparkles, AlertTriangle, ShieldCheck, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import { BudgetPreference, CleanupPreference, DietaryOption, EffortLevel, UserPreferences } from '../types';

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
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7DF] pb-4">
        <div>
          <span className="text-xs font-semibold text-[#355E46] uppercase tracking-wider">
            Step 2 of 3
          </span>
          <h2 className="text-2xl font-bold text-[#26352B] tracking-tight">
            How much effort do you want to spend?
          </h2>
          <p className="text-xs sm:text-sm text-[#607266] mt-0.5">
            Set your cooking limits, cleanup rules, and dietary boundaries.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs sm:text-sm text-[#607266] hover:text-[#26352B] px-3 py-1.5 rounded-lg hover:bg-[#E5E7DF]/40 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to ingredients</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7DF] p-5 sm:p-6 space-y-6 shadow-xs">
        {/* Servings & Total Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Servings */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#26352B] uppercase tracking-wider block">
              Servings
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, servings: s }))}
                  className={`py-2 text-sm font-semibold rounded-xl border transition-colors cursor-pointer ${
                    preferences.servings === s
                      ? 'bg-[#355E46] text-white border-[#355E46]'
                      : 'bg-white text-[#26352B] border-[#E5E7DF] hover:border-[#355E46]/40'
                  }`}
                >
                  {s === 5 ? '5+' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Cooking Time */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#26352B] uppercase tracking-wider block flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#355E46]" />
              Max Cooking Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 45].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, cookingTimeMinutes: t }))}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-colors cursor-pointer ${
                    preferences.cookingTimeMinutes === t
                      ? 'bg-[#355E46] text-white border-[#355E46]'
                      : 'bg-white text-[#26352B] border-[#E5E7DF] hover:border-[#355E46]/40'
                  }`}
                >
                  {t} mins
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Effort & Cleanup Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#E5E7DF]">
          {/* Effort Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#26352B] uppercase tracking-wider block">
              Effort Preference
            </label>
            <div className="space-y-2">
              {(['Almost no effort', 'Easy', 'Normal'] as EffortLevel[]).map((level) => (
                <label
                  key={level}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    preferences.effortLevel === level
                      ? 'bg-[#DCE8D8]/50 border-[#355E46]'
                      : 'border-[#E5E7DF] hover:bg-[#F7F6F0]'
                  }`}
                >
                  <input
                    type="radio"
                    name="effortLevel"
                    checked={preferences.effortLevel === level}
                    onChange={() => setPreferences((p) => ({ ...p, effortLevel: level }))}
                    className="mt-0.5 text-[#355E46] focus:ring-[#355E46]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#26352B] block">
                      {level}
                    </span>
                    <span className="text-xs text-[#607266]">
                      {level === 'Almost no effort' && 'Quick assembly, 1-2 steps, minimal chopping'}
                      {level === 'Easy' && 'Straightforward cooking, light chopping, standard weeknight'}
                      {level === 'Normal' && 'Standard recipe balance with full flavor focus'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cleanup Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#26352B] uppercase tracking-wider block">
              Cleanup Preference
            </label>
            <div className="space-y-2">
              {(['One-pot or one-pan', 'Minimal dishes', 'No preference'] as CleanupPreference[]).map(
                (c) => (
                  <label
                    key={c}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      preferences.cleanup === c
                        ? 'bg-[#DCE8D8]/50 border-[#355E46]'
                        : 'border-[#E5E7DF] hover:bg-[#F7F6F0]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cleanup"
                      checked={preferences.cleanup === c}
                      onChange={() => setPreferences((p) => ({ ...p, cleanup: c }))}
                      className="mt-0.5 text-[#355E46] focus:ring-[#355E46]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[#26352B] block">
                        {c}
                      </span>
                      <span className="text-xs text-[#607266]">
                        {c === 'One-pot or one-pan' && 'Everything cooked in a single skillet, pot, or sheet'}
                        {c === 'Minimal dishes' && 'Keep prep bowls and dirty utensils to a minimum'}
                        {c === 'No preference' && 'Normal pots and pans usage'}
                      </span>
                    </div>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* Dietary & Cuisine Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#E5E7DF]">
          {/* Dietary Option */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#26352B] uppercase tracking-wider block">
              Dietary Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['No preference', 'Vegetarian', 'Vegan'] as DietaryOption[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, dietary: d }))}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    preferences.dietary === d
                      ? 'bg-[#355E46] text-white border-[#355E46]'
                      : 'bg-white text-[#26352B] border-[#E5E7DF] hover:border-[#355E46]/40'
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
              className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5E7DF] focus:outline-none focus:border-[#355E46] transition-colors"
            />
          </div>

          {/* Cuisine Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#26352B] uppercase tracking-wider block">
              Cuisine Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['No preference', 'Indian', 'Asian', 'Mediterranean', 'Comfort food'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, cuisine: c }))}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    preferences.cuisine === c
                      ? 'bg-[#355E46] text-white border-[#355E46]'
                      : 'bg-white text-[#26352B] border-[#E5E7DF] hover:border-[#355E46]/40'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Allergies and Ingredients to Avoid */}
        <div className="space-y-3 pt-4 border-t border-[#E5E7DF]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#26352B] uppercase tracking-wider block flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Allergies & Ingredients to Avoid
            </label>
            <span className="text-[11px] text-[#607266]">Strictly excluded by AI</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {COMMON_ALLERGIES.map((allergy) => {
              const isSelected = preferences.allergiesToAvoid.includes(allergy);
              return (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => handleAllergyToggle(allergy)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                      : 'bg-[#F7F6F0] text-[#26352B] border-[#E5E7DF] hover:border-[#355E46]/40'
                  }`}
                >
                  {isSelected ? `✓ Exclude ${allergy}` : `+ ${allergy}`}
                </button>
              );
            })}
          </div>

          {/* Custom avoid input */}
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={customAvoidInput}
              onChange={(e) => setCustomAvoidInput(e.target.value)}
              placeholder="Add specific ingredient to avoid (e.g. mushrooms, bell peppers)"
              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-[#E5E7DF] focus:outline-none focus:border-[#355E46]"
            />
            <button
              type="button"
              onClick={handleAddCustomAvoid}
              className="px-3 py-1.5 text-xs bg-[#F7F6F0] hover:bg-[#E5E7DF] text-[#26352B] font-medium rounded-lg border border-[#E5E7DF] transition-colors"
            >
              Add
            </button>
          </div>

          {/* Active avoid tags */}
          {preferences.allergiesToAvoid.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {preferences.allergiesToAvoid.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs border border-rose-200"
                >
                  <span>Excluding: {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAvoid(item)}
                    className="hover:text-rose-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Basic Pantry Staples */}
        <div className="space-y-2 pt-4 border-t border-[#E5E7DF]">
          <label className="text-xs font-bold text-[#26352B] uppercase tracking-wider block">
            Confirmed Basic Staples (Select all you already have)
          </label>
          <p className="text-xs text-[#607266]">
            SlothPlate will assume you have these and won't add them to your shopping list.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {COMMON_PANTRY_STAPLES.map((staple) => {
              const hasIt = preferences.pantryStaples.includes(staple);
              return (
                <button
                  key={staple}
                  type="button"
                  onClick={() => handleStapleToggle(staple)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    hasIt
                      ? 'bg-[#DCE8D8] text-[#355E46] border-[#355E46]/40 font-semibold'
                      : 'bg-white text-[#607266] border-[#E5E7DF] hover:border-[#355E46]/40'
                  }`}
                >
                  {hasIt ? `✓ ${staple}` : staple}
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety & Allergy Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#F7F6F0] border border-[#E5E7DF] flex items-start gap-2.5 text-xs text-[#607266]">
          <ShieldCheck className="w-4 h-4 text-[#355E46] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#26352B]">Safety disclaimer:</strong> Recipe suggestions are generated by AI based on your prompt constraints. Never assume a recipe is guaranteed 100% allergen-free. Always inspect all packaged foods, sauces, and raw ingredients yourself before consumption.
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#607266]">
            Ready to generate 3 meals using your confirmed ingredients.
          </p>
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
              isGenerating
                ? 'bg-[#E5E7DF] text-[#607266] cursor-not-allowed'
                : 'bg-[#355E46] hover:bg-[#23402F] text-white cursor-pointer'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                <span>Gemma 4 is designing meals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#EDAD85]" />
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
