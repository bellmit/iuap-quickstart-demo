import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import ZhubiaotestTable from './components/zhubiaotest-root/ZhubiaotestTable';
import ZhubiaotestSelectTable from './components/zhubiaotest-root/ZhubiaotestSelectTable';
import ZhubiaotestPaginationTable from './components/zhubiaotest-root/ZhubiaotestPaginationTable';
import ZhubiaotestEdit from './components/zhubiaotest-edit/Edit';
    import ZibiaotestChildtable from './components/zibiaotest-childtable';
    import ZibiaotestChildtable01 from './components/zibiaotest-childtable01'
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedZhubiaotestTable = connect( state => state.zhubiaotest, null )(ZhubiaotestTable);
export const ConnectedZhubiaotestSelectTable = connect( state => state.zhubiaotest, null )(ZhubiaotestSelectTable);
export const ConnectedZhubiaotestPaginationTable = connect( state => state.zhubiaotest, null )(ZhubiaotestPaginationTable);
export const ConnectedZhubiaotestEdit = connect( state => state.zhubiaotest, null )(ZhubiaotestEdit);
export const ConnectedZibiaotestChildtable  = connect( state => state.zhubiaotest, null )(ZibiaotestChildtable);
export const ConnectedZibiaotestChildtable01  = connect( state => state.zhubiaotest01, null )(ZibiaotestChildtable01);

