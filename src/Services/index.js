import axios from 'axios'
import { 
  BASE_URL_GATEWAY, 
  BASE_URL_APIMANAGER,
  BASE_URL_APIUSUARIOS,
  BASE_URL_APICONTRATOS,
  BASE_URL_DOCUMENTACION,
  BASE_URL_CUENTACORRIENTE,
  BASE_URL_EMPLEADOS,
  BASE_URL_AUTORIZACIONES,
  BASE_URL_REFERENTES,
  BASE_URL_SINIESTROS
} from '@/Config'
import {store} from '@/Store'
import { 
  refreshTokenApiManager, 
  refreshTokenIdentityManager, 
  refreshTokenKeycloak, 
  auth 
} from '@/Store/User/auth'
import crashlytics from '@react-native-firebase/crashlytics'

const instance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 50000,
})

export let baseUrl = null
export let useKeycloakToken = false

export const setBaseUrl = (url) => {
  baseUrl = url
}

export const changeUseKeycloakToken = () => {
  useKeycloakToken = !useKeycloakToken
}

instance.interceptors.request.use(async (config) => {
  config.baseURL = baseUrl ? baseUrl : BASE_URL_APIMANAGER;
  let {tokenIdentityManager, tokenApiManager, tokenKeycloak} = store.getState().auth
  if (tokenIdentityManager || tokenApiManager || tokenKeycloak) {
    if(baseUrl === BASE_URL_APIMANAGER){
      config.headers.Authorization = `Bearer ${tokenApiManager.accessToken}`
    } else if(
        baseUrl === BASE_URL_APICONTRATOS || 
        baseUrl === BASE_URL_APIUSUARIOS || 
        baseUrl === BASE_URL_CUENTACORRIENTE || 
        baseUrl === BASE_URL_DOCUMENTACION || 
        baseUrl === BASE_URL_EMPLEADOS || 
        baseUrl === BASE_URL_AUTORIZACIONES ||
        baseUrl === BASE_URL_REFERENTES || 
        baseUrl === BASE_URL_SINIESTROS
      ) {
      config.headers.Authorization = `Bearer ${tokenKeycloak.accessToken}`
    } else {
      config.headers.Authorization = `Bearer ${tokenIdentityManager.accessToken}`
    }
  }
  return config;
}, function error(error) {
  return Promise.reject(error);
});


instance.interceptors.response.use(
  (response) => {
    baseUrl = null
    return response;
  },
  (error) => {
    return new Promise( async (resolve, reject) => {

      const originalRequest = error.config;
      const {tokenIdentityManager, tokenApiManager, tokenKeycloak} = store.getState().auth
      
      const reportData = originalRequest.data &&  JSON.parse(originalRequest.data) || {}
      objReport = {
        'baseURL': originalRequest.baseURL || '',
        'url':  originalRequest.url || '',
        'code': error.code || '',
        'message': error.message || '',
        'method': originalRequest.method || '',
        'params': JSON.stringify(
          reportData && reportData.password ?
          {...reportData, password: '***'} : reportData)
      }
      
      baseUrl = null
      
      if(error.message.includes('timeout') || error.code === 'ECONNABORTED'){
        await crashlytics().setAttributes(objReport)
        crashlytics().log('Ocurrio un error de timeout con el servicio')
        crashlytics().recordError(error)
        reject({ 
          message: 'Se agoto el tiempo de respuesta del servidor, intentá nuevamente en unos minutos.', 
          data: [], 
          status: 'error' 
        })
      } else if (
        (tokenIdentityManager || tokenApiManager || tokenKeycloak) &&
        error.response && error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        if(originalRequest.baseURL === BASE_URL_APIUSUARIOS ||
          originalRequest.baseURL === BASE_URL_APICONTRATOS){
          const responseRefresh = await refreshKeycloak(tokenKeycloak, originalRequest)
          resolve(responseRefresh)
       }
        if(originalRequest.baseURL === BASE_URL_APIMANAGER){
            const responseRefresh = await refreshApiManager(tokenApiManager, originalRequest)
            resolve(responseRefresh)
        }
        if(originalRequest.baseURL === BASE_URL_GATEWAY){
            const responseRefresh = await refreshGateway(tokenIdentityManager, originalRequest)
            resolve(responseRefresh)
        }
        
      }else{
        await crashlytics().setAttributes(objReport)
        crashlytics().recordError(error)
        reject({ 
          message: error && error.response && error.response.message || '', 
          data: error && error.response && error.response.data || '', 
          status: error && error.response && error.response.status || '' })
      }
    })
  }
)

export const refreshApiManager = async (token, callback = null) => {
  try{
    const response = await axios
      .get(`${BASE_URL_GATEWAY}usuarios/api-manager/refresh`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.refreshToken}`
        }
      })
    if (response.status === 200) {
      store.dispatch(refreshTokenApiManager(response.data))

      if(callback) {
        callback.headers.Authorization = `Bearer ${response.data.accessToken}`
        return axios.request(callback)
      }
    }
  } catch(error) {
    if (error.response.status === 401) {
      reLogin()
    }else{
      console.log(error)
    }
  }
}

export const refreshGateway = async (token, callback = null) => {
  try{
    const response = await axios
      .get(`${BASE_URL_GATEWAY}usuarios/identity-manager/refresh`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.refreshToken}`
        }
      })

    if (response.status === 200) {
      store.dispatch(refreshTokenIdentityManager(response.data))

      if(callback) {
        callback.headers.Authorization = `Bearer ${response.data.accessToken}`
        return axios.request(callback)
      }
      
    }
  } catch(error) {
    if (error.response.status === 401) {
      reLogin()
    }else{
      console.log(error)
    }
  }
}

export const refreshKeycloak = async (token, callback = null) => {
  try{
    const response = await axios
      .get(`${BASE_URL_GATEWAY}refresh`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.refreshToken}`
        }
      })

    if (response.status === 200) {
      store.dispatch(refreshTokenKeycloak(response.data))

      if(callback) {
        callback.headers.Authorization = `Bearer ${response.data.accessToken}`
        return axios.request(callback)
      }
      
    }
  } catch(error) {
    if (error.response.status === 401) {
      reLogin()
    }else{
      console.log(error)
    }
  }
}

const reLogin = () => {
  let credentials = store.getState().auth.credentials
  store.dispatch(auth(credentials))
}

export const ExceptionResponse = (message, status) => {
  this.message = message
  this.status = status
}

export default instance
