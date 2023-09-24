import { ChakraProvider } from '@chakra-ui/react'
import Layout from './components/layout/main'

interface Props {
    Component: any
    pageProps: any
    router: any
}

const Website = ({ Component, pageProps, router }: Props) => {
    return (
        <ChakraProvider>
            <Layout router={router}>
                <Component {...pageProps} key={router.router} />
            </Layout>
        </ChakraProvider>
    )
}

export default Website