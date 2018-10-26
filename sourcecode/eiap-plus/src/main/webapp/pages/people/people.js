
define(['text!./people.html','./meta.js','css!./people.css', '../../config/sys_const.js','css!../../style/style.css','css!../../style/widget.css',
        'uiReferComp','refer'], function (html) {
	var init=function(element){
		var refmodel ="";
		var listUrl = appCtx+'/people/list';
		var delUrl = appCtx+'/people/del/';
		var saveUrl = appCtx+'/people/save';
		
		var viewModel = {
				/* 数据模型 */
				draw:1,
				totlePage:0,
				pageSize:5,
				totleCount:0,
				//peopleList为列表页面绑定的数据模型
	            peopleList: new u.DataTable(metaCardTable),
	            //dtnew为卡片页面绑定的数据模型
				dtnew:new u.DataTable(metaCardTable),
				//people_ref为搜索区数据模型
	            people_ref: new u.DataTable({
	            	meta:{
	            		pk_org:{
	            			'refmodel':JSON.stringify(refinfo['organization']),
	            			'refcfg':'{"ctx":"/uitemplate_web","refInputAdd":"refInputAdd"}'
	            		},
	            		pk_dept:{
	            			'refmodel':JSON.stringify(refinfo['dept']),
	            			'refcfg':'{"ctx":"/uitemplate_web"}'
	            		},
	            		pk_dept_name:{},
	            		pk_org_name:{}
	            	}
	            }),

				
				event: {
					//清除datatable数据
	                clearDt: function (dt) {
	                	dt.removeAllRows();
	                	dt.clear();
	                },
					// 卡片表数据读取
					initCardTableList:function(){
						var jsonData={
								pageIndex:viewModel.draw-1,
								pageSize:viewModel.pageSize,
//								sortField:"createtime",
//								sortDirection:"asc"
						};
						$(element).find(".input_enter").each(function(){
							if(this.value == undefined || this.value =='' || this.value.length ==0 ){
								//不执行操作
							}else{
								if(this.name.indexOf("pk") > 0){
									jsonData[this.name] = $(this).attr('data-search');
//									var pk = this.name.substring(7);
//									jsonData[this.name] = viewModel.people_ref.getSimpleData()[0][pk];
								}
								else{
									jsonData[this.name] =  this.value.replace(/(^\s*)|(\s*$)/g, "");  //去掉空格
								}
								
							}
						});
						$.ajax({
							type:'get',
							url:listUrl,
							datatype:'json',
							data:jsonData,
							contentType: 'application/json;charset=utf-8',
							success:function(res){
								if(res){
									if( res.success =='success'){
										if(res.detailMsg.data){
											viewModel.totleCount=res.detailMsg.data.totalElements;
											viewModel.totlePage=res.detailMsg.data.totalPages;
											viewModel.event.comps.update({totalPages:viewModel.totlePage,pageSize:viewModel.pageSize,currentPage:viewModel.draw,totalCount:viewModel.totleCount});
											viewModel.peopleList.removeAllRows();
											viewModel.peopleList.clear();
											viewModel.peopleList.setSimpleData(res.detailMsg.data.content,{unSelect:true});
										}
									}else{
										var msg = "";
										if(res.success == 'fail_global'){
											msg = res.message;
										}else{
											for (var key in res.detailMsg) {
												msg += res.detailMsg[key] + "<br/>";
											}
										}
										u.messageDialog({msg:msg,title:'请求错误',btnText:'确定'});
									}
								}else{
									u.messageDialog({msg:'后台返回数据格式有误，请联系管理员',title:'数据错误',btnText:'确定'});
								}
							},
							error:function(er){
								u.messageDialog({msg:'请求超时',title:'请求错误',btnText:'确定'});
							}
						});
					},
					//组装list
					genDataList:function(data){
						var datalist = [];
						datalist.push(data);
						return datalist ;
					},
					//字段验证
					checkedCardtable: function (data) {
						var defaultNum = 0;
						if (data == null)
							return false;
						
//						if (data.name == null) {
//							u.messageDialog({msg: '提示：系统名称不能为空！', btnText: '确定'});
//							return false;
//						}
						
						return true;
					},
					//删除方法
					deleteData: function(data) {
						var datalist = viewModel.event.genDataList(data);
						var json = JSON.stringify(datalist);
						$.ajax({
							url: delUrl,
							data: json,
							dataType: 'json',
							type: 'post',
							contentType: 'application/json',
							success: function (res) {
								//md.close();
								if(res){
									if (res.success == 'success') {
										u.messageDialog({msg:'删除成功',title:'操作提示',btnText:'确定'});
									} else {
										var msg = "";
										for(var key in res.message){
											msg +=res.message[key]+"<br/>";
										}
										u.messageDialog({msg:'msg',title:'操作提示',btnText:'确定'});
									}
								}else{
									u.messageDialog({msg:'无返回数据',title:'操作提示',btnText:'确定'});
								}
								
							},
							error:function(er){
								u.messageDialog({msg:'操作请求失败，'+er,title:'操作提示',btnText:'确定'});
							}
						});
					},
					//新增和更新方法
					saveData:function(data) {
						 var psntel = /^1[34578]\d{9}$/,
						 	 psntel_1 = /^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$/,
						 	age = /^[123456789]?\d{1}$/,
						 	age_1 = /^1[12345]\d{1}$/,
						 	psntel_val = viewModel.dtnew.getCurrentRow().getValue('psntel'),
						 	age_val = viewModel.dtnew.getCurrentRow().getValue('psnage');
						if (!app.compsValidate($('#people-editPage')[0])) {
							return;
	                    }
	                    else if(!(psntel.test(psntel_val) || psntel_1.test(psntel_val))){
	                    	message('请输入正确的电话号码','error');
	                    	return;
	                    }
	                    else if(!(age.test(age_val)||age_1.test(age_val))){
	                    	message('请输入正确的年龄','error');
	                    	return;
	                    }


						var datalist = viewModel.event.genDataList(data);
						var json = JSON.stringify(datalist);
						$.ajax({
							url: saveUrl,
							type: 'post',
							data: json,
							dataType: 'json',
							contentType: 'application/json',
							success: function (res) {
								if(res){
									if( res.success =='success'){
										viewModel.event.cleanSearch();
										viewModel.event.initCardTableList();
										u.messageDialog({msg:'操作成功',title:'操作提示',btnText:'确定'});
									}else{
										var msg = "";
										if(res.success == 'fail_global'){
											msg = res.message;
										}else{
											for (var key in res.detailMsg) {
												msg += res.detailMsg[key] + "<br/>";
											}
										}
										u.messageDialog({msg:msg,title:'操作提示',btnText:'确定'});
									}
								}else{
									u.messageDialog({msg:'没有返回数据',title:'操作提示',btnText:'确定'});
								}
							}
						});
						md.close();    
					},
					//分页相关
					pageChange:function(){
						viewModel.event.comps.on('pageChange', function (pageIndex) {
							viewModel.draw = pageIndex + 1;
							viewModel.event.initCardTableList();
						});
					},
					sizeChange:function(){
						viewModel.event.comps.on('sizeChange', function (arg) {
							viewModel.pageSize = parseInt(arg);
							viewModel.draw = 1;
							viewModel.event.initCardTableList();
						});
					},

					//页面初始化
					pageInit: function () {		       
						$(element).html(html) ;
							app = u.createApp({
							el: element,
							model: viewModel
						});
						
						var paginationDiv = $(element).find('#pagination')[0];
						this.comps=new u.pagination({el:'#pagination',jumppage:true});
						this.initCardTableList();
						viewModel.event.pageChange();
						viewModel.event.sizeChange();
						
	                    //回车搜索
	                    $('.input_enter').keydown(function(e){
	                        if(e.keyCode==13){
	                            $('#searchBtn').trigger('click');

	                        }
	                    });
					},
					//页面按钮事件绑定
					/* 导航的三个按钮 编辑 添加 删除 */
					editClick:function(){
						$('#people-editPage').find('.u-msg-title').html("编辑");
						viewModel.event.clearDt(viewModel.dtnew);
						var row = viewModel.peopleList.getSelectedRows()[0];
						if(row){
							var temp = row.getSimpleData();
							//为卡片页面的数据设置显示值
							var pk_org = temp.pk_org;
							var pk_dept = temp.pk_dept;
							viewModel.dtnew.setSimpleData(temp);
							
							//若组织不为空获取到组织pk将其作为属性值放到部门的div中
							var Seaorg = pk_org.replace(/(^\s*)|(\s*$)/g, "");
		                	
		                	if(Seaorg != null){
		                		var jsonData = {};
		            			jsonData['pk_org'] = viewModel.dtnew.getCurrentRow().getSimpleData().pk_org;
		            			$("#dept-card").attr("data-refparam",JSON.stringify(jsonData));
		                	}
							
							window.md = u.dialog({id: 'editDialog', content: '#people-editPage', hasCloseMenu: true});
							/*$('#editDialog').css('width', '70%')*/
						}else{
							u.messageDialog({msg:'请选择要编辑的数据！',title:'操作提示',btnText:'确定'});
						}
					},
					addClick:function(){
						$('#people-editPage').find('.u-msg-title').html("新增");
						viewModel.dtnew.clear();
						viewModel.event.clearDt(viewModel.dtnew);
						var newr = viewModel.dtnew.createEmptyRow();
						viewModel.dtnew.setRowSelect(newr);
						window.md = u.dialog({id: 'addDialog', content: '#people-editPage', hasCloseMenu: true});
						$('#addDialog').css('width', '70%');
					},
					delClick:function(){
						var row = viewModel.peopleList.getSelectedRows()[0];
						if(row){
							var data = viewModel.peopleList.getSelectedRows()[0].getSimpleData()
							u.confirmDialog({
					            msg: "是否删除?",
					            title: "删除确认",
					            onOk: function () {
					                viewModel.event.deleteData(data);
					                viewModel.peopleList.removeRow(viewModel.peopleList.getSelectedIndexs());
					            },
					            onCancel: function () {
					            }
							});
						}else{
							u.messageDialog({msg:'请选择要删除的数据！',title:'操作提示',btnText:'确定'});
						}
					},
					searchClick:function(){
						viewModel.draw = 1; 
						viewModel.event.initCardTableList();
					},
					saveOkClick:function(){
						var data = viewModel.dtnew.getSimpleData()[viewModel.dtnew.getSelectedIndexs()];
						if(viewModel.event.checkedCardtable(data)){
							viewModel.event.saveData(data);
						}
					},
					saveCancelClick:function(e){
						md.close();
					},
					cleanSearch:function(){
						$(element).find(".input_enter").each(function(){
							if($(this).attr("data-search")){
								$(this).removeAttr("data-search");
							}
							this.value = "";
						});
						viewModel.people_ref.clear();
					},
					listBack:function(){

	                    window.history.go(-1);
	                    return false;
	                
//						window.location = '#/appCenter';
//						$('.container-fluid').css("overflow-y","auto");
					},
	                
	                show_hide:function(obj){
	                	$("#hide-info").toggle();
	                	$("#more-info").html(($("#more-info").html()=="展开")?"收起":"展开");
	                }
				}
		}
		
		$(element).html(html) ;
		viewModel.event.pageInit();
		/*
		 * author:zhanghy7
		 * 参照联动，选择组织后部门做数据联动过滤
		 * */
		//搜索区参照联动
		viewModel.people_ref.on('pk_org.valueChange',function(e){
			var jsonData = {};
			jsonData['pk_org'] = viewModel.people_ref.getCurrentRow().getSimpleData().pk_org;
			$("#people-dept").attr("data-refparam",JSON.stringify(jsonData));
		});
		//卡片页面参照联动
		viewModel.dtnew.on('pk_org.valueChange',function(e){
			var jsonData = {};
			jsonData['pk_org'] = viewModel.dtnew.getCurrentRow().getSimpleData().pk_org;
			$("#dept-card").attr("data-refparam",JSON.stringify(jsonData));
		});
			
		
		//grid参照联动
		
		 var temp = $("#peopleListGrid");
		/*
		 * linkage为全局js方法，已经引入，可以直接使用
		 * element(temp)为包含grid的div，
			model(viewModel.peopleList)为需要传入的数据集，
			filed_1('pk_org')为被联动的字段(如pk_org),
			filed_2('pk_dept')为联动的字段(如pk_dept)
		 * *
		 */
		 linkage(temp,viewModel.peopleList,'pk_org','pk_dept');
		 
		 $('#dept-card-input+.refer').on('mousedown',function(e){
			 if(!$('#org-card-input').val()){
				 u.messageDialog({msg:'请先选择组织数据',title:'操作提示',btnText:'确定'});
				 return false;
			 }
		 });
		 
		 $('#people-dept-input+.refer').on('mousedown',function(e){
			 if(!$('#people-org-input').val()){
				 u.messageDialog({msg:'请先选择组织数据',title:'操作提示',btnText:'确定'});
				 return false;
			 }
		 });

		 var test  = function(e){
		 	return e;
		 }
		 window.refInputAdd = test;
	}
	
    return{
		'template': html,
        init:init
    }
});

