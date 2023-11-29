import Head from 'next/head'
import { Box, Container } from '@chakra-ui/react'
import Navbar from '../navbar'
import { NextRouter } from 'next/router'
import ThreeScene2 from '../three'
import { useRef } from 'react'
import { ThreeSceneProvider } from '../threeprovider'

interface MainProps {
  children: any
  router: NextRouter
}

const Main = ({ children, router }: MainProps) => {
  const pageRef = useRef<string>()
  pageRef.current = router.pathname
  return (
    <Box as={'main'} pb={8}>
      <Head>
        <meta
          aria-description="Portefølje side for Sigmund Volden"
          name={'viewport'}
          content={'width=device-width, initial-scale=1'}
        />
        <title>
          {router.pathname === '/'
            ? 'Hovedside'
            : router.pathname === '/about'
            ? 'CV'
            : router.pathname === '/projects'
            ? 'Prosjekter'
            : router.pathname === '/aifun'
            ? 'AI'
            : 'Spill'}
        </title>
      </Head>
      <Navbar path={router.asPath} />
      <Container maxW={{ base: 'container.md', lg: 'container.lg' }} pt={14}>
        <ThreeSceneProvider>
        <ThreeScene2 pageRef={pageRef.current}/>
        {children}
        </ThreeSceneProvider>
      </Container>
    </Box>
  )
}

export default Main
