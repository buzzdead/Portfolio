import React, { useEffect, useState } from 'react'
import WebcamCapture from '../components/webcam'
import { Flex, Heading, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import Paragraph from '../components/paragraph'
import { FaRegThumbsUp } from 'react-icons/fa6'
import { TbDeviceRemote } from 'react-icons/tb'

type VoiceTypes = 'Attenborough' | 'MovieTrailerGuy'

const voices: { voiceType: VoiceTypes; voice: string; aiSetup: string }[] = [
  {
    voiceType: 'Attenborough',
    voice: '70rymsvcj1TIa1tON70Z',
    aiSetup:
      'You are Sir David Attenborough. Narrate the picture of the human as if it is a nature documentary.' +
      "Make it snarky and funny. Don't repeat yourself. Make it short. If I do anything remotely interesting, make a big deal about it!"
  },
  {
    voiceType: 'MovieTrailerGuy',
    voice: 'W9Sme726LTRRST7a9TqU',
    aiSetup:
      'You are Don LaFontaine, the Movie Trailer Guy. Make a comical yet serious narration about the person in the image, make it dramatic and full of action. This is the coolest guy or girl on earth.' +
      'Talk in a dramatic way, much like the movie trailer guy. A little bit up and a little bit down in the pitch of the voice.'
  }
]

const AIFun: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null);
  const [voice, setVoice] = useState<{
    voiceType: VoiceTypes
    voice: string
    aiSetup: string
  }>({
    voiceType: 'Attenborough',
    voice: '70rymsvcj1TIa1tON70Z',
    aiSetup:
      'You are Sir David Attenborough. Narrate the picture of the human as if it is a nature documentary.' +
      "Make it snarky and funny. Don't repeat yourself. Make it short. If I do anything remotely interesting, make a big deal about it!"
  })
  const [playingSound, setPlayingSound] = useState(false)

  const handleImageCapture = (image: string | null) => {
    if (playingSound) return
    handleAudioStart()
    setImageSrc(image)
    if (image) {
      setCountdown(5);
      setTimeout(() => sendImageToOpenAI(image), 5000)
    } else {
      handleAudioEnd()
    }
  }

  const handleAudioStart = () => {
    setPlayingSound(true)
  }

  const handleAudioEnd = () => {
    setPlayingSound(false)
  }

  const getTextAndPlayIt = async () => {
    const response = await sendTextToElevenLabs()
    if (response) {
      const mediaSource = new MediaSource()
      const audio = new Audio()
      audio.src = URL.createObjectURL(mediaSource)

      mediaSource.onsourceopen = () => {
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg') // Adjust MIME type as needed
        let queue: BufferSource[] = []

        sourceBuffer.onupdateend = () => {
          if (!sourceBuffer.updating && queue !== undefined && queue.length) {
            sourceBuffer.appendBuffer(queue.shift()!)
          }
        }

        const reader = response.body?.getReader()
        function push() {
          reader?.read().then(({ done, value }) => {
            if (done) {
              mediaSource.endOfStream()
              return
            }
            if (sourceBuffer.updating || queue.length > 0) {
              queue.push(value)
            } else {
              sourceBuffer.appendBuffer(value)
            }
            push()
          })
        }
        push()
      }

      audio.play()
      audio.onended = () => {
        handleAudioEnd()
      }
    }
  }

  const sendTextToElevenLabs = async () => {
    try {
      const response = await fetch('/api/generateVoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, voice_id: voice.voice })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      return response // Return the response object for streaming
    } catch (error) {
      console.error('Error converting text to speech:', error)
    }
  }

  useEffect(() => {
    if (text === '') return
    getTextAndPlayIt()
  }, [text])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(currentCountdown => currentCountdown! - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    // Clear interval on cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);


  const sendImageToOpenAI = async (base64Image: string) => {
    if (base64Image === '') return
    let finalString = ''
    try {
      const response = await fetch('/api/analyzeImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Image,
          aiSetup: voice.aiSetup
        })
      }).then(async (res: any) => {
        const reader = res.body?.getReader()
        while (true) {
          const { done, value } = await reader?.read()
          if (done) {
            break
          }
          var currentChunk = new TextDecoder().decode(value)
          finalString += currentChunk
        }
      })
    } catch (error) {
      console.error('Error sending image to OpenAI:', error)
    }
    setText(finalString)
  }

  const handleSetVoice = (voiceType: VoiceTypes) => {
    const theVoice = voices.find(e => e.voiceType === voiceType)
    if (theVoice) {
      setVoice(theVoice)
    }
  }

  return (
    <Flex align={'center'} flexDir={'column'} gap={10} mt={10}>
      <RadioGroup defaultValue="Attenborough" onChange={handleSetVoice}>
        <Stack spacing={5} direction="row">
          {voices.map((v, id) => (
            <Radio colorScheme="green" value={v.voiceType}>
              {v.voiceType}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      <Flex flexDir="column" alignItems={'center'} gap={2}>
        <Heading>
        {playingSound ? 
          `${voice.voiceType} ser på deg.. ${countdown || ''}` : 
          'Ready, steady, go...'}
        </Heading>
        <Flex alignItems={'center'} gap={2}>
          <Paragraph style={{ verticalAlign: 'center' }}>
            "Strike a pose" f.eks
          </Paragraph>
          <FaRegThumbsUp color="green" size={30} />
          <Paragraph>Eller vis et objekt f.eks</Paragraph>
          <TbDeviceRemote color="green" size={30} />
        </Flex>
      </Flex>
      <WebcamCapture
        shouldCapture={!playingSound}
        onCapture={(image: string | null) => handleImageCapture(image)}
      />
    </Flex>
  )
}

export default AIFun
