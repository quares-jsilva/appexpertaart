import React, { useState, useEffect, useCallback } from 'react'
import { ScrollView, View, Image, Text, ImageBackground } from "react-native"
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@/Theme'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { Card, Button, Input, Icon } from 'react-native-elements'
import * as ImagePicker from 'react-native-image-picker';
import styles from './styles'
import Analytics from '../../libs/analytics'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sendComments, setReportTime } from '@/Store/Help'
import { showMessage } from '@/Components/MessageHelper'
import Loading from './loading'
import NumberInput from '../../Components/NumberInput'

const ProblemReportContainer = (param) => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { errorFrom } = param.route.params
    const { data, pwid, homeRoute } = useSelector((state) => state.user )
    const { errorId } = useSelector((state) => state.error )
    const { status, message, reportTime, loading } = useSelector((state) => state.help )
    const [description, setDescription] = useState('')
    const [mail, setMail] = useState('')
    const [images, setImages] = useState([])
    const [images64, setImages64] = useState([])
    const [dni, setDni] = useState('')

    const addImage = async (image) => {
        setImages([...images, image])
        setImages64([...images64, 'data:image/jpeg;base64,' + image.base64])
    }

    const [isNotValidMail, setIsNotValidMail] = useState(true)
    const [errorMailMessage, setErrorMailMessage] = useState('')
    const [isNotValidDescription, setIsNotValidDescription] = useState(true)
    const [errorDescriptionMessage, setErrorDescriptionMessage] = useState('')
    const [isNotValidDni, setIsNotValidDni] = useState(false)
    const [errorDniMessage, setErrorDniMessage] = useState('')

    const validateDescription = (value) => {
        setDescription(value)
        setIsNotValidDescription(false)
        setErrorDescriptionMessage('')
        if(value == '' || value.length < 10) {
            setIsNotValidDescription(true)
            setErrorDescriptionMessage('Ingrese una descripción de al menos 10 caracteres')
        }
    }

    const validateEmail = (value) => {
        setMail(value)
        setIsNotValidMail(false)
        setErrorMailMessage('')
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!re.test(value)) {
            setIsNotValidMail(true)
            setErrorMailMessage('Ingresá un email válido')
        }
    }

    const validateDni = (value) => {
        setDni(value)
        setIsNotValidDni(false)
        setErrorDniMessage('')
        if(!value.match("[0-9]+")) {
            setIsNotValidDni(true)
            setErrorDniMessage('El DNI sólo puede tener números')
        }
        if(value == '') {
            setIsNotValidDni(true)
            setErrorDniMessage('El DNI es requerido')
        }
        if(value.length < 7 || value.length > 8) {
            setIsNotValidDni(true)
            setErrorDniMessage('El DNI debe tener entre 7 y 8 caracteres')
        }
    }

    const deleteImage = (imageKey) => {
        setImages(images.filter((item, key) => key !== imageKey ))
    }

    const send = () => {
        Analytics.logEvent('EnvioDeReporteDeProblema', 'ProblemReportContainer')
        dispatch(sendComments({
            description: description,
            images: images64,
            email: mail,
            dni: dni,
            errorFrom: (errorFrom ? errorFrom : 'Help') + (!!errorId ? ' | ErrorId: ' + errorId : ''),
            app: 'art'
        }))
    }

    useFocusEffect(
        useCallback(() => {
            if(status === 'error') {
                showMessage({
                    'message': message, 
                    'type': 'error',
                    'button': {
                        'text': 'Aceptar',
                    },
                })
            }
            if(status === 'success') {
                dispatch(setReportTime((new Date()).toString()))
                showMessage({
                    'message': '¡Gracias! Recibimos el reporte. Nos pondremos en contacto', 
                    'type': 'success',
                    'button': {
                        'text': 'Aceptar',
                        'onPress': () => {
                            navigation.goBack()
                        }
                    }
                })
            }
        }, [status])
    )

    useEffect(() => {
        if(reportTime) {
            let reportDate = new Date(reportTime)
            if(reportDate.setTime(reportDate.getTime() + 5000 * 60) > Date.now()) {
                showMessage({
                    'message': '¡Gracias! Recibimos el reporte. Nos pondremos en contacto', 
                    'type': 'success',
                    'button': {
                        'text': 'Aceptar',
                        'onPress': () => navigation.goBack()
                    }
                })
            }
        }
    }, [reportTime])

    useEffect(() => {
        Analytics.logScreen('Reporte de problemas', 'ProblemReportContainer')
    }, []);

    return (
        loading ? 
            <Loading/> :
            (
                <ScrollView keyboardShouldPersistTaps={'always'}>
                    <View style={[Layout.fill]}>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                                <View style={Layout.fill}>
                                    <NumberInput
                                        label='DNI'
                                        style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                        labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                        onChange={value => validateDni(value)}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={errorDniMessage}
                                    />
                                    <Input
                                        label='Descripción'
                                        style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                        labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                        multiline={true}
                                        numberOfLines={2}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={errorDescriptionMessage}
                                        onChangeText={(value) => validateDescription(value)}
                                        maxLength={500}
                                    />
                                    <View style={Gutters.smallPadding}>
                                        <Text style={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}>{'Adjuntá una captura de pantalla (Opcional)'}</Text>
                                    </View>
                                    <View style={[Layout.row, Gutters.smallHPadding, Gutters.smallBPadding]}>
                                        <View style={Layout.row}>
                                            {images.length > 0 && (
                                                images.map((img, key) => (
                                                    <ImageBackground
                                                        key={key}
                                                        style={{width: 80, height: 80, marginRight: 5}}
                                                        source={{uri: img.uri}}>
                                                            <TouchableOpacity
                                                                style={{left: '35%', top: '15%'}}
                                                                onPress={() =>
                                                                    deleteImage(key)
                                                                }>
                                                                    <Icon
                                                                        type="MaterialIcons"
                                                                        name='delete'
                                                                        size={20}
                                                                        color='white'
                                                                    />
                                                            </TouchableOpacity>
                                                    </ImageBackground>
                                                )) 
                                            )}
                                        </View>
                                        {
                                            images.length < 2 &&
                                            <View>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        ImagePicker.launchImageLibrary(
                                                        {
                                                            mediaType: 'photo',
                                                            includeBase64: false,
                                                            maxHeight: 800,
                                                            maxWidth: 600,
                                                            includeBase64: true
                                                        },
                                                        async (response) => {
                                                            await addImage(response.assets[0])
                                                        },
                                                        )
                                                    }>
                                                    <Image
                                                        style={{width: 80, height: 80}}
                                                        source={Images['addPhoto']}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                                    <Input
                                        label='Email de contacto'
                                        style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                        labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={errorMailMessage}
                                        onChangeText={value => validateEmail(value)}
                                        maxLength={70}
                                    />
                                </View>
                            </Card>
                        </View>
                        <View style={[Gutters.smallPadding]}>
                            <Button 
                                buttonStyle={[styles.buttonRadius]}
                                titleStyle={[styles.buttonWidth,Fonts.sourceSansLight]}
                                title="ENVIAR"
                                disabled={(isNotValidMail || isNotValidDescription || isNotValidDni) ? true : false}
                                onPress={() => send()}
                            />
                        </View>
                    </View>
                </ScrollView>
            )
    )
}

export default ProblemReportContainer