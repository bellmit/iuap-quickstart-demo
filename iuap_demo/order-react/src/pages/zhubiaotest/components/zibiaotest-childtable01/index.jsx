import React, { Component } from 'react';
import { actions ,connect } from "mirrorx";
import queryString from 'query-string';
import PaginationTable from 'components/PaginationTable';
import options from "components/RefOption";
import RefWithInput from 'yyuap-ref/dist2/refWithInput';
import Form from 'bee-form';
import { 
    InputNumber, InputGroup,FormControl, 
    Loading, 
    Table, 
    Button, 
    Row,Col, 
    Icon, 
    Checkbox, Modal, 
    Panel, PanelGroup, 
    Label, 
    Message, 
    Radio,
    Pagination
} from "tinper-bee";

import Select from 'bee-select';
import DatePicker from 'bee-datepicker';
import moment from "moment";
import zhCN from "rc-calendar/lib/locale/zh_CN";
import NoData from 'components/NoData';

import "bee-datepicker/build/DatePicker.css";
import './index.less'

moment.locale('zh-cn');

const format = "YYYY-MM-DD HH:mm:ss";
const Option = Select.Option;

let id = 0;
class ChildTable01 extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            selectData:[],
            editFlag:true,
            
        };
        let {btnFlag} = this.props;
        this.editFlag = btnFlag ? btnFlag<2 : true;
        // console.log("editFlag",this.editFlag);
        
        this.column = [
            {
                title: "pk_zhubiao",
                dataIndex: "pkZhubiao",
                key: "pkZhubiao",
                width: 150,
                render: (text, record, index) => this.
                renderColumns
                
                
                
                
                
                (text, record, index, "pkZhubiao",this.editFlag)
            },
            {
                title: "age",
                dataIndex: "age",
                key: "age",
                width: 150,
                render: (text, record, index) => this.
                renderColumns
                
                
                
                
                
                (text, record, index, "age",this.editFlag)
            },
            {
                title: "操作",
                dataIndex: "d",
                key: "d",
                width: 100,
                render:(text, record, index)=> {
                    return  (
                        
                        <div className='operation-btn'>
                            {
                                this.editFlag?<i size='sm' className='uf uf-del del-btn' onClick={() => { this.onChildDel(record, index) }}></i> :text
                            }
                        </div>
                    ) 
                        
                    
                }
            }]
            this.adjustColumn();
    }

    // 查看状态下删除操作列
    adjustColumn = () => {
        let self = this;
        if(!self.editFlag) {
            this.column.pop();
        }
    }

    // 普通编辑框渲染
    renderColumns = (text, record,index, column,editFlag) =>{
        return (
            <this.EditableCell
                editable={editFlag}
                value={text}
                onChange={value => this.handleChange(value, index, column)}
            />
        );
    }

    EditableCell = ({editable,value,onChange}) =>(
        <div>
            {editable
                ? <FormControl value={value} onChange={value => onChange(value)} />
                : value
            }
        </div>
    )

    handleChange = (value, index, column)=>{
        const newData = [...this.props.childListzibiaotest01];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        // debugger
        if (target) {
            target[column] = value;
            actions.zhubiaotest.updateState({
                list: newData
            });
        }
    }

    //渲染整型数字列
    renderColumnsInt = (text, record,index, column,editFlag) => {
        return (
            <this.EditableCellInputNumber
                editable={editFlag}
                value={text}
                onChange={value => this.handleChangeNumber(value, index, column)}
            />
        );
    }

     //行编辑InputNumber
    EditableCellInputNumber = ({ editable, value,onChange }) => (
        <div>
            {editable
                ? <InputNumber
                    iconStyle="one"
                    max={9999}
                    min={0}
                    step={ 1}
                    value={parseInt(value)}
                    onChange={value => onChange(value)}
                />
                : value
            }
        </div>
    );

    handleChangeNumber = (value, index, column)=>{
        const newData = [...this.props.childListzibiaotest01];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        if (target) {
            target[column] = parseInt(value);
            actions.zhubiaotest.updateState({
                list: newData
            });
        }
    }

    // 渲染浮点类型数字列
    renderColumnsFloat = (text, record,index, column,editFlag) => {
        return (
            <this.EditableCellFloat
                editable={editFlag}
                value={text}
                onChange={value => this.handleChangeFloat(value, index, column)}
            />
        );
    }

     //行编辑InputNumber
     EditableCellFloat = ({ editable, value,onChange }) => (
        <div>
            {editable
                ? <InputNumber
                    precision={2}
                    min={0}
                    step={ 1}
                    value={value}
                    onChange={value => onChange(value)}
                />
                : value
            }
        </div>
    );

    handleChangeFloat = (value, index, column)=>{
        const newData = [...this.props.childListzibiaotest01];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        if (target) {
            target[column] = value;
            actions.zhubiaotest.updateState({
                list: newData
            });
        }
    }

    // 渲染时间列
    renderDatePicker = (text, record,index, column,editFlag) =>{
        return (
            <this.EditableCellDatePicker
                editable={editFlag}
                value={text}
                onChange={value => this.handleChangeDate(value, index, column)}
            />
        )
    }

    EditableCellDatePicker = ({ editable, value, onChange }) => (
        <div>
            {
                editable?(
                    <DatePicker
                        format={format}
                        locale={zhCN}
                        // onSelect={this.onSelect}
                        defaultValue={moment()}
                        onChange={value => onChange(value)}
                        value={moment(value)}
                    />
               ) 
               :moment(value).format(format)
            }
        </div>
    )

    handleChangeDate = (value, index, column)=> {
        // console.log("date",value.toISOString());
        const newData = [...this.props.childListzibiaotest01];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        if (target) {
            target[column] = value.format(format);
            // console.log("newData date",newData)
            actions.zhubiaotest.updateState({
                list: newData
            });
        }
    }
    // 渲染下拉框
    renderSelect = (text, record,index, column,editFlag) => {
        return (
            <this.EditableCellSelect
                editable={editFlag}
                value={text}
                onSelect={value => this.handleTableSelect(value, index, column)}
            />
        );
    }

    EditableCellSelect = ({editable,value,onSelect}) =>(
        <div>
            {editable
                ? (
                    <Select
                        defaultValue = '0'
                        value = {value==1?value+'':'0'}
                        onSelect = {value=>onSelect(value)}
                        >
                        <Option value="0">未发货</Option>
                        <Option value="1">已发货</Option>
                    </Select>
                )
                : value
            }
        </div>
    )

    handleTableSelect = (value, index, column)=> {
        const newData = [...this.props.childListzibiaotest01];
        const target = newData.filter((item,newDataIndex) => index === newDataIndex)[0];
        if (target) {
            console.log("select data",value);
            target[column] = value;
            actions.zhubiaotest.updateState({
                list: newData
            });
        }
    }

    // 增加空行
    onAddEmptyRow = ()=>{
        let tempArray = [...this.props.childListzibiaotest01],
            emptyRow = {
                        pkZhubiao:'',
                        age:'',
            };
            // UUID用于表示新增数据，在保存数据时需要删掉uuid字段
            // let uuid = this.guid();
            let uuid = setTimeout(function(){},1);
            emptyRow['uuid'] = uuid;
            tempArray.push(emptyRow);
            actions.zhubiaotest.updateState({childListzibiaotest01:tempArray})
    }
    onAddEmptyRow = ()=>{
        let tempArray = [...this.props.childListzibiaotest0101],
            emptyRow = {
                        pkZhubiao:'',
                        age:'',
            };
            // UUID用于表示新增数据，在保存数据时需要删掉uuid字段
            // let uuid = this.guid();
            let uuid = setTimeout(function(){},1);
            emptyRow['uuid'] = uuid;
            tempArray.push(emptyRow);
            actions.zhubiaotest.updateState({childListzibiaotest0101:tempArray})
    }
    // 产生uuid备用
    guid = ()=>{
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    // 子表删除
    onChildDel = async (record, index)=>{

        console.log("行删除",record,index);
        let childList = this.deepClone("childListzibiaotest01"),
            cacheArray = this.deepClone("cacheArrayzibiaotest"),
            id = record['id'],
            uuid = record['uuid'],
            delArray = this.deepClone('delArrayzibiaotest');
        
        let childLen = childList.length,
            cacheLen = cacheArray.length;

        if(uuid) {
            let tempIndex = 0;
            for(let i=0;i<childLen;i++) {
                let item = Object.assign([],childList[i]);
                let temp = item.uuid;
                if(temp && temp==uuid){
                    tempIndex = i;
                }
                
            }
            let delItem = childList[tempIndex];
            let delItemId = delItem.id;
            if(delItemId){
                delArray.push(Object.assign({},childList[tempIndex],{dr:1}));
            }
            childList.splice(tempIndex,1);
            console.log("delArray",delArray);
        }
        

        console.log("this.props.childListzibiaotest01",this.props.childListzibiaotest01);
        console.log("删除后",childList,cacheArray)
        
        await actions.zhubiaotest.updateState({
            childListzibiaotest01:childList,
            cacheArrayzibiaotest:cacheArray,
            delArrayzibiaotest:delArray
        })

    }

    deepClone = (param)=>{
        let array = [];
        this.props[param].map(item=>{
            let temp = Object.assign({},item);
            array.push(item);
        })
        return array;
    }

    render() {
        let childList = [...this.props.childListzibiaotest01];
        return (
            <div className="child-table">
                <div className="chidtable-operate-btn">
                    {this.editFlag ? <Button size='sm' colors="primary" onClick={this.onAddEmptyRow}>增行</Button> :"" }
                </div>
                <Row className='table-list'>
                    <Col md={12}>
                        <Table
                            loading={{ show: this.state.loading, loadingType: "line" }}
                            bordered
                            emptyText={() => <NoData />}
                            data={childList}
                            rowKey={r => r.id}
                            columns={this.column}
                            scroll={{ x: '100%', y: 520 }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Form.createForm()(ChildTable01);
