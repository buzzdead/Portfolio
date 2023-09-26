import { Container, Box, Heading, Image, useColorModeValue, Link, Button } from "@chakra-ui/react";
import Section from '../components/section'
import Paragraph from "../components/paragraph";
import NextLink from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Layout from "../components/layout/article";
import {BioComponent} from '../components/bio'
import { Scrambler } from "../components/scrambler";

const bio = [
  {year: "1986", section: "Født i Lillehammer, Norge."},
  {year: "2018", section: "Fullførte Bachelor i datasikkerhet på Universitet i Bergen. Lærte om alt fra kryptografi, optimalisering av kode tilogmed systemutvikling"},
  {year: "2022", section: "Jobbet som webutvikler for Wide Assessment i Bergen"},
  {year: "2022", section: "Jobber som webkonsulent for VVS Komplett, utvikler applikasjoner på fritiden."}
]

const Page = () => {
  return (
    <Layout title="Main">
    <Container>
      <Box borderRadius={"lg"} bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} p={3} mb={6} alignSelf="center">
        <Scrambler text={"Hei, jeg er en full-stack utvikler bosatt i Norge."} />
      </Box>

      <Box display={{ md: "flex" }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Sigmund Volden
          </Heading>
          <p>App utvikler (Frontend, Backend)</p>
        </Box>
        <Box
        flexShrink={0}
        mt={{ base: 4, md: 0 }}
        ml={{ md: 6 }}
        display={{base: 'flex'}}
        justifyContent={{base: 'center', md: 'flex-start'}}
      >
        <Image
          borderColor="whiteAlpha.800"
          borderWidth={2}
          borderStyle={"solid"}
          maxWidth="100px"
          display="inline-block"
          borderRadius={"full"}
          src="/images/sigmund.jpg"
          alt="Profile Image"
        />
      </Box>
      </Box>
      <Box>
      <Section delay={0.1}>
        <Heading letterSpacing={1} fontFamily='Fira Sans Condensed' as="h3" variant="section-title">
          Prosjekter
        </Heading>
        <Paragraph as={"div"}>
          Sigmund er en utvikler bosatt i Bergen som er glad i å utvikle nyttige applikasjoner. Med bred erfaring innen alt fra datasikkerhet, optimalisering og diverse rammeverk så holder han for tiden hovedsakelig med på utvikling av React og React Native applikasjoner. For tiden holder han på med et produkt kalt 
          <NextLink style={{position: 'absolute', marginLeft: 5}} href={'/prosjekter/hypertrophy'}> 
            <Link as='div'>Hypertrophy</Link>
          </NextLink>
        </Paragraph>
        <Box justifyContent="center" display='flex' my={4}>
          <NextLink href="/projects">
            <Button rightIcon={<ChevronRightIcon />} colorScheme={useColorModeValue('teal', 'blue')}>
              Min portefølje
            </Button>
          </NextLink>
        </Box>
      </Section>
      <Section gap={2} delay={0.2}>
        <Heading fontFamily='Fira Sans Condensed' letterSpacing={0.5} as="h3" variant="section-title">
          Bio
          </Heading>
          {bio.map((b, id) => <BioComponent key={id} year={b.year} section={b.section}/>)}
      </Section>
      <Section delay={0.3}>
        <Heading fontFamily='Fira Sans Condensed' letterSpacing={0.5} as="h3" variant="section-title">
          Interesser
        </Heading>
        <Paragraph>
          Musikk, Programmering, Trening, Gå tur, Spill, Teknologi
        </Paragraph>
      </Section>
      </Box>
    </Container>
    </Layout>
  );
};

export default Page;
