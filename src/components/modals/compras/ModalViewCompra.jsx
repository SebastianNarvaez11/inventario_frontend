import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CompraFacturaPDF from '../../../views/pdf/CompraFacturaPDF'
import { formatNumber } from '../../../helpers/functions'


const ModalViewCompra = ({ show, compra, toggle }) => {

    return (
        <Modal isOpen={show} toggle={toggle} size='lg'>
            <ModalHeader style={{ backgroundColor: '#14cc60' }} className='d-flex justify-content-center'>
                <span style={{ fontSize: '20px', color: 'white' }}>Factura No. {compra.no_factura}</span>
            </ModalHeader>
            <ModalBody style={{ paddingLeft: 40, paddingRight: 40 }}>
                <Row>
                    <Col lg='12'>
                        <span style={{ fontSize: 20, color: '#8e959b' }}>INFORMACION DEL PROVEEDOR</span>
                        <div>
                            <Label className='mb-2 mt-2'>Nombre:</Label>
                            <strong> {compra.proveedor.nombre}</strong>
                        </div>
                        <div>
                            <Label className='mb-2'>NIT/CC:</Label>
                            <strong> {compra.proveedor.nit}</strong>
                        </div>
                        <div>
                            <Label className='mb-2'>Dirección:</Label>
                            <strong> {compra.proveedor.direccion}</strong>
                        </div>
                        <div>
                            <Label className='mb-4'>Telefono:</Label>
                            <strong> {compra.proveedor.telefono}</strong>
                        </div>
                        <span style={{ fontSize: 20, color: '#8e959b' }}>DETALLES DE LA COMPRA</span>
                        <div className='mt-3' style={{ height: 400, overflowY: 'scroll', padding: 30 }}>
                            {compra.items.map(item => (
                                <Row className='items-compra d-flex align-items-center animate__animated animate__pulse mb-4' key={item.id}>
                                    <Col lg={4} className='d-flex align-items-center'>
                                        <strong>{item.material.nombre} - {item.material.marca.nombre}</strong>
                                    </Col>
                                    <Col lg={2} className='text-center'>
                                        <Label className='mb-2'>Cant:</Label><br />
                                        <div className="badge text-wrap" style={{ backgroundColor: '#14cc60', fontSize: 12 }}>{item.cantidad}</div>
                                    </Col>
                                    <Col lg={2} className='text-center'>
                                        <Label className='mb-2'>S.Total:</Label> <br />
                                        <strong>$ {formatNumber(item.sub_total)}</strong>
                                    </Col>
                                    <Col lg={2} className='text-center'>
                                        <Label className='mb-2'>Descuento:</Label><br />
                                        <strong>{item.descuento} %</strong>
                                    </Col>
                                    <Col lg={2} className='text-center'>
                                        <Label className='mb-2'>Total:</Label><br />
                                        <strong>$ {formatNumber(item.total)}</strong>
                                    </Col>
                                </Row>
                            ))}
                        </div>
                        <div className='mb-1'>
                            <Label className='mb-2'>Observacion: </Label>
                            <span> {compra.observacion}</span>
                        </div>
                        <div style={{ paddingTop: 20 }}>
                            <Row className='d-flex justify-content-between'>
                                <Col lg={4} >
                                    <Label>Sub Total:</Label>
                                    <strong style={{ fontSize: 18 }}> $ {formatNumber(compra.sub_total)}</strong>
                                </Col>
                                <Col lg={4} >
                                    <Label>Descuento:</Label>
                                    <strong style={{ fontSize: 18 }}> {compra.descuento} %</strong>
                                </Col>
                                <Col lg={4} >
                                    <Label>Total:</Label>
                                    <strong style={{ fontSize: 18 }}> $ {formatNumber(compra.total)}</strong>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-end'>
                <div>
                     <PDFDownloadLink className="btn btn-pdf" style={{ backgroundColor: '#14cc60', borderColor: '#14cc60', marginRight: 10, color: 'white'}} 
                        document={<CompraFacturaPDF compra={compra}/>} fileName={'Compra ' + compra.no_factura + '.pdf'} >
                        {({ blob, url, loading, error }) => (loading ? 'Generando...' :  (<i class="fas fa-print mr-4"> Imprimir</i>))}
                    </PDFDownloadLink>
                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}


export default ModalViewCompra
