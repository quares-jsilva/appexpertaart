import api, { setBaseUrl } from '@/Services'
import { BASE_URL_APIMANAGER } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'



const getCardData = async (params) => {

  setBaseUrl(BASE_URL_APIMANAGER)

  try {
      const response = await api.put(`tarjeta/v1.0/token`, {...params})
      return {
        status: SUCCESS,
        message: OK,
        data: response.data
      }
    } catch(error) {
      throw ({
        status: ERROR,
        message: 'Hubo un error al generar la tarjeta, intentá nuevamente en unos minutos.',
        error: JSON.stringify(error)
      })
  }

}

export default { getCardData }