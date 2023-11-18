import { Button, Flex, Spinner } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'
const image = require('../../public/camerabutton.jpg')

interface Props {
  onCapture: (image: string | null) => void
  isLoading: boolean
  shouldCapture: boolean
  captureStart: () => void
}

const WebcamCapture: React.FC<Props> = ({ onCapture, captureStart, shouldCapture, isLoading = false }) => {
  const webcamRef = useRef<Webcam>(null)
  const [pictureUrl, setPictureUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('') // New state for error message

  const capture = () =>  {
    if (shouldCapture) {
      captureStart()
      setTimeout(() => {
        const image = webcamRef.current?.getScreenshot()
      onCapture(image || null)
      setPictureUrl(image || "")
      }, 5000)
    }
  }

  const handleCameraError = (error: any) => {
    // Check if the error is due to user denying camera access
    console.log(error)
    if (error.name === "NotAllowedError") {
      setErrorMessage('Camera access was denied. Please allow camera access to use this feature.')
    } else {
      setErrorMessage('No camera found. Please ensure your camera is connected and enabled.')
    }
  }

  const webcamStyle = {
    width: '100%',
    height: '450px',
    border: '3px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  }

  return (
    <Flex flexDir={'column'} gap={2.5}>
      <Flex flexDir={'row'} justify={'flex-end'}>
        <Button
          isDisabled={!shouldCapture}
          disabled={!shouldCapture}
          onClick={capture}
        >
          {isLoading ? <Spinner />
          :
          <img src={image.default.src} width={75} />
          }
        </Button>
      </Flex>
      {shouldCapture ? 
      <Webcam
      onUserMediaError={handleCameraError}
      style={{ width: '100%', height: '450px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)', objectFit: 'cover' }}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
    /> :
    <div className="block">
      <img src={pictureUrl} />
      </div>
      }
      {errorMessage && <Flex justifyContent={'center'} color="red.500">{errorMessage}</Flex>}
    </Flex>
  )
}

export default WebcamCapture
