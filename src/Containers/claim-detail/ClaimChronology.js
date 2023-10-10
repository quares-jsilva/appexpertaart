import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import Analytics from '../../libs/analytics'
import moment from 'moment'
import { Card, Button } from 'react-native-elements'
import Timeline from 'react-native-timeline-flatlist'
import { useSelector } from 'react-redux'
import Loading from './loadingChronology'
import styles from './styles';

const ClaimChronology = ({claim}) => {

  const { Layout, Common, Fonts, Gutters } = useTheme()
  const { claimDetail, loading } = useSelector((state) => state.claim )
  const navigation = useNavigation();

  useEffect(() => {
    Analytics.logScreen('Cronologia de siniestro', 'ClaimChronology')
  }, []);

  const renderDetail = (rowData, sectionID, rowID) => {
    return (
      rowData.hayDetalle === 'N' ?
      (
        <View>
          <Text style={Fonts.sourceSansSemibold}>{rowData.titulo}</Text>
          <Text style={Fonts.sourceSansLight}>{rowData.fechaTitulo ? moment(rowData.fechaTitulo).format("DD/MM/YYYY").toString() : '-'}</Text>
        </View> 
      ) : 
      (
        <View style={[Layout.row, Layout.justifyContentBetween]}>
          <View>
            <Text style={Fonts.sourceSansSemibold}>{rowData.titulo}</Text>
            <Text style={Fonts.sourceSansLight}>{rowData.fechaTitulo ? moment(rowData.fechaTitulo).format("DD/MM/YYYY").toString() : '-'}</Text>
          </View>
          <View>
            <Button
              title={'Ver detalle'}
              titleStyle={[Fonts.sourceSansLight, {color: '#389548'}]}  
              type={'clear'}
              onPress={() => {
                Analytics.logEvent('VerDetalleDeTratamiento', 'ClaimChronology')
                navigation.navigate('TreatmentDetail', {expediente: claim.expediente, siniestrado: claimDetail.siniestrado})
              }}/>
          </View>
        </View>
      )
  )
  }

  return (
    loading ?
      <Loading/>
    :
      (
        <View style={[Layout.fill, Layout.fullWidth, Layout.colCenter]}>
          <View style={[Layout.fill, Layout.fullWidth, Layout.center]}>
              <Card containerStyle={[Common.card, Layout.fullWidth]}>
                  {
                    <View style={[Layout.row, Layout.center]}> 
                        <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{claimDetail && claimDetail.siniestrado}</Text>
                    </View>
                  }
                  <Timeline
                      innerCircle={'dot'}
                      renderDetail={renderDetail}
                      data={claimDetail && claimDetail.listadoEtapas}
                      style={[Layout.fill, Layout.fullWidth]}
                      showTime={false}
                      circleColor='#389548'
                      lineColor='#389548'
                  />
              </Card>
          </View>
        </View>
      )
  )

}

export default ClaimChronology