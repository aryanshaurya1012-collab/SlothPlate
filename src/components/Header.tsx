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
    <header className="sticky top-0 z-30 bg-[#FAF8F1]/90 backdrop-blur-md border-b border-[#E8E6DC] no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          title="SlothPlate Home"
        >
          <div className="w-10 h-10 rounded-xl bg-[#285943] text-[#FAF8F1] flex items-center justify-center shadow-sm group-hover:bg-[#1E4332] transition-colors">
            {/* Stylized sloth culinary mark */}
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="#285943" />
              <path
                d="M7 11C7 8.5 9 6.5 12 6.5C15 6.5 17 8.5 17 11C17 14 15 16.5 12 16.5C9 16.5 7 14 7 11Z"
                fill="#BFDDE8"
              />
              <circle cx="10" cy="11" r="1" fill="#26342D" />
              <circle cx="14" cy="11" r="1" fill="#26342D" />
              <path
                d="M10.5 13.5Q12 14.5 13.5 13.5"
                stroke="#26342D"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-[#26342D]">
                SlothPlate
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F0F5F0] text-[#285943] border border-[#78A878]/30">
                Gemma 4 AI
              </span>
            </div>
            <p className="text-[11px] text-[#66746B] hidden md:block">
              Slow and steady fridge-to-meal planner
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentStep !== 'landing' && (
            <button
              onClick={onGoHome}
              className="px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#66746B] hover:text-[#26342D] hover:bg-[#E8E6DC]/50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          )}

          <button
            onClick={onOpenSavedPlans}
            className="relative px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#26342D] bg-white border border-[#E8E6DC] hover:border-[#285943]/40 rounded-xl shadow-2xs hover:bg-[#FAF8F1] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-[#285943]" />
            <span>Saved Plans</span>
            {savedPlansCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#E98B70] text-white">
                {savedPlansCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenPrivacy}
            className="px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#66746B] hover:text-[#26342D] hover:bg-[#E8E6DC]/50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Open AI & Privacy disclosure"
          >
            <ShieldCheck className="w-4 h-4 text-[#285943]" />
            <span className="hidden md:inline">Open AI & Privacy</span>
          </button>

          <button
            onClick={onOpenQuality}
            className="p-1.5 text-[#66746B] hover:text-[#26342D] hover:bg-[#E8E6DC]/50 rounded-lg transition-colors cursor-pointer"
            title="Run Quality Verification Checks"
          >
            <CheckCircle2 className="w-4 h-4 text-[#78A878]" />
          </button>
        </div>
      </div>
    </header>
  );
};
