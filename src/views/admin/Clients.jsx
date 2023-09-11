import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchClients, deleteClient } from '../../redux/actions/clientActions'
import { Table, Input, Button as ButtonAntd, Switch } from 'antd';
import { Row, Button, Badge } from "reactstrap";
import { ToastDelete } from '../../assets/alerts'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import Loader from "react-loader-spinner";
import ModalCreateClient from '../../components/modals/clientes/ModalCreateClient'
import ModalUpdateClient from '../../components/modals/clientes/ModalUpdateClient'

const Clients = () => {

    const { clients, isFetchingClients } = useSelector(state => state.clientReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (clients.length === 0) {
            dispatch(fetchClients());
        }
        // eslint-disable-next-line
    }, [clients.length]);





    //modal creacion cliente
    const [showCreate, setShowCreate] = useState(false)
    const toggleCreate = () => { setShowCreate(!showCreate) }


    // modal actualizacion cliente
    const [showUpdate, setShowUpdate] = useState({ show: false, data: null })
    const toggleOpenUpdate = (row) => {
        setShowUpdate({
            show: true,
            data: row
        })
    }
    const toggleCloseUpdate = () => {
        setShowUpdate({
            show: false,
            data: null
        })
    }


    //logica para borrar
    const handleDeleteClient = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar al cliente "${row.nombre}" de forma permanente?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteClient(row))
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
            title: 'NIT / CC',
            dataIndex: ['nit'],
            ...getColumnSearchProps("nit"),
            render: (text, row) => `${row.nit} `,
        },
        {
            title: 'Telefono',
            dataIndex: 'telefono',
            ...getColumnSearchProps("telefono"),
            render: (text, row) => `${row.telefono}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps("email"),
            render: (text, row) => `${row.email}`,
        },
        {
            title: 'Direccion',
            dataIndex: 'direccion',
            ...getColumnSearchProps("direccion"),
            render: (text, row) => `${row.direccion}`,
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

                        <span className="delete-table" onClick={() => handleDeleteClient(row)}>
                            <i id='icon-button' className="fas fa-trash-alt"></i>
                        </span>
                    </>
                );
            },
        },
    ];


    return (
        <>
            {isFetchingClients
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Clientes</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <div style={{ paddingLeft: 50 }}>
                    <h2>Clientes</h2>
                    <Row style={{ paddingRight: 90, marginTop: 50 }}>
                        <Button className='btn mb-4' style={{ backgroundColor: '#14cc60', border: 0, width: 'auto' }} type="button" onClick={toggleCreate}>
                            <i className="fas fa-plus mr-2"></i> Añadir Cliente
                        </Button>
                        <Table style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn table-ant'
                            dataSource={clients}
                            columns={columns}
                            rowKey={record => record}
                            scroll={{ y: 600 }}
                            pagination={false} />
                    </Row>
                    <ModalCreateClient show={showCreate} toggle={toggleCreate} />
                    {showUpdate.data && <ModalUpdateClient show={showUpdate.show} data={showUpdate.data} toggle={toggleCloseUpdate} />}
                </div>
            }
        </>
    )
}

export default Clients
