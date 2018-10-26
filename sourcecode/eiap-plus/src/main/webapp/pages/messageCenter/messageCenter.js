define(['text!./messageCenter.html', 'ocm_common', 'searchbox', 'editcard', './meta.js', 'ocm_global', "ocm-citypicker"], function (tpl, common, searchbox, editcard) {
	'use strict'
	var app, baseData, events, rendertype, viewModel, singledocSearch, singledoceidt, messageCreationDialog;
	baseData = {
		baseurl: '/iuap_qy/internalmsg/msgs/pagination',
		MessageList: new u.DataTable(MessageListMeta),
		MessageUserCreation: new u.DataTable(MessageUserCreationMeta),
		MessageContentCreation: new u.DataTable(MessageContentCreationMeta),
		AuthorizedUserRef: new u.DataTable(AuthorizedUserRef)
	};
	rendertype = {
		operation: function (obj) {
			var delfun = "data-bind=click:del.bind($data," + obj.rowIndex + ")";
			var editfun = "data-bind=click:beforeEdit.bind($data," + obj.rowIndex + ")";
			obj.element.innerHTML = '<div class="ui-handle-icon">' +
				'<span class="ui-handle ui-tab-icon-b">' +
				'<a href="#" class="uifont icon-edit font-c-c" ' +
				editfun +
				' title="编辑"></a>' +
				'</span>    ' +
				'<span class="ui-handle ui-tab-icon-b">' +
				'<a href="#" class="uifont icon-shanchu1 font-c-c" ' +
				delfun +
				' title="删除"></a>' +
				'</span></div>';
			ko.cleanNode(obj.element);
			ko.applyBindings(viewModel, obj.element);
		}
	};
	events = {
		//弹出卡片编辑窗(通过index区分是编辑还是新增，-1为新增，大于等于0为编辑)
		beforeEdit: function (index) {
			var title;
			viewModel.index = index;
			if (index >= 0) {
				//修改操作
				title = "编辑";
			} else {
				title = "新增"
				//清空编辑框的信息
				messageCreationDialog = u.dialog({ id: 'dialog_content_newMessageFun', content: "#dialog_content_newMessageFun", "width": "80%" });
				var okButton = $("#dialog_content_newMessageFun .u-msg-ok");
				okButton.unbind("click").click(function () {
					//验证
					var add = self.saveAdd();
					if (add) {
						messageCreationDialog.close();
					}
				});
				var cancelButton = $("#dialog_content_newMessageFun .u-msg-cancel");
				cancelButton.unbind("click").click(function () {
					viewModel.MessageList.removeAllRows();
					messageCreationDialog.close();
				});
			}
		},
		//新建信息
		messageCreationHandler: function (index) {
			if (index >= 0) {//移除

			} else {//新增
				viewModel.clearAuthUserRef();
				$("#AuthorizedUserRefer .refer").trigger("click");
			}
		},
		// 清除参照之前的选择
		clearAuthUserRef: function () {
			viewModel.AuthorizedUserRef.setValue("AuthorizedUserRefer", "");
			var refer = $("#refContainerAuthorizedUserRefer").data("uui.refer");
			refer.uncheckAll();
			refer.setValue([]);
		},
		//添加附件
		addAttHandler: function (index) {

		},
		//将操作后的数据进行保存
		edit: function () {
			var result = singledoceidt.validate();
			if (result.passed) {
				var index = viewModel.index;
				var currentRow, type = "post";
				var postdata = singledoceidt.geteidtData();
				if (index >= 0) {
					type = "put";
				}
				//更改后台数据
				$._ajax({
					url: appCtx + viewModel.baseurl,
					type: type,
					data: JSON.stringify(postdata),
					contentType: "application/json; charset=utf-8",
					success: function (data) {
						//如果index大于等于0说明是修改
						singledoceidt.close();
						if (index >= 0) {
							//获取需要修改的行
							currentRow = viewModel.MessageList.getRow(index);
							//将用户填写的数据更新到CustDocDefList上
						} else {
							//添加数据
							currentRow = viewModel.MessageList.createEmptyRow();
						}
						currentRow.setSimpleData(data);
					}
				})
			}

		},
		//删除和批量删除
		del: function (data) {
			if (typeof (data) == 'number') {
				viewModel.MessageList.setRowSelect(data);
			}
			var ids = [];
			var rows = viewModel.MessageList.getSelectedRows();
			if (rows && rows.length > 0) {
				for (var i = 0; i < rows.length; i++) {
					ids.push(rows[i].getValue("id"));
				}
			}
			common.dialog.confirmDialog({
				msg1: '确认删除这些项？',
				msg2: '此操作不可逆',
				width: '400px',
				type: 'error',
				onOk: function () {
					$._ajax({
						url: appCtx + viewModel.baseurl + "/delete",
						type: "post",
						// data: "ids=" + ids.join(","),
						data: {
							ids: ids.join(",")
						},
						success: function (data) {
							viewModel.MessageList.removeRows(rows);
						}
					});

				}
			});
		},
		//根据条件搜索数据(根据是否点击搜索按钮，判断是否需要重置页码)
		search: function (reindex) {
			if (reindex) {
				viewModel.MessageList.pageIndex(0);
			}
			viewModel.MessageList.removeAllRows();
			var queryData = singledocSearch.getDataWithOpr();
			// queryData.size = viewModel.MessageList.pageSize();
			// queryData.page = viewModel.MessageList.pageIndex();
			var fixedQueryData = {
				"direction":queryData["search_EQ_direction"],
				"category": queryData["search_EQ_category"],
				"status": queryData["search_EQ_status"],
				"range": queryData["search_EQ_range"]
			}
			fixedQueryData.pageSize = viewModel.MessageList.pageSize();
			fixedQueryData.pageIndex = viewModel.MessageList.pageIndex();
			$._ajax({
				type: "post",
				url: viewModel.baseurl,
				contentType: "application/json；charset=utf-8",
				dataType: "json",
				data: JSON.stringify(fixedQueryData),
				success: function (data) {
					viewModel.MessageList.setSimpleData(data.content, {
						unSelect: true
					});
					viewModel.MessageList.totalRow(data.totalElements);
					viewModel.MessageList.totalPages(data.totalPages);
				}
			})
		},
		//清空搜索条件
		cleanSearch: function () {
			singledocSearch.clearSearch();
		},
		//页码改变时的回调函数
		pageChange: function (index) {
			viewModel.MessageList.pageIndex(index);
			viewModel.search();
		},
		//页码改变时的回调函数
		sizeChange: function (size) {
			viewModel.MessageList.pageSize(size);
			viewModel.search();
		}
	}
	viewModel = u.extend({}, baseData, events, common.rendertype, rendertype);

	function appInit(element, params) {
		//将模板页渲染到页面上
		element.innerHTML = tpl;
		//将viewModel和页面上的元素绑定并初始化u-meta声明的组件
		app = u.createApp({
			el: element,
			model: viewModel
		});
		// 查询组件初始化
		singledocSearch = new searchbox(
			$("#MessageCenter-searchcontent")[0], [
				{
					type: "radio",
					key: "direction",
					label: "消息方向",
					defaultvalue: 'receive',
					dataSource: [{
						value: 'receive',
						name: '接收'
					}, {
						value: 'send',
						name: '发送'
					}]
				},
				{
					type: "radio",
					key: "category",
					label: "消息分类",
					defaultvalue: 'all',
					dataSource: [{
						value: 'all',
						name: '全部'
					},
					{
						value: 'notice',
						name: '通知'
					}, {
						value: 'earlywarning',
						name: '预警'
					}, {
						value: 'task',
						name: '任务'
					}]
				},
				{
					type: "radio",
					key: "status",
					label: "消息状态",
					defaultvalue: 'all',
					dataSource: [{
						value: 'all',
						name: '全部'
					}, {
						value: 'read',
						name: '已读'
					}, {
						value: 'unread',
						name: '未读'
					}]
				},
				{
					type: "radio",
					key: "range",
					label: "日期范围",
					defaultvalue: 'all',
					dataSource: [{
						value: 'all',
						name: '全部'
					}, {
						value: 'three',
						name: '最近三天'
					}, {
						value: 'week',
						name: '最近一周'
					}, {
						value: 'month',
						name: '最近一月'
					}]
				}
			]);
		// 列表查询数据(无查询条件)

		viewModel.search();
		var productRow = viewModel.MessageUserCreation.createEmptyRow();
		viewModel.MessageUserCreation.setRowFocus(productRow);
	}

	function afterRender() {
		//绑定输入框enter事件
		$('#CustDocDef-searchcontent input').off("keydown").on("keydown", function (e) {
			if (e.keyCode == 13) {
				$(this).blur();
				viewModel.search();
			}
		});
		// 监听业务类型参照选择
		//  singledocSearch.viewModel.params.on("pk_test_grid.valuechange", function(obj) {
		//    console.log(obj);
		//  });
		//切换模板
		function templetTabFun() {
			$("#dialog_content_template").delegate(".template-btn", "click", function () {
				$(this).addClass("active").parent().siblings().find(".template-btn").removeClass("active");
				var id = $(this).attr("pk_id");
				var currentRow = viewModel.templateData.getRowByField('id', id);
				viewModel.templateData.setRowFocus(currentRow);
				//更新组件
				u.compMgr.updateComp($("#dialog_content_template")[0]);
				viewModel.checkboxShow();
			});
		};
		templetTabFun();

	}

	function init(element, params) {
		appInit(element, params);
		afterRender();
		window.vm = viewModel;
	}

	return {
		init: init
	}
});
