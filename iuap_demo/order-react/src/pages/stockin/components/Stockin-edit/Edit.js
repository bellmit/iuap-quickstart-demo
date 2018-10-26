import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";
import queryString from 'query-string';
import { Switch, InputNumber,Loading, Table, Button, Col, Row, Icon, InputGroup, FormControl, Checkbox, Modal, Panel, PanelGroup, Label, Message, Radio } from "tinper-bee";
import Header from "components/Header";
import options from "components/RefOption";
import DatePicker from 'bee-datepicker';
import Form from 'bee-form';
import Select from 'bee-select';
import RefWithInput from 'yyuap-ref/dist2/refWithInput'
import moment from "moment";
import 'yyuap-ref/dist2/yyuap-ref.css'//参照样式
import './edit.less';
import 'ac-upload/build/ac-upload.css';
import ChildTableStockinSub from '../StockinSub-childtable';
import ChildTableStockinSub01 from '../stockinSub-childtable1'
import { setCookie, getCookie} from "utils";

const FormItem = Form.FormItem;
const Option = Select.Option;
const format = "YYYY-MM-DD HH:mm:ss";

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
                refKeyArraypurchaseunit:[],
                refKeyArraydept:[],
                refKeyArraystockman:[],
                refKeyArraypkStockorg:[],
            fileNameData: props.rowData.attachment || [],//上传附件数据
        }
    }
    async componentWillMount() {
        await actions.Stockin.getOrderTypes();
        let searchObj = queryString.parse(this.props.location.search);
        let { btnFlag } = searchObj;
        if (btnFlag && btnFlag > 0) {
            let { search_id } = searchObj;
            let tempRowData = await actions.Stockin.queryDetail({ search_id });
            let rowData = this.handleRefShow(tempRowData) || {};

            console.log('rowData',rowData);
            this.setState({
                rowData:rowData,
            })
        }

    }
    save = () => {//保存
        this.props.form.validateFields(async (err, values) => {
            values.attachment = this.state.fileNameData;
            let numArray = [
            ];
            for(let i=0,len=numArray.length; i<len; i++ ) {
                values[numArray[i]] = Number(values[numArray[i]]);
            }


            if (err) {
                Message.create({ content: '数据填写错误', color: 'danger' });
            } else {
                let {rowData,
                    refKeyArraypurchaseunit,
                    refKeyArraydept,
                    refKeyArraystockman,
                    refKeyArraypkStockorg,
                } = this.state;
                if (rowData && rowData.id) {
                    values.id = rowData.id;
                    values.ts = rowData.ts;
                }
                values.purchaseunit = refKeyArraypurchaseunit.join();
                values.dept = refKeyArraydept.join();
                values.stockman = refKeyArraystockman.join();
                values.pkStockorg = refKeyArraypkStockorg.join();
                values.stockindate = values.stockindate.format(format);
                values.arrivedate = values.arrivedate.format(format);
                    let {childListStockinSub,cacheArrayStockinSub,delArrayStockinSub} = this.props;
                    // 编辑保存但是未修改参照,修改参照字段为参照id数组
                    if(childListStockinSub) {
                        childListStockinSub.map((item,index)=>{
                                    // 判断参照值是否有改动
                                    let uuid = item.uuid,
                                        refArray = [
                                        ],
                                        tempRefIdName =  [
                                        ],
                                        target = cacheArrayStockinSub.filter(item=>item.uuid==uuid)[0];
                            // 处理单行多个参照
                                    for (let i=0,len=refArray.length; i<len; i++) {
                                        let tempRef = item[refArray[i]+uuid],
                                            tempShowName = item[tempRefIdName[i]];

                                        if(tempRef) {

                                            // 参照有改动
                                            item[refArray[i]] = tempRef;
                                        } else if(tempShowName) {

                                            // 参照无改动
                                            item[refArray[i]] = target[refArray[i]];
                                        }
                                    }


                        })
                    }
                    console.log('save childList',childListStockinSub)
                    console.log('save delArray',delArrayStockinSub);
                    // 添加删除的数组，删除的数组中dr项的值都为1
                    let resultArray = childListStockinSub.concat(delArrayStockinSub);

                    let commitData = {
                        entity : values,
                        sublist:{
                                stockinSubList:resultArray,
                        }
                    };
                    console.log("save values", JSON.stringify(commitData));


                await actions.Stockin.save(
                    commitData,
                );
                // 置空缓存数据和删除数组
                await actions.Stockin.updateState({
                        cacheArrayStockinSub:[],
                        delArrayStockinSub:[],
                })
            }
        });
    }

    // 处理参照回显
    handleRefShow = (tempRowData) => {
        let rowData = {};
        if(tempRowData){

            let {
                purchaseunit,purchaseunit_name,
                dept,dept_name,
                stockman,stockman_name,
                pkStockorg,pk_stockorg_name,
            } = tempRowData;

            this.setState({
                refKeyArraypurchaseunit: purchaseunit?purchaseunit.split(','):[],
                refKeyArraydept: dept?dept.split(','):[],
                refKeyArraystockman: stockman?stockman.split(','):[],
                refKeyArraypkStockorg: pkStockorg?pkStockorg.split(','):[],
            })
            rowData = Object.assign({},tempRowData,
                {
                    purchaseunit:purchaseunit_name,
                    dept:dept_name,
                    stockman:stockman_name,
                    pkStockorg:pk_stockorg_name,
                }
            )
        }
        return rowData;
    }

    onBack = async() => {
            await actions.Stockin.updateState({
                    childListStockinSub: [],
                    cacheArraStockinSub:[],
                    delArrayStockinSub:[],
            })
        window.history.go(-1);
    }

    // 动态显示标题
    onChangeHead = (btnFlag) => {
        let titleArr = ["新增","编辑","详情"];
        return titleArr[btnFlag]||'新增';
    }


    arryDeepClone = (array)=>{
        let result = [];
        if(array){
            array.map((item)=>{
                let temp = Object.assign([],item);
                result.push(temp);
            })
        }
    }

    // 通过search_id查询数据

    render() {
        const self = this;

        let { btnFlag,appType, id, processDefinitionId, processInstanceId } = queryString.parse(this.props.location.search);
        btnFlag = Number(btnFlag);
        let {rowData,
                    refKeyArraypurchaseunit,
                    refKeyArraydept,
                    refKeyArraystockman,
                    refKeyArraypkStockorg,
        } = this.state;

        let {
                cacheArrayStockinSub,
                delArrayStockinSub,
                childListStockinSub,
        } = this.props;

        let childObj = {
                cacheArrayStockinSub,
                delArrayStockinSub,
                childListStockinSub,
        }

        let title = this.onChangeHead(btnFlag);
        let { stockindate,stockinno,pkPurchase,stockman_name,stockintype,billstatus,purchaseunit,purchaseman,memo,purchaseunit_name,purchaseman_name,dept_name,dept,pk_stockorg_name,stockman,pkStockorg,supplier,stockarea,purchaseno,arrivedate, } = rowData;
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='Stockin-detail'>
                <Loading
                    showBackDrop={true}
                    loadingType="line"
                    show={this.props.showLoading}
                />
                <Header title={title} back={true} backFn={this.onBack}>
                    {(btnFlag < 2) ? (
                        <div className='head-btn'>
                            <Button className='head-cancel' onClick={this.onBack}>取消</Button>
                            <Button className='head-save' onClick={this.save}>保存</Button>
                        </div>
                    ) : ''}
                </Header>
                <Row className='detail-body'>

                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    入库日期：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format={format}
                                    {
                                    ...getFieldProps('stockindate', {
                                        initialValue: stockindate? moment(stockindate):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择入库日期',
                                        }],
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('stockindate')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    库存单编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||true}
                                        {
                                        ...getFieldProps('stockinno', {
                                            validateTrigger: 'onBlur',
                                            initialValue: stockinno || '',
                                            rules: [{
                                                message: '请输入库存单编号',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('stockinno')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购订单ID：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('pkPurchase', {
                                            validateTrigger: 'onBlur',
                                            initialValue: pkPurchase || '',
                                            rules: [{
                                                type:'string',required: true,pattern:/\S+/ig, message: '请输入采购订单ID',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('pkPurchase')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    入库类别：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('stockintype', {
                                            initialValue: typeof stockintype === 'undefined' ? "" : stockintype ,
                                            rules: [{
                                                required: true, message: '请选择入库类别',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value={ 0 }>生产入库</Option>
                                            <Option value={ 1 }>采购入库</Option>
                                            <Option value={ 2 }>赠送入库</Option>
                                            <Option value={ 3 }>借用入库</Option>
                                            <Option value={ 4 }>退货入库</Option>
                                            <Option value={ 5 }>其他</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('stockintype')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    单据状态：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('billstatus', {
                                            initialValue: typeof billstatus === 'undefined' ? "" : billstatus ,
                                            rules: [{
                                                required: true, message: '请选择单据状态',
                                            }],
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value='init'>已收货</Option>
                                            <Option value='done'>已入库</Option>
                                    </Select>


                                <span className='error'>
                                    {getFieldError('billstatus')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购单位：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '采购单位',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArraypurchaseunit,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraypurchaseunit: temp,
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'purchaseunit',//校验字段
                                        verVal:purchaseunit
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('purchaseunit')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购业务员：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('purchaseman', {
                                            validateTrigger: 'onBlur',
                                            initialValue: purchaseman || '',
                                            rules: [{
                                                type:'string',required: true,pattern:/\S+/ig, message: '请输入采购业务员',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('purchaseman')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    说明：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('memo', {
                                            validateTrigger: 'onBlur',
                                            initialValue: memo || '',
                                            rules: [{
                                                type:'string',required: true,pattern:/\S+/ig, message: '请输入说明',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('memo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    部门：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '部门',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'newdept',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArraydept,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraydept: temp,
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'dept',//校验字段
                                        verVal:dept
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('dept')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    库管员：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '库管员',
                                        refType: 2,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'common_ref_table',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '2',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArraystockman,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraystockman: temp,
                                            })
                                        },
                                        showKey:'peoname',
                                        verification:true,//是否进行校验
                                        verKey:'stockman',//校验字段
                                        verVal:stockman
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('stockman')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    库存组织：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={options({
                                                  title: '库存组织',
                                        refType: 1,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'neworganizition',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '1',
                                            locale:getCookie('u_locale'),
                                        },

                                        keyList:refKeyArraypkStockorg,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraypkStockorg: temp,
                                            })
                                        },
                                        showKey:'refname',
                                        verification:true,//是否进行校验
                                        verKey:'pkStockorg',//校验字段
                                        verVal:pkStockorg
                                    })} form={this.props.form}/>


                                <span className='error'>
                                    {getFieldError('pkStockorg')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    供应商：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('supplier', {
                                            validateTrigger: 'onBlur',
                                            initialValue: supplier || '',
                                            rules: [{
                                                type:'string',required: true,pattern:/\S+/ig, message: '请输入供应商',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('supplier')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    仓库：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('stockarea', {
                                            validateTrigger: 'onBlur',
                                            initialValue: stockarea || '',
                                            rules: [{
                                                type:'string',required: true,pattern:/\S+/ig, message: '请输入仓库',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('stockarea')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购订单编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2||false}
                                        {
                                        ...getFieldProps('purchaseno', {
                                            validateTrigger: 'onBlur',
                                            initialValue: purchaseno || '',
                                            rules: [{
                                                type:'string',required: true,pattern:/\S+/ig, message: '请输入采购订单编号',
                                            }],
                                        }
                                        )}
                                    />


                                <span className='error'>
                                    {getFieldError('purchaseno')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    到货日期：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format={format}
                                    {
                                    ...getFieldProps('arrivedate', {
                                        initialValue: arrivedate? moment(arrivedate):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择到货日期',
                                        }],
                                    }
                                    )}
                                />


                                <span className='error'>
                                    {getFieldError('arrivedate')}
                                </span>
                            </Col>
                </Row>

                        <div className="master-tag">
                            <div className="childhead">
                                <span className="workbreakdown" >入库单子表</span>
                            </div>
                        </div>
                        <ChildTableStockinSub btnFlag={btnFlag} {...childObj}/>
                        <div className="master-tag">
                            <div className="childhead">
                                <span className="workbreakdown" >入库单孙表</span>
                            </div>
                        </div>
                        <ChildTableStockinSub01 btnFlag={btnFlag} {...childObj}/>

            </div>
        )
    }
}

export default Form.createForm()(Edit);
