import { Box, Card, useColorModeValue } from "@chakra-ui/react";
import { RecentGameSummary } from "../../pages/api/recentgames";
import { Achivement } from "../../pages/api/achievements";
import { useQuery } from "react-query";
import { CustomToolTip } from "../customtooltip";
import { GameCard } from "./gamecard";

interface Props {
  recentGamesSummaries: RecentGameSummary[];
}

export const PlayerGames = ({ recentGamesSummaries }: Props) => {
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY;
  const steamId = "76561198070961718";

  const achievements: { achievements: Achivement[]; appid: number }[] =
    recentGamesSummaries.map((game) => {
      const appid = game?.appid;
      return {
        achievements: useQuery(
          ["achievements", apiKey, steamId, appid],
          () =>
            fetcher(
              `/api/achievements?appid=${appid}&key=${apiKey}&steamids=${steamId}`
            ),
          {
            staleTime: 600000,
          }
        ).data,
        appid: appid,
      };
    });

  return (
    <Box
      display="flex"
      flexDir={"row"}
      gap={{ base: 2.5, md: 10 }}
      flexWrap={"wrap"}
      justifyContent={"center"}
    >
      {recentGamesSummaries?.map((rg, id) => (
        <Card
          key={id}
          display="flex"
          flexDir={"column"}
          variant="unstyled"
          transitionDuration={"800ms"}
          borderRadius={"unset"}
          bg={useColorModeValue("inherit", "inherit")}
          py={5}
          px={2}
          overflow="hidden"
        >
          <GameCard recentGame={rg} />
          <Box
            display={"flex"}
            flexDir={"row"}
            flexWrap={"wrap"}
            gap={0.5}
            alignSelf={"center"}
          >
            {achievements?.find((e) => e?.appid === rg?.appid)
              ? achievements
                  ?.find((e) => e?.appid === rg?.appid)
                  ?.achievements?.map((e) => (
                    <CustomToolTip key={e.name} achievement={e} />
                  ))
              : Array.from({ length: 10 }, (_, i) => (
                  <Box
                    key={i}
                    width={30}
                    height={30}
                    border={"1px solid gold"}
                    bgColor={"gray"}
                  />
                ))}
          </Box>
        </Card>
      ))}
    </Box>
  );
};
