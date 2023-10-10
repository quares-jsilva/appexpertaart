import api, { setBaseUrl } from '@/Services'
import { BASE_URL_APIMANAGER } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'

const getAll = async (params) => {

    setBaseUrl(BASE_URL_APIMANAGER)

    try {
        const response = await api.get(`afiliados/v.1.0/farmacias`, {params})
        return {
            status: SUCCESS,
            message: OK,
            data: response && response.data || []
        }
    } catch(error) {
        return {
            status: ERROR,
            message: 'Hubo un error al obtener las farmacias, intentá nuevamente en unos minutos.',
            error: error
        }
    }

}

const getByName = async (params) => {

    setBaseUrl(BASE_URL_APIMANAGER)

    try {
        const response = await api.get(`afiliados/v.1.0/farmacias/busqueda/` + params.name, 
            {
                params: {dni: params.dni, usuario: params.user}
            }
        )
        return {
            status: SUCCESS,
            message: OK,
            data: response && response.data || []
        }
    } catch(error) {
        return {
            status: ERROR,
            message: 'Hubo un error al buscar farmacias, intentá nuevamente en unos minutos.',
            error: error
        }
    }

}

export default { getAll, getByName }