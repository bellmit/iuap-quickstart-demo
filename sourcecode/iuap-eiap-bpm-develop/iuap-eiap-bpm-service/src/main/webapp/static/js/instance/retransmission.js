define(function(require) {
    "use strict";
    var html = require("text!../../html/instance/retransmission.html");
    var styles = require("css!../../css/retransmission.css");
    var tool = require('../../js/tool/instTool.js');
    /*require('../../js/tool/ref-depend.js');*/

    //测试数据开始
	var orgdata=[{
		"id": "01",
        "pid": "root",
        "orgname": "用友网络",
        'bu_id':""
	}, {
		"id": "101",
        "pid": "01",
        "orgname": "uap",
        'bu_id':""
	},{
		"id": "102",
        "pid": "01",
        "orgname": "nc",
        'bu_id':""
	}, {
		"id": "103",
        "pid": "01",
        "orgname": "财务",
        'bu_id':""
	}];
	var userdata=[{
		"user_id": "001",
		"code": "li",
		"name": "li",
		"mobile": "001",
		"org_id_showname": "组织1"
	}, {
		"user_id": "002",
		"code": "wang",
		"name": "wang",
		"mobile": "001",
		"org_id_showname": "组织1"
	},{
		"user_id": "003",
		"code": "yuan",
		"name": "yuan",
		"mobile": "001",
		"org_id_showname": "组织1"
	}, {
		"user_id": "004",
		"code": "xu",
		"name": "xu",
		"mobile": "001",
		"org_id_showname": "组织1"
	}, {
		"user_id": "004",
		"code": "xu",
		"name": "xu",
		"mobile": "001",
		"org_id_showname": "组织1"
	}, {
		"user_id": "004",
		"code": "xu",
		"name": "xu",
		"mobile": "001",
		"org_id_showname": "组织1"
	}, {
		"user_id": "004",
		"code": "xu",
		"name": "xu",
		"mobile": "001",
		"org_id_showname": "组织1"
	}, {
		"user_id": "004",
		"code": "xu",
		"name": "xu",
		"mobile": "001",
		"org_id_showname": "组织1"
	}, {
		"user_id": "004",
		"code": "xu",
		"name": "xu",
		"mobile": "001",
		"org_id_showname": "组织1"
	}, {
		"user_id": "004",
		"code": "xu",
		"name": "xu",
		"mobile": "001",
		"org_id_showname": "组织1"
	}, {
		"user_id": "004",
		"code": "xu",
		"name": "xu",
		"mobile": "001",
		"org_id_showname": "组织1"
	}]
	//测试数据结束
    
    var flowForwardUrl = window.flowUrl + "/instance/reassignmentTaskWithProInsID";
    var app;
    var viewModel = {
        /**
         * 选中的转发用户
         */
        forwardTarget: ko.observable(),

        /**
         * 选择转发用户时左边组织树model
         */
        treeOrg: new u.DataTable({
            meta: {
                'id': { 'value': "" },
                'pid': { 'value': "" },
                'orgname': { 'value': "" },
                'bu_id': { 'value': "" }
            }
        }),

        /**
         * 选择转发用户时右边用户列表model
         */
        users: new u.DataTable(),

        /**
         * 选择转发用户时左边组织树选中的组织id model
         */
        orgId: ko.observable(),

        /**
         * 选择转发用户时搜索用户的条件model
         */
        searchStr: ko.observable(""),

        /**
         * 选择转发用户时左边的组织数树配置
         */
        treeSetting: {
            view: {
                showLine: false,
                showIcon: false,
                selectedMulti: false
            },
            callback: {
                onClick: function onClick(event, treeId, treeNode) {
                    viewModel.current(1);
                    viewModel.orgId(treeNode.id);
                    viewModel.searchStr("");
                    viewModel.loadUsers(true);
                }
            }
        },
        //分页
        totalPages: ko.observable(),
        current: ko.observable(),
        //模态框title
        title: ko.observable(''),
        clearData: function clearData() {
            var o = this;
            o.forwardTarget("");
            o.treeOrg.clear();
            o.users.clear();
            o.orgId(null);
            o.searchStr("");
            o.totalPages(0);
            o.current(1);
        },
        /**
         * 转发按钮操作
         */
        selectForwardTarget: function selectForwardTarget(data) {
            var o = this,
                orgRows = o.treeOrg.rows(),
                leftUrl = "";
            //传入的参数设为全局
            o.params = data;
            //设置模态框标题
            viewModel.title('选择改派接收人');
            leftUrl = "/instance/org/queryOrgListNoTrans";
            
            if (orgRows == null || orgRows.length == 0) {
                tool.showLoading();
                /*$.getJSON(window.flowUrl + leftUrl, null, function(res){
                    tool.hideLoading();
                    o.treeOrg.setSimpleData(res.data);
                    o.loadUsers();
                });*/
                tool.hideLoading();
                o.treeOrg.setSimpleData(orgdata);
                o.loadUsers();
            }
            $("#forwardTaskDialog").modal('show');
        },
        /**
         * 选择转发用户后对话框中的转发按钮
         */
        forwardTo: function forwardTo() {
            var o = this,
                target = o.forwardTarget(),
                forwardUrl,
                obj;
            if (target == null) {
            	 tool.errorMessage("请选择改派接收人", "提示");
                return;
            }
            forwardUrl = flowForwardUrl;
            obj = {
                processInstanceId: o.params.proId,
                taskAssignee: target,
            };
            $.post(forwardUrl, obj, function(res) {
                var obj = JSON.parse(res);
                if (obj.status == 1) {
                	 tool.shortMessage("改派完成");
                } else {
                    tool.errorMessage(obj.message, "提示");
                }
            });
            $("#forwardTaskDialog").modal('hide');
        },
        /**
         * 加载转发用户数据
         * @param reset 是否重置分页
         */
        loadUsers: function loadUsers(reset) {
            var o = this,
                conVal = o.searchStr(),
                params = {},
                //p = o.pagination,
                orgId = o.orgId(),
                queryUrl = '';
            if (conVal !== null && conVal !== "") {
                params["qryStr"] = conVal;
            }
            params["pageNum"] = viewModel.current();
            params["pageSize"] = 10;

            if (orgId) {
                params["orgId"] = orgId;
            } else {
                params["orgId"] = viewModel.treeOrg.getSimpleData()[0].id;
            }
            queryUrl = '/instance/staff/querystaffbyorg';
            tool.showLoading();
/*            $.getJSON(window.flowUrl + queryUrl, params, function(res) {
                tool.hideLoading();
                var page = res.data;
                if (!page.content.length) {
                    $("#emptyRight").show();
                } else {
                    $("#emptyRight").hide();
                }
                o.users.setSimpleData(page.content);
                viewModel.totalPages(page.totalPages);
                viewModel.current(page.number + 1);
                //o.selectUser();
            });*/
            tool.hideLoading();
            o.users.setSimpleData(userdata);
            viewModel.totalPages(10);
            viewModel.current(1);
        },
        /**
         * 选择用户
         * @param data 用户id方法
         */
        selectUser: function selectUser(data) {
            var id = data ? data() : null,
                old = this.forwardTarget();
            $("#forwardTaskDialog .hr-table .active").removeClass("active");
            if (id != old) {
                this.forwardTarget(id);
                $("#forwardTaskDialog .hr-table #" + id).addClass("active");
            } else {
                this.forwardTarget(null);
            }
        },

        /**
         * 搜索转发用户
         */
        searchStaff: function searchStaff() {
            //显示与传值 做区分
            viewModel.current(1);
            viewModel.totalPages(0);
            this.loadUsers(true);
        },

        prePage: function prePage() {
            if (viewModel.current() <= viewModel.totalPages() && viewModel.current() > 1) {
                var o = this;
                //if (o.prePage) return;
                viewModel.current(viewModel.current() - 1);
                o.loadUsers();
            }
        },
        nextPage: function nextPage() {
            if (viewModel.current() < viewModel.totalPages() && viewModel.current() >= 1) {
                var o = this;
                //if (o.nextPage) return;
                viewModel.current(viewModel.current() + 1);
                o.loadUsers();
            }
        }
    };
	//姓名检索框回车监听
	$(document).on("keyup", "#searchVal", function(event){
		if (event.keyCode == "13") {
			viewModel.searchStaff();
		}
	});
    return {
        init: function init() {
            viewModel.clearData();
            app = u.createApp({
                el: '#forwardTaskDialog',
                model: viewModel
            });
        },
        html: html
    };
});
