import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUnit } from '../../../redux/actions/unitActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import Loader from "react-loader-spinner";


const formSchema = yup.object().shape({
    nombre: yup.string().min(2, 'El nombre debe tener minimo 2 caracteres').required('El nombre es obligatorio'),
    abreviacion: yup.string().min(1, 'La abreviación debe tener minimo 1 caracter').required('La abreviación es obligatorio')
})


const ModalUpdateUnit = ({ show, data, toggle }) => {

    const { isUpdatingUnit } = useSelector(state => state.unitReducer)
    const dispatch = useDispatch()


    return (
        <Modal isOpen={show} toggle={toggle} >
            <Formik
                initialValues={{
                    nombre: data.nombre,
                    abreviacion: data.abreviacion
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const unit = {
                        ...data,
                        nombre: values.nombre,
                        abreviacion: values.abreviacion
                    }

                    dispatch(updateUnit(unit, toggle))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#ffb703' }} className='d-flex justify-content-center'>
                            <strong style={{ fontSize: '20px', color: 'white' }}>Actualizar Unidad de Medida</strong>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                            <Row>
                                <Col lg='12' className='mb-5'>
                                    <FormGroup>
                                        <Label className='mb-2'>Nombre:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='nombre' placeholder="Eje: Gramos, Unidades" unit="text"
                                                value={values.nombre}
                                                onBlur={handleBlur('nombre')}
                                                onChange={handleChange('nombre')} />
                                        </InputGroup>
                                        <ErrorMessage name="nombre" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>

                                <Col lg='12' className='mb-5'>
                                    <FormGroup>
                                        <Label className='mb-2'>Abreviación:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='abreviacion' placeholder="Eje: gr, lt " unit="text"
                                                value={values.abreviacion}
                                                onBlur={handleBlur('abreviacion')}
                                                onChange={handleChange('abreviacion')} />
                                        </InputGroup>
                                        <ErrorMessage name="abreviacion" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-between'>
                            <div>
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid || isUpdatingUnit} type='submit'>Actualizar Unidad de Medida</Button>
                                <Button color="secondary" onClick={toggle}>Cancelar</Button>
                            </div>
                            {isUpdatingUnit &&
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


export default ModalUpdateUnit
