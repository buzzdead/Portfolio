import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';
import Navbar from '../navbar';
import ThreeScene2 from '../three/three';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import { ThreeSceneProvider } from '../three/threeprovider';
import { NextRouter } from 'next/router';
import { SolarSystemProvider } from '../three/solarsystemprovider';
import Introduction from '../introduction';
import Intro from '../Introduction/Intro';

interface MainProps {
  children: React.ReactNode;
  router: NextRouter;
}

const DynamicComponentWithNoSSR = dynamic(
  () => import('../introduction'),
  { ssr: false }
)

const Main = ({ children, router }: MainProps) => {
  const [pagePath, setPagePath] = useState<string>(router.pathname);
  const intro = false;
  useEffect(() => {
    setPagePath(router.pathname);
  }, [router.pathname]);

  const getTitle = (path: string) => {
    switch(path) {
      case '/': return 'Hovedside';
      case '/about': return 'CV';
      case '/projects': return 'Prosjekter';
      case '/aifun': return 'AI';
      default: return 'Spill';
    }
  };
  return (
    <Box as='main' pb={8}>
      <Head>
        <meta
          aria-description="Portefølje side for Sigmund Volden"
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <title>{getTitle(pagePath)}</title>
      </Head>
      {intro ? (
        <>
      <Navbar path={router.asPath} />
      <Container maxW={{ base: 'container.md', lg: 'container.lg' }} pt={14}>
        <ThreeSceneProvider>
        <SolarSystemProvider>
        
          {children}
          </SolarSystemProvider>
        </ThreeSceneProvider>
      </Container> </>)
 :  <DynamicComponentWithNoSSR />}
    </Box>
  );
};

export default Main;
