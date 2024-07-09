import {
  Container,
  Box,
  Heading,
  useColorModeValue,
  Button
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Layout from '../components/layout/article'
import { Bio } from '../components/about/bio'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import ContactLink from '../components/contactlink'
import { useThreeScene } from '../components/three/threeprovider'
import { About } from '../components/about/about'
import { Interests } from '../components/about/interests'

const Page = () => {
  const { state } = useThreeScene()
  return (
    <Layout title="Hovedside">
      <Container maxW={{ base: '100%', lg: '60%' }}>
        <Box>
          <Box
            flexGrow={1}
            alignItems={'center'}
            flexDir={'column'}
            display="flex"
          >
            <Heading
              className={state.hitName ? 'burning-effect' : 'none'}
              as="h2"
              variant="page-title"
              userSelect={'none'}
            >
              Sigmund Volden
            </Heading>
            <p style={{userSelect: 'none'}}>App utvikler (Frontend, Backend)</p>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            display={{ base: 'flex' }}
            justifyContent={{ base: 'center', md: 'flex-start' }}
          ></Box>
        </Box>
        <Box display="flex" flexDir={'column'} gap={5} mt={15}>
          <About />
          <Bio />
          <Box display="flex" justifyContent={'center'}>
            <NextLink href="/projects">
              <Button
                transitionDuration={'800ms'}
                rightIcon={<ChevronRightIcon />}
                colorScheme={useColorModeValue('blue', 'gray')}
              >
                Min portefølje
              </Button>
            </NextLink>
          </Box>
          <Interests />
        </Box>
        <Box
          mt={5}
          display="flex"
          flexDir={'row'}
          justifyContent={'center'}
          gap={50}
        >
          <ContactLink
            title="@buzzdead"
            href="https://www.github.com/buzzdead"
            icon={FaGithub}
            iconSize={24}
            size={16}
          />
          <ContactLink
            title="sigmundvolden"
            href="https://www.linkedin.com/in/sigmundvolden/"
            icon={FaLinkedin}
            iconSize={24}
            size={16}
          />
        </Box>
      </Container>
    </Layout>
  )
}

export default Page
export { getServerSideProps } from '../components/chakra'
