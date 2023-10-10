import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, TouchableOpacity, Image, Text, ActivityIndicator } from "react-native"
import { useTheme } from '@/Theme'
import { ListItem } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Analytics from '../../libs/analytics'
import { useSelector } from 'react-redux'
import Filter from './filter'
import { viewer } from '@/Store/User/userDefinitions'
import Loading from './loading'
import ClaimApi from '@/Services/Claim/Claim'
import { showMessage } from '@/Components/MessageHelper'

const ClaimListContainer = (param) => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const navigation = useNavigation();
    const { dest, viewAs = viewer.AFILIADO, contractSelected } = param.route.params || {}
    const [showFilter, setShowFilter] = useState(false)
    const [filter, setFilter] = useState({})
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])
    const [range, setRange] = useState({from: 0, to: 11})
    const { data } = useSelector((state) => state.user)
    const [claims, setClaims] = useState([])
    const [myClaims, setMyClaims] = useState([])
    const { affiliatedContracts, clientContractSelected } = useSelector((state) => state.contract )
    const [endReached, setEndReached] = useState(false)

    const filterBy = (ary, prop) => {
        var seen = new Set();
        return ary.filter(item => !seen.has(item[prop]) && seen.add(item[prop]));
    }

    useFocusEffect(
        useCallback(() => {(async () => {
            if(viewAs === viewer.CLIENTE ){
                try {
                    setLoading(true)
                    const response = await ClaimApi.getClaims(
                        {
                            nroPoliza: !!contractSelected ? contractSelected.nro_contrato : clientContractSelected.nro_contrato,
                            rowDesde: filter.from && filter.from || filter.from === 0 ? filter.from : range.from,
                            rowHasta: filter.to ? filter.to : range.to,
                            fechaDenunciaDesde: filter.fechaDenunciaDesde ? new Date(filter.fechaDenunciaDesde) : null,
                            fechaDenunciaHasta: filter.fechaDenunciaHasta ? new Date(filter.fechaDenunciaHasta) : null,
                            nombre: filter.nombre ? filter.nombre : null,
                            cuil: filter.cuil ? filter.cuil : null,
                            estadoAdm: filter.estadoAdm ? filter.estadoAdm : null,
                            nroSiniestro: filter.nroSiniestro ? filter.nroSiniestro : null
                        }
                    )
                    setClaims(filterBy([...claims, ...response.data], 'expediente'))
                    setLoading(false)
                } catch(error) {
                    setLoading(false)
                    showMessage({
                        'message': error.message, 
                        'type': 'error',
                        'button': {
                            'text': 'Aceptar',
                            'onPress': () => navigation.goBack(),
                        },
                        'buttonHelp': {
                            onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ClaimList' }) 
                        }
                    })
                }
            } else {
                let claims = []
                let error = []
    
                let polizas = !!contractSelected ? contractSelected : affiliatedContracts.map(contract => contract.nro_contrato)
                setLoading(true)
                for(const poliza of polizas) {
                    try {
                        const response = await ClaimApi.getClaims({
                            nroPoliza: poliza,
                            dni: data.documento
                        })
                        if(response.data && response.data.length > 0) {
                            const claimsFiltered = response.data.filter(claim => claim.dniEmpleado.substr(2, data.documento.length) === data.documento)
                            claims.push(
                            ...claimsFiltered.map((item) => ({ ...item, poliza }))
                            )
                        }
                    } catch (err) {
                        error.push(poliza)
                    }
                }
                setMyClaims(claims)
                setLoading(false)
            }
        })()}, [range, filter])
    )

    const loadMore = () => {
        setRange({from: range.from + 10, to: range.to + 10})
    }

    useEffect(()=>{
        if(claims || myClaims) {
            setList(viewAs === viewer.CLIENTE ? claims : myClaims)
        }
        
    },[claims, myClaims, viewAs])

    useEffect(()=>{
        navigation.setOptions({
            title: viewAs === viewer.CLIENTE ? "Listado de siniestros" : "Mis siniestros",
            headerRight: () => (
                <TouchableOpacity 
                    onPress={() => {
                        Analytics.logEvent('FiltrarSiniestros', 'ClaimListContainer')
                        setShowFilter(true)
                    }}
                    style={Gutters.smallRPadding}
                >
                    <Image 
                        style={{width: 25, height: 25}} 
                        resizeMode={'contain'}  
                        source={Images['filterIcon']}
                    />
                </TouchableOpacity>
            )
        })
    }, []);

    
/*
    const [filter, setFilter] = useState({
        nombre: null,
        cuil: null,
        nroPoliza: clientContractSelected.nro_contrato,
        estadoAdm: null,
        fechaDenunciaDesde: null,
        fechaDenunciaHasta: null,
        rowDesde: 1,
        rowHasta: 11
    })

    useEffect(()=>{
        dispatch(getClaimsClient(filter))
    },[clientContractSelected])
*/
    useEffect(() => {
        Analytics.logScreen(`Listado Siniestros - ${viewAs}`, 'ClaimListContainer')
    }, []);

    const keyExtractor = (item, index) => index.toString()

    const estadoAdmin = {
        'N': 'En análisis',
        'R': 'Rechazado',
        'A': 'Aceptado'
    }

    const isReingreso = (reingreso, tieneJuicio) => {
        let today = (new Date()).getTime()
        let date = reingreso ? ((new Date(reingreso)).getTime()) : 0
        return reingreso !== null && tieneJuicio === "N" && (today - date) / 1000 / 60 / 60 / 24 < 15
    }
    
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ClaimDetail', {claimSelected: item, viewAs, contractSelected})}>
            <ListItem bottomDivider >
                <ListItem.Content>
                    <View style={[Layout.row, Layout.justifyContentBetween]}>
                        <View style={Layout.fill}>
                            <ListItem.Title style={Fonts.sourceSansSemibold}>
                                {
                                    estadoAdmin[item.estadoAdmin]
                                }
                            </ListItem.Title>
                            {
                                item.tieneJuicio == 'S' &&
                                <ListItem.Subtitle style={Fonts.sourceSansSemibold}>
                                    {'JUICIO'}
                                </ListItem.Subtitle>
                            }
                            {
                                isReingreso(item.fechaReingreso, item.tieneJuicio) &&
                                <ListItem.Subtitle style={Fonts.sourceSansSemibold}>
                                    {
                                        'REINGRESO'
                                    }
                                </ListItem.Subtitle>
                            }
                            <ListItem.Subtitle style={Fonts.sourceSansSemibold}>Siniestro: {item.expediente}</ListItem.Subtitle>
                        </View>
                        {
                            viewAs === viewer.CLIENTE &&
                            <View style={[Layout.fill, Layout.center]}>
                                <View>
                                    <ListItem.Title style={Fonts.sourceSansLight}>{item.nombre}</ListItem.Title>
                                    <ListItem.Subtitle style={Fonts.sourceSansLight}>Cuil: {item.dniEmpleado}</ListItem.Subtitle>
                                </View>
                            </View>
                        }
                    </View>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </TouchableOpacity>
    )

    return (
        <View style={[Layout.fill, Layout.colCenter]}>
            {
                showFilter &&
                <Filter 
                    filter={filter}
                    callback={(params) => { 
                        setFilter(params)
                        if(Object.keys(params).length === 0){
                            setRange({from: 0, to: 11})
                        }
                        setShowFilter(false)
                        setClaims([])
                    }}
                />
            }
            <View style={[Layout.fullWidth, Layout.fill]}>
                {
                    loading && list.length === 0 ? <Loading/> :
                        list.length === 0 ?
                        <View style={[Common.card, Gutters.smallMargin, Gutters.smallPadding, {borderRadius: 80}]}>
                            <Text 
                                style={[Fonts.sourceSansSemibold, Gutters.smallPadding, {textAlign: 'center'}]}
                            >
                                No encontramos siniestros para mostrar
                            </Text> 
                        </View>
                        :
                        <>
                            <FlatList
                                keyExtractor={keyExtractor}
                                data={list}
                                renderItem={renderItem}
                                onEndReachedThreshold={0.1}
                                onMomentumScrollBegin = {() => setEndReached(false)}
                                onEndReached = {() => {
                                    if (!endReached) {
                                        loadMore()
                                        setEndReached(true)
                                    }
                                }
                                }
                            />
                            {
                                loading &&
                                <ActivityIndicator size={70} color="#389548"/> 
                            }
                        </>
                }
            </View>
        </View>
    )

}

export default ClaimListContainer