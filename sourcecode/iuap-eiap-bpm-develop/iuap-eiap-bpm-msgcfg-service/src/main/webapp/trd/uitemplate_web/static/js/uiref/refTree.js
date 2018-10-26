/**
 * 树类型参照（包括单选树和多选树，2种类型，一种普通类型，一种是ztree类型）
 */
+ function($) {
//define(['jquery'], function($) {
		var treeViewModel = {
			/**
			 * 单选树（普通类型）
			 */
			referbindTreeEvent : function (referModel) {
				var ReferFn=$.Refer.exports;
				var viewHelper= $.Refer.viewHelper;
				var that = referModel;
				that.$el.find('.refer_nav.tab').on('click', 'li', function (e) {
		            var $that = $(this);
		            var clickedIndex = $that.attr('index');
		            var condition = $that.attr('condition');
		            var isRefresh = $that.hasClass('ref_class_refresh');
		            var currentIndex = that.$el.find('.refer_nav li.action').attr('index');
		            var searchInput = $that.hasClass('searchInput');
		            if(searchInput){
		            	$that.find("input[type='text']").focus();
		            	return;
		            }
		            if (isRefresh && "1" === currentIndex) {
		                return;
		            }

		            if ("1" === clickedIndex) {
		                that.$el.find('.navtree').hide();
		                that.refreshHotData(true);
		                that.$el.find('.ul_list1').show();
		                that.$el.find('.ul_list2').hide();
						that.$el.find('.nav_list1').siblings().removeClass('action');
		                that.$el.find('.nav_list1').addClass('action');
		            } else {
		                if (that.options.classData.length === 0 || isRefresh) {
		                    that.loadTreeData(isRefresh);
		                }
						that.$el.find('.navtree').show();
						that.$el.find('.ul_list2').show();
		                that.$el.find('.ul_list1').hide();
						that.$el.find('.nav_list2').siblings().removeClass('action');
		                that.$el.find('.nav_list2').addClass('action');
		                that.addScroll();
		            }

//		            if (!isRefresh) {
//		                $that.siblings().removeClass('action');
//		                $that.toggleClass('action');
//		            }
		            e.stopPropagation();//当前dom结果结构发生变化，阻止错误事件
		        });
				//点击刷新按钮
				that.$el.find('.ref_class_refresh').on('click', 'span', function (e) {
					var $that = $(this);
					that.searchFlag = false;
					var isRefresh = true;
					var currentIndex = that.$el.find('.refer_nav li.action').attr('index');
		            if ("1" === currentIndex) {
		                return;
		            }
					that.loadTreeData(isRefresh);
					
					that.$el.find('.navtree').show();
					that.$el.find('.ul_list2').show();
					that.$el.find('.ul_list1').hide();
					that.$el.find('.nav_list2').siblings().removeClass('action');
					that.$el.find('.nav_list2').addClass('action');
					that.addScroll();
					e.stopPropagation();//当前dom结果结构发生变化，阻止错误事件
				});
				//点击搜索按钮
				that.$el.find('.refer_results').on('click', '.refer_nav li .pic-search,.refer_nav li .btn-search', function (e) {
		        	var searchContent = that.$el.find('.refer_nav li.searchInput input[type="text"]').val();
		        	that.searchFlag = true;
                 	
                 	var treeData = that.options.classData;
                 	for(var i=0;i<treeData.length;i++){
                 		treeData[i].name = treeData[i].refname.replace('<span style="color:#2C9AEF;margin-right: 0px;">',"").replace("</span>",""); 
                 		var labelVal = treeData[i].name;
             			var inputVal= searchContent.split(' ');
             			var lastVal = "";
    					for(var j=0;j<inputVal.length;j++){
    						if(inputVal.length<2){
    							if(labelVal.toLowerCase().indexOf(inputVal[j].toLowerCase())>=0){
    								var reg = new RegExp(inputVal[j],"i");
    								if(labelVal.indexOf(inputVal[j].toLowerCase())>=0){
    									lastVal=inputVal[j].toLowerCase();
    								}else{
    									lastVal=inputVal[j].toUpperCase();
    								}
    								labelVal = labelVal.replace(reg,'<span style="color:#2C9AEF;margin-right: 0px;">'+lastVal+'</span>');
    							}
    						}
    					}
    					treeData[i].name = labelVal; 
		        	}
                 	
                    var rootItem = that.getRoot(true);
                    var parents = [];
                    ReferFn.getParents(treeData, parents, rootItem);
                    parents.push(rootItem);
                    var nodes = that.getChildNode(treeData, rootItem);

                    viewHelper.notLeafSelected = that.options.isNotLeafSelected;
        			viewHelper.getCustomizeTips=that.options.getCustomizeTips;
        			
                    var data = _.extend({refTreeNavList: parents, refTreeNodeList: nodes}, viewHelper);

                    that.$el.find('.refer_list.ul_list2').remove();
                    that.$el.find('.refer_nav.navtree').remove();

                    that.$el.find('.refer_results').append(_.template(that.getTreeClassTpl())(data));
                    that.$el.find('.refer_results').append(_.template(that.getTreeNodeTpl())(data));
        			if(that.$el.find('.refer_nav li.nav_list2').hasClass('action')){
        	            that.$el.find('.ul_list1').hide();
        				that.$el.find('.ul_list2').show();
        	            that.$el.find('.navtree').show();
        			}
        			that.addScroll(); //添加滚动条
		        });
				//点击树的tab节点
		        that.$el.find('.refer_results').on('click', '.navtree li', function (e) {
		            var $that = $(this);
		            var clickedIndex = $that.attr('index');
		            var condition = $that.attr('condition');
		            var treeData = that.options.classData;
		            var node = that.getNodeByPK(condition);
		            var parents = [];

		            ReferFn.getParents(treeData, parents, node);
		            parents.push(node);
		            var nodes = that.getChildNode(treeData, node);

					viewHelper.getCustomizeTips=that.options.getCustomizeTips;
		            var data = _.extend({refTreeNavList: parents, refTreeNodeList: nodes}, viewHelper);

		            that.$el.find('.refer_list.ul_list2').remove();
		            that.$el.find('.refer_nav.navtree').remove();

		            that.$el.find('.refer_results').append(_.template(that.getTreeClassTpl())(data));
		            that.$el.find('.refer_results').append(_.template(that.getTreeNodeTpl())(data));
				   
		            e.stopPropagation(); //当前dom结果结构发生变化，阻止错误事件

		            that.$el.find('.ul_list2').show();
		            that.$el.find('.ul_list1').hide();
		            that.$el.find('.navtree').show();

		            that.addScroll();
					//如果navtree树的ul过长，则隐藏前面的，显示后面的
					var liWidth = 0;
					var allLi = that.$el.find('.refer_nav.navtree li');
					for(var i=allLi.length;i>0;i--){
						liWidth+=allLi.eq(i-1).width();
						if(liWidth>600){
							allLi.eq(i-1).hide();
						}
					}
		        });

				var TimeFn=null;
		        that.$el.find('.refer_results').on('click', '.refer_list li',function (e) {
					clearTimeout(TimeFn); //setTimeout用来屏蔽连续2次单击变成单击事件
					
		            var $that = $(this);
		            var isLeaf = $that.attr('isLeaf');
		            var treeData = that.options.classData;
		            var item = {};
		            item.refpk = $that.attr('pk');
		            item.pid = $that.attr('pid');
		            item.id = $that.attr('id');
		            item.refname = $that.attr('name');
		            item.refcode = $that.attr('code');
		            
		            var isHotTab = that.$el.find('.tab > .nav_list1').hasClass('action');//常用则直接选中
					//setTimeout用来屏蔽连续2次单击变成单击事件
					TimeFn = setTimeout(function() {
			            if (isLeaf === 'true' || isHotTab) {
			                that.markSelection($that);
			                
			                if (that.options.isClickToHide) {//点击不关闭
			                    that.setValue([item]);
			                    ReferFn.updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
			                    that.hide();
			                }
			
			            } else {
			                var target = $(e.target);
			                var clickImg = target.is('img') && target.hasClass('selected'); //点击树型参照  前面的小圆圈
			               
			                if (that.options.isNotLeafSelected && clickImg) { //对非叶子节点选择处理
			                    that.markSelection($that);
			                    if (that.options.isClickToHide) {
			                        that.setValue([item]);
			                        ReferFn.updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
			                        that.hide();
			                    }
			                    return;
			                }
			                var parents = [];
			                ReferFn.getParents(treeData, parents, item);
			                parents.push(item);
			
			                var nodes = that.getChildNode(treeData, item);
							viewHelper.getCustomizeTips=that.options.getCustomizeTips;
			                var data = _.extend({refTreeNavList: parents, refTreeNodeList: nodes}, viewHelper);
			
			                that.$el.find('.refer_list.ul_list2').remove();
			                that.$el.find('.refer_nav.navtree').remove();
			
			                that.$el.find('.refer_results').append(_.template(that.getTreeClassTpl())(data));
			                that.$el.find('.refer_results').append(_.template(that.getTreeNodeTpl())(data));
			                
			                //e.stopPropagation();//当前dom结果结构发生变化，阻止错误事件
							//阻止冒泡的兼容写法
						 	e = window.event||e;
						    if(document.all){  //只有ie识别
						        e.cancelBubble=true;
						    }else{
						        e.stopPropagation(); //当前dom结果结构发生变化，阻止错误事件
						    }
			                that.$el.find('.navtree').show();
			                that.$el.find('.ul_list1').hide();
			                that.$el.find('.ul_list2').show();
			
			                that.addScroll();
							//如果navtree树的ul过长，则隐藏前面的，显示后面的
							var liWidth = 0;
							var allLi = that.$el.find('.refer_nav.navtree li');
							for(var i=allLi.length;i>0;i--){
								liWidth+=allLi.eq(i-1).width();
								if(liWidth>600){
									allLi.eq(i-1).hide();
								}
							}
			            }
				    }, 200);
					
		        }).on('mouseenter', '.refer_list li',function () {
		                var $that = $(this);
						var ctx=that.options.ctx;
		                $that.find('img.folder').attr("src", ""+ctx+"/static/images/canzhao_2.png");
		                $that.find('img.selected').attr("src", ""+ctx+"/static/images/danxuan_2.png");
		            }).on('mouseleave', '.refer_list li', function () {
		                var $that = $(this);
						var ctx=that.options.ctx;
		                $that.find('img.folder').attr("src", ""+ctx+"/static/images/canzhao_1.png");
		                $that.find('img.selected').attr("src", ""+ctx+"/static/images/danxuan_1.png");
		            }).on('dblclick', '.refer_list li', function () {
						clearTimeout(TimeFn);
		            });
			},
			/**
			 * 多选树
			 */
			referbindMultiTreeEvent : function (referModel) {
				var ReferFn=$.Refer.exports;
				var that = referModel;
				
				that.$el.find('.refer_results2').append(_.template(that.getTreeListTpl())({}));

		        that.$el.find('.refer_results2').on('click', '.refer_nav li', function (e,sysnDataFlag) {
		            var $that = $(this);
		            var isRefresh = $that.hasClass('ref_class_refresh');
		            var selectedData = $that.hasClass('selectedData');
		            var searchInput = $that.hasClass('searchInput');
		            if(searchInput){
		            	$that.find("input[type='text']").focus();
		            	return;
		            }
		            if (isRefresh || selectedData) {
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
					    that.loadTreeData();
		            }else if("2" === clickedIndex && selectData.length >= 0){
                        that.options.isClearData && (selectData = []) && (that.values = []);
		            	var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
		            	treeObj.checkAllNodes(false);
		            	$.grep(selectData, function(e){
		            		var node = treeObj.getNodeByParam("refpk", e.refpk, null);
		            		treeObj.checkNode(node, true, false, false);
						})
		            	that.$el.find(".msgtype-table").bootstrapTable('load', {data: selectData});
		            }
		            e.stopPropagation();//当前dom结果结构发生变化，阻止错误事件

		            that.$el.find('.ul_list' + currentIndex).hide();
		            that.$el.find('.ul_list' + clickedIndex).show();
		            that.$el.find('.nav_list' + clickedIndex).toggleClass('action');

		            that.addScroll();
		            that.$el.find('.ul_list' + clickedIndex).siblings(':not(".refer_nav")').hide();
		        });
				var TimeFn=null;
		        var beforeCheck=function (treeId, treeNode) {
		            if (treeNode.isParent) {
		                var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
		               
		                treeObj.checkNode(treeNode, !treeNode.checked, false, false); //不触发级联子节点
		                
		                nodeClick(event, treeId, treeNode);//手动checknode
		            }
		            return !treeNode.isParent;
		        }

		        var nodeClick=function (event, treeId, treeNode) {
		            var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
		            var nodes = treeObj.getCheckedNodes(true);
		            that.$el.find(".msgtype-table").bootstrapTable('load', {data: nodes});
		            if (!treeNode.checked) {
		                that.unSelections(treeNode.refpk);
		            }
		            that.updateSelectedTab();
		        }

		        var nodeDblClick = function (event, treeId, treeNode) {
		            if (!treeNode) {
		                var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
		                var tId = $(event.target).closest('li[treenode]').attr('id');
		                treeNode = treeObj.getNodeByTId(tId);
		               
		                treeObj.checkNode(treeNode, !treeNode.checked, true, false); //触发级联子节点
		                
		                nodeClick(event, treeId, treeNode);//手动checknode
		            }
					clearTimeout(TimeFn);
		        }
				//单击事件 展开
		        var onClick = function (event, treeId, treeNode) {
		            clearTimeout(TimeFn); //setTimeout用来屏蔽连续2次单击变成单击事件
					TimeFn = setTimeout(function() {
							var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
							zTree.expandNode(treeNode);
				        }, 200);
		        }

		        var setting = {
		                data: {
		                    key: {
		                        name: 'refname'
		                    },
		                    simpleData: {
		                        enable: true,
		                        idKey: "id",
		                        pIdKey: "pid"
		                    }
		                },
		                check: {
		                    enable: true,
		                    chkStyle: "checkbox",
		                    chkboxType: { "Y": "s", "N": "s" }
		                },
		                callback: {
		                    beforeCheck: beforeCheck,
		                    onCheck: nodeClick,
		                    onDblClick: nodeDblClick,
							onClick: onClick
		                },
		                view: {
		                    selectedMulti: false,
							dblClickExpand: false,
							showIcon: false
		                }
		            };
		        
		        var operateEvents = {
		            'click .remove': function (e, value, row, index) {
		                e.stopPropagation();
		                var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
		                var node = treeObj.getNodeByParam("refpk", value, null);
		                treeObj.checkNode(node, false, false, true);
		                that.$el.find(".msgtype-table").bootstrapTable('remove', {
		                    field: 'id',
		                    values: [row.id]
		                });
		                that.updateSelectedTab();
		            }
		        };

		        var cols = that.buildTableColumn(false);
		        cols.unshift({
		            field: 'refpk',
		            title: '<span class="remove_all">清空</span>',
		            events: operateEvents,
		            formatter: ReferFn.operateFormatter
		        });

		        that.$el.find(".msgtype-table").bootstrapTable({
		            columns: cols
		        });
		        that.addScroll(true);

		        that.$el.find(".msgtype-table thead").on('click', '.remove_all', function () {
		            var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
		            treeObj.checkAllNodes(false);
					treeObj.cancelSelectedNode(); //清除所有复选框
		            that.$el.find(".msgtype-table").bootstrapTable('load', {data: []});
		            that.updateSelectedTab();
		        });

//		        that.$el.find('.refer_results2').on('click', '.refer_list2 li', function () {
//		            var refpk = $(this).attr('pk');
//		            var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
//		            if (treeObj) {
//		                var node = treeObj.getNodeByParam("refpk", refpk, null);
//		                treeObj.checkNode(node, false, false, true);
//		            }
//		            that.updateSelectedTab();
//		        });
		        that.$el.find('.refer_results2').on('click', '.ul_list1 li', function () {
					var ischecked = $(this).find("input[type=checkbox]").is(':checked');
					var refpk = $(this).attr('pk');
	            	var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
					if(ischecked){
						$(this).find("input[type=checkbox]").attr("class","selected");
						$(this).find("label").addClass("is-checked");
						if (treeObj) {
		            		var node = treeObj.getNodeByParam("refpk", refpk, null);
		            		treeObj.checkNode(node, true, false, true);
		            	}
					}else{
						$(this).find("input[type=checkbox]").attr("class","");
						$(this).find("label").removeClass("is-checked");
		            	if (treeObj) {
		            		var node = treeObj.getNodeByParam("refpk", refpk, null);
		            		treeObj.checkNode(node, false, false, true);
		            	}
					}
					that.updateSelectedTab();
		        });
		        //点击搜索图标和搜索全部
		        that.$el.find('.refer_results2').on('click', '.refer_nav li .pic-search,.refer_nav li .btn-search', function (e) {
		        	var searchContent = that.$el.find('.refer_nav li.searchInput input[type="text"]').val();
		        	//that.searchFlag = true;
		        	
		        	var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
                 	var treeNodeRoot = treeObj.getNodes();
                 	var treeNodes = treeObj.transformToArray(treeNodeRoot); 
                 	for(var i=0;i<treeNodes.length;i++){
             			treeNodes[i].name = treeNodes[i].refname.replace('<span style="color:#2C9AEF;margin-right: 0px;">',"").replace("</span>",""); 
             			var labelVal = treeNodes[i].name;
             			var inputVal= searchContent.split(' ');
             			var lastVal = "";
             			var treeflag = false;
             			treeObj.setting.view.nameIsHTML = true;
    					for(var j=0;j<inputVal.length;j++){
    						if(inputVal.length<2){
	    						if(labelVal.toLowerCase().indexOf(inputVal[j].toLowerCase())>=0){
	    							treeflag = true;
	    							var reg = new RegExp(inputVal[j],"i");
	    							if(treeNodes[j].refname.indexOf(inputVal[j].toLowerCase())>=0){
	    								lastVal=inputVal[j].toLowerCase();
	    							}else{
	    								lastVal=inputVal[j].toUpperCase();
	    							}
	    							labelVal = labelVal.replace(reg,'<span style="color:#2C9AEF;margin-right: 0px;">'+lastVal+'</span>');
	    						}
    						}
    					}
             			treeNodes[i].refname = labelVal; 
             			treeObj.updateNode(treeNodes[i]);
             			treeflag && treeObj.expandNode(treeNodes[i].getParentNode(), true, false, true);
                 	}
		        });
		        that.$el.find('.ref_class_refresh').on('click', 'span', function () {
		            var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
					var nodes;
					
					if(zTree){
						nodes = zTree.getCheckedNodes(true);
					}
		           
		            var refreshCache = true; //分类缓存清空
		            
					that.showLoading();
		            that.ajax({
						url: that.getListUrl(),
		                type: "post",
		                data: that.getRefParam(refreshCache),
		                traditional: true,
		                async: true,
		                dataType: "json",
		                success: function (data) {
		                    var treeDom = $('#' + that.getTreeID());
						 	that.options.classData = data.data;
		                 	that.getRoot();
		                 	$.fn.zTree.init(treeDom, setting, that.options.classData);
							if (!that.options.isNotLeafSelected) { //非叶子节点是否可选，false时让复选框不显示
								var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
								var treeNodeRoot = treeObj.getNodes();
								var treeNodes = treeObj.transformToArray(treeNodeRoot); 
								for(var i=0;i<treeNodes.length;i++){
									if(!treeNodes[i].isLeaf && treeNodes[i].isParent){
										treeNodes[i].nocheck = true; //当是父节点  复选框不让显示
										treeObj.updateNode(treeNodes[i]);
									}
								}
							}
		                    if (nodes && nodes.length > 0) {
		                        zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
		                        $.each(nodes, function (i, val) {
		                            var node = zTree.getNodeByParam("id", val.id, null);
		                            if (node) {
		                                zTree.checkNode(node, true, true, true);
		                                var pnode = node.getParentNode();
		                                if (pnode) {
		                                    zTree.expandNode(pnode, true, false, true);
		                                }
		                            }
		                        });
		                    }
		                },
						complete: function () {
				                that.hideLoading();
				            }
		            });
					//刷新常用数据
					if (that.$el.find('.refer_nav li.nav_list1').hasClass('action')) {
						that.refreshHotCache = true;
			            that.refreshHotData(true);
					}
		        });
			},
			/**
			 * ztree样式
			 */
			referbindzTreeEvent : function (referModel) {
				var ReferFn=$.Refer.exports;
				var that = referModel;
				
		        that.$el.find('.refer_results2').append(_.template(that.getzTreeTpl())({}));

		        that.$el.find('.refer_results2').on('click', '.refer_nav li', function (e) {
		            var $that = $(this);
		            var isRefresh = $that.hasClass('ref_class_refresh');
		            var selectedData = $that.hasClass('selectedData');
		            var searchInput = $that.hasClass('searchInput');
		            if(searchInput){
		            	$that.find("input[type='text']").focus();
		            	return;
		            }
		            if (isRefresh || selectedData) {
		                return;
		            }
		            that.selectedTab = $that;
		            var currentIndex = that.$el.find('.refer_nav li.action').toggleClass('action').attr('index');
		            var clickedIndex = $that.attr('index');
		            var condition = $that.attr('condition');

		            if ("1" === clickedIndex) {
		                that.refreshHotData(true);
		            } else if ("2" === clickedIndex && (!that.$el.find(".ztree").hasClass('scrollbar-dynamic'))) {
		                that.ajax({
							url: that.getListUrl(),
		                    type: "post",
		                    data: that.getRefParam(),
		                    traditional: true,
		                    async: false,
		                    dataType: "json",
		                    success: function (data) {
		                        var treeDom = $('#' + that.getTreeID());
		                        that.options.classData = data.data;
		                        that.getRoot();
		                        $.fn.zTree.init(treeDom, setting, that.options.classData);
		                        that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
		                        that.$el.find(".ztree").addClass('scrollbar-dynamic').scrollbar();
		                    }
		                });

		            }
		            
		            e.stopPropagation();//当前dom结果结构发生变化，阻止错误事件

		            that.$el.find('.ul_list' + currentIndex).hide();
		            that.$el.find('.ul_list' + clickedIndex).show();
		            that.$el.find('.nav_list' + clickedIndex).toggleClass('action');

		            that.addScroll();
		            that.$el.find('.ul_list' + clickedIndex).siblings(':not(".refer_nav")').hide();
		        });

		        var zTreeBeforeClick=function (treeId, treeNode, clickFlag) {
			        	//对非叶子节点选择处理
			        	if(!that.options.isNotLeafSelected){
			        		//return !treeNode.isParent;//当是父节点 返回false 不让选取
			        	}else{
			        		return true;
			        	}
		        	};
		        var TimeFn=null;
		        var nodeClick=function (event, treeId, treeNode) {
					//单击展开树
					clearTimeout(TimeFn); //setTimeout用来屏蔽连续2次单击变成单击事件
					TimeFn = setTimeout(function() {
						var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
						zTree.expandNode(treeNode);
			        }, 200);
					//叶子节点(子节点)选中
					if (!treeNode.isParent) {
						var item = {};
						item.refpk = treeNode.refpk;
						item.refname = treeNode.name || treeNode.refname;
						item.refcode = treeNode.refcode;
						that.setValue([item]);
						ReferFn.updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
						that.hide();
					}
		         }
				//ztree点击前面的小圆圈选中数据
		        var nodeCheck=function (event, treeId, treeNode) {
					if(that.options.isNotLeafSelected && treeNode.isParent){ 
				         var item={};
				         item.refpk =   treeNode.refpk;
				         item.refname = treeNode.name || treeNode.refname;
				         item.refcode = treeNode.refcode;
			            that.setValue([item]);
			            ReferFn.updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
			            that.hide();
					}else if (!treeNode.isParent) {
							var item = {};
							item.refpk = treeNode.refpk;
							item.refname = treeNode.name || treeNode.refname;
							item.refcode = treeNode.refcode;
							that.setValue([item]);
							ReferFn.updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
							that.hide();
						}
		        }
				//双击事件
				var nodeDblClick = function (event, treeId, treeNode) {
					clearTimeout(TimeFn);
		    	}
		        var setting = {
		                data: {
		                    key: {
		                        name: 'refname',
		                        title:'name'
		                    },
		                    simpleData: {
		                        enable: true,
		                        idKey: "id",
		                        pIdKey: "pid"
		                    }
		                },
						callback: {
			                	beforeClick: zTreeBeforeClick,
								onDblClick: nodeDblClick,
			                    onClick: nodeClick,
								onCheck:nodeCheck
			                },
						check: {
		                    enable: true,
		                    chkStyle: "radio",
		                    chkboxType: { "Y": "s", "N": "s" }
		                },
						view: {
							nameIsHTML: true,
							showIcon: false,
							dblClickExpand: false //屏蔽双击展开事件
		                }
		            };
		        
		        that.addScroll(true);
				//点击常用数据
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
					
//		            var refpk = $(this).attr('pk');
//		            var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
//		            if (treeObj) {
//		                var node = treeObj.getNodeByParam("refpk", refpk, null);
//		                treeObj.checkNode(node, false, false, true);
//		            }
//		            that.updateSelectedTab();
		        });
		        //点击搜索图标和搜索全部
		        that.$el.find('.refer_results2').on('click', '.refer_nav li .pic-search,.refer_nav li .btn-search', function (e) {
		        	var searchContent = that.$el.find('.refer_nav li.searchInput input[type="text"]').val();
		        	//that.searchFlag = true;
		        	
		        	var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
                 	var treeNodeRoot = treeObj.getNodes();
                 	var treeNodes = treeObj.transformToArray(treeNodeRoot); 
                 	for(var i=0;i<treeNodes.length;i++){
             			treeNodes[i].name = treeNodes[i].refname.replace('<span style="color:#2C9AEF;margin-right: 0px;">',"").replace("</span>",""); 
             			var labelVal = treeNodes[i].name;
             			var inputVal= searchContent.split(' ');
             			var lastVal = "";
             			treeObj.setting.view.nameIsHTML = true;
             			var exp ="";
             			var treeflag = false;
    					for(var j=0;j<inputVal.length;j++){
//    						if(j==inputVal.length-1){
//    							exp += inputVal[j];
//    						}else{
//    							exp += (inputVal[j] + "|");
//    						}
    						if(inputVal.length<2){
    							if(labelVal.toLowerCase().indexOf(inputVal[j].toLowerCase())>=0){
    								treeflag = true;
    								var reg = new RegExp(inputVal[j],"i");
    								if(treeNodes[j].refname.indexOf(inputVal[j].toLowerCase())>=0){
    									lastVal=inputVal[j].toLowerCase();
    								}else{
    									lastVal=inputVal[j].toUpperCase();
    								}
    								labelVal = labelVal.replace(reg,'<span style="color:#2C9AEF;margin-right: 0px;">'+lastVal+'</span>');
    							}
    						}	
    					}
    					//"测试2A3C".replace(/(测|2|c|a)/g,"span");
    					//var expfat = "/(" + exp + ")/g"; //正则
    					//labelVal = labelVal.replace(expfat,"span");
             			treeNodes[i].refname = labelVal; 
             			treeObj.updateNode(treeNodes[i]);
             			treeflag && treeObj.expandNode(treeNodes[i].getParentNode(), true, false, true);
                 	}
		        });
		        that.$el.find('.ref_class_refresh').on('click', 'span', function () {
		            var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
					var nodes;
					
					if(zTree){
						nodes = zTree.getCheckedNodes(true);
					}
		            var refreshCache = true; //分类缓存清空
		            
					that.showLoading();
		            that.ajax({
						url: that.getListUrl(),
		                type: "post",
		                data: that.getRefParam(refreshCache),
		                traditional: true,
		                async: false,
		                dataType: "json",
		                success: function (data) {
		                    var treeDom = $('#' + that.getTreeID());
						 	that.options.classData = data.data;
		                 	that.getRoot();
		                 	//setting.view.nameIsHTML = true;
		                 	$.fn.zTree.init(treeDom, setting, that.options.classData);
		                 	
							if (!that.options.isNotLeafSelected) { //设置非叶子节点不可选时 隐藏前面的小圆圈
								var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
								var treeNodeRoot = treeObj.getNodes();
								var treeNodes = treeObj.transformToArray(treeNodeRoot); 
								for(var i=0;i<treeNodes.length;i++){
									if(!treeNodes[i].isLeaf && treeNodes[i].isParent){
										treeNodes[i].nocheck = true; //当是父节点  复选框不让显示
										treeObj.updateNode(treeNodes[i]);
									}
								}
						    }
		                },
						complete: function () {
				                that.hideLoading();
				            }
		            });
					//刷新常用数据
					if (that.$el.find('.refer_nav li.nav_list1').hasClass('action')) {
						that.refreshHotCache = true;
			            that.refreshHotData(true);
					}
		        });
			}
		}
		$.fn.treeViewModel = treeViewModel;   
		return treeViewModel;
//});
}($)
