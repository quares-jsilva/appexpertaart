import React, {useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, View } from "react-native"
import { useTheme } from '@/Theme'
import { Card, Button, Input } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import Analytics from '../../libs/analytics'
import styles from './styles'
import { changePassword, resetState } from '@/Store/User/password'
import {showMessage} from '@/Components/MessageHelper'
import { setCredentials } from '@/Store/User/auth'
import { Spinner } from '@/Components'
import Loading from './loading'

const ChangePasswordContainer = (param) => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const { loading, message, status } = useSelector((state) => state.password )
    const { credentials } = useSelector((state) => state.auth )
    const[ oldPassword, setOldPassword] = useState('')
    const[ newPassword, setNewPassword] = useState('')
    const[ confirmPassword, setConfirmPassword] = useState('')
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data } = useSelector((state) => state.user)
    const { fromLogin } = param.route.params

    useEffect(() => {
        Analytics.logScreen('Cambio de contraseña', 'ChangePasswordContainer')
    }, []);

    useFocusEffect(
        useCallback(() => {
            if(!!status){
                if(status === 'error') {
                    showMessage({
                        'message': message,
                        'type': 'error',
                        'buttonHelp': { 
                            onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ChangePassword' }) 
                        }
                    })
                } else {
                    showMessage({
                        'message': 'Se ha cambiado su contraseña',
                        'type': 'warning',
                        'button': {
                            'text': 'Aceptar',
                            'onPress': () => {
                                dispatch(resetState())
                                dispatch(setCredentials({username: credentials.username, password: newPassword}))
                                navigation.navigate('Login')
                            }
                        },
                    })
                }
            }
            
        }, [status, message])
    )

    return (
        loading ? <Loading/> :
            <ScrollView keyboardShouldPersistTaps={'always'}>
                <View style={[Layout.fill]}>
                    <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                        <Card containerStyle={[Common.card, Layout.fullWidth]}>
                            <View style={Layout.fill}>
                                <Input
                                    label='Contraseña actual'
                                    value={oldPassword}
                                    onChangeText={value => setOldPassword(value)}
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    secureTextEntry={true}
                                    autoCapitalize={'none'}
                                />
                                <Input
                                    label='Nueva contraseña'
                                    value={newPassword}
                                    onChangeText={value => setNewPassword(value)}
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    secureTextEntry={true}
                                    autoCapitalize={'none'}
                                />
                                <Input
                                    label='Repetir contraseña'
                                    value={confirmPassword}
                                    onChangeText={value => setConfirmPassword(value)}
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    secureTextEntry={true}
                                    autoCapitalize={'none'}
                                />
                            </View>
                        </Card>
                    </View>
                    <View style={[Gutters.smallPadding]}>
                        <Button 
                            onPress={()=> {
                                    Analytics.logEvent('CambioDeContrasenia', 'ChangePasswordContainer')
                                    dispatch(changePassword(
                                        {
                                            viejoPassword: oldPassword,
                                            nuevoPassword: newPassword,
                                            validacionNuevoPassword: confirmPassword,
                                        }
                                    ))
                                }
                            }
                            buttonStyle={styles.buttonRadius}
                            titleStyle={Fonts.sourceSansLight}
                            title="CAMBIAR CONTRASEÑA"
                        />
                    </View>
                </View>
            </ScrollView>
    )
}

export default ChangePasswordContainer