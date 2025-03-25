import Head from 'next/head';
import { Box, Container, Flex, Spinner, Text } from '@chakra-ui/react';
import Navbar from '../navbar';
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react';
import { ThreeSceneProvider } from '../three/threeprovider';
import { NextRouter } from 'next/router';
import { SolarSystemProvider } from '../three/solarsystemprovider';

interface MainProps {
  children: React.ReactNode;
  router: NextRouter;
}

const DynamicComponentWithNoSSR = dynamic(
  () => import('../introduction'),
  { 
    ssr: false,
    loading: () => (
      <Flex 
        height="100vh" 
        width="100vw" 
        alignItems="center" 
        justifyContent="center" 
        flexDirection="column"
        bg="black"
        color="white"
      >
        <Box 
          position="relative"
          width="80px"
          height="80px"
          mb={4}
        >
          <Spinner 
            size="xl" 
            thickness="4px"
            speed="0.8s"
            color="purple.400"
            position="absolute"
            top="4"
            left="4"
          />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="30px"
            height="30px"
            borderRadius="full"
            bg="purple.300"
            opacity="0.7"
            boxShadow="0 0 20px 10px #805AD5"
          />
        </Box>
      </Flex>
    )
  }
)

const Main = ({ children, router }: MainProps) => {
  const [pagePath, setPagePath] = useState<string>(router.pathname);
  const [introduced, setIntroduced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleIntroduction = () => {
    // Save to localStorage when user completes introduction
    localStorage.setItem("hasSeenIntroduction", "true");
    setIntroduced(true);
  }
  
  useEffect(() => {
    setPagePath(router.pathname);
    
    // Check if user has already seen the introduction
    const hasSeenIntro = localStorage.getItem("hasSeenIntroduction") === "true";
    if (hasSeenIntro) {
      setIntroduced(true);
    }
    
    // Timeout for loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
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
  
  // Show loading screen only if not introduced and still loading
  if (!introduced && isLoading) {
    return (
      <Flex 
        height="100vh" 
        width="100vw" 
        alignItems="center" 
        justifyContent="center" 
        flexDirection="column"
        bg="black"
        color="white"
      >
        <Box 
          position="relative"
          width="80px"
          height="80px"
          mb={4}
        >
          <Spinner 
            size="xl" 
            thickness="4px"
            speed="0.8s"
            color="purple.400"
            position="absolute"
            top="4"
            left="4"
          />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="30px"
            height="30px"
            borderRadius="full"
            bg="purple.300"
            opacity="0.7"
            boxShadow="0 0 20px 10px #805AD5"
          />
        </Box>
      </Flex>
    );
  }
  
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
      {introduced ? (
        <>
          <Navbar path={router.asPath} />
          <Container maxW={{ base: 'container.md', lg: 'container.lg' }} pt={14}>
            <ThreeSceneProvider>
              <SolarSystemProvider>
                {children}
              </SolarSystemProvider>
            </ThreeSceneProvider>
          </Container> 
        </>
      ) : (
        <DynamicComponentWithNoSSR setIntroduced={handleIntroduction} />
      )}
    </Box>
  );
};

export default Main;