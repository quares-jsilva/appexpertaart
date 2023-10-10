import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/Theme'

const styles = StyleSheet.create({
    text: {
        color: 'grey',
        textAlign: 'center',
    },
    cardSize: {
        height: 120
    },
    imageSize: {
        height: 40
    }
});

const ShortCard = (props) => {

    const { Layout, Common, Images, Fonts, Gutters } = useTheme()

    return (
        <TouchableOpacity 
            onPress={props.action} 
            style={[Common.card, Layout.center,Layout.fill, Gutters.smallMargin, Gutters.smallPadding, {...props.style}]}>
                {
                    props.imageName &&
                    <Image style={styles.imageSize} resizeMode={'contain'}  source={Images[props.imageName]}/>
                }
                <Text style={[styles.text, Fonts.sourceSansSemibold, props.imageName && Gutters.smallTMargin]}>{props.cardText}</Text>
        </TouchableOpacity>
    )
  
}

export default ShortCard