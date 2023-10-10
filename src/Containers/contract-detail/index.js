import React, { useEffect, useState, useCallback } from 'react'
import { View, ScrollView, Text, Image } from "react-native"
import { useTheme } from '@/Theme'
import MenuButton from '../../Components/MenuButton'
import { Button, Card } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Analytics from '../../libs/analytics'
import styles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { getContractDetail, getContractPrintUrl } from '@/Store/Contract'
import Loading from './loading';
import { BASE_URL_APIMANAGER } from '@/Config'
import { showMessage } from '@/Components/MessageHelper'
import { usePermissions } from '@/Hooks/usePermissions'
import { viewer } from '@/Store/User/userDefinitions'

const ContractDetailContainer = (param) => {

    const { Layout, Gutters, Fonts, Common, Images } = useTheme()
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { dest, contractSelected, viewAs = viewer.AFILIADO } = param.route.params || {}
    const { contractDetail, loading, printUrl, status, message } = useSelector((state) => state.contract )
    const { hasPermission } = usePermissions(contractSelected)
    const { pwid } = useSelector((state) => state.user)
    
    const [ showAlicuotas, setShowAlicuotas ] = useState(false)
    const [ showPrint, setShowPrint ] = useState(false)

    useEffect(()=>{
        if(viewAs === viewer.CLIENTE) {
            setShowAlicuotas(hasPermission.contratoAlicuotas)
            if(contractSelected.tipoContrato === "REGIMEN_GENERAL" || contractSelected.tipoContrato === "MIXTO"){
                setShowPrint(hasPermission.contratoImpresion)
            }
        }else{
            setShowAlicuotas(true)
            if(contractSelected.tipoContrato === "REGIMEN_GENERAL" || contractSelected.tipoContrato === "MIXTO"){
                setShowPrint(true)
            }
        }
    },[hasPermission])

    useEffect(()=>{
        if(pwid && contractSelected && contractSelected.nro_contrato) {
            dispatch(getContractDetail(contractSelected.nro_contrato))
        }
    },[contractSelected])

    useEffect(() => {
        Analytics.logScreen('Detalle de Contrato', 'ContractDetailContainer')
    }, []);

    const shareContract = () => {
        dispatch(getContractPrintUrl({
            as_poliza: contractSelected.nro_contrato, 
            usuario: pwid, 
            as_nro_endoso: null,
            as_fecha_fin_vigencia: null,
            subreport_dir: null,
            as_completo: '1'
        }))
    }

    useEffect(() => {
        if(printUrl != null) {
            navigation.navigate(
            'PdfVisualizer', 
            {
                uri: `${BASE_URL_APIMANAGER}app/clientes/v1/descarga/${printUrl}`,
                pdfName: '/' + printUrl,
                title: 'Contrato'
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
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ContractDetail' }) 
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
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={[Layout.fill, Layout.row, Layout.rowHCenter, Gutters.smallPadding]}>
                                <MenuButton imageName='siniestros' bottomText={'SINIESTROS\n'} action={() => navigation.navigate('ClaimList', {viewAs, contractSelected})}/>
                                <MenuButton imageName='cobertura' bottomText={'CERTIFICADO\nDE COBERTURA'} action={() => navigation.navigate('CoverageDetail', {viewAs, contractSelected})}/>
                                <MenuButton imageName='clausulaNR' bottomText={'CLÁUSULA\nDE NR'} action={() => navigation.navigate('NonRepetitionDetail', {viewAs, contractSelected})}/>
                                <MenuButton imageName='cuentaCorriente' bottomText={'CUENTA\nCORRIENTE'} action={() => navigation.navigate('CheckingAccount', {viewAs, contractSelected})}/>
                                <MenuButton imageName='credencial' bottomText={'CREDENCIALES\n'} action={() => navigation.navigate('Credentials', {viewAs})}/>
                                <MenuButton imageName='referentes' bottomText={'REFERENTES\n'} action={() => navigation.navigate('ReferentList', {viewAs, contractSelected})}/>
                            </View>
                        </ScrollView>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallHPadding]}>
                        <Card containerStyle={[Common.card, Layout.fullWidth]}>
                            <Card.Title>{contractSelected.razon_social}</Card.Title>
                            <Card.Divider/>
                            <View>
                                    <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                        <View>
                                            <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Cuit:'}</Text>
                                        </View>
                                        <View>
                                            <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{contractSelected.cuit}</Text>
                                        </View>
                                    </View>
                                    <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                        <View>
                                            <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Póliza:'}</Text>
                                        </View>
                                        <View>
                                            <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{contractSelected.nro_contrato}</Text>
                                        </View>
                                    </View>
                                    <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                        <View>
                                            <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Vigencia desde:'}</Text>
                                        </View>
                                        <View>
                                            <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{contractDetail.vigencia_desde}</Text>
                                        </View>
                                    </View>
                                    <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                        <View>
                                            <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Ejecutivo de cuenta:'}</Text>
                                        </View>
                                        <View>
                                            <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{contractDetail.ejecutivo}</Text>
                                        </View>
                                    </View>
                            </View>
                        </Card>
                        </View>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                                <Card.Title style={styles.greenColor}>Actividad:</Card.Title>
                                <View style={[Layout.center, Gutters.smallBPadding]}>
                                    <Text style={[Fonts.sourceSansLight, {color: 'grey'}, Fonts.textCenter]}>{contractDetail.ciiu_codigo + ' - ' + contractDetail.ciiu_descripcion}</Text>
                                </View>
                                <Card.Title style={styles.greenColor}>Domicilio Legal:</Card.Title>
                                <View style={[Layout.center, Gutters.smallBPadding, Gutters.smallHPadding]}>
                                    <View style={[Layout.rowCenter, Layout.justifyContentBetween]}>
                                        <View style={[Layout.fill, Layout.center]}>
                                            <Text style={[Fonts.sourceSansLight, {color: 'grey'}, Fonts.textCenter]}>{contractDetail.domicilio_legal}</Text>
                                        </View>
                                        <View style={[Layout.center, Gutters.smallPadding]}>
                                            <Image style={{height: 25, width: 25}} resizeMode={'contain'}  source={Images['legalLocation']}/>
                                        </View>
                                    </View>
                                </View>
                                {showAlicuotas &&
                                    <>
                                        <Card.Title style={styles.greenColor}>Alícuota:</Card.Title>
                                        <View style={[Layout.center, Gutters.smallBPadding]}>
                                            <View style={[Layout.row, Layout.justifyContentBetween]}>
                                                <View style={Layout.fill}>
                                                    <Text style={[Fonts.sourceSansLight, styles.greenColor, Fonts.textCenter]}>{contractDetail.alicuota_fija == 0 ? 'Variable' : 'Fija' }</Text>
                                                </View>
                                                <View style={Layout.fill}>
                                                    <Text style={[Fonts.sourceSansLight, Fonts.textCenter, {color: 'grey'}]}>{contractDetail.alicuota_fija == 0 ? parseFloat(contractDetail.alicuota_variable).toFixed(2) + ' %' : parseFloat(contractDetail.alicuota_fija).toFixed(2) + ' %' }</Text>
                                                </View>
                                            </View>
                                            <View style={[Layout.row, Layout.justifyContentBetween]}>
                                                <View style={Layout.fill}>
                                                    <Text style={[Fonts.sourceSansLight, styles.greenColor, Fonts.textCenter]}>{'Empleados'}</Text>
                                                </View>
                                                <View style={Layout.fill}>
                                                    <Text style={[Fonts.sourceSansLight, Fonts.textCenter, {color: 'grey'}]}>{contractDetail.capitas}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                }
                            </Card>
                        </View>
                        {showPrint &&
                            <View style={[Gutters.smallPadding]}>
                                <Button buttonStyle={styles.buttonStyle}
                                    title="VER PÓLIZA"
                                    titleStyle={[Fonts.sourceSansLight]}
                                    onPress={() => {
                                        Analytics.logEvent('VerDocumentacionDeContrato', 'ContractDetailContainer')
                                        shareContract()
                                    }}
                                />
                            </View>
                        }
                    </View>
                )

            }
        </ScrollView>
    )
}

export default ContractDetailContainer