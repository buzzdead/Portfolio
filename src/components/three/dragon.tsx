import { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AnimationActionLoopStyles } from 'three'
import { initialState, useThreeScene } from './threeprovider'

type Tuple = [number, number, number]

interface Props {
  pageRef: string
}

export function Dragon({ pageRef }: Props) {
  const { state, setState } = useThreeScene()

  const [oldPage, setOldPage] = useState('/')
  const ref = useRef<THREE.Mesh>(null)
  const [modelPosition, setModelPosition] = useState({
    pos: [0, 0, 0],
    scale: [0, 0, 0]
  })
  const rotateTimeOut = useRef<NodeJS.Timeout>()
  const lastTouchX = useRef(0)
  const { scene, animations } = useGLTF('./young-red-dragon.glb')
  const flappingTimeout = useRef<NodeJS.Timeout>()
  scene.scale.set(0.5, 0.5, 0.5)

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
    })}
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
    if (oldPage !== pageRef) {
      actions['wings']?.stop()
      playActionOnce('flying', () => createFlappingTimeout())
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
      scale={modelPosition.scale as Tuple}
      rotation={[0, 0, 0]}
      ref={ref}
    >
      <primitive object={scene} />
    </mesh>
  )
}
