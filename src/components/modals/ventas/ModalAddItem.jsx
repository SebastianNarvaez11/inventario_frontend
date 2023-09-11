import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createMark } from '../../../redux/actions/markActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import Loader from "react-loader-spinner";
import { formatNumber } from '../../../helpers/functions'


const formSchema = yup.object().shape({
})


const ModalAddItem = ({ show, data, toggle, add_item }) => {


    return (
        <Modal isOpen={show} toggle={toggle} centered>
            <Formik
                initialValues={{
                    descuento: 0
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const item = {
                        producto_obj: data,
                        producto: data.id,
                        descuento: values.descuento,
                        sub_total: data.precio,
                        total: data.precio - ((data.precio * values.descuento) / 100)
                    }

                    add_item(item)
                    toggle()

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
                                <Col lg='6' className='mb-1'>
                                    <FormGroup>
                                        <Label className='mb-2'>Sub Total:</Label>
                                        <p style={{ fontSize: 20 }}> ${formatNumber(data.precio)}</p>
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-1'>
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
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-between'>
                            <p style={{ fontSize: 23 }}>Total: ${formatNumber(data.precio - ((data.precio * values.descuento) / 100))} </p>
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
