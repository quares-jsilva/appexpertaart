import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import * as RootNavigator from '@/Navigators/Root'
import {store} from '@/Store'
import { setPushId } from '@/Store/User/auth'
import { setNotification } from '@/Store/Notification'
import moment from 'moment'

let PUSHID = ''

export const savePushId = () => {
    store.dispatch(setPushId(PUSHID))
}

export const configure = (url) => {
        
    PushNotification.configure({
        onRegister: function (token) {
            PUSHID = token && token.token || ''
        },
        onNotification: function(notification) {
            notification.finish(PushNotificationIOS.FetchResult.NoData)
            if(notification.userInteraction) {
                RootNavigator.navigate('Notificaciones')
            } else {
                store.dispatch(setNotification({
                    title: notification.data && notification.data.title || '',
                    date: moment().toISOString(),
                    body: notification.data && notification.data.body || '',
                    url: notification.data && notification.data.url || '',
                }))

                PushNotification.localNotification({
                    message: notification.data.body,
                    title: notification.title,
                })
            }
        },

        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        popInitialNotification: true,
        requestPermissions: true

    })
}
