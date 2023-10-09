import NextLink from "next/link";
import { Heading, Box, Image, Link, Badge } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface ImageProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  handleOnClick: () => void;
}

export const Title = ({ children }: Props) => {
  return (
    <Box mt={1}>
      <Box my={1}>
      <NextLink href={"/projects"}>
        <Link as="div">Prosjekter</Link>
      </NextLink>
      </Box>

      <span>
        <ChevronRightIcon />
      </span>
      <Heading display="inline-block" as="h3" fontSize={20} mb={4}>
        {children}
      </Heading>
    </Box>
  );
};

export const Picture = ({
  src,
  alt,
  size = "lg",
  handleOnClick,
}: ImageProps) => {
  return (
    <Image
      borderRadius="lg"
      w={size === "5xl" ? "300px" : "175px"}
      src={src}
      alt={alt}
      mb={4}
      onClick={handleOnClick}
    />
  );
};

export const Meta = ({ children }: Props) => {
  return (
    <Badge colorScheme="green" mr={2}>
      {children}
    </Badge>
  );
};
