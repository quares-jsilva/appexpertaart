import crashlytics from '@react-native-firebase/crashlytics'
import api, { setBaseUrl } from '@/Services'
import { BASE_URL_SINIESTROS, BASE_URL_APIMANAGER } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'

const getClaims = async (params) => {

  setBaseUrl(BASE_URL_APIMANAGER)

  try {

    const response = await api.get(`app/clientes/v1/siniestro/consulta`, {params})

    return {
      status: SUCCESS,
      message: OK,
      data: response.data && response.data.siniestro || []
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: 'Hubo un error al obtener los siniestros, intentá nuevamente en unos minutos.',
      error: error
    })
  }
}

const getClaimDetail = async (params) => {

  setBaseUrl(BASE_URL_APIMANAGER)

  try {
    const response = await api.get(`app/clientes/v1/siniestro/detallesiniestro`, {params})

    return {
      status: SUCCESS,
      message: OK,
      data: response.data.detalleSiniestro
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: 'Hubo un error al obtener el detalle del siniestro, intentá nuevamente en unos minutos.',
      error: error
    })
  }
}


const getStages = async (params) => {

  setBaseUrl(BASE_URL_SINIESTROS)

  try {
    const response = await api(`siniestros/${params.expediente}/detalleetapa`);

    if(!response.data.detalleEtapa || response.data.detalleEtapa.length == 0) {
      await crashlytics().setAttributes({'response': JSON.stringify(response), 'params': JSON.stringify(parameters) })
      crashlytics().log('No se encontraron turnos')
      return ({
        status: ERROR,
        message: 'No se encontraron turnos.',
        error: response.data
      })
    }

    return {
      status: SUCCESS,
      message: OK,
      data: response.data && response.data.detalleEtapa || []
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: 'Hubo un error al obtener el detalle del siniestro, intentá nuevamente en unos minutos.',
      error: error
    })
  }

}

export default { getClaims, getClaimDetail, getStages }