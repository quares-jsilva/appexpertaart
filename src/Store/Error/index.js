
import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'
import crashlytics from '@react-native-firebase/crashlytics'

export const setErrorId = createAction('error/setErrorId', () => {
  const newDate = new Date().getTime()
  const id = Math.floor(Math.random() + 10000) + newDate
  crashlytics().setAttribute('errorId', `${id}`)
  return {
    payload: id
  }
})


// Then, handle actions in your reducers:
const errorSlice = createSlice({
  name: 'error',
  initialState: {
    errorId: null,
  },
  reducers: {
    setErrorId: (state, action) => {
        state.errorId = action.payload
    },
  },
  extraReducers: {
    'help/sendComments': (state, action) => {
      state.errorId = null
    },
  }
})

export default errorSlice.reducer