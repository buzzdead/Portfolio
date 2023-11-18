import Layout from "../components/layout/main";
import { useRouter } from "next/router";
import Fonts from "../components/fonts";
import { AnimatePresence } from "framer-motion";
import Chakra from "../components/chakra";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import React from "react";
import '../app.css'


interface Props {
  Component: any;
  pageProps: any;
}

const Website = ({ Component, pageProps }: Props) => {
  const router = useRouter();
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Chakra cookies={pageProps.cookies}>
        <Fonts />
          <Layout router={router}>
          <AnimatePresence onExitComplete={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0 })
            }
          }} mode='wait' initial={true}>
            <Component {...pageProps} key={router.asPath} />
            </AnimatePresence>
          </Layout>
      </Chakra>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default Website;
