import  { persistReducer, persistStore } from 'redux-persist'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userAPI } from '../Features/users/usersAPI'
import storage from 'redux-persist/lib/storage'
import { loginAPI } from '../Features/login/loginAPI'
import userSlice from '../Features/login/userSlice'
import { bookingsAPI } from '../Features/booking/bookingsAPI'
import { customerSupportAPI } from '../Features/customerSupport/customerSupportAPI'
import { paymentsAPI } from '../Features/payments/paymentsAPI'
import { eventsAPI } from '../Features/events/eventsAPI'
import { venuesAPI } from '../Features/venues/venuesAPI'
import { mpesaAPI } from '../Features/mpesa/mpesaAPI'




const persistConfig = {
    key: 'root', //storage key for the persisted state
    version: 1, //version of the persisted state
    storage, // storage engine to use (localStorage in this case)
    whitelist: ['user'] // Only persist the user slice - this means only the user state will be saved in local storage
}

const rootReducer = combineReducers({ //combining all reducers into one root reducer
    [userAPI.reducerPath]: userAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
    [bookingsAPI.reducerPath]: bookingsAPI.reducer,
    [customerSupportAPI.reducerPath]: customerSupportAPI.reducer,
    [paymentsAPI.reducerPath]: paymentsAPI.reducer,
    [eventsAPI.reducerPath]: eventsAPI.reducer,
    [venuesAPI.reducerPath]: venuesAPI.reducer,
    [mpesaAPI.reducerPath]: mpesaAPI.reducer,
    user: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer) // wrap combined reducers with persistReducer to enable persistence in local storage 

export const store = configureStore({
   reducer: persistedReducer,

   //middleware
    //The reason we need to add the middleware is because the RTK Query APIs (usersAPI and loginAPI) use middleware to handle caching, invalidation, polling, and other features.
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false // disable serializable check for the persisted state - A serializable value is a value that can be converted to JSON and back without losing information. Its disabled here because the RTK Query APIs use non-serializable values (like functions) in their state.
   })
        .concat(userAPI.middleware) // add the usersAPI middleware to the store - helps with caching, invalidation, polling, and other features
        .concat(loginAPI.middleware) // add the loginAPI middleware
        .concat(bookingsAPI.middleware) 
        .concat(customerSupportAPI.middleware) 
        .concat(paymentsAPI.middleware) 
        .concat(eventsAPI.middleware) 
        .concat(venuesAPI.middleware)
        .concat(mpesaAPI.middleware) 
})

export const persistedStore = persistStore(store) // needed for persisting the store to local storage
export type RootState = ReturnType<typeof store.getState> // RootState is the type of the entire state tree in the store - TS support