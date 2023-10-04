import { InfoIcon } from "@chakra-ui/icons"
import { Box, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Link, useMediaQuery } from "@chakra-ui/react"

export const InfoApi = () => {
    const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
    return (
        <Box display='flex' mb={1}>
            <Popover placement="top-start" trigger={isLargerThan600 ? "hover" : 'click'}>
                <PopoverTrigger>
                    <InfoIcon
                        cursor="pointer"
                        fontSize={{base: "lg", md: 'xl'}}
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader><Link target='_blank' href="https://steamcommunity.com/dev">Informasjon om steam API</Link></PopoverHeader>
                    <PopoverBody>
                        Du kan opprette en Steam API nøkkel ved å føge denne linken, bare skriv inn et domene så får du nøkkelen.
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    )
}
