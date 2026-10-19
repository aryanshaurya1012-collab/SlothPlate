import React from 'react';
import { Bookmark, ShieldCheck, CheckCircle2, RotateCcw, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  onOpenSavedPlans: () => void;
  onOpenPrivacy: () => void;
  onOpenQuality: () => void;
  savedPlansCount: number;
  currentStep: 'landing' | 'scanner' | 'preferences' | 'meals' | 'grocery';
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onOpenSavedPlans,
  onOpenPrivacy,
  onOpenQuality,
  savedPlansCount,
  currentStep,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F1]/85 dark:bg-[#0B1613]/85 backdrop-blur-md border-b border-[#E4E8E2] dark:border-[#223D35] transition-colors duration-300 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          title="SlothPlate Home"
        >
          <div className="w-10 h-10 rounded-xl bg-[#087E8B] text-[#FAF8F1] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-[#06626D] transition-all">
            {/* Stylized sloth culinary mark in liquid ocean theme */}
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="#087E8B" />
              <path
                d="M7 11C7 8.5 9 6.5 12 6.5C15 6.5 17 8.5 17 11C17 14 15 16.5 12 16.5C9 16.5 7 14 7 11Z"
                fill="#45D6C7"
              />
              <circle cx="10" cy="11" r="1" fill="#24352F" />
              <circle cx="14" cy="11" r="1" fill="#24352F" />
              <path
                d="M10.5 13.5Q12 14.5 13.5 13.5"
                stroke="#24352F"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-[#24352F] dark:text-[#E9F4F0]">
                SlothPlate
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#BCEBFA]/40 dark:bg-[#45D6C7]/20 text-[#087E8B] dark:text-[#45D6C7] border border-[#45D6C7]/50">
                Gemma 4 AI
              </span>
            </div>
            <p className="text-[11px] text-[#586B63] dark:text-[#97ADA4] hidden md:block">
              Slow & steady fridge-to-meal planner
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentStep !== 'landing' && (
            <button
              onClick={onGoHome}
              className="px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#586B63] dark:text-[#97ADA4] hover:text-[#24352F] dark:hover:text-white hover:bg-[#E4E8E2]/50 dark:hover:bg-[#1E352F] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer btn-interactive"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          )}

          <button
            onClick={onOpenSavedPlans}
            className="relative px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#24352F] dark:text-[#E9F4F0] bg-white dark:bg-[#13241F] border border-[#E4E8E2] dark:border-[#223D35] hover:border-[#087E8B]/60 rounded-xl shadow-2xs hover:bg-[#FAF8F1] dark:hover:bg-[#1A3029] transition-all flex items-center gap-1.5 cursor-pointer btn-interactive"
          >
            <Bookmark className="w-4 h-4 text-[#087E8B] dark:text-[#45D6C7]" />
            <span>Saved Plans</span>
            {savedPlansCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F28B78] text-white">
                {savedPlansCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenPrivacy}
            className="px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#586B63] dark:text-[#97ADA4] hover:text-[#24352F] dark:hover:text-white hover:bg-[#E4E8E2]/50 dark:hover:bg-[#1E352F] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer btn-interactive"
            title="Open AI & Privacy disclosure"
          >
            <ShieldCheck className="w-4 h-4 text-[#087E8B] dark:text-[#45D6C7]" />
            <span className="hidden md:inline">Privacy</span>
          </button>

          <button
            onClick={onOpenQuality}
            className="p-2 text-[#586B63] dark:text-[#97ADA4] hover:text-[#24352F] dark:hover:text-white hover:bg-[#E4E8E2]/50 dark:hover:bg-[#1E352F] rounded-lg transition-colors cursor-pointer btn-interactive"
            title="Run Quality Verification Checks"
          >
            <CheckCircle2 className="w-4 h-4 text-[#45D6C7]" />
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-[#586B63] dark:text-[#F5D778] hover:text-[#24352F] dark:hover:text-white hover:bg-[#E4E8E2]/50 dark:hover:bg-[#1E352F] rounded-lg transition-colors cursor-pointer btn-interactive"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle color theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#F5D778]" /> : <Moon className="w-4 h-4 text-[#087E8B]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
