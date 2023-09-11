import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, deleteProduct, getProduct } from '../../redux/actions/productActions'
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
import ModalCreateProduct from '../../components/modals/manufacturing/ModalCreateProduct'
import ModalUpdateProduct from '../../components/modals/manufacturing/ModalUpdateProduct'

const Manufacturing = () => {

    const { products, isFetchingProducts } = useSelector(state => state.productReducer)
    const { materiales } = useSelector(state => state.materialReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
        // eslint-disable-next-line
    }, [products.length]);


    useEffect(() => {
        if (materiales.length === 0) {
            dispatch(fetchMateriales());
        }
        // eslint-disable-next-line
    }, [materiales.length]);



    //modal creacion producto
    const [showCreate, setShowCreate] = useState(false)
    const toggleCreate = () => { setShowCreate(!showCreate) }


    // modal actualizacion producto
    const [showUpdate, setShowUpdate] = useState(false)
    const toggleOpenUpdate = (row) => {
        dispatch(getProduct(row, setShowUpdate))
    }
    const toggleCloseUpdate = () => {
        setShowUpdate({
            show: false,
            data: null
        })
    }


    // //logica para borrar
    const handleDeleteProduct = (row) => {
        ToastDelete(`¿ Esta seguro eliminar el producto "${row.nombre}" de forma permanente?. Esto afectara su inventario`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteProduct(row))
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
            title: 'Nombre',
            dataIndex: ['nombre'],
            ...getColumnSearchProps("nombre"),
            render: (text, row) => `${row.nombre}`,
        },
        {
            title: 'Codigo',
            dataIndex: ['codigo'],
            ...getColumnSearchProps("codigo"),
            render: (text, row) => `${row.codigo} `,
        },
        {
            title: 'Costo Fabricación',
            dataIndex: 'costo_total',
            ...getColumnSearchProps("costo_total"),
            render: (text, row) => `$ ${formatNumber(row.costo_total)}`,
        },
        {
            title: 'Precio de Venta',
            dataIndex: 'precio',
            ...getColumnSearchProps("precio"),
            render: (text, row) => `$ ${formatNumber(row.precio)}`,
        },
        {
            title: 'Fabricado por',
            dataIndex: ['usuario_creador', 'first_name'],
            ...getColumnSearchProps("usuario_creador.first_name"),
            render: (text, row) => `${row.usuario_creador.first_name} ${row.usuario_creador.last_name}`,
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <>
                        <span className="edit-table" onClick={() => toggleOpenUpdate(row)}>
                            <i id='icon-button' className="fas fa-user-edit"></i>
                        </span>

                        <span className="delete-table" onClick={() => handleDeleteProduct(row)}>
                            <i id='icon-button' className="fas fa-trash-alt"></i>
                        </span>
                    </>
                );
            },
        },
    ];


    return (
        <>
            {isFetchingProducts
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Productos</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <div style={{ paddingLeft: 50 }}>
                    <h2>Inventario de Productos</h2>
                    <Row style={{ paddingRight: 90, marginTop: 50 }}>
                        <Button className='btn mb-4' style={{ backgroundColor: '#14cc60', border: 0, width: 'auto' }} type="button" onClick={toggleCreate}>
                            <i className="fas fa-plus mr-2"></i> Fabricar Producto
                        </Button>
                        <Table style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn table-ant'
                            dataSource={products}
                            columns={columns}
                            rowKey={record => record}
                            scroll={{ y: 600 }}
                            pagination={false} />
                    </Row>
                    <ModalCreateProduct show={showCreate} toggle={toggleCreate} />
                    {showUpdate.data && <ModalUpdateProduct show={showUpdate.show} data={showUpdate.data} toggle={toggleCloseUpdate} />}
                </div>
            }
        </>
    )
}

export default Manufacturing
