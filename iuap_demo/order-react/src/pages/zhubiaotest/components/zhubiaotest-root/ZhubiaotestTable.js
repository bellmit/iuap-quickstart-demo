import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import ZhubiaotestTable from '../zhubiaotest-table';
import ZhubiaotestForm from '../zhubiaotest-form';

import './index.less';

/**
 * ZhubiaotestRoot Component
 */
class ZhubiaotestRoot  extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    /**
     *
     */
    componentWillMount() {
        this.getTableData();
    }
    /**
     * 获取table表格数据
     */
    getTableData = () => {
        actions.zhubiaotest.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='zhubiaotest-root'>
                <Header title='zhubiaotest' back={true}/>
                <ZhubiaotestForm { ...this.props }/>
                <ZhubiaotestTable { ...this.props }/>
            </div>
        )
    }
}
export default ZhubiaotestRoot;