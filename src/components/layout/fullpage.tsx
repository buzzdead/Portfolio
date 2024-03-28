import { Box } from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

const FullPage = ({ children }: Props) => {
  return (
    <Box
      position={'fixed'}
      top={0}
      left={0}
      width={'100%'}
      height={'100%'}
      zIndex={99999}
      backgroundColor={'black'}
      overflow={'hidden'}
    >
      {children}
    </Box>
  )
}

export default FullPage
