import { useState } from "react"

export const useAudio = () => {

  const [playingSound, setPlayingSound] = useState(false)

  const handleAudioStart = () => {
    setPlayingSound(true)
  }

  const handleAudioEnd = () => {
    setPlayingSound(false)
  }

  const getTextAndPlayIt = async (text: string, voice: string) => {
    const response = await sendTextToElevenLabs(text, voice)
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
          if (!sourceBuffer.updating && readerDone && mediaSource.readyState === 'open') {
            mediaSource.endOfStream()
          }
        }
        let readerDone = false;
        const reader = response.body?.getReader()
        function push() {
          reader?.read().then(({ done, value }) => {
            if (done) {
              readerDone = true;
              // Check if the SourceBuffer is not updating before calling endOfStream
              if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
                mediaSource.endOfStream()
              }
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

  const sendTextToElevenLabs = async (text: string, voice: string) => {
    try {
      const response = await fetch('/api/generateVoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, voice_id: voice })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      return response // Return the response object for streaming
    } catch (error) {
      console.error('Error converting text to speech:', error)
      handleAudioEnd()
    }
  }

  return { handleAudioEnd, handleAudioStart, getTextAndPlayIt, playingSound }

}