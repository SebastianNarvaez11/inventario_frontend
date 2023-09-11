import {
    START_FETCH_COMPRAS, FINISH_FETCH_COMPRAS,
    FETCH_COMPRAS, START_CREATE_COMPRA,
    FINISH_CREATE_COMPRA, CREATE_COMPRA,
    START_CANCEL_COMPRA, 
    FINISH_CANCEL_COMPRA, CANCEL_COMPRA
} from '../actions/compraActions'


const initialState = {
    compras: [],
    isFetchingCompras: false,
    isCreatingCompra: false,
    isUpdatingCompra: false,
    isRemovingCompra: false
}

const compraReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_COMPRAS:
            return {
                ...state,
                isFetchingCompras: true
            }

        case FINISH_FETCH_COMPRAS:
            return {
                ...state,
                isFetchingCompras: false
            }

        case FETCH_COMPRAS:
            return {
                ...state,
                compras: action.payload.compras,
                isFetchingCompras: false
            }

        case START_CREATE_COMPRA:
            return {
                ...state,
                isCreatingCompra: true
            }

        case FINISH_CREATE_COMPRA:
            return {
                ...state,
                isCreatingCompra: false
            }

        case CREATE_COMPRA:
            return {
                ...state,
                compras: [action.payload.compra, ...state.compras],
                isCreatingCompra: false
            }


        case START_CANCEL_COMPRA:
            return {
                ...state,
                isRemovingCompra: true
            }

        case FINISH_CANCEL_COMPRA:
            return {
                ...state,
                isRemovingCompra: false
            }

        case CANCEL_COMPRA:
            return {
                ...state,
                compras: state.compras.filter(compra => compra.id !== action.payload.compra.id),
                isRemovingCompra: false
            }

        default:
            return state
    }
}

export default compraReducer