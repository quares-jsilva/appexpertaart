import React, { useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { useTheme } from '@/Theme'
import { Button, Overlay, CheckBox } from 'react-native-elements'

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
    },
    buttonRadius: {
        borderRadius: 80
    },
})

const Position = ({show, positions, setPosition, markedPosition}) => {

    const { Common, Fonts, Gutters, Layout } = useTheme()
    const [visible, setVisible] = useState(true)
    const [selectedPosition, setSelectedPosition] = useState(markedPosition && markedPosition.id)

    const pressPosition = (item) => {
        setSelectedPosition(item.id)
        setPosition(item)
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item, index }) => 
    {
        return (
            <CheckBox
                title={item.nombre}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                textStyle={[Fonts.sourceSansSemiBold, Gutters.smallHPadding, {fontWeight: 'normal'}]}
                checkedColor={'#389548'}
                checked={selectedPosition === item.id ? true : false}
                onPress={() => pressPosition(item)}
            />
        )
    }
  
    return (
        <Overlay 
            isVisible={visible}
            overlayStyle={
                [
                    Common.card, 
                    {width: 300,overflow: "hidden", padding: 0},
                    Gutters.largeVMargin
                ]}
        >
            <View style={[Layout.fullHeight, Gutters.smallPadding]}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={positions}
                    renderItem={renderItem}
                />
                <View style={[Gutters.smallHPadding, Gutters.smallTPadding]}>
                    <Button 
                        buttonStyle={[styles.buttonRadius, { backgroundColor: '#389548' }]}
                        titleStyle={Fonts.sourceSansLight}
                        title="Aceptar"
                        onPress={show}
                    />
                </View>
                <View>
                    <Button
                        titleStyle={[Fonts.sourceSansLight, {color: '#389548'}]}
                        type={'clear'}
                        title="Cerrar"
                        onPress={show}
                    />
                </View>
            </View>
        </Overlay>
    )
}

export default Position
