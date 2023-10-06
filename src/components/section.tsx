import { motion } from 'framer-motion'
import { chakra, shouldForwardProp } from '@chakra-ui/react'

interface Props {
    children: any
    delay?: number
    gap?: number
    mb?: number
}

const StyledDiv = chakra(motion.div, {
    shouldForwardProp: prop => {
        return shouldForwardProp(prop) || prop === "transition"
    }
})

const Section = ({ children, delay = 0, gap = 0, mb = 6}: Props) => {
    return (
    <StyledDiv
    display='flex'
    flexDir={'column'}
    gap={gap}
    initial={{y: 0, opacity: 0.05}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.8, delay} as any}
    mb={mb}>
        {children}
    </StyledDiv>
    )
}

export default Section