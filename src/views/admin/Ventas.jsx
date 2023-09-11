import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVentas, getVenta, deleteVenta } from '../../redux/actions/ventaActions'
import { fetchProducts } from '../../redux/actions/productActions'
import { fetchClients } from '../../redux/actions/clientActions'
import { Table, Input, Button as ButtonAntd, Switch } from 'antd';
import { Row, Button, Badge } from "reactstrap";
import { ToastDelete, ToastError } from '../../assets/alerts'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import Loader from "react-loader-spinner";
import { formatNumber } from '../../helpers/functions'
import ModalCreateVenta from '../../components/modals/ventas/ModalCreateVenta'
import ModalViewVenta from '../../components/modals/ventas/ModalViewVenta'

const Ventas = () => {

    const { ventas, isFetchingVentas } = useSelector(state => state.ventaReducer)
    const { products } = useSelector(state => state.productReducer)
    const { clients } = useSelector(state => state.clientReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (ventas.length === 0) {
            dispatch(fetchVentas());
        }
        // eslint-disable-next-line
    }, [ventas.length]);


    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
        // eslint-disable-next-line
    }, [products.length]);


    useEffect(() => {
        if (clients.length === 0) {
            dispatch(fetchClients());
        }
        // eslint-disable-next-line
    }, [clients.length]);




    //modal creacion venta
    const [showCreate, setShowCreate] = useState(false)
    const toggleCreate = () => { setShowCreate(!showCreate) }


    // modal ver venta
    const [showVenta, setShowVenta] = useState({ show: false, data: null })
    const toggleOpenView = (row) => {
        dispatch(getVenta(row, setShowVenta))
    }
    const toggleCloseView = () => {
        setShowVenta({
            show: false,
            data: null
        })
    }


    // //logica para borrar
    const handleDeleteVenta = async (row) => {
        ToastDelete(`¿ Esta seguro de anular la venta "${row.no_factura}" de forma permanente?. Esto afectara su inventario de productos`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteVenta(row))
                }
            })
    }



    //Logica para la datatable
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder='Buscar'
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <ButtonAntd
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Buscar
                </ButtonAntd>
                <ButtonAntd onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Limpiar
                </ButtonAntd>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            get(record, dataIndex)
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),

        render: text =>
            isequal(searchedColumn, dataIndex) ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: 'No Factura',
            dataIndex: ['no_factura'],
            ...getColumnSearchProps("no_factura"),
            render: (text, row) => `${row.no_factura}`,
        },
        {
            title: 'Observación',
            dataIndex: ['observacion'],
            ...getColumnSearchProps("observacion"),
            render: (text, row) => `${row.observacion} `,
        },
        {
            title: 'Fecha de Venta',
            dataIndex: 'created',
            ...getColumnSearchProps("created"),
            render: (text, row) => `${row.created}`,
        },
        {
            title: 'Fecha de Actualizacion',
            dataIndex: 'updated',
            ...getColumnSearchProps("updated"),
            render: (text, row) => `${row.updated}`,
        },
        {
            title: 'Cliente',
            dataIndex: ['cliente', 'nombre'],
            ...getColumnSearchProps("cliente.nombre"),
            render: (text, row) => `${row.cliente.nombre}`,
        },
        {
            title: 'Realizada por',
            dataIndex: ['usuario_creador', 'first_name'],
            ...getColumnSearchProps("usuario_creador.first_name"),
            render: (text, row) => `${row.usuario_creador.first_name} ${row.usuario_creador.last_name}`,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            ...getColumnSearchProps("total"),
            sorter: (a, b) => { return a.total - b.total },
            render: (text, row) => `$ ${formatNumber(row.total)}`,
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <>
                        <span className="see-table" onClick={() => toggleOpenView(row)}>
                            <i id='icon-button' className="fas fa-eye"></i>
                        </span>

                        <span className="delete-table" onClick={() => handleDeleteVenta(row)}>
                            <i id='icon-button' className="fas fa-times-circle"></i>
                        </span>
                    </>
                );
            },
        },
    ];


    return (
        <>
            {isFetchingVentas
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Ventas</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <div style={{ paddingLeft: 50 }}>
                    <h2>Ventas</h2>
                    <Row style={{ paddingRight: 90, marginTop: 50 }}>
                        <Button className='btn mb-4' style={{ backgroundColor: '#14cc60', border: 0, width: 'auto' }} type="button" onClick={toggleCreate}>
                            <i className="fas fa-plus mr-2"></i> Realizar Venta
                        </Button>
                        <Table style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn table-ant'
                            dataSource={ventas}
                            columns={columns}
                            rowKey={record => record}
                            scroll={{ y: 600 }}
                            size="small"
                            pagination={false} />
                        <ModalCreateVenta show={showCreate} toggle={toggleCreate} />
                        {showVenta.data && <ModalViewVenta show={showVenta.show} venta={showVenta.data} toggle={toggleCloseView} />}
                    </Row>
                </div>
            }
        </>
    )
}

export default Ventas
