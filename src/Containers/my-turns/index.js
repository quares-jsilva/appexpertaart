import React, {useState, useEffect} from 'react'
import { View, Image, ScrollView, Text } from "react-native"
import { useTheme } from '@/Theme'
import { ButtonGroup, Card } from 'react-native-elements'
import Analytics from '../../libs/analytics'
import TurnChronology from './chronology'
import { useSelector, useDispatch } from 'react-redux'
import { incrementRateCounter } from '@/Store/User/user'

const MyTurnsContainer = () => {

    const [selectedIndex, setSelectedIndex] = useState({selectedIndex:0});
    const { Layout, Gutters, Images, Common, Fonts } = useTheme()
    const { rateCounter } = useSelector((state) => state.user )
    const dispatch = useDispatch()

    useEffect(() => {
        Analytics.logScreen('Mis turnos', 'MyTurns')
        if(rateCounter < 15){
            dispatch(incrementRateCounter())
        }
    }, []);
     
    const updateIndex = (selectedIndex) => {
        if(selectedIndex.selectedIndex > 0) {
            Analytics.logEvent('VerTurnosPrevios', 'MyTurns')
        } else {
            Analytics.logEvent('VerProximosTurnos', 'MyTurns')
        }
        setSelectedIndex({selectedIndex})    
    }

    return (
        <View style={[Layout.fill, Gutters.smallPadding]}>
            <View style={Layout.colCenter}>
                <ButtonGroup
                    onPress={updateIndex}
                    selectedIndex={selectedIndex.selectedIndex}
                    buttons={['PRÓXIMOS', 'ANTERIORES']}
                    textStyle={Fonts.sourceSansSemibold}
                    selectedButtonStyle={{backgroundColor: '#389548'}}
                    containerStyle={{borderRadius: 80}}
                />
            </View>
            {selectedIndex.selectedIndex > 0 ? (
                <TurnChronology type={'prevs'}/>
            ) : (
                <TurnChronology type={'nexts'}/>
            )}
        </View>
    )
}

export default MyTurnsContainer