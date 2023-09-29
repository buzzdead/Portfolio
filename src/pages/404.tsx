import NextLink from 'next/link'
import { Box, Heading, Container, Divider, Button } from '@chakra-ui/react'
import Layout from '../components/layout/article'

const NotFound = () => {
    return (
        <Layout title={"404"}>
        <Container
            height="100vh" 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={3}
        >
            <Heading as="h1">Not Found</Heading>
            <Box mb={4}>The page you're looking for was not found.</Box>
            
            <Box>
                <NextLink href="/">
                    <Button colorScheme='teal'>
                        Return to home
                    </Button>
                </NextLink>
            </Box>
        </Container>
        </Layout>
    )
}
export default NotFound