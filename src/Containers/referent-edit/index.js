import React, { useEffect, useState } from 'react'
import { ScrollView, View, TouchableOpacity, Image } from "react-native"
import { useTheme } from '@/Theme'
import { Card, Button, Input } from 'react-native-elements'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import styles from './styles'
import Analytics from '../../libs/analytics'
import { useReferents } from '@/Hooks/useReferents'
import Position from './position'
import Type from './type'
import NumberInput from '../../Components/NumberInput'
import Branch from './branch'
import Loading from './loading'

const ReferentEditContainer = (param) => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const { referentId, contractSelected } = param.route.params || {}
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { loading, referentData, positions, types, branches, getPositions, getTypes, addReferent, getReferent, updateReferent, deleteReferent, getBranches } = useReferents({})
    const [showPosition, setShowPosition] = useState(false)
    const [showType, setShowType] = useState(false)
    const [showBranch, setShowBranch] = useState(false)
    const [positionSelected, setPositionSelected] = useState()
    const [typesSelected, setTypesSelected] = useState([])
    const [formAction, setFormAction] = useState('new')
    const [branchesSelected, setBranchesSelected] = useState([])

    const [mail, setMail] = useState('')
    const [nameData, setNameData] = useState('')
    const [dni, setDni] = useState('')
    const [phonePrefix, setPhonePrefix] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [internal, setInternal] = useState('')
    const [cellPrefix, setCellPrefix] = useState('')
    const [cellNumber, setCellNumber] = useState('')

    const [isNotValidMail, setIsNotValidMail] = useState(false)
    const [errorMailMessage, setErrorMailMessage] = useState('')
    const [isNotValidNameData, setIsNotValidNameData] = useState(false)
    const [errorNameDataMessage, setErrorNameDataMessage] = useState('')
    const [isNotValidDni, setIsNotValidDni] = useState(false)
    const [errorDniMessage, setErrorDniMessage] = useState('')
    const [isNotValidPhonePrefix, setIsNotValidPhonePrefix] = useState(false)
    const [errorPhonePrefixMessage, setErrorPhonePrefixMessage] = useState('')
    const [isNotValidPhoneNumber, setIsNotValidPhoneNumber] = useState(false)
    const [errorPhoneNumberMessage, setErrorPhoneNumberMessage] = useState('')
    const [isNotValidInternal, setIsNotValidInternal] = useState(false)
    const [errorInternalMessage, setErrorInternalMessage] = useState('')
    const [isNotValidCellPrefix, setIsNotValidCellPrefix] = useState(false)
    const [errorCellPrefixMessage, setErrorCellPrefixMessage] = useState('')
    const [isNotValidCellNumber, setIsNotValidCellNumber] = useState(false)
    const [errorCellNumberMessage, setErrorCellNumberMessage] = useState('')

    useEffect(() => {
        if(!!referentId && !!contractSelected) {
            getReferent({referentId, contractId: contractSelected.nro_contrato})
            setFormAction('update')
            navigation.setOptions({
                title: "Editar referente",
                headerRight: () => (
                    <TouchableOpacity
                        style={Gutters.smallRPadding}
                        onPress={() => {
                            Analytics.logEvent('BorrarReferente', 'ReferentEditContainer')
                            deleteReferent({contractSelected: contractSelected, referentId: referentId})
                        }}
                    >
                        <Image 
                            style={{width: 25, height: 25}} 
                            resizeMode={'contain'}  
                            source={Images['delete']}
                        />
                    </TouchableOpacity>
                )
            })
        }

    }, [referentId, contractSelected])

    useEffect(() => {
        Analytics.logScreen('Edición de Referente', 'ReferentEditContainer')
    }, []);

    const validateMail = (value) => {
        setMail(value)
        setIsNotValidMail(false)
        setErrorMailMessage('')
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!re.test(value)) {
            setIsNotValidMail(true)
            setErrorMailMessage('El email debe tener el formato del tipo mail@mail.com')
        }
        if(value == '') {
            setIsNotValidMail(true)
            setErrorMailMessage('El email es requerido')
        }
    }

    const validateNameData = (value) => {
        setNameData(value)
        setIsNotValidNameData(false)
        setErrorNameDataMessage('')
        if(!value.match("[a-zA-Z 'ñáéíóúÁÉÍÓÚÑÜü]+")) {
            setIsNotValidNameData(true)
            setErrorNameDataMessage('El nombre y apellido sólo puede tener letras, espacios, y apóstrofes')
        }
        if(value == '') {
            setIsNotValidNameData(true)
            setErrorNameDataMessage('El nombre y apellido es requerido')
        }
        if(value.length > 100) {
            setIsNotValidNameData(true)
            setErrorNameDataMessage('El nombre y apellido no puede tener más de 100 caracteres')
        }
    }

    const validateDni = (value) => {
        setDni(value)
        setIsNotValidDni(false)
        setErrorDniMessage('')
        if(!value.match("[0-9]+")) {
            setIsNotValidDni(true)
            setErrorDniMessage('El DNI sólo puede tener números')
        }
        if(value == '') {
            setIsNotValidDni(true)
            setErrorDniMessage('El DNI es requerido')
        }
    }

    const validatePhonePrefix = (value) => {
        setPhonePrefix(value)
        setIsNotValidPhonePrefix(false)
        setErrorPhonePrefixMessage('')
        if(value.length > 5) {
            setIsNotValidPhonePrefix(true)
            setErrorPhonePrefixMessage('El prefijo debe tener no más de 5 caracteres')
        }
        if(!value.match("[0-9]+")) {
            setIsNotValidPhonePrefix(true)
            setErrorPhonePrefixMessage('El prefijo sólo puede tener números')
        }
    }

    const validatePhoneNumber = (value) => {
        setPhoneNumber(value)
        setIsNotValidPhoneNumber(false)
        setErrorPhoneNumberMessage('')
        if(value.length > 8) {
            setIsNotValidPhoneNumber(true)
            setErrorPhoneNumberMessage('El número debe tener no más de 8 caracteres')
        }
        if(!value.match("[0-9]+")) {
            setIsNotValidPhoneNumber(true)
            setErrorPhoneNumberMessage('El número sólo puede tener números')
        }
    }

    const validateInternal = (value) => {
        setInternal(value)
        setIsNotValidInternal(false)
        setErrorInternalMessage('')
        if(!value.match("[0-9]+")) {
            setIsNotValidInternal(true)
            setErrorInternalMessage('El interno sólo puede tener números')
        }
    }

    const validateCellPrefix = (value) => {
        setCellPrefix(value)
        setIsNotValidCellPrefix(false)
        setErrorCellPrefixMessage('')
        if(value.length > 5) {
            setIsNotValidCellPrefix(true)
            setErrorCellPrefixMessage('El prefijo debe tener entre 2 y 4 caracteres')
        }
        if(!value.match("[0-9]+")) {
            setIsNotValidCellPrefix(true)
            setErrorCellPrefixMessage('El prefijo sólo puede tener números')
        }
    }

    const validateCellNumber = (value) => {
        setCellNumber(value)
        setIsNotValidCellNumber(false)
        setErrorCellNumberMessage('')
        if(value.length > 8) {
            setIsNotValidCellNumber(true)
            setErrorCellNumberMessage('El número debe tener entre 6 y 8 caracteres')
        }
        if(!value.match("[0-9]+")) {
            setIsNotValidCellNumber(true)
            setErrorCellNumberMessage('El número sólo puede tener números')
        }
    }

    useEffect(() => {
        if(!!contractSelected){
            getPositions()
            getTypes()
            getBranches(contractSelected.nro_contrato)
        }
    }, [contractSelected])

    useEffect(() => {
        if(!!referentData) {
            setPositionSelected(referentData.cargo)
            setTypesSelected(referentData.tipos)
            setBranchesSelected(referentData.sucursales ? referentData.sucursales : [])
        
            setMail(referentData.email ? referentData.email : '')
            setNameData(referentData.nombre)
            setDni(referentData.dni ? referentData.dni : '')
            const phone = referentData.telefonos && referentData.telefonos.find(phone => phone.tipo === 'FIJO') || ''
            const cellPhone = referentData.telefonos && referentData.telefonos.find(phone => phone.tipo === 'CELULAR') || ''
            setPhonePrefix(!!phone ? phone.prefijo : '') 
            setPhoneNumber(!!phone ? phone.numero : '')
            setInternal(!!phone ? phone.interno : '') 
            setCellPrefix(!!cellPhone ? cellPhone.prefijo : '') 
            setCellNumber(!!cellPhone ? cellPhone.numero : '') 
        }
    }, [referentData])

    const updateTypes = (value) => {
        if(typesSelected.some(t => t.id === value.id)) {
            setTypesSelected(typesSelected.filter(t => t.id !== value.id))
        } else {
            setTypesSelected([...typesSelected, {id: value.id, nombre: value.nombre}])
        }
    }

    const updateBranches = (value) => {
        if(branchesSelected.some(b => b.id === value.id)) {
            setBranchesSelected(branchesSelected.filter(b => b.id !== value.id))
        } else {
            setBranchesSelected([...branchesSelected, {id: value.id, nombre: value.nombre}])
        }
    }

    const saveReferent = () => {
        let telefonos = []
        if(phoneNumber !== '') {
            telefonos.push({
                tipo: "FIJO", 
                prefijo: phonePrefix,
                numero: phoneNumber,
                interno: internal
            })
        }
        if(cellNumber !== '') {
            telefonos.push({
                tipo: "CELULAR", 
                prefijo: cellPrefix,
                numero: cellNumber
            })
        }
        if(formAction === 'new') {
            Analytics.logEvent('SeAgregaNuevoReferente', 'ReferentEditContainer')
            addReferent({
                contractSelected: contractSelected,
                datos: {
                    aceptaNotificacion: false,
                    avisos: [],
                    cargo: positionSelected,
                    dni: dni,
                    email: mail,
                    idSucursales: branchesSelected.map(s => s.id),
                    nombre: nameData,
                    telefonos: telefonos,
                    tipos: typesSelected,
                    todasSucursales: false
                }
            })
        } else {
            Analytics.logEvent('SeActualizaReferente', 'ReferenteEditContainer')
            updateReferent({
                contractSelected: contractSelected,
                referentId: referentData.id,
                datos: {
                    aceptaNotificacion: false,
                    avisos: [],
                    cargo: positionSelected,
                    dni: dni,
                    email: mail,
                    idSucursales: branchesSelected.map(s => s.id),
                    nombre: nameData,
                    telefonos: telefonos,
                    tipos: typesSelected,
                    todasSucursales: false,
                    fechaUltimaModificacion: new Date()
                }
            })
        }
    }

    return (
        loading ? <Loading/> :
        <ScrollView keyboardShouldPersistTaps={'always'}>
            <View style={[Layout.fill]}>
                {
                    showPosition &&
                    <Position 
                        show={() => setShowPosition(false)} 
                        positions={positions}
                        setPosition={(value) => setPositionSelected(value)}
                        markedPosition={positionSelected}
                    />
                }
                {
                    showType &&
                    <Type 
                        show={() => setShowType(false)} 
                        types={types}
                        setType={(value) => updateTypes(value)}
                        markedTypes={typesSelected}
                    />
                }
                {
                    showBranch &&
                    <Branch 
                        show={() => setShowBranch(false)} 
                        branches={branches}
                        setBranch={(value) => updateBranches(value)}
                        markedBranches={branchesSelected}
                    />
                }
                <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                    <Card containerStyle={[Common.card, Layout.fullWidth]}>
                        <View style={Layout.fill}>
                            <Input
                                label='Nombre y Apellido'
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                value={nameData}
                                onChangeText={value => validateNameData(value)}
                                errorStyle={{ color: 'red' }}
                                errorMessage={errorNameDataMessage}
                            />
                            <Input
                                label='Email'
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                value={mail}
                                onChangeText={value => validateMail(value)}
                                errorStyle={{ color: 'red' }}
                                errorMessage={errorMailMessage}
                            />
                            <NumberInput
                                label='DNI'
                                containerStyle={Layout.fill}
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                value={dni}
                                onChange={value => validateDni(value)}
                                errorStyle={{ color: 'red' }}
                                errorMessage={errorDniMessage}
                            />
                            <View style={Layout.row}>
                                <NumberInput
                                    label='Prefijo'
                                    containerStyle={Layout.fill}
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    value={phonePrefix}
                                    onChange={value => validatePhonePrefix(value)}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={errorPhonePrefixMessage}
                                />
                                <NumberInput
                                    label='Nro. Teléfono'
                                    containerStyle={styles.fillTwo}
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    value={phoneNumber}
                                    onChange={value => validatePhoneNumber(value)}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={errorPhoneNumberMessage}
                                />
                                <NumberInput
                                    label='Interno'
                                    containerStyle={styles.fillTwo}
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    value={internal}
                                    onChange={value => validateInternal(value)}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={errorInternalMessage}
                                />
                            </View>
                            <View style={Layout.row}>
                                <NumberInput
                                    label='Prefijo'
                                    containerStyle={Layout.fill}
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    value={cellPrefix}
                                    onChange={value => validateCellPrefix(value)}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={errorCellPrefixMessage}
                                />
                                <NumberInput
                                    label='Nro. Celular (Sin 15)'
                                    containerStyle={styles.fillTwo}
                                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                    labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                    value={cellNumber}
                                    onChange={value => validateCellNumber(value)}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={errorCellNumberMessage}
                                />
                            </View>
                            <Input
                                label='Cargo'
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                onPressIn={() => {setShowPosition(true)}}
                                value={positionSelected && positionSelected.nombre}
                                errorStyle={{ color: 'red' }}
                                errorMessage={positionSelected ? '' : 'Debes ingresar un cargo'}
                            />
                            <Input
                                label='Establecimiento/Obra'
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                onPressIn={() => {setShowBranch(true)}}
                                value={branchesSelected && branchesSelected.map(b => { return b.nombre }).join(", ")}
                            />
                            <Input
                                label='Tipo de contacto'
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}]}
                                onPressIn={() => {setShowType(true)}}
                                value={typesSelected && typesSelected.map(t => { return t.nombre }).join(", ")}
                                errorStyle={{ color: 'red' }}
                                errorMessage={typesSelected.length > 0 ? '' : 'Debes ingresar al menos un tipo'}
                            />
                        </View>
                    </Card>
                </View>
                <View style={[Gutters.smallPadding]}>
                    <Button 
                        buttonStyle={[styles.buttonRadius, styles.greenColor]}
                        titleStyle={Fonts.sourceSansLight}
                        title="CONFIRMAR"
                        disabled={
                            isNotValidNameData ||
                            isNotValidDni ||
                            (
                                isNotValidMail &&
                                (
                                    isNotValidPhonePrefix ||
                                    isNotValidPhoneNumber ||
                                    isNotValidInternal
                                ) ||
                                (
                                    isNotValidCellPrefix ||
                                    isNotValidCellNumber
                                )
                            ) ||
                            !positionSelected ||
                            typesSelected.length < 1
                        }
                        onPress={() => saveReferent()}
                    />
                </View>
            </View>
        </ScrollView>
        
    )
}

export default ReferentEditContainer