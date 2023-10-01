import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Layout from "../components/layout/article";
import { Box, Container, Heading, Link, Tooltip } from "@chakra-ui/react";
import { PlayerSummary } from "./api/playersummaries";
import Section from "../components/section";
import PlayerCard from "../components/playercard";
import { RecentGameSummary } from "./api/recentgames";
import { Achivement } from "./api/achievements";

type Nullable<T> = T | null;


type GameAchievements = Record<number, Achivement>;

const Games = () => {
  const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY;
  const steamId = "76561198070961718";
  const [userData, setUserData] = useState<{
    playerSummary: Nullable<PlayerSummary>;
    recentGamesSummaries: Nullable<RecentGameSummary[]>;
  }>();
  const [achivements, setAchivements] = useState<Achivement[]>([])
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data } = useSWR(
    `/api/playersummaries?key=${apiKey}&steamids=${steamId}`,
    fetcher
  );

  const { data: recentGames } = useSWR(
    `/api/recentgames?key=${apiKey}&steamids=${steamId}`,
    fetcher
  );

  useEffect(() => {
    if(data || recentGames) setUserData({playerSummary: data, recentGamesSummaries: recentGames})
  }, [data, recentGames])

  useEffect(() => {
    if(!recentGames) return
    console.log(recentGames)
    const achievementsPromises = recentGames.map(async (game: { appid: any; }) => {
      const response = await fetch(`/api/achievements?appid=${game.appid}&key=${apiKey}&steamids=${steamId}`);
      return await response.json();
    });

    Promise.all(achievementsPromises)
      .then(achievementsData => {
        const achievementsMap: GameAchievements = [];
        achievementsData.forEach((data, index) => {
          achievementsMap[recentGames[index].appid] = data;
        });
        setAchivements(achievementsData[0]);
      });

  }, [userData?.recentGamesSummaries]);

  if (userData?.playerSummary)
    return (
      <Layout title="Spill">
        <Container maxW={"container.md"}>
          <Box
            mt={10}
            display={"flex"}
            alignItems={"center"}
            flexDir={"column"}
            gap={10}
          >
            <PlayerCard playerSummary={userData.playerSummary} />
            <Section>
              I tillegg til å programmere så spiller jeg dataspill når jeg får
              tid til det. Vært en ivrig "gamer" siden jeg var ung, vokste opp
              med diverse spill som blant annet counter-strike. I disse dager så
              går det ikke så mye tid til spilling, men ved programmering så får
              jeg jo muligheten til å vise frem hva jeg liker av spill. Under
              kommer min steam profil, hvis du ønsker kan du prøve å matche din
              spillhistorikk og se om det er noen spill vi begge har spilt.
            </Section>
            {userData.recentGamesSummaries && userData.recentGamesSummaries.length > 0 && <Heading fontSize={30}>Nylige spilte spill</Heading>}
            {userData.recentGamesSummaries && userData.recentGamesSummaries.map((rg) => (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                
                <Box display='flex' flexDir={'column'}>
                  <Box display='flex' flexDir={'row'} justifyContent={'center'} alignItems={'flex-end'} gap={2.5}>
                <Link href={`https://store.steampowered.com/app/${rg.appid}`} target='_blank' fontSize={20} key={rg.name} color='red'>{rg.name}</Link>
                <img
                width={25}
                  src={`http://media.steampowered.com/steamcommunity/public/images/apps/${rg.appid}/${rg.img_icon_url}.jpg`}
                />
                </Box>
                <p>Spilletid siste to ukene: {Math.floor(rg.playtime_2weeks / 60)} timer og {rg.playtime_2weeks % 60} minutter</p>
                <p>Siste achievements: </p>
                <Box display={'flex'} flexDir={'row'} flexWrap={'wrap'} gap={1} alignSelf={'center'}>
                  {achivements.map(e => <Tooltip label={`${e.displayName} - Unlocked: ${new Date(e.unlocktime * 1000).toDateString()}`}><img width={35} src={e.icon}/></Tooltip>)}
                </Box>
                </Box>
                
              </div>
            ))}
          </Box>
        </Container>
      </Layout>
    );
  return <div>Loading...</div>;
};

export default Games;
export { getServerSideProps } from "../components/chakra";
