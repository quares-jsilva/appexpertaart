
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import PersonalDataApi from '@/Services/User/PersonalData'

export const getPersonalData = createAsyncThunk(
  'user/getPersonalData',
  async (params, thunkApi) => {
    let response
    try {
      response = await PersonalDataApi.getPersonalData(params)
      return response
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const updatePersonalData = createAsyncThunk(
  'user/updatePersonalData',
  async (params, thunkApi) => {
    try {
      let response = await PersonalDataApi.updatePersonalData(params)
      return response
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

const initialState = {
  data: {},
  status: null,
  message: null,
  error: null,
  loading: false,
}
const personalDataSlice = createSlice({
  name: 'personalData',
  initialState,
  reducers: {

  },
  extraReducers: {
    'help/resetStatus': (state, action) => {
      state.status = null
      state.message = null
      state.error = null
    },
    'auth/logout': (state, action) => {
      return initialState
    },
    [getPersonalData.pending]: (state, action) => {
      if (state.loading === false) {
        state.loading = true
      }
    },
    [getPersonalData.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.data = action.payload.data
      }
    },
    [getPersonalData.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
      }
    },

    [updatePersonalData.pending]: (state, action) => {
      state.error = null
      if (state.loading === false) {
        state.loading = true
      }
    },
    [updatePersonalData.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.data = action.payload.data
        state.status = action.payload.status
        
      }
    },
    [updatePersonalData.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
      }
    },

  }
})

export default personalDataSlice.reducer