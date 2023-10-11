// React
import React, { useState, useEffect, useCallback } from 'react';

// React Native
import { Button, Icon, Input } from 'react-native-elements';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Components
import { Spinner } from '@/Components';
import { showMessage } from '@/Components/MessageHelper';
import NumberInput from '../../Components/NumberInput';

// Libraries
import { useDispatch, useSelector } from 'react-redux';
import Analytics from '../../libs/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

// Services
import AuthApi from '@/Services/User/Auth';

// Store
import { getTerminos } from '@/Store/User/user';
import { setCredentials, auth } from '@/Store/User/auth';
import { setErrorId } from '@/Store/Error';

// Styles
import { useTheme } from '@/Theme';
import styles from './styles';

const LoginContainer = (param) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securePass, setSecurePass] = useState(true);

  const { loading, credentials, message, status, pushId } = useSelector(
    (state) => state.auth
  );
  const { termsAndCond, homeRoute, data, pwid, profiles, error } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const { Fonts, Gutters, Layout, Images } = useTheme();

  const navigation = useNavigation();

  useEffect(() => {
    Analytics.logScreen('Login', 'LoginContainer');
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!!status) {
        if (status === 'error') {
          dispatch(setErrorId());
          showMessage({
            message: message,
            type: 'error',
            buttonHelp: {
              onPress: () =>
                navigation.navigate('ProblemReport', { errorFrom: 'Login' }),
            },
          });
        } else {
          profiles.forEach((profile) => {
            let profileName = '';
            switch (profile) {
              case 'USER_ART_CLIENTE':
                profileName = 'perfilCliente';
                Analytics.setUserProperty(profileName);
                break;
              case 'USER_ART_AFILIADO':
                profileName = 'perfilAfiliado';
                Analytics.setUserProperty(profileName);
                break;
            }
          });

          if (!!pwid) {
            crashlytics().setUserId(pwid),
              crashlytics().setAttributes({
                name: data.nombre ? data.nombre : '',
                username: data.documento ? data.documento : '',
                email: data.email ? data.email : '',
              });

            AuthApi.savePushId({ pwid, pushId })
              .then(() => {
                console.log('grabo pushId');
              })
              .catch(() => {
                console.log('fallo pushId');
              });
            dispatch(getTerminos(data.documento));
          } else {
            showMessage({
              message:
                'Aún no tenés acceso a la aplicación. \n Completá el formulario con tu DNI, tipo de póliza y nos pondremos en contacto',
              type: 'error',
              button: { text: 'ACEPTAR' },
              buttonHelp: {
                label: 'CONTACTAR',
                onPress: () =>
                  navigation.navigate('ProblemReport', {
                    errorFrom: 'El usuario no existe en SIART',
                  }),
              },
            });
          }
        }
      }
    }, [status, message])
  );

  useEffect(() => {
    if (termsAndCond && termsAndCond.length > 0) {
      const hasAccepted = termsAndCond.some((item) => item.aceptado);
      const routeToNavigate = hasAccepted ? homeRoute : 'TermsAndConditions';
      navigation.navigate(routeToNavigate, { from: 'login' });
    }
  }, [termsAndCond]);

  useEffect(() => {
    if (!!error && error === 'ERROR_TERMINOS') {
      navigation.navigate(homeRoute);
    }
  }, [error]);

  useEffect(() => {
    if (credentials && credentials.username && credentials.password) {
      dispatch(auth(credentials));
    }
  }, [credentials]);

  const userLogin = () => {
    dispatch(
      setCredentials({
        username,
        password,
      })
    );
  };

  return (
    <View style={[Layout.fill, Layout.colCenter, Layout.justifyContentAround]}>
      {loading && <Spinner />}
      <View
        style={[
          Layout.fullWidth,
          Layout.row,
          Layout.rowReverse,
          Gutters.smallPadding,
        ]}
      >
        <Text
          style={Fonts.sourceSansLight}
          onPress={() => {
            Analytics.logEvent('IrAAyuda', 'LoginContainer');
            navigation.navigate('Help', { errorFrom: 'Login' });
          }}
        >
          {'Ayuda'}
        </Text>
      </View>
      <View style={[Layout.fill, Layout.center]}>
        <Image
          style={[styles.logoSize]}
          resizeMode={'contain'}
          source={Images['ARTIsologo']}
        />
      </View>
      <View
        style={[
          Layout.fill,
          Layout.fullWidth,
          Layout.center,
          Gutters.smallPadding,
        ]}
      >
        <NumberInput
          value={username}
          label={'DNI'}
          style={[Fonts.sourceSansRegular, { fontWeight: 'normal' }]}
          labelStyle={[Fonts.sourceSansSemibold, { fontWeight: 'normal' }]}
          onChange={(value) => setUsername(value)}
        />
        <Input
          value={password}
          label={'Contraseña'}
          labelStyle={[Fonts.sourceSansSemibold, { fontWeight: 'normal' }]}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry={securePass}
          autoCapitalize={'none'}
          rightIcon={
            <Icon
              type='MaterialIcons'
              name={!securePass ? 'visibility' : 'visibility-off'}
              size={30}
              color='gray'
              onPress={() => setSecurePass(!securePass)}
            />
          }
        />
        <TouchableOpacity
          style={[
            Layout.fullWidth,
            Layout.row,
            Layout.rowReverse,
            Gutters.smallHPadding,
            { marginBottom: 50 },
          ]}
          onPress={() => {
            Analytics.logEvent('IrAOlvideMiContrasenia', 'LoginContainer');
            navigation.navigate('RecoverPassword');
          }}
        >
          <Text style={Fonts.sourceSansLight}>OLVIDÉ MI CONTRASEÑA</Text>
        </TouchableOpacity>
      </View>
      <View style={[Layout.fill, Layout.fullWidth, Gutters.smallHPadding]}>
        <Button
          titleStyle={Fonts.sourceSansLight}
          buttonStyle={styles.buttonRadius}
          title='INGRESAR'
          onPress={userLogin}
        />
        <Button
          titleStyle={[Fonts.sourceSansLight, { color: '#389548' }]}
          type='clear'
          title='QUIERO REGISTRARME'
          onPress={() => {
            Analytics.logEvent('IraQuieroRegistrarme', 'LoginContainer');
            navigation.navigate('RegisterStepOne');
          }}
        />
      </View>
    </View>
  );
};

export default LoginContainer;
