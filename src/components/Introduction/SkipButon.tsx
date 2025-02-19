import { Html, useScroll } from "@react-three/drei"

const SkipButton = () => {
    const api = useScroll()
    return (
      <Html position={[0.95, 0.95, 0]} transform>
        <button
          onClick={() => api.el.scrollTo(0, api.el.scrollHeight)}
          style={{ position: 'absolute', right: 20, top: 20 }}
        >
          Skip Intro
        </button>
      </Html>
    )
  }

  export default SkipButton