import React, { useEffect, useState, useRef } from 'react';

interface WaterBackgroundProps {
  subdued?: boolean;
  isDark?: boolean;
}

export const WaterBackground: React.FC<WaterBackgroundProps> = ({
  subdued = false,
  isDark = false,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Optimized scroll parallax with requestAnimationFrame
    const handleScroll = () => {
      if (mediaQuery.matches) return;
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Parallax offsets (subtle rates so it never causes motion sickness)
  const parallaxSlow = prefersReducedMotion ? 0 : scrollY * 0.12;
  const parallaxMedium = prefersReducedMotion ? 0 : scrollY * 0.22;
  const parallaxCounter = prefersReducedMotion ? 0 : -scrollY * 0.08;

  return (
    <div
      aria-hidden="true"
      className={`water-background-container fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-opacity duration-700 ease-out select-none ${
        subdued ? 'opacity-40' : 'opacity-100'
      }`}
    >
      {/* Base background tone */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark ? 'bg-[#0B1613]' : 'bg-[#FAF8F1]'
        }`}
      />

      {/* Parallax Container for Liquid Masses */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translate3d(0, ${parallaxSlow}px, 0)`,
          willChange: 'transform',
        }}
      >
        {/* Layer 1: Vivid Bright Aqua / Deep Teal Liquid Mass */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[85vw] h-[85vh] rounded-full animate-liquid-aqua"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, rgba(69, 214, 199, 0.45) 0%, rgba(8, 126, 139, 0.35) 45%, transparent 75%)'
              : 'radial-gradient(ellipse at center, rgba(69, 214, 199, 0.55) 0%, rgba(8, 126, 139, 0.38) 45%, transparent 75%)',
            filter: 'blur(35px)',
          }}
        />

        {/* Layer 2: Ocean Blue & Soft Sky Blue Undercurrent Mass */}
        <div
          className="absolute top-[25%] -right-[15%] w-[90vw] h-[90vh] rounded-full animate-liquid-blue"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, rgba(79, 143, 232, 0.42) 0%, rgba(8, 126, 139, 0.3) 50%, transparent 75%)'
              : 'radial-gradient(ellipse at center, rgba(79, 143, 232, 0.48) 0%, rgba(188, 235, 250, 0.5) 45%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Layer 3: Warm Coral & Butter Yellow Sunlight Blooms */}
        <div
          className="absolute top-[10%] left-[25%] w-[65vw] h-[65vh] rounded-full animate-sunlight-warmth"
          style={{
            background: isDark
              ? 'radial-gradient(circle at center, rgba(245, 215, 120, 0.35) 0%, rgba(242, 139, 120, 0.28) 45%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(245, 215, 120, 0.48) 0%, rgba(242, 139, 120, 0.38) 45%, transparent 72%)',
            filter: 'blur(38px)',
          }}
        />

        {/* Layer 4: Lower Pool Coral Accent */}
        <div
          className="absolute -bottom-[20%] left-[10%] w-[75vw] h-[75vh] rounded-full animate-sunlight-warmth"
          style={{
            animationDelay: '-6s',
            background: isDark
              ? 'radial-gradient(ellipse at center, rgba(242, 139, 120, 0.25) 0%, rgba(8, 126, 139, 0.25) 50%, transparent 75%)'
              : 'radial-gradient(ellipse at center, rgba(242, 139, 120, 0.35) 0%, rgba(69, 214, 199, 0.3) 50%, transparent 75%)',
            filter: 'blur(42px)',
          }}
        />
      </div>

      {/* Layer 5: Visible Organic SVG Water Waves / Liquid Flowing Ribbons */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden opacity-75"
        style={{
          transform: `translate3d(0, ${parallaxMedium}px, 0)`,
          willChange: 'transform',
        }}
      >
        <svg
          className="absolute top-1/4 -left-1/4 w-[160vw] h-96 animate-wave-ribbon-1"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveAquaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#45D6C7" stopOpacity={isDark ? "0.35" : "0.45"} />
              <stop offset="45%" stopColor="#087E8B" stopOpacity={isDark ? "0.25" : "0.35"} />
              <stop offset="80%" stopColor="#4F8FE8" stopOpacity={isDark ? "0.3" : "0.4"} />
              <stop offset="100%" stopColor="#F5D778" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveAquaGrad)"
            d="M0,160 C320,260, 480,60, 720,160 C960,260, 1120,60, 1440,160 L1440,320 L0,320 Z"
          />
        </svg>

        <svg
          className="absolute top-1/2 -right-1/4 w-[160vw] h-96 animate-wave-ribbon-2"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveCoralGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F28B78" stopOpacity={isDark ? "0.3" : "0.38"} />
              <stop offset="50%" stopColor="#F5D778" stopOpacity={isDark ? "0.22" : "0.32"} />
              <stop offset="100%" stopColor="#BCEBFA" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveCoralGrad)"
            d="M0,96 C280,200, 560,30, 840,140 C1120,240, 1300,80, 1440,120 L1440,320 L0,320 Z"
          />
        </svg>
      </div>

      {/* Layer 6: Caustic Light Shimmer Reflections (Simulating light passing across moving water) */}
      <div
        className="absolute inset-0 animate-caustics pointer-events-none"
        style={{
          transform: `translate3d(0, ${parallaxCounter}px, 0)`,
          background: `
            radial-gradient(circle at 45% 20%, rgba(255, 255, 255, ${isDark ? '0.35' : '0.6'}) 0%, transparent 40%),
            radial-gradient(circle at 80% 40%, rgba(188, 235, 250, 0.45) 0%, transparent 35%),
            radial-gradient(circle at 20% 70%, rgba(245, 215, 120, 0.4) 0%, transparent 40%)
          `,
          filter: 'blur(20px)',
        }}
      />

      {/* Layer 7: Floating Translucent Water Droplets / Bubbles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[22%] left-[12%] w-7 h-7 rounded-full bg-white/40 dark:bg-white/20 border border-white/60 dark:border-white/30 backdrop-blur-xs animate-bubble"
            style={{ animationDuration: '7s' }}
          />
          <div
            className="absolute top-[38%] right-[15%] w-9 h-9 rounded-full bg-[#BCEBFA]/40 dark:bg-[#45D6C7]/20 border border-white/70 dark:border-white/30 backdrop-blur-xs animate-bubble"
            style={{ animationDuration: '9s', animationDelay: '-2s' }}
          />
          <div
            className="absolute top-[65%] left-[22%] w-6 h-6 rounded-full bg-[#F5D778]/35 dark:bg-[#F5D778]/20 border border-white/60 dark:border-white/25 backdrop-blur-xs animate-bubble"
            style={{ animationDuration: '8s', animationDelay: '-4s' }}
          />
          <div
            className="absolute top-[78%] right-[28%] w-8 h-8 rounded-full bg-[#F28B78]/30 dark:bg-[#F28B78]/20 border border-white/60 dark:border-white/25 backdrop-blur-xs animate-bubble"
            style={{ animationDuration: '10s', animationDelay: '-5s' }}
          />
        </div>
      )}

      {/* Subtle translucent veil ensuring text contrast */}
      <div
        className={`absolute inset-0 ${
          isDark ? 'bg-[#0B1613]/25' : 'bg-[#FAF8F1]/20'
        }`}
      />
    </div>
  );
};
