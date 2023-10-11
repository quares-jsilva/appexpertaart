import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView, Linking } from "react-native"
import { useSelector } from 'react-redux'

import { useTheme } from '@/Theme'
import DashboardSlide from "../../Components/DashboardSlide"
import Products from '../../Components/Products'
import ButtonSeguros from '../../Components/ButtonSeguros'
import { isAppInstalled } from '@/libs/deepLinks'
import ProductSlide from '../../Components/ProductSlide'

const dashboardContainer = () => {

    const { data } = useSelector((state) => state.user )
    const { Gutters, Layout, Fonts, Common, Images } = useTheme()
    const [segurosInstalled, setSegurosInstalled] = useState(false)

    const checkIfAppIsInstalled = useCallback(async () => {
        const installed = await isAppInstalled('appseguros://seguros/')
        setSegurosInstalled(installed)
    }, []);

    useEffect(() => {
        checkIfAppIsInstalled()
    }, []);
    
    return (
        <ScrollView>
            <View style={[Layout.fullWidth, Layout.center, Gutters.smallTMargin]}>
                <Text style={[
                        Gutters.smallTMargin, 
                        Fonts.sourceSansBold,
                        {color: 'grey', fontSize: 18}
                    ]}>{'Bienvenido ' + data.nombre}</Text>
            </View>
            <View style={[Gutters.smallPadding, Gutters.smallHMargin]}>
                <DashboardSlide 
                    type={'art'}
                    navPage='DashboardArt' 
                    imageName='artSlide' 
                    title='ART' 
                    logoName='logoArtAzul'
                    animate='slideInRight'
                />
                {
                    !segurosInstalled &&
                    <ProductSlide 
                        navPage='DashboardAuto' 
                        imageName='autoSlide' 
                        text='Para acceder a las funcionalidades de autos debes descargar la nueva App' 
                        logoName='logoAutosAzul'
                        animate='slideInLeft'
                    />
                }
            </View>
            {
                segurosInstalled &&
                <>
                    <View style={[Layout.fullWidth, Layout.center, Gutters.smallTMargin, Gutters.smallTMargin]}>
                        <Text style={[
                                Gutters.smallTMargin, 
                                Fonts.sourceSansSemiBold,
                                {color: 'grey', fontSize: 18}
                            ]}>{'Además'}</Text>
                    </View>
                    <View style={[Layout.center, Gutters.smallHMargin, Gutters.smallPadding]}>
                        <ButtonSeguros screen={'dashboard'}/>
                    </View>
                </>
            }
            <Products/>
        </ScrollView>
    )

}

export default dashboardContainer