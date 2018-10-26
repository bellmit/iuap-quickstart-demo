define("form/formlayout", [
       "knockout",
       "form/form-plugin", 
       "form/tplutil", 
       "form/componentmodel", 
       "form/utils",
       "css!/uitemplate_web/static/trd/bootstrap-table-1.10/bootstrap-table.css",
       "/uitemplate_web/static/trd/bootstrap-table-1.10/bootstrap-table.js",
       "css!/uitemplate_web/static/trd/zTree_v3/css/zTreeStyle/zTreeStyleDesign.css",
       "../../../trd/zTree_v3/js/jquery.ztree.all-3.5.min"],
                           function(ko) {
	window.ko = ko;
	
	var l = require("form/form-plugin"),
		b = require("form/tplutil"),
		a = require("form/componentmodel"),
		u = require("form/utils"),
		z = require("/uitemplate_web/static/trd/bootstrap-table-1.10/bootstrap-table.js"),
		c = {
			currentDrag: null,
			currentEditor: null,
			formId: null,
			layoutId: null,
			isSameName: !1,
			isShowIntro: !1
		};
	
	// 关闭窗口时如果有未保存时的提示
	c.beforeunload = function() {
		window.onbeforeunload = function() {
			var browserType = c.myBrowser();
			if(browserType=="IE"){
				if ($("#formContent").html() != c.bodyHtml && !c.pk_temp && $('#sortdialog').css("display")=="none") return "您修改的数据尚未保存";
			}else{
				if ($("#formContent").html() != c.bodyHtml && !c.pk_temp) return "您修改的数据尚未保存";
			}
		}
	};
	// 通过接口获取表单layout数据
	c.loadFormLayout = function(formId) {
			if(formId == ""){//打开一个空的表单
				c.componentDraggableEvents();
				// 重新计算高度
				c.calculateHeight();
				c.bodyHtml = $("#formContent").html()
				$(window).resize();
				$(".j_edit_tab[edit-type='businessObj']").click();
				$(".j_edit_tab[edit-type='formwidget']").click();
				$(".header .btnSave").show(); //显示保存按钮
				c.showFormGuideImg(true);//显示引导图
				return;
			}
			//打开一个已保存的表单设计器，进行查看\编辑操作
			c.formId = formId;
			$.ajaxSetup({cache:false});
			$.ajax({
				type: "GET",
				data: {
					pk_temp: formId
				},
				dataType: "json",
	            async: false,
				url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplate",
				success: function(data) {
					if(!data || data==null){
						return;
					}
					if (data.message) {
						u.alert(data.message)
						return
					}
					//获取url中temptype信息
					var temptype = (function () {
						var search = location.search;
						var type = '';
						if (!search) {
							return ""
						}
						search = search.slice(1).split('&')
						$.each(search, function (i, v){
							if (~v.indexOf('temptype=')) {
								type = v.split('=')[1];
								return false;
							}
						})
						return type;
					})();
					if(!(data.form.sysflag=="Y" && (data.form.temptype=="user" || temptype=="user"))){
						$(".header .btnSave").show(); //显示保存按钮
					}
					$(".j_edit_tab[edit-type='businessObj']").click();
					$(".j_edit_tab[edit-type='formwidget']").click();
					c.pk_metadata = data.form.pkMetadata;
					c.formId = data.form.pk_temp;
					c.tenant_id = data.form.tenant_id;
					c.sys_pk_temp = data.form.sys_pk_temp;
					c.sysflag = data.form.sysflag;
					c.temptype = data.form.temptype;
					// 在这里调用解析layout
					null != data.formLayout && /*(c.layoutId = data.formLayout.id, */c.analyseLayout(data.formLayout.layoutDetail)//);
					//设置表单的标题，描述信息，流程定义
					c.analyseTemplateInfo(data.form);
					// 重新启动拖拽时间
					c.componentDraggableEvents();
					// 重新计算高度
					c.calculateHeight();
					c.bodyHtml = $("#formContent").html()
				},
				error: function() {}
			})
//		}
		$(window).resize()
	};
	// 把字符串转成json
	c.analyseLayout = function(a) {
		a instanceof Object ? b = a : b = JSON.parse(a);
		b.layoutDetail.length==0?c.showFormGuideImg(true):c.showFormGuideImg(false);
		a instanceof Object ? a : a = JSON.parse(a);
		null != a && "" != a && ($("#widget-control").html(""), c.analyseComponent(a, $("#widget-control")))
	};
	//是否显示拖拽表单的引导图
	c.showFormGuideImg = function(a){
		if(a){
			//显示引导图
			//$("#widget-control").addClass("hide");
			$("#widget-control-noContent").removeClass("hide");
			$(".j_edit_tab[edit-type='businessObj']").click();
			$(".j_edit_tab[edit-type='formwidget']").click();
			$("#widget-control").css("border","none");
		}else{
			//隐藏引导图
			//$("#widget-control").removeClass("hide");
			$("#widget-control-noContent").addClass("hide");
			$("#widget-control").css("border","1px solid #ddd");
		}
	};
	//右边【表单设置】页签信息回设
	c.analyseTemplateInfo = function(form){
		var name = form.name;
		var describe = form.describe; 
		var processName = form.processDefName?form.processDefName:form.processDefId?form.processDefId:"未绑定流程";
		c.processDefinionId = form.processDefId?form.processDefId:"";
		c.processDefinionName = form.processDefName?form.processDefName:form.processDefId;
		//设计态表单左上角显示表单名称
		//$(".header-form-name").text(name);
		//设计态显示流程定义
		$(".header-workflow-name").text(processName);
		$("#name-form").val(name);
		$(".form-name").val(name);
		$("#description-form").html(describe);
		$(".form-description").text(describe);
		var g = "",processDefId="";
		$("a.formauth").parent().removeClass("hide");
		if(form.processDefinitions){
			c.processDefinitons = form.processDefinitions;
		}
	}
	
	c.genTd = function(view,billitem,activitis,trindex){
		var fieldId = billitem.fieldId;
		if(!fieldId)
			return view;
		var fieldname = billitem.title;
		if(!fieldname)
			return view;
		if(!activitis)
			return view;
		view += '<tr role="row" data-index='+trindex+'>';
		trindex++;
		view += '<td role="rowcell" title="">';
		view += '<div style="width:80px;" value="'+fieldId+'">'+fieldname+'</div>';
		view += '</td>';
		for(var k=0;k<activitis.length;k++){
	   		view += '<td role="rowcell" title="">';
			view+='<select>';
			view +='<option value="0">隐藏</option>';
			view +='<option selected="selected" value="1">查看</option>';
			view +='<option value="2">编辑</option>'	;	
			view+='</select>';
			view += '</td>';
		}
		view += '</tr>';	
		return view;
	}
	
	// 把json解析成组件
	c.analyseComponent = function(a, b) {
		var f="";
		if(a.componentKey=="Form" || a.componentKey=="TableLayout"){
			f = "TableLayout";
		}else if(a.componentKey=="Table" || a.componentKey=="Grid" || a.componentKey=="DataTable"){
			f = "DataTable";
		}else if(a.componentKey=="FormLabel"){
			f = "Label";
		}else{
			f = a.componentKey;
		}
		if (f) {
			var g = new window[f](a);
			    g.componentSetup.componentKey=a.componentKey;
			    if(typeof a.subFormId !="undefined"){
			    	g.componentSetup.subFormId=a.subFormId;
			    }
			var k = g.renderEditPreview(b);
			//统一添加描述的颜色
			b.find("div[id="+a.fieldId+"]").find(".widget-content .field-description").css("color",g.componentSetup.borderColor);
			// this.addComponentModel(g);
			if (("ColumnPanel" == f || "GroupTable" == f) && null != a.layoutDetail) for (f = 0; f < a.layoutDetail.length; f++){
			
				var g = a.layoutDetail[f],
					p = "",
					p = 1 == a.size ? b : $(k[f]);
				
				a.componentKey=="GroupTable" && (p = $(k[f]));
				a.componentKey=="ColumnPanel" && typeof a.columnkind!="undefined" && a.columnkind!="" && (p = $(k[f]));//针对一行一列
				// 这里递归
				c.analyseComponent(g, p)
			}
			//控件是否显示及写入其他节点信息
			a.layoutDetail && a.layoutDetail.each(function(e){
				e.layoutDetail && e.layoutDetail.each(function(m){
					m.isDisplay==false && b.find("div[id="+m.fieldId+"]").addClass("isNotdisplayCtl");
					m.isLabelDisplay==false && b.find("div[id="+m.fieldId+"]").addClass("isLabelNotdisplayCtl");
					m.itemId && m.itemId!='' && b.find("div[id="+m.fieldId+"]").attr("nodepk",m.itemId);
					m.itemCode && m.itemCode!='' && b.find("div[id="+m.fieldId+"]").attr("nodecode",m.itemCode);
					//m.fontStyle && m.fontStyle!='' && b.find("div[id="+m.fieldId+"]").attr("fontStyle",m.fontStyle);
				})
			});
		}
	};
	// 计算高度自适应布局
	c.calculateHeight = function() {
		var a = $(window).height(),
			c = $(window).width(),
			b = $(".form-head_js").height();
		$("#widget-control").attr("style", "min-height:" + (a - b - 115) + "px;");
		$("#form-preview").attr("style", "min-height:" + (a - 30) + "px;");
		$(".js_wrapperSize").css({
			width: c + "px",
			height: a - 60 + "px"
		});
		$(".js_wrapperConSize").css("height", $(window).height() - 60 + "px");
		var calwidth = $(window).width()-20;
		var leftwidth = calwidth*0.2;
		var centerwidth = calwidth*0.59;
		var rightwidth = calwidth*0.21;
		if(1418 > calwidth){
			$(".js_wrapperConSize").css("width", "1408px");
			$(".formEdit_left").css("width","280px");
			$(".formEdit_center").css("width","800px");
			$(".formEdit_right").css("width","308px");
		}else{
			$(".js_wrapperConSize").css("width", (calwidth+10)+"px");
			$(".formEdit_left").css("width",leftwidth+"px");
			$(".formEdit_center").css("width",(centerwidth)+"px");
			$(".formEdit_right").css("width",rightwidth+"px");
		}
	};
	
	// 编辑区事件绑定，包括各个部分点击时设置区的变化
	c.formEvents = function(a) {
		var e = this;
		// 表头部分的编辑
		$(document).on("click", ".form-head_js", function() {
			$(".j_edit_tab[edit-type='businessObj']").click();
			$(".j_edit_tab[edit-type='formwidget']").click();
		});
		$(document).on("change", ".childtableselect", function() {
			var browserType = c.myBrowser();
			if(browserType=="IE"){//兼容IE9浏览器
				var newctrltype=$(this).children('option:selected').val();//新选中的值 
				var index = $(this).children('option:selected').index();
				var alloptions = $(this).children();
				for (var i=0;i<alloptions.length;i++)
	    		{
					if($($(($(this).children())[i])[0]).val()==newctrltype){
						($(this).children())[i].setAttribute("selected","selected");
			    	}else{
			    		($(this).children())[i].removeAttribute("selected");
			    	}
	    		}
			}else{
				$(this).find("option[selected]").removeAttr("selected");
				var index = $(this).children('option:selected').index();
				$(this).find("option:eq("+index+")").attr("selected",true);
			}
		});
		// 表单编辑区--表单名称
		$('.form-head-l').hover(function(){
			this.children[0].removeAttribute("disabled");
			$("#form-head-l-name").removeClass("input-name-disabled");
		}, function(){
			$("#form-head-l-name").attr("disabled","true");
			$("#form-head-l-name").addClass("input-name-disabled");
		});
		// 字段
		$(document).on("click", ".field_js", function(e) {
			$(document).trigger("renderEditor", $(this));
			e.stopPropagation(); //阻止事件冒泡
		});
		// 分组
		$(document).on("click", ".fieldGroup_js", function(e) {
			$(document).trigger("renderEditor", $(this));
			e.stopPropagation(); //当前dom结果结构发生变化，阻止错误事件
		});
		//tableLayout表格
		$(document).on("click", ".table_layout_js", function(e) {
			$(document).trigger("renderEditor", $(this));
			e.stopPropagation(); 
		});
		// 表单空白区域
		$(document).on("click", "#widget-control", function(e) {
			$(".j_edit_tab[edit-type='businessObj']").click();
			if(typeof e.toElement.className != "undefined" && e.toElement.className.indexOf("j_datatableTitle")>0){
				$(".j_edit_tab[edit-type='widget']").click();
			}else{
				$(".j_edit_tab[edit-type='formwidget']").click();
			}
			e.stopPropagation(); //阻止事件冒泡
		});
		// 编辑字表按钮
		$(document).on("click", ".field_subform_js", function() {
			$(document).trigger("renderEditor", $(this).parents(".subform_js"));
			return false;
		});
		// 全局的renderEditor回调，各个组件都有自己的renderEditor，由这里统一分发
		$(document).off("renderEditor").on("renderEditor", function(a, cc,typeflag) {
			var d = $(cc).data("componentData");
			if (null != d) {
				if (0 == $(cc).parents("#form-preview").length){
					$(".table_layout_js").removeClass("field-active");
					$(".fieldGroup_js").removeClass("field-active");
					$(".field_js").removeClass("field-active");
					$(".subform_js").removeClass("field-active");
					$(".field_js").removeClass("monitor");
					$(cc).addClass("field-active");
					typeof d.options.isDisplay =="undefined" && typeof d.componentSetup.isDisplay!="boolean" && (d.componentSetup.isDisplay=true); //控件默认属性显示
					typeof d.options.isDisplay !="undefined" && d.options.isDisplay==true && (d.componentSetup.isDisplay=true); 
					typeof d.options.isDisplay !="undefined" && d.options.isDisplay==false && (d.componentSetup.isDisplay=false);
					typeof d.options.isLabelDisplay =="undefined" && typeof d.componentSetup.isLabelDisplay!="boolean" && (d.componentSetup.isLabelDisplay=true); //控件默认属性显示
					typeof d.options.isLabelDisplay !="undefined" && d.options.isLabelDisplay==true && (d.componentSetup.isLabelDisplay=true); 
					typeof d.options.isLabelDisplay !="undefined" && d.options.isLabelDisplay==false && (d.componentSetup.isLabelDisplay=false);
					d.options.titleLayout =="" && (d.componentSetup.titleLayout="");
					d.options.isDisplay && (d.componentSetup.isDisplay=d.options.isDisplay);
					d.options.isLabelDisplay && (d.componentSetup.isLabelDisplay=d.options.isLabelDisplay);
					d.options.isNeedSerialize && (d.componentSetup.isNeedSerialize=d.options.isNeedSerialize);
					d.options.itemId && (d.componentSetup.itemId=d.options.itemId);
					d.options.itemKey && (d.componentSetup.itemKey=d.options.itemKey);
					d.options.itemCode && (d.componentSetup.itemCode=d.options.itemCode);
					d.options.itemType && (d.componentSetup.itemType=d.options.itemType);
					d.options.entityId && (d.componentSetup.entityId=d.options.entityId);
					d.options.isbusinessObj && (d.componentSetup.isbusinessObj=d.options.isbusinessObj);
					d.options.formula && (d.componentSetup.formula=d.options.formula);
					if(d.options.componentKey =="CheckBox" || d.componentSetup.componentKey =="CheckBox"){
						(d.options.options || d.componentSetup.options) && (d.componentSetup.checkboxCount=d.componentSetup.options.length);
						((d.options.options && d.options.options.length>1)||(d.componentSetup.options && d.componentSetup.options.length>1))  ? (d.componentSetup.isMulticheckbox=true): (d.componentSetup.isMulticheckbox=false);
					}
					if(d.options.componentKey =="RadioBox" || d.componentSetup.componentKey =="RadioBox"){
						(d.options.options || d.componentSetup.options) && (d.componentSetup.radioboxCount=d.componentSetup.options.length);
						((d.options.options && d.options.options.length>1)||(d.componentSetup.options && d.componentSetup.options.length>1))  ? (d.componentSetup.isMultiradiobox=true): (d.componentSetup.isMultiradiobox=false);
					}
					d.renderEditor(c);
					typeof d.options.titleLayout =="undefined" || d.options.titleLayout =="" && $("#widget-control .field_js").addClass("field-hoz"); //添加控件横的样式
					var comptypehtml="";
					if(typeof $(cc).attr("nodepk") !=="undefined"){
						//判断是否为复制的模板，如果是复制的模板则不能改变控件类型
						if(!(c.temptype=="user")){
							//统一增加控件类型
							comptypehtml = '<div class="form-group j_comptypeDiv" style="display: block;"></div>';
							var typeOption = '';
							var itemctrltype=typeof $(cc).attr("componentkey")=="undefined" ? d.componentSetup.componentKey:$(cc).attr("componentkey");
							var classstr="";
							if(itemctrltype=="CheckBox" || itemctrltype=="RadioBox"){
								classstr = $("#leftFormEdit_js").find(".widget-item.general_js[componentkey='Select']").attr("class");
							}else{
								classstr = $("#leftFormEdit_js").find(".widget-item.general_js[componentkey="+itemctrltype+"]").attr("class");
							}
							if(typeof classstr !=="undefined"){
								var classconditions=classstr.replace(/\ /g, ".");
								$("#form-widget-list").find("."+classconditions).each(function(index,val){
									if(d.componentSetup.componentKey == $(val).attr("componentkey")){
										typeOption +='<option value="' + $(val).attr("componentkey") + '" selected="selected">' + $(val).find("span:last-child").text() + "</option>";
									}else{
										typeOption +='<option value="' + $(val).attr("componentkey") + '">' + $(val).find("span:last-child").text() + "</option>";
									}
								});
							}else{
								$("#form-widget-list").find(".widget-item.general_js").each(function(index,val){
									if(d.componentSetup.componentKey == $(val).attr("componentkey")){
										typeOption +='<option value="' + $(val).attr("componentkey") + '" selected="selected">' + $(val).find("span:last-child").text() + "</option>";
									}else{
										typeOption +='<option value="' + $(val).attr("componentkey") + '">' + $(val).find("span:last-child").text() + "</option>";
									}
								});
							}
							comptypehtml = $(comptypehtml).html('<label>控件类型</label><div class="controls"><ul class="choicelistEdit j_choicelistEdit_comptype">	<li class="j_comptype_item" index="0"><select class="choicelist form-control j_select_comptype ie10-select" style="width:100%;margin:0;	padding-top: 0px\0;padding-bottom: 0px\0;padding-left: 0px\0;padding-right: 0px\0;">'+typeOption+'</select></li></ul></div>');
						}
						//统一增加itemcode
						var itemcodeval = $(cc).attr("nodecode");
						var browserType = c.myBrowser();
						var itemcodeHtml='';
						if(browserType=="FF" || browserType=="IE"){
							itemcodeHtml = '<div class="form-group itemcodeDiv"><label>控件编码</label><input id="component-itemcode" type="text" class="form-control ds-b w-full" maxlength="100" value="'+itemcodeval+'" readonly="true"></div>';
						}else{
							itemcodeHtml = '<div class="form-group itemcodeDiv"><label>控件编码</label><input id="component-itemcode" type="text" class="form-control ds-b w-full" maxlength="100" value="'+itemcodeval+'" disabled="disabled"></div>';
						}
						if($("#editor-component").find(".itemcodeDiv").length==0){
							$(".formeditcontent-titlelayout").length>0 && $(".formeditcontent-titlelayout").after(itemcodeHtml);
							$("#editor-component .label-content").length>0 && $("#editor-component .label-content").after(itemcodeHtml);
						}
					}else{
						//普通控件增加可编辑的控件编码区域
						var itemcodeval = d.componentSetup.itemCode;
						var itemcodeHtml="";
						if(typeof itemcodeval!="undefined"){
							itemcodeHtml = '<div class="form-group itemcodeDiv"><label>控件编码</label><input id="common-component-itemcode" type="text" class="form-control ds-b w-full" maxlength="100" value="'+itemcodeval+'" placeholder="编码格式：view.xx"><div class="errormessdiv" style="color: red;display: none;">控件编码格式不正确</div></div>';
						}else{
							itemcodeHtml = '<div class="form-group itemcodeDiv"><label>控件编码</label><input id="common-component-itemcode" type="text" class="form-control ds-b w-full" maxlength="100" value="" placeholder="编码格式：view.xx"><div class="errormessdiv" style="color: red;display: none;">控件编码格式不正确</div></div>';
						}
						if($("#editor-component").find(".itemcodeDiv").length==0){
							$(".formeditcontent-titlelayout").after(itemcodeHtml);
						}
					}
					//增加控件类型
					if($("#editor-component").find(".j_comptypeDiv").length==0){
						$(".itemcodeDiv").after(comptypehtml);
					}
					//判断列表显示属性是否显示
					if($(cc).parents("div[componentkey]").attr("componentkey")=="Form" || $(cc).parents("div[componentkey]").attr("componentkey")=="TableLayout" || $(cc).parents("div[class='table_layout_js']").length>0){
						$("#editor-component").find("#isList").parents("div[class='form-group']").remove();
					}
					//注册颜色选择器
					$("#edit-widget .form-group .in-color").colpick({
						layout: 'hex',
						submit: 0,
		 				onChange:function(hsb,hex,rgb,el,bySetColor){
		 					var colorval = $(".colpick_hex:visible > .colpick_hex_field > input").val();
		 					var regu = /^[0-9a-fA-F]{3,6}$/;
		 					var re = new RegExp(regu);
                            if(hex!=colorval || !re.test(colorval)){
                            	$(".colpick_hex:visible > .colpick_hex_field > input").val("ccc");
                            	hex="ccc";
                            }
		 					$("#widget-control .field-active .form-control").css({"border-color":'#'+hex});
							$("#widget-control .field-active .field-description").css({"color":'#'+hex});
							$("#edit-widget .form-group .in-color").css({"background-color":'#'+hex});
							//设置控件的borderColor
							if($("#widget-control .field-active").data("componentData").setBorderColor){
								$("#widget-control .field-active").data("componentData").setBorderColor('#'+hex);
							}
		 				}
					});
					//所有控件加上是否显示属性
					var isDisplay = '<div class="form-group isDisplayDiv editor-component-checkstyle" style="font-size: 12px;"><div class="controls"><div class="checkbox"><label style="color:#1baede;"><input name="isDisplay-layout" type="checkbox">显示控件</label></div></div></div>';
					var isCommonDisplay = '<div class="form-group isDisplayDiv editor-component-checkstyle" style="font-size: 12px;width:100%;z-index: 100;"><div class="controls"><div class="checkbox"><label style="color:#666666;"><input name="isDisplay-layout" type="checkbox">显示控件</label></div></div></div>';
					if($("#editor-component").find(".isDisplayDiv").length==0){
						d.componentSetup.componentKey!="GroupTable" && ($("#editor-component .j_comptypeDiv").length>0 ? $("#editor-component .j_comptypeDiv>label").after(isDisplay) : $(".itemcodeDiv").after(isCommonDisplay));
					}
					d.componentSetup.isDisplay==true && $("#editor-component").find(".isDisplayDiv input").attr("checked","checked") && $("#editor-component").find(".isDisplayDiv input").parent().addClass("on_check");
					//所有控件加上标题是否显示属性
					var isLabelDisplay = '<div class="form-group isLabelDisplayDiv editor-component-checkstyle" style="font-size: 12px;"><div class="controls"><div class="checkbox"><label style="color:#1baede;"><input name="isLabelDisplay-layout" type="checkbox">显示标题</label></div></div></div>';
					if($("#editor-component").find(".isLabelDisplayDiv").length==0){
						d.componentSetup.componentKey!="GroupTable" && d.componentSetup.componentKey!="Label" && $("#editor-component>div #component-title").siblings("label").after(isLabelDisplay);
					}
					d.componentSetup.isLabelDisplay==true && $("#editor-component").find(".isLabelDisplayDiv input").attr("checked","checked") && $("#editor-component").find(".isLabelDisplayDiv input").parent().addClass("on_check");
					
					//标题是否为空的判断
					var compTitle = $("#edit-widget").find("#component-title");
					var compTitleVal = $.trim(compTitle.val());
					if(typeof compTitleVal=="undefined" || compTitleVal=="" || compTitleVal==null){
						compTitle.siblings(".form-error").length==0 && compTitle.before('<div class="form-error fl errorStyle"></div>');
						compTitle.siblings(".form-error").text("标题不能为空");
						compTitle.siblings(".form-error").show();
					}else{
						compTitle.siblings(".form-error").text("");
						compTitle.siblings(".form-error").hide();
					}
					$("#edit-widget .form-group .in-color").css({"background-color":d.componentSetup.borderColor});
					$("#edit-widget").find("#component-describe").parent().show();
					if (null != $(cc).parents(".subform_js").get(0)) {
						$("#edit-widget").find("#component-describe").parent().hide();
					}
					$(window).resize();
					$(".j_edit_tab[edit-type='widget']").click();
					//还原表单设置页面
				}
				
			}
		});
		$(document).on("click", ".j_widgetDele", function() {
			if (confirm("确定删除吗？")) {
				var a = $(this);
				a.parent(".field").hasClass("field-active") && $("#editor-component").html('<div class="alert alert-danger"><i class="icon-exclamation-sign"></i>请先选择控件</div>');
				4 >= a.parents(".subform_js").find(".subtd_js").length && a.parents(".subform_js").find(".addSubColum_js").parent().attr("style", "");
				3 >= a.parents(".subform_js").find(".subtd_js").length && a.parents(".subform_js").find(".subtr_js ").removeClass("one-three");
				0 < a.parent(".field").parent(".subtd_js").siblings().length && a.parent(".field").parent(".subtd_js").remove();
				a.parents(".field-active").remove();
				0 == $("#widget-control").children().length && (c.showFormGuideImg(true));
				1 == $("#widget-control").children().length && "widget-control-noContent"==$("#widget-control").children().attr("id") && (c.showFormGuideImg(true));
			}
		});
		// 复制组件按钮
		$(document).on("click", ".j_widgetCopy", function() {	
			var componentkey = $("#widget-control .field-active").data("componentData").componentSetup.componentKey;
			var b = $("#form-addCompContainer").find("div[componentkey='"+componentkey+"']").clone();
			$(this).parents(".field").after(b);
			c.currentDrag = b;
			c.sortableProcess(b);
		});
		// 删除布局按钮
		$(document).on("click", ".j_layoutDele", function(e) {
			if (confirm("确定删除吗？")) {
				var a = $(this);
				//删除主表表格描述Label
				if(a.parents(".table_layout_js")){
					if(typeof a.parents(".table_layout_js").attr("nodecode") !="undefined"){
						$("#widget-control").find("div[refnodecode='"+a.parents(".table_layout_js").attr("nodecode")+"']").remove();
					}else{
						a.parents(".table_layout_js").prev().remove();
					}
				}
				a.parent().parent(".form-layout").remove();
				a.parents(".subform_js").remove();
				a.parents(".table_layout_js").remove();
				0 == $("#widget-control").children().length && (c.showFormGuideImg(true));
				1 == $("#widget-control").children().length && "widget-control-noContent"==$("#widget-control").children().attr("id") && (c.showFormGuideImg(true));
			}
			e.stopPropagation(); //阻止事件冒泡
		});
		//添加列按钮
		$(document).on("click", ".addSubColum_js", function() {
			var a = $(this);
			a.parents(".subform_js").find(".subtr_js").append('<td class="subtd_js" style="height: 71px;"></td>');
			2 < a.parents(".subform_js").find(".subtd_js").length && a.parents(".subform_js").find(".subtr_js ").addClass("one-three");
			c.subFromSortable(a.parents(".subform_js"))
		});
		// 新增预览功能表单按钮
		$(document).on("click", ".runtime_js", function() {
			$(".module-detail-slide").toggleClass("in");
			var jsondata = c.saveOrupdatejs("save");
			var nexuskey = "wujd3";
			var funcnode = "001PSN_TEST";
			$.ajax({
				type : "POST",
				url : "/uitemplate_web/uitemplate_design/preview_ctr/preview",
				data: {
					data: JSON.stringify(jsondata),
					nexuskey:nexuskey,
					funcnode:funcnode
				},
				async : false,
				dataType : "json",
				success : function(result) {
					var templateTitle = result.name;
					var name = "template-preview-" + (new Date).getTime();
					var url = result.url;
//					$("#template-preview").load(url + ".html");
					var urlMeta =  url.split("?");
				 	url = urlMeta[0];
					var query = (urlMeta.length > 1) ? ("?"+urlMeta[1]) : "" ;
					ko.components.register(name, {
						viewModel: {
							require: url + '.js' + query
						},
						template: {
							require: 'text!' + url + '.html' + query
						}
					});
					var previewDom = $('<div style="margin-left: 30px;">' + templateTitle +'</div>')
					// 创建模板组件自定义标签配置模板组件的参数
					templateComponent = $('<'+name+'></'+name+'>');
					var params = {'name': name, 'nexuskey': 'wujd', 'funcnode' : '001PSN_TEST'}; 
					templateComponent.attr('params',JSON.stringify(params));  

					// 将模板组件添加到节点HTML中 
					var templateParentDom = $('#template-preview');
					templateParentDom.empty();
					previewDom.appendTo(templateParentDom);
					
					templateComponent.appendTo(previewDom);
					
					// KO绑定
					ko.applyBindings({}, previewDom[0]);
				}
			});
		});
		//关闭预览弹出框
		$(document).on("click", ".detail-close-li", function() {
			 $('#template-preview').empty();
			$(".module-detail-slide").removeClass("in");
		});
		
		// 预览按钮
		$(document).on("click", ".preview_js", function() {
			var a = new ColumnPanel,
				d = [];
			$("#widget-control").children().each(function(a) {
				var b = c.assemComponent(a, $(this));
				if (null == b) return !0;
				d[a] = b.componentSetup
			});
			a.componentSetup.layoutDetail = d;
			a = a.toStringify();
			$("#formpreview").html("");
			// var b = $("#reportId").val();
			// null != b && 0 < b.length && $("#formpreview").data("reportId", b);
			l.renderForm({
				parentEl: $("#formpreview"),
				layoutDetail: a,
				callback: function(a) {}
			});
			$("#formpreview").parents(".form-preview-wrapper ").removeClass("hide")
		});
		//显示表单设置页签
		$(document).on("mouseover",".js_setting-size",function(){
			$("#edit-form").removeClass("hide");
			$("#js_process").addClass("hide");
		});
		$(document).on("mouseleave",".js_edit-form-hide",function(){
			$(".js_edit-form-hide").addClass("hide");
		})

		c.saveOrupdatejs = function(checkFlag){
			var a = new ColumnPanel,
			d = [];
			//设置subformid
			var ts = new Date().getTime().toString();
			a.componentSetup.subFormId = ts;
			var titleFlag = false;
			var countnum = 0;
			$("#widget-control").children().each(function(a) {
				var b = c.assemComponent(a, $(this));
				if (null == b) return !0;
				d[countnum] = b.componentSetup;
				countnum++;
				if(typeof checkFlag !='undefined' && checkFlag=='save'){
					//判断标题
					var compKey = b.componentSetup.componentKey;
					var layoutDetail = b.componentSetup.layoutDetail;
					(compKey=="DataTable" || compKey=="Table" || compKey=="Grid") && layoutDetail && layoutDetail.each(function(e){
						e.title=="" && (titleFlag = true);
						$("#widget-control").find("div[id="+e.fieldId+"]").hasClass("isNotdisplayCtl") && (e.isDisplay=false);
					});
					layoutDetail && layoutDetail.each(function(e){
						e.layoutDetail && e.layoutDetail.each(function(g){
							g.componentKey!="ColumnPanel" && g.title=="" && (titleFlag = true);
							$("#widget-control").find("div[id="+g.fieldId+"]").hasClass("isNotdisplayCtl") && (g.isDisplay=false);
							$("#widget-control").find("div[id="+g.fieldId+"]").hasClass("isLabelNotdisplayCtl") && (g.isLabelDisplay=false);
						})
					});
					if(!layoutDetail && b.componentSetup.title==""){
						titleFlag = true;
					}
				}
			});
			if(typeof checkFlag !='undefined' && checkFlag=='save'){
				if(titleFlag){
					u.alert("标题不能为空！");
					return false;
				}
			}
			a.componentSetup.layoutDetail = d;
			var	b = {
					form: {},
					formLayout: {}
				},
				p = $(".form-name").val(),
				q = $("#description-form").text(),
				form = b.form,
				formLayout = b.formLayout;
			var pk_temp = (function () {
				var search = location.search,
					pk_temp = '';
				if (!search) {
					return ""
				}
				search = search.slice(1).split('&')
				$.each(search, function (i, v){
					if (~v.indexOf('pk_temp=')) {
						pk_temp = v.split('=')[1]
						return false
					}
				})
				return pk_temp
			})();
			var temptype = (function () {
				var search = location.search,
					temptype = '';
				if (!search) {
					return ""
				}
				search = search.slice(1).split('&')
				$.each(search, function (i, v){
					if (~v.indexOf('temptype=')) {
						temptype = v.split('=')[1]
						return false
					}
				})
				return temptype
			})();
			form.temptype = temptype;
			form.pk_temp = pk_temp;
			c.sys_pk_temp && (form.sys_pk_temp = c.sys_pk_temp);
			c.sysflag && (form.sysflag = c.sysflag);
			c.tenant_id && (form.tenant_id = c.tenant_id);
			//c.pkMetadata && (form.pkMetadata = c.pkMetadata);
			c.pk_metadata && (form.pkMetadata = c.pk_metadata);
			form.name = p;
			form.describe = q;
			form.processAuthinfo = c.formauth ;
			formLayout.layoutType = "pc";
			formLayout.layoutDetail = a.componentSetup;
			return b;
		}
		// 保存按钮
		$(document).on("click", ".submit_js", function() {
			var b = c.saveOrupdatejs("save");
			c.checkFormName(function(a) {
				if (a.message) {
					$("#edit-form .c-danger").show(),
					$("#edit-form .c-danger").text(a.message),
					$(".j_edit_tab[edit-type='businessObj']").click();
					$(".j_edit_tab[edit-type='formwidget']").click();
				} else {
					$.ajax({
						type: "POST",
						data: {
							data: JSON.stringify(b),
							pkMetadata:c.pk_metadata,
							pk_temp:b.form.pk_temp
						},
						dataType: "json",
						// url: "static/data/save.json",
						url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/saveTemplate",
						success: u.loading(function(a) {
							if(a.message){
								u.alert(a.message);
								return;
							}
							u.alert("保存成功！");
							c.pk_temp = a.form.pk_temp;
							!b.form.pk_temp && (c.savetypeflag = "savesuccess");
							b.form.pk_temp && (c.savetypeflag = "updatesuccess");
						}),
						error: function() {
						}
					})
				}
			})
		});
		// 保存之后跳转到编辑页面
		$(document).on("click", ".btn.btn-primary", function(e) {
			//c.savetypeflag == "savesuccess" && window.open("/uitemplate_web/?pk_temp=" + c.pk_temp);
			c.savetypeflag == "savesuccess" && (window.location.href = "/uitemplate_web/?pk_temp=" + c.pk_temp);
			//c.savetypeflag == "updatesuccess" && (window.location.href=window.location.href);
		});
		var authObj = {};
		
		var activitis;
		$(document).on("click", ".formauth", function() {
			var bill = [];
			
			$("#widget-control").children().each(function(a) {
				var b = c.assemComponent(a, $(this));
				if (null == b) return !0;
				bill[a] = b.componentSetup;
				if(b.componentSetup.title==""){
					titleFlag = true;
				}
			});
			var processDefId = $("#processDefId").val();
			$.ajax({
				type: "GET",
				data: {
					processDefinitionId: processDefId
				},
				dataType: "json",
				async: false,
				url: "/iform/process_ctr/getAllActivitis",
				success: function(data) {
					if(data!=null || data!=""){
						activitis = data;
						c.activitis = activitis;
					}
				},
				error: function() {
				}
			});
			

		var view = '<div class="auth-dialog" >';
		view += '           <div class="modal-content reject-content">';
		view += '                  <div class="modal-header reject-header"><h4>表单权限</h4><a class="reject-head-close" title="点击关闭" href="javascript:void(0)" data-dismiss="modal"><img src="/iform/static/images/workflow/close.png" class="dialog-close"/></a></div>';		
		view += '                  <div class="modal-body" >';
		view += '<table class="table table-striped table-bordered table-hover js-table" role="grid" id="formauth_table" data-toggle="table" data-url="/iform/wf_ctr/workflownoteQry" style="width: 1098px;  min-width: 1098px;" >';
		view += '<thead role="rowgroup" id="1457942284606_header_thead">';
		view += '<tr role="row">';
		view += '<th role="columnheader" data-filed="20160000000001" rowspan="1" field="20160000000001" index="0" visibleindex="0">';
	    view += '<div style="position:relative;">';
	    view += '</div></div>';
	    view += '</th>';
			
		if(activitis){
			for(var i=0;i<activitis.length;i++){
				var activityId = activitis[i].id;
				var activityName = activitis[i].name;
				view += '<th role="columnheader"  rowspan="1" index="0" visibleindex="0" data-field="'+activityId+'">';
			    view += '<div style="position:relative;">';
			    view += '<div  title="名称" field="'+activityId+'">'+activityName+'</div>';
			    view += '<div   style="display: none;">';
			    view += '</div></div>';
			    view += '</th>';
 			}
		}
		
		view += '</tr>';		
	    view += '</thead>';	
		
		view += '<tbody role="rowgroup" id="1457007308317_content_tbody">';		
		
		var trindex = 0;
		for(var i=0;i<bill.length;i++){
			var type = bill[i].componentKey;
			if("DataTable"==type||"TableLayout"==type)
				continue;
			if("ColumnPanel"==type){
				var sonBill = bill[i].layoutDetail;
				if(sonBill!=null&&sonBill.length>0){
					for(var j=0;j<sonBill.length;j++){
						var type = sonBill[j].componentKey;
						if("DataTable"==type||"TableLayout"==type)
							continue;
						if("ColumnPanel"==type){
							var sonsonBill = sonBill[j].layoutDetail;
							if(sonsonBill!=null&&sonsonBill.length>0){
								for(var k=0;k<sonsonBill.length;k++){
									var type = sonsonBill[k].componentKey;
									if("DataTable"==type||"TableLayout"==type||"ColumnPanel"==type)
										continue;
									view = c.genTd(view,sonsonBill[k],activitis,trindex);
								}
							}
						}else
							view = c.genTd(view,sonBill[j],activitis,trindex);
					}
				}
			}
			else
				view = c.genTd(view,bill[i],activitis,trindex);
		}
		
	    view += '</tbody>';	
		view += '</table>';
		view += '     </div>';
		view += '     <div class="auth-footer"> <button id="formauth-sure-btn" btntype="okBtn" type="button" class="btn btn-sm btn-lake reject-sur-btn" data-dismiss="modal" >确定</button></div>';
		view += '     </div>';
		view += '     </div>';
		view += '     </div>';
		$("#dialog").empty().append($(view));
		$("#dialog").css("z-index","3050");
		$('#dialog').modal();
		
		var tabledata =  [{
	        id: 1,
	        name: 'Item 1',
	        price: '$1'
	    }, {
	        id: 2,
	        name: 'Item 2',
	        price: '$2'
	    }]
		
		
		$('#formauth_table').bootstrapTable({
		    data: tabledata,
		    columns: [{
		        field: 'id',
		        title: 'Item ID'
		    }, {
		        field: 'name',
		        title: 'Item Name'
		    }, {
		        field: 'price',
		        title: 'Item Price'
		    }],
		});
		
		});
		
		$(document).on("click", "#formauth-sure-btn", function() {
		    var alldata = $("#formauth_table").bootstrapTable("getData");
			if(alldata&&c.activitis){
				 alldata.each(function(index,element){
					 var activity = activitis[index];
					 
					 
					 
				 });
				
			}
			
			
			c.formauth = [
	                        { "approveUserTask7221" : [{ "fieldid": "201603111522065" ,"auth":"0"}]},
	                        { "approveUserTask9819" : [{ "fieldid": "201603111522073" ,"auth":"0"},{ "fieldid": "201603111522083" ,"auth":"1"}]}
	                        ];
	
			
			
		});
		
		// 估计是切换到历史版本的按钮，没找到按钮在哪儿
		$(document).on("click", ".j_showVersion", function(a) {
			a = c.formId;
			var d = $(this).attr("id");
			window.open("/form/preview/" + a + "/" + d)
		});
	};
	// 递归生成每个布局组件的layoutDetail
	c.assemComponent = function(a, b) {
		var f = b.data("componentData");
		// componentSetup貌似就是组件数据存放的地方
		if (null == f || null == f.componentSetup) return null;
		//如果是查询出来的数据则将数据放到componentSetup中
		typeof f.options.isDisplay=="boolean" && (f.componentSetup.isDisplay=f.options.isDisplay);
		typeof f.options.isLabelDisplay=="boolean" && (f.componentSetup.isLabelDisplay=f.options.isLabelDisplay);
		f.options.isNeedSerialize && (f.componentSetup.isNeedSerialize=f.options.isNeedSerialize); //是否需要序列化
		f.options.itemId && (f.componentSetup.itemId=f.options.itemId);
		f.options.itemKey && (f.componentSetup.itemKey=f.options.itemKey);
		f.options.itemCode && (f.componentSetup.itemCode=f.options.itemCode);
		//f.options.fontStyle && (f.componentSetup.fontStyle=f.options.fontStyle);
		f.options.itemType && (f.componentSetup.itemType=f.options.itemType);
		f.options.entityId && (f.componentSetup.entityId=f.options.entityId);
		f.options.isbusinessObj && (f.componentSetup.isbusinessObj=f.options.isbusinessObj);
		if(f.options.componentKey =="CheckBox" || f.componentSetup.componentKey =="CheckBox"){
			(f.options.options || f.componentSetup.options) && (f.componentSetup.checkboxCount=f.componentSetup.options.length);
			((f.options.options && f.options.options.length>1)||(f.componentSetup.options && f.componentSetup.options.length>1)) ? (f.componentSetup.isMulticheckbox=true): (f.componentSetup.isMulticheckbox=false);
		}
		if(f.options.componentKey =="RadioBox" || f.componentSetup.componentKey =="RadioBox"){
			(f.options.options || f.componentSetup.options) && (f.componentSetup.radioboxCount=f.componentSetup.options.length);
			((f.options.options && f.options.options.length>1)||(f.componentSetup.options && f.componentSetup.options.length>1)) ? (f.componentSetup.isMultiradiobox=true): (f.componentSetup.isMultiradiobox=false);
		}
		f.componentSetup.order = a;
		if ("ColumnPanel" == f.componentSetup.componentKey) {
			var g = [];
			b.find(".cell_js ").each(function(a) {
				var d = new ColumnPanel,
					b = [];
				$(this).children().each(function(a) {
					var d = c.assemComponent(a, $(this));
					if (null == d) return !0;
					b[a] = d.componentSetup
				});
				d.componentSetup.layoutDetail = b;
				d.componentSetup.index = a;
				g[a] = d.componentSetup
			});
			f.componentSetup.layoutDetail = g
		}else if("GroupTable" == f.componentSetup.componentKey){
			var g = [];
			b.find(".groupTable_js").each(function(a) {
				var d = new ColumnPanel,
					b = [];
				$(this).children().each(function(a) {
					var d = c.assemComponent(a, $(this));
					if (null == d) return !0;
					b[a] = d.componentSetup
				});
				d.componentSetup.layoutDetail = b;
				d.componentSetup.index = a;
				g[a] = d.componentSetup
			});
			f.componentSetup.layoutDetail = g
		} else if(b.attr("componentKey")=="FormLabel"){
			f.componentSetup.componentKey="FormLabel";
		}else ("DataTable" == f.componentSetup.componentKey || "Grid" == f.componentSetup.componentKey || "Table" == f.componentSetup.componentKey)? (g = [], a = 0, b.find(".subtr_js ").children().each(function() {
			var b = c.assemComponent(a, $(this).find(".field_js"));
			if (null == b) return !0;
			g[a] = b.componentSetup;
			a++
		}), f.componentSetup.size = g.length,f.componentSetup.layoutDetail = g) : 
			("TableLayout" == f.componentSetup.componentKey || "Form" == f.componentSetup.componentKey) && f.getTableSerialize(c, a);
		//非业务对象树拖拽表格添加subformid
		if("ColumnPanel" == f.componentSetup.componentKey || "TableLayout" == f.componentSetup.componentKey || "DataTable" == f.componentSetup.componentKey || "GroupTable" == f.componentSetup.componentKey){
			if(typeof f.componentSetup.subFormId == "undefined"){
				var ts = new Date().getTime().toString();
				f.componentSetup.subFormId = ts;
			}
		}
		if(typeof f.componentSetup.isLabelDisplay=="undefined"){
			f.componentSetup.isLabelDisplay = true;
		}
		return f
	};
	// 设置区组件设置事件绑定，老多了……
	c.componentSetupEvents = function() {
		//组件标题
		$(document).on("keydown", "#editor-component #component-title", function(a) {
			a = $.trim($(this).val());
			$("#widget-control .field-active .widget-title .widget-title_js").eq(0).text(a);
			$("#widget-control .field-active").data("componentData").setTitle(a);
		});
		//组件标题
		$(document).on("keyup", "#editor-component #component-title", function(a) {
			a = $.trim($(this).val());
			if(typeof a=="undefined" || a=="" || a==null){
				$(this).siblings(".form-error").length==0 && $(this).before('<div class="form-error fl errorStyle"></div>');
				$(this).siblings(".form-error").text("标题不能为空");
				$(this).siblings(".form-error").show();
			}else{
				$(this).siblings(".form-error").text("");
				$(this).siblings(".form-error").hide();
			}
			$("#widget-control .field-active .widget-title .widget-title_js").eq(0).text(a);
			$("#widget-control .field-active").data("componentData").setTitle(a);
			var labeldiv = $("#widget-control .field-active .widget-title .widget-title_js").eq(0).parents("div[refnodecode]");
			if(typeof labeldiv!="undefined" && labeldiv.length>0){//如果是form关联的表名label
				var refnodecode = labeldiv.attr("refnodecode");
				labeldiv.siblings("div[nodecode='"+refnodecode+"']").data("componentData").componentSetup.title=a;
			}else{
				$($("#widget-control .field-active")[0].nextSibling).data("componentData").componentSetup.title=a;
			}
		});
		//控件监听器属性
		$(document).on("keydown", "#editor-component #component-listener", function(a) {
			a = $.trim($(this).val());
			$("#widget-control .field-active").data("componentData").setItemListener(a);
		});
		//控件监听器属性
		$(document).on("keyup", "#editor-component #component-listener", function(a) {
			a = $.trim($(this).val());
			$("#widget-control .field-active").data("componentData").setItemListener(a);
		});
		//参照控件refParam属性
		$(document).on("keydown", "#editor-component #component-refParam", function(a) {
			a = $.trim($(this).val());
			$("#widget-control .field-active").data("componentData").setRefParam(a);
		});
		$(document).on("keyup", "#editor-component #component-refParam", function(a) {
			a = $.trim($(this).val());
			$("#widget-control .field-active").data("componentData").setRefParam(a);
		});
		//布局id
		$(document).on("keydown", "#editor-component .componentLayoutId", function(a) {
			a = $.trim($(this).val());
			$("#widget-control .field-active").data("componentData").setTableId(a);
		});
		//布局id
		$(document).on("keyup", "#editor-component .componentLayoutId", function(a) {
			a = $.trim($(this).val());
			var regu = /^[a-zA-Z0-9]{6,30}$/;
			var re = new RegExp(regu);
            if(!re.test(a)){
            	$(this).siblings(".form-error").length==0 && $(this).before('<div class="form-error fl errorStyle"></div>');
				$(this).siblings(".form-error").text("只能是数字或字母或两者组合且长度6到30位之间");
				$(this).siblings(".form-error").show();
            }else{
				$(this).siblings(".form-error").text("");
				$(this).siblings(".form-error").hide();
			}
			$("#widget-control .field-active").data("componentData").setTableId(a);
		});
		// 明细子表标题
		$(document).on("keydown", "#editor-component #component-title-datatable", function(a) {
			a = $.trim($(this).val());
			var c = $("#widget-control .field-active .form-databox-head .j_datatableTitle");
			c.text(a);
			var b = $("#widget-control .field-active").data("componentData");
			"" == a ? c.addClass("hide") : c.removeClass("hide");
			b.setTitle(a)
		});
		// 明细子表标题
		$(document).on("keyup", "#editor-component #component-title-datatable", function(a) {
			a = $.trim($(this).val());
			var c = $("#widget-control .field-active .form-databox-head .j_datatableTitle");
			c.text(a);
			var b = $("#widget-control .field-active").data("componentData");
			"" == a ? c.addClass("hide") : c.removeClass("hide");
			b.setTitle(a)
		});
		// 明细子表描述
		$(document).on("keydown", "#editor-component #component-describe-datatable", function(a) {
			a = $.trim($(this).val());
			var c = $("#widget-control .field-active .j_datatableDescription");
			"" != a ? (c.removeClass("hide"), c.text(a)) : c.addClass("hide");
			$("#widget-control .field-active").data("componentData").setDescribe(a)
		});
		// 明细子表描述
		$(document).on("keyup", "#editor-component #component-describe-datatable", function(a) {
			a = $.trim($(this).val());
			var c = $("#widget-control .field-active .j_datatableDescription");
			"" != a ? (c.removeClass("hide"), c.text(a)) : c.addClass("hide");
			$("#widget-control .field-active").data("componentData").setDescribe(a)
		});
		
		// 明细子表，勾选显示序号
		$(document).on("click", "#editor-component #component-isDisplayNo-datatable", function(a) {
			(a = $(this).is(":checked")) ? $("#component-displayTitle-datatable").removeClass("hide") : $("#component-displayTitle-datatable").addClass("hide");
			if(a){//勾选，明细子表显示标题
				$("#widget-control .field-active").find(".display_no").removeClass("hide");
				
			}else{
				$("#widget-control .field-active").find(".display_no").addClass("hide");
			}
			b = $("#widget-control .field-active").data("componentData");
			b.setIsDisplayNo(a);
			var val = $.trim($("#component-displayTitle-datatable").val());
			""!=val?val : "定义标题";
			$("#widget-control .field-active").find(".l_display_no").text(val);
			b.setDisplayTitle(val)
		});
		
		// 明细子表 显示序号勾选后定义标题
		$(document).on("keydown", "#editor-component #component-displayTitle-datatable", function(a) {
			a = $.trim($(this).val());
			""!=a?a : "定义标题";
			$("#widget-control .field-active").find(".l_display_no").text(a);
			b = $("#widget-control .field-active").data("componentData");
			b.setDisplayTitle(a)
		});
		// 明细子表 显示序号勾选后定义标题
		$(document).on("keyup", "#editor-component #component-displayTitle-datatable", function(a) {
			a = $.trim($(this).val());
			""!=a?a : "定义标题";
			$("#widget-control .field-active").find(".l_display_no").text(a);
			b = $("#widget-control .field-active").data("componentData");
			b.setDisplayTitle(a)
		});
		
		//明细子表默认行数 行数范围-1(1-99)
		$(document).on("click", "#editor-component #defaultRowsDel", function(a) {
			a = $("#widget-control .field-active").data("componentData");
			var b = $.find("#datatable-defaultRows")[0].innerText?$.find("#datatable-defaultRows")[0].innerText:"2";
			var d = parseInt(b)-1; 
			d<1 ? l.notify("行数范围：1-99"):$.find("#datatable-defaultRows")[0].innerText = d;
			a.setDefaultRows(d);
		});
		//明细子表默认行数  行数范围+1(1-99)
		$(document).on("click", "#editor-component #defaultRowsAdd", function(a) {
			a = $("#widget-control .field-active").data("componentData");
			var b = $.find("#datatable-defaultRows")[0].innerText?$.find("#datatable-defaultRows")[0].innerText:"2";
			var d = parseInt(b)+1; 
			d>99 ? l.notify("行数范围：1-99"):$.find("#datatable-defaultRows")[0].innerText = d;
			a.setDefaultRows(d);
		});
		// 明细字表默认行数
		$(document).on("blur", "#editor-component #datatable-defaultRows", function(a) {
			a = $(this).val();
			var c = a.replace(/[^\d.-]/g, "");
			"" == c && (c = 0);
			var c = parseInt(c),
				b = $("#widget-control .field-active").data("componentData");
			$(this).val(c);
			isNaN(a) && $(this).val(b.componentSetup.defaultRows);
			10 < a && $(this).val(b.componentSetup.defaultRows);
			b = $("#widget-control .field-active").data("componentData");
			b.setDefaultRows($(this).val())
		});
		// 明细字表默认行数
		$(document).on("keyup", "#editor-component #datatable-defaultRows", function(a) {
			a = $(this).val();
			var c = a.replace(/[^\d.-]/g, "");
			"" == c && (c = 0);
			var c = parseInt(c),
				b = $("#widget-control .field-active").data("componentData");
			$(this).val(c);
			isNaN(a) && $(this).val(b.componentSetup.defaultRows);
			10 < a && $(this).val(b.componentSetup.defaultRows);
			b = $("#widget-control .field-active").data("componentData");
			b.setDefaultRows($(this).val())
		});
		// 标题布局
		$(document).on("change", "#editor-component input:radio[name='title-layout']", function(a) {
			a = $(this).val();
			$("#editor-component input:radio[name='title-layout']").each(function(a) {
				a = $(this).val();
				$("#widget-control .field_js.field-active").removeClass(a)
			});
			$("#widget-control .field_js.field-active").addClass(a);
			$("#widget-control .field_js.field-active").data("componentData").setTitleLayout(a)
		});
		// 组件描述
		$(document).on("keydown", "#editor-component #component-describe", function(a) {
			null == $("#widget-control .field-active").parents(".subform_js").get(0) && (a = $.trim($(this).val()), "" != a ? ($("#widget-control .field-active .field-description").show(), $("#widget-control .field-active .field-description").text(a)) : $("#widget-control .field-active .field-description").hide(), $("#widget-control .field-active").data("componentData").setDescribe(a))
		});
		// 组件描述
		$(document).on("keyup", "#editor-component #component-describe", function(a) {
			null == $("#widget-control .field-active").parents(".subform_js").get(0) && (a = $.trim($(this).val()), "" != a ? ($("#widget-control .field-active .field-description").show(), $("#widget-control .field-active .field-description").text(a)) : $("#widget-control .field-active .field-description").hide(), $("#widget-control .field-active").data("componentData").setDescribe(a))
		});
		// 必填项目
		$(document).on("click", "#editor-component #required", function(a) {
			(a = $(this).is(":checked")) ? $("#widget-control .field-active .widget-title .widget-required_js").text(" *") : $("#widget-control .field-active .widget-title .widget-required_js").text("");
			$("#widget-control .field-active").data("componentData").setRequired(a)
		});
		// 只读项目
		$(document).on("click", "#editor-component #readOnly", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setReadOnly(a)
		});
		// 参照控件只选叶子节点
		$(document).on("click", "#editor-component #leafselect", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setLeafSelect(a)
		});
		// 数值控件--身份证类型
		$(document).on("click", "#editor-component #isidentity", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setIsIdentity(a)
		});
		// 是否列表显示
		$(document).on("click", "#editor-component #isList", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setIsList(a);
		});
		// 控件尺寸
		$(document).on("change", "#editor-component input:radio[name='tSize']", function(a) {
			var b = $(this).val();
			var width = $("#widget-control .field-active .form-control").width();
			var height = $("#widget-control .field-active .form-control").height();
			$("#editor-component input:radio[name='tSize']").each(function(a) {
				a = $(this).val();
				if(b != "user-defined"){
					$("#widget-control .field-active .form-control").removeClass(a)
				}
			});
			if(b == "user-defined"){
				$(".user-defined-div").show();
				$("#user-defined-width").text(Math.ceil(width)+21);
				$("#user-defined-height").text(Math.ceil(height)+10);
			}else{
				$(".user-defined-div").hide();
				$("#widget-control .field-active .form-control").addClass(b);
			}
			$("#widget-control .field-active").data("componentData").setSize(b)
		});
		//自定义 控件尺寸--设置宽度
		$(document).on("keyup", "#user-defined-width", function(a) {
			var a = $.trim($(this).text());
			$(this).val(a.replace(/[^\d.-]/g, ""));
			var lWidth = $("#widget-control .field-active .form-control").parent().width();
			var sWidth = $("#widget-control .field-active .form-control").parent().width()/5;
			isNaN(a) && (a="");
			if(a=="" || a==null){
				$("#widget-control .field-active").data("componentData").componentSetup.width = a;
				$(this).parents(".comp-width").find(".form-error").hide();
				return;
			}
			if(a>=sWidth && a<=lWidth){
				$("#widget-control .field-active").data("componentData").componentSetup.width = a;
				$("#widget-control .field-active .form-control").css("width",a+"px");
				$(this).parents(".comp-width").find(".form-error").hide();
			}else if(a>lWidth || a<sWidth){
				$(this).parents(".comp-width").find(".form-error").text("宽度范围在"+sWidth+"-"+lWidth+"之间");
				$(this).parents(".comp-width").find(".form-error").show();
				return;
			}	
			$("#editor-component input:radio[name='tSize']").each(function(b) {
				b = $(this).val();
				$("#widget-control .field-active .form-control").removeClass(b)
			});
		});
		//自定义 控件尺寸--设置高度
		$(document).on("keyup", "#user-defined-height", function(a) {
			var a = $.trim($(this).text());
			$(this).val(a.replace(/[^\d.-]/g, ""));
			var lHeight = 80;
			var sHeight = 30;
			isNaN(a) && (a="");
			if(a=="" || a==null){
				$("#widget-control .field-active").data("componentData").componentSetup.height = a;
				$(this).parents(".comp-height").find(".form-error").hide();
				return;
			}
			if(a>=sHeight && a<=lHeight){
				$("#widget-control .field-active").data("componentData").componentSetup.height = a;
				$("#widget-control .field-active .form-control").css("height",a+"px");
				$(this).parents(".comp-height").find(".form-error").hide();
			}else if(a>lHeight || a<sHeight){
				$(this).parents(".comp-height").find(".form-error").text("高度范围在"+sHeight+"-"+lHeight+"之间");
				$(this).parents(".comp-height").find(".form-error").show();
			}
			$("#editor-component input:radio[name='tSize']").each(function(b) {
				b = $(this).val();
				$("#widget-control .field-active .form-control").removeClass(b)
			});
		});
		//支持半星
		$(document).on("change", "input:radio[name='half']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			c.sethalf(a);
			c.setDefaultstar(0);
			c.renderEditor();
			a = $(b.get("raty")).siblings("#img-clone");
			$("#widget-control .field-active #star").empty();
			for (c = 1; 5 >= c; c++) {
				var f = a.find("img").clone();
				f.attr("value", c);
				$("#widget-control .field-active #star").append(f)
			}
		});
		// 默认星星数量
		$(document).on("change", "select[name='defaultstar']", function(a) {
			a = $(this).val();
			$("#widget-control .field-active").data("componentData").setDefaultstar(a);
			$("#widget-control .field-active #star").empty();
			var c = $(b.get("raty")),
				f = Math.round(a),
				c = c.siblings("#img-clone");
			if (a == f) for (var g = 1; 5 >= g; g++) {
				if (g <= a) {
					var k = c.find("img").clone(),
						p = k.attr("src"),
						p = p.replace("off", "on");
					k.attr("src", p)
				} else k = c.find("img").clone();
				k.attr("value", g);
				$("#widget-control .field-active #star").append(k)
			} else for (g = 1; 5 >= g; g++)
			g <= f - 1 ? (k = c.find("img").clone(), p = k.attr("src"), p = p.replace("off", "on"), k.attr("src", p)) : g == f ? (k = c.find("img").clone(), p = k.attr("src"), p = p.replace("off", "half"), k.attr("src", p)) : k = c.find("img").clone(), k.attr("value", g), $("#widget-control .field-active #star").append(k)
		});
		// 单行多行
		$(document).on("click", "#editor-component input:radio[name='componentType']", function(a) {
			var c = $(this).val();
			a = $("#widget-control .field-active");
			var b = a.data("componentData"),
				c = new window[c];
			if($(this).val()!="Select" && b.componentSetup.options && b.componentSetup.options.length>4){
				$("#editor-component .editor-component-itemstyle input:radio[value='Select']").attr("checked","checked");
				u.alert("复选框和单选框的选项不能超过4个，请修改后再切换");
				return;
			}
			c.change({
				oldObj: b,
				changeEl: a,
				currentObj:c
			});
			a.data("componentData", c)
			//控件属性框选项修改
			var select = $(this).parents("#editor-component").find("select");
			select.find("option[value='"+$(this).val()+"']").attr("selected",true);
		});
		// select 控件默认选中
		$(document).on("change", "#editor-component ul li .option_js", function(a) {
			c.changeFormOption()
		});
		// select 控件option名字输入区域
		$(document).on("keydown", "#editor-component ul li .optionName_js", function(a) {
			a = $(this).val();
			var c = $(this).parent(),
				c = $("#editor-component ul li:not('.j_comptype_item')").index(c),
				b = $("#widget-control .field-active").data("componentData");
			"Select" == b.componentSetup.componentKey ? $("#widget-control .field-active .choicelist_js option").eq(c).text(a) : $("#widget-control .field-active .choicelist_js li").eq(c).find("span").text(a);
			b.componentSetup.options[c].name = a;
			b.componentSetup.options[c].selectVal=a;
		});
		// select 控件option名字输入区域
		$(document).on("keyup", "#editor-component ul li .optionName_js", function(a) {
			a = $(this).val();
			var c = $(this).parent(),
				c = $("#editor-component ul li:not('.j_comptype_item')").index(c),
				b = $("#widget-control .field-active").data("componentData");
			"Select" == b.componentSetup.componentKey ? $("#widget-control .field-active .choicelist_js option").eq(c).text(a) : $("#widget-control .field-active .choicelist_js li").eq(c).find("span").text(a);
			b.componentSetup.options[c].name = a;
			b.componentSetup.options[c].selectVal=a;
		});
		// 单选复选控件切换布局
		$(document).on("change", "#editor-component input:radio[name='layout']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active .choicelist_js "),
				b = $("#widget-control .field-active").data("componentData");
			c.attr("class", "choicelist choicelist_js " + a);
			b.setLayout(a)
		});
		// select控件添加其他option
		$(document).on("click", "#editor-component .btn-default_js", function(a) {
			$(this).parent().hide();
			a = $("#widget-control .field-active").data("componentData");
			var b = $("#editor-component .choicelistEdit_js"),
				f = new Option;
			f.setName("其他");
			f.setOther(!0);
			f.renderEditor(b, a);
			c.changeFormOption()
		});
		// select控件删除option
		$(document).on("click", "#editor-component .choicelistEdit_js .minusoption_js", function(a) {
			a = $(this).parent().parent();
			0 != a.siblings("li").not(".otherOption_js").length && (a.remove(), a.hasClass("otherOption_js") && $("#editor-component .btn-default_js").parent().show(), c.changeFormOption())
		});
		// select控件添加option
		$(document).on("click", "#editor-component .choicelistEdit_js .plusoption_js", function(a) {
			a = $("#widget-control .field-active").data("componentData");
			var b = $("#editor-component .choicelistEdit_js"),
				f = b.find(".otherOption_js");
			b.remove(".otherOption_js");
			(new Option).renderEditor(b, a, $(this).parents("li"));
			b.append(f);
			c.changeFormOption()
		});
		// 分割线控件切换分割线类型
		$(document).on("change", "input:radio[name='dividingLineType']", function(a) {
			a = $(this).val();
			$("#widget-control .field-active .divider-line").attr("class", "divider-line " + a);
			$("#widget-control .field-active").data("componentData").setType(a)
		});
		// 段落控件选择段落样式
		$(document).on("change", "input:radio[name='paragraphType']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active .paragraph").attr("class").toString(),
				c = c.substring(0, 15) + " " + a;
			$("#widget-control .field-active .paragraph").attr("class", c);
			$("#widget-control .field-active").data("componentData").setStyle(a);
		});
		// 时期控件日期格式
		$(document).on("change", "select[name='dateFormat']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData"),
				b = "";
			"YYYY-MM-DD" == a ? b = "年-月-日" : "YYYY-MM" == a ? b = "年-月" : "YYYY-MM-DD HH:mm" == a ? b = "年-月-日 时:分" : "YYYY-MM-DD HH:mm:ss" == a && (b = "年-月-日 时:分:秒");
			$("#widget-control .field-active .form-control").attr("placeholder", b);
			c.setFormat(a)
		});
		// 日期控件默认时间
		$(document).on("click", "#editor-component #systemDate", function(a) {
			a = $(this).is(":checked");
			var c = $("#widget-control .field-active").data("componentData");
			//a ? $("#editor-component .date_readonly_js").show() : ($("#editor-component .date_readonly_js #readonly").attr("checked", !1), c.setIsReadonly(!1), $("#editor-component .date_readonly_js").hide());
			c.setIsSystemDate(a)
		});
		// 日期控件只读，貌似就没有，被隐藏了
		$(document).on("click", "#editor-component #readonly", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setIsReadonly(a)
		});
		// 添加人员控件是否唯一
		$(document).on("click", "#editor-component #isUnique", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setIsUnique(a)
		});
		// 添加部门控件默认部门
		$(document).on("click", "#editor-component #isCurrentDepartment", function(a) {
			a = $(this).is(":checked");
			var c = $("#widget-control .field-active").data("componentData");
			a ? $("#editor-component .department_readonly_js").show() : ($("#editor-component .department_readonly_js #isReadonly").attr("checked", !1), c.setIsReadonly(!1), $("#editor-component .department_readonly_js").hide());
			c.setIsCurrentDepartment(a)
		});
		// 添加人员控件是否只读，也是被隐藏起来了
		$(document).on("click", "#editor-component #isReadonly", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setIsReadonly(a)
		});
		// 添加人员控件默认人员
		$(document).on("click", "#editor-component #isCurrentEmployee", function(a) {
			a = $(this).is(":checked");
			var c = $("#widget-control .field-active").data("componentData");
			a ? $("#editor-component .employee_readonly_js").show() : ($("#editor-component .employee_readonly_js #isReadonly").attr("checked", !1), c.setIsReadonly(!1), $("#editor-component .employee_readonly_js").hide());
			c.setIsCurrentEmployee(a)
		});
		// 附件上传，单文件上传
		$(document).on("click", "#editor-component #isSingle", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setSingle(a)
		});
		// select控件，批量编辑
		$(document).on("click", "#editor-component .j_optBatcEdit", function(a) {
			a = $("#optBatcEdit");
			a.find("#optContent").parent().removeClass("has-error");
			a.find(".j_optBatcEditEr").hide();
			var c = "";
			$("#editor-component ul.choicelistEdit_js").children().each(function(a) {
				a = $(this).find(".optionName_js").val();
				null != a && (c += a.trim() + "\n")
			});
			a.find("#optContent").val(c.trim());
			$("#optBatcEdit").modal()
		});
		// 批量编辑弹窗保存按钮
		$(document).on("click", "#optBatcEdit .j_saveOptBatc", function(a) {
			a = $("#editor-component ul.choicelistEdit_js");
			var b = $("#optBatcEdit"),
				f = b.find("#optContent").val().trim();
			//RadioBox/checkbox时不能超过4个
			var keyType = $("#widget-control .field-active").data("componentData").componentSetup.componentKey;
			var optionLength = f.split("\n");
			if(optionLength && optionLength.length>4){
				if(keyType=="CheckBox"){
					u.alert("复选框选项最多不能超过4个");
					return;
				}
				if(keyType=="RadioBox"){
					u.alert("单选框选项最多不能超过4个");
					return;
				}
			}
			b.find("#optContent").parent().removeClass("has-error");
			b.find(".j_optBatcEditEr").hide();
			//if ("" == f) b.find("#optContent").parent().addClass("has-error"), b.find("#optContent").focus(), b.find(".j_optBatcEditEr").show();
			//else {
				for (var g = f.split("\n"), b = [], f = 0; f < g.length; f++) {
					var k = g[f];
					"" != k.trim() && b.push(k)
				}
				for (var g = $("#widget-control .field-active").data("componentData"), p = g.componentSetup.componentKey, q = a.find("li." + p + "_js"), f = 0; f < b.length; f++) {
					var k = b[f],
						h = q.eq(f);
					null == h.get(0) ? ((new Option({
						name: k,
						order: f,
						index: 0,
						selectionId: "",
						defOption: !1,
						other: !1
					})).renderEditor(a, g), k = a.find(".otherOption_js"), a.remove(".otherOption_js"), a.append(k)) : h.find(".optionName_js").val(k)
				}
				b.length < q.length && a.find("li." + p + "_js:gt(" + (b.length - 1) + ")").remove();
				b.length == 0 && a.find("li." + p + "_js").remove();
				c.changeFormOption();
				$("#optBatcEdit").modal("hide")
			//}
		});
		// 批量编辑弹窗取消按钮
		$(document).on("click", "#optBatcEdit .j_close", function(a) {
			$("#optBatcEdit").modal("hide")
		});
		// 给统计控件用的，数据来源,但是统计控件并没有展示到列表里，不知道为啥
		$(document).on("change", "#component-dataset", function(a) {
			$("#widget-control .field-active").data("componentData").setDataSetId($(this).val())
		});
		// 给统计控件用的，统计方式,但是统计控件并没有展示到列表里，不知道为啥
		$(document).on("change", "#component-stattype", function(a) {
			$("#widget-control .field-active").data("componentData").setStatType($(this).val())
		});
		// 也是给统计控件用的，表格统计控件数据来源，貌似吧
		$(document).on("click", ".table_field", function(a) {
			a = $(this);
			var c = $("#widget-control .field-active").data("componentData"),
				b = a.val();
			a.prop("checked") ? c.addDataSet(b, a.attr("title")) : c.removeDataSet(b)
		});
		// 运算控件，监控类型
		$(document).off("change", "input:radio[name='monitor-type']").on("change", "input:radio[name='monitor-type']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			c.setMonitorType(a);
			c.componentSetup.monitorFields = [];
			c.renderEditor()
		});
		// 运算控件，监控字段
		$(document).off("change", ".j_operate input,.j_select_monitor").on("change", ".j_operate input,.j_select_monitor", function() {
			var a = $("#widget-control .field-active").data("componentData"),
				c = $(this);
			c.hasClass("j_select_monitor") && ("常量" == c.val() ? c.next().removeClass("hide") : c.next().addClass("hide"));
			a.getFormula()
		});
		// 运算控件，控件后面可以输入数字，不知道干啥用的
		$(document).off("keydown", ".j_number_input").on("keydown", ".j_number_input", function(a) {
			a = parseInt(a.keyCode);
			var c = $(this).val();
			if ((110 == a || 190 == a) && 0 <= c.indexOf(".") || (109 == a || 173 == a) && 0 <= c.indexOf("-")) return !1
		});
		// 运算控件，控件后面可以输入数字，不知道干啥用的
		$(document).off("keyup", ".j_number_input").on("keyup", ".j_number_input", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			isNaN(a) && "-" != a && $(this).val(parseFloat(a));
			"." == a.charAt(0) && $(this).val(0 + parseFloat(a));
			c.getFormula()
		});
		// 运算控件，控件后面可以输入数字，不知道干啥用的
		$(document).on("keyup", ".j_number_input", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			$(this).val(a.replace(/[^\d.-]/g, ""));
			c.getFormula()
		});
		// 运算控件，控件后面可以输入数字，不知道干啥用的
		$(document).off("blur", ".j_number_input").on("blur", ".j_number_input", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			$(this).val(a.replace(/[^\d.-]/g, ""));
			c.getFormula()
		});
		// 运算控件，是否可编辑
		$(document).on("change", "#editor-component input:radio[name='isedit']", function(a) {
			$("#widget-control .field-active").data("componentData").setIsEdit($(this).val())
		});
		// 金额控件选择货币
		$(document).on("change", "select[id='moneyType']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			$("#widget-control .field-active .form-amountbox .money_type_js").text("(" + a + ")");
			c.setMoneyType(a)
		});
		// 金额控件 转换大写金额
		$(document).on("click", "#editor-component #numberToChineseBtn", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setNumberToChinese(a)
		});
		// 金额控件 是否合计
		$(document).on("click", "#editor-component #isTotalBtn", function(a) {
			(a = $(this).is(":checked")) ? $(".f-mainTableField").removeClass("hide") : $(".f-mainTableField").addClass("hide");
			$("#widget-control .field-active").data("componentData").setIsTotal(a)
		});
		// 金额控件  主表字段
		$(document).on("change", "select[id='mainTableFields']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			c.setMainTableField(a)
		});
		// 金额控件，勾选计算
		$(document).on("click", "#editor-component #calculateBtn", function(a) {
			(a = $(this).is(":checked")) ? $(".f-calculate").removeClass("hide") : $(".f-calculate").addClass("hide");
			$("#widget-control .field-active").data("componentData").setIsEdit(!$(this).is(":checked"))
			$("#widget-control .field-active").data("componentData").setCalculate($(this).is(":checked"));
		});
		//金额、数值控件  小数位-1  金额(0-2)  数值(0-8)
		$(document).on("click", "#editor-component #decimalPlaceDel", function(a) {
			var f;
			a = $("#widget-control .field-active").data("componentData");
			a.componentSetup.componentKey == "NumberComponent"?f=8:f=2;
			var b = $.find("#decimalPlace")[0].innerText?$.find("#decimalPlace")[0].innerText:"2";
			var d = parseInt(b)-1; 
			d<0 ? l.notify("小数范围：0-"+f):($.find("#decimalPlace")[0].innerText = d,	a.setDecimalPlace(d));
		});
		//金额、数值控件 小数位+1 金额(0-2)  数值(0-8)
		$(document).on("click", "#editor-component #decimalPlaceAdd", function(a) {
			var f;
			a = $("#widget-control .field-active").data("componentData");
			a.componentSetup.componentKey == "NumberComponent"?f=8:f=2;
			var b = $.find("#decimalPlace")[0].innerText?$.find("#decimalPlace")[0].innerText:"2";
			var d = parseInt(b)+1; 
			d>f ? (l.notify("小数范围：0-"+f)):($.find("#decimalPlace")[0].innerText = d,	a.setDecimalPlace(d));
		});
		// 金额控件，添加监控字段
		$(document).off("click", ".j_addField").on("click", ".j_addField", function(a) {
			a = $("#widget-control .field-active").data("componentData");
			var c = $(a.tpl),
				b = $(this).parents(".j_choicelistEdit_number").find(".j_monitor_item:first").clone().show();
			b.find(".js_signField").text("A" + a.count + ":");
			b.find(".js_signField").attr("title", "A" + a.count);
			c = c.siblings("#j_operate_list").clone();
			c.find("input").attr("name", "operate-type-" + a.count);
			$(".j_choicelistEdit_number").append(c.html());
			$(".j_choicelistEdit_number").append(b);
			a = $("#widget-control .field-active").data("componentData");
			a.getFormula();
			a.count++;
			a.getFormula()
		});
		// 金额控件，删除监控字段
		$(document).off("click", ".j_delField").on("click", ".j_delField", function(a) {
			a = $(this).parents(".j_monitor_item");
			var c = $("#widget-control .field-active").data("componentData");
			if (2 > a.siblings().length) return l.notify("至少要监控一个"), !1;
			1 == a.prev().length ? a.prev().remove() : a.next().remove();
			a.remove();
			c.getFormula()
		});
		// 审批人控件，选择环节
		$(document).on("change", "select[id='approve_allActivitis']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			$("#widget-control .field-active .form-amountbox .money_type_js").text("(" + a + ")");
			c.setProcessActivity(a);
		});
		// 审批人控件，填写审批意见
		$(document).on("click", "#editor-component #approveOpinion", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setIsWriteApproveOpinion(a)
		});
		// (制单人控件、审批历史)勾选相关属性
		$(document).on("click", "#editor-component #isShowRelateAttr", function(a) {
			(a = $(this).is(":checked")) ? $(".f_relate_attr").removeClass("hide") : $(".f_relate_attr").addClass("hide");
			$("#widget-control .field-active").data("componentData").setIsShowRelateAttr(a);
		});
		// (制单人控件、审批历史)勾选 制单人部门
		$(document).on("click", "#editor-component #billmaker_department", function(a) {
			(a = $(this).is(":checked")) ? $(".billmaker_relate_attr").removeClass("hide") : $(".billmaker_relate_attr").addClass("hide");
			$("#widget-control .field-active").data("componentData").setBillMakerDept(a);
		});
		// (制单人控件、审批历史)勾选 制单人岗位
		$(document).on("click", "#editor-component #billmaker_post", function(a) {
			(a = $(this).is(":checked")) ? $(".billmaker_relate_attr").removeClass("hide") : $(".billmaker_relate_attr").addClass("hide");
			$("#widget-control .field-active").data("componentData").setBillMakerPost(a);
		});
		// (制单人控件、审批历史)勾选 制单人职务
		$(document).on("click", "#editor-component #billmaker_job", function(a) {
			(a = $(this).is(":checked")) ? $(".billmaker_relate_attr").removeClass("hide") : $(".billmaker_relate_attr").addClass("hide");
			$("#widget-control .field-active").data("componentData").setBillMakerJob(a);
		});
		// 制单人控件，勾选 制单人部门负责人
		$(document).on("click", "#editor-component #billmaker_depleader", function(a) {
			(a = $(this).is(":checked")) ? $(".billmaker_relate_attr").removeClass("hide") : $(".billmaker_relate_attr").addClass("hide");
			$("#widget-control .field-active").data("componentData").setBillMakerDeptLeader(a);
		});
		//审批历史  顺序
		$(document).on("change", "#editor-component input:radio[name='tOrder']", function(a) {
			a = $(this).val();
			$("#widget-control .field-active").data("componentData").setHistoryOrder(a)
		});
		// 编码控件，添加位数
		$(document).off("click", ".c_addDecimals").on("click", ".c_addDecimals", function(a) {
			var b = $(this).parents("#operate_show").find("#codeDecimals").text();
			if (b>8) return l.notify("位数不能大于9"), !1;
			a = $("#widget-control .field-active").data("componentData");
			a.addDecimals();
		});
		// 编码控件，删除位数
		$(document).off("click", ".c_delDecimals").on("click", ".c_delDecimals", function(a) {
			a = $(this).parents("#operate_show").find("#codeDecimals").text();
			var c = $("#widget-control .field-active").data("componentData");
			if (2 > a) return l.notify("位数至少大于0"), !1;
			c.delDecimals();
		});
		// 编码控件，编码规则 及字段
		$(document).off("change", ".j_select_codeRule,.j_select_fields").on("change", ".j_select_codeRule,.j_select_fields", function() {
			var a = $("#widget-control .field-active").data("componentData"),
				c = $(this);
			a.getcodeRuleFormula();
		});
		// 改变控件类型
		$(document).off("change", ".j_comptypeDiv .j_select_comptype").on("change", ".j_comptypeDiv .j_select_comptype", function() {
			//var a = $("#widget-control .field-active").data("componentData");
			var a = $("#widget-control .field-active");
			var oldcomponentSetup = a.data("componentData").componentSetup;//保存之前控件信息，如itemCode,itemId,itemKey信息
			var typeVal = $(this).val();
			var b = typeVal,
			b = new window[b];
			typeof oldcomponentSetup.title != "undefined" && (b.componentSetup.title = oldcomponentSetup.title);
			b.render(a);
			//增加原有信息
			typeof oldcomponentSetup.itemCode != "undefined" && (b.componentSetup.itemCode = oldcomponentSetup.itemCode);
			typeof oldcomponentSetup.itemId != "undefined" && (b.componentSetup.itemId = oldcomponentSetup.itemId);
			typeof oldcomponentSetup.itemKey != "undefined" && (b.componentSetup.itemKey = oldcomponentSetup.itemKey);
			a.data("componentData", b);
			a.addClass("field-active");
			$(document).trigger("renderEditor", a,"compTypeFlag");
		});
		// 是否为流式布局
		$(document).on("change", "#editor-component input:radio[name='isFlow-layout']", function(a) {
			a = $(this).val();
			$("#widget-control .field-active").data("componentData").setTableFlowlayout(a);
		});
		// 控件是否显示
		$(document).on("change", "#editor-component .isDisplayDiv input", function(a) {
			var parlabel = $(this).parent("label");
			if(typeof parlabel.attr("class")!="undefined" && parlabel.attr("class").indexOf("on_check")>=0){//取消选中状态
				parlabel.removeClass("on_check");
				$("#widget-control .field-active").removeClass("isdisplayCtl").addClass("isNotdisplayCtl");
				$("#widget-control .field-active").data("componentData").componentSetup.isDisplay=false;
				$("#widget-control .field-active").data("componentData").options.isDisplay=false;
			}else{//勾选选中状态
				parlabel.addClass("on_check");
				$("#widget-control .field-active").removeClass("isNotdisplayCtl").addClass("isdisplayCtl");
				$("#widget-control .field-active").data("componentData").componentSetup.isDisplay=true;
				$("#widget-control .field-active").data("componentData").options.isDisplay=true;
			}
		});
		// 控件标题是否显示
		$(document).on("change", "#editor-component .isLabelDisplayDiv input", function(a) {
			var parlabel = $(this).parent("label");
			if(typeof parlabel.attr("class")!="undefined" && parlabel.attr("class").indexOf("on_check")>=0){//取消选中状态
				parlabel.removeClass("on_check");
				$("#widget-control .field-active").removeClass("isLabelDisplayCtl").addClass("isLabelNotDisplayCtl");
				$("#widget-control .field-active").data("componentData").componentSetup.isLabelDisplay=false;
				$("#widget-control .field-active").data("componentData").options.isLabelDisplay=false;
			}else{//勾选选中状态
				parlabel.addClass("on_check");
				$("#widget-control .field-active").removeClass("isLabelNotDisplayCtl").addClass("isLabelDisplayCtl");
				$("#widget-control .field-active").data("componentData").componentSetup.isLabelDisplay=true;
				$("#widget-control .field-active").data("componentData").options.isLabelDisplay=true;
			}
		});
		// 公式是否显示
		$(document).on("change", "#editor-component input:checkbox[name='isFormula']", function(a) {
			var formulainput = $("#editor-component input:text[name='formula-content']");
			var formulavalue = $("#widget-control .field-active").data("componentData").componentSetup.formula;
			formulavalue !="" && formulainput.val(formulavalue);
			formulainput.toggle(
					function(){
						  $(this).removeClass("hide");
						  },
					function(){
						 $(this).addClass("hide");
						 $("#widget-control .field-active").data("componentData").componentSetup.formula="";
						 $("#widget-control .field-active").data("componentData").options.formula="";
						  }
             );
		});
		// 显示公式记录
		$(document).on("keydown", "input[name='formula-content']", function() {
			var value = $.trim($(this).val());
			$("#widget-control .field-active").data("componentData").componentSetup.formula=value;
			$("#widget-control .field-active").data("componentData").options.formula=value;
		});
		// 显示公式记录
		$(document).on("keyup", "input[name='formula-content']", function() {
			var value = $.trim($(this).val());
			$("#widget-control .field-active").data("componentData").componentSetup.formula=value;
			$("#widget-control .field-active").data("componentData").options.formula=value;
		});
		// 普通控件增加itemcode
		$(document).on("change", "#common-component-itemcode", function(a) {
			var itemcodeval = $(this).val();
			var regu =/^(?=view\.)[a-zA-Z]*/;
			var re = new RegExp(regu);
			if(re.test(itemcodeval)){
				$(this).removeClass("erroritemcode");
				$(this).siblings(".errormessdiv").hide();
				$("#widget-control .field-active").data("componentData").componentSetup.itemCode=itemcodeval;
			}else{
				//提示格式错误信息
				$(this).addClass("erroritemcode");
				$(this).siblings(".errormessdiv").show();
				$(this).val("");
			}
		});
		//---------------------参照监听事件----------------------
		//元数据参照选择
		$(document).on("change", "select[id='component_dataMeta_ref']", function(a) {
			//a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			var refdata = {
					md_entitypk:$(this.selectedOptions).attr('mdEntitypk'),
					pk_ref:$(this.selectedOptions).attr('refpk'),
					refcode:$(this.selectedOptions).attr('refcode'),
					refname:$(this.selectedOptions).attr('refname'),
					refurl:$(this.selectedOptions).attr('refurl'),
					refclass:$(this.selectedOptions).attr('refclass'),
					productType:$(this.selectedOptions).attr('productType')
			};
			//设置当前选中的元数据pk
			c.setContMeta(refdata);
		});
		// 是否允许多选
		$(document).on("click", "#editor-component #isMutiSelect", function(a) {
			a = $(this).is(":checked");
			if($("#widget-control .field-active").data("componentData").setIsMutiSelect){
				$("#widget-control .field-active").data("componentData").setIsMutiSelect(a)
			}
		});
	};
	// 修改select默认选中项
	c.changeFormOption = function() {
		var a = $("#widget-control .field-active").data("componentData"),
			c = $("#widget-control .field-active .choicelist_js");
		c.html("");
		if(a.componentSetup.componentKey =="CheckBox"){
			a.componentSetup.options && (a.componentSetup.checkboxCount=a.componentSetup.options.length);
			(a.componentSetup.options && a.componentSetup.options.length>1) ? (a.componentSetup.isMulticheckbox=true): (a.componentSetup.isMulticheckbox=false);
		}
		if(a.componentSetup.componentKey =="RadioBox"){
			a.componentSetup.options && (a.componentSetup.radioboxCount=a.componentSetup.options.length);
			(a.componentSetup.options && a.componentSetup.options.length>1) ? (a.componentSetup.isMultiradiobox=true): (a.componentSetup.isMultiradiobox=false);
		}
		var b = [];
		$("#editor-component ul.choicelistEdit_js").children().each(function(g) {
			var k = $(this).find(".option_js"),
				p = $(this).find(".optionName_js"),
				q = k.val(),
				k = k.is(":checked"),
				p = p.val(),
				h = !1;
			$(this).hasClass("otherOption_js") && (h = !0, p = "其他", q = "");
			q = new Option({
				name: p,
				order: g,
				index: 0,
				selectionId: q,
				defOption: k,
				other: h
			});
			q.render(c, a);
			b[g] = q.componentSetup
		});
		a.setOptions(b)
	};
	/**
	 * 加载业务对象树数据
	 */
	c.loadtreeData =function(){
		var param = {};
		//获取url中md_component_id信息
		var md_component_id = (function () {
			var search = location.search;
			component_id = '';
			if (!search) {
				return ""
			}
			search = search.slice(1).split('&')
			$.each(search, function (i, v){
				if (~v.indexOf('md_component_id=')) {
					component_id = v.split('=')[1];
					return false;
				}
			})
			return component_id;
		})();
		if(md_component_id!=""){
			c.pk_metadata = param.id = md_component_id;
		}else{
			param.id = c.pk_metadata;
		} 
		param.type="MD";
		$.ajax({
			type: "GET", 
			url: "/uitemplate_web/uitemplate_ctr/mdadptor_ctr/loadBusinessObj",  
			async:true,
			data:param,
			dataType: "json" ,
			beforeSend: function(e) {
				u.loading();
			},
			success: function(result) {
				var treeData = result;
				ztreedata = result;
				c.initTreeModel(treeData); //初始化业务对象树
			}
        })
	};
	/**
	 * 初始化业务对象树
	 */
	c.initTreeModel = function(treeData){
		var treeDom = $('#form-businessObj');
		var TimeFn=null;
        var nodeClick = function (event, treeId, treeNode) {
			//单击展开树
			clearTimeout(TimeFn); //setTimeout用来屏蔽连续2次单击变成单击事件
			TimeFn = setTimeout(function() {
				var zTree = $.fn.zTree.getZTreeObj("form-businessObj");
				zTree.expandNode(treeNode,null, false,false,false);
				//根节点增加样式
				$("#form-businessObj").find("li .root_open").siblings("a").find("span:first-child").addClass("rootTreenode");
				$("#form-businessObj").find("li .root_close").siblings("a").find("span:first-child").addClass("rootTreenode");
				$("#form-businessObj").find("li .roots_open").siblings("a").find("span:first-child").addClass("rootTreenode");
				$("#form-businessObj").find("li .roots_close").siblings("a").find("span:first-child").addClass("rootTreenode");
	        }, 200);
        }
		//树的双击事件
		var nodeDblClick = function (event, treeId, treeNode) {
			clearTimeout(TimeFn);
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
                    onClick: nodeClick,
                    //onMouseDown: zTreeOnDrag//拖动选中节点
                },
                view: {
                    selectedMulti: true,
					dblClickExpand: false //屏蔽双击展开事件
                }
            };
        function zTreeOnDrag(event, treeId, treeNodes) {
        	var zTree = $.fn.zTree.getZTreeObj("form-businessObj");
        	if(treeNodes!=null && treeNodes.pid!=null){//非根节点拖拽
	        	 zTree.selectNode(treeNodes);
        	}else{
        		//zTree.cancelSelectedNode();
        	}
        };
        $.fn.zTree.init(treeDom, setting, treeData);
        var zTree = $.fn.zTree.getZTreeObj("form-businessObj");
        var nodes;
		if(zTree){
			nodes = zTree.transformToArray(zTree.getNodes());
		}
		zTree.expandAll();
		zTree.expandNode(nodes[0],true, false,false,false);
		
		$.each(nodes, function(index, value) { 
			var nodeName = value.name;
			var nodepk = value.id;
			var pid = value.pid;
			var ctrlType = value.ctrltype;
			var nodeCode = value.code;
			var entityId = value.entityId;
			var itemPk = value.pk;
			var itemselectType = value.select_type;
			var itemselectOptions = "";
			//JSON.stringify(value.select_options) != "{}"
			if(typeof value.select_options !='undefined' && value.select_options.length>0){
				itemselectOptions = JSON.stringify(value.select_options);
			}
			
			if($("#form-businessObj").find("li a[title='"+nodeName+"'] span:last-child").length>1){
				var count = $("#form-businessObj").find("li a[title='"+nodeName+"'] span:last-child[titleflag='flag']").length;
				$($("#form-businessObj").find("li a[title='"+nodeName+"'] span:first-child")[count]).attr({"componentType":ctrlType});
				$($("#form-businessObj").find("li a[title='"+nodeName+"'] span:last-child")[count]).attr({"itemselectType":itemselectType,"itemselectOptions":itemselectOptions,"ctrlType":ctrlType,"nodepk":nodepk,"nodeName":nodeName,"nodeCode":nodeCode,"pid":pid,"entityId":entityId,"itemPk":itemPk,"titleflag":"flag"});
				$($("#form-businessObj").find("li a[title='"+nodeName+"']")[count]).parent().attr({"title":nodeName});
			}else{
				$("#form-businessObj").find("li a[title='"+nodeName+"'] span:first-child").attr({"componentType":ctrlType});
				$("#form-businessObj").find("li a[title='"+nodeName+"'] span:last-child").attr({"itemselectType":itemselectType,"itemselectOptions":itemselectOptions,"ctrlType":ctrlType,"nodepk":nodepk,"nodeName":nodeName,"nodeCode":nodeCode,"pid":pid,"entityId":entityId,"itemPk":itemPk});
				$("#form-businessObj").find("li a[title='"+nodeName+"']").parent().attr({"title":nodeName});
			}
		}); 
		//根节点增加样式
		$("#form-businessObj").find("li .root_open").siblings("a").find("span:first-child").addClass("rootTreenode");
		$("#form-businessObj").find("li .root_close").siblings("a").find("span:first-child").addClass("rootTreenode");
		$("#form-businessObj").find("li .roots_open").siblings("a").find("span:first-child").addClass("rootTreenode");
		$("#form-businessObj").find("li .roots_close").siblings("a").find("span:first-child").addClass("rootTreenode");
		c.componentDraggableEvents();
		//给拖拽树添加滚动条
		function a(c) {
			if (!(0 >= c.length)) {
				var b = c.attr("marginbottom") || 0,
					d = c.offset().top,
					e = $(window).height();
				c.height(e - d - b);
				b = c.attr("theme") ? c.attr("theme") : "darkblue";
				c.hasClass("mCustomScrollbar") || c.mCustomScrollbar({
					theme: b
				})
			}
		}
		a($("#form-businessObj.j_scroll_editNew"));
		$(window).off("resize.formlayout").on("resize.formlayout", function(a) {
			c.calculateHeight();
			setTimeout(function() {
				$("body div#form-businessObj.scroll-wrapperNew").each(function(a) {
					$(this).trigger("resizeSroll", a)
				})
			}, 100)
		});
		$("body").off("resizeSroll").on("resizeSroll", "div#form-businessObj.scroll-wrapperNew", function(a) {
			a = $(this);
			if (a.attr("horizontal")) {
				var c = $(window).width(),
					b = a.offset().left;
				a.css("width", c - b)
			} else {
				var c = $(window).height(),
					b = a.attr("marginbottom") || 0,
					d = a.offset().top;
				a.css("height", c - d - b)
			}
			a.mCustomScrollbar("update")
		});
		$(window).resize();
		u.hideLoading(); //隐藏风车转	
	}
	// 控件拖拽区事件
	c.componentDraggableEvents = function() {
		c.fromAndColPanelSortable();
		c.subFromSortable();
		// 表单控件区拖拽(常用)
		$("#form-widget-list .drag-into-layout .widget-item").not('.hr').draggable({
			connectToSortable: "#widget-control,.subtr_js td",
			helper: "clone",
			opacity: .8,
			appendTo: "body",
			start: function(a, b) {
				c.showFormGuideImg(false);
				c.currentDrag = $(this);
				$(".ui-draggable-dragging").css({
					height: "auto",
					"float": "none",
					width: "270px"
				})
			}
		}).disableSelection();
		// 表单控件区拖拽(系统)
		$("#form-testwidget-list .drag-into-layout .widget-item").not('.hr').draggable({
			connectToSortable: "#widget-control,.subtr_js td",
			helper: "clone",
			opacity: .8,
			appendTo: "body",
			start: function(a, b) {
				c.showFormGuideImg(false);
				c.currentDrag = $(this);
				$(".ui-draggable-dragging").css({
					height: "auto",
					"float": "none",
					width: "270px"
				})
			}
		}).disableSelection();
		// 业务对象拖拽
		$("#form-businessObj li ").not('.hr').draggable({
			connectToSortable: "#widget-control,.subtr_js td",
			helper: "clone",
			opacity: .8,
			appendTo: "body",
			start: function(a, b) {
				c.showFormGuideImg(false);
				c.currentDrag = $(this);
				$(".ui-draggable-dragging").css({
					height: "auto",
					"float": "none",
					width: "270px"
				})
			}
		}).disableSelection();
		// 布局区拖拽
		$("#layout-widget-list .widget-item").draggable({
			connectToSortable: "#widget-control",
			helper: "clone",
			appendTo: "body",
			start: function(a, b) {
				c.showFormGuideImg(false);
				c.currentDrag = $(this);
				$(".ui-draggable-dragging").css({
					height: "auto",
					"float": "none",
					width: "270px"
				})
			},
			stop: function(a, c) {}
		}).disableSelection()
	};
	c.myBrowser = function(){
		    var userAgent = navigator.userAgent;
		    var isOpera = userAgent.indexOf("Opera") > -1;
		    if (isOpera) {
		        return "Opera";
		    }else if (userAgent.indexOf("Firefox") > -1) {
		        return "FF";
		    }else if (userAgent.indexOf("Chrome") > -1){
		        return "Chrome";
		    }else if (userAgent.indexOf("Safari") > -1) {
		        return "Safari";
		    }else if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
		        return "IE";
		    }; //判断是否IE浏览器
	};
	//判断业务对象树是否是重复拖拽
	c.duplicateDetection = function(a) {
		var dupflag = false; //默认不是重复拖拽
		var dragctrltype = $(a.find("span:last-child")[0]).attr('ctrltype');
		var nodecode = $(a.find("span:last-child")[0]).attr('nodecode');
		if(dragctrltype=="DataTable"){
			dupflag = $("#formContent").find("div[nodecode*='"+nodecode+"']").length>0?true:false;
		}else if(dragctrltype=="TableLayout"){
			var leafnodecount = $("#widget-control > div[nodecode]").length;//所有叶子节点个数
			var viewcount = $("#widget-control > div[nodecode^='view']").length;//自定义叶子节点个数
			dupflag = leafnodecount+viewcount>0?true:false;
		}else{
			dupflag = $("#formContent").find("div[nodecode='"+nodecode+"']").length>0?true:false;
		}
		if(dupflag) {return true;} else{return false;}//如果是重复拖拽返回true
	};
	//判断是否是往表格、子表、2列、3列、分组布局中拖放复杂对象
	c.dragTargetDetection = function(b) {
		var countli = $("#widget-control > li").length;
		var countgrouptable = $($("#widget-control li[class*='ui-draggable']")[0]).parent().attr("class").indexOf("groupTable_js");//排除是向分组布局拖拽
		if(countli>0){
			return false;
		}else if(countgrouptable>=0){
			return false;
		}else{
			return true;
		}
	};
	//业务对象树重新排序
	c.sortableBeforeProcess = function(sortData) {
		var zTree = $.fn.zTree.getZTreeObj("form-businessObj");
		if("DataTable"==sortData.attr("componentkey")){//如果是左侧子表拖拽
			u.hideLoading();
			return;
		}else if(sortData.find("ul").length==0 || "Reference"==sortData.find("a:first > span:last").attr("ctrltype")){//如果拖拽的是叶子节点或是参照节点不进行排序
			var selectedNodes=new Array()
			if(zTree.getSelectedNodes().length>0){//多点拖拽
				selectedNodes = zTree.getSelectedNodes();
			}else{//单点拖拽
				var nodecode = sortData.find("a:first>span:last").attr("nodecode");
				var dragnode = zTree.getNodeByParam('code',nodecode);
				//zTree.selectNode(dragnode);
				selectedNodes.push(dragnode);
			}
			zTree.cancelSelectedNode();
			c.businessObjectTable(selectedNodes);
			u.hideLoading();
		}else{
			var view = '<div class="sort-dialog" >';
			view += '<div class="modal-content reject-content">';
			view += '<div class="modal-header sort-header">业务对象设置<a class="sort-dialog-close" title="点击关闭" href="javascript:void(0)" data-dismiss="modal"><i class="UIT-iconfont UIT-cancel02 sort-dialog-cancel-i"/></i></a></div>';		
			view += '<div class="modal-body" style="padding: 35px 28px 35px 28px;overflow-y: visible;">';
			view += '<table class="table table-striped table-bordered table-hover js-table" role="grid" id="sort_table" data-use-row-attr-func="true" data-reorderable-rows="true" data-toggle="table" data-url="">';
			view += '<thead role="rowgroup">';
			view += '<tr role="row" style="height:30px;font-size: 12px;font-weight: bold;color: #333333;">';
			view += '<th role="columnheader" data-filed="20160000000001" rowspan="1" field="20160000000001" index="0" visibleindex="0">';
			view += '<div style="position:relative;">';
			view += '</div></div>';
			view += '</th>';		
			view += '</tr>';		
			view += '</thead>';			
			view += '<tbody role="rowgroup" style="font-size: 12px;color: #666666;">';	
			view += '</tbody>';	
			view += '</table>';
			view += '     </div>';
			view += '<div class="sort-footer"><button id="sort-cancel-btn" btntype="okBtn" type="button" class="btn btn-sm sort-cancel-bn" data-dismiss="modal" >取消</button><button id="sort-sure-btn" btntype="okBtn" type="button" class="btn btn-sm sort-sure-bn" data-dismiss="modal" >确定</button></div>';
			view += '</div>';
			view += '</div>';
			view += '</div>';
			$("#sortdialog").empty().append($(view));
			$("#sortdialog").css("z-index","3000");
			
			var treeData=new Array();
			var dragtype = sortData.find("a:first>span:last").attr("ctrltype");
			var nodeselcetcount = zTree.getSelectedNodes().length;
			var selectedNodes=new Array();
			if(nodeselcetcount<=0 || (nodeselcetcount==1 && dragtype=="TableLayout")){
				if(dragtype=="DataTable"){//单独子表拖拽
					var nodecode = sortData.find("a:first>span:last").attr("nodecode");
					var dragnode = zTree.getNodeByParam('code',nodecode);
					selectedNodes.push(dragnode);
					treeData.push(selectedNodes[0]);
					sortdatabefore =JSON.stringify(dragnode);
				}else{
					//根节点拖拽
					zTree.setting.view.expandSpeed = "";
					zTree.expandAll(true);
					zTree.setting.view.expandSpeed = "fast";
					selectedNodes = $.fn.zTree.getZTreeObj("form-businessObj").getNodes();
					treeData=selectedNodes[0].children;
					sortdatabefore =JSON.stringify(selectedNodes);
				}
			}else{//多节点拖拽
				selectedNodes = $.fn.zTree.getZTreeObj("form-businessObj").getSelectedNodes();
				sortdatabefore =JSON.stringify(selectedNodes);
				for(var i=0;i<selectedNodes.length;i++){
	            	if(typeof selectedNodes[i].children !='undefined'){//非叶子节点
	            		//var tempchildren = selectedNodes[i].children;
	            		Array.prototype.push.apply(treeData, $(selectedNodes[i]));
	            		//Array.prototype.push.apply(treeData, tempchildren); 
	            	}
	            }
			}
			var selectrow=null;//当前操作行
			var browserType = c.myBrowser();
			$('#sort_table').bootstrapTable('destroy').bootstrapTable({
				detailView: true,
				data: treeData,
				//height: 460,
				columns: [{
					field: 'cid',
					title: '序号',
					formatter: function (value, row, index) {
						return index+1;
					},
					width:'6%'
				},{
					field: 'id',
					title: 'id',
					visible: false
				},{
					field: 'name',
					title: '名称',
					width:'18%',
                    class:'tablename cursorclass'
				},{
					field: 'code',
					title: '控件编码',
					width:'18%',
					class:'tablecode'
				},{
					field: 'ctrltype',
					title: '控件类型',
					width:'20%',
					formatter: function (value, row, index) {
						if(row.ctrltype=="DataTable" || row.ctrltype=="Table" || row.ctrltype=="Grid" || row.ctrltype=="Form"){//子表
							/*return '<div class="tableselectdiv"><select class="tableselect" style="width:90%;"><option selected="selected">Table类型</option><option>Grid类型</option><option>Form类型</option></select></div>';*/
							return '<div class="tableselectdiv"><select class="tableselect" style="width:100%;"><option selected="selected">Table类型</option><option>Form类型</option></select></div>';
						}else{
							var ctrltype = row.ctrltype;
							var selectoptions = c.generatorSelectOptions(ctrltype);
							var optionsbegin = '<div class="tableselectdiv"><select class="tableselect" style="width:100%;">';
							return optionsbegin+selectoptions;
						}
					}
				},{
					field: 'is_hidden',
					title: '是否隐藏',
					width:'10%',
					class:'sort_hid_td',
					formatter: function (value, row, index) {
						if(row.ctrltype!="TableLayout" && row.ctrltype!="DataTable"){
							if(row.is_hidden=="N"){
								return '<input type="checkbox" class="hiddenBox"/>';
							}else{
								return '<input type="checkbox" class="hiddenBox" checked="checked"/>';
							}
						}
					}
				},{
					field: 'moveup',
					title: '上移',
					width:'10%',
					class:"UIT-iconfont moveup sortdialog-movecss",
					formatter: function (value, row, index) {
						if(!row.isFirstNode){
							return '&#xe600';
						}else{
							return "";
						}
					}
				},{
					field: 'movedown',
					title: '下移',
					width:'10%',
					class:'UIT-iconfont movedown sortdialog-movecss',
					formatter: function (value, row, index) {
						if(!row.isLastNode){
							return '&#xe61b';
						}else{
							return "";
						}
					}
				}],
	          onDblClickCell:function(a,b,c,d){
	        	  if(typeof d.attr("class") !="undefined" && d.attr("class").indexOf("tablename")>=0){
	        		  d.attr("contentEditable",true);
	        		  d.css("cursor","text");
	        		//兼容IE9及以上
	        		  if(browserType=="IE"){
	        			  if(d.find("div[class='iediv']").length<=0){
	        				  var editdiv=document.createElement("div");
	        				  editdiv.innerHTML=d.text();
	        				  editdiv.setAttribute("class", "iediv");
	        				  editdiv.setAttribute("contentEditable", true);
	        				  d.text("");
	        				  d.append(editdiv);
	        			  }
	        		  }
	        	  }
	          },
	          onClickCell:function(a,b,c,d){
	        	  selectrow = c;
	        	  if(typeof d.attr("class") !="undefined" && d.attr("class").indexOf("moveup")>=0 && d.parent().prev().length>0){
	          		  //页面行交换
	          		  var row1 = d.parent();
	          		  var row2 = d.parent().prev();
	          		  if(row1.find("a[class='detail-icon']").length!=row2.find("a[class='detail-icon']").length){//跨节点类型排序
	          			  l.notify("不能跨表排序");
	          			  return;
	          		  }
	          		  for (var i=0;i<row1.children("td").length;i++)
	          		  {
	          		     if(i==4 || i==5){//select、checkbox交换列
	          		    	 var temp=row1.children("td").eq(i).html();
	          		    	 row1.children("td").eq(i).html(row2.children("td").eq(i).html());
	          		    	 row2.children("td").eq(i).html(temp);
	          		     }else if(i==6){//上移交换列
	          		    	 if(row2.children("td").eq(i).html()==""){
	          		    	 }else{
	          		    		 var temp=row1.children("td").eq(i).html();
	          		    		 row1.children("td").eq(i).html(row2.children("td").eq(i).html());
	          		    		 row2.children("td").eq(i).html(temp);
	          		    	 }
	          		     }else if(i==7){//下移交换列
	          		    	 if(row1.children("td").eq(i).html()==""){
	          		    	 }else{
	          		    		 var temp=row1.children("td").eq(i).html();
	          		    		 row1.children("td").eq(i).html(row2.children("td").eq(i).html());
	          		    		 row2.children("td").eq(i).html(temp);
	          		    	 }
	          		     }else if(i!=0){
	          		    	var temp=row1.children("td").eq(i).text();
	          		    	 row1.children("td").eq(i).text(row2.children("td").eq(i).text());
	          		    	 row2.children("td").eq(i).text(temp);
	            		    	
	          		     }
	          		  } 
	          		  
	          		  //交换行select元素绑定change事件
	          		  row1.find("select").change(function(){

	          		    var newctrltype=$(this).children('option:selected').val();//新选中的值 
	          			    for(var i=0;i<($(this).children()).length;i++){
	          			    	if($($(($(this).children())[i])[0]).val()==newctrltype){
	          			    		$($(($(this).children())[i])[0]).attr("selected",true);
	          			    	}else{
	          			    		$($(($(this).children())[i])[0]).attr("selected",false);
	          			    	}
	          			    }
	          			    
	          			    var rowcode = selectrow.code;
	          			    var alldata = $('#sort_table').data('bootstrap.table').data;
	          	    		for (var n=0;n<alldata.length;n++)
	          	  		{
	          	  			  if(alldata[n].code==rowcode){
	          	  				  alldata[n].ctrltype=newctrltype;
	          	  				  break;
	          	  			  }
	          	  		}
	          		
	          		  });
	          		  row2.find("select").change(function(){
	          		    var newctrltype=$(this).children('option:selected').val();//新选中的值 
	          			    for(var i=0;i<($(this).children()).length;i++){
	          			    	if($($(($(this).children())[i])[0]).val()==newctrltype){
	          			    		$($(($(this).children())[i])[0]).attr("selected",true);
	          			    	}else{
	          			    		$($(($(this).children())[i])[0]).attr("selected",false);
	          			    	}
	          			    }
	          			    
	          			    var rowcode = selectrow.code;
	          			    var alldata = $('#sort_table').data('bootstrap.table').data;
	          	    		for (var n=0;n<alldata.length;n++)
	          	  		{
	          	  			  if(alldata[n].code==rowcode){
	          	  				  alldata[n].ctrltype=newctrltype;
	          	  				  break;
	          	  			  }
	          	  		}
	          		
	          		  });
	          		  
	          		  //data更新
	          	      var tableBs = $('#sort_table');
	            		  var alldata = tableBs.data('bootstrap.table').data;
	          		  for (var h=0;h<alldata.length;h++)
	          		  {
	          			  if(alldata[h].code==c.code){
	          				  var temp=alldata[h-1];
	          				  alldata[h-1]=alldata[h];
	          				  alldata[h]=temp;
	          				  break;
	          			  }
	          		  } 
	          		  tableBs.data('bootstrap.table').data=alldata;
	          		  
	          	  }else if(typeof d.attr("class") !="undefined" && d.attr("class").indexOf("movedown")>=0 && d.parent().next().length>0){
	          		  var row1 = d.parent();
	          		  var row2 = d.parent().next();
	          		  if(row1.find("a[class='detail-icon']").length!=row2.find("a[class='detail-icon']").length){//跨节点类型排序
	          			  l.notify("不能跨表排序");
	          			  return;
	          		  }
	          		  for (var j=0;j<row1.children("td").length;j++)
	          		  {
	          			  if(j==4 || j==5){//select、checkbox交换列
	    	        		      temp=row1.children("td").eq(j).html();
	    	        		      row1.children("td").eq(j).html(row2.children("td").eq(j).html());
	    	        		      row2.children("td").eq(j).html(temp);
	    	        	 }else if(j==6){//上移交换列
	          		    	 if(row1.children("td").eq(j).html()==""){
	          		    	 }else{
	          		    		 var temp=row1.children("td").eq(j).html();
	          		    		 row1.children("td").eq(j).html(row2.children("td").eq(j).html());
	          		    		 row2.children("td").eq(j).html(temp);
	          		    	 }
	          		     }else if(j==7){
	    	        		 if(row2.children("td").eq(j).html()==""){
	          		    	 }else{
	          		    		 var temp=row1.children("td").eq(j).html();
	          		    		 row1.children("td").eq(j).html(row2.children("td").eq(j).html());
	          		    		 row2.children("td").eq(j).html(temp);
	          		    	 }
	    	        	 }else if(j!=0){
	          		    	  temp=row1.children("td").eq(j).text();
	    		        	  row1.children("td").eq(j).text(row2.children("td").eq(j).text());
	    		        	  row2.children("td").eq(j).text(temp);
	          		     }
	          		   
	          		  }
	          		  
	          		  //交换行select元素绑定change事件
	          		  row1.find("select").change(function(){
	          		    var newctrltype=$(this).children('option:selected').val();//新选中的值 
	          			    for(var i=0;i<($(this).children()).length;i++){
	          			    	if($($(($(this).children())[i])[0]).val()==newctrltype){
	          			    		$($(($(this).children())[i])[0]).attr("selected",true);
	          			    	}else{
	          			    		$($(($(this).children())[i])[0]).attr("selected",false);
	          			    	}
	          			    }
	          			    
	          			    var rowcode = selectrow.code;
	          			    var alldata = $('#sort_table').data('bootstrap.table').data;
	          	    		for (var n=0;n<alldata.length;n++)
	          	  		{
	          	  			  if(alldata[n].code==rowcode){
	          	  				  alldata[n].ctrltype=newctrltype;
	          	  				  break;
	          	  			  }
	          	  		}
	          		
	          		  });
	          		  row2.find("select").change(function(){
	          		    var newctrltype=$(this).children('option:selected').val();//新选中的值 
	          			    for(var i=0;i<($(this).children()).length;i++){
	          			    	if($($(($(this).children())[i])[0]).val()==newctrltype){
	          			    		$($(($(this).children())[i])[0]).attr("selected",true);
	          			    	}else{
	          			    		$($(($(this).children())[i])[0]).attr("selected",false);
	          			    	}
	          			    }
	          			    
	          			    var rowcode = selectrow.code;
	          			    var alldata = $('#sort_table').data('bootstrap.table').data;
	          	    		for (var n=0;n<alldata.length;n++)
	          	  		{
	          	  			  if(alldata[n].code==rowcode){
	          	  				  alldata[n].ctrltype=newctrltype;
	          	  				  break;
	          	  			  }
	          	  		}
	          		
	          		  });
	          		  
	          		//data更新
	          	      var tableBs = $('#sort_table');
	            		  var alldata = tableBs.data('bootstrap.table').data;
	          		  for (var n=0;n<alldata.length;n++)
	          		  {
	          			  if(alldata[n].code==c.code){
	          				  var temp=alldata[n+1];
	          				  alldata[n+1]=alldata[n];
	          				  alldata[n]=temp;
	          				  break;
	          			  }
	          		  } 
	          		  tableBs.data('bootstrap.table').data=alldata;
	          	  }else if(d.find("input").length>0 && d.find("input").attr("type")=="checkbox"){//处理是否隐藏列数据
	        		  if(typeof d.find("input").attr("checked")=="undefined"){
	        			  d.find("input").attr("checked","checked");
	        		  }else{
	        			  d.find("input").removeAttr("checked");
	        		  }
	        		  if(c.is_hidden=="Y"){
	        			  c.is_hidden="N";
	        		  }else if(c.is_hidden=="N"){
	        			  c.is_hidden="Y"
	        		  }
	        	  }
	          },
              //注册加载子表的事件。注意下这里的三个参数！
              onExpandRow: function (index, row, $detail) {
            	  if(row.ctrltype.indexOf("类型")>=0){
            		  row.ctrltype = row.ctrltype.substring(0,row.ctrltype.length-2);
          	      }
            	  if(row.ctrltype=="DataTable" || row.ctrltype=="Table" || row.ctrltype=="Grid" || row.ctrltype=="Form"){
            		  c.initSubTable(index,row,$detail);
            	  }
              }
	          
			});				
			//显示排序框
			if(browserType=="FF"){
				$('#sortdialog').modal({
				});
			}else{
				$('#sortdialog').modal({
					backdrop: false
				});
			}
			
			$(document).on("click", "#sort-sure-btn", function() {
				//隐藏modal
				$('#sortdialog').hide();
				setTimeout(c.businessObjectTableDelayFun,"1");
				
			});
			$(document).on("click", ".sort-dialog-close,#sort-cancel-btn", function() {
				$('#sortdialog').hide();
				setTimeout(c.businessObjectTableCloseDelayFun,"1");
				
			});
			//主节点监听
			$('.tableselect').change(function(){ 
			    var newctrltype=$(this).children('option:selected').val();//新选中的值 
			    for(var i=0;i<($(this).children()).length;i++){
			    	if($($(($(this).children())[i])[0]).val()==newctrltype){
			    		$($(($(this).children())[i])[0]).attr("selected",true);
			    	}else{
			    		$($(($(this).children())[i])[0]).attr("selected",false);
			    	}
			    }
			    
			    var rowcode = selectrow.code;
			    var alldata = $('#sort_table').data('bootstrap.table').data;
	      		for (var n=0;n<alldata.length;n++)
	    		{
	    			  if(alldata[n].code==rowcode){
	    				  alldata[n].ctrltype=newctrltype;
	    				  break;
	    			  }
	    		}
	      		//$($(this).children('option:selected')).attr("selected",true);
		    });
		}
};
c.initSubTable = function (index,row,$detail) {
	var browserType = c.myBrowser();
    var parentid = row.MENU_ID;
    var cur_table = $detail.html('<table class='+row.pk+'></table>').find('table');
    $(cur_table).bootstrapTable({
    	data: row.children,
        columns: [{
			field: 'cid',
			title: '序号',
			formatter: function (value, row, index) {
				return index+1;
			},
			width:'6%'
		},{
			field: 'id',
			title: 'id',
			visible: false
		},{
			field: 'name',
			title: '名称',
			width:'18%',
            class:'tablename cursorclass'
		},{
			field: 'code',
			title: '控件编码',
			width:'18%',
			class:'tablecode'
		},{
			field: 'ctrltype',
			title: '控件类型',
			width:'20%',
			class:'tablectrl',
			formatter: function (value, row, index) {
				if(row.ctrltype=="DataTable" || row.ctrltype=="Table" || row.ctrltype=="Grid" || row.ctrltype=="Form"){//子表
					/*return '<div class="tableselectdiv"><select class="tableselect"><option selected="selected">Table类型</option><option>Grid类型</option><option>Form类型</option></select></div>';*/
					return '<div class="tableselectdiv"><select class="tableselect" style="width:100%;"><option selected="selected">Table类型</option><option>Form类型</option></select></div>';
				}else{
					var ctrltype = row.ctrltype;
					var selectoptions = c.generatorSelectOptions(ctrltype);
					var optionsbegin = '<div class="tableselectdiv"><select class="childtableselect" style="width:100%;">';
					return optionsbegin+selectoptions;
				}
			}
		},{
			field: 'is_hidden',
			title: '是否隐藏',
			width:'7%',
			class:'sort_hid_td',
			formatter: function (value, row, index) {
				if(row.ctrltype!="TableLayout" && row.ctrltype!="DataTable"){
					if(row.is_hidden=="N"){
						return '<input type="checkbox" class="hiddenBox"/>';
					}else{
						return '<input type="checkbox" class="hiddenBox" checked="checked"/>';
					}
				}
			}
		},{
			field: 'moveup',
			title: '上移',
			width:'7%',
			class:"UIT-iconfont moveup sortdialog-movecss",
			formatter: function (value, row, index) {
				if(!row.isFirstNode){
					return '&#xe600';
				}else{
					return "";
				}
			}
		},{
			field: 'movedown',
			title: '下移',
			width:'7%',
			class:'UIT-iconfont movedown sortdialog-movecss',
			formatter: function (value, row, index) {
				if(!row.isLastNode){
					return '&#xe61b';
				}else{
					return "";
				}
			}
		}],

        onDblClickCell:function(a,b,c,d){
      	  if(typeof d.attr("class") !="undefined" && d.attr("class").indexOf("tablename")>=0){
      		  d.attr("contentEditable",true);
      		  d.css("cursor","text");
      		//兼容IE9及以上
    		  if(browserType=="IE"){
    			  if(d.find("div[class='iediv']").length<=0){
    				  var editdiv=document.createElement("div");
    				  editdiv.innerHTML=d.text();
    				  editdiv.setAttribute("class", "iediv");
    				  editdiv.setAttribute("contentEditable", true);
    				  d.text("");
    				  d.append(editdiv);
    			  }
    		  }
      	  }
        },
        onClickCell:function(a,b,c,d){
      	  selectrow = c;
      	  if(typeof d.attr("class") !="undefined" && d.attr("class").indexOf("moveup")>=0 && d.parent().prev().length>0 && c.ctrltype!="DataTable" && c.ctrltype!="TableLayout"){
      		  //页面行交换
      		  var row1 = d.parent();
      		  var row2 = d.parent().prev();
      		  for (var i=0;i<row1.children("td").length;i++)
      		  {
      		     if(i==3 || i==4){//select、checkbox交换列
      		    	 temp=row1.children("td").eq(i).html();
      		    	 row1.children("td").eq(i).html(row2.children("td").eq(i).html());
      		    	 row2.children("td").eq(i).html(temp);
      		     }else if(i==5){
      		    	if(row2.children("td").eq(i).html()==""){
     		    	 }else{
     		    		 var temp=row1.children("td").eq(i).html();
     		    		 row1.children("td").eq(i).html(row2.children("td").eq(i).html());
     		    		 row2.children("td").eq(i).html(temp);
     		    	 }
      		     }else if(i==6){//下移交换列
      		    	 if(row1.children("td").eq(i).html()==""){
      		    	 }else{
      		    		 var temp=row1.children("td").eq(i).html();
      		    		 row1.children("td").eq(i).html(row2.children("td").eq(i).html());
      		    		 row2.children("td").eq(i).html(temp);
      		    	 }
      		     }else{
      		    	 temp=row1.children("td").eq(i).text();
      		    	 row1.children("td").eq(i).text(row2.children("td").eq(i).text());
      		    	 row2.children("td").eq(i).text(temp);
        		    	
      		     }
      		  } 
      		  
      		  //元素绑定change事件
      		  row1.find("select").change(function(){
      			var browserType = c.myBrowser();
    			if(browserType=="IE"){//兼容IE9浏览器
    				var newctrltype=$(this).children('option:selected').val();//新选中的值 
    				var index = $(this).children('option:selected').index();
    				var alloptions = $(this).children();
    				for (var i=0;i<alloptions.length;i++)
    	    		{
    					if($($(($(this).children())[i])[0]).val()==newctrltype){
    						($(this).children())[i].setAttribute("selected","selected");
    			    	}else{
    			    		($(this).children())[i].removeAttribute("selected");
    			    	}
    	    		}
    			}else{
    				$(this).find("option[selected]").removeAttr("selected");
    				var index = $(this).children('option:selected').index();
    				$(this).find("option:eq("+index+")").attr("selected",true);
    			}
    		});
      		  row2.find("select").change(function(){
      			var browserType = c.myBrowser();
    			if(browserType=="IE"){//兼容IE9浏览器
    				var newctrltype=$(this).children('option:selected').val();//新选中的值 
    				var index = $(this).children('option:selected').index();
    				var alloptions = $(this).children();
    				for (var i=0;i<alloptions.length;i++)
    	    		{
    					if($($(($(this).children())[i])[0]).val()==newctrltype){
    						($(this).children())[i].setAttribute("selected","selected");
    			    	}else{
    			    		($(this).children())[i].removeAttribute("selected");
    			    	}
    	    		}
    			}else{
    				$(this).find("option[selected]").removeAttr("selected");
    				var index = $(this).children('option:selected').index();
    				$(this).find("option:eq("+index+")").attr("selected",true);
    			}
    		});
	      		
      		  //data更新
      	      //var tableBs = $('#sort_table');
      		 var tableparent = d.parent().parent().parent();
      		 var parentclass = tableparent.attr("class").substring(0,tableparent.attr("class").indexOf(" "));
      		 var classstr = '.'+parentclass;
      		var tableBs = $(classstr);
        	  var alldata = tableBs.data('bootstrap.table').data;
      		  for (var h=0;h<alldata.length;h++)
      		  {
      			  if(alldata[h].code==c.code){
      				  var temp=alldata[h-1];
      				  alldata[h-1]=alldata[h];
      				  alldata[h]=temp;
      				  break;
      			  }
      		  } 
      		  tableBs.data('bootstrap.table').data=alldata;
      		  
      	  }else if(typeof d.attr("class") !="undefined" && d.attr("class").indexOf("movedown")>=0 && d.parent().next().length>0 && c.ctrltype!="DataTable" && c.ctrltype!="TableLayout"){
      		  var row1 = d.parent();
      		  var row2 = d.parent().next();
      		  for (var j=0;j<row1.children("td").length;j++)
      		  {
      			  if(j==3 || j==4){//select交换列
	        		      temp=row1.children("td").eq(j).html();
	        		      row1.children("td").eq(j).html(row2.children("td").eq(j).html());
	        		      row2.children("td").eq(j).html(temp);
	        	 }else if(j==5){//上移交换列
      		    	 if(row1.children("td").eq(j).html()==""){
      		    	 }else{
      		    		 var temp=row1.children("td").eq(j).html();
      		    		 row1.children("td").eq(j).html(row2.children("td").eq(j).html());
      		    		 row2.children("td").eq(j).html(temp);
      		    	 }
      		     }else if(j==6){
	      		    	if(row2.children("td").eq(j).html()==""){
	     		    	 }else{
	     		    		 var temp=row1.children("td").eq(j).html();
	     		    		 row1.children("td").eq(j).html(row2.children("td").eq(j).html());
	     		    		 row2.children("td").eq(j).html(temp);
	     		    	 }
	      		 }else{
      		    	  temp=row1.children("td").eq(j).text();
		        		  row1.children("td").eq(j).text(row2.children("td").eq(j).text());
		        		  row2.children("td").eq(j).text(temp);
      		     }
      		   
      		  }
      		  //交换行select元素绑定change事件
      		  row1.find("select").change(function(){
      			var browserType = c.myBrowser();
    			if(browserType=="IE"){//兼容IE9浏览器
    				var newctrltype=$(this).children('option:selected').val();//新选中的值 
    				var index = $(this).children('option:selected').index();
    				var alloptions = $(this).children();
    				for (var i=0;i<alloptions.length;i++)
    	    		{
    					if($($(($(this).children())[i])[0]).val()==newctrltype){
    						($(this).children())[i].setAttribute("selected","selected");
    			    	}else{
    			    		($(this).children())[i].removeAttribute("selected");
    			    	}
    	    		}
    			}else{
    				$(this).find("option[selected]").removeAttr("selected");
    				var index = $(this).children('option:selected').index();
    				$(this).find("option:eq("+index+")").attr("selected",true);
    			}
    		});
      		  row2.find("select").change(function(){
      			var browserType = c.myBrowser();
    			if(browserType=="IE"){//兼容IE9浏览器
    				var newctrltype=$(this).children('option:selected').val();//新选中的值 
    				var index = $(this).children('option:selected').index();
    				var alloptions = $(this).children();
    				for (var i=0;i<alloptions.length;i++)
    	    		{
    					if($($(($(this).children())[i])[0]).val()==newctrltype){
    						($(this).children())[i].setAttribute("selected","selected");
    			    	}else{
    			    		($(this).children())[i].removeAttribute("selected");
    			    	}
    	    		}
    			}else{
    				$(this).find("option[selected]").removeAttr("selected");
    				var index = $(this).children('option:selected').index();
    				$(this).find("option:eq("+index+")").attr("selected",true);
    			}
    		});
      		  
      		//data更新
      	     // var tableBs = $('#sort_table');
      		var tableparent = d.parent().parent().parent();
     		 var parentclass = tableparent.attr("class").substring(0,tableparent.attr("class").indexOf(" "));
     		 var classstr = '.'+parentclass;
     		var tableBs = $(classstr);
        		  var alldata = tableBs.data('bootstrap.table').data;
      		  for (var n=0;n<alldata.length;n++)
      		  {
      			  if(alldata[n].code==c.code){
      				  var temp=alldata[n+1];
      				  alldata[n+1]=alldata[n];
      				  alldata[n]=temp;
      				  break;
      			  }
      		  } 
      		  tableBs.data('bootstrap.table').data=alldata;
      	  }else if(d.find("input").length>0 && d.find("input").attr("type")=="checkbox"){//处理是否隐藏列数据
      		  if(typeof d.find("input").attr("checked")=="undefined"){
      			  d.find("input").attr("checked","checked");
      		  }else{
      			  d.find("input").removeAttr("checked");
      		  }
      		  if(c.is_hidden=="Y"){
      			  c.is_hidden="N";
      		  }else if(c.is_hidden=="N"){
      			  c.is_hidden="Y"
      		  }
      	  }
        }
    });
};
c.generatorSelectOptions = function(ctrltype){
	//var optionsbegin = '<div class="tableselectdiv"><select class="tableselect">';
	var optionsend = '</select></div>';
	var options = '';
	var classstr = $("#leftFormEdit_js").find(".widget-item.general_js[componentkey="+ctrltype+"]").attr("class");
	if(typeof classstr !=="undefined"){
		var classconditions=classstr.replace(/\ /g, ".");
		$("#form-widget-list").find("."+classconditions).each(function(index,val){
			if(ctrltype == $(val).attr("componentkey")){
				options +='<option value="' + $(val).attr("componentkey") + '" selected="selected">' + $(val).attr("componentkey")+'类型' + "</option>";
			}else{
				options +='<option value="' + $(val).attr("componentkey") + '">' + $(val).attr("componentkey")+'类型' + "</option>";
			}
		});
	}else{
		$("#form-widget-list").find(".widget-item.general_js").each(function(index,val){
			if(ctrltype == $(val).attr("componentkey")){
				options +='<option value="' + $(val).attr("componentkey") + '" selected="selected">' + $(val).attr("componentkey")+'类型' + "</option>";
			}else{
				options +='<option value="' + $(val).attr("componentkey") + '">' + $(val).attr("componentkey")+'类型' + "</option>";
			}
		});
	}
   return options+optionsend;
};
//子表类型，名称，是否隐藏属性修改
c.attrChangeProcess = function(sortTreeData,zTree) {
	var type = $("#widget-control").find("a:first>span:last").attr("ctrltype");
	var arrlength = sortTreeData.length;
	for(var i=0;i<arrlength;i++){
		if(typeof sortTreeData[i].ctrltype != undefined && ("DataTable"==sortTreeData[i].ctrltype || "Form"==sortTreeData[i].ctrltype || "Table"==sortTreeData[i].ctrltype || "Grid"==sortTreeData[i].ctrltype)){
			var dragnode = zTree.getNodeByParam('code',sortTreeData[i].code);
			dragnode.ctrltype=sortTreeData[i].ctrltype;
			dragnode.name=sortTreeData[i].name;
			dragnode.is_hidden=sortTreeData[i].is_hidden;
			
		}else{//普通节点
			var dragnode = zTree.getNodeByParam('code',sortTreeData[i].code);
			dragnode.ctrltype=sortTreeData[i].ctrltype;
			dragnode.name=sortTreeData[i].name;
			dragnode.is_hidden=sortTreeData[i].is_hidden;
		}
	}
	return sortTreeData;
};

c.sortdialogDataProcess = function(nodeselcetcount,dragtype) {
	var tablerows = $('#sort_table tbody tr[data-index]');
	var tabledata = $("#sort_table").bootstrapTable("getData");
	for(var i=0;i<tabledata.length;i++){
		var ctrltype = "";
		if(nodeselcetcount<=0 || (nodeselcetcount==1 && dragtype=="TableLayout") || (nodeselcetcount==1 && dragtype=="DataTable")){
			tabledata[i].name = $($('#sort_table > tbody > tr[data-index='+i+']')[0]).find("td[class*='tablename']").text();
			//ctrltype = $($('#sort_table tbody tr[data-index='+i+']')[0]).find("td option[selected]").text();
			var alloptions = $($('#sort_table > tbody > tr[data-index='+i+']')[0]).find("td select").children();
			for(var j=0;j<alloptions.length;j++){
				var option = $(alloptions[j]);
				if(typeof option.attr("selected")!="undefined"){
					ctrltype=option.val();
				}
			}
		}else{//多子表拖拽
			tabledata[i].name = $($('#sort_table tbody tr[data-index][class*="info"]')[i]).find("td[class*='tablename']").text();
			ctrltype = $($('#sort_table tbody tr[data-index][class*="info"]')[i]).find("td option[selected]").text();
		}
	    if(ctrltype.indexOf("类型")>=0){
	    	ctrltype = ctrltype.substring(0,ctrltype.length-2);
	    }
	    if(ctrltype=="DataTable"){
	    	tabledata[i].ctrltype="Table";
	    }else{
	    	tabledata[i].ctrltype=ctrltype;
	    }
	    if(ctrltype=="DataTable" || ctrltype=="Form" || ctrltype=="Table" || ctrltype=="Grid"){
	    	//判断子表是否展开修改
	    	var classstr = '.'+tabledata[i].pk;
	    	if(typeof $(classstr) !='undefined' && $(classstr).length>0 && typeof tabledata[i].children !='undefined'){
	    		for(var j=0;j<tabledata[i].children.length;j++){
	    			(tabledata[i].children)[j].name = $($(classstr).find('tbody tr td[class*="tablename"]')[j]).text();
	    			//var ctrltype=$($(classstr).find('tbody tr td[class*="tablectrl"]')[j]).find("select>option[selected]").text();
	    			var childalloptions = $($(classstr).find('tbody tr td[class*="tablectrl"]')[j]).find("select").children();
	    			for(var k=0;k<childalloptions.length;k++){
	    				var childoption = $(childalloptions[k]);
	    				if(typeof childoption.attr("selected")!="undefined"){
	    					ctrltype=childoption.val();
	    				}
	    			}
	    			if(ctrltype.indexOf("类型")>=0){
	    				ctrltype = ctrltype.substring(0,ctrltype.length-2);
	    			}
	    			(tabledata[i].children)[j].ctrltype=ctrltype;
	    		}
	    	}
	    }
	}
	return tabledata;
};

c.businessObjectTableDelayFun = function() {
	var zTree = $.fn.zTree.getZTreeObj("form-businessObj");
	var nodeselcetcount = zTree.getSelectedNodes().length;
	//var sortTreeData = $("#sort_table").bootstrapTable("getData");
	var dragtype = $("#widget-control li").find("a:first>span:last").attr("ctrltype");
	var sortTreeData = c.sortdialogDataProcess(nodeselcetcount,dragtype);
	sortTreeData = c.attrChangeProcess(sortTreeData,zTree);
	if(typeof dragtype=="undefined"){
		dragtype = $("#widget-control > li[class*='ui-draggable']").find("a:first>span:last").attr("ctrltype");
		if(typeof dragtype=="undefined"){
		   return;
		}
	}
	var selectedNodes=new Array();
	if(nodeselcetcount<=0 || (nodeselcetcount==1 && dragtype=="TableLayout") || (nodeselcetcount==1 && dragtype=="DataTable")){
		if(dragtype=="DataTable"){//单独子表拖拽
			var nodecode = $("#widget-control li").find("a:first>span:last").attr("nodecode");
			if(typeof nodecode=="undefined"){
				nodecode = $("#widget-control > li[class*='ui-draggable']").find("a:first>span:last").attr("nodecode");
			}
			var dragnode = zTree.getNodeByParam('code',nodecode);
			selectedNodes.push(dragnode);
		}else{//根节点拖拽
			selectedNodes = zTree.getNodes();
		}
	}else{
		selectedNodes = zTree.getSelectedNodes();
	}
	$.fn.zTree.getZTreeObj("form-businessObj").cancelSelectedNode();
	if(nodeselcetcount==1 && dragtype=="TableLayout"){
		zTree.setting.view.expandSpeed = "";
		zTree.expandAll(false);
		zTree.setting.view.expandSpeed = "fast";
	}
	c.businessObjectTable(selectedNodes);
	//更新业务对象树
	$("#form-businessObj").after('<div id="form-businessObj" class="ztree-div-class ztree j_scroll_editNew scroll-wrapperNew" style="height:100%;"></div>').remove();
	c.initTreeModel(ztreedata);
	u.hideLoading();
};
	c.businessObjectTableCloseDelayFun = function() {
		$("#form-businessObj").after('<div id="form-businessObj" class="ztree-div-class ztree j_scroll_editNew scroll-wrapperNew" style="height:100%;"></div>').remove();
		c.initTreeModel(ztreedata);
		var zTree = $.fn.zTree.getZTreeObj("form-businessObj");
		var nodeselcetcount = zTree.getSelectedNodes().length;
		var dragtype = $("#widget-control li").find("a:first>span:last").attr("ctrltype");
		var selectedNodes=new Array();
		if(dragtype=="TableLayout"){
			selectedNodes = zTree.getNodes();
		}else{
			var nodesarray = JSON.parse(sortdatabefore);
			if(typeof nodesarray.length == "undefined"){
				if(nodesarray.ctrltype=="Form"){
					nodesarray.ctrltype="Table";
				}
				selectedNodes.push(nodesarray);
			}else{
				for(var i=0;i<nodesarray.length;i++){
					selectedNodes.push(nodesarray[i]);
				}
			}
		}
		zTree.cancelSelectedNode();
		if(nodeselcetcount==1 && dragtype=="TableLayout"){
			zTree.setting.view.expandSpeed = "";
			zTree.expandAll(false);
			zTree.setting.view.expandSpeed = "fast";
		}
		c.businessObjectTable(selectedNodes);
		u.hideLoading();
	};
	// 拖放结束时的回调,主要功能是根据控件名渲染控件插入到释放区域，
	// 然后根据不同的释放区域，清除多余的内容，切换到当前组件页面，重置拖放区域等等操作
	c.sortableProcess = function(a) {
		if(typeof a.attr("componentKey") =="undefined" && !a.hasClass('ui-sortable')){
			//c.businessObjectTable(a); //业务对象树的拖拽过程
		}else{
			if (null != a && null != c.currentDrag) {
				var b = a.attr("componentKey"),
				b = new window[b];
				b.componentSetup.isDisplay=true; //控件是否显示，默认显示
				b.componentSetup.isLabelDisplay=true; //控件标题是否显示，默认显示
				b.componentSetup.isbusinessObj=true; //是否普通的控件，是为true不是为false
				if("Text"==a.attr("componentKey")){
					b.componentSetup.formula=""; //text控件增加公式属性
				}
				// this.addComponentModel(b);
				b.render(a);
				a.data("componentData", b);
				$(".subtd_js ").find(".general_js").remove()
			}
			//单个子表元素互换
			if (a.parent().hasClass("cell_js") && 1 <= a.siblings().length){
				if (null != c.currentDrag) {
					a.remove();	
				}else {
					a.parent().parent().find("div[class='cell cell_js ui-sortable']").each(function(index,item){
						$(item).find("div").length<=0 && a.parent().parent().find(".ui-sortable").eq(index).append(a.siblings()) && a.siblings().remove();
					});
				}
			}
			if (0 < a.parent("td").length && 1 <= a.siblings().length) if (null != c.currentDrag) a.remove();
			else return !1;
			if (null != a && a.hasClass("form-layout_js") || a.hasClass("subform_js") || a.hasClass("table_layout_js")) {
				if(a.hasClass("fieldGroup_js") || a.hasClass("table_layout_js")){a.click()}
				if (a.parent().hasClass("cell_js") || 0 < a.parent("td").length) if (null != c.currentDrag) a.remove();
				else return !1
			} else null != a && (a.hasClass("field_js") || a.hasClass("fieldGroup_js")) ? a.click() : null != a && a.hasClass("subtd_js") && a.find(".field_js").click();
			null != a && a.hasClass("form-layout_js") && c.fromAndColPanelSortable();
			null != a && a.hasClass("subform_js") && (a.find(".field_subform_js").click(), c.subFromSortable());
			null != a && a.hasClass("table_layout_js") && c.fromAndColPanelSortable();
			c.currentDrag = null
		}
		//u.hideLoading(); //隐藏风车转
	};
	//业务对象树的拖拽逻辑实现
	c.businessObjectTable = function(selectedNodes){
		var c_currentDrag = c.currentDrag;
		selectedNodes.each(function(val,index){
			var ctrltype = val["ctrltype"];
			var leafdragflag = false;
			
			// 如果拖拽的是根节点
			if(ctrltype=="TableLayout" || ctrltype=="Form"){
				//增加表头label
				var ts = new Date().getTime().toString();//subFormId
				var tableLabelDiv = c.makeHeadNode("Label",ctrltype,val.name,ts,val.code);
				var componentKey=ctrltype;
				ctrltype="TableLayout";
				$("#form-head-l-name").val()=="" && $("#form-head-l-name").val(val.name+"模板") && $("#edit-form #name-form").val(val.name+"模板");
				var targetDiv = $('<div>',{'id':'root'});
				targetDiv.attr("componentKey",componentKey);
				targetDiv.append(tableLabelDiv);//将label放入总div中
				var tablechildren = val["children"]; //总数
				var dataTableCount = c.countDataTable(tablechildren); //子表数
				var tabletdcount = tablechildren.length-dataTableCount;
				var rows = Math.ceil(tabletdcount/3);
				var b = "TableLayout";
				b = new window[b];
				b.componentSetup.subFormId = ts;
				b.componentSetup.title=val.name;
				b.componentSetup.itemId=val.id;
				b.componentSetup.itemCode=val.code;
				b.componentSetup.itemType=val.ctrlType;
				if(val.is_hidden=="N"){
					b.componentSetup.isDisplay=true;
				}else{
					b.componentSetup.isDisplay=false;
				}
				b.componentSetup.isbusinessObj=false; //是否从业务对象树里拖拽的控件，是为false不是为true，为了在运行时区分是否做存储用，普通控件是只读，不会做存储用
				b.componentSetup.itemKey=val.pk;
				b.componentSetup.entityId=val.entityId;
				b.componentSetup.rows=rows;
				b.componentSetup.cols=3;
				b.componentSetup.componentKey=componentKey;
				
				var count = $("#widget-control").find("div[nodepk='"+val.id+"']").length;
				if(count>0){
					return;
				}else{
					
					var tableTargetDiv = $('<div>',{'id':val.pk,'nodecode':val.code,'nodepk':val.id,'componentKey':componentKey});
					b.render(tableTargetDiv);
					tableTargetDiv.data("componentData", b);
					targetDiv.append(tableTargetDiv);//将table放入总div中
					var tdcount=0;//记录表格中代存列下标
					tablechildren.each(function(childval,childcount){
						var childcomponentKey=childval.ctrltype;
						var tablechildctrltype = childval.ctrltype;
						if(tablechildctrltype == "Text" || tablechildctrltype == "TextArea" || tablechildctrltype == "Select" || tablechildctrltype == "CheckBox" || tablechildctrltype == "DateComponent" || tablechildctrltype == "NumberComponent"|| tablechildctrltype == "Money"|| tablechildctrltype == "Reference"|| tablechildctrltype == "CodeRule" || tablechildctrltype == "Label"|| tablechildctrltype == "Paragraph" || tablechildctrltype == "ImageComponent" ||tablechildctrltype == "FileComponent"){
							var childTargetDiv = c.dragTreeLeafNode(tablechildctrltype,childval);
							tableTargetDiv.find("td").eq(tdcount).append(childTargetDiv);//将叶子节点放入table中
							tdcount++;
						}else if(tablechildctrltype == "DataTable" || tablechildctrltype == "Grid" || tablechildctrltype == "Table"){
							var childTargetDiv = c.dragDataTable(childcomponentKey,"DataTable",childval);
							targetDiv.append(childTargetDiv);//将子表放入总div中
						}else if(tablechildctrltype == "Form"){
							var childTargetDiv = c.dragTableLayout(childcomponentKey,"TableLayout",childval);
							targetDiv.append(childTargetDiv);//将子表放入总div中
						}
					})
				}
			}
			// 如果拖拽的是明细子表
			else if(ctrltype=="DataTable" || ctrltype=="Table" || ctrltype=="Grid" ){
				var componentKey=ctrltype;
				var targetDiv = c.dragDataTable(componentKey,"DataTable",val);
			}else{//拖拽的叶子节点
				var targetDiv = c.dragTreeLeafNode(ctrltype,val);
				leafdragflag = true;
			}
			var dragli = $("#widget-control li[class*='ui-draggable']");
			var datatabledrag = $("#widget-control > li").find("a:first>span:last");
			if(dragli.parent().length>0 && (dragli.parent().attr("class").indexOf("cell_js")>=0 || dragli.parent().attr("class").indexOf("groupTable_js")>=0)){//如果向布局里拖拽叶子节点
				dragli.parent().append(targetDiv);
				dragli.remove();
			}else if($("#widget-control li").parent("td").length>0){
				if($("#widget-control li").siblings("div").length<=0){//防止一个单元格放入多个控件
					$("#widget-control li").parent("td").append(targetDiv);
					$("#widget-control li").parent("td").children("li").remove();
				}else{
					$("#widget-control li[title]").remove();
				}
			}else if(datatabledrag && datatabledrag.attr("ctrltype")=="DataTable"){//子表拖拽
				if(targetDiv[0].id=="root"){//单独Form拖拽
					targetDiv=targetDiv.children();
				}
				$("#widget-control > li").prev().length>0 ? $("#widget-control > li").prev().after(targetDiv):($("#widget-control > li").next().length>0 ? $("#widget-control > li").next().before(targetDiv):$("#widget-control").append(targetDiv));
				$("#widget-control > li").remove();
			}else if(leafdragflag){//叶子节点单独拖拽
				$("#widget-control > li[class*='ui-draggable']").prev().length>0 ? $("#widget-control > li[class*='ui-draggable']").prev().after(targetDiv):($("#widget-control > li[class*='ui-draggable']").next().length>0 ? $("#widget-control > li[class*='ui-draggable']").next().before(targetDiv):$("#widget-control").append(targetDiv));
				$("#widget-control > li[class*='ui-draggable']").remove();
			}else{
				$("#widget-control>li").remove();
				if(typeof targetDiv !="undefined" && targetDiv[0].id=="root"){
					$("#widget-control").append(targetDiv.children());
				}else{
					$("#widget-control").append(targetDiv);
				}
			}
			//注册排序
			c.subFromSortable();
			c.fromAndColPanelSortable();
			//页面加载后点击一个控件激活
			var clickdiv=$("#widget-control").find("#root > div:first-child:not([componentkey='DataTable']):not([componentkey='TableLayout'])");
		    var firstItempk = clickdiv && clickdiv.eq(0).attr("nodepk");
		    if(typeof firstItempk !='undefined'){
		    	$("#widget-control").find("div[nodepk='"+firstItempk+"']").click();
		    }
			u.hideLoading();
		});
	    c.currentDrag = null;
	}
	c.countDataTable= function(tablechildren){
		var count = 0;
		tablechildren.each(function(val,index){
			if(val.ctrltype=="DataTable" || val.ctrltype=="Table" || val.ctrltype=="Grid" || val.ctrltype=="Form"){
				count++
			}
		});
		return count;
	}
	c.dragTableLayout= function(componentKey,ctrltype,val){
		var targetDiv = $('<div>',{'id':'formroot'});
		var ts = new Date().getTime().toString();
		//增加表头label
		var tableLabelDiv = c.makeHeadNode("Label","Form",val.name,ts,val.code);
		targetDiv.append(tableLabelDiv);//将label放入总div中
		var tablechildren = val["children"]; 
		var rows = Math.ceil(tablechildren.length/3);
		var b = "TableLayout";
		b = new window[b];
		b.componentSetup.subFormId = ts;
		b.componentSetup.title=val.name;
		b.componentSetup.itemId=val.id;
		b.componentSetup.itemCode=val.code;
		b.componentSetup.itemType=val.ctrlType;
		if(val.is_hidden=="N"){
			b.componentSetup.isDisplay=true;
		}else{
			b.componentSetup.isDisplay=false;
		}
		b.componentSetup.isbusinessObj=false; //是否从业务对象树里拖拽的控件，是为false不是为true，为了在运行时区分是否做存储用，普通控件是只读，不会做存储用
		b.componentSetup.itemKey=val.pk;
		b.componentSetup.entityId=val.entityId;
		b.componentSetup.rows=rows;
		b.componentSetup.cols=3;
		b.componentSetup.componentKey=componentKey;
		var count = $("#widget-control").find("div[nodepk='"+val.id+"']").length;
		if(count>0){
			return;
		}else{
			var tableTargetDiv = $('<div>',{'id':val.pk,'nodecode':val.code,'nodepk':val.id});
			tableTargetDiv.attr("componentKey",componentKey);
			b.render(tableTargetDiv);
			tableTargetDiv.data("componentData", b);
			targetDiv.append(tableTargetDiv);//将table放入总div中
			tablechildren.each(function(childval,childcount){
				var childcomponentKey=childval.ctrltype;
				var tablechildctrltype = childval.ctrltype;
				if(tablechildctrltype == "Text" || tablechildctrltype == "TextArea" || tablechildctrltype == "Select" || tablechildctrltype == "CheckBox" || tablechildctrltype == "DateComponent" || tablechildctrltype == "NumberComponent"|| tablechildctrltype == "Money"|| tablechildctrltype == "Reference"|| tablechildctrltype == "CodeRule" || tablechildctrltype == "Label"|| tablechildctrltype == "Paragraph" || tablechildctrltype == "ImageComponent" ||tablechildctrltype == "FileComponent"){
					var childTargetDiv = c.dragTreeLeafNode(tablechildctrltype,childval);
					tableTargetDiv.find("td").eq(childcount).append(childTargetDiv);//将叶子节点放入table中
				}
			})
		}
		return targetDiv.children();
	};
	c.dragDataTable= function(componentKey,ctrltype,val){
		var b = "DataTable";
		b = new window[b];
		b.componentSetup.title=val.name;
		b.componentSetup.itemId=val.id;
		b.componentSetup.itemCode=val.code;
		b.componentSetup.itemType=val.ctrlType;
		if(val.is_hidden=="N"){
			b.componentSetup.isDisplay=true;
		}else{
			b.componentSetup.isDisplay=false;
		}
		b.componentSetup.isbusinessObj=false; //是否从业务对象树里拖拽的控件，是为false不是为true，为了在运行时区分是否做存储用，普通控件是只读，不会做存储用
		b.componentSetup.itemKey=val.pk;
		b.componentSetup.entityId=val.entityId;
		b.componentSetup.componentKey=componentKey;
		var count = $("#widget-control").find("div[nodepk='"+val.id+"']").length;
		if(count>0){
			return;
		}else{
		var targetDiv = $('<div>',{'id':val.pk,'nodecode':val.code,'nodepk':val.id});
		targetDiv.attr("componentKey",componentKey);
		b.render(targetDiv);
		targetDiv.data("componentData", b);
		val["children"].each(function(valchild,count){
			var ctrltypechild = valchild["ctrltype"];
			var targetChildDiv = c.dragTreeLeafNode(ctrltypechild,valchild);
			if(count<2){
				targetDiv.find(".subtd_js").eq(count+1).append(targetChildDiv);
			}else{
				c.addDataTableCol(targetDiv);
				targetDiv.find(".subtd_js").eq(count+1).append(targetChildDiv);
			}
		})
		return targetDiv;
		}
	};
	//子表添加列
	c.addDataTableCol=function(targetDiv) {
		var subtr_js = targetDiv.find(".subtr_js");
		subtr_js.append('<td class="subtd_js" style="height: 71px;"></td>');
		3 < subtr_js.length && targetDiv.css({
			"margin-bottom": "17px"
		});
		2 < subtr_js.length && subtr_js.addClass("one-three");
	};
	c.dragTreeLeafNode= function(ctrltype,val){
		var displayclass="";//对隐藏元素增加样式
		if(val.select_type=="checkbox"){
			ctrltype="CheckBox";
		}else if(val.select_type=="radiobox"){
			ctrltype="RadioBox";
		}
		var b = ctrltype;
		b = new window[b];
		b.componentSetup.title=val.name;
		b.componentSetup.itemId=val.id;
		b.componentSetup.itemCode=val.code;
		b.componentSetup.itemType=val.ctrlType;
		b.componentSetup.titleLayout="field-hoz";//默认标题横向布局
		if(val.required=="Y"){
			b.componentSetup.required=true;
		}
		if(val.readOnly=="Y"){
			b.componentSetup.readOnly=true;
		}
		if(val.isIdentity=="Y"){
			b.componentSetup.isIdentity=true;
		}
		if(val.is_hidden=="N"){
			b.componentSetup.isDisplay=true;
		}else{
			b.componentSetup.isDisplay=false;
			displayclass="isNotdisplayCtl";
		}
		b.componentSetup.isbusinessObj=false; //是否从业务对象树里拖拽的控件，是为false不是为true，为了在运行时区分是否做存储用，普通控件是只读，不会做存储用
		b.componentSetup.itemKey=val.pk;
		b.componentSetup.entityId=val.entityId;
		if("Select"==ctrltype || "CheckBox"==ctrltype || "RadioBox"==ctrltype){
			var selectJson = val.select_options;
			if(typeof selectJson !='undefined' && selectJson !=""){
				b.componentSetup.options=selectJson;
			}
		}else if("Text"==ctrltype){
			b.componentSetup.formula=""; //text控件增加公式属性
		}else if("Money"==ctrltype || "NumberComponent"==ctrltype || "CodeRule"==ctrltype){
			b.componentSetup.decimalPlace=val.decimalPlace?val.decimalPlace:2;
			if($("#widget-control").find("span[nodepk='"+val.pid+"']").attr("ctrltype")=="TableLayout"){
				b.componentSetup.inDataTable="false";
			}
		}else if("DateComponent"==ctrltype){
			b.componentSetup.format=val.format;
		}
		"CheckBox"==ctrltype && (b.componentSetup.isMulticheckbox = false);
		"CheckBox"==ctrltype && b.componentSetup.options && (b.componentSetup.checkboxCount=b.componentSetup.options.length);
		//checkbox 类型时 加上isMulticheckbox属性，是true时运行时就显示多个复选框，反之false时 运行时就显示布尔值
		"CheckBox"==ctrltype && b.componentSetup.options && b.componentSetup.options.length>1 && (b.componentSetup.isMulticheckbox = true);
		
		"RadioBox"==ctrltype && (b.componentSetup.isMultiradiobox = false);
		"RadioBox"==ctrltype && b.componentSetup.options && (b.componentSetup.radioboxCount=b.componentSetup.options.length);
		"RadioBox"==ctrltype && b.componentSetup.options && b.componentSetup.options.length>1 && (b.componentSetup.isMultiradiobox = true);
		if(typeof val.pk =="undefined" || val.pk==""){
			b.componentSetup.isNeedSerialize = false;
		}else{
			b.componentSetup.isNeedSerialize = true;
		}
		
		var targetDiv = $('<div>',{'id':val.pk,'nodecode':val.code,'nodepk':val.id});
		targetDiv.attr("componentKey",ctrltype);
		b.render(targetDiv);
		targetDiv.data("componentData", b);
		displayclass !="" && targetDiv.addClass(displayclass);
		return targetDiv;
	};
	c.makeHeadNode= function(ctrltype,ctrlflag,title,ts,refcode){
		var b = ctrltype;
		b = new window[b];
		b.componentSetup.title=title;
		b.componentSetup.isDisplay=true; //控件是否显示，默认显示
		b.componentSetup.isLabelDisplay=true; //控件标题是否显示，默认显示
		b.componentSetup.subFormId = ts;
		var targetDiv = $('<div>',{'refnodecode':refcode});
		if(ctrlflag=="TableLayout"){
			targetDiv.attr("componentKey",ctrltype);
		}else{
			targetDiv.attr("componentKey","FormLabel");
		}
		b.render(targetDiv);
		targetDiv.data("componentData", b);
		return targetDiv;
	};
	// 启动拖拽释放区域的元素
	c.fromAndColPanelSortable = function() {
		var a = $("#widget-control,.cell_js,.groupTable_js,.j_tablelayout td"),
			b = $("#widget-control");
		//var g =  $("#widget-control .groupTableLayout");
		// 两列三列布局里的单元格
		b.find(".cell_js").sortable({
			connectWith: a,
			placeholder: "form-placeholder-filed ",
			cancel: ".j_cancel-drag",
			stop: function(a, b) {
				if(b.item.find("a span[nodename]:last-child").length>0){
					c.loadingwait();
				}
				return c.sortableProcess(b.item)
			},
			over: function(a, d) {
				if (1 <= $(this).find(".field_js").length) $(this).find(".form-placeholder-filed").hide();
				else {
					var b = d.item.attr("componentkey");
					"DataTable" != b && "ColumnPanel" != b && "TableLayout" != b || $(this).find(".form-placeholder-filed").hide()
				}
				
			},
			out: function(a, c) {
				$(this).find(".form-placeholder-filed").show()
			}
		}).disableSelection();
		//分组布局
		b.find(".groupTable_js").sortable({
			connectWith: a,
			placeholder: "form-placeholder-filed ",
			cancel: ".j_cancel-drag",
			stop: function(a, b) {
				if(b.item.find("a span[nodename]:last-child").length>0){
					c.loadingwait();
				}
				return c.sortableProcess(b.item)
			},
			over: function(a, d) {
				
			},
			out: function(a, c) {
				$(this).find(".form-placeholder-filed").show()
			}
		}).disableSelection();
		
		// 设计区域
		b.sortable({
			connectWith: a,
			placeholder: "form-placeholder-filed ",
			cancel: ".j_cancel-drag",
			stop: function(a, b) {
				//如果是往表格中拖放表格或是子表，给出警告并返回,分组布局正常
				var dragtype = b.item.find("a:first>span:last").attr("ctrltype");
				if(dragtype=="TableLayout" || dragtype=="DataTable"){
					var dragflag = c.dragTargetDetection(b);
					if(dragflag){
						$("#widget-control li[class*='ui-draggable']").remove();
						l.notify("不能往表格中拖拽复杂业务对象");
						return;
					}
				}
				if(b.item.find("a span[nodename]:last-child").length>0){
					c.loadingwait();
				}
				//判断是否重复元素拖拽
				var dupflag = c.duplicateDetection(b.item);
				if(dupflag){
					b.item.remove();//删除节点
					u.hideLoading(); //隐藏风车转
					l.notify("重复拖拽");
					return;
				}else{
					if(b.item.find("a[class!='j_layout_menu']").length>0){//判断是否是业务对象树拖拽（排除已有表格拖拽和普通控件拖拽）
						c.sortableBeforeProcess(b.item);//初始化业务对象树排序表格
					}
					return c.sortableProcess(b.item);
				}
			},
			over: function(a, d) {
				$(this).find("span.form-placeholder-filed").css("border","none");
				$(this).find("span.form-placeholder-filed").append('<div class="form-placeholder-filed"></div>');
				$(this).find(".form-placeholder-filed").show();
				if(d.item.attr("componentkey")=="Table"){
					//设置滚动条
					var oldtop = d.originalPosition.top;
					var newtop = d.position.top;
					var bartop = parseInt($("#mCSB_4_dragger_vertical").css("top").replace("px",""));
					var contenttop = parseInt($("#mCSB_4_container").css("top").replace("px",""));
					if(oldtop<newtop){//下移
						$("#mCSB_4_container").css("top",contenttop-(newtop-oldtop)+"px");
					}else{//上移
						var a = contenttop+(oldtop-newtop)<0?contenttop+(oldtop-newtop):0;
						$("#mCSB_4_container").css("top",a+"px");
					}
				}
			},
			out: function(a, c) {
				//u.hideLoading(); //隐藏风车转
			}
		}).disableSelection();
		
		// 表格布局里的单元格
		$(".j_tablelayout td").sortable({
			connectWith: a,
			placeholder: "form-placeholder-filed ",
			start: function(a, c) {
				$(".ui-draggable-dragging").css({
					height: "auto",
					"float": "none",
					width: "270px"
				})
			},
			stop: function(a, b) {
				if(b.item.find("a span[nodename]:last-child").length>0){
					c.loadingwait();
				}
				//表格元素互换功能
				if (0 != b.item.parent("td").length && 0 != b.item.siblings().length) {
					b.item.parent().parent().parent().find("td[class='area']").append(b.item.siblings());
					b.item.parent().parent().parent().find("td[class='area']").addClass("ui-sortable").removeClass("area");
					b.item.parent().parent().parent().find("td[class='']").each(function(tdindex,td){
						$(td).addClass("ui-sortable");
					});
				}else {
					c.sortableProcess(b.item);
				}
			},
			over: function(a, d) {
				if (1 <= $(this).find(".field_js").length) $(this).find(".form-placeholder-filed").hide();
				else {
					var b = d.item.attr("componentkey"),
						b = d.item.attr("componentkey");
					"DataTable" == b || "ColumnPanel" == b || "TableLayout" == b ? $(this).find(".form-placeholder-filed").hide() : $(this).find(".form-placeholder-filed").show()
				}
				
			},
			out: function(a, c) {}
		})
	};
	c.loadingwait = function(){
		var oldLoading = $('.modal-loading')
		if (oldLoading.length) {
			oldLoading.each(function(){
				$(this).modal('hide')
			})
		}
		var loading = bootbox.dialog().find('.modal-dialog').remove().end();
		loading.addClass('modal-loading').append([
			'<div class="loading-spinner">',
				'<div class="main-loader">',
					'<div><div class="loadingnew">loading...</div></div>',
				'</div>',
			'</div>'
		].join(''));
		return loading;
	}
	// 子表的拖放启动
	c.subFromSortable = function() {
		var a = $("#widget-control .subtable_js");
		a.find("tr").sortable({
			connectWith: a,
			placeholder: "form-placeholder-filed ",
			stop: function(a, b) {
				return c.sortableProcess(b.item)
			},
			over: function(a, c) {
				$(this).parent().parent().addClass("form-layout-active")
			},
			out: function(a, c) {
				$(this).parent().parent().removeClass("form-layout-active")
			}
		});
		a.find("tr").find("td").sortable({
			items: ":not(*)",
			placeholder: "form-placeholder-filed ",
			stop: function(a, b) {
				//判断是否重复拖拽
				var dtdupflag = c.duplicateDetection(b.item);
				if(dtdupflag){
					b.item.remove();//删除节点
					l.notify("重复拖拽");
					return;
				}
				//判断是否往表格单元中拖拽多个控件
				if(b.item.parent("td").length>0 && b.item.siblings("div").length>0){
					b.item.remove();
					return;
				}
				//判断是否是子表或是表格拖拽
				var dragtype = b.item.find("a:first>span:last").attr("ctrltype");
				if(dragtype=="TableLayout" || dragtype=="DataTable"){
					var dragflag = c.dragTargetDetection(b);
					if(dragflag){
						$("#widget-control li[class*='ui-draggable']").remove();
						l.notify("不能往表格中拖拽复杂业务对象");
						return;
					}
				}
				var d = new DataTable,
					k = b.item.attr("componentkey"),
					d = d.filterItme[k];
				if (0 == b.item.siblings().length && null == d && b.item.find("a").length<=0){//如果拖拽普通对象
					return c.sortableProcess(b.item);
				}else{
					if(k=="Label"){
						l.notify("不能往子表中拖拽此类型控件");
					}else{
						//如果拖拽业务对象树对象
						var zTree = $.fn.zTree.getZTreeObj("form-businessObj");
						var valinfo = b.item.find("a > span:last");
						var ctrltype =valinfo.attr("ctrltype");
						var dragnode = zTree.getNodeByParam('code',valinfo.attr("nodecode"));
						var targetdiv = c.dragTreeLeafNode(ctrltype,dragnode);
						$(this).append(targetdiv);
						c.currentDrag = null;
					}
				}
				b.item.remove();
			},
			over: function(a, c) {
				if (1 < c.item.siblings().length) c.item.parents(".subform_js").find(".form-placeholder-filed").hide();
				else {
					var b = new DataTable,
						d = c.item.attr("componentkey");
					null != b.filterItme[d] && c.item.parents(".subform_js").find(".form-placeholder-filed").hide()
				}
			},
			out: function(a, c) {}
		})
	};
	// 设置区表单设置的事件绑定
	c.formSetupEvents = function() {
		// 表单标题输入框
		$(document).on("keydown", "#edit-form #name-form", function(a) {
			a = $(this).val();
			$(".form-preview .form-name").text(a);
			$(".form-head_js .form-name").val(a);
		});
		// 表单标题输入框
		$(document).on("keyup", "#edit-form #name-form", function(a) {
			a = $(this).val();
			$(".form-preview .form-name").text(a);
			$(".form-head_js .form-name").val(a);
		});
		// 表单设计区--表单标题输入框
		$(document).on("keyup", "#formContainer_js #form-head-l-name", function(a) {
			a = $(this).val();
			$("#edit-form #name-form").val(a);
		});
		// 表单标题输入框
		$(document).on("blur", "#edit-form #name-form", function(a) {
			c.checkFormName(function(a) {
				a.message ? ($("#edit-form .c-danger").show(), $("#edit-form .c-danger").text(a.message)) : $("#edit-form .c-danger").hide()
			})
		});
		// 表单描述输入框
		$(document).on("keydown", "#edit-form #description-form", function(a) {
			a = $(this).val();
			$(".form-head .form-description").text(a);
			$(".form-preview .form-description").text(a)
		});
		// 表单描述输入框
		$(document).on("keyup", "#edit-form #description-form", function(a) {
			a = $(this).val();
			$(".form-head .form-description").text(a);
			$(".form-preview .form-description").text(a)
		});
		// 表单设置-是否关联流程定义
		$(document).on("click", "#relateProcessDef", function(a) {
			(a = $(this).is(":checked")) ? $(".f-processDef").removeClass("hide") : ($(".f-processDef").addClass("hide"), str = "取消流程定义后  ",c.changeProcessActivity(str));
		});
		// 表单设置-修改关联流程定义
		$(document).on("change", "select[id='processDefId']", function(l) {
			l = $(this).val();
			var str = "更改流程定义后  ";
			c.changeProcessActivity(str);
		});
		// c.loadformownership()
	};
	c.changeProcessActivity = function(str){
		var d = [],
		    titles = [];
		$("#widget-control").children().each(function(a) {
			var b = c.assemComponent(a, $(this));
			if (null == b) return !0;
			var componentKey = b.componentSetup.componentKey;
			if(componentKey == "ApproveUser" || componentKey == "AssignUser"){
				var obj = {};
				var title = b.componentSetup.title;
				var fieldId = b.componentSetup.fieldId;
				var order = b.componentSetup.order;
				obj.title = title;
				obj.fieldId = fieldId;
				obj.order = order;
				d.push(obj);
				titles.push(title);
			}
		});
		if(d.length>0){
			l.notify(str+titles.toString()+" 控件关联的流程环节将清空");
			for(var i=0;i<d.length;i++){
			 	var fieldId = d[i].fieldId;
			 	var order = d[i].order;
			 	var b = c.assemComponent(order, $("#"+fieldId));
			 	b.componentSetup.processActivity = "";
			}
		}
	}
	// 验证表单名是否合法的貌似，还要讲所有表单的信息上传一遍，保存和修改表单名时触发
	c.checkFormName = function(a) {
		var b = $.trim($("#name-form").val());
		if ("" == b) {
			u.alert("请输入表单标题");
			$(".j_edit_tab[edit-type='businessObj']").click();
			$(".j_edit_tab[edit-type='formwidget']").click();
		} else if (50 < b.length) {
			u.alert("表单名称过长，请少于50字");
			$(".j_edit_tab[edit-type='businessObj']").click();
			$(".j_edit_tab[edit-type='formwidget']").click();
		} else {
			var f = {
					form: {
						id: c.formId,
						name: b
					}
				}
			$.ajax({
				type: "post",
				url: "/uitemplate_web/static/data/checkFormName.json",
				dataType: "json",
				data: {
					data: JSON.stringify(f)
				},
				success: function(c) {
					a(c)
				}
			})
		}
	};
	// 专门用来渲染html编辑器的
	// 触发renderCkEditor事件时执行
	// 编辑段落控件时用的
	c.renderCkEditor = function() {
		c.ckEditor = CKEDITOR.replace("descriptionEdit", {
			toolbar: [{
				name: "tools",
				items: "Link Unlink - Bold Italic Underline - TextColor BGColor".split(" ")
			}, {
				name: "styles",
				items: ["Font", "FontSize"]
			}, {
				name: "paragraph",
				groups: ["list", "align"],
				items: "NumberedList BulletedList - JustifyLeft JustifyCenter JustifyRight JustifyBlock - Maximize".split(" ")
			}, {
				name: "colors"
			}],
			height: 200
		});
		var a = $("#widget-control .field-active"),
			b = $("#widget-control .field-active").data("componentData");
		c.ckEditor.paragraph = a;
		(a = a.find(".paragraph").html()) && c.ckEditor.setData(a);
		c.ckEditor.on("change", function(a) {
			a = this.getData();
			this.paragraph.find(".paragraph").html(a);
			b.setContent(a)
		});
		c.ckEditor.on("instanceReady", function() {
			var a = this;
			this.document.on("keyup", function() {
				var d = a.getData();
				c.ckEditor.paragraph.find(".paragraph").html(d);
				b.setContent(d)
			});
			this.document.on("keydown", function() {
				var d = a.getData();
				c.ckEditor.paragraph.find(".paragraph").html(d);
				b.setContent(d)
			})
		})
	};
	// 控件使用说明部分的函数
	c.formIntro = function() {
		$("body").addClass("introjs-open");
		var a = [{
			element: "#formContainer_js #formContent",
			intro: "<h5>表单编辑区</h5>可为表单设计排版<br>1、可以随意拖拽控件的位置；<br>2、可以删除不需要的控件；<br>3、一些特殊控件的操作(如明细子表增加列)；<br><br>",
			position: "left"
		}, {
			element: "#form-widget #form-widget-list",
			intro: "<h5>字段控件</h5>以拖拽的方式选择您需要的控件，拖到中间的表单编辑区；<br><br>",
			position: "right"
		}, {
			element: "#formEdit_js #edit-widget",
			intro: "<h5>控件设置</h5>可以设置当前选中控件的相关信息；<br><br>",
			position: "left"
		}, {
			element: "#form-widget #layout-widget-list",
			intro: "<h5>布局控件</h5>布局控件中可拖入字段控件，本身无显示效果；<br><br>",
			position: "right"
		}, {
			element: ".header .pull-right.userbtns",
			intro: "1、保存：表单编辑完毕后记得保存您的表单；<br>2、" + /*("biaoge" == c.module ?*/ "保存并发布"/* : "保存并启用")*/ + "：保存当前表单数据并设置为启用状态，可以直接使用了；<br>另外，在“表单设置”下，您可以修改表单名称及其相应的描述。<br><br>",
			position: "left"
		}]
		introJs().setOptions({
			steps: a
		}).onbeforechange(function(a) {
			setTimeout(function() {
				$(".introjs-helperLayer .introjs-tooltip").attr("style", $(".introjs-helperLayer .introjs-tooltip").attr("style") + " min-width:300px;")
			}, 10);
			switch ($(a).attr("id")) {
			case "formContent":
				setTimeout(function() {
					$(".introjs-helperLayer .introjs-tooltip").attr("style", $(".introjs-helperLayer .introjs-tooltip").attr("style") + " min-width:200px;")
				}, 10);
				$(".form-view-wrapper .mCSB_container").css("top", "0px");
				$(".form-view-wrapper .mCSB_dragger").css("top", "0px");
				break;
			case "form-widget":
			case "form-widget-list":
				$(".j_widget_tab[widget-type='form']").click();
				break;
			case "layout-widget-list":
				$(".j_widget_tab[widget-type='layout']").click();
				break;
			case "formEdit_js":
			case "edit-form":
				$(".j_edit_tab[edit-type='form']").click();
				break;
			case "edit-widget":
				$(".introjs-helperLayer").addClass("introjs-autoheight"), setTimeout(function() {
					$(".introjs-helperLayer").removeClass("introjs-autoheight")
				}, 400), null == $("#formContent #widget-control .field_js").get(0) ? 
					(a = "biaoge_report" == $("#module").val() ? 
						$([
							'<div class="field field_js field-active" title="拖拽至页面中间区域" componentkey="PieComponent" style="display: block;">',
								'<span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span>',
								'<div class="paragraph alert"><img class="statimg" src="/iform/static/img/form/pie.png"></div>',
							'</div>'
						]) :
						$('<div class="widget-item general_js ui-draggable" componentkey="Text" title="拖拽至页面中间区域"></div>'),
						$("#formContent #widget-control").append(a),
						c.currentDrag = a,
						c.sortableProcess(a)) : 
					null == $("#formContent #widget-control .field_js.field-active").get(0) && 
					$("#formContent #widget-control .field_js:eq(0)").click(), 
					$(".j_edit_tab[edit-type='widget']").click()
			}
			window.onbeforeunload = null;
			setTimeout(function() {
				c.beforeunload()
			}, 200)
		}).onchange(function(a) {}).oncomplete(function() {
			c.introSaveConfig()
		}).onexit(function() {
			c.introSaveConfig()
		}).start().refresh()
	};
	// 用来标记用户是否使用过帮助的……还调了个接口，感觉存cookie里就行啊
	c.introSaveConfig = function() {
		window.onbeforeunload = null;
		setTimeout(function() {
			c.beforeunload()
		}, 200);
		$("body").removeClass("introjs-open");
		if (!c.isShowIntro) {
			c.isShowIntro = !0;
			var a = {
				"config.configKey": "guide.from.createformintro",
				"config.configValue": "1"
			};
			$.ajax({
				type: "POST",
				dataType: "json",
				url: "/form/findIntroCount.json",
				success: function(c) {
					1 == !c.introCount && $.ajax({
						type: "POST",
						data: a,
						dataType: "json",
						url: "/base/configuration/saveConfig.json",
						success: function(a) {}
					})
				}
			})
		}
	};
	// 启动上传图片组件，但是这个模块里没调用，各个模块里又有自己的实现，所以这部分应该是没用的
	c.initUploader = function(a) {
		var c = this.uploader = new plupload.Uploader({
			runtimes: "html5,flash",
			file_data_name: "data",
			browse_button: ".file-input",
			container: "",
			max_file_size: "50M",
			url: "/base/upload.json?module=form",
			flash_swf_url: "/static/swf/plupload.swf"
		});
		c.init();
		c.bind("FilesAdded", function(a, c) {
			$.each(c, function(a, c) {
				plupload.formatSize(c.size)
			});
			a.refresh();
			a.start()
		});
		c.bind("UploadProgress", function(a, c) {
			$("#" + c.id + " i").html(c.percent + "%")
		});
		c.bind("Error", function(a, c) {
			-600 == c.code && l.notify("只能上传最大不超过50M的文件", "文件大小超过限制", "error");
			a.refresh()
		});
		c.bind("FileUploaded", function(c, b, e) {
			b = jQuery.parseJSON(e.response).fileObj;
			var p = b.name;
			c = b.image;
			b = {
				fileObj: b
			};
			"true" == c || 1 == c ? $.ajax({
				type: "POST",
				dataType: "json",
				data: JSON.stringify(b),
				url: "/formdata/createImage.json",
				success: function(c) {
					c = c.imageFile.id;
					a.componentSetup.imageIds.push(c);
					c = $('<div id="' + c + '" class="img-item j_imageItem"><div class="img-box"><a class="fancybox" type="image" href="/base/download/img/' + c + '/image"><img src="/base/download/img/' + c + '/small"></div><div class="img-opt"><i class="icon-minus-sign j_deleteImage"></i></div></div>');
					c.data("name", p);
					$(".field-active .img-wedget").append(c);
					l.notify("图片上传成功")
				}
			}) : l.notify("请上传图片文件", "文件格式不正确", "error")
		});
		c.bind("UploadComplete", function(a, c) {})
	};
	$(function() {
		//记录排序前数据
		var sortdatabefore = "";
		//记录业务对象树初始化数据
		var ztreedata = "";
		// 设置滚动条插件高度的函数
		function a(c) {
			if (!(0 >= c.length)) {
				var b = c.attr("marginbottom") || 0,
					d = c.offset().top,
					e = $(window).height();
				c.height(e - d - b);
				b = c.attr("theme") ? c.attr("theme") : "darkblue";
				c.hasClass("mCustomScrollbar") || c.mCustomScrollbar({
					theme: b
				})
			}
		}
		a($(".j_scroll_sideBar"));
		a($(".j_scroll_formView"));
		a($(".j_scroll_edit"));
		$("#edit-form #description-form").autosize();
		$(window).off("resize.formlayout").on("resize.formlayout", function(a) {
			c.calculateHeight();
			setTimeout(function() {
				$("body div.scroll-wrapper").each(function(a) {
					$(this).trigger("resizeSroll", a)
				})
			}, 100)
		});
		$("body").off("resizeSroll").on("resizeSroll", "div.scroll-wrapper", function(a) {
			a = $(this);
			if (a.attr("horizontal")) {
				var c = $(window).width(),
					b = a.offset().left;
				a.css("width", c - b)
			} else {
				var c = $(window).height(),
					b = a.attr("marginbottom") || 0,
					d = a.offset().top;
				a.css("height", c - d - b)
			}
			a.mCustomScrollbar("update")
		});
		$(document).on("click", ".j_widget_tab", function() {
			var a = $(this),
				c = a.attr("widget-type");
			a.parent().siblings().find("i:first").removeClass("icon-s show-color").addClass("icon-yousanjiao");
			a.parent().siblings().find("span:first").removeClass("show-color");
			a.parent().find("i:first").removeClass("icon-yousanjiao").addClass("icon-s show-color");
			a.parent().find("span:first").addClass("show-color");
			"form" == c ? ($("#layout-widget-list").hide(),$("#form-testwidget-list").hide(), $("#form-widget-list").show()) : 
				"layout" == c?($("#layout-widget-list").show(),$("#form-testwidget-list").hide(), $("#form-widget-list").hide()):($("#layout-widget-list").hide(),$("#form-testwidget-list").show(), $("#form-widget-list").hide());
		
		});
		$(document).on("click", ".j_edit_tab", function() {
			var a = $(this),
			    b = a.nextAll(),
			    d = a.prevAll(),
				c = a.attr("edit-type");
			if (b.length>0 ) {
				b.removeClass("attr-selected");
			}
			if (d.length>0 ) {
				d.removeClass("attr-selected");
			}
			
			a.addClass("attr-selected");
			"businessObj" == c ? ($("#form-businessObj").show(),$("#form-addCompContainer").hide()) : 
				("widget" == c ? ($("#edit-widget").show(),$("#form-edit-widget").hide()) : 
				("formwidget" == c ? ($("#edit-widget").hide(),$("#form-edit-widget").show()) :
				"form" == c && ($("#form-businessObj").hide(), $("#form-addCompContainer").show())));
		});
		
		$(document).on("mouseenter", ".js_eTips", function() {
			var a = $(this),
				c = setTimeout(function() {
					$(".js_eTipsMore").removeClass("hide")
				}, 300);
			a.data("showTimer", c)
		});
		$(document).on("mouseleave", ".js_eTips", function() {
			var a = $(this).data("showTimer");
			a && clearTimeout(a);
			$(".js_eTipsMore").addClass("hide")
		});
		$(document).off("renderCkEditor").on("renderCkEditor", function(a, b) {
			c.renderCkEditor()
		});
		$(document).on("click", ".showIntro_js", function() {
			c.isShowIntro = !0;
			c.formIntro()
		});
		// 1 > $("#introCount").val() && c.formIntro();
		c.beforeunload();
		c.formEvents();
		c.formSetupEvents();
		c.componentSetupEvents();
		c.componentDraggableEvents();
		var b = (function () {
			var search = location.search,
				pk_bo = '';
			if (!search) {
				return ""
			}
			search = search.slice(1).split('&')
			$.each(search, function (i, v){
				if (~v.indexOf('pk_temp=')) {
					pk_bo = v.split('=')[1]
					return false
				}
			})
			return pk_bo
		})()
		c.calculateHeight();
		c.bodyHtml = $("#formContent").html();
		c.formId = b;
		c.loadFormLayout(b);
		c.loadtreeData();
		$(document).on("afterCreateCell", function(a, b) {
			c.fromAndColPanelSortable()
		})
	});
	return c
});