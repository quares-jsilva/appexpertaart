import React, { useState, useEffect, useCallback } from 'react'
import { Text, View, Image } from "react-native"
import { useTheme } from '@/Theme'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Input, Button } from 'react-native-elements';
import crashlytics from '@react-native-firebase/crashlytics'
import styles from './styles'
import Analytics from '../../libs/analytics'
import NumberInput from '../../Components/NumberInput';
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '@/Store/User/registration'
import {showMessage} from '@/Components/MessageHelper'
import { setErrorId } from '@/Store/Error'
import Loading from './loading'

const RegisterStepTwoContainer = (param) => {

    const { Fonts, Gutters, Layout } = useTheme()
    const navigation = useNavigation()

    const {loading, status, message, error, existeUsuario} = useSelector((state) => state.registration )

    const { isEmployee } = param.route.params
    const[dni, setDni] = useState('')
    const[lastName, setLastName] = useState('')
    const[firstName, setFirstName] = useState('')
    const[cuit, setCuit] = useState('')
    const[email, setEmail] = useState('')

    const [isNotValidDni, setIsNotValidDni] = useState(true)
    const [errorDniMessage, setErrorDniMessage] = useState('')
    const [isNotValidLastName, setIsNotValidLastName] = useState(true)
    const [errorLastNameMessage, setErrorLastNameMessage] = useState('')
    const [isNotValidFirstName, setIsNotValidFirstName] = useState(true)
    const [errorFirstNameMessage, setErrorFirstNameMessage] = useState('')
    const [isNotValidCuit, setIsNotValidCuit] = useState(true)
    const [errorCuitMessage, setErrorCuitMessage] = useState('')
    const [isNotValidEmail, setIsNotValidEmail] = useState(true)
    const [errorEmailMessage, setErrorEmailMessage] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        Analytics.logScreen('Crear Usuario - Paso 2 - ' + isEmployee ? "Empleado" : "Empresa", 'RegisterStepTwoContainer')
    }, []);

    const validateDni = (value) => {
        setDni(value)
        setIsNotValidDni(false)
        setErrorDniMessage('')
        if(value == '') {
            setIsNotValidDni(true)
            setErrorDniMessage('Ingresá un DNI')
        }
        if(value.length < 7 || value.length > 8) {
            setIsNotValidDni(true)
            setErrorDniMessage('El DNI debe tener entre 7 y 8 caracteres')
        }
    }

    const validateLastName = (value) => {
        setLastName(value)
        setIsNotValidLastName(false)
        setErrorLastNameMessage('')
        if(value == '') {
            setIsNotValidLastName(true)
            setErrorLastNameMessage('Ingresá un apellido')
        }
        if(value.length < 2 || value.length > 20) {
            setIsNotValidLastName(true)
            setErrorLastNameMessage('El apellido debe tener entre 2 y 20 caracteres')
        }
    }

    const validateFirstName = (value) => {
        setFirstName(value)
        setIsNotValidFirstName(false)
        setErrorFirstNameMessage('')
        if(value == '') {
            setIsNotValidFirstName(true)
            setErrorFirstNameMessage('Ingresá un nombre')
        }
        if(value.length < 2 || value.length > 20) {
            setIsNotValidFirstName(true)
            setErrorFirstNameMessage('El apellido debe tener entre 2 y 20 caracteres')
        }
    }

    const validateCuit = (value) => {
        setCuit(value)
        setIsNotValidCuit(false)
        setErrorCuitMessage('')
        if(value == '') {
            setIsNotValidCuit(true)
            setErrorCuitMessage('Ingresá el CUIT de la empresa')
        }
        if(value.length !== 11) {
            setIsNotValidCuit(true)
            setErrorCuitMessage('El CUIT debe tener 11 caracteres')
        }
    }

    const validateEmail = (value) => {
        setEmail(value)
        setIsNotValidEmail(false)
        setErrorEmailMessage('')
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!re.test(value)) {
            setIsNotValidEmail(true)
            setErrorEmailMessage('Ingresá un e-mail válido')
        }
    }

    const register = async () => {
        Analytics.logEvent('CreacionDeUsuario', 'RegisterStepTwoContainer')
        dispatch(registerUser({
            dni: dni,
            cuit: cuit,
            nombre: firstName,
            apellido: lastName,
            email: email
        }))
    }

    useEffect(() => {
        if(existeUsuario == null) {
            if(status != null) {
                let modalMessage
                let modalType = 'error'
                let modalAction
                let modalTitle = 'AVISO'
                switch (status) {
                    case 'EXISTE_USUARIO':
                        modalMessage = 'Ya existe un Usuario registrado para este documento.'
                        break
                    case 'CONTRATO_NO_VIGENTE':
                    case 'CONTRATO_NO_EXISTENTE':
                        modalMessage = message
                        break
                    case 'FLUJO_NO_IMPL':
                        modalMessage = message
                        modalAction = () => navigation.navigate('BecomeUser')
                        break
                    case 'USUARIO_EXISTENTE':
                    case 'SOLICITUD_EN_CURSO':
                    case 'CREACION_SOLICITUD':
                        modalMessage = message
                        modalType = 'warning'
                        modalAction = () => navigation.navigate('Login')
                        break
                    case 'USUARIO_CREADO_OK':
                    case 'VINCULO_CREADO_OK':
                        modalMessage = message
                        modalTitle = 'REGISTRACIÓN EXITOSA'
                        modalType = 'success'
                        modalAction = () => navigation.navigate('Login')
                      break;
                    case 'NO_SE_PUDO_CREAR_EL_USUARIO':
                        modalMessage = message
                      break
                    default:
                        modalMessage = 'Ha ocurrido un error, intentá nuevamente en unos minutos.'
                        modalType = 'error'
                }
                if(modalType === 'error') {
                    dispatch(setErrorId())

                    crashlytics().setAttributes({status, message})
                    crashlytics().recordError(new Error(message))
                }
                showMessage({
                    'title': modalTitle,
                    'message': modalMessage, 
                    'type': modalType,
                    'button': {
                        'text': 'Aceptar',
                        'onPress': modalAction && modalAction
                    },
                    'buttonHelp': modalType === 'error' ? {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'RegisterStep2' }) 
                    } : undefined
                  })
            }
        } else {
            dispatch(setErrorId())
            showMessage({
                'message': 'Ya existe un Usuario registrado para este documento.', 
                'type': 'warning',
            })
        }
    }, [existeUsuario]);

    useFocusEffect(
        useCallback(() => {
            if(status != null) {
                switch (status) {
                    case 'EXISTE_USUARIO':
                        dispatch(setErrorId())
                        showMessage({
                            'message': message, 
                            'type': 'error',
                            'buttonHelp': {
                                onPress: () => navigation.navigate('problemReport', { errorFrom: 'RegisterStep2' }) 
                            }
                        })
                        break
                    case 'CONTRATO_NO_VIGENTE':
                    case 'CONTRATO_NO_EXISTENTE':
                        dispatch(setErrorId())
                        crashlytics().setAttributes({status, message})
                        crashlytics().recordError(new Error('Error en registro paso 2'))
                        showMessage({
                            'message': message, 
                            'type': 'error',
                            'buttonHelp': {
                                onPress: () => navigation.navigate('problemReport', { errorFrom: 'RegisterStep2' }) 
                            }
                        })
                        break;
                    case 'FLUJO_NO_IMPL':
                        dispatch(setErrorId())
                        crashlytics().setAttributes({status, message})
                        crashlytics().recordError(new Error('Error en registro paso 2'))
                        showMessage({
                            'message': message, 
                            'type': 'error',
                            'button': {
                                'text': 'Aceptar',
                                'onPress': () => navigation.navigate('BecomeUser')
                            },
                            'buttonHelp': {
                                onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'RegisterStep2' }) 
                            }
                        })
                        break;
                    case 'USUARIO_EXISTENTE':
                    case 'SOLICITUD_EN_CURSO':
                    case 'CREACION_SOLICITUD':
                        crashlytics().setAttributes({status, message})
                        crashlytics().recordError(new Error('Error en registro paso 2'))
                        showMessage({
                            'message': message, 
                            'type': 'warning',
                            'button': {
                                'text': 'Aceptar',
                                'onPress': () => navigation.navigate('Login')
                            }
                          })
                      break;
                    case 'USUARIO_CREADO_OK':
                    case 'VINCULO_CREADO_OK':
                        showMessage({
                            'title': 'REGISTRACIÓN EXITOSA',
                            'message': message, 
                            'type': 'success',
                            'button': {
                                'text': 'Aceptar',
                                'onPress': () => navigation.navigate('Login')
                            }
                          })
                      break;
                    case 'NO_SE_PUDO_CREAR_EL_USUARIO':
                        dispatch(setErrorId())
                        crashlytics().setAttributes({status, message})
                        crashlytics().recordError(new Error('Error en registro paso 2'))
                        showMessage({
                            'message': message, 
                            'type': 'error',
                            'buttonHelp': {
                                onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'RegisterStep2' }) 
                            }
                        })
                      break;
                    default:
                        dispatch(setErrorId())
                        crashlytics().setAttributes({status, message})
                        crashlytics().recordError(new Error('Error en registro paso 2'))
                        showMessage({
                            'message': 'Ha ocurrido un error, intentá nuevamente en unos minutos. Si persiste, comunicate con Experta Seguros.', 
                            'type': 'error',
                            'buttonHelp': {
                                onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'RegisterStep2' }) 
                            }
                        })
                }
            }
        }, [status])
    )

    return (
        loading ? <Loading/> :
        <View style={[Layout.fill,Layout.colCenter, Layout.justifyContentBetween]}>
            <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                <View style={[Gutters.largeBMargin, Gutters.regularPadding]}>
                    <Text style={Fonts.sourceSansBold}>{'Creá tu usuario'}</Text>
                </View>
                <NumberInput
                    label='DNI'
                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                    value={dni}
                    onChange={value => validateDni(value)}
                    errorStyle={{ color: 'red' }}
                    errorMessage={errorDniMessage}
                />
                <Input
                    label='Apellido'
                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                    value={lastName}
                    onChangeText={value => validateLastName(value)}
                    errorStyle={{ color: 'red' }}
                    errorMessage={errorLastNameMessage}
                />
                <Input
                    label='Nombre'
                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                    value={firstName}
                    onChangeText={value => validateFirstName(value)}
                    errorStyle={{ color: 'red' }}
                    errorMessage={errorFirstNameMessage}
                />
                {
                    !isEmployee &&
                    (
                        <NumberInput
                            label='CUIT de la empresa'
                            style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                            labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                            value={cuit}
                            onChange={value => validateCuit(value)}
                            errorStyle={{ color: 'red' }}
                            errorMessage={errorCuitMessage}
                        />
                    )
                }
                <Input
                    label='Email'
                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                    value={email}
                    onChangeText={value => validateEmail(value.trim())}
                    errorStyle={{ color: 'red' }}
                    errorMessage={errorEmailMessage}
                    autoCapitalize={'none'}
                />
            </View>
            <View style={[Layout.fullWidth, Gutters.smallHPadding, Gutters.regularTMargin]}>
                <Button 
                    titleStyle={Fonts.sourceSansLight} 
                    buttonStyle={styles.buttonRadius} 
                    title="REGISTRARME" 
                    onPress={() => register()}
                    disabled={
                        isNotValidDni || 
                        isNotValidFirstName || 
                        isNotValidLastName || 
                        isNotValidEmail ||
                        (!isEmployee ? isNotValidCuit : false)
                    }
                />
                <Button 
                    titleStyle={[Fonts.sourceSansLight, {color: '#389548'}]} 
                    type='clear' 
                    title="VOLVER" 
                    onPress={() => navigation.goBack()
                }/>
            </View>
        </View>
    )
}

export default RegisterStepTwoContainer