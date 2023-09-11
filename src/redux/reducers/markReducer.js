import {
    START_FETCH_MARKS, FINISH_FETCH_MARKS,
    FETCH_MARKS, START_CREATE_MARK,
    FINISH_CREATE_MARK, CREATE_MARK,
    START_UPDATE_MARK, FINISH_UPDATE_MARK,
    UPDATE_MARK, START_DELETE_MARK, 
    FINISH_DELETE_MARK, DELETE_MARK
} from '../actions/markActions'


const initialState = {
    marks: [],
    isFetchingMarks: false,
    isCreatingMark: false,
    isUpdatingMark: false,
    isRemovingMark: false
}

const markReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_MARKS:
            return {
                ...state,
                isFetchingMarks: true
            }

        case FINISH_FETCH_MARKS:
            return {
                ...state,
                isFetchingMarks: false
            }

        case FETCH_MARKS:
            return {
                ...state,
                marks: action.payload.marks,
                isFetchingMarks: false
            }

        case START_CREATE_MARK:
            return {
                ...state,
                isCreatingMark: true
            }

        case FINISH_CREATE_MARK:
            return {
                ...state,
                isCreatingMark: false
            }

        case CREATE_MARK:
            return {
                ...state,
                marks: [action.payload.mark, ...state.marks],
                isCreatingMark: false
            }

        case START_UPDATE_MARK:
            return {
                ...state,
                isUpdatingMark: true
            }

        case FINISH_UPDATE_MARK:
            return {
                ...state,
                isUpdatingMark: false
            }

        case UPDATE_MARK:
            return {
                ...state,
                marks: state.marks.map(mark => mark.id === action.payload.mark.id ? (mark = action.payload.mark) : mark),
                isUpdatingMark: false
            }

        case START_DELETE_MARK:
            return {
                ...state,
                isRemovingMark: true
            }

        case FINISH_DELETE_MARK:
            return {
                ...state,
                isRemovingMark: false
            }

        case DELETE_MARK:
            return {
                ...state,
                marks: state.marks.filter(mark => mark.id !== action.payload.mark.id),
                isRemovingMark: false
            }

        default:
            return state
    }
}

export default markReducer