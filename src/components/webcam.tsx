import { Button, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { PiCameraRotateLight } from 'react-icons/pi'

const image = require('../../public/camerabutton.jpg')

interface Props {
  onCapture: (image: string | null) => void
  isLoading: boolean
  shouldCapture: boolean
  captureStart: () => void
}

const WebcamCapture: React.FC<Props> = ({
  onCapture,
  captureStart,
  shouldCapture,
  isLoading = false
}) => {
  const webcamRef = useRef<Webcam>(null)
  const [pictureUrl, setPictureUrl] = useState('')
  const [useBackCamera, setUseBackCamera] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

  const capture = () => {
    if (shouldCapture) {
      captureStart()
      setTimeout(() => {
        const image = webcamRef.current?.getScreenshot()
        onCapture(image || null)
        setPictureUrl(image || '')
      }, 5000)
    }
  }

  const handleCameraError = (error: any) => {
    // Check if the error is due to user denying camera access
    console.log(error)
    if (error.name === 'NotAllowedError') {
      setErrorMessage(
        'Camera access was denied. Please allow camera access to use this feature.'
      )
    } else {
      setErrorMessage(
        'No camera found. Please ensure your camera is connected and enabled.'
      )
    }
  }

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        const videoInputs = devices.filter(
          device => device.kind === 'videoinput'
        )
        setHasMultipleCameras(videoInputs.length > 1)
      })
      .catch(err => {
        console.error('Error accessing media devices:', err)
      })
  }, [])

  const videoConstraints = {
    facingMode: useBackCamera ? { exact: 'environment' } : 'user'
  }

  return (
    <Flex flexDir={'column'} gap={2.5}>
      <Flex
        flexDir={'row'}
        justify={hasMultipleCameras ? 'space-between' : 'flex-end'}
        pl={2}
      >
        {hasMultipleCameras && (
          <Button
            padding={2}
            backgroundColor={'transparent'}
            onClick={() => setUseBackCamera(!useBackCamera)}
          >
            <PiCameraRotateLight size={40} />
          </Button>
        )}
        <Button
          isDisabled={!shouldCapture}
          disabled={!shouldCapture}
          onClick={capture}
        >
          {isLoading ? <Spinner /> : <img src={image.default.src} width={75} />}
        </Button>
      </Flex>
      {shouldCapture ? (
        <Webcam
          videoConstraints={videoConstraints}
          onUserMediaError={handleCameraError}
          style={{
            width: '100%',
            height: '450px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            objectFit: 'cover'
          }}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      ) : (
        <div className="block">
          <img src={pictureUrl} />
        </div>
      )}
      {errorMessage && (
        <Flex justifyContent={'center'} color="red.500">
          {errorMessage}
        </Flex>
      )}
    </Flex>
  )
}

export default WebcamCapture
