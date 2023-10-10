import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers } from 'redux'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'

import startup from './Startup'
import authReducer, { logout } from './User/auth'
import userReducer, { resetUserStore } from './User/user'
import registration from './User/registration'
import theme from './Theme'
import contract, { resetContractStore } from './Contract'
import claim from './Claim'
import pharmacy from './Pharmacy'
import password from './User/password'
import help from './Help'
import notificationReducer, { resetNotificationStore } from './Notification'
import card from './Card'
import turn from './Turn'
import error from './Error'
import personalData from './User/personalData'
import network from './User/network'

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['credentials', 'pushId'], timeout: null
}

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  whitelist: ['data', 'pwid'], timeout: null
}

const notificationPersistConfig = {
  key: 'notification',
  storage: AsyncStorage,
  whitelist: ['notifications', 'unread'], timeout: null
}


const reducers = combineReducers({
  startup,
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
  registration,
  contract,
  claim,
  pharmacy,
  password,
  help,
  notification: persistReducer(notificationPersistConfig, notificationReducer),
  card,
  turn,
  error,
  personalData,
  network,
  theme,
})

const logoutMiddleware = store => next => action => {
  if (action.type === 'RESET_STORE') {
    store.dispatch(logout());
    store.dispatch(resetUserStore());
    store.dispatch(resetNotificationStore());
  } else {
    next(action);
  }
};

/*
const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, reducers)
*/
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })

    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default
      middlewares.push(createDebugger())
    }

    middlewares.push(logoutMiddleware);

    return middlewares
  },
})

const persistor = persistStore(store)

export { store, persistor }
