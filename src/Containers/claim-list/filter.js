import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { useTheme } from '@/Theme'
import { Button, Overlay, Input, CheckBox } from 'react-native-elements'
import { ScrollView } from 'react-native'
import { DatePicker } from '../../Components/'
import moment from 'moment'

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

const Filter = ({callback, filter}) => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const [name, setName] = useState(filter && filter.nombre ? filter.nombre : undefined)
    const [cuil, setCuil] = useState(filter && filter.cuil ? filter.cuil : undefined)
    const [claim, setClaim] = useState(filter && filter.nroSiniestro ? filter.nroSiniestro : undefined)
    const [from, setFrom] = useState(filter && filter.fechaDenunciaDesde ? new Date(filter.fechaDenunciaDesde) : new Date());
    const [to, setTo] = useState(filter && filter.fechaDenunciaHasta ? new Date(filter.fechaDenunciaHasta) : new Date())
    const [selectedState, setSelectedState] = useState(filter && filter.estadoAdm ? filter.estadoAdm : (filter.estadoAdm === null ? 'T' : undefined))
    const [dateTo, setDateTo] = useState(moment(to, 'DD-MM-YYYY').format('DD-MM-YYYY'))
    const [dateFrom, setDateFrom] = useState(moment(from, 'DD-MM-YYYY').format('DD-MM-YYYY'))

    const pressPosition = (value) => {
        setSelectedState(value)
    }

    const applyFilter = () => {
        callback({
            nombre: name,
            cuil,
            nroSiniestro: claim,
            // estadoAdm: selectedState === 'T' ? null : selectedState,
            fechaDenunciaDesde: from,
            fechaDenunciaHasta: to,
            // from: 0,
            // to: 21
        })
    }

    const onChangeDate = ({ type }, selectedDate, selectorType) => {
        if(type === 'set' && selectorType === 'dateTo') {
            setTo(selectedDate);

            if(Platform.OS === 'android') {
                setDateTo(moment(selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY'))
            }
        } else if (type === 'set' && selectorType === 'dateFrom') {
            setFrom(selectedDate);

            if(Platform.OS === 'android') {
                setDateFrom(moment(selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY'))
            }
        }

        return;
    };
  
    return (
        <Overlay 
            isVisible={true}
            overlayStyle={
                [
                    Common.card, 
                    {width: 300,overflow: "hidden", padding: 0},
                    Gutters.largeVMargin
                ]}
        >
            <ScrollView keyboardShouldPersistTaps={'always'}>
                <View style={[Layout.fullHeight, Gutters.smallPadding]}>
                    <Input
                        label='Nombre y apellido'
                        style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                        labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                        value={name}
                        onChangeText={value => setName(value)}
                    />
                    <Input
                        label='CUIL'
                        style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                        labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                        value={cuil}
                        onChangeText={value => setCuil(value)}
                    />
                    <Input
                        label='Número de siniestro'
                        style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                        labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                        value={claim}
                        onChangeText={value => setClaim(value)}
                    />
                    <View style={Gutters.smallPadding}>
                        <Text style={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}>Estado</Text>
                    </View>
                    <CheckBox
                        title={'Todos'}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                        checkedColor={'#389548'}
                        checked={selectedState === 'T'}
                        onPress={() => pressPosition('T')}
                    />
                    <CheckBox
                        title={'Aceptado'}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                        checkedColor={'#389548'}
                        checked={selectedState === 'A'}
                        onPress={() => pressPosition('A')}
                    />
                    <CheckBox
                        title={'En análisis'}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                        checkedColor={'#389548'}
                        checked={selectedState === 'N'}
                        onPress={() => pressPosition('N')}
                    />
                    <CheckBox
                        title={'Rechazado'}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                        checkedColor={'#389548'}
                        checked={selectedState === 'R'}
                        onPress={() => pressPosition('R')}
                    />
                    <View style={Gutters.smallPadding}>
                        <Text style={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}>Fecha desde</Text>
                    </View>
                    <View style={Gutters.smallPadding}>
                        <DatePicker
                            inputPlaceholder="Seleccioná una fecha" 
                            inputPlaceholderColor={'#DCDCDC'}
                            inputValue={dateFrom}
                            onChangeText={setDateFrom}
                            datePickerValue={from}
                            onChange={(params, selectedDate) => onChangeDate(params, selectedDate, 'dateFrom')}
                            minDate={new Date().setDate(new Date().getDate() - 10000)}
                            maxDate={new Date()}
                        />
                    </View>
                    <View style={Gutters.smallPadding}>
                        <Text style={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}>Fecha hasta</Text>
                    </View>
                    <View style={Gutters.smallPadding}>
                        <DatePicker
                            inputPlaceholder="Seleccioná una fecha" 
                            inputPlaceholderColor={'#DCDCDC'}
                            inputValue={dateTo}
                            onChangeText={setDateTo}
                            datePickerValue={to}
                            onChange={(value, selectedDate) => onChangeDate(value, selectedDate, 'dateTo')}
                            minDate={new Date().setDate(new Date().getDate() - 10000)}
                            maxDate={new Date()}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[Gutters.smallPadding]}>
                <Button 
                    buttonStyle={styles.buttonRadius}
                    titleStyle={[Fonts.sourceSansLight, { color: '#389548' }]}
                    title="Limpiar filtros"
                    type='clear'
                    onPress={() => callback({})}
                />
                <Button 
                    buttonStyle={[styles.buttonRadius, { backgroundColor: '#389548' }]}
                    titleStyle={Fonts.sourceSansLight}
                    title="Aceptar"
                    onPress={() => applyFilter()}
                />
            </View>
        </Overlay>
    )
}

export default Filter
