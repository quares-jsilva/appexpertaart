import React, {useCallback, useEffect} from 'react'
import { View, FlatList } from "react-native"
import { useSelector, useDispatch } from 'react-redux'
import { ListItem } from 'react-native-elements'
import moment from 'moment'
import { useTheme } from '@/Theme'
import Analytics from '../../libs/analytics'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { openUrl } from '@/libs/deepLinks'
import { markAsRead } from '@/Store/Notification'


const NotificationsContainer = () => {
    const { Fonts, Layout } = useTheme()
    const { notifications, unread } = useSelector((state) => state.notification)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    useEffect(() => {
        Analytics.logScreen('Notificaciones', 'NotificationsContainer')
    }, [])

    useFocusEffect(
        useCallback(() => {
            dispatch(markAsRead())
        }, [])
    )

    const onClick = (item) => {
        switch (item.title) {
          case "Turno Asignado":
          case "Turno en 24 hs":
          case "Traslado Coordinado":
          case "Recordatorio sobre traslado":
          case "Turno Cancelado":
                navigation.navigate('MyTurns')
            break;
          default:
                item.url && openUrl(item.url)
            break;
        }
      }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <ListItem onPress={()=> onClick(item)} bottomDivider >
            <ListItem.Content>
                <ListItem.Title style={Fonts.sourceSansSemibold}>{item.title}</ListItem.Title>
                {item.date && <ListItem.Subtitle style={Fonts.sourceSansSemibold}>{moment(item.date).format("DD/MM/YYYY")}</ListItem.Subtitle>}
                <ListItem.Subtitle style={Fonts.sourceSansSemibold}>{item.body}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )

    return (
        <View style={[Layout.colCenter]}>
            <View style={[Layout.fullWidth]}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={notifications && notifications.slice().sort((a,b) => moment(b.date) - moment(a.date))}
                    renderItem={renderItem}
                />
            </View>
        </View>
    )

}

export default NotificationsContainer