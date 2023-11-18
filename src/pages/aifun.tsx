import React, { useEffect, useState } from 'react'
import WebcamCapture from '../components/webcam'
import {
  Flex,
  Heading,
  Spinner,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'
import Paragraph from '../components/paragraph'
import { FaRegThumbsUp } from 'react-icons/fa6'
import { TbDeviceRemote } from 'react-icons/tb'
import { VoiceTypes, voices } from '../lib/voices'
import { useAudio } from '../components/hooks/useAudio'
import { useCountDown } from '../components/hooks/useCountDown'
import { VoiceSelection } from '../components/voiceselection'
import { useOpenAI } from '../components/hooks/useOpenAi'

type Voice = {voiceType: VoiceTypes, voice: string, aiSetup: string}

const AIFun: React.FC = () => {
  const [text, setText] = useState('')
  const { handleAudioEnd, handleAudioStart, getTextAndPlayIt, playingSound } = useAudio()
  const [voice, setVoice] = useState<Voice>(voices[0])
  const { countdown, startCountdown } = useCountDown()
  const { sendImage, error, isLoading } = useOpenAI()

  const handleCaptureStart = () => {
    if (playingSound) return
    
    startCountdown()
  }

  const handleImageCapture = async (image: string | null) => {
    if (playingSound) return
    if (image) {
      handleAudioStart()
      await sendImage(image, voice.aiSetup).then(res => {
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
    <Flex align={'center'} flexDir={'column'} gap={10} mt={10}>
      <VoiceSelection voices={voices} currentVoice={voice} onVoiceChange={handleSetVoice} />
      <Flex flexDir="column" alignItems={'center'} gap={2}>
        <Heading>
          {playingSound
            ? `${voice.voiceType} ser på deg..`
            : 'Ready, steady, go...' + cd }
        </Heading>
        <Flex alignItems={'center'} gap={2}>
          <Paragraph style={{ verticalAlign: 'center' }}>
            "Strike a pose" f.eks
          </Paragraph>
          <Tooltip label={'Thumbs up'}>
            <span>
              <FaRegThumbsUp
                color={useColorModeValue('blue', 'green')}
                size={20}
              />
            </span>
          </Tooltip>
          <Paragraph>Eller vis et objekt f.eks</Paragraph>
          <Tooltip label="Remote control">
            <span>
              <TbDeviceRemote
                color={useColorModeValue('blue', 'green')}
                size={20}
              />
            </span>
          </Tooltip>
        </Flex>
      </Flex>
      <WebcamCapture
      isLoading={isLoading}
        shouldCapture={!playingSound}
        onCapture={(image: string | null) => handleImageCapture(image)}
        captureStart={handleCaptureStart}
      />
    </Flex>
  )
}

export default AIFun

export { getServerSideProps } from '../components/chakra'
