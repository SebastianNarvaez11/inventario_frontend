import {
    START_FETCH_PRODUCTS, FINISH_FETCH_PRODUCTS,
    FETCH_PRODUCTS, START_CREATE_PRODUCT,
    FINISH_CREATE_PRODUCT, CREATE_PRODUCT,
    START_UPDATE_PRODUCT, FINISH_UPDATE_PRODUCT,
    UPDATE_PRODUCT, START_DELETE_PRODUCT,
    FINISH_DELETE_PRODUCT, DELETE_PRODUCT,
    FILTER_PRODUCT, RESET_FILTER_PRODUCT
} from '../actions/productActions'

import { DEACTIVE_PRODUCT_VENTA, ACTIVE_PRODUCT_VENTA } from '../actions/ventaActions'

const initialState = {
    products: [],
    products_filter: [],
    isFetchingProducts: false,
    isCreatingProduct: false,
    isUpdatingProduct: false,
    isRemovingProduct: false
}

const productReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_PRODUCTS:
            return {
                ...state,
                isFetchingProducts: true
            }

        case FINISH_FETCH_PRODUCTS:
            return {
                ...state,
                isFetchingProducts: false
            }

        case FETCH_PRODUCTS:
            return {
                ...state,
                products: action.payload.products,
                products_filter: action.payload.products,
                isFetchingProducts: false
            }

        case START_CREATE_PRODUCT:
            return {
                ...state,
                isCreatingProduct: true
            }

        case FINISH_CREATE_PRODUCT:
            return {
                ...state,
                isCreatingProduct: false
            }

        case CREATE_PRODUCT:
            return {
                ...state,
                products: [action.payload.product, ...state.products],
                isCreatingProduct: false
            }

        case START_UPDATE_PRODUCT:
            return {
                ...state,
                isUpdatingProduct: true
            }

        case FINISH_UPDATE_PRODUCT:
            return {
                ...state,
                isUpdatingProduct: false
            }

        case UPDATE_PRODUCT:
            return {
                ...state,
                products: state.products.map(product => product.id === action.payload.product.id ? (product = action.payload.product) : product),
                isUpdatingProduct: false
            }

        case START_DELETE_PRODUCT:
            return {
                ...state,
                isRemovingProduct: true
            }

        case FINISH_DELETE_PRODUCT:
            return {
                ...state,
                isRemovingProduct: false
            }

        case DELETE_PRODUCT:
            return {
                ...state,
                products: state.products.filter(product => product.id !== action.payload.product.id),
                isRemovingProduct: false
            }

        case FILTER_PRODUCT:
            var text = action.payload.text
            const data = state.products
            const newData = data.filter(function (item) {
                const codigo = item.codigo.toUpperCase()
                const nombre = item.nombre.toUpperCase()
                const campo = codigo + " " + nombre
                const textData = text.toUpperCase()
                return campo.indexOf(textData) > -1
            })

            return {
                ...state,
                products_filter: newData,
            }

        case RESET_FILTER_PRODUCT:
            return {
                ...state,
                products_filter: state.products
            }


        case DEACTIVE_PRODUCT_VENTA:
            return {
                ...state,
                products: state.products.filter(product => product.id !== action.payload.item.producto.id),
            }

        case ACTIVE_PRODUCT_VENTA:
            return {
                ...state,
                products: [action.payload.item.producto, ...state.products],
                products_filter: [action.payload.item.producto, ...state.products]
            }

        default:
            return state
    }
}

export default productReducer