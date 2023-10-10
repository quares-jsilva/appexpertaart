import { Platform } from 'react-native'
import api, { setBaseUrl } from '@/Services'
import { BASE_URL_GATEWAY } from '@/Config'
import { APP_VERSION } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'

const sendComments = async (params) => {
    
    setBaseUrl(BASE_URL_GATEWAY)
    
    params['so'] = Platform.OS
    params['version'] = APP_VERSION

    try {
        const response = await api.post(`reporte/enviar`, params)
        return {
            status: SUCCESS,
            message: OK,
            data: response.data
        }
    } catch(error) {
        return {
            status: ERROR,
            message: 'Hubo un error al enviar el reporte, intentá nuevamente en unos minutos.',
            error: JSON.stringify(error)
        }
    }

}

export default { sendComments }