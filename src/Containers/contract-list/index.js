import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from "react-native"
import { useTheme } from '@/Theme'
import { ListItem, Icon, SearchBar } from 'react-native-elements'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Analytics from '../../libs/analytics'
import { useDispatch, useSelector } from 'react-redux'
import { useContracts } from '@/Hooks/useContracts'
import Loading from './loading'
import { viewer } from '@/Store/User/userDefinitions'
import ContractApi from '@/Services/Contract/Contract'
import { showMessage } from '@/Components/MessageHelper'

const ContractListContainer = (param) => {
    const navigation = useNavigation()
    const { dest, viewAs = viewer.AFILIADO } = param.route.params || {}

    const { Fonts, Layout, Common, Gutters } = useTheme()
    const [ filterText, setFilterText ] = useState('')
    const { lastContract } = useContracts({filterText, viewAs})
    const { pwid } = useSelector((state) => state.user)
    const [filter, setFilter] = useState('')
    const [page, setPage] = useState(0)
    const [contracts, setContracts] = useState([])
    const { affiliatedContracts, loading } = useSelector((state) => state.contract )
    const [loadingContracts, setLoadingContracts] = useState(false)
    const [lastPage, setLastPage] = useState(false)
    
    const dispatch = useDispatch()

    const search = (searched, text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
                .includes(
                    searched.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
                )
    }

    useFocusEffect(
        useCallback(() => { (async () => {
            if(viewAs === viewer.CLIENTE ){
                try {
                    setLoadingContracts(true)
                    const response = await ContractApi.getContractsClient({pagina: page, razonSocial: filterText})
                    if(response.data.length === 0){
                        setLastPage(true)
                        setLoadingContracts(false)
                    } else {
                        const transformed = response.data.map(({ cuit, razonSocial, numeroContrato, tipoContrato }) => ({ 
                            cuit: cuit, 
                            razon_social: razonSocial, 
                            nro_contrato: numeroContrato,
                            tipoContrato }))
                        setContracts([...contracts, ...transformed])
                        setLoadingContracts(false)
                    }
                } catch(error) {
                    setLoadingContracts(false)
                    showMessage({
                        'message': error.message, 
                        'type': 'error',
                        'button': {
                            'text': 'Aceptar',
                            'onPress': () => navigation.goBack(),
                        },
                        'buttonHelp': {
                            onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ContractList' }) 
                        }
                    })
                }
            }else{
                if(filterText != '') {
                    setContracts(
                        affiliatedContracts.filter( contract => 
                            search(filterText, contract.razon_social) ||
                            contract.cuit.includes(filterText)
                        )
                    )
                }else{
                    setContracts(affiliatedContracts)
                }
            }
        })()
        }, [filterText, page])
    )

    const loadMore = () => {
        if(!lastPage){
            setPage(page + 1)
        }
    }

    useEffect(() => {
        Analytics.logScreen('Lista de contratos', 'ContractListContainer')
    }, []);

    const selectContract = (contract) => {
        navigation.navigate(dest ? dest : 'ContractDetail', {viewAs, contractSelected: contract})
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => selectContract(item)}>
            <ListItem bottomDivider >
                <ListItem.Content>
                    <ListItem.Title style={[Fonts.sourceSansSemibold]}>{item.razon_social}</ListItem.Title>
                    <ListItem.Subtitle style={Fonts.sourceSansSemibold}>CUIT: {item.cuit}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </TouchableOpacity>
    )

    const searchText = (value) => {
        setLastPage(false)
        setContracts([])
        setPage(0)
        setFilterText(value)
    }

    return (
            <View style={[Layout.fill]}>
                <View style={[Layout.fullWidth]}>
                    <SearchBar
                        placeholder="Escribí aquí..."
                        value={filterText}
                        onChangeText={searchText}
                        style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                        lightTheme={true}
                    />
                </View>
                <View style={[Layout.fullWidth, Layout.fill]}>
                    { (loading || loadingContracts) && contracts.length === 0 ? 
                        <Loading/>
                    : 
                        contracts && contracts.length === 0 ?
                            <View style={[Common.card, Gutters.smallMargin, Gutters.smallPadding, {borderRadius: 80}]}>
                                <Text 
                                    style={[Fonts.sourceSansSemibold, Gutters.smallPadding, {textAlign: 'center'}]}
                                >
                                    No encontramos pólizas para mostrar
                                </Text> 
                            </View>
                            :
                            <>
                                <FlatList
                                    keyExtractor={keyExtractor}
                                    data={contracts}
                                    renderItem={renderItem}
                                    onEndReached={() => loadMore()}
                                    onEndReachedThreshold={1}
                                />
                                {
                                    loadingContracts &&
                                    <ActivityIndicator size={70} color="#389548"/> 
                                }
                            </>
                    }
                </View>
            </View>
    )

}

export default ContractListContainer