import React, { useRef, useEffect, useCallback } from 'react';
import Webcam from "react-webcam";

interface Props {
    onCapture: (image: string | null) => void;
    shouldCapture: boolean;
}

const WebcamCapture: React.FC<Props> = ({ onCapture, shouldCapture }) => {
    const webcamRef = useRef<Webcam>(null);

    const capture = useCallback(() => {
        if (shouldCapture) {
            const image = webcamRef.current?.getScreenshot();
            onCapture(image || null);
        }
    }, [webcamRef, shouldCapture, onCapture]);

    useEffect(() => {
        const interval = setInterval(() => {
            capture();
        }, 5000); // Adjust the interval as needed

        return () => clearInterval(interval);
    }, [capture]);

    return (
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
    );
};

export default WebcamCapture;
