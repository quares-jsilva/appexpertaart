import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { MyDataContainer, ProfileContainer, ChangePasswordContainer } from '@/Containers'

const Stack = createStackNavigator()

const ProfileNavigator = () => {

    return (
        <Stack.Navigator 
            headerMode={'screen'} 
            screenOptions={{
                title: 'Mi Perfil', 
                headerTitleAlign: 'center', 
                headerTitleStyle: {fontFamily: 'SourceSansPro-Light'},
                headerBackTitleVisible: false
            }}>
            <Stack.Screen name="Profile" component={ProfileContainer} />
            <Stack.Screen name="MyData" component={MyDataContainer} options={{title: 'Mis Datos', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
            <Stack.Screen name="ChangePassword" component={ChangePasswordContainer} options={{title: 'Cambiar contraseña', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
        </Stack.Navigator>
    )
}

export default ProfileNavigator