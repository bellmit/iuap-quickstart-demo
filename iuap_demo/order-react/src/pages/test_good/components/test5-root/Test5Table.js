import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import Test5Table from '../test5-table';
import Test5Form from '../test5-form';

import './index.less';

/**
 * Test5Root Component
 */
class Test5Root  extends Component {
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
        actions.test5.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='test5-root'>
                <Header title='单字段' back={true}/>
                <Test5Form { ...this.props }/>
                <Test5Table { ...this.props }/>
            </div>
        )
    }
}
export default Test5Root;