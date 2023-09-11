import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { Collapse, UncontrolledTooltip, Label } from 'reactstrap'
import logo from '../../assets/img/logo.png';
import logoSF from '../../assets/img/saffiro-text.png';


const Sidebar = (props) => {

    const [isOpen, setIsOpen] = useState(false);

    const { current_user } = useSelector(state => state.authReducer)


    return (
        <div className='sidebar fixed-left'>
            <div className="sidebar-heading text-center" style={{ marginBottom: 30 }}>
                <Link to='/'>
                    <img
                        className='pro-img mt-2 mb-5'
                        alt="logo colegio"
                        src={logo}
                    />
                </Link>
            </div>
            <ul className="list-group list-group-flush">

                <dt>
                    <NavLink exact to='/admin/inventario' activeClassName='navActive' className="list-group-item list-group-item-action  d-flex justify-content-center mt-5"
                        style={{ backgroundColor: 'transparent', border: 0 }}>
                        <div className={props.location.pathname === '/admin/inventario' ? "pro-icon-active d-flex flex-column text-center animate__animated animate__pulse" : "d-flex flex-column text-center"}>
                            <i className={props.location.pathname === '/admin/inventario' ? "fas fa-dolly fa-2x icon-active" : "fas fa-dolly fa-2x icon-deactive"}></i>
                            <Label className={props.location.pathname === '/admin/inventario' ? "icon-active" : "icon-deactive"}>Inventario</Label>
                        </div>
                    </NavLink>
                </dt>


                <dt>
                    <NavLink exact to='/admin/fabricacion' activeClassName='navActive' className="list-group-item list-group-item-action  d-flex justify-content-center mt-5"
                        style={{ backgroundColor: 'transparent', border: 0 }}>
                        <div className={props.location.pathname === '/admin/fabricacion' ? "pro-icon-active d-flex flex-column text-center animate__animated animate__pulse" : "d-flex flex-column text-center"}>
                            <i className={props.location.pathname === '/admin/fabricacion' ? "fas fa-cogs fa-2x icon-active" : "fas fa-cogs fa-2x icon-deactive"}></i>
                            <Label className={props.location.pathname === '/admin/fabricacion' ? "icon-active" : "icon-deactive"}>Fabricación</Label>
                        </div>
                    </NavLink>
                </dt>


                <dt>
                    <NavLink exact to='/admin/compras' activeClassName='navActive' className="list-group-item list-group-item-action  d-flex justify-content-center mt-5"
                        style={{ backgroundColor: 'transparent', border: 0 }}>
                        <div className={props.location.pathname === '/admin/compras' ? "pro-icon-active d-flex flex-column text-center animate__animated animate__pulse" : "d-flex flex-column text-center"}>
                            <i className={props.location.pathname === '/admin/compras' ? "fas fa-shopping-cart fa-2x icon-active" : "fas fa-shopping-cart fa-2x icon-deactive"}></i>
                            <Label className={props.location.pathname === '/admin/compras' ? "icon-active" : "icon-deactive"}>Compras</Label>
                        </div>
                    </NavLink>
                </dt>


                <dt>
                    <NavLink exact to='/admin/ventas' activeClassName='navActive' className="list-group-item list-group-item-action  d-flex justify-content-center mt-5"
                        style={{ backgroundColor: 'transparent', border: 0 }}>
                        <div className={props.location.pathname === '/admin/ventas' ? "pro-icon-active d-flex flex-column text-center animate__animated animate__pulse" : "d-flex flex-column text-center"}>
                            <i className={props.location.pathname === '/admin/ventas' ? "fas fa-cash-register fa-2x icon-active" : "fas fa-cash-register fa-2x icon-deactive"}></i>
                            <Label className={props.location.pathname === '/admin/ventas' ? "icon-active" : "icon-deactive"}>Ventas</Label>
                        </div>
                    </NavLink>
                </dt>


            </ul>
            <div className="sidebar-heading text-center mb-2" style={{ position: 'fixed', bottom: 0, width: 100 }}>
                <Link to='/'><img
                    style={{ width: '100%', marginLeft: '20%' }}
                    alt="logo saffiro"
                    src={logoSF}
                /></Link>
            </div>
        </div>
    )
}

export default withRouter(Sidebar)

