import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import TestDemoTable from '../TestDemo-table';
import TestDemoForm from '../TestDemo-form';

import './index.less';

/**
 * TestDemoRoot Component
 */
class TestDemoRoot  extends Component {
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
        actions.TestDemo.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='TestDemo-root'>
                <Header title='测试样例' back={true}/>
                <TestDemoForm { ...this.props }/>
                <TestDemoTable { ...this.props }/>
            </div>
        )
    }
}
export default TestDemoRoot;