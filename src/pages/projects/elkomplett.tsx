import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Paragraph from '../../components/paragraph'
import { Title, Picture, Meta } from '../../components/project'
import Layout from '../../components/layout/article'
const thumbElKomplett = require('../../../public/images/ElKomplett.png');

const ElKomplett = () => {
    return (
        <Layout title={"ElKomplett"}>
            <Container>
                <Title >
                    ElKomplett <Badge>2023</Badge>
                </Title>
                <Paragraph>
                Nettbutikk med CRUD support. Legg til kategorier, produkter, produsenter og spesifiser produkttyper. Konfigurer produkter med egendefinerte attributter.
                </Paragraph>
                <List ml={2} my={4}>
                    <ListItem>
                        <Meta>Website</Meta>
                        <Link href='https://elkomplett-2f1891422881.herokuapp.com/' target='_blank'>
                            ElKomplett <ExternalLinkIcon mx='2px' />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Meta>Platform</Meta>
                        <span>Windows/macOS/Linux/Android</span>
                    </ListItem>
                    <ListItem>
                        <Meta>Stack</Meta>
                        <span>React, TypeScript, PostgreSQL, C#</span>
                    </ListItem>
                </List>
                <Picture src={thumbElKomplett.default.src} alt="ElKomplett"/>
            </Container>
        </Layout>
    )
}

export default ElKomplett