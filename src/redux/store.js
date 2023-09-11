import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'
import { LOGIN, LOGOUT } from './actions/authActions'


const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;


const customMiddleware = store => next => action => {
    switch (action.type) {
        case LOGIN:
            // PERSISTENCIA DEL TOKEN Y EL USUARIO
            localStorage.setItem('TOKEN_KEY', action.payload.token);
            localStorage.setItem('CURRENT_USER', JSON.stringify(action.payload.user));
            return next(action);

        case LOGOUT:
            // SE REMUEVE LA PERSITENCIA
            localStorage.removeItem('TOKEN_KEY');
            localStorage.removeItem('CURRENT_USER');
            return next(action);


        default:
            next(action);
    }
}


const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, customMiddleware)))

export default store