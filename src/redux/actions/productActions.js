import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

import { INCREASE_EXIST_MATERIALES, DECREMENT_EXIST_MATERIALES, } from './compraActions'
import { UPDATE_MATERIAL } from './materialActions'

export const START_FETCH_PRODUCTS = 'START_FETCH_PRODUCTS'
export const FINISH_FETCH_PRODUCTS = 'FINISH_FETCH_PRODUCTS'
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS'

export const START_CREATE_PRODUCT = 'START_CREATE_PRODUCT'
export const FINISH_CREATE_PRODUCT = 'FINISH_CREATE_PRODUCT'
export const CREATE_PRODUCT = 'CREATE_PRODUCT'

export const START_UPDATE_PRODUCT = 'START_UPDATE_PRODUCT'
export const FINISH_UPDATE_PRODUCT = 'FINISH_UPDATE_PRODUCT'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'

export const START_DELETE_PRODUCT = 'START_DELETE_PRODUCT'
export const FINISH_DELETE_PRODUCT = 'FINISH_DELETE_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'

export const FILTER_PRODUCT = 'FILTER_PRODUCT'
export const RESET_FILTER_PRODUCT = 'RESET_FILTER_PRODUCT'



export const fetchProducts = () => async (dispatch) => {

    dispatch({ type: START_FETCH_PRODUCTS })

    let url = `${host}api/v1/products/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_PRODUCTS,
                payload: {
                    products: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_PRODUCTS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upss! Ha ocurrido un error al cargar los productos'
            })
        })
}



export const getProduct = (product, setShowUpdate) => async (dispatch) => {
    let url = `${host}api/v1/products/get/${product.id}/`
    await axios.get(url)
        .then(response => {
            console.log(response.data)
            setShowUpdate({
                show: true,
                data: response.data.product
            })
        })
        .catch(error => {
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al cargar el producto'
            })
        })
}






export const createProduct = (request, closeAndClean) => async (dispatch) => {

    dispatch({ type: START_CREATE_PRODUCT })

    let url = `${host}api/v1/products/create/`

    axios.post(url, request)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_PRODUCT,
                payload: {
                    product: response.data.product
                }
            })

            response.data.product.items.map(item => {
                dispatch({
                    type: DECREMENT_EXIST_MATERIALES,
                    payload: {
                        item: item
                    }
                })
            })

            closeAndClean()
            Toast.fire({ icon: 'success', title: 'Producto Fabricado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_PRODUCT })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const updateProduct = (request, closeAndClean) => async (dispatch) => {

    dispatch({ type: START_UPDATE_PRODUCT })

    let url = `${host}api/v1/products/update/${request.producto.id}/`
    await axios.put(url, request)
        .then(response => {
            console.log(response)
            dispatch({
                type: UPDATE_PRODUCT,
                payload: {
                    product: response.data.product,
                }
            })

            response.data.materiales.map(material => {
                dispatch({
                    type: UPDATE_MATERIAL,
                    payload: {
                        material: material
                    }
                })
            })

            closeAndClean()
            Toast.fire({ icon: 'success', title: 'Producto Actualizado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_UPDATE_PRODUCT })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al actualizar el producto'
            })
        })
}



export const deleteProduct = (product) => async (dispatch) => {

    dispatch({ type: START_DELETE_PRODUCT })
    console.log(product)

    let url = `${host}api/v1/products/delete/${product.id}/`
    await axios.put(url)
        .then(response => {
            dispatch({
                type: DELETE_PRODUCT,
                payload: {
                    product: product,
                }
            })

            response.data.product.items.map(item => {
                dispatch({
                    type: INCREASE_EXIST_MATERIALES,
                    payload: {
                        item: item
                    }
                })
            })

            Toast.fire({ icon: 'success', title: 'Producto Eliminado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_DELETE_PRODUCT })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al eliminar el producto'
            })
        })
}


export const filterProduct = (text) => async (dispatch) => {
    dispatch({
        type: FILTER_PRODUCT,
        payload: {
            text: text
        }
    })
}

export const resetFilterProduct = () => async (dispatch) => {
    dispatch({type: RESET_FILTER_PRODUCT})
}
