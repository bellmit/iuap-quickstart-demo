import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Table,Button } from 'tinper-bee'
import moment from "moment/moment";

import './index.less'

// StockinTable 组件定义
class StockinTable extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    /**
     * 编辑,详情，增加
     */
    cellClick = async(record, editFlag) => {

        // 新增、编辑、查看时,先清空子表数据
        await actions.mastertable.updateState({
            childListStockinSub:[],
            cacheArrayStockinSub:[],
        })

        actions.routing.push(
            {
                pathname: 'Stockin-edit',
                detailObj: record,
                editFlag: !!editFlag
            }
        )
    }
    delItem = (record, index) => {
        actions.Stockin.delItem({
            param: [{ id: record.id,ts: record.ts }],
            index: index
        });
    }
    /**
     *
     */
    render(){
        const self = this;
        const column = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                width: 80,
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
                            <Button size='sm' className='edit-btn' onClick={() => { self.cellClick(record, true) }}>编辑</Button>
                            <Button size='sm' className='del-btn' onClick={() => { self.delItem(record, index) }}>删除</Button>
                        </div>
                    )
                }
            }
        ];
        const { list,showLoading,pageSize, pageIndex, totalPages, } = this.props;
        return (
            <div className="table-list">
                <div className='table-header'>
                    <Button
                        size="sm"
                        colors="primary"
                        shape="border"
                        onClick={() => { self.cellClick({}, true) }}>
                        新增
                    </Button>
                </div>
                <Table
                    loading={{show:showLoading,loadingType:"line"}}
                    rowKey={(r,i)=>i}
                    columns={column}
                    data={list}
                />
            </div>
        )
    }
}

export default StockinTable