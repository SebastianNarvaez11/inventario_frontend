import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createVenta } from '../../../redux/actions/ventaActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import { Table, Input as InputAnt, Button as ButtonAntd, Switch } from 'antd';
import Loader from "react-loader-spinner";
import Select from 'react-select'
import { formatDataSelectExtras } from '../../../helpers/functions'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import { formatNumber } from '../../../helpers/functions'
import { deleteProduct, filterProduct, resetFilterProduct } from '../../../redux/actions/productActions'
import ModalAddItem from './ModalAddItem'
import ModalUpdateItem from './ModalUpdateItem'
import select_img from '../../../assets/img/selec.png'


const formSchema = yup.object().shape({
})


const ModalCreateVenta = ({ show, toggle }) => {

    const { isCreatingVenta } = useSelector(state => state.ventaReducer)
    const { clients } = useSelector(state => state.clientReducer)
    const { products_filter } = useSelector(state => state.productReducer)
    const { current_user } = useSelector(state => state.authReducer)
    const dispatch = useDispatch()

    const select_clients = useMemo(() => formatDataSelectExtras(clients), [clients])

    const [clientSelected, setClientSelected] = useState('')
    const [itemsVenta, setItemsVenta] = useState([])



    const closeAndClean = () => {
        toggle()
        dispatch(resetFilterProduct())
        setClientSelected('')
        setItemsVenta([])
    }


    // envia el texto para filtrar
    const onfilterProduct = (e) => {
        dispatch(filterProduct(e.target.value))
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


    const addItemVenta = (item) => {
        setItemsVenta([...itemsVenta, item])
    }

    const upItemVenta = (item_up) => {
        setItemsVenta(itemsVenta.map(item => item.producto == item_up.producto ? (item = item_up) : item))
    }

    const delItemVenta = (item_del) => {
        setItemsVenta(itemsVenta.filter(item => item.producto !== item_del.producto))
    }

    const sumSubTotales = () => {
        let total = 0
        itemsVenta.map(item => {
            total = total + item.total
        })
        return total
    }

    const columns = [
        {
            title: 'Codigo',
            dataIndex: ['codigo'],
            render: (text, row) => `${row.codigo} `,
        },
        {
            title: 'Nombre',
            dataIndex: ['nombre'],
            render: (text, row) => `${row.nombre}`,
        },
        {
            title: 'Costo Fabricación',
            dataIndex: 'costo_total',
            render: (text, row) => `$ ${formatNumber(row.costo_total)}`,
        },
        {
            title: 'Precio de Venta',
            dataIndex: 'precio',
            render: (text, row) => `$ ${formatNumber(row.precio)}`,
        },
    ];

    return (
        <Modal isOpen={show} className='modal-xl'>
            <Formik
                initialValues={{
                    observacion: '',
                    sub_total: 0,
                    descuento: 0,
                    total: 0,
                    cliente: ''
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const request = {
                        venta: {
                            observacion: values.observacion,
                            sub_total: sumSubTotales(),
                            descuento: values.descuento,
                            total: sumSubTotales() - ((sumSubTotales() * values.descuento) / 100),
                            cliente: clientSelected,
                            usuario_creador: current_user.id
                        },
                        items: itemsVenta
                    }
                    
                    // console.log(request)
                    dispatch(createVenta(request, closeAndClean))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#14cc60' }} className='d-flex justify-content-center'>
                            <span style={{ fontSize: '20px', color: 'white' }}>Nueva Venta</span>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40, minHeight: 600 }}>
                            <Row>
                                <Col lg='6'>
                                    <span style={{ fontSize: 20, color: '#8e959b' }}>Información de la Venta</span>
                                    <FormGroup className='mb-4 mt-2'>
                                        <Label className='mb-2'>Cliente:</Label>
                                        <Select options={select_clients} placeholder='Seleccione un cliente' name='cliente' onChange={(item) => setClientSelected(item.value)} />
                                    </FormGroup>

                                    <FormGroup className='mb-5'>
                                        <Label className='mb-2'>Observacion:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input style={{ height: 70 }}
                                                name='observacion' placeholder="Descripcion de la venta ..." type="textarea" maxLength={90}
                                                value={values.observacion}
                                                onBlur={handleBlur('observacion')}
                                                onChange={handleChange('observacion')} />
                                        </InputGroup>
                                        <ErrorMessage name="observacion" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                    <span style={{ fontSize: 20, color: '#8e959b' }}>Selección de productos:</span>
                                    <FormGroup className='mb-3 d-flex justify-content-end'>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center" style={{ width: '50%' }}>
                                            <Input className='input-modal' placeholder="Buscar" type="text" onChange={onfilterProduct} />
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText style={{ backgroundColor: 'transparent' }}>
                                                    <i className="fas fa-search" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormGroup>
                                    <Table style={{ width: '100%', fontSize: 10 }}
                                        className='animate__animated animate__fadeIn'
                                        rowClassName='row-table-text'
                                        dataSource={products_filter}
                                        columns={columns}
                                        rowKey={record => record}
                                        scroll={{ y: 300 }}
                                        size="small"
                                        pagination={false}
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: event => {
                                                    const items = itemsVenta.filter(item => item.producto == record.id)
                                                    if (items.length !== 0) {
                                                        return toggleOpenUpItem(items[0])
                                                    } else {
                                                        return toggleOpenAddItem(record)
                                                    }
                                                },
                                            };
                                        }}
                                    />
                                    {showAddItem.data && <ModalAddItem show={showAddItem.show} data={showAddItem.data} toggle={toggleCloseAddItem} add_item={addItemVenta} />}
                                    {showUpItem.data && <ModalUpdateItem show={showUpItem.show} data={showUpItem.data} toggle={toggleCloseUpItem} up_item={upItemVenta} />}
                                </Col>
                                <Col lg='6' style={{ paddingLeft: 90 }}>
                                    <span style={{ fontSize: 20, color: '#8e959b' }}>Detalles de la Venta</span>

                                    {itemsVenta.length == 0
                                        ?
                                        <>
                                            <div className='d-flex justify-content-center mt-9 animate__animated animate__fadeIn'>
                                                <img width='60%' alt="search" src={select_img} />
                                            </div>
                                            <div className='d-flex justify-content-center animate__animated animate__fadeIn'>
                                                <h3 className="d-flex justify-content-center " style={{ fontSize: '15px', position: 'relative' }}>
                                                    Seleccione los productos a vender
                                                    </h3>
                                            </div>
                                        </>
                                        :
                                        <div className='mt-3' style={{ height: 450, overflowY: 'scroll', padding: 30 }}>
                                            {itemsVenta.map(item => (
                                                <Row className='items-compra d-flex align-items-center animate__animated animate__pulse mb-4' key={item.id}>
                                                    <Col lg={5} className='d-flex align-items-center'>
                                                        <strong>{item.producto_obj.nombre}</strong>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="badge text-wrap" style={{ backgroundColor: '#14cc60', fontSize: 12 }}>1</div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <span>$ {formatNumber(item.total)}</span>
                                                    </Col>

                                                    <Col lg={2} className='d-flex align-items-center'>
                                                        <span className="edit-table" onClick={() => toggleOpenUpItem(item)}>
                                                            <i id='icon-button' className="fas fa-edit"></i>
                                                        </span>

                                                        <span className="delete-table" onClick={() => delItemVenta(item)}>
                                                            <i id='icon-button' className="fas fa-trash-alt"></i>
                                                        </span>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </div>
                                    }
                                    
                                    <div style={{ bottom: 20, position: 'absolute', width: '40%' }}>
                                        <Row className='mt-5'>
                                            <Col lg={4} >
                                                <Label>Sub Total:</Label><br />
                                                <strong style={{ fontSize: 20 }}> $ {formatNumber(sumSubTotales())}</strong>
                                            </Col>
                                            <Col lg={4}>
                                                <FormGroup>
                                                    <Label className='mb-2'>Descuento (%):</Label><br />
                                                    <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center" style={{ width: 150 }}>
                                                        <Input className="input-modal"
                                                            min={0}
                                                            max={100}
                                                            name='descuento' type="number"
                                                            value={values.descuento}
                                                            onBlur={handleBlur('descuento')}
                                                            onChange={handleChange('descuento')} />
                                                    </InputGroup>
                                                    <ErrorMessage name="descuento" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                                </FormGroup>
                                            </Col>
                                            <Col lg={4}>
                                                <Label >Total:</Label><br />
                                                <strong style={{ fontSize: 20 }}> ${formatNumber(sumSubTotales() - ((sumSubTotales() * values.descuento) / 100))}</strong>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className='d-flex justify-content-end'>
                            <div>
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid || isCreatingVenta || clientSelected == '' || itemsVenta.length == 0} type='submit'>Vender</Button>
                                <Button color="secondary" onClick={closeAndClean}>Cancelar</Button>
                            </div>
                            {isCreatingVenta &&
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


export default ModalCreateVenta
