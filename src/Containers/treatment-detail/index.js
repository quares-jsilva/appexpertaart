import React, { useCallback, useEffect, useState } from 'react'
import { View, Text } from "react-native"
import Analytics from '../../libs/analytics'
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import { Card } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux'
import { showMessage } from '@/Components/MessageHelper'
import Loading from './loading'
import TurnCard from '../../Components/TurnCard'
import Timeline from 'react-native-timeline-flatlist'
import TurnApi from '@/Services/Turn/Turn'

const TreatmentContainer = ({route}) => {

    const { Layout, Gutters, Fonts, Common } = useTheme()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { claimDetail, message } = useSelector((state) => state.claim)
    const nextMonth = new Date((+new Date) + 8035200000)
    const [turns, setTurns] = useState([])
    const [loading, setLoading] = useState(true)

    const getTurns = useCallback(async () => {
        if(!!claimDetail){
            try {
                const response = await TurnApi.getTurns(
                    {
                        siniestro: claimDetail.expediente,
                        fechaDesde: new Date(),
                        fechaHasta: nextMonth
                    }
                )
                setLoading(false)
                if(response.data && response.data.length > 0) {
                    /* Sort turns */
                    const sortedTurns = response.data.sort((a, b) => new Date(b.fechaTurno).getTime() - new Date(a.fechaTurno).getTime())

                    setTurns(sortedTurns);
                } else {
                    showMessage({
                        'message': 'No se encontraron turnos', 
                        'type': 'warning',
                        'button': {
                            'text': 'Aceptar',
                            'onPress': () => navigation.goBack()
                        }
                    })
                }
            } catch(error) {
                setLoading(false)
                showMessage({
                    'message': message, 
                    'type': 'error',
                    'button': {
                        'text': 'Aceptar',
                        'onPress': () => navigation.goBack()
                    }
                })
            }
        }
    }, [claimDetail])

    useEffect(() => {
        Analytics.logScreen('Detalle de tratamiento', 'TreatmentContainer')
    }, [])

    useEffect(() => {
        getTurns();
    }, [])

    const renderDetail = (rowData, sectionID, rowID) => {
        return (
            <TurnCard dashboard={false} turn={rowData}/>
        )
    }

    return (
        loading ? <Loading/> :
        <View style={Layout.fullHeight}>
            <View style={[Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                <Card containerStyle={[Common.card, Layout.fullWidth]}>
                    <View>
                        <View style={[Layout.row, Layout.justifyContentBetween]}> 
                            <Text style={[Fonts.sourceSansSemibold, {color: '#389548'}]}>{'Afiliado:'}</Text>
                            <Text style={Fonts.sourceSansLight}>{route.params.siniestrado}</Text>
                        </View>
                        <View style={[Layout.row, Layout.justifyContentBetween]}> 
                            <Text style={[Fonts.sourceSansSemibold, {color: '#389548'}]}>{'Nro. de siniestro:'}</Text>
                            <Text style={Fonts.sourceSansLight}>{claimDetail.expediente}</Text>
                        </View>
                    </View>
                </Card>
            </View>
            {
                turns.length > 1 ?
                <View style={[Layout.fill, Layout.fullWidth, Gutters.smallTMargin]}>
                    <Timeline
                    innerCircle={'dot'}
                    renderDetail={renderDetail}
                    data={turns}
                    style={[Layout.fill, Layout.fullWidth]}
                    showTime={false}
                    circleColor='#389548'
                    lineColor='#389548'
                    detailContainerStyle={Gutters.smallHPadding}
                    />
                </View>
                :
                turns[0] && 
                <View style={[Layout.fullWidth, Gutters.smallPadding, {height: 150 }]}>
                    <TurnCard dashboard={false} turn={turns[0]}/>
                </View>
            }
        </View>
    )
}

export default TreatmentContainer