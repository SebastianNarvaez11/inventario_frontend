import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_FETCH_MATERIALES = 'START_FETCH_MATERIALES'
export const FINISH_FETCH_MATERIALES = 'FINISH_FETCH_MATERIALES'
export const FETCH_MATERIALES = 'FETCH_MATERIALES'

export const START_CREATE_MATERIAL = 'START_CREATE_MATERIAL'
export const FINISH_CREATE_MATERIAL = 'FINISH_CREATE_MATERIAL'
export const CREATE_MATERIAL = 'CREATE_MATERIAL'

export const START_UPDATE_MATERIAL = 'START_UPDATE_MATERIAL'
export const FINISH_UPDATE_MATERIAL = 'FINISH_UPDATE_MATERIAL'
export const UPDATE_MATERIAL = 'UPDATE_MATERIAL'

export const START_DELETE_MATERIAL = 'START_DELETE_MATERIAL'
export const FINISH_DELETE_MATERIAL = 'FINISH_DELETE_MATERIAL'
export const DELETE_MATERIAL = 'DELETE_MATERIAL'

export const FILTER_MATERIAL = 'FILTER_MATERIAL'
export const RESET_FILTER_MATERIAL = 'RESET_FILTER_MATERIAL'



export const fetchMateriales = () => async (dispatch) => {

    dispatch({ type: START_FETCH_MATERIALES })
    let url = `${host}api/v1/materials/list/`

    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_MATERIALES,
                payload: {
                    materiales: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_MATERIALES })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upss! Ha ocurrido un error al cargar los materiales'
            })
        })
}


export const createMaterial = (material, toggle) => async (dispatch) => {

    dispatch({ type: START_CREATE_MATERIAL })
    let url = `${host}api/v1/materials/create/`

    axios.post(url, material)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_MATERIAL,
                payload: {
                    material: response.data.material
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Material Creado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_MATERIAL })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const updateMaterial = (id, material, toggle) => async (dispatch) => {

    dispatch({ type: START_UPDATE_MATERIAL })

    let url = `${host}api/v1/materials/update/${id}/`

    axios.put(url, material)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: UPDATE_MATERIAL,
                payload: {
                    material: response.data.material
                }
            })
            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Material Actualizado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_UPDATE_MATERIAL })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const deleteMaterial = (material) => async (dispatch) => {

    dispatch({ type: START_DELETE_MATERIAL })

    let url = `${host}api/v1/materials/delete/${material.id}/`
    await axios.delete(url)
        .then(response => {
            dispatch({
                type: DELETE_MATERIAL,
                payload: {
                    material: response.data.material,
                }
            })
            Toast.fire({ icon: 'success', title: 'Material Eliminado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_DELETE_MATERIAL })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al eliminar el material'
            })
        })
}


export const filterMaterial = (text) => async (dispatch) => {
    dispatch({
        type: FILTER_MATERIAL,
        payload: {
            text: text
        }
    })
}

export const resetFilterMaterial = () => async (dispatch) => {
    dispatch({type: RESET_FILTER_MATERIAL})
}
