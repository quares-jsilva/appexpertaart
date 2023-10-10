import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import DefaultTheme from '@/Store/Theme/DefaultTheme'
import NetInfo from "@react-native-community/netinfo"
import { setIsConnected } from '@/Store/User/network'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (args, { dispatch }) => {
    // Timeout to fake waiting some process
    // Remove it, or keep it if you want display a beautiful splash screen ;)
    
    // Here we load the user 1 for example, but you can for example load the connected user
    const connectionInfo = await NetInfo.fetch()
    await dispatch(setIsConnected(connectionInfo.isConnected))
    await dispatch(DefaultTheme.action({ theme: 'default', darkMode: null }))
    // Navigate and reset to the main navigator
   navigateAndSimpleReset('Main')
  }),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
