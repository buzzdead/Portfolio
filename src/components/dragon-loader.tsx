import { ReactNode, forwardRef } from 'react'
import { Box, Spinner } from '@chakra-ui/react'

export const DragonSpinner = () => (
  <Spinner
    size="xl"
    position="absolute"
    left="50%"
    top="50%"
    ml="calc(0px - var(--spinner-size) / 2)"
    mt="calc(0px - var(--spinner-size))"
  />
)

interface Props {
  children: ReactNode
}

export const DragonContainer = forwardRef(({ children }: Props, ref: any) => (
  <Box
    ref={ref}
    className="dragon"
    m="auto"
    mt={['-20px', '-60px', '-120px']}
    mb={['-40px', '-140px', '-200px']}
    w={[280, 480, 640]}
    h={[280, 480, 640]}
    position="fixed"
    zIndex={1}
  >
    {children}
  </Box>
))

const Loader = () => {
  return (
    <DragonContainer>
      <DragonSpinner />
    </DragonContainer>
  )
}

export default Loader