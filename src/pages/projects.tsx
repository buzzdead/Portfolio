import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Section from '../components/section'
import { ProjectGridItem } from '../components/grid-item'
import Layout from '../components/layout/article';
import { useThreeScene } from '../components/three/threeprovider';
import Link from 'next/link';
const thumbHypertrophy = require('../../public/images/hypertrophy/hypertrophy-main.png');
const thumbElKomplett = require('../../public/images/elkomplett/homepage.png');

const Projects = () => {
    const {state} = useThreeScene()
    return (
        <Layout title={"Prosjekter"}>
        <Container maxW={'100%'}>
            <Heading mt={2} as="h3" fontSize={20} mb={4}>
                Prosjekter
            </Heading>
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
                <Section>
                    <ProjectGridItem hit={state.hitProject.left} id="hypertrophy" title={"Hypertrophy"} thumbnail={thumbHypertrophy.default.src}>
                       Treningsapp med muligheten til å konfigurere egne typer øvelser og kategorier. Legg enkelt til øvelser og følge dem i progresjons-taben.
                    </ProjectGridItem>
                </Section>
                <Section>
                    <ProjectGridItem hit={state.hitProject.right} id="elkomplett" title={"ElKomplett"} thumbnail={thumbElKomplett.default.src}>
                       Nettbutikk med CRUD support. Legg til kategorier, produkter, produsenter og spesifiser produkttyper. Konfigurer produkter med egendefinerte attributter.
                    </ProjectGridItem>
                </Section>
            </SimpleGrid>
            <Heading mt={2} as="h3" fontSize={20} mb={4}>
                Mini-prosjekter
            </Heading>
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
                <Section>
                    <Link href='./projects/solarsystem'>
                    Solarsystem
                    </Link>
                </Section>
                </SimpleGrid>
        </Container>
        </Layout>
    )
}

export default Projects
export { getServerSideProps } from '../components/chakra'