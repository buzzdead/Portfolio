import { Html, useScroll } from "@react-three/drei"

const SkipButton = () => {
    const api = useScroll()
    return (
      <Html position={[0, 0, 0]} transform>
        <button
          onClick={() => console.log("sd")}
        >
          Hopp over introduksjon
        </button>
      </Html>
    )
  }

  export default SkipButton