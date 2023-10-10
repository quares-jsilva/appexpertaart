import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AuthApi from '@/Services/User/Auth'

export const auth = createAsyncThunk(
  'auth/login',
  async (credentials, thunkApi) => {
    try {
      const response = await AuthApi.logIn(credentials)
      return response
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

const initialState = {
  credentials: null,
  pushId: null,
  isAuthenticated: false,
  tokenIdentityManager: null,
  tokenApiManager: null,
  tokenKeycloak: null,
  status: null,
  message: null,
  error: null,
  loading: false,
}
// Then, handle actions in your reducers:
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.credentials = action.payload
    },
    setPushId: (state, action) => {
      state.pushId = action.payload
    },
    refreshTokenIdentityManager: (state, action) => {
      state.tokenIdentityManager = action.payload
    },
    refreshTokenApiManager: (state, action) => {
      state.tokenApiManager = action.payload
    },
    refreshTokenKeycloak: (state, action) => {
      state.tokenKeycloak = action.payload
    },
    authenticateOffline: state => ({ ...initialState, isAuthenticated: true }),
    logout: state => ({ ...initialState, pushId: state.pushId })
  },
  extraReducers: {
    'help/resetStatus': (state, action) => {
      state.status = null
      state.message = null
      state.error = null
    },
    'password/resetState': (state, action) => {
      state.status = null
      state.message = null
    },
    [auth.pending]: (state, action) => {
      if (state.loading === false) {
        return { ...initialState, loading: true, credentials: state.credentials, pushId: state.pushId };
      }
    },
    [auth.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.isAuthenticated = true
        state.tokenIdentityManager = action.payload.data.seguridadIdentityManager
        state.tokenApiManager = action.payload.data.seguridadApiManager
        state.tokenKeycloak = {
          accessToken: action.payload.data.access_token, 
          refreshToken: action.payload.data.refresh_token
        }

        state.loading = false
        //Busca codigos de error definidos
        state.status = action.payload.status
        state.message = action.payload.message
      }
    },
    [auth.rejected]: (state, action) => {
      if (state.loading === true) {
        return { 
          ...initialState, 
          credentials: state.credentials,
          pushId: state.pushId,
          error: action.error,
          status: action.payload.status,
          message: action.payload.message 
        };
      }
    },

  }
})


export const { authenticateOffline, setCredentials, setPushId, refreshTokenIdentityManager, refreshTokenApiManager, refreshTokenKeycloak, logout } = authSlice.actions;
export default authSlice.reducer