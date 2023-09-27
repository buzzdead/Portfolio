import NextLink from 'next/link'
import { Heading, Box, Image, Link, Badge } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

interface ImageProps {
    src: string
    alt: string
}

export const Title = ({ children }: Props) => {
    return (
    <Box>
        <NextLink href={'/projects'}>
            <Link as="div">Prosjekter</Link>
        </NextLink>
    
    <span>
        
        <ChevronRightIcon />
        
    </span>
    <Heading display="inline-block" as="h3" fontSize={20} mb={4}>
        {children}
    </Heading>
    </Box>
    )
}

export const Picture = ({ src, alt }: ImageProps) => {
   return <Image borderRadius='lg' w='full' src={src} alt={alt} mb={4} />
}

export const Meta = ({ children }: Props) => {
    return (<Badge colorScheme='green' mr={2}>
        {children}
    </Badge>)
}