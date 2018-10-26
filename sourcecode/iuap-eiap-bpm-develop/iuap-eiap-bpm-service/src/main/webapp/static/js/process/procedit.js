define(function(require, module, exports) {
    /*
     * 引入静态资源
     */
    var edit = require('text!../../html/process/procedit.html');
    var tool = require('../../js/tool/instTool.js');
    require('../../js/tool/ref-depend.js');
    window.ctx = "/uitemplate_web";
    var localrefid,localgroupdata;
    var viewModel = {
        /**
         * 控制表单的编辑状态
         */
        editFlag: {
            flag: ko.observable(false),
            button: ko.observable('编辑')
        },
        
        //新增还是编辑流程，false是新增
        newEditFlag: {
            flag: ko.observable(false)
        },
        //控制新增部分，与编辑流程分开，与webalone结合
        newEditFlag2: {
            flag: ko.observable(false)
        },

        /**
         * 表单模型
         */
        formData: new u.DataTable({
            meta: {
                id: {type: 'string'},
                procName: {type: 'string'},
                bizModelRefId: { type: 'string' },
                bizModelRefName: { type: 'string' },
                categoryId: {type: 'string'},
                categoryName: {type: 'string'},
                version: {type: 'string'},
                createTime: {type: 'string'},
                lastUpdateTime: {type: 'string'},
                description: {type: 'string'}
            }
        }),
        
        //模型参照
	    procmodal: new u.DataTable({
            meta: {
                'dataSourceId': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"'+window.ctx+'","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":true}'
                }
            }
        }),
        
        //分组
        catadata: new u.DataTable({
            meta: {
            	'id': {type: 'string'},
                'name': {type: 'string'},
                'pid': {type: 'string'}
            }
        }),
        
        //分组参照
/*        catagorymodal: new u.DataTable({
            meta: {
                'dataSourceId': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"'+window.ctx+'","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":true}'
                }
            }
        }),*/

        /**
         * 返回列表页面
         */
        back: function() {
            if (viewModel.editFlag.flag()) {
                tool.confirmDialog({
                    msg: "是否放弃保存？",
                    title: "确认",
                    onOk: function() {
                        //跳转回列表页面
                        $('.list-panel').show();
                        $('.edit-panel').hide();
                    },
                    onCancel: function(){}
                });
            } else {
                //跳转回列表页面
                $('.list-panel').show();
                $('.edit-panel').hide();
            }
        },

        /**
         * 控制编辑状态
         */
        editSave: function() {
            if (viewModel.editFlag.flag()) {
            	//如果是新增态
            	if(viewModel.formData.rows()[0].getValue("categoryId")==null){
            		viewModel.formData.setValue('categoryId', viewModel.selectTreeNode.id);
            		viewModel.formData.setValue('categoryName', viewModel.selectTreeNode.name);
            	}
                //保存函数
                var formDatas = viewModel.formData.getSimpleData()[0];
                if(localrefid){
                	formDatas.bizModelRefId=localrefid;
                }
                var  url = window.flowUrl+"bmp_proc/process/saveProcModel";

                if (formDatas.procName === null || formDatas.procName === "" || formDatas.procName.trim() ==="") {
                    tool.errorMessage("请输入流程模型名称", "提示");
                }
                // else if (formDatas.bizModelRefId == null || formDatas.bizModelRefId == "") {
                //     tool.errorMessage("请选择模型", "提示");
                // }
                else{
                    tool.showLoading();
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        data:{
                            "data":JSON.stringify(formDatas)
                        },
                        url: url,
                        success: function(res) {
                            tool.hideLoading();
                            if (res.status == 1) {
                                //手动设置不可编辑的字段
                                var saveData = res.data;
                                viewModel.formData.setValue("version","1");
                                viewModel.formData.setValue("createTime",saveData.createTime);
                                viewModel.formData.setValue("lastUpdateTime",saveData.lastUpdateTime);
                                //状态判断
                                var bid = viewModel.formData.getValue('id');
                                if (bid) {
                                    //编辑态设置当前数据的行选中
                                    viewModel.listData.setRowSelect(viewModel.index);
                                    viewModel.listData.getCurrentRow().setValue("procName", viewModel.formData.getValue('procName'));
                                    viewModel.listData.getCurrentRow().setValue("description", viewModel.formData.getValue('description'));
                                } else {
                                    // 新建态将新建的行设为选中行
                                    viewModel.formData.setValue('id', saveData.id);
                                    viewModel.listData.addSimpleData(viewModel.formData.getSimpleData());
                                    viewModel.index = viewModel.listData.getAllRows().length - 1;
                                }
                                viewModel.editFlag.button('编辑');
                                viewModel.editFlag.flag(false);
                            } else {
                                tool.errorMessage(res.msg, "提示");
                            }
                        }
                    });
                }
            } else {
                viewModel.editFlag.button('保存');
                viewModel.editFlag.flag(true);
            }
        },

        /*
         *初始化页面，绑定uui
         */
        pageInit: function(params) {
        	viewModel.webalone = params.webalone;
            viewModel.listData = params.listData;
            viewModel.flag = params.flag;
            viewModel.index = params.index;
            viewModel.selectTreeNode = params.selectTreeNode;
            viewModel.treeData = params.treeData;
            u.createApp({
                el: '.edit-panel',
                model: viewModel
            });

            //模型参照初始化
            viewModel.procmodal.createEmptyRow();
            viewModel.procmodal.setRowSelect(0);
            //分组参照初始化
/*            viewModel.catagorymodal.createEmptyRow();
            viewModel.catagorymodal.setRowSelect(0);*/
	    	
            //根据传过来的状态确认页面状态
            //当为查看状态时为非编辑状态，否则启用编辑状态
            if (viewModel.flag === 'check') {
                viewModel.editFlag.flag(false);
                viewModel.editFlag.button('编辑');

                //从params.listData 获取数据并赋值formData
                viewModel.formData.setSimpleData(viewModel.listData.getSimpleData()[viewModel.index]);

            } else {
                viewModel.editFlag.flag(true);
                viewModel.editFlag.button('保存');
                //确认当前的编辑模式：新建或者保存
                if (viewModel.flag === 'add') {
                	viewModel.newEditFlag.flag(false);
                	viewModel.newEditFlag2.flag(false);
                    viewModel.formData.clear();
                    viewModel.formData.createEmptyRow();
                    viewModel.formData.setSimpleData({
                        enablestate: 1,
                        enablestatedesc: '启用'
                    });
                    viewModel.formData.setRowSelect(0);
                } else {
                    //从params.listData 获取数据并赋值formData
                	viewModel.newEditFlag.flag(true);
                	viewModel.newEditFlag2.flag(true);
                    var listData = viewModel.listData.getSimpleData()[viewModel.index];
                    listData.categoryName=viewModel.selectTreeNode.name;
                    viewModel.formData.setSimpleData(listData);
                }
            }
			//编码对象参照返回值处理
            viewModel.procmodal.on('dataSourceId.valueChange', function (ele) {
                var id = ele.newValue;
                if(id!=""){
                	localrefid=id;
                	var localrefname = ele.rowObj.data.dataSourceId.meta.display;
                	viewModel.formData.setValue("bizModelRefName",localrefname);
                	viewModel.formData.setValue("bizModelRefId",id);
                	viewModel.procmodal.setValue("dataSourceId", "");
                }

            });
            //分组参照返回值处理
/*            viewModel.catagorymodal.on('dataSourceId.valueChange', function (ele) {
                var id = ele.newValue;
                viewModel.catagorymodal.setValue("dataSourceId", "");

            });*/
            
            //分组参照
            var categoryNameRef=document.querySelector('[data-role="categoryNameRef"]');
			u.on(categoryNameRef, 'click', function(){
				//获取树数据
				viewModel.catadata.removeAllRows();
				var alldata = viewModel.treeData.getSimpleData();
                localgroupdata = removeRootNode(alldata);
				viewModel.catadata.setSimpleData(localgroupdata,{unSelect:true});
				$(".catasearchinput").val("");
		        $('#cataModal').modal({
					backdrop: false
				});
			});
			//分组参照检索
			var catasearchspan=document.querySelector('[data-role="catasearchspan"]');
	    	u.on(catasearchspan, 'click', function(){//检索按钮
	    		var localrows=[];
	    		var searchval = $(".catasearchinput").val();
	    		viewModel.catadata.removeAllRows();
	    		for(var i=0;i<localgroupdata.length;i++){
	    			if(localgroupdata[i].name.indexOf(searchval)>=0){
	    				localrows.push(localgroupdata[i]);
	    			}
	    		}
	    		//viewModel.catadata.addRows(localrows,{unSelect:true});
	    		viewModel.catadata.setSimpleData(localrows,{unSelect:true});
	    	});
	    	var catasearchinput=document.querySelector('[data-role="catasearchinput"]');
	    	u.on(catasearchinput, 'keyup', function(event){
	    		if (event.keyCode == "13") {
	    			catasearchspan.click();
	    		}
	    	});
        }
    };
  
    //初始化模型参照
    function ref(refCode){
        if (!refCode) return alert("缺少参数~~");
        $.ajax({
            type: "GET",
            url:  window.ctx+'/iref_ctr/refInfo/',
            data: {
                refCode: refCode || ""
            },
            traditional: true,
            async: false,
            dataType: "json",
            success: function (pRefmodel) {
            	pRefmodel.refUIType="RefGrid";
                refmodel = JSON.stringify(pRefmodel);
                viewModel.procmodal.setMeta('dataSourceId', 'refmodel', refmodel);
            }
        });
    }
   // ref("bizModelRef");
    
    //初始化分组参照
/*    function catagoryref(refCode){
        if (!refCode) return alert("缺少参数~~");
        $.ajax({
            type: "GET",
            url:  window.ctx+'/iref_ctr/refInfo/',
            data: {
                refCode: refCode || ""
            },
            traditional: true,
            async: false,
            dataType: "json",
            success: function (pRefmodel) {
                refmodel = JSON.stringify(pRefmodel);
                viewModel.catagorymodal.setMeta('dataSourceId', 'refmodel', refmodel);
            }
        });
    }
    catagoryref("catagorymodal");*/
    
	//监听分组参照弹出界面
	$(document).on("click", "#catagrid_content_table tr", function(e) {
		var id = $(this).find("td:eq(0)>div").html();
		var name = $(this).find("td:eq(1)>div").html();
		viewModel.formData.setValue("categoryId",id);
		viewModel.formData.setValue("categoryName",name);
		$('#cataModal').modal('hide');
	});
	
	function removeRootNode(alldata){
		var rtn=alldata;
		for(var i=0;i<rtn.length;i++){
			if(rtn[i].pid==""){
				rtn.remove(i);
				break;
			}
		}
		return rtn;
	}

    return {
        init: function(params) {
            viewModel.pageInit(params);
        },
        html: edit
    };
});