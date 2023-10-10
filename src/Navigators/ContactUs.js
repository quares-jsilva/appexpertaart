import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ContactUsContainer } from '@/Containers'

const Stack = createStackNavigator()

const ContactUsNavigator = () => {

    return (
        <Stack.Navigator headerMode={'screen'} screenOptions={{title: 'Contacto', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}>
            <Stack.Screen name="ContactUs" component={ContactUsContainer} />
        </Stack.Navigator>
    )
}

export default ContactUsNavigator