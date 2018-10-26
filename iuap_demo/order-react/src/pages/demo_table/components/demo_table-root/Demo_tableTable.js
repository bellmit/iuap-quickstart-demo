import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import Demo_tableTable from '../demo_table-table';
import Demo_tableForm from '../demo_table-form';

import './index.less';

/**
 * Demo_tableRoot Component
 */
class Demo_tableRoot  extends Component {
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
        actions.demo_table.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='demo_table-root'>
                <Header title='demo主表' back={true}/>
                <Demo_tableForm { ...this.props }/>
                <Demo_tableTable { ...this.props }/>
            </div>
        )
    }
}
export default Demo_tableRoot;