
define([], function() {
//	var dialogmin=require('dialogmin');	
	
	//--------------start 流程meta---------------------------
	//驳回meta
	var metaReject={
		meta: {
			'activityId': {
				type:'string'
			   },
			'activityName':{
				type:'string'
			 }
//			   , 
//			'participants':{
//				//type:'string'
//			 }
		}
	};
		
	//人员列表
	var metaPerson={
			meta: {
				'id': {
					type:'string'
				 },
				'name':{
					type:'string'
				 },
				'code':{
					type:'string'
				},
				'createTime':{
				type:'date'
				} 
			}
		};
	//start HistoryTask 历史任务
	var metaHistoyTask ={
			
			meta: {
				//主键
				'id': {
					type: 'string'
				},
				//活动名称
				'name':{
					type: 'string'
				},
				//任务开始时间
				'startTime':{
					type:'date'
			     },
			     //任务拥有者
				'owner':{
					type: 'string'
				},
				//流程实例id
				'processInstanceId':{
					type: 'string'
				},
				//结束时间
				'endTime':{
					type:'date'
				},
				//流程实例状态
				'state':{
					type: 'string'
				},
				//审批类型
				'description':{
					type: 'string'
				},
				//完成原因
				'deleteReason':{
					type: 'string'
				},
				//执行人
				'executionId':{
					type: 'string'
				},
				//超时时间
				'claimTime':{
					type:'date'
				}
			}	
			
	};
	//end HistoryTask
	//--------------end 流程meta---------------------------
	
	//定义通过是否的字典属性
	window.BPMBillState = [
	  {
        "value": "NotStart",
        "name": "开立"
      },
      {
        "value": "Run",
        "name": "审批中"
      }, 
      {
         "value": "End",
         "name": "审批通过"
      }, 
      {
          "value": "Cancellation",
          "name": "审批不通过"
      }, 
      {
          "value": "Suspended",
          "name": "挂起"
       }
      ];
	
	var viewModel={
			//驳回列表
			rejectDa:new u.DataTable(metaReject),
			//改派人员列表
			personDa:new u.DataTable(metaPerson),
			//加签
			personAddDa:new u.DataTable(metaPerson),
			//流程历史
			flowHisDa:new u.DataTable(metaHistoyTask),
			prefixurl:"../iuap_qy/",
	        //审批点击流程图
	       bpmImgApproveClickHandler:function(processDefinitionId,processInstanceId,flowHisDa1,showType){
				//----------------------流程图start  -------------	
				var postData={
						processDefinitionId:processDefinitionId,
						processInstanceId:processInstanceId
				};
				$("#img_His").attr({"src":viewModel.prefixurl+"vendor/diagram-viewer/index.html?processDefinitionId="+postData.processDefinitionId+"&processInstanceId="+postData.processInstanceId});
					$.ajax({
						type:'post',
						url:viewModel.prefixurl+'/process/hisTasklist',
						datatype:'json',
						data:JSON.stringify(postData),
						contentType: 'application/json;charset=utf-8',
						success:function(res){
							if(res){
								if( res.statusCode =='200'){
									if(res.data){
										flowHisDa1.setSimpleData(res.data);
										flowHisDa1.setRowSelect(-1);
									}else{
										u.messageDialog({msg:'后台返回数据格式有误，请联系管理员',title:'数据错误',btnText:'确定'});
									}
								}else{
									u.messageDialog({msg:res.message,title:'请求错误',btnText:'确定'});
								}
								//viewModel.pageChange();
								//viewModel.sizeChange();
							}else{
								u.messageDialog({msg:'后台返回数据格式有误，请联系管理员',title:'数据错误',btnText:'确定'});
							}
						},
						error:function(er){
							u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
						}
					});
				
					//viewModel.md.dGo('imgHistory_list');
					//'toggle'
					$('#imgHistory_list').modal(showType) ;
					//hiddenSearchCol();
				//---------------------- 流程图end  --------------
		     }
	};
	//新增时，添加尾部流程图弹出框信息
	bpmAddFoot = function(divfoot,vstate) {			
	 $(divfoot).html(
			    " <!-- start  流程历史图 层---->"
				+"<div class='modal fade' id='imgHistory_list' tabindex='-1' role='dialog'>"
				+"div class='modal-dialog'>"
				+"<div class='modal-content' style='width:90%;height:90% '>"
				+"<div class='u-mdlayout-page-header'><span class='content-title'>流程历史</span></div>"
				+"<div class='u-mdlayout-page-section'>"
				+"<div class=''>"
				+"<div class=''><button type='button' class='u-button raised accent u-button-pa' data-bind='click: bpmImgBack'>返回</button></div>"
				+"<div class='' style=''>"
				+"<iframe id='img_His' width='99%' style='border: 0px;height: 100%;min-height:300px;'></iframe>"
				+"<div class='table-container'>"
				+"<table class='u-table' style='width:99%'>"
				+"<thead>"
				+"<tr>"
				+"<th>任务ID</th>"
				+"<th>任务名称</th>"
				+"<th>任务类型</th>"
				+"<th>执行者</th>"
				+"<th>开始时间</th>"
				+"<th>结束时间</th>"
				+"<th>审批意见 </th>"
				+"<th>超时时间</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody data-bind=\"foreach:{data:flowHisDa.rows(), as: 'row', afterAdd: afterAdd}\">"
				+"<tr data-bind=\"css: { 'is-selected' : row.selected() } ,attr:{'rowindex': $index},click: $parent.rowClick\">"
				+"<td style='display: none;'>"
				+"<label class='u-checkbox only-style' data-bind=\"click: row.multiSelect, css:{'is-checked': row.selected()}\">"
				+"<input type='checkbox' class='u-checkbox-input'>"
				+"<span class='u-checkbox-label'></span>"
				+"</label>"
				+"</td>"
				+"<td data-bind=\"text: row.ref('id')\"></td>"
				+"<td data-bind=\"text: row.ref('name')\"></td>"
				+"<td data-bind=\"text: row.ref('state')\"></td>"
				+"<td data-bind=\"text: row.ref('executionId')\"></td>"
				+"<td data-bind=\"text: row.ref('startTime')\"></td>"
				+"<td data-bind=\"text: row.ref('endTime')\"></td>"
				+"<td data-bind=\"text: row.ref('deleteReason')\"></td>"
				+"<td data-bind=\"text: row.ref('claimTime')\"></td>"
				+"</tr>"
				+"</tbody>"
				+"</table>"
				+"<div id='pagination_img' class=''></div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"<!-- end  流程历史图 层------>	"
	     );	 
    };	
	//审批时，添加头部按钮信息
	bpmApproveHeader = function(divheader,vstate) {
		if(vstate == '1'){
		     $(divheader).html("<div id='approveTypeRadio'>"	 
		        +"<label><input name='approvetype' type='radio' value='agree' checked='true'/><span class='text'></span></label>&nbsp;&nbsp;审批&nbsp;&nbsp;&nbsp;&nbsp;"
				+"<!--<label><input name='approvetype' type='radio' value='unagree'/>&nbsp;&nbsp;<span class='text'>不同意</span></label>&nbsp;&nbsp;-->"
				+"<label><input name='approvetype' type='radio' value='reject'/>&nbsp;&nbsp;<span class='text'>驳回</span></label>&nbsp;&nbsp;&nbsp;"
				+"<label><input name='approvetype' type='radio' value='signAdd'/>&nbsp;&nbsp;<span class='text'>加签</span></label>&nbsp;&nbsp;&nbsp;"
				+"<label><input name='approvetype' type='radio' value='delegate'/>&nbsp;&nbsp;<span class='text'>改派</span></label>"
				+"<label><input name='approvetype' type='radio' value='termination'/>&nbsp;&nbsp;<span class='text'>终止</span></label>"
				+"<textarea id='approve_text' style='width:100%;height:100px;'></textarea>"
				+"</div>"
				+"<button type='button' class='u-button raised accent u-button-pa' id='approveButton' data-bind='click: bpmApprove'>提交</button>&nbsp;&nbsp;&nbsp;"
				+"<button type='button' class='u-button raised accent u-button-pa' data-bind='click: bpmImgApproveClick'>流程图</button>&nbsp;&nbsp;&nbsp;"					
				+"<button type='button' class='u-button raised accent u-button-pa' data-bind='click: bpmBack'>返回</button>"
				);
		}else if (vstate == '2'){
			 $(divheader).html("<div id='approveTypeRadio'>"
			    +"<label><input name='approvetype' type='radio' value='withdraw' checked='true'/><span class='text'></span></label>&nbsp;&nbsp;弃审&nbsp;&nbsp;&nbsp;&nbsp;"
				+"<textarea id='approve_text' style='width:100%;height:100px;'></textarea>"
				+"</div>"
				+"<button type='button' class='u-button raised accent u-button-pa' id='approveButton' data-bind='click: bpmApprove'>提交</button>&nbsp;&nbsp;&nbsp;"
				+"<button type='button' class='u-button raised accent u-button-pa' data-bind='click: bpmImgApproveClick'>流程图</button>&nbsp;&nbsp;&nbsp;"					
				+"<button type='button' class='u-button raised accent u-button-pa' data-bind='click: bpmBack'>返回</button>"
			 );
					 
		}else if (vstate == '3'){
			 $(divheader).html(""
						+"<button type='button' class='u-button raised accent u-button-pa' data-bind='click: bpmImgApproveClick'>流程图</button>&nbsp;&nbsp;&nbsp;"					
						+"<button type='button' class='u-button raised accent u-button-pa' data-bind='click: bpmBack'>返回</button>"
					 );
		}
	};
	
	//审批时，添加尾部流程图，加签，指派弹出框信息
	bpmApproveFoot = function(divfoot,vstate) {			
	 $(divfoot).html(
			    " <!-- start  流程历史图 层---->"
				+"<div class='modal fade' id='imgHistory_list' tabindex='-1' role='dialog'>"
				+"<div class='u-mdlayout-page-header'><span class='content-title'>流程历史</span></div>"
				+"<div class='u-mdlayout-page-section'> <div class='panel-heading' ></div>"
				+"<div class='u-mdlayout-page-section'>"
				+"<div class=''>"
				+"<div class=''><button type='button' class='u-button raised accent u-button-pa' data-bind='click: bpmImgBack'>返回</button></div>"
				+"<div class='' style=''>"
				+"<iframe id='img_His' width='99%' style='border: 0px;height: 100%;min-height:300px;'></iframe>"
				+"<div class='table-container'>"
				+"<table class='u-table' style='width:99%'>"
				+"<thead>"
				+"<tr>"
				+"<th>任务ID</th>"
				+"<th>任务名称</th>"
				+"<th>任务类型</th>"
				+"<th>执行者</th>"
				+"<th>开始时间</th>"
				+"<th>结束时间</th>"
				+"<th>审批意见 </th>"
				+"<th>超时时间</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody data-bind=\"foreach:{data:flowHisDa.rows(), as: 'row', afterAdd: afterAdd}\">"
				+"<tr data-bind=\"css: { 'is-selected' : row.selected() } ,attr:{'rowindex': $index},click: $parent.rowClick\">"
				+"<td style='display: none;'>"
				+"<label class='u-checkbox only-style' data-bind=\"click: row.multiSelect, css:{'is-checked': row.selected()}\">"
				+"<input type='checkbox' class='u-checkbox-input'>"
				+"<span class='u-checkbox-label'></span>"
				+"</label>"
				+"</td>"
				+"<td data-bind=\"text: row.ref('id')\"></td>"
				+"<td data-bind=\"text: row.ref('name')\"></td>"
				+"<td data-bind=\"text: bpmApproveTypeShowHandler(row.ref('description')())\"></td>"
				+"<td data-bind=\"text: row.ref('executionId')\"></td>"
				+"<td data-bind=\"text: row.ref('startTime')\"></td>"
				+"<td data-bind=\"text: row.ref('endTime')\"></td>"
				+"<td data-bind=\"text: row.ref('deleteReason')\"></td>"
				+"<td data-bind=\"text: row.ref('claimTime')\"></td>"
				+"</tr>"
				+"</tbody>"
				+"</table>"
				+"<div id='pagination_img' class=''></div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"<!-- end  流程历史图 层------>	"
				
				
				+"<!-- start 驳回列表-->"
				+"<div class='modal fade' id='rejectDiv' tabindex='-1' role='dialog'>"
				+"<div class='modal-dialog' style='width:80%'>"
				+"<div class='modal-content' style=' '>"
				+"<div class='modal-header'><h4 class='modal-title'>驳回列表</h4></div>"
				+"<div class='modal-body' style='height:600px'>"
				+"<div type='text' style='margin-left:5px' u-meta='{\"id\":\"gridreject\",\"data\":\"rejectDa\",\"type\":\"grid\",\"editable\":false,\"multiSelect\":false,\"editType\":\"default\"}'> "             
				+"<div options='{\"field\":\"activityId\",\"dataType\":\"String\",\"title\":\"活动编码\",\"width\":\"350px\",\"editType\":\"string\",\"editable\":false}'></div>"
				+"<div options='{\"field\":\"activityName\",\"dataType\":\"String\",\"title\":\"活动名称\",\"editType\":\"string\",\"editable\":false}'></div>"
				+"</div>"
				+"</div>"
				+"<div class='modal-footer'>"
				+"<button class='u-button raised accent u-button-pa' id='selectRejectOk' data-bind='click: rejectOk'>确定</button>&nbsp;&nbsp;&nbsp;"
				+"<button class='u-button raised accent u-button-pa' data-bind='click: bpmRejectBack'>取消</button>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"<!-- end 驳回列表-->"
				
				
				+"<!-- start 改派人员列表-->"
				+"<div class='modal fade' id='personDiv' tabindex='-1' role='dialog'>"
				+"<div class='modal-dialog' style='width:80%'>"
				+"<div class='modal-content' style=' '>"
				+"<div class='modal-header'><h4 class='modal-title'>人员列表</h4></div>"
				+"<div style='padding-left:20px'>名称：<input id='txtDelegateSearth100' class='u-form-control' style='width:200px'/> <button class='u-button raised  accent u-button-pa'    data-bind='click: bpmDelegateSearchHandler'>搜索</button></div>"
				+"<div class='modal-body' style='height:400px;overflow: auto'>"
				+"<div type='text' style='margin-left:5px;'"
				+"u-meta='{\"id\":\"gridperson\",\"data\":\"personDa\",\"type\":\"grid\",\"editable\":false,\"multiSelect\":false,\"editType\":\"default\"}'>"
				+"<div options='{\"field\":\"name\",\"dataType\":\"String\",\"title\":\"名称\",\"width\":\"350px\",\"editType\":\"string\",\"editable\":false}'></div>"
				+"<div options='{\"field\":\"code\",\"dataType\":\"String\",\"title\":\"编码\",\"editType\":\"string\",\"editable\":false}'></div>"
				+"</div>"
				+"</div>"
				+"<div class='modal-footer'>"
				+"<button class='u-button raised accent u-button-pa' id='selectPersonOk' data-bind='click: delegateOk'>确定</button>&nbsp;&nbsp;&nbsp;"
				+"<button class='u-button raised accent u-button-pa' data-bind='click: bpmDelegateBack' >取消</button>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"<!-- end 改派人员列表-->"
				
				
				+"<!-- start 加签人员列表-->"
				+"<div class='modal fade' id='addsignDiv' tabindex='-1' role='dialog'>"
				+"<div class='modal-dialog' style='width:80%'>"
				+"<div class='modal-content' style=' '>"
				+"<div class='modal-header'><h4 class='modal-title'>加签人员列表</h4></div>"
				+"<div style='padding-left:20px'>名称：<input id='txtsignAddSearth100' class='u-form-control' style='width:200px'/> <button class='u-button raised  accent u-button-pa'    data-bind='click: bpmAddSignSearchHandler'>搜索</button></div>"
				+"<div class='modal-body' style='height:400px;overflow: auto'>"
				+"<div type='text' style='margin-left:5px;'"
				+"u-meta='{\"id\":\"gridAddperson\",\"data\":\"personAddDa\",\"type\":\"grid\",\"editable\":false,\"multiSelect\":false,\"editType\":\"default\"}'>"
				+"<div options='{\"field\":\"name\",\"dataType\":\"String\",\"title\":\"名称\",\"width\":\"350px\",\"editType\":\"string\",\"editable\":false}'></div>"
				+"<div options='{\"field\":\"code\",\"dataType\":\"String\",\"title\":\"编码\",\"editType\":\"string\",\"editable\":false}'></div>"
				+"</div>"
				+"</div>"
				+"<div class='modal-footer'>"
				+"<button class='u-button raised accent u-button-pa' id='selectPersonAddOk' data-bind='click: bpmAddSignOk'>确定</button>&nbsp;&nbsp;&nbsp;"
				+"<button class='u-button raised accent u-button-pa'  data-bind='click: bpmAddSignBack'>取消</button>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"</div>"
				+"<!-- end 加签人员列表-->"
	     );	 
    };	
    
 // 加签,搜索事件
	bpmAddSignSearchHandler =function(){
		//搜索条件
    	var jsonpar={
			'name':$('#txtsignAddSearth100').val()  };
		$.ajax({
			type:'post',
			url :viewModel.prefixurl+ 'task/assignee/getUserByName',
			data:JSON.stringify(jsonpar),
			dataType:"json",
			contentType: 'application/json;charset=utf-8', //必需
			success:function(res){
				if(res){
					if( res.flag !='success'){
						viewModel.personAddDa.clear();
						viewModel.personAddDa.setSimpleData(res);
						//viewModel.personAddDa.setAllRowsUnSelect();
						viewModel.personAddDa.setRowUnFocus() ;
					 }else{
						u.messageDialog({msg:res.msg,title:'驳回提示',btnText:'确定'});
					}
				}else{
					u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
				}
			},
			error:function(er){
				u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
			}
		});
		
	};

	// 加签,确认事件
	bpmAddSignOkHandler =function(taskId,processInstanceId,pmodel){
        var approvetype = $('#radioApprove  input[name="approvetype"]:checked ').val();
		if (viewModel.personAddDa.getSelectedIndexs().length < 1) {
			u.messageDialog({
				msg: "请选择要加签的人员!",
				title: "提示",
				btnText: "OK"
			});
			return;
		}
		var userIds =[] ;   //放用户id
    	var selectedDatas = viewModel.personAddDa.getSelectedDatas();
    	for(var i=0 ;i<selectedDatas.length ; i++  ){
    		userIds.push(  selectedDatas[i].data.id.value  ) ;
    	}
    	var jsonpar={
    			'approvetype':approvetype,
				'taskId':taskId,
				'processInstanceId':processInstanceId,
				'userIds':userIds,
				'comment':$('#approve_text').val()  };
		$.ajax({
			type:'post',
			url : viewModel.prefixurl+'task/signaddtask/signadd',
			data:JSON.stringify(jsonpar),
			dataType:"json",
			contentType: 'application/json;charset=utf-8', //必需
			success:function(res){
				if(res){
					if( res.flag =='success'){
						//u.messageDialog({msg:res.msg,title:'审批提示',btnText:'确定'});
						$('#addsignDiv').modal('toggle');
						$('#bpmDisplayBill').modal('toggle') ;
						//viewModel.entityUndoDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
						 pmodel.removeRow(pmodel.getCurrentIndex());
						u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg,position:"center"})
					}else{
						u.messageDialog({msg:res.msg,title:'请求错误',btnText:'确定'});
					}
				}else{
					u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
				}
			},
			error:function(er){
				u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
			}
		});
		
	};
	
	// 改派,搜索事件
	bpmDelegateSearchHandler =function(){
		//搜索条件
    	var jsonpar={
			'name':$('#txtDelegateSearth100').val()  };
		$.ajax({
			type:'post',
			url : viewModel.prefixurl+'task/assignee/getUserByName',
			data:JSON.stringify(jsonpar),
			dataType:"json",
			contentType: 'application/json;charset=utf-8', //必需
			success:function(res){
				if(res){
					if( res.flag !='success'){
						viewModel.personDa.clear();
						viewModel.personDa.setSimpleData(res);
						//viewModel.personAddDa.setAllRowsUnSelect();
						viewModel.personDa.setRowUnFocus() ;
					 }else{
						u.messageDialog({msg:res.msg,title:'驳回提示',btnText:'确定'});
					}
				}else{
					u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
				}
			},
			error:function(er){
				u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
			}
		});
		
	};
	//改派,确认事件
	bpmDelegateOkHandler=function(taskId,processInstanceId,pmodel){			
		if (viewModel.personDa.getSelectedIndexs().length < 1) {
			u.messageDialog({
				msg: "请选择要改派的人员!",
				title: "提示",
				btnText: "OK"
			});
			return;
		}
		var jsonpar={
				'taskId':taskId,
				'processInstanceId':processInstanceId,
				'userId':viewModel.personDa.getValue("id"),
				'comment':$('#approve_text').val() };
		$.ajax({
			type:'post',
			url : viewModel.prefixurl+'task/delegatetask/delegate',
			data:JSON.stringify(jsonpar),
			dataType:"json",
			contentType: 'application/json;charset=utf-8', //必需
			success:function(res){
				if(res){
					if( res.flag =='success'){
						//u.messageDialog({msg:res.msg,title:'审批提示',btnText:'确定'});
						$('#personDiv').modal('toggle') ;
						$('#bpmDisplayBill').modal('toggle') ;
						//viewModel.entityUndoDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
						 pmodel.removeRow(pmodel.getCurrentIndex());
						u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg,position:"center"})
					}else{
						u.messageDialog({msg:res.msg,title:'请求错误',btnText:'确定'});
					}
				}else{
					u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
				}
			},
			error:function(er){
				u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
			}
		});
		
	};
	
	//驳回或者指派,确认事件
	bpmRejectOkHandler=function(processInstanceId,pmodel){
		if (viewModel.rejectDa.getSelectedIndexs().length < 1) {
			u.messageDialog({
				msg: "请选择一个活动环节!",
				title: "提示",
				btnText: "OK"
			});
			return;
		}
		var jsonpar ={
				processInstanceId:processInstanceId,
				activityId:viewModel.rejectDa.getValue("activityId")
		}
		var approvetype = $('#radioApprove  input[name="approvetype"]:checked ').val();
		var posturl=viewModel.prefixurl+"task/rejecttask/reject"
		if(approvetype=="agree") {
			posturl=viewModel.prefixurl+"task/assigntask/commit"
		} 
		$.ajax({
			type:'post',
			url : posturl,
			data:JSON.stringify(jsonpar),
			dataType:"json",
			contentType: 'application/json;charset=utf-8', //必需
			success:function(res){
				if(res){
					if( res.flag =='success'){
						//u.messageDialog({msg:res.msg,title:'审批提示',btnText:'确定'});
						$('#rejectDiv').modal('toggle') ;
						$('#bpmDisplayBill').modal('toggle');
						//viewModel.entityDoneDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
						pmodel.removeRow(pmodel.getCurrentIndex());
						u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg,position:"center"})
					}else{
						u.messageDialog({msg:res.msg,title:'驳回提示',btnText:'确定'});
					}
				}else{
					u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
				}
			},
			error:function(er){
				u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
			}
		});
		
	};
	
	//审批
	bpmApproveHandler=function(taskId,processInstanceId,processDefinitionId,pmodel){
	    var approvetype = $('#bpmhead  input[name="approvetype"]:checked ').val();
		var jsonpar={
				'taskId':taskId,
				'processInstanceId':processInstanceId,
				'processDefinitionId':processDefinitionId,
				'comment':$('#approve_text').val(),
				'approvetype':approvetype};
		//同意
	 if(approvetype=="agree"||approvetype=="unagree"){					
			$.ajax({
				type:'post',
				url : viewModel.prefixurl+'task/completetask/approveCard',
				data:JSON.stringify(jsonpar),
				dataType:"json",
				contentType: 'application/json;charset=utf-8', //必需
				success:function(res){
					if(res){
						if( res.flag =='success'){
							//u.messageDialog({msg:res.msg,title:'审批提示',btnText:'确定'});
							$('#bpmDisplayBill').modal('toggle') ;
							//viewModel.entityUndoDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
							 u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg+",position:center"});
							 pmodel.removeRow(pmodel.getCurrentIndex());
						}else if(res.assignAble){
							 viewModel.rejectDa.setSimpleData(res.assignList);
							 viewModel.rejectDa.setRowSelect(-1);
							 viewModel.rejectDa.setRowUnFocus() ;
							 $('#rejectDiv').modal('show') 
						}else{
							u.messageDialog({msg:res.msg,title:'请求错误',btnText:'确定'});
						}
					}else{
						u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
					}
				},
				error:function(er){
					u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
				}
			});
		 }
	 //驳回
	 if(approvetype=="reject"){			
			$.ajax({
				type:'post',
				url : viewModel.prefixurl+'task/rejecttask/bfreject',
				data:JSON.stringify(jsonpar),
				dataType:"json",
				contentType: 'application/json;charset=utf-8', //必需
				success:function(res){
					if(res){
						if( res.flag =='success'){
							viewModel.rejectDa.setSimpleData(res.rejectlist);
							//viewModel.rejectDa.setRowSelect(-1);
							//viewModel.rejectDa.setRowUnFocus() ;
							$('#rejectDiv').modal('show') 
						 }else{
							 $('#bpmDisplayBill').modal('toggle') 
							u.showMessage({position:'center',msg:res.msg});
						}
					}else{
						u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
					}
				},
				error:function(er){
					u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
				}
			});
		 
	 }
	 //改派
	 if(approvetype=="delegate" ){			
			$.ajax({
				type:'post',
				url : viewModel.prefixurl+'task/assignee/getlist',
				data:JSON.stringify(jsonpar),
				dataType:"json",
				contentType: 'application/json;charset=utf-8', //必需
				success:function(res){
					if(res){
						if( res.flag !='success'){
							viewModel.personDa.setSimpleData(res);
							viewModel.personDa.setRowSelect(-1);
							viewModel.personDa.setRowUnFocus() ;
							$('#personDiv').modal('show') 
						 }else{
							u.messageDialog({msg:res.msg,title:'驳回提示',btnText:'确定'});
						}
					}else{
						u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
					}
				},
				error:function(er){
					u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
				}
			});
		 
	 }
	 //加签
	 if( approvetype=="signAdd"){			
			$.ajax({
				type:'post',
				url : viewModel.prefixurl+'task/assignee/getlist',
				data:JSON.stringify(jsonpar),
				dataType:"json",
				contentType: 'application/json;charset=utf-8', //必需
				success:function(res){
					if(res){
						if( res.flag !='success'){
							viewModel.personAddDa.setSimpleData(res);
							//viewModel.personAddDa.setAllRowsUnSelect();
							viewModel.personAddDa.setRowUnFocus() ;
							$('#addsignDiv').modal('show') 
						 }else{
							u.messageDialog({msg:res.msg,title:'驳回提示',btnText:'确定'});
						}
					}else{
						u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
					}
				},
				error:function(er){
					u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
				}
			});
		 
	 }
	 //终止
	 if(approvetype=="termination"){					
			$.ajax({
				type:'post',
				url :viewModel.prefixurl+ 'task/terminationtask/termination',
				data:JSON.stringify(jsonpar),
				dataType:"json",
				contentType: 'application/json;charset=utf-8', //必需
				success:function(res){
					if(res){
						if( res.flag =='success'){
							//u.messageDialog({msg:res.msg,title:'审批提示',btnText:'确定'});
							$('#bpmDisplayBill').modal('toggle') ;
							//viewModel.entityUndoDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
							 u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg,position:"center"});
							 pmodel.removeRow(pmodel.getCurrentIndex());
						}else if(res.assignAble){
							 viewModel.rejectDa.setSimpleData(res.assignList);
							 viewModel.rejectDa.setRowSelect(-1);
							 viewModel.rejectDa.setRowUnFocus() ;
							 $('#rejectDiv').modal('show') 
						}else{
							u.messageDialog({msg:res.msg,title:'请求错误',btnText:'确定'});
						}
					}else{
						u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
					}
				},
				error:function(er){
					u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
				}
			});
		 }
	 //弃审
	if(approvetype=="withdraw"){
		$.ajax({
			type:'post',
			url : viewModel.prefixurl+'task/withdrawtask/withdraw',
			data:JSON.stringify(jsonpar),
			dataType:"json",
			contentType: 'application/json;charset=utf-8', //必需
			success:function(res){
				if(res){
					if( res.flag =='success'){
						//u.messageDialog({msg:res.msg,title:'审批提示',btnText:'确定'});
						$('#bpmDisplayBill').modal('toggle') 
						//viewModel.entityDoneDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
						 u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg,position:"center"});
					     pmodel.removeRow(pmodel.getCurrentIndex());
					}else{
						u.messageDialog({msg:res.msg,title:'弃审提示',btnText:'确定'});
					}
				}else{
					u.messageDialog({msg:'后台返回数据格式有误',title:'数据错误',btnText:'确定'});
				}
			},
			error:function(er){
				u.messageDialog({msg:er,title:'请求错误',btnText:'确定'});
			}
		});
	 }
 
   };
   
   //审批类型
   bpmApproveTypeShowHandler=function(vApproveType){
	   if(vApproveType=='submit'){
	   		return '提交';
	   }
	   if(vApproveType=='agree'){
		   return '审批';
	   }
	   if(vApproveType=='unagree'){
		   return '不同意';
	   }
	   if(vApproveType=='reject'){
		   return '驳回';
	   }
	   if(vApproveType=='signAdd'){
		   return '加签';
	   }
	   if(vApproveType=='signAdding'){
		   return '加签中';
	   }
	   if(vApproveType=='delegate'){
		   return '改派';
	   }
	   if(vApproveType=='termination'){
		   return '终止';
	   }
	   if(vApproveType=='withdraw'){
		   //return  '弃审'   ;
            return '删除';
	   }
       if(vApproveType=='postCompleted'){
           //return  '弃审'   ;
           return '连岗审批';
       }
	   
   };
   
   //流程显示状态为查看browse时，流程审批框隐藏，只能查看流程图，不能做审批业务
   bpmApproveBrowseHandler=function(){
	   $('#bpmDisplayBill').find('#bpmhead').find('#approveTypeRadio')[0].style.display='none';
	   $('#bpmDisplayBill').find('#bpmhead').find('#approveButton')[0].style.display='none';
   };

	//隐藏查询框
	bpmHideQueryInfoHandler=function(divId){				
		$('#bpmDisplayBill')[0].querySelector(divId).style.display='none';
	};
	//显示页面的滚动条
	bpmShowBillScrollHandler=function(divId){				
		$('#bpmDisplayBill')[0].querySelector(divId).style.overflow='auto';
	};
	//单据上的返回返回
	bpmBack=function(){				
		$('#bpmDisplayBill').modal('hide') ;
	};
	//流程图上的返回
	bpmImgBack=function() {
		$('#imgHistory_list').modal('toggle') ;
	};
    //加签返回
	bpmAddSignBack=function(){				
		$('#addsignDiv').modal('toggle') ;
	};
	//改派返回
	bpmDelegateBack=function(){				
		$('#personDiv').modal('toggle') ;
	};
	//驳回返回
	bpmRejectBack=function(){				
		$('#rejectDiv').modal('toggle') ;
	};
	
	return {
		'model': viewModel
	}
	
});