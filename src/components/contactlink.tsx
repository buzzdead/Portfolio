import { IconType } from "react-icons";
import styled from "@emotion/styled";
import { LinkProps, Text } from "@chakra-ui/react";

const StyledLink = styled.a<LinkProps>`
  text-decoration: none;
  gap: 2px;
  color: inherit;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

interface Props {
  title: string;
  href: string;
  icon: IconType;
  size?: number
  iconSize?: number
}

const ContactLink = ({ title, href, icon: Icon, size = 20, iconSize=35 }: Props) => {
  return (
    <StyledLink href={href} isExternal target="_blank">
      <Icon size={iconSize} />
      <Text fontSize={size}>{title}</Text>
    </StyledLink>
  );
};

export default ContactLink;
