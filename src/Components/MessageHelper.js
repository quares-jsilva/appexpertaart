import React, { useState, useImperativeHandle, useRef } from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import { useTheme } from '@/Theme'
import { Button, Overlay } from 'react-native-elements'
import { useDispatch } from 'react-redux'
import { resetStatus } from '@/Store/Help'

const styles = StyleSheet.create({
    text: {
        color: '#000',
        textAlign: 'center'
    },
    imageSize: {
        height: 70
    },
    cardHeight: {
        minHeight: 150
    },
    buttonRadius: {
        borderRadius: 80
    },
});

export const messageRef =  React.createRef()

export const showMessage = (...args) => {
    messageRef.current?.showMessage(...args)
}

export const hideMessage = () => {
    messageRef.current?.closeAdvice()
}

const MessageHelper = React.forwardRef((props, ref) => {
    const initialState = {
        visible: false,
        color: '',
        title: '',
        btnText: '',
        message,
        icon: null,
        onPress: undefined,
        buttonHelp: undefined,
        hideAccept: false
    }

    const { Layout, Common, Images, Fonts, Gutters } = useTheme()
    const dispatch = useDispatch()
    const [helperState, setHelperState] = useState(initialState)

    useImperativeHandle(ref, () => ({
        showMessage: showMessage,
        closeAdvice: closeAdvice
    }))

    const closeAdvice = () => {
        setHelperState(initialState)
    }

    const closeHelper = () => {
        dispatch(resetStatus())
        setHelperState(initialState)
    }

    const executeAndClose = (callback) => {
        closeHelper()
        callback()
    }

    const messageType = {
        'success': '#9bcaa3',
        'warning': '#7fcdee',
        'error': '#DF2B4F'
    }

    const messageTitle = {
        'success': 'Aviso',
        'warning': 'Aviso',
        'error': 'Error'
    }

    const messageIcon = {
        'success': 'successAlert',
        'warning': 'warningAlert',
        'error': 'errorAlert'
    }

    const showMessage = ({message, type = 'success', button, buttonHelp = undefined, title = '', hideAccept = false, version = false}) => {
        
        let buttonObj = {
            'text': button && button.text ? button.text : 'Aceptar', 
            'onPress': () => { 
                if(button && button.onPress) {
                    button.noClose ? button.onPress() : executeAndClose(button.onPress)
                }else{
                    closeHelper()
                }
            } 
        }

        setHelperState({
            visible: true,
            color: messageType[type],
            title: title ? title : messageTitle[type],
            icon: messageIcon[type],
            message,
            button: buttonObj,
            buttonHelp,
            hideAccept,
            version
        })
    }

    const { visible, color, title, message, button, buttonHelp, icon, hideAccept, version } = helperState;

    return (
        visible ?
        <Overlay isVisible={visible}
            onBackdropPress={!hideAccept ? button.onPress : null} 
            overlayStyle={
                [
                    Common.card, 
                    Layout.fill,
                    {width: 300, minHeight: 400, maxHeight: 490, overflow: "hidden", padding: 0}
                ]}
        >
                <View style={Layout.fill}>
                    <View style={[Layout.fullWidth,Layout.center,{backgroundColor: color}]}>
                        <Image style={[{width: 100, height: 100}, Gutters.regularTMargin]} source={Images[icon]} resizeMode={'contain'} />
                        <Text style={[Fonts.sourceSansSemiBold, Fonts.textCenter, Gutters.smallPadding, {color: 'white', fontSize: 20}]}>{title}</Text>
                    </View>
                    <View style={[Layout.fill, Layout.center, Gutters.smallPadding, Layout.scrollSpaceAround]}>              
                        <Text style={[Fonts.sourceSansLight, Fonts.textCenter, Gutters.smallPadding,{fontSize: 20}]}>{message}</Text>
                        {
                            !hideAccept &&
                            <View>
                                <View style={[Layout.rowCenter, Gutters.smallPadding, Gutters.largeTPadding]}>
                                    {
                                        buttonHelp &&
                                        <Button 
                                            buttonStyle={[styles.buttonRadius, Gutters.smallRMargin, {backgroundColor: color, width: version ? 110 : 140}]}
                                            titleStyle={Fonts.sourceSansSemiBold}
                                            title={buttonHelp.label ? buttonHelp.label : 'Ayuda'}
                                            onPress={() => executeAndClose(buttonHelp.onPress)}
                                        />
                                    }
                                    {
                                        !hideAccept &&
                                        <Button 
                                            buttonStyle={[styles.buttonRadius, {backgroundColor: color, width: version ? 160 : 140}]}
                                            titleStyle={Fonts.sourceSansSemiBold}
                                            title={button.text}
                                            onPress={button.onPress}
                                        />
                                    }
                                </View>
                            </View>
                        }
                    </View>
                </View>
        </Overlay>
        :
        <></>
    )
  
})

export default MessageHelper
