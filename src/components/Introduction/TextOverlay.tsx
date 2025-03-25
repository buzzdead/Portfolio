import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { motion, MotionStyle } from 'framer-motion'
import { CSSProperties, useRef, useState, useEffect } from 'react'
import { ArrowDown } from 'lucide-react'
import { Box } from '@chakra-ui/react'

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

// Animation for the clickable text
const pulseAnimation = {
  animate: {
    opacity: [0.7, 1, 0.7],
    transition: {
      repeat: Infinity,
      duration: 2
    }
  }
}

const TextOverlay = ({ setIntroduced }: Props) => {
  const scroll = useScroll()
  const [scrollPosition, setScrollPosition] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevSectionRef = useRef<number>(0)
  const [currentSection, setCurrentSection] = useState(0)
  
  useFrame(() => {
    setScrollPosition(scroll.offset)
    
    // Determine current section based on scroll position
    let newSection = 0
    if (scrollPosition > 0.75) {
      newSection = 3
    } else if (scrollPosition > 0.5) {
      newSection = 2
    } else if (scrollPosition > 0.25) {
      newSection = 1
    }
    
    if (newSection !== currentSection) {
      setCurrentSection(newSection)
    }
  })
  
  // Play sound effect when changing sections
  useEffect(() => {
    if (audioRef.current && prevSectionRef.current !== currentSection && audioRef.current.paused) {
      audioRef.current.volume = 0.2
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(err => {
        // Browser might block autoplay
        console.log("Audio play prevented:", err)
      })
      prevSectionRef.current = currentSection
    }
  }, [currentSection])

  const sections = [
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
              animate={{ y: [-7.5, 7.5, -7.5] }}
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
          whileHover={{ scale: 1.05 }}
          variants={pulseAnimation}
          animate="animate"
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
      top: '240vh',
      opacity: (scrollPosition: number) =>
        Math.max(0, (scrollPosition - 0.75) * 5)
    }
  ]

  return (
    <>
      <audio ref={audioRef} src="/soft-whoosh.mp3" preload="auto" />
      
      {sections.map((section, index) => (
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
      
      {/* Progress indicator */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 1000
      }}>
        {[0, 1, 2, 3].map((idx) => (
          <div 
            key={idx}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: currentSection === idx ? "purple" : "#444",
              transition: "all 0.3s ease"
            }}
          />
        ))}
      </div>
    </>
  )
}

export default TextOverlay