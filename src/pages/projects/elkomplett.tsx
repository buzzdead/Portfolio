import { Container, Badge, Link, List, ListItem, Flex } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Paragraph from '../../components/paragraph'
import { Title, Picture, Meta } from '../../components/project'
import Layout from '../../components/layout/article'
const homepage = require('../../../public/images//elkomplett/homepage.png');
const inventory = require('../../../public/images/elkomplett/inventory.png');

const product = require('../../../public/images/elkomplett/elkomplett-produkt.png');
const configure = require('../../../public/images/elkomplett/elkomplett-konfigurer.png');
const preset = require('../../../public/images/elkomplett/elkomplett-preset.png');
const multikeys = require('../../../public/images/elkomplett/elkomplett-multikeys.png');

const ElKomplett = () => {
    return (
        <Layout title={"ElKomplett"}>
            <Container maxW='100%'>
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
                <Flex display='flex' flexWrap={'wrap'} flexDir={'row'} gap={2}>
                <Picture size='5xl' src={homepage.default.src} alt="ElKomplett"/>
                <Picture size='5xl' src={inventory.default.src} alt="ElKomplett"/>
                <Picture size='5xl' src={product.default.src} alt="ElKomplett"/>
                <Picture size='5xl' src={configure.default.src} alt="ElKomplett"/>
                <Picture size='5xl' src={preset.default.src} alt="ElKomplett"/>
                <Picture size='5xl' src={multikeys.default.src} alt="ElKomplett"/>
                </Flex>
            </Container>
        </Layout>
    )
}

export default ElKomplett