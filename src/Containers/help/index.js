import React, { useEffect } from 'react'
import { ScrollView, Text, View, FlatList, Image } from "react-native"
import { useTheme } from '@/Theme'
import { ListItem, Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Analytics from '../../libs/analytics'

const list = [
    {
        title: 'Preguntas frecuentes',
        path: 'FrequentQuestions'
    },
    {
        title: 'Reportar un problema',
        path: 'ProblemReport'
    },
    {
        title: 'Términos y condiciones',
        path: 'TermsAndConditions'
    },
]

const HelpContainer = (param) => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const navigation = useNavigation()
    const { errorFrom } = param.route.params

    useEffect(() => {
        Analytics.logScreen('Ayuda', 'HelpContainer')
    }, []);

    return (
        <ScrollView>
            <View style={[Layout.fill, Layout.colCenter]}>
                <View style={[Layout.fullWidth]}>
                    {
                        list.map((item, i) => (
                        <ListItem key={i} bottomDivider 
                            onPress={() => {
                                Analytics.logEvent('Ver' + item.path, 'HelpContainer')
                                navigation.navigate(item.path, item.path === 'ProblemReport' ? {errorFrom: errorFrom} : {})
                            }}>
                            <ListItem.Content>
                            <ListItem.Title style={Fonts.sourceSansSemibold}>{item.title}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                        ))
                    }
                </View>
            </View>
        </ScrollView> 
    )

}

export default HelpContainer