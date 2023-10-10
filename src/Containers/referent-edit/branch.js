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

const Branch = ({show, branches, setBranch, markedBranches}) => {

    const { Common, Fonts, Gutters, Layout } = useTheme()
    const [visible, setVisible] = useState(true)
    const [selectedBranches, setSelectedBranches] = useState(markedBranches)

    const pressBranch = (item) => {
        if(selectedBranches.some(b => b.id === item.id)) {
            setSelectedBranches(selectedBranches.filter(b => b.id !== item.id))
        } else {
            setSelectedBranches([...selectedBranches, item])
        }
        setBranch(item)
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item, index }) => 
    {
        return (
            <CheckBox
                title={item.nombre}
                textStyle={[Fonts.sourceSansSemiBold, Gutters.smallHPadding, {fontWeight: 'normal'}]}
                checkedColor={'#389548'}
                checked={selectedBranches.findIndex(b => b.id === item.id) !== -1 ? true : false}
                onPress={() => pressBranch(item, index)}
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
                    data={branches}
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

export default Branch
