import React from 'react'
import { View, Image } from 'react-native'
import { useTheme } from '@/Theme'

const Brand = ({ height = 170, width = 170, mode = 'contain' }) => {
  const { Layout, Images } = useTheme()

  return (
    <View style={Layout.fill}>
      <Image style={Layout.fullSize} source={Images.logo} resizeMode={mode} />
    </View>
  )
}

export default Brand
