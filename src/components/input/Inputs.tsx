import React, { MutableRefObject, ReactElement, useEffect, useState } from 'react';
import { Input, Button, Stack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';


const AnimatedInput = motion(Input as React.ComponentType<any>);
const AnimatedButton = motion(Button as React.ComponentType<any>);

interface Props {
    icon: ReactElement;
    label: string;
    isActive: boolean;
    onClick: () => void;
    handleBlur: (value: string) => void
    valueRef: MutableRefObject<string>
}

const Inputs = ({ icon, label, isActive, onClick, handleBlur, valueRef }: Props) => {
  const [value, setValue] = useState('');
  useEffect(() => {
     valueRef.current = value
  }, [value])

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
          _hover={{opacity: 0.5}}
          size='md'
          p={2}
          backgroundColor={'teal'}
        >
          {icon}
        </AnimatedButton>
      )}
      <AnimatePresence>
      {isActive && (
        <AnimatedInput
          placeholder={label}
          focusBorderColor={'teal'}
          style={{borderColor: 'teal'}}
          onBlur={() => handleBlur(value)}
          initial={{ width: '50px', opacity: 1, }}
          animate={{ width: '200px', opacity: 1, }}
          exit={{width: '5px',  position: 'absolute', backgroundColor: 'teal', borderRadius: '100%', opacity: 0.8, transition: {duration: 0.15, easings: ['easeIn', 'circIn', 'linear']}}}
          value={value}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}
      </AnimatePresence>
    </Stack>
  );
};

export default Inputs;
