import { useEffect } from 'react'
import { useThreeScene } from '../../components/three/threeprovider'
import Space from '../../components/three/space'
import FullPage from '../../components/layout/fullpage'

const Solarsystem = () => {
    const threeState = useThreeScene()
    useEffect(() => {
        threeState.setState({...threeState.state, mode: 'Solar'})
    }, [])
    return <FullPage><Space /></FullPage>
}

export default Solarsystem