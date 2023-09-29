import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Section from '../components/section'
import { ProjectGridItem } from '../components/grid-item'
import Layout from '../components/layout/article';
const thumbHypertrophy = require('../../public/images/hypertrophy/hypertrophy-main.png');
const thumbElKomplett = require('../../public/images/elkomplett/homepage.png');

const Projects = () => {
    return (
        <Layout title={"Prosjekter"}>
        <Container maxW={'100%'}>
            <Heading as="h3" fontSize={20} mb={4}>
                Prosjekter
            </Heading>
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
                <Section>
                    <ProjectGridItem id="hypertrophy" title={"Hypertrophy"} thumbnail={thumbHypertrophy}>
                       Treningsapp med muligheten til å konfigurere egne typer øvelser og kategorier. Legg enkelt til øvelser og følge dem i progresjons-taben.
                    </ProjectGridItem>
                </Section>
                <Section>
                    <ProjectGridItem id="elkomplett" title={"ElKomplett"} thumbnail={thumbElKomplett}>
                       Nettbutikk med CRUD support. Legg til kategorier, produkter, produsenter og spesifiser produkttyper. Konfigurer produkter med egendefinerte attributter.
                    </ProjectGridItem>
                </Section>
            </SimpleGrid>
        </Container>
        </Layout>
    )
}

export default Projects
export { getServerSideProps } from '../components/chakra'