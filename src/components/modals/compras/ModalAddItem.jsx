import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createMark } from '../../../redux/actions/markActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import Loader from "react-loader-spinner";
import { formatNumber } from '../../../helpers/functions'


const formSchema = yup.object().shape({
    cantidad: yup.number().min(1, 'La cantidad deber ser mayor a cero').required('El cantidad es obligatoria')
})


const ModalAddItem = ({ show, data, toggle, add_item }) => {


    return (
        <Modal isOpen={show} toggle={toggle} centered>
            <Formik
                initialValues={{
                    cantidad: 0,
                    descuento: 0
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const item = {
                        material_obj: data,
                        material: data.id,
                        cantidad: values.cantidad,
                        descuento: values.descuento,
                        sub_total: values.cantidad * data.precio_unidad,
                        total: (values.cantidad * data.precio_unidad) - (((values.cantidad * data.precio_unidad) * values.descuento) / 100)
                    }

                    console.log(item)
                    add_item(item)
                    toggle()
                    // dispatch(createMark(mark, toggle))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#14cc60' }} className='d-flex justify-content-center'>
                            <strong style={{ fontSize: '20px', color: 'white' }}>{data.nombre}</strong>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                            <Row>
                                <Col lg='4' className='mb-1'>
                                    <FormGroup>
                                        <Label className='mb-2'>Cantidad:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                min={0}
                                                name='cantidad' type="number"
                                                value={values.cantidad}
                                                onBlur={handleBlur('cantidad')}
                                                onChange={handleChange('cantidad')} />
                                        </InputGroup>
                                        <ErrorMessage name="cantidad" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='4' className='mb-1'>
                                    <FormGroup>
                                        <Label className='mb-2'>Decuento (%):</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                min={0}
                                                name='descuento' type="number"
                                                value={values.descuento}
                                                onBlur={handleBlur('descuento')}
                                                onChange={handleChange('descuento')} />
                                        </InputGroup>
                                        <ErrorMessage name="sub_total" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='4' className='mb-1'>
                                    <FormGroup>
                                        <Label className='mb-2'>Sub Total:</Label>
                                        <p style={{ fontSize: 20 }}> ${formatNumber(values.cantidad * data.precio_unidad)}</p>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-between'>
                            <p style={{ fontSize: 23 }}>Total: ${formatNumber((values.cantidad * data.precio_unidad) - (((values.cantidad * data.precio_unidad) * values.descuento) / 100))} </p>
                            <div>
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid} type='submit'>Agregar</Button>
                                <Button color="secondary" onClick={toggle}>Cancelar</Button>
                            </div>
                        </ModalFooter>
                    </Form>
                )
            }}
            </Formik>
        </Modal>
    )
}


export default ModalAddItem
