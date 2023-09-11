import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_FETCH_PROVIDERS = 'START_FETCH_PROVIDERS'
export const FINISH_FETCH_PROVIDERS = 'FINISH_FETCH_PROVIDERS'
export const FETCH_PROVIDERS = 'FETCH_PROVIDERS'

export const START_CREATE_PROVIDER = 'START_CREATE_PROVIDER'
export const FINISH_CREATE_PROVIDER = 'FINISH_CREATE_PROVIDER'
export const CREATE_PROVIDER = 'CREATE_PROVIDER'

export const START_UPDATE_PROVIDER = 'START_UPDATE_PROVIDER'
export const FINISH_UPDATE_PROVIDER = 'FINISH_UPDATE_PROVIDER'
export const UPDATE_PROVIDER = 'UPDATE_PROVIDER'

export const START_DELETE_PROVIDER = 'START_DELETE_PROVIDER'
export const FINISH_DELETE_PROVIDER = 'FINISH_DELETE_PROVIDER'
export const DELETE_PROVIDER = 'DELETE_PROVIDER'



export const fetchProviders = () => async (dispatch) => {

    dispatch({ type: START_FETCH_PROVIDERS })

    let url = `${host}api/v1/providers/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_PROVIDERS,
                payload: {
                    providers: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_PROVIDERS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upss! Ha ocurrido un error al cargar los proveedores'
            })
        })
}


export const createProvider = (provider, toggle) => async (dispatch) => {

    dispatch({ type: START_CREATE_PROVIDER })

    let url = `${host}api/v1/providers/create/`

    axios.post(url, provider)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_PROVIDER,
                payload: {
                    provider: response.data.provider
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Proveedor Creado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_PROVIDER })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const updateProvider = (provider, toggle) => async (dispatch) => {

    dispatch({ type: START_UPDATE_PROVIDER })

    let url = `${host}api/v1/providers/update/${provider.id}/`

    axios.put(url, provider)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: UPDATE_PROVIDER,
                payload: {
                    provider: response.data.provider
                }
            })

            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Proveedor Actualizado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_UPDATE_PROVIDER })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const deleteProvider = (provider) => async (dispatch) => {

    dispatch({ type: START_DELETE_PROVIDER })

    let url = `${host}api/v1/providers/delete/${provider.id}/`
    await axios.delete(url, provider)
        .then(response => {
            dispatch({
                type: DELETE_PROVIDER,
                payload: {
                    provider: response.data.provider,
                }
            })
            Toast.fire({ icon: 'success', title: 'Proveedor Eliminado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_DELETE_PROVIDER })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al eliminar el proveedor'
            })
        })
}