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

interface Props {
  href: string;
  path: string;
  children: any;
}

const LinkItem = ({ href, path, children }: Props) => {
  const active = path === href;
  const inactiveColor = useColorModeValue("gray200", "whiteAlpha");
  return (
    <NextLink href={href}>
      <Link
        as={'div'}
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
      bg={useColorModeValue('whiteAlpha.900', "#20202380")}
      style={{ backdropFilter: "blur(10px)", borderBottomColor: useColorModeValue("black", "white"), borderBottomWidth: 1, transition: 'background-color 800ms'}}
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
            <LinkItem href={"/projects"} path={path}>
            <Text fontWeight={'medium'} fontFamily={'body'}>Prosjekter</Text>
          </LinkItem>
          <LinkItem href={"/Lesestoff"} path={path}>
            <Text fontWeight={'medium'} fontFamily={'body'}>Lesestoff</Text>
          </LinkItem>
        </Stack>
        <Box flex={1} display={{base: 'flex'}} justifyContent="right">
          <ThemeToggleButton />
          <Box ml={2} display={{base: 'inline-block', md: 'none'}}>
            <Menu>
              <MenuButton as={IconButton} icon={<HamburgerIcon color='green'/>} variant='outline' aria-label="Options" />
              <MenuList>
                <NextLink href="/" passHref>
                  <MenuItem as={"div"}>Om meg</MenuItem>
                </NextLink>
                <NextLink href="/" passHref>
                  <MenuItem as={"div"}>Prosjekter</MenuItem>
                </NextLink>
                <NextLink href="/" passHref>
                  <MenuItem as={"div"}>Lesestoff</MenuItem>
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
