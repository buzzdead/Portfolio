import { motion } from 'framer-motion'
import Head from 'next/head'
import { GridItemStyle } from '../grid-item'

const variants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 }
}

interface Props {
  children: any
  title: string
  skipEnter?: boolean
}

const Layout = ({ children, title, skipEnter = false }: Props) => {
  return (
    <motion.article
      initial={skipEnter ? false : 'hidden'}
      animate={skipEnter ? false : 'enter'}
      exit="exit"
      variants={variants}
      transition={{ duration: skipEnter ? 0 : 0.2 }}
      style={{ position: 'relative' }}
    >
      <>
        {title && (
          <Head>
            <title>{title}</title>
          </Head>
        )}
        {children}
        <GridItemStyle />
      </>
    </motion.article>
  )
}

export default Layout
