import React, { useState } from 'react';
import { Sparkles, Utensils, ShoppingBag, ArrowRight, Check, ChefHat, Flame, Leaf, Citrus, Plus, Minus } from 'lucide-react';
import { useScrollRevealGroup } from '../utils/useScrollReveal';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onTrySamplePlan: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlanning,
  onTrySamplePlan,
}) => {
  const containerRef = useScrollRevealGroup<HTMLDivElement>();
  const [interactiveServings, setInteractiveServings] = useState(2);

  // Dynamic quantity scaling for the interactive preview card
  const eggCount = Math.round(2 * interactiveServings);
  const cheeseOz = Math.round(1.5 * interactiveServings);
  const spinachCups = Math.round(1 * interactiveServings);

  return (
    <div ref={containerRef} className="py-6 sm:py-12 space-y-14 sm:space-y-20 relative">
      {/* Hero Header with Frosted Glass Surface over Liquid Water Flow */}
      <div className="relative rounded-3xl p-6 sm:p-12 border border-white/70 dark:border-white/10 shadow-lg overflow-hidden bg-white/65 dark:bg-[#13241F]/70 backdrop-blur-md transition-colors duration-300">
        {/* Floating playful details (sparse and non-intrusive) */}
        <div
          aria-hidden="true"
          className="absolute -top-3 left-8 sm:left-14 p-2.5 rounded-2xl bg-white/80 dark:bg-[#1A3029]/80 border border-[#45D6C7]/50 shadow-sm animate-float-1 pointer-events-none"
        >
          <Leaf className="w-5 h-5 text-[#45D6C7]" />
        </div>

        <div
          aria-hidden="true"
          className="absolute top-12 right-6 sm:right-16 p-2.5 rounded-2xl bg-white/80 dark:bg-[#1A3029]/80 border border-[#F5D778]/70 shadow-sm animate-float-2 pointer-events-none"
        >
          <Citrus className="w-5 h-5 text-[#F5D778]" />
        </div>

        <div
          aria-hidden="true"
          className="absolute -bottom-2 right-12 sm:right-24 p-2.5 rounded-2xl bg-white/80 dark:bg-[#1A3029]/80 border border-[#F28B78]/50 shadow-sm animate-float-1 pointer-events-none"
          style={{ animationDelay: '-2.5s' }}
        >
          <Flame className="w-4 h-4 text-[#F28B78]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Badge with floating culinary sloth mark */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#1A3029]/90 border border-[#45D6C7]/60 text-[#24352F] dark:text-[#E9F4F0] text-xs font-semibold tracking-wide shadow-2xs">
            {/* Playful mini mascot */}
            <span className="w-5 h-5 rounded-full bg-[#087E8B] text-white flex items-center justify-center text-[10px]">
              🦥
            </span>
            <span>Hacktoberfest 2026: Slow & Steady Challenge</span>
            <Sparkles className="w-3.5 h-3.5 text-[#087E8B] dark:text-[#45D6C7]" />
          </div>

          {/* Headline with high contrast & tasteful Coral-to-Orange accent */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#24352F] dark:text-[#E9F4F0] leading-[1.12]">
            Your fridge has the ingredients.{' '}
            <span className="block sm:inline mt-1 sm:mt-0 bg-gradient-to-r from-[#F28B78] via-[#E86D55] to-[#F5D778] bg-clip-text text-transparent font-black">
              We have the plan.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#586B63] dark:text-[#97ADA4] max-w-2xl mx-auto leading-relaxed">
            Eliminate dinner decision fatigue. Show SlothPlate what is in your fridge or pantry,
            confirm the items, and get 3 low-effort weeknight meals with a consolidated shopping list
            powered by open-weight AI.
          </p>

          {/* Action CTAs with responsive hover lift */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onStartPlanning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#087E8B] hover:bg-[#06626D] text-white font-bold text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2.5 group cursor-pointer btn-interactive"
            >
              <span>Plan my meals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={onTrySamplePlan}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/90 dark:bg-[#1A3029]/90 hover:bg-white dark:hover:bg-[#223F36] border border-[#E4E8E2] dark:border-[#223D35] hover:border-[#087E8B]/50 text-[#24352F] dark:text-[#E9F4F0] font-bold text-base shadow-2xs transition-colors cursor-pointer btn-interactive"
            >
              Try a sample plan
            </button>
          </div>

          {/* Value Tags */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[#586B63] dark:text-[#97ADA4] pt-3">
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

      {/* Layered Application Preview & Culinary Showcase with Scroll Reveal */}
      <div className="max-w-4xl mx-auto bg-white/85 dark:bg-[#13241F]/85 backdrop-blur-sm rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Principles with horizontal reveal */}
          <div className="md:col-span-7 space-y-4 reveal-horizontal-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#E4E8E2] dark:border-[#223D35] text-[#087E8B] dark:text-[#45D6C7] text-xs font-bold">
              <ChefHat className="w-3.5 h-3.5 text-[#087E8B] dark:text-[#45D6C7]" />
              Designed for Low-Effort Cooking
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F] dark:text-[#E9F4F0] tracking-tight">
              Cooking shouldn't feel like a second shift.
            </h2>

            <p className="text-sm text-[#586B63] dark:text-[#97ADA4] leading-relaxed">
              Most recipe sites push 20-step gourmet projects requiring 15 exotic spices you’ll use once.
              SlothPlate focuses on everyday realism:
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-[#1A3029]/70 border border-[#BCEBFA] dark:border-[#45D6C7]/30 card-interactive">
                <div className="w-6 h-6 rounded-lg bg-[#087E8B] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#24352F] dark:text-[#E9F4F0] block font-semibold">Minimal active prep</strong>
                  <span className="text-[#586B63] dark:text-[#97ADA4]">Simple assemblies ready in 10 to 30 minutes without frantic multitasking.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-[#1A3029]/70 border border-[#F5D778]/70 dark:border-[#F5D778]/40 card-interactive">
                <div className="w-6 h-6 rounded-lg bg-[#F5D778] text-[#24352F] flex items-center justify-center shrink-0 mt-0.5">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#24352F] dark:text-[#E9F4F0] block font-semibold">Fewer dirty dishes</strong>
                  <span className="text-[#586B63] dark:text-[#97ADA4]">One-pot and one-pan recipes to keep kitchen sink pileups away.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-[#1A3029]/70 border border-[#F28B78]/60 dark:border-[#F28B78]/40 card-interactive">
                <div className="w-6 h-6 rounded-lg bg-[#F28B78] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#24352F] dark:text-[#E9F4F0] block font-semibold">Smart ingredient crossover</strong>
                  <span className="text-[#586B63] dark:text-[#97ADA4]">Meals share perishable produce so nothing rots in the crisper drawer.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Real Application Preview with interactive serving adjuster */}
          <div className="md:col-span-5 bg-[#FAF8F1] dark:bg-[#1A3029] rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] p-5 space-y-4 shadow-sm reveal-horizontal-right">
            <div className="flex items-center justify-between text-xs border-b border-[#E4E8E2] dark:border-[#223D35] pb-2.5">
              <span className="font-bold text-[#24352F] dark:text-[#E9F4F0] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#F28B78]" />
                Live Recipe Preview
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#BCEBFA]/40 dark:bg-[#45D6C7]/20 text-[#087E8B] dark:text-[#45D6C7] border border-[#45D6C7]/50 font-semibold text-[11px]">
                1 Pan • 12 mins
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#24352F] dark:text-[#E9F4F0]">
                Cheesy Spinach & Egg Fold
              </h3>
              <p className="text-xs text-[#586B63] dark:text-[#97ADA4] mt-1 leading-relaxed">
                Warm skillet scramble with melted sharp cheddar and wilted baby greens over crunchy sourdough toast.
              </p>
            </div>

            {/* Interactive Serving Scaler Demo */}
            <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#13241F] rounded-xl border border-[#E4E8E2] dark:border-[#223D35] text-xs">
              <span className="text-[#586B63] dark:text-[#97ADA4] font-medium">Servings:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInteractiveServings((s) => Math.max(1, s - 1))}
                  className="w-6 h-6 rounded-md bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#E4E8E2] dark:border-[#223D35] flex items-center justify-center font-bold text-[#24352F] dark:text-[#E9F4F0] hover:bg-[#E4E8E2] cursor-pointer"
                  title="Decrease demo portion"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-extrabold w-5 text-center text-[#24352F] dark:text-[#E9F4F0]">
                  {interactiveServings}
                </span>
                <button
                  onClick={() => setInteractiveServings((s) => Math.min(6, s + 1))}
                  className="w-6 h-6 rounded-md bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#E4E8E2] dark:border-[#223D35] flex items-center justify-center font-bold text-[#24352F] dark:text-[#E9F4F0] hover:bg-[#E4E8E2] cursor-pointer"
                  title="Increase demo portion"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Live scaled ingredient chips */}
            <div className="bg-white dark:bg-[#13241F] rounded-xl p-3 border border-[#E4E8E2] dark:border-[#223D35] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#087E8B] dark:text-[#45D6C7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#45D6C7]" />
                  Scaled for {interactiveServings} {interactiveServings === 1 ? 'person' : 'people'}:
                </span>
                <span className="text-[11px] font-semibold text-[#087E8B] dark:text-[#45D6C7] bg-[#BCEBFA]/30 dark:bg-[#45D6C7]/15 px-2 py-0.5 rounded-md">
                  In fridge ✓
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#E4E8E2] dark:border-[#223D35] text-[11px] text-[#24352F] dark:text-[#E9F4F0] font-medium">
                  {eggCount} Eggs
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#E4E8E2] dark:border-[#223D35] text-[11px] text-[#24352F] dark:text-[#E9F4F0] font-medium">
                  {cheeseOz} oz Cheddar
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#E4E8E2] dark:border-[#223D35] text-[11px] text-[#24352F] dark:text-[#E9F4F0] font-medium">
                  {spinachCups} cup Spinach
                </span>
              </div>
            </div>

            <button
              onClick={onTrySamplePlan}
              className="w-full py-2.5 text-xs font-bold text-[#087E8B] dark:text-[#45D6C7] bg-white dark:bg-[#13241F] hover:bg-[#FAF8F1] dark:hover:bg-[#1A3029] border border-[#087E8B]/40 rounded-xl transition-all cursor-pointer btn-interactive shadow-2xs"
            >
              Explore Full Sample Plan →
            </button>
          </div>
        </div>
      </div>

      {/* 3-Step Process Highlights with Staggered Scroll Reveal */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1 reveal-item">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#24352F] dark:text-[#E9F4F0]">
            How SlothPlate works
          </h2>
          <p className="text-xs sm:text-sm text-[#586B63] dark:text-[#97ADA4]">
            From fridge photo to ready-to-cook in three peaceful steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-white/90 dark:bg-[#13241F]/90 backdrop-blur-xs rounded-2xl border border-[#BCEBFA] dark:border-[#45D6C7]/30 p-5 space-y-3.5 shadow-2xs card-interactive reveal-item reveal-delay-1">
            <div className="w-10 h-10 rounded-xl bg-[#BCEBFA] dark:bg-[#45D6C7]/20 text-[#087E8B] dark:text-[#45D6C7] flex items-center justify-center font-extrabold text-sm shadow-2xs">
              1
            </div>
            <h3 className="font-bold text-base text-[#24352F] dark:text-[#E9F4F0]">
              Scan or type ingredients
            </h3>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4] leading-relaxed">
              Snap up to 3 photos of your fridge or pantry, or type items manually. Open-weight Gemma identifies visible food and lets you verify each estimate.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/90 dark:bg-[#13241F]/90 backdrop-blur-xs rounded-2xl border border-[#F5D778]/70 dark:border-[#F5D778]/30 p-5 space-y-3.5 shadow-2xs card-interactive reveal-item reveal-delay-2">
            <div className="w-10 h-10 rounded-xl bg-[#F5D778] dark:bg-[#F5D778]/20 text-[#24352F] dark:text-[#F5D778] flex items-center justify-center font-extrabold text-sm shadow-2xs">
              2
            </div>
            <h3 className="font-bold text-base text-[#24352F] dark:text-[#E9F4F0]">
              Set effort & cleanup rules
            </h3>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4] leading-relaxed">
              Tell SlothPlate how many servings you need, your cooking time ceiling (10–45 mins), and cleanup limits (such as one-pan only).
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/90 dark:bg-[#13241F]/90 backdrop-blur-xs rounded-2xl border border-[#F28B78]/60 dark:border-[#F28B78]/30 p-5 space-y-3.5 shadow-2xs card-interactive reveal-item reveal-delay-3">
            <div className="w-10 h-10 rounded-xl bg-[#F28B78] dark:bg-[#F28B78]/20 text-white dark:text-[#F28B78] flex items-center justify-center font-extrabold text-sm shadow-2xs">
              3
            </div>
            <h3 className="font-bold text-base text-[#24352F] dark:text-[#E9F4F0]">
              Cook & shop consolidated
            </h3>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4] leading-relaxed">
              Pick your favorite recipes. Missing ingredients across all selected meals are automatically merged into an organized, print-friendly grocery checklist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
