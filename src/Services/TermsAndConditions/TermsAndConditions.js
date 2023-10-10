// React Native
import { Platform } from 'react-native';

// Services
import api, { setBaseUrl } from '@/Services';

// Configurations
import { BASE_URL_APIMANAGER } from '@/Config';

const SUCCESS = 'success';
const OK = 'OK';
const ERROR = 'error';

const acceptTerms = async (dni) => {
  setBaseUrl(BASE_URL_APIMANAGER);

  try {
    const plataforma = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
    const app = 'APP_CLIENTES_ART';
    const response = await api.post(
      `afiliados/v.1.0/usuarios/terminos/${dni}`,
      {
        plataforma,
        app,
      }
    );
    return {
      status: SUCCESS,
      message: OK,
      data: response.data,
    };
  } catch (error) {
    throw {
      status: ERROR,
      message: 'ERROR_TERMINOS',
      error: JSON.stringify(error),
    };
  }
};

export default { acceptTerms };
