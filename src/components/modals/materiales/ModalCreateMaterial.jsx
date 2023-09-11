import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createMaterial } from '../../../redux/actions/materialActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import Loader from "react-loader-spinner";
import { formatDataSelectExtras } from '../../../helpers/functions'
import Select from 'react-select'

const digitsOnly = (value) => /^\d+$/.test(value)

const formSchema = yup.object().shape({
    nombre: yup.string().min(2, 'El nombre debe tener minimo 2 caracteres').required('El nombre es obligatorio'),
    codigo: yup.string().min(2, 'El codigo debe tener minimo 2 caracteres').required('El codigo es obligatorio'),
    precio_unidad: yup.string().test('Digits only', 'Este campo solo admite valores numericos ', digitsOnly).required('El precio es obligatorio'),
})


const ModalCreateMaterial = ({ show, toggle }) => {

    const { isCreatingMaterial } = useSelector(state => state.materialReducer)
    const { marks } = useSelector(state => state.markReducer)
    const { types } = useSelector(state => state.typeReducer)
    const { units } = useSelector(state => state.unitReducer)
    const dispatch = useDispatch()

    const select_marks = useMemo(() => formatDataSelectExtras(marks), [marks])
    const select_categories = useMemo(() => formatDataSelectExtras(types), [types])
    const select_units = useMemo(() => formatDataSelectExtras(units), [units])

    const [markSelected, setMarkSelected] = useState('')
    const [categoriSelected, setCategoriSelected] = useState('')
    const [unitSelected, setUnitSelected] = useState('')


    const [img, setImg] = useState('');

    const handleChangeImg = (e) => {
        setImg(e.target.files[0])
    }

    const closeModal = () => {
        toggle()
        setImg('')
    }

    return (
        <Modal isOpen={show} toggle={toggle} size='lg'>
            <Formik
                initialValues={{
                    nombre: '',
                    codigo: '',
                    precio_unidad: '',
                    marca: 0,
                    categoria: 0,
                    unidad_medida: 0
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {

                    const material = new FormData()
                    material.append('nombre', values.nombre)
                    material.append('codigo', values.codigo)
                    material.append('precio_unidad', values.precio_unidad)
                    material.append('marca', markSelected)
                    material.append('categoria', categoriSelected)
                    material.append('unidad_medida', unitSelected)
                    material.append('imagen', img)

                    dispatch(createMaterial(material, toggle))
                    setImg('')

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#14cc60' }} className='d-flex justify-content-center'>
                            <strong style={{ fontSize: '20px', color: 'white' }}>Crear Material</strong>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                            <Row>
                                <Col lg='12' className='mb-5'>
                                    <FormGroup>
                                        <Label className='mb-2'>Nombre:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='nombre' placeholder="Nombre del material" type="text"
                                                value={values.nombre}
                                                onBlur={handleBlur('nombre')}
                                                onChange={handleChange('nombre')} />
                                        </InputGroup>
                                        <ErrorMessage name="nombre" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Codigo:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='codigo' placeholder="Codigo del material" type="text"
                                                value={values.codigo}
                                                onBlur={handleBlur('codigo')}
                                                onChange={handleChange('codigo')} />
                                        </InputGroup>
                                        <ErrorMessage name="codigo" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Precio Unitario:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='precio_unidad' placeholder="Precio por unidad" type="number"
                                                value={values.precio_unidad}
                                                onBlur={handleBlur('precio_unidad')}
                                                onChange={handleChange('precio_unidad')} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="fas fa-dollar-sign" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <ErrorMessage name="precio_unidad" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Marca:</Label>
                                        <Select options={select_marks} placeholder='Seleccione una marca' name='marca' onChange={(item) => setMarkSelected(item.value)} required />
                                    </FormGroup>
                                </Col>
                                <Col lg='12' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Categoria:</Label>
                                        <Select options={select_categories} placeholder='Seleccione una categoria' name='categoria' onChange={(item) => setCategoriSelected(item.value)} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12' className='mb-5'>
                                    <FormGroup >
                                        <Label className='mb-2'>Unidad de Medida:</Label>
                                        <Select options={select_units} placeholder='Seleccione una unidad de medida' name='unidad_medida' onChange={(item) => setUnitSelected(item.value)} />
                                    </FormGroup>
                                </Col>

                                <Col lg={12} className='mb-5'>
                                    <FormGroup>
                                        <Label className='mb-2'>Imagen (opcional):</Label>
                                        <InputGroup className="mb-4">
                                            <Input name='img' placeholder="Imagen" type="file" onChange={handleChangeImg} />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>

                                {img &&
                                    <div className="pro-imagen" style={{ paddingLeft: '336px' }}>
                                        <img className="img-thumbnail img_cover" alt='logo' src={URL.createObjectURL(img)} />
                                    </div>
                                }
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-between'>
                            <div>
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid || isCreatingMaterial} type='submit'>Crear Material</Button>
                                <Button color="secondary" onClick={closeModal}>Cancelar</Button>
                            </div>
                            {isCreatingMaterial &&
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


export default ModalCreateMaterial
