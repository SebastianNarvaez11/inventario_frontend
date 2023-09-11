import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProvider } from '../../../redux/actions/providerActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import Loader from "react-loader-spinner";


const formSchema = yup.object().shape({
    nombre: yup.string().min(2, 'El nombre debe tener minimo 2 caracteres').required('El nombre es obligatorio'),
    nit: yup.string().min(5, 'El Nit debe tener minimo 5 caracteres').required('El Nit es obligatorio'),
    email: yup.string().email('Ingrese un email valido').required('El email es obligatorio'),
    contacto: yup.string().min(2, 'El contacto debe tener minimo 2 caracteres')
        .test('alphabets', 'El contacto solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El contacto es obligatorio'),
})


const ModalCreateProvider = ({ show, toggle }) => {

    const { isCreatingProvider } = useSelector(state => state.providerReducer)
    const dispatch = useDispatch()


    return (
        <Modal isOpen={show} toggle={toggle} size='lg'>
            <Formik
                initialValues={{
                    nit: '',
                    nombre: '',
                    contacto: '',
                    direccion: '',
                    email: '',
                    telefono: ''
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const provider = {
                        nit: values.nit,
                        nombre: values.nombre,
                        contacto: values.contacto,
                        direccion: values.direccion,
                        email: values.email,
                        telefono: values.telefono
                    }

                    dispatch(createProvider(provider, toggle))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#14cc60' }} className='d-flex justify-content-center'>
                            <strong style={{ fontSize: '20px', color: 'white' }}>Crear Proveedor</strong>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                            <Row>
                                <Col lg='12' className='mb-5'>
                                    <FormGroup>
                                        <Label className='mb-2'>Nombre:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='nombre' placeholder="Nombre del proveedor" type="text"
                                                value={values.nombre}
                                                onBlur={handleBlur('nombre')}
                                                onChange={handleChange('nombre')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="far fa-building" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="nombre" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12' className='mb-5'>
                                    <FormGroup>
                                        <Label className='mb-2'>Nit / CC:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='nit' placeholder="Nit o CC del proveedor" type="text"
                                                value={values.nit}
                                                onBlur={handleBlur('nit')}
                                                onChange={handleChange('nit')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="far fa-building" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="nit" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Persona de Contacto:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='contacto' placeholder="Persona de contacto" type="text"
                                                value={values.contacto}
                                                onBlur={handleBlur('contacto')}
                                                onChange={handleChange('contacto')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="far fa-user" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="contacto" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Telefono:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='telefono' placeholder="Telefono" type="text"
                                                value={values.telefono}
                                                onBlur={handleBlur('telefono')}
                                                onChange={handleChange('telefono')} />
                                                <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="fas fa-phone" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="telefono" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
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
                                        <Label className='mb-2'>Direccion:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                type="text" name="direccion"
                                                value={values.direccion}
                                                onBlur={handleBlur('direccion')}
                                                onChange={handleChange('direccion')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="fas fa-route" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="direccion" render={msg => <div className='error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-between'>
                            <div>
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid || isCreatingProvider} type='submit'>Crear Proveedor</Button>
                                <Button color="secondary" onClick={toggle}>Cancelar</Button>
                            </div>
                            {isCreatingProvider &&
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


export default ModalCreateProvider
