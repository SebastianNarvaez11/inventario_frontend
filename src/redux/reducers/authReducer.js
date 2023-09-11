import { LOGIN, LOGOUT, GET_CURRENT_USER, START_LOGIN, FINISH_LOGIN } from '../actions/authActions'
import { getToken } from '../../helpers/helper'

const initialState = {
    startLogin: false,
    isLoggedIn: !getToken() ? false : true,
    token: localStorage.getItem('TOKEN_KEY'),
    current_user: JSON.parse(localStorage.getItem('CURRENT_USER')),
}


const authReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_LOGIN:
            return {
                startLogin: true
            }

        case FINISH_LOGIN:
            return {
                startLogin: false
            }

        case LOGIN:
            return {
                isLoggedIn: true,
                token: localStorage.getItem('TOKEN_KEY'),
                current_user: action.payload.user,
                startLogin: false
            }

        case LOGOUT:
            return {
                isLoggedIn: false,
                token: null,
                current_user: {},
            }

        case GET_CURRENT_USER:
            return {
                ...state,
                current_user: action.payload.user,
                isLoggedIn: true,
            }

        default:
            return state
    }
}

export default authReducer