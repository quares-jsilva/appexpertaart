
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import TurnsApi from '@/Services/Turn/Turn'

export const getTurns = createAsyncThunk(
  'turn/getTurns',
  async (params, thunkApi) => {
    params['fechaDesde'] = new Date()
    const response = await callTurns(params, thunkApi)
    response.data.sort((a, b) => {return a.fechaTurno.localeCompare(b.fechaTurno)})
    return response
  }
)

export const getPrevTurns = createAsyncThunk(
  'turn/getPrevTurns',
  async (params, thunkApi) => {
    params['fechaHasta'] = new Date()
    const response = await callTurns(params, thunkApi)
    response.data.sort((a, b) => {return b.fechaTurno.localeCompare(a.fechaTurno)})
    return response
  }
)

const callTurns = async (params, thunkApi) => {
  try {
    let turns = []
    let error = []

    for(const claim of params.claims) {
      try {
        const response = await TurnsApi.getTurns({
          siniestro: claim.expediente,
          fechaDesde: params.fechaDesde,
          fechaHasta: params.fechaHasta
        })
        
        if(response.data && response.data.length > 0) {
          turns.push(...response.data)
        }
        
      } catch (err) {
        error.push(claim)
      }
    }

    return {
      data: turns,
      status: error.length > 0 ? 'error':'success',
      message: error.length > 0 ? 'Se produjo un error al obtener turnos para el/los siniestro/s ' + error.join(', ') : 'OK'
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error)
  }
}
const initialState = {
  turns: [],
  prevTurns: [],
  status: null,
  message: null,
  error: null,
  loading: false,
}
// Then, handle actions in your reducers:
const turnSlice = createSlice({
  name: 'turn',
  initialState,
  reducers: { },
  extraReducers: {
    'auth/logout': (state, action) => {
      return initialState
    },
    'auth/login/fulfilled': (state, action) => {
      return initialState
    },
    
    [getTurns.pending]: (state, action) => {
      if (state.loading === false) {
        state.loading = true
      }
    },
    [getTurns.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.turns = action.payload.data
        state.status = action.payload.status
        state.message = action.payload.message
      }
    },
    [getTurns.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
      }
    },

    [getPrevTurns.pending]: (state, action) => {
      if (state.loading === false) {
        state.loading = true
      }
    },
    [getPrevTurns.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.prevTurns = action.payload.data
        state.status = action.payload.status
        state.message = action.payload.message
      }
    },
    [getPrevTurns.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
      }
    }
  }
})

export default turnSlice.reducer