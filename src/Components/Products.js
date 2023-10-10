import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import { useTheme } from '@/Theme'
import { View } from 'react-native-animatable'
import Carousel from 'react-native-snap-carousel'
import { useSelector } from 'react-redux'
import { autosUrl, apUrl, hogarUrl, roboUrl, casasUrl } from '@/Config'
import { openUrl } from '@/libs/deepLinks'
import Analytics from '../libs/analytics'

const styles = StyleSheet.create({
    text: {
        color: '#000',
        textAlign: 'center',
    },
})

const SLIDER_WIDTH = Dimensions.get('window').width / 100 * 31.9
const ITEM_WIDTH = Math.round(SLIDER_WIDTH)
const carouselItems = [
    {
        image: 'logoAutos',
        profile: 'USER_AUTO_CLIENTE',
        url: autosUrl,
        analytics: 'ARTvisitarProductoAutos'
    },
    {
        image: 'productoHogar',
        profile: 'USER_HOGAR_CLIENTE',
        url: hogarUrl,
        analytics: 'ARTvisitarProductoHogar'
    },
    {
        image: 'logoAp',
        profile: 'AP',
        url: apUrl,
        analytics: 'ARTvisitarProductoAP'
    },
    {
        image: 'logoRobo',
        profile: 'ROBO',
        url: roboUrl,
        analytics: 'ARTvisitarProductoRobo'
    },
    {
        image: 'logoCasas',
        profile: 'CASAS',
        url: casasUrl,
        analytics: 'ARTvisitarProductoCasas'
    },
]

const Products = (props) => {

    const { Layout, Common, Images, Fonts, Gutters } = useTheme()
    const ref = useRef(null)
    const [products, setProducts] = useState(carouselItems)
    const { profiles } = useSelector((state) => state.user )

    useEffect(() => {
        setProducts(carouselItems.filter(item => !profiles.includes(item.profile)))
    }, [profiles])

    const _renderItem = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity 
                onPress={() => {
                    Analytics.logEvent(item.analytics, 'Products')
                    openUrl(item.url)
                }} 
                style={[Common.card, Layout.center,Layout.fill, Gutters.smallMargin, Gutters.smallPadding, {height: 100, width: Dimensions.get('window').width / 100 * 27}]}>
                    <Image style={{width: '100%', height: '100%'}} resizeMode={'cover'}  source={Images[item.image]}/>
            </TouchableOpacity>
        )
    }, [])

    return (
        <View style={Gutters.smallPadding}>
            <View style={[Layout.fullWidth, Layout.center]}>
                <Text style={[
                        Gutters.smallTMargin, 
                        Fonts.sourceSansSemiBold,
                        {color: 'grey', fontSize: 18}
                    ]}>{'Conocé nuestros productos'}</Text>
            </View>
            <View style={[Layout.rowCenter]}>
                <Carousel
                    layout={'default'}
                    ref={ref}
                    data={products}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    renderItem={_renderItem}
                    enableSnap={true}
                    inactiveSlideOpacity={1}
                    inactiveSlideScale={1}
                />
            </View>
        </View>
    )
  
}

export default Products