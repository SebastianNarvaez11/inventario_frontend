import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMarks, deleteMark } from '../../redux/actions/markActions'
import { fetchTypes, deleteType } from '../../redux/actions/typeActions'
import { fetchUnits, deleteUnit } from '../../redux/actions/unitActions'
import { Table, Input, Button as ButtonAntd, Switch } from 'antd';
import { Row, Button, Badge, Col } from "reactstrap";
import { ToastDelete } from '../../assets/alerts'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import Loader from "react-loader-spinner";
import ModalCreateMark from '../../components/modals/marks/ModalCreateMark'
import ModalUpdateMark from '../../components/modals/marks/ModalUpdateMark'
import ModalCreateType from '../../components/modals/types/ModalCreateType'
import ModalUpdateType from '../../components/modals/types/ModalUpdateType'
import ModalCreateUnit from '../../components/modals/units/ModalCreateUnit'
import ModalUpdateUnit from '../../components/modals/units/ModalUpdateUnit'

const Extras = () => {

    const { marks, isFetchingMarks } = useSelector(state => state.markReducer)
    const { types, isFetchingTypes } = useSelector(state => state.typeReducer)
    const { units, isFetchingUnits } = useSelector(state => state.unitReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (marks.length === 0) {
            dispatch(fetchMarks());
        }
        // eslint-disable-next-line
    }, [marks.length]);


    useEffect(() => {
        if (types.length === 0) {
            dispatch(fetchTypes());
        }
        // eslint-disable-next-line
    }, [types.length]);


    useEffect(() => {
        if (units.length === 0) {
            dispatch(fetchUnits());
        }
        // eslint-disable-next-line
    }, [units.length]);




    //modal creacion marca
    const [showCreateMarca, setShowCreateMarca] = useState(false)
    const toggleCreateMarca = () => { setShowCreateMarca(!showCreateMarca) }

    // modal actualizacion marca
    const [showUpdateMark, setShowUpdateMark] = useState({ show: false, data: null })
    const toggleOpenUpdateMark = (row) => {
        setShowUpdateMark({
            show: true,
            data: row
        })
    }
    const toggleCloseUpdateMark = () => {
        setShowUpdateMark({
            show: false,
            data: null
        })
    }

    //logica para borrar marca
    const handleDeleteMark = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar la marca "${row.nombre}" de forma permanente?.`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteMark(row))
                }
            })
    }






    //modal creacion tipo
    const [showCreateTipo, setShowCreateTipo] = useState(false)
    const toggleCreateTipo = () => { setShowCreateTipo(!showCreateTipo) }

    // modal actualizacion tipo
    const [showUpdateTipo, setShowUpdateTipo] = useState({ show: false, data: null })
    const toggleOpenUpdateTipo = (row) => {
        setShowUpdateTipo({
            show: true,
            data: row
        })
    }
    const toggleCloseUpdateTipo = () => {
        setShowUpdateTipo({
            show: false,
            data: null
        })
    }

    //logica para borrar tipos
    const handleDeleteTipo = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar el tipo de material "${row.nombre}" de forma permanente?.`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteType(row))
                }
            })
    }





    //modal creacion unidad de medida
    const [showCreateUnit, setShowCreateUnit] = useState(false)
    const toggleCreateUnit = () => { setShowCreateUnit(!showCreateUnit) }

    // modal actualizacion unidad de medida
    const [showUpdateUnit, setShowUpdateUnit] = useState({ show: false, data: null })
    const toggleOpenUpdateUnit = (row) => {
        setShowUpdateUnit({
            show: true,
            data: row
        })
    }
    const toggleCloseUpdateUnit = () => {
        setShowUpdateUnit({
            show: false,
            data: null
        })
    }

    //logica para borrar unidades de medida
    const handleDeleteUnit = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar la unidad de medida"${row.nombre}" de forma permanente?.`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteUnit(row))
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

    const columnsMarks = [
        {
            title: 'Nombre',
            dataIndex: ['nombre'],
            ...getColumnSearchProps("nombre"),
            render: (text, row) => `${row.nombre}`,
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <>
                        <span className="edit-table" onClick={() => toggleOpenUpdateMark(row)}>
                            <i id='icon-button' className="fas fa-edit"></i>
                        </span>

                        <span className="delete-table" onClick={() => handleDeleteMark(row)}>
                            <i id='icon-button' className="fas fa-trash-alt"></i>
                        </span>
                    </>
                );
            },
        },
    ];

    const columnsTypes = [
        {
            title: 'Nombre',
            dataIndex: ['nombre'],
            ...getColumnSearchProps("nombre"),
            render: (text, row) => `${row.nombre}`,
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <>
                        <span className="edit-table" onClick={() => toggleOpenUpdateTipo(row)}>
                            <i id='icon-button' className="fas fa-edit"></i>
                        </span>

                        <span className="delete-table" onClick={() => handleDeleteTipo(row)}>
                            <i id='icon-button' className="fas fa-trash-alt"></i>
                        </span>
                    </>
                );
            },
        },
    ];

    const columnsUnits = [
        {
            title: 'Nombre',
            dataIndex: ['nombre'],
            ...getColumnSearchProps("nombre"),
            render: (text, row) => `${row.nombre}`,
        },
        {
            title: 'Abreviación',
            dataIndex: ['abreviacion'],
            ...getColumnSearchProps("abreviacion"),
            render: (text, row) => `${row.abreviacion}`,
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <>
                        <span className="edit-table" onClick={() => toggleOpenUpdateUnit(row)}>
                            <i id='icon-button' className="fas fa-edit"></i>
                        </span>

                        <span className="delete-table" onClick={() => handleDeleteUnit(row)}>
                            <i id='icon-button' className="fas fa-trash-alt"></i>
                        </span>
                    </>
                );
            },
        },
    ];

    return (
        <>
            {isFetchingMarks || isFetchingTypes
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Marcas</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <>
                    <Row style={{ paddingLeft: 50, paddingRight: 90}}>
                        <Col lg={6} style={{ paddingRight: 50 }}>
                            <div style={{ backgroundColor: '#ffffff', padding: 50, borderRadius: 10 }}>
                                <div className='d-flex justify-content-between'>
                                    <h3>Marcas</h3>
                                    <Button className='btn mb-3 ' style={{ backgroundColor: '#14cc60', border: 0, width: 'auto' }} type="button" onClick={toggleCreateMarca}>
                                        <i className="fas fa-plus mr-2"></i> Añadir Marca
                                    </Button>
                                </div>
                                <Table style={{ width: '100%' }}
                                    className='animate__animated animate__fadeIn'
                                    dataSource={marks}
                                    columns={columnsMarks}
                                    rowKey={record => record}
                                    scroll={{ y: 200 }}
                                    size="small"
                                    pagination={false} />
                            </div>

                            <ModalCreateMark show={showCreateMarca} toggle={toggleCreateMarca} />
                            {showUpdateMark.data && <ModalUpdateMark show={showUpdateMark.show} data={showUpdateMark.data} toggle={toggleCloseUpdateMark} />}
                        </Col>


                        <Col lg={6} style={{ paddingLeft: 50 }}>
                            <div style={{ backgroundColor: '#ffffff', padding: 50, borderRadius: 10 }}>
                                <div className='d-flex justify-content-between'>
                                    <h3>Tipos de Material</h3>
                                    <Button className='btn mb-3 ' style={{ backgroundColor: '#14cc60', border: 0, width: 'auto' }} type="button" onClick={toggleCreateTipo}>
                                        <i className="fas fa-plus mr-2"></i> Añadir Tipo
                                    </Button>
                                </div>
                                <Table style={{ width: '100%' }}
                                    className='animate__animated animate__fadeIn'
                                    dataSource={types}
                                    columns={columnsTypes}
                                    rowKey={record => record}
                                    scroll={{ y: 200 }}
                                    size="small"
                                    pagination={false} />
                            </div>
                            <ModalCreateType show={showCreateTipo} toggle={toggleCreateTipo} />
                            {showUpdateTipo.data && <ModalUpdateType show={showUpdateTipo.show} data={showUpdateTipo.data} toggle={toggleCloseUpdateTipo} />}
                        </Col>


                        <Col lg={6} style={{ paddingRight: 50, marginTop: 50, marginBottom: 50 }}>
                            <div style={{ backgroundColor: '#ffffff', padding: 50, borderRadius: 10 }}>
                                <div className='d-flex justify-content-between'>
                                    <h3>Unidades de Medida</h3>
                                    <Button className='btn mb-3 ' style={{ backgroundColor: '#14cc60', border: 0, width: 'auto' }} type="button" onClick={toggleCreateUnit}>
                                        <i className="fas fa-plus mr-2"></i> Añadir Unidad
                                        </Button>
                                </div>
                                <Table style={{ width: '100%' }}
                                    className='animate__animated animate__fadeIn'
                                    dataSource={units}
                                    columns={columnsUnits}
                                    rowKey={record => record}
                                    scroll={{ y: 200 }}
                                    size="small"
                                    pagination={false} />
                            </div>
                            <ModalCreateUnit show={showCreateUnit} toggle={toggleCreateUnit} />
                            {showUpdateUnit.data && <ModalUpdateUnit show={showUpdateUnit.show} data={showUpdateUnit.data} toggle={toggleCloseUpdateUnit} />}
                        </Col>
                    </Row>
                </>

            }
        </>
    )
}

export default Extras
