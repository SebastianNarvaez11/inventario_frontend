import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Home from './Home'
import Users from './Users'
import Extras from './Extras'
import Materiales from './Materiales'
import Manufacturing from './Manufacturing'
import Providers from './Providers'
import Compras from './Compras'
import Ventas from './Ventas'
import Clients from './Clients'
import Reversions from './Reversions'
import AdminSidebar from '../../components/sidebars/AdminSidebar'
import NavbarAdmin from "../../components/navbars/NavbarAdmin";
import { fetchMarks } from '../../redux/actions/markActions'
import { fetchTypes } from '../../redux/actions/typeActions'
import { fetchUnits } from '../../redux/actions/unitActions'


const RouterIndex = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMarks())
        dispatch(fetchTypes())
        dispatch(fetchUnits())
    }, [dispatch])

    return (
        <div style={{ minHeight: '100vh' }} className="d-flex" id="wrapper">
            <AdminSidebar />
            <div id="page-content-wrapper">
                <NavbarAdmin />
                <Switch >
                    <Route exact path={match.path} component={Home} />
                    <Route exact path={`${match.path}/users`} component={Users} />
                    <Route exact path={`${match.path}/inventario`} component={Materiales} />
                    <Route exact path={`${match.path}/fabricacion`} component={Manufacturing} />
                    <Route exact path={`${match.path}/compras`} component={Compras} />
                    <Route exact path={`${match.path}/proveedores`} component={Providers} />
                    <Route exact path={`${match.path}/clientes`} component={Clients} />
                    <Route exact path={`${match.path}/ventas`} component={Ventas} />
                    <Route exact path={`${match.path}/extras`} component={Extras} />
                    <Route exact path={`${match.path}/historial`} component={Reversions} />
                </Switch>
            </div>
        </div>
    );
};

export default RouterIndex;