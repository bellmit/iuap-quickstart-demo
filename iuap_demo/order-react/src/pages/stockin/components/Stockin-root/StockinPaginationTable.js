import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import { actions } from 'mirrorx';
import { Button,Message,Modal, Loading } from 'tinper-bee';
import Select from 'bee-select';
import moment from "moment/moment";
import Header from 'components/Header';
import StockinForm from '../Stockin-form';
import './index.less'
export default class StockinPaginationTable extends Component {
    constructor(props){
        super(props);
        let self=this;
        this.state = {
            // 表格中所选中的数据，拿到后可以去进行增删改查
            selectData: [],
            step: 10,
            showModal:false,
            delData:[],
            column:[
                {
                    title: "入库日期",
                    dataIndex: "stockindate",
                    key: "stockindate",
                     width:200,
                },
                {
                    title: "库存单编号",
                    dataIndex: "stockinno",
                    key: "stockinno",
                     width:200,
                },
                {
                    title: "采购订单ID",
                    dataIndex: "pkPurchase",
                    key: "pkPurchase",
                     width:200,
                },
                {
                    title: "库管员",
                    dataIndex: "stockman_name",
                    key: "stockman_name",
                     width:200,
                },
                {
                    title: "入库类别",
                    dataIndex: "stockintype",
                    key: "stockintype",
                     width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ typeof text === 'undefined' ? "" : text }
                        >
                            <Option value="">请选择</Option>
                                <Option value={ 0 }>生产入库</Option>
                                <Option value={ 1 }>采购入库</Option>
                                <Option value={ 2 }>赠送入库</Option>
                                <Option value={ 3 }>借用入库</Option>
                                <Option value={ 4 }>退货入库</Option>
                                <Option value={ 5 }>其他</Option>
                        </Select>
                    )
                },
                {
                    title: "单据状态",
                    dataIndex: "billstatus",
                    key: "billstatus",
                     width:200,
                    render : (text, record, index) => (
                        <Select
                            className = "hideselect"
                            disabled = {true}
                            value={ typeof text === 'undefined' ? "" : text }
                        >
                            <Option value="">请选择</Option>
                                <Option value={ init }>已收货</Option>
                                <Option value={ done }>已入库</Option>
                        </Select>
                    )
                },
                {
                    title: "采购业务员",
                    dataIndex: "purchaseman",
                    key: "purchaseman",
                     width:200,
                },
                {
                    title: "说明",
                    dataIndex: "memo",
                    key: "memo",
                     width:200,
                },
                {
                    title: "采购单位",
                    dataIndex: "purchaseunit_name",
                    key: "purchaseunit_name",
                     width:200,
                },
                {
                    title: "采购业务员",
                    dataIndex: "purchaseman_name",
                    key: "purchaseman_name",
                     width:200,
                },
                {
                    title: "部门",
                    dataIndex: "dept_name",
                    key: "dept_name",
                     width:200,
                },
                {
                    title: "库存组织",
                    dataIndex: "pk_stockorg_name",
                    key: "pk_stockorg_name",
                     width:200,
                },
                {
                    title: "供应商",
                    dataIndex: "supplier",
                    key: "supplier",
                     width:200,
                },
                {
                    title: "仓库",
                    dataIndex: "stockarea",
                    key: "stockarea",
                     width:200,
                },
                {
                    title: "采购订单编号",
                    dataIndex: "purchaseno",
                    key: "purchaseno",
                     width:200,
                },
                {
                    title: "到货日期",
                    dataIndex: "arrivedate",
                    key: "arrivedate",
                     width:200,
                },
                {
                    title: "操作",
                    dataIndex: "d",
                    key: "d",
                    width:100,
                    fixed: "right",
                    render(text, record, index) {
                        return (
                            <div className='operation-btn'>
                                <i size='sm' className='uf uf-search edit-btn' onClick={() => { self.cellClick(record,2) }}></i>
                                <i size='sm' className='uf uf-pencil edit-btn' onClick={() => { self.cellClick(record,1) }}></i>
                                <i size='sm' className='uf uf-del del-btn' onClick={() => { self.delItem(record, index) }}></i>
                            </div>
                        )
                    }
                }
            ]
        }
    }
    
    componentDidMount(){
        // this.setState({ step: this.props.pageSize })
        actions.Stockin.loadList();//table数据
    }

    tabelSelect = (data) => {//tabel选中数据
        this.setState({
            selectData: data
        })
    }
    /**
     * 编辑,详情，增加
     */

    cellClick = async (record,btnFlag) => {
        await actions.Stockin.updateState({
            rowData : record,
        });

        let id = "";
        if(record){
            id = record["id"];
        }
        actions.routing.push(
            {
                pathname: 'Stockin-edit',
                search:`?search_id=${id}&btnFlag=${btnFlag}`
            }
        )
    }

    // 删除操作
    delItem = (record, index) => {
        this.setState({
            showModal:true,
            delData:[{ id: record.id,ts: record.ts }]
        });

    }

    // 表格勾选回调函数，返回选中数据
    onTableSelectedData = data => {

        this.setState({
            selectData: data
        })
    }

    // 分页单页数据条数选择函数
    onPageSizeSelect = (index, value) => {
        actions.Stockin.loadList({
            pageSize: value
        })
        actions.Stockin.updateState({
            pageSize: value
        })
    }

    // 分页组件点击页面数字索引执行函数
    onPageIndexSelect = value => {
        actions.Stockin.loadList({
            pageIndex: value
        })
        actions.Stockin.updateState({
            pageIndex: value
        })
    }

    // 流程提交成功后回调函数
    onSubmitSuc = async ()=>{
        await actions.Stockin.loadList();
        actions.Stockin.updateState({showLoading:false});
        Message.create({content: '单据提交成功', color: 'success'});

    }
    
    // 提交操作初始执行操作
    onSubmitStart = ()=>{
        actions.Stockin.updateState({showLoading:true});

    }
    // 提交失败回调函数
    onSubmitFail = (error)=>{
        actions.Stockin.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }

    // 撤回成功回调函数
    onRecallSuc = async ()=>{
        console.log("onRecallSuc 成功进入recall回调");
        await actions.Stockin.loadList();
        actions.Stockin.updateState({showLoading:false});
        Message.create({content: '单据撤回成功', color: 'success'});

    }

    // 撤回失败回调函数
    onRecallFail = (error)=>{
        actions.Stockin.updateState({showLoading:false});
        Message.create({content: error.msg, color: 'danger'});

    }


    onSubmitEnd = () => {
        actions.Stockin.updateState({ showLoading: false });
    }

    // 撤回操作执行起始函数,通常用于设置滚动条
    onRecallStart = ()=>{
        actions.Stockin.updateState({showLoading:true});
    }

    // 查看方法
    onExamine = async (text, record, index)=> {
        console.log("record", record);
        await actions.Stockin.updateState({rowData:record});
        await actions.routing.push(
            {
                pathname: 'Stockin-edit',
                detailObj: record,
            }
        )
    }

    // 模态框确认删除
    onModalDel = async (delFlag)=>{
        let {delData} = this.state;
        if(delFlag){
            await actions.Stockin.delItem({
                param: delData
            });
        }
        this.setState({
            showModal:false,
            delData:[]
        })
    }


    // 动态设置列表滚动条x坐标
    getCloumnsScroll = (columns) => {
        let sum = 0;
        columns.forEach((da) => {
            sum += da.width;
        })
        return (sum);
    }

    render(){
        const self=this;
        let { list, showLoading, pageIndex, pageSize, totalPages , total } = this.props;
        let {selectData,showModal} = this.state;
        let exportProps = { total, pageIndex, pageSize, selectData, list};
        console.log("list",list)
        return (
            <div className='Stockin-root'>
                <Header title='入库单'/>
                <StockinForm { ...this.props }/>
                <div className='table-header mt25'>
                    <Button colors="primary" style={{"marginLeft":15}} size='sm' onClick={() => { self.cellClick({},0) }}>
                    新增
                    </Button>
                   


                </div>
                <PaginationTable
                        data={list}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        total = {total}
                        columns={this.state.column}
                        checkMinSize={6}
                        getSelectedDataFunc={this.tabelSelect}
                        onTableSelectedData={this.onTableSelectedData}
                        onPageSizeSelect={this.onPageSizeSelect}
                        onPageIndexSelect={this.onPageIndexSelect}
                />
                <Loading show={showLoading} loadingType="line" />
                <Modal
                        show={showModal}
                        onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>确认删除</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        是否删除选中内容
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={()=>this.onModalDel(false)} shape="border" style={{ marginRight: 50 }}>关闭</Button>
                        <Button onClick={()=>this.onModalDel(true)} colors="primary">确认</Button>
                    </Modal.Footer>
                </Modal>
            </div>

        )

    }
}