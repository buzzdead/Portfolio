import { Dispatch } from "react"
import { Action, ErrorType } from "../hooks/gameReducer"
import { PlayerSummary } from "../../types"
import { CommonGame } from "./commongames"
const steam_default = require('../../../public/images/steam_default.webp')

interface Props {
    dispatch: Dispatch<Action>
    errorType: ErrorType
    steamId: string
    profileType: Partial<PlayerSummary>
    apiKey: string
}

const defaultProfile = {
    personaName: '',
    profileUrl: '',
    avatar: steam_default.default.src,
  }

const fetchProfile = async ({dispatch, errorType, steamId, profileType, apiKey}: Props) => {
    const fetchString = `/api/playersummaries?key=${apiKey}&steamids=${steamId}`
    try {
      const newProfile = await fetch(fetchString).then(res => res.json())
      if (newProfile?.steam?.personastate === 'Offline') {
        dispatch({
          type:
            errorType === 'left' ? 'SET_MY_PROFILE_ADD_ERRORTYPES' : 'SET_OPPONENT_PROFILE_ADD_ERRORTYPES',
          payload: {
            profile: defaultProfile,
            errorStates: {
              type: errorType,
              message: 'problem with steamid og api key'
            }
          }
        })
      } else if (newProfile.personaName !== profileType.personaName) {
        dispatch({
          type:
            errorType === 'left' ? 'SET_MY_PROFILE_REMOVE_ERRORTYPES' : 'SET_OPPONENT_PROFILE_REMOVE_ERRORTYPES',
          payload: { profile: newProfile, errorStates: ['invalid', errorType] }
        })
      }
    } catch (error) {
      dispatch({
        type: errorType === 'left' ? 'SET_MY_PROFILE_ADD_ERRORTYPES' : 'SET_OPPONENT_PROFILE_ADD_ERRORTYPES',
        payload: {
          profile: defaultProfile,
          errorStates: {
            type: 'invalid',
            message: 'problem with steamid og api key'
          }
        }
      })
    }
    dispatch({ type: 'SET_COMMON_GAMES', payload: [] })
  }
 

  const fetchGamesInCommon = async (dispatch: Dispatch<Action>, mySteamId: string, opponentSteamId: string, skipAchievement: boolean, apiKey: string) => {
    const fetchAchievements = async (commonGames: CommonGame[], apiKey: string, mySteamId: string, opponentSteamId: string) => {
        const games = commonGames.map(
          async (game: CommonGame): Promise<CommonGame> => {
            const fetchMyProgress = `/api/achievements?key=${apiKey}&steamids=${mySteamId}&appid=${game.appid}&ignoreFilter=1`
            const fetchOpponentProgress = `/api/achievements?key=${apiKey}&steamids=${opponentSteamId}&appid=${game.appid}&ignoreFilter=1`
            const myProgress = await fetch(fetchMyProgress).then(res => res.json())
            const opponentProgress = await fetch(fetchOpponentProgress).then(res =>
              res.json()
            )
            return {
              name: game.name,
              myProgress: myProgress,
              opponentProgress: opponentProgress
            }
          }
        )
        return games
      }
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const myGames = await fetch(
        `/api/ownedgames?key=${apiKey}&steamids=${mySteamId}&ignoreFilter=1`
      ).then(res => res.json())
      const opponentGames = await fetch(
        `/api/ownedgames?key=${apiKey}&steamids=${opponentSteamId}&ignoreFilter=1`
      ).then(res => res.json())

      const commonGames =
        mySteamId === opponentSteamId
          ? myGames
          : myGames.filter((game: any) =>
              opponentGames.some(
                (opponentsGame: any) => opponentsGame.appid === game.appid
              )
            )

      const extendedGamesPromises = skipAchievement
        ? commonGames
        : await fetchAchievements(commonGames, apiKey, mySteamId, opponentSteamId)

      const extendedGames = await Promise.all(extendedGamesPromises)
      dispatch({ type: 'SET_COMMON_GAMES', payload: extendedGames })
    } catch (error) {
      dispatch({
        type: 'ADD_ERRORSTATE',
        payload: { type: 'invalid', message: 'Something went wrong' }
      })
      // Handle the error gracefully, e.g., display a message to the user
    }
    dispatch({ type: 'SET_LOADING', payload: false })
  }
const fetcher = { fetchProfile, fetchGamesInCommon }

export default fetcher
