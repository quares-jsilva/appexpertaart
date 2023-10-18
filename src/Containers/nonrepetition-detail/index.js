import React, { useState, useEffect, useCallback } from 'react'
import { View, ScrollView, Text, Platform } from "react-native"
import { useTheme } from '@/Theme'
import { Button, CheckBox, Card, Input } from 'react-native-elements';
import moment from 'moment'
import { DatePicker } from '../../Components'

import styles from './styles'
import Analytics from '../../libs/analytics'
import { useDispatch, useSelector } from 'react-redux'
import Loading from './loading';
import { showMessage } from '@/Components/MessageHelper'
import { getNonRepetitionPrintUrl } from '@/Store/Contract'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { BASE_URL_DOCUMENTACION, BASE_URL_GATEWAY } from '@/Config'
import { useValidateDestinatary } from '@/Hooks/useValidateDestinatary'
import { viewer } from '@/Store/User/userDefinitions'

const NonRepetitionDetailContainer = (param) => {

    const { Layout, Gutters, Common, Fonts } = useTheme()
    const { pwid } = useSelector((state) => state.user)
    const { loading, printUrl, status, message } = useSelector((state) => state.contract )
    const { dest, contractSelected, viewAs = viewer.AFILIADO } = param.route.params || {}
    const { destinatary, isNotValidDestinatary, errorDestinataryMessage, validateDestinatary } = useValidateDestinatary()
    const [date, setDate] = useState(new Date());
    const [vigencyDate, setVigencyDate] = useState(moment(new Date(), 'DD-MM-YYYY').format('DD-MM-YYYY'));
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [heightWork, setHeightWork] = useState(false)


    const onChangeDate = ({ type }, selectedDate) => {
        if(type === 'set') {
            setDate(selectedDate);

            if(Platform.OS === 'android') {
                setVigencyDate(moment(selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY'))
            }
        }

        return;
    };
    
    const shareDoc = () => {
        dispatch(getNonRepetitionPrintUrl({
            poliza: contractSelected.nro_contrato, 
            destinatarios: [destinatary],
            fechaPresentacion: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            trabajoAltura: heightWork
        }))
    }

    useEffect(() => {
        if(printUrl != null) {
            navigation.navigate(
            'PdfVisualizer', 
            {
                uri: `${BASE_URL_GATEWAY}art/documentacion/no-repeticion/${contractSelected.nro_contrato}/${printUrl}`,
                pdfName: '/clausula-de-no-repeticion.pdf',
                title: 'Cláusula de no repetición'
            })
        }
    }, [printUrl])

    useFocusEffect(
        useCallback(() => {
            if(status === 'error') {
                showMessage({
                    'message': message, 
                    'type': 'error',
                    'button': {
                        'text': 'Aceptar',
                    },
                    'buttonHelp': {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'NonRepetitionDetail' }) 
                    }
                })
            }
        }, [status])
    )

    useEffect(() => {
        Analytics.logScreen(`Clausula de No Repetición - ${viewAs}`, 'NonRepetitionContainer')
    }, []);

    return (
        <ScrollView keyboardShouldPersistTaps={'always'}>
            {
                loading ?
                (
                    <Loading/>
                ) :
                (
                    <View style={[Layout.fill]}>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                                <Card.Title>{contractSelected && contractSelected.razon_social}</Card.Title>
                                <Card.Divider/>
                                <View>
                                    <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                        <View>
                                            <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Cuit:'}</Text>
                                        </View>
                                        <View>
                                            <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{contractSelected && contractSelected.cuit}</Text>
                                        </View>
                                    </View>
                                    <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                        <View>
                                            <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Póliza:'}</Text>
                                        </View>
                                        <View>
                                            <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{contractSelected && contractSelected.nro_contrato}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </View>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallHPadding]}>
                            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                                <View>
                                    <View style={[Layout.fullWidth]}>
                                        <Input
                                            label='Destinatario'
                                            placeholder='A quien corresponda'
                                            placeholderTextColor={'#DCDCDC'}
                                            style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                            labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                            value={destinatary}
                                            onChangeText={value => validateDestinatary(value)}
                                            errorStyle={{ color: 'red' }}
                                            errorMessage={errorDestinataryMessage}
                                        />
                                        <View style={Gutters.smallHPadding}>
                                            <Text style={[Fonts.sourceSansSemibold, Gutters.smallBPadding, {color: 'grey'}]}>{'Fecha de vigencia de la nómina'}</Text>
                                            <DatePicker
                                                inputPlaceholder="Seleccioná una fecha" 
                                                inputPlaceholderColor={'#DCDCDC'}
                                                inputValue={vigencyDate}
                                                onChangeText={setVigencyDate}
                                                datePickerValue={date}
                                                maxDate={new Date().setDate(new Date().getDate() + 7)}
                                                onChange={onChangeDate}
                                            />
                                        </View>
                                        <CheckBox
                                            title='Trabajo en altura'
                                            textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                                            checkedColor={'#389548'}
                                            checked={heightWork}
                                            onPress={() => setHeightWork(!heightWork)}
                                        />
                                    </View>
                                </View>
                            </Card>
                        </View>
                        <View style={[Gutters.smallPadding]}>
                            <Button titleStyle={Fonts.sourceSansLight} buttonStyle={styles.buttonStyle}
                                title="COMPARTIR CLÁUSULA"
                                onPress={() => {
                                    Analytics.logEvent('VerDeClausulaDeNoRepeticion', 'NonRepetitionDetail')
                                    shareDoc()
                                }}
                                disabled={isNotValidDestinatary || !(!!date)}
                            />
                        </View>
                    </View>
                )
            }
        </ScrollView>
    )
}

export default NonRepetitionDetailContainer