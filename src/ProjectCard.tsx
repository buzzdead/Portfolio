import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Card, Link, CardBody, Text, Stack } from "@chakra-ui/react";

export const ProjectCard = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 50,
        marginTop: 350,
      }}
    >
      <Card
        variant={"filled"}
        sx={{ width: 300, height: 300 }}
      >
        <CardBody>
            <Stack display={{ base: "block", md: "none" }}>
          <Text>A great project.</Text>
          <Link href="https://elkomplett-2f1891422881.herokuapp.com/" isExternal>
            ElKomplett nettbutikk <ExternalLinkIcon mx="2px" />
          </Link>
          </Stack>
        </CardBody>
      </Card>
      <Card variant={"filled"} sx={{ width: 300, height: 300 }}>
        <CardBody>
          <Text>A great project.</Text>
          <Link href="https://play.google.com/store/apps/details?id=com.hypertrophy" isExternal>
            Hypertrophy treningsapp <ExternalLinkIcon mx="2px" />
          </Link>
        </CardBody>
      </Card>
    </div>
  );
};
