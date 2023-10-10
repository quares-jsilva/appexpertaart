import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@/Theme'
import ShortCard from "../../Components/ShortCard"
import WideCard from "../../Components/WideCard"
import Analytics from '../../libs/analytics'
import TurnCard from '../../Components/TurnCard'
import { accidentUrl, quoteUrl, virtualUrl } from '@/Config'
import { useTurns } from '@/Hooks/useTurns'
import { useContracts } from '@/Hooks/useContracts'
import { openUrl } from '@/libs/deepLinks'

import { viewer } from '@/Store/User/userDefinitions'

const AffiliatedComponent = () => {

    const { Layout, Gutters } = useTheme()
    const navigation = useNavigation()
    const { hasClaim, myClaims, loading } = useSelector((state) => state.claim)
    const { hasTurns, firstTurn } = useTurns({type: 'nexts'})

    const { contracts } = useContracts({})

    const goToClaims = () => {
        const [singleClaim] = myClaims

        if(myClaims.length === 1 && singleClaim.estadoAdmin !== 'R') {
            navigation.navigate('ClaimDetail', {claimSelected: singleClaim})
        } else {
            navigation.navigate('ClaimList', {viewAs: viewer.AFILIADO})
        }
    }

    //PARA CLIENTES VALIDAR PERMISOS (VER AUTH.js 335)
    const goToCoverage = () => {
        if(contracts.length === 1) {
            const [contract] = contracts
            navigation.navigate('CoverageDetail', {contractSelected: contract})
        } else {
            navigation.navigate('ContractList', {viewAs: viewer.AFILIADO, dest: 'CoverageDetail'})
        }
    }

    const goToNonRepetition = () => {
        if(contracts.length === 1) {
            const [contract] = contracts
            navigation.navigate('NonRepetitionDetail', {contractSelected: contract})
        } else {
            navigation.navigate('ContractList', {dest: 'NonRepetitionDetail'})
        }
    }

    useEffect(() => {
        Analytics.logScreen('ART Home', 'DashboardARTAfiliado')
    }, []);

    return (
        !loading && (
            <>
                {
                    hasClaim ?
                    <>
                        {
                            hasTurns &&
                            <Animatable.View animation="zoomIn" duration={300} style={[Layout.fill, Layout.fullWidth, Gutters.smallHPadding]}>
                                <TurnCard dashboard={true} turn={firstTurn}/>
                            </Animatable.View>
                        }
                        <Animatable.View animation="zoomIn" duration={300} style={[Layout.fill, Layout.fullWidth, Gutters.smallHPadding, Gutters.smallTPadding]}>
                            <WideCard 
                                action={() => {
                                    Analytics.logEvent('VerListadoDeSiniestros', 'DashboardArtContainer')
                                    goToClaims()
                                }} 
                                imageName='siniestrosLogo' 
                                cardText='SINIESTROS'/>
                        </Animatable.View>
                    </>
                    :
                    <>
                        <Animatable.View animation="zoomIn" duration={300} style={[Layout.fill, Layout.fullWidth, Layout.row, Layout.justifyContentBetween]}>
                            <ShortCard 
                                action={() => {
                                    Analytics.logEvent('VerCertificadoDeCobertura', 'DashboardArtContainer')
                                    goToCoverage()
                                }} 
                                imageName='coberturaLogo' 
                                cardText={'CERTIFICADO\nDE COBERTURA'}
                            />
                            <ShortCard 
                                action={() => {
                                    Analytics.logEvent('VerClausulaDeNoRepeticion', 'DashboardArtContainer')
                                    goToNonRepetition()
                                }} 
                                imageName='repeticionLogo' 
                                cardText={'CLÁUSULA DE NO REPETICIÓN'}
                            />
                        </Animatable.View>
                    </>
                }
                <Animatable.View animation="zoomIn" duration={300} style={[Layout.fill, Layout.fullWidth, Layout.row, Layout.justifyContentBetween]}>
                    <ShortCard 
                        action={() => {
                            Analytics.logEvent('ConsultaACasoDeAccidente', 'DashboardArtContainer')
                            openUrl(accidentUrl)
                        }} 
                        cardText={'¿QUÉ HACER EN\nCASO DE ACCIDENTE?'}
                    />
                    <ShortCard 
                        action={() => {
                            Analytics.logEvent('IngresoACapacitacion', 'DashboardArtContainer')
                            openUrl(virtualUrl)
                        }} 
                        cardText={'ESPACIO VIRTUAL\nDE CAPACITACIÓN'}
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

export default AffiliatedComponent