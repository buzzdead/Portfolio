import { Heading } from '@chakra-ui/react'
import Paragraph from '../paragraph'
import Section from '../section'

export const Interests = () => {
  return (
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
  )
}
