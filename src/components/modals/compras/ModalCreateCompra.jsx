import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCompra } from '../../../redux/actions/compraActions'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import { Table, Input as InputAnt, Button as ButtonAntd, Switch } from 'antd';
import Loader from "react-loader-spinner";
import Select from 'react-select'
import { formatDataSelectExtras } from '../../../helpers/functions'
import { formatNumber } from '../../../helpers/functions'
import { filterMaterial, resetFilterMaterial } from '../../../redux/actions/materialActions'
import ModalAddItem from './ModalAddItem'
import ModalUpdateItem from './ModalUpdateItem'
import ModalCreateProvider from '../proveedores/ModalCreateProvider'
import select_img from '../../../assets/img/selec.png'


const formSchema = yup.object().shape({
})


const ModalCreateCompra = ({ show, toggle }) => {

    const { isCreatingCompra } = useSelector(state => state.compraReducer)
    const { providers } = useSelector(state => state.providerReducer)
    const { materiales_filter } = useSelector(state => state.materialReducer)
    const { current_user } = useSelector(state => state.authReducer)
    const dispatch = useDispatch()

    const select_providers = useMemo(() => formatDataSelectExtras(providers), [providers])

    const [providerSelected, setProviderSelected] = useState('')
    const [itemsCompra, setItemsCompra] = useState([])



    const closeAndClean = () => {
        toggle()
        dispatch(resetFilterMaterial())
        setProviderSelected('')
        setItemsCompra([])
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


    //modal add provider
    const [showProvider, setShowProvider] = useState(false)
    const toogleCloseProvider = () => {setShowProvider(!showProvider)}


    const addItemCompra = (item) => {
        setItemsCompra([...itemsCompra, item])
    }

    const upItemCompra = (item_up) => {
        setItemsCompra(itemsCompra.map(item => item.material == item_up.material ? (item = item_up) : item))
    }

    const delItemCompra = (item_del) => {
        setItemsCompra(itemsCompra.filter(item => item.material !== item_del.material))
    }

    const sumSubTotales = () => {
        let total = 0
        itemsCompra.map(item => {
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
                    observacion: '',
                    sub_total: 0,
                    descuento: 0,
                    total: 0,
                    proveedor: ''
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const request = {
                        compra: {
                            observacion: values.observacion,
                            sub_total: sumSubTotales(),
                            descuento: values.descuento,
                            total: sumSubTotales() - ((sumSubTotales() * values.descuento) / 100),
                            proveedor: providerSelected,
                            usuario_creador: current_user.id
                        },
                        items: itemsCompra
                    }

                    dispatch(createCompra(request, closeAndClean))

                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader style={{ backgroundColor: '#14cc60' }} className='d-flex justify-content-center'>
                            <span style={{ fontSize: '20px', color: 'white' }}>Nueva Compra</span>
                        </ModalHeader>
                        <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                            <Row>
                                <Col lg='6'>
                                    <span style={{ fontSize: 20, color: '#8e959b' }}>Información de la Compra</span>
                                    <FormGroup className='mb-4 mt-2'>
                                        <Label className='mb-2'>Proveedor:</Label>
                                        <Select options={select_providers} placeholder='Seleccione un proveedor' name='proveedor' onChange={(item) => setProviderSelected(item.value)} />
                                        <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} onClick={() => setShowProvider(true)} > + </Button>
                                        <ModalCreateProvider show={showProvider} toggle={toogleCloseProvider}/>
                                    </FormGroup>

                                    <FormGroup className='mb-5'>
                                        <Label className='mb-2'>Observacion:</Label>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center">
                                            <Input style={{ height: 70 }}
                                                name='observacion' placeholder="Descripcion de la compra ..." type="textarea" maxLength={90}
                                                value={values.observacion}
                                                onBlur={handleBlur('observacion')}
                                                onChange={handleChange('observacion')} />
                                        </InputGroup>
                                        <ErrorMessage name="observacion" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                    <span style={{ fontSize: 20, color: '#8e959b' }}>Selección de materiales:</span>
                                    <FormGroup className='mb-3 d-flex justify-content-end'>
                                        <InputGroup id='input-group-modal' className="input-group-alternative d-flex align-items-center" style={{ width: '50%' }}>
                                            <Input className='input-modal' placeholder="Buscar" type="text" onChange={onfilterMaterial} />
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
                                        dataSource={materiales_filter}
                                        columns={columns}
                                        rowKey={record => record}
                                        scroll={{ y: 300 }}
                                        size="small"
                                        pagination={false}
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: event => {
                                                    const items = itemsCompra.filter(item => item.material == record.id)
                                                    console.log(items)
                                                    if (items.length !== 0) {
                                                        return toggleOpenUpItem(items[0])
                                                    } else {
                                                        return toggleOpenAddItem(record)
                                                    }
                                                },
                                            };
                                        }}
                                    />
                                    {showAddItem.data && <ModalAddItem show={showAddItem.show} data={showAddItem.data} toggle={toggleCloseAddItem} add_item={addItemCompra} />}
                                </Col>
                                <Col lg='6' style={{ paddingLeft: 90 }}>
                                    <span style={{ fontSize: 20, color: '#8e959b' }}>Detalles de la Compra</span>
                                    
                                        {itemsCompra.length == 0
                                            ?
                                            <>
                                                <div className='d-flex justify-content-center mt-9 animate__animated animate__fadeIn'>
                                                    <img width='60%' alt="search" src={select_img} />
                                                </div>
                                                <div className='d-flex justify-content-center animate__animated animate__fadeIn'>
                                                    <h3 className="d-flex justify-content-center " style={{ fontSize: '15px', position: 'relative' }}>
                                                        Seleccione los materiales a comprar
                                                    </h3>
                                                </div>
                                            </>
                                            :
                                            <div className='mt-3' style={{ height: 450, overflowY: 'scroll', padding: 30 }}>
                                                {itemsCompra.map(item => (
                                                    <Row className='items-compra d-flex align-items-center animate__animated animate__pulse mb-4' key={item.material}>
                                                        <Col lg={5} className='d-flex align-items-center'>
                                                            <strong>{item.material_obj.nombre} - {item.material_obj.marca.nombre}</strong>
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

                                                            <span className="delete-table" onClick={() => delItemCompra(item)}>
                                                                <i id='icon-button' className="fas fa-trash-alt"></i>
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </div>
                                        }
                                        {showUpItem.data && <ModalUpdateItem show={showUpItem.show} data={showUpItem.data} toggle={toggleCloseUpItem} up_item={upItemCompra} />}
                                    <div style={{bottom: 20, position: 'absolute', width: '40%'}}>
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
                                <Button style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10 }} disabled={isSubmitting || !isValid || isCreatingCompra || providerSelected == '' || itemsCompra.length == 0} type='submit'>Comprar</Button>
                                <Button color="secondary" onClick={closeAndClean}>Cancelar</Button>
                            </div>
                            {isCreatingCompra &&
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


export default ModalCreateCompra
