import React, { useState, useEffect } from 'react'
import { ScrollView, Text, View, FlatList, Image, Alert } from "react-native"
import { useTheme } from '@/Theme'
import { ListItem, Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Analytics from '../../libs/analytics'

const list = [
    {
        question: '¿Cuál es mi usuario?',
        answer: 'Tu usuario es tu DNI. Si no estás registrado hacé {error_ingresar}' +
        '\nSi no podes generar la clave y sos el titular completa tus datos y nos pondremos en contacto.'
    },
    {
        question: 'La aplicación no me permite ingresar',
        answer: '¿Cambiaste tu clave en la web de ART? En la App usa la misa clave.\n' +
        'Recordá que las claves están unificadas.\nSi no recordás la clave, hacé {recorda_clave} y te enviamos una nueva a tu mail.'
    },
    {
        question: 'Ya me registré y no recibí la clave',
        answer: 'Revisá en la casilla de SPAM. Si no recibiste el correo completá tus datos {reportar_problema} y nos vamos a comunicar para resolver el acceso.'
    },
    {
        question: 'No recibí el mail luego de cambiar la clave',
        answer: 'Revisá en la casilla de SPAM. Si no recibiste el correo completá tus datos {reportar_problema} y nos vamos a comunicar para resolver el acceso.'
    },
]

const FrequentQuestionsContainer = () => {

    const { Common, Fonts, Gutters, Layout, Images } = useTheme()
    const navigation = useNavigation();
    const [questions, setQuestions] = useState(list)
    const [visibleAnswer, setVisibleAnswer] = useState(null)

    useEffect(() => {
        Analytics.logScreen('Preguntas frecuentes', 'FrequentQuestionsContainer')
    }, []);

    const openAnswer = (index) => {
        setVisibleAnswer(index)
    }

    const displayAnswer = (label, value) => {
        if (!value) {
          return label;
        }
        let navTo
        let dictionary = {"recorda_clave": "click acá", "error_ingresar": "click acá", "reportar_problema": "acá"}
        let formatAnswer = label.replace(/{[^{}]+}/g, key => {
            switch(key) {
                case "{recorda_clave}":
                    navTo = 'RecoverPassword'
                  break;
                case "{error_ingresar}":
                    navTo = 'RegisterStepOne'
                  break;
                case "{reportar_problema}":
                    navTo = "ProblemReport"
                  break;
            }
            return dictionary[key.replace(/[{}]+/g, "")] || ""
        })
        return (<Text>
          { formatAnswer.split(value)
            .reduce((prev, current, i) => {
              if (!i) {
                return [current];
              }
              return prev.concat(<Text style={[{color: 'black'},Fonts.sourceSansSemibold]} key={value + current} onPress={()=> navigation.navigate(navTo, navTo === 'ProblemReport' ? {errorFrom: 'Preguntas frecuentes'} : {})}>{ value }</Text>, current);
            }, [])
          }
        </Text>);
    };

    return (
        <ScrollView>
            <View style={[Layout.fill, Layout.colCenter]}>
                <View style={[Layout.fullWidth]}>
                    {
                        questions.map((item, i) => (
                        <ListItem key={i} bottomDivider onPress={()=>{openAnswer(i)}}>
                            <ListItem.Content>
                                <ListItem.Title style={Fonts.sourceSansSemibold}>{item.question}</ListItem.Title>
                                { visibleAnswer === i && 
                                    <View style={[Gutters.smallPadding]}>
                                        <Text style={Fonts.sourceSansLight}>
                                            {displayAnswer(item.answer, 'acá')}
                                        </Text>
                                    </View>
                                }
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

export default FrequentQuestionsContainer