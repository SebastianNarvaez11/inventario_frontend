import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createUser } from '../../../redux/actions/userActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import Loader from "react-loader-spinner";


const formSchema = yup.object().shape({
    username: yup.string().min(3, 'El nombre de usuario debe tener minimo 3 caracteres').required('El nombre de usuario es obligatorio'),
    email: yup.string().email('Ingrese un email valido').required('El email es obligatorio'),
    first_name: yup.string().min(2, 'El nombre debe tener minimo 2 caracteres')
        .test('alphabets', 'El nombre solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El nombre es obligatorio'),
    last_name: yup.string().min(2, 'El apellido debe tener minimo 2 caracteres')
        .test('alphabets', 'El apellido solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El nombre es obligatorio'),
    type: yup.number().min(1, 'Seleccione un perfil').required('El perfil es obligatorio'),
    password1: yup.string().required('La contraseña es obligatoria'),
    password2: yup.string().oneOf([yup.ref('password1'), null], 'Las contraseñas no coinciden').required('Repita la contraseña')
})


const ModalCreateUser = ({ show, toggle }) => {

    const { isCreatingUser } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()


    return (
        <Modal isOpen={show} toggle={toggle} size='lg'>
            <Formik
                initialValues={{
                    username: '',
                    email: '',
                    first_name: '',
                    last_name: '',
                    type: '0',
                    password1: '',
                    password2: ''
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const user = {
                        username: values.username,
                        email: values.email,
                        first_name: values.first_name,
                        last_name: values.last_name,
                        type: Number(values.type),
                        password: values.password1,
                    }

                    dispatch(createUser(user, toggle))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#14cc60' }} className='d-flex justify-content-center'>
                            <strong style={{ fontSize: '20px', color: 'white' }}>Crear Usuario</strong>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                            <Row>
                                <Col lg='12' className='mb-5'>
                                    <FormGroup>
                                        <Label className='mb-2'>Usuario:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='username' placeholder="Usuario" type="text"
                                                value={values.username}
                                                onBlur={handleBlur('username')}
                                                onChange={handleChange('username')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="far fa-user" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="username" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Nombres:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='first_name' placeholder="Nombres" type="text"
                                                value={values.first_name}
                                                onBlur={handleBlur('first_name')}
                                                onChange={handleChange('first_name')} />
                                        </InputGroup>
                                        <ErrorMessage name="first_name" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Apellidos:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='last_name' placeholder="Apellidos" type="text"
                                                value={values.last_name}
                                                onBlur={handleBlur('last_name')}
                                                onChange={handleChange('last_name')} />
                                        </InputGroup>
                                        <ErrorMessage name="last_name" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Correo:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='email' placeholder="Email" type="text"
                                                value={values.email}
                                                onBlur={handleBlur('email')}
                                                onChange={handleChange('email')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="far fa-envelope" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="email" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Perfil de Usuario:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                type="select" name="type"
                                                value={values.type}
                                                onBlur={handleBlur('type')}
                                                onChange={handleChange('type')}>
                                                <option value='0' disabled>Seleccione un perfil...</option>
                                                <option value={1}>Administrador</option>
                                                <option value={2}>Asistente</option>
                                                <option value={3}>Contador</option>
                                            </Input>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="fas fa-shield-alt" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="type" render={msg => <div className='error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Contraseña:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='password1' placeholder="Contraseña" type="password"
                                                value={values.password1}
                                                onBlur={handleBlur('password1')}
                                                onChange={handleChange('password1')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="fas fa-lock" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="password1" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Confirmar Contraseña:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='password2' placeholder="Repite la Contraseña" type="password"
                                                value={values.password2}
                                                onBlur={handleBlur('password2')}
                                                onChange={handleChange('password2')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="fas fa-lock" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="password2" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-between'>
                            <div>
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid || isCreatingUser} type='submit'>Crear Usuario</Button>
                                <Button color="secondary" onClick={toggle}>Cancelar</Button>
                            </div>
                            {isCreatingUser &&
                                <Loader
                                    type="BallTriangle"
                                    color="#5257f2"
                                    height={50}
                                    width={50}
                                />
                            }
                        </ModalFooter>
                    </Form>
                )
            }}
            </Formik>
        </Modal>
    )
}


export default ModalCreateUser
