import React, { useRef, useState } from 'react';
import Inputs from './Inputs';
import { CgProfile } from "react-icons/cg";
import { MdAddLocation } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import { Flex } from '@chakra-ui/react';
import { HiMagnifyingGlassPlus } from "react-icons/hi2";

type InputValues = {
    name: string;
    location: string;
    occupation: string;
    lookAt: string
  };

interface Props {
    values: InputValues
    setValues: React.Dispatch<React.SetStateAction<InputValues>>
}

const InputManager = ({values, setValues}: Props) => {
  const [activeInput, setActiveInput] = useState('');
  const valueRef = useRef('')
  const valueRef2 = useRef('')
  const valueRef3 = useRef('')
  const valueRef4 = useRef('')
  let blurTimeoutId: NodeJS.Timeout;

  const handleInputClick = (inputName: string) => {
    // Clear any existing timeouts to prevent them from closing the newly opened input
    clearTimeout(blurTimeoutId);
    setActiveInput(inputName);
  };

  const handleInputBlur = (value: string) => {
    blurTimeoutId = setTimeout(() => {
      setActiveInput('');
      setTimeout(() => setValues({name: valueRef.current, location: valueRef2.current, occupation: valueRef3.current, lookAt: valueRef4.current}), 150)
    }, 100); 
  };
  console.log(values)
  return (
    <Flex flexDir={'row'} gap={5}>
      <Inputs
        icon={<CgProfile color='white' size={20} />}
        label={'Enter name'}
        isActive={activeInput === 'name'}
        onClick={() => handleInputClick('name')}
        handleBlur={(value: string) => handleInputBlur(value)}
        valueRef={valueRef}
      />
      <Inputs
        icon={<MdAddLocation color='white' size={20} />}
        label={'Enter location'}
        isActive={activeInput === 'location'}
        onClick={() => handleInputClick('location')}
        handleBlur={(value: string) => handleInputBlur(value)}
        valueRef={valueRef2}
      />
      <Inputs
        icon={<LiaIndustrySolid color='white' size={20} />}
        label={'Enter occupation'}
        isActive={activeInput === 'occupation'}
        onClick={() => handleInputClick('occupation')}
        handleBlur={(value: string) => handleInputBlur(value)}
        valueRef={valueRef3}
      />
      <Inputs
        icon={<HiMagnifyingGlassPlus color='white' size={20} />}
        label={'Look closely at'}
        isActive={activeInput === 'lookAt'}
        onClick={() => handleInputClick('lookAt')}
        handleBlur={(value: string) => handleInputBlur(value)}
        valueRef={valueRef4}
      />
      
    </Flex>
  );
};

export default InputManager;
