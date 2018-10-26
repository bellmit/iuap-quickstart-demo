/**
 * Created by Administrator on 2016/12/14.
 */
require.config({
    baseUrl: "../",
    paths: {
        'text': window.$uui + "/libs/text/text",
        'css': window.$uui + "/libs/require-css/css",
        'jquery': window.$uui + "/libs/jquery/dist/jquery.min",
        'knockout': window.$uui + "/libs/knockout/dist/knockout.debug",
        'uui': window.$uui + "/libs/uui/js/u",
        'i18next': window.$uui + "/libs/i18next/i18next",
        'bignumber': window.$uui + "/libs/bignumber/bignumber",
        'bootstrap': window.$uui + "/libs/bootstrap/dist/js/bootstrap",
        'zTree': window.$ctx + "/static/trd/zTree_v3/js/jquery.ztree.all-3.5.min",
         'refer': window.$ctx + "/static/js/uiref/refer",
         'reflib':  window.$ctx + "/static/js/uiref/reflib",
         'refGrid':  window.$ctx + "/static/js/uiref/refGrid",
         'refGridtree':  window.$ctx + "/static/js/uiref/refGridtree",
         'refTree':  window.$ctx + "/static/js/uiref/refTree",
         'refcommon': window.$ctx + "/static/js/uiref/refcommon",
         'uiReferComp' : window.$ctx + "/static/js/uiref/uiReferComp",
        /* 'uiReferFormInit' : window.$ctx + "/static/js/rt/uirefer.forminit",*/
       /*  'borderLayout': window.$ctx + "/static/js/ref/jquery.layout_and_plugins",
         'formula2': window.$ctx + '/static/js/rt/formula',
         'moneyuui': window.$ctx + '/static/js/rt/moneyuui',
         'viewDataTable': window.$ctx + '/static/js/rt/view.datatable',
         'dateintervaluui': window.$ctx + '/static/js/rt/dateintervaluui',
         'processapproveuui': window.$ctx + '/static/js/rt/processapproveuui',
         'ratyuui': window.$ctx + '/static/js/rt/ratyuui',*/
        'workflow': window.$ctx + '/static/js/workflow',
        /*'workflowmobile': window.$ctx + '/static/freebill/js/workflowmobile',*/
        'dateutil': window.$ctx + '/static/js/dateutil',
        'approvePanel': window.$ctx + '/static/js/approvePanel'
        /*'formreferuui': window.$ctx + '/static/js/rt/formreferuui',
         'texteditoruui': window.$ctx + '/static/js/rt/texteditoruui',
         'billmarkeruui': window.$ctx + '/static/js/rt/billmarkeruui',
         'fileuui': window.$ctx + '/static/js/rt/fileuui',
         'compatibleuui': window.$ctx + '/static/js/rt/compatibleuui',
         'ajaxfileupload':window.$ctx + "/static/js/filesystem/ajaxfileupload",
         'ossupload':window.$ctx + "/static/js/filesystem/ossupload",
         'cookie':window.$ctx + "/static/js/filesystem/jquery.cookie",
         'interface_file_impl':window.$ctx + "/static/js/filesystem/interface.file.impl",
         'interface_file':window.$ctx + "/static/js/filesystem/interface.file"*/
    },
    shim: {
        'bootstrap':{
            deps:["jquery"]
        },
        'uui': {
            deps: ["jquery", "bootstrap", "i18next"]
        },
        'sco.message':{
            deps: ["jquery"]
        },
        'workflow': {
            deps: ["uui","knockout"]
        },
        'moneyuui': {
            deps: ["jquery",'formula2', "uui"]
        },
        'dateintervaluui':{
            deps :["jquery", "uui"]
        },
        'ratyuui':{
            deps :["jquery", "uui"]
        },
        'texteditoruui':{
            deps:["jquery", window.$ctx + "/static/js/rt/ueditor/ueditor.all.js", 'uui']
        },
        'interface_file_impl':{
            deps:["interface_file"]
        },
        'approvePanel':{
            deps:[
                'uiReferComp',
                'refcommon',
                'refTree',
                'refGrid',
                'refGridtree',
                'reflib',
                'workflow',
                'dateutil'
            ],
            exports:"approvePanel"
        },
        //Éý¼¶²ÎÕÕ
        'reflib':{
            deps: ["jquery"]
        },
        'refer':{
            deps:["jquery","reflib"]
        },
        'sco.message':{
            deps: ["jquery"]
        },
        'refGridtree':{
            deps: ["refer"]
        },
        'refGrid':{
            deps: ["refer"]
        },
        'refTree':{
            deps: ["refer"]
        },
        'refcommon':{
            deps: ["refer"]
        },
        'uiReferFormInit':{
            deps: ["uui"]
        },
        'uiReferComp':{
            deps:["uui"]
        }
        /*'uiReferComp':{
            deps:["uui","uiReferFormInit"],
            init: function () {
                referFormInit();
            }
        }*/
    },
    waitSeconds:60
});