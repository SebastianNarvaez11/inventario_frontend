import {
    START_FETCH_CLIENTS, FINISH_FETCH_CLIENTS,
    FETCH_CLIENTS, START_CREATE_CLIENT,
    FINISH_CREATE_CLIENT, CREATE_CLIENT,
    START_UPDATE_CLIENT, FINISH_UPDATE_CLIENT,
    UPDATE_CLIENT, START_DELETE_CLIENT, 
    FINISH_DELETE_CLIENT, DELETE_CLIENT
} from '../actions/clientActions'


const initialState = {
    clients: [],
    isFetchingClients: false,
    isCreatingClient: false,
    isUpdatingClient: false,
    isRemovingClient: false
}

const clientReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_CLIENTS:
            return {
                ...state,
                isFetchingClients: true
            }

        case FINISH_FETCH_CLIENTS:
            return {
                ...state,
                isFetchingClients: false
            }

        case FETCH_CLIENTS:
            return {
                ...state,
                clients: action.payload.clients,
                isFetchingClients: false
            }

        case START_CREATE_CLIENT:
            return {
                ...state,
                isCreatingClient: true
            }

        case FINISH_CREATE_CLIENT:
            return {
                ...state,
                isCreatingClient: false
            }

        case CREATE_CLIENT:
            return {
                ...state,
                clients: [action.payload.client, ...state.clients],
                isCreatingClient: false
            }

        case START_UPDATE_CLIENT:
            return {
                ...state,
                isUpdatingClient: true
            }

        case FINISH_UPDATE_CLIENT:
            return {
                ...state,
                isUpdatingClient: false
            }

        case UPDATE_CLIENT:
            return {
                ...state,
                clients: state.clients.map(client => client.id === action.payload.client.id ? (client = action.payload.client) : client),
                isUpdatingClient: false
            }

        case START_DELETE_CLIENT:
            return {
                ...state,
                isRemovingClient: true
            }

        case FINISH_DELETE_CLIENT:
            return {
                ...state,
                isRemovingClient: false
            }

        case DELETE_CLIENT:
            return {
                ...state,
                clients: state.clients.filter(client => client.id !== action.payload.client.id),
                isRemovingClient: false
            }

        default:
            return state
    }
}

export default clientReducer