import { Box, Card, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { CustomToolTip } from '../customtooltip'
import { GameCard } from './gamecard'
import { RecentGameSummary, Achivement } from '../../types'
import { motion } from 'framer-motion'
import Section from '../section'
import { useState, useEffect } from 'react'

interface Props {
  recentGamesSummaries: RecentGameSummary[]
  loading?: boolean
}

export const PlayerGames = ({ recentGamesSummaries, loading }: Props) => {
  const fetcher = (url: RequestInfo) => fetch(url).then(res => res.json())
  const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY
  const steamId = '76561198070961718'

  const [achievements, setAchievements] = useState<{ achievements: Achivement[]; appid: number }[] | null>(null)
  const { colorMode } = useColorMode()

  useEffect(() => {
    const fetchAchievements = async () => {
      const data = await Promise.all(recentGamesSummaries.map(async game => {
        const appid = game?.appid;
        const achievementsData = await fetcher(`/api/achievements?appid=${appid}&key=${apiKey}&steamids=${steamId}`);
        return {
          achievements: achievementsData,
          appid: appid
        };
      }));
      setAchievements(data);
    };

    if (!loading) {
      fetchAchievements();
    }
  }, [recentGamesSummaries]);
  const skeletonRecentGameSummary = [
    {
      appid: 12345,
    name: "Game 1",
    playtime_2weeks: 123455,
    playtime_forever: 12345,
    img_icon_url: "----------------"
    },
    {
      
      appid: 12345,
    name: "Game 2",
    playtime_2weeks: 123455,
    playtime_forever: 12345,
    img_icon_url: "123asdfasdf",
    },
    {
      
      appid: 12345,
    name: "Game 3",
    playtime_2weeks: 123455,
    playtime_forever: 12345,
    img_icon_url: "123asdfasdf",
    },
    {
      
      appid: 12345,
    name: "Game 4",
    playtime_2weeks: 123455,
    playtime_forever: 12345,
    img_icon_url: "123asdfasdf",
    },
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
            Array.isArray(achievements?.find(e => e?.appid === rg?.appid)?.achievements)
              ? achievements
                  ?.find(e => e?.appid === rg?.appid)
                  ?.achievements?.map((e, id) => (
                    <Section key={id} mb={0} delay={id * 0.035}>
                    <Box
                      height={30}
                      width={30}
                      position="relative"
                    >
                      <motion.div
                        exit={{ scale: 0.6, rotate: 360, opacity: '0.6', transitionDuration: id === 0 ? '190ms' : id === 1 ? '176ms' : `${Math.round(600 / (id * 1.75 ))}ms`}}
                      >
                        <CustomToolTip achievement={e} />
                      </motion.div>
                    </Box>
                    </Section>
                  ))
              : Array.from({ length: 10 }, (_, i) => (
                
                <Box key={i} position={'relative'} width={30} height={30}>
                  <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity:colorMode === 'dark' ? 0.06 :0.1}}
                    transition={{duration: i / 7.5}}
              >
                  <Box
                    key={i}
                    width={30}
                    pos={'absolute'}
                    transitionDuration={'500ms'}
                    height={30}
                    border={'1px solid gold'}
                    bgColor={'gray'}
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
