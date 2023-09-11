import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'
import { bindActionCreators } from 'redux'

export const START_FETCH_COMPRAS = 'START_FETCH_COMPRAS'
export const FINISH_FETCH_COMPRAS = 'FINISH_FETCH_COMPRAS'
export const FETCH_COMPRAS = 'FETCH_COMPRAS'

export const START_CREATE_COMPRA = 'START_CREATE_COMPRA'
export const FINISH_CREATE_COMPRA = 'FINISH_CREATE_COMPRA'
export const CREATE_COMPRA = 'CREATE_COMPRA'

export const START_UPDATE_COMPRA = 'START_UPDATE_COMPRA'
export const FINISH_UPDATE_COMPRA = 'FINISH_UPDATE_COMPRA'
export const UPDATE_COMPRA = 'UPDATE_COMPRA'

export const START_CANCEL_COMPRA = 'START_CANCEL_COMPRA'
export const FINISH_CANCEL_COMPRA = 'FINISH_CANCEL_COMPRA'
export const CANCEL_COMPRA = 'CANCEL_COMPRA'

export const INCREASE_EXIST_MATERIALES = 'INCREASE_EXIST_MATERIALES'
export const DECREMENT_EXIST_MATERIALES = 'DECREMENT_EXIST_MATERIALES'


export const fetchCompras = () => async (dispatch) => {

    dispatch({ type: START_FETCH_COMPRAS })

    let url = `${host}api/v1/compras/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_COMPRAS,
                payload: {
                    compras: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_COMPRAS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: 'Upss! Ha ocurrido un error al cargar las compras'
            })
        })
}


export const getCompra = (compra, setShowUpdate) => async (dispatch) => {
    let url = `${host}api/v1/compras/get/${compra.id}/`
    await axios.get(url)
        .then(response => {
            console.log(response.data)
            setShowUpdate({
                show: true,
                data: response.data.compra
            })
        })
        .catch(error => {
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al cargar la compra'
            })
        })
}


export const getCompraDelete = async (compra) => {
    let compra_full

    let url = `${host}api/v1/compras/get/${compra.id}/`
    await axios.get(url)
        .then(response => {
            compra_full = response.data.compra
        })
        .catch(error => {
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al cargar la compra'
            })
        })

    return compra_full
}



export const createCompra = (request, closeAndClean) => async (dispatch) => {

    dispatch({ type: START_CREATE_COMPRA })

    let url = `${host}api/v1/compras/create/`

    axios.post(url, request)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_COMPRA,
                payload: {
                    compra: response.data.compra
                }
            })

            response.data.compra.items.forEach(item => {
                dispatch({
                    type: INCREASE_EXIST_MATERIALES,
                    payload: {
                        item: item
                    }
                })
            })

            closeAndClean()
            Toast.fire({ icon: 'success', title: 'Compra Realizada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_COMPRA })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const cancelCompra = (compra) => async (dispatch) => {
    dispatch({ type: START_CANCEL_COMPRA })

    let url = `${host}api/v1/compras/cancel/${compra.id}/`
    await axios.put(url, compra)
        .then(response => {
            dispatch({
                type: CANCEL_COMPRA,
                payload: {
                    compra: compra,
                }
            })

            compra.items.forEach(item => {
                dispatch({
                    type: DECREMENT_EXIST_MATERIALES,
                    payload: {
                        item: item
                    }
                })
            })

            Toast.fire({ icon: 'success', title: 'Compra Anulada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CANCEL_COMPRA })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al eliminar la compra'
            })
        })
}