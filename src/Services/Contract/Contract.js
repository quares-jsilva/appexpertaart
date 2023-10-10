import crashlytics from '@react-native-firebase/crashlytics'
import api, { setBaseUrl } from '@/Services'
import { 
  BASE_URL_APIMANAGER,
  BASE_URL_APICONTRATOS,
  BASE_URL_EMPLEADOS,
  BASE_URL_AUTORIZACIONES,
  BASE_URL_GATEWAY,
} from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'

const getContractsClient = async (params) => {

  setBaseUrl(BASE_URL_APICONTRATOS)

  try {
    const response = await api.get(`contratos?pagina=${params.pagina}&razonSocial=${params.razonSocial ?? ''}`)

    return {
      status: SUCCESS,
      message: OK,
      data: response.data.data && response.data.data.items || []
    }
  } catch(error) {
      throw ({
        status: ERROR,
        message: 'Hubo un error al obtener el contrato, intentá nuevamente en unos minutos.',
        error: error
      })
  }

}

const getContractDetail = async (idContrato) => {

  setBaseUrl(BASE_URL_APICONTRATOS)

  try {
    const response = await api.get(`contratos/` + idContrato)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data && response.data.data
    }
  } catch(error) {
      throw ({
        status: ERROR,
        message: 'Hubo un error al obtener el detalle del contrato, intentá nuevamente en unos minutos.',
        error: error
      })
  }

}

const getCurrentAccountDetail = async (idContrato) => {

  setBaseUrl(BASE_URL_APICONTRATOS)

  try {
    const response = await api.get(`contratos/` + idContrato + '/cuenta-corriente')
    return {
      status: SUCCESS,
      message: OK,
      data: response.data && response.data.data
    }
  } catch(error) {
      throw ({
        status: ERROR,
        message: 'Hubo un error al obtener el detalle del contrato, intentá nuevamente en unos minutos.',
        error: error
      })
  }

}

const getContractPrintUrl = async (params) => {

  setBaseUrl(BASE_URL_APIMANAGER)

  const data = {
    ...params,
    as_accion: "APP Clientes - Impresión de contrato"
  }

  try {
    const response = await api.post(`app/clientes/v1/contrato/impresion/reimpresioncontrato`, data)
    if(response.data.error_code !== SUCCESS) {
      await crashlytics().setAttributes({'response': JSON.stringify(response), 'params': JSON.stringify(params) })
      crashlytics().log('No se pudo obtener el documento')
      return {
        status: ERROR,
        message: response.data.error_code === 'errors_to_front_end' ? response.data.error_message : "En este momento no se pudo obtener el documento, intentá nuevamente en unos minutos.",
      }
    }
    return {
      status: SUCCESS,
      message: OK,
      data: response.data.resultado
    }
  } catch(error) {
    return {
      status: ERROR,
      message: 'No se pudo generar documento, intentá nuevamente en unos minutos.',
      error: error
    }
  }
  
}

const getCertificatePrintUrl = async (params) => {

  setBaseUrl(BASE_URL_GATEWAY)

  const poliza = params.poliza
  delete params['poliza'];

  try {
    const response = await api.post(`art/documentacion/cobertura/${poliza}`, {...params})
    return {
      status: SUCCESS,
      message: OK,
      data: response.data
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.message ? error.message : 'No se pudo generar documento, intentá nuevamente en unos minutos.',
      error: error
    })
  }
  
}

const getNonRepetitionPrintUrl = async (params) => {

  setBaseUrl(BASE_URL_GATEWAY)

  const poliza = params.poliza
  delete params['poliza'];

  try {
    const response = await api.post(`art/documentacion/no-repeticion/${poliza}`, {...params})
    return {
      status: SUCCESS,
      message: OK,
      data: response.data
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.message ? error.message : 'No se pudo generar documento, intentá nuevamente en unos minutos.',
      error: error
    })
  }
  
}

const getEmployees = async (params) => {

  setBaseUrl(BASE_URL_EMPLEADOS)

  try {
    const response = await api.get(`contratos/${params.contratoId}/empleados`, {params: {...params}})
    return {
      status: SUCCESS,
      message: OK,
      data: response && response.data.data || []
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.message ? error.message : 'Hubo un error al obtener los empleados, intentá nuevamente en unos minutos.',
      error: error
    })
  }
  
}

const getAffiliatedInsurance = async (params) => {

  setBaseUrl(BASE_URL_APIMANAGER)

  try {
    const response = await api.get(`afiliados/v.1.0/usuarios/polizas/` + params)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data && response.data.data
    }
  } catch(error) {
      throw ({
        status: ERROR,
        message: 'Hubo un error al obtener las polizas, intentá nuevamente en unos minutos.',
        error: error
      })
  }

}

const getEjecutivo = async (idContrato) => {

  setBaseUrl(BASE_URL_APICONTRATOS)

  try {
    const response = await api.get(`contratos/` + idContrato + '/contacto-experta')
    return {
      status: SUCCESS,
      message: OK,
      data: response.data && response.data.data
    }
  } catch(error) {
      throw ({
        status: ERROR,
        message: 'Hubo un error al obtener el ejecutivo del contrato, intentá nuevamente en unos minutos.',
        error: error
      })
  }

}

const getPermisos = async (poliza) => {

  setBaseUrl(BASE_URL_AUTORIZACIONES)

  try {
    const response = await api.get(`usuarios/contratos/` + poliza + '/permisos')
    return {
      status: SUCCESS,
      message: OK,
      data: response.data && response.data.data
    }
  } catch(error) {
      throw ({
        status: ERROR,
        message: 'Hubo un error al obtener el ejecutivo del contrato, intentá nuevamente en unos minutos.',
        error: error
      })
  }

}

export default { 
  getContractsClient, 
  getContractDetail, 
  getContractPrintUrl,
  getCertificatePrintUrl,
  getNonRepetitionPrintUrl,
  getEmployees,
  getAffiliatedInsurance,
  getCurrentAccountDetail,
  getEjecutivo,
  getPermisos
}