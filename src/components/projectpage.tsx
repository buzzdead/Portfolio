import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Paragraph from "./paragraph";
import { Title, Picture, Meta } from "./project";
import Layout from "./layout/article";
import { useState } from "react";

type Image = { title: string; image: any };

export type Project = {
  title: string;
  year: number;
  type: string;
  description: string;
  stack: string;
  platform: string;
  link: string;
  images: Image[];
};

interface Props {
  project: Project;
  smallImages?: boolean;
}

const ProjectPage = ({ project, smallImages = false }: Props) => {
  const [blowUpImage, setBlowUpImage] = useState({
    blownUp: false,
    id: 0,
    title: "",
  });

  const handleBlowUpImage = (id: number, title: string) => {
    setBlowUpImage({ blownUp: true, id: id, title: title });
  };

  const handleCloseModal = () => {
    setBlowUpImage({ blownUp: false, id: 0, title: "" });
  };

  return (
    <Layout title={project.title}>
      <Container maxW="100%">
        <Title>
          {project.title} <Badge>{project.year}</Badge>
        </Title>
        <Paragraph>{project.description}</Paragraph>
        <List ml={2} my={4}>
          <ListItem>
            <Meta>{project.type}</Meta>
            <Link href={project.link} target="_blank">
              {project.title} <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
          <ListItem>
            <Meta>Platform</Meta>
            <span>{project.platform}</span>
          </ListItem>
          <ListItem>
            <Meta>Stack</Meta>
            <span>{project.stack}</span>
          </ListItem>
        </List>
        <Flex
          display="flex"
          flexWrap={"wrap"}
          flexDir={"row"}
          justifyContent={{ base: "center", md: "flex-start" }}
          gap={2}
        >
          {project.images.map(({ image, title }, index) => (
            <Picture
              handleOnClick={() => handleBlowUpImage(index, title)}
              key={index}
              size={smallImages ? "sm" : "5xl"}
              src={image.default.src}
              alt={title}
            />
          ))}
        </Flex>
      </Container>
      <Modal isOpen={blowUpImage.blownUp} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent maxW={smallImages ? "xs" : "5xl"}>
          <ModalHeader justifyContent={"center"} display="flex">
            {blowUpImage.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody padding={0} display='flex' justifyContent={'center'}>
            {/* Display the blown-up image here */}
            <img
              src={project.images[blowUpImage.id].image.default.src}
              alt={project.title}
            />
          </ModalBody>
          <ModalFooter py={10}>
            <Flex justifyContent="center" w="100%">
              {project.images.map(({image, title}, index) => (
                <Box
                  key={index}
                  w="8px"
                  h="8px"
                  borderRadius="50%"
                  bg={index === blowUpImage.id ? "blue.500" : "gray.300"}
                  mx="2"
                  cursor="pointer"
                  onClick={() => handleBlowUpImage(index, title)}
                />
              ))}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default ProjectPage;
