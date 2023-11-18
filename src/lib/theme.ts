import { extendTheme } from '@chakra-ui/react'
import { StyleFunctionProps, mode } from '@chakra-ui/theme-tools'

const bgColors = {
    bg1: '#f0e7db',
    bg2: '#202023',
    bgTest1: "#F4F4F4",
    bgTest2: ""
}


const styles = {
    global: (props: StyleFunctionProps) => ({
        body: {
            bg: mode(bgColors.bgTest1, bgColors.bg2)({...props}),
            transitionProperty: "all",
            transitionDuration: "800ms",
        }
    })
}

const components = {
    Heading: {
        variants: {
            'section-title': {
                textDecoration: 'underline',
                fontSize: 20,
                textUnderlineOffset: 6,
                textDecorationColor: '#525252',
                textDecorationThickness: 4,
                marginTop: 3,
                marginBottom: 4
            }
        }
    },
    Link: {
        baseStyle: (props: StyleFunctionProps) => ({
            color: mode('#3d7aed', '#95b9fc')(props),
            textUnderlineOffset: 3
        })
    }
}

const fonts = {
    heading: "'Fira Sans Condensed'"
}

const colors = {
    glassTeal: '#88ccca'
}



const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    disableTransitionOnChange: false,
}

const theme = extendTheme({
    config, styles, components, colors, fonts
})

export default theme