import React, { useEffect } from 'react'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@/Theme'
import ShortCard from "../../Components/ShortCard"
import WideCard from "../../Components/WideCard"
import Analytics from '../../libs/analytics'
import { accidentUrl, quoteUrl } from '@/Config'
import { useContracts } from '@/Hooks/useContracts'
import { openUrl } from '@/libs/deepLinks'
import { viewer } from '@/Store/User/userDefinitions'

const ClientComponent = () => {

    const { Layout, Gutters } = useTheme()
    const navigation = useNavigation()
    const { contracts, loading } = useContracts({})

    //PARA CLIENTES VALIDAR PERMISOS (VER AUTH.js 335)
    const goToCoverage = () => {
        if(contracts.length === 1) {
            const [contract] = contracts
            navigation.navigate('CoverageDetail', {viewAs: viewer.CLIENTE, contractSelected: contract})
        } else {
            navigation.navigate('ContractList', {dest: 'CoverageDetail', viewAs: viewer.CLIENTE})
        }
    }

    const goToNonRepetition = () => {
        if(contracts.length === 1) {
            const [contract] = contracts
            navigation.navigate('NonRepetitionDetail', {viewAs: viewer.CLIENTE, contractSelected: contract})
        } else {
            navigation.navigate('ContractList', {viewAs: viewer.CLIENTE, dest: 'NonRepetitionDetail'})
        }
    }

    useEffect(() => {
        Analytics.logScreen('ART Home', 'DashboardARTCliente')
    }, []);

    return (
        !loading && (
            <>
                <Animatable.View animation="zoomIn" duration={300} style={[Layout.fill, Layout.fullWidth, Layout.row, Layout.justifyContentBetween]}>
                    <ShortCard 
                        action={() => {
                            Analytics.logEvent('IngresoACertificadoDeCobertura', 'DashboardArtContainer')
                            goToCoverage()
                        }} 
                        imageName='coberturaLogo' 
                        cardText={'CERTIFICADO\nDE COBERTURA'}
                    />
                    <ShortCard 
                        action={() => {
                            Analytics.logEvent('IngresoAClausulaDeNoRepeticion', 'DashboardArtContainer')
                            goToNonRepetition()
                        }} 
                        imageName='repeticionLogo' 
                        cardText={'CLÁUSULA DE NO REPETICIÓN'}
                    />
                </Animatable.View>
                <Animatable.View animation="zoomIn" duration={300} style={[Layout.fill, Layout.fullWidth, Gutters.smallHPadding,Gutters.smallBPadding]}>
                    <WideCard 
                        action={() => {
                            Analytics.logEvent('IngresoACasoDeAccidente', 'DashboardArtContainer')
                            openUrl(accidentUrl)
                        }} 
                        cardText={'¿QUÉ HACER EN\nCASO DE ACCIDENTE?'}
                    />
                </Animatable.View>
                <Animatable.View animation="zoomIn" duration={300} style={[Layout.fill, Layout.fullWidth, Gutters.smallHPadding, Gutters.smallBPadding ]}>
                    <WideCard 
                        action={() => {
                            Analytics.logEvent('IngresoACotizaPersonalDeTuHogar', 'DashboardArtContainer')
                            openUrl(quoteUrl)
                        }} 
                        cardText={'COTIZÁ LA COBERTURA PARA\nEL PERSONAL DE TU HOGAR'}
                    />
                </Animatable.View>
            </>
        )
    )
}

export default ClientComponent