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
  disableCapture: boolean
}

const WebcamCapture: React.FC<Props> = ({
  onCapture,
  captureStart,
  shouldCapture,
  isLoading = false,
  disableCapture = false
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

  const captureHoverStyle = !disableCapture 
  ? {
      bgColor: 'transparent', 
      transform: 'translateY(2px)',
      transition: 'transform 0.3s ease-in-out'
    }
  : {
      bgColor: 'transparent'
    };

  return (
    <Flex flexDir={'column'} gap={2}>
      <Flex
        flexDir={'row'}
        justify={hasMultipleCameras ? 'space-between' : 'flex-end'}
        pl={0}
      >
        {hasMultipleCameras && (
          <Button
            padding={1}
            paddingLeft={1}
            paddingTop={4}
            _hover={{bgColor: 'transparent'}}
            backgroundColor={'transparent'}
            onClick={() => setUseBackCamera(!useBackCamera)}
          >
            <PiCameraRotateLight size={40} />
          </Button>
        )}
        <Button
          isDisabled={disableCapture}
          disabled={disableCapture}
          pr={2}
          backgroundColor={'transparent'}
          onClick={capture}
          _hover={captureHoverStyle}
        >
          {isLoading ? <Spinner /> : <img src={image.default.src} width={65} style={{paddingTop: 5}} />}
        </Button>
      </Flex>
      {shouldCapture ? (
        <Webcam
          videoConstraints={videoConstraints}
          onUserMediaError={handleCameraError}  
          style={{
            width: '600px',
            height: '450px',
            border: '2px solid grey',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            objectFit: 'cover',
          }}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      ) : (
        <div className="block">
          <img src={pictureUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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
