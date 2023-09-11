import {
    START_FETCH_PROVIDERS, FINISH_FETCH_PROVIDERS,
    FETCH_PROVIDERS, START_CREATE_PROVIDER,
    FINISH_CREATE_PROVIDER, CREATE_PROVIDER,
    START_UPDATE_PROVIDER, FINISH_UPDATE_PROVIDER,
    UPDATE_PROVIDER, START_DELETE_PROVIDER, 
    FINISH_DELETE_PROVIDER, DELETE_PROVIDER
} from '../actions/providerActions'


const initialState = {
    providers: [],
    isFetchingProviders: false,
    isCreatingProvider: false,
    isUpdatingProvider: false,
    isRemovingProvider: false
}

const providerReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_PROVIDERS:
            return {
                ...state,
                isFetchingProviders: true
            }

        case FINISH_FETCH_PROVIDERS:
            return {
                ...state,
                isFetchingProviders: false
            }

        case FETCH_PROVIDERS:
            return {
                ...state,
                providers: action.payload.providers,
                isFetchingProviders: false
            }

        case START_CREATE_PROVIDER:
            return {
                ...state,
                isCreatingProvider: true
            }

        case FINISH_CREATE_PROVIDER:
            return {
                ...state,
                isCreatingProvider: false
            }

        case CREATE_PROVIDER:
            return {
                ...state,
                providers: [action.payload.provider, ...state.providers],
                isCreatingProvider: false
            }

        case START_UPDATE_PROVIDER:
            return {
                ...state,
                isUpdatingProvider: true
            }

        case FINISH_UPDATE_PROVIDER:
            return {
                ...state,
                isUpdatingProvider: false
            }

        case UPDATE_PROVIDER:
            return {
                ...state,
                providers: state.providers.map(provider => provider.id === action.payload.provider.id ? (provider = action.payload.provider) : provider),
                isUpdatingProvider: false
            }

        case START_DELETE_PROVIDER:
            return {
                ...state,
                isRemovingProvider: true
            }

        case FINISH_DELETE_PROVIDER:
            return {
                ...state,
                isRemovingProvider: false
            }

        case DELETE_PROVIDER:
            return {
                ...state,
                providers: state.providers.filter(provider => provider.id !== action.payload.provider.id),
                isRemovingProvider: false
            }

        default:
            return state
    }
}

export default providerReducer