import api, { setBaseUrl } from '@/Services'
import { BASE_URL_GATEWAY } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'

const getVersion = async () => {

  setBaseUrl(BASE_URL_GATEWAY)

  try {
    const response = await api.get(`mobile/versiones`)
    return {
      status: SUCCESS,
      message: OK,
      data: response.data
    }
  } catch(error) {
    throw {
      status: ERROR,
      message: 'No se pudo comprobar la version de la aplicación, intentá nuevamente en unos minutos.',
      error: JSON.stringify(error)
    }
  }

}

export default { getVersion }