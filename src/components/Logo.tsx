import Link from 'next/link'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import WeightIcon from './icons/weighticon'
import styled from '@emotion/styled'
import WeightIcon3D from './icons/weighticon'
import SVIcon from './icons/weighticon'
import { useState } from 'react'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 10px;
  transform: scale(0.9) translateY(3px);


  > svg {
    /* Set initial transform */
    transform: scale(0.8) translateY(-3.5px) translateX(10px);
  }

  
`


const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    (<Link href="/" scroll={false}>
     
        <Box display='flex' flexDir={'row'} justifyContent={'center'} alignSelf={'center'} alignItems={'center'}  onMouseEnter={() => setIsHovered(true)} // Triggers effect when hovering anywhere on SVG
      onMouseLeave={() => setIsHovered(false)}>
        <LogoBox style={{}}>
        <SVIcon hovered={isHovered} fill={useColorModeValue("#202020", "#f0f0f0")}/>
        <Text
          color={useColorModeValue('gray.800', 'whiteAlpha.900')}
          fontFamily='Fira Sans Condensed'
          letterSpacing={0}
          
          fontWeight="bold"
          transitionDuration={'800ms'}
          minWidth={'125px'}
          ml={3}
        >
          Sigmund Volden
        </Text>
      </LogoBox>
      
        </Box>

    </Link>)
  );
}

export default Logo