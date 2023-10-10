import React, {useState} from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import { useTheme } from '@/Theme'

const Domain = (props) => {

    const { Layout, Common, Images, Gutters, Fonts } = useTheme()

    return (
        <View style={[Common.card,Layout.fill, Layout.center,{height: 100, overflow: 'hidden'}, Gutters.smallMargin]}>
            <View style={[{backgroundColor: '#389548', padding: 5, width: '100%', marginBottom: 20}]}></View>
            <View style={[Layout.row, Layout.fill, Layout.center,{height: 100}, Gutters.smallMargin]}>
                <View style={[Layout.fill, Layout.center]}>
                    <Image style={{height: 100, width: 100}} resizeMode={'contain'}  source={Images['logoArt']}/>
                </View>
            </View>
        </View>
    )
  
}

export default Domain