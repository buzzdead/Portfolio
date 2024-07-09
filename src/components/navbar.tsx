import Logo from "./Logo";
import NextLink from "next/link";
import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import ThemeToggleButton from "./themeButton";
import { Weather } from "./weather";
import StormToggle from "./umbrella";
import { useState } from "react";

interface Props {
  href: string;
  path: string;
  children: any;
}

const LinkItem = ({ href, path, children }: Props) => {
  const active = path === href;
  const inactiveColor = useColorModeValue("gray200", "whiteAlpha");
  const gradientColor = useColorModeValue(
    "linear-gradient(to left, #5c81cc, #8199c9, #b5bcc7)",
    "linear-gradient(to left, #c8cacf, #5e5f61, #3d4040)"
  );
  return (
    <NextLink scroll={false} href={href}>
      <Link
        as={"div"}
        _hover={{ textDecoration: active ? "auto" : "underline" }}
        p={2}
        textDecoration={"goldenrod"}
        borderRadius={"lg"}
        bg={active ? gradientColor : undefined}
        color={active ? "#202023" : inactiveColor}
      >
        {children}
      </Link>
    </NextLink>
  );
};

const NavBar = (props: { path: any }) => {
  const { path } = props;
  const [storm, toggleStorm] = useState(false)
  return (
    <Box
      pos={"fixed"}
      as="nav"
      w="100%"
      bg={useColorModeValue("whiteAlpha.500", "#20202380")}
      style={{
        backdropFilter: "blur(10px)",
        borderBottomColor: useColorModeValue("black", "white"),
        borderBottomWidth: 1,
        transition: "background-color 800ms",
      }}
      zIndex={20}
      {...props}
    >
      <Weather isStormy={storm}/>
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        flexWrap="wrap"
        alignSelf="center"
        justifyContent={"space-between"}
      >
        
        <Flex flex={{ base: 3, md: 1 }} align="center" mr={5}>
          <Heading userSelect={'none'} as="h1" size="lg" letterSpacing={"tighter"}>
            <Logo />
          </Heading>
        </Flex>
        <Stack
          direction={{ base: "column", md: "row" }}
          display={{ base: "none", md: "flex" }}
          width={{ base: "full", md: "auto" }}
          flexGrow={1}
          alignItems={"center"}
          mt={{ base: 4, md: 0 }}
        >
          <LinkItem href={"/projects"} path={path}>
            <Text
              minWidth={"80px"}
              textAlign={"center"}
              fontWeight={"medium"}
              transitionDuration={"800ms"}
              color={useColorModeValue("black", "white")}
              fontFamily={"body"}
              userSelect={'none'}
            >
              Prosjekter
            </Text>
          </LinkItem>
          <LinkItem href={"/games"} path={path}>
            <Text
              minWidth={"80px"}
              textAlign={"center"}
              fontWeight={"medium"}
              transitionDuration={"800ms"}
              color={useColorModeValue("black", "white")}
              fontFamily={"body"}
              userSelect={'none'}
            >
              Spill
            </Text>
          </LinkItem>
          <LinkItem href={"/aifun"} path={path}>
            <Text
              minWidth={"80px"}
              textAlign={"center"}
              fontWeight={"medium"}
              transitionDuration={"800ms"}
              color={useColorModeValue("black", "white")}
              fontFamily={"body"}
              userSelect={'none'}
            >
              AI
            </Text>
          </LinkItem>
        </Stack>
        <Box
          flex={1}
          display={{ base: "flex" }}
          justifyContent="right"
          mr={2.5}
          gap={1.5}
        >
          <StormToggle storm={storm} toggleStorm={() => toggleStorm(!storm)} />
          <ThemeToggleButton />
          <Box flex={1} ml={2} display={{ base: "inline-block", md: "none" }}>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={
                  <HamburgerIcon
                    transitionDuration={"400ms"}
                    fontSize={"2xl"}
                    color={useColorModeValue("black", "white")}
                  />
                }
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                <NextLink href="/games" passHref>
                  <MenuItem as={"div"}>Spill</MenuItem>
                </NextLink>
                <NextLink href="/projects" passHref>
                  <MenuItem as={"div"}>Prosjekter</MenuItem>
                </NextLink>
                <NextLink href="/aifun" passHref>
                  <MenuItem as={"div"}>AI</MenuItem>
                </NextLink>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NavBar;
