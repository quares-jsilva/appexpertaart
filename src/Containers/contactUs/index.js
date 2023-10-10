import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, Image } from "react-native"
import { useTheme } from '@/Theme'
import ShortCard from "../../Components/ShortCard"
import Analytics from '../../libs/analytics'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { 
    ubicationUrl, 
    webUrl, 
    blogUrl, 
    linkedinUrl, 
    youtubeUrl,
    centerNumber,
    whatsappNumber,
    mailArt 
} from '@/Config'
import { openUrl, makeCall, sendEmail } from '@/libs/deepLinks'
import MenuButton from '../../Components/MenuButton'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ContactUsContainer = () => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()

    useEffect(() => {
        Analytics.logScreen('Contactenos', 'ContactUsContainer')
    }, []);

    return (
        <ScrollView>
            <View style={[Layout.colCenter, Gutters.regularTMargin, Gutters.smallPadding]}>
                <View style={[Layout.fullWidth, Layout.center, Gutters.smallLPadding, Gutters.smallVMargin]}>
                    <Text style={[Fonts.sourceSansSemiBold, {color: 'grey', fontSize: 18}]}>{'Teléfono'}</Text>
                </View>
                <View style={[Layout.fullWidth, Gutters.smallPadding]}>
                    <TouchableOpacity
                        onPress={() => {
                            Analytics.logEvent('LlamarAlCentroDeAtencionAlCliente', 'ContactUsContainer')
                            makeCall(centerNumber)
                        }} 
                        style={[Layout.fill, Layout.fullWidth, Common.card, Layout.rowCenter, Gutters.smallPadding]}
                    >
                        <View style={[Layout.fill, Gutters.regularLPadding]}>
                            <Text style={[Fonts.sourceSansSemiBold, {color: 'grey', fontSize: 16}]}>{'Centro de Atención al Cliente'}</Text>
                            <Text style={[Fonts.sourceSansLight, {color: 'grey', fontSize: 16}]}>{centerNumber}</Text>
                        </View>
                        <Image style={{height: 45, width: 45}} resizeMode={'contain'}  source={Images['phone']}/>
                    </TouchableOpacity>
                </View>
                <View style={[Layout.fullWidth, Gutters.smallPadding]}>
                    <TouchableOpacity
                        onPress={() => {
                            Analytics.logEvent('EnviarWhatsApp', 'ContactUsContainer')
                            openUrl('whatsapp://send?phone=' + whatsappNumber)
                        }} 
                        style={[Layout.fill, Layout.fullWidth, Common.card, Layout.rowCenter, Gutters.smallPadding]}
                    >
                        <View style={[Layout.fill, Gutters.regularLPadding]}>
                            <Text style={[Fonts.sourceSansSemiBold, {color: 'grey', fontSize: 16}]}>{'WhatsApp'}</Text>
                            <Text style={[Fonts.sourceSansLight, {color: 'grey', fontSize: 16}]}>{whatsappNumber}</Text>
                        </View>
                        <Image style={{height: 45, width: 45}} resizeMode={'contain'}  source={Images['footerWsp']}/>
                    </TouchableOpacity>
                </View>
                <View style={[Layout.fullWidth, Layout.center, Gutters.smallLPadding, Gutters.smallVMargin]}>
                    <Text style={[Fonts.sourceSansSemiBold, {color: 'grey', fontSize: 18}]}>{'E-mail'}</Text>
                </View>
                <View style={[Layout.fullWidth, Gutters.smallPadding]}>
                    <TouchableOpacity
                        onPress={() => {
                            Analytics.logEvent('EnviarEmailASeguroDeArt', 'ContactUsContainer')
                            sendEmail(mailArt)
                        }} 
                        style={[Layout.fill, Layout.fullWidth, Common.card, Layout.rowCenter, Gutters.smallPadding]}
                    >
                        <View style={[Layout.fill, Gutters.regularLPadding]}>
                            <Text style={[Fonts.sourceSansSemiBold, {color: 'grey', fontSize: 16}]}>{'ART'}</Text>
                            <Text style={[Fonts.sourceSansLight, {color: 'grey', fontSize: 16}]}>{mailArt}</Text>
                        </View>
                        <Image style={{height: 45, width: 45}} resizeMode={'contain'}  source={Images['mailGrey']}/>
                    </TouchableOpacity>
                </View>
                <View style={[Layout.fullWidth, Layout.center, Gutters.smallLPadding, Gutters.smallVMargin]}>
                    <Text style={[Fonts.sourceSansSemiBold, {color: 'grey', fontSize: 18}]}>{'Además encontranos en'}</Text>
                </View>
                <View style={[Layout.fullWidth, Layout.row]}>
                    <ShortCard 
                        style={{height: 80}}
                        cardText={'Web'} 
                        action={() => {
                            Analytics.logEvent('VisitarWeb', 'ContactUsContainer')
                            openUrl(webUrl)
                        }}
                    />
                    <ShortCard 
                        style={{height: 80}}
                        cardText={'Blog'} 
                        action={() => {
                            Analytics.logEvent('VisitarBlog', 'ContactUsContainer')
                            openUrl(blogUrl)
                        }}
                    />
                </View>
                <View style={[Layout.fullWidth, Layout.rowHCenter, Layout.center]}>
                    <MenuButton
                        style={{backgroundColor: '#00945e'}}
                        imageName='youtubeWhite'
                        action={() => {
                            Analytics.logEvent('VisitarYoutube', 'ContactUsContainer')
                            openUrl(youtubeUrl)
                        }}
                    />
                    <MenuButton
                        style={{backgroundColor: '#00945e'}}
                        imageName='linkedinWhite'
                        action={() => {
                            Analytics.logEvent('VisitarLinkedin', 'ContactUsContainer')
                            openUrl(linkedinUrl)
                        }}
                    />
                    <MenuButton
                        style={{backgroundColor: '#00945e'}}
                        imageName='positionWhite'
                        action={() => {
                            Analytics.logEvent('VisitarWebDondeEstamos', 'ContactUsContainer')
                            openUrl(ubicationUrl)
                        }}
                    />
                </View>
            </View>
        </ScrollView> 
    )

}

export default ContactUsContainer