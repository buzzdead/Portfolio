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
  transform: scale(0.9);

  > svg {
    transition: 200ms ease;
    transform: scale(0.9);
  }

  &:hover > svg {
    transform: rotate(90deg) scale(0.9);
  }
`

const Logo = () => {
  return (
    (<Link href="/" scroll={false}>

      <LogoBox style={{gap:3}}>
        <FootprintIcon />
        <Text
          color={useColorModeValue('gray.800', 'whiteAlpha.900')}
          fontFamily='M PLUS Rounded 1c", sans-serif'
          fontWeight="bold"
          ml={3}
        >
          Sigmund Volden
        </Text>
      </LogoBox>

    </Link>)
  );
}

export default Logo