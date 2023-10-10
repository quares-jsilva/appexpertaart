import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaView, StatusBar, Linking } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import SplashScreen from 'react-native-splash-screen'

import { IndexStartupContainer } from '@/Containers'
import { navigationRef } from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import NoConnection from '@/Components/NoConnection'
import MessageHelper, {messageRef} from '@/Components/MessageHelper'
import * as Notifications from '../libs/notifications'
import { useVersion } from '@/Hooks/useVersion'
import { setCredentials } from '@/Store/User/auth'

const Stack = createStackNavigator()

let MainNavigator

// @refresh reset
const ApplicationNavigator = () => {

  const { Layout, NavigationTheme, Fonts, Gutters } = useTheme()
  const { colors } = NavigationTheme
  const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)
  const { isConnected } = useSelector((state) => state.network)
  const applicationIsLoading = useSelector((state) => state.startup.loading)
  const dispatch = useDispatch()
  const version = useVersion()
  
  const linking = {
    prefixes: ['appexperta://'],

    // Custom function to get the URL which was used to open the app
    async getInitialURL() {
      // First, you may want to do the default deep link handling
      // Check if app was opened from a deep link
      const url = await Linking.getInitialURL()
      if (url != null) {
        const params = url.split('/')[3]
        const decodedData = JSON.parse(atob(params))
        dispatch(setCredentials({username: decodedData.username, password: decodedData.password}))
        return url
      }

    },

      // Custom function to subscribe to incoming links
    subscribe(listener) {
      // First, you may want to do the default deep link handling
      const onReceiveURL = ({ url }) => {
        const params = url.split('/')[3]
        const decodedData = JSON.parse(atob(params))
        dispatch(setCredentials({username: decodedData.username, password: decodedData.password}))
        listener(url)
      }

      // Listen to incoming links from deep linking
      Linking.addEventListener('url', onReceiveURL)

      return () => {
        // Clean up the event listeners
        Linking.removeAllListeners('url')
      }

    },

    config: {
      screens: {
        Main: {
          path: "art/:credentials",
          parse: {credentials: String}
        }
      },
    }

  }

  useEffect(() => {
    if (MainNavigator == null && !applicationIsLoading) {
      MainNavigator = require('@/Navigators/More').default
      Notifications.savePushId()
      setIsApplicationLoaded(true)
      SplashScreen.hide()
    }
  }, [applicationIsLoading])

  useEffect(() => () => {
      setIsApplicationLoaded(false)
      MainNavigator = null
    },
    [],
  )

  useEffect(() => {
    Orientation.getOrientation((orientation)=> {
      Orientation.unlockAllOrientations()
    })
  }, [])

  return (
      <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
        <MessageHelper ref={messageRef} />
        <NavigationContainer linking={linking} ref={navigationRef}>
          <StatusBar barStyle={'default'} />
          {
            !isConnected && <NoConnection></NoConnection>
          }
          <Stack.Navigator screenOptions={{headerBackTitle: 'Volver'}} headerMode={'none'}>
            <Stack.Screen name="Startup" component={IndexStartupContainer} />
            {isApplicationLoaded && MainNavigator != null && (
              <Stack.Screen
                name="Main"
                component={MainNavigator}
                options={{
                  animationEnabled: false,
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
  )
}

export default ApplicationNavigator
