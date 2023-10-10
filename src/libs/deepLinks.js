import { Linking, Platform } from "react-native"
import Analytics from './analytics'
import { assistanceNumber, mailArt } from '@/Config'

const openUrl = (url) => {
    Analytics.logEvent('openExternalUrl', 'Contactanos', url)
    Linking.openURL(url)
}

const sendEmail = (mail) => {
    Analytics.logEvent('sendEmail', 'Mail a ART', mail)
    Linking.openURL('mailto:' + mail)
}

const makeCall = (numb) => {
    if(numb === assistanceNumber) {
        Analytics.logEvent('callNumber', 'Centro de emergencias', numb)
    } else {
        Analytics.logEvent('callNumber', 'Centro de atención', numb)
    }
    let number = 'tel:' + numb
    Linking.openURL(number)
}

const openApp = (url) => {
    Linking.canOpenURL(url).then((installed) => {
        if(installed) {
            Linking.openURL(url)
        } else {
            Linking.openURL(Platform.OS === 'ios' ? "itms-apps://itunes.apple.com/us/app/apple-store/id1591430310" : "market://details?id=com.experta.seguros")
        }
    })
}

const isAppInstalled = async (url) => {
    return await Linking.canOpenURL(url)
}

export { openUrl, sendEmail, makeCall, openApp, isAppInstalled }