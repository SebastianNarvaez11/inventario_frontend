import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_FETCH_MARKS = 'START_FETCH_MARKS'
export const FINISH_FETCH_MARKS = 'FINISH_FETCH_MARKS'
export const FETCH_MARKS = 'FETCH_MARKS'

export const START_CREATE_MARK = 'START_CREATE_MARK'
export const FINISH_CREATE_MARK = 'FINISH_CREATE_MARK'
export const CREATE_MARK = 'CREATE_MARK'

export const START_UPDATE_MARK = 'START_UPDATE_MARK'
export const FINISH_UPDATE_MARK = 'FINISH_UPDATE_MARK'
export const UPDATE_MARK = 'UPDATE_MARK'
export const UPDATE_MATERIAL_BY_MARK = 'UPDATE_MATERIAL_BY_MARK'

export const START_DELETE_MARK = 'START_DELETE_MARK'
export const FINISH_DELETE_MARK = 'FINISH_DELETE_MARK'
export const DELETE_MARK = 'DELETE_MARK'



export const fetchMarks = () => async (dispatch) => {

    dispatch({ type: START_FETCH_MARKS })

    let url = `${host}api/v1/marks/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_MARKS,
                payload: {
                    marks: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_MARKS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upss! Ha ocurrido un error al cargar las marcas'
            })
        })
}


export const createMark = (mark, toggle) => async (dispatch) => {

    dispatch({ type: START_CREATE_MARK })

    let url = `${host}api/v1/marks/create/`

    axios.post(url, mark)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_MARK,
                payload: {
                    mark: response.data.mark
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Marca Creada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_MARK })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const updateMark = (mark, toggle) => async (dispatch) => {

    dispatch({ type: START_UPDATE_MARK })

    let url = `${host}api/v1/marks/update/${mark.id}/`

    axios.put(url, mark)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: UPDATE_MARK,
                payload: {
                    mark: response.data.mark
                }
            })

            dispatch({
                type: UPDATE_MATERIAL_BY_MARK,
                payload: {
                    mark: response.data.mark
                }
            })
            
            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Marca Actualizada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_UPDATE_MARK })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}



export const deleteMark = (mark) => async (dispatch) => {

    dispatch({ type: START_DELETE_MARK })

    let url = `${host}api/v1/marks/delete/${mark.id}/`
    await axios.delete(url, mark)
        .then(response => {
            dispatch({
                type: DELETE_MARK,
                payload: {
                    mark: response.data.mark,
                }
            })
            Toast.fire({ icon: 'success', title: 'Marca Eliminada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_DELETE_MARK })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: 'Upps! Ha ocurrido un error al eliminar la marca'
            })
        })
}