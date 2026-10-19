import React from 'react';
import { Sparkles, Utensils, ShoppingBag, ArrowRight, Check, ChefHat, Flame } from 'lucide-react';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onTrySamplePlan: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlanning,
  onTrySamplePlan,
}) => {
  return (
    <div className="py-6 sm:py-12 space-y-12 sm:space-y-16">
      {/* Hero Header with Fluid Liquid Water Canvas */}
      <div className="relative rounded-3xl p-6 sm:p-12 border border-[#E4E8E2] shadow-sm overflow-hidden bg-[#FAF8F1]">
        {/* Internal animated fluid water gradient layers */}
        <div
          aria-hidden="true"
          className="absolute -inset-10 animate-water-primary pointer-events-none opacity-60"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 20% 25%, rgba(69, 214, 199, 0.45) 0%, rgba(79, 143, 232, 0.25) 50%, transparent 80%),
              radial-gradient(ellipse 60% 50% at 85% 70%, rgba(8, 126, 139, 0.30) 0%, rgba(188, 235, 250, 0.40) 45%, transparent 75%)
            `,
            filter: 'blur(50px)',
          }}
        />

        {/* Sunlight and warm coral / butter yellow blooms */}
        <div
          aria-hidden="true"
          className="absolute -inset-10 animate-sunlight-blooms pointer-events-none opacity-55"
          style={{
            background: `
              radial-gradient(circle 380px at 70% 20%, rgba(245, 215, 120, 0.40) 0%, rgba(242, 139, 120, 0.20) 40%, transparent 70%),
              radial-gradient(circle 320px at 25% 75%, rgba(242, 139, 120, 0.22) 0%, rgba(245, 215, 120, 0.20) 45%, transparent 70%)
            `,
            filter: 'blur(55px)',
          }}
        />

        {/* Translucent ivory content surface to ensure maximum legibility */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-[#45D6C7]/60 text-[#24352F] text-xs font-semibold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>Hacktoberfest 2026: Slow & Steady Challenge</span>
          </div>

          {/* Clean Modern Dark Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#24352F] leading-[1.12]">
            Your fridge has the ingredients.{' '}
            <span className="text-[#087E8B] block sm:inline mt-1 sm:mt-0">
              We have the plan.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#586B63] max-w-2xl mx-auto leading-relaxed">
            Eliminate dinner decision fatigue. Show SlothPlate what is in your fridge or pantry,
            confirm the items, and get 3 low-effort weeknight meals with a consolidated shopping list
            powered by open-weight AI.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onStartPlanning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#087E8B] hover:bg-[#06626D] text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Plan my meals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onTrySamplePlan}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/90 hover:bg-white border border-[#E4E8E2] hover:border-[#087E8B]/50 text-[#24352F] font-bold text-base shadow-2xs transition-colors cursor-pointer"
            >
              Try a sample plan
            </button>
          </div>

          {/* Value Tags */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[#586B63] pt-3">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#45D6C7]" />
              No login or account needed
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#F28B78]" />
              One-pot / one-pan cooking priority
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#4F8FE8]" />
              Google Gemma 4 open weights
            </span>
          </div>
        </div>
      </div>

      {/* Culinary Showcase Card with Solid/Translucent Ivory Surface */}
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xs rounded-2xl border border-[#E4E8E2] p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF8F1] border border-[#E4E8E2] text-[#087E8B] text-xs font-bold">
              <ChefHat className="w-3.5 h-3.5 text-[#087E8B]" />
              Designed for Low-Effort Cooking
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F] tracking-tight">
              Cooking shouldn't feel like a second shift.
            </h2>

            <p className="text-sm text-[#586B63] leading-relaxed">
              Most recipe sites push 20-step gourmet projects requiring 15 exotic spices you’ll use once.
              SlothPlate focuses on everyday realism:
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F1] border border-[#BCEBFA]">
                <div className="w-6 h-6 rounded-lg bg-[#087E8B] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#24352F] block font-semibold">Minimal active prep</strong>
                  <span className="text-[#586B63]">Simple assemblies ready in 10 to 30 minutes without frantic multitasking.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FEF9EB] border border-[#F5D778]/70">
                <div className="w-6 h-6 rounded-lg bg-[#F5D778] text-[#24352F] flex items-center justify-center shrink-0 mt-0.5">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#24352F] block font-semibold">Fewer dirty dishes</strong>
                  <span className="text-[#586B63]">One-pot and one-pan recipes to keep kitchen sink pileups away.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FDF3F0] border border-[#F28B78]/60">
                <div className="w-6 h-6 rounded-lg bg-[#F28B78] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#24352F] block font-semibold">Smart ingredient crossover</strong>
                  <span className="text-[#586B63]">Meals share perishable produce so nothing rots in the crisper drawer.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card Preview */}
          <div className="md:col-span-5 bg-[#FAF8F1] rounded-2xl border border-[#E4E8E2] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs border-b border-[#E4E8E2] pb-2.5">
              <span className="font-bold text-[#24352F] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#F28B78]" />
                Sample AI Recipe
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#BCEBFA]/40 text-[#087E8B] border border-[#45D6C7]/50 font-semibold text-[11px]">
                1 Pan • 12 mins
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#24352F]">
                Cheesy Spinach & Egg Fold
              </h3>
              <p className="text-xs text-[#586B63] mt-1 leading-relaxed">
                Warm skillet scramble with melted sharp cheddar and wilted baby greens over crunchy sourdough toast.
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-[#E4E8E2] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#087E8B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#45D6C7]" />
                  In your fridge:
                </span>
                <span className="text-[11px] font-semibold text-[#087E8B] bg-[#BCEBFA]/30 px-2 py-0.5 rounded-md">
                  4 items available
                </span>
              </div>

              <p className="text-[#586B63] text-[11px] pl-3.5">
                Eggs, Sharp Cheddar, Baby Spinach, Sourdough
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[#E4E8E2]">
                <span className="font-bold text-[#586B63] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F28B78]" />
                  Need to buy:
                </span>
                <span className="text-[11px] font-semibold text-[#087E8B] bg-[#BCEBFA]/30 px-2 py-0.5 rounded-md">
                  100% on hand
                </span>
              </div>
            </div>

            <button
              onClick={onTrySamplePlan}
              className="w-full py-2.5 text-xs font-bold text-[#087E8B] bg-white hover:bg-[#FAF8F1] border border-[#087E8B]/40 rounded-xl transition-colors cursor-pointer"
            >
              Explore Full Sample Plan →
            </button>
          </div>
        </div>
      </div>

      {/* 3-Step Process Highlights with Liquid Water Palette Surfaces */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#24352F]">
            How SlothPlate works
          </h2>
          <p className="text-xs sm:text-sm text-[#586B63]">
            From fridge photo to ready-to-cook in three peaceful steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Step 1: Sky blue surface */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#BCEBFA] p-5 space-y-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#BCEBFA] text-[#087E8B] flex items-center justify-center font-extrabold text-sm shadow-2xs">
              1
            </div>
            <h3 className="font-bold text-base text-[#24352F]">
              Scan or type ingredients
            </h3>
            <p className="text-xs text-[#586B63] leading-relaxed">
              Snap up to 3 photos of your fridge or pantry, or type items manually. Open-weight Gemma identifies visible food and lets you verify each estimate.
            </p>
          </div>

          {/* Step 2: Butter yellow surface */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#F5D778]/70 p-5 space-y-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F5D778] text-[#24352F] flex items-center justify-center font-extrabold text-sm shadow-2xs">
              2
            </div>
            <h3 className="font-bold text-base text-[#24352F]">
              Set effort & cleanup rules
            </h3>
            <p className="text-xs text-[#586B63] leading-relaxed">
              Tell SlothPlate how many servings you need, your cooking time ceiling (10–45 mins), and cleanup limits (such as one-pan only).
            </p>
          </div>

          {/* Step 3: Soft Coral surface */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#F28B78]/60 p-5 space-y-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F28B78] text-white flex items-center justify-center font-extrabold text-sm shadow-2xs">
              3
            </div>
            <h3 className="font-bold text-base text-[#24352F]">
              Cook & shop consolidated
            </h3>
            <p className="text-xs text-[#586B63] leading-relaxed">
              Pick your favorite recipes. Missing ingredients across all selected meals are automatically merged into an organized, print-friendly grocery checklist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
