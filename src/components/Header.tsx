import React from 'react';
import { ChefHat, Sparkles, Bookmark, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  onOpenSavedPlans: () => void;
  onOpenPrivacy: () => void;
  onOpenQuality: () => void;
  savedPlansCount: number;
  currentStep: 'landing' | 'scanner' | 'preferences' | 'meals' | 'grocery';
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onOpenSavedPlans,
  onOpenPrivacy,
  onOpenQuality,
  savedPlansCount,
  currentStep,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F6F0]/90 backdrop-blur-md border-b border-[#E5E7DF] no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
          title="SlothPlate Home"
        >
          <div className="w-10 h-10 rounded-xl bg-[#355E46] text-[#DCE8D8] flex items-center justify-center shadow-sm group-hover:bg-[#2A4B37] transition-colors">
            {/* Minimalist stylized sloth mark */}
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="#355E46" />
              <path
                d="M7 11C7 8.5 9 6.5 12 6.5C15 6.5 17 8.5 17 11C17 14 15 16.5 12 16.5C9 16.5 7 14 7 11Z"
                fill="#DCE8D8"
              />
              <circle cx="10" cy="11" r="1" fill="#26352B" />
              <circle cx="14" cy="11" r="1" fill="#26352B" />
              <path
                d="M10.5 13.5Q12 14.5 13.5 13.5"
                stroke="#26352B"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-[#26352B]">
                SlothPlate
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#DCE8D8] text-[#355E46]">
                Gemma 4 AI
              </span>
            </div>
            <p className="text-[11px] text-[#607266] hidden md:block">
              Slow and steady fridge-to-meal planner
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentStep !== 'landing' && (
            <button
              onClick={onGoHome}
              className="px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#607266] hover:text-[#26352B] hover:bg-[#E5E7DF]/50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          )}

          <button
            onClick={onOpenSavedPlans}
            className="relative px-3 py-1.5 text-xs sm:text-sm font-medium text-[#26352B] bg-white border border-[#E5E7DF] hover:border-[#355E46]/40 rounded-lg shadow-xs hover:bg-[#F7F6F0] transition-colors flex items-center gap-1.5"
          >
            <Bookmark className="w-4 h-4 text-[#355E46]" />
            <span>Saved Plans</span>
            {savedPlansCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#EDAD85] text-[#26352B]">
                {savedPlansCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenPrivacy}
            className="px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#607266] hover:text-[#26352B] hover:bg-[#E5E7DF]/50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Open AI & Privacy disclosure"
          >
            <ShieldCheck className="w-4 h-4 text-[#355E46]" />
            <span className="hidden md:inline">Open AI & Privacy</span>
          </button>

          <button
            onClick={onOpenQuality}
            className="p-1.5 text-[#607266] hover:text-[#26352B] hover:bg-[#E5E7DF]/50 rounded-lg transition-colors"
            title="Run Quality Verification Checks"
          >
            <CheckCircle2 className="w-4 h-4 text-[#355E46]" />
          </button>
        </div>
      </div>
    </header>
  );
};
