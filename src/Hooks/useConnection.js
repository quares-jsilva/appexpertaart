import { useState, useEffect } from 'react'
import NetInfo from "@react-native-community/netinfo"
import { useDispatch, useSelector } from 'react-redux'
import { setIsConnected } from '@/Store/User/network'

const useConnection = () => {

    const dispatch = useDispatch()
   // const navigation = useNavigation();
    const { isConnected } = useSelector((state) => state.network)
    const [ loading, setLoading] = useState(true)

    // It calls when connection changes
    onChange = (newState) => {
        dispatch(setIsConnected(newState.isConnected))
    }

    // useEffect hook calls only once like componentDidMount()
    useEffect(() => {
        // To get current network connection status
        NetInfo.fetch().then((connectionInfo) => {
            setLoading(false)
            onChange(connectionInfo)
        })
        // Whenever connection status changes below event fires
        const unsubscribe = NetInfo.addEventListener(onChange)

        // Our event cleanup function
        return () => {
            unsubscribe()
        }
    }, [])

    // returns current network connection status 

    return { loading, isConnected }
}

export { useConnection }