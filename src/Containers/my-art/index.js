import React, { useEffect } from 'react'
import { View, Image, ScrollView, Text } from "react-native"
import { useTheme } from '@/Theme'
import { useNavigation } from '@react-navigation/native'
import { Card } from 'react-native-elements';
import WideCard from '../../Components/WideCard';
import styles from './styles'
import Analytics from '../../libs/analytics'
import { openUrl } from '@/libs/deepLinks'
import { virtualUrl, libraryUrl } from '@/Config'
import { useSelector } from 'react-redux'
import { viewer } from '@/Store/User/userDefinitions'

const MyArtContainer = () => {

    const { Layout, Gutters, Fonts, Common, Images } = useTheme()
    const { affiliatedContractSelected } = useSelector((state) => state.contract )
    const navigation = useNavigation()
    const { hasClaim, myClaims } = useSelector((state) => state.claim)

    useEffect(() => {
        Analytics.logScreen('Mi ART', 'MyArtContainer')
    }, []);

    const goToClaims = () => {
        const [singleClaim] = myClaims
        if(myClaims.length == 1 && singleClaim.estadoAdmin !== 'R') {
            navigation.navigate('ClaimDetail', {claimSelected: singleClaim})
        } else {
            navigation.navigate('ClaimList')
        }
    }

    return (
        <ScrollView>
            <View style={[Layout.fill, Layout.colCenter]}>
                <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallPadding]}>
                    <Card containerStyle={[Common.card, Layout.fullWidth]}>
                        <Card.Title>{affiliatedContractSelected.razon_social}</Card.Title>
                        <Card.Divider/>
                        <View>
                            <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                <View>
                                    <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Cuit:'}</Text>
                                </View>
                                <View>
                                    <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{affiliatedContractSelected.cuit}</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
                <View style={[Layout.fill, Layout.fullWidth, Gutters.smallHPadding, Gutters.smallTPadding]}>
                    <WideCard 
                        action={() => {
                            Analytics.logEvent('VerCertificadoDeCobertura', 'MyArt')
                            navigation.navigate('CoverageDetail', {viewAs: viewer.AFILIADO, contractSelected: affiliatedContractSelected})
                        }} 
                        imageName='coberturaLogo' 
                        cardText='CERTIFICADO DE COBERTURA'
                    />
                </View>
                <View style={[Layout.fill, Layout.fullWidth, Gutters.smallHPadding, Gutters.smallTPadding]}>
                    <WideCard 
                        action={() => {
                            Analytics.logEvent('VerClausulaDeNoRepeticion', 'MyArt')
                            navigation.navigate('NonRepetitionDetail', {viewAs: viewer.AFILIADO, contractSelected: affiliatedContractSelected})
                        }} 
                        imageName='repeticionLogo' 
                        cardText='CLÁUSULA DE NO REPETICIÓN'
                    />
                </View>
                {
                    hasClaim &&
                    <View style={[Layout.fill, Layout.fullWidth, Gutters.smallHPadding, Gutters.smallTPadding]}>
                        <WideCard 
                            action={() => {
                                Analytics.logEvent('VerSiniestros', 'MyArt')
                                goToClaims()
                            }} 
                            imageName='siniestrosLogo' 
                            cardText='SINIESTROS'
                        />
                    </View>
                }
                <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallHPadding, Gutters.smallBPadding]}>
                    <Card containerStyle={[Common.card, Layout.fullWidth]}>
                        <View style={[Layout.fill, Layout.fullWidth, Layout.center, Gutters.smallBMargin]}>
                            <Image style={styles.imageSize} resizeMode={'contain'}  source={Images['capacitacion']}/>  
                            <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTMargin]}>{'CAPACITACIONES'}</Text>
                        </View>
                        <Card.Divider/>
                        <View>
                            <View style={[Layout.row, Layout.justifyContentAround, Gutters.smallPadding]}> 
                                <View>
                                    <Text 
                                        style={Fonts.sourceSansLight} 
                                        onPress={() => {
                                            Analytics.logEvent('IrAEspacioVirtual', 'MyArt')
                                            openUrl(virtualUrl)
                                        }}
                                    >{'ESPACIO VIRTUAL'}</Text>
                                </View>
                                <View>
                                    <Text 
                                        style={Fonts.sourceSansLight} 
                                        onPress={() => {
                                            Analytics.logEvent('IrAlBlog', 'MyArt')
                                            openUrl(libraryUrl)
                                        }}
                                    >{'BLOG'}</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
            </View>
        </ScrollView>
    )
}

export default MyArtContainer