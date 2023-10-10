import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text } from "react-native"
import { useSelector, useDispatch } from 'react-redux'
import { Card, Button, Input } from 'react-native-elements'
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import { unwrapResult } from '@reduxjs/toolkit'

import Analytics from '../../libs/analytics'
import { updatePersonalData, getPersonalData } from '@/Store/User/personalData'
import NumberInput from '../../Components/NumberInput'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import Loading from './loading'
import { resetStatus } from '@/Store/Help'
import { showMessage } from '@/Components/MessageHelper'

const LoginEditUserContainer = () => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const { pwid, data, status, message, profiles, homeRoute } = useSelector((state) => state.user )
    const { data: personalData, loading } = useSelector((state) => state.personalData )
    const [mail, setMail] = useState('')
    const [prefix, setPrefix] = useState('')
    const [phone, setPhone] = useState('')
    const [isNotValidPrefix, setIsNotValidPrefix] = useState(personalData.prefijoCelular && personalData.prefijoCelular === '')
    const [errorPrefixMessage, setErrorPrefixMessage] = useState('')
    const [isNotValidPhone, setIsNotValidPhone] = useState(personalData.celular && personalData.celular === '')
    const [errorPhoneMessage, setErrorPhoneMessage] = useState('')

    useEffect(() => {
        setMail(personalData.email ? personalData.email : '')
        setPrefix(personalData.prefijoCelular ? personalData.prefijoCelular : '')
        setPhone(personalData.celular ? personalData.celular : '')
    }, [personalData])

    useEffect(() => {
        Analytics.logScreen('Confirmacion de datos de usuario', 'LoginEditContainer')
    }, []);

    useEffect(()=>{
        if(pwid && data.documento){
            dispatch(getPersonalData({ dni: data.documento, usuario: pwid }))
        }
    },[data, pwid])

    const validatePrefix = (value) => {
        setPrefix(value)
        setIsNotValidPrefix(false)
        setErrorPrefixMessage('')
        if(value == '') {
            setIsNotValidPrefix(true)
            setErrorPrefixMessage('El prefijo es requerido')
        }
        if(value.length < 2 || value.length > 5) {
            setIsNotValidPrefix(true)
            setErrorPrefixMessage('El prefijo debe tener entre 2 y 5 caracteres')
        }
    }

    const validatePhone = (value) => {
        setPhone(value)
        setIsNotValidPhone(false)
        setErrorPhoneMessage('')
        if(value == '') {
            setIsNotValidPhone(true)
            setErrorPhoneMessage('El número es requerido')
        }
        if(value.length < 5 || value.length > 8) {
            setIsNotValidPhone(true)
            setErrorPhoneMessage('El número debe tener entre 4 y 9 caracteres')
        }
    }

    const validateEmail = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const isNotValidMail = mail == '' || !validateEmail(mail)
    const errorMailMessage = isNotValidMail ? 'El email es requerido' : ''

    const saveAndRedirect = async () => {
        Analytics.logEvent('ActualizacionDatosUsuario', 'MyDataContainer')
        try {
            const result = await dispatch(updatePersonalData({
                dni: data.documento,
                email: mail,
                prefijoCelular: prefix,
                celular: phone
            }))
            const updateResult = unwrapResult(result)
            dispatch(resetStatus())
            navigation.navigate(homeRoute)
        } catch(error) {
            showMessage({
                'message': error.message, 
                'type': 'error',
                'buttonHelp': {
                    onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'LoginEditUser' }) 
                }
            })
        }
    }

    return (
            loading ? <Loading/> :
                <ScrollView keyboardShouldPersistTaps={'always'}>
                    <View style={[Layout.fill, Layout.colCenter]}>
                        <View style={[Layout.center, Gutters.smallHPadding, Gutters.regularTPadding]}>
                            <Text style={[Fonts.sourceSansBold, {fontSize: 20}]}>
                                {'Confirmá o modificá tus datos para ingresar'}
                            </Text>
                        </View>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                                <View style={Layout.fill}>
                                    <Input
                                        label='Email'
                                        style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                        labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                        value={mail}
                                        onChangeText={value => setMail(value)}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={errorMailMessage}
                                        autoCapitalize={'none'}
                                    />
                                    <View style={Layout.row}>
                                        <NumberInput
                                            label='Cod. Área'
                                            containerStyle={Layout.fill}
                                            style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                            labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                            value={prefix}
                                            onChange={value => validatePrefix(value)}
                                            errorStyle={{ color: 'red' }}
                                            errorMessage={errorPrefixMessage}
                                        />
                                        <NumberInput
                                            label='Nro. Celular'
                                            containerStyle={{flex: 2}}
                                            style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                            labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                            value={phone}
                                            onChange={value => validatePhone(value)}
                                            errorStyle={{ color: 'red' }}
                                            errorMessage={errorPhoneMessage}
                                        />
                                    </View>
                                    <Text style={[Fonts.sourceSansSemibold]}>
                                            {'Ingresá el código de área con el 0 y el celular sin el 15'}
                                    </Text>
                                </View>
                            </Card>
                        </View>
                        <View style={[Layout.fullWidth, Gutters.smallPadding]}>
                            <Button 
                                buttonStyle={{borderRadius: 80, backgroundColor: '#389548'}}
                                titleStyle={Fonts.sourceSansLight}
                                title="GUARDAR"
                                onPress={() => saveAndRedirect()}
                                disabled={(isNotValidMail || isNotValidPrefix || isNotValidPhone)}
                            />
                        </View>
                    </View>
                </ScrollView>
    )
}

export default LoginEditUserContainer