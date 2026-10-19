import React from 'react';
import { Camera, Sparkles, Clock, Utensils, ShoppingBag, ArrowRight, Check, ShieldAlert } from 'lucide-react';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onTrySamplePlan: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlanning,
  onTrySamplePlan,
}) => {
  return (
    <div className="py-8 md:py-14 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCE8D8] text-[#355E46] text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Hacktoberfest 2026: Slow & Steady Challenge
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#26352B] leading-tight font-serif-accent">
          Your fridge has the ingredients.{' '}
          <span className="text-[#355E46] block sm:inline">We have the plan.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#607266] max-w-2xl mx-auto leading-relaxed">
          Avoid the repetitive effort of deciding what to cook and what groceries to buy. 
          Show SlothPlate what is in your fridge, confirm the ingredients, and receive easy, 
          low-effort meal options with a consolidated shopping list powered by open-weight AI.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartPlanning}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#355E46] hover:bg-[#23402F] text-white font-semibold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Plan my meals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onTrySamplePlan}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#F7F6F0] border border-[#E5E7DF] hover:border-[#355E46]/40 text-[#26352B] font-semibold text-base shadow-xs transition-colors cursor-pointer"
          >
            Try a sample plan
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#607266] pt-2">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#355E46]" /> No account or signup required
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#355E46]" /> Minimal dirty dishes & cookware
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#355E46]" /> Powered by Gemma 4 (open-weight)
          </span>
        </div>
      </div>

      {/* Visual Showcase Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E5E7DF] p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-block px-2.5 py-1 rounded-md bg-[#FBEFE8] text-[#26352B] text-xs font-medium">
              Why SlothPlate?
            </div>
            <h2 className="text-2xl font-bold text-[#26352B] tracking-tight">
              Cooking shouldn't feel like a second job.
            </h2>
            <p className="text-sm text-[#607266] leading-relaxed">
              Most recipe sites throw 20-step gourmet projects at you with 15 exotic spices you will only use once. 
              SlothPlate is designed for the real world:
            </p>

            <ul className="space-y-2.5 text-sm text-[#26352B]">
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#DCE8D8] text-[#355E46] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span><strong>Minimal active prep:</strong> Fast weeknight meals ready in 10 to 30 minutes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#DCE8D8] text-[#355E46] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span><strong>Fewer dishes to wash:</strong> One-pot and one-pan recipes keep sink pileups away.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#DCE8D8] text-[#355E46] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span><strong>Zero grocery waste:</strong> Shared ingredients overlap across meals so nothing rots in the crisper.</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-5 bg-[#F7F6F0] rounded-xl border border-[#E5E7DF] p-4.5 space-y-3.5">
            <div className="flex items-center justify-between text-xs text-[#607266] border-b border-[#E5E7DF] pb-2">
              <span className="font-semibold text-[#26352B]">Sample AI Meal Suggestion</span>
              <span className="px-2 py-0.5 rounded-full bg-[#DCE8D8] text-[#355E46] font-medium">1 Pan • 12 min</span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#26352B]">
                Cheesy Spinach & Egg Fold
              </h3>
              <p className="text-xs text-[#607266] mt-1">
                Warm skillet scramble with melted sharp cheddar and wilted greens, served over crusty bread.
              </p>
            </div>

            <div className="bg-white rounded-lg p-2.5 border border-[#E5E7DF] space-y-1.5 text-xs">
              <div className="font-semibold text-[#355E46] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#355E46]"></span>
                From your fridge:
              </div>
              <div className="text-[#607266] pl-3">
                Eggs, Cheddar cheese, Baby spinach, Sourdough
              </div>
              <div className="font-semibold text-[#EDAD85] flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EDAD85]"></span>
                Need to buy:
              </div>
              <div className="text-[#607266] pl-3">
                None! (100% fridge ready)
              </div>
            </div>

            <button
              onClick={onTrySamplePlan}
              className="w-full py-2 text-xs font-semibold text-[#355E46] bg-white border border-[#355E46]/30 hover:bg-[#DCE8D8]/50 rounded-lg transition-colors"
            >
              View Full Sample Plan →
            </button>
          </div>
        </div>
      </div>

      {/* 3-Step Process Explanation */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#26352B]">
            How SlothPlate works
          </h2>
          <p className="text-xs sm:text-sm text-[#607266] mt-1">
            From fridge photo to ready-to-cook in three peaceful steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-white rounded-xl border border-[#E5E7DF] p-5 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#DCE8D8] text-[#355E46] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-semibold text-base text-[#26352B]">
              Scan or type ingredients
            </h3>
            <p className="text-xs text-[#607266] leading-relaxed">
              Snap up to 3 photos of your fridge or pantry, or type items manually. Open-weight Gemma identifies visible food and lets you verify it.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl border border-[#E5E7DF] p-5 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#DCE8D8] text-[#355E46] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-semibold text-base text-[#26352B]">
              Set effort & cleanup rules
            </h3>
            <p className="text-xs text-[#607266] leading-relaxed">
              Tell SlothPlate how many servings you need, your cooking time limit (10–30 mins), and your cleanup tolerance (like one-pan only).
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl border border-[#E5E7DF] p-5 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#DCE8D8] text-[#355E46] flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-semibold text-base text-[#26352B]">
              Cook & shop consolidated
            </h3>
            <p className="text-xs text-[#607266] leading-relaxed">
              Choose your favorite meals. Missing items are automatically combined into an organized, print-friendly grocery checklist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
