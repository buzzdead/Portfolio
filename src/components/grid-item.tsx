import NextLink from 'next/link'
import {Image} from '@chakra-ui/react'

import { Box, Text, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { Global } from '@emotion/react'

interface Props {
    children: any
    href?: string
    id?: string
    title: string
    thumbnail: string
    hit: boolean
}

export const GridItem = ({ children, href, title, thumbnail }: Props) => {
    return (
    <Box w="100%" textAlign="center">
        <LinkBox cursor="pointer">
            <Image src={thumbnail} alt={title} className="grid-item-thumbnail" placeholder="blur" loading="lazy" />
            <LinkOverlay href={href} target="_blank">
                <Text mt={20}>{title}</Text>
            </LinkOverlay>
            <Text fontSize={14}>{children}</Text>
        </LinkBox>
    </Box>
    )
}

export const ProjectGridItem = ({ children, id, title, thumbnail, hit = false}: Props) => {
    return (
    <Box zIndex={100} w="100%" textAlign="center" >
        <NextLink href={`/projects/${id}`}>
            <LinkBox className={hit ? 'burning-effect' : 'none'} cursor={"pointer"}>
                <Image src={thumbnail} alt={title} className="grid-item-thumbnail" placeholder='blur'/>
                <LinkOverlay as="div" href={`/projects/${id}`}>
                    <Text mt={2} fontSize={20}>
                        {title}
                    </Text>
                </LinkOverlay>
                <Text fontSize={14}>{children}</Text>
            </LinkBox>
        </NextLink>
    </Box>
    )
}

export const GridItemStyle = () => {
    return (
    <Global styles={`
        .grid-item-thumbnail {
            border-radius: 12px;
        }
    `} />
    )
}