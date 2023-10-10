import React, { useEffect } from 'react'
import { Text, View, Image } from "react-native"
import { Button } from 'react-native-elements'
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import Analytics from '../../libs/analytics'
import { useDispatch, useSelector } from 'react-redux'
import { getProfiles } from '@/Store/User/user'
import Loading from './loading'
import { showMessage } from '@/Components/MessageHelper'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import { logout } from '@/Store/User/auth'

const InitialScreenContainer = () => {

    const { Fonts, Gutters, Layout } = useTheme()
    const navigation = useNavigation();
    const { loading, status, message, data, pwid, roles, profiles, homeRoute } = useSelector((state) => state.user )
    const dispatch = useDispatch()

    useEffect(() => {
        if(!!data && !!pwid && !!roles){
            dispatch(getProfiles({dni: data.documento, pwid, roles}))
        }
    }, [data, pwid, roles])

    const replyRequest = () => {
        dispatch(getProfiles({dni: data.documento, pwid, roles}))
    }

    useEffect(() => {
        if(profiles.length > 0){
            profiles.forEach((profile) => {
                let profileName = profile === "USER_ART_CLIENTE" ? "perfilCliente" : "perfilAfiliado"
                Analytics.setUserProperty(profileName)
            })
            navigation.navigate(homeRoute)
        }
    }, [profiles])

    const userLogout = () => {
        navigateAndSimpleReset('Main')
        dispatch(logout())
    }

    useEffect(() => {
        if(status === 'success' && profiles.length === 0){
            showMessage({
                'message': 'No tenes permisos para ingresar. Comunicate con el Centro de Atención al Cliente 0800 7777 278(ART).',
                'type': 'warning',
                'button': {
                    onPress: () => userLogout() 
                },
                'buttonHelp': {
                    onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'Login' }) 
                }
            })
        }
    }, [status, profiles])

    useEffect(() => {
        Analytics.logScreen('Mi Perfil', 'ProfileContainer')
    }, [])

    return (
        <View style={Layout.fill}>
            {
                (!loading && status === 'error') ? 
                (
                    <View style={[ Layout.fullSize]}>
                        <View style={[Layout.fill, Layout.center]}>
                            <Text 
                                style={[Fonts.sourceSansRegular, Gutters.smallPadding, Gutters.smallTMargin, {textAlign: 'center', color: 'black'}]}
                            >
                                { message }
                            </Text>
                            <View style={Gutters.smallTMargin}>
                                <Button 
                                    titleStyle={[Fonts.sourceSansLight, {color: 'black'}]} 
                                    buttonStyle={{ borderRadius: 80, borderColor: 'black'}}
                                    type={'outline'} 
                                    title="REINTENTAR" 
                                    onPress={replyRequest}
                                />
                            </View> 
                        </View>
                    </View>
                ) : 
                <Loading/>   
            }
        </View>
    )

}

export default InitialScreenContainer