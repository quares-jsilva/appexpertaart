// Services
import api, { setBaseUrl } from '@/Services';

// Libraries
import axios from 'axios';

// Store
import { store } from '@/Store';

// Configurations
import { BASE_URL_GATEWAY } from '@/Config';

const SUCCESS = 'success';
const OK = 'OK';
const ERROR = 'error';

const recoverPassword = async (dni) => {
  setBaseUrl(BASE_URL_GATEWAY);

  try {
    const response = await api.post('recuperar-contrasena', { username: dni });
    return {
      status: SUCCESS,
      message: OK,
      data: response.data,
    };
  } catch (error) {
    if (error.status === 404) {
      return {
        status: ERROR,
        message: 'El usuario ingresado es inexistente.',
        error: error,
      };
    } else {
      return {
        status: ERROR,
        message:
          'Hubo un error al recuperar la contraseña, intentá nuevamente en unos minutos.',
        error: error,
      };
    }
  }
};

// !! El endpoint es diferente a los otros, por eso se hace la petición acá y no se reutiliza la función para consumir servicios.
const changePassword = async (params) => {
  try {
    const { tokenKeycloak } = store.getState().auth;
    const token = `Bearer ${tokenKeycloak.accessToken}`;
    const url =
      'https://mobile-clientes-gw.apiexperta.com.ar/cambiar-contrasena';
    const config = {
      method: 'put',
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: params,
    };

    const response = await axios(config);
    return {
      status: 'success',
      message: 'Contraseña cambiada con éxito',
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 409) {
        return {
          status: 'error',
          message: 'La contraseña actual ingresada es incorrecta',
          error: data,
        };
      }

      if (status === 400) {
        return {
          status: 'error',
          message:
            'La contraseña debe tener un mínimo de 8 caracteres y contener al menos una letra mayúscula, una minúscula y 2 números.',
          error: data,
        };
      }
    }

    return {
      status: 'error',
      message:
        'Hubo un error al cambiar la contraseña, intenta nuevamente en unos minutos.',
      error: error.message,
    };
  }
};

export default { recoverPassword, changePassword };
