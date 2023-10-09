import {
  Container,
  Badge,
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
  Link
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Paragraph from './paragraph'
import { Title, Picture, Meta } from './project'
import Layout from './layout/article'
import { useEffect, useState } from 'react'
import Section from './section'
import { useSwipeable } from 'react-swipeable'

type Image = { title: string; image: any }

export type Project = {
  title: string
  year: number
  type: string
  description: string
  stack: string
  platform: string
  link: string
  images: Image[]
}

interface Props {
  project: Project
  smallImages?: boolean
}

const ProjectPage = ({ project, smallImages = false }: Props) => {
  const [blowUpImage, setBlowUpImage] = useState({
    blownUp: false,
    id: 0,
    title: ''
  })

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseDown = (e: any) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e: any) => {
    if (isDragging) {
      const deltaX = e.clientX - startX

      if (deltaX > 50) {
        // You can adjust this threshold for sensitivity
        const newIndex =
          (blowUpImage.id - 1 + project.images.length) % project.images.length
        newIndex !== project.images.length - 1 &&
          handleBlowUpImage(newIndex, project.images[newIndex].title)
        setIsDragging(false)
      } else if (deltaX < -50) {
        // You can adjust this threshold for sensitivity
        const newIndex = (blowUpImage.id + 1) % project.images.length
        newIndex !== 0 &&
          handleBlowUpImage(newIndex, project.images[newIndex].title)
        setIsDragging(false)
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const newIndex = (blowUpImage.id + 1) % project.images.length
      newIndex !== 0 &&
        handleBlowUpImage(newIndex, project.images[newIndex].title)
    },
    onSwipedRight: () => {
      const newIndex =
        (blowUpImage.id - 1 + project.images.length) % project.images.length
      newIndex !== project.images.length - 1 &&
        handleBlowUpImage(newIndex, project.images[newIndex].title)
    }
  })

  const handleBlowUpImage = (id: number, title: string) => {
    setBlowUpImage({ blownUp: true, id: id, title: title })
  }

  const handleCloseModal = () => {
    setBlowUpImage({ blownUp: false, id: 0, title: '' })
  }

  return (
    <Layout title={project.title}>
      <Container maxW="100%">
        <Section delay={0.1}>
          <Title>
            {project.title} <Badge>{project.year}</Badge>
          </Title>
          <Paragraph>{project.description}</Paragraph>
          <List ml={2} my={4}>
            <ListItem>
              <Meta>{project.type}</Meta>
              <Link href={project.link} target='_blank'>
                {project.title}{' '}
                <ExternalLinkIcon
                  css={{
                    '@keyframes pulse': {
                      from: {
                        transform: 'scale(1)'
                      },
                      to: {
                        transform: 'scale(1.25)'
                      }
                    },
                    animation: mounted ? 'pulse 0.5s ease' : 'none',
                    animationIterationCount: 2
                  }}
                  fontSize={'sm'}
                  mb={1.25}
                />
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
        </Section>
        <Section delay={0.2}>
          <Flex
            display="flex"
            flexWrap={'wrap'}
            flexDir={'row'}
            justifyContent={{ base: 'center', md: 'flex-start' }}
            gap={2}
          >
            {project.images.map(({ image, title }, index) => (
              <Picture
                handleOnClick={() => handleBlowUpImage(index, title)}
                key={index}
                size={smallImages ? 'sm' : '5xl'}
                src={image.default.src}
                alt={title}
              />
            ))}
          </Flex>
        </Section>
      </Container>
      <Modal isOpen={blowUpImage.blownUp} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          maxW={smallImages ? 'xs' : '5xl'}
        >
          <ModalHeader justifyContent={'center'} display="flex">
            {blowUpImage.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            padding={0}
            display="flex"
            justifyContent={'center'}
            {...handlers}
          >
            {/* Display the blown-up image here */}
            <img
              src={project.images[blowUpImage.id].image.default.src}
              alt={project.title}
              draggable={false}
              style={{ userSelect: 'none' }}
            />
          </ModalBody>
          <ModalFooter py={10}>
            <Flex justifyContent="center" w="100%">
              {project.images.map(({ image, title }, index) => (
                <Box
                  key={index}
                  w="14px"
                  h="14px"
                  borderRadius="50%"
                  bg={index === blowUpImage.id ? 'blue.500' : 'gray.300'}
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
  )
}

export default ProjectPage
