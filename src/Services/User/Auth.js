// React Native
import { Platform } from 'react-native';

// Libraries
import crashlytics from '@react-native-firebase/crashlytics'

// Services
import api, { setBaseUrl } from '@/Services'

// Configurations
import { BASE_URL_GATEWAY, BASE_URL_APIMANAGER } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'

const logIn = async (user) => {
  if (!user) {
    await crashlytics().setAttributes({'response': JSON.stringify(response), 'params': JSON.stringify(params) })
    crashlytics().log('Se requiere el usuario')
    throw {
      status: ERROR,
      message: 'Se requiere el usuario',
      error: ERROR
    }
  }
  
  setBaseUrl(BASE_URL_GATEWAY)

  const credentials = {
    "username": user.username, 
    "password": user.password,
  }

  try {
    const response = await api.post(`auth`, credentials)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data
    }
  } catch(error) {
    console.log(JSON.stringify(error))
    if(error.data && error.data.message === 'invalid_grant'){
      throw {
        status: ERROR,
        message: 'Usuario o contraseña incorrecto.',
        error: JSON.stringify(error)
      }
    } else if(error.data && error.data.message === 'no_contract'){
      throw {
        status: ERROR,
        message: 'No tenes pólizas asociadas o permisos para verlas. Comunicate con el Centro de Atención al Cliente 0800 7777 278(ART).',
        error: JSON.stringify(error)
      }
    } else {
      throw {
        status: ERROR,
        message: 'Hubo un error al iniciar sesión, intentá nuevamente en unos minutos.',
        error: JSON.stringify(error)
      }
    }
  }

}

const savePushId = async (user) => {
  
  setBaseUrl(BASE_URL_APIMANAGER)

  const params = {
    "pwid": user.pwid,
    "plataforma": Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    "pushId": user.pushId,
    "appId": '5',
  }

  try {
    const response = await api.post(`afiliados/v.1.0/usuarios/pushid`, params)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data
    }
  } catch(error) {
    throw {
      status: ERROR,
      message: 'Hubo un error al guardar el pushId, intentá nuevamente en unos minutos.',
      error: JSON.stringify(error)
    }
  }

}

const getTerminos = async (dni) => {
  setBaseUrl(BASE_URL_APIMANAGER);
  try {
    const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
    const response = await api.get(
      `afiliados/v.1.0/usuarios/terminos/${dni}?plataforma=${platform}`
    );

    return {
      status: SUCCESS,
      message: OK,
      data: response.data.data,
    };
  } catch (error) {
    throw {
      status: ERROR,
      message: 'ERROR_TERMINOS',
      error: JSON.stringify(error),
    };
  }
};

const getProfiles = async (params) => {
  
  setBaseUrl(BASE_URL_GATEWAY)

  try {
    const response = await api.post(`myprofiles`, params)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data
    }
  } catch(error) {
    throw {
      status: ERROR,
      message: 'No pudimos cargar la información en este momento.',
      error: JSON.stringify(error)
    }
  }

}

export default { logIn, savePushId, getTerminos, getProfiles }