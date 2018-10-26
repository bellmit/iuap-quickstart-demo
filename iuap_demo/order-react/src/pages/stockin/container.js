import React from 'react';
import mirror, { connect } from 'mirrorx';

// 组件引入
import StockinTable from './components/Stockin-root/StockinTable';
import StockinSelectTable from './components/Stockin-root/StockinSelectTable';
import StockinPaginationTable from './components/Stockin-root/StockinPaginationTable';
import StockinEdit from './components/Stockin-edit/Edit';
    import StockinSubChildtable from './components/StockinSub-childtable'
// 数据模型引入
import model from './model'
mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedStockinTable = connect( state => state.Stockin, null )(StockinTable);
export const ConnectedStockinSelectTable = connect( state => state.Stockin, null )(StockinSelectTable);
export const ConnectedStockinPaginationTable = connect( state => state.Stockin, null )(StockinPaginationTable);
export const ConnectedStockinEdit = connect( state => state.Stockin, null )(StockinEdit);
    export const ConnectedStockinSubChildtable  = connect( state => state.Stockin, null )(StockinSubChildtable);
