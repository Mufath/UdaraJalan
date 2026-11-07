import React from 'react';
import { AirQualityLevel } from '../types';

interface AirQualityAvatarProps {
  category: AirQualityLevel;
  size?: number;
  className?: string;
  theme?: 'dark' | 'light' | 'auto'; // Auto adapts to category contrast
}

/**
 * Human-centered Air Quality Expression Avatar
 * Inspired by IQAir's glanceable emotional visual cues.
 * Follows DESIGN.md: Clean vector lines, no gradients, no AI slop, high legibility.
 */
export const AirQualityAvatar: React.FC<AirQualityAvatarProps> = ({
  category,
  size = 56,
  className = '',
  theme = 'auto'
}) => {
  // Determine stroke color based on card background & WCAG contrast
  const getStrokeColor = () => {
    if (theme === 'dark') return '#FFFFFF';
    if (theme === 'light') return '#1F2937';
    
    // Auto mode: Moderate yellow has dark text for contrast; other states have white/light text
    if (category === 'moderate') {
      return '#374151'; // Dark slate on amber/yellow card
    }
    return '#FFFFFF'; // Crisp white on emerald, crimson, and purple
  };

  const stroke = getStrokeColor();

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Ekspresi visual mutu udara: ${category}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Universal Head Shape & Ears */}
        <path
          d="M 18,24 C 18,12 46,12 46,24 C 46,38 42,50 32,50 C 22,50 18,38 18,24 Z"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={category === 'moderate' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.08)'}
        />
        
        {/* Left & Right Ears */}
        <path
          d="M 18,26 C 14.5,26 14.5,33 18,34"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 46,26 C 49.5,26 49.5,33 46,34"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Minimalist Hairline */}
        <path
          d="M 18,22 C 22,14 30,15 36,13 C 42,11 46,18 46,22"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 1. KATEGORI: BAIK (Good / Clean) - Smiling, Serene, Fresh */}
        {category === 'good' && (
          <g>
            {/* Relaxed eyebrows */}
            <path
              d="M 22,21 C 24,19.5 27,20 28.5,21.5"
              stroke={stroke}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M 35.5,21.5 C 37,20 40,19.5 42,21"
              stroke={stroke}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Serene smiling eyes */}
            <path
              d="M 22.5,26 C 24.5,23.8 27.5,23.8 29.5,26"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 34.5,26 C 36.5,23.8 39.5,23.8 41.5,26"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Small subtle nose */}
            <path
              d="M 32,28 L 31,32 L 33,32"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Gentle smile */}
            <path
              d="M 26,37 C 28.5,42 35.5,42 38,37"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 2. KATEGORI: SEDANG (Moderate) - Calm, Observant, Neutral Face (IQAir Signature Style) */}
        {category === 'moderate' && (
          <g>
            {/* Level neutral eyebrows */}
            <line x1="22" y1="22" x2="28" y2="22" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="36" y1="22" x2="42" y2="22" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            
            {/* Observant eyes */}
            <circle cx="25" cy="27" r="1.75" fill={stroke} />
            <circle cx="39" cy="27" r="1.75" fill={stroke} />

            {/* Nose */}
            <path
              d="M 32,28.5 L 31,33 L 33,33"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Straight neutral mouth */}
            <line x1="26.5" y1="39" x2="37.5" y2="39" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* 3. KATEGORI: TIDAK SEHAT (Unhealthy) - Concerned & Protective Mask */}
        {category === 'unhealthy' && (
          <g>
            {/* Slightly furrowed/concerned eyebrows */}
            <path d="M 22,23 L 28,21" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 36,21 L 42,23" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />

            {/* Watchful cautious eyes */}
            <circle cx="25" cy="26" r="1.75" fill={stroke} />
            <circle cx="39" cy="26" r="1.75" fill={stroke} />

            {/* Surgical / Commuter Mask */}
            <path
              d="M 19,31 C 23,29.5 41,29.5 45,31 L 43.5,45 C 38,48.5 26,48.5 20.5,45 Z"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(255,255,255,0.18)"
            />
            {/* Mask fold / pleat */}
            <path
              d="M 20.5,36 C 26,37.5 38,37.5 43.5,36"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Ear strap lines */}
            <path
              d="M 19,32 C 16,30 15.5,28 17.5,27"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M 45,32 C 48,30 48.5,28 46.5,27"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M 20.5,43 C 16,38 16,34 17.5,33"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M 43.5,43 C 48,38 48,34 46.5,33"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 4. KATEGORI: SANGAT BERBAHAYA (Hazardous) - Alert & N95 / Respirator Mask */}
        {category === 'hazardous' && (
          <g>
            {/* Troubled tilted eyebrows */}
            <path d="M 21.5,23.5 L 28,20.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
            <path d="M 36,20.5 L 42.5,23.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />

            {/* Alert wide eyes */}
            <circle cx="25" cy="25.5" r="2" fill={stroke} />
            <circle cx="39" cy="25.5" r="2" fill={stroke} />

            {/* Respirator / N95 Shell with Valve */}
            <path
              d="M 20,29.5 L 32,26.5 L 44,29.5 L 42,46 C 36.5,49.5 27.5,49.5 22,46 Z"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(255,255,255,0.22)"
            />
            
            {/* Circular Exhalation Valve in Center */}
            <circle
              cx="32"
              cy="38"
              r="4"
              stroke={stroke}
              strokeWidth="1.6"
              fill="rgba(0,0,0,0.15)"
            />
            <line x1="30" y1="38" x2="34" y2="38" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
            <line x1="32" y1="36" x2="32" y2="40" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />

            {/* Reinforced dual headband straps */}
            <path d="M 20,30 L 16.5,25" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 44,30 L 47.5,25" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 22,44 L 16,36" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 42,44 L 48,36" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
