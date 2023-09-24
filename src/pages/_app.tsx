import { ChakraProvider } from '@chakra-ui/react'
import Layout from './components/layout/main'
import { useRouter } from 'next/router'

interface Props {
    Component: any
    pageProps: any
}

const Website = ({ Component, pageProps }: Props) => {
    const router = useRouter()
    return (
        <ChakraProvider>
            <Layout router={router}>
                <Component {...pageProps} key={router.asPath} />
            </Layout>
        </ChakraProvider>
    )
}

export default Website