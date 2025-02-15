import { useState } from 'react';

interface Props {
  fill: string;
  hovered: boolean
}

const SVIcon = ({ fill, hovered }: Props) => {

  return (
    <svg 
      width="45" 
      height="45" 
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: 'fill 0.3s ease-in-out' }}
     
    >
      <defs>
        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.4" />
        </linearGradient>
        
        <filter id="iconShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={fill} floodOpacity="0.15" />
        </filter>
      </defs>

      <g transform="translate(2 2)" filter="url(#iconShadow)">
        {/* Base shape */}
        <path
          d="M32 4.5a27.5 27.5 0 1 1 0 55 27.5 27.5 0 0 1 0-55z"
          fill="url(#mainGradient)"
          stroke={fill}
          strokeWidth="2"
        />

        {/* Inner circle */}
        <circle
          cx="32"
          cy="32"
          r="20"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* SV Text with Rotation Effect */}
        <text
          x="50%"
          y="45%"
          fill={fill === "#202020" ? 'lightblue' : 'darkgreen'}
          fontSize="38"
          fontWeight="500"
          fontFamily="'Segoe UI', sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            textShadow: `1px 1px 2px ${fill}40`,
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transition: 'transform 0.2s ease-in-out',
            transform: hovered ? 'rotate(180deg) translateY(-6px)' : 'rotate(0deg)', // Rotates only the text
          }}
        >
          <tspan x="32" dy="0">S</tspan>
        </text>

        {/* Decorative angles */}
        <path
          d="M18 18L26 22M46 18L38 22M18 46L26 42M46 46L38 42"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
      </g>
    </svg>
  );
};

export default SVIcon;
