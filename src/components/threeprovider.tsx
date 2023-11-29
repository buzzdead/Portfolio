// threeSceneContext.js
import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

interface State {
    hitName: boolean
    hitProject: {left: boolean, right: boolean}
}

export const initialState: State = {
    hitName: false,
    hitProject: {left: false, right: false}
  };

  const ThreeSceneContext = createContext<{
    state: State;
    setState: React.Dispatch<React.SetStateAction<State>>;
  }>({
    state: initialState,
    setState: () => {} // empty function for now
  });
interface Props {
    children: React.ReactNode
}

// Create a Provider Component
export const ThreeSceneProvider = ({ children }: Props) => {
    const [state, setState] = useState(initialState);
  
    return (
      <ThreeSceneContext.Provider value={{ state, setState }}>
        {children}
      </ThreeSceneContext.Provider>
    );
  };

// Create a hook for easy consumption of the context
export const useThreeScene = () => useContext(ThreeSceneContext);
