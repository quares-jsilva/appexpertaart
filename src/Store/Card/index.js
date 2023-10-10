
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CardApi from '@/Services/Card/Card'

export const getCardData = createAsyncThunk(
  'card/getCardData',
  async (params, thunkApi) => {
    let response
    try {
      response = await CardApi.getCardData(params)
      return response
    } catch (err) {
      if(err.message) {
        return thunkApi.rejectWithValue(err);
      }
    }
  }
)

// Then, handle actions in your reducers:
const cardSlice = createSlice({
  name: 'card',
  initialState: {
    name: null,
    token: null,
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
    [getCardData.pending]: (state, action) => {
      if (state.loading === false) {
        state.loading = true
      }
    },
    [getCardData.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.status = action.payload.status
        state.name = action.payload.data.token.nombre,
        state.token = action.payload.data.token.token
      }
    },
    [getCardData.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading = false
        state.status = action.payload.status
        state.message = action.payload.message
      }
    },

  }
})

export default cardSlice.reducer