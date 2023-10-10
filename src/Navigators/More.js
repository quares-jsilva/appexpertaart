import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { View, Text, Button, Dimensions } from 'react-native'
import { DrawerContainer } from '../Containers'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

let MainNavigator = require('@/Navigators/Main').default

const MoreNavigator = () => {

    return (
        <Drawer.Navigator 
          initialRouteName="Main" 
          screenOptions={{swipeEnabled: false}}
          drawerContent={props => <DrawerContainer {...props} />}
          drawerStyle={{
            width: Dimensions.get('window').width
          }}>
            <Drawer.Screen name="Main" component={MainNavigator} />
        </Drawer.Navigator>
    )
}

export default MoreNavigator