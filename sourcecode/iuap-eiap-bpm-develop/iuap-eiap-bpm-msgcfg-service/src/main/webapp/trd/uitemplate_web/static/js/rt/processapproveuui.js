define(['jquery','u.biz'],function($){	
/**
 * 制单人、审批人、审批历史控件
 */
	var processHistoryCount = 0;
	var ProcessApproveComp = $.InputComp.extend({
		initialize: function(element, options, viewModel) {
			var self = this
			ProcessApproveComp.superclass.initialize.apply(this, arguments)
			this.validType = 'string'
			this.maxLength = options['maxLength']
			this.minLength = options['minLength']
			if (this.dataModel) {
				if (this.hasDataTable) {
					this.minLength = this.dataModel.getMeta(this.field, "minLength") || this.minLength
					this.maxLength = this.dataModel.getMeta(this.field, "maxLength") || this.maxLength
				}
			}	
			this.create()
//			if (this.element.nodeName == 'INPUT') {
//				$(this.element).focusin(function(e) {
//					self.setShowValue(self.getValue())
//				})
//				$(this.element).blur(function(e) {
//					self.setValue(self.element.value)
//				})
//			}			
		},
		modelValueChange: function(value) {
			if (this.slice) return
			value = value || ""
			this.trueValue = value
			this.showValue = value
			this.setValue(value);//编辑态审批意见保存到数据库
			if(this.viewModel.bpminfo!="" && this.viewModel.bpminfo!=null){
				this.setCompShowValue(this.showValue,"true")
			}
		},
		setValue: function(value,flg) {
			this.trueValue = value
			this.showValue = value
			if(flg!="1"){
				this.setShowValue(this.showValue)
			}
			this.slice = true
			this.setModelValue(this.trueValue)
			this.slice = false
		},
		getValue : function() {
			return this.trueValue
		},
		setCompShowValue: function(){
			var metafield =  this.dataModel.meta[this.field];
			if(metafield){
				if(metafield.componentKey == "ProcessHistory"  ){
					this.setProcessHistory(this.viewModel.bpminfo.history_task);
				}else if(metafield.componentKey == "ApproveUser"  ){
					this.getCurTask(this);
				}else if(metafield.componentKey == "BillMaker" ){
					this.setBillMaker(this.viewModel.bpminfo.history_task);
				}
			}
		},
		setShowValue : function(showValue) {
			this.showValue = showValue
			this.element.value = showValue
			this.element.title = showValue
			var metafield =  this.dataModel.meta[this.field];
			if(metafield&&(metafield.componentKey == "ApproveUser" || metafield.componentKey == "BillMaker")){
				this.setValue(showValue,"1")//向数据库保存数据
			}
		},
		setBillMaker:function(history_tasks){
			var task = history_tasks[0];
			if(task){
				var username = task._children.username._value;
				this.setShowValue(username);
			}
		},
		setProcessHistory:function(tasks){
			var strs = "";
			for(var i=0;i<tasks.length;i++){
				var username = tasks[i]._children.username?tasks[i]._children.username._value:"";
				var taskName = tasks[i]._children.name?tasks[i]._children.name._value:"";
				var endTime = tasks[i]._children.endTime?tasks[i]._children.endTime._value:"";
				var time = new Date(endTime);
				try{
					var taskCommentsMsg = tasks[i]._children.taskComments._children[0]._children.message._value;
				}catch (e) {
					var taskCommentsMsg = "";
				}
				var str = getFormatDate(time)+"  "+ taskName+"  "+username+"  "+taskCommentsMsg+"\n";
				strs += str;
			}
			this.setShowValue(strs);
		},
		setApproveUser:function(showValue,flg){
			this.showValue = showValue
			if(flg){
				this.element.removeAttribute("disabled");
			}
			this.setShowValue(showValue);
		},
		getCurTask:function(a){
			var Request = new Object();
			Request = this.getUrlParam();
			var pk_bo = Request["pk_bo"];
			var pk_boins = Request["pk_boins"];
			var pk_user = Request["pk_user"];
			if(pk_bo==null || pk_boins==null || pk_user==null){
				return;
			}
			$.ajax({
				type: "GET",
				data: {
					pk_bo: pk_bo,
					pk_boins:pk_boins,
					pk_user:pk_user
				},
				dataType: "json",
				url: "/iform_web/iform_ctr/process_ctr/getCurTask",
				success: function(data) {
					var field = a.dataModel.meta[a.field];
					if(data.total>0 && field.processActivity == data.data[0].taskDefinitionKey && field.isWriteApproveOpinion=="true"){
						//可编辑
						a.setApproveUser("",true);
					}else{
						//不可编辑  根据条件拼显示意见
						var tasks = a.viewModel.bpminfo.history_task;
						var str = "",strs = "";
						for(var i=0;i<tasks.length;i++){
							var processActivityId = tasks[i]._children.taskDefinitionKey?tasks[i]._children.taskDefinitionKey._value:"";
							if(processActivityId == field.processActivity){
								var username = tasks[i]._children.username?tasks[i]._children.username._value:"";
								var taskName = tasks[i]._children.name?tasks[i]._children.name._value:"";
								var endTime = tasks[i]._children.endTime?tasks[i]._children.endTime._value:"";
								try{
									var taskCommentsMsg = tasks[i]._children.taskComments._children[0]._children.message._value;
								}catch (e) {
									var taskCommentsMsg = "";
								}
								var time = new Date(endTime);
								field.isWriteApproveOpinion=="false"?str = username+",":str = "审批意见："+taskCommentsMsg+"  审批人："+username+"  审批时间："+getFormatDate(time)+"\n";
							    strs += str;
							}
						}
						a.setApproveUser(strs);
					}
				},
				error: function() {
//					alert("error--获取不到流程环节");
				}
			})
		},
		getShowValue: function() {
			return this.showValue
		},
		getUrlParam:function(){
			var url = location.search; //获取url中"?"符后的字串
			   var theRequest = new Object();
			   if (url.indexOf("?") != -1) {
			      var str = url.substr(1);
			      strs = str.split("&");
			      for(var i = 0; i < strs.length; i ++) {
			         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
			      }
			   }
			return theRequest;
		},
		Statics: {
			compName: 'processapprove'
		}
	})
	
	$.ProcessApproveComp = ProcessApproveComp
	if ($.compManager)
		$.compManager.addPlug(ProcessApproveComp)

})