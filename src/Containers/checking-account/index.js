import React, { useEffect, useCallback } from 'react'
import { View, ScrollView, Text, Image } from "react-native"
import { useTheme } from '@/Theme'
import { Button, Card } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import styles from './styles'
import Analytics from '../../libs/analytics'
import { useDispatch, useSelector } from 'react-redux'
import Loading from './loading'
import { BASE_URL_CUENTACORRIENTE } from '@/Config'
import { showMessage } from '@/Components/MessageHelper'
import moment from 'moment'


const CheckingAccountContainer = (param) => {

    const { Layout, Gutters, Fonts, Common } = useTheme()
    const navigation = useNavigation()
    const { contractSelected } = param.route.params || {}
    const { contractDetail, loading, printUrl, status, message } = useSelector((state) => state.contract )
    const dispatch = useDispatch()

    useEffect(() => {
        Analytics.logScreen('Cuenta Corriente', 'CheckingAccountContainer')
    }, [])

    const shareBalance = () => {
        navigation.navigate(
            'PdfVisualizer', 
            {
                uri: `${BASE_URL_CUENTACORRIENTE}contratos/${contractSelected.nro_contrato}/cuentaCorriente.PDF?desde=${moment().format('YYYY-MM-DD').toString()}`,
                pdfName: '/cuenta_corriente.pdf',
                title: 'Cuenta Corriente'
            }
        )
    }

    useFocusEffect(
        useCallback(() => {
            if(status === 'error' || status === 'warning') {
                showMessage({
                    'message': message, 
                    'type': status,
                    'button': {
                        'text': 'Aceptar',
                        'onPress': () => navigation.goBack(),
                    },
                    'buttonHelp': {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'CheckingAccount' }) 
                    }
                })
            }
        }, [status])
    )

    return (
        <ScrollView>
            {
                loading ? 
                (
                    <Loading/>
                ) : (
                    <View style={[Layout.fill]}>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                                <Card.Title>{contractSelected.razon_social}</Card.Title>
                                <Card.Divider/>
                                <View>
                                        <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                            <View>
                                                <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Cuit:'}</Text>
                                            </View>
                                            <View>
                                                <Text style={Fonts.sourceSansLight}>{contractSelected.cuit}</Text>
                                            </View>
                                        </View>
                                        <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                            <View>
                                                <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Contrato:'}</Text>
                                            </View>
                                            <View>
                                                <Text style={Fonts.sourceSansLight}>{contractSelected.nro_contrato}</Text>
                                            </View>
                                        </View>
                                </View>
                            </Card>
                        </View>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                                <View style={[Layout.center, Gutters.smallBPadding]}>
                                    <View style={[Layout.row, Layout.justifyContentBetween]}>
                                        <View style={Layout.fill}>
                                            <Text style={[Fonts.sourceSansLight, styles.greenColor, Fonts.textCenter]}>{'Saldo acumulado:'}</Text>
                                        </View>
                                        <View style={Layout.fill}>
                                            {
                                                Math.sign(contractDetail.saldo_deudor) === -1 ?
                                                <Text style={[Fonts.sourceSansLight, Fonts.textCenter, styles.orangeColor]}>{'($' + new Intl.NumberFormat("de-DE").format(Math.abs(contractDetail.saldo_deudor)) + ')'}</Text>
                                                :
                                                <Text style={[Fonts.sourceSansLight, Fonts.textCenter, contractDetail.saldo_deudor > '0' ? styles.greenColor: {color: 'black'}]}>{contractDetail.saldo_deudor}</Text>
                                            }
                                        </View>
                                    </View>
                                    {
                                        contractDetail.intereses !== 0 &&
                                        <View style={[Layout.row, Layout.justifyContentBetween]}>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, styles.greenColor, Fonts.textCenter]}>{'Interés:'}</Text>
                                            </View>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, Fonts.textCenter, Math.sign(contractDetail.saldo_deudor) === -1 && styles.orangeColor]}>{'$' + new Intl.NumberFormat("de-DE").format(Math.abs(contractDetail.intereses))}</Text>
                                            </View>
                                        </View>
                                    }
                                    {
                                        (contractDetail.alicuota_fija || contractDetail.alicuota_variable) &&
                                        <View style={[Layout.row, Layout.justifyContentBetween]}>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, styles.greenColor, Fonts.textCenter]}>{'Alícuota vigente:'}</Text>
                                            </View>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, Fonts.textCenter]}>{contractDetail.alicuota_fija == 0 ? parseFloat(contractDetail.alicuota_variable).toFixed(2) + ' %' : parseFloat(contractDetail.alicuota_fija).toFixed(2) + ' %' }</Text>
                                            </View>
                                        </View>
                                    }
                                    <View style={[Layout.rowCenter, Gutters.smallTMargin]}>
                                        <Text style={[Fonts.sourceSansSemibold, Fonts.textCenter, { color: 'black' }]}>{contractDetail.leyenda_saldo_deudor}</Text>
                                    </View>
                                </View>
                                <Card.Divider/>
                                {
                                    contractDetail.leyenda_saldo_deudor === 'Posee Saldo Deudor' &&
                                    <View style={[Layout.center, Gutters.smallBPadding]}>
                                        <View style={[Layout.row, Layout.justifyContentBetween]}>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, styles.greenColor, Fonts.textCenter]}>{'Morosidad %:'}</Text>
                                            </View>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, Fonts.textCenter]}>{parseFloat(contractDetail.morosidad).toFixed(2)}</Text>
                                            </View>
                                        </View>
                                        <View style={[Layout.row, Layout.justifyContentBetween]}>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, styles.greenColor, Fonts.textCenter]}>{'Períodos adeudados:'}</Text>
                                            </View>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, Fonts.textCenter]}>{contractDetail.periodosAdeudados}</Text>
                                            </View>
                                        </View>
                                        <View style={[Layout.row, Layout.justifyContentBetween]}>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, styles.greenColor, Fonts.textCenter]}>{'Gestión de cobranzas:'}</Text>
                                            </View>
                                            <View style={Layout.fill}>
                                                <Text style={[Fonts.sourceSansLight, Fonts.textCenter]}>{contractDetail.gestionCobranza}</Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                            </Card>
                        </View>
                        <View style={[Gutters.smallPadding]}>
                            <Button buttonStyle={styles.buttonStyle}
                                title="GENERAR DETALLE"
                                titleStyle={Fonts.sourceSansLight}
                                onPress={() => {
                                    Analytics.logEvent('VerDocumentacionDeCuentaCorriente', 'CheckingAccountContainer')
                                    shareBalance()
                                }}
                            />
                        </View>
                    </View>
                )
            }
        </ScrollView>
    )
}

export default CheckingAccountContainer