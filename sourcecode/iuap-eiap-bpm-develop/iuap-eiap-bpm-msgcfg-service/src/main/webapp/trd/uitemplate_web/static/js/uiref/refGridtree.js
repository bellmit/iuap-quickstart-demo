/**
 * 表格树类型参照（包括单选和多选）
 */
+ function($) {
//define(['jquery'], function($) {
		var gridTreeViewModel = {
					
			/**
			 * 单选树表
			 */	
			referbindGridTreeEvent : function (referModel) {
				var ReferFn=$.Refer.exports; //导出参照常用API
		        var that = referModel;
		        that.$el.find('.refer_results2').append(_.template(that.getTreeListTpl())({}));
				that.$el.find('.hotData').append(_.template(that.getGridhotTpl())({})); //常用数据
				
		        var cols = that.buildTableColumn(that.options.isMultiSelectedEnabled);
		        that.$el.find(".msgtype-table").bootstrapTable({
		            columns: cols
		        }).on('click-row.bs.table', function (e, obj, tr) {
		                $(this).find('tr').removeClass('selected');
		                that.markSelection($(tr));
		                if (that.options.isClickToHide) {
		                    that.setValue([obj]);
		                    ReferFn.updateHotData(that.options.getRefHotDataKey(), obj, that.options.hotDataSize); //更新常用数据
		                    that.hide();
		                }
		            });
		        that.$el.find(".msgtype-table2").bootstrapTable({
		            columns: cols
		        }).on('click-row.bs.table', function (e, obj, tr) {
		                $(this).find('tr').removeClass('selected');
		                that.markSelection($(tr));
		                if (that.options.isClickToHide) {
		                    that.setValue([obj]);
		                    ReferFn.updateHotData(that.options.getRefHotDataKey(), obj, that.options.hotDataSize); //更新常用数据
		                    that.hide();
		                }
		            });
		        that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
		        that.addScroll(true);

		        that.$el.find('.refer_results2').on('click', '.refer_list2 li', function () {
		            var $that = $(this);
		            var item = {};
		            item.refpk = $that.attr('pk');
		            item.refname = $that.attr('name');
		            item.refcode = $that.attr('code');
		            that.markSelection($that);
		            that.setValue([item]);
		            ReferFn.updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
		            if (that.options.isClickToHide) {
		                that.hide();
		            }
		        });
		        
		        //点击搜索图标
		        that.$el.find('.refer_results2').on('click', '.refer_nav li .pic-search', function (e) {
		        	var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		        	var treeNode = zTree.getSelectedNodes();
		        	var searchContent = that.$el.find('.refer_nav li.searchInput input[type="text"]').val();
		        	treeNode && treeNode.length>0 && that.loadGridTreeData(treeNode[0],false,searchContent);
		        });
		        //点击搜索全部
		        that.$el.find('.refer_results2').on('click', '.refer_nav li .btn-search', function (e) {
		        	var searchContent = that.$el.find('.refer_nav li.searchInput input[type="text"]').val();
		        	var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		            if (zTree) {
		                var nodes = zTree.getSelectedNodes();
		                var refreshCache = true;
		                that.searchFlag = true;
		                that.loadClassData(refreshCache,searchContent);//load树的数据
						that.getRoot();
		                
		                buildTree(refreshCache);//构建树
		                
		                if (nodes && nodes[0]) {
		                    zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		                    var node = zTree.getNodeByParam("id", nodes[0].id, null);
		                    zTree.selectNode(node);
		                    nodeClick(null, null, node,null,searchContent); //树节点击事件，load此树节点的数据
		                }
		            }
		        });

		        that.$el.find('.refer_results2').on('click', '.refer_nav li', function (e) {
		            var $that = $(this);
		            var isRefresh = $that.hasClass('ref_class_refresh');
		            var selectedData = $that.hasClass('selectedData');
		            var searchInput = $that.hasClass('searchInput');
		            if(searchInput){
		            	$that.find("input[type='text']").focus();
		            	return;
		            }
		            if (isRefresh || selectedData || searchInput) {
		                return;
		            }
		            that.selectedTab = $that;
		            var currentIndex = that.$el.find('.refer_nav li.action').toggleClass('action').attr('index');
		            var clickedIndex = $that.attr('index');
		            var condition = $that.attr('condition');

		            if ("1" === clickedIndex) {
		                that.refreshHotData(true);
		            } else if ("2" === clickedIndex && (!that.$el.find(".ztree").hasClass('scrollbar-dynamic'))) {
		                var treeDom = $('#' + that.getTreeID());
		                that.getRoot();
		                $.fn.zTree.init(treeDom, setting, that.options.classData);
		                that.$el.find(".ztree").addClass('scrollbar-dynamic').scrollbar();
		            }
		            
		            e.stopPropagation();//当前dom结果结构发生变化，阻止错误事件

		            that.$el.find('.ul_list' + currentIndex).hide();
		            that.$el.find('.ul_list' + clickedIndex).show();
		            that.$el.find('.nav_list' + clickedIndex).toggleClass('action');

		            //that.addScroll();
		        });

		        var buildTree= function (isRefreshCache) {
		            var treeDom = $('#' + that.getTreeID());
		            var treeData = that.options.classData;
		            
		            if (isRefreshCache) {//mark class need RefreshCache
		                $.each(treeData, function (i, v) {
		                    v.isRefreshCache = isRefreshCache;
		                });
		            }
		            $.fn.zTree.init(treeDom, setting, treeData);
		        }
				var TimeFn=null;
		        var nodeClick = function (event, treeId, treeNode,clickFlag,searchContent) {
					//单击展开树
					clearTimeout(TimeFn); //setTimeout用来屏蔽连续2次单击变成单击事件
					TimeFn = setTimeout(function() {
						var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
						zTree.expandNode(treeNode);
			        }, 200);
					that.searchFlag && !searchContent && (searchContent=that.$el.find('.refer_nav li.searchInput input[type="text"]').val());
		            that.loadGridTreeData(treeNode,false,searchContent);
		        }
				//树的双击事件
				var nodeDblClick = function (event, treeId, treeNode) {
					clearTimeout(TimeFn);
		    	}
				//暂时没用到，树的搜索
		        var searchNode = function (val) {
		            var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		            var nodes = zTree.getNodesByParam("isHidden", true);
		            zTree.showNodes(nodes);
		            nodes = zTree.getNodesByFilter(function (node) {
		                return ((!node.isParent) && node.name.indexOf(val.toUpperCase()) === -1);
		            });
		            for (var i = 0; i < nodes.length; i++) {
		                zTree.hideNode(nodes[i]);
		            }
		        }
		        
		        var setting = {
		                data: {
		                    simpleData: {
		                        enable: true,
		                        idKey: "id",
		                        pIdKey: "pid"
		                    }
		                },
		                callback: {
							onDblClick: nodeDblClick,
		                    onClick: nodeClick
		                },
		                view: {
		                    selectedMulti: false,
		                    showIcon: false,
							dblClickExpand: false //屏蔽双击展开事件
		                }
		            };

		        that.$el.find('.ref_class_refresh').on('click', 'span', function () {
		            var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		            var nodes = zTree.getSelectedNodes();
		            var refreshCache = true;
		            that.searchFlag = false; //刷新之后将搜索标志位置为false
		            that.loadClassData(refreshCache);//分类缓存清空
					that.getRoot();
		            
		            buildTree(refreshCache);//标记分类缓存
		            that.$el.find(".msgtype-table").bootstrapTable('load', {data: []});
					//刷新常用数据
					if (that.$el.find('.refer_nav li.nav_list1').hasClass('action')) {
						that.refreshHotCache = true;
			            that.refreshHotData(true);
					}
//			            if (nodes && nodes[0]) {
//			                zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
//			                var node = zTree.getNodeByParam("id", nodes[0].id, null);
//			                //zTree.selectNode(node); //火狐问题
//			                nodeClick(null, null, node);
//			            }
		        });
		    },
		    /**
		     * 多选树表
		     */
			referbindMultiGridTreeEvent : function (referModel) {
		        var that = referModel;
		        that.$el.find('.refer_results2').append(_.template(that.getTreeListTpl())({}));
				that.$el.find('.ul_list1.hotData').append(_.template(that.getGridhotTpl())({})); //常用数据
		        var cols = that.buildTableColumn(that.options.isMultiSelectedEnabled);
		        that.$el.find(".msgtype-table").bootstrapTable({
		            onCheck: function (row) {
		                that.updateSelectedTab();
		            },
		            onUncheck: function (row) {
		                that.unSelections(row.id || row.refpk);
		            },
		            onCheckAll: function () {
						//that.$el.find(".msgtype-table thead tr").attr("class","selected");
		                that.updateSelectedTab();
		            },
		            onUncheckAll: function () {
						//that.$el.find(".msgtype-table thead tr").removeClass("selected");
		                var currClassTableData = that.$el.find(".msgtype-table").bootstrapTable('getData');
		                $.each(currClassTableData, function (i, v) {
		                    that.unSelections(v.id || v.refpk);
		                });
		            },
		            columns: cols
		        });
		        that.$el.find(".msgtype-table2").bootstrapTable({
		            onCheck: function (row) {
		                that.updateSelectedTab();
		            },
		            onUncheck: function (row) {
		                that.unSelections(row.id || row.refpk);
		            },
		            onCheckAll: function () {
						//that.$el.find(".msgtype-table2 thead tr").attr("class","selected");
		                that.updateSelectedTab();
		            },
		            onUncheckAll: function () {
						//that.$el.find(".msgtype-table2 thead tr").removeClass("selected");
		                var currClassTableData = that.$el.find(".msgtype-table2").bootstrapTable('getData');
		                $.each(currClassTableData, function (i, v) {
		                    that.unSelections(v.id || v.refpk);
		                });
		            },
		            columns: cols
		        });
		        that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
		        that.addScroll(true);
		        
		        //点击搜索图标
		        that.$el.find('.refer_results2').on('click', '.refer_nav li .pic-search', function (e) {
		        	var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		        	var treeNode = zTree.getSelectedNodes();
		        	var searchContent = that.$el.find('.refer_nav li.searchInput input[type="text"]').val();
		        	treeNode && treeNode.length>0 && that.loadGridTreeData(treeNode[0],false,searchContent);
		        });
		        //点击搜索全部
		        that.$el.find('.refer_results2').on('click', '.refer_nav li .btn-search', function (e) {
		        	var searchContent = that.$el.find('.refer_nav li.searchInput input[type="text"]').val();
		        	var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		            if (zTree) {
		                var nodes = zTree.getSelectedNodes();
		                var refreshCache = true;
		                that.searchFlag = true;
		                that.loadClassData(refreshCache,searchContent);//加载树的数据
						that.getRoot();
		                
		                buildTree(refreshCache);//构建树
		                
		                if (nodes && nodes[0]) {
		                    zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		                    var node = zTree.getNodeByParam("id", nodes[0].id, null);
		                    zTree.selectNode(node);
		                    nodeClick(null, null, node,null,searchContent);
		                }
		            }
		        });
		        that.$el.find('.refer_results2').on('click', '.refer_nav li', function (e,sysnDataFlag) {
		            var $that = $(this);
		            var isRefresh = $that.hasClass('ref_class_refresh');
		            var selectedData = $that.hasClass('selectedData');
		            var searchInput = $that.hasClass('searchInput');
		            if(searchInput){
		            	$that.find("input[type='text']").focus();
		            	return;
		            }
		            if (isRefresh || selectedData || searchInput) {
		                return;
		            }
		            that.selectedTab = $that;
		            var currentIndex = that.$el.find('.refer_nav li.action').toggleClass('action').attr('index');
		            var clickedIndex = $that.attr('index');
		            var condition = $that.attr('condition');
		            var selectData = that.getSelections(null,sysnDataFlag);
		            if ("1" === clickedIndex) {
		                that.refreshHotData(true);
		            } else if ("2" === clickedIndex && (!that.$el.find(".ztree").hasClass('scrollbar-dynamic'))) {
		                var treeDom = $('#' + that.getTreeID());
		                that.getRoot();
		                $.fn.zTree.init(treeDom, setting, that.options.classData);
		                that.$el.find(".ztree").addClass('scrollbar-dynamic').scrollbar();
		            }else if("2" === clickedIndex && selectData.length > 0){
		            	var datas = that.$el.find(".msgtype-table").bootstrapTable('getData');
		            	$.each(datas, function(i, v){
							v.selected = $.grep(selectData, function(e){
								return e.refpk === v.refpk;
							}).length >0;
						});
		                that.$el.find(".msgtype-table").bootstrapTable('load', {data: datas});
		                that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
		                that.uCheckboxInit();
		            }
		           
		            e.stopPropagation(); //当前dom结果结构发生变化，阻止错误事件

		            that.$el.find('.ul_list' + currentIndex).hide();
		            that.$el.find('.ul_list' + clickedIndex).show();
		            that.$el.find('.nav_list' + clickedIndex).toggleClass('action');

		            //that.addScroll(); //注释掉  防止切换常用、全部标签显示排版错误
		        });
			   var TimeFn = null;
		       var nodeClick = function (event, treeId, treeNode,clickFlag,searchContent) {
			   		//单击展开树
					clearTimeout(TimeFn); //setTimeout用来屏蔽连续2次单击变成单击事件
					TimeFn = setTimeout(function() {
						var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
						zTree.expandNode(treeNode);
			        }, 200);
					that.searchFlag && !searchContent && (searchContent=that.$el.find('.refer_nav li.searchInput input[type="text"]').val());
		            that.loadGridTreeData(treeNode,false,searchContent);
		        }
				//树的双击事件
				var nodeDblClick = function (event, treeId, treeNode) {
					clearTimeout(TimeFn);
		    	}
		       var buildTree = function (isRefreshCache) {
		            var treeDom = $('#' + that.getTreeID());
		            var treeData = that.options.classData;
		            
		            if (isRefreshCache) {//mark class need RefreshCache
		                $.each(treeData, function (i, v) {
		                    v.isRefreshCache = isRefreshCache;
		                });
		            }
		            $.fn.zTree.init(treeDom, setting, treeData);
		        }

		       var searchNode = function (val) {
		            var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		            var nodes = zTree.getNodesByParam("isHidden", true);
		            zTree.showNodes(nodes);
		            nodes = zTree.getNodesByFilter(function (node) {
		                return ((!node.isParent) && node.name.indexOf(val.toUpperCase()) === -1);
		            });
		            for (var i = 0; i < nodes.length; i++) {
		                zTree.hideNode(nodes[i]);
		            }
		        }
		       
		       var setting = {
		               data: {
		                   simpleData: {
		                       enable: true,
		                       idKey: "id",
		                       pIdKey: "pid"
		                   }
		               },
		               callback: {
					   	   onDblClick: nodeDblClick,
		                   onClick: nodeClick
		               },
		               view: {
		                   selectedMulti: false,
		                   showIcon:false,
						   dblClickExpand: false //屏蔽双击展开事件				   
		               }
		           };
		       
		        that.$el.find('.refer_results2').on('click', '.refer_list2 li', function () {
		            var refpk = $(this).attr('pk');
		            var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		            if (zTree) {
		                var pageInfo = that.pageState;
		                for (var key in pageInfo) {//同步选择状态，同步表格树里面  已选择 按钮里面的数据，即全部里面选中某个数据时，已选择 里面也要出现这个数据
		                    if (pageInfo.hasOwnProperty(key)) {
		                        var pageData = pageInfo[key].data;
		                        if (pageData) {
		                            for (var ii = 0; ii < pageData.length; ii++) {
		                                if (pageData[ii].refpk === refpk) {
		                                    pageData[ii].selected = false;
		                                }
		                            }
		                        }
		                    }
		                }
		                var nodes = zTree.getSelectedNodes();//更新当前页
		                if (nodes && nodes[0]) {
		                    var cpageData = that.pageState[nodes[0].id].data;
		                    that.$el.find(".fixed-table-body .msgtype-table").bootstrapTable('load', {data: cpageData});
		                }
		            }
		            that.updateSelectedTab(); // 更新 已选择 页签
		        });

		        that.$el.find('.ref_class_refresh').on('click', 'span', function () {
		            var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		            if (zTree) {
		                var nodes = zTree.getSelectedNodes();
		                var refreshCache = true;
		                that.searchFlag = false; //刷新之后将搜索标志位置为false
		                
		                that.loadClassData(refreshCache);//加载树的数据
						that.getRoot();
		                
		                buildTree(refreshCache);//构建树
		                that.$el.find(".msgtype-table").bootstrapTable('load', {data: []});
						//刷新常用数据
						if (that.$el.find('.refer_nav li.nav_list1').hasClass('action')) {
							that.refreshHotCache = true;
				            that.refreshHotData(true);
						}
		            }
		        });
		    }
			
		};
		$.fn.gridTreeViewModel = gridTreeViewModel;  
		return gridTreeViewModel;
//});
}($)

