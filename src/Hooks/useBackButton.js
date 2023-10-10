import { BackHandler } from 'react-native';
import {showMessage} from '@/Components/MessageHelper'
import { useNavigation } from '@react-navigation/native'
import * as RootNavigator from '@/Navigators/Root'

const useBackButton = () => {

    const navigation = useNavigation()
    const firstScreens = ["Dashboard", "DashboardArt"]

    BackHandler.addEventListener('hardwareBackPress', () => {
        if(firstScreens.includes(RootNavigator.getCurrentRouteName()) 
            && (navigation.dangerouslyGetState().index === 1 || 
                navigation.dangerouslyGetState().index === 0) ) {
            showMessage({
                'message': '¿Querés cerrar la aplicación?', 
                'type': 'warning',
                'button': {
                    'text': 'Cerrar', 
                    'onPress': () => BackHandler.exitApp()
                }
            })
            return true
        }
    })
    
}

export { useBackButton }