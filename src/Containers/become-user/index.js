import React, { useState, useEffect } from 'react'
import { Text, View, Image } from "react-native"
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native-elements';
import ShortCard from '../../Components/ShortCard';
import Analytics from '../../libs/analytics'

const BecomeUserContainer = () => {

    const { Fonts, Gutters, Layout } = useTheme()
    const navigation = useNavigation();

    useEffect(() => {
        Analytics.logScreen('Como ser usuario', 'BecomeUserContainer')
    }, []);

    return (
        <View style={[Layout.fill,Layout.colCenter, Layout.justifyContentBetween]}>
            <View style={Gutters.smallPadding}>
                <Text style={Fonts.sourceSansBold}>{'Cómo ser usuario'}</Text>
            </View>
            <View style={Gutters.smallPadding}>
                <Text style={Fonts.sourceSansBold}>{'Para generar por primera vez tu Usuario administrador y gestionar en Experta ART Online, imprimí, completá y enviá a clientes@experta.com.ar el Formulario de solicitud.'}</Text>
            </View>
            <View style={[Layout.fullWidth, Gutters.smallHPadding, Gutters.regularTMargin]}>
                <Button titleStyle={Fonts.sourceSansLight} type='clear' title="DESCARGAR FORMULARIO" onPress={() => navigation.goBack()}/>
            </View>
            <View style={Gutters.smallPadding}>
                <Text style={Fonts.sourceSansBold}>{'Recibirás la clave para poder operar a la brevedad. IMPORTANTE: Debe estar firmado por un responsable de la empresa.'}</Text>
                <Text style={Fonts.sourceSansBold}>{'Conocé los términos y condiciones de utilización antes de solicitar tu usuario y clave.'}</Text>
            </View>
        </View>
    )
}

export default BecomeUserContainer