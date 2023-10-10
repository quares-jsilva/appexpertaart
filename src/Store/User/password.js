
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import PasswordApi from '@/Services/User/Password'

export const recoverPassword = createAsyncThunk(
  'password/recoverPassword',
  async (params, thunkApi) => {
    try {
      let response = await PasswordApi.recoverPassword(params)
      return response
    } catch(error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const changePassword = createAsyncThunk(
    'password/changePassword',
    async (params, thunkApi) => {
      try {
        let response = await PasswordApi.changePassword(params)
        return response
      } catch(error) {
        return thunkApi.rejectWithValue(error)
      }
    }
)

const INITIAL_STATE = {
    status: null,
    message: null,
    data: null,
    error: null,
    loading: false
}
// Then, handle actions in your reducers:
const passwordSlice = createSlice({
  name: 'password',
  initialState: INITIAL_STATE,
  reducers: {
    resetState: (state, action) => {
        state.status = null
        state.message = null
        state.data = null
        state.error = null
        state.loading = false
    },
  },
  extraReducers: {
    'help/resetStatus': (state, action) => {
      state.status = null
      state.message = null
      state.error = null
    },
    [recoverPassword.pending]: (state, action) => {
      state.error = null
      if (state.loading === false) {
        state.loading = true
      }
    },
    [recoverPassword.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.status = action.payload.status
        state.message = action.payload.message
        state.data = action.payload.data
      }
    },
    [recoverPassword.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.error = action.payload.error
        state.message = action.payload.message
        state.data = action.payload.data
      }
    },

    [changePassword.pending]: (state, action) => {
        state.error = null
        if (state.loading === false) {
          state.loading = true
        }
      },
    [changePassword.fulfilled]: (state, action) => {
        if (state.loading === true) {
          state.loading = false
          state.status = action.payload.status
          state.message = action.payload.message
        }
    },
    [changePassword.rejected]: (state, action) => {
        if (state.loading === true) {
          state.loading = false
          state.error = action.payload.error
          state.message = action.payload.message
          state.data = action.payload.data
        }
    }

  }
})

export const { resetState } = passwordSlice.actions
export default passwordSlice.reducer