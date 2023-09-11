import { combineReducers } from 'redux'
import authReducer from './authReducer'
import userReducer from './userReducer'
import markReducer from './markReducer'
import typeReducer from './typeReducer'
import unitReducer from './unitReducer'
import materialReducer from './materialReducer'
import providerReducer from './providerReducer'
import compraReducer from './compraReducer'
import productReducer from './productReducer'
import clientReducer from './clientReducer'
import ventaReducer from './ventaReducer'
import reversionReducer from './reversionReducer'


const rootReducer = combineReducers({
    authReducer, userReducer, markReducer, typeReducer, unitReducer, materialReducer, providerReducer, compraReducer, productReducer, clientReducer, ventaReducer, reversionReducer
})

export default rootReducer