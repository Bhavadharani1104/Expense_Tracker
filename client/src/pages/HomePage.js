import React,{useState,useEffect} from 'react';
import {Form, Input, message, Modal, Select, Table,DatePicker} from 'antd';
import {UnorderedListOutlined, AreaChartOutlined, EditOutlined,DeleteOutlined} from '@ant-design/icons';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment';
import Analytics from '../components/Analytics';

const { RangePicker } = DatePicker;

const HomePage = () => {
    const [showModal,setShowModal]=useState(false);
    const [loading,setLoading] = useState(false);
    const [allTransaction , setAllTransaction] = useState([]);
    const [frequency,setFrequency] = useState('7');
    const [selectedDate, setSelectdate] = useState([]);
    const [type,setType] = useState('all');
    const [viewData,setViewData] = useState('table');
    const [editable, setEditable] = useState(null);

    //Table data
    const columns = [
        {
            title:'Date',
            dataIndex:'date',
            key:'date',
            render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>,
        },
        {
            title:'Amount',
            dataIndex:'amount',
            key:'amount',
        },
        {
            title:'Type',
            dataIndex:'type',
            key:'type',
        },
        {
            title:'Category',
            dataIndex:'category',
            key:'category',
        },
        {
            title:'Reference',
            dataIndex:'reference',
            key:'reference',
        },
        {
            title:'Actions',
            render : (text,record) => (
                <div>
                    <EditOutlined onClick={() => {
                        setEditable(record)
                        setShowModal(true)
                    }}/>
                    <DeleteOutlined 
                     className="mx-2" 
                     onClick={() => {
                        handleDelete(record);
                    }}/>
                </div>
            )
        },
    ];

    //getall transactions
    //useEffect Hook
    useEffect(() => {
        const getAllTransactions = async() => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                setLoading(true);
                const res = await axios.post('/transactions/get-transaction',{userid: user._id, frequency,selectedDate,type});
                setLoading(false);
                const transactionsWithKey = res.data.map((transaction) => ({
                    ...transaction,
                    key: transaction._id,
                }));
                setAllTransaction(transactionsWithKey);
                console.log(res.data);
                //setAllTransaction(res.data);
            } catch (error) {
                console.log(error);
                message.error('Fetch Issue with Transaction');
            }
        };
        getAllTransactions();
    }, [frequency, selectedDate,type]);

    //delet handler
    const handleDelete = async(record) => {
        try{
            setLoading(true);
            await axios.post("/transactions/delete-transaction", {transactionId:record._id});
            setLoading(false);
            message.success('Transaction Deleted');
        } catch (error) {
            setLoading(false);
            console.log(error);
            message.error('unable to delete');
        }
    };

    //Form handling
    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            setLoading(true);
            if(editable){
                await axios.post('/transactions/edit-transaction',{payload:{...values,userid:user._id},transactionId: editable._id});
                setLoading(false);
                message.success('Transaction Updated Successfully');
            }else{
                await axios.post('/transactions/add-transaction',{...values, userid:user._id});
                setLoading(false);
                message.success('Transaction Added Successfully');
            }
            setShowModal(false);
            setEditable(null);
        } catch (error) {
            setLoading(false);
            message.error("Failed to add transaction");
        }
    }

    return(
        <Layout>
            {loading && <Spinner />}
            <div className="filters">
                <div>
                    <h6>Select Frequency</h6>
                    <Select value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value="7">Last 1 Week</Select.Option>
                        <Select.Option value="31">Last 1 Month</Select.Option>
                        <Select.Option value="365">Last 1 Year</Select.Option>
                        <Select.Option value="custom">Custom</Select.Option>
                    </Select>
                    {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectdate(values)}/>}
                </div>
                <div>
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)}>
                        <Select.Option value="all">ALL</Select.Option>
                        <Select.Option value="income">INCOME</Select.Option>
                        <Select.Option value="expense">EXPENSE</Select.Option>
                    </Select>
                    {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectdate(values)}/>}
                </div>
                <div className='switch-icons'>
                    <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData("table")} />
                    <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData("analytics")}/>
                </div>
                <div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add New</button>
                </div>
            </div>
            <div className="content">
                {viewData === 'table' ? (<Table  dataSource={allTransaction} columns={columns}/>) : (<Analytics allTransaction = {allTransaction} />)}
            </div>
            <Modal title={editable ? 'Edit Transaction' : 'Add Transaction'} open={showModal} onCancel={() => setShowModal(false)} footer={false}>
                <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>
                    <Form.Item label="Amount" name="amount">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Type" name="type">
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category" name="category">
                        <Select>
                            <Select.Option value="salary">Salary</Select.Option>
                            <Select.Option value="project">Project</Select.Option>
                            <Select.Option value="tip">Tip</Select.Option>
                            <Select.Option value="food">Food</Select.Option>
                            <Select.Option value="housing">Housing</Select.Option>
                            <Select.Option value="transportation">Transportation</Select.Option>
                            <Select.Option value="fees">Fees</Select.Option>
                            <Select.Option value="medical">Medical</Select.Option>
                            <Select.Option value="bills">Bills</Select.Option>
                            <Select.Option value="tax">Tax</Select.Option>
                            <Select.Option value="other expenses">Other Expenses</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date" name="date">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item label="Reference" name="reference">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input type="text" />
                    </Form.Item>
                    <div className='d-flex justify-content-end'>
                        <button type="submit" className='btn btn-primary'> SAVE </button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    )
}

export default HomePage;