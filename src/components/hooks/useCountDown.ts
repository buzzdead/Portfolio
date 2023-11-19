import { useEffect, useState } from "react"

export const useCountDown = () => {
    const [countdown, setCountdown] = useState<number | null>(null)

    const startCountdown = () => {
        setCountdown(5)
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (countdown !== null && countdown > 0) {
          interval = setInterval(() => {
            setCountdown(currentCountdown => currentCountdown === 1 ? null : currentCountdown! - 1)
          }, 1000)
        } else if (interval) {
          clearInterval(interval)
        }
    
        return () => {
          if (interval) clearInterval(interval)
        }
      }, [countdown])

      return {countdown, startCountdown}
}