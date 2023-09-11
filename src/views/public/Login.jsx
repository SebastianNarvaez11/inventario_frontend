import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { Container, Form, Button, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import { loginUser } from '../../redux/actions/authActions'

const Login = () => {

    const { isLoggedIn, current_user, startLogin } = useSelector(state => state.authReducer)
    const dispatch = useDispatch()


    const [login, setLogin] = useState({
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = login
        dispatch(loginUser(data))
    }


    if (isLoggedIn) {
        if (current_user.type === 1) {
            return <Redirect to='/admin' />
        }
        // if (current_user.type === 2) {
        //     return <Redirect to='/assistant' />
        // }
        // if (current_user.type === 3) {
        //     return <Redirect to='/student' />
        // }
    }

    return (
        <>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label className="mr-sm-2">Usuario</Label>
                        <InputGroup className="mb-4">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-user"></i>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input name='username' placeholder="Usuario" type="text" onChange={handleChange} />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Label className="mr-sm-2">Contraseña</Label>
                        <InputGroup className=" mb-4">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-key" />
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input name='password' placeholder="Contraseña" type="password" onChange={handleChange} />
                        </InputGroup>
                    </FormGroup>
                    <Button block id='btn' className='mb-3' color="primary" size="lg" type="submit">
                        Ingresar
                    </Button>
                </Form>
                <Link to='' id='text-info'>¿Olvidaste tu contraseña?</Link>
            </Container>
        </>
    )
}

export default Login
