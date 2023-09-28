import { Container, Badge, Link, List, ListItem, Flex } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Paragraph from '../../components/paragraph'
import { Title, Picture, Meta } from '../../components/project'
import Layout from '../../components/layout/article'
const progress = require('../../../public/images/hypertrophy/Progress.png');
const filter = require('../../../public/images/hypertrophy/Filter.png');
const settings = require('../../../public/images/hypertrophy/Settings.png');
const weeklyProgress = require('../../../public/images/hypertrophy/ProgressWeekly.png');
const exercises = require('../../../public/images/hypertrophy/Exercises.png');

const Hypertrophy = () => {
    return (
        <Layout title={"ElKomplett"}>
            <Container maxW={'100%'}>
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
                <Flex  display='flex' flexWrap={'wrap'} flexDir={'row'} gap={2}>
                <Picture size='sm' src={exercises.default.src} alt="ElKomplett"/>
                <Picture size='sm' src={filter.default.src} alt="ElKomplett"/>
                <Picture size='sm'  src={weeklyProgress.default.src} alt="ElKomplett"/>
                <Picture size='sm'  src={progress.default.src} alt="ElKomplett"/>
                <Picture size='sm'  src={settings.default.src} alt="ElKomplett"/>
                </Flex>
            </Container>
        </Layout>
    )
}

export default Hypertrophy