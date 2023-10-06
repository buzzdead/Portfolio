import { Box, Card, Spinner, useColorModeValue } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { CustomToolTip } from '../customtooltip'
import { GameCard } from './gamecard'
import { RecentGameSummary, Achivement } from '../../types'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Props {
  recentGamesSummaries: RecentGameSummary[]
}

export const PlayerGames = ({ recentGamesSummaries }: Props) => {
  const fetcher = (url: RequestInfo) => fetch(url).then(res => res.json())
  const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY
  const steamId = '76561198070961718'
  /* const [achi, setAchi] = useState<{ achievements: Achivement[]; appid: number }[]>([]) */

  const achievements: { achievements: Achivement[]; appid: number }[] =
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

    /* const setAchies = async () => {
      const achis = recentGamesSummaries.map(async game => {  return {achievements: await fetcher(`/api/achievements?appid=${game.appid}&key=${apiKey}&steamids=${steamId}`), appid: game.appid } })
      const abc = await Promise.all(achis)
      setAchi(abc)
    }

    useEffect(() => {
      setTimeout(() => setAchies(), 700)
    }, []) */
  return (
    <Box
      display="flex"
      flexDir={'row'}
      gap={{ base: 2.5, md: 10 }}
      flexWrap={'wrap'}
      justifyContent={'center'}
    >
      {recentGamesSummaries?.map((rg, id) => (
        <Card
          key={id}
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
                  ?.achievements?.map(e => (
                    <Box
                      height={30}
                      width={30}
                      position="relative"
                      key={e.name}
                    >
                      <motion.div
                        key={e.name}
                        variants={{enter: {scale: 1, transitionDuration: '200ms'}}}
                        initial={{ scale: 0, height: 0}}
                        exit={{ opacity: 0, scale: 0.2, transitionDuration: '150ms'}}
                      >
                        <CustomToolTip achievement={e} />
                      </motion.div>
                    </Box>
                  ))
              : Array.from({ length: 10 }, (_, i) => (
                
                <Box position={'relative'} width={30} height={30}>
                  <motion.div
                key={i}
                variants={{enter: { opacity: 0.1, transitionDuration: '100ms'}}}
              >
                  <Box
                    key={i}
                    width={30}
                    opacity={1}
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
