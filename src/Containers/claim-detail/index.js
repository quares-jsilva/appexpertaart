import React, {useState, useEffect} from 'react'
import { View, Image, ScrollView, Text } from "react-native"
import { useTheme } from '@/Theme'
import { ButtonGroup, Card } from 'react-native-elements'
import Analytics from '../../libs/analytics'
import ClaimDetail from './ClaimDetail'
import ClaimChronology from './ClaimChronology'
import { viewer } from '@/Store/User/userDefinitions'

const ClaimDetailContainer = (param) => {

    const [selectedIndex, setSelectedIndex] = useState({selectedIndex:0});
    const { Layout, Gutters, Images, Common, Fonts } = useTheme()
    const { dest, claimSelected, viewAs = viewer.AFILIADO, contractSelected } = param.route.params || {}

    useEffect(() => {
        Analytics.logScreen(`Detalle Siniestro - ${viewAs}`, 'ClaimDetailContainer')
    }, []);
     
    const updateIndex = (selectedIndex) => {
        if(selectedIndex > 0) {
            Analytics.logEvent('VerCronologiaDeSiniestros', 'ClaimDetailContainer')
        }
        setSelectedIndex({selectedIndex})    
    }

    return (
        <ScrollView>
            <View style={[Layout.fill, Layout.colCenter, Gutters.smallPadding]}>
                {
                    viewAs === viewer.CLIENTE &&
                    <ButtonGroup
                        onPress={updateIndex}
                        selectedIndex={selectedIndex.selectedIndex}
                        buttons={['Detalle', 'Cronología']}
                        textStyle={Fonts.sourceSansSemibold}
                        containerStyle={{borderRadius: 80}}
                        selectedButtonStyle={{backgroundColor: '#389548'}}
                    />
                }
                {selectedIndex.selectedIndex > 0 ? (
                    <ClaimChronology claim={claimSelected}/>
                ) : (
                    <ClaimDetail claimSelected={claimSelected} viewAs={viewAs} contractSelected={contractSelected}/>
                )}
            </View>
        </ScrollView>
    )
}

export default ClaimDetailContainer