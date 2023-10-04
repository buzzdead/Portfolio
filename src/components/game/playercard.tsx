import { Card, CardBody, Stack, Heading, Box, Image, useColorModeValue, Link } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { PlayerSummary } from "../../types";

interface Props {
    playerSummary: Partial<PlayerSummary>
}

const PlayerCard = ({playerSummary}: Props) => {
    const {personaName, profileUrl, avatar} = playerSummary
    return (
        <Card
        maxW="fit-content"
        bg={"inherit"}
        variant={'unstyled'}
        borderColor={"gray.400"}
        alignItems={"center"}
        display="flex"
      >
        <CardBody>
          <Stack mt="3" spacing="3">
            <Box
              mb={3}
              display="flex"
              flexDir={"row"}
              justifyContent={"center"}
              gap={5}
            >
              <Link pointerEvents={profileUrl === "" ? 'none' : 'inherit'} gap={2.5} display={'flex' } flexDir={'row'} href={profileUrl}  _hover={{textDecoration: 'none', color: useColorModeValue('blue', 'lightblue')}} target='_blank' color='inherit'>
              <Heading
                justifyContent={"center"}
                display="flex"
                fontSize={"2xl"}
              >
                {personaName}
              </Heading>
              <FaExternalLinkAlt fontSize={20} style={{display: 'flex', alignSelf: 'center'}} />
              </Link>
            </Box>
          </Stack>
          <Image src={avatar} alt="Avatar" borderRadius="lg" width={285} pb={5} />
        </CardBody>
      </Card>
    )

}

export default PlayerCard