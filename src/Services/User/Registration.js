import api, { setBaseUrl } from '@/Services'
import { BASE_URL_GATEWAY } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'

const registerStepOne = async (params) => {
    
    setBaseUrl(BASE_URL_GATEWAY)

    let query = {
        dni: params.dni
    }
    if(params.cuit !== '') {
        query['cuit'] = params.cuit
    }

    try {
        const response = await api.post(`usuarios/registro/paso1`, query)
        return {
            status: response.data.status,
            message: response.data.mensaje,
            existeUsuario: response.data.existeUsuario
        }
    } catch(error) {
        return {
            status: ERROR,
            message: error.message
        }
    }

}

const registerStepTwo = async (params) => {
    
    setBaseUrl(BASE_URL_GATEWAY)

    let query = {
        dni: params.dni,
        apellido: params.apellido,
        nombre: params.nombre,
        mail: params.email
    }
    if(params.cuit !== '') {
        query['cuit'] = params.cuit
    }

    try {
        const response = await api.post(`usuarios/registro/paso2`, query)
        return {
            status: response.data.status,
            message: response.data.mensaje,
        }
    } catch(error) {
        return {
            status: ERROR,
            message: error.message
        }
    }

}

export default { registerStepOne, registerStepTwo }