/**
 * Created by liuch on 15-3-20.
 * Modified by chenyl on 15-7-1
 */

// 改派
function reassign(pk_workflownote, actionCode, param_note, org) {
	generateReassignView(pk_workflownote, actionCode, param_note, org);
}

// 加签
function addApprove(pk_workflownote, actionCode, param_note, org) {
	generateAddapproveView(pk_workflownote, actionCode, param_note, org);
}

// 加签 改派参照UI
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
				 	  isPOPMode:true,
				 	  contentId:'refContainer'+name,
					  dom: $that,
					  pageUrl: '/uitemplate_web/static/js/ref/refDList.js',
					  setVal: function(data) {
								 if (data) {
									var users = [];
									if (data && data.length>0) {
										 $that.val(data[0].refname);
										 $that.data('refpk', data[0].refpk);
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
				
				$that.off('blur.refer');

			});
}
/**
 * 审批框中各种按钮的事件的响应
 */
function bindEvent(org) {
	createModalDialogDom();
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
						var pk_workflownote = $(this).parents(".approve-todo-action").attr("pk_workflownote");
						if (pk_workflownote === undefined) {
							pk_workflownote = $(this).parents(".approve-passed").attr("pk_workflownote")
						}
						if (pk_workflownote === undefined) {
							pk_workflownote = $(this).parents(".approve-unpassed").attr("pk_workflownote")
						}

						var actionCode = $(this).attr("action-code");
						// var textValue =
						// $(this).parents("div.approve-right").children("textarea").val();
						var param_note = $(this).parents("div.approve-pending").children("div.approve-right").children("textarea").val();
						
						// 批准时如果没有输入意见默认是同意
						if ($(this).attr("action-code") === 'agree' && param_note === "") {
							param_note = '同意';
						}
						
						if (param_note != null && param_note.length > 50) {
							$.showMessageDialog({
								type : "info",
								title : "提示",
								msg : "批语只能输入50个字以内",
								backdrop : true
							});
							return;
						}
						var obj  = (function () {
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
						})();
						obj.param_note= param_note;
						var param = JSON.stringify(obj);
						var $dialog = $("#dialog");
						// 如果是驳回按钮,则先弹出驳回页面
						if (actionCode === 'reject') {
							if (param_note == null
									|| param_note.trim().length == 0) {
//								$.showMessageDialog({
//									type : "info",
//									title : "提示",
//									msg : "驳回流程必须输入意见",
//									backdrop : true
//								});
//								return;
							}
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
							doAction(pk_workflownote, actionCode, param);
						}
					});

	$("#dialog")
			.on("click", "#reassign-sure-btn",function() {
					dialogActionReassign($(this));
			})
			.on("click", "#reject-sure-btn",function() {
					dialogActionReject($(this));
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
								$.showMessageDialog({
									type : "info",
									title : "提示",
									msg : name + " 环节没有指派人",
									backdrop : true
								});
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
		if (user === undefined ) {
			$.showMessageDialog({
				type : "info",
				title : "提示",
				msg : "请选择具体指派人",
				backdrop : true
			});
			return;
		}
		var dialog = $("#dialog");
		var actionCode = dialog.children(".modal-dialog").attr("actionCode");
		var pk_workflownote = dialog.children(".modal-dialog").attr("workflow_note");
		
		var obj = {};
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
		return;
	}
	
	var dialog = $("#dialog");
	var actionCode = dialog.children(".modal-dialog").attr("actionCode");
	var pk_workflownote = dialog.children(".modal-dialog").attr("workflow_note");
	
	var obj = {};
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
		var obj = {};
		obj.param_note = param_note;
		obj.param_reject_activity = param_reject_activity;
		var param = JSON.stringify(obj);
		doAction(workflow_note, actionCode, param);
	} else {
		$.showMessageDialog({
			type : "info",
			title : "提示",
			msg : "请选择具体某个环节",
			backdrop : true
		});
		return;
	}
}

function createModalDialogDom() {
	var dom = $('#apprvoeinner');
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
	var deleteReason = note._children.deleteReason._value
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

/**
 * 横版的流程状态
 * 
 * @param note
 * @param todo_actions
 * @returns {string}
 */
function historyTaskViewRight(note, org) {
	return historyTaskViewRight(note,org, false);
}

function historyTaskViewRight(note, org, isLast) {
	var notedata = note._children;
	var taskComplete = notedata.deleteReason!=null && notedata.deleteReason._value.indexOf("completed")!=-1;
	var approveInfo = '<div class="approve-right">';
	approveInfo += '    <p><div class="approve-person ';
	if(!taskComplete)
		approveInfo += 'approve-person-notcomplete';
	approveInfo +='" title="'
				+ notedata.username._value + '">' + notedata.username._value
				+ '</div><div class="approve-timespan">'
				+ getFormatDateByLong(notedata.endTime._value) + '</div></p>';
	if (!isLast) {
		approveInfo += '     <div class="approve-horizon-line"></div>';
	}
	var checknotetext = typeof (notedata.name._value) != "undefined" ? notedata.name._value
			: "";
	
	var displayNote =  checknotetext;
	if (checknotetext.length>10 ) {
		displayNote = checknotetext.substr(0,10) + "...";
	}
	
	approveInfo += '     <p><em class="approve-action">' + notedata.name._value
			+ '</em><span class="approve-note" title="' + checknotetext + '">'
			+ (displayNote) + '</span></p>';
	approveInfo += '    </div> ';
//	if (todo_actions != null && todo_actions.length > 0) {
//		if (note.pk_workflownote == "AUTO") {
//			for ( var j = 0; j < todo_actions.length; j++) {
//				var todo_action = todo_actions[j];
//				todo_action.pk_workflownote = "AUTO";
//			}
//		}
		
	//	approveInfo += generateTodoButtonNew(todo_actions, org);
//	}
	return approveInfo;
}

/**
 * 工作流信息的横版样式
 * 
 * @param openbillid 打开单据的pk
 * @param billtype 单据类型
 * @param dom 前台元素
 */
function getApproveInfosNew(param, pagedom, json, org, callback) {
	 		if(!param)
	 			return;
			var $approvaouter = $(pagedom);
			$approvaouter.html('<br><div class="grid simple jbxx"><div class="grid-title"><h4 class="label-left-em">审批情况</h4> </div> <div class="grid-body"><div id="apprvoeinner" class="form-wizard-steps approve approve-ver " style="min-height: 90px;"></div></div></div>');
			var dom = $('#apprvoeinner');
//			$.ajax({
//				url : '/iform_web/wf_ctr/workflownoteQry?pk_bo=' + param.pk_bo
//						+ '&pk_boins=' + param.pk_boins + "&time="
//						+ new Date().getTime()+"&pk_user="+param.pk_user,
//				"type" : "GET",
//				dataType : 'json',
//				success : function(json) {
//					debugger;
					var $approvaInfos = $(dom);
					// 审批信息
					if(json == undefined){
						return;
					}
					var notes = json.history_task; // 已处理的任务
					var todo_users = json.todo_users; // 待处理的流程
					var waittime = formatLongToTime(json.wait_time); // 待处理任务的等待时间
					var todo_action_info = json.todo_action_info;
					var wait_commit = json.wait_commit;
					$approvaInfos.empty();
					$approvaInfos.show();
					
					// 无审批流的信息
					if (typeof notes == 'undefined' || notes == null
							|| notes.length == 0) {
						$approvaInfos.append("该单据暂无审流程");
						$approvaouter.hide();
						return;
					}
					
					// 流程是否已经结束
					var hasTodo = todo_action_info != null && todo_action_info.length > 0;
					hasTodo = hasTodo || (todo_users != null && todo_users.length != 0);

					// 回调业务过滤
					if (callback != undefined && callback.filtToDoAction != undefined) {
						todo_action_info = callback.filtToDoAction(todo_action_info);
					}
					
					
					var approveInfo = '<div class="approve-hor">';
					approveInfo += '      <div class="approve-content">';
					var noteLength = notes.length;
					// 如果有待处理的任务,那么最后且已处理的流程的个数大于2的话,则需要输出浮出层样式
					var todolistStyles = '';
					// 1. 如果有待处理的任务,那么最后一环节必须输出待处理的任务样式
					// if (todo_users != null && todo_users.length != 0) {
					if (hasTodo) {
						if (noteLength > 2) { // 如果已处理的任务数>2的话,那么需要输出浮出层样式
							approveInfo += historyTaskShowMoreNew(notes[0], org);
							// 只处理最后一个
							var lastOneTask = notes[noteLength - 1];
							
							approveInfo += historyTaskWithNumNew(notes[noteLength - 2], noteLength - 1, org);
							if(todo_action_info)
								approveInfo += historyTaskWithIconNew(lastOneTask,todo_action_info.pk_workflownote);
							else
								approveInfo += historyTaskWithIconNew(lastOneTask,null);
							if (todo_users != null && todo_users.length != 0) {
								// 如果有待处理人,则显示待处理人的样式
								todolistStyles = todoListsViewCtrlNew(todo_action_info, todo_users, waittime,wait_commit, org);
								approveInfo += todolistStyles;
							} 
							
						} else { // 如果已处理的任务数<=2
							// 第一个
							approveInfo += historyTaskWithNumNew(notes[0], 1, org);
							if (todo_users != null && todo_users.length != 0) {
								if (noteLength == 2) {
									approveInfo += historyTaskWithNumNew(notes[1], 2, org);
								}
								// 待处理任务
								approveInfo += todoListsViewCtrlNew(todo_action_info, todo_users, waittime,wait_commit, org);
							} else {
								if(todo_action_info)
									approveInfo += historyTaskWithIconNew(notes[noteLength-1],todo_action_info.pk_workflownote);
								else
									approveInfo += historyTaskWithIconNew(notes[noteLength-1],null);
							
							}
						
						}
					} else {
						// 2. //如果没有待处理的任务
						if (noteLength > 2) {
							// 已处理的任务数 > 2,那么也要显示浮出层样式
							// 第一个按钮应该显示更多icon
							approveInfo += historyTaskShowMoreNew(notes[0], org);
							// 倒数第二个
							approveInfo += historyTaskWithNumNew(notes[noteLength - 2], noteLength - 1, org);
							// 最后一个为已处理任务中的流程,显示图片
							approveInfo += historyTaskWithIconNew(notes[noteLength - 1]);
						} else { // 已处理的任务数如果<=2,那么直接显示即可
							approveInfo += historyTaskWithNumNew(notes[0], 1, org);
							if (noteLength == 2) {
								if(todo_action_info)
									approveInfo += historyTaskWithIconNew(notes[1],todo_action_info.pk_workflownote);
								else
									approveInfo += historyTaskWithIconNew(notes[1],null);
							}
						}
					}
					if(todo_action_info)
						approveInfo += generateTodoButtonNew(todo_action_info.actions,org);
					
					approveInfo += '        </div>';
					approveInfo += '    </div>';
					$approvaInfos.append($(approveInfo));
					if (notes.length > 2) {
						var allInfos = '<div class="approve-more-infos clearfix">';
						for ( var j = 0; j < notes.length - 1; j++) {
							var note = notes[j];
							allInfos += '<div class="row approve-pass">';
							allInfos += '   <div class="approve-left approve-more-left"> <div class="approve-bage">'
									+ (j + 1) + '</div></div>';
							allInfos += generateApproveRightInfo(note);
							allInfos += '</div>';
						}
						allInfos += '</div>';
						$(allInfos).insertAfter($("#append-div"));
					}
					bindEvent(org);
//				}
//			});
}


function interpreTodoBtnsNew(action, org) {
	var approveInfo = '';
	if (action.action_code == 'agree') {
		approveInfo += '<button class="approve-btn approve-dopass-btn" type="button" assign-flag="'
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
//		if (action.pk_workflownote == 'AUTO') {
//			action_code = 'recall';
//		}
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


function generateTodoButtonNew(todo_actions, org) {
	var approveInfo = '';
	if (todo_actions&&todo_actions.length > 2) {
		// 如果动作大于两个,那么需要有更多样式
		for ( var j = 0; j < 2; j++) {
			var todo_action = todo_actions[j];
			// 前面两个按钮放出来
			approveInfo += interpreTodoBtnsNew(todo_action, org);
		}
		approveInfo += '<div class="btn-group approve-btn-group" style="margin-top: 0px">';
		approveInfo += '   <button type="button" id = "btnother" class="btn btn-default-alt approve-btn dropdown-toggle" data-toggle="dropdown" style="margin-top: 0px; ">其它 <span class="caret"></span></button>';
		approveInfo += '    <ul class="dropdown-menu" role="menu">';
		for ( var beginIndex = 2; beginIndex < todo_actions.length; beginIndex++) {
			var todo = todo_actions[beginIndex];
			if (todo.action_code == 'agree') {
				approveInfo += '<li><a href="javascript:void(0);" assign-flag="'
						+ todo.assign_flag
						+ '" action-code="'
						+ todo.action_code + '">批准</a></li>';
			} else if (todo.action_code == 'disagree') {
				approveInfo += '<li><a href="javascript:void(0);" assign-flag="' + todo.assign_flag + '" action-code="' +
				todo.action_code + '">不批准</a></li>';
			} else if (todo.action_code == 'reject') {
				approveInfo += '<li><a href="javascript:void(0);" action-code="'
						+ todo.action_code + '">驳回</a></li>';
			} else if (todo.action_code == 'recall') {
				approveInfo += '<li><a href="javascript:void(0);" action-code="'
						+ todo.action_code + '">收回</a></li>';
			} else if (todo.action_code == '') {// todo
				approveInfo += '<li><a href="javascript:void(0);" action-code="'
						+ todo.action_code + '">提醒审批</a></li>';
			} else if (todo.action_code == 'addApprove') {
				approveInfo += '<li><a href="javascript:void(0);" id="addapprove" action-code="'
						+ todo.action_code + '">加签</a></li>';
			} else if (todo.action_code == 'reassign') {
				approveInfo += '<li><a href="javascript:void(0);" id="reassign"  action-code="'
						+ todo.action_code + '">改派</a></li>';
			} else if (todo.action_code == 'cancelApprove') {
				var action_code = todo.action_code;
//				if (todo.pk_workflownote == 'AUTO') {
//					action_code = 'recall';
//				}
				approveInfo += '<li><a href="javascript:void(0);" action-code="'
						+ action_code + '">取消审批</a></li>';
			}
		}
		approveInfo += '         </ul>';
		approveInfo += '</div> ';
	} else if(todo_actions){
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
function todoListsViewCtrlNew(todo_action_info, todos, waittime, wait_commit, org) {
	var approveInfo = '<div class="approve-pending approve-todo-action"  pk_workflownote="'
			+ todo_action_info.pk_workflownote + '" style="width: 505px;">';
	approveInfo += '    <div class="approve-left"> <div class="approve-bage"><span class="fa fa-pencil"></span></div></div>';
	approveInfo += '    <div class="approve-right approve-textarea">';
	if (todo_action_info.showCheckNote) {
		approveInfo += '    <textarea class="form-control approve-textarea-scale" rows="2" style="height: 48px;" placeholder="请输入意见"></textarea>';
	} else if (todos != null && todos.length != 0) {
		approveInfo += '      <div class="approve-person-pending"> <p>待';
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
//	// 按钮的生成
//	approveInfo += generateTodoButtonNew(todo_action_info.actions,org);
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
		view += '                  <div class="modal-header reject-header"><h4>改派</h4><a class="reject-head-close" title="点击关闭" href="javascript:void(0)" data-dismiss="modal"><img src="/iform_web/static/images/workflow/close.png" class="dialog-close"/></a></div>';
		view += '                  <div class="modal-body"  style="background-color: white;padding-left:0; padding-right:0; padding:0px">';
		//view += '                  <fieldset class="form-group form-group-sm billitem assignfield">	';										
		view += '                   <div class="reject-content">';
		view += '                  		<label class="billitem-label" style="color:#4C4C4C">';
		view += '                  			<div class="billitem-label-content">业务员</div>';
		view += '                  		</label>';
		view += '                  		<div class="input-group date form_date" >';
		view += '                  			<input id="wf_pk_user" class="form-control" type="text"  u-meta=\'{"type":"ncRefer","data":"mainOrg", "field":"pk_org"}\' data-refcfg=\'{"isEnable":true, "isMultiSelectedEnabled":false}\'  data-refmodel=\'{"refUIType":"CommonRef","defaultFieldCount":4,"strFieldCode":["user_code","user_name","pk_usergroupforcreate","pk_org"],"strFieldName":["编码","名称","所属用户组","所属组织"],"strHiddenFieldCode":["cuserid","user_type"],"refCodeNamePK":["user_code","user_name","cuserid"],"refName":"流程用户"}\'>';
		view += '                  			<span class="input-group-addon"><span class="fa fa-angle-down"></span></span>';
		view += '                  		</div>';
		view += '                  	</div>';
		//view += '                  	</fieldset>';
		view += '         	<div class="modal-footer reject-footer"> <button id="' + actionCode + '-sure-btn" btntype="okBtn" type="button" class="reject-sur-btn" data-dismiss="modal" >确定</button></div>';
		view += '                  </div>';
		view += '     </div>';
		$("#dialog").empty().append($(view));
		$("#dialog").css("z-index","1050");
		$('#dialog').modal();
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
		view += '                  <div class="modal-header reject-header"><h4>加签</h4><a class="reject-head-close" title="点击关闭" href="javascript:void(0)" data-dismiss="modal"><img src="/iform_web/static/images/workflow/close.png" class="dialog-close"/></a></div>';
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
	var obj = JSON.stringify(param);
	$.ajax({
				url : '/iform_web/wf_ctr/getRejectActivity?pk_workflownote=' + pk_workflownote
				+ "&actionCode=" + actionCode + "&param="
				+ encodeURI(encodeURI(obj)) + "&ramdom="
				+ new Date().getTime()+"&pk_user="+param.pk_user,
				"type" : "GET",
				dataType : 'json',
				success : function(rejectInfos) {
					//$.removeWaiting();
					if (rejectInfos.message) {
						$.showMessageDialog({
							type : "info",
							title : "提示",
							msg : "查询不到信息,数据可能被已经更新,请刷新单据",
							backdrop : true
						});
						return;
					}
					var view = '    <div class="modal-dialog rejectdialog" workflow_note="'
							+ pk_workflownote + '" actionCode=' + actionCode
							+ ' param='+ encodeURI(encodeURI(obj)) + '>';
					view += '           <div class="modal-content reject-content ">';
					view += '                  <div class="modal-header reject-header"><h4>驳回至</h4><a class="reject-head-close" title="点击关闭" href="javascript:void(0)" data-dismiss="modal"><img src="/iform_web/static/images/workflow/close.png" class="dialog-close"/></a></div>';
					view += '                  <div class="modal-body"  style="background-color: white;padding-left:0; padding-right:0; padding:0px">';
					view += '                      <table class="table reject-table" id="datatable"><tbody>';
					var rejectChildrenInfos = rejectInfos._children.rejectInfo;
					if(!rejectChildrenInfos)
						return;
					var assignInfoItems = rejectChildrenInfos._children.assignInfoItems;
					if(!assignInfoItems|| !assignInfoItems._children)
						return;
					var assignInfoItemschildren = assignInfoItems._children;
					for ( var i = 0; i < assignInfoItemschildren.length; i++) {
						var assignInfoItem = assignInfoItemschildren[i];					
						if(!assignInfoItem)
							continue;
						var assignInfoItemChildren = assignInfoItem._children;
						var trLine = '<tr  class="reject-tr" activity-def-id="'
								+ assignInfoItemChildren.activityId._value + '">';
							trLine += '<td class="reject-table td">' + assignInfoItemChildren.activityId._value + '</td>';
							trLine += '<td class="reject-table td">' + assignInfoItemChildren.activityName._value + '</td>';
						trLine += '</tr>';
						view += trLine;
					}
					view += '                     </tbody></table>';
					view += '         <div class="modal-footer reject-footer"> <button id="reject-sure-btn" btntype="okBtn" type="button" class="reject-sur-btn" data-dismiss="modal" >确定</button></div>';
					view += '                  </div>';
					view += '     </div>';
					$("#dialog").empty().append($(view));
					$("#dialog").css("z-index","1050");
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
	var notedata = note._children;
	var displayName =notedata.username._value;
	if (displayName && displayName.length>15 ) {
		displayName = displayName.substr(0,10) + "...";
	}
	var taskComplete = notedata.deleteReason!=null && notedata.deleteReason._value.indexOf("completed")!=-1;
	var approveInfo = '      <div class="approve-right">';
	approveInfo += '            <p style="margin-bottom:5px;height:15px;margin-top:5px"><span class="approve-person ';
	if(!taskComplete)
		approveInfo += 'approve-person-notcomplete';
	    approveInfo += '" title="'
			+ displayName + '">' + displayName
			+ '</span> <span class="approve-timespan">'
			+ getFormatDateByLong(note._children.endTime._value) + '</span> </p>';
	var checknote = typeof (note._children.name._value) == 'undefined' ? ''
			:note._children.name._value;
	
	var displayNote =  checknote;
	if (checknote.length>15 ) {
		displayNote = checknote.substr(0,15) + "...";
	}		


	approveInfo += '            <p style="margin-bottom:15px;height:15px"><em class="approve-action">'
			+ note._children.name._value + '</em><span class="approve-note" title="'
			+ checknote + '">' + (displayNote) + '</span></p>';
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
	

/**
 * 流程动作处理的后台统一回调接口
 * 
 * @param pk_workflownote
 * @param actionCode
 * @param param
 */
function doAction(pk_workflownote, actionCode, param) {
	if(arguments.callee.softAlterParam && actionCode == undefined){
		pk_workflownote = arguments.callee.softAlterParam.pk_workflownote;
		actionCode = arguments.callee.softAlterParam.actionCode;
		param = arguments.callee.softAlterParam.param;
	}
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
			
			// var json = JSON.parse(data);
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
				$.showMessageDialog({
							type : "info",
							title : "提示",
							msg : data.message != null ? data.message : "发生未知原因错误,审批失败",
							backdrop : true
						});
			}
		}
	})
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



// $(window).scroll(function (e) {
// if ($(document).scrollTop() > 200) {
// $("#approvalinfos").css("position", "fixed")
// } else {
// $("#approvalinfos").css("position", "relative");
// }
// });
