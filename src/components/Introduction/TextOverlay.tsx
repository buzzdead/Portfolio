import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { motion, MotionStyle } from 'framer-motion'
import { CSSProperties, useState } from 'react'
import { ArrowDown } from 'lucide-react'

interface Props {
  setIntroduced: () => void
}

const calculateOpacity = (scrollPosition: number, viewportPosition: string, fadeRange = 0.25) => {
    // Convert viewport position to number (e.g., '100vh' -> 1, '175vh' -> 1.75)
    const position = parseFloat(viewportPosition) / 100
  
    // Calculate distance from viewport center
    const distanceFromCenter = Math.abs(position - scrollPosition)
    
    // Create smooth fade in/out
    return Math.max(0, Math.min(1, 1 - distanceFromCenter / fadeRange))
  }

const commonStyle: CSSProperties = {
    fontSize: 'clamp(2rem, 4vw, 4rem)', // Min 2rem, preferred 4vw, max 4rem
    marginTop: '20vh',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    padding: '0 1rem'
  }
  
  const arrowStyle: CSSProperties = {
    position: 'absolute',
    color: 'teal',
    textAlign: 'center',
    width: '100vw',
    fontSize: 'clamp(32px, 3vw, 64px)'
  }
  
  // For the animated text
  const animatedTextStyle: CSSProperties = {
    fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
    marginTop: '10vh',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  }

const sections = (setIntroduced: () => void) => {
  return [
    {
      content: (
        <>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              color: 'teal',
              ...commonStyle
            }}
          >
            Velkommen
          </motion.h1>
          <div style={{ position: 'absolute', top: '20.5vh' }}>
            <motion.p
              initial={{ y: 7.5 }}
              animate={{ y: [-7., 7.5, -7.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={animatedTextStyle}
            >
              <ArrowDown
                size={64}
                style={arrowStyle}
              />
            </motion.p>
          </div>
        </>
      ),
      top: '-30px',
      opacity: (scrollPosition: number) => 1 - scrollPosition * 2
    },
    {
      content: (
        <motion.h2
          style={{
            color: 'teal',
            ...commonStyle
          }}
        >
          Mitt navn er Sigmund Volden
        </motion.h2>
      ),
      top: '100vh',
      opacity: (scrollPosition: number) =>
        Math.max(0, scrollPosition * 2.5)
    },
    {
        content: (
            <motion.h2
              style={{
                color: 'teal',
                ...commonStyle,
                maxWidth: '80%', // or use specific value like '800px'
                margin: '0 auto',
                wordWrap: 'break-word'
              }}
            >
              Jeg er en programerer som liker å utvikle nettsider og spill
            </motion.h2>
          ),
      top: '175vh',
      opacity: (scrollPosition: number) =>
        Math.max(0, (scrollPosition - 0.5) * 5)
    },
    {
      content: (
        <motion.h2
          onClick={() => setIntroduced()}
          style={{
            ...commonStyle,
            color: 'purple',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Klikk for å gå videre til nettsiden
        </motion.h2>
      ),
      top: '225vh',
      opacity: (scrollPosition: number) =>
        Math.max(0, (scrollPosition - 0.75) * 5)
    }
  ]
}

const TextOverlay = ({ setIntroduced }: Props) => {
  const scroll = useScroll()
  const [scrollPosition, setScrollPosition] = useState(0)

  useFrame(() => {
    setScrollPosition(scroll.offset)
  })

  return (
    <>
      {sections(setIntroduced).map((section, index) => (
        <motion.div
          key={index}
          style={
            {
              position: 'absolute',
              top: section.top,
              left: '50%',
              color: '#fff',
              textAlign: 'center',
              width: '100vw',
              opacity: section.opacity(scrollPosition)
            } as MotionStyle
          }
        >
          {section.content}
        </motion.div>
      ))}
    </>
  )
}

export default TextOverlay
