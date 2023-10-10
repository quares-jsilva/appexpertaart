import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as NavigationRoot from '@/Navigators/Root'
import { Image, Linking, TouchableOpacity } from 'react-native'
import { useTheme } from '@/Theme'
import { assistanceNumber, whatsappNumber } from '@/Config'
import { makeCall, openUrl } from '@/libs/deepLinks'
import { useNavigation } from '@react-navigation/native'

const Tab = createBottomTabNavigator()

let DashboardNavigator = require('@/Navigators/Dashboard').default
let ContactUsNavigator = require('@/Navigators/ContactUs').default

// @refresh reset
const MainNavigator = () => {

  const { Images } = useTheme()
  const [tabVisible, setTabVisible] = useState(false)
  const { homeRoute, profiles } = useSelector((state) => state.user)
  const { unread } = useSelector((state) => state.notification)
  const { hasClaim } = useSelector((state) => state.claim)
  const { isConnected } = useSelector((state) => state.network)
  
  const actualView = NavigationRoot.getCurrentRouteName()
  const actualParams = NavigationRoot.getCurrentParams()
  const navigation = useNavigation()

  const viewsWithoutTabs = [
    'Login',
    'RegisterStepOne',
    'RegisterStepTwo',
    'RecoverPassword',
    'ProblemReport',
    'FrequentQuestions',
    'Help',
    'MyCarCard',
    'ChangePassword',
    'TermsAndConditions',
    'LoginEditUser'
  ]

  useEffect(() => {
    setTabVisible(!viewsWithoutTabs.includes(actualView))
  }, [actualView])

  const nullComponent = () => {
    return <></>
  }

  return (
    <Tab.Navigator 
      tabBarOptions={{activeTintColor: 'black'}} 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          size = 45
          let styleObj = {}
          switch (route.name) {
            case 'Home':
              iconName = 'footerHome'
              break
            case 'Contacto':
              iconName = 'footerContact'
              break
            case 'WhatsApp':
              iconName = 'footerWsp'
              break
            case 'Emergencia':
              iconName = 'footerEmergency'
            break
            case 'Notificaciones':
              iconName = 'footerNotification'
              styleObj= {tintColor: !isConnected ? '#bfbfbf' : '#595a5c'}
              break
              
            case 'Mí Perfil':
              iconName = 'footerProfile'
              styleObj= {tintColor: !isConnected ? '#bfbfbf' : '#595a5c'}
              break
            case 'Más':
              size = 40
              iconName = 'footerMore'
              break
          }

          return <Image 
                    source={Images[iconName]}
                    style={[{height: size, width: size}, styleObj]} 
                    resizeMode={'contain'}
                  />
        },
        tabBarVisible: tabVisible
      })}
    >
      <Tab.Screen name="Home" component={DashboardNavigator} 
      options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  NavigationRoot.navigate(homeRoute)
                }}
              />
            ),
          }}/>
      <Tab.Screen name="Contacto" component={ContactUsNavigator} />
      { hasClaim ?
        <Tab.Screen name="WhatsApp" 
          component={nullComponent} 
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  openUrl('whatsapp://send?phone=' + whatsappNumber)
                }}
              />
            ),
          }}
        />
        :
        <Tab.Screen name="Emergencia" 
          component={nullComponent} 
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  makeCall(assistanceNumber)
                }}
              />
            ),
          }}
        />
      }
      <Tab.Screen name="Más" component={nullComponent}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              disabled={!isConnected}
              onPress={()=>navigation.openDrawer()}
            />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
