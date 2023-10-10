import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import { Card } from 'react-native-elements'
import Timeline from 'react-native-timeline-flatlist'
import { useDispatch, useSelector } from 'react-redux'
import TurnCard from '../../Components/TurnCard'
import { useTurns } from '@/Hooks/useTurns'
import Loading from './loading'

const TurnChronology = ({type}) => {

  const { Layout, Common, Fonts, Gutters } = useTheme()
  const navigation = useNavigation()
  const { hasTurns, turns, prevTurns, loading, lastTurn } = useTurns({type})

  const loadMore = () => {
    /*
    if(!lastTurn) {
      if(type != null && type === 'nexts') {
        setNextMonth(+(nextMonth) - 8035200000)
      } else {
        setNextMonth(+(nextMonth) + 8035200000)
      }
    }*/
  }

  const renderDetail = (rowData, sectionID, rowID) => {
    return (
        <TurnCard dashboard={false} turn={rowData}/>
    )
  }

  return (
    <View style={[Layout.fill, Layout.fullWidth, Layout.colCenter]}>
        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
            {
              loading ? <Loading/> :
                (type === 'nexts' && turns.length === 0) || (type === 'prevs' && prevTurns.length === 0) ?
                <View style={[Common.card, Gutters.smallMargin, Gutters.smallPadding, {borderRadius: 80}]}>
                    <Text 
                        style={[Fonts.sourceSansSemibold, Gutters.smallPadding, {textAlign: 'center'}]}
                    >
                        No encontramos turnos para mostrar
                    </Text> 
                </View>
                :
                <Timeline
                  innerCircle={'dot'}
                  renderDetail={renderDetail}
                  data={type === 'nexts' ? turns : prevTurns}
                  style={[Layout.fill, Layout.fullWidth]}
                  showTime={false}
                  circleColor='#389548'
                  lineColor='#389548'
                  detailContainerStyle={Gutters.smallHPadding}
                  options={{
                    onEndReached:() => loadMore()
                  }}
                />
            }
        </View>
    </View>
  )

}

export default TurnChronology