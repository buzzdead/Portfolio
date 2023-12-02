import { Button, Flex, Spinner } from '@chakra-ui/react';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Webcam from 'react-webcam';
import { PiCameraRotateLight } from 'react-icons/pi';

const image = require('../../public/camerabutton.jpg');

interface Props {
  onCapture: (image: string | null) => void;
  isLoading: boolean;
  shouldCapture: boolean;
  captureStart: () => void;
  disableCapture: boolean;
  receivedImage: string
}

const WebcamCapture: React.FC<Props> = ({
  onCapture,
  captureStart,
  shouldCapture,
  isLoading = false,
  disableCapture = false,
  receivedImage
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [pictureUrl, setPictureUrl] = useState('');
  const [useBackCamera, setUseBackCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const capture = useCallback(() => {
    if (shouldCapture) {
      captureStart();
      setTimeout(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        onCapture(imageSrc || null);
        setPictureUrl(imageSrc || '');
      }, 5000);
    }
  }, [shouldCapture, captureStart, onCapture]);

  const handleCameraError = useCallback((error: any) => {
    console.log(error);
    const message = error.name === 'NotAllowedError'
      ? 'Camera access was denied. Please allow camera access to use this feature.'
      : 'No camera found. Please ensure your camera is connected and enabled.';
    setErrorMessage(message);
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      })
      .catch(err => console.error('Error accessing media devices:', err));
  }, []);

  const videoConstraints = useMemo(() => ({
    facingMode: useBackCamera ? { exact: 'environment' } : 'user',
  }), [useBackCamera]);

  const webcamStyle = {
    width: '600px',
    height: '450px',
    border: '2px solid grey',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  };

  const captureHoverStyle = {
    bgColor: 'transparent',
    transform: disableCapture ? undefined : 'translateY(2px)',
    transition: 'transform 0.3s ease-in-out',
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
            _hover={{ bgColor: 'transparent' }}
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
          {isLoading ? <Spinner /> : <img src={image.default.src} width={65} style={{ paddingTop: 5 }} />}
        </Button>
      </Flex>
      {shouldCapture ? (
        <Webcam
          videoConstraints={videoConstraints}
          onUserMediaError={handleCameraError}
          style={{objectFit: 'cover', ...webcamStyle}}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      ) : (
        <div className="block">
          <img src={receivedImage === '' ? pictureUrl : receivedImage} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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
