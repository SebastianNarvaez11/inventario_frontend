import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReversions} from '../../redux/actions/reversionActions'
import { Table, Input, Button as ButtonAntd, Switch } from 'antd';
import { Row, Button, Badge } from "reactstrap";
import { ToastDelete } from '../../assets/alerts'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import Loader from "react-loader-spinner";

const Reversions = () => {

    const { reversions, isFetchingReversions } = useSelector(state => state.reversionReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (reversions.length === 0) {
            dispatch(fetchReversions());
        }
        // eslint-disable-next-line
    }, [reversions.length]);



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
            title: 'Fecha',
            dataIndex: ['date_created'],
            ...getColumnSearchProps("date_created"),
            render: (text, row) => `${row.date_created}`,
        },
        {
            title: 'Comentario',
            dataIndex: ['comment'],
            ...getColumnSearchProps("comment"),
            render: (text, row) => `${row.comment} `,
        },
        {
            title: 'Realizada por',
            dataIndex: ['user', 'first_name'],
            ...getColumnSearchProps("user.first_name"),
            render: (text, row) => `${row.user.first_name} ${row.user.last_name}`,
        },
    ];


    return (
        <>
            {isFetchingReversions
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Historial</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <div style={{ paddingLeft: 50 }}>
                    <h2>Supervisión de Acciones</h2>
                    <Row style={{ paddingRight: 90, marginTop: 50 }}>
                        <Table style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn table-ant'
                            dataSource={reversions}
                            columns={columns}
                            rowKey={record => record}
                            scroll={{ y: 600 }}
                            pagination={false} />
                    </Row>
                </div>
            }
        </>
    )
}

export default Reversions
