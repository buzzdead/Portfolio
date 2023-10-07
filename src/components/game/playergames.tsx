import { Box, Card, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useQuery, useQueryClient } from 'react-query'
import { CustomToolTip } from '../customtooltip'
import { GameCard } from './gamecard'
import { RecentGameSummary, Achivement } from '../../types'
import { motion } from 'framer-motion'
import Section from '../section'
import { useEffect } from 'react'

interface Props {
  recentGamesSummaries: RecentGameSummary[]
  loading?: boolean
}

export const PlayerGames = ({ recentGamesSummaries, loading }: Props) => {
  const fetcher = (url: RequestInfo) => fetch(url).then(res => res.json())
  const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY
  const steamId = '76561198070961718'

  const { colorMode } = useColorMode()

  const queryClient = useQueryClient()

  const {data: achievements, refetch} = useQuery<{achievements: Achivement[], appid: number}[]>(
    ['achievements', apiKey, steamId],
    async () => {
      const achievements = await Promise.all(
        recentGamesSummaries.map(async game => {
          const achievementsData = await queryClient.fetchQuery(['achievements', apiKey, steamId, game.appid], () => {
            return fetcher(`/api/achievements?appid=${game.appid}&key=${apiKey}&steamids=${steamId}`);
          });
          
          return {
            achievements: achievementsData,
            appid: game.appid
          };
        })
      );
      
      return achievements;
    },
    {
      staleTime: 60000
    }
  );
  
  useEffect(() => {
    if(achievements === undefined && recentGamesSummaries.length > 0) refetch()
    else if (recentGamesSummaries.length !== achievements?.length) {
      refetch();
    }
  }, [recentGamesSummaries]);
  

  const skeletonRecentGameSummary = [
    {
      appid: 12345,
      name: 'Game 1',
      playtime_2weeks: 123455,
      playtime_forever: 12345,
      img_icon_url: '----------------'
    },
    {
      appid: 12345,
      name: 'Game 2',
      playtime_2weeks: 123455,
      playtime_forever: 12345,
      img_icon_url: '123asdfasdf'
    },
    {
      appid: 12345,
      name: 'Game 3',
      playtime_2weeks: 123455,
      playtime_forever: 12345,
      img_icon_url: '123asdfasdf'
    },
    {
      appid: 12345,
      name: 'Game 4',
      playtime_2weeks: 123455,
      playtime_forever: 12345,
      img_icon_url: '123asdfasdf'
    }
  ]

  const renderRg = loading ? skeletonRecentGameSummary : recentGamesSummaries

  return (
    <Box
      display="flex"
      flexDir={'row'}
      gap={{ base: 2.5, md: 10 }}
      flexWrap={'wrap'}
      justifyContent={'center'}
    >
      {renderRg?.map((rg, rgId) => (
        <Card
          key={rgId}
          display="flex"
          flexDir={'column'}
          variant="unstyled"
          transitionDuration={'800ms'}
          borderRadius={'unset'}
          bg={useColorModeValue('inherit', 'inherit')}
          py={5}
          px={2}
          overflow="hidden"
        >
          <GameCard recentGame={rg} />
          <Box
            display={'flex'}
            flexDir={'row'}
            flexWrap={'wrap'}
            gap={0.5}
            alignSelf={'center'}
          >
            {achievements?.find(e => e?.appid === rg?.appid) &&
            Array.isArray(
              achievements?.find(e => e?.appid === rg?.appid)?.achievements
            )
              ? achievements
                  ?.find(e => e?.appid === rg?.appid)
                  ?.achievements?.map((e, id) => (
                    <Section key={id} mb={0} delay={id * 0.04}>
                      <Box height={30} width={30} position="relative">
                        <motion.div
                          exit={{
                            opacity: '0.125',
                            scale: 1.55,
                            transitionDuration: '200ms'
                          }}
                        >
                          <CustomToolTip achievement={e} />
                        </motion.div>
                      </Box>
                    </Section>
                  ))
              : Array.from({ length: 10 }, (_, i) => (
                  <Box key={i} position={'relative'} width={30} height={30}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: colorMode === 'dark' ? 0.04 : 0.1 }}
                      transition={{ duration: i / 10 }}
                    >
                      <Box
                        key={i}
                        width={30}
                        pos={'absolute'}
                        transitionDuration={'500ms'}
                        height={30}
                        border={'1px solid gold'}
                        bgColor={useColorModeValue('gray.500', 'gray.100')}
                      />
                    </motion.div>
                  </Box>
                ))}
          </Box>
        </Card>
      ))}
    </Box>
  )
}
