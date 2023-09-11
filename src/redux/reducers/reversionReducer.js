import {
    START_FETCH_REVERSIONS, FINISH_FETCH_REVERSIONS,
    FETCH_REVERSIONS,
} from '../actions/reversionActions'


const initialState = {
    reversions: [],
    isFetchingReversions: false,
}

const reversionReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_REVERSIONS:
            return {
                ...state,
                isFetchingReversions: true
            }

        case FINISH_FETCH_REVERSIONS:
            return {
                ...state,
                isFetchingReversions: false
            }

        case FETCH_REVERSIONS:
            return {
                ...state,
                reversions: action.payload.reversions,
                isFetchingReversions: false
            }

    
        default:
            return state
    }
}

export default reversionReducer