
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ClaimApi } from '@/Services/Claim';

export const getClaimsClient = createAsyncThunk(
  'claim/getClaimsClient',
  async (params, thunkApi) => {
    try {
      const response = await ClaimApi.getClaims(params)
      return response
    } catch (err) {
      return thunkApi.rejectWithValue(err)
    }
    
  }
)

export const getClaimsAffiliated = createAsyncThunk(
  'claim/getClaimsAffiliated',
  async (params, thunkApi) => {
    try {
      let claims = []
      let error = []

      for(const poliza of params.polizas) {
        try {

          const response = await ClaimApi.getClaims({
            nroPoliza: poliza,
            dni: params.dni
          })
          
          if(response.data && response.data.length > 0) {
            const claimsFiltered = response.data.filter(claim => claim.dniEmpleado.substr(2, params.dni.length) === params.dni)

            claims.push(
              ...claimsFiltered.map((item) => ({ ...item, poliza }))
            )

          }
          
        } catch (err) {
          error.push(poliza)
        }
      }

      return {
        data: claims,
        status: error.length > 0 ? 'error':'success',
        message: error.length > 0 ? 'Se produjo un error al obtener siniestros para la/s poliza/s ' + error.join(', ') : 'OK'
      }
    } catch (err) {
      return thunkApi.rejectWithValue(err)
    }
  }
)

export const getClaimDetail = createAsyncThunk(
  'claim/getClaimDetail',
  async (params, thunkApi) => {
    try {
      const response = await ClaimApi.getClaimDetail(params)
      return response
    } catch (err) {
      return thunkApi.rejectWithValue(err)
    }
    
  }
)

export const getStages = createAsyncThunk(
  'claim/getStages',
  async (params, thunkApi) => {
    try {
      const response = await ClaimApi.getStages(params)
      return response
    } catch (err) {
      return thunkApi.rejectWithValue(err)
    }
    
  }
)
//claimObj
/*
{
  nombre: "GARAY"
  dniEmpleado: "20945021285"
  expediente: 1937127
  estadoAdmin: "N"
  descSiniestroEstado: "En Análisis"
  fechaReingreso: null
  tieneJuicio: "N"
}
*/


const initialState = {
  hasClaim: false,
  claims: [],
  myClaims: [],
  claimDetail: {},
  stages: [],
  error: null,
  status: null,
  message: null,
  loading: false,
}

// Then, handle actions in your reducers:
const claimSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {},
  extraReducers: {
    'auth/logout': (state, action) => {
      return initialState
    },
    'auth/login/fulfilled': (state, action) => {
      return initialState
    },

    [getClaimsClient.pending]: (state, action) => {
      if (state.loading === false) {
        return {...initialState, loading : true}
      }
    },
    [getClaimsClient.fulfilled]: (state, action) => {
        state.loading = false
        state.claims = action.payload.data || []
        state.message = action.payload.message
        state.status = action.payload.status
    },
    [getClaimsClient.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.error = action.payload.error
        state.message = action.payload.message
        state.status = action.payload.status
      }
    },
    [getClaimsAffiliated.pending]: (state, action) => {
      if (state.loading === false) {
        return {...initialState, loading : true}
      }
    },
    [getClaimsAffiliated.fulfilled]: (state, action) => {
        state.loading = false
        
        state.hasClaim = action.payload.data.length > 0

        state.myClaims = action.payload.data || []
        state.message = action.payload.message
        state.status = action.payload.status    
    },
    [getClaimsAffiliated.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.hasClaim = false
        state.error = action.payload.error
        state.message = action.payload.message
        state.status = action.payload.status
      }
    },

    [getClaimDetail.pending]: (state, action) => {
        if (state.loading === false) {
            state.loading = true
            state.claimDetail = {}
        }
    },
    [getClaimDetail.fulfilled]: (state, action) => {
        if (state.loading === true) {
            state.loading = false
            state.claimDetail = action.payload.data || {}
            state.message = action.payload.message
            state.status = action.payload.status
        }
    },
    [getClaimDetail.rejected]: (state, action) => {
        if (state.loading === true) {
            state.loading = false
            state.error = action.payload.error
            state.message = action.payload.message
            state.status = action.payload.status
        }
    },

    [getStages.pending]: (state, action) => {
      if (state.loading === false) {
          state.loading = true
          state.stages = []
      }
    },
    [getStages.fulfilled]: (state, action) => {
        if (state.loading === true) {
            state.loading = false
            state.stages = action.payload.data || []
            state.message = action.payload.message
            state.status = action.payload.status
        }
    },
    [getStages.rejected]: (state, action) => {
        if (state.loading === true) {
            state.loading = false
            state.error = action.payload.error
            state.message = action.payload.message
            state.status = action.payload.status
        }
    },
  }
})

export default claimSlice.reducer