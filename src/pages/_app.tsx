import Layout from '../components/layout/main'
import { useRouter } from 'next/router'
import Fonts from '../components/fonts'
import { AnimatePresence } from 'framer-motion'
import Chakra from '../components/chakra'

interface Props {
    Component: any
    pageProps: any
}

const Website = ({ Component, pageProps }: Props) => {
    const router = useRouter()

    return (
        <Chakra cookies={pageProps.cookies}>
            <Fonts />
            <Layout router={router}>
                <AnimatePresence mode="wait" initial={false}>
                <Component {...pageProps} key={router.asPath} />
                </AnimatePresence>
            </Layout>
        </Chakra>
    )
}

export default Website