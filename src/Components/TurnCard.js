import React, { useEffect, useState } from 'react'
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Theme'
import { Button, Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import { useTurns } from '@/Hooks/useTurns'
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

const styles = StyleSheet.create({
    greenColor: {
        color: '#389548',
    },
    buttonStyle: {
        borderRadius: 80,
        backgroundColor: '#389548'
    },
});

const TurnCard = ({dashboard, turn}) => {

    const { Layout, Common, Images, Fonts, Gutters } = useTheme()
    const navigation = useNavigation()
    const { loading } = useSelector((state) => state.turn)
    const ITEM_WIDTH = Dimensions.get('window').width

    return (
        loading ? 
            <SkeletonPlaceholder>
                <View style={[Layout.center, Gutters.smallPadding]}>
                    <View style={{ width: ITEM_WIDTH * 0.9, height: 200, borderRadius: 10 }} />
                </View>
            </SkeletonPlaceholder>
        :
        <View style={[Layout.fill, Layout.fullWidth, Layout.center]}>
            <Card containerStyle={[Common.card, Layout.fullWidth]}>
                {
                    dashboard &&
                    <View>
                        <Card.Title>{'TU PRÓXIMO TURNO'}</Card.Title>
                        <Card.Divider/>
                    </View>
                }
                <View style={[Gutters.smallBPadding]}>
                    <View style={[Layout.rowCenter, Layout.fullWidth, Layout.justifyContentCenter]}>
                        <View>
                            <Text style={[Fonts.sourceSansSemibold, styles.greenColor, Fonts.textCenter]}>{moment(turn.fechaTurno).format("DD/MM/YYYY HH:mm") + " hs"}</Text>
                        </View>
                        {
                            (turn.traslado && turn.traslado !== 'SIN TRASLADO') &&
                            <View style={[Layout.center, Gutters.smallPadding]}>
                                <Image style={{height: 15, width: 15}} resizeMode={'contain'}  source={Images['trasladoLogo']}/>
                            </View>
                        }
                    </View>
                </View>
                <Card.Divider/>
                <View>
                    <View style={[Layout.rowCenter]}>
                        <View style={[Layout.fill]}>
                            <Text style={[Fonts.sourceSansSemibold, Fonts.textCenter]}>{turn.especialidad}</Text>
                        </View>
                    </View>
                    <View style={[Layout.rowCenter]}>
                        <View style={[Layout.fill]}>
                            <Text style={[Fonts.sourceSansLight, Fonts.textCenter]}>{turn.prestador}</Text>
                        </View>
                    </View>
                    {
                        turn.hastaDir &&
                        <View style={[Layout.rowCenter]}>
                            <View style={Layout.fill}>
                                <Text style={[Fonts.sourceSansLight, Fonts.textCenter]}>{turn.hastaDir}</Text>
                            </View>
                            <View style={[Layout.fill, Layout.center, Gutters.smallHPadding]}>
                                <Image style={{height: 15, width: 15}} resizeMode={'contain'}  source={Images['legalLocation']}/>
                            </View>
                        </View>
                    }
                </View>
                {
                    dashboard &&
                    <View style={[Gutters.smallPadding, Gutters.regularTPadding]}>
                        <Button
                            buttonStyle={[styles.greenColor, styles.buttonStyle]} 
                            titleStyle={[Fonts.sourceSansLight]}
                            title="VER MIS TURNOS"
                            onPress={() => navigation.navigate('MyTurns')}
                        />
                    </View>
                }
            </Card>
        </View>
    )
  
}

export default TurnCard