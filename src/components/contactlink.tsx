import { IconType } from "react-icons";
import styled from "@emotion/styled";
import { Box, LinkProps, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const StyledLink = styled.a<any>`
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
  color?: string
  iconSize?: number
}

const ContactLink = ({ title, href, icon: Icon, size = 20, iconSize=35, color='inherit' }: Props) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      const scrolledToBottom = scrollY + windowHeight >= documentHeight;

      if (scrolledToBottom) {
        setShouldAnimate(true);
        localStorage.setItem("animationTriggered", "true");
      }
    };
    

    const animationTriggered = localStorage.getItem("animationTriggered");

    if (animationTriggered !== "true") {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <StyledLink className="hover:underline-offset-4 hover:underline" href={href}  isExternal target="_blank"  
> 
      <Box css={{
      "@keyframes pulse": {
        from: {
          transform: "scale(1)",
        },
        to: {
          transform: "scale(1.2)",
        },
      },
      animation: shouldAnimate ? "pulse 0.5s ease" : 'none',
      animationIterationCount: 2,
    }}>
      <Icon className="hover:scale-125 duration-500 ease-out"  color={color} size={iconSize} />
    </Box>
      
      <Text color={color} fontSize={size}>{title}</Text>
    </StyledLink>
  );
};

export default ContactLink;
