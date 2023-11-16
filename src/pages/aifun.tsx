import React, { useEffect, useState } from 'react'
import axios from 'axios'
import WebcamCapture from '../components/webcam'
import { Box, Flex, Heading } from '@chakra-ui/react'
import Paragraph from '../components/paragraph'

const AIFun: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [playingSound, setPlayingSound] = useState(false)

  const handleImageCapture = (image: string | null) => {
    handleAudioStart()
    setImageSrc(image)
    if (image) {
      sendImageToOpenAI(image)
    }
    else {
        handleAudioEnd()
    }
  }

  const handleAudioStart = () => {
    setPlayingSound(true);
};

const handleAudioEnd = () => {
    setPlayingSound(false);
};

const getTextAndPlayIt = async () => {
    const response = await sendTextToElevenLabs();
    if (response) {
        const mediaSource = new MediaSource();
        const audio = new Audio();
        audio.src = URL.createObjectURL(mediaSource);

        mediaSource.onsourceopen = () => {
            const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg'); // Adjust MIME type as needed
            let queue: BufferSource[] = [];

            sourceBuffer.onupdateend = () => {
                if (!sourceBuffer.updating && queue !== undefined && queue.length) {
                    sourceBuffer.appendBuffer(queue.shift()!);
                }
            };

            const reader = response.body?.getReader();
            function push() {
                reader?.read().then(({ done, value }) => {
                    if (done) {
                        mediaSource.endOfStream();
                        return;
                    }
                    if (sourceBuffer.updating || queue.length > 0) {
                        queue.push(value);
                    } else {
                        sourceBuffer.appendBuffer(value);
                    }
                    push();
                });
            }
            push();
        };

        audio.play();
        audio.onended = () => {
            handleAudioEnd();
        };
    }
};



  const sendTextToElevenLabs = async () => {
    try {
        const response = await fetch('/api/generateVoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response; // Return the response object for streaming
    } catch (error) {
        console.error('Error converting text to speech:', error);
    }
};



  useEffect(() => {
    if(text === "") return
    getTextAndPlayIt()
  }, [text])

  const sendImageToOpenAI = async (base64Image: string) => {
    if(base64Image === "") return
    let finalString = ""
    try {
      const response = await fetch('/api/analyzeImage', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            image: base64Image
        })
      }).then(async (res: any) => {
        const reader = res.body?.getReader();
        while(true) {
            const { done, value } = await reader?.read()
            if(done) {
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

  // ... in your component, call sendImageToOpenAI with the base64 encoded image ...

  return (
    <Flex align={'center'} flexDir={'column'} gap={10} mt={10}>
        <Paragraph as={"div"} style={{maxWidth: 500}}>Utvalg AI person (David Attenborough) vil våke over webcamet ditt om noen få sekunder, vent til indikasjonen dukker opp.</Paragraph>
        <Heading>{playingSound ? "David Attenborough ser på deg." : "Venter..."}</Heading>
      <WebcamCapture
      shouldCapture={!playingSound}
        onCapture={(image: string | null) => handleImageCapture(image)}
      />
    </Flex>
  )
}

export default AIFun
