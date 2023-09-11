import axios from 'axios'
import { host } from '../../helpers/host'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'

export const START_FETCH_USERS = 'START_FETCH_USERS'
export const FINISH_FETCH_USERS = 'FINISH_FETCH_USERS'
export const FETCH_USERS = 'FETCH_USERS'

export const START_CREATE_USER = 'START_CREATE_USER'
export const FINISH_CREATE_USER = 'FINISH_CREATE_USER'
export const CREATE_USER = 'CREATE_USER'

export const START_UPDATE_USER = 'START_UPDATE_USER'
export const FINISH_UPDATE_USER = 'FINISH_UPDATE_USER'
export const UPDATE_USER = 'UPDATE_USER'

export const START_DELETE_USER = 'START_DELETE_USER'
export const FINISH_DELETE_USER = 'FINISH_DELETE_USER'
export const DELETE_USER = 'DELETE_USER'


export const fetchUsers = () => async (dispatch) => {

    dispatch({ type: START_FETCH_USERS })

    let url = `${host}api/v1/users/list`
    await axios.get(url)
        .then(response => {
            console.log(response)
            dispatch({
                type: FETCH_USERS,
                payload: {
                    users: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_USERS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upss! Ha ocurrido un error al cargar los usuarios'
            })
        })
}

export const createUser = (user, toggle) => async (dispatch) => {

    dispatch({ type: START_CREATE_USER })

    // let url = `${host}api/v1/auth/registration/`
    let url = `${host}api/v1/users/create/`

    axios.post(url, user)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: CREATE_USER,
                payload: {
                    user: response.data.user
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Usuario Creado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_USER })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}


export const updateUser = (user, toggle) => async (dispatch) => {

    dispatch({ type: START_UPDATE_USER })

    let url = `${host}api/v1/users/update/${user.id}/`

    axios.put(url, user)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: UPDATE_USER,
                payload: {
                    user: response.data.user
                }
            })
            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Usuario Actualizado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_UPDATE_USER })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: error.response.data.errors[0].msg
            })
        })
}


export const deleteUser = (user) => async (dispatch) => {

    dispatch({ type: START_DELETE_USER })

    let url = `${host}api/v1/users/delete/${user.id}/`
    await axios.delete(url, user)
        .then(response => {
            dispatch({
                type: DELETE_USER,
                payload: {
                    user: response.data.user,
                }
            })
            Toast.fire({ icon: 'success', title: 'Usuario Eliminado' })//alert success
        })
        .catch(error => {
            dispatch({ type: FINISH_DELETE_USER })
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                title: 'Upss!',
                text: 'Upps! Ha ocurrido un error al eliminar el usuario'
            })
        })
}
