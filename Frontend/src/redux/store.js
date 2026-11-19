import { combineReducers, configureStore } from "@reduxjs/toolkit"
import userSlice from './userSlice'
import productSlice from './productSlice'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'E-Commerce',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
    user: userSlice,
    product:productSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;