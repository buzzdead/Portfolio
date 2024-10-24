import { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AnimationActionLoopStyles } from 'three'
import { initialState, useThreeScene } from './threeprovider'
import { Umbrella } from '../weather'
import { easing } from 'maath'

type Tuple = [number, number, number]

interface Props {
  pageRef: string
  isStormy: boolean
  umbrellaRef: any
}

export function Dragon({ pageRef, isStormy, umbrellaRef }: Props) {
  const { state, setState } = useThreeScene()
  const isFlying = useRef(false)
  const umbrellaRef2 = useRef<any>()
  let yDivergence = 0
  const [oldPage, setOldPage] = useState('/')
  const ref = useRef<THREE.Mesh>(null)
  const [modelPosition, setModelPosition] = useState({
    pos: [0, 0, 0],
    scale: [1,1,1]
  })
  const rotateTimeOut = useRef<NodeJS.Timeout>()
  const lastTouchX = useRef(0)
  const { scene, animations } = useGLTF('./young-red-dragon.glb')
  const flappingTimeout = useRef<NodeJS.Timeout>()
  scene.scale.set(0.4, 0.4, 0.4)
  scene.position.set(0, -0.75, 0)

  const { actions } = useAnimations(animations, ref)
  const onDoubleClick = () => {
    const fireballMeshes = scene.children.filter(child =>
      child.name.startsWith('Sphere')
    )
    fireballMeshes.forEach(mesh => {
      mesh.visible = true
    })
    playActionOnce('SpitFire', () => {
      hideFireballs()
      setState(initialState)
    })
  }

  const hideFireballs = () => {
    const fireballMeshes = scene.children.filter(child =>
      child.name.startsWith('Sphere')
    )
    fireballMeshes.forEach(mesh => {
      mesh.visible = false
    })
  }

  const playActionOnce = (actionName: string, callback: () => void) => {
    const action = actions[actionName]

    if (action && !action.isRunning()) {
      action.reset()
      action.setLoop(2200 as AnimationActionLoopStyles, 1)
      action.clampWhenFinished = true
      action.play()

      const onFinish = (e: any) => {
        if (e.action === action) {
          action.getMixer().removeEventListener('finished', onFinish)
          callback()
        }
      }

      action.getMixer().addEventListener('finished', onFinish)
    }
  }

  const rotateDragon = (event: any) => {
    let movementX = 0
    if (event.type === 'touchmove') {
      const touch = event.touches[0]
      const currentX = touch.clientX
      if (lastTouchX.current !== 0) {
        movementX = currentX - lastTouchX.current
      }

      lastTouchX.current = currentX

      clearTimeout(rotateTimeOut.current)
      rotateTimeOut.current = setTimeout(() => (lastTouchX.current = 0), 100)
    } else if (event.type === 'mousemove') {
      if (event.buttons !== 1) return
      movementX = event.movementX
    }

    const rotationSpeed = 0.0075
    scene.rotation.y += movementX * rotationSpeed
  }

  useEffect(() => {
    playActionOnce('wings', () => {
      createFlappingTimeout()
    })

    const handleMouseMove = (event: any) => rotateDragon(event)
    const handleTouchMove = (event: any) => rotateDragon(event)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    setModelPosition({ pos: [0, -2.5, -20], scale: [2, 2, 2] })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const createFlappingTimeout = () => {
    clearTimeout(flappingTimeout.current)
    flappingTimeout.current = setTimeout(() => startFlapping(), 10000)
  }

  const startFlapping = () => {
    if(actions["flying"] && !actions["flying"]?.paused)
    createFlappingTimeout()
  else{
    playActionOnce('wings', () => {
      createFlappingTimeout()
    })
  }
  }

  const updateThreeState = () => {
    if (state.hitName) return
    if(state.hitSteam) return
    if(state.hitAi) return
    if (state.hitProject.left && scene.rotation.y < -1) return
    if (state.hitProject.right && scene.rotation.y > -0.74) return
    if (pageRef === '/') setState({ ...state, hitName: true })
    if(pageRef === '/games') setState({...state, hitSteam: true})
    if(pageRef === '/aifun') setState({...state, hitAi: true})
    if (pageRef === '/projects')
      setState({
        ...state,
        hitProject: {
          left:
            (scene.rotation.y > -0.28 && scene.rotation.y <= 0) ||
            state.hitProject.left
              ? true
              : false,
          right:
            (scene.rotation.y > 0 && scene.rotation.y < 0.28) ||
            state.hitProject.right
              ? true
              : false
        }
      })
  }

  useFrame(() => {
    const scrollY = window.scrollY * 0.038 - 2.25 // Adjust the multiplier as needed
    if (isFlying.current && yDivergence < 0.66) {
      yDivergence += 0.025;
  } else if (!isFlying.current && yDivergence > 0) {
      yDivergence -= 0.025;
  }
  
  // Use yDivergence to set both z and y positions
  umbrellaRef2.current.position.y = -yDivergence;   // y position is proportional to yDivergence
  umbrellaRef2.current.position.z = yDivergence / 2.5;  // z position changes with yDivergence but at a smaller rate
  
    if(ref.current) {
      ref.current.position.y = scrollY
    }
    if (oldPage !== pageRef) {
      actions['wings']?.stop()
      isFlying.current = true
      //umbrellaRef.current.position.y -= 0.661
      playActionOnce('flying', () => {createFlappingTimeout(); isFlying.current = false})
      setOldPage(pageRef)
    }
    if (state.hitName || state.hitProject.left || state.hitProject.right) return
    if (
      actions['SpitFire'] &&
      actions['SpitFire'].time > 2 &&
      actions['SpitFire'].time < 4
    ) {
      updateThreeState()
    }
  })

  return (
    <mesh
      onClick={onDoubleClick}
      position={modelPosition.pos as Tuple}
      scale={1.5}
      rotation={[0, 0, 0]}
      ref={ref}
    >
      <primitive object={scene}>
        <mesh ref={umbrellaRef2}>
      <Umbrella isStormy={isStormy} ref={umbrellaRef} />
      </mesh>
      </primitive>
    </mesh>
  )
}
