import {
    START_FETCH_VENTAS, FINISH_FETCH_VENTAS,
    FETCH_VENTAS, START_CREATE_VENTA,
    FINISH_CREATE_VENTA, CREATE_VENTA,
    START_DELETE_VENTA, 
    FINISH_DELETE_VENTA, DELETE_VENTA
} from '../actions/ventaActions'


const initialState = {
    ventas: [],
    isFetchingVentas: false,
    isCreatingVenta: false,
    isUpdatingVenta: false,
    isRemovingVenta: false
}

const ventaReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_VENTAS:
            return {
                ...state,
                isFetchingVentas: true
            }

        case FINISH_FETCH_VENTAS:
            return {
                ...state,
                isFetchingVentas: false
            }

        case FETCH_VENTAS:
            return {
                ...state,
                ventas: action.payload.ventas,
                isFetchingVentas: false
            }

        case START_CREATE_VENTA:
            return {
                ...state,
                isCreatingVenta: true
            }

        case FINISH_CREATE_VENTA:
            return {
                ...state,
                isCreatingVenta: false
            }

        case CREATE_VENTA:
            return {
                ...state,
                ventas: [action.payload.venta, ...state.ventas],
                isCreatingVenta: false
            }


        case START_DELETE_VENTA:
            return {
                ...state,
                isRemovingVenta: true
            }

        case FINISH_DELETE_VENTA:
            return {
                ...state,
                isRemovingVenta: false
            }

        case DELETE_VENTA:
            return {
                ...state,
                ventas: state.ventas.filter(venta => venta.id !== action.payload.venta.id),
                isRemovingVenta: false
            }

        default:
            return state
    }
}

export default ventaReducer