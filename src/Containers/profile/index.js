import React, { useEffect, useCallback } from 'react'
import { ScrollView, Text, View, Image } from "react-native"
import { useTheme } from '@/Theme'
import { ListItem, Icon } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import styles from './styles'
import Analytics from '../../libs/analytics'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/Store/User/auth'
import { showMessage } from '@/Components/MessageHelper'
import { navigateAndSimpleReset } from '@/Navigators/Root'

const list = [
    {
        title: 'Mis datos',
        firebaseAlias: 'Misdatos',
        icon: '',
        path: 'MyData'
    },
    {
        title: 'Cambiar contraseña',
        firebaseAlias: 'CambiarContrasenia',
        icon: '',
        path: 'ChangePassword'
    },
    {
        title: 'Ayuda',
        firebaseAlias: 'Ayuda',
        icon: '',
        path: 'Help'
    },
    {
        title: 'Cerrar sesión',
        firebaseAlias: 'CerrarSesion',
        icon: '',
        action: 'Login'
    },
]

const ProfileContainer = () => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const navigation = useNavigation();
    const { data } = useSelector((state) => state.user )
    const dispatch = useDispatch()

    useEffect(() => {
        Analytics.logScreen('Mi Perfil', 'ProfileContainer')
    }, []);

    const userLogout = () => {
        navigateAndSimpleReset('Main')
        dispatch({ type: 'RESET_STORE' });
    }

    return (
        <ScrollView>
            {
                <View style={[Layout.fill, Layout.colCenter, Gutters.smallPadding]}>
                    <View style={[Layout.fill, Layout.fullWidth, Layout.center]}>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Common.card, Gutters.smallPadding]}>
                            <View style={styles.imageSize}>
                                <Image style={[Layout.fullSize]} resizeMode={'contain'} source={Images.avatar}/>
                            </View>
                            <Text style={Fonts.sourceSansSemibold}>{data.nombre || 'Mis Datos'}</Text>
                        </View>
                    </View>
                    <View style={[Layout.fullWidth, Common.card, Gutters.smallPadding, Gutters.smallTMargin]}>
                        {
                            list.map((item, i) => (
                            <ListItem key={i} bottomDivider onPress={() => {
                                    if(item.title === 'Cerrar sesión'){
                                        userLogout()
                                    }else{
                                        Analytics.logEvent('IrA' + item.firebaseAlias, 'Profile')
                                        navigation.navigate(item.path, item.title === 'Ayuda' ? {errorFrom: 'Perfil'} : {})
                                    }
                                }}
                            >
                                <ListItem.Content>
                                <ListItem.Title style={Fonts.sourceSansLight}>{item.title}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                            ))
                        }
                    </View>
                </View>
            }
        </ScrollView> 
    )

}

export default ProfileContainer