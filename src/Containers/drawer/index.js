import React, { useEffect, useCallback } from 'react'
import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native"
import { useTheme } from '@/Theme'
import { ListItem, Avatar, Icon } from 'react-native-elements'
import { useNavigation, useFocusEffect, DrawerActions } from '@react-navigation/native'
import Analytics from '../../libs/analytics'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/Store/User/auth'
import { showMessage } from '@/Components/MessageHelper'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import ButtonSeguros from '../../Components/ButtonSeguros'
import Products from '../../Components/Products'

const DrawerContainer = () => {

    const { Fonts, Gutters, Layout, Images } = useTheme()
    const navigation = useNavigation();
    const { status, message, data, homeRoute, profiles } = useSelector((state) => state.user )
    const { credentials, tokenIdentityManager, tokenApiManager } = useSelector((state) => state.auth )
    const dispatch = useDispatch()

    useFocusEffect(
        useCallback(() => {
            if(status === 'error') {
                showMessage({
                    'message': message, 
                    'type': 'error',
                    'button': {
                        'text': 'Aceptar',
                        'onPress': () => navigation.goBack()
                    },
                    'buttonHelp': {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'Profile' }) 
                    }
                })
            }
        }, [status])
    )

    useEffect(() => {
        Analytics.logScreen('Mi Perfil', 'ProfileContainer')
    }, []);

    const userLogout = () => {
        navigateAndSimpleReset('Main')
        dispatch(logout())
    }

    return (
        <>
            <View style={[Gutters.smallPadding, Gutters.smallTMargin, {height: 50}]}>
                <View style={[Layout.row, {marginLeft: 5}]}>
                    <TouchableOpacity style={[Layout.alignItemsStart]} onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}>
                        <Icon
                            type="MaterialIcons"
                            name='arrow-back'
                            size={25}
                        />
                    </TouchableOpacity>
                    <View style={[{width: '90%', marginLeft: '36%'}]}>
                        <Text style={{fontFamily: 'SourceSansPro-Light', fontSize: 20}}>Más</Text>
                    </View>
                </View>
            </View>
            <ScrollView>
                {
                    <View style={[Layout.fill, Layout.colCenter]}>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding, {backgroundColor: 'whitesmoke'}]}>
                            <View style={[Layout.fill, Layout.row, Layout.fullWidth, Gutters.smallPadding]}>
                                <Avatar 
                                    size={'medium'} 
                                    containerStyle={[{
                                        backgroundColor: "#FFFFFF",
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 1,
                                        },
                                        shadowOpacity: 0.20,
                                        shadowRadius: 1.41,
                                        elevation: 5,
                                    }, Gutters.smallRMargin]} 
                                    rounded 
                                    source={Images.avatar}
                                />
                                <View style={Layout.colHCenter}>
                                    <Text style={[Fonts.sourceSansSemibold, {color: 'grey', fontSize: 18}]}>{data.nombre || 'Mis Datos'}</Text>
                                    <Text style={[Fonts.sourceSansSemibold, {color: '#389548', fontSize: 16}]} onPress={() => {
                                        Analytics.logEvent('IrAPerfil', 'Profile')
                                        navigation.navigate('Profile')}
                                    }>{'Mi Perfil'}</Text>
                                </View>
                            </View>
                            <View style={[Layout.fullWidth, Gutters.smallPadding]}>
                                <ButtonSeguros/>
                            </View>
                        </View>
                        <View style={[Layout.fullWidth, Gutters.smallPadding, Gutters.smallTMargin]}>
                            <ListItem 
                                containerStyle={{paddingVertical: 0}}
                                onPress={() => {
                                Analytics.logEvent('IrA' + homeRoute, 'Profile')
                                navigation.navigate(homeRoute)}
                            }>
                                <Image 
                                    source={Images['drawerInicio']}
                                    style={[{height: 25, width: 25}]} 
                                    resizeMode={'contain'}
                                />
                                <ListItem.Content>
                                    <ListItem.Title style={[Fonts.sourceSansSemibold, {color: 'grey'}]}>{'Inicio'}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem onPress={() => {
                                Analytics.logEvent('IrAContactenos', 'Profile')
                                navigation.navigate('Contacto')}
                            }>
                                <Image 
                                    source={Images['drawerMensaje']}
                                    style={[{height: 25, width: 25}]} 
                                    resizeMode={'contain'}
                                />
                                <ListItem.Content>
                                    <ListItem.Title style={[Fonts.sourceSansSemibold, {color: 'grey'}]}>{'Contacto'}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem 
                                containerStyle={[Gutters.regularBPadding, {paddingVertical: 0}]}
                                onPress={() => {
                                    Analytics.logEvent('IrANotificaciones', 'Profile')
                                    navigation.navigate('Notificaciones')}
                            }>
                                <Image 
                                    source={Images['drawerNotificacion']}
                                    style={[{height: 25, width: 25}]} 
                                    resizeMode={'contain'}
                                />
                                <ListItem.Content>
                                    <ListItem.Title style={[Fonts.sourceSansSemibold, {color: 'grey'}]}>{'Notificaciones'}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem onPress={() => {
                                Analytics.logEvent('IrAAyuda', 'Profile')
                                navigation.navigate('Help', {errorFrom: 'Perfil'})
                            }}>
                                <Image 
                                    source={Images['drawerAyuda']}
                                    style={[{height: 25, width: 25}]} 
                                    resizeMode={'contain'}
                                />
                                <ListItem.Content>
                                    <ListItem.Title style={[Fonts.sourceSansSemibold, {color: 'grey'}]}>{'Ayuda'}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            <ListItem 
                                containerStyle={{paddingVertical: 0}}
                                onPress={() => userLogout()}>
                                    <Image 
                                        source={Images['drawerCerrar']}
                                        style={[{height: 25, width: 25}]} 
                                        resizeMode={'contain'}
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title style={[Fonts.sourceSansSemibold, {color: 'grey'}]}>{'Cerrar Sesión'}</ListItem.Title>
                                    </ListItem.Content>
                            </ListItem>
                        </View>
                        <View style={[Layout.fullWidth, Gutters.regularTMargin, Gutters.regularTPadding]}>
                            <Products/>
                        </View>
                    </View>
                }
            </ScrollView> 
        </>
    )

}

export default DrawerContainer