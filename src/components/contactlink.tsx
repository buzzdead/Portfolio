import { IconType } from "react-icons";
import styled from "@emotion/styled";
import { LinkProps } from "@chakra-ui/react";

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
}

const ContactLink = ({ title, href, icon: Icon }: Props) => {
  return (
    <StyledLink href={href} isExternal target="_blank">
      <Icon size={35} />
      {title}
    </StyledLink>
  );
};

export default ContactLink;
