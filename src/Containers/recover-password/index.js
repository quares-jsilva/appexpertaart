import React, { useState, useEffect, useCallback } from 'react'
import { Text, View, Image } from "react-native"
import { useTheme } from '@/Theme'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import styles from './styles'
import Analytics from '../../libs/analytics'
import { useDispatch, useSelector } from 'react-redux'
import { recoverPassword, resetState } from '../../Store/User/password'
import NumberInput from '../../Components/NumberInput'
import { showMessage } from '@/Components/MessageHelper'
import Loading from './loading';

const RecoverPasswordContainer = () => {

    const { Fonts, Gutters, Layout } = useTheme()
    const navigation = useNavigation();
    const dispatch = useDispatch()

    useEffect(() => {
        Analytics.logScreen('Recuperar contraseña', 'RecoverPasswordContainer')
    }, []);

    const {loading, status, message, error, data} = useSelector((state) => state.password )
    const[dni, setDni] = useState('')

    const [isNotValidDni, setIsNotValidDni] = useState(true)
    const [errorDniMessage, setErrorDniMessage] = useState('')

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

    const recoverPass = () => {
        Analytics.logEvent('RecuperarContrasenia', 'RecoverPasswordContainer')
        dispatch(recoverPassword(dni))
    }

    useFocusEffect(
        useCallback(() => {
            if(status != null) {
                let modalMessage
                let modalType = 'error'
                let modalAction
                if(status === 'success') {
                    modalMessage = 'Te enviamos la contraseña para que puedas ingresar.'
                    modalType = 'success'
                    modalAction = () => navigation.navigate('Login')
                }
                if(status === 'error') {
                    modalMessage = message
                }
                showMessage({
                    'message': modalMessage, 
                    'type': modalType,
                    'button': {
                        'text': 'Aceptar',
                        'onPress': modalAction && modalAction
                    },
                    'buttonHelp': modalType === 'error' ? {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'RecoverPassword' }) 
                    } : undefined
                })
            }
            return () => dispatch(resetState())
        }, [status])
    )

    return (
        loading ? <Loading/> :
        <View style={[Layout.fill,Layout.colCenter, Layout.justifyContentBetween]}>
        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
            <View style={[Gutters.largeBMargin, Gutters.smallPadding]}>
                <Text style={Fonts.sourceSansBold}>{'Ingresá tu DNI para recuperar tu contraseña'}</Text>
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
        </View>
        <View style={[Layout.fullWidth, Gutters.smallHPadding, Gutters.regularTMargin]}>
            <Button 
                titleStyle={Fonts.sourceSansLight} 
                buttonStyle={styles.buttonRadius} 
                title="RECUPERAR CONTRASEÑA" 
                onPress={() => {
                    Analytics.logEvent('RecuperarContrasenia', 'RecoverPassword')
                    recoverPass()
                }}
                disabled={isNotValidDni}
            />
            <Button 
                titleStyle={[Fonts.sourceSansLight, {color: '#389548'}]} 
                type='clear' 
                title="VOLVER" 
                onPress={() => navigation.goBack()}
            />
        </View>
    </View>
    )
}

export default RecoverPasswordContainer