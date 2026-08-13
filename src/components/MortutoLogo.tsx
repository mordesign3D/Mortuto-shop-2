import React from 'react';

interface MortutoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
}

export const MortutoLogo: React.FC<MortutoLogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = true
}) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconWidth = isSmall ? 'w-8 h-8' : isLarge ? 'w-16 h-16' : 'w-11 h-11';
  const titleSize = isSmall ? 'text-base' : isLarge ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';
  const subtitleSize = isSmall ? 'text-[9px]' : isLarge ? 'text-xs' : 'text-[10px]';

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* SVG Icon matching the uploaded logo artwork */}
      <svg
        className={`${iconWidth} shrink-0`}
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Speed motion lines */}
        <path d="M20 60 H70" stroke="#F97316" strokeWidth="8" strokeLinecap="round" />
        <path d="M30 80 H60" stroke="#F97316" strokeWidth="8" strokeLinecap="round" />
        <path d="M40 100 H80" stroke="#F97316" strokeWidth="8" strokeLinecap="round" />

        {/* Shopping Cart Frame */}
        <path
          d="M55 45 H75 L95 110 H170 L185 70 H90"
          stroke="#1F2937"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cart Wheels */}
        <circle cx="105" cy="130" r="12" fill="#1F2937" />
        <circle cx="160" cy="130" r="12" fill="#1F2937" />

        {/* Orange Shopping Bag inside Cart */}
        <path
          d="M100 30 C100 18, 145 18, 145 30 L160 85 H85 L100 30 Z"
          fill="#F97316"
        />
        {/* Bag Handle cutout */}
        <path
          d="M112 30 C112 24, 133 24, 133 30"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* 'M' Monogram inside orange bag */}
        <path
          d="M102 82 L102 48 L122.5 70 L143 48 L143 82"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M122.5 70 L122.5 82"
          stroke="#1F2937"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-extrabold tracking-tight ${titleSize} flex items-center`}>
          <span className="text-slate-900">mortuto-</span>
          <span className="text-orange-600">shop</span>
        </div>

        {showSubtitle && (
          <div className={`text-slate-600 font-bold tracking-widest uppercase mt-0.5 flex items-center space-x-1 ${subtitleSize}`}>
            <span className="w-2.5 h-[1.5px] bg-orange-500 inline-block"></span>
            <span>VENTE EN LIGNE</span>
            <span className="w-2.5 h-[1.5px] bg-orange-500 inline-block"></span>
          </div>
        )}
      </div>
    </div>
  );
};
