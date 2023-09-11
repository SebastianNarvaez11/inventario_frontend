import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, updateUser, deleteUser } from '../../redux/actions/userActions'
import { Table, Input, Button as ButtonAntd, Switch } from 'antd';
import { Row, Button, Badge } from "reactstrap";
import { ToastDelete } from '../../assets/alerts'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import Loader from "react-loader-spinner";
import ModalCreateUser from '../../components/modals/users/ModalCreateUser'
import ModalUpdateUser from '../../components/modals/users/ModalUpdateUser'

const Users = () => {

    const { users, isFetchingUsers } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (users.length === 0) {
            dispatch(fetchUsers());
        }
        // eslint-disable-next-line
    }, [users.length]);





    //modal creacion usuario
    const [showCreate, setShowCreate] = useState(false)
    const toggleCreate = () => { setShowCreate(!showCreate) }





    // modal actualizacion usuario
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



    // cambiar estado de usuario
    const changeStateUser = (row) => {
        row.is_active = !row.is_active
        dispatch(updateUser(row))
    }


    //logica para borrar
    const handleDeleteUser = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar al usuario "${row.first_name} ${row.last_name}" de forma permanente?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteUser(row))
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
            dataIndex: ['first_name'],
            ...getColumnSearchProps("first_name"),
            render: (text, row) => `${row.first_name} ${row.last_name}`,
        },
        {
            title: 'Usuario',
            dataIndex: ['username'],
            ...getColumnSearchProps("username"),
            render: (text, row) => `${row.username} `,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps("email"),
            render: (text, row) => `${row.email}`,
        },
        {
            title: 'Perfil',
            dataIndex: 'type',
            filters: [
                {
                    text: 'Administrador',
                    value: '1',
                },
                {
                    text: 'Asistente',
                    value: '2',
                },
                {
                    text: 'Contador',
                    value: '3',
                }
            ],
            filterMultiple: false,
            onFilter: (value, record) => String(record.type).indexOf(value) === 0,
            render: (text, row) => {
                if (row.type === 1) {
                    return 'Administrador'
                } else if (row.type === 2) {
                    return 'Asistente'
                } else if (row.type === 3) {
                    return 'Contador'
                }
            },
        },
        {
            title: 'Estado',
            dataIndex: 'is_active',
            filters: [
                {
                    text: 'Activo',
                    value: true,
                },
                {
                    text: 'Inactivo',
                    value: false,
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => String(record.is_active).indexOf(value) === 0,
            render: (text, row) => row.is_active ?
                <div className="badge text-wrap" style={{ backgroundColor: '#14cc60' }}>Activo</div> :
                <div className="badge bg-warning text-wrap">Inactivo</div>
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <>
                        <Switch checked={row.is_active} size="small" onChange={() => changeStateUser(row)} />

                        <span className="edit-table" onClick={() => toggleOpenUpdate(row)}>
                            <i id='icon-button' className="fas fa-user-edit"></i>
                        </span>

                        <span className="delete-table" onClick={() => handleDeleteUser(row)}>
                            <i id='icon-button' className="fas fa-trash-alt"></i>
                        </span>
                    </>
                );
            },
        },
    ];


    return (
        <>
            {isFetchingUsers
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Usuarios</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <div style={{ paddingLeft: 50 }}>
                    <h2>Usuarios</h2>
                    <Row style={{ paddingRight: 90, marginTop: 50 }}>
                        <Button className='btn mb-4' style={{ backgroundColor: '#14cc60', border: 0, width: 'auto' }} type="button" onClick={toggleCreate} >
                            <i className="fas fa-plus mr-2"></i> Añadir Usuario
                        </Button>
                        <Table style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn table-ant'
                            dataSource={users}
                            columns={columns}
                            rowKey={record => record}
                            scroll={{ y: 600 }}
                            pagination={false} />
                    </Row>
                    <ModalCreateUser show={showCreate} toggle={toggleCreate} />
                    {showUpdate.data && <ModalUpdateUser show={showUpdate.show} data={showUpdate.data} toggle={toggleCloseUpdate} />}
                </div>
            }
        </>
    )
}

export default Users
