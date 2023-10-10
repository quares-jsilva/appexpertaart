// React
import React, { useCallback, useState, useEffect } from 'react';

// React Native
import { Button, CheckBox } from 'react-native-elements';
import { Text, View, Image, TouchableOpacity, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Components
import { showMessage } from '../../Components/MessageHelper';

// Libraries
import { openUrl, sendEmail, makeCall } from '@/libs/deepLinks';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Analytics from '../../libs/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

// Services
import TermsAndConditionsApi from '@/Services/TermsAndConditions/TermsAndConditions';

// Configurations
import { centerNumber } from '@/Config';

// Styles
import { useTheme } from '@/Theme';

const TermsAndConditionsContainer = ({ route }) => {
  const [checked, setChecked] = useState(false);

  const { data } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const { Fonts, Gutters, Layout, Images } = useTheme();

  useEffect(() => {
    Analytics.logScreen(
      'Terminos y condiciones',
      'TermsAndConditionsContainer'
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (route.params?.from === 'login') {
          dispatch({ type: 'RESET_STORE' });
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  const acceptTerms = async () => {
    Analytics.logEvent(
      'AceptarTerminosYCondiciones',
      'TermsAndConditionsContainer'
    );
    try {
      const response = await TermsAndConditionsApi.acceptTerms(data.documento);
      if (response.status === 'success') {
        navigation.navigate('LoginEditUser');
      }
    } catch (error) {
      await crashlytics().setAttributes({ response: JSON.stringify(error) });
      crashlytics().log('Fallo el request de T&C');
      showMessage({
        message:
          'Hubo un error al intentar aceptar los Términos y Condiciones, si el error persiste por favor comuníquese con nuestras oficinas.',
        type: 'error',
        buttonHelp: {
          onPress: () =>
            navigation.navigate('ProblemReport', {
              errorFrom: 'TermsAndConditions',
            }),
        },
        button: {
          text: 'Aceptar',
          onPress: () => {
            dispatch({ type: 'RESET_STORE' });
            navigation.goBack();
          },
        },
      });
    }
  };

  return (
    <ScrollView>
      <View style={[Layout.fill, Layout.justifyContentBetween]}>
        {route.params?.from !== 'login' && (
          <TouchableOpacity
            style={[Layout.alignItemsEnd, Gutters.smallPadding]}
            onPress={() => navigation.goBack()}
          >
            <Image
              style={{ height: 30, width: 30 }}
              resizeMode={'contain'}
              source={Images.back}
            />
          </TouchableOpacity>
        )}
        <View style={[Layout.center, Gutters.smallPadding]}>
          <Text style={[Fonts.sourceSansBold, { fontSize: 20 }]}>
            {'Términos y condiciones'}
          </Text>
        </View>
        <View style={[Layout.fill, Layout.fullWidth, Gutters.smallPadding]}>
          <Text style={[Fonts.sourceSansLight]}>
            {'A continuación, se describen los Términos y Condiciones Generales aplicables a  ' +
              'la utilización de la aplicación móvil (la “Aplicación”) de Experta A.R.T. S.A. ' +
              '(en adelante, Experta) y de los servicios y contenidos brindados que se ponen a ' +
              'disposición de los usuarios de la Aplicación y, en especial, en lo relativo al ' +
              'Centro de Atención al Cliente de Experta vía internet. '}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'En atención a ello, se solicita leer atentamente las condiciones generales previo a ' +
              'la utilización de la Aplicación y, en caso de duda, contactarse con el ' +
              'Centro de Atención al Cliente de Experta, '}
            <Text
              style={[Fonts.sourceSansSemiBold, { color: 'blue' }]}
              onPress={() => sendEmail('clientes@experta.com.ar')}
            >
              clientes@experta.com.ar
            </Text>
            {' ó, ' +
              'telefónicamente de lunes a viernes de 8 a 20 horas y,  los sábados de 8 a 12 horas al '}
            <Text
              style={[Fonts.sourceSansSemiBold, { color: 'blue' }]}
              onPress={() => makeCall(centerNumber)}
            >
              0800 7777 278
            </Text>
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Experta podrá ampliar y/o restringir, según su exclusiva voluntad y sin preaviso ' +
              'alguno, las operaciones permitidas y/o habilitadas en la Aplicación.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Acceso a la Aplicación. Seguridad. Obligaciones.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El acceso a la Aplicación se realiza a través del ingreso de un nombre de usuario y ' +
              'la password. Por la sola utilización de la Aplicación, el usuario acepta que al ' +
              'ingresar a la misma proporcionando su nombre de usuario y password, toda transacción ' +
              'se considerará hecha por el usuario.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'La password es secreta e intransferible y por lo tanto, el usuario asume las ' +
              'consecuencias que podrían derivarse de su utilización por parte de terceros.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {
              'El usuario se compromete a proteger y mantener en total confidencialidad la password.'
            }
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El usuario reconoce como válidas las pruebas que surjan de los elementos que ' +
              'componen el sistema informático de Experta, como así también, toda otra que ' +
              'sea hábil para acreditar la orden impartida, y renuncia expresamente a ' +
              'cuestionar la idoneidad o habilidad de las pruebas existentes.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El usuario renuncia a efectuar reclamo alguno a Experta por daños derivados del uso ' +
              'que él realice en el acceso a la Aplicación, comprometiéndose a mantener indemne a ' +
              'Experta, sus directores y personal dependiente, de cualquier daño que se derive de ' +
              'dicho uso, salvo que, de los elementos aportados a través de la Aplicación se ' +
              'culpa grave o dolo de Experta y que dicha culpa grave o dolo ocasione un daño al ' +
              'usuario de la Aplicación. Tampoco podrá el usuario revender, ceder o licenciar en ' +
              'forma alguna el servicio brindado a través de la Aplicación, o de cualquier otro ' +
              'modo, autorizar o permitir su uso a terceros, salvo en los casos habilitados y/o ' +
              'autorizados por Experta.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'A los efectos de resolver cualquier controversia que se suscite con  relación a la ' +
              'utilización de la Aplicación, el usuario declara y acepta que las constancias emanadas ' +
              'de los registros de Experta -ya sean electrónicas o por medios impresos- constituyen ' +
              'prueba suficiente y concluyente de las operaciones electrónicas en ellos contenidas y ' +
              'de los actos y transacciones realizados por Experta. La buena fe de las constancias ' +
              'electrónicas o impresas que aporte Experta, subsistirá hasta que por sentencia firme ' +
              'se declare judicialmente su falsedad o nulidad.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Experta no asume ninguna responsabilidad por los inconvenientes que el usuario ' +
              'tuviera con el software, hardware, servidores.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Experta no asume ninguna responsabilidad por los inconvenientes que el usuario tuviera ' +
              'con el software, hardware, servidores.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Incumplimiento de las obligaciones asumidas.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El incumplimiento de cualquiera de las obligaciones aquí descriptas que asume el ' +
              'usuario, ocasionará automáticamente la caducidad del derecho de utilización de la Aplicación.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Modificaciones al Servicio.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El usuario declara y acepta que Experta tiene el derecho de modificar o discontinuar ' +
              'el servicio que presta por intermedio de la Aplicación en forma temporal o permanente, ' +
              'en cualquier momento, sin previo aviso, liberándola, irrevocablemente de toda ' +
              'responsabilidad.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Información contenida en la Aplicación.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El usuario, declara y acepta que la información contenida en la Aplicación no debe ser ' +
              'utilizada por los usuarios para la toma de decisiones, por lo que expresamente el ' +
              'usuario renuncia a efectuar algún reclamo a Experta por el contenido de la información ' +
              'brindada en la Aplicación. Asimismo, asume el compromiso de mantener indemne a Experta ' +
              'de cualquier acción que se promoviere contra ella por la información brindada en la ' +
              'Aplicación y a la que se tuviera acceso mediante la clave otorgada al usuario.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El usuario declara y acepta que la información contenida en la Aplicación tiene carácter ' +
              'confidencial por lo que se obliga a abstenerse de su divulgación, salvo que se trate de ' +
              'información que haya adquirido estado público por causas ajenas al usuario o a Experta o que ' +
              'debiere ser divulgada por disposición legal o por orden judicial.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Esta obligación subsistirá por tiempo indeterminado, aun después de concluida la vigencia del ' +
              'contrato que vincula al usuario con Experta.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El usuario se compromete a conocer y cumplir todos y cada uno de los Términos y Condiciones ' +
              'Generales de la utilización de la Aplicación.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Marcas registradas y Derecho de Autor.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Todo el contenido de la Aplicación, incluido, los textos, gráficos, logos, íconos, imágenes, ' +
              'marca, software son de propiedad de Experta, o bien, Experta tiene licencia para su utilización, ' +
              'a menos que se establezca lo contrario.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Queda prohibido copiar, descargar o almacenar en forma temporaria fragmentos de la ' +
              'Aplicación. El usuario podrá hacer impresiones en los casos en que dicha función esté prevista ' +
              'y/o habilitada en esta herramienta informática y con relación a los documentos que el usuario ' +
              'deba imprimir para el ejercicio de su derecho y/o con relación a la relación comercial que lo ' +
              'vincula/rá con Experta.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Prevención y Lucha contra el Fraude.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {
              'En virtud de la normativa vigente para combatir el fraude, Resolución SSN 38.477/2014 '
            }
            <Text
              style={[Fonts.sourceSansSemiBold, { color: 'blue' }]}
              onPress={() =>
                openUrl(
                  'http://servicios.infoleg.gob.ar/infolegInternet/anexos/230000-234999/232554/norma.htm'
                )
              }
            >
              http://servicios.infoleg.gob.ar/infolegInternet/anexos/230000-234999/232554/norma.htm
            </Text>
            {
              ', Experta pone a disposición su espacio informativo para tal fin: '
            }
            <Text
              style={[Fonts.sourceSansSemiBold, { color: 'blue' }]}
              onPress={() => openUrl('https://www.experta.com.ar/fraude/')}
            >
              https://www.experta.com.ar/fraude/
            </Text>
            {'. Infórmese y resguárdese. Asimismo, se encuentra ' +
              'disponible el canal de comunicación de eventos potenciales sospechosos, Línea Ética, ' +
              'mediante el correo '}
            <Text
              style={[Fonts.sourceSansSemiBold, { color: 'blue' }]}
              onPress={() => sendEmail('lineaetica@experta.com.ar')}
            >
              lineaetica@experta.com.ar
            </Text>
            {', donde todo reporte será tratado bajo absoluta ' +
              'reserva y confidencialidad de los datos recibidos.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Jurisdicción y Ley Aplicable.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El usuario acepta que toda relación que se genere en virtud del acceso y utilización de la ' +
              'Aplicación será regida por las leyes de la República Argentina. Asimismo, resultarán ' +
              'competentes para dirimir cualquier controversia los Tribunales Nacionales en lo Comercial de la ' +
              'Ciudad Autónoma de Buenos Aires, con renuncia expresa a cualquier otro fuero o jurisdicción.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Notificaciones.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Experta podrá notificar a los usuarios de la Aplicación cualquier tema concerniente a la ' +
              'utilización de esta última y de los servicios que por su intermedio se presten y cualquier cambio ' +
              'que resuelva introducir a las presentes condiciones de utilización de la Aplicación, mediante ' +
              'correo postal, correos electrónicos, o avisos insertos en la misma.'}
          </Text>
          <View style={[Layout.center, Gutters.smallTPadding]}>
            <Text style={[Fonts.sourceSansBold, { fontSize: 20 }]}>
              {'Política de privacidad'}
            </Text>
          </View>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Las presentes Políticas de Privacidad (en adelante, las “Políticas”) establecen los términos en ' +
              'que usa y protege la información que es proporcionada por sus usuarios al momento de utilizar ' +
              'esta aplicación móvil (en adelante, la “Aplicación”). Experta ART S.A. en adelante, “Experta” ' +
              'está comprometida con la seguridad de los datos de sus usuarios, y en el cumplimiento de ' +
              'todas las leyes aplicables sobre protección de datos y privacidad. Cuando le pedimos llenar los ' +
              'campos de información personal con la cual usted pueda ser identificado, lo hacemos ' +
              'asegurando que solo se empleará de acuerdo con los términos de este documento. Al ingresar ' +
              'a la Aplicación, o al brindar su información personal, usted nos autoriza a obtener, usar y ' +
              'divulgar su información personal en la forma descripta en estas Políticas. Si usted no ' +
              'autorizase la obtención, uso y divulgación de su información personal en la forma descripta en ' +
              'estas Políticas le pedimos que se abstenga de usar la Aplicación. Sin embargo, estas Políticas ' +
              'pueden cambiar con el tiempo o ser actualizadas, por lo que le recomendamos revisar ' +
              'continuamente estas Políticas para asegurarse que está de acuerdo con dichos cambios. ' +
              'Experta tiene especial respeto por el derecho a la privacidad de sus usuarios. Estas Políticas ' +
              'resumen la información de identificación personal que podemos obtener y la forma en que ' +
              'podemos usar esta información.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            <Text style={[Fonts.sourceSansBold, Gutters.smallTPadding]}>
              {'Información que es recogida: '}
            </Text>
            {'Nuestra Aplicación podrá recoger la siguiente información ' +
              'personal de los usuarios de la Aplicación: su nombre y apellido, número de documento de ' +
              'identidad e información de contacto como su dirección de correo electrónico y teléfono móvil. ' +
              'La mencionada información quedará almacenada en las Bases de Datos de Experta.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            <Text style={[Fonts.sourceSansBold, Gutters.smallTPadding]}>
              {'Uso de la información recogida: '}
            </Text>
            {'Nuestra Aplicación usa la información con el fin de ' +
              'proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, y ' +
              'mejorar nuestros productos y servicios. Experta usará los datos recabados para mejorar y ' +
              'personalizar tu experiencia en nuestra Aplicación.  Para comunicarnos contigo, responder a tus ' +
              'preguntas y brindarte soporte sobre tus productos y siniestros.  Para enviar actualizaciones y ' +
              'notificaciones informáticas. Experta garantiza a los usuarios que no estuvieran de acuerdo con ' +
              'las finalidades para las cuales recaba los datos o con alguna de las finalidades para las cuales ' +
              'se utilizarán en el futuro, de las que serán debidamente informados, el derecho de obtener la ' +
              'supresión de los mismos de su base de datos. Experta no revelará la información provista a ' +
              'terceros, a menos que previamente posea la autorización del cliente y/o le sea requerida por ' +
              'ley o por resolución de autoridad competente. No obstante lo anterior, nos reservamos el ' +
              'derecho de compartir su información personal con el único objeto de desarrollar normalmente ' +
              'seguros; o autoridades gubernamentales, cuando sea solicitado por ellas en virtud de alguna ' +
              'norma legal, o cuando sea obligatorio para nosotros remitirla, en caso de que así también lo ' +
              'determine la ley.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            <Text style={[Fonts.sourceSansBold, Gutters.smallTPadding]}>
              {'Orden de Autoridades competentes: '}
            </Text>
            {'Experta coopera con las autoridades competentes y con ' +
              'otros terceros para garantizar el cumplimiento de las leyes, por ejemplo, en materia de ' +
              'protección de derechos de propiedad industrial e intelectual, prevención del fraude y otras ' +
              'materias. Experta podrá revelar la información personal que nos has suministrado cuando así lo ' +
              'exijan las autoridades judiciales o gubernamentales competentes para efectos de ' +
              'investigaciones conducidas por ellas, aunque no exista una orden ni una citación ejecutiva o ' +
              'judicial, o por ejemplo (y sin limitación a este supuesto) cuando se trate de investigaciones de ' +
              'carácter penal o de fraude o las relacionadas con piratería informática. En tales situaciones, ' +
              'Experta colaborará con las autoridades competentes con el fin de salvaguardar la integridad y ' +
              'la seguridad de sus usuarios.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            <Text style={[Fonts.sourceSansBold, Gutters.smallTPadding]}>
              {'Seguridad: '}
            </Text>
            {'Experta toma en serio la seguridad de la información y utiliza medidas ' +
              'administrativas, técnicas, físicas y de gestión razonables para proteger su información personal ' +
              'del acceso no autorizado. Lamentablemente, ningún sistema de seguridad es absolutamente ' +
              'seguro. Por lo tanto, no podemos garantizar la seguridad de su información y no podemos ' +
              'asumir la responsabilidad ante un acceso inapropiado.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            <Text style={[Fonts.sourceSansBold, Gutters.smallTPadding]}>
              {'Actualizaciones: '}
            </Text>
            {'Experta se reserva el derecho de actualizar o modificar estas Políticas en ' +
              'cualquier momento y sin previo aviso, mediante la publicación de la versión revisada de la ' +
              'misma en nuestra Aplicación. En caso de modificación de estas Políticas, la modificación sólo ' +
              'se aplicará a la información personal que obtengamos después de publicar la política ' +
              'modificada en el sitio.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Protección de Datos Personales.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Los datos se recolectan únicamente para ser utilizados con motivo de la relación comercial que ' +
              'lo vincula/rá con Experta.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Se hace saber que, de conformidad con el artículo 3° de la 14/2018 de la Agencia de Acceso a ' +
              'la Información Pública, “LA AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su ' +
              'carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias ' +
              'y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de ' +
              'las normas vigentes en materia de protección de datos personales”.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Derecho de Acceso a la información.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El derecho de acceso a los datos sólo puede ser ejercido en forma gratuita a intervalos no ' +
              'inferiores a seis meses, salvo que se acredite un interés legítimo al efecto, conforme lo ' +
              'establecido en el artículo 14, inciso 3 de la ley 25.326.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            <Text style={[Fonts.sourceSansBold, Gutters.smallTPadding]}>
              {'Procedimiento: '}
            </Text>
            {'El titular de los datos personales, previa acreditación de su identidad, puede ' +
              'ejercer su derecho de acceso a la información de manera gratuita, por medio de las siguientes ' +
              'vías:'}
          </Text>
          <View
            style={[
              Fonts.sourceSansLight,
              Gutters.smallTPadding,
              { flexDirection: 'row' },
            ]}
          >
            <Text>{'\u2022'}</Text>
            <Text style={[Fonts.sourceSansLight, { flex: 1, paddingLeft: 5 }]}>
              {'En forma directa, mediante la presentación del titular de los datos en la ' +
                'compañía dejando una nota por escrito, acompañando copia de su documento ' +
                'de identidad e indicando a través de qué vía desea recibir la información.'}
            </Text>
          </View>
          <View
            style={[
              Fonts.sourceSansLight,
              Gutters.smallTPadding,
              { flexDirection: 'row' },
            ]}
          >
            <Text>{'\u2022'}</Text>
            <Text style={[Fonts.sourceSansLight, { flex: 1, paddingLeft: 5 }]}>
              {'A través de una intimación fehaciente por medio escrito que deje constancia de ' +
                'recepción.'}
            </Text>
          </View>
          <View
            style={[
              Fonts.sourceSansLight,
              Gutters.smallTPadding,
              { flexDirection: 'row' },
            ]}
          >
            <Text>{'\u2022'}</Text>
            <Text style={[Fonts.sourceSansLight, { flex: 1, paddingLeft: 5 }]}>
              {'Enviando un email a '}
              <Text
                style={[Fonts.sourceSansSemiBold, { color: 'blue' }]}
                onPress={() => sendEmail('clientes@experta.com.ar')}
              >
                clientes@experta.com.ar
              </Text>
              {', adjuntando copia escaneada ' +
                'del documento de identidad del titular.'}
            </Text>
          </View>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'En todos los casos, Experta contestará el requerimiento por escrito o vía email, dependiendo ' +
              'de la forma que el usuario solicitó recibir la información, dentro del plazo de diez días corridos ' +
              'desde la recepción del mismo dejando constancia del envío de la respuesta.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Derecho de rectificación, actualización o supresión de datos personales. Artículo 16 ley ' +
              '25.326 Ley de Protección de Datos Personales.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El titular de los datos tiene derecho a que sus datos sean rectificados, actualizados o ' +
              'suprimidos. Experta deberá proceder a realizar los cambios solicitados por el titular de los datos ' +
              'personales dentro de los cinco días hábiles de recibido el reclamo.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Jurisdicción y Ley Aplicable.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'El usuario acepta que toda relación que se genere en virtud del acceso y utilización de la ' +
              'Aplicación será regida por las leyes de la República Argentina. Asimismo, resultarán ' +
              'competentes para dirimir cualquier controversia los Tribunales Nacionales en lo Comercial de la ' +
              'Ciudad Autónoma de Buenos Aires, con renuncia expresa a cualquier otro fuero o jurisdicción.'}
          </Text>
          <Text style={[Fonts.sourceSansSemiBold, Gutters.smallTPadding]}>
            {'Notificaciones.'}
          </Text>
          <Text style={[Fonts.sourceSansLight, Gutters.smallTPadding]}>
            {'Experta podrá notificar a los usuarios de la Aplicación cualquier tema concerniente a la ' +
              'utilización de esta última y de los servicios que por su intermedio se presten y cualquier cambio ' +
              'que resuelva introducir a las presentes condiciones de utilización de la Aplicación, mediante ' +
              'correo postal, correos electrónicos, o avisos insertos en la misma.'}
          </Text>
        </View>
        {route.params?.from === 'login' && (
          <>
            <View style={[Layout.fill, Layout.fullWidth, Gutters.smallPadding]}>
              <CheckBox
                title='Acepto los Términos y Condiciones y las Políticas de Privacidad de la Aplicación.'
                checked={checked}
                textStyle={[Fonts.sourceSansSemiBold, { fontWeight: 'normal' }]}
                onPress={() => setChecked(!checked)}
              />
            </View>
            <View style={[Gutters.smallPadding]}>
              <Button
                buttonStyle={{ borderRadius: 80 }}
                titleStyle={Fonts.sourceSansLight}
                title='ACEPTAR'
                disabled={!checked}
                onPress={() => acceptTerms()}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default TermsAndConditionsContainer;
