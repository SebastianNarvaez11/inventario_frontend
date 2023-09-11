import {
    START_FETCH_MATERIALES, FINISH_FETCH_MATERIALES,
    FETCH_MATERIALES, START_CREATE_MATERIAL,
    FINISH_CREATE_MATERIAL, CREATE_MATERIAL,
    START_UPDATE_MATERIAL, FINISH_UPDATE_MATERIAL,
    UPDATE_MATERIAL, START_DELETE_MATERIAL,
    FINISH_DELETE_MATERIAL, DELETE_MATERIAL,
    FILTER_MATERIAL, RESET_FILTER_MATERIAL
} from '../actions/materialActions'

import { UPDATE_MATERIAL_BY_MARK } from '../actions/markActions'
import { UPDATE_MATERIAL_BY_TYPE } from '../actions/typeActions'
import { UPDATE_MATERIAL_BY_UNIT } from '../actions/unitActions'
import { INCREASE_EXIST_MATERIALES, DECREMENT_EXIST_MATERIALES } from '../actions/compraActions'


const initialState = {
    materiales: [],
    materiales_filter: [],
    isFetchingMateriales: false,
    isCreatingMaterial: false,
    isUpdatingMaterial: false,
    isRemovingMaterial: false
}

const materialReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_MATERIALES:
            return {
                ...state,
                isFetchingMateriales: true
            }

        case FINISH_FETCH_MATERIALES:
            return {
                ...state,
                isFetchingMateriales: false
            }

        case FETCH_MATERIALES:
            return {
                ...state,
                materiales: action.payload.materiales,
                materiales_filter: action.payload.materiales,
                isFetchingMateriales: false
            }

        case START_CREATE_MATERIAL:
            return {
                ...state,
                isCreatingMaterial: true
            }

        case FINISH_CREATE_MATERIAL:
            return {
                ...state,
                isCreatingMaterial: false
            }

        case CREATE_MATERIAL:
            return {
                ...state,
                materiales: [action.payload.material, ...state.materiales],
                isCreatingMaterial: false
            }

        case START_UPDATE_MATERIAL:
            return {
                ...state,
                isUpdatingMaterial: true
            }

        case FINISH_UPDATE_MATERIAL:
            return {
                ...state,
                isUpdatingMaterial: false
            }

        case UPDATE_MATERIAL:
            return {
                ...state,
                materiales: state.materiales.map(material => material.id === action.payload.material.id ? (material = action.payload.material) : material),
                isUpdatingMaterial: false
            }

        case START_DELETE_MATERIAL:
            return {
                ...state,
                isRemovingMaterial: true
            }

        case FINISH_DELETE_MATERIAL:
            return {
                ...state,
                isRemovingMaterial: false
            }

        case DELETE_MATERIAL:
            return {
                ...state,
                materiales: state.materiales.filter(material => material.id !== action.payload.material.id),
                isRemovingMaterial: false
            }

        case UPDATE_MATERIAL_BY_MARK:
            return {
                ...state,
                materiales: state.materiales.map(material => material.marca.id === action.payload.mark.id ? (material = { ...material, marca: action.payload.mark }) : material),
            }

        case UPDATE_MATERIAL_BY_TYPE:
            return {
                ...state,
                materiales: state.materiales.map(material => material.categoria.id === action.payload.type.id ? (material = { ...material, categoria: action.payload.type }) : material),
            }

        case UPDATE_MATERIAL_BY_UNIT:
            return {
                ...state,
                materiales: state.materiales.map(material => material.unidad_medida.id === action.payload.unit.id ? (material = { ...material, unidad_medida: action.payload.unit }) : material),
            }

        case INCREASE_EXIST_MATERIALES:
            const materiales_update = state.materiales.map(material =>
                material.id === action.payload.item.material.id
                    ?
                    material = {
                        ...material,
                        existencia: material.existencia + action.payload.item.cantidad,
                        ultima_compra: action.payload.item.updated
                    }
                    :
                    material)

            return {
                ...state,
                materiales: materiales_update,
                materiales_filter: materiales_update
            }


        case DECREMENT_EXIST_MATERIALES:
            const materiales_up = state.materiales.map(material =>
                material.id === action.payload.item.material.id
                    ?
                    material = {
                        ...material,
                        existencia: material.existencia - action.payload.item.cantidad
                    }
                    :
                    material)

            return {
                ...state,
                materiales: materiales_up,
                materiales_filter: materiales_up
            }

        case FILTER_MATERIAL:
            var text = action.payload.text
            const data = state.materiales
            const newData = data.filter(function (item) {
                const codigo = item.codigo.toUpperCase()
                const nombre = item.nombre.toUpperCase()
                const campo = codigo + " " + nombre
                const textData = text.toUpperCase()
                return campo.indexOf(textData) > -1
            })

            return {
                ...state,
                materiales_filter: newData,
            }
        
        case RESET_FILTER_MATERIAL:
            return {
                ...state,
                materiales_filter: state.materiales
            }

        default:
            return state
    }
}

export default materialReducer