
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import PharmacyApi from '@/Services/Pharmacy/Pharmacy'

export const getAll = createAsyncThunk(
  'pharmacy/getAll',
  async (params, thunkApi) => {
    let response
    try {
      response = await PharmacyApi.getAll(params)
      return response
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
    
  }
)

export const getByName = createAsyncThunk(
    'pharmacy/getByName',
    async (params, thunkApi) => {
      let response
      try {
        response = await PharmacyApi.getByName(params)
        return response
      } catch (error) {
        return thunkApi.rejectWithValue(error);
      }
      
    }
)

// Then, handle actions in your reducers:
const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState: {
    pharmacies: [],
    error: null,
    loading: false,
    status: null,
    message: null
  },
  reducers: {
  },
  extraReducers: {
    [getAll.pending]: (state, action) => {
      if (state.loading === false) {
        state.loading = true
      }
    },
    [getAll.fulfilled]: (state, action) => {
        state.loading = false
        state.pharmacies = action.payload.data.data
        state.message = action.payload.message
        state.status = action.payload.status
    },
    [getAll.rejected]: (state, action) => {
      if (state.loading === true) {
        state.loading= false
        state.error = action.payload.error
        state.message = action.payload.message
        state.status = action.payload.status
      }
    },

    [getByName.pending]: (state, action) => {
        if (state.loading === false) {
          state.loading = true
        }
      },
    [getByName.fulfilled]: (state, action) => {
            state.loading = false
            state.pharmacies= action.payload.data.data
            state.message = action.payload.message
            state.status = action.payload.status
    },
    [getByName.rejected]: (state, action) => {
        if (state.loading === true) {
            state.loading= false
            state.error = action.payload.error
            state.message = action.payload.message
            state.status = action.payload.status
        }
    }
  }
})

export default pharmacySlice.reducer