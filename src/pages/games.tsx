import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Layout from "../components/layout/article";
import { Box, Container, Heading, Link, Tooltip, Image } from "@chakra-ui/react";
import { PlayerSummary } from "./api/playersummaries";
import Section from "../components/section";
import PlayerCard from "../components/playercard";
import { RecentGameSummary } from "./api/recentgames";
import { Achivement } from "./api/achievements";

type Nullable<T> = T | undefined;

const Games = () => {
  const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY;
  const steamId = "76561198070961718";
  const [userData, setUserData] = useState<{
    playerSummary: Nullable<PlayerSummary>;
    recentGamesSummaries: Nullable<RecentGameSummary[]>;
  }>();
  const [achievements, setAchievements] = useState<{achievements: Achivement[], appid: number}[]>([])
  // fikse achivements, må jo være for hvert game (potensielt mer enn 1 game...)
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
    if(!recentGames) return;
  
    const fetchAchievements = async () => {
      const abc = await Promise.all(recentGames.map(async (game: { appid: any; }) => {
        const response = await fetch(`/api/achievements?appid=${game.appid}&key=${apiKey}&steamids=${steamId}`);
        const res = await response.json();
        const newAchievement = { achievements: res, appid: game.appid };
        return newAchievement;
      }));
  
      setAchievements(prevState => [...prevState, ...abc]); // Using the functional form of setState
    }
  
    fetchAchievements();
  
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
            <Box maxWidth={200}>
            <PlayerCard playerSummary={userData.playerSummary} />
            </Box>
            <Section delay={0.2}>
              I tillegg til å programmere så spiller jeg dataspill når jeg får
              tid til det. Vært en ivrig "gamer" siden jeg var ung, vokste opp
              med diverse spill som blant annet counter-strike. I disse dager så
              går det ikke så mye tid til spilling, men ved programmering så får
              jeg jo muligheten til å vise frem hva jeg liker av spill. Under
              kommer min steam profil, hvis du ønsker kan du prøve å matche din
              spillhistorikk og se om det er noen spill vi begge har spilt.
            </Section>
            
            {userData.recentGamesSummaries && userData.recentGamesSummaries.length > 0 && <Heading fontFamily="Fira Sans Condensed" fontSize={26}>Nylige spilte spill</Heading>}
            <Box display='flex' flexDir={'row'} gap={10} flexWrap={'wrap'} justifyContent={'center'}>
            {userData.recentGamesSummaries && userData.recentGamesSummaries.map((rg) => (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                
                <Box display='flex' flexDir={'column'}>
                  <Box display='flex' flexDir={'row'} justifyContent={'center'} alignItems={'flex-end'} gap={2.5}>
                <Link href={`https://store.steampowered.com/app/${rg.appid}`} target='_blank' fontSize={20} fontFamily="Fira Sans Condensed" fontWeight={600} key={rg.name} color='red'>{rg.name}</Link>
                <Image
                loading='eager'
                width={25}
                  src={`http://media.steampowered.com/steamcommunity/public/images/apps/${rg.appid}/${rg.img_icon_url}.jpg`}
                />
                </Box>
                <Box display='flex' flexDir={'row'}><p style={{fontFamily: "Fira Sans"}}>Spilletid siste to ukene:</p>&nbsp;<p style={{fontWeight: 500, fontFamily: "Fira Sans"}}>{Math.floor(rg.playtime_2weeks / 60)} timer og {rg.playtime_2weeks % 60} minutter</p></Box>
                <p style={{marginTop: 5, display: 'flex', justifyContent: 'center', fontWeight: 600, fontFamily: "Fira Sans Condensed"}}>Prestasjoner</p>
                <Box display={'flex'} flexDir={'row'} flexWrap={'wrap'} gap={0.5} alignSelf={'center'}>
                  {achievements?.find(e => e.appid === rg.appid)?.achievements.map(e => <Tooltip label={<div style={{display: 'flex', flexDirection: 'column'}}><p>{e.displayName}</p> <p>Unlocked: {new Date(e.unlocktime * 1000).toDateString()}</p><p>{e.description}</p></div>}><img width={30} src={e.icon}/></Tooltip>)}
                </Box>
                </Box>
                
              </div>
            ))}
            </Box>
          </Box>
        </Container>
      </Layout>
    );
  return <div>Loading...</div>;
};

export default Games;
export { getServerSideProps } from "../components/chakra";
