// React
import { View, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

// Libraries
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Analytics from '../../libs/analytics';
import PDFView from 'react-native-view-pdf';
import RNFS from 'react-native-fs';

// Components
import { Spinner } from '@/Components';
import PdfBar from '../../Components/PdfBar';

// Services
import { refreshApiManager, refreshGateway } from '@/Services';

// Store
import { incrementRateCounter } from '@/Store/User/user';
import { resetPrintUrl } from '@/Store/Contract';

// Configurations
import {
  BASE_URL_APICONTRATOS,
  BASE_URL_CUENTACORRIENTE,
  BASE_URL_DOCUMENTACION,
  BASE_URL_GATEWAY,
} from '@/Config';

// Themes
import { useTheme } from '@/Theme';

// Helpers
import { showMessage } from '@/Components/MessageHelper';

const PdfVisualizerContainer = ({ route }) => {
  const { Layout } = useTheme();
  const dispatch = useDispatch();
  const { tokenIdentityManager, tokenApiManager, tokenKeycloak } = useSelector(
    (state) => state.auth
  );
  const [localFile, setlocalFile] = useState('');
  const navigation = useNavigation();
  const { rateCounter } = useSelector((state) => state.user);

  useEffect(() => {
    Analytics.logScreen(
      `Visualizador de pdf - ${route.params.title}`,
      'PdfVisualizerContainer'
    );
  }, []);

  useEffect(() => {
    if (route.params.uri !== '' && route.params.pdfName !== '') {
      if (
        route.params.uri.includes(BASE_URL_CUENTACORRIENTE) ||
        route.params.uri.includes(BASE_URL_DOCUMENTACION)
      ) {
        createFile(tokenKeycloak.accessToken);
      } else {
        if (route.params.uri.includes(BASE_URL_GATEWAY)) {
          createFile(tokenIdentityManager.accessToken);
        } else {
          createFile(tokenApiManager.accessToken);
        }
      }
    }
  }, [tokenIdentityManager, tokenApiManager]);

  useEffect(() => {
    navigation.setOptions({ title: route.params.title });
    return () => {
      dispatch(resetPrintUrl());
    };
  }, []);

  const createFile = async (token) => {
    const local = RNFS.DocumentDirectoryPath + route.params.pdfName;
    const options = {
      fromUrl: route.params.uri,
      toFile: local,
      progressDivider: 1,
      headers: {
        Accept: '*/*',
        Authorization: 'Bearer ' + token,
      },
      connectionTimeout: 50000,
    };

    await RNFS.downloadFile(options)
      .promise.then((response) => {
        Analytics.logEvent(
          `Descargar - ${route.params.title}`,
          'DownloadFile'
        );
        if (response.statusCode === 401) {
          if (route.params.uri.includes(BASE_URL_APICONTRATOS)) {
            refreshKeycloak(tokenKeycloak);
          } else {
            if (route.params.uri.includes(BASE_URL_GATEWAY)) {
              refreshGateway(tokenIdentityManager);
            } else {
              refreshApiManager(tokenApiManager);
            }
          }
        } else {
          if (rateCounter < 15) {
            dispatch(incrementRateCounter());
          }
          response;
          setlocalFile(Platform.OS === 'ios' ? route.params.pdfName : local);
        }
      })
      .catch((error) => {
        showMessage({
          message: 'Falló la descarga del documento.',
          type: 'error',
          buttonHelp: {
            onPress: () =>
              navigation.navigate('ProblemReport', {
                errorFrom: 'PdfVisualizer',
              }),
          },
        });
      });
  };

  return (
    <View style={[Layout.fill]}>
      {localFile ? (
        <>
          <PDFView
            fadeInDuration={250.0}
            style={Layout.fill}
            resource={localFile}
            resourceType={'file'}
            onError={() =>
              showMessage({
                message: 'Falló la descarga del documento.',
                type: 'error',
                button: {
                  text: 'Aceptar',
                  onPress: () => navigation.goBack(),
                },
                buttonHelp: {
                  onPress: () =>
                    navigation.navigate('ProblemReport', {
                      errorFrom: 'PdfVisualizer',
                    }),
                },
              })
            }
          />
          <PdfBar
            title={route.params.title}
            filePath={
              Platform.OS === 'ios'
                ? RNFS.DocumentDirectoryPath + localFile
                : 'file://' + localFile
            }
          />
        </>
      ) : (
        <Spinner />
      )}
    </View>
  );
};

export default PdfVisualizerContainer;
