import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/layout/main'
import { useRouter } from 'next/router'
import theme from '../lib/theme'
import Fonts from '../components/fonts'
import { AnimatePresence } from 'framer-motion'

interface Props {
    Component: any
    pageProps: any
}

const Website = ({ Component, pageProps }: Props) => {
    const router = useRouter()
    return (
        <ChakraProvider theme={theme}>
            <Fonts />
            <Layout router={router}>
                <AnimatePresence mode="wait" initial={true}>
                <Component {...pageProps} key={router.asPath} />
                </AnimatePresence>
            </Layout>
        </ChakraProvider>
    )
}

export default Website