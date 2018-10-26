import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import TestDemoTable from './components/TestDemo-root/TestDemoTable';
import TestDemoSelectTable from './components/TestDemo-root/TestDemoSelectTable';
import TestDemoPaginationTable from './components/TestDemo-root/TestDemoPaginationTable';
import TestDemoEdit from './components/TestDemo-edit/Edit';
import TestDemoBpmChart from './components/TestDemo-bpm-chart'
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedTestDemoTable = connect( state => state.TestDemo, null )(TestDemoTable);
export const ConnectedTestDemoSelectTable = connect( state => state.TestDemo, null )(TestDemoSelectTable);
export const ConnectedTestDemoPaginationTable = connect( state => state.TestDemo, null )(TestDemoPaginationTable);
export const ConnectedTestDemoEdit = connect( state => state.TestDemo, null )(TestDemoEdit);
export const ConnectedTestDemoBpmChart = connect( state => state.TestDemo, null )(TestDemoBpmChart);
