import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '../../../redux/actions/productActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import { Table, Input as InputAnt, Button as ButtonAntd, Switch } from 'antd';
import Loader from "react-loader-spinner";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import { formatNumber } from '../../../helpers/functions'
import { filterMaterial, resetFilterMaterial } from '../../../redux/actions/materialActions'
import ModalAddItem from './ModalAddItem'
import ModalUpdateItem from './ModalUpdateItem'
import manufacturing_img from '../../../assets/img/manufacturing.png'
import { ToastError } from '../../../assets/alerts';

const digitsOnly = (value) => /^\d+$/.test(value)
const formSchema = yup.object().shape({
    nombre: yup.string().min(2, 'El nombre debe tener minimo 2 caracteres').required('El nombre es obligatorio'),
    costo_mano_obra: yup.number().test('Digits only', 'Este campo solo admite valores numericos ', digitsOnly).required('El precio es obligatorio'),
    precio: yup.number().test('Digits only', 'Este campo solo admite valores numericos ', digitsOnly).required('El precio es obligatorio'),
})


const ModalCreateProduct = ({ show, toggle }) => {

    const { isCreatingProduct } = useSelector(state => state.productReducer)
    const { materiales_filter } = useSelector(state => state.materialReducer)
    const { current_user } = useSelector(state => state.authReducer)
    const dispatch = useDispatch()

    const [itemsFabricacion, setItemsFabricacion] = useState([])


    const closeAndClean = () => {
        toggle()
        dispatch(resetFilterMaterial())
        setItemsFabricacion([])
    }


    // envia el texto para filtrar
    const onfilterMaterial = (e) => {
        dispatch(filterMaterial(e.target.value))
    }


    // modal cracion item
    const [showAddItem, setShowAddItem] = useState({ show: false, data: null })
    const toggleOpenAddItem = (row) => {
        setShowAddItem({
            show: true,
            data: row
        })
    }
    const toggleCloseAddItem = () => {
        setShowAddItem({
            show: false,
            data: null
        })
    }


    // modal edicion item
    const [showUpItem, setShowUpItem] = useState({ show: false, data: null })
    const toggleOpenUpItem = (row) => {
        setShowUpItem({
            show: true,
            data: row
        })
    }
    const toggleCloseUpItem = () => {
        setShowUpItem({
            show: false,
            data: null
        })
    }


    const addItemFabricacion = (item) => {
        setItemsFabricacion([...itemsFabricacion, item])
    }

    const upItemFabricacion = (item_up) => {
        setItemsFabricacion(itemsFabricacion.map(item => item.material == item_up.material ? (item = item_up) : item))
    }

    const delItemFabricacion = (item_del) => {
        setItemsFabricacion(itemsFabricacion.filter(item => item.material !== item_del.material))
    }

    const sumSubTotales = () => {
        let total = 0
        itemsFabricacion.map(item => {
            total = total + item.total
        })
        return total
    }

    const columns = [
        {
            title: 'Nombre',
            dataIndex: ['nombre'],
            render: (text, row) => `${row.nombre}`,
        },

        {
            title: 'Cod',
            dataIndex: ['codigo'],
            sorter: (a, b) => { return a.codigo.localeCompare(b.codigo) },
            render: (text, row) => `${row.codigo} `,
        },

        {
            title: 'Exist',
            dataIndex: ['existencia'],
            sorter: (a, b) => { return a.existencia - b.existencia },
            render: (text, row) => row.existencia !== 0 ?
                <div className="badge text-wrap" style={{ backgroundColor: '#14cc60', fontSize: 12 }}>{row.existencia}</div> :
                <div className="badge bg-danger text-wrap" style={{ fontSize: 12 }}>{row.existencia}</div>
        },
        {
            title: 'U.Medida',
            dataIndex: ['unidad_medida', 'nombre'],
            render: (text, row) => `${row.unidad_medida.nombre}`,
        },

        {
            title: 'Marca',
            dataIndex: ['marca', 'nombre'],
            render: (text, row) => `${row.marca.nombre}`,
        },
        {
            title: 'Categ',
            dataIndex: ['categoria', 'nombre'],
            render: (text, row) => `${row.categoria.nombre}`,
        },
        {
            title: 'Precio U.',
            dataIndex: ['precio_unidad'],
            sorter: (a, b) => { return a.precio_unidad - b.precio_unidad },
            render: (text, row) => `$ ${formatNumber(row.precio_unidad)}`,
        },
    ];

    return (
        <Modal isOpen={show} className='modal-xl'>
            <Formik
                initialValues={{
                    nombre: '',
                    costo_mano_obra: 0,
                    precio: 0
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const request = {
                        producto: {
                            nombre: values.nombre,
                            costo_mano_obra: values.costo_mano_obra,
                            costo_total: values.costo_mano_obra + sumSubTotales(),
                            precio: values.precio,
                            estado: 1,
                            usuario_creador: current_user.id
                        },
                        items: itemsFabricacion
                    }

                    console.log(request)
                    dispatch(createProduct(request, closeAndClean))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#14cc60' }} className='d-flex justify-content-center'>
                            <span style={{ fontSize: '20px', color: 'white' }}>Fabricación de Producto</span>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                            <Row>
                                <Col lg='6'>
                                    <span style={{ fontSize: 20, color: '#8e959b' }}>Información del producto</span>
                                    <FormGroup>
                                        <Label className='mb-2'>Nombre:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input className="input-modal"
                                                name='nombre' placeholder="Nombre del producto" type="text"
                                                value={values.nombre}
                                                onBlur={handleBlur('nombre')}
                                                onChange={handleChange('nombre')} />
                                        </InputGroup>
                                        <ErrorMessage name="nombre" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                    <Row className='mt-3 mb-5'>
                                        <Col lg={6}>
                                            <FormGroup>
                                                <Label className='mb-2'>Costo Mano de Obra:</Label>
                                                <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                                    <Input className="input-modal"
                                                        name='costo_mano_obra' placeholder="costo de fabricación" type="number" min={0}
                                                        value={values.costo_mano_obra}
                                                        onBlur={handleBlur('costo_mano_obra')}
                                                        onChange={handleChange('costo_mano_obra')} />
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                            <i className="fas fa-dollar-sign" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <ErrorMessage name="costo_mano_obra" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={6}>
                                            <FormGroup>
                                                <Label className='mb-2'>Precio de Venta:</Label>
                                                <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                                    <Input className="input-modal"
                                                        name='precio' placeholder="precio de venta" type="number" min={0}
                                                        value={values.precio}
                                                        onBlur={handleBlur('precio')}
                                                        onChange={handleChange('precio')} />
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                            <i className="fas fa-dollar-sign" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <ErrorMessage name="precio" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg={6}>
                                            <span style={{ fontSize: 20, color: '#8e959b' }}>Selección de materiales:</span>
                                        </Col>
                                        <Col lg={6}>
                                            <FormGroup className='mb-3 d-flex justify-content-end'>
                                                <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center" style={{ width: '80%' }}>
                                                    <Input className='input-modal' placeholder="Buscar" type="text" onChange={onfilterMaterial} />
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                            <i className="fas fa-search" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                    </Row>


                                    <Table style={{ width: '100%', fontSize: 10 }}
                                        className='animate__animated animate__fadeIn'
                                        rowClassName='row-table-text'
                                        dataSource={materiales_filter}
                                        columns={columns}
                                        rowKey={record => record}
                                        scroll={{ y: 300 }}
                                        size="small"
                                        pagination={false}
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: event => {
                                                    if (record.existencia <= 0) {
                                                        ToastError(`El material ` + record.nombre + ' no tiene existencias disponibles').fire()
                                                    } else {
                                                        const items = itemsFabricacion.filter(item => item.material == record.id)
                                                        if (items.length !== 0) {
                                                            return toggleOpenUpItem(items[0])
                                                        } else {
                                                            return toggleOpenAddItem(record)
                                                        }
                                                    }
                                                },
                                            };
                                        }}
                                    />
                                    {showAddItem.data && <ModalAddItem show={showAddItem.show} data={showAddItem.data} toggle={toggleCloseAddItem} add_item={addItemFabricacion} />}
                                </Col>
                                <Col lg='6' style={{ paddingLeft: 90 }}>
                                    <span style={{ fontSize: 20, color: '#8e959b' }}>Materiales a emplear en la fabricación</span>

                                    {itemsFabricacion.length == 0
                                        ?
                                        <>
                                            <div className='d-flex justify-content-center mt-9 animate__animated animate__fadeInDown'>
                                                <img width='60%' alt="search" src={manufacturing_img} />
                                            </div>
                                            <div className='d-flex justify-content-center animate__animated animate__fadeIn'>
                                                <h3 className="d-flex justify-content-center " style={{ fontSize: '15px', position: 'relative' }}>
                                                    Seleccione los materiales a emplear en la fabricación
                                                    </h3>
                                            </div>
                                        </>
                                        :
                                        <div className='mt-3' style={{ height: 450, overflowY: 'scroll', padding: 30 }}>
                                            {itemsFabricacion.map(item => (
                                                <Row className='items-compra d-flex align-items-center animate__animated animate__pulse mb-4' key={item.material}>
                                                    <Col lg={5} className='d-flex align-items-center'>
                                                        <strong>{item.material.nombre} - {item.material.marca.nombre}</strong>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="badge text-wrap" style={{ backgroundColor: '#14cc60', fontSize: 12 }}>{item.cantidad}</div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <span>$ {formatNumber(item.total)}</span>
                                                    </Col>

                                                    <Col lg={2} className='d-flex align-items-center'>
                                                        <span className="edit-table" onClick={() => toggleOpenUpItem(item)}>
                                                            <i id='icon-button' className="fas fa-edit"></i>
                                                        </span>

                                                        <span className="delete-table" onClick={() => delItemFabricacion(item)}>
                                                            <i id='icon-button' className="fas fa-trash-alt"></i>
                                                        </span>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </div>
                                    }

                                    {showUpItem.data && <ModalUpdateItem show={showUpItem.show} data={showUpItem.data} toggle={toggleCloseUpItem} up_item={upItemFabricacion} />}

                                    <div style={{ bottom: 20, position: 'absolute', width: '40%' }}>
                                        <Row>
                                            <Col lg={4}>
                                                <Label>Costo de materiales:</Label><br />
                                                <strong style={{ fontSize: 18 }}> $ {formatNumber(sumSubTotales())}</strong>
                                            </Col>
                                            <Col lg={4} >
                                                <Label>Costo Mano de Obra:</Label><br />
                                                <strong style={{ fontSize: 18 }}> $ {formatNumber(values.costo_mano_obra)}</strong>
                                            </Col>
                                            <Col lg={4} >
                                                <Label>Costo Total:</Label><br />
                                                <strong style={{ fontSize: 18 }}> $ {formatNumber(values.costo_mano_obra + sumSubTotales())}</strong>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-end'>
                            <div>
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid || isCreatingProduct || itemsFabricacion.length == 0} type='submit'>Fabricar</Button>
                                <Button color="secondary" onClick={closeAndClean}>Cancelar</Button>
                            </div>
                            {isCreatingProduct &&
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


export default ModalCreateProduct
