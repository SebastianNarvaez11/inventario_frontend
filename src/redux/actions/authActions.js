import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_LOGIN = 'START_LOGIN'
export const FINISH_LOGIN = 'FINISH_LOGIN'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const GET_CURRENT_USER = 'GET_CURRENT_USER'



export const loginUser = (login) => async (dispath) => {

    dispath({ type: START_LOGIN })

    let url = `${host}api/v1/auth/login/`
    await axios.post(url, { username: login.username, password: login.password })
        .then(response => {
            console.log(response)
            dispath({
                type: LOGIN,
                payload: {
                    token: response.data.key,
                    user: response.data.user
                }
            })
            Toast.fire({ icon: 'success', title: `Bienvenido ${response.data.user.first_name}` })//alert success
        })
        .catch(error => {
            console.log(error.response.data)
            dispath({ type: FINISH_LOGIN })
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: error.response.data.errors[0].msg
            })
        })
}


export const logoutUser = () => async (dispatch) => {

    // let url = `${host}api/v1/auth/logout/`
    // await axios.post(url)
    dispatch({
        type: LOGOUT
    })
}


export const getCurrentUser = () => async (dispatch) => {

    let url = `${host}api/v1/users/current/`
    await axios.get(url)
        .then(response => {
            console.log(response)
            dispatch({
                type: GET_CURRENT_USER,
                payload: {
                    user: response.data
                }
            })
        })
        .catch(error => {
            console.log(error)
            localStorage.removeItem('TOKEN_KEY');
            localStorage.removeItem('CURRENT_USER');
            window.location.reload()
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: error.response.data.errors[0].msg
            })
        })
}