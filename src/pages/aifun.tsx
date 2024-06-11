  import React, { useEffect, useState } from 'react'
  import WebcamCapture from '../components/webcam'
  import {
    Button,
    Flex,
    Heading,
    useColorModeValue} from '@chakra-ui/react'
  import { VoiceTypes, voices } from '../lib/voices'
  import { useAudio } from '../components/hooks/useAudio'
  import { useCountDown } from '../components/hooks/useCountDown'
  import { VoiceSelection } from '../components/voiceselection'
  import { useOpenAI } from '../components/hooks/useOpenAi'
import InputManager from '../components/input/InputManager'
import Paragraph from '../components/paragraph'
import Layout from '../components/layout/article'
import { useThreeScene } from '../components/three/threeprovider'


  type Voice = {voiceType: VoiceTypes, voice: string, aiSetup: string}

  const AIFun: React.FC = () => {

    const [text, setText] = useState('')
    const { handleAudioEnd, handleAudioStart, getTextAndPlayIt, playingSound } = useAudio()
    const [voice, setVoice] = useState<Voice>(voices[0])
    const { countdown, startCountdown } = useCountDown()
    const { sendImage, error, isLoading, createImageFromPrompt } = useOpenAI()
    const [values, setValues] = useState({name: '', location: '', occupation: '', lookAt: ''})
    const [image, setImage] = useState('')
    const {state} = useThreeScene()
    const [videoMode, setVideoMode] = useState(false)

    const handleCaptureStart = () => {
      if (playingSound) return
      
      startCountdown()
    }

    const promptImage = async () => {
      await getTextAndPlayIt(text, voice.voice)
      const abc = await createImageFromPrompt(text)
      setImage(abc.data[0].url)
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
      promptImage()
    }, [text])

    useEffect(() => {
      if (error) {
          console.error('Error processing image:', error);
          handleAudioEnd();
      }
    }, [error]);
    useEffect(() => {
      if(!playingSound && image !== '') setImage('')
    }, [playingSound])

    const handleSetVoice = (voiceType: VoiceTypes) => {
      const theVoice = voices.find(e => e.voiceType === voiceType)
      if (theVoice) {
        setVoice(theVoice)
      }
    }

    const cd = countdown ? countdown : ''

    const analyzeVideo = async (images: string[]) =>  {
       const newAiSetup = updateAISetup()
        const lookCloselyAT = values.lookAt !== '' ? `If present, look closely at ${values.lookAt}` : ''
      try {
        handleAudioStart()
        const response = await fetch('/api/analyzeVideo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            images: images,
            aiSetup: newAiSetup,
            additional: lookCloselyAT
          })
        });
        
        const result = await response.json();
        setText(result.choices[0].message.content.replaceAll('*', ''))
      } catch(e) {
        console.log(e);
      }
    }

    const getStyle = (active: boolean) => {
      return active ? {boxShadow:" 0rem 0 0.31rem 0.11rem rgb(10 130 160)"} : {opacity: 0.4}
    }
    

    return (
      <Layout skipEnter title="AI">
      <Flex align={'center'} flexDir={'column'} gap={2}>
        <Flex flexDir="column" alignItems={'center'} gap={5}>
          <Flex alignItems={'center'} textAlign={'center'} flexDir={'column'}>
          <Heading className={state.hitAi ? 'burning-effect' : 'none'} color={useColorModeValue('teal.600', 'teal.400')} >
            {playingSound
              ? `${voice.voiceType} ser på deg..`
              : 'AI Selfie' + cd }
          </Heading>
          </Flex>
         
          <Flex gap={2.5} flexDir={'column'} justify={'center'}>
            <Flex marginBottom={3.5} justify={'center'} gap={2} dir='row'>           
              <Button style={{...getStyle(!videoMode), transition: 'opacity .25s linear, box-shadow .25s ease'}} onClick={() => setVideoMode(false)}>Image</Button>
              <Button style={{...getStyle(videoMode), transition: 'opacity .25s linear, box-shadow .25s ease'}} onClick={() => setVideoMode(true)}>Video</Button>
            </Flex>

          <InputManager values={values} setValues={setValues} />
          </Flex>
          <VoiceSelection voices={voices} currentVoice={voice} onVoiceChange={handleSetVoice} />
        
        </Flex>
        <WebcamCapture
        isLoading={isLoading}
        receivedImage={image}
        videoMode={videoMode}
          shouldCapture={!playingSound}
          disableCapture={countdown !== null || playingSound}
          onCapture={(image: string | string[] | null) => videoMode ? analyzeVideo(image as string[]) : handleImageCapture(image as string)}
          captureStart={handleCaptureStart}
        />
      </Flex>
      </Layout>
    )
  }

  export default AIFun

  export { getServerSideProps } from '../components/chakra'
