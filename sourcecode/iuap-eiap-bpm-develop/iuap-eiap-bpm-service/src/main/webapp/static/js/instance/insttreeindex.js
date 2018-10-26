define(function(require, module, exports) {
    /*
     * 引入静态资源
     */
    var list = require('text!../../html/instance/instmainindex.html');
    var styles = require('css!../../css/index.css');
    var styles = require('css!../../css/cover.css');
    var styles = require('css!../../css/main.css');
    var styles = require('css!../../css/table.css');
    var styles = require('css!../../css/common.css');
    var styles = require('css!../../css/iconfont/iconfont.css');
    var tool = require('../../js/tool/instTool.js');
  
    var treeData;
    var selectTreeNode;
    var treeFun = {
        /**
         * 树结点点击事件
         */
        getListInfo: function (event, treeId, treeNode) {
        	var data = {};
        	data.pageSize=10;
            data.pageNum=1;
            data.categoryId=treeNode.id;
            data.finished=$('.cur').attr('id');
            viewModel.loadList(data);
            selectTreeNode = treeNode;
        }
    };

    /**
     * 状态映射
     */
    var _stateName = function(value, format, type){
        if (value() === 'run')
            return '运行';
        if (value() === 'suspended')
            return '挂起';
        if (value() === 'delete')
            return '终止';
        if (value() === 'end')
            return '完成';
    };
    u.stateName = function (value, format) {
        return _stateName(value, format, 'date');
    };

    var viewModel = {

        /**
         * 树模型
         */
        treeSetting: {
            view: {
                showLine: false,
                showIcon: false
            },
            callback: {
                onClick: treeFun.getListInfo
            }
        },
        treedt: new u.DataTable({
            meta: {
                'id': {'value': ""},
                'pid': {'value': ""},
                'name': {'value': ""}
            }
        }),

        /**
         * 表格模型
         */
        listData: new u.DataTable({
            meta: {
                id: {type: 'string'},
                state: {type: 'string'},
                'startParticipant.name': {type: 'string'},
                name: {type: 'string'},
                startTime: {type: 'date'},
                endTime: {type: 'date'},
                businessKey: {type: 'string'},
                processDefinitionId: {type: 'string'}
            }
        }),

        /**
         * 穿透查询跳转
         */
        check: function(index, data) {
            viewModel.listData.setRowSelect(index);
            var params = {
                'listData': viewModel.listData,
                'flag': 'check',
                'index': index
            };
            viewModel.jumpEdit(params);
            $('body').css('overflow','auto');
        },

        /**
         * 跳转edit页面（流程详情页面），工具函数
         */
        jumpEdit: function(params) {
            require(['static/js/instance/instedit.js'], function(module) {
                var editPanel = $('.edit-panel');
                var listPanel = $('.list-panel');
                ko.cleanNode(editPanel[0]);

                editPanel[0].innerHTML = module.html;
                listPanel.hide();
                editPanel.show();
                module.init(params);
            });
        },

        /*
         * 终止流程实例,变成已完成状态
         */
       del: function(index, data) {
            tool.confirmDialog({
                msg: "是否终止该流程实例？",
                title: "确认",
                onOk: function() {
                    tool.showLoading();
                	var localurl = window.flowUrl+"proc_monitor/inst/stopProcInst?procInstId=" + data.data.id.value;
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: localurl,
                        success: function(res) {
                            tool.hideLoading();
                            if (res.status == 1) {
                                viewModel.listData.removeRow(index);
                            } else{
                                tool.errorMessage(res.msg, "提示");
                            }
                        }
                    });
                },
                onCancel: function() {

                }
            });
        },

        /*
         * 改变流程实例状态
         * */
        changeState: function(index, data){
            var statueCode = data.data.state.value;
            var requestUrl, toState;
            if (statueCode === 'run') {
                requestUrl = window.flowUrl+"proc_monitor/inst/suspendProcInst?procInstId=" + data.data.id.value;
                toState = 'suspended';
            } else if(statueCode === 'suspended') {
                requestUrl = window.flowUrl+'proc_monitor/inst/activateProcInst?procInstId=' + data.data.id.value;
                toState = 'run';
            }

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: requestUrl,
                success: function(res) {
                    var row1 = viewModel.listData.getRow(index);
                    viewModel.listData.setValue("state", toState, row1);
                }
            });
        },

        /*
         * 按钮切换
         */
        tabButton: function(curDom) {
            if(!curDom.hasClass('cur')) {
                $('.tab-button').removeClass('cur');
                curDom.addClass('cur');
                if (curDom.attr('id') == 'true') {
                  	var data = {};
                	data.pageSize=10;
                    data.pageNum=1;
                    if(selectTreeNode){
                        data.categoryId=selectTreeNode.id;
                    }else{
                        data.categoryId="";
                    }

                    data.finished='true';
                    viewModel.loadList(data);
                }
                else if (curDom.attr('id') == 'false') {
                	var data = {};
                	data.pageSize=10;
                    data.pageNum=1;
                    if(selectTreeNode){
                        data.categoryId=selectTreeNode.id;
                    }else{
                        data.categoryId="";
                    }
                    data.finished='false';
                    viewModel.loadList(data);
                }
            }
        },

        /*
         * 查询分类树数据
         */
        loadTree: function () {
        	var localurl = window.flowUrl+"bmp_proc/category/query";
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: localurl,
                success: function success(res) {
                	if(res.status=="1"){
                		viewModel.treedt.removeAllRows();
                		viewModel.treedt.setSimpleData(res.data);
                	}
                }
            });
        },

        /*分页*/
/*        pagination: {
            element: null,
            // 用于控制分页控件的显示，条目大于10的时候显示控件
            count: ko.observable(0),
            init: function() {
                // 分页控件初始化
                var ele = $('#pagination')[0];
                this.element = new u.pagination({
                    el: ele,
                    jumppage: true
                });

                //分页
                this.element.on('pageChange', function (pageIndex) {
                    var curData = $('.cur').attr('id');
                 	var data = {};
                	data.pageSize=viewModel.pagination.element.options.pageSize;
                    data.pageNum=pageIndex+1;
                    data.categoryId=selectTreeNode.id;
                    data.finished=curData;
                    viewModel.loadList(data);
                });
                this.element.on('sizeChange', function (siz) {
                    var curData = $('.cur').attr('id');
                    var data = {};
                	data.pageSize=siz;
                    data.pageNum=1;
                    data.categoryId=selectTreeNode.id;
                    data.finished=curData;
                    viewModel.loadList(data);
                });
            }
        },*/

        /**
         * 改派
         */
        forward: function forward(index, data){
            if($("#forwardTaskDialog").length == 0){
                require(['static/js/instance/retransmission.js'], function (module) {
                    $('#content').append(module.html);
                    module.init();
                    //传参，params1是流程id,params2是判断是组织树or角色树，params3是判断是转发(forward)还是改派(Reassignment)
                    var params = {
                        proId : data.data.id.value,
                        isRole: false,
                        optType: 'reassignment'
                    };
                    var vm = ko.dataFor($("#forwardTaskDialog")[0]);
                    if (vm && $.isFunction(vm.selectForwardTarget)) {
                        vm.selectForwardTarget(params);
                    }
                });
            } else {
                var params = {
                    proId : data.data.id.value,
                    isRole: false,
                    optType: 'reassignment'
                };
                var vm = ko.dataFor($("#forwardTaskDialog")[0]);
                    if (vm && $.isFunction(vm.selectForwardTarget)) {
                        vm.selectForwardTarget(params);
                    }
            }
        },
        /*
         * 加载表格数据
         */
       loadList: function(data) {
    	   var localurl = window.flowUrl+"proc_monitor/inst/queryProcInsts";

            var obj = {
                url:localurl,
                data:data,
                type:"POST"
            };
            var successCallback = function(res){
	            if(res.status==1){
	                /*viewModel.pagination.element.update({
	        			totalPages: res.data.totalPages,
	        			pageSize: res.data.size,
	        			currentPage: res.data.number + 1,
	        			totalCount: res.data.totalElements
	                });*/
	                viewModel.listData.removeAllRows();
	                viewModel.listData.setSimpleData(res.data);
	                //viewModel.pagination.count(res.data.totalElements);
	            }
            };
            tool.createLoadingAjax(obj,successCallback);
        },

        /*
         *初始化页面，绑定uui
         */
        pageInit: function() {

            var $doc = $(document);
            $doc.ajaxError(function(event, XMLHttpRequest, ajaxOptions, thrownError){
                try{
                    tool.hideLoading();
                }catch (e){}
                if(XMLHttpRequest.status == '401') {
                    u.showMessage({msg:JSON.parse(XMLHttpRequest.responseText).msg,position:"center",msgType:"error"});
                }else{
                    u.showMessage({msg:"调用服务报错",position:"center",msgType:"error"});
                }
            });
            u.createApp({
                el: '.list-panel',
                model: viewModel
            });
            viewModel.listData.forceDel=true;
            // 初次加载数据
            //viewModel.pagination.init();
            viewModel.loadTree();

            //按钮切换事件
            $('.tab-button').click(function() {
                viewModel.tabButton($(this));
            });
            var instreturnbtn=document.querySelector('[data-role="instreturnbtn"]');//返回按钮
            u.on(instreturnbtn, 'click', function(){//清除按钮
	    		history.back();
	    	});
        }
    };
    
    window.hrefToProcess = function(data) {
    	//$.fn.zTree.getZTreeObj("tree2").destroy();
        require(['static/js/process/procindex.js']);
    };

    return {
        init: function(content) {
            content.innerHTML = list;
            $('body').css('overflow','hidden');
            $("#ctxBody").css('height',$('body').height()-117);
            viewModel.pageInit();
        }
    };
});
