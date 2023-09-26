import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Scrambler } from './scrambler'

const BioSection = styled(Box) `
padding-left: 3.4em;
text-indent: -3.4em;
`

const BioYear = styled.span`
font-weight: bold;
margin-right: 1em;
`

interface Props {
    year: string
    section: string
}
export const BioComponent = ({year, section}: Props) => {
    return (
        <BioSection>
            <BioYear>
            {year}
            </BioYear>
            {section}
        </BioSection>
    )

}