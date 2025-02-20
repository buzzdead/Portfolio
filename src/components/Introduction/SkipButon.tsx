import { Html, useScroll } from "@react-three/drei"

const SkipButton = () => {
    const api = useScroll()
    return (
      <Html position={[-5, 3, 0]} transform>
        <button
          onClick={() => console.log("sd")}
          style={{ position: 'absolute', right: 0, top: 0 }}
        >
          Skip Intro
        </button>
      </Html>
    )
  }

  export default SkipButton