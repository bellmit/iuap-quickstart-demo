define(function (require, module, exports) {
    // 引入相关的功能插件或模块
    var html = require('text!./index.html');
    require('css!./index.css');
    require('css!./table.css');
    require('css!./paginate.css');
    require('css!./modal.css');

    var wbCtx = "/wbalone";
    var viewModel = {
        goback: function () {
            window.history.go(-1);
            return false;
        },
        /**
         * 页面初始化
         * @return {[type]} [description]
         */
        pageInit: function () {
            u.createApp({
                el: '#roleConUser',
                model: viewModel
            });
            viewModel.pagination.init();

            // 初次加载数据
            viewModel.loadRoleList({});
            //事件处理
            //处理搜索任务
            $("#roleConUser")
                .on("keypress", "input[name='searchFunc']", function (event) {
                    if (event.keyCode == 13) {
                        var keyword = $("input[name='searchFunc']").val();
                        viewModel.CurFunction.searchConFuncsData(keyword);
                    }
                })
                .on("keypress", "input[name='searchRole']", function (event) {
                    if (event.keyCode == 13) {
                        var keyword = $("input[name='searchRole']").val();
                        viewModel.loadRoleList({keyword: keyword});
                    }
                });
        },
        /**
         * 表格方法，用于添加行后触发渲染
         * @method function
         * @param  {[type]} element [description]
         * @param  {[type]} index   [description]
         * @param  {[type]} row     [description]
         * @return {[type]}         [description]
         */
        afterAdd: function (element, index, row) {
            if (element.nodeType === 1) {
                u.compMgr.updateComp(element);
            }
        },


        /**
         * 加载角色列表
         * @method function
         * @return {[type]} [description]
         */
        loadRoleList: function (params) {
            // 查询参数
            var options = {
                "pn": params.pn || viewModel.pagination.element.options.currentPage,
                "ps": params.ps || viewModel.pagination.element.options.pageSize,
                "sortType": params.sorttype || "",
                "search_LIKE_roleName": params.roleName || "",
                "search_LIKE_roleCode": params.roleCode || "",
                "search_EQ_label": params.roleType || "",
                'search_OR_searchParam': params.keyword || ""

            };

	    if (!!params.keyword) {
		options.pn = 1;
	    }

            //请求数据
            var obj = {
                type: "get",
                url: 'roleMGT/listRolePage',
                data: options
            };
            var successCallback = function (res) {
                if (res.status === 1) {
                    var data = res.data;
                    if (data.totalElements == 0) {
                        viewModel.loading.stop();
                    	viewModel.listData.setSimpleData([]);
                    	viewModel.pagination.count(0);
			viewModel.CurFunction.functionData([]);
                        return false;
                    }
                    viewModel.pagination.element.update({
                        totalPages: data.totalPages,
                        pageSize: data.size,
                        currentPage: data.number + 1,
                        totalCount: data.totalElements,
                        showState: false
                    });
                    viewModel.listData.setSimpleData(data.content, {
                        unSelect: true
                    });
                    viewModel.pagination.count(data.totalElements);

                    //todo 默认选中第一行

                    var FisrtRow = viewModel.listData.getRow(0);
		    if (FisrtRow) {
                    	viewModel.CurFunction.init(FisrtRow);
                    	$("#rolesTable tbody tr.active").removeClass("active");
                    	$("#rolesTable tbody tr:eq(0)").addClass("active");
		    }

                } else {
                    alert(res.msg ? res.msg : "返回错误，请刷新页面")
                }
            };


            $.ajax({
                type: obj.type || 'get',
                dataType: obj.dataType || 'json',
                contentType: 'application/json',
                url: obj.url,
                data: obj.data || '',
                success: function (res) {
                    viewModel.loading.stop();
                    if ((res && res.data == null) || (res.data && res.data.content.length < 1) || (res.data && res.data.length < 1)) {
                        $('#emptyImage').show();
                    }
                    successCallback(res);
                }
            });
        },
        loading: {
            begein: function (parLoad) {
                u.showLoader();
            },
            stop: function () {
                u.hideLoader();
            }
        },

        /**
         *  bind view  click event
         * */
        clickHandle: {
            searchRole: function (vm, event) {
                var keyword = $("input[name='searchRole']").val();
                viewModel.loadRoleList({keyword: keyword});
            },
            searchFunc: function (vm, event) {
                var funcName = $("input[name='searchFunc']").val();
                viewModel.CurFunction.searchConFuncsData(funcName);
            },
            showConFunction: function (data, event) {    //显示当前角色已分配小应用
//              debugger;
                $("input[name='searchRole']").val('');
                $("input[name='searchFunc']").val('');

                $("#rolesTable tbody tr.active").removeClass("active");
                $(event.target).parents("tr:eq(0)").addClass("active");
                viewModel.CurFunction.init(data);

            },
            showConFunctionActivity: function (data, event) {
                var $tar = $(event.target);
                $tar.siblings('li')
                    .removeClass('active');
                $tar.addClass('active');
                viewModel.CurFunctionActivity.init(data);
                viewModel.CurFunction.curFunData(data);
            },
            assignConFuncActivity: function (data, event) {    //显示当前角色已分配小应用
//              debugger;
                viewModel.CurFunctionActivity.assignConFuncActivity();
            },
        },

        /*角色table分页控件*/
        pagination: {
            element: null,
            // 用于控制分页控件的显示，条目大于10的时候显示控件
            count: ko.observable(0),
            init: function () {
                // 分页控件初始化
                var ele = $('#paginationt1')[0];
                viewModel.pagination.element = new u.pagination({
                    el: ele,
                    pageList: ['10'],
                    jumppage: true
                });
                //分页
                viewModel.pagination.element.on('pageChange', function (currentPage) {
                    viewModel.loadRoleList({
                        pageNum: currentPage + 1,
                        pageSize: viewModel.pagination.element.options.pageSize
                    });
                });
                viewModel.pagination.element.on('sizeChange', function (siz) {
                    viewModel.loadRoleList({
                        pageNum: 1,
                        pageSize: siz - 0
                    });
                });
            }
        },


        CurFunction: {
            curRoleData: ko.observable(),
            curRoleIndex: ko.observable(0),
            curFunData: ko.observable(null),
            tempFunctionData: ko.observableArray(null),
            functionData: ko.observableArray([]),
            loadConFuncsData: function (params) {
                u.showLoader();
                //查询参数
                var that = this;
                var curRole = viewModel.CurFunction.curRoleData();
                //请求数据
                var obj = {
                    type: "get",
                    url: wbCtx + '/security/ext_role_function/pagePermFunction/' + curRole.id
                };
                var successCallback = function (res) {
                    that.functionData(res);
                    that.tempFunctionData(res);
                };
                $.ajax({
                    type: obj.type || 'get',
                    dataType: obj.dataType || 'json',
                    contentType: 'application/json',
                    url: obj.url,
                    data: obj.data || '',
                    success: function (res) {
                        viewModel.loading.stop();
						viewModel.CurFunction.tempFunctionData(res);
                        successCallback(res);
                    }
                });
            },

            init: function (data) {
                viewModel.CurFunction.curFunData(null);
                // if (this.curRoleData() && (data.getValue('id') == this.curRoleData().id)) return;
//                var index = this.curRoleIndex();
                this.curRoleData(data.getSimpleData());

                //初始化当前角色已分配用户列表
                this.loadConFuncsData({});
            },
            searchConFuncsData: function (funcName) {
                var tempArray = [];
                var tempFunctionData = viewModel.CurFunction.tempFunctionData();
                if (tempFunctionData != null) {
                    if (funcName != null) {
                        for (var i = 0; i < tempFunctionData.length; i++) {
                            if (tempFunctionData[i].funcName.indexOf(funcName) > -1) {
                                tempArray.push(tempFunctionData[i]);
                            }
                        }
                        viewModel.CurFunction.functionData(tempArray);
                    } else {
                        viewModel.CurFunction.functionData(tempFunctionData);
                    }
                }
            },
            setCurrentRow: function (id) {// 设置选中行
                var allrow = viewModel.CurFunction.functionData.getAllRows();
                if (allrow && id) {
                    for (var i in allrow) {
                        var row = allrow[i];
                        if (row instanceof u.Row)
                            if (row.getValue('id') == id) {
                                viewModel.functionData.setRowSelect(row);
                            }
                    }
                }
            }
        },

        CurFunctionActivity: {
            curFunctionData: ko.observable(),
            // activityChildData: ko.observableArray(null),
            activityChildData: new u.DataTable({
                meta: {
                    activityName: {
                        type: 'string'
                    },
                    activityCode: {
                        type: 'string'
                    },
                    //				funcCode : {
                    //					type : 'string'
                    //				},
                    funcID: {
                        type: 'string'
                    },
                    isactive: {
                        type: 'string'
                    },
                    id: {
                        type: 'string'
                    }
                }
            }),
            init: function (data) {
                // if (this.curFunctionData() && (data.id == this.curFunctionData().id)) return;
//                var index = this.curRoleIndex();
                this.curFunctionData(data);

                //初始化当前功能的按钮
                this.loadConFuncActivity({});
            },

            /**
             * 加载小应用按钮
             */
            loadConAllFuncActivity: function (callback) {
                u.showLoader();
                //查询参数
                var that = this;
                var curRole = viewModel.CurFunction.curRoleData();
                var nodeId = viewModel.CurFunctionActivity.curFunctionData().id;
                //请求数据
                var obj = {
                    type: "get",
                    url: wbCtx + '/security/extfuncactivity/page?search_EQ_funcID='
                    + nodeId + "&search_EQ_isactive=Y"
                };

                var successCallback = function (res) {
                    u.hideLoader();
                    var data = res.content;
                    that.activityChildData.setSimpleData(data, {
                        unSelect: true
                    });
                    that.activityChildData.setAllRowsUnSelect();
                };
                $.ajax({
                    type: obj.type || 'get',
                    dataType: obj.dataType || 'json',
                    contentType: 'application/json',
                    url: obj.url,
                    data: obj.data || '',
                    success: function (res) {
                        successCallback(res);

                        callback();
                    }
                });
            },

            /**
             * 加载小应用按钮
             */
            loadConPermFuncActivity: function (params) {
                u.showLoader();
                //查询参数
                var that = this;
                var curRole = viewModel.CurFunction.curRoleData();
                var curFunction = viewModel.CurFunctionActivity.curFunctionData();

                //请求数据
                var obj = {
                    type: "get",
                    url: wbCtx + "/security/ext_role_function/pagePermAction?roleId=" + curRole.id + "&funcId=" + curFunction.id + ""
                };

                var successCallback = function (res) {
                    u.hideLoader();
                    var data = res;
                    var sIndices = [];
                    var rows = that.activityChildData.getAllRows();
                    for (var i = 0; i < rows.length; i++) {
                        var id = rows[i].getSimpleData().id;
                        for (var ii = 0; ii < data.length; ii++) {
                            var dataid = data[ii];
                            if (dataid == id) {
                                sIndices.push(rows[i]);
                            }
                        }
                    }
                    that.activityChildData.setRowsSelect(sIndices);
                };
                $.ajax({
                    type: obj.type || 'get',
                    dataType: obj.dataType || 'json',
                    contentType: 'application/json',
                    url: obj.url,
                    data: obj.data || '',
                    success: function (res) {
                        successCallback(res);
                    }
                });
            },

            loadConFuncActivity: function () {
                var cb = function () {
                    viewModel.CurFunctionActivity.loadConPermFuncActivity();
                };
                viewModel.CurFunctionActivity.loadConAllFuncActivity(cb);
            },

            /**
             * 加载小应用按钮
             */
            assignConFuncActivity: function (params) {
                u.showLoader();
                //查询参数
                var that = this;
                var curRole = viewModel.CurFunction.curRoleData();
                var curFunction = viewModel.CurFunctionActivity.curFunctionData();

                var dats = [];
                var dat = viewModel.CurFunctionActivity.activityChildData.getSimpleData({type: "select"});
                for (var i = 0; i < dat.length; i++) {
                    delete dat[i].createDate;
                    dats.push(dat[i]);
                }

                var options = {
                    "datas": dats,
                    "roleid": curRole.id || "",
                    "rolecode": curRole.roleCode || "",
                    "funcId": curFunction.id
                };

                //请求数据
                var obj = {
                    type: "post",
                    url: wbCtx + '/security/ext_role_function/createBatchBtn'
                };

                var successCallback = function (res) {
                    u.hideLoader();
                    if (res.flag === "1") {
                        window.message();
                    } else {
                        window.message(res.msg ? res.msg : "返回错误", 'error');
                    }
                };
                $.ajax({
                    type: obj.type || 'get',
                    dataType: obj.dataType || 'json',
                    contentType: 'application/json',
                    url: obj.url,
                    data: JSON.stringify(options) || '',
                    success: function (res) {
                        successCallback(res);
                    }
                });
            }
        },

        /*角色列表数据模型*/
        listData: new u.DataTable({
            meta: {
                sort: {
                    type: 'string'
                },
                id: {
                    type: 'string'
                },
                roleName: {
                    type: 'string'
                },
                roleCode: {
                    type: 'string'
                },
                isActive: {
                    type: 'string'
                },
                createDate: {
                    type: 'string'
                },
                tenantId: {
                    type: 'string'
                },
                label: {
                    type: 'string'
                },
                labelName: {
                    type: 'string'
                },
                remark: {
                    type: 'string'
                },
                creator: {
                    type: 'string'
                },
                modifyDate: {
                    type: 'string'
                },
                reviser: {
                    type: 'string'
                }
            }

        })
    };

    return {
        init: function (content) {
            // 插入内容
            content.innerHTML = html;
            window.headerInit($('#roleConUser .apptitle')[0],'按钮授权');
            // 执行主逻辑
            viewModel.pageInit();
        }
    }
});
