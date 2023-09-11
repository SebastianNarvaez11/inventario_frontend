import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../../redux/actions/userActions'
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
})


const ModalUpdateUser = ({ show, data, toggle }) => {

    const { isUpdatingUser } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()


    return (
        <Modal isOpen={show} toggle={toggle} size='lg'>
            <Formik
                initialValues={{
                    username: data.username,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    type: data.type,
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const user = {
                        ...data,
                        username: values.username,
                        email: values.email,
                        first_name: values.first_name,
                        last_name: values.last_name,
                        type: Number(values.type),
                    }

                    dispatch(updateUser(user, toggle))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#ffb703' }} className='d-flex justify-content-center'>
                            <strong style={{ fontSize: '20px', color: 'white' }}>Actualizar Usuario</strong>
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
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-between'>
                            <div>
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid || isUpdatingUser} type='submit'>Actualizar Usuario</Button>
                                <Button color="secondary" onClick={toggle}>Cancelar</Button>
                            </div>
                            {isUpdatingUser &&
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


export default ModalUpdateUser
