import React, { useState, useEffect, useCallback } from 'react'
import { ScrollView, View } from "react-native"
import { useTheme } from '@/Theme'
import { Card, Button, Input } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import styles from './styles'
import Analytics from '../../libs/analytics'
import { useSelector, useDispatch } from 'react-redux'
import NumberInput from '../../Components/NumberInput'
import { showMessage } from '@/Components/MessageHelper'
import { getPersonalData, updatePersonalData } from '@/Store/User/personalData'
import Loading from './loading'

const MyDataContainer = () => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const navigation = useNavigation()
    const { data, message, pwid } = useSelector((state) => state.user )
    const { status, data: personalData, loading } = useSelector((state) => state.personalData )
    const [mail, setMail] = useState('')
    const [prefix, setPrefix] = useState('')
    const [phone, setPhone] = useState('')
    const [isNotValidPrefix, setIsNotValidPrefix] = useState(false)
    const [errorPrefixMessage, setErrorPrefixMessage] = useState('')
    const [isNotValidPhone, setIsNotValidPhone] = useState(false)
    const [errorPhoneMessage, setErrorPhoneMessage] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        setMail(personalData.email ? personalData.email : '')
        setPrefix(personalData.prefijoCelular ? personalData.prefijoCelular : '')
        setPhone(personalData.celular ? personalData.celular : '')
    }, [personalData])

    useEffect(()=>{
        if(pwid && data.documento){
            dispatch(getPersonalData({ dni: data.documento, usuario: pwid }))
        }
    },[data, pwid])

    useEffect(() => {
        Analytics.logScreen('Mis Datos', 'MyDataContainer')
    }, []);

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

    const saveData = async () => {
        Analytics.logEvent('ActualizacionDatosUsuario', 'MyDataContainer')
        let params = {
            dni: data.documento,
            email: mail,
            prefijoCelular: prefix,
            celular: phone
        }
        dispatch(updatePersonalData(params))
    }

    useFocusEffect(
        useCallback(() => {
            if(status === 'error') {
                showMessage({
                    'message': message, 
                    'type': 'error',
                    'buttonHelp': {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'MyData' }) 
                    }
                })
            }
            if(status === 'success') {
                showMessage({
                    'message': 'Se guardaron tus datos', 
                    'type': 'success',
                    'button': {
                        'text': 'Aceptar',
                    }
                })
            }
        }, [status])
    )

    return (
        loading ? <Loading/> :
        <ScrollView keyboardShouldPersistTaps={'always'}>
            <View style={[Layout.fill]}>
                <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                    <Card containerStyle={[Common.card, Layout.fullWidth]}>
                        <View style={Layout.fill}>
                            <Input
                                label='Domicilio'
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                value={`${personalData.domicilio ? personalData.domicilio : ''} ${personalData.numeroCasa ? personalData.numeroCasa : ''}`}
                                disabled
                            />
                            <Input
                                label='DNI'
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                value={`${data.documento ? data.documento : ''}`}
                                disabled
                            />
                            {   personalData.cbu &&
                                <Input
                                    label='CBU'
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    value={`${personalData.cbu}`}
                                    disabled
                                />
                            }
                            <Input
                                label='Email'
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                value={mail}
                                onChangeText={value => setMail(value)}
                                errorStyle={{ color: 'red' }}
                                errorMessage={errorMailMessage}
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
                                    containerStyle={styles.fillTwo}
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    value={phone}
                                    onChange={value => validatePhone(value)}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={errorPhoneMessage}
                                />
                            </View>
                        </View>
                    </Card>
                </View>
                <View style={[Gutters.smallPadding]}>
                    <Button 
                        buttonStyle={styles.buttonRadius}
                        titleStyle={Fonts.sourceSansLight}
                        title="CONFIRMAR"
                        onPress={() => saveData()}
                        disabled={(isNotValidMail || isNotValidPrefix || isNotValidPhone)}
                    />
                </View>
            </View>
        </ScrollView>
        
    )
}

export default MyDataContainer