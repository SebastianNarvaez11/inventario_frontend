import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getToken } from '../helpers/helper'
import { getCurrentUser } from '../redux/actions/authActions'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import RouterAdmin from './RouterAdmin'
import HomePage from '../views/public/HomePage'
import Login from '../views/public/Login'
import Admin from "../views/admin" //Busca el index.js de esta carpeta para enlazar el restos de rutas

const Router = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        function chargeUser() {
            if (!getToken()) {
                return                                      //si no hay token, dejamos pasar para que la ruta lo mande al login
            }                                               //pero si hay token, actualizamos el usuario actual para evitar fraude en manipulacionde localstorage
            try {
                dispatch(getCurrentUser())
            } catch (e) {
                console.log(e)
            }
        }
        chargeUser()
        // eslint-disable-next-line
    }, [])

    return (
        <BrowserRouter>
            <Switch>
                <RouterAdmin path='/admin' roles={'1'} component={Admin} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/' component={HomePage} />
                {/* <RouterAssistant path='/assistant' roles={'2'} component={Assistant} />
                <RouterStudent path='/student' roles={'3'} component={Student} />
                <Route exact path='/403' component={Error_403} />
                <Route path='*' component={Error_404} /> */}
            </Switch>
        </BrowserRouter>
    )
}

export default Router
