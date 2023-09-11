import {
    START_FETCH_TYPES, FINISH_FETCH_TYPES,
    FETCH_TYPES, START_CREATE_TYPE,
    FINISH_CREATE_TYPE, CREATE_TYPE,
    START_UPDATE_TYPE, FINISH_UPDATE_TYPE,
    UPDATE_TYPE, START_DELETE_TYPE, 
    FINISH_DELETE_TYPE, DELETE_TYPE
} from '../actions/typeActions'


const initialState = {
    types: [],
    isFetchingTypes: false,
    isCreatingType: false,
    isUpdatingType: false,
    isRemovingType: false
}

const typeReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_TYPES:
            return {
                ...state,
                isFetchingTypes: true
            }

        case FINISH_FETCH_TYPES:
            return {
                ...state,
                isFetchingTypes: false
            }

        case FETCH_TYPES:
            return {
                ...state,
                types: action.payload.types,
                isFetchingTypes: false
            }

        case START_CREATE_TYPE:
            return {
                ...state,
                isCreatingType: true
            }

        case FINISH_CREATE_TYPE:
            return {
                ...state,
                isCreatingType: false
            }

        case CREATE_TYPE:
            return {
                ...state,
                types: [action.payload.type, ...state.types],
                isCreatingType: false
            }

        case START_UPDATE_TYPE:
            return {
                ...state,
                isUpdatingType: true
            }

        case FINISH_UPDATE_TYPE:
            return {
                ...state,
                isUpdatingType: false
            }

        case UPDATE_TYPE:
            return {
                ...state,
                types: state.types.map(type => type.id === action.payload.type.id ? (type = action.payload.type) : type),
                isUpdatingType: false
            }

        case START_DELETE_TYPE:
            return {
                ...state,
                isRemovingType: true
            }

        case FINISH_DELETE_TYPE:
            return {
                ...state,
                isRemovingType: false
            }

        case DELETE_TYPE:
            return {
                ...state,
                types: state.types.filter(type => type.id !== action.payload.type.id),
                isRemovingType: false
            }

        default:
            return state
    }
}

export default typeReducer