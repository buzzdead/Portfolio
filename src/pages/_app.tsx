import Layout from '../components/layout/main'
import { useRouter } from 'next/router'
import Fonts from '../components/fonts'
import { AnimatePresence } from 'framer-motion'
import Chakra from '../components/chakra'
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

interface Props {
    Component: any
    pageProps: any
}

const Website = ({ Component, pageProps }: Props) => {
    const router = useRouter()
    const queryClient = new QueryClient();

    return (
        <Chakra cookies={pageProps.cookies}>
            <Fonts />
            <Layout router={router}>
                
                <QueryClientProvider client={queryClient}>
                <AnimatePresence mode="wait" initial={false}>
                <Component {...pageProps} key={router.asPath} />
                </AnimatePresence>
                <ReactQueryDevtools />
                </QueryClientProvider>
            </Layout>
        </Chakra>
    )
}

export default Website