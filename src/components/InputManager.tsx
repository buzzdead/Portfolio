import React, { useState } from 'react';
import Inputs from './Inputs';
import { CgProfile } from "react-icons/cg";
import { MdAddLocation } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import { Flex } from '@chakra-ui/react';

type InputValues = {
    name: string;
    location: string;
    occupation: string;
  };

interface Props {
    values: InputValues
    setValues: React.Dispatch<React.SetStateAction<InputValues>>
}

const InputManager = ({values, setValues}: Props) => {
  const [activeInput, setActiveInput] = useState('');
  let blurTimeoutId: NodeJS.Timeout;

  const handleInputClick = (inputName: string) => {
    // Clear any existing timeouts to prevent them from closing the newly opened input
    clearTimeout(blurTimeoutId);
    setActiveInput(inputName);
  };

  const handleInputBlur = (value: string) => {
    // Set a timeout to delay the closing of the input
    setTimeout(() => {
        setValues({...values, [activeInput as keyof InputValues]: value})
    }, 200)
    blurTimeoutId = setTimeout(() => {
      
      setActiveInput('');
    }, 100); // Adjust the delay as needed
  };

  return (
    <Flex flexDir={'row'} gap={5}>
      <Inputs
        icon={<CgProfile size={20} />}
        label={'Enter name'}
        isActive={activeInput === 'name'}
        onClick={() => handleInputClick('name')}
        handleBlur={(value: string) => handleInputBlur(value)}
      />
      <Inputs
        icon={<MdAddLocation size={20} />}
        label={'Enter location'}
        isActive={activeInput === 'location'}
        onClick={() => handleInputClick('location')}
        handleBlur={(value: string) => handleInputBlur(value)}
      />
      <Inputs
        icon={<LiaIndustrySolid size={20} />}
        label={'Enter occupation'}
        isActive={activeInput === 'occupation'}
        onClick={() => handleInputClick('occupation')}
        handleBlur={(value: string) => handleInputBlur(value)}
      />
    </Flex>
  );
};

export default InputManager;
