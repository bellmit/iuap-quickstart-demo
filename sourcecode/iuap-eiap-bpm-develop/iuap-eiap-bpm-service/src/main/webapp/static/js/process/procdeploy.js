define(function(require, module, exports) {
    /*
     * 引入静态资源
     */
    var deploy = require('text!../../html/process/procdeploy.html');
    var tool = require('../../js/tool/instTool.js');

    var deploymentId;
    var viewModel = {

        /**
         * 表单模型
         */
        deployData: new u.DataTable({
            meta: {
                id: {type: 'string'},
                name: {type: 'string'},
                'deploymentResponse.deploymentTime': {type: 'string'},
                version: {type: 'string'}
            }
        }),

        /**
         * 返回列表页面
         */
        deBack: function() {
            //跳转回列表页面
            $('.list-panel').show();
            $('.deploy-panel').hide();
            viewModel.deployData.clear();
        },

        /*
         *数据加载
         */
        loadDeploy: function(data) {
            //请求数据
            var obj = {
                url: window.flowUrl+"bmp_proc/process/queryProcList",
                data: data
            };
            var successCallback = function(res){
            	if(res.status==1){
            		/*viewModel.pagination.element.update({
            			totalPages: res.data.totalPages,
            			pageSize: res.data.size,
            			currentPage: res.data.number + 1,
            			totalCount: res.data.totalElements
            		});
            		viewModel.pagination.count(res.data.totalElements);*/
            		viewModel.deployData.removeAllRows();
            		viewModel.deployData.setSimpleData(res.data.data,{unSelect: true});
            	}
            };
            tool.createLoadingAjax(obj,successCallback);
        },

        /*
         *初始化页面，绑定uui
         */
        pageInit: function(params) {
            viewModel.listData = params.listData;
            viewModel.index = params.index;
            viewModel.selectTreeNode = params.selectTreeNode;
            deploymentId = viewModel.listData.getSimpleData()[viewModel.index].procDeployId;
            u.createApp({
                el: '.deploy-panel',
                model: viewModel
            });
            //viewModel.pagination.init();
            // 初次加载数据
            var data = {};
            data.pageSize=999;
            data.pageNum=1;
            data.id=viewModel.listData.getSimpleData()[viewModel.index].id;
            viewModel.loadDeploy(data);
        },
        
        /*
        分页
        */
/*       pagination: {
           element: null,
           // 用于控制分页控件的显示，条目大于10的时候显示控件
           count: ko.observable(0),
           init: function() {
               // 分页控件初始化
               var ele = $('#deploypagination')[0];
               this.element = new u.pagination({
                   el: ele,
                   jumppage: true
               });
               //分页
               this.element.on('pageChange', function (pageIndex) {
                   var data = {};
                   data.pageSize=viewModel.pagination.element.options.pageSize;
                   data.pageNum=pageIndex+1;
                   data.deploymentId=deploymentId;
                   viewModel.loadDeploy(data);
               });
               this.element.on('sizeChange', function (siz) {
                   var data = {};
                   data.pageSize=siz;
                   data.pageNum=1;
                   data.deploymentId=deploymentId;
                   viewModel.loadDeploy(data);
               });
           }
       }*/
    };

    return {
        init: function(params) {
            viewModel.pageInit(params);
        },
        html: deploy
    };
});