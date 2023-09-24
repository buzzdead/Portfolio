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
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { ReactNode } from "react";

interface Props {
  href: string;
  path: string;
  children: ReactNode;
}

const LinkItem = ({ href, path, children }: Props) => {
  const active = path === href;
  const inactiveColor = useColorModeValue("gray200", "whiteAlpha");
  return (
    <NextLink href={href}>
      <Link
        p={2}
        bg={active ? "glassTeal" : undefined}
        color={active ? "#202023" : inactiveColor}
      >
        {children}
      </Link>
    </NextLink>
  );
};

const NavBar = (props: { path: any }) => {
  const { path } = props;
  return (
    <Box
      pos={"fixed"}
      as="nav"
      w="100%"
      bg={useColorModeValue("#ffffff40", "#20202380")}
      style={{ backdropFilter: "blur(10px)" }}
      zIndex={2}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        flexWrap="wrap"
        alignSelf="center"
        justifyContent={"space-between"}
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={"tighter"}>
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
            <LinkItem href={"/works"} path={path}>
            Works
          </LinkItem>
          <LinkItem href={"/works"} path={path}>
            Posts
          </LinkItem>
        </Stack>
      </Container>
    </Box>
  );
};

export default NavBar;