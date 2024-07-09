import { Box, Heading } from '@chakra-ui/react'
import styled from '@emotion/styled'
import List from '../list'
import Section from '../section'

type BioType = { year: string; section: string }

const bio: BioType[] = [
  { year: '1986', section: 'Født i Lillehammer, Norge.' },
  {
    year: '2021',
    section:
      'Fullførte Bachelor i datasikkerhet på Universitet i Bergen. Lærte om alt fra kryptografi, optimalisering av kode tilogmed systemutvikling'
  },
  {
    year: '2022',
    section: 'Jobbet som webutvikler for Wide Assessment i Bergen'
  },
  {
    year: '2022',
    section:
      'Jobber som webkonsulent for VVS Komplett, utvikler applikasjoner på fritiden.'
  }
]

const BioSection = styled(Box)`
  padding-left: 3.4em;
  text-indent: -3.4em;
  user-select: none;
`

const BioYear = styled.span`
  font-weight: bold;
  margin-right: 1em;
  user-select: none;
`

interface Props {
  year: string
  section: string
}
const BioComponent = ({ year, section }: Props) => {
  return (
    <BioSection>
      <BioYear>{year}</BioYear>
      {section}
    </BioSection>
  )
}

export const Bio = () => {
  return (
    <Section gap={2} delay={0.2}>
      <Heading
        fontFamily="Fira Sans Condensed"
        letterSpacing={0.5}
        as="h3"
        variant="section-title"
        userSelect={'none'}
      >
        Bio
      </Heading>
      <List
        style={{ gap: 7.5, display: 'flex', flexDirection: 'column' }}
        items={bio}
        renderItem={(b, id) => (
          <BioComponent key={id} year={b.year} section={b.section} />
        )}
      />
    </Section>
  )
}
