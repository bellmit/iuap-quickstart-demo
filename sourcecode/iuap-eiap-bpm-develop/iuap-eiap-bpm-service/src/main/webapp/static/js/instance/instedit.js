define(function(require, module, exports) {
    /*
     * 引入静态资源
     */
    var edit = require('text!../../html/instance/instedit.html');
    var tool = require('../../js/tool/instTool.js');
    
    var viewModel = {
        /**
         * 表单数据viewmodel
         */
        formData: new u.DataTable({
            meta: {
                id: {type: 'string'},
                'historicProcessInstance.name': {type: 'string'},
                name: {type: 'string'},
                startTime: {type: 'date'},
                endTime: {type: 'date'},
                dueDate: {type: 'date'},
                'assigneeParticipant.name': {type: 'string'}
            }
        }),

        /**
         * 表单数据viewmodel
         */
        taskOrignData:ko.observableArray(),

        /**
         * 返回列表页面
         * @method function
         * @return {[type]} [description]
         */
        back: function() {
            //跳转回列表页面
            $('body').css('overflow','hidden');
            $('.list-panel').show();
            $('.edit-panel').hide();
        },

        /**
         * 表格数据加载
         */
        loadForm:function(data){
           var localurl = window.flowUrl+"proc_monitor/task/queryHisTasks"; 
 			$.ajax({
                type: 'POST',
                dataType: 'json',
                data: data,
                url: localurl,
                success: function(res) {
	                if(res.status==1){
/*		                viewModel.pagination.element.update({
		        			totalPages: res.data.totalPages,
		        			pageSize: res.data.size,
		        			currentPage: res.data.number + 1,
		        			totalCount: res.data.totalElements
		                });*/
		                viewModel.taskOrignData(res.data);
		                viewModel.formData.removeAllRows();
		                viewModel.formData.setSimpleData(res.data);
		                //viewModel.pagination.count(res.data.totalElements);
		            }
                }
            });
        },

        /**
         * 完成原因字段处理
         */
        /**
        displayComments:function(index){
            var rows = this.taskOrignData();
            if(rows.length == 0)
                return "";
            var comments = rows[index].taskComments;
            if(comments == null||comments.length==0)
                return "";
            return comments[0].message;
        },
        */
        
        displayComments:function(index){
            var rows = this.taskOrignData();
            if(rows.length == 0)
                return "";
            var comments = rows[index].taskComments;
            return comments;
        },

        /*
         *初始化页面，绑定uui
         */
        pageInit:function(params) {

            viewModel.listData = params.listData;
            viewModel.flag = params.flag;
            viewModel.index = params.index;
            viewModel.taskOrignData([]);
            viewModel.formData.clear();
            ko.cleanNode($('.edit-panel')[0]);
            u.createApp({
                el: '.edit-panel',
                model: viewModel
            });

            //分页初始化
            //viewModel.pagination.init();
            
            //流程图绘制
            viewModel.loadImage();
            
            //数据初始加载
            var data = {};
        	data.pageSize=10;
            data.pageNum=1;
            data.processInstanceId=viewModel.listData.getCurrentRow().data.id.value;
            viewModel.loadForm(data);
        },
        
        /* 分页*/
/*       pagination: {
           element: null,
           // 用于控制分页控件的显示，条目大于10的时候显示控件
           count: ko.observable(0),
           init: function() {
               // 分页控件初始化
               var ele = $('#instpagination')[0];
               this.element = new u.pagination({
                   el: ele,
                   jumppage: true
               });
               //分页
               this.element.on('pageChange', function (pageIndex) {
                   var data = {};
                   data.pageSize=viewModel.pagination.element.options.pageSize;
                   data.pageNum=pageIndex+1;
                   data.processInstanceId=viewModel.listData.getCurrentRow().data.id.value;
                   viewModel.loadForm(data);
               });
               this.element.on('sizeChange', function (siz) {
                   var data = {};
                   data.pageSize=siz;
                   data.pageNum=1;
                   data.processInstanceId=viewModel.listData.getCurrentRow().data.id.value;
                   viewModel.loadForm(data);
               });
           }
       },*/
       /**
        * 表格数据加载
        */
       loadImage:function(){
    	   
          var processDefinitionId=viewModel.listData.getCurrentRow().data.processDefinitionId.value;
          var processInstanceId=viewModel.listData.getCurrentRow().data.id.value;
           $('#imageframe')[0].src = window.flowUrl+'static/vendor/diagram-viewer/index.html?processDefinitionId='
               + processDefinitionId + '&processInstanceId='
               + processInstanceId;
       }
    };

    return {
        init: function(params) {
            viewModel.pageInit(params);
        },
        html: edit
    };
});
