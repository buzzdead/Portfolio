import { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AnimationActionLoopStyles } from 'three'
import { initialState, useThreeScene } from './threeprovider'

type Tuple = [number, number, number]

interface Props {
  pageRef: string
}

export function Dragon({pageRef}: Props) {
  const { state, setState } = useThreeScene();

  let oldPage = '/'
  const ref = useRef<THREE.Mesh>(null)
  const [modelPosition, setModelPosition] = useState({
    pos: [0, 0, 0],
    scale: [0, 0, 0]
  })
  const lastTouchX = useRef(0)
  const { scene, animations } = useGLTF('./young-red-dragon.glb')
  scene.scale.set(0.5, 0.5, 0.5)

  const { actions } = useAnimations(animations, ref)
  const onDoubleClick = () => {
    const fireballMeshes = scene.children.filter(child => child.name.startsWith('Sphere'));
    fireballMeshes.forEach(mesh => {
      mesh.visible = true; // or scene.remove(mesh) to remove them from the scene
    });
    playActionOnce('SpitFire', () => {
      hideFireballs();
      setState(initialState)
    });
  }

  const hideFireballs = () => {
    // Assuming the fireballs are part of your dragon model and have a known name
    const fireballMeshes = scene.children.filter(child => child.name.startsWith('Sphere'));
    fireballMeshes.forEach(mesh => {
      mesh.visible = false; // or scene.remove(mesh) to remove them from the scene
    });
  };

  const playActionOnce = (actionName: string, callback: () => void) => {
    const action = actions[actionName];

    if (action && !action.isRunning()) {
      action.reset();
      action.setLoop(2200 as AnimationActionLoopStyles, 1);
      action.clampWhenFinished = true;
      action.play();

      const onFinish = (e: any) => {
        if (e.action === action) {
          action.getMixer().removeEventListener('finished', onFinish);
          callback();
        }
      };

      action.getMixer().addEventListener('finished', onFinish);
    }
  };

  const rotateDragon = (event: any) => {
    
    let movementX = 0
    if (event.type === 'touchmove') {
      const touch = event.touches[0]

      movementX = touch.clientX - lastTouchX.current
      lastTouchX.current = touch.clientX
    } else if (event.type === 'mousemove') {
      if (event.buttons !== 1) return
      console.log(scene.rotation.y)
      movementX = event.movementX
    }

    const rotationSpeed = 0.005
    scene.rotation.y += movementX * rotationSpeed
  }

  useEffect(() => {
    window.addEventListener('mousemove', rotateDragon)
    window.addEventListener('touchmove', rotateDragon)
    const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize()
    setModelPosition({ pos: biplanePosition, scale: biplaneScale })
  }, [])

  const startFlapping = () => {
    playActionOnce('wings', () => {
      setTimeout(startFlapping, 10000); // Continue the loop after a 5000ms delay
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(startFlapping, 5000);
    return () => clearTimeout(timeoutId); // Clean up the timeout if the component unmounts
  }, []);
  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition

    screenPosition = [0, -2.5, -10]
    screenScale = [1.5, 1.5, 1.5]

    return [screenScale, screenPosition]
  }

  const updateThreeState = () => {
    if(state.hitName) return
    if(state.hitProject.left && scene.rotation.y < -1) return
    if(state.hitProject.right && scene.rotation.y > -0.74) return 
    if(pageRef === "/") setState({...state, hitName: true})
    if(pageRef === "/projects") setState({...state, hitProject: {left: (scene.rotation.y < -1 && scene.rotation.y  > -1.2) || state.hitProject.left ? true : false, right: (scene.rotation.y > -0.96 && scene.rotation.y < -0.74) || state.hitProject.right ? true : false}})
  }

  useFrame(() => {
    if(oldPage !== pageRef) {
      playActionOnce('flying', () => console.log(pageRef));
      oldPage = pageRef
    }
    if(actions["SpitFire"] && actions["SpitFire"].time > 2 && actions["SpitFire"].time < 4){updateThreeState()}
  })

  return (
    <mesh
      onClick={onDoubleClick}
      position={modelPosition.pos as Tuple}
      scale={modelPosition.scale as Tuple}
      rotation={[0, 1, 0]}
      ref={ref}
    >
      <primitive object={scene} />
    </mesh>
  )
}
