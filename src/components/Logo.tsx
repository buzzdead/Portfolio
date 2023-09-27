import Link from 'next/link'
import { Text, useColorModeValue } from '@chakra-ui/react'
import FootprintIcon from './icons/footprint'
import styled from '@emotion/styled'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  height: 30px;
  line-height: 20px;
  padding: 10px;
  transform: scale(0.9) translateY(3px);

  > svg {
    transition: 300ms ease;
    transform: scale(0.8) translateY(-1px) translateX(10px);
  }

  &:hover > svg {
    transform: translateY(-2px) translateX(8px) scale(0.9) rotate(15deg);
  }
`

const Logo = () => {
  return (
    (<Link href="/" scroll={false}>

      <LogoBox style={{}}>
        <FootprintIcon fill={useColorModeValue("#000000", "white")}/>
        <Text
          color={useColorModeValue('gray.800', 'whiteAlpha.900')}
          fontFamily='Fira Sans Condensed'
          letterSpacing={0}
          fontWeight="bold"
          transitionDuration={'800ms'}
          minWidth={'150px'}
          ml={3}
        >
          Sigmund Volden
        </Text>
      </LogoBox>

    </Link>)
  );
}

export default Logo