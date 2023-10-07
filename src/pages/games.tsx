import React from "react";
import Layout from "../components/layout/article";
import {
  Box,
  Container,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import Section from "../components/section";
import PlayerCard from "../components/game/playercard";
import { PlayerGames } from "../components/game/playergames";
import { useCustomQuery } from "../components/hooks/useCustomQuery";
import { GameMatcher } from "../components/game/gamematcher";

const defaultProfile = {
  personaName: '',
  profileUrl: '',
  avatar: '',
}

const Games = () => {
  const { data: recentGames, isLoading: isLoadingRecentGames, isError: isErrorRecentGames  } = useCustomQuery('recentGames')
  const { data: playerSummary, isLoading: isLoadingPlayerSummary, isError: isErrorPlayerSummary  } = useCustomQuery('playerSummary')
  const { data: ownedGames, isLoading: isLoadingOwnedGames, isError: isErrorOwnedGames  } = useCustomQuery('ownedGames')
    return (
      <Layout title="Spill">
        <Container maxW={"container.md"}>
          <Box
            mt={10}
            display={"flex"}
            alignItems={"center"}
            flexDir={"column"}
            gap={5}
          >
              <Box maxWidth={200}>
                <PlayerCard playerSummary={isLoadingPlayerSummary ? defaultProfile : playerSummary} player/>
              </Box>
            <Section delay={0.1}>
              I tillegg til å programmere så spiller jeg dataspill når jeg får
              tid til det. Vært en ivrig "gamer" siden jeg var ung, vokste opp
              med diverse spill som blant annet counter-strike. I disse dager så
              går det ikke så mye tid til spilling, men ved programmering så får
              jeg jo muligheten til å vise frem hva jeg liker av spill. Under
              kommer min steam profil, hvis du ønsker kan du prøve å matche din
              spillhistorikk og se om det er noen spill vi begge har spilt.
            </Section>
                  <Heading variant='section-title' fontFamily="Fira Sans Condensed" display={'flex'} justifyContent={'center'} mb={10} fontSize={22}>
                    Nylige spilte spill
                  </Heading>
              <Box
                display="flex"
                flexDir={"row"}
                gap={{base: 2.5, md: 10}}
                flexWrap={"wrap"}
                justifyContent={"center"}
              >
                {<PlayerGames loading={isLoadingOwnedGames || isLoadingRecentGames} recentGamesSummaries={isLoadingOwnedGames || isLoadingRecentGames ? [] : recentGames.concat(ownedGames)} />}
              </Box>
          </Box>
        </Container>
        <Heading variant='section-title' display={'flex'} justifyContent={'center'}>
                  Spill matcher
        </Heading>
        
        <GameMatcher playerSummary={isLoadingPlayerSummary ? defaultProfile : playerSummary}/>
      </Layout>
    )
  return <Box width='100vw' height='100vh'><Spinner pos='absolute' left='50%' top='50%' size='xl' /></Box>
};

export default Games;
export { getServerSideProps } from "../components/chakra";
