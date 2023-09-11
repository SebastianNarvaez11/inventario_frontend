import {
    START_FETCH_USERS, FINISH_FETCH_USERS,
    FETCH_USERS, START_CREATE_USER,
    FINISH_CREATE_USER, CREATE_USER,
    START_UPDATE_USER, FINISH_UPDATE_USER,
    UPDATE_USER, START_DELETE_USER,
    FINISH_DELETE_USER, DELETE_USER
} from '../actions/userActions'


const initialState = {
    users: [],
    isFetchingUsers: false,
    isCreatingUser: false,
    isUpdatingUser: false,
    isRemovingUser: false
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_USERS:
            return {
                ...state,
                isFetchingUsers: true
            }

        case FINISH_FETCH_USERS:
            return {
                ...state,
                isFetchingUsers: false
            }

        case FETCH_USERS:
            return {
                ...state,
                users: action.payload.users,
                isFetchingUsers: false
            }

        case START_CREATE_USER:
            return {
                ...state,
                isCreatingUser: true
            }

        case FINISH_CREATE_USER:
            return {
                ...state,
                isCreatingUser: false
            }

        case CREATE_USER:
            return {
                ...state,
                users: [action.payload.user, ...state.users],
                isCreatingUser: false
            }

        case START_UPDATE_USER:
            return {
                ...state,
                isUpdatingUser: true
            }

        case FINISH_UPDATE_USER:
            return {
                ...state,
                isUpdatingUser: false
            }

        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => user.id === action.payload.user.id ? (user = action.payload.user) : user),
                isUpdatingUser: false
            }

        case START_DELETE_USER:
            return {
                ...state,
                isRemovingUser: true
            }

        case FINISH_DELETE_USER:
            return {
                ...state,
                isRemovingUser: false
            }

        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload.user.id),
                isRemovingUser: false
            }

        default:
            return state
    }
}

export default userReducer