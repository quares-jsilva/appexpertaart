import React, { useEffect, useCallback } from 'react'
import { View, Image, ScrollView, Text } from "react-native"
import { useTheme } from '@/Theme'
import styles from './styles'
import Analytics from '../../libs/analytics'
import { useSelector, useDispatch } from 'react-redux'
import { getCardData } from '@/Store/Card'
import { showMessage } from '@/Components/MessageHelper'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Loading from './loading'
import QRCode from 'react-native-qrcode-svg';

const MyCardContainer = () => {

    const { Layout, Gutters, Common, Fonts, Images } = useTheme()
    const { name, token, loading, status, message } = useSelector((state) => state.card )
    const { data } = useSelector((state) => state.user )
    const dispatch = useDispatch()
    const navigation = useNavigation();

    useEffect(() => {
        if(data != null) {
            dispatch(getCardData({dni: data.documento, nombre: data.nombre}))
        }
    }, [data])

    useFocusEffect(
        useCallback(() => {
            if(status === 'error') {
                showMessage({
                    'message': message, 
                    'type': 'error',
                    'button': {
                        'text': 'Aceptar',
                        'onPress': () => navigation.goBack(),
                    },
                    'buttonHelp': { 
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'MyCard' }) 
                    }
                })
            }
        }, [status])
    )

    useEffect(() => {
        Analytics.logScreen('Mi Tarjeta', 'MyCardContainer')
    }, []);

    return (
        loading ? <Loading/> :
        (
            <View style={[Layout.fill, Layout.colCenter, styles.rotateCard]}>
                <View style={[Common.card, {overflow: "hidden"}]}>
                    <View style={[styles.header]}>
                        <Image style={styles.imageSize} resizeMode={'cover'}  source={Images['background']}/> 
                        <View style={styles.rotateLogo}>
                            <Image style={styles.logoSize} resizeMode={'contain'}  source={Images['myCardLogo']}/> 
                        </View>
                    </View>
                    <View style={styles.mainDiv}>
                        <View style={[Layout.row, Layout.justifyContentBetween, Gutters. smallPadding]}>
                            <View>
                                <Text style={Fonts.sourceSansBold}>{name}</Text>
                                <Text style={Fonts.sourceSansLight}>{token}</Text>
                            </View>
                            <View>
                            <QRCode
                                value={token ? token.toString() : 'empty'}
                                logoSize={80}
                                logoBackgroundColor='transparent'
                            />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    )
}

export default MyCardContainer