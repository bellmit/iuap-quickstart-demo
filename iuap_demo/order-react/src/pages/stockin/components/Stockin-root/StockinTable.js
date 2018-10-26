import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";

import Header from 'components/Header';
import StockinTable from '../Stockin-table';
import StockinForm from '../Stockin-form';

import './index.less';

/**
 * StockinRoot Component
 */
class StockinRoot  extends Component {
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
        actions.Stockin.loadList();
    }

    render() {
        let { pageSize, pageIndex, totalPages} = this.props;
        return (
            <div className='Stockin-root'>
                <Header title='入库单' back={true}/>
                <StockinForm { ...this.props }/>
                <StockinTable { ...this.props }/>
            </div>
        )
    }
}
export default StockinRoot;