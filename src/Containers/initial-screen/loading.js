import React from 'react'
import { View, Dimensions } from 'react-native'
import { useTheme } from '@/Theme'
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

const Loading = (props) => {

    const { Layout, Common, Images, Gutters, Fonts } = useTheme()
    const ITEM_WIDTH = Dimensions.get('window').width

    return (
        <SkeletonPlaceholder>
            <View style={[Layout.fullSize, Gutters.regularTMargin]}>
                <View style={[Layout.center, Gutters.smallPadding]}>
                    <View style={{ width: ITEM_WIDTH * 0.9, height: 150, borderRadius: 10 }} />
                </View>
                <View style={[Layout.center, Gutters.smallPadding]}>
                    <View style={{ width: ITEM_WIDTH * 0.9, height: 150, borderRadius: 10 }} />
                </View>
                <View style={[Layout.center, Gutters.smallPadding]}>
                    <View style={{ width: ITEM_WIDTH * 0.9, height: 80, borderRadius: 10 }} />
                </View>
                <View>
                    <View style={[Layout.rowCenter, Layout.justifyContentAround, Gutters.smallPadding]}>
                        <View style={{ width: ITEM_WIDTH * 0.9, height: 100, width: 100, borderRadius: 10 }} />
                        <View style={{ width: ITEM_WIDTH * 0.9, height: 100, width: 100, borderRadius: 10 }} />
                        <View style={{ width: ITEM_WIDTH * 0.9, height: 100, width: 100, borderRadius: 10 }} />
                    </View>
                </View>
            </View>
        </SkeletonPlaceholder>
    )
  
}

export default Loading