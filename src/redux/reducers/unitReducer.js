import {
    START_FETCH_UNITS, FINISH_FETCH_UNITS,
    FETCH_UNITS, START_CREATE_UNIT,
    FINISH_CREATE_UNIT, CREATE_UNIT,
    START_UPDATE_UNIT, FINISH_UPDATE_UNIT,
    UPDATE_UNIT, START_DELETE_UNIT, 
    FINISH_DELETE_UNIT, DELETE_UNIT
} from '../actions/unitActions'


const initialState = {
    units: [],
    isFetchingUnits: false,
    isCreatingUnit: false,
    isUpdatingUnit: false,
    isRemovingUnit: false
}

const unitReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_UNITS:
            return {
                ...state,
                isFetchingUnits: true
            }

        case FINISH_FETCH_UNITS:
            return {
                ...state,
                isFetchingUnits: false
            }

        case FETCH_UNITS:
            return {
                ...state,
                units: action.payload.units,
                isFetchingUnits: false
            }

        case START_CREATE_UNIT:
            return {
                ...state,
                isCreatingUnit: true
            }

        case FINISH_CREATE_UNIT:
            return {
                ...state,
                isCreatingUnit: false
            }

        case CREATE_UNIT:
            return {
                ...state,
                units: [action.payload.unit, ...state.units],
                isCreatingUnit: false
            }

        case START_UPDATE_UNIT:
            return {
                ...state,
                isUpdatingUnit: true
            }

        case FINISH_UPDATE_UNIT:
            return {
                ...state,
                isUpdatingUnit: false
            }

        case UPDATE_UNIT:
            return {
                ...state,
                units: state.units.map(unit => unit.id === action.payload.unit.id ? (unit = action.payload.unit) : unit),
                isUpdatingUnit: false
            }

        case START_DELETE_UNIT:
            return {
                ...state,
                isRemovingUnit: true
            }

        case FINISH_DELETE_UNIT:
            return {
                ...state,
                isRemovingUnit: false
            }

        case DELETE_UNIT:
            return {
                ...state,
                units: state.units.filter(unit => unit.id !== action.payload.unit.id),
                isRemovingUnit: false
            }

        default:
            return state
    }
}

export default unitReducer