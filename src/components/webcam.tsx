import { Button, Flex } from '@chakra-ui/react'
import React, { useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
const image = require('../../public/camerabutton.jpg')


interface Props {
  onCapture: (image: string | null) => void
  shouldCapture: boolean
}

const WebcamCapture: React.FC<Props> = ({ onCapture, shouldCapture }) => {
  const webcamRef = useRef<Webcam>(null)
  console.log(shouldCapture, "in the comp")

  const capture = useCallback(() => {
    if (shouldCapture) {
      const image = webcamRef.current?.getScreenshot()
      onCapture(image || null)
    }
  }, [webcamRef, shouldCapture, onCapture])

  const webcamStyle = {
    width: '100%',
    height: '450px',
    border: '3px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  };

  return (
    <Flex flexDir={'column'} gap={2.5}>
      <Flex flexDir={'row'} justify={'flex-end'}>
          <Button isDisabled={!shouldCapture} disabled={!shouldCapture} onClick={capture}>
            <img src={image.default.src} width={75} />
          </Button>
      </Flex>
      <Webcam className='webcamStyle' style={{...webcamStyle, objectFit: 'cover'}} ref={webcamRef} screenshotFormat="image/jpeg" />
    </Flex>
  )
}

export default WebcamCapture
