import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    text: {
        color: '#000',
        textAlign: 'center',
    },
    cardSize: {
        height: 100
    },
    imageSize: {
        height: 40,
        width: 60
    }
});

const WideImageCard = (props) => {

    const { Layout, Common, Images, Fonts, Gutters } = useTheme()

    return (
        <TouchableOpacity 
            disabled={props.disabled}
            containerStyle={props.disabled && {opacity: 0.5}}
            onPress={props.action} 
            style={[Common.card, Layout.row, Layout.justifyContentBetween, props.style, Gutters.smallPadding]}>
                <Text style={[Fonts.sourceSansRegular, styles.text, props.textStyle, props.imageName && Gutters.smallTMargin, Gutters.smallLMargin]}>{props.cardText}</Text>
                {
                    props.imageName && 
                    <Image style={styles.imageSize} resizeMode={'contain'}  source={Images[props.imageName]}/>
                }
        </TouchableOpacity>
    )
  
}

export default WideImageCard