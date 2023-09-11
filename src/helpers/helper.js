import Axios from "axios";

export const TOKEN_KEY = "TOKEN_KEY";


export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function deleteToken(e) {
    e.preventDefault();
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload()
}

//Funcion que pasa el token en todas las solicitudes a la API
//Se tiene que llamar la funcion en el Componente mas superior (APP en este caso)
export function initAxiosInterceptors() {
    Axios.interceptors.request.use(config => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `${token}`;
        }

        return config;
    });

    Axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status === 401) {
                deleteToken();
                window.location.reload()
            } else {
                return Promise.reject(error);
            }
        }
    );
}