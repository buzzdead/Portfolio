import React, { ReactElement, useState } from 'react';
import { Input, Button, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const AnimatedInput = motion(Input);
const AnimatedButton = motion(Button);

interface Props {
    icon: ReactElement;
    label: string;
    isActive: boolean;
    onClick: () => void;
    handleBlur: (value: string) => void
}

const Inputs = ({ icon, label, isActive, onClick, handleBlur }: Props) => {
  const [value, setValue] = useState('');

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleBlur(value); // Notify parent to close the input
    }
  };

  return (
    <Stack spacing={3} align='center'>
      {!isActive && (
        <AnimatedButton
          onClick={onClick} // Call onClick from props
          borderRadius='full'
          size='md'
          p={2}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.5 }}
        >
          {icon}
        </AnimatedButton>
      )}
      {isActive && (
        <AnimatedInput
          placeholder={label}
          onBlur={() => handleBlur(value)}
          initial={{ width: '50px', opacity: 0 }}
          animate={{ width: '200px', opacity: 1 }}
          exit={{ width: '50px', opacity: 0 }}
          value={value}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}
    </Stack>
  );
};

export default Inputs;
