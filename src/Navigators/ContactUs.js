import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ContactUsContainer } from '@/Containers'

const Stack = createStackNavigator()

const ContactUsNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{title: 'Contacto', headerTitleAlign: 'center', headerMode: 'screen', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}>
            <Stack.Screen name="ContactUs" component={ContactUsContainer} />
        </Stack.Navigator>
    )
}

export default ContactUsNavigator