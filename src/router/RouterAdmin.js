import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom';



const RouterAdmin = ({ component: Component, roles, ...rest }) => {

    const { isLoggedIn, current_user } = useSelector(state => state.authReducer)

    return (
        < Route {...rest} render={props => {

            //si no esta logueado no pasa
            if (!isLoggedIn ) {
                return <Redirect to='/login' />
            }

            // valida que el usuario tenga los permisos
            if (roles && roles.indexOf(String(current_user.type)) === -1) {
                return <Redirect to='/403' />
            }


            return <Component {...props} />
        }} />
    )
}


export default RouterAdmin
