import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_FETCH_TYPES = 'START_FETCH_TYPES'
export const FINISH_FETCH_TYPES = 'FINISH_FETCH_TYPES'
export const FETCH_TYPES = 'FETCH_TYPES'

export const START_CREATE_TYPE = 'START_CREATE_TYPE'
export const FINISH_CREATE_TYPE = 'FINISH_CREATE_TYPE'
export const CREATE_TYPE = 'CREATE_TYPE'

export const START_UPDATE_TYPE = 'START_UPDATE_TYPE'
export const FINISH_UPDATE_TYPE = 'FINISH_UPDATE_TYPE'
export const UPDATE_TYPE = 'UPDATE_TYPE'
export const UPDATE_MATERIAL_BY_TYPE = 'UPDATE_MATERIAL_BY_TYPE'

export const START_DELETE_TYPE = 'START_DELETE_TYPE'
export const FINISH_DELETE_TYPE = 'FINISH_DELETE_TYPE'
export const DELETE_TYPE = 'DELETE_TYPE'



export const fetchTypes = () => async (dispatch) => {

    dispatch({ type: START_FETCH_TYPES })

    let url = `${host}api/v1/types/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_TYPES,
                payload: {
                    types: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_TYPES })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upss! Ha ocurrido un error al cargar las categorias'
            })
        })
}


export const createType = (type, toggle) => async (dispatch) => {

    dispatch({ type: START_CREATE_TYPE })

    let url = `${host}api/v1/types/create/`

    axios.post(url, type)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_TYPE,
                payload: {
                    type: response.data.type
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Categoria Creada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_TYPE })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const updateType = (type, toggle) => async (dispatch) => {

    dispatch({ type: START_UPDATE_TYPE })

    let url = `${host}api/v1/types/update/${type.id}/`

    axios.put(url, type)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: UPDATE_TYPE,
                payload: {
                    type: response.data.type
                }
            })

            dispatch({
                type: UPDATE_MATERIAL_BY_TYPE,
                payload: {
                    type: response.data.type
                }
            })

            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Categoria Actualizada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_UPDATE_TYPE })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const deleteType = (type) => async (dispatch) => {

    dispatch({ type: START_DELETE_TYPE })

    let url = `${host}api/v1/types/delete/${type.id}/`
    await axios.delete(url, type)
        .then(response => {
            dispatch({
                type: DELETE_TYPE,
                payload: {
                    type: response.data.type,
                }
            })
            Toast.fire({ icon: 'success', title: 'Categoria Eliminada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_DELETE_TYPE })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: 'Upps! Ha ocurrido un error al eliminar el tipo de material'
            })
        })
}