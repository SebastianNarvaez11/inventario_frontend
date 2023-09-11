import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createMark } from '../../../redux/actions/markActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import Loader from "react-loader-spinner";
import { formatNumber } from '../../../helpers/functions'



const ModalUpdateItem = ({ show, data, toggle, up_item }) => {

    const formSchema = yup.object().shape({
        cantidad: yup.number().min(1, 'La cantidad deber ser mayor a cero').max(data.material.existencia + data.cantidad, `Solo tienes ${data.material.existencia + data.cantidad} existencia(s)`).required('El cantidad es obligatoria')
    })
    

    return (
        <Modal isOpen={show} toggle={toggle} centered>
            <Formik
                initialValues={{
                    cantidad: data.cantidad,
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const item = {
                        ...data,
                        cantidad: values.cantidad,
                        total: values.cantidad * data.material.precio_unidad
                    }

                    console.log(item)
                    up_item(item)
                    toggle()
                    // dispatch(createMark(mark, toggle))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#ffb703' }} className='d-flex justify-content-center'>
                            <strong style={{ fontSize: '20px', color: 'white' }}>{data.material.nombre}</strong>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                            <Row>
                                <Col lg='6' className='mb-1'>
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
                                <Col lg='6' className='mb-1'>
                                    <FormGroup>
                                        <Label className='mb-2'>Total:</Label>
                                        <p style={{ fontSize: 20 }}> ${formatNumber(values.cantidad * data.material.precio_unidad)}</p>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-between'>
                            <div>
                                <Button style={{ backgroundColor: '#ffb703', borderColor: '#ffb703', marginRight: 10 }} disabled={isSubmitting || !isValid} type='submit'>Actualizar</Button>
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


export default ModalUpdateItem
