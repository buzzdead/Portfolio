import { useState } from "react";

interface Props {
}

export const useOpenAI = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const sendImageToOpenAI = async (base64Image: string, aiSetup: string) => {
        if (base64Image === '') return
        let finalString = ''
        try {
          await fetch('/api/analyzeImage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              image: base64Image,
              aiSetup: aiSetup
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
        return finalString
      }
  
    const sendImage = async (base64Image: string, aiSetup: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const finalString = await sendImageToOpenAI(base64Image, aiSetup);
        return finalString;
    } catch (error) {
        setError(error as Error); // Set the error state
        return null; 
    } finally {
        setIsLoading(false);
    }
    };
  
    return { sendImage, isLoading, error };
  };
  