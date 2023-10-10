import React, { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator } from "react-native"
import { SearchBar } from 'react-native-elements'
import { useDispatch } from 'react-redux'

import { useTheme } from '@/Theme'
import Analytics from '../../libs/analytics'
import Employee from './employee'
import { useEmployeeSearch } from './useEmployeeSearch'
import { updateEmployee } from '@/Store/Contract'
import Loading from './loading'

const EmployeeSearchContainer = (param) => {

    const { Fonts, Layout } = useTheme()
    const [filter, setFilter] = useState('')
    const [from, setFrom] = useState(0)
    const [to, setTo] = useState(10)
    const { contractSelected } = param.route.params || {}
    const {loading, employees, lastEmployee} = useEmployeeSearch(filter, from, to, contractSelected)
    const dispatch = useDispatch()

    useEffect(() => {
        Analytics.logScreen('Busqueda de empleados', 'EmployeeSearchContainer')
    }, []);

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => {
        return (<Employee data={item} onCheck={(data) => dispatch(updateEmployee(data))}/>)
    }

    const loadMore = () => {
        if(!lastEmployee) {
            setFrom(from + 10)
            setTo(to + 10)
        }
    }

    const updateSearch = (search) => {
        setFilter(search)
        setFrom(0)
        setTo(10)
    }

    return (
        <View style={[Layout.fill]}>
            <View style={[Layout.fullWidth]}>
                <SearchBar
                    placeholder="Buscar empleado"
                    value={filter}
                    style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                    lightTheme={true}
                    onChangeText={updateSearch}
                />
            </View>
            {
                loading && employees.length === 0 ? <Loading/> :
                <View style={[Layout.fill, Layout.fullWidth]}>
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={employees}
                        renderItem={renderItem}
                        onEndReached={() => loadMore()}
                        onEndReachedThreshold={1}
                    />
                    {
                        (loading && employees.length > 0) &&
                        <ActivityIndicator size={70} color="#4db8e8"/> 
                    }
                </View>
            }
        </View>
    )

}

export default EmployeeSearchContainer