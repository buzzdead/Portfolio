import NextLink from 'next/link'
import { Box, Heading, Container, Divider, Button } from '@chakra-ui/react'

const NotFound = () => {
    return (
        <Container>
            <Heading as="h1">Not Found</Heading>
            <Box>The page you're looking for was not found.</Box>
            <Divider my={6} />
            <Box my={6} display='flex' justifyContent="center">
                <NextLink href="/">
                    <Button colorScheme='teal'>
                        Return to home
                    </Button>
                </NextLink>
            </Box>
        </Container>
    )
}
export default NotFound