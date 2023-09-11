import React from "react";
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/actions/authActions'
import { NavLink, withRouter } from 'react-router-dom'
import { Navbar, DropdownToggle, DropdownItem, UncontrolledDropdown, DropdownMenu, NavbarText, Row, Col, UncontrolledTooltip } from 'reactstrap'

const NavbarAdmin = (props) => {
    const current_user = useSelector(state => state.authReducer.current_user)
    const dispatch = useDispatch()

    return (
        <Navbar className="navbar-expand-lg pd-0 d-flex mb-4" style={{ backgroundColor: 'white' }}>
            <Row className='row-white d-flex justify-content-end'>
                {/* <Col xl={4} lg={4}>
                    <Button id='button-sidebar' className='p-2 mb-1 bd-highlight' type="button">
                        <span className="navbar-toggler-icon" onClick={() => dispatch(toggleSidebar())} ></span>
                    </Button>
                </Col> */}
                <Col xl={12} lg={12}>
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex justify-content-center' style={{ marginLeft: 100 }}>
                            <NavLink exact to='/admin/users' activeClassName='navActive' className="d-flex align-items-center" id="UncontrolledTooltipUsers"
                                style={{ backgroundColor: 'transparent', border: 0 }}>
                                <div className={props.location.pathname === '/admin/users' ? "pro-icon-active-navbar d-flex flex-column text-center animate__animated animate__pulse" : "pro-icon d-flex flex-column text-center"}>
                                    <i className={props.location.pathname === '/admin/users' ? "fas fa-user-shield fa-2x icon-active" : "fas fa-user-shield fa-2x icon-deactivate"}></i>
                                </div>
                            </NavLink>
                            <UncontrolledTooltip placement="bottom" target="UncontrolledTooltipUsers">
                                Usuarios
                            </UncontrolledTooltip>

                            <NavLink exact to='/admin/proveedores' activeClassName='navActive' className="d-flex align-items-center" id="UncontrolledTooltipProvider"
                                style={{ backgroundColor: 'transparent', border: 0, marginLeft: 50 }}>
                                <div className={props.location.pathname === '/admin/proveedores' ? "pro-icon-active-navbar d-flex flex-column text-center animate__animated animate__pulse" : "pro-icon d-flex flex-column text-center"}>
                                    <i className={props.location.pathname === '/admin/proveedores' ? "fas fa-people-arrows fa-2x icon-active" : "fas fa-people-arrows fa-2x icon-deactivate"}></i>
                                </div>
                            </NavLink>
                            <UncontrolledTooltip placement="bottom" target="UncontrolledTooltipProvider">
                                Proveedores
                            </UncontrolledTooltip>

                            <NavLink exact to='/admin/clientes' activeClassName='navActive' className="d-flex align-items-center" id="UncontrolledTooltipClientes"
                                style={{ backgroundColor: 'transparent', border: 0, marginLeft: 50 }}>
                                <div className={props.location.pathname === '/admin/clientes' ? "pro-icon-active-navbar d-flex flex-column text-center animate__animated animate__pulse" : "pro-icon d-flex flex-column text-center"}>
                                    <i className={props.location.pathname === '/admin/clientes' ? "fas fa-users fa-2x icon-active" : "fas fa-users fa-2x icon-deactivate"}></i>
                                </div>
                            </NavLink>
                            <UncontrolledTooltip placement="bottom" target="UncontrolledTooltipClientes">
                                Clientes
                            </UncontrolledTooltip>

                            <NavLink exact to='/admin/extras' activeClassName='navActive' className="d-flex align-items-center" id="UncontrolledTooltipBase"
                                style={{ backgroundColor: 'transparent', border: 0, marginLeft: 50 }}>
                                <div className={props.location.pathname === '/admin/extras' ? "pro-icon-active-navbar d-flex flex-column text-center animate__animated animate__pulse" : "pro-icon d-flex flex-column text-center"}>
                                    <i className={props.location.pathname === '/admin/extras' ? "fas fa-database fa-2x icon-active" : "fas fa-database fa-2x icon-deactivate"}></i>
                                </div>
                            </NavLink>
                            <UncontrolledTooltip placement="bottom" target="UncontrolledTooltipBase">
                                Base de Datos
                            </UncontrolledTooltip>

                            <NavLink exact to='/admin/historial' activeClassName='navActive' className="d-flex align-items-center" id="UncontrolledTooltipHistory"
                                style={{ backgroundColor: 'transparent', border: 0, marginLeft: 50 }}>
                                <div className={props.location.pathname === '/admin/historial' ? "pro-icon-active-navbar d-flex flex-column text-center animate__animated animate__pulse" : "pro-icon d-flex flex-column text-center"}>
                                    <i className={props.location.pathname === '/admin/historial' ? "fas fa-eye fa-2x icon-active" : "fas fa-eye fa-2x icon-deactivate"}></i>
                                </div>
                            </NavLink>
                            <UncontrolledTooltip placement="bottom" target="UncontrolledTooltipHistory">
                                Supervisión
                            </UncontrolledTooltip>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <NavbarText className=' mr-3 p-2 bd-highlight '>
                                <span style={{ fontSize: 18 }}>{current_user.first_name} {current_user.last_name}</span>
                            </NavbarText>
                            <UncontrolledDropdown className='mb-1 bd-highlight'>
                                <DropdownToggle id='button-sidebar'>
                                    <i className="fas fa-cog mt-2 mb-2 fa-lg" style={{ color: '#6266ea' }}></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-arrow mt-2" right>
                                    <DropdownItem className="noti-title" header tag="div">
                                        <h6 className="text-overflow m-0">Bienvenido!</h6>
                                    </DropdownItem>
                                    <DropdownItem to="/admin/user-profile" >
                                        <i className="fas fa-headset" />
                                        <span>Soporte</span>
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={() => dispatch(logoutUser())}>
                                        <i className="fas fa-sign-out-alt" />
                                        <span>Salir</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </div>
                </Col>
            </Row>




        </Navbar>
    );
}

export default withRouter(NavbarAdmin);