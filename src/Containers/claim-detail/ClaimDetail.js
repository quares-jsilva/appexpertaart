import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/Theme'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import { Card } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux'
import { getClaimDetail, getAffiliatedClaimDetail } from '@/Store/Claim'
import Loading from './loadingDetail'
import { viewer } from '@/Store/User/userDefinitions'

const styles = StyleSheet.create({
    greenColor: {
        color: '#389548',
    },
});

const ClaimDetail = ({claimSelected, viewAs, contractSelected}) => {
    const { Layout, Common, Fonts, Gutters } = useTheme()
    const dispatch = useDispatch()
    const { claimDetail, loading } = useSelector((state) => state.claim )
    const { clientContractSelected } = useSelector((state) => state.contract )
    const { pwid } = useSelector((state) => state.user);
    
    const [isClient] = useState(viewer.CLIENTE === viewAs)

    useEffect(()=>{
        dispatch(getClaimDetail({
            nroSiniestro: claimSelected.expediente,
            usuario: pwid,
            nroPoliza: claimSelected.poliza
        }))
    }, [claimSelected, isClient]);

    return (
        loading ?
            <Loading/>
        :
        (
            <View style={[Layout.fill, Layout.fullWidth, Layout.colCenter]}>
                <View style={[Layout.fill, Layout.fullWidth, Layout.center]}>
                    <Card containerStyle={[Common.card, Layout.fullWidth]}>
                        <View>
                            {
                                isClient &&
                                <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                    <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Afiliado:'}</Text>
                                    <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{claimSelected.nombre}</Text>
                                </View>
                            }
                            <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Nro. de siniestro:'}</Text>
                                <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{claimSelected.expediente}</Text>
                            </View>
                            {
                                isClient &&
                                <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                    <View style={{width: '30%'}}>
                                        <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Razón social:'}</Text>
                                    </View>
                                    <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                        <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{!!contractSelected ? contractSelected.razon_social: clientContractSelected.razon_social}</Text>
                                    </View>
                                </View>
                            }
                            {
                                !isClient && claimDetail.prestadorMedico &&
                                <View style={[Layout.row, Layout.justifyContentBetween]}> 
                                    <Text style={[Fonts.sourceSansSemibold, styles.greenColor]}>{'Prestador médico:'}</Text>
                                    <View style={[Layout.fill, Layout.alignItemsEnd]}>
                                        <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{claimDetail && claimDetail.prestadorMedico}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    </Card>
                </View>
                <View style={[Layout.fill, Layout.fullWidth, Layout.center]}>
                    <Card containerStyle={[Common.card, Layout.fullWidth]}>
                        {
                            claimDetail.tipoSiniestro &&
                            <>
                                <Card.Title style={styles.greenColor}>Tipo de siniestro: </Card.Title>
                                <View style={[Layout.center, Gutters.smallBPadding]}>
                                    <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{claimDetail.tipoSiniestro}</Text>
                                </View>
                            </>
                        }
                        {
                            isClient && claimDetail.descEstado &&
                            <>
                                <Card.Title style={styles.greenColor}>Estado: </Card.Title>
                                <View style={[Layout.center, Gutters.smallBPadding]}>
                                    <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{claimDetail.descEstado}</Text>
                                </View>
                            </>
                        }
                        {
                            isClient && claimDetail.prestadorMedico &&
                            <>
                                <Card.Title style={styles.greenColor}>Prestador médico: </Card.Title>
                                <View style={[Layout.center, Gutters.smallBPadding]}>
                                    <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{claimDetail.prestadorMedico}</Text>
                                </View>
                            </>
                        }
                        {
                            claimDetail.diagnostico &&
                            <>
                                <Card.Title style={styles.greenColor}>Diagnóstico: </Card.Title>
                                <View style={[Layout.center, Gutters.smallBPadding]}>
                                    <Text style={[[Fonts.sourceSansLight, {color: 'grey'}]]}>{claimDetail.diagnostico.trim()}</Text>
                                </View>
                            </>
                        }
                        {
                            claimDetail.tipoTraslado &&
                            <>
                                <Card.Title style={styles.greenColor}>Tipo de traslado: </Card.Title>
                                <View style={[Layout.center, Gutters.smallBPadding]}>
                                    <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{claimDetail.tipoTraslado}</Text>
                                </View>
                            </>
                        }
                        {
                            isClient && claimDetail.investigador &&
                            <>
                                <Card.Title style={styles.greenColor}>Investigador: </Card.Title>
                                <View style={[Layout.center, Gutters.smallBPadding]}>
                                    <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{claimDetail.investigador}</Text>
                                </View>
                            </>
                        }
                        {
                            claimDetail.fechaOcurrencia &&
                            <>
                                <Card.Title style={styles.greenColor}>Fecha de ocurrencia: </Card.Title>
                                <View style={[Layout.center, Gutters.smallBPadding]}>
                                    <Text style={[Fonts.sourceSansLight, {color: 'grey'}]}>{moment(claimDetail.fechaOcurrencia).format("DD/MM/YYYY").toString()}</Text>
                                </View>
                            </>
                        }
                    </Card>
                </View>
            </View>
        )
    )

}

export default ClaimDetail