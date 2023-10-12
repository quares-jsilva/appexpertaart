import React, { useState, useEffect, useCallback } from 'react'
import { View, Image, ScrollView, Text, FlatList, TouchableOpacity, Platform } from "react-native"
import { Button, CheckBox, Card, Input, ListItem } from 'react-native-elements'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import moment from 'moment'

import { useTheme } from '@/Theme'
import Analytics from '../../libs/analytics'
import styles from './styles'
import Loading from './loading';
import { showMessage } from '@/Components/MessageHelper'
import { getCertificatePrintUrl, updateEmployee } from '@/Store/Contract'
import { BASE_URL_GATEWAY } from '@/Config'
import { useValidateDestinatary } from '@/Hooks/useValidateDestinatary'
import { viewer } from '@/Store/User/userDefinitions'
import { DatePicker } from '../../Components/'

const CoverageDetailContainer = (param) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { dest, contractSelected, viewAs = viewer.AFILIADO } = param.route.params || {}

    const { Layout, Gutters, Fonts, Common, Images } = useTheme()
    const { loading, printUrl, status, message, selectedEmployees } = useSelector((state) => state.contract )    
    const [type, setType] = useState(viewAs === viewer.AFILIADO && 'CN')
    const [allEmployee, setAllEmployee] = useState(true)
    const [nonEmployee, setNonEmployee] = useState(false)
    const [someEmployee, setSomeEmployee] = useState(false)
    const [activity, setActivity] = useState(false)
    const [heightWork, setHeightWork] = useState(false);
    const [date, setDate] = useState(new Date());
    const [vigencyDate, setVigencyDate] = useState(moment(new Date(), 'DD-MM-YYYY').format('DD-MM-YYYY'));
    const [showPicker, setShowPicker] = useState(false)

    const { destinatary, isNotValidDestinatary, errorDestinataryMessage, validateDestinatary } = useValidateDestinatary()

    useEffect(() => {
        Analytics.logScreen(`Certificado de cobertura - ${viewAs}`, 'CoverageDetailContainer')
    }, []);

    const toogleDatePicker = () => {
        setShowPicker(!showPicker);
    };

    const onChangeDate = ({ type }, selectedDate) => {
        if(type === 'set') {
            setDate(selectedDate);

            if(Platform.OS === 'android') {
                toogleDatePicker();
                setVigencyDate(moment(selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY'))
            }
        } else {
            toogleDatePicker();
        }
    };

    const shareDoc = () => {
        dispatch(getCertificatePrintUrl({
            poliza: contractSelected.nro_contrato, 
            actividad: activity,
            destinatarios: [destinatary],
            empleados: selectedEmployees.length > 0 ? selectedEmployees.map((item) => { return item.cuil }) : [],
            fechaPresentacion: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            nomina: type === 'SN' ? false : true,
            trabajoAltura: heightWork
        }))
    }

    const checkType = (type) => {
        switch (type) {
            case 'all':
                setAllEmployee(true)
                setSomeEmployee(false)
                setNonEmployee(false)   
                setType('CN') 
                break
            case 'some':
                setAllEmployee(false)
                setSomeEmployee(true)
                setNonEmployee(false) 
                setType('CN')

                break
            case 'non':
                setAllEmployee(false)
                setSomeEmployee(false)
                setNonEmployee(true) 
                setType('SN')
                break
        }
    }

    useEffect(() => {
        if(printUrl != null) {
            navigation.navigate(
            'PdfVisualizer', 
            {
                uri: `${BASE_URL_GATEWAY}art/documentacion/${contractSelected.nro_contrato}/cobertura/${printUrl}`,
                pdfName: '/certificado-de-cobertura.pdf',
                title: 'Certificado de cobertura',
                type: 'art'
            })
        }
    }, [printUrl])

    useFocusEffect(
        useCallback(() => {
            if(status === 'error') {
                showMessage({
                    'message': message, 
                    'type': 'error',
                    'button': {
                        'text': 'Aceptar',
                    },
                    'buttonHelp': {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'CoverageDetail' }) 
                    }
                })
            }
        }, [status])
    )

    const renderItem = ({item}) => {
        return (
            <ListItem bottomDivider >
                <ListItem.Content>
                    <ListItem.Title style={[Fonts.sourceSansSemibold]}>{'CUIL: ' + item.cuil}</ListItem.Title>
                    <ListItem.Subtitle style={Fonts.sourceSansLight}>{'Nombre: ' + item.nombre}</ListItem.Subtitle>
                </ListItem.Content>
                <TouchableOpacity onPress={()=> {removeEmployee(item)}}>
                    <Image 
                        style={{height: 30, width: 30}} 
                        resizeMode={'contain'} 
                        source={Images.back}
                    />
                </TouchableOpacity>
            </ListItem>
        )
    }

    const removeEmployee = (item) => {
        dispatch(updateEmployee(item))
    }

    const keyExtractor = (item, index) => index.toString()

    return (
        <ScrollView keyboardShouldPersistTaps={'always'}>
            {
                loading ? 
                (
                    <Loading/>
                ) :
                (
                    <View style={[Layout.fill]}>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                                <Card.Title>{contractSelected.razon_social}</Card.Title>
                                <Card.Divider/>
                                <View>
                                    <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                        <View>
                                            <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Cuit:'}</Text>
                                        </View>
                                        <View>
                                            <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{contractSelected.cuit}</Text>
                                        </View>
                                    </View>
                                    <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                        <View>
                                            <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Póliza:'}</Text>
                                        </View>
                                        <View>
                                            <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{contractSelected.nro_contrato}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </View>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallHPadding]}>
                            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                                <View>
                                    <View style={[Layout.fullWidth]}>
                                        <Input
                                            label='Destinatario'
                                            placeholder='A quien corresponda'
                                            placeholderTextColor={'#DCDCDC'}
                                            style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                            labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                            value={destinatary}
                                            onChangeText={value => validateDestinatary(value)}
                                            errorStyle={{ color: 'red' }}
                                            errorMessage={errorDestinataryMessage}
                                        />
                                        <View style={Gutters.smallHPadding}>
                                            <Text style={[Fonts.sourceSansSemibold, Gutters.smallBPadding, {color: 'grey'}]}>{'Fecha de vigencia de la nómina'}</Text>
                                            <DatePicker
                                                inputPlaceholder="Seleccioná una fecha" 
                                                inputPlaceholderColor={'#DCDCDC'}
                                                inputValue={vigencyDate}
                                                onChangeText={setVigencyDate}
                                                inputErrorStyle={{ color: 'red' }}
                                                inputErrorMessage={errorDestinataryMessage}
                                                datePickerValue={date}
                                                maxDate={new Date().setDate(new Date().getDate() + 7)}
                                                showPicker={showPicker}
                                                onPress={toogleDatePicker}
                                                onChange={onChangeDate}
                                            />
                                        </View>
                                        <CheckBox
                                            title='Trabajo en altura'
                                            textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                                            checkedColor={'#389548'}
                                            checked={heightWork}
                                            onPress={() => setHeightWork(!heightWork)}
                                        />
                                        <CheckBox
                                            title='Actividad de la empresa'
                                            textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                                            checkedColor={'#389548'}
                                            checked={activity}
                                            onPress={() => setActivity(!activity)}
                                        />
                                        {   viewAs === viewer.CLIENTE && 
                                            <>
                                                <View style={Gutters.smallPadding}>
                                                    <Text style={[Fonts.sourceSansSemibold, {color: 'grey'}]}>{'Tipo'}</Text>
                                                </View>
                                                <CheckBox
                                                    title='Toda la nómina'
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                                                    checkedColor={'#389548'}
                                                    checked={allEmployee}
                                                    onPress={() => checkType('all')}
                                                />
                                                <CheckBox
                                                    title='Sin nómina'
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                                                    checkedColor={'#389548'}
                                                    checked={nonEmployee}
                                                    onPress={() => checkType('non')}
                                                />
                                                <CheckBox
                                                    title='Algunos empleados'
                                                    checkedIcon='dot-circle-o'
                                                    uncheckedIcon='circle-o'
                                                    textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                                                    checkedColor={'#389548'}
                                                    checked={someEmployee}
                                                    onPress={() => checkType('some')}
                                                />
                                                {
                                                    someEmployee && 
                                                    <>
                                                        {
                                                            selectedEmployees.length == 0 ?
                                                                <Text style={[Fonts.sourceSansRegular, {textAlign: 'center',fontWeight: 'normal', color: 'red'}]}>
                                                                    Debes indicar al menos un empleado
                                                                </Text>
                                                            :
                                                                <View>
                                                                    <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding, {textAlign: 'center',fontWeight: 'normal'}]}>
                                                                        Listado de empleados
                                                                    </Text>
                                                                    <FlatList
                                                                        keyExtractor={keyExtractor}
                                                                        data={selectedEmployees}
                                                                        renderItem={renderItem}
                                                                    />
                                                                </View>
                                                        }
                                                        <Button 
                                                            titleStyle={[Fonts.sourceSansLight, {color: '#389548'}]} 
                                                            type='clear' 
                                                            title="AGREGAR EMPLEADOS" 
                                                            onPress={() => navigation.navigate('EmployeeSearch', {contractSelected})}
                                                        />
                                                    </>
                                                }
                                            </>
                                        }
                                        
                                    </View>
                                </View>
                            </Card>
                        </View>
                        <View style={[Gutters.smallPadding]}>
                            <Button titleStyle={Fonts.sourceSansLight} buttonStyle={styles.buttonStyle}
                                title="COMPARTIR CERTIFICADO"
                                disabled={isNotValidDestinatary || !(!!date)}
                                onPress={() => {
                                    Analytics.logEvent('VerCertificadoDeCobertura', 'CoverageDetailContainer')
                                    shareDoc()
                                }}
                            />
                        </View>
                    </View>
                )
            }
        </ScrollView>
    )
}

export default CoverageDetailContainer