import api, { setBaseUrl } from '@/Services'
import { BASE_URL_APIMANAGER } from '@/Config'

const SUCCESS = 'success'
const OK = 'OK'
const ERROR = 'error'
const banks = {
  '007': 'Banco de Galicia y Buenos Aires',
  '011': 'Banco de la Nación Argentina',
  '014': 'Banco de la Provincia de Buenos Aires',
  '015': 'Banco ICBC',
  '016': 'Banco Citibank N.A.',
  '017': 'Banco Francés S.A.',
  '018': 'MUFG Bank Ltd',
  '020': 'Banco de la Provincia de Córdoba S.A.',
  '027': 'Banco Supervielle S.A.',
  '029': 'Banco de la Ciudad de Buenos Aires',
  '034': 'Banco Patagonia S.A.',
  '044': 'Banco Hipotecario S.A.',
  '045': 'Banco de San Juan S.A.',
  '060': 'Banco del Tucuman S.A.',
  '065': 'Banco Municipal de Rosario',
  '072': 'Banco Santander Rio S.A.',
  '083': 'Banco del Chubut S.A.',
  '086': 'Banco de Santa Cruz S.A.',
  '093': 'Banco de La Pampa SEM',
  '094': 'Banco de Corrientes S.A.',
  '097': 'Banco Provincia del Neuquén S.A.',
  '143': 'Brubank',
  '147': 'Banco Interfinanzas S.A.',
  '150': 'HSBC Bank Argentina S.A.',
  '191': 'Banco Crediccop Cooperativo Limitado',
  '198': 'Banco de Valores S.A.',
  '247': 'Banco Roela S.A.',
  '254': 'Banco Mariva S.A.',
  '259': 'Banco Itaú Argentina S.A.',
  '262': 'Bank Of America N.A.',
  '266': 'BNP Paribas',
  '268': 'Banco Provincia de Tierra del Fuego',
  '269': 'Banco de la República Oriental del Uruguay',
  '277': 'Banco Saenz',
  '281': 'Banco Meridian S.A.',
  '285': 'Banco Macro S.A.',
  '299': 'Banco Comafí S.A.',
  '300': 'Banco de Inversión y Comercio Exterior',
  '301': 'Banco Piano S.A.',
  '305': 'Banco Julio S.A.',
  '309': 'Banco Rioja',
  '310': 'Banco del Sol S.A.',
  '311': 'Nuevo Banco del Chaco S.A.',
  '312': 'Banco Voii S.A.',
  '315': 'Banco de Formosa S.A.',
  '319': 'Banco CMF S.A.',
  '321': 'Banco de Santiago del Estero S.A.',
  '322': 'Banco Industrial S.A.',
  '330': 'Nuevo Banco de Santa Fe S.A.',
  '331': 'Banco Cetelem Argentina S.A.',
  '332': 'Banco de Servicios Financieros S.A.',
  '336': 'Banco Bradesco Argentina',
  '338': 'Banco de Servicios y Transacciones S.A.',
  '339': 'RCI Banque S.A.',
  '340': 'BACS Banco de Crédito y Securitización',
  '341': 'Banco Masventas S.A.',
  '384': 'Wilobank S.A.',
  '386': 'Nuevo Banco de Entre Ríos S.A.',
  '389': 'Banco Columbia S.A.',
  '426': 'Banco Bica S.A.',
  '431': 'Banco Coinag S.A.',
  '432': 'Banco de Comercio S.A.',
}

const getPersonalData = async (params) => {

  setBaseUrl(BASE_URL_APIMANAGER)

  try {
    const response = await api.get(`afiliados/v.1.0/datosPersonales/` + params.dni, {params: { usuario: params.usuario }})
    if(response.data.cbu) {
      response.data['banco'] = getBank(response.data.cbu.substring(0, 3))
    }
    return {
      status: SUCCESS,
      message: OK,
      data: !!response.data.data ? response.data.data : {}
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: 'Hubo un error al obtener los datos del perfil, intentá nuevamente en unos minutos.',
      error: JSON.stringify(error)
    })
  }
  
}

const updatePersonalData = async (params) => {

  setBaseUrl(BASE_URL_APIMANAGER)

  try {
    const response = await api.put(`afiliados/v.1.0/datosPersonales/` + params.dni, 
      {
        email: params.email,
        prefijoCelular: params.prefijoCelular,
        celular: params.celular 
      }
    )
    return {
      status: SUCCESS,
      message: OK,
      data: response.data && response.data.data || {}
    }
  } catch(error) {
    throw ({
      status: ERROR,
      message: 'Hubo un error al guardar los datos del perfil, intentá nuevamente en unos minutos.',
      error: JSON.stringify(error)
    })
  }

}

const getBank = (code) => {
  return banks[code]
}

export default { getPersonalData, updatePersonalData }
