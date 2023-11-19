import React, { MutableRefObject, ReactElement, useEffect, useState } from 'react';
import { Input, Button, Stack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';


const AnimatedInput = motion(Input);
const AnimatedButton = motion(Button);

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
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.5 }}
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
          initial={{ width: '50px', opacity: 1, backgroundColor: 'transparent' }}
          animate={{ width: '200px', opacity: 1, }}
          exit={{ width: '5px',  position: 'absolute', scale: 0, backgroundColor: 'teal', borderRadius: '100%', opacity: 0.5, transition: {duration: 0.20}}}
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
