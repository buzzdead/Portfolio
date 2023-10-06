import {
  Box,
  Link,
} from "@chakra-ui/react";
import Section from "../section";

interface Props {
  recentGame: {
    name: string;
    img_icon_url: string;
    playtime_2weeks: number;
    appid: number;
  };
}

export const GameCard = ({ recentGame }: Props) => {
  const { name, img_icon_url, playtime_2weeks, appid } = recentGame;
  return (
    <>
      <Box
        display="flex"
        flexDir={"row"}
        justifyContent={"center"}
        alignItems={"flex-end"}
        gap={2.5}
      >
        <Section mb={0} delay={0.1}>
        <Link
          href={`https://store.steampowered.com/app/${appid}`}
          target="_blank"
          fontSize={20}
          fontFamily="Fira Sans Condensed"
          fontWeight={900}
          letterSpacing={0.5}
          key={name}
          color="red.600"
        >
          {name}
        </Link>
        </Section>
        
      </Box>
      <Box display="flex" flexDir={"row"} mt={1} mb={2} justifyContent={"center"}>
        <p style={{ fontSize: 14, fontFamily: "Fira Sans" }}>
          Spilletid:
        </p>
        &nbsp;
        <p style={{ fontSize: 14, fontWeight: 500, fontFamily: "Fira Sans" }}>
          {playtime_2weeks ? 
          Math.floor(playtime_2weeks / 60) + " timer og " + (playtime_2weeks % 60) + " " + 
          "minutter"
          : 'Over to uker siden'
          }
        </p>
      </Box>
    </>
  );
};
