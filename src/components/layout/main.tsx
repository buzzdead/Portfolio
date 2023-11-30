import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';
import Navbar from '../navbar';
import ThreeScene2 from '../three/three';
import { useEffect, useState } from 'react';
import { ThreeSceneProvider } from '../three/threeprovider';
import { NextRouter } from 'next/router';

interface MainProps {
  children: React.ReactNode;
  router: NextRouter;
}

const Main = ({ children, router }: MainProps) => {
  const [pagePath, setPagePath] = useState<string>(router.pathname);

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
      <Navbar path={router.asPath} />
      <Container maxW={{ base: 'container.md', lg: 'container.lg' }} pt={14}>
        <ThreeSceneProvider>
          <ThreeScene2 pageRef={pagePath} />
          {children}
        </ThreeSceneProvider>
      </Container>
    </Box>
  );
};

export default Main;
