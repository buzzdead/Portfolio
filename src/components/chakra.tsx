import {
    ChakraProvider,
    cookieStorageManagerSSR,
    localStorageManager
  } from '@chakra-ui/react'
  import theme from '../lib/theme'

  interface Props {
    cookies: any
    children: any
  }
  
  export default function Chakra({ cookies, children }: Props) {
    const colorModeManager =
      typeof cookies === 'string'
        ? cookieStorageManagerSSR(cookies)
        : localStorageManager
  
    return (
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        {children}
      </ChakraProvider>
    )
  }
  
  export async function getServerSideProps({ req }: any) {
    return {
      props: {
        cookies: req.headers.cookie ?? ''
      }
    }
  }