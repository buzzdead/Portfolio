import React from 'react';
import { IconButton, useColorModeValue } from '@chakra-ui/react';

interface UmbrellaIconProps {
  isStorm: boolean;
  fontSize: string | number;
  color: string;
}

const UmbrellaIcon: React.FC<UmbrellaIconProps> = ({ isStorm, fontSize, color }) => (
  <svg width={fontSize} height={fontSize} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {isStorm ? (
      <g>
        <path d="M30 20 Q40 10 50 20 Q60 10 70 20 Q80 30 80 40 L80 50 L20 50 L20 40 Q20 30 30 20" fill="orange"/>
    <path d="M50 50 L50 90" stroke="#2c3e50" stroke-width="6" stroke-linecap="round"/>
    <path d="M50 80 C55 75, 60 80, 60 85" stroke="#2c3e50" stroke-width="4" stroke-linecap="round" fill="none"/>
  
    <path d="M25 25 Q20 20 25 15 Q30 10 35 15 Q40 5 50 10 Q60 5 65 15 Q70 10 75 15 Q80 20 75 25 Z" fill="#95a5a6"/>
    
    <path d="M30 55 L25 65 M40 55 L35 65 M50 55 L45 65 M60 55 L55 65 M70 55 L65 65" stroke="#3498db" stroke-width="2" stroke-linecap="round"/>
      </g>
    ) : (
      <g>
       <path d="M50 10 C20 10 10 50 10 50 L90 50 C90 50 80 10 50 10 Z" fill="#bdc3c7"/>
    <path d="M50 50 L50 90" stroke="#7f8c8d" stroke-width="6" stroke-linecap="round"/>
    <path d="M50 80 C55 75, 60 80, 60 85" stroke="#7f8c8d" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
    )}
  </svg>
);

interface StormToggleProps {
    storm: boolean;
    toggleStorm: () => void;
    fontSize?: string | number;
}

const StormToggle: React.FC<StormToggleProps> = ({ storm, toggleStorm, fontSize = '2xl' }) => {
  const iconColor = storm ? 'blue.300' : useColorModeValue('blue.500', 'gray.200');

  return (
    <IconButton
      aria-label="Toggle storm"
      size={'md'}
      colorScheme={useColorModeValue("blue", "gray")}
      icon={<UmbrellaIcon isStorm={storm} fontSize={fontSize} color={iconColor} />}
      onClick={toggleStorm}
    />
  );
};

export default StormToggle;