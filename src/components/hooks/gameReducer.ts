import { PlayerSummary, RecentGameSummary } from "../../types";
import { CommonGame } from "../game/commongames";

export type ErrorType = "left" | "right" | "invalid"
export type ErrorState = { type: ErrorType, message: string }

export interface State {
    mySteamId: string;
    opponentSteamId: string;
    loading: boolean;
    myProfile: Partial<PlayerSummary>;
    opponentProfile: Partial<PlayerSummary>
    skipAchievement: boolean
    commonGames: CommonGame[]
    errorState: ErrorState[]
    customApi: string

}

export const initialState = (playerSummary: any, avatar: string): State => {
    return {
        mySteamId: '76561198070961718',
        opponentSteamId: '',
        loading: false,
        myProfile: {
            personaName: playerSummary.personaName,
            profileUrl: playerSummary.profileUrl,
            avatar: playerSummary.avatar,
        },
        opponentProfile: {
            personaName: '',
            profileUrl: '',
            avatar: avatar,
        },
        skipAchievement: true,
        commonGames: [],
        errorState: [],
        customApi: '',
    }
};

export type Action =
    | { type: 'SET_MY_STEAM_ID', payload: State["mySteamId"] }
    | { type: 'SET_OPPONENT_STEAM_ID', payload: State["opponentSteamId"] }
    | { type: 'SET_MY_PROFILE', payload: { profile: State["myProfile"], errorStates: string[] | ErrorState } }
    | { type: 'SET_OPPONENT_PROFILE', payload: { profile: State["opponentProfile"], errorStates: string[] | ErrorState } }
    | { type: "SET_LOADING", payload: State["loading"] }
    | { type: "REMOVE_ERRORSTATES", payload: string[] }
    | { type: "ADD_ERRORSTATE", payload: ErrorState }
    | { type: "SET_CUSTOM_API", payload: string }
    | { type: "SET_SKIP_ACHIEVEMENT", payload: boolean }
    | { type: "SET_COMMON_GAMES", payload: State["commonGames"] }
    | { type: 'SET_MY_PROFILE_ADD_ERRORTYPES', payload: { profile: State["myProfile"], errorStates: ErrorState } }
    | { type: 'SET_MY_PROFILE_REMOVE_ERRORTYPES', payload: { profile: State["opponentProfile"], errorStates: string[] }}
    | { type: 'SET_OPPONENT_PROFILE_ADD_ERRORTYPES', payload: { profile: State["myProfile"], errorStates: ErrorState } }
    | { type: 'SET_OPPONENT_PROFILE_REMOVE_ERRORTYPES', payload: { profile: State["opponentProfile"], errorStates: string[] };
    };


export const gameReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_MY_STEAM_ID':
            return { ...state, mySteamId: action.payload };
        case 'SET_OPPONENT_STEAM_ID':
            return { ...state, opponentSteamId: action.payload };
        case 'SET_MY_PROFILE_ADD_ERRORTYPES':
            const errorStateAdd = state.errorState.find((e: ErrorState) => e.type === action.payload.errorStates.type)
                ? state.errorState
                : [...state.errorState, action.payload.errorStates];
            return { ...state, myProfile: action.payload.profile, errorState: errorStateAdd };
        case 'SET_MY_PROFILE_REMOVE_ERRORTYPES':
            return { ...state, myProfile: action.payload.profile, errorState: state.errorState.filter((es: ErrorState) => !action.payload.errorStates.includes(es.type)) }
        case 'SET_OPPONENT_PROFILE_ADD_ERRORTYPES':
            const errorStateAdd2 = state.errorState.find((e: ErrorState) => e.type === action.payload.errorStates.type)
                ? state.errorState
                : [...state.errorState, action.payload.errorStates];
            return { ...state, opponentProfile: action.payload.profile, errorState: errorStateAdd2 };
        case 'SET_OPPONENT_PROFILE_REMOVE_ERRORTYPES':
            return { ...state, opponentProfile: action.payload.profile, errorState: state.errorState.filter((es: ErrorState) => !action.payload.errorStates.includes(es.type)) }
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case "REMOVE_ERRORSTATES":
            return { ...state, errorState: state.errorState.filter((es: ErrorState) => action.payload.forEach(s => es.type !== s)) }
        case "ADD_ERRORSTATE":
            return state.errorState.find((e: ErrorState) => e.type === action.payload.type) ? state : { ...state, errorState: [...state.errorState, action.payload] }
        case "SET_CUSTOM_API":
            return { ...state, customApi: action.payload }
        case "SET_SKIP_ACHIEVEMENT":
            return { ...state, skipAchievement: action.payload }
        case "SET_COMMON_GAMES":
            return { ...state, commonGames: action.payload }
        default: {
            return state
        }
    }
};