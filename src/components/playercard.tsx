import { Card, CardBody, Stack, Heading, Box, Image } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { PlayerSummary } from "../pages/api/playersummaries";
import ContactLink from "./contactlink";

interface Props {
    playerSummary: PlayerSummary
}

const PlayerCard = ({playerSummary}: Props) => {
    const {personaName, profileUrl, avatar} = playerSummary
    return (
        <Card
        maxW="fit-content"
        bg={"inherit"}
        variant={"elevated"}
        borderColor={"gray.400"}
        borderWidth={1}
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
              <Heading
                justifyContent={"center"}
                display="flex"
                fontSize={"2xl"}
              >
                {personaName}
              </Heading>
              <ContactLink
                size={10}
                iconSize={10}
                icon={FaExternalLinkAlt}
                title={"Profile"}
                href={profileUrl}
              />
            </Box>
          </Stack>
          <Image src={avatar} alt="Avatar" borderRadius="lg" />
        </CardBody>
      </Card>
    )

}

export default PlayerCard