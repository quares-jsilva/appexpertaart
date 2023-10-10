
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import RegistrationApi from '@/Services/User/Registration'

export const registerUser = createAsyncThunk(
  'registration/registerUser',
  async (params, thunkApi) => {
    let responseOne = await RegistrationApi.registerStepOne(params)
    if(responseOne && !responseOne.existeUsuario) {
      const stepOneOk = ['VINCULO_CREADO_OK', 'VALIDACIONES_OK']
      if(stepOneOk.includes(responseOne.status)) {
        const response = await RegistrationApi.registerStepTwo(params)
        return response
      } else {
        return {
          status: responseOne.status,
          message: responseOne.message
        }
      }
    } else {
      if(responseOne.status === 'VINCULO_CREADO_OK'){
        return {
          status: responseOne.status,
          message: responseOne.message
        }
      }
      return {
        status: 'EXISTE_USUARIO',
        message: responseOne.message
      }
    }
  }
)

// Then, handle actions in your reducers:
const registrationSlice = createSlice({
  name: 'registration',
  initialState: {
    status: null,
    message: null,
    error: null,
    loading: false,
  },
  reducers: {
    
  },
  extraReducers: {
    'help/resetStatus': (state, action) => {
      state.status = null
      state.message = null
      state.error = null
    },
    [registerUser.pending]: (state, action) => {
      state.error = null
      if (state.loading === false) {
        state.loading = true
      }
    },
    [registerUser.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.status = action.payload.status
        state.message = action.payload.message && action.payload.message
      }
    },
    [registerUser.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.error = action.payload.error
      }
    },

  }
})

export default registrationSlice.reducer