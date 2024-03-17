import React, {
  createContext,
  useState,
  useContext
} from 'react'

type Modes = 'Solar' | 'std'

interface State {
  hitName: boolean
  hitSteam: boolean
  hitAi: boolean
  mode: Modes
  hitProject: { left: boolean; right: boolean }
}

export const initialState: State = {
  hitName: false,
  mode: 'std',
  hitSteam: false,
  hitAi: false,
  hitProject: { left: false, right: false }
}

const ThreeSceneContext = createContext<{
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
}>({
  state: initialState,
  setState: () => {}
})
interface Props {
  children: React.ReactNode
}

export const ThreeSceneProvider = ({ children }: Props) => {
  const [state, setState] = useState(initialState)

  return (
    <ThreeSceneContext.Provider value={{ state, setState }}>
      {children}
    </ThreeSceneContext.Provider>
  )
}

export const useThreeScene = () => useContext(ThreeSceneContext)
