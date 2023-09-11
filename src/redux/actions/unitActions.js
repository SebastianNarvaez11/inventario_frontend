import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_FETCH_UNITS = 'START_FETCH_UNITS'
export const FINISH_FETCH_UNITS = 'FINISH_FETCH_UNITS'
export const FETCH_UNITS = 'FETCH_UNITS'

export const START_CREATE_UNIT = 'START_CREATE_UNIT'
export const FINISH_CREATE_UNIT = 'FINISH_CREATE_UNIT'
export const CREATE_UNIT = 'CREATE_UNIT'

export const START_UPDATE_UNIT = 'START_UPDATE_UNIT'
export const FINISH_UPDATE_UNIT = 'FINISH_UPDATE_UNIT'
export const UPDATE_UNIT = 'UPDATE_UNIT'
export const UPDATE_MATERIAL_BY_UNIT = 'UPDATE_MATERIAL_BY_UNIT'

export const START_DELETE_UNIT = 'START_DELETE_UNIT'
export const FINISH_DELETE_UNIT = 'FINISH_DELETE_UNIT'
export const DELETE_UNIT = 'DELETE_UNIT'



export const fetchUnits = () => async (dispatch) => {

    dispatch({ type: START_FETCH_UNITS })

    let url = `${host}api/v1/units/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_UNITS,
                payload: {
                    units: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_UNITS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upss! Ha ocurrido un error al cargar las unidades de medida'
            })
        })
}


export const createUnit = (unit, toggle) => async (dispatch) => {

    dispatch({ type: START_CREATE_UNIT })

    let url = `${host}api/v1/units/create/`

    axios.post(url, unit)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_UNIT,
                payload: {
                    unit: response.data.unit
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Unidad Creada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_UNIT })
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: error.response.data.errors[0].msg
            })
        })
}



export const updateUnit = (unit, toggle) => async (dispatch) => {

    dispatch({ type: START_UPDATE_UNIT })

    let url = `${host}api/v1/units/update/${unit.id}/`

    axios.put(url, unit)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: UPDATE_UNIT,
                payload: {
                    unit: response.data.unit
                }
            })

            dispatch({
                type: UPDATE_MATERIAL_BY_UNIT,
                payload: {
                    unit: response.data.unit
                }
            })

            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Unidad Actualizada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_UPDATE_UNIT })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: error.response.data.errors[0].msg
            })
        })
}



export const deleteUnit = (unit) => async (dispatch) => {

    dispatch({ type: START_DELETE_UNIT })

    let url = `${host}api/v1/units/delete/${unit.id}/`
    await axios.delete(url, unit)
        .then(response => {
            dispatch({
                type: DELETE_UNIT,
                payload: {
                    unit: response.data.unit,
                }
            })
            Toast.fire({ icon: 'success', title: 'Unidad Eliminada' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_DELETE_UNIT })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al eliminar la unidad de medida'
            })
        })
}