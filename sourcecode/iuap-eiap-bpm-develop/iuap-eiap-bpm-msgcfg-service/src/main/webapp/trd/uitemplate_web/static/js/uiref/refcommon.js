/**
 * 列表类型参照
 */
+ function($) {
//define([], function() {
		var commonViewModel = {
			referbindListEvent : function (referModel) {
				var ReferFn=$.Refer.exports;
				var that = referModel;
				that.$el.find('.refer_results').on('click', '.refer_nav li', function (e,sysnDataFlag) {
		            var $that = $(this);
		            var searchInput = $that.hasClass('searchInput');
		            if(searchInput){
		            	$that.find("input[type='text']").focus();
		            	return;
		            }
		            var selectedData = $that.hasClass('selectedData');//deploy li skip
		            if ($that.hasClass('ref_class_deploy') || $that.hasClass('ref_class_refresh') || selectedData) {
						var allClaas = that.options.classData;
				        var baseTop = ReferFn.findPos(that.$el.find('.refer_nav.clx')[0], that).y2;
				        var lastClassItem = -1;
				        var lastClassItemWidth = -1;
				        var replaceIndex = -1;
				
				        $(allClaas).each(function (i, val) {//定位第一列最后一个Item
				            var $li = that.$el.find('li[condition=' + val.id + ']');
				            var top = ReferFn.findPos($li[0], that).y2;
				            //if (top - baseTop === 25) {
				            if (top - baseTop === 34) {
				                lastClassItem = i - 1;
				                lastClassItemWidth = $li.width();
				                return false;
				            }
							//最后一个Item在第一列
							if(i===allClaas.length-1){
				            	if (top - baseTop === 0) {
									lastClassItem = i;
									lastClassItemWidth = $li.width();
									return false;
				            	}
				            }
				        });
						//第一列最后一个Item的索引值
				        var lastClassIndex = -1;
						lastClassIndex = lastClassItem;
						that.$el.find('.refer_nav.clx li').each(function (){
							if($(this).attr("index") > lastClassIndex+3){
								$(this).addClass('classStyleDocItem');
							}
						});
		                return;
		            }
		            that.selectedTab = $that;
		            
		            var hasfold = that.$el.find(".ref_class_deploy").hasClass('ref_class_fold');//分类模式切换
		            if (hasfold) {
		                that.$el.find('.ref_class_deploy').toggleClass('ref_class_fold');
		                that.$el.find('.refer_nav.tab').css({overflow: 'hidden', height: '34px'}); //height: '25px' 改为34px
		            }

		            var currentIndex = that.$el.find('.refer_nav li.action').toggleClass('action').attr('index');
		            var clickedIndex = $that.attr('index');
		            var condition = $that.attr('condition');
		            that.pageDefault=condition;
		            var refreshCache = false;
		            var classItems = $.grep(that.options.classData, function (e) {
		                return condition === e.id;
		            });
		            if (classItems && classItems.length === 1 && classItems[0].isRefreshCache) {
		                refreshCache = true;
		            }

		            if ("1" === clickedIndex) {
		                that.refreshHotData(true);
		            } else if (refreshCache || (that.$el.find('.ul_list' + clickedIndex).length === 0) || ("2" === clickedIndex && that.$el.find('.ul_list' + clickedIndex).length === 0)) {
		                that.loadData(refreshCache);
		            }
		            //多选input框里有默认值时 参照数据同步选中默认值
		            if(that.options.isMultiSelectedEnabled){
		            	var selectData = that.getSelections(null,sysnDataFlag);
		            	that.$el.find('ul.ul_list2 li').each(function () {
		                    var $this = $(this);
		                    var pk = $this.attr('pk');
		                    $.each(selectData, function(e){
		                    	if ($(this)[0].refpk === pk) {
	                    			$this.find('input').attr("checked", "checked");
	                    			$this.find('input').prop("checked", "checked");
	                    			$this.find("input[type=checkbox]").attr("class","selected");
	                    			$this.find("label").addClass("is-checked");
	                    			return false;
		                    	}else{
	                    			$this.find('input').removeAttr("checked");
	                    			$this.find("input[type=checkbox]").attr("class","");
	                    			$this.find("label").removeClass("is-checked");
	                    		}
							})
		                });
		            }
		            e.stopPropagation();//当前dom结果结构发生变化，阻止错误事件

					that.$el.find('.refer_list').hide(); //档案类让其他的隐藏
		            that.$el.find('.ul_list' + currentIndex).hide();
		            that.$el.find('.ul_list' + clickedIndex).show();
		            var newClassIndex = that.reBuilderClassNav(condition);
		            if (-1 !== newClassIndex) {//更新Data index
		                //that.$el.find('.ul_list' + clickedIndex).addClass('ul_list-1').removeClass('ul_list' + clickedIndex);
		                that.$el.find('.ul_list' + (newClassIndex + 3)).addClass('ul_list' + clickedIndex).removeClass('ul_list' + (newClassIndex + 3));
		                //that.$el.find('.ul_list-1').addClass('ul_list' + (newClassIndex + 3)).removeClass('ul_list-1');
		                clickedIndex = (newClassIndex + 3);
		            }

		            //that.$el.find('.nav_list' + clickedIndex).toggleClass('action');
		            that.$el.find('.nav_list' + clickedIndex).addClass('action');

		            that.addScroll();
		        });
				//点击搜索图标和搜索全部
		        that.$el.find('.refer_results').on('click', '.refer_nav li .pic-search,.refer_nav li .btn-search', function (e) {
		        	var searchContent = that.$el.find('.refer_nav li.searchInput input[type="text"]').val();
		        	that.searchFlag = true;
		        	that.loadData(true,searchContent);
		        });
		        if (!that.options.isMultiSelectedEnabled) {
		            that.$el.find('.refer_results').on('click', '.refer_list li', function () {
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
		        } else {
		            that.$el.find('.refer_results').on('click', '.refer_list:not(.ul_listselectedData) li', function (e) {
						var unSelectedPK = $(this).attr('pk');
						var isChecked = $(this).find("input[type='checkbox']").is(':checked');
//						var unSelectedPK = $(this).closest('li').attr('pk');
//						var isChecked = $(this).is(':checked');
		                //autocompleteVal
		                var autoVal = that.autocompleteVal;
		                if (autoVal && autoVal.refpk === unSelectedPK) {
		                    that.autocompleteVal = null;
		                }
		                //allData
		                that.$el.find('ul.ul_list2 li').each(function () {
		                    var $this = $(this);
		                    var pk = $this.attr('pk');
		                    if (unSelectedPK === pk) {
								//$this.find('input').attr("checked", isChecked);
		                        //$this.find('input').prop("checked", isChecked);
								if(isChecked){
		                        	$this.find('input').attr("checked", "checked");
		                        	$this.find('input').prop("checked", "checked");
									$this.find("input[type=checkbox]").attr("class","selected");
									$this.find("label").addClass("is-checked");
								}else{
									$this.find('input').removeAttr("checked");
									$this.find("input[type=checkbox]").attr("class","");
									$this.find("label").removeClass("is-checked");
								}
		                    }
		                });
		                //docClass
		                that.$el.find('ul.refer_list li').each(function () {
		                    var $this = $(this);
		                    var pk = $this.attr('pk');
		                    if (unSelectedPK === pk) {
		                        //$this.find('input').attr("checked", isChecked);
		                        //$this.find('input').prop("checked", isChecked);
								if(isChecked){
									$this.find('input').attr("checked", "checked");
		                        	$this.find('input').prop("checked", "checked");
									$this.find("input[type=checkbox]").attr("class","selected");
									$this.find("label").addClass("is-checked");
								}else{
									$this.find('input').removeAttr("checked");
									$this.find("input[type=checkbox]").attr("class","");
									$this.find("label").removeClass("is-checked");
								}
		                    }
		                });
		                that.updateSelectedTab();
		            });
		        }
		        that.$el.find('.ref_class_deploy').on('click', 'span', function () {
		            var hasfold = that.$el.find(".ref_class_deploy").hasClass('ref_class_fold');
		            that.$el.find(".ref_class_deploy").toggleClass('ref_class_fold');

		            var currentIndex = that.$el.find('.refer_nav li.action').attr('index');
		            if (!currentIndex) {
		                currentIndex = 1;
		            }

		            if (!hasfold) {
		                that.$el.find('.refer_nav.tab').css({overflow: 'visible', height: '34px'}); //height: '214px'改为120px
		                that.$el.find('.ul_list' + currentIndex).hide();
						that.$el.find('.refer_list').hide(); //档案类让其他的隐藏
		            } else {
		                that.$el.find('.refer_nav.tab').css({overflow: 'hidden', height: '34px'}); //height: '25px'改为34px
		                that.$el.find('.ul_list' + currentIndex).show();
		            }
		        });

		        that.$el.find('.ref_class_refresh').on('click', 'span', function () {
		            var refreshCache = true;
		            var currentIndex = that.$el.find('.refer_nav li.action').attr('index');
		            if ("1" === currentIndex) {
		                return;
		            }
		            if (that.isList()) {
		                that.loadData(refreshCache);
		            } else {
		                //update
		                that.$el.find('.refer_nav.tab li.classItem').remove();
		                that.loadClassData(refreshCache);
						
						//mark refreshCache
		                if (refreshCache) {
		                    $.each(that.options.classData, function (i, v) {
		                        v.isRefreshCache = true;
		                    });
		                } else {
		                    $.each(that.options.classData, function (i, v) {
		                        v.isRefreshCache = false;
		                    });
		                }
						
						viewHelper.getCustomizeTips=that.options.getCustomizeTips;
						var data = _.extend({refClassList: that.options.classData},viewHelper);
		               
					    that.$el.find('.refer_nav.tab').append(_.template(that.getClassItemTpl())(data));
						
		                //current info
		                if (that.selectedTab) {
		                    var $that = that.selectedTab;
		                    var clickedIndex = $that.attr('index');
		                    var condition = $that.attr('condition');
		                    //selected class
		                    that.$el.find('.nav_list' + clickedIndex).trigger('click',refreshCache);

		                    var classItems = $.grep(that.options.classData, function (e) {
		                        return condition === e.id;
		                    });
		                    if (classItems && classItems.length === 1) {
		                        classItems[0].isRefreshCache = false;
		                    }
		                }
		            }
					//刷新常用数据
					if (that.$el.find('.refer_nav li.nav_list1').hasClass('action')) {
						that.refreshHotCache = true;
			            that.refreshHotData(true);
					}
		        });
			}
			
		}
		$.fn.commonViewModel = commonViewModel;   
		return commonViewModel;
//});
}($)
