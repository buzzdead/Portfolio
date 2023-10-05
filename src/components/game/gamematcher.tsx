import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Input,
  useColorModeValue,
  useMediaQuery
} from '@chakra-ui/react'
import PlayerCard from './playercard'
import { useReducer } from 'react'
import { PlayerSummary } from '../../types'
import { InfoApi } from './infoapi'
import { playerCardStyle } from './gameStyle'
import { CommonGames } from './commongames'
import { initialState, gameReducer, ErrorState } from '../hooks/gameReducer'
import fetcher from './gameFetcher'
const steam_default = require('../../../public/images/steam_default.webp')

interface Props {
  playerSummary: PlayerSummary
}

export const GameMatcher = ({ playerSummary }: Props) => {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState(playerSummary, steam_default.default.src)
  )
  const apiKey =
    state.customApi === ''
      ? process.env.NEXT_PUBLIC_STEAM_API_KEY || ''
      : state.customApi
  const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)')

  const renderPlayerProfile = (
    type: 'left' | 'right',
    steamId: string,
    profile: Partial<PlayerSummary>
  ) => {
    return (
      <Box {...playerCardStyle}>
        <PlayerCard playerSummary={profile} />
        <Input
          onChange={e =>
            dispatch({
              type:
                type === 'left' ? 'SET_MY_STEAM_ID' : 'SET_OPPONENT_STEAM_ID',
              payload: e.target.value
            })
          }
          value={steamId}
          width={185}
        />
        <Button
          bgColor="red"
          size="lg"
          onClick={() =>
            fetcher.fetchProfile({
              dispatch,
              errorType: type,
              steamId,
              profileType: profile,
              apiKey
            })
          }
        >
          Fetch
        </Button>
      </Box>
    )
  }

  return (
    <Flex flexDir={'column'} pb={10}>
      <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
        (Må være venn på steam eller åpen profil. Legg meg til eller test med
        egen API her:)
        <Flex flexDir="row" alignItems={'center'}>
          <FormLabel style={{ paddingTop: 5, color: 'green' }}>
            Steam API nøkkel
          </FormLabel>
          <InfoApi />
        </Flex>
        <Input
          borderColor={useColorModeValue('black', 'white')}
          value={state.customApi}
          onChange={e =>
            dispatch({ type: 'SET_CUSTOM_API', payload: e.target.value })
          }
          width={{ base: 'sm', md: 'md' }}
        ></Input>
      </Flex>
      <Flex justifyContent={'space-between'}>
        {renderPlayerProfile('left', state.mySteamId, state.myProfile)}
        <CommonGames
          commonGames={state.commonGames}
          shouldRender={isLargerThan1000}
          type="big"
        />
        {renderPlayerProfile(
          'right',
          state.opponentSteamId,
          state.opponentProfile
        )}
      </Flex>

      <Flex justifyContent={'center'}>
        {state.commonGames.length === 0 &&
          state.opponentProfile.personaName !== '' &&
          state.errorState.length === 0 && (
            <Flex flexDir={'column'} justifyContent={'center'} gap={1}>
              <Flex flexDir={'row'} justifyContent={'center'} gap={2}>
                <FormLabel p={0} m={0}>
                  Skip achievements
                </FormLabel>
                <Checkbox
                  size={'lg'}
                  defaultChecked={state.skipAchievement}
                  checked={state.skipAchievement}
                  onChange={() =>
                    dispatch({
                      type: 'SET_SKIP_ACHIEVEMENT',
                      payload: !state.skipAchievement
                    })
                  }
                />
              </Flex>
              <Button
                isLoading={state.loading}
                onClick={() =>
                  fetcher.fetchGamesInCommon(
                    dispatch,
                    state.mySteamId,
                    state.opponentSteamId,
                    state.skipAchievement,
                    apiKey
                  )
                }
                bgColor="green"
                width={200}
              >
                GO
              </Button>
            </Flex>
          )}
        {state.errorState.length > 0 && (
          <Flex flexDir={'column'}>
            {' '}
            {state.errorState.map((es: ErrorState, id: number) => (
              <Box key={id}>
                {es.type} {es.type !== 'invalid' && 'profile'}: {es.message}
              </Box>
            ))}{' '}
          </Flex>
        )}
      </Flex>
      <CommonGames
        commonGames={state.commonGames}
        shouldRender={!isLargerThan1000}
        type="small"
      />
    </Flex>
  )
}
