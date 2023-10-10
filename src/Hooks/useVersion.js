import { useState, useEffect } from 'react'
import crashlytics from '@react-native-firebase/crashlytics'
import { Platform, Linking } from 'react-native';
import * as RootNavigator from '@/Navigators/Root'
import {showMessage} from '@/Components/MessageHelper'
import VersionApi from '@/Services/Version/Version'
import { APP_VERSION, APP_ID } from '@/Config'
import { useConnection } from '@/Hooks/useConnection'
import { useDispatch, useSelector } from 'react-redux'
import { setReviewed } from '@/Store/User/user'

const useVersion = () => {

  const { loading, isConnected } = useConnection()
  const [checked, setChecked] = useState(false)
  const dispatch = useDispatch()

  useEffect(async () => {
      try {
        if(!loading && isConnected && !checked){
          let response = await VersionApi.getVersion()

          let respVersion = response.data.find((version) => 
            version.aplicacion === "MOBILE-CLIENTES" &&
            Platform.OS.toUpperCase() === version.plataforma
          )
          
          if(!respVersion.rate){
            dispatch(setReviewed())
          }

          let newVersion = response.data.filter((version) => 
            version.aplicacion === "MOBILE-CLIENTES" &&
            Platform.OS.toUpperCase() === version.plataforma &&
            APP_VERSION.replace(/\./g, '') < version.numero && 
            version.bloqueante
          )
          setChecked(true)

          if(newVersion.length > 0) {
            showMessage({
              'message': 'Existe una nueva versión de la aplicación, descargá la actualización para continuar operando.', 
              'type': 'warning',
              'version': true,
              'button': {
                  'text': Platform.OS === 'ios' ? 'Abrir App Store' : 'Abrir Play Store', 
                  'noClose': true,
                  'onPress': () => {
                    Linking.openURL(Platform.OS === 'ios'? "itms-apps://itunes.apple.com/us/app/apple-store/id1312968574" : "market://details?id=" + APP_ID)
                  }
              },
              'buttonHelp': {
                onPress: () => RootNavigator.navigate('ProblemReport', { errorFrom: 'getUpdateVersion' }) 
              }
            })
          }
        }
      } catch(error) {
        await crashlytics().setAttributes({'response': JSON.stringify(error), 'version': APP_VERSION.replace(/\./g, '') })
        crashlytics().log('Fallo el request de version')
      }
    }, [isConnected, loading]
  )

  return {}
    
}

export { useVersion }