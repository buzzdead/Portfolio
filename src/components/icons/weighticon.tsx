interface Props {
  fill: string
}

const WeightIcon = ({fill}: Props) => {
    return (
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width={25} height={25} viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet" style={{ transition: 'fill 0.5s ease' }}>
       
       <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
       fill={fill} stroke="none" style={{ transitionDuration: '800ms' }}>
       <path d="M1120 4061 c-121 -38 -205 -138 -217 -257 l-6 -54 -218 0 c-120 0
       -229 -4 -242 -9 -40 -16 -99 -73 -118 -116 -28 -60 -26 -193 2 -229 11 -14 29
       -26 40 -26 17 0 19 -8 19 -85 0 -82 -1 -85 -25 -91 -39 -10 -55 -41 -55 -105
       l0 -57 -97 -4 c-115 -4 -148 -20 -183 -92 -20 -43 -21 -55 -18 -388 l3 -344
       27 -41 c35 -53 83 -74 185 -81 l83 -5 0 -269 c0 -220 3 -275 16 -306 19 -47
       58 -88 109 -115 37 -21 54 -22 256 -22 l217 0 5 -51 c10 -97 71 -184 162 -232
       l50 -27 280 0 280 0 50 27 c60 31 104 77 136 138 l24 45 3 483 3 482 69 0 c83
       0 110 18 110 74 0 53 -36 76 -116 76 l-64 0 0 180 0 180 670 0 670 0 0 -180 0
       -180 -465 0 -466 0 -24 -25 c-32 -31 -33 -74 -2 -103 23 -22 25 -22 490 -22
       l466 0 3 -482 3 -483 24 -45 c32 -61 76 -107 136 -138 l50 -27 280 0 280 0 50
       27 c91 48 152 135 162 232 l5 51 217 0 c202 0 219 1 256 22 91 49 125 112 125
       233 0 93 -7 112 -50 130 l-30 12 0 84 c0 69 3 84 15 84 9 0 27 11 40 25 20 19
       25 34 25 73 l0 49 83 5 c102 7 150 28 185 81 l27 41 3 344 c3 333 2 345 -18
       388 -35 72 -68 88 -182 92 l-98 4 0 276 c0 246 -2 281 -19 317 -19 43 -78 100
       -118 116 -13 5 -122 9 -242 9 l-218 0 -6 54 c-10 100 -72 188 -167 237 -44 24
       -50 24 -325 24 l-280 0 -50 -27 c-60 -31 -104 -77 -136 -138 l-24 -45 -3 -482
       -3 -483 -669 0 -669 0 -3 483 -3 482 -24 45 c-32 61 -76 107 -136 138 l-50 27
       -265 2 c-146 1 -276 -2 -290 -6z m-820 -1501 l0 -321 -72 3 -73 3 -3 305 c-1
       168 0 310 3 317 3 9 27 13 75 13 l70 0 0 -320z m4665 0 l0 -315 -72 -3 -73 -3
       0 321 0 321 73 -3 72 -3 0 -315z"/>
       </g>
       </svg>
    )
  }
  
  export default WeightIcon