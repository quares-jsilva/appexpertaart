import analytics from '@react-native-firebase/analytics';
    
class Analytics {

    static onSignUp = async userId => {
        await analytics().setUserId(userId)
    }

    static logScreen = async (screenName, screenClass) => {
        await analytics().logScreenView({
            screen_class: screenClass,
            screen_name: screenName
        })
    }

    static logEvent = async (eventName, pageTitle, pageUrl) => {
        await analytics().logEvent(eventName, { page_title: pageTitle, page_url: pageUrl })
    }

    static setUserProperty = async (property) => {
        await analytics().setUserProperty(property, 'true')
    }

}

export default Analytics;