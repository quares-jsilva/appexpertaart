import React, { useEffect, useCallback, useState } from 'react'
import { View, ScrollView, Text, Image } from "react-native"
import { useTheme } from '@/Theme'
import { Card } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

import styles from './styles'
import Analytics from '../../libs/analytics'


const PaymentContainer = (param) => {

    const { Layout, Gutters, Fonts, Common, Images } = useTheme()
    const navigation = useNavigation()

    useEffect(() => {
        Analytics.logScreen('Pagos', 'PaymentContainer')
    }, [])

    return (
        <ScrollView>
            <View style={[Layout.fill]}>
                <View style={[Layout.fill, Layout.fullWidth, Layout.center]}>
                    <View style={[Layout.fill, Layout.center]}>
                        <Image style={{height: 100, width: 100}} resizeMode={'contain'}  source={Images['autosLogo']}/>
                    </View>
                    <View style={[Layout.center, Gutters.smallHPadding]}>
                        <Text style={[Fonts.sourceSansBold, {fontSize: 15, textAlign: 'center'}]}>{'Este documento certifica que tus pagos se encuentran al día'}</Text>
                    </View>
                </View>
                <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                    <Card containerStyle={[Common.card, Layout.fullWidth]}>
                        <View style={[Layout.center, Gutters.regularBMargin, Gutters.regularTMargin, Gutters.smallHPadding]}>
                            <Text style={[Fonts.sourceSansSemiBold, {fontSize: 15}]}>{'Detalle del auto'}</Text>
                            <View style={[Layout.row, Layout.justifyContentBetween, Gutters.regularTMargin]}>
                                <View style={[Layout.fill, Layout.alignItemsStart]}>
                                    <Text style={[Fonts.sourceSansLight, styles.blueColor, Fonts.textCenter, {fontSize: 18}]}>{'Patente:'}</Text>
                                </View>
                                <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                    <Text style={[Fonts.sourceSansBold, Fonts.textCenter, {fontSize: 18}]}>{param.route.params.issuanceSelected.patente ? param.route.params.issuanceSelected.patente : ''}</Text>
                                </View>
                            </View>
                            <View style={[Layout.row, Layout.justifyContentBetween, Gutters.regularTMargin]}>
                                <View style={[Layout.fill, Layout.alignItemsStart]}>
                                    <Text style={[Fonts.sourceSansLight, styles.blueColor, Fonts.textCenter, {fontSize: 18}]}>{'Marca:'}</Text>
                                </View>
                                <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                    <Text style={[Fonts.sourceSansLight, Fonts.textCenter, {fontSize: 18}]}>{param.route.params.issuanceSelected.marca ? param.route.params.issuanceSelected.marca : ''}</Text>
                                </View>
                            </View>
                            <View style={[Layout.row, Layout.justifyContentBetween, Gutters.regularTMargin]}>
                                <View style={[Layout.fill, Layout.alignItemsStart]}>
                                    <Text style={[Fonts.sourceSansLight, styles.blueColor, Fonts.textCenter, {fontSize: 18}]}>{'Modelo:'}</Text>
                                </View>
                                <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                    <Text style={[Fonts.sourceSansLight, Fonts.textCenter, {fontSize: 18}]}>{param.route.params.issuanceSelected.modelo ? param.route.params.issuanceSelected.modelo : ''}</Text>
                                </View>
                            </View>
                            <View style={[Layout.row, Layout.justifyContentBetween, Gutters.regularBMargin, Gutters.regularTMargin]}>
                                <View style={[Layout.fill, Layout.alignItemsStart]}>
                                    <Text style={[Fonts.sourceSansLight, styles.blueColor, Fonts.textCenter, {fontSize: 18}]}>{'Versión:'}</Text>
                                </View>
                                <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                    <Text style={[Fonts.sourceSansLight, Fonts.textCenter, {fontSize: 18}]}>{param.route.params.issuanceSelected.version ? param.route.params.issuanceSelected.version : ''}</Text>
                                </View>
                            </View>
                        </View>
                        <Card.Divider/>
                        <View style={[Layout.center, Gutters.regularTMargin, Gutters.regularBMargin, Gutters.smallHPadding]}>
                            <Text style={[Fonts.sourceSansSemiBold, Gutters.smallBMargin, {fontSize: 15}]}>{'Detalle del pago'}</Text>
                            <View style={[Layout.row, Layout.justifyContentBetween, Gutters.smallTMargin]}>
                                <View style={[Layout.fill, Layout.alignItemsStart]}>
                                    <Text style={[Fonts.sourceSansLight, styles.blueColor, Fonts.textCenter, {fontSize: 18}]}>{'Vigencia de póliza:'}</Text>
                                </View>
                                <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                    <Text style={[Fonts.sourceSansLight, Fonts.textCenter, {fontSize: 18}]}>{param.route.params.paymentSelected ? moment(param.route.params.paymentSelected.fechaVigPol).format("DD/MM/YYYY").toString() : ''}</Text>
                                </View>
                            </View>
                            <View style={[Layout.row, Layout.justifyContentBetween, Gutters.regularTMargin]}>
                                <View style={[Layout.fill, Layout.alignItemsStart]}>
                                    <Text style={[Fonts.sourceSansLight, styles.blueColor, Fonts.textCenter, {fontSize: 18}]}>{'Tipo de renovación:'}</Text>
                                </View>
                                <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                    <Text style={[Fonts.sourceSansLight, Fonts.textCenter, {fontSize: 18}]}>{param.route.params.issuanceSelected.tipoRenovacion}</Text>
                                </View>
                            </View>
                            <View style={[Layout.row, Layout.justifyContentBetween, Gutters.regularTMargin]}>
                                <View style={[Layout.fill, Layout.alignItemsStart]}>
                                    <Text style={[Fonts.sourceSansLight, styles.blueColor, Fonts.textCenter, {fontSize: 18}]}>{'Forma de pago:'}</Text>
                                </View>
                                <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                    <Text style={[Fonts.sourceSansLight, Fonts.textCenter, {fontSize: 18}]}>{param.route.params.paymentSelected ? param.route.params.paymentSelected.formaPago : ''}</Text>
                                </View>
                            </View>
                            <View style={[Layout.row, Layout.justifyContentBetween, Gutters.regularTMargin]}>
                                <View style={[Layout.fill, Layout.alignItemsStart]}>
                                    <Text style={[Fonts.sourceSansLight, styles.blueColor, Fonts.textCenter, {fontSize: 18}]}>{'Estado de pago:'}</Text>
                                </View>
                                <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                    <Text style={[Fonts.sourceSansBold, Fonts.textCenter, {fontSize: 18}]}>{'Al día'}</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
            </View>
        </ScrollView>
    )
}

export default PaymentContainer