import React from 'react'
import { View, Dimensions } from 'react-native'
import { useTheme } from '@/Theme'
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

const Loading = (props) => {

    const { Layout, Common, Images, Gutters, Fonts } = useTheme()
    const ITEM_WIDTH = Dimensions.get('window').width

    return (
        <SkeletonPlaceholder>
            <View style={[Layout.fullHeight, Layout.center, Gutters.smallPadding]}>
                <View style={{ width: ITEM_WIDTH * 0.6, height: 450, borderRadius: 10 }} />
            </View>
        </SkeletonPlaceholder>
    )
  
}

export default Loading