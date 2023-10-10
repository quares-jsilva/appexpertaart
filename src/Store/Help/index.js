
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HelpApi from '@/Services/Help/Help'

export const sendComments = createAsyncThunk(
  'help/sendComments',
  async (params, thunkApi) => {
    try {
      let response = await HelpApi.sendComments(params)
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
    loading: false,
    reportTime: null
}
// Then, handle actions in your reducers:
const helpSlice = createSlice({
  name: 'help',
  initialState: INITIAL_STATE,
  reducers: {
    setReportTime: (state, action) => {
      state.reportTime = action.payload
    },
    resetStatus: (state, action) => {
      state.status = null
      state.message = null
      state.data = null
      state.error = null
      state.loading = false
    },
  },
  extraReducers: {
    [sendComments.pending]: (state, action) => {
      state.error = null
      if (state.loading === false) {
        state.loading = true
      }
    },
    [sendComments.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.status = action.payload.status
        state.message = action.payload.message
        state.data = action.payload.data
      }
    },
    [sendComments.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.error = action.payload.error
        state.message = action.payload.message
        state.status = action.payload.status
      }
    },

  }
})

export const { 
  setReportTime,
  resetStatus
} = helpSlice.actions
export default helpSlice.reducer