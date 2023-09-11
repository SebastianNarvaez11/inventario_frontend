import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateMark } from '../../../redux/actions/markActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import Loader from "react-loader-spinner";


const formSchema = yup.object().shape({
    nombre: yup.string().min(2, 'El nombre debe tener minimo 2 caracteres').required('El nombre es obligatorio')
})


const ModalUpdateMark = ({ show, data, toggle }) => {

    const { isUpdatingMark } = useSelector(state => state.markReducer)
    const dispatch = useDispatch()


    return (
        <Modal isOpen={show} toggle={toggle} >
            <Formik
                initialValues={{
                    nombre: data.nombre,
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const mark = {
                        ...data,
                        nombre: values.nombre,
                    }

                    dispatch(updateMark(mark, toggle))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#ffb703' }} className='d-flex justify-content-center'>
                            <strong style={{ fontSize: '20px', color: 'white' }}>Actualizar Marca</strong>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                            <Row>
                                <Col lg='12' className='mb-5'>
                                    <FormGroup>
                                        <Label className='mb-2'>Nombre:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='nombre' placeholder="Nombre de la marca" type="text"
                                                value={values.nombre}
                                                onBlur={handleBlur('nombre')}
                                                onChange={handleChange('nombre')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="fas fa-marker" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="nombre" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-between'>
                            <div>
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid || isUpdatingMark} type='submit'>Actualizar Marca</Button>
                                <Button color="secondary" onClick={toggle}>Cancelar</Button>
                            </div>
                            {isUpdatingMark &&
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


export default ModalUpdateMark
