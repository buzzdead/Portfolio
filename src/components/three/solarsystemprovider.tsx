import React, { createContext, useState, useContext } from 'react'
import { Planet } from './solarsystem/celestialobject'

interface State {
  rotationSpeed: number
  paused: boolean
  planetName: string
  destinationName: string
  gridEnabled: boolean
  descriptionEnabled: boolean
  liftOff: boolean
}

export const initialState: State = {
  rotationSpeed: 0.0036,
  paused: false,
  planetName: '',
  destinationName: 'Mars',
  gridEnabled: false,
  descriptionEnabled: false,
  liftOff: false
}

const SolarSystemContext = createContext<{
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
}>({
  state: initialState,
  setState: () => {},
})
interface Props {
  children: React.ReactNode
}

export const SolarSystemProvider = ({ children }: Props) => {
  const [state, setState] = useState(initialState)

  return (
    <SolarSystemContext.Provider value={{ state, setState }}>
      {children}
    </SolarSystemContext.Provider>
  )
}

export const useSolarSystem = () => useContext(SolarSystemContext)

export const planets: Planet[] = [
  {
    name: 'Mercury',
    distanceFromSun: 4,
    daysAroundSun: 88,
    rocketAdjustment: {
      xFactor: 8,
      zFactor: 6,
      radiusFactor: 10
    }
  },
  {
    name: 'Venus',
    distanceFromSun: 7.2,
    daysAroundSun: 225,
    rocketAdjustment: {
      radiusFactor: 8,
      zFactor: 8,
      xFactor: 4
    }
  },
  {
    name: 'Earth',
    distanceFromSun: 10,
    daysAroundSun: 365,
    scale: 0.002,
    rocketAdjustment: {
      radiusFactor: 2.25,
      xFactor: 4,
      zFactor: 4
    },
    description: {
      population: '6 billion',
      populationType: 'Human',
      technologicalAdvancement: 'Type 1',
      age: '4.5 billion'
    }
  },
  {
    name: 'Mars',
    distanceFromSun: 15,
    daysAroundSun: 687,
    rocketAdjustment: {
      radiusFactor: 11,
      zFactor: 3,
      xFactor: 6
    }
  },
  {
    name: 'Jupiter',
    distanceFromSun: 52,
    daysAroundSun: 4380,
    scale: 0.4,
    rocketAdjustment: {
      radiusFactor: 4.5,
      xFactor: 4,
      zFactor: 4,
    }
  },
  {
    name: 'Saturn',
    distanceFromSun: 95,
    daysAroundSun: 10767,
    scale: 0.0008,
    rocketAdjustment: {
      xFactor: 1200,
      radiusFactor: 1500,
      zFactor: 6000
    }
  },
  {
    name: 'Uranus',
    distanceFromSun: 192,
    daysAroundSun: 30660,
    scale: 0.4,
    rocketAdjustment: {
      radiusFactor: 4.5,
      zFactor: 0.0006,
      xFactor: 4
    }
  },
  {
    name: 'Neptune',
    distanceFromSun: 301,
    daysAroundSun: 60152,
    rocketAdjustment: {
      radiusFactor: 16,
      zFactor: 6,
      xFactor: 1
    }
  }
]
