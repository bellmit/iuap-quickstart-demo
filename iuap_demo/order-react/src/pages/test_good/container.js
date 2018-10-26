import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import Test5Table from './components/test5-root/Test5Table';
import Test5SelectTable from './components/test5-root/Test5SelectTable';
import Test5PaginationTable from './components/test5-root/Test5PaginationTable';
import Test5Edit from './components/test5-edit/Edit';
import Test5BpmChart from './components/test5-bpm-chart'
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedTest5Table = connect( state => state.test5, null )(Test5Table);
export const ConnectedTest5SelectTable = connect( state => state.test5, null )(Test5SelectTable);
export const ConnectedTest5PaginationTable = connect( state => state.test5, null )(Test5PaginationTable);
export const ConnectedTest5Edit = connect( state => state.test5, null )(Test5Edit);
export const ConnectedTest5BpmChart = connect( state => state.test5, null )(Test5BpmChart);
