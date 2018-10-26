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

class TestDemoForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            refKeyArraytestOrg:"",
            bpmState: '',
            testOrgName: '',
            testName: '',
        }
    }
    componentWillMount(){
        // 获得测试样例列表数据
        actions.TestDemo.getOrderTypes();
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
                refKeyArraytestOrg,
            } = this.state;
            if(refKeyArraytestOrg){
                values.testOrg = refKeyArraytestOrg
            }else {
                values.testOrg = "";
            }
            await actions.TestDemo.loadList(values);
        });


    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
            refKeyArraytestOrg:'',
            testOrg:'',
            bpmState:'',
            testOrgName:'',
            testName:'',
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let self = this;
        let {
            refKeyArraytestOrg,
        } = this.state;
        return (
            <SearchPanel
                    className='TestDemo-form'
                    form={this.props.form}
                    reset={this.reset}
                    search={this.search}>
                <Row>

                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>机构Id</Label>


                                    <RefWithInput option={options({
                                                  title: '机构Id',
                                        refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'bd_common_org',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '6',
                                        },
                                        keyList:(refKeyArraytestOrg && refKeyArraytestOrg.split(',')) || [],//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.id)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraytestOrg: temp.join(),
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'testOrg',//校验字段
                                        verVal:""
                                    })} form={this.props.form}/>
                                </FormItem>
                            </Col>
                            <Col md={4} xs={6}>
                                <FormItem>
                                    <Label>流程状态</Label>

                                    <Select
                                            {
                                            ...getFieldProps('bpmState', {
                                            initialValue: '',
                                        })
                                    }
                                    >
                                            <Option value="">请选择</Option>
                                                <Option value="0">未启动</Option>
                                                <Option value="1">流转中</Option>
                                                <Option value="2">正常结束</Option>
                                                <Option value="3">异常结束</Option>
                                    </Select>

                                </FormItem>
                            </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(TestDemoForm)