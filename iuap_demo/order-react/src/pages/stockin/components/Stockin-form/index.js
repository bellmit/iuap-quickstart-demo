import React, { Component } from 'react'
import { actions } from "mirrorx";
import { Switch, InputNumber, Col, Row,FormControl, Label, Select, Radio } from "tinper-bee";
import Form from 'bee-form';
import DatePicker from 'bee-datepicker';
import 'bee-datepicker/build/DatePicker.css';
import SearchPanel from 'components/SearchPanel';
const FormItem = Form.FormItem;
import options from "components/RefOption";
const { RangePicker } = DatePicker;
import RefWithInput from 'yyuap-ref/dist2/refWithInput'
import 'yyuap-ref/dist2/yyuap-ref.css'//参照样式
import './index.less'

class StockinForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            stockindate: '',
            stockinno: '',
            pkPurchase: '',
            stockman_name: '',
            stockintype: '',
            billstatus: '',
            refKeyArraypurchaseunit:"",
            purchaseman: '',
            memo: '',
            purchaseunit_name: '',
            purchaseman_name: '',
            dept_name: '',
            refKeyArraydept:"",
            pk_stockorg_name: '',
            refKeyArraystockman:"",
            refKeyArraypkStockorg:"",
            supplier: '',
            stockarea: '',
            purchaseno: '',
            arrivedate: '',
        }
    }
    componentWillMount(){
        // 获得入库单列表数据
        actions.Stockin.getOrderTypes();
    }
    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error,values) => {
        this.props.form.validateFields(async (err, values) => {
            values.pageIndex = this.props.pageIndex || 0;
            values.pageSize = this.props.pageSize || 10;
            let {
                refKeyArraypurchaseunit,
                refKeyArraydept,
                refKeyArraystockman,
                refKeyArraypkStockorg,
            } = this.state;
            if(refKeyArraypurchaseunit){
                values.purchaseunit = refKeyArraypurchaseunit
            }else {
                values.purchaseunit = "";
            }
            if(refKeyArraydept){
                values.dept = refKeyArraydept
            }else {
                values.dept = "";
            }
            if(refKeyArraystockman){
                values.stockman = refKeyArraystockman
            }else {
                values.stockman = "";
            }
            if(refKeyArraypkStockorg){
                values.pkStockorg = refKeyArraypkStockorg
            }else {
                values.pkStockorg = "";
            }
            await actions.Stockin.loadList(values);
        });


    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
            stockindate:'',
            stockinno:'',
            pkPurchase:'',
            stockman_name:'',
            stockintype:'',
            billstatus:'',
            refKeyArraypurchaseunit:'',
            purchaseunit:'',
            purchaseman:'',
            memo:'',
            purchaseunit_name:'',
            purchaseman_name:'',
            dept_name:'',
            refKeyArraydept:'',
            dept:'',
            pk_stockorg_name:'',
            refKeyArraystockman:'',
            stockman:'',
            refKeyArraypkStockorg:'',
            pkStockorg:'',
            supplier:'',
            stockarea:'',
            purchaseno:'',
            arrivedate:'',
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let self = this;
        let {
            refKeyArraypurchaseunit,
            refKeyArraydept,
            refKeyArraystockman,
            refKeyArraypkStockorg,
        } = this.state;
        return (
            <SearchPanel
                    className='Stockin-form'
                    form={this.props.form}
                    reset={this.reset}
                    search={this.search}>
                <Row>

                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>入库日期</Label>


                                    <RangePicker
                                            defaultValue={this.state.stockindate}
                                            placeholder={'开始 ~ 结束'}
                                    dateInputPlaceholder={['开始', '结束']}
                                    {
                                        ...getFieldProps('stockindate', {
                                            initialValue:'',
                                            onChange:  (v)=> {
                                                this.setState({
                                        stockindate: v
                                                })
                                            }
                                        })
                                    }
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>库存单编号</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('stockinno', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>采购订单ID</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('pkPurchase', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>入库类别</Label>

                                    <Select
                                            {
                                            ...getFieldProps('stockintype', {
                                            initialValue: '',
                                        })
                                    }
                                    >
                                            <Option value="">请选择</Option>
                                                <Option value="0">生产入库</Option>
                                                <Option value="1">采购入库</Option>
                                                <Option value="2">赠送入库</Option>
                                                <Option value="3">借用入库</Option>
                                                <Option value="4">退货入库</Option>
                                                <Option value="5">其他</Option>
                                    </Select>

                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>单据状态</Label>

                                    <Select
                                            {
                                            ...getFieldProps('billstatus', {
                                            initialValue: '',
                                        })
                                    }
                                    >
                                            <Option value="">请选择</Option>
                                                <Option value="init">已收货</Option>
                                                <Option value="done">已入库</Option>
                                    </Select>

                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>采购单位</Label>


                                    <RefWithInput option={options({
                                                  title: '采购单位',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                        },
                                        keyList:(refKeyArraypurchaseunit && refKeyArraypurchaseunit.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraypurchaseunit: temp.join(),
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'purchaseunit',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>采购业务员</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('purchaseman', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>说明</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('memo', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>部门</Label>


                                    <RefWithInput option={options({
                                                  title: '部门',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'newdept',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                        },
                                        keyList:(refKeyArraydept && refKeyArraydept.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraydept: temp.join(),
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'dept',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>库管员</Label>


                                    <RefWithInput option={options({
                                                  title: '库管员',
                                        refType: 2,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'common_ref_table',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '2',
                                        },
                                        keyList:(refKeyArraystockman && refKeyArraystockman.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraystockman: temp.join(),
                                            })
                                        },
                                        showKey:'peoname',
                                        verification:true,//是否进行校验
                                        verKey:'stockman',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>库存组织</Label>


                                    <RefWithInput option={options({
                                                  title: '库存组织',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                        },
                                        keyList:(refKeyArraypkStockorg && refKeyArraypkStockorg.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraypkStockorg: temp.join(),
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'pkStockorg',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>供应商</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('supplier', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>仓库</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('stockarea', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>采购订单编号</Label>
                                    <FormControl
                                            {
                                            ...getFieldProps('purchaseno', {
                                                initialValue: '',
                                            })
                                        }
                                    />


                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>到货日期</Label>


                                    <RangePicker
                                            defaultValue={this.state.arrivedate}
                                            placeholder={'开始 ~ 结束'}
                                    dateInputPlaceholder={['开始', '结束']}
                                    {
                                        ...getFieldProps('arrivedate', {
                                            initialValue:'',
                                            onChange:  (v)=> {
                                                this.setState({
                                        arrivedate: v
                                                })
                                            }
                                        })
                                    }
                                    />
                                </FormItem>
                            </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(StockinForm)