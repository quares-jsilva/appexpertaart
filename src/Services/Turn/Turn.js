import api, { setBaseUrl } from '@/Services'
import { BASE_URL_APIMANAGER } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'

const providers = [
    "A DOMICILIO",
    "NO UTILIZAR ESTE PRESTADOR",
    "PEDIDO SRT / PRESTADOR PROVINCIA",
    "PRESTADOR ESTATUTARIO",
    "PRESTADOR FUERA DE CARTILLA",
    "PRESTADOR NO DEFINIDO",
    "PRESTADOR POR COMPLEMENTO",
    "PRESTADORES FUERA DE CARTILLA"
]

const specialities = [
    "MEDICINA DEL TRABAJO",
    "CIRUGIA",
    "FARMACIA",
    "ORTOPEDIA",
    "TRASLADO AEROPUERTO",
    "TRASLADO",
    "INTERNACION",
    "NEUROCIRUGIA",
    "VALOR NULO",
]

const esOculto = (turn) => {
    if(
        providers.includes(turn.prestador) || 
        specialities.includes(turn.especialidad) || 
        turn.especialidad == null || 
        turn.traslado.toLowerCase() === "hotel" || 
        !turn.fechaTurno.includes(' ')
    ){
        return true
    } else {
        return false
    }
}

const getTurns = async (params) => {

    setBaseUrl(BASE_URL_APIMANAGER)

    try {

        const response = await api.get(`afiliados/v.1.0/turnos/v2/filtrados`, {params})

        return {
            status: SUCCESS,
            message: OK,
            data: response.data && response.data.data.filter(turn => !esOculto(turn)) || []
        }
    } catch(error) {
        throw {
            status: ERROR,
            message: 'Hubo un error al obtener los turnos, intentá nuevamente en unos minutos.',
            error: JSON.stringify(error)
        }
    }

}


export default { getTurns }