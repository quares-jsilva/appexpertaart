import React, { useEffect } from 'react'
import { Text, View, Image } from "react-native"
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native-elements';
import ShortCard from '../../Components/ShortCard';
import Analytics from '../../libs/analytics'

const RegisterStepOneContainer = () => {

    const { Fonts, Gutters, Layout } = useTheme()
    const navigation = useNavigation();

    useEffect(() => {
        Analytics.logScreen('Crear Usuario - Paso 1', 'RegisterStepOneContainer')
    }, []);

    return (
        <View style={[Layout.fill,Layout.colCenter, Layout.justifyContentBetween]}>
            <View style={[Layout.fill, Layout.colCenter]}>
                <View style={[Gutters.regularBMargin, Gutters.regularPadding]}>
                    <Text style={Fonts.sourceSansBold}>{'¿Cómo querés registrarte?'}</Text>
                </View>
                <View style={[Layout.fullWidth, Layout.rowCenter, Layout.justifyContentBetween]}>
                    <ShortCard 
                        action={() => navigation.navigate('RegisterStepTwo', {isEmployee: true})} 
                        imageName='employee' 
                        cardText='PERSONA'
                    />
                    <ShortCard 
                        action={() => navigation.navigate('RegisterStepTwo', {isEmployee: false})} 
                        imageName='company' 
                        cardText={'EMPRESA'}
                    />
                </View>
            </View>
            <View style={[Layout.fullWidth, Gutters.smallHPadding, Gutters.regularTMargin]}>
                <Button 
                    titleStyle={[Fonts.sourceSansLight, {color: '#389548'}]} 
                    type='clear' 
                    title="VOLVER" 
                    onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    )
}

export default RegisterStepOneContainer