import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_FETCH_CLIENTS = 'START_FETCH_CLIENTS'
export const FINISH_FETCH_CLIENTS = 'FINISH_FETCH_CLIENTS'
export const FETCH_CLIENTS = 'FETCH_CLIENTS'

export const START_CREATE_CLIENT = 'START_CREATE_CLIENT'
export const FINISH_CREATE_CLIENT = 'FINISH_CREATE_CLIENT'
export const CREATE_CLIENT = 'CREATE_CLIENT'

export const START_UPDATE_CLIENT = 'START_UPDATE_CLIENT'
export const FINISH_UPDATE_CLIENT = 'FINISH_UPDATE_CLIENT'
export const UPDATE_CLIENT = 'UPDATE_CLIENT'
export const UPDATE_MATERIAL_BY_CLIENT = 'UPDATE_MATERIAL_BY_CLIENT'

export const START_DELETE_CLIENT = 'START_DELETE_CLIENT'
export const FINISH_DELETE_CLIENT = 'FINISH_DELETE_CLIENT'
export const DELETE_CLIENT = 'DELETE_CLIENT'



export const fetchClients = () => async (dispatch) => {

    dispatch({ type: START_FETCH_CLIENTS })

    let url = `${host}api/v1/clients/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_CLIENTS,
                payload: {
                    clients: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_CLIENTS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: 'Upss! Ha ocurrido un error al cargar los clientes'
            })
        })
}


export const createClient = (client, toggle) => async (dispatch) => {

    dispatch({ type: START_CREATE_CLIENT })

    let url = `${host}api/v1/clients/create/`

    axios.post(url, client)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_CLIENT,
                payload: {
                    client: response.data.client
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Cliente creado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_CLIENT })
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: error.response.data.errors[0].msg
            })
        })
}



export const updateClient = (client, toggle) => async (dispatch) => {

    dispatch({ type: START_UPDATE_CLIENT })

    let url = `${host}api/v1/clients/update/${client.id}/`

    axios.put(url, client)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: UPDATE_CLIENT,
                payload: {
                    client: response.data.client
                }
            })
            
            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Cliente Actualizado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_UPDATE_CLIENT })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: error.response.data.errors[0].msg
            })
        })
}



export const deleteClient = (client) => async (dispatch) => {

    dispatch({ type: START_DELETE_CLIENT })

    let url = `${host}api/v1/clients/delete/${client.id}/`
    await axios.delete(url, client)
        .then(response => {
            dispatch({
                type: DELETE_CLIENT,
                payload: {
                    client: response.data.client,
                }
            })
            Toast.fire({ icon: 'success', title: 'Cliente Eliminado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_DELETE_CLIENT })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: 'Upps! Ha ocurrido un error al eliminar el cliente'
            })
        })
}