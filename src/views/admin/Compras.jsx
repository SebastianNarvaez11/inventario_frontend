import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCompras, cancelCompra, getCompra, getCompraDelete } from '../../redux/actions/compraActions'
import { fetchProviders } from '../../redux/actions/providerActions'
import { fetchMateriales } from '../../redux/actions/materialActions'
import { Table, Input, Button as ButtonAntd, Switch } from 'antd';
import { Row, Button, Badge } from "reactstrap";
import { ToastDelete, ToastError } from '../../assets/alerts'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import Loader from "react-loader-spinner";
import { formatNumber } from '../../helpers/functions'
import ModalCreateCompra from '../../components/modals/compras/ModalCreateCompra'
import ModalViewCompra from '../../components/modals/compras/ModalViewCompra'

const Compras = () => {

    const { compras, isFetchingCompras } = useSelector(state => state.compraReducer)
    const { providers } = useSelector(state => state.providerReducer)
    const { materiales } = useSelector(state => state.materialReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (compras.length === 0) {
            dispatch(fetchCompras());
        }
        // eslint-disable-next-line
    }, [compras.length]);


    useEffect(() => {
        if (providers.length === 0) {
            dispatch(fetchProviders());
        }
        // eslint-disable-next-line
    }, [providers.length]);


    useEffect(() => {
        if (materiales.length === 0) {
            dispatch(fetchMateriales());
        }
        // eslint-disable-next-line
    }, [materiales.length]);




    //modal creacion compra
    const [showCreate, setShowCreate] = useState(false)
    const toggleCreate = () => { setShowCreate(!showCreate) }


    // modal ver compra
    const [showCompra, setShowCompra] = useState({ show: false, data: null })
    const toggleOpenView = (row) => {
        dispatch(getCompra(row, setShowCompra))
    }
    const toggleCloseView = () => {
        setShowCompra({
            show: false,
            data: null
        })
    }


    //logica para borrar
    const handleDeleteCompra = async (row) => {

        let aprobados = true
        let compra = await getCompraDelete(row)

        compra.items.map(item => {
            materiales.map(mat => mat.id == item.material.id ? (mat.existencia < item.cantidad && (aprobados = mat)) : mat)
        })

        if (aprobados == true) {
            ToastDelete(`¿ Esta seguro de anular la compra "${row.no_factura}" de forma permanente?. Esto afectara su inventario`)
                .fire().then((result) => {
                    if (result.value) {
                        dispatch(cancelCompra(compra))
                    }
                })
        } else {
            ToastError(`No puedes anular la compra: El material ` + aprobados.nombre + ` actualmente tiene menos existencia de las que se comprarón`).fire()
        }

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
            title: 'Fecha de Compra',
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
            title: 'Proveedor',
            dataIndex: ['proveedor', 'nombre'],
            ...getColumnSearchProps("proveedor.nombre"),
            render: (text, row) => `${row.proveedor.nombre}`,
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

                        <span className="delete-table" onClick={() => handleDeleteCompra(row)}>
                            <i id='icon-button' className="fas fa-times-circle"></i>
                        </span>
                    </>
                );
            },
        },
    ];


    return (
        <>
            {isFetchingCompras
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Compras</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <div style={{ paddingLeft: 50 }}>
                    <h2>Compras</h2>
                    <Row style={{ paddingRight: 90, marginTop: 50 }}>
                        <Button className='btn mb-4' style={{ backgroundColor: '#14cc60', border: 0, width: 'auto' }} type="button" onClick={toggleCreate}>
                            <i className="fas fa-plus mr-2"></i> Realizar Compra
                        </Button>
                        <Table style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn table-ant'
                            dataSource={compras}
                            columns={columns}
                            rowKey={record => record}
                            scroll={{ y: 600 }}
                            size="small"
                            pagination={false} />
                        <ModalCreateCompra show={showCreate} toggle={toggleCreate} />
                        {showCompra.data && <ModalViewCompra show={showCompra.show} compra={showCompra.data} toggle={toggleCloseView} />}
                    </Row>
                </div>
            }
        </>
    )
}

export default Compras
