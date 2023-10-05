import { Box } from '@chakra-ui/react'
import { commonGamesBig, commonGamesSmall } from './gameStyle'
import { RecentGameSummary } from '../../types';

export type CommonGame = Partial<RecentGameSummary> & {
  myProgress?: { achieved: number; total: number }
  opponentProgress?: { achieved: number; total: number }
}

interface Props {
  commonGames: CommonGame[]
  type: 'big' | 'small'
  shouldRender: Boolean
}

export const CommonGames = ({ commonGames, type, shouldRender }: Props) => {
  return shouldRender ? (
    type === 'big' ? (
      <Box pos="relative" alignItems={'center'} w="100%">
        <Box {...commonGamesBig}>
          {commonGames.map((e: any, id) => (
            <Box color={id % 2 === 0 ? 'red' : 'green'} p={2} key={id}>
              {e.myProgress?.achieved}/{e.myProgress?.total} {e.name}{' '}
              {e.opponentProgress?.achieved}/{e.opponentProgress?.total}
            </Box>
          ))}
        </Box>
      </Box>
    ) : (
      <Box {...commonGamesSmall}>
        {commonGames.map((e: any, id) => (
          <Box color={id % 2 === 0 ? 'red' : 'green'} p={2} key={id}>
            {e.myProgress?.achieved}/{e.myProgress?.total} {e.name}{' '}
            {e.opponentProgress?.achieved}/{e.opponentProgress?.total}
          </Box>
        ))}
      </Box>
    )
  ) : null
}
