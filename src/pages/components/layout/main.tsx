import Head from 'next/head'
import { Box, Container } from '@chakra-ui/react'
import Navbar from '../navbar'
import { ReactNode } from 'react';
import { NextRouter } from 'next/router';


interface MainProps {
    children: ReactNode
    router: NextRouter
}

const Main = ({ children, router }: MainProps) => {
    return (
        <Box as={"main"} pb={8}>
            <Head>
                <meta name={"viewport"} content={"width=device-width, initial-scale=1"} />
                <title>Sigmund Volden - Homepage</title>
            </Head>
            <Navbar path={router.asPath} />
            <Container maxW={'container.md'} pt={14}>
                {children}
            </Container>
        </Box>
    )
}

export default Main