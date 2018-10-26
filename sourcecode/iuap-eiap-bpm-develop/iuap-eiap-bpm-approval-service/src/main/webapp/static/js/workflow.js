/**
 * Created by liuch on 15-3-20.

 * Modified by chenyl on 15-7-1
 * Modified by wujiank on 17-2-10
 */

// 改派
/**
 * 参照初始化
 */
function refInit(refCode) {
	if (!refCode) return alert("缺少参照参数");
	$.ajax({
		type: "get",
		url: '/uitemplate_web/iref_ctr/refInfo/',
		data: {
			refCode: refCode || ""
		},
		traditional: true,
		async: false,
		dataType: "json",
		success: function (pRefmodel) {
			var refmodelUrl=pRefmodel.refModelUrl;
			var refmodel_new=$("#wf_pk_user").attr("data-refmodel");
			refmodel_new=$.parseJSON(refmodel_new );
			refmodel_new.refModelUrl=refmodelUrl;
			var refmodel_str=JSON.stringify(refmodel_new);
			$("#wf_pk_user").attr("data-refmodel",refmodel_str);
		}
	});
};

var dialogmin = function(content,className){
	var iconClass="";
	if(className==""||className=="tip-suc"){
		iconClass = "icon-ok";
	}else{
		iconClass = "icon-tishi";

	}
	var dialogdiv = "<div class='dialogmin "+(className||" ") +"'><i class='iconfont "+ iconClass+"'></i><span>"+content+"</span></div>";
	$('body').append(dialogdiv);
	setTimeout(function(){
		$(".dialogmin").remove();
	},2000);
};
function getParamFromUrl(){
		var param = {}
		var search = location.search,
			pk_bo = '';
		if (!search) {
			return ""
		}
		search = search.slice(1).split('&')
		$.each(search, function (i, v){
			if(~v.indexOf('=')){
				var array= v.split('=');
				param[array[0]]=array[1];
			}
		})
		return param;
}


/**
 * 审批框中各种按钮的事件的响应
 */
function bindEvent(org) {
	createModalDialogDom($('#apprvoeinner'));
	$("#apprvoeinner")
			.on("mouseover", ".approve-more .approve-bage", function() {
				$(this).siblings(".approve-popup").show();
			})
			.on("mouseout", ".approve-more .approve-bage", function() {
				$(this).siblings(".approve-popup").hide();
			})
			.on("mouseover", ".approve-popup", function() {
				$(this).show();
			})
			.on("mouseout", ".approve-popup", function() {
				$(this).hide();
			})
			.on(
					"click",
					"[action-code]:visible",
					function() {
						var pk_workflownote = $('#apprvoeinner').find(".approve-todo-action").attr("pk_workflownote");
						if (pk_workflownote === undefined) {
							pk_workflownote = $('#apprvoeinner').parents(".approve-passed").attr("pk_workflownote")
						}
						if (pk_workflownote === undefined) {
							pk_workflownote = $('#apprvoeinner').parents(".approve-unpassed").attr("pk_workflownote")
						}

						var actionCode = $(this).attr("action-code");
						// var textValue =
						// $(this).parents("div.approve-right").children("textarea").val();
						var param_note = $("#apprvoeinner").find(".approve-textarea-scale").val();

						// 批准时如果没有输入意见默认是同意
						if ($(this).attr("action-code") === 'agree' && param_note === "") {
							param_note = '同意';
						}

						if (param_note != null && param_note.length > 50) {
							/*$.showMessageDialog({
								type : "info",
								title : "提示",
								msg : "批语只能输入50个字以内",
								backdrop : true
							});*/
							dialogmin("批语只能输入50个字以内",'tip-alert');
							return;
						}
						var obj  = getParamFromUrl();
						obj.param_note= param_note;
						var param = JSON.stringify(obj);
						var $dialog = $("#dialog");
						// 如果是驳回按钮,则先弹出驳回页面
						if (actionCode === 'reject') {
							generateRejectView(pk_workflownote, actionCode,
									obj);
						} else if ($(this).attr("assign-flag") === "Y") {// 如果有加签属为Y,则必须弹出加签参照界面
							generateAssignView(pk_workflownote, actionCode,
									param_note);
						} else if (actionCode === 'reassign') {
							// 改派
							reassign(pk_workflownote, actionCode, param_note, org);
						} else if ($(this).attr("action-code") === 'addApprove') {
							// 加签
							addApprove(pk_workflownote, actionCode, param_note, org);
						} else if ($(this).attr("action-code") === 'recall') {
							// 回退
							pk_workflownote = $(".drawtaskid").attr("value");
							doAction(pk_workflownote, actionCode, param);
						} else {
							var app = u.createApp();
							var options = {element:$('.cardpanel')[0]};
							options.showMsg = true;
							var errorMsg = app.compsValidateMultiParam(options);
							if(typeof errorMsg.passed == "boolean" && !errorMsg.passed && errorMsg.notPassedArr.length > 0){
								return;
							}							
							var viewModel = workflowdata.viewModel;
							var app = workflowdata.app;
							/*app.serverEvent().addParameter("userid",viewModel.userid).addDataTables(workflowdata.datatableIds,'all');*/
							app.serverEvent().addParameter("userid",viewModel.userid);
							
							doAction(pk_workflownote, actionCode, param,obj.pk_bo,viewModel.bpminfo.pk_procdefins);							
						}
					});

	$("#dialog")
			.on("click", "#reject-sure-btn",function() {
					dialogActionReject($(this));
			})
			.on("click", "#reassign-sure-btn",function() {
					dialogActionReassign($(this));
			})
			.on("click","#addApprove-sure-btn",function() {
					dialogActionAddapprove($(this));
			})
			.on("click","tr.reject-tr",function() {
					$(this).siblings('.datarow-choosen').removeClass(
							'datarow-choosen');
					$(this).addClass('datarow-choosen');
					$("#reject-sure-btn").removeClass("hidden");
			})
			.on(
					"click",
					"a.activity-change",
					function() {
						var activities = $("a.activity-tab");
						$(this).addClass('activity-tab').siblings(
								".activity-selected").removeClass(
								'activity-tab');
						$('.table').eq($(this).index(activities)).removeClass(
								'hidden').siblings("table.table").addClass(
								'hidden');
					})
			.on("click", "label", function() {
				var prev = $(this).prev(":checkbox");
				if (prev.is(':disabled')) {
					return false;
				}
				prev.prop('checked', !prev.prop('checked'));
			})
			.on(
					"click",
					"#assign-sure-btn",
					function() {
						var dialog = $("#dialog");
						// 检查是否已经选择了某个人.
						var $ativityTables = dialog
								.find("table[activity-def-id]");
						var param_assign_info = '"param_assign_info":';
						var sep = '';
						for ( var i = 0; i < $ativityTables.length; i++) {
							var $activityTable = $($ativityTables.get(i));
							var activity = '';
							activity += sep + '{';
							activity += '"'
									+ $activityTable.attr("activity-def-id")
									+ '"';
							activity += ':[';
							var seperator = '';
							var userids = $activityTable
									.find(
											"input[type='checkbox']:checked,input[type='checkbox']:disabled")
									.next().children("span.uid");
							if (userids.length == 0) {
								var name = $activityTable.attr("activity-name");
							/*	$.showMessageDialog({
									type : "info",
									title : "提示",
									msg : name + " 环节没有指派人",
									backdrop : true
								});*/
								var msg=name + " 环节没有指派人";
								dialogmin(msg,'tip-alert');
								return;
							}
							for ( var j = 0; j < userids.length; j++) {
								activity += seperator;
								activity += '"' + $(userids[j]).attr("pk_user")
										+ '"';
								seperator = ',';
							}
							activity += ']';
							sep = ",";
							param_assign_info += activity;
						}
						param_assign_info += '}';
						var workflow_note = dialog.children(".modal-dialog")
								.attr("pk_workflownote");
						// var userid =
						// dialog.children(".modal-dialog").attr("userid");
						var actionCode = dialog.children(".modal-dialog").attr(
								"actionCode");
						var param_note = dialog.children(".modal-dialog").attr(
								"param_note");
						var note = '"param_note":"' + param_note + '"';
						var param = "{" + note + "," + param_assign_info + "}";
						doAction(workflow_note, actionCode, param);
						// }
			}).on("click", ".reject-arrow-down", function(e) {
					var $middle = $(e.target).parent().siblings('.person');
					$middle.find('.subtable').toggle();
					$middle.find('.names').toggle();
			});
	var $apl = $("#apprvoeinner").find('.approve-hor')
	if($apl.length > 0) {
		$(window).bind('scroll.uui.approval',
		  function(e) {
			if(!$apl.is(":visible")) {
				return;
			}

			var $oridiv = $("#apprvoeinner")
			var oriLeft = $oridiv.offset().left-1,
			oriWidth = $oridiv.outerWidth()+3

		    if ($(document).scrollTop() > 110) {
				$apl.addClass('approve-fixed-top').css({left: oriLeft, width: oriWidth});
			} else {
		  		$apl.removeClass('approve-fixed-top').css({left: 'auto', width: 'auto'});
		    }
		  });
	}

}

// 改派
dialogActionReassign = function (action) {
		var user = $("#wf_pk_user").data('refpk');
		if (!user ) {
			/*$.showMessageDialog({
				type : "info",
				title : "提示",
				msg : "请选择具体指派人",
				backdrop : true
			});*/
			dialogmin("请选择具体指派人",'tip-alert');
			return;
		}
		var dialog = $("#dialog");
		var actionCode = dialog.children(".modal-dialog").attr("actionCode");
		var pk_workflownote = dialog.children(".modal-dialog").attr("workflow_note");

	    var obj  = getParamFromUrl();
		obj.param_note = pk_workflownote;
		obj.param_reaassign_user = user;

		var param = JSON.stringify(obj);

		doAction(pk_workflownote, actionCode, param);
}

// 加签
dialogActionAddapprove = function (action) {
	var user = $("#wf_pk_user").data('refpk');
	if (user === undefined ) {
		$.showMessageDialog({
			type : "info",
			title : "提示",
			msg : "请选择具体加签人",
			backdrop : true
		});
		dialogmin("请选择具体加签人",'tip-alert');
		return;
	}

	var dialog = $("#dialog");
	var actionCode = dialog.children(".modal-dialog").attr("actionCode");
	var pk_workflownote = dialog.children(".modal-dialog").attr("workflow_note");

	var obj  = getParamFromUrl();
	obj.param_note = pk_workflownote;
	obj.param_addApprove =  new Array(user);

	var param = JSON.stringify(obj);

	doAction(pk_workflownote, actionCode, param);
}


// 驳回
dialogActionReject = function (action) {
	// 则检查是否已经选择了某个环节
	var dialog = $("#dialog");
	if ($("#datatable").find("tr").hasClass("datarow-choosen")) {
		var workflow_note = dialog.children(".modal-dialog").attr("workflow_note");
		// var userid =
		// dialog.children(".modal-dialog").attr("userid");
		var actionCode = dialog.children(".modal-dialog").attr("actionCode");
		var param_note = dialog.children(".modal-dialog").attr("param");
		var param_reject_activity = dialog.find("tr.datarow-choosen").attr("activity-def-id");
		var obj = getParamFromUrl();
		obj.param_note = param_note;
		obj.param_reject_activity = param_reject_activity;
		var param = JSON.stringify(obj);
		doAction(workflow_note, actionCode, param);
	} else {
		/*$.showMessageDialog({
			type : "info",
			title : "提示",
			msg : "请选择具体某个环节",
			backdrop : true
		});*/
		dialogmin("请选择具体某个环节",'tip-alert');
		return;
	}
}


function createBodyModalDialog() {
	var modalDiv = $('<div></div>'); ;
	modalDiv.attr("id", "dialog");
	modalDiv.attr("class", "modal fade");
	$("body").append(modalDiv);
}

function createModalDialogDom(dom) {
	// var dom = $('#apprvoeinner');
	if (dom.children("#dialog").length > 0) {
		return;
	}
	var modalDiv = $('<div></div>'); ;
	modalDiv.attr("id", "dialog");
	modalDiv.attr("class", "modal fade");
	dom.append(modalDiv);
}

/**
 * 横版的查看更多历史流程记录块
 *
 * @param note 流程
 */
function historyTaskShowMoreNew(note, org) {
	var approveInfo = '<div class="approve-pass approve-step approve-more">';
	approveInfo += '    <div class="approve-left"> <div class="approve-bage approve-bage-more">...</div>';
	approveInfo += '      <div class="approve approve-popup"  >';
	approveInfo += '        <div class="approve-arrow-bottom"></div>'; // 浮出层的样式
	approveInfo += '        <div class="approve-more-scroll">';
	approveInfo += '          <div class="approve-square-bottom" id="append-div"></div>'; // 点击更多时候显示的浮出层
	approveInfo += '        </div>';
	approveInfo += '        </div>';
	approveInfo += '    </div>';
	approveInfo += historyTaskViewRight(note, org);
	approveInfo += '</div>';
	return approveInfo;

}

/**
 * 横版的有序号的历史流程记录
 *
 * @param note 流程
 * @param index 当前传入的序号
 */
function historyTaskWithNumNew(note, index, org) {
	var approveInfo = '<div class="approve-pass">';
	approveInfo += '        <div class="approve-left"> <div class="approve-bage">'
			+ index + '</div></div>';
	approveInfo += historyTaskViewRight(note, org);
	approveInfo += '</div>';
	return approveInfo;
}

/**
 * 含有图标的历史流程记录(在流程走完后的最后一个环节使用
 *
 * @param note 流程
 * @param todo_actions 待处理的动作
 * @param pk_workflownote 流程pk
 */
function historyTaskWithIconNew(note, pk_workflownote, org) {
	var approveInfo = '';
	var deleteReason = note.deleteReason
	if (deleteReason == 'complete') {
		// 审批通过
		approveInfo += ' <div class="approve-passed" pk_workflownote="'
				+ pk_workflownote
				+ '" ><div class="approve-left"> <div class="approve-bage"><span class="fa fa-check"></span></div></div>';
	} else if (deleteReason.indexOf('reject')!=-1) {
		// 驳回
		approveInfo += '<div class="row approve-reject" pk_workflownote="'
				+ pk_workflownote
				+ '" ><div class="approve-left"> <div class="approve-bage"><span class="fa fa-arrow-left"></span><span class="fa fa-close"></span></div></div>';

	}
	approveInfo += historyTaskViewRight(note, org, true);
	approveInfo += '</div>';
	return approveInfo;
}


function historyTaskViewRight(note, org, isLast) {
	var notedata = note;
	var taskComplete =  notedata.deleteReason!=null && notedata.deleteReason.indexOf("completed")!=-1;
	var approveInfo = '<div class="approve-right">';
	approveInfo += '    <div class="approve-person ';
	if(!taskComplete)
		approveInfo += 'approve-person-notcomplete';
	approveInfo +='" title="'
				+ notedata.username + '">' + notedata.username
				+ '</div><div class="approve-timespan"' 
				+ ' title="'
				+ getFormatDateByLong(notedata.endTime) + '">'
				+ getFormatDateByLong(notedata.endTime) + '</div></div><div class="approve-right">';
	var checknotetext = typeof (notedata.taskAuditDesc) != "undefined" ? notedata.taskAuditDesc
			: "";

	var displayNote =  checknotetext;
	if (checknotetext.length>10 ) {
		displayNote = checknotetext.substr(0,10) + "...";
	}

	var taskCommentsMsg = "";
	try{
		taskCommentsMsg = notedata.taskComments[0].message;
	}catch (e) {

	}
	approveInfo += '     <em class="approve-action">' + notedata.name
			+ '</em><span class="approve-note" title="' + checknotetext + '">'
			+ (displayNote/*+" "+taskCommentsMsg*/) + '</span>';
	approveInfo += '    </div> ';
	if (!isLast) {
		approveInfo += '     <div class="approve-horizon-line"></div>';
		if (taskCommentsMsg) {
			approveInfo += '<div class="approve-right"><span class="approve-note" title="' + taskCommentsMsg + '">' + taskCommentsMsg + '</span></div>'
		}
	}
	return approveInfo;
}
var workflowdata ={};

function getButtonsInfo(param, bpminfo,flowpanelctx){
	workflowdata.viewModel=flowpanelctx.viewModel;
	workflowdata.ctx=flowpanelctx.ctx;
	workflowdata.datatableIds=flowpanelctx.datatableIds;
	workflowdata.app=flowpanelctx.app;
	workflowdata.param =param;
	var todo_action_info = bpminfo.todo_action_info;
	if(todo_action_info){
		var pk_workflownote = todo_action_info.pk_workflownote;
		$(".row-submit-fixed").attr("pk_workflownote",pk_workflownote);
		createBodyModalDialog();
		if(todo_action_info){
			var actions = todo_action_info.actions;
			if(actions&&actions.length>0){
				for(var i=0;i<actions.length;i++){
					var action = actions[i];
					var agreeButton = null ;
					if (action.action_code == 'agree') {
						agreeButton = "<a id = 'agree' class='btn btn-primary bill-submit-btn ' "
								+ " action-code='"
								+ action.action_code
								+ "'> 批准"
								+ "</a>";

					}
					else if (action.action_code == 'reject') {
						agreeButton = "<a id = 'reject' class='btn btn-primary bill-submit-btn ' "
							+ " action-code='"
							+ action.action_code
							+ "'> 驳回"
							+ "</a>";
					} else if (action.action_code == 'recall') {
						agreeButton = "<a id = 'recall' class='btn btn-primary bill-submit-btn ' "
							+ " action-code='"
							+ action.action_code
							+"' value='"
							+ action.taskdrawid
							+ "'> 收回"
							+ "</a>";
					} else if (action.action_code == 'reassign') {
						agreeButton = "<a id = 'reassign' class='btn btn-primary bill-submit-btn ' "
							+ " action-code='"
							+ action.action_code
							+ "'> 改派"
							+ "</a>";
					}
					if(agreeButton)
						$("#editBtn .save-settings").after($(agreeButton));
				}
			}
		}
	}
	$(".row-fluid").on(
			"click",
			"[action-code]:visible",
			function(e) {
				var curApproveComps = workflowdata.viewModel.curApproveComps;
				var actionCode = $(this).attr("action-code");
				var param_note ="" ;
				if(curApproveComps&&curApproveComps.length>0){
					for(var i=0;i<curApproveComps.length;i++){
						var domid = "textarea[name='"+curApproveComps[i]+"']"
						var $fieldvalue = $(domid).val();
						param_note += $fieldvalue;
					}
				}
				if (param_note != null && param_note.length > 50) {
					/*$.showMessageDialog({
						type : "info",
						title : "提示",
						msg : "批语只能输入50个字以内",
						backdrop : true
					});*/
					dialogmin("批语只能输入50个字以内",'tip-alert');
					return;
				}
				var obj  = getParamFromUrl();

				if (param_note == null
						|| param_note.trim().length == 0) {
					if("agree"==actionCode)
						param_note = "同意";
					else if("reject"==actionCode)
						param_note = "不同意";
					else if("reassign"==actionCode)
						param_note = "改派";
					else if("recall"==actionCode)
						param_note = "收回";
					else if("addApprove"==actionCode)
						param_note = "加签";
					else
						param_note = "  ";
				}

				obj.param_note= param_note;
				var param = JSON.stringify(obj);
				var pk_workflownote = $(".row-submit-fixed").attr("pk_workflownote");
				var $dialog = $("#dialog");


				// 如果是驳回按钮,则先弹出驳回页面
				if (actionCode === 'reject') {
					generateRejectView(pk_workflownote, actionCode,
							obj);
				} else if ($(this).attr("assign-flag") === "Y") {// 如果有加签属为Y,则必须弹出加签参照界面
					generateAssignView(pk_workflownote, actionCode,
							param_note);
				} else if (actionCode === 'reassign') {
					// 改派
					reassign(pk_workflownote, actionCode, param_note, null);
				} else if ($(this).attr("action-code") === 'addApprove') {
					// 加签
					addApprove(pk_workflownote, actionCode, param_note, null);
				} else if ($(this).attr("action-code") === 'recall') {
					// 回退
					pk_workflownote = $("#recall").attr("value");
					doAction(pk_workflownote, actionCode, param);
				} else {
					doAction(pk_workflownote, actionCode, param);
				}
			});

}



function interpreTodoBtnsNew(action, org) {
	var approveInfo = '';
	if (action.action_code == 'agree') {
		approveInfo += '<button class="approve-btn" type="button" assign-flag="'
				+ action.assign_flag
				+ '" action-code="'
				+ action.action_code
				+ '">批准</button>';
	} else if (action.action_code == 'disagree') {
		approveInfo += '<button class="btn btn-default-alt approve-btn" type="button" assign-flag="' + action.assign_flag + '" action-code="'
		+ action.action_code + '">不批准</button>';
	} else if (action.action_code == 'reject') {
		approveInfo += '<button class="approve-btn" type="button"  action-code="'
				+ action.action_code + '">驳回</button>';
	} else if (action.action_code == 'recall') {
		approveInfo += '<button class="approve-btn approve-btn-first " type="button" action-code="'
				+ action.action_code + '">收回</button>';
		approveInfo += '<div class="drawtaskid" style="visibility: none" value="'+action.taskdrawid+'"><div>';
	} else if (action.action_code == '') {
		approveInfo += '<button class="approve-btn approve-btn-first " type="button" action-code="'
				+ action.action_code + '">提醒审批</button>';
	} else if (action.action_code == 'cancelApprove') {
		var action_code = action.action_code;
		// if (action.pk_workflownote == 'AUTO') {
		// 	action_code = 'recall';
		// }
		approveInfo += '<button class="approve-btn approve-btn-first "  type="button" action-code="'
				+ action_code + '">取消审批</button>'
	} else if (action.action_code == 'reassign') {
		approveInfo += '<button class="approve-btn"  id="reassign" action-code="'
				+ action.action_code + '">改派</button>'
	} else if (action.action_code == 'addApprove') {
		approveInfo += '<button class="approve-btn" id="addapprove" action-code="'
				+ action.action_code + '">加签</button>'
	}
	return approveInfo;
}

function initHistoryTaskList ($wrap, notes, todo_action_info, pk_user, todo_users, waittime, wait_commit, hasTodo) {
	var timer = 0
	var cellWidth = 200
	if (hasTodo) {
		notes = notes.concat([{
			pk_user: pk_user,
			todo_action_info: todo_action_info,
			todo_users: todo_users,
			waittime: waittime,
			wait_commit: wait_commit
		}])
	}
	function setTimeoutHandler () {
		var wrapWidth = $wrap.parent().width()
		var rows = Math.floor(wrapWidth/cellWidth)
		$wrap.width(cellWidth*rows)
		var htmlStr = ['<ul class="approve-history-task-list">']
		$.each(notes, function(i, v) {
			var newLineStart = !(i % rows)
			var newLineEnd = i % rows == rows - 1
			var isOdd = !!(Math.floor(i/rows)%2)
			if (newLineStart) {
				htmlStr.push('<li class="' + (isOdd ? 'odd' : 'even') + '"><ul class="approve-history-task-list-tr">')
			}
			if (!hasTodo && i == notes.length - 1) {
				htmlStr.push('<li class="approve-history-task-list-td last-pass">')
			} else{
				htmlStr.push('<li class="approve-history-task-list-td">')
			}
			if (hasTodo && i == notes.length - 1) {
				htmlStr.push(todoListsViewCtrlNew(v.pk_user, v.todo_action_info, v.todo_users, v.waittime, v.wait_commit));
			}
			else {
				htmlStr.push(historyTaskWithNumNew(v, i+1))
			}
			htmlStr.push('</li>')
			if (newLineEnd) {
				htmlStr.push('</ul></li>')
			}
		})
		htmlStr.push('</ul>')
		$wrap.html(htmlStr.join(''))
		timer = 0;
	}

	return function(e){
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(setTimeoutHandler, 300)
	}
}

/**
 * 工作流信息的横版样式
 *
 * @param openbillid 打开单据的pk
 * @param billtype 单据类型
 * @param dom 前台元素
 */
function getApproveInfosNew(param, pagedom, json, org, callback,flowpanelctx,pk_temp) {
	workflowdata.viewModel=flowpanelctx.viewModel;
	workflowdata.ctx=flowpanelctx.ctx;
	workflowdata.datatableIds=flowpanelctx.datatableIds;
	workflowdata.app=flowpanelctx.app;
	workflowdata.param=param;
	/*if(!param || json == undefined){
		return;
	}*/
	var $approvaouter = $(pagedom).removeClass('hide');
	$approvaouter.html('\
		<div class="grid simple jbxx">\
			<div class="grid-title">\
				<h4 class="label-left-em">审批情况</h4>\
			</div>\
			<div id="apprvoeinner" class="form-wizard-steps approve approve-ver"></div>\
		</div>');
	var $approvaInfos = $('#apprvoeinner');
	// 审批信息
	var notes = json.history_task; // 已处理的任务
	var todo_users = json.todo_users; // 待处理的流程
	var waittime = json.wait_time +"分"; // 待处理任务的等待时间
	var todo_action_info = json.todo_action_info;
	var wait_commit = json.wait_commit;
	$approvaInfos.empty();
	$approvaInfos.show();

	// 流程是否已经结束
	var hasTodo = todo_action_info != null && todo_action_info.length > 0;
	hasTodo = hasTodo || (todo_users != null && todo_users.length != 0);

	// 回调业务过滤
	if (callback != undefined && callback.filtToDoAction != undefined) {
		todo_action_info = callback.filtToDoAction(todo_action_info);
	}
	var approveInfo = '<div class="approve-hor">';
	approveInfo += '      <div class="approve-content clearfix">';
	var noteLength = notes.length;
	// 如果有待处理的任务,那么最后且已处理的流程的个数大于2的话,则需要输出浮出层样式
	var todolistStyles = '';
	approveInfo += '        </div>';
	if(todo_action_info) {
		approveInfo += '<div class="approve-btn-area">';
		approveInfo += generateTodoButtonNew(todo_action_info.actions,org);
		approveInfo += '</div>';
	}
	approveInfo += '    </div>';
	$approvaInfos.append($(approveInfo));
	$(window)
		.on('resize', initHistoryTaskList(
			$approvaInfos.find('.approve-content'),
			notes,
			todo_action_info,
			param.pk_user,
			todo_users,
			waittime,
			wait_commit,
			hasTodo
		))
		.trigger('resize')
	bindEvent(org);
}





function generateTodoButtonNew(todo_actions, org) {
	var approveInfo = '';
	if(todo_actions){
		for ( var k = 0; k < todo_actions.length; k++) {
			var action = todo_actions[k];
			approveInfo += interpreTodoBtnsNew(action, org);
		}
	}
	return approveInfo;
}


/**
 * @param todo_action_info 动作
 * @param todos 待处理的流程数组
 * @param waittime 带处理时间
 * @param wait_commit 待提交标志 若wait_commit为true 则待处理任务中显示 "待xxx 提交" 否则,显示"待xxx 处理"
 * @returns {string}
 */
function todoListsViewCtrlNew(pk_user,todo_action_info, todos, waittime, wait_commit, org) {
	var approveInfo = '<div class="approve-pending approve-todo-action"  pk_workflownote="'
			+ todo_action_info.pk_workflownote + '">';
	approveInfo += '    <div class="approve-left"> <div class="approve-bage"><span class="fa fa-pencil"></span></div></div>';
	approveInfo += '    <div class="approve-textarea">';
	if (todo_action_info.showCheckNote) {
		approveInfo += '    <textarea class="form-control approve-textarea-scale" rows="2" style="height: 48px;" placeholder="请输入意见"></textarea>';
	}
	if (todos != null && todos.length != 0) {
		approveInfo += '      <div class="approve-person-pending' + (todo_action_info.showCheckNote ? '' : ' notText') + '"> <p>待';
		var title = '待: ';
		for ( var i = 0; i < todos.length; i++) {
			var todo = todos[i];
			if (i != 0) {
				title += ',' + todo.name;
			} else {
				title += todo.name;
			}
			if (i < 2) {
				approveInfo += '<span class="approve-person" title="'
						+ todo.name + '">' + todo.name + '</span>';
			} else {
				if (i == 2) {
					if (i == todos.length - 1) {
						approveInfo += '<span class="approve-person" title="'
								+ title + '">...</span>';
					} else {
						approveInfo += '<span class="approve-person" title="';
					}
				} else if (i == todos.length - 1) {
					if (wait_commit) {
						title += ' 提交';
					} else {
						title += ' 审批';
					}
					approveInfo += title + '">...</span>';
				}
			}
		}
		approveInfo += (wait_commit ? '提交' : '审批') + '</p><p>在手时间' + waittime
				+ '</p> </div>';
	}
	approveInfo += '</div>';
	// 按钮的生成
	// approveInfo += generateTodoButtonNew(todo_action_info.actions,org);
	return approveInfo;
}

/**
 * 改派视图的生成
 *
 * @param pk_workflownote 点击改派时流程所处的环节的pk_workflownote
 * @param actionCode 改派的动作代码
 * @param param 参数
 */
function generateReassignView(pk_workflownote, actionCode, param, org) {
		var view = '<div class="modal-dialog" workflow_note="' + pk_workflownote + '" actionCode=' + actionCode + ' param="' + param + '" >';
		view += '           <div class="modal-content reject-content">';
		view += '                  <div class="modal-header reject-header"><h4>改派</h4><a class="reject-head-close" title="点击关闭" href="javascript:void(0)" data-dismiss="modal">×</a></div>';
		view += '                  <div class="modal-body"  style="background-color: white;padding-left:0; padding-right:0; padding:0px">';
		//view += '                  <fieldset class="form-group form-group-sm billitem assignfield">	';
		view += '                   <div class="reject-content">';
		view += '                  		<label class="billitem-label" style="color:#4C4C4C">';
//		view += '                  			<div class="billitem-label-content">用户</div>';
		view += '                  		</label>';
		view += '                  		<div>';
		view += '                  			<label for="wf_pk_user">改派至</label>';
		view += '                  			<div class="input-group">';		
		view += '                  			<input id="wf_pk_user" u-meta=\'{"type":"uiRefer","data":"mainOrg", "field":"pk_org"}\' data-refcfg=\'{"isEnable":true, "isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","ctx":"/uitemplate_web"}\'  data-refmodel=\'{"refUIType":"RefGrid","refCode":"wbUser","defaultFieldCount":4,"strFieldCode":["user_code","user_name"],"strFieldName":["编码","名称"],"isMultiSelectedEnabled":true,"rootName":"用户","refModelUrl":"http://localhost:8080/wbalone/wbUserRef/","refName":"用户","refClientPageInfo":{"pageSize":100,"currPageIndex":0,"pageCount":0},"strHiddenFieldCode":["cuserid","user_type"],"refCodeNamePK":["user_code","user_name","cuserid"],"refName":"用户"}\' class="form-control" type="text" >';
		view += '                  			<span class="input-group-addon input-group-addon-show widgetMark"><span class="fa fa-angle-down"></span></span>';
		view += '                  			</div>';
		view += '                  		</div>';
		view += '                  	</div>';
		//view += '                  	</fieldset>';
		view += '         	<div class="modal-footer reject-footer"> <button id="' + actionCode + '-sure-btn" btntype="okBtn" type="button" class="reject-sur-btn" data-dismiss="modal" >确定</button></div>';
		view += '                  </div>';
		view += '     </div>';
		$("#dialog").empty().append($(view));
		$("#editBtn").css("z-index","1050");


		$('#dialog').modal();
	    refInit('wbUser');
		initRefUI('wf_pk_user');

}

/**
 * 加签视图的生成
 *
 * @param pk_workflownote 点击改派时流程所处的环节的pk_workflownote
 * @param actionCode 加签的动作代码
 * @param param 参数
 */
function generateAddapproveView(pk_workflownote, actionCode, param, org) {
		var view = '<div class="modal-dialog" workflow_note="' + pk_workflownote + '" actionCode=' + actionCode + ' param="' + param + '" >';
		view += '           <div class="modal-content reject-content">';
		view += '                  <div class="modal-header reject-header"><h4>加签</h4><a class="reject-head-close" title="点击关闭" href="javascript:void(0)" data-dismiss="modal">×</a></div>';
		view += '                  <div class="modal-body"  style="background-color: white;padding-left:0; padding-right:0; padding:0px">';
		view += '                  <fieldset class="form-group form-group-sm billitem">	';
		view += '                  		<label class="billitem-label" style="color:#4C4C4C">';
		view += '                  			<div class="billitem-label-content">业务员</div>';
		view += '                  		</label>';
		view += '                  		<div class="input-group date form_date" style="top: 10px;">';
		view += '                  			<input id="wf_pk_user" class="form-control" type="text"  u-meta=\'{"type":"ncRefer","data":"mainOrg", "field":"pk_org"}\' data-refcfg=\'{"isEnable":true, "isMultiSelectedEnabled":false}\'  data-refmodel=\'{"refUIType":"CommonRef","defaultFieldCount":4,"strFieldCode":["user_code","user_name","pk_usergroupforcreate","pk_org"],"strFieldName":["编码","名称","所属用户组","所属组织"],"strHiddenFieldCode":["cuserid","user_type"],"refCodeNamePK":["user_code","user_name","cuserid"],"refName":"用户"}\'>';
		view += '                  			<span class="input-group-addon"><span class="fa fa-angle-down"></span></span>';
		view += '                  		</div>';
		view += '                  	</fieldset>';
		view += '         	<div class="modal-footer reject-footer"> <button id="' + actionCode + '-sure-btn" btntype="okBtn" type="button" class="reject-sur-btn" data-dismiss="modal" >确定</button></div>';
		view += '                  </div>';
		view += '     </div>';
		$("#dialog").empty().append($(view));
		$("#dialog").css("z-index","1050");
		$('#dialog').modal();
		initRefUI('wf_pk_user');

}



/**
 * 驳回视图的生成
 *
 * @param pk_workflownote 点击驳回时流程所处的环节的pk_workflownote
 * @param actionCode 驳回的动作代码
 * @param param 参数
 */
function generateRejectView(pk_workflownote, actionCode, param) {
	if(arguments.callee.softAlterParam && actionCode == undefined){
		pk_workflownote = arguments.callee.softAlterParam.pk_workflownote;//任务id
		actionCode = arguments.callee.softAlterParam.actionCode;
		param = arguments.callee.softAlterParam.param;
	}
	var random=new Date().getTime();
	var obj = JSON.stringify(param);
	$.ajax({
		type: "post",
		url:  window.$ctx + "/approval/getRejectActivity",
		dataType: "json",
		data: {
			actionCode:actionCode,
			pk_workflownote:pk_workflownote,
			param:encodeURI(encodeURI(param)),
			pk_procdefins:"",
			ramdom:random,
			pk_user:param.pk_user
		},
		success : function(rejectInfos) {
					//$.removeWaiting();
					if (rejectInfos.message) {
						/*$.showMessageDialog({
							type : "info",
							title : "提示",
							msg : "查询不到信息,数据可能被已经更新,请刷新单据",
							backdrop : true
						});*/
						dialogmin("查询不到信息,数据可能被已经更新,请刷新单据",'tip-alert');
						return;
					}
					var view = '    <div class="modal-dialog rejectdialog" workflow_note="'
							+ pk_workflownote + '" actionCode=' + actionCode
							+ ' param='+ encodeURI(encodeURI(obj)) + '>';
					view += '           <div class="modal-content reject-content ">';
					view += '                  <div class="modal-header reject-header"><h4>驳回至</h4><a class="reject-head-close" title="点击关闭" href="javascript:void(0)" data-dismiss="modal">×</a></div>';
					view += '                  <div class="modal-body"  style="background-color: white;padding-left:0; padding-right:0; padding:0px">';
					view += '                      <table class="table reject-table" id="datatable"><tbody>';
					var rejectChildrenInfos = rejectInfos.rejectInfo;//后台返回数据格式新增一层_children--by wujiank
					if(rejectChildrenInfos){
						var assignInfoItems = rejectChildrenInfos.assignInfoItems;//后台返回数据格式新增一层_children--by wujiank
						var assignInfoItemschildren = assignInfoItems;

						for ( var i = 0; i < assignInfoItemschildren.length; i++) {
							var assignInfoItem = assignInfoItemschildren[i];
							if(!assignInfoItem)
								continue;
							var assignInfoItemChildren = assignInfoItem;
							var trLine = '<tr  class="reject-tr" activity-def-id="'
									+ assignInfoItemChildren.activityId + '">';
								//trLine += '<td class="reject-table td">' + assignInfoItemChildren.activityId + '</td>';
							trLine += '<td class="td_activity"><span>环节信息</span></td>';
							trLine += '<td  class="reject-table td">' + assignInfoItemChildren.activityName + '</td>';
							trLine += '</tr>';
							view += trLine;
						}
					}

					
					view += '<tr  class="reject-tr" activity-def-id="billmaker"> ';
					view += '<td class="td_activity"><span>制单人</span></td><td></td>';	
					view += '</tr>';
					
					
					
					view += '                     </tbody></table>';
					view += '         <div class="modal-footer reject-footer"> <button id="reject-sure-btn" btntype="okBtn" type="button" class="reject-sur-btn" data-dismiss="modal" >确定</button></div>';
					view += '                  </div>';
					view += '     </div>';
					$("#dialog").empty().append($(view));
					$("#dialog").css("z-index","1050");
					$("#dialog").on("click","tr.reject-tr",function() {
						$(this).siblings('.datarow-choosen').removeClass(
								'datarow-choosen');
						$(this).addClass('datarow-choosen');
						$("#reject-sure-btn").removeClass("hidden");
					});
					$('#dialog').modal();
				}
			});
	// return view;
}

/**
 * 根据用户id产生生成指派界面
 *
 * @param pk_workflownote
 * @param actionCode
 * @param param_note
 */
function generateAssignView(pk_workflownote, actionCode, param_note) {
	$
			.ajax({
				url : '/iform_web/wf_ctr/getAssignInfo?pk_workflownote='
						+ pk_workflownote + "&ramdom=" + new Date().getTime(),
				"type" : "GET",
				dataType : 'json',
				beforeSend : $.showWaiting(),
				success : function(assignInfos) {
					var view = '<div class="modal-dialog" pk_workflownote="'
							+ pk_workflownote + '" actionCode="' + actionCode
							+ '" param_note="' + param_note + '">';
					view += '         <div class="modal-content assign-content">';
					view += '               <div class="modal-header assign-header"><h4 class="modal-title assign-title">指派<a href="javascript:void(0)" data-dismiss="modal"><img src="/iform_web/static/images/workflow/close.png" class="dialog-close"/></a></h4></div>';
					view += '               <div class="modal-body assign-body">';
					var activity = '                    <div class="activity-title">';
					var user_table = '';
					for ( var i = 0; i < assignInfos.length; i++) {
						var assignInfo = assignInfos[i];
						activity += '<span  activity-tab="' + i
								+ '"><a class="activity-selected  '
								+ (i == 0 ? 'activity-tab' : '')
								+ ' " href="javascript:void(0)">'
								+ assignInfo.activityDesc + '</a></span>';
						if (i != assignInfos.length - 1) {
							activity += '<span  class="activity-separator">|</span>';
						}
						var allUsers = assignInfo.allUsers;
						var selectedUsers = assignInfo.selectedUsers;
						var selectedUserSize = 0;
						if (selectedUsers != null && selectedUsers.length != 0) {
							allUsers = selectedUsers.concat(allUsers);
							selectedUserSize = selectedUsers.length;
						}
						user_table += '<table activity-name="'
								+ assignInfo.activityDesc
								+ '"activity-def-id="'
								+ assignInfo.activityDefId + '" activity-tab="'
								+ i + '"class="table assign-table'
								+ (i != 0 ? 'hidden' : '') + ' ">'; // 第一个table之外的叶签默认为隐藏
						for ( var j = 0; j < allUsers.length; j++) {
							var user = allUsers[j];
							if (j == 0) {
								user_table += '<tr>';
							}
							if (selectedUserSize != 0 && j < selectedUserSize) {
								user_table += '<td> <div class="wf-checkbox check-success"><input type="checkbox" class="user-checkbox" disabled> <label> <span class="username">'
										+ user.name
										+ '</span><span class="uid" pk_user="'
										+ user.pk_user
										+ '">'
										+ user.code
										+ '</span><span class="assign-separator">|</span><span class="assign-info">已指派</span></label></div></td>';
							} else {
								user_table += '<td><div class="wf-checkbox check-success"><input type="checkbox" class="user-checkbox"/><label><span class="username" >'
										+ user.name
										+ '</span><span class="uid" pk_user="'
										+ user.pk_user
										+ '">'
										+ user.code
										+ '</span></label> </div></td>';
							}
							if ((j + 1) % 2 == 0 && j != allUsers.length - 1) {
								user_table += '</tr><tr>'
							}
							if (j == allUsers.length - 1) {
								user_table += '</tr>';
							}
						}
						user_table += '</table>';
					}
					activity += '                       </div>';
					activity += user_table;
					view += activity;
					view += '                </div>';
					view += '               <div class="modal-footer assign-footer"> <button id="assign-sure-btn" type="button" class="btn btn-success">确定</button></div>';
					view += '         </div>';
					view += " </div>";
					$("#dialog").empty().append($(view));
					$('#dialog').modal();
					$.removeWaiting();
				}
			});
}

/**
 * 生成审批信息的右面的部分以及浮动层部分,因为他们都是统一的样式,所以使用一个统一的函数输出即可,增加代码的复用性
 */
function generateApproveRightInfo(note) {
	var notedata = note;
	var displayName =notedata.username;
	if (displayName && displayName.length>15 ) {
		displayName = displayName.substr(0,10) + "...";
	}
	var taskComplete = notedata.deleteReason!=null && notedata.deleteReason.indexOf("completed")!=-1;
	var approveInfo = '      <div class="approve-right">';
	approveInfo += '            <p style="margin-bottom:5px;height:15px;margin-top:5px"><span class="approve-person ';
	if(!taskComplete)
		approveInfo += 'approve-person-notcomplete';
	    approveInfo += '" title="'
			+ displayName + '">' + displayName
			+ '</span> <span class="approve-timespan">'
			+ getFormatDateByLong(note.endTime) + '</span> </p>';
	var checknote = typeof (note.taskAuditDesc) == 'undefined' ? ''
			:note.taskAuditDesc;

	var displayNote =  checknote;
	if (checknote.length>15 ) {
		displayNote = checknote.substr(0,15) + "...";
	}
	var taskCommentsMsg = "";
	try{
		taskCommentsMsg = notedata.taskComments[0].message;
	}catch (e) {

	}
	if (taskCommentsMsg.length>15 ) {
		taskCommentsMsg = taskCommentsMsg.substr(0,15) + "...";
	}
	approveInfo += '            <p style="margin-bottom:15px;height:15px"><em class="approve-action">'
			+ note.name + '</em><span class="approve-note" title="'
			+ checknote + '">' + (displayNote+" "+taskCommentsMsg) + '</span></p>';
	approveInfo += '      </div>';
	return approveInfo;
}


/**
 *
 * 当流程超过3个时候,第一个流程显示的样式
 */
function historyTaskShowMore(note) {
	var approveInfo = '<div class="row approve-pass approve-more">';
	approveInfo += '  <div class="approve-left">';
	approveInfo += '    <div class="approve-bage approve-bage-more">...</div>';
	approveInfo += '      <div class="approve approve-popup">';
	approveInfo += '      <div class="approve-arrow-bottom"></div>';
	approveInfo += '      <div class="approve-square-bottom" id="append-div"></div>';
	approveInfo += '   </div>';
	approveInfo += '    <div class="approve-vertical-line"></div>';
	approveInfo += '   </div>';
	approveInfo += generateApproveRightInfo(note);
	approveInfo += '</div>';
	return approveInfo;
}


function reassign(pk_workflownote, actionCode, param_note, org) {
	generateReassignView(pk_workflownote, actionCode, param_note, org);
}

// 加签
function addApprove(pk_workflownote, actionCode, param_note, org) {
	generateAddapproveView(pk_workflownote, actionCode, param_note, org);
}


/**
 *
 * @param note
 * @returns {string}
 */
function historyTaskWithIcon(note) {
	var approveclass = '';
	var iconClass = '';
	if (note.actiontype == 'agree') {
		approveclass = 'approve-passed';
		iconClass = '<span class="fa fa-check"></span>';
	} else if (note.actiontype == 'disagree') {
		approveclass = ' approve-unpassed';
		iconClass = '<span class="fa fa-close"></span>';
	} else if (note.actiontype == 'reject') {
		approveclass = 'approve-reject';
		iconClass = ' <span class="fa fa-arrow-left"></span><span class="fa fa-close"></span>'
	}
	var approveInfo = '<div class="row ' + approveclass + '">';
	approveInfo += '     <div class="approve-left"> <div class="approve-bage">'
			+ iconClass + '</div></div>';
	approveInfo += generateApproveRightInfo(note);
	approveInfo += '</div>';
	return approveInfo;
}


var callback;
function setWorkFlowCallBack(fn) {
	callback = fn;
}


/*function savedata(workflowdata,actionCode,pk_workflownote,param,pk_bo,pk_procdefins){
	var app = workflowdata.app;
	var datas = app.getdt();
	$.ajax({
		type: "post",
		url:  window.$ctx + "/approval/doAction",
		dataType: "json",
		data: {
			datas:JSON.stringify(datas),
			actionCode:actionCode,
			pk_workflownote:pk_workflownote,
			param:encodeURI(encodeURI(param)),
			pk_procdefins:pk_procdefins
		},
		success:function(data){
			if(data.success){
				$.showMessageDialog({
					type : "info",
					title : "提示",
					msg : "操作成功",
					backdrop : true,
					showSeconds:5,
					okfn:function(){reloadBill(data,param,callback)
					}
				});
			}else{
				reloadBill(data,param,callback);
			}
			
		}
	})
	
}*/


/**
 * 流程动作处理的后台统一回调接口
 *
 * @param pk_workflownote
 * @param actionCode
 * @param param
 */
function doAction(pk_workflownote, actionCode, param,pk_bo,pk_procdefins) {
	if(arguments.callee.softAlterParam && actionCode == undefined){
		pk_workflownote = arguments.callee.softAlterParam.pk_workflownote;//任务id
		actionCode = arguments.callee.softAlterParam.actionCode;
		param = arguments.callee.softAlterParam.param;
	}
	var random=new Date().getTime();
	$.ajax({
		type: "post",
		url:  window.$ctx + "/approval/doAction",
		dataType: "json",
		data: {
			actionCode:actionCode,
			pk_workflownote:pk_workflownote,
			param:encodeURI(encodeURI(param)),
			pk_procdefins:pk_procdefins,
			ramdom:random,
			pk_user:param.pk_user
		},
		success:function(data){
			var data=$.parseJSON(data);
			if(data.success){
				/*$.showMessageDialog({
					type : "info",
					title : "提示",
					msg : "操作成功",
					backdrop : true,
					showSeconds:5,
					okfn:function(){reloadBill(data,param,callback)
					}
				});*/
				/*dialogmin("操作成功",'tip-suc');*/
				reloadBill(data,param,callback);
			}else{
				dialogmin(data.message,'tip-alert');
				/*reloadBill(data,param,callback);*/
			}

		}
	})
	/*if("agree"==actionCode)
		savedata(workflowdata,actionCode,pk_workflownote,param,pk_bo,pk_procdefins);
	else{
		$.ajax({
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			url : '/iform_web/wf_ctr/doAction?pk_workflownote=' + pk_workflownote
					+ "&actionCode=" + actionCode + "&param="
					+ encodeURI(encodeURI(param)) + "&ramdom="
					+ new Date().getTime()+"&pk_user="+param.pk_user,
			"type" : "GET",
			dataType : 'json',
			success : function(data) {
				if (data.message == undefined) {
					data = JSON.parse(data);
				}
	
			if(data.success){
				$.showMessageDialog({
					type : "info",
					title : "提示",
					msg : "操作成功",
					backdrop : true,
					showSeconds:5,
					okfn:function(){reloadBill(data,param,callback)
					}
				});
			}else{
				reloadBill(data,param,callback);
			}
		}
	})
	
	}*/
}



function reloadBill(data,param,callback){
	if (typeof (data.message) == "undefined") {
		if(callback) {
			callback();
		}else {
			location.reload();
		}
	}
	else if (data.isSoAlter == "true") {
		param = JSON.parse(param);
		param.eParam = data.eParam;
		param = JSON.stringify(param);
		doAction.softAlterParam = { pk_workflownote: pk_workflownote, actionCode:actionCode, param:param};

		$.showMessageDialog({type:"warning",title:"控制提示",okfn:doAction,msg:data.message,backdrop:true});

	}
	else {
		/*$.showMessageDialog({
					type : "info",
					title : "提示",
					msg : data.message != null ? data.message : "发生未知原因错误,审批失败",
					backdrop : true
				});*/
		var msg=data.message != null ? data.message : "发生未知原因错误,审批失败";
		dialogmin(msg,'tip-alert');
	}

}




window.onunload = function() {
	try {
		var doc = window.opener.document;
	} catch (e) {
		return;
	}
	// 报账人门户按钮
	// var makebill = doc.getElementById("wytd_div");//制单
	var todo = doc.getElementById("wwc_div");// 未完成
	var done = doc.getElementById("ywc_div");// 已完成
	// 审批人门户按钮
	var waitapprove = doc.getElementById("wait_approve_div");// 未审批
	var approved = doc.getElementById("have_approve_div");// 已审批
	if (todo != null) {
		if ($(todo).attr("isselected") == "1") {
			// 未完成
			window.opener.queryByCompleteStatus(null, "0");
		} else if ($(done).attr("isselected") == "1") {
			// 已完成
			window.opener.queryByCompleteStatus(null, "1");
		} else {
			// 我要填单
			window.opener.queryByCompleteStatus(null, "2");
		}
	} else if (waitapprove != null) {
		var approvestatus = 1; // 已审批默认值
		if ($(waitapprove).attr("isselected") == "1") {// 待审批
			approvestatus = 0;
		}
		window.opener.queryByApproveStatus(null, approvestatus);
	}
};

/**
 * 业务流联查
 *
 * @param openbillid 打开单据的pk
 * @param billtype 单据类型
 * @param dom 前台元素
 */
function getBillFlowInfos(billid, billtype,billNo, dom) {
	// var $billflow = $(dom);
	if(typeof dom ==='undefined'||dom==null){
	//如果没有传入dom,或者dom传空，默认取 id=tail_flowinfo 的元素
		dom = "#tail_flowinfo"
	}
	var billUrl="/iform_web/flowinfoctrl/queryflow?openbillid=" + billid
	+ "&billtype=" + billtype + "&time="
	+ new Date().getTime();
	// $billflow.append($(table));
	 if (typeof billNo === 'undefined' || billNo == null) {

	} else {
		billUrl = billUrl + "&billNo=" + billNo;
	}
	$.ajax({
				url :billUrl,
				type : "GET",
				dataType : "json",
				success : function(datas) {
					var table = '<div class="table-responsive">'
							+ '  <div class="row-fluid">'
							+ '   <table class="table table-bordered table-condensed table-hover table-fi" >'
							+ '     <thead id="flowinfo_thead">'
							+ '         <tr>';
							if(typeof billNo === 'undefined' || billNo == null){

							table+= '             <th class="text-center">位置</th>';
							} else{
							table+= '             <th class="text-center"> 位置</th>'
							+ '             <th class="text-center">行号</th>';

										}
							table+= '             <th class="text-center"> 单据类型</th>'
							+ '             <th class="text-center">单据编号</th>'
							+ '         </tr>' + '     </thead>';
					if (datas.stack !== "undefined") {
						// 后台不出错,则显示流程的信息
						var tds = "<tbody>";
						if (datas.length != 0) {
							// todo 隐藏推单按钮
							for ( var i = 0; i < datas.length; i++) {
								var data = datas[i];
								tds += '<tr><td class="text-center" style="text-align:left">';

									if(typeof billNo === 'undefined' || billNo == null){
										tds += data.pos;
										}
										else{
										tds += data.pos.split("##")[0];
										tds +='</td><td class="text-center" style="text-align:left">'+data.pos.split("##")[1];
										}
										tds += '</td><td class="text-center">'
										+ data.tradetypename
										+ '</td><td class="text-center" style="text-align:left"><a href="/iform_web/flowinfoctrl/redirect?openbillid='
										+ data.billid + '&billtype='
										+ data.pk_tradetype + '" >'
										+ data.billno + '</td></tr>';
							}
						} else {
							tds += '<tr><td class="text-center">该单据暂无上下游信息</td><td></td><td></td></tr>'
						}
						tds += "</tbody>";
						table += tds;
						// $(tds).insertAfter($('#flowinfo_thead'));
					} else {// 后台出错的话,提示后台信息
						$.showMessageDialog({
							type : "info",
							title : "提示",
							msg : datas.message,
							backdrop : true
						});
					}
					table += '</table>' + '</div>' + '</div>';
					$(dom).append($(table));
				}
			})
}


//加签 改派参照UI
function initRefUI(name) {
	$("#"+name).each(
			function() {
				var $that=$(this);
				var refcont = $('#refContainer'+name);
				if (refcont && refcont.length > 0) {
					refcont.each(function() { refcont.data('uui.refer', ''); });
				}
				var options = {
					  refInput:$that,
					  refModelUrl:'http://127.0.0.1:8080/iform_web/bpmuserref/',
				 	  isPOPMode:true,
				 	  contentId:'refContainer'+name,
					  dom: $that,
					  pageUrl: '/iform_web/static/js/ref/refDList.js',
					  setVal: function(data) {
								 if (data) {
									var users = [];
									if (data && data.length>0) {
										$that.find("input").length==0?$that.val(data[0].refname):$that.find("input").val(data[0].refname);
										$that.data('refpk', data[0].refpk)
									}

									$('#refContainer'+name).Refer('hide');
								}

							},
					  onOk: function(data){
						   	this.setVal(data);
						   	$('#refContainer'+name).Refer('hide');
					 	},
					  onCancel: function(){
					  	$('#refContainer'+name).Refer('hide');
					  }
				};

				var pageURL = options.pageUrl;
				var refInitFunc = pageURL.substr(pageURL.lastIndexOf('/') +1).replace('.js','');

				if(!window[refInitFunc]){
					var scriptStr = '';
				$.ajax({
					url:pageURL,
					dataType:'script',
						async : false,
						success : function(data){
							scriptStr  = data
						}
					})
					eval(scriptStr);
				}
				window[refInitFunc](options);
				/*if(isMobile){
					u.compMgr.dataAdapters.uiRefer.prototype.initialize(options);
				}*/
				$that.off('blur.refer');

			});
}



// $(window).scroll(function (e) {
// if ($(document).scrollTop() > 200) {
// $("#approvalinfos").css("position", "fixed")
// } else {
// $("#approvalinfos").css("position", "relative");
// }
// });
 