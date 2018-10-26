define(function(require, module, exports) {
    /*
     * 引入静态资源
     */
    require('../../js/common/requireConf.js');
    var list = require('text!../../html/flowTask/flowtask.html');
    var tool = require('../../js/flowTask/taskTool.js');
   // require("css!../../styles/cover.css");
    require('css!../../css/flowTask/flowtask.css');
    require('css!../../css/flowTask/main.css');
    require('css!../../css/flowTask/table.css');
    require('css!../../css/flowTask/common.css');


    /**
     * 状态映射
     */
    var _stateName = function(value, format, type){
        if (value() === null )
            return '运行';
         else
            return value;
    };
    u.stateName = function (value, format) {
        return _stateName(value, format, 'date');
    };

    if((/Trident\/7\./).test(navigator.userAgent))
        $.ajaxSetup({ cache:false });

    var viewModel = {

        /**
         * 表格模型
         */
        listData: new u.DataTable({
            meta: {
                id: {
                    type: 'string'
                },
                'categoryName': {
                    type: 'string'
                },
                'processInstanceName': {
                    type: 'string'
                },
                'startParticipantName': {
                    type: 'string'
                },
                'processKey':{
                    type: 'string'
                },
                'startTime': {
                    type: 'string'
                },
                'endTime': {
                    type: 'string'
                },
                'state': {
                    type: 'string'
                },
                'businessKey': {
                    type: 'string'
                },
                'processInstanceId': {
                    type: 'string'
                },
                'processDefinitionId': {
                    type: 'string'
                },
                'formKey': {
                    type: 'string'
                },
                'taskName': {
                    type: 'string'
                }
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
        },

        /**
         * 跳转edit页面，工具函数
         */
        jumpEdit: function(params) {
            require(['./edit.js'], function(module) {
                var editPanel = $('.edit-panel');
                var listPanel = $('.list-panel');
                ko.cleanNode(editPanel[0]);

                editPanel[0].innerHTML = module.html;
                listPanel.hide();
                editPanel.show();
                module.init(params);
            });
        },

        /**
         * 隐藏行操作面板
         */
        hidePanel: function(index, data) {
            viewModel.timeOut = setTimeout(function() {
                $('ul[show="' + index + '"]').hide();
            }, 100);
        },

        //审批
        openApprove:function(index, data){
            var row =data.data,
                processKey = row.processKey.value,
                processInstanceId = row.processInstanceId.value,
                processDefinitionId = row.processDefinitionId.value;
            var FormCodeurl=window.flowUrl+'task/queryFormCode?processKey='+ processKey;
            $.ajax({
                type: "get",
                url:  FormCodeurl,
                dataType: "json",
                contentType: 'application/json',
                success:function(result){
                    var billId=row.businessKey.value;//单据id
                    var url=result.url;
                    //跳转至审批页面
                     window.location.href=url+billId+"&processDefinitionId="+processDefinitionId+"&processInstanceId="+processInstanceId;
                }
            })
        },

        /*
         * 按钮切换
         */
        buttonTab: function(curDom) {
            //如果点击对象为状态tab
            if(curDom.parent().hasClass('tab-state')) {
                if (!curDom.hasClass('cur-state')) {
                    $('.tab-state').children().removeClass('cur-state');
                    curDom.addClass('cur-state');
                    $('.tab-time').children().removeClass('cur-time');
                    if (curDom.attr('id') == 'todo') {
                        viewModel.loadList(0, 10, 'todo');
                    } else if (curDom.attr('id') == 'claim') {
                        viewModel.loadList(0, 10, 'claim');
                    } else if (curDom.attr('id') == 'his') {
                        viewModel.loadList(0, 10, 'his');
                    }
                }
            //如果点击对象为时间tab
            } else {
                if (!curDom.hasClass('cur-time')) {
                    $('.tab-time').children().removeClass('cur-time');
                    curDom.addClass('cur-time');
                    var state = $('.cur-state').attr('id');
                    if (curDom.attr('id') == 'day') {
                        viewModel.loadList(0, 10, state, 'day');
                    } else if (curDom.attr('id') == 'week') {
                        viewModel.loadList(0, 10, state, 'week');
                    } else if (curDom.attr('id') == 'month') {
                        viewModel.loadList(0, 10, state, 'month');
                    }
                }
            }
        },

        /*
         * URL解析
         */
        GetQueryString:function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var str=location.href;
            var num=str.indexOf("?");
            str=str.substr(num+1);
            var r = str.match(reg);
            if(r!=null)
                return decodeURI(r[2]);
            else
                return null;
        },

        /*
         分页
         */
        pagination: {
            // 用于控制分页控件的显示，条目大于10的时候显示控件
            count: ko.observable(0)
        },

        /*
         * 加载表格数据
         */
        loadList: function(start, size, taskFlag, qtype) {

            //请求数据
            var obj = {
                url:window.flowUrl+'task/queryTasks',
                data: {start:start, size:size, taskFlag:taskFlag, qtype:qtype}
            };
            var successCallback = function(res){
                if (res.statusCode == 300) {
//                  u.messageDialog({
//                      msg: "目前没有任务",
//                      title: "提示",
//                      btnText: "确定"
//                  });
                    tool.errorMessage("目前没有任务", "提示");
                } else {
                    var tolPages = Math.ceil(res.data.total / size);
                    viewModel.comp.update({
                        totalPages: tolPages,
                        pageSize: size,
                        currentPage: start/viewModel.comp.options.pageSize+1,
                        totalCount: res.data.total
                    });
                    viewModel.listData.setSimpleData(res.data.data);
                    viewModel.pagination.count(res.data.total);
                }
            };
            tool.createLoadingAjax(obj,successCallback);
        },

        /*
         *初始化页面，绑定uui
         */
        pageInit: function() {

            //分页
            var element = document.getElementById('pagination');
            viewModel.comp = new u.pagination({el:element,jumppage:true});
            viewModel.comp.update({pageSize:10,currentPage:0});
            viewModel.comp.on('pageChange', function (pageIndex) {
                var curData1 = $('.cur-state').attr('id');
                var curData2 = $('.cur-time').attr('id');
                viewModel.loadList(pageIndex * viewModel.comp.options.pageSize, viewModel.comp.options.pageSize, curData1, curData2);
            });
            viewModel.comp.on('sizeChange', function (siz) {
                var curData1 = $('.cur-state').attr('id');
                var curData2 = $('.cur-time').attr('id');
                viewModel.loadList(0,siz, curData1, curData2);
            });

            u.createApp({
                el: '#taskList.list-panel',
                model: viewModel
            });
            //按钮切换事件
            $('.tab-button').click(function() {
                viewModel.buttonTab($(this));
            });
            // 初次加载数据，分析URL
            if(location.href.indexOf('&') == -1) {      //如果参数个数为0或1
                if(location.href.indexOf('claim') != -1) {      //如果参数中有待认领
                    $('#claim').addClass('cur-state');
                    viewModel.loadList(0, 10, 'claim');
                }
                else {      //默认情况为待办
                    $('#todo').addClass('cur-state');
                    viewModel.loadList(0, 10, 'todo');
                }
            }
            else {      //如果有多个参数
                var processDefinitionId = viewModel.GetQueryString("processDefinitionId"),
                    processInstanceId = viewModel.GetQueryString("processInstanceId"),
                    formKey = viewModel.GetQueryString("formKey"),
                    businessKey = viewModel.GetQueryString("businessKey"),
                    taskId = viewModel.GetQueryString("taskId"),
                    taskName = viewModel.GetQueryString("taskname"),
                    state = viewModel.GetQueryString("state"),
                    params = {
                        processDefinitionId: processDefinitionId,
                        processInstanceId: processInstanceId,
                        formKey: formKey,
                        businessKey: businessKey,
                        taskId: taskId,
                        title:taskName,
                        state: state,
                        back: function () {
                            if(state == 'claim') {
                                $('#claim').addClass('cur-state');
                                viewModel.loadList(0, 10, 'claim');
                            } else {
                                $('#todo').addClass('cur-state');
                                viewModel.loadList(0, 10, 'todo');
                            }
                            $('#taskApprove').hide();
                            $('#taskList').show();
                        }
                    };
                //跳转至审批页面
                require(['/hrcloud/pages/ssc/approve/index.js'], function (module) {
                    var taskApprove = $('#taskApprove');
                    var taskList = $('#taskList');
                    ko.cleanNode(taskApprove[0]);
                    module.init(taskApprove[0], params);
                    taskList.hide();
                    taskApprove.show();
                });
            }
        }
    };

    return {
        init: function(content) {
            content.innerHTML = list;
            viewModel.pageInit();
        },
        refresh: function() {
            viewModel.loadList(0, 10, 'todo');
        }
    };
});
