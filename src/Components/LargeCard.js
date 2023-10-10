import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
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

const LargeCard = (props) => {

    const { Layout, Common, Images, Fonts, Gutters } = useTheme()

    return (
        <TouchableOpacity 
        onPress={props.action} 
        style={[Common.card, Layout.center, styles.cardHeight, props.style]}>
            {
                props.imageName && 
                <Image style={styles.imageSize} resizeMode={'contain'}  source={Images[props.imageName]}/>
            }
            <Text style={[styles.text, Fonts.sourceSansSemibold, Gutters.smallTMargin, props.textStyle]}>{props.cardText}</Text>
        </TouchableOpacity>
    )
  
}

export default LargeCard