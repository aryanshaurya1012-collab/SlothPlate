import React from 'react';

interface WaterBackgroundProps {
  subdued?: boolean;
}

export const WaterBackground: React.FC<WaterBackgroundProps> = ({ subdued = false }) => {
  return (
    <div
      aria-hidden="true"
      className={`water-background-container fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-opacity duration-700 ease-out ${
        subdued ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {/* Base warm ivory background */}
      <div className="absolute inset-0 bg-[#FAF8F1]" />

      {/* Layer 1: Aqua to Ocean Blue Fluid Water Flow */}
      <div
        className="absolute -inset-x-20 -inset-y-24 animate-water-primary opacity-70"
        style={{
          background: `
            radial-gradient(ellipse 65% 55% at 20% 20%, rgba(69, 214, 199, 0.40) 0%, rgba(79, 143, 232, 0.28) 42%, transparent 75%),
            radial-gradient(ellipse 70% 60% at 85% 75%, rgba(79, 143, 232, 0.35) 0%, rgba(8, 126, 139, 0.22) 50%, transparent 80%)
          `,
          filter: 'blur(60px)',
        }}
      />

      {/* Layer 2: Deep Teal & Soft Sky Blue Counter-Current */}
      <div
        className="absolute -inset-x-24 -inset-y-20 animate-water-secondary opacity-65"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 15%, rgba(8, 126, 139, 0.25) 0%, rgba(188, 235, 250, 0.45) 45%, transparent 78%),
            radial-gradient(ellipse 65% 55% at 15% 85%, rgba(188, 235, 250, 0.50) 0%, rgba(69, 214, 199, 0.25) 40%, transparent 75%)
          `,
          filter: 'blur(70px)',
        }}
      />

      {/* Layer 3: Warm Coral & Butter Yellow Sunlight Blooms */}
      <div
        className="absolute -inset-x-16 -inset-y-16 animate-sunlight-blooms opacity-60"
        style={{
          background: `
            radial-gradient(circle 420px at 65% 35%, rgba(245, 215, 120, 0.35) 0%, rgba(242, 139, 120, 0.18) 40%, transparent 72%),
            radial-gradient(circle 380px at 30% 60%, rgba(242, 139, 120, 0.22) 0%, rgba(245, 215, 120, 0.18) 45%, transparent 70%)
          `,
          filter: 'blur(65px)',
        }}
      />

      {/* Layer 4: Delicate Liquid Caustics Shimmer (Sunlight reflecting across water surface) */}
      <div
        className="absolute inset-0 animate-water-ripples opacity-45"
        style={{
          background: `
            radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.65) 0%, rgba(188, 235, 250, 0.30) 25%, transparent 60%),
            radial-gradient(circle at 85% 45%, rgba(69, 214, 199, 0.20) 0%, transparent 45%),
            radial-gradient(circle at 15% 40%, rgba(245, 215, 120, 0.25) 0%, transparent 50%)
          `,
          filter: 'blur(45px)',
        }}
      />

      {/* Layer 5: Very subtle paper grain / warm pool mist finish */}
      <div className="absolute inset-0 bg-[#FAF8F1]/20 backdrop-contrast-[1.02]" />
    </div>
  );
};
