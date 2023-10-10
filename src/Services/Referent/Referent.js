import crashlytics from '@react-native-firebase/crashlytics'
import api, { setBaseUrl } from '@/Services'
import { BASE_URL_REFERENTES } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'

const getReferents = async (params) => {

  setBaseUrl(BASE_URL_REFERENTES)

  try {
    const { poliza, ordenamiento, apellidoNombre, pagina } = params;

    const response = await api.get(
      `polizas/contactos/headers?poliza=${poliza}&ordenamiento=${ordenamiento}&apellidoNombre=${apellidoNombre}&pagina=${pagina}`
    )

    if(response.status === 401 || response.data.message === 'SIN_PERMISOS') {
      return {
        status: ERROR,
        message: 'No posee permisos para visualizar la funcionalidad',
        error: response.message,
      }
    }

    if(response.data) {
      return {
        status: SUCCESS,
        message: OK,
        data: response.data?.data?.items || []
      }
    }

  } catch(error) {
    throw ({
      status: ERROR,
      message: error.message ? error.message : 'No se pudo obtener empleados, intentá nuevamente en unos minutos.',
      error: error
    })
  }
    
}

const getPositions = async () => {

  setBaseUrl(BASE_URL_REFERENTES)

  try {
    const response = await api.get(`contactos/cargos`)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data.data
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.message ? error.message : 'No se pudo obtener los cargos, intentá nuevamente en unos minutos.',
      error: error
    })
  }
  
}

const getBranches = async (params) => {

  setBaseUrl(BASE_URL_REFERENTES)

  try {
    const response = await api.get(`polizas/${params}/sucursales`)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data.data
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.message ? error.message : 'No se pudo obtener las sucursales, intentá nuevamente en unos minutos.',
      error: error
    })
  }
  
}

const getTypes = async () => {

  setBaseUrl(BASE_URL_REFERENTES)

  try {
    const response = await api.get(`contactos/tipos`)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data.data
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.message ? error.message : 'No se pudo obtener los tipos, intentá nuevamente en unos minutos.',
      error: error
    })
  }
  
}

const addReferent = async (params) => {

  setBaseUrl(BASE_URL_REFERENTES)

  try {
    const response = await api.post(`polizas/${params.contractId}/contactos`, params.datos)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.data.error_message ? ((error.data.error_message.includes('Número de teléfono inválido') || error.data.error_message.includes('Prefijo telefónico inválido')) && 'El prefijo debe tener entre 2 y 4 números, el número de celular entre 6 y 8 y en total el número completo no debe ser de más de 10 números') : 'No se pudo agregar al referente, intentá nuevamente en unos minutos.',
      error: error
    })
  }
    
}

const getReferent = async (params) => {

  setBaseUrl(BASE_URL_REFERENTES)

  try {
    const response = await api.get(`polizas/${params.contractId}/contactos/${params.referentId}`)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data.data
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.data.error_message ? error.data.error_message : 'No se pudo obtener los datos del contacto, intentá nuevamente en unos minutos.',
      error: error
    })
  }
    
}

const updateReferent = async (params) => {

  setBaseUrl(BASE_URL_REFERENTES)

  const contactId = params.contactId
  delete params.contactID

  try {
    const response = await api.put(`polizas/${params.contractId}/contactos/${params.referentId}`, params.datos)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.data.error_message ? error.data.error_message : 'No se pudo actualizar el referente, intentá nuevamente en unos minutos.',
      error: error
    })
  }
    
}

const deleteReferent = async (params) => {

  setBaseUrl(BASE_URL_REFERENTES)

  try {
    const response = await api.delete(`polizas/${params.contractId}/contactos/${params.referentId}`)
    return {
      status: SUCCESS,
      message: OK,
      data: {}
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: error.data.error_message ? error.data.error_message : 'No se pudo eliminar el contacto, intentá nuevamente en unos minutos.',
      error: error
    })
  }
    
}
  
export default { 
  getReferents,
  getPositions,
  getTypes,
  getBranches,
  addReferent,
  getReferent,
  updateReferent,
  deleteReferent
}