define(function (require, module, exports) {
    /*
     * 引入静态资源
     */
    var list = require('text!../../html/process/procindex.html');
    var styles = require('css!../../css/procindex.css');
    var styles = require('css!../../css/cover.css');
    var styles = require('css!../../css/main.css');
    var styles = require('css!../../css/table.css');
    var styles = require('css!../../css/common.css');
    var styles = require('css!../../css/iconfont/iconfont.css');
    var tool = require('../../js/tool/instTool.js');
    
    var treeData;
    var selectTreeNode;
    var treeFun = {
        /**
         * 树结点点击事件
         */
        getListInfo: function getListInfo(event, treeId, treeNode){
            var data = {};
            data.pageSize=10;
            data.pageNum=1;
            data.categoryId=treeNode.id;
            viewModel.loadList(data);
            selectTreeNode = treeNode;
        },
        zTreeOnRename: function zTreeOnRename(event, treeId, treeNode){
	        var data={};
        	var type="rename";
        	data.id=treeNode.id;
        	data.name=treeNode.name;
        	ajaxUpdateTreeInfoFun(type,data,treeNode);
        	selectTreeNode = treeNode;
	    },
	    zTreeBeforeRemove: function zTreeBeforeRemove(treeId, treeNode){
            tool.confirmDialog({
                msg: "是否删除？",
                title: "确认",
                okText: "删除",
                onOk: function onOk() {
                	var type="remove";
                	var data={};
                 	data.id=treeNode.id;
                 	ajaxUpdateTreeInfoFun(type,data,treeNode);
                 	selectTreeNode = treeNode;
                },
                onCancel: function onCancel() {
                }
            });
            return false;
        },
        addHoverDom: function addHoverDom(treeId, treeNode){
        	//总根节点不能操作
        	if(treeNode.id=="root"){
        		$(".remove").addClass("hide");
        		$(".edit").addClass("hide");
        	}
        }
    };

    var viewModel = {
        /**
         * 树模型
         */
        treeSetting: {
            view: {
                showLine: false,
                showIcon: false,
                addHoverDom: treeFun.addHoverDom
            },
            edit: {
            	enable: true,
            	//给节点额外增加属性来控制“重命名”、“删除”图标的显示或隐藏
            	showRenameBtn:true,
            	showRemoveBtn:true,
            	removeTitle:'删除',
            	renameTitle:'重命名'
            },
            callback: {
                onClick: treeFun.getListInfo,
                onRename: treeFun.zTreeOnRename,
                beforeRemove: treeFun.zTreeBeforeRemove
            }
        },
        treedt: new u.DataTable({
            meta: {
                'id': { 'value': "" },
                'pid': { 'value': "" },
                'name': { 'value': "" }
            }
        }),

        /**
         * 表格模型
         */
        listData: new u.DataTable({
            meta: {
                id: { type: 'string' },
                procName: { type: 'string' },
                bizModelRefId: { type: 'string' },
                categoryId: { type: 'string' },
                categoryName: {type: 'string'},
                version: { type: 'string' },
                createTime: { type: 'date' },
                lastUpdateTime: { type: 'date' },
                deploymentId: { type: 'string' }
            }
        }),
        
        /*
         * 新增分组
         */
        addgroup: function addgroup() {
            if (selectTreeNode) {
            	var type="add";
            	var data={};
            	data.pid=selectTreeNode.id;
            	data.name="新增节点";
            	ajaxUpdateTreeInfoFun(type,data,selectTreeNode);
            }else{
            	var type="add";
            	var data={};
            	data.pid="root";
            	data.name="新增节点";
            	ajaxUpdateTreeInfoFun(type,data,selectTreeNode);
            }
        },

        /*
         * 新增流程
         */
        add: function add(index, data) {
            if (selectTreeNode && selectTreeNode.id !=="root") {
            	var v1 = $('#secretdata').text();
            	var v = (v1==="true");
                //跳转到编辑页面
                var params = {
                    'listData': viewModel.listData,
                    'flag': 'add',
                    'selectTreeNode': selectTreeNode,
                    'webalone':v //公|私有云 私有为alone
                };
                viewModel.jumpEdit(params);
            } else {
                tool.errorMessage("请先选择服务目录！", "提示");
            }
        },

        /*
         * 编辑流程
         */
        edit: function edit(index, data) {

            viewModel.listData.setRowSelect(index);
            var params = {
                'listData': viewModel.listData,
                'flag': 'edit',
                'selectTreeNode': selectTreeNode,
                'index': index,
                'treeData': viewModel.treedt
            };
            viewModel.jumpEdit(params);
        },

        /**
         * 穿透查询跳转
         */
        check: function check(index, data) {
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
        jumpEdit: function jumpEdit(params) {
            require(['static/js/process/procedit.js'], function (module) {
                var editPanel = $('.edit-panel');
                var listPanel = $('.list-panel');
                ko.cleanNode(editPanel[0]);

                editPanel[0].innerHTML = module.html;
                listPanel.hide();
                editPanel.show();
                module.init(params);
            });
        },

        /*
         * 删除
         */
        del: function _delete(index, data) {
        	var id = data.data.id.value;
            tool.confirmDialog({
                msg: "是否删除该流程模型？",
                title: "确认",
                okText: "删除",
                onOk: function onOk() {
                	var localurl = window.flowUrl+"bmp_proc/process/deleteProcModel";
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: localurl,
                        data:{
                        	"id":id
                        },
                        success: function success(res) {
                            if (res.status == 1) {
                                viewModel.listData.forceDel = true;
                                viewModel.listData.removeRow(index);
                            } else{
                                tool.errorMessage(res.msg, "提示");
                            }
                        }
                    });
                },
                onCancel: function onCancel() {}
            });
        },

        /*
         * 设计
         */
        design: function design(index, data) {
            if (navigator.userAgent.indexOf("MSIE 8.0") > 0 || navigator.userAgent.indexOf("MSIE 7.0") > 0) {
                $.showMessageDialog({ type: "info", title: "提示", msg: "设计器不支持ie8!" });
                return;
            }
            var localurl = window.flowUrl+"bmp_proc/process/queryProcModelId";
            $.ajax({
                type: 'POST',
                url: localurl,
                dataType: 'json',
                data: {
                	 "id":data.data.id.value
                },
                success: function success(res){
                    if (res.status == 1) {
                    	viewModel.getDesignUrl(res.data.procModelId);
                    }else{
                    	tool.errorMessage(res.msg,"提示");
                    }
                },
                error: function error(jqXHR, textStatus, errorThrown) {}
            });
        },
        getDesignUrl: function getDesignUrl(modelid){
        	var localurl = window.flowUrl+"/bpmsso/getFlowUrl";
        	$.ajax({
        		type: 'GET',
        		url: localurl,
        		dataType:'json',
        		data: {
        			"modelId":modelid
        		},
        		success: function success(res){
        			if (res.status == 0){
        				tool.errorMessage(res.msg,"提示");
        			} else {
        				//var url = "http%3A%2F%2F172.20.8.9%3A8080%2Fubpm-web-approve%2Fstatic%2Flogin.html%3FmodelId%3Dshsedggsdg%26organizationId%3Dgfhfdbdfbdbf%26page%3Dflow%26userCode%3Dlixial%26userId%3Diinivoo-99ksdlflksd-dd%26token%3Dsgihoifwladsgbnvismgnvimwiwvdkmwgnvokso";
        				var decodeurl = decodeURIComponent(res.data);
        				window.open(decodeurl);
        			}
        		},
        		error: function error(jqXHR, textStatus, errorThrown) {}
        	});
        },

        /*
         * 发布
         */
        deploy: function deploy(index, data) {
        	tool.showLoading();
        	var localurl = window.flowUrl+"bmp_proc/process/deployProcDefinition";
            $.ajax({
                type: 'POST',
                url: localurl,
                dataType: 'json',
                data: {
                	"id": data.data.id.value
                	},
                success: function success(res) {
                	tool.hideLoading();
                    if (res.status==1) {
                        tool.shortMessage("发布成功!");
                    } else {
                        tool.errorMessage(res.msg, "提示");
                    }
                },
                error: function error(jqXHR, textStatus, errorThrown) {

                }
            });
        },

        /*
         * 查看发布
         */
        showDeploy: function showDeploy(index, data) {
    
            viewModel.listData.setRowSelect(index);
            var params = {
                'listData': viewModel.listData,
                'index': index
            };
            viewModel.jumpDeploy(params);
        },

        /**
         * 跳转deploy页面，工具函数
         */
        jumpDeploy: function jumpDeploy(params) {
            $('body').css('overflow','auto');
            require(['static/js/process/procdeploy.js'],function (module){
                var deployPanel = $('.deploy-panel');
                var listPanel = $('.list-panel');
                ko.cleanNode(deployPanel[0]);

                deployPanel[0].innerHTML = module.html;
                listPanel.hide();
                deployPanel.show();
                module.init(params);
            });
        },

        /**
         * 处理点击显示与隐藏行操作
         */
        isShow: function isShow(index, data) {
            var i = $('ul[show="' + index + '"]');
            if (i.css('display') == 'none') {
                i.show();
            } else {
                i.hide();
            }
        },

        /**
         * 控制行操作面板的延迟消失
         */
        timeOut: null,

        /**
         * 显示当前行的操作面板
         */
        showPanel: function showPanel(index, data) {
            $('ul[show="' + index + '"]').show();
            clearTimeout(viewModel.timeOut);
        },

        /**
         * 隐藏行操作面板
         */
        hidePanel: function hidePanel(index, data) {
            viewModel.timeOut = setTimeout(function () {
                $('ul[show="' + index + '"]').hide();
            }, 100);
        },

        /*
         * 查询分类树数据
         */
        loadTree: function loadTree() {
        	var localurl = window.flowUrl+"bmp_proc/category/query?r="+Math.random();
        	tool.showLoading();
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: localurl,
                success: function success(res) {
                	tool.hideLoading();
                	if(res.status=="1"){
                		var rootnode={id: "root",isCatalog: null,name: "全部分组",pid: ""};
                		res.data.push(rootnode);
                		viewModel.treedt.removeAllRows();
                		viewModel.treedt.setSimpleData(res.data);
                	}
                }
            });
        },
        
        /*
        分页
        */
       pagination: {
           element: null,
           // 用于控制分页控件的显示，条目大于10的时候显示控件
           count: ko.observable(0),
           init: function() {
               // 分页控件初始化
               var ele = $('#pagination')[0];
               this.element = new u.pagination({
                   el: ele,
                   jumppage: true
               });
               //分页
               this.element.on('pageChange', function (pageIndex) {
                   var data = {};
                   data.pageSize=viewModel.pagination.element.options.pageSize;
                   data.pageNum=pageIndex+1;
                   data.categoryId=selectTreeNode.id;
                   viewModel.loadList(data);
               });
               this.element.on('sizeChange', function (siz) {
                   var data = {};
                   data.pageSize=siz;
                   data.pageNum=1;
                   data.categoryId=selectTreeNode.id;
                   viewModel.loadList(data);
               });
           }
       },

        /*
         * 加载表格数据
         */
        loadList: function loadList(data) {
        	tool.showLoading();
        	var localurl = window.flowUrl+"bmp_proc/process/queryProcModels";
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data:{
                   "data":JSON.stringify(data)
                },
                url: localurl,
                success: function success(res) {
                	tool.hideLoading();
                	if(res.status==1){
                		viewModel.pagination.element.update({
                			totalPages: res.data.totalPages,
                			pageSize: res.data.size,
                			currentPage: res.data.number + 1,
                			totalCount: res.data.totalElements
                		});
                		viewModel.pagination.count(res.data.totalElements);
                		viewModel.listData.removeAllRows();
                		viewModel.listData.setSimpleData(res.data.content);
                	}
                }
            });
        },

        /*
         *初始化页面，绑定uui
         */
        pageInit: function pageInit() {

            var $doc = $(document);
            $doc.ajaxError(function(event, XMLHttpRequest, ajaxOptions, thrownError){
                try{
                    tool.hideLoading();
                }catch (e){}
                if(XMLHttpRequest.status == '401') {

                    //TODO 没有权限返回
                    // u.confirmDialog({
                    //     msg: JSON.parse(XMLHttpRequest.responseText).msg,
                    //     title: "请求错误",
                    //     onOk: function() {
                    //         window.history.back(-1);
                    //     },
                    //     onCancel: function() {
                    //         window.history.back(-1);
                    //     }
                    // });
                    u.messageDialog({msg: JSON.parse(XMLHttpRequest.responseText).msg, title: '请求错误', btnText: '确定',closeFun:function () {
                        window.history.back(-1);
                    }});
                    // u.showMessage({msg:JSON.parse(XMLHttpRequest.responseText).msg,position:"center",msgType:"error"});
                }else{
                    u.showMessage({msg:"调用服务报错",position:"center",msgType:"error"});
                }
            });
            u.createApp({
                el: '.list-panel',
                model: viewModel
            });

            // 初次加载数据
            viewModel.pagination.init();
            viewModel.loadTree();
            
            var procreturnbtn=document.querySelector('[data-role="procreturnbtn"]');//返回按钮
            u.on(procreturnbtn, 'click', function(){//清除按钮
	    		history.back();
	    	});
        },
        
    };
    //更新树节点信息
    var ajaxUpdateTreeInfoFun = function(type,data,treeNode){
    	tool.showLoading();
    	var localurl = window.flowUrl+"bmp_proc/category/update";
    	$.ajax({
	        type: 'post',
	        dataType: 'json',
	        data: {
	        	   "type":type,
	        	   "data":JSON.stringify(data)
	              },
	        url: localurl,
	        success: function success(res) {
	        	tool.hideLoading();
	        	if(res.status == 1){
	        		if(type=="add"){
	        			var dataSource={};
	        			if(treeNode){
	        				var dataSource = {"id":res.data.id,"pid":treeNode.id,"name":"新增节点"};
	        			}else{
	        				dataSource = {"id":res.data.id,"pid":"root","name":"新增节点"};
	        			}
	        			viewModel.treedt.addSimpleData(dataSource);
	        		}else if(type=="remove"){
	        			var rows = viewModel.treedt.rows();
	        			for(var i=0;i<rows.length;i++){
	        				if(rows[i].getValue("id")==treeNode.id){
	        					viewModel.treedt.removeRows(rows[i]);
	        				}
	        			}
	        			//重置选中节点
	        			var ztree = $.fn.zTree.getZTreeObj("tree");
	        			if(ztree.getSelectedNodes().length>0){
	        				selectTreeNode=$.fn.zTree.getZTreeObj("tree").getSelectedNodes()[0];
	        			}else{
	        				selectTreeNode=null;
	        			}
	        		}
	        	}else{
                      tool.errorMessage(res.msg, "提示");
	        	}
	        }
	    });
    };
    
    window.hrefToInstance = function(data) {
    	//$.fn.zTree.getZTreeObj("tree").destroy();
        require(['static/js/instance/instindex.js']);
    };

    return {
        init: function init(content) {
            content.innerHTML = list;
            $('body').css('overflow','hidden');
            $("#ctxBody").css('height',$('body').height()-127);
            viewModel.pageInit();
        }
    };
});