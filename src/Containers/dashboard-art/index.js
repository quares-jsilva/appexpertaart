import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Carousel from 'react-native-snap-carousel'
import { View, ScrollView, Dimensions } from "react-native"
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import { useTheme } from '@/Theme'
import MenuButton from '../../Components/MenuButton'
import Analytics from '../../libs/analytics'
import Loading from './loading'
import AffiliatedComponent from './affiliated'
import ClientComponent from './client'
import ClientAffiliatedComponent from './clientAfilliated'
import { useClaims } from '@/Hooks/useClaims'
import { useContracts } from '@/Hooks/useContracts'
import { viewer } from '@/Store/User/userDefinitions'
import { showMessage } from '@/Components/MessageHelper'
import { logout } from '@/Store/User/auth'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import Domain from './domain'
import { rate } from '@/libs/appReview'
import { setReviewed } from '@/Store/User/user'

let cardItems = [
    {
      texto: ''
    },
];

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH)

const DashboardARTContainer = () => {

    const ref = useRef(null)
    const dispatch = useDispatch()
    const { Layout, Gutters, Images, Common } = useTheme()
    const navigation = useNavigation()
    const { profiles } = useSelector((state) => state.user)
    const { status, affiliatedContractSelected, affiliatedContracts, clientContracts, clientContractsCompleted, affiliatedContractsCompleted } = useSelector((state) => state.contract )
    const { searchContracts, loading, searchAffiliatedInsurance } = useContracts({})
    const { hasClaim, loading: loadingClaims } = useClaims()
    const [carouselItems, setCarouselItems] = useState(cardItems)
    const { rateCounter, reviewed } = useSelector((state) => state.user )

    useEffect(()=>{
        dispatch(searchAffiliatedInsurance)
    },[])

    useEffect(()=>{
        if(affiliatedContractsCompleted){
            dispatch(searchContracts)
        }
    },[affiliatedContractsCompleted])

    const userLogout = () => {
        navigateAndSimpleReset('Main')
        dispatch(logout())
    }

    useEffect(() => {
        let cliente = profiles.includes("USER_ART_CLIENTE") ? status === 'success' && clientContractsCompleted && clientContracts&& clientContracts.length === 0 : true
        let afiliado = profiles.includes("USER_ART_AFILIADO") ? status === 'success' && affiliatedContractsCompleted && affiliatedContracts && affiliatedContracts.length === 0 : true
        if(cliente && afiliado){
            showMessage({
                'message': "No tenes pólizas asociadas o permisos para verlas. Comunicate con el Centro de Atención al Cliente 0800 7777 278(ART).",
                'type': 'warning',
                'button': {
                    onPress: () => userLogout() 
                },
                'buttonHelp': {
                    onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'DashboardArt' }) 
                }
            })
        }
    }, [affiliatedContracts, clientContracts, status])

    useEffect(() => {
        Analytics.logScreen('ART Home', 'DashboardARTContainer')
    }, [])

    useFocusEffect(
        useCallback(() => {
            if(!loading && !loadingClaims){
                if(!reviewed && rateCounter === 15){
                    rate()
                    dispatch(setReviewed())
                }
            }
        }, [loading, loadingClaims, rateCounter])
    )

    const _renderItem = useCallback(({ item, index }) => {
        return (<Domain texto={item.texto}/>)
    }, []);

    return (
        <ScrollView>
            {
                loading || loadingClaims ? <Loading/> :
                <View style={[Layout.fill, Layout.colCenter]}>
                    <Animatable.View animation="zoomIn" duration={300} style={[Layout.fill, Layout.fullWidth]}>
                        <Carousel
                            layout={'default'}
                            ref={ref}
                            data={carouselItems}
                            sliderWidth={SLIDER_WIDTH}
                            itemWidth={ITEM_WIDTH}
                            renderItem={_renderItem}
                            onScrollIndexChanged={(index) => {changeItem(index)}}
                            enableSnap={true}
                        />
                    </Animatable.View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={[Layout.fill, Layout.row, Layout.rowHCenter, Gutters.smallTPadding]}>
                            {profiles.includes('USER_ART_AFILIADO') && hasClaim &&
                                <>
                                    <MenuButton animate='zoomIn' imageName='misTurnosLogo' bottomText='MIS TURNOS' action={() => navigation.navigate('MyTurns')}/>
                                    <MenuButton animate='zoomIn' imageName='farmaciasLogo' bottomText='FARMACIAS' action={() => navigation.navigate('Pharmacies')}/>
                                </>
                            }
                            {profiles.includes('USER_ART_CLIENTE') && <MenuButton animate='zoomIn'imageName='gestionLogo' bottomText='GESTIÓN ART' action={() => navigation.navigate('ContractList', {dest: 'ContractDetail', viewAs: viewer.CLIENTE})}/>}
                            {profiles.includes('USER_ART_AFILIADO') && affiliatedContractSelected && affiliatedContractSelected.nro_contrato && <MenuButton animate='zoomIn' imageName='miArtLogo' bottomText='MI ART' action={() => affiliatedContracts.length > 1 ? navigation.navigate('ContractList', {dest: 'MyArt', viewAs: viewer.AFILIADO}) : navigation.navigate('MyArt')}/>}
                            {/*profiles.includes('USER_ART_AFILIADO') && affiliatedContractSelected && affiliatedContractSelected.nro_contrato && <MenuButton animate='zoomIn' imageName='miTarjetaLogo' bottomText='MI TARJETA' action={() => navigation.navigate('MyCard')}/>*/}
                        </View>
                    </ScrollView>
                    {
                        profiles.includes('USER_ART_AFILIADO') &&
                        profiles.includes('USER_ART_CLIENTE') &&
                        <ClientAffiliatedComponent/>
                    }
                    {
                        profiles.includes('USER_ART_AFILIADO') &&
                        !profiles.includes('USER_ART_CLIENTE') &&
                        <AffiliatedComponent/>
                    }
                    {
                        !profiles.includes('USER_ART_AFILIADO') &&
                        profiles.includes('USER_ART_CLIENTE') &&
                        <ClientComponent/>
                    }
                </View>
            }
        </ScrollView>
    )
}

export default DashboardARTContainer