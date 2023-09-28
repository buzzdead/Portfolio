import {
  Container,
  Box,
  Heading,
  Image,
  useColorModeValue,
  Link,
  Button,
} from "@chakra-ui/react";
import Section from "../components/section";
import Paragraph from "../components/paragraph";
import NextLink from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Layout from "../components/layout/article";
import { BioComponent } from "../components/bio";
import { Scrambler } from "../components/scrambler";
const profileImage = require("../../public/images/sigmund.jpg");
import { FaGithub, FaLinkedin, FaMobileAlt } from "react-icons/fa";
import ContactLink from "../components/contactlink";

const bio = [
  { year: "1986", section: "Født i Lillehammer, Norge." },
  {
    year: "2018",
    section:
      "Fullførte Bachelor i datasikkerhet på Universitet i Bergen. Lærte om alt fra kryptografi, optimalisering av kode tilogmed systemutvikling",
  },
  {
    year: "2022",
    section: "Jobbet som webutvikler for Wide Assessment i Bergen",
  },
  {
    year: "2022",
    section:
      "Jobber som webkonsulent for VVS Komplett, utvikler applikasjoner på fritiden.",
  },
];

const Page = () => {
  return (
    <Layout title="Hovedside">
      <Container maxW={{ base: "100%", lg: "60%" }}>
        <Box
          mt={4}
          borderRadius={"2xl"}
          justifyContent={"center"}
          bg={useColorModeValue("whiteAlpha.200", "whiteAlpha.200")}
          minHeight={50}
          mb={4}
          display="flex" // Added display flex
          alignItems="center" // Added align-items center
        >
          <Scrambler
            text={"Hei, jeg er en full-stack utvikler bosatt i Bergen."}
          />
        </Box>

        <Box>
          <Box
            flexGrow={1}
            alignItems={"center"}
            flexDir={"column"}
            display="flex"
          >
            <Heading as="h2" variant="page-title">
              Sigmund Volden
            </Heading>
            <p>App utvikler (Frontend, Backend)</p>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            display={{ base: "flex" }}
            justifyContent={{ base: "center", md: "flex-start" }}
          ></Box>
        </Box>
        <Box display="flex" flexDir={"column"} gap={5} mt={15}>
          <Section delay={0.1}>
            <Heading
              fontFamily="Fira Sans Condensed"
              letterSpacing={0.5}
              as="h3"
              variant="section-title"
            >
              <Box
                alignItems={"center"}
                flexDir={"column"}
                display="flex"
                gap={8}
              >
                <Image
                  borderColor="whiteAlpha.800"
                  borderWidth={2}
                  borderStyle={"solid"}
                  maxWidth="100px"
                  display="inline-block"
                  borderRadius={"full"}
                  src={profileImage.default.src}
                  alt="Profile Image"
                />
              </Box>
              Om
            </Heading>
            <Paragraph as={"div"}>
              Sigmund er en utvikler bosatt i Bergen som er glad i å utvikle
              nyttige applikasjoner. Med bred erfaring innen alt fra
              datasikkerhet, optimalisering og diverse rammeverk så er han
              største interesse utvikling av React og React Native
              applikasjoner. For tiden holder han på med et produkt kalt
              <NextLink
                style={{ position: "absolute", marginLeft: 5 }}
                href={"/projects/hypertrophy"}
              >
                <Link as="div">Hypertrophy</Link>
              </NextLink>
            </Paragraph>
          </Section>
          <Section gap={2} delay={0.2}>
            <Heading
              fontFamily="Fira Sans Condensed"
              letterSpacing={0.5}
              as="h3"
              variant="section-title"
            >
              Bio
            </Heading>
            {bio.map((b, id) => (
              <BioComponent key={id} year={b.year} section={b.section} />
            ))}
          </Section>
          <Box display="flex" justifyContent={"center"}>
            <NextLink href="/projects">
              <Button
                transitionDuration={"800ms"}
                rightIcon={<ChevronRightIcon />}
                colorScheme={useColorModeValue("blue", "gray")}
              >
                Min portefølje
              </Button>
            </NextLink>
          </Box>
          <Section delay={0.3}>
            <Heading
              fontFamily="Fira Sans Condensed"
              letterSpacing={0.5}
              as="h3"
              variant="section-title"
            >
              Interesser
            </Heading>
            <Paragraph>
              Musikk, Programmering, Trening, Gå tur, Spill, Teknologi
            </Paragraph>
          </Section>
        </Box>
        <Box
          mt={5}
          display="flex"
          flexDir={"row"}
          justifyContent={"center"}
          gap={50}
        >
          <ContactLink
            title="@buzzdead"
            href="https://www.github.com/buzzdead"
            icon={FaGithub}
          />
          <ContactLink
            title="sigmundvolden"
            href="https://www.linkedin.com/in/sigmundvolden/"
            icon={FaLinkedin}
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default Page;
