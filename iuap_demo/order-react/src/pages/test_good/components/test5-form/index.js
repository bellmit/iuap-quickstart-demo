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

class Test5Form extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: '',
        }
    }
    componentWillMount(){
        // 获得单字段列表数据
        actions.test5.getOrderTypes();
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
            } = this.state;
            await actions.test5.loadList(values);
        });


    }
    /**
     * 重置
     */
    reset = () => {
        this.setState({
            name:'',
        })
    }
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        let { orderTypes } = this.props;
        let self = this;
        let {
        } = this.state;
        return (
            <SearchPanel
                    className='test5-form'
                    form={this.props.form}
                    reset={this.reset}
                    search={this.search}>
                <Row>

                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(Test5Form)