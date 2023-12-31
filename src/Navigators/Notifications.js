import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NotificationsContainer } from '@/Containers'

const Stack = createStackNavigator()

const NotificationsNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{title: 'Notificaciones', headerTitleAlign: 'center', headerMode: 'screen', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}>
            <Stack.Screen name="Notifications" component={NotificationsContainer} />
        </Stack.Navigator>
    )
}

export default NotificationsNavigator