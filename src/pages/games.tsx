import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Layout from "../components/layout/article";
import {
  Box,
  Container,
} from "@chakra-ui/react";
import { PlayerSummary } from "./api/playersummaries";
import Section from "../components/section";
import PlayerCard from "../components/playercard";

const Games = () => {
  const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY;
  const steamId = "76561198070961718";
  const [userData, setUserData] = useState<PlayerSummary>();
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data } = useSWR(
    `/api/playersummaries?key=${apiKey}&steamids=${steamId}`,
    fetcher
  );

  useEffect(() => {
    if (data) setUserData(data);
  }, [data]);

  if (userData)
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
            <PlayerCard playerSummary={userData} />
            <Section>
              I tillegg til å programmere så spiller jeg dataspill når jeg får
              tid til det. Vært en ivrig "gamer" siden jeg var ung, vokste opp
              med diverse spill som blant annet counter-strike. I disse dager så
              går det ikke så mye tid til spilling, men ved programmering så får
              jeg jo muligheten til å vise frem hva jeg liker av spill. Under
              kommer min steam profil, hvis du ønsker kan du prøve å matche din
              spillhistorikk og se om det er noen spill vi begge har spilt.
            </Section>
          </Box>
        </Container>
      </Layout>
    );
  return <div>Loading...</div>;
};

export default Games;
export { getServerSideProps } from "../components/chakra";
