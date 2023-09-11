import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMateriales, deleteMaterial } from '../../redux/actions/materialActions'
import { Table, Input, Button as ButtonAntd, Switch, Avatar, Image } from 'antd';
import { Row, Button, Badge } from "reactstrap";
import { ToastDelete } from '../../assets/alerts'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import Loader from "react-loader-spinner";
import ModalCreateMaterial from '../../components/modals/materiales/ModalCreateMaterial'
import ModalUpdateMaterial from '../../components/modals/materiales/ModalUpdateMaterial'
import { formatNumber } from '../../helpers/functions'
import not_img from '../../assets/img/not-available.png'

const Materiales = () => {

    const { materiales, isFetchingMateriales } = useSelector(state => state.materialReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (materiales.length === 0) {
            dispatch(fetchMateriales());
        }
        // eslint-disable-next-line
    }, [materiales.length]);



    //modal creacion material
    const [showCreate, setShowCreate] = useState(false)
    const toggleCreate = () => { setShowCreate(!showCreate) }



    // modal actualizacion material
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



    //logica para borrar MATERIAL
    const handleDeleteMaterial = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar el material "${row.nombre}" de forma permanente?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteMaterial(row))
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
            title: 'Imagen',
            dataIndex: ['img'],
            render: (text, row) =>
                row.img ?
                    <Avatar size={70} shape='square' src={<Image src={row.img} />} />
                    :
                    <img height={70} width={70} src={not_img} alt='imagen del producto' />
        },
        {
            title: 'Nombre',
            dataIndex: ['nombre'],
            ...getColumnSearchProps("nombre"),
            sorter: (a, b) => { return a.nombre.localeCompare(b.nombre) },
            render: (text, row) => `${row.nombre}`,
        },
        {
            title: 'Codigo',
            dataIndex: ['codigo'],
            ...getColumnSearchProps("codigo"),
            sorter: (a, b) => { return a.codigo.localeCompare(b.codigo) },
            render: (text, row) => `${row.codigo} `,
        },

        {
            title: 'Existencias',
            dataIndex: ['existencia'],
            ...getColumnSearchProps("existencia"),
            sorter: (a, b) => { return a.existencia - b.existencia },
            render: (text, row) => row.existencia !== 0 ?
                <div className="badge text-wrap" style={{ backgroundColor: '#14cc60', fontSize: 15 }}>{row.existencia}</div> :
                <div className="badge bg-danger text-wrap" style={{ fontSize: 15 }}>{row.existencia}</div>
        },
        {
            title: 'Unidad de Medida',
            dataIndex: ['unidad_medida', 'nombre'],
            ...getColumnSearchProps("unidad_medida.nombre"),
            render: (text, row) => `${row.unidad_medida.nombre}`,
        },

        {
            title: 'Marca',
            dataIndex: ['marca', 'nombre'],
            ...getColumnSearchProps("marca.nombre"),
            render: (text, row) => `${row.marca.nombre}`,
        },
        {
            title: 'Categoria',
            dataIndex: ['categoria', 'nombre'],
            ...getColumnSearchProps("categoria.nombre"),
            render: (text, row) => `${row.categoria.nombre}`,
        },
        {
            title: 'Precio Unitario',
            dataIndex: ['precio_unidad'],
            sorter: (a, b) => { return a.precio_unidad - b.precio_unidad },
            render: (text, row) => `$ ${formatNumber(row.precio_unidad)}`,
        },
        {
            title: 'Ultima Compra',
            dataIndex: ['ultima_compra'],
            sorter: (a, b) => { return a.ultima_compra - b.ultima_compra },
            render: (text, row) => `${row.ultima_compra == null ? '-' : row.ultima_compra}`,
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <>

                        <span className="edit-table" onClick={() => toggleOpenUpdate(row)}>
                            <i id='icon-button' className="fas fa-edit"></i>
                        </span>

                        <span className="delete-table" onClick={() => handleDeleteMaterial(row)}>
                            <i id='icon-button' className="fas fa-trash-alt"></i>
                        </span>
                    </>
                );
            },
        },
    ];


    return (
        <>
            {isFetchingMateriales
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Materiales</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <div style={{ paddingLeft: 50 }}>
                    <h2>Inventario de Materiales</h2>
                    <Row style={{ paddingRight: 90, marginTop: 50 }}>
                        <Button className='btn mb-4' style={{ backgroundColor: '#14cc60', border: 0, width: 'auto' }} type="button" onClick={toggleCreate}>
                            <i className="fas fa-plus mr-2"></i> Añadir Material
                        </Button>
                        <Table style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn table-ant'
                            dataSource={materiales}
                            columns={columns}
                            size="small"
                            rowKey={record => record}
                            scroll={{ y: 600 }}
                            pagination={false} />
                    </Row>
                    <ModalCreateMaterial show={showCreate} toggle={toggleCreate} />
                    {showUpdate.data && <ModalUpdateMaterial show={showUpdate.show} data={showUpdate.data} toggle={toggleCloseUpdate} />}
                </div>
            }
        </>
    )
}

export default Materiales
