import React, { Component } from 'react';
import { Button,Checkbox,Table } from 'tinper-bee';
import moment from "moment/moment";
import multiSelect from "tinper-bee/lib/multiSelect.js";
import Header from 'components/Header';
import StockinForm from '../Stockin-form';
const MultiSelectTable = multiSelect(Table, Checkbox);

export default class StockinSelectTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectData:[]
        }
    }
    /**
     * 编辑
     */
    edit = () =>{
        console.log('进入编辑');
    }
    /**
     * tabel选中数据
     * @param {*} data
     */
    tabelSelect = (data) => {
        this.setState({
            selectData: data
        })
    }
    render(){
        const self=this;
        const { list,showLoading,pageSize, pageIndex, totalPages } = this.props;
        const column = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                width: 100,
                render(record, text, index) {
                    return index + 1;
                }
            },
                {
                    title: "入库日期",
                    dataIndex: "stockindate",
                    key: "stockindate",
                    width: 100,
                },
                {
                    title: "库存单编号",
                    dataIndex: "stockinno",
                    key: "stockinno",
                    width: 100,
                },
                {
                    title: "采购订单ID",
                    dataIndex: "pkPurchase",
                    key: "pkPurchase",
                    width: 100,
                },
                {
                    title: "库管员",
                    dataIndex: "stockman_name",
                    key: "stockman_name",
                    width: 100,
                },
                {
                    title: "入库类别",
                    dataIndex: "stockintype",
                    key: "stockintype",
                    width: 100,
                },
                {
                    title: "单据状态",
                    dataIndex: "billstatus",
                    key: "billstatus",
                    width: 100,
                },
                {
                    title: "采购单位",
                    dataIndex: "purchaseunit",
                    key: "purchaseunit",
                    width: 100,
                },
                {
                    title: "采购业务员",
                    dataIndex: "purchaseman",
                    key: "purchaseman",
                    width: 100,
                },
                {
                    title: "说明",
                    dataIndex: "memo",
                    key: "memo",
                    width: 100,
                },
                {
                    title: "采购单位",
                    dataIndex: "purchaseunit_name",
                    key: "purchaseunit_name",
                    width: 100,
                },
                {
                    title: "采购业务员",
                    dataIndex: "purchaseman_name",
                    key: "purchaseman_name",
                    width: 100,
                },
                {
                    title: "部门",
                    dataIndex: "dept_name",
                    key: "dept_name",
                    width: 100,
                },
                {
                    title: "部门",
                    dataIndex: "dept",
                    key: "dept",
                    width: 100,
                },
                {
                    title: "库存组织",
                    dataIndex: "pk_stockorg_name",
                    key: "pk_stockorg_name",
                    width: 100,
                },
                {
                    title: "库管员",
                    dataIndex: "stockman",
                    key: "stockman",
                    width: 100,
                },
                {
                    title: "库存组织",
                    dataIndex: "pkStockorg",
                    key: "pkStockorg",
                    width: 100,
                },
                {
                    title: "供应商",
                    dataIndex: "supplier",
                    key: "supplier",
                    width: 100,
                },
                {
                    title: "仓库",
                    dataIndex: "stockarea",
                    key: "stockarea",
                    width: 100,
                },
                {
                    title: "采购订单编号",
                    dataIndex: "purchaseno",
                    key: "purchaseno",
                    width: 100,
                },
                {
                    title: "到货日期",
                    dataIndex: "arrivedate",
                    key: "arrivedate",
                    width: 100,
                },
            {
                title: "操作",
                dataIndex: "e",
                key: "e",
                render(text, record, index) {
                    return (
                        <div className='operation-btn'>
                            <Button size='sm' className='edit-btn' onClick={() => { self.edit(record,true) }}>编辑</Button>
                        </div>
                    )
                }
            }
        ];
        return (
            <div className="Stockin-select-table">
                <Header title='入库单' back={true} />
                <StockinForm { ...this.props }/>
                <div className="table-list">
                    <MultiSelectTable
                        loading={{ show: showLoading, loadingType: "line" }}
                        rowKey={(r, i) => i}
                        columns={column}
                        data={list}
                        multiSelect={{ type: "checkbox" }}
                        getSelectedDataFunc={this.tabelSelect}
                    />
                </div>
            </div>
        )
    }
}