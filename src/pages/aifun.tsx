  import React, { useEffect, useState } from 'react'
  import WebcamCapture from '../components/webcam'
  import {
    Flex,
    Heading,
    useColorModeValue} from '@chakra-ui/react'
  import { VoiceTypes, voices } from '../lib/voices'
  import { useAudio } from '../components/hooks/useAudio'
  import { useCountDown } from '../components/hooks/useCountDown'
  import { VoiceSelection } from '../components/voiceselection'
  import { useOpenAI } from '../components/hooks/useOpenAi'
import InputManager from '../components/InputManager'
import Paragraph from '../components/paragraph'


  type Voice = {voiceType: VoiceTypes, voice: string, aiSetup: string}

  const AIFun: React.FC = () => {
    const [text, setText] = useState('')
    const { handleAudioEnd, handleAudioStart, getTextAndPlayIt, playingSound } = useAudio()
    const [voice, setVoice] = useState<Voice>(voices[0])
    const { countdown, startCountdown } = useCountDown()
    const { sendImage, error, isLoading } = useOpenAI()
    const [values, setValues] = useState({name: '', location: '', occupation: '', lookAt: ''})

    const handleCaptureStart = () => {
      if (playingSound) return
      
      startCountdown()
    }

    const updateAISetup = () => {
      let newAISetup = voice.aiSetup
      if(values.occupation !== '') newAISetup += ` The subject is a ${values.occupation}`
      if(values.location !== '') newAISetup += ` based in ${values.location}`
      if(values.name !== '') newAISetup += `, name is ${values.name}`
      return newAISetup
    }

    const handleImageCapture = async (image: string | null) => {
      if (playingSound) return
      if (image) {
        handleAudioStart()
        const newAiSetup = updateAISetup()
        const lookCloselyAT = values.lookAt !== '' ? `If present, look closely at ${values.lookAt}` : ''
        await sendImage(image, newAiSetup, lookCloselyAT).then(res => {
          if(res) setText(res)
        })
      } else {
        handleAudioEnd()
      }
    }

    useEffect(() => {
      if (text === '') return
      getTextAndPlayIt(text, voice.voice)
    }, [text])

    useEffect(() => {
      if (error) {
          console.error('Error processing image:', error);
          handleAudioEnd();
      }
    }, [error]);

    const handleSetVoice = (voiceType: VoiceTypes) => {
      const theVoice = voices.find(e => e.voiceType === voiceType)
      if (theVoice) {
        setVoice(theVoice)
      }
    }

    const cd = countdown ? countdown : ''

    
    return (
      <Flex align={'center'} flexDir={'column'} gap={2} mt={10}>
      
        <Flex flexDir="column" alignItems={'center'} gap={5}>
          <Heading>
            {playingSound
              ? `${voice.voiceType} ser på deg..`
              : 'AI Selfie' + cd }
          </Heading>
          <Flex gap={2.5} flexDir={'column'} justify={'center'}>
            <Paragraph style={{textAlign: 'center', fontSize: 14, color: useColorModeValue('black', 'teal')}}>Ekstra informasjon (Valgfritt)</Paragraph>
          <InputManager values={values} setValues={setValues} />
          </Flex>
          <VoiceSelection voices={voices} currentVoice={voice} onVoiceChange={handleSetVoice} />
        
        </Flex>
        <WebcamCapture
        isLoading={isLoading}
          shouldCapture={!playingSound}
          disableCapture={countdown !== null || playingSound}
          onCapture={(image: string | null) => handleImageCapture(image)}
          captureStart={handleCaptureStart}
        />
      </Flex>
    )
  }

  export default AIFun

  export { getServerSideProps } from '../components/chakra'
