import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { useTheme } from '@/Theme'

const styles = StyleSheet.create({
    text: {
        color: '#000',
        textAlign: 'center'
    },
    imageSize: {
        height: 70
    },
    cardHeight: {
        height: 150
    }
});

const NoConnection = (props) => {

    const { Layout, Common, Images, Fonts, Gutters } = useTheme()

    return (
        <View style={[ Layout.fullSize, {backgroundColor: 'white', position: 'absolute', zIndex: 1000}]}>
            <View style={[Layout.fill, Layout.center]}>
                <Image style={{ height: 80, width: 250}} resizeMode={'contain'} source={Images['expertaLogo']}/>
                <Icon
                    type="MaterialIcons"
                    name='wifi-off'
                    size={35}
                    color='gray'
                    style={Gutters.smallTMargin}
                />
                <Text 
                    style={[Fonts.sourceSansRegular, Gutters.smallPadding, {textAlign: 'center', color: 'black'}]}
                >
                    No tenes conexión a internet para poder utilizar la aplicación. Verifica tu señal y volve a intentar.
                </Text> 
            </View>
                
            </View>
    ) 
  
}

export default NoConnection
