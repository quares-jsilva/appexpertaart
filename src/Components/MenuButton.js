import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/Theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  text: {
      color: 'grey',
      textAlign: 'center',
      fontSize: 8,
  },
  size: {
    height: 60, 
    width: 60
  },
  margin: {
    margin: 5
  }
});

const MenuButton = (props) => {

  const { Layout, Common, Images, Fonts } = useTheme()

  return (
    <Animatable.View animation={props.animate} duration={300}>
      <TouchableOpacity 
        disabled={props.disabled}
        containerStyle={props.disabled && {opacity: 0.5}}
        onPress={props.action} 
        style={[Common.circle, Layout.center, styles.margin, {...props.style}]}>
        <Image style={styles.size} resizeMode={'contain'}  source={Images[props.imageName]}/>
      </TouchableOpacity>
      <Text style={[Fonts.sourceSansRegular, styles.text]}>{props.bottomText}</Text>
    </Animatable.View>
  )

}

export default MenuButton