import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    text: {
        color: 'grey',
        textAlign: 'center',
    },
    cardSize: {
        height: 100
    },
    imageSize: {
        height: 40
    }
});

const WideCard = (props) => {

    const { Layout, Common, Images, Fonts, Gutters } = useTheme()

    return (
        <TouchableOpacity 
            disabled={props.disabled}
            containerStyle={props.disabled && {opacity: 0.5}}
            onPress={props.action} 
            style={[Common.card, Layout.center, props.style, Gutters.smallPadding]}>
                {
                    props.imageName && 
                    <Image style={styles.imageSize} resizeMode={'contain'}  source={Images[props.imageName]}/>
                }
                <Text style={[Fonts.sourceSansSemibold, styles.text, props.textStyle, props.imageName && Gutters.smallTMargin]}>{props.cardText}</Text>
        </TouchableOpacity>
    )
  
}

export default WideCard