
import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

const INITIAL_STATE = {
    notifications: [{
      title: 'Bienvenido a la App de Experta Seguros',
      date: moment().toISOString(),
      body: 'Ahora podes consultar todo sobre tu póliza, estés donde estés'
    }],
    unread: true
}
// Then, handle actions in your reducers:
const notificationSlice = createSlice({
  name: 'notification',
  initialState: INITIAL_STATE,
  reducers: {
    markAsRead: (state, action) => {
      state.unread = false
      /*state.notifications = state.notifications.map(notification => ({
        ...notification,
        unread: false
      }))*/
    },
    setNotification: (state, action) => {
      state.unread = true
      state.notifications = [...state.notifications, action.payload]
    },
    resetNotificationStore: (state) => ({  ...INITIAL_STATE })
  },
  extraReducers: {}
})

export const { 
  markAsRead,
  setNotification,
  resetNotificationStore
} = notificationSlice.actions
export default notificationSlice.reducer