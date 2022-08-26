import { legacy_createStore as createStore, combineReducers } from 'redux'
import { collapsedReducer } from './reducers/collapsedReducer'
import { loadingReducer } from './reducers/loadingReducer'
import { userReducer } from './reducers/userReducer'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const reducers = combineReducers({
  collapsedReducer,
  loadingReducer,
  userReducer
})

// 持久化 redux 数据
const persistConfig = {
  key: 'redux',
  storage,
  blacklist: ['loadingReducer']
}
const persistedReducer = persistReducer(persistConfig, reducers)
const store = createStore(persistedReducer)
const persistor = persistStore(store)

export {
  store,
  persistor
}