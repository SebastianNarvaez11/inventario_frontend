import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_FETCH_REVERSIONS = 'START_FETCH_REVERSIONS'
export const FINISH_FETCH_REVERSIONS = 'FINISH_FETCH_REVERSIONS'
export const FETCH_REVERSIONS = 'FETCH_REVERSIONS'




export const fetchReversions = () => async (dispatch) => {

    dispatch({ type: START_FETCH_REVERSIONS })

    let url = `${host}api/v1/reversions/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_REVERSIONS,
                payload: {
                    reversions: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_REVERSIONS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Upss!',
                showConfirmButton: true,
                text: 'Upss! Ha ocurrido un error al cargar el historial de acciones'
            })
        })
}


