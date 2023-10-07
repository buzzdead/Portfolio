import { Box, Card, useColorModeValue } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { CustomToolTip } from '../customtooltip'
import { GameCard } from './gamecard'
import { RecentGameSummary, Achivement } from '../../types'
import { motion } from 'framer-motion'
import Section from '../section'

interface Props {
  recentGamesSummaries: RecentGameSummary[]
  loading?: boolean
}

export const PlayerGames = ({ recentGamesSummaries, loading }: Props) => {
  const fetcher = (url: RequestInfo) => fetch(url).then(res => res.json())
  const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY
  const steamId = '76561198070961718'

  const achievements: { achievements: Achivement[]; appid: number }[] | null = loading ? null :
    recentGamesSummaries.map(game => {
      const appid = game?.appid
      return {
        achievements: useQuery(
          ['achievements', apiKey, steamId, appid],
          () =>
            fetcher(
              `/api/achievements?appid=${appid}&key=${apiKey}&steamids=${steamId}`
            ),
          {
            staleTime: 60000
          }
        ).data,
        appid: appid
      }
    })

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
                        exit={{ scale: 0.6, rotate: 210, opacity: '0.6', transitionDuration: id === 0 ? '190ms' : id === 1 ? '176ms' : `${Math.round(600 / (id * 1.75 ))}ms`}}
                      >
                        <CustomToolTip achievement={e} />
                      </motion.div>
                    </Box>
                    </Section>
                  ))
              : Array.from({ length: 10 }, (_, i) => (
                
                <Box key={i} position={'relative'} width={30} height={30}>
                  <motion.div
                variants={{enter: { opacity:'0.1', transitionDuration: i === 0 ? '190ms' : i === 1 ? '176ms' : `${Math.round(600 / (i * 1.75 ))}ms`}}}
              >
                  <Box
                    key={i}
                    width={30}
                    opacity={0.25}
                    pos={'absolute'}
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
