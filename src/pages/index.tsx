import { Container, Box, Heading } from "@chakra-ui/react";

const Page = () => {
  return (
    <Container>
      <Box borderRadius={"lg"} bg="red" p={3} mb={6} alignSelf="center">
        Hei, jeg er en full-stack utvikler bosatt i Norge.
      </Box>
      <Box display={{md: "flex"}}>
        <Box flexGrow={1}>
            <Heading as="h2" variant="page-title">
                Sigmund Volden
            </Heading>
            <p>Android utvikler, Frontend utvikler, Backend utvikler</p>
        </Box>
      </Box>
    </Container>
  );
};

export default Page;