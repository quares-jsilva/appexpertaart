
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AuthApi from '@/Services/User/Auth'

export const getTerminos = createAsyncThunk(
  'user/getTerminos',
  async (dni,thunkApi) => {

    try {
      const responseTerminos = await AuthApi.getTerminos(dni);

      return responseTerminos;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getProfiles = createAsyncThunk(
  'user/getProfiles',
  async (params, thunkApi) => {
    try {
      const response = await AuthApi.getProfiles(params)
      return response
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

const initialState = {
  pwid: null,
  data: {},
  termsAndCond: null,
  profiles: [],
  homeRoute: 'InitialScreen',
  roles: null,
  reviewed: false,
  rateCounter: 0,
  status: null,
  message: null,
  error: null,
  loading: false,
  actionType: null
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    incrementRateCounter: (state, action) => {
      state.rateCounter = state.rateCounter + 1
    },
    setReviewed: (state, action) => {
      state.reviewed = true
    },
    resetUserStore: (state) => ({ ...initialState })
  },
  extraReducers: {
    'help/resetStatus': (state, action) => {
      state.status = null
      state.message = null
      state.error = null
    },
    'auth/login/fulfilled': (state, action) => {
      const {
        roles, 
        pwid,
        dni,
        nombre,
        mail,
      } = action.payload.data

      state.pwid = pwid
      state.roles = roles
      state.homeRoute = 'InitialScreen'
      state.data = {
        tipoDocumento: null,
        documento: dni,
        nombre,
        email: mail,
        telefono: null
      }
    },
    'auth/logout': (state, action) => {
      return initialState
    },
    [getTerminos.pending]: (state, action) => {
      if (state.loading === false) {
        state.loading = true
      }
    },
    [getTerminos.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.termsAndCond = action.payload.data
      }
    },
    [getTerminos.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.error = action.payload.message
      }
    },

    [getProfiles.pending]: (state, action) => {
      if (state.loading === false) {
        state.loading = true
      }
    },
    [getProfiles.fulfilled]: (state, action) => {
      if (state.loading === true) {
        const {
          perfiles
        } = action.payload.data

        const show_autos =  perfiles.includes("USER_AUTO_CLIENTE")
        const show_art =  perfiles.includes("USER_ART_AFILIADO") || perfiles.includes("USER_ART_CLIENTE")

        state.homeRoute = show_autos && show_art ? 'Dashboard' : show_autos ? 'DashboardAuto':'DashboardArt'
        state.profiles = perfiles
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
    },
    [getProfiles.rejected]: (state, action) => {
      if (state.loading === true) {
        state.status = action.payload.status
        state.error = action.payload.error
        state.message = action.payload.message
        state.loading = false
      }
    },

  }
})

export const { incrementRateCounter, setReviewed, resetUserStore } = userSlice.actions
export default userSlice.reducer