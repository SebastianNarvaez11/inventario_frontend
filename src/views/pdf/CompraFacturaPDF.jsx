import React from 'react';
import { Page, View, Document, StyleSheet, Image, Text, } from '@react-pdf/renderer';
import logo from '../../assets/img/logo.jpg'
import logo_saffiro from '../../assets/img/saffiro-pdf.jpg'
import { nombre_empresa, nit, direccion, email, lema, telefono } from '../../helpers/data'
import { formatNumber } from '../../helpers/functions'
// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        paddingTop: 30,
        paddingHorizontal: 30,
        paddingBottom: 15,
    },
    image: {
        width: '50%',
        objectFit: 'cover',
        alignSelf: 'center'
    },
    image_logo: {
        height: 25,
        objectFit: 'cover',
        alignSelf: 'center'
    }
});


const CompraFacturaPDF = ({ compra }) => {

    console.log(compra)

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <View style={{ flexDirection: 'column' }}>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', width: '50%' }}>
                            <Image style={styles.image} src={logo} />
                            <Text style={{ fontSize: 10, textAlign: 'center' }}>
                                {nombre_empresa}{"\n"}
                                {lema}{"\n"}
                                NIT: {nit}{"\n"}
                                {direccion} {telefono}{"\n"}
                                {email}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', width: '50%' }}>
                            <Text style={{ color: '#d4d2d2', textAlign: 'right', marginBottom: 10 }}>FACTURA DE COMPRA</Text>
                            <Text style={{ fontSize: 10, textAlign: 'right' }}>
                                No de Factura: <Text style={{ fontSize: 10, textAlign: 'right' }}> {compra.no_factura}</Text>
                            </Text>
                            <Text style={{ fontSize: 10, textAlign: 'right' }}>
                                Fecha: <Text style={{ fontSize: 10, textAlign: 'right' }}> {compra.created}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', width: '50%', marginTop: 30 }}>
                        <Text style={{ fontSize: 10, backgroundColor: '#003163', color: 'white', padding: 3 }}>INFORMACION DEL PROVEEDOR: </Text>
                        <Text style={{ fontSize: 10, marginTop: 5 }}>
                            Nombre: <Text style={{ fontSize: 10 }}> {compra.proveedor.nombre}</Text>
                        </Text>
                        <Text style={{ fontSize: 10, marginTop: 5 }}>
                            NIT/CC: <Text style={{ fontSize: 10 }}> {compra.proveedor.nit}</Text>
                        </Text>
                        <Text style={{ fontSize: 10, marginTop: 5 }}>
                            Dirección: <Text style={{ fontSize: 10 }}> {compra.proveedor.direccion}</Text>
                        </Text>
                        <Text style={{ fontSize: 10, marginTop: 5 }}>
                            Telefono: <Text style={{ fontSize: 10 }}> {compra.proveedor.telefono}</Text>
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 30 }}>
                        <Text style={{ fontSize: 10, backgroundColor: '#003163', color: 'white', padding: 3, width: '15%', marginRight: 2 }}>CANTIDAD</Text>
                        <Text style={{ fontSize: 10, backgroundColor: '#003163', color: 'white', padding: 3, width: '45%', marginRight: 2 }}>DESCRIPCION</Text>
                        <Text style={{ fontSize: 10, backgroundColor: '#003163', color: 'white', padding: 3, width: '20%', marginRight: 2 }}>P. UNIT</Text>
                        <Text style={{ fontSize: 10, backgroundColor: '#003163', color: 'white', padding: 3, width: '20%' }}>TOTAL</Text>
                    </View>

                    {compra.items.map(item => (
                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 5 }}>
                            <Text style={{ fontSize: 10, backgroundColor: '#f2f5fd', padding: 3, width: '15%', marginRight: 2 }}>{item.cantidad}</Text>
                            <Text style={{ fontSize: 10, backgroundColor: '#f2f5fd', padding: 3, width: '45%', marginRight: 2 }}>{item.material.nombre} - {item.material.marca.nombre}</Text>
                            <Text style={{ fontSize: 10, backgroundColor: '#f2f5fd', padding: 3, width: '20%', marginRight: 2 }}>$ {formatNumber(item.material.precio_unidad)}</Text>
                            <Text style={{ fontSize: 10, backgroundColor: '#f2f5fd', padding: 3, width: '20%' }}>$ {formatNumber(item.total)}</Text>
                        </View>
                    ))}

                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 30 }}>
                        <View style={{ flexDirection: 'column', width: '50%', marginRight: '10%' }}>
                            <Text style={{ fontSize: 10, backgroundColor: '#003163', color: 'white', width: '100%', padding: 3 }}>OBSERVACIONES: </Text>
                            <Text style={{ fontSize: 10, backgroundColor: '#f2f5fd', padding: 3, width: '100%', height: 50 }}>{compra.observacion}</Text>
                        </View>

                        <View style={{ flexDirection: 'column', width: '20%' }}>
                            <Text style={{ fontSize: 12 }}>Subtotal:</Text>
                            <Text style={{ fontSize: 12, marginTop: 5 }}>Descuento (%):</Text>
                            <Text style={{ fontSize: 12, marginTop: 5 }}>Total:</Text>
                        </View>

                        <View style={{ flexDirection: 'column', width: '20%' }}>
                            <Text style={{ fontSize: 12 }}>$ {formatNumber(compra.sub_total)}</Text>
                            <Text style={{ fontSize: 12, marginTop: 5 }}>{compra.descuento} %</Text>
                            <Text style={{ fontSize: 12, marginTop: 5 }}>$ {formatNumber(compra.total)}</Text>
                        </View>
                    </View>




                </View>
                <View style={{ bottom: 5, marginLeft: 30, position: 'absolute' }}>
                    <Image style={styles.image_logo} src={logo_saffiro} />
                </View>
            </Page>
        </Document>
    )
};
export default CompraFacturaPDF