import React, { useState } from 'react'
import { Image, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import { useSelector } from 'react-redux'

const DashboardSlide = (props) => {

  const { Layout, Images, Common, Gutters } = useTheme()
  const { isConnected } = useSelector((state) => state.network)
  const navigation = useNavigation()

  return(
    <Animatable.View animation={props.animate} duration={700} style={[{maxHeight: 150}, Gutters.regularTMargin]}>
      <TouchableOpacity 
        disabled={props.type === 'art' ? !isConnected : false}
        containerStyle={(props.type === 'art' && !isConnected) && {opacity: 0.5}}
        onPress={() => navigation.navigate(props.navPage)} 
        style={[[Common.card, {height:'100%', width: '100%', maxHeight: 250, overflow: "hidden"}]]}>
          <Image 
            source={Images[props.imageName]} 
            resizeMode='cover' 
            style={{width:'100%', height: '100%'}}
          />
          <View style={[
            {
              overflow: "hidden",
              position:'absolute',
              top: 15, 
              width: '100%',
              height: '100%',
            }
          ]}>
            <Image 
              source={Images[props.logoName]} 
              resizeMode="cover"
              style={[
                {
                  width: '30%',
                  height: '30%'
                }
              ]}
            />
          </View>
          
      </TouchableOpacity>
    </Animatable.View>
    
  )

}

export default DashboardSlide