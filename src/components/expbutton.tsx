import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useColorModeValue } from '@chakra-ui/react'

export default function ExpButton() {
  const mode = useColorModeValue('light', 'dark')
  const bgColor = mode === 'light' ? 'bg-blue-500' : 'bg-teal-800'
  const hoverBgColor =
    mode === 'light' ? 'hover:bg-blue-700' : 'hover:bg-teal-600'
  const textColor = mode === 'light' ? 'text-green-100' : 'text-white'
  const shadowColor = mode === 'light' ? 'shadow-blue-400' : 'shadow-teal-800'

  return (
    <Button
      className={`w-full sm:w-auto text-md py-5 px-6 ${bgColor} ${hoverBgColor} ${textColor} rounded-full  ${shadowColor} transition-all duration-200 ease-linear transform hover:shadow-md hover:shadow-teal-800 group`}
    >
      <span className="mr-2">Se min portefølje</span>
      <ArrowRight className="inline-block transition-transform duration-300 group-hover:translate-x-2" />
    </Button>
  )
}
