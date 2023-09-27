import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Paragraph from '../../components/paragraph'
import { Title, Picture, Meta } from '../../components/project'
import Layout from '../../components/layout/article'
const thumbHypertrophy = require('../../../public/images/Hypertrophy.png');

const Hypertrophy = () => {
    return (
        <Layout title={"ElKomplett"}>
            <Container>
                <Title >
                    Hypertrophy <Badge>2023</Badge>
                </Title>
                <Paragraph>
                Treningsapp med muligheten til å konfigurere egne typer øvelser og kategorier. Legg enkelt til øvelser og følge dem i progresjons-taben.
                </Paragraph>
                <List ml={2} my={4}>
                    <ListItem>
                        <Meta>Website</Meta>
                        <Link href='https://play.google.com/store/apps/details?id=com.hypertrophy' target='_blank'>
                            Hypertrophy <ExternalLinkIcon mx='2px' />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Meta>Platform</Meta>
                        <span>Android</span>
                    </ListItem>
                    <ListItem>
                        <Meta>Stack</Meta>
                        <span>React Native, TypeScript, Realm, Android Studio</span>
                    </ListItem>
                </List>
                <Picture src={thumbHypertrophy.default.src} alt="ElKomplett"/>
            </Container>
        </Layout>
    )
}

export default Hypertrophy