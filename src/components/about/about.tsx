import { Heading, Box, Image, Link } from '@chakra-ui/react'
import Paragraph from '../paragraph'
import Section from '../section'
import NextLink from 'next/link'
const profileImage = require('../../../public/images/sigmund.jpg')

export const About = () => {
  return (
    <Section delay={0.1}>
      <Heading
        fontFamily="Fira Sans Condensed"
        letterSpacing={0.5}
        as="h3"
        variant="section-title"
        userSelect={'none'}
      >
        <Box userSelect={'none'} alignItems={'center'} flexDir={'column'} display="flex" gap={8}>
          <Image
            borderColor="whiteAlpha.800"
            borderWidth={2}
            borderStyle={'solid'}
            maxWidth="100px"
            display="inline-block"
            borderRadius={'full'}
            src={profileImage.default.src}
            alt="Profile Image"
          />
        </Box>
        Om
      </Heading>
      <Paragraph style={{userSelect: 'none'}} as={'div'}>
        Hei, jeg er en utvikler bosatt i Bergen som er glad i å utvikle nyttige
        applikasjoner. Med bred erfaring innen alt fra datasikkerhet,
        optimalisering og diverse rammeverk så er min største interesse
        utvikling av React og React Native applikasjoner. For tiden holder jeg på med et spill som heter{' '}
        <NextLink
          style={{ position: 'absolute', marginLeft: 5 }}
          href={'/projects/roachranch'}
        >
          <Link as="div">Roach Ranch</Link>
        </NextLink>
      </Paragraph>
    </Section>
  )
}
