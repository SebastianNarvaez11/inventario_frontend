import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_FETCH_VENTAS = 'START_FETCH_VENTAS'
export const FINISH_FETCH_VENTAS = 'FINISH_FETCH_VENTAS'
export const FETCH_VENTAS = 'FETCH_VENTAS'

export const START_CREATE_VENTA = 'START_CREATE_VENTA'
export const FINISH_CREATE_VENTA = 'FINISH_CREATE_VENTA'
export const CREATE_VENTA = 'CREATE_VENTA'

export const START_UPDATE_VENTA = 'START_UPDATE_VENTA'
export const FINISH_UPDATE_VENTA = 'FINISH_UPDATE_VENTA'
export const UPDATE_VENTA = 'UPDATE_VENTA'

export const START_DELETE_VENTA = 'START_DELETE_VENTA'
export const FINISH_DELETE_VENTA = 'FINISH_DELETE_VENTA'
export const DELETE_VENTA = 'DELETE_VENTA'

export const DEACTIVE_PRODUCT_VENTA = 'DEACTIVE_PRODUCT_VENTA'
export const ACTIVE_PRODUCT_VENTA = 'ACTIVE_PRODUCT_VENTA'



export const fetchVentas = () => async (dispatch) => {

    dispatch({ type: START_FETCH_VENTAS })

    let url = `${host}api/v1/ventas/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_VENTAS,
                payload: {
                    ventas: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_VENTAS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upss! Ha ocurrido un error al cargar las ventas'
            })
        })
}


export const getVenta = (venta, setShowUpdate) => async (dispatch) => {
    let url = `${host}api/v1/sales/ventas/get/${venta.id}/`
    await axios.get(url)
        .then(response => {
            console.log(response.data)
            setShowUpdate({
                show: true,
                data: response.data
            })
        })
        .catch(error => {
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al cargar la venta'
            })
        })
}



export const createVenta = (request, closeAndClean) => async (dispatch) => {

    dispatch({ type: START_CREATE_VENTA })

    let url = `${host}api/v1/ventas/create/`

    axios.post(url, request)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_VENTA,
                payload: {
                    venta: response.data.venta
                }
            })

            response.data.venta.items.map(item => {
                dispatch({
                    type: DEACTIVE_PRODUCT_VENTA,
                    payload: {
                        item: item
                    }
                })
            })

            closeAndClean()
            Toast.fire({ icon: 'success', title: 'Venta Realizada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_VENTA })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const deleteVenta = (venta) => async (dispatch) => {

    dispatch({ type: START_DELETE_VENTA })

    let url = `${host}api/v1/ventas/delete/${venta.id}/`
    await axios.put(url, venta)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: DELETE_VENTA,
                payload: {
                    venta: response.data.venta,
                }
            })

            response.data.venta.items.map(item => {
                dispatch({
                    type: ACTIVE_PRODUCT_VENTA,
                    payload: {
                        item: item
                    }
                })
            })

            Toast.fire({ icon: 'success', title: 'Venta Anulada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_DELETE_VENTA })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: 'Upps! Ha ocurrido un error al eliminar la venta'
            })
        })
}