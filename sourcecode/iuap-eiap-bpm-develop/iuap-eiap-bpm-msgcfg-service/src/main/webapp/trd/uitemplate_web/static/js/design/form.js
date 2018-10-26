define("form/formlayout", ["form/form-plugin", "form/tplutil", "form/componentmodel"], function(h, m, n) {
	var l = h("form/form-plugin"),
		b = h("form/tplutil"),
		a = h("form/componentmodel"),
		c = {
			currentDrag: null,
			currentEditor: null,
			formId: null,
			layoutId: null,
			isSameName: !1,
			isShowIntro: !1
		};
	c.module = $("#module").val();
	// 关闭窗口时如果有未保存时的提示
	c.beforeunload = function() {
		window.onbeforeunload = function() {
			if ($("#formContent").html() != c.bodyHtml) return "您修改的数据尚未保存"
		}
	};
	// 通过接口获取表单layout数据
	c.loadFormLayout = function(a) {
		if (null != a && "" != a) {
			var b = {};
			b.formId = a;
			$.ajax({
				type: "POST",
				data: b,
				dataType: "json",
				url: "static/data/findPreviewFrom.json",
				success: function(b) {
					c.formId = a;
					// 在这里调用解析layout
					null != b.formLayout && (c.layoutId = b.formLayout.id, c.analyseLayout(b.formLayout.layoutDetail));
					// 表单的所有权貌似在这里控制
					b.form.ownership && $("#edit-form #name-form").attr("ownership", b.form.ownership);
					// 重新启动拖拽时间
					c.componentDraggableEvents();
					// 重新计算高度
					c.calculateHeight();
					c.bodyHtml = $("#formContent").html()
				},
				error: function() {}
			})
		}
		$(window).resize()
	};
	// 把字符串转成json
	c.analyseLayout = function(a) {
		null != a && "" != a && (a = JSON.parse(a), $("#widget-control").html(""), c.analyseComponent(a, $("#widget-control")))
	};
	// 把json解析成组件
	c.analyseComponent = function(a, b) {
		var f = a.componentKey;
		if (f) {
			var g = new window[f](a),
				k = g.renderEditPreview(b);
			this.addComponentModel(g);
			if ("ColumnPanel" == f && null != a.layoutDetail) for (f = 0; f < a.layoutDetail.length; f++) {
				var g = a.layoutDetail[f],
					p = "",
					p = 1 == a.size ? b : $(k[f]);
				// 这里递归
				c.analyseComponent(g, p)
			}
		}
	};
	// 添加组件控制器，其实就是调用各个组件的setComponentModel
	c.addComponentModel = function(c) {
		this.reportId && !c.componentmodel && (cmpmodel = new a({
			reportId: this.reportId
		}), c.setComponentModel(cmpmodel))
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
			height: a - 50 + "px"
		});
		$(".js_wrapperConSize").css("height", $(window).height() - 50 + "px");
		1281 > c ? $(".js_wrapperConSize").css("width", "1280px") : $(".js_wrapperConSize").css("width", c + "px")
	};
	// 编辑区事件绑定，包括各个部分点击时设置区的变化
	c.formEvents = function(a) {
		var e = this;
		// 表头部分的编辑
		$(document).on("click", ".form-head_js", function() {
			$(".j_edit_tab[edit-type='form']").click()
		});
		// 字段
		$(document).on("click", ".field_js", function() {
			$(document).trigger("renderEditor", $(this))
		});
		// 编辑字表按钮
		$(document).on("click", ".field_subform_js", function() {
			$(document).trigger("renderEditor", $(this).parents(".subform_js"))
		});
		// 全局的renderEditor回调，各个组件都有自己的renderEditor，由这里统一分发
		$(document).off("renderEditor").on("renderEditor", function(a, c) {
			var d = $(c).data("componentData");
			if (null != d) {
				if (0 == $(c).parents("#form-preview").length){
					$(".field_js").removeClass("field-active");
					$(".subform_js").removeClass("field-active");
					$(".field_js").removeClass("monitor");
					$(c).addClass("field-active");
					d.renderEditor();
					$("#edit-widget").find("#component-describe").parent().show();
					if (null != $(c).parents(".subform_js").get(0)) {
						$("#edit-widget").find("#component-describe").parent().hide();
					}
					$(window).resize();
					$(".j_edit_tab[edit-type='widget']").click()
				}
			}
		});
		// 删除组件按钮
		$(document).on("click", ".j_widgetDele", function() {
			if (confirm("确定删除吗？")) {
				var a = $(this);
				a.parent(".field").hasClass("field-active") && $("#editor-component").html('<div class="alert alert-danger"><i class="icon-exclamation-sign"></i>请先选择控件</div>');
				4 >= a.parents(".subform_js").find(".subtd_js").length && a.parents(".subform_js").find(".addSubColum_js").parent().attr("style", "");
				3 >= a.parents(".subform_js").find(".subtd_js").length && a.parents(".subform_js").find(".subtr_js ").removeClass("one-three");
				0 < a.parent(".field").parent(".subtd_js").siblings().length && a.parent(".field").parent(".subtd_js").remove();
				a.parent(".field").remove()
			}
		});
		// 删除布局按钮
		$(document).on("click", ".j_layoutDele", function() {
			if (confirm("确定删除吗？")) {
				var a = $(this);
				a.parents(".form-layout").remove();
				a.parents(".subform_js").remove();
				a.parents(".table_layout_js").remove()
			}
		});
		//添加列按钮
		$(document).on("click", ".addSubColum_js", function() {
			var a = $(this);
			a.parents(".subform_js").find(".subtr_js").append('<td class="subtd_js" style="height: 71px;"></td>');
			3 < a.parents(".subform_js").find(".subtd_js").length && a.parent().css({
				"margin-bottom": "17px"
			});
			2 < a.parents(".subform_js").find(".subtd_js").length && a.parents(".subform_js").find(".subtr_js ").addClass("one-three");
			c.subFromSortable(a.parents(".subform_js"))
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
			var b = $("#reportId").val();
			null != b && 0 < b.length && $("#formpreview").data("reportId", b);
			l.renderForm({
				parentEl: $("#formpreview"),
				layoutDetail: a,
				callback: function(a) {}
			});
			$("#formpreview").parents(".form-preview-wrapper ").removeClass("hide")
		});
		// 保存按钮
		$(document).on("click", ".submit_js", function() {
			var a = new ColumnPanel,
				d = [];
			$("#widget-control").children().each(function(a) {
				var b = c.assemComponent(a, $(this));
				if (null == b) return !0;
				d[a] = b.componentSetup
			});
			a.componentSetup.layoutDetail = d;
			var a = a.toStringify(),
				b = {},
				p = $(".form-design .form-view .form-head .form-name").text(),
				q = $(".form-design .form-view .form-head .form-description").text();
			b["form.id"] = c.formId;
			b["form.name"] = p;
			b["form.describe"] = q;
			(p = $(".form-widgetEdit #edit-form .js_formownership .js_formowner input[name='ownership']:checked").val()) || (p = $(".form-widgetEdit #edit-form #name-form").attr("ownership"));
			b["form.ownership"] = p;
			p = $("#module").val();
			b["form.module"] = p;
			b.module = p;
			"biaoge_report" == p && (b["form.report.id"] = $("#reportId").val());
			b["formLayout.id"] = c.layoutId;
			b["formLayout.layoutType"] = "pc";
			b["formLayout.colorScheme"] = "";
			b["formLayout.layoutDetail"] = a;
			"enable" == $(this).attr("submitType") && (b["form.status"] = "enable");
			c.checkFormName(function(a) {
				a.message ? ($("#edit-form .c-danger").show(), $("#edit-form .c-danger").text(a.message), $(".j_edit_tab[edit-type='form']").click()) : $.ajax({
					type: "POST",
					data: b,
					dataType: "json",
					//url: "static/data/save.json",
					url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/test",
					success: function(a) {
						window.parentUpdate && parentUpdate(a);
						var d = a.message;
						!d && e.reportId ? (c.bodyHtml = $("#formContent").html(), window.location.href = "/form/editreport/" + a.form.id) : d ? ($("#edit-form .c-danger").show(), $("#edit-form .c-danger").text(a.message)) : (c.bodyHtml = $("#formContent").html(), window.location.href = window.location.origin + window.location.pathname + '?formId=' + a.form.id + '&_=' + Math.floor(Math.random() * 10000000000))
						//window.location.href = "/form/edit/" + a.form.id)
					},
					error: function() {}
				})
			})
		});
		// 显示历史版本按钮
		$(document).on("click", ".j_showHisVersion", function(a) {
			$.ajax({
				type: "GET",
				data: {
					formId: c.formId
				},
				dataType: "json",
				cache: !1,
				url: "static/data/findHistoryVersions.json",
				success: function(a) {
					a = a.formLayouts;
					var c = $(b.get("historyversion"));
					$("body").append(c);
					$("#form-historyVersions .j_versionList").empty();
					for (c = 0; c < a.length; c++) {
						var d = a[c],
							e = d.id,
							f = (new Date(d.createTime)).format("{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}"),
							h = d.operator.id,
							d = d.operator.name;
						0 == c ? $("#form-historyVersions .j_versionList").append('<li><a class="usercard-toggle" userid="' + h + '">' + d + '</a> 于<span class="stream-cal">' + f + "</span> 创建了此版本 <span>（当前版本）</span>") : $("#form-historyVersions .j_versionList").append('<li><a class="usercard-toggle" userid="' + h + '">' + d + '</a> 于<span class="stream-cal">' + f + '</span> 创建了此版本<a id="' + e + '" class="btn btn-xs btn-info j_enableVersion">恢复</a><a id="' + e + '" class="btn btn-xs btn-warning j_showVersion">预览</a></li>')
					}
					$("#form-historyVersions").modal()
				}
			})
		});
		// 估计是切换到历史版本的按钮，没找到按钮在哪儿
		$(document).on("click", ".j_showVersion", function(a) {
			a = c.formId;
			var d = $(this).attr("id");
			window.open("/form/preview/" + a + "/" + d)
		});
		// 貌似是恢复布局用的，但是没找到按钮在哪儿
		$(document).on("click", ".j_enableVersion", function(a) {
			$("#form-historyVersions").modal("hide");
			var d = c.formId,
				b = $(this).attr("id");
			l.confirm("确定恢复到此布局版本吗？", function(a) {
				a && (a = {}, a.formId = d, a.layoutId = b, $.ajax({
					type: "POST",
					data: a,
					dataType: "json",
					url: "/form/enableLayout.json",
					success: function(a) {
						null != a.formLayout && (c.layoutId = a.formLayout.id, c.analyseLayout(a.formLayout.layoutDetail))
					}
				}))
			})
		});
		// 隐藏历史记录面板
		$(document).on("hidden.bs.modal", function(a) {
			$("#form-historyVersions").remove()
		})
	};
	// 递归生成每个布局组件的layoutDetail
	c.assemComponent = function(a, b) {
		var f = b.data("componentData");
		// componentSetup貌似就是组件数据存放的地方
		if (null == f || null == f.componentSetup) return null;
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
		} else "DataTable" == f.componentSetup.componentKey ? (g = [], a = 0, b.find(".subtr_js ").children().each(function() {
			var b = c.assemComponent(a, $(this).find(".field_js"));
			if (null == b) return !0;
			g[a] = b.componentSetup;
			a++
		}), f.componentSetup.size = g.length, f.componentSetup.layoutDetail = g) : "TableLayout" == f.componentSetup.componentKey && f.getTableSerialize(c, a);
		return f
	};
	// 设置区组件设置事件绑定，老多了……
	c.componentSetupEvents = function() {
		//组件标题
		$(document).on("keydown", "#editor-component #component-title", function(a) {
			a = $.trim($(this).val());
			$("#widget-control .field-active .widget-title .widget-title_js").text(a);
			$("#widget-control .field-active .widget-title_js").text(a);
			$("#widget-control .field-active").data("componentData").setTitle(a)
		});
		//组件标题
		$(document).on("keyup", "#editor-component #component-title", function(a) {
			a = $.trim($(this).val());
			$("#widget-control .field-active .widget-title .widget-title_js").text(a);
			$("#widget-control .field-active .widget-title_js").text(a);
			$("#widget-control .field-active").data("componentData").setTitle(a)
		});
		// 明细字表标题
		$(document).on("keydown", "#editor-component #component-title-datatable", function(a) {
			a = $.trim($(this).val());
			var c = $("#widget-control .field-active .form-databox-head .j_datatableTitle");
			c.text(a);
			var b = $("#widget-control .field-active").data("componentData");
			"" == a ? c.addClass("hide") : c.removeClass("hide");
			b.setTitle(a)
		});
		// 明细字表标题
		$(document).on("keyup", "#editor-component #component-title-datatable", function(a) {
			a = $.trim($(this).val());
			var c = $("#widget-control .field-active .form-databox-head .j_datatableTitle");
			c.text(a);
			var b = $("#widget-control .field-active").data("componentData");
			"" == a ? c.addClass("hide") : c.removeClass("hide");
			b.setTitle(a)
		});
		// 明细字表描述
		$(document).on("keydown", "#editor-component #component-describe-datatable", function(a) {
			a = $.trim($(this).val());
			var c = $("#widget-control .field-active .j_datatableDescription");
			"" != a ? (c.removeClass("hide"), c.text(a)) : c.addClass("hide");
			$("#widget-control .field-active").data("componentData").setDescribe(a)
		});
		// 明细字表描述
		$(document).on("keyup", "#editor-component #component-describe-datatable", function(a) {
			a = $.trim($(this).val());
			var c = $("#widget-control .field-active .j_datatableDescription");
			"" != a ? (c.removeClass("hide"), c.text(a)) : c.addClass("hide");
			$("#widget-control .field-active").data("componentData").setDescribe(a)
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
				$("#widget-control .field-active").removeClass(a)
			});
			$("#widget-control .field-active").addClass(a);
			$("#widget-control .field-active").data("componentData").setTitleLayout(a)
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
		// 控件尺寸
		$(document).on("change", "#editor-component input:radio[name='tSize']", function(a) {
			b = $(this).val();
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
				return;
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
		$(document).on("change", "#editor-component input:radio[name='componentType']", function(a) {
			var c = $(this).val();
			a = $("#widget-control .field-active");
			var b = a.data("componentData"),
				c = new window[c];
			c.change({
				oldObj: b,
				changeEl: a
			});
			a.data("componentData", c)
		});
		// select 控件默认选中
		$(document).on("change", "#editor-component ul li .option_js", function(a) {
			c.changeFormOption()
		});
		// select 控件option名字输入区域
		$(document).on("keydown", "#editor-component ul li .optionName_js", function(a) {
			a = $(this).val();
			var c = $(this).parent(),
				c = $("#editor-component ul li").index(c),
				b = $("#widget-control .field-active").data("componentData");
			"Select" == b.componentSetup.componentKey ? $("#widget-control .field-active .choicelist_js option").eq(c).text(a) : $("#widget-control .field-active .choicelist_js li").eq(c).find("span").text(a);
			b.componentSetup.options[c].name = a
		});
		// select 控件option名字输入区域
		$(document).on("keyup", "#editor-component ul li .optionName_js", function(a) {
			a = $(this).val();
			var c = $(this).parent(),
				c = $("#editor-component ul li").index(c),
				b = $("#widget-control .field-active").data("componentData");
			"Select" == b.componentSetup.componentKey ? $("#widget-control .field-active .choicelist_js select option").eq(c).text(a) : $("#widget-control .field-active .choicelist_js li").eq(c).find("span").text(a);
			b.componentSetup.options[c].name = a
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
		$(document).on("change", "input:radio[name='dateFormat']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData"),
				b = "";
			"yyyy-MM-dd" == a ? b = "年-月-日" : "yyyy-MM" == a ? b = "年-月" : "yyyy-MM-dd HH:mm" == a && (b = "年-月-日 时:分");
			$("#widget-control .field-active .form-control").attr("placeholder", b);
			c.setFormat(a)
		});
		// 日期控件默认时间
		$(document).on("click", "#editor-component #systemDate", function(a) {
			a = $(this).is(":checked");
			var c = $("#widget-control .field-active").data("componentData");
			a ? $("#editor-component .date_readonly_js").show() : ($("#editor-component .date_readonly_js #readonly").attr("checked", !1), c.setIsReadonly(!1), $("#editor-component .date_readonly_js").hide());
			c.setIsSystemDate(a)
		});
		// 日期控件只读，貌似就没有，被隐藏了
		$(document).on("click", "#editor-component #readonly", function(a) {
			a = $(this).is(":checked");
			$("#widget-control .field-active").data("componentData").setIsReadonly(a)
		});
		// 金额控件选择货币
		$(document).on("change", "select[id='moneyType']", function(a) {
			a = $(this).val();
			var c = $("#widget-control .field-active").data("componentData");
			$("#widget-control .field-active .form-amountbox .money_type_js").text("(" + a + ")");
			c.setType(a)
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
			b.find("#optContent").parent().removeClass("has-error");
			b.find(".j_optBatcEditEr").hide();
			if ("" == f) b.find("#optContent").parent().addClass("has-error"), b.find("#optContent").focus(), b.find(".j_optBatcEditEr").show();
			else {
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
				c.changeFormOption();
				$("#optBatcEdit").modal("hide")
			}
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
		// 运算控件，添加监控字段
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
		// 运算控件，删除监控字段
		$(document).off("click", ".j_delField").on("click", ".j_delField", function(a) {
			a = $(this).parents(".j_monitor_item");
			var c = $("#widget-control .field-active").data("componentData");
			if (2 > a.siblings().length) return l.notify("至少要监控一个"), !1;
			1 == a.prev().length ? a.prev().remove() : a.next().remove();
			a.remove();
			c.getFormula()
		});
		//颜色选择器
		$(document).on("click", "#edit-widget .form-group .in-color", function(a) {
			$("#edit-widget .form-group .in-color").colpick({
				layout: 'hex',
				submit: 0,
 				onChange:function(hsb,hex,rgb,el,bySetColor){
 					$("#widget-control .field-active .form-control").css({"border-color":'#'+hex});
					$("#widget-control .field-active .widget-title_js").css({"color":'#'+hex});
					$("#edit-widget .form-group .in-color").css({"background-color":'#'+hex});
 				}
			});
		});
	};
	// 修改select默认选中项
	c.changeFormOption = function() {
		var a = $("#widget-control .field-active").data("componentData"),
			c = $("#widget-control .field-active .choicelist_js");
		c.html("");
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
	// 控件拖拽区事件
	c.componentDraggableEvents = function() {
		c.fromAndColPanelSortable();
		c.subFromSortable();
		// 表单控件区拖拽
		$("#form-widget-list .drag-into-layout .widget-item").draggable({
			connectToSortable: "#widget-control,.subtr_js td",
			helper: "clone",
			opacity: .8,
			appendTo: "body",
			start: function(a, b) {
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
	// 拖放结束时的回调,主要功能是根据控件名渲染控件插入到释放区域，
	// 然后根据不同的释放区域，清除多余的内容，切换到当前组件页面，重置拖放区域等等操作
	c.sortableProcess = function(a) {
		if (null != a && null != c.currentDrag) {
			var b = a.attr("componentKey"),
				b = new window[b];
			this.addComponentModel(b);
			b.render(a);
			a.data("componentData", b);
			$(".subtd_js ").find(".general_js").remove()
		}
		if (a.parent().hasClass("cell_js") && 1 <= a.siblings().length) if (null != c.currentDrag) a.remove();
		else return !1;
		if (0 < a.parent("td").length && 1 <= a.siblings().length) if (null != c.currentDrag) a.remove();
		else return !1;
		if (null != a && a.hasClass("form-layout_js") || a.hasClass("subform_js") || a.hasClass("table_layout_js")) {
			if (a.parent().hasClass("cell_js") || 0 < a.parent("td").length) if (null != c.currentDrag) a.remove();
			else return !1
		} else null != a && a.hasClass("field_js") ? a.click() : null != a && a.hasClass("subtd_js") && a.find(".field_js").click();
		null != a && a.hasClass("form-layout_js") && c.fromAndColPanelSortable();
		null != a && a.hasClass("subform_js") && (a.find(".field_subform_js").click(), c.subFromSortable());
		null != a && a.hasClass("table_layout_js") && c.fromAndColPanelSortable();
		c.currentDrag = null
	};
	// 启动拖拽释放区域的元素
	c.fromAndColPanelSortable = function() {
		var a = $("#widget-control,.cell_js,.j_tablelayout td"),
			b = $("#widget-control");
		// 设计区域
		b.sortable({
			connectWith: a,
			placeholder: "form-placeholder-filed ",
			cancel: ".j_cancel-drag",
			stop: function(a, b) {
				return c.sortableProcess(b.item)
			},
			over: function(a, c) {
				$(this).find(".form-placeholder-filed").show()
			},
			out: function(a, c) {}
		}).disableSelection();
		// 两列三列布局里的单元格
		b.find(".cell_js").sortable({
			connectWith: a,
			placeholder: "form-placeholder-filed ",
			cancel: ".j_cancel-drag",
			stop: function(a, b) {
				return c.sortableProcess(b.item)
			},
			over: function(a, c) {
				if (1 <= $(this).find(".field_js").length) $(this).find(".form-placeholder-filed").hide();
				else {
					var b = c.item.attr("componentkey");
					"DataTable" != b && "ColumnPanel" != b && "TableLayout" != b || $(this).find(".form-placeholder-filed").hide()
				}
			},
			out: function(a, c) {
				$(this).find(".form-placeholder-filed").show()
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
				return 0 != b.item.parent("td").length && 0 != b.item.siblings().length ? !1 : c.sortableProcess(b.item)
			},
			over: function(a, c) {
				if (1 <= $(this).find(".field_js").length) $(this).find(".form-placeholder-filed").hide();
				else {
					var b = c.item.attr("componentkey"),
						b = c.item.attr("componentkey");
					"DataTable" == b || "ColumnPanel" == b || "TableLayout" == b ? $(this).find(".form-placeholder-filed").hide() : $(this).find(".form-placeholder-filed").show()
				}
			},
			out: function(a, c) {}
		})
	};
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
				var d = new DataTable,
					k = b.item.attr("componentkey"),
					d = d.filterItme[k];
				if (0 == b.item.siblings().length && null == d) return c.sortableProcess(b.item);
				b.item.remove()
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
			$(".form-design .form-view .form-head .form-name").text(a);
			$(".form-preview .form-name").text(a)
		});
		// 表单标题输入框
		$(document).on("keyup", "#edit-form #name-form", function(a) {
			a = $(this).val();
			$(".form-design .form-view .form-head .form-name").text(a);
			$(".form-preview .form-name").text(a)
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
			$(".form-design .form-view .form-head .form-description").text(a);
			$(".form-preview .form-description").text(a)
		});
		// 表单描述输入框
		$(document).on("keyup", "#edit-form #description-form", function(a) {
			a = $(this).val();
			$(".form-design .form-view .form-head .form-description").text(a);
			$(".form-preview .form-description").text(a)
		});
		c.loadformownership()
	};
	// 验证表单名是否合法的貌似，还要讲所有表单的信息上传一遍，保存和修改表单名时触发
	c.checkFormName = function(a) {
		var b = $.trim($("#name-form").val());
		if ("" == b) $("#edit-form .c-danger").show(), $("#edit-form .c-danger").text("请输入表单标题"), $(".j_edit_tab[edit-type='form']").click();
		else if (50 < b.length) $("#edit-form .c-danger").show(), $("#edit-form .c-danger").text("表单名称过长，请少于50字"), $(".j_edit_tab[edit-type='form']").click();
		else {
			var f = {},
				g = c.formId,
				k = $("input[name='ownership']:checked").val();
			k || (k = $("#name-form").attr("ownership"));
			"personal" == k && (f["form.operator"] = TEAMS.currentUser.id);
			f["form.id"] = g;
			f["form.name"] = b;
			f["form.ownership"] = k;
			g = $("#module").val();
			f["form.module"] = g;
			f.module = g;
			"biaoge_report" == g && (f["form.report.id"] = $("#reportId").val());
			"" != b && $.ajax({
				type: "get",
				url: "static/data/checkFormName.json",
				dataType: "json",
				data: f,
				success: function(c) {
					a(c)
				}
			})
		}
	};
	// 判断是否显示表单所属权区域
	c.loadformownership = function() {
		var a = TEAMS.currentUser.admin,
			c = TEAMS.currentTenant.tenantKey;
		// 表单所属权区域的渲染，不知道是用在哪儿的，
		if (!a || $(formId).val()) {
			$("#edit-form div.js_formownership").remove();
		} else {
			$("#edit-form div.js_formownership").show();
		}
		a || $(formId).val() || $("#edit-form #name-form").attr("ownership", "personal");
		"t7akvdnf84" == c && $("#edit-form div.js_formownership div.js_formowner").append('<label class="radio-inline"><input type="radio" value="cloud" name="ownership">eteams云表单</label>')
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
			intro: "1、保存：表单编辑完毕后记得保存您的表单；<br>2、" + ("biaoge" == c.module ? "保存并发布" : "保存并启用") + "：保存当前表单数据并设置为启用状态，可以直接使用了；<br>另外，在“表单设置”下，您可以修改表单名称及其相应的描述。<br><br>",
			position: "left"
		}],
			b = [{
				element: "#formContainer_js #formContent",
				intro: "<h5>报告编辑区</h5>可为报告设计排版<br>1、可以随意拖拽控件的位置；<br>2、可以删除不需要的控件；<br>3、一些特殊控件的操作；<br><br>",
				position: "left"
			}, {
				element: "#form-widget #form-widget-list",
				intro: "<h5>字段控件</h5>以拖拽的方式选择您需要的控件，拖到中间的报告编辑区；<br><br>",
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
				intro: "保存：报告编辑完毕后记得保存您的报表；<br>另外，在“报告设置”下，您可以修改报告名称及其相应的描述。<br><br>",
				position: "left"
			}],
			a = "biaoge_report" == c.module ? b : a;
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
				}, 400), null == $("#formContent #widget-control .field_js").get(0) ? (a = "biaoge_report" == $("#module").val() ? $('<div class="field field_js field-active" title="拖拽至页面中间区域" componentkey="PieComponent" style="display: block;"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="paragraph alert"><img class="statimg" src="/iform/static/img/form/pie.png"></div></div>') : $('<div class="widget-item general_js ui-draggable" componentkey="Text" title="拖拽至页面中间区域"></div>'), $("#formContent #widget-control").append(a), c.currentDrag = a, c.sortableProcess(a)) : null == $("#formContent #widget-control .field_js.field-active").get(0) && $("#formContent #widget-control .field_js:eq(0)").click(), $(".j_edit_tab[edit-type='widget']").click()
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
				contentType: "application/json;charset=UTF-8",
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
			a.parent().siblings().find("a").removeClass("active");
			a.addClass("active");
			"form" == c ? ($("#layout-widget-list").hide(), $("#form-widget-list").show()) : "layout" == c && ($("#layout-widget-list").show(), $("#form-widget-list").hide())
		});
		$(document).on("click", ".j_edit_tab", function() {
			var a = $(this),
				c = a.attr("edit-type");
			a.parent().siblings().find("a").removeClass("active");
			a.addClass("active");
			"widget" == c ? ($("#edit-form").hide(), $("#edit-widget").show()) : "form" == c && ($("#edit-form").show(), $("#edit-widget").hide())
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
		1 > $("#introCount").val() && c.formIntro();
		c.beforeunload();
		c.formEvents();
		c.formSetupEvents();
		c.componentSetupEvents();
		c.componentDraggableEvents();
		var b = $("#formId").val(),
			f = $("#filterName").val(),
			g = $("#filterDescription").val();
		0 < $("#reportId").length && (c.reportId = $("#reportId").val());
		$(".form-name").text(f);
		$(".form-description").text(g);
		c.calculateHeight();
		c.bodyHtml = $("#formContent").html();
		c.loadFormLayout(b);
		b || $(".j_showHisVersion").remove();
		"task" == $("#module").val() && $(".j_edit_tab").click();
		$(document).on("afterCreateCell", function(a, b) {
			c.fromAndColPanelSortable()
		})
	});
	n.exports = c
});
define("form/componentmodel", function(h, m, n) {
	h = Backbone.Model.extend({
		initialize: function(h) {
			null != h && (this.formId = h.reportId)
		},
		getFormSelectFields: function(h) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/getFormStatFields.json",
				dataType: "json",
				data: JSON.stringify({
					formId: this.formId
				}),
				success: function(b) {
					h && h(b)
				}
			})
		},
		getFormTableSelectFields: function(h) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/findFormTableStatFields.json",
				dataType: "json",
				data: JSON.stringify({
					formId: this.formId
				}),
				success: function(b) {
					h && h(b)
				}
			})
		},
		getFormNumberSelectFields: function(h) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/getFormNumberStatFields.json",
				dataType: "json",
				data: JSON.stringify({
					formId: this.formId
				}),
				success: function(b) {
					h && h(b)
				}
			})
		},
		getNumberFieldStatData: function(h, b) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/countNumberStatData.json",
				dataType: "json",
				data: JSON.stringify({
					fieldId: h.componentSetup.dataSetId,
					statType: h.componentSetup.stattype
				}),
				success: function(a) {
					b && b(a)
				}
			})
		},
		getFieldStat: function(h, b) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/getFieldChartData.json",
				dataType: "json",
				data: JSON.stringify({
					fieldId: h
				}),
				success: function(a) {
					b && b(a)
				}
			})
		},
		getTablePageData: function(h, b) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formdatastat/findRowListByFieldIds.json",
				dataType: "json",
				data: JSON.stringify({
					formId: this.formId,
					fieldIds: h.fieldIds,
					pageNo: h.pageNo,
					pageSize: h.pageSize
				}),
				success: function(a) {
					b && b(a)
				}
			})
		},
		generatorId: function(h) {
			$.ajax({
				type: "post",
				url: "/form/generatorId.json",
				dataType: "json",
				async: !1,
				success: function(b) {
					h && h(b)
				}
			})
		}
	});
	n.exports = h
});
define("form/formpreview", ["form/form-plugin"], function(h, m, n) {
	var l = h("form/form-plugin"),
		b = {
			laodForm: function() {
				var a = $("#formId").val(),
					c = $("#formLayoutId").val(),
					d = $("#dataId").val(),
					e = $("#reportId").val();
				e && 0 < e.length && $("#widget-control").data("reportId", e);
				var e = $("#filterName").val(),
					f = $("#filterDescription").val();
				$(".form-name").text(e).attr("title", e);
				$(".form-description").text(f).attr("title", f);
				$("#widget-control").html("");
				null == TEAMS.currentUser && ($(".btn-login").removeClass("hide"), needCopy = !1);
				null != d && "" != d ? l.renderFormData({
					parentEl: $("#widget-control"),
					dataId: d,
					notDefault: !0,
					callback: function(a) {
						"submit" == a.formData.dataStatus ? $("#submit").parent().remove() : ($("#submit").removeClass("hide"), $("#temporary").show())
					}
				}) : l.renderForm({
					parentEl: $("#widget-control"),
					formId: a,
					layoutId: c,
					callback: function(a) {
						0 < window.location.href.indexOf("/fill/") ? ($("#submit").removeClass("hide"), $("#temporary").show()) : $("#submit").parent().remove()
					}
				});
				b.comment.loadComment({
					formId: a,
					pageSize: b.comment.pageSize,
					pageNo: b.comment.pageNo
				});
				0 != window.location.pathname.indexOf("/biaoge/preview/") ? $(".form-preview-wrapper .j_cloneForm").remove() : null != TEAMS.currentUser && $(".form-preview-wrapper .j_cloneForm").removeClass("hide"); - 1 == window.location.pathname.indexOf("/previewFill") && $(".form-preview-wrapper .comment-box").removeClass("hide"); - 1 < window.location.pathname.indexOf("/biaoge") && $(".j_go-home").removeClass("hide")
			},
			calculateHeight: function() {
				var a = $(window).height();
				$("#form-preview").attr("style", "min-height:" + (a - 30) + "px;")
			},
			comment: {
				pageNo: 1,
				pageSize: 10,
				search: function(a, c) {
					$.ajax({
						type: "post",
						url: "/biaoge/searchFormcomment.json",
						dataType: "json",
						data: a,
						success: function(a) {
							c && c(a)
						}
					})
				},
				create: function(a, c) {
					$.ajax({
						type: "post",
						url: "/biaoge/createFormcomment.json",
						dataType: "json",
						data: a,
						success: function(a) {
							c && c(a)
						}
					})
				},
				loadComment: function(a) {
					this.search(a, function(a) {
						$.each(a.pageFormComment.result, function() {
							var a = $(".j_module-container .j_comment:first").clone().removeClass("hide");
							a.find(".j_time").text("评论于：" + (new Date(this.createTime)).format("{yyyy}-{MM}-{dd} {HH}:{mm}"));
							a.find(".j_content").text(this.content);
							this.operator && !this.anonymous && (this.operator.username && a.find(".j_pic").text(this.operator.username).removeClass("pic-anonymous"), this.operator.avatar.p3 && TEAMS.currentUser && a.find("img").attr("src", "/base/download/" + this.operator.avatar.p3));
							a.appendTo($(".j_module-container .preview-list"))
						});
						a.pageFormComment.hasNext ? $(".j_module-container .j_morecontent").removeClass("hide") : $(".j_module-container .j_morecontent").addClass("hide")
					})
				}
			}
		};
	$(function() {
		"mobile" != window.systemInfo_form && ($("body").off("resizeSroll").on("resizeSroll", "div.scroll-wrapper", function(a) {
			a = $(this);
			if (a.attr("horizontal")) {
				var b = $(window).width(),
					e = a.offset().left;
				a.css("width", b - e)
			} else {
				var b = $(window).height(),
					e = a.attr("marginbottom") || 0,
					f = a.offset().top;
				a.css("height", b - f - e)
			}
			a.mCustomScrollbar("update")
		}), function(a) {
			var b = a.attr("marginbottom") || 0,
				e = a.offset().top,
				f = $(window).height();
			a.height(f - e - b);
			b = a.attr("theme") ? a.attr("theme") : "darkblue";
			a.hasClass("mCustomScrollbar") || a.mCustomScrollbar({
				theme: b
			})
		}($(".j_module-container")), b.calculateHeight(), $(window).off("resize.formpreview").on("resize.formpreview", function(a) {
			b.calculateHeight();
			setTimeout(function() {
				$("body div.scroll-wrapper").each(function(a) {
					$(this).trigger("resizeSroll", a)
				})
			}, 100)
		}), $(".preview_btn").click(function(a) {
			$(".comment-box").hasClass("in") ? ($(".comment-box").removeClass("in"), $(this).addClass("preview_btn_off").attr("title", "显示评论")) : ($(".comment-box").addClass("in"), $(this).removeClass("preview_btn_off").attr("title", "隐藏评论"), a.stopPropagation())
		}), $("body").off("click").on("click", function(a) {
			a = $(a.target);
			!a.hasClass("comment-box") && null == a.parents(".comment-box").get(0) && $(".comment-box").hasClass("in") && ($(".comment-box").removeClass("in"), $(".preview_btn").addClass("preview_btn_off").attr("title", "显示评论"))
		}), $(".j_module-container").off("click.formpreview", ".j_addcomment").on("click.formpreview", ".j_addcomment", function() {
			console.log(b.model);
			var a = $("#formId").val(),
				d = $.trim($(".j_module-container .j_content").val()),
				a = {
					"formComment.formID": a,
					"formComment.content": d
				},
				d = $.trim($(".j_module-container .j_content").val());
			0 == d.length ? l.notify("评论内容不能为空") : 200 < d.length ? l.notify("评论内容不能超过200个字符") : b.comment.create(a, function(a) {
				a = $(".j_module-container .j_comment:first").clone().removeClass("hide");
				a.find(".j_time").text("评论于：" + (new Date).format("{yyyy}-{MM}-{dd} {HH}:{mm}"));
				a.find(".j_content").text(d);
				TEAMS.currentUser && (TEAMS.currentUser.username && a.find(".j_pic").text(TEAMS.currentUser.username).removeClass("pic-anonymous"), TEAMS.currentUser.avatar && a.find("img").attr("src", "/base/download/" + TEAMS.currentUser.avatar.p3));
				$(".j_module-container .j_comment:first").after(a);
				$(".j_module-container .j_content").val("")
			})
		}), $(".j_module-container .j_morecontent").click(function() {
			$(this).addClass("hide");
			b.comment.pageNo++;
			var a = {
				formId: $("#formId").val(),
				pageSize: b.comment.pageSize,
				pageNo: b.comment.pageNo
			};
			b.comment.loadComment(a)
		}), $(".form-preview-wrapper .j_cloneForm").on("click.formpreview", function() {
			TEAMS.currentUser ? copyForm(TEAMS.currentUser.userId) : $("#login-dialog").modal("show");
			return !1
		}), $(".btn-login").on("click.formpreview", function() {
			$("#login-dialog").modal("show")
		}), $(".j_module-container .j_content").on("keyup.formpreview", function(a) {
			13 == (a ? a : window.event ? window.event : null).keyCode && $(".j_module-container .j_addcomment").trigger("click.formpreview")
		}));
		b.laodForm();
		var a = "click";
		"mobile" == window.systemInfo_form && (a = "tap");
		$(document).on(a, "#submit", function(a) {
			var b = $(this);
			0 != b.data("isSubmit") && (b.data("isSubmit", !1), l.saveFormData({
				parentEl: $("#widget-control"),
				dataStatus: 1,
				callback: function(a) {
					b.data("isSubmit", !0);
					a.actionMsg && l.notify(a.actionMsg.message);
					a.formData && (window.location.href = "/biaoge/previewFill/" + a.formData.id)
				}
			}))
		});
		$(document).on("click", "#temporary", function(a) {
			l.saveFormData({
				parentEl: $("#widget-control"),
				dataStatus: 0,
				callback: function(a) {
					a.formData && (window.location.href = "/biaoge/previewFill/" + a.formData.id)
				}
			})
		});
		$(document).on("click", "#readOnly", function(a) {
			l.setFormReadOnly({
				parentEl: $("#widget-control"),
				readOnly: !0
			})
		});
		$(document).on("click", "#notReadOnly", function(a) {
			l.setFormReadOnly({
				parentEl: $("#widget-control"),
				readOnly: !1
			})
		});
		$("#login-dialog .tab-list").on("click", "li", function() {
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			var a = $(this).find("a").attr("href");
			$("#login-dialog .tab-pane").removeClass("active");
			$("#login-dialog").find(a).addClass("active")
		})
	});
	n.exports = b
});
var needCopy = !0;
// 在某种情况下可以在未登录的情况下看到表单模板库的预览，在“选用此模板建表单”操作时会弹出登陆框，
// 登陆成功后登录框内的iframe会调用这个函数
// 貌似这部分代码是给表格网(http://www.ebiaoge.com/)用的，咱们不一定用得上
function loginCallback(h) {
	$("#login-dialog").modal("hide");
	h = h.uid;
	needCopy ? copyForm(h) : ($(".btn-login").addClass("hide"), window.location.reload())
}
// '选用此模板建表单'时的复制模板操作，这个操作是同步的，要区分到底是在流程中复制还是在业务表单中复制
// 貌似这部分代码是给表格网(http://www.ebiaoge.com/)用的，咱们不一定用得上
function copyForm(h) {
	h = $("#formId").val();
	var m = $("#module").val();
	"workflow" == m ? $.ajax({
		type: "post",
		url: "/form/copy.json",
		dataType: "json",
		async: !1,
		data: {
			formId: h,
			module: m
		},
		success: function(h) {
			h && h.form ? (TEAMS.currentUser || window.location.reload(), window.open("/workflows/" + TEAMS.currentUser.id + "/formsPersonal")) : formPlugin.notify("服务器请求失败，请联系系统管理员!")
		}
	}) : $.ajax({
		type: "post",
		url: "/biaoge/copy.json",
		dataType: "json",
		async: !1,
		data: {
			formId: h
		},
		success: function(h) {
			h && h.form ? (TEAMS.currentUser || window.location.reload(), window.open("/forms")) : formPlugin.notify("服务器请求失败，请联系系统管理员!")
		}
	})
}
define("form/form-plugin", ["form/component/text", "form/component/textarea", "form/component/columnpanel", "form/component/datatable", "form/component/dividingline", "form/component/datecomponent", "form/component/dateinterval", "form/component/option", "form/component/radiobox", "form/component/checkbox", "form/component/select", "form/component/paragraph", "form/component/numbercomponent", "form/component/money", "form/component/department", "form/component/employee", "form/component/email", "form/component/phone", "form/component/mobile", "form/component/filecomponent", "form/component/imagecomponent", "form/component/barcomponent", "form/component/piecomponent", "form/component/tablestatcomponent", "form/component/numberstatcomponent", "form/component/tablecomponent", "form/component/monitor", "form/component/tablelayout", "form/component/raty", "form/componentmodel","form/component/reference","form/component/htmltext","form/component/precent","form/component/hyperlink","form/component/password"], function(h, m, n) {
	h("form/component/text");
	h("form/component/textarea");
	h("form/component/columnpanel");
	h("form/component/datatable");
	h("form/component/dividingline");
	h("form/component/datecomponent");
	h("form/component/dateinterval");
	h("form/component/option");
	h("form/component/radiobox");
	h("form/component/checkbox");
	h("form/component/select");
	h("form/component/paragraph");
	h("form/component/numbercomponent");
	h("form/component/money");
	h("form/component/department");
	h("form/component/employee");
	h("form/component/email");
	h("form/component/phone");
	h("form/component/mobile");
	h("form/component/filecomponent");
	h("form/component/imagecomponent");
	h("form/component/barcomponent");
	h("form/component/piecomponent");
	h("form/component/tablestatcomponent");
	h("form/component/numberstatcomponent");
	h("form/component/tablecomponent");
	h("form/component/monitor");
	h("form/component/tablelayout");
	h("form/component/raty");
	h("form/component/reference");
	h("form/component/precent");
	h("form/component/hyperlink");
	h("form/component/password");
	h("form/component/htmltext");
	h("form/component/codeRule");
	var l = h("form/componentmodel");
	window.formPlugin = {};
	formPlugin.loadingImgEl = '<div class="loading_small form-loading"><span>加载中...</span></div>';
	formPlugin.nullDataEl = '<div class="alert alert-block fade in"><h4 class="alert-heading">对不起! 你访问的表单不存在</h4><p>您访问的表单可能已经被其他用户删除了。</p></div>';
	$(function() {
		$(document).off("currentTime").on("currentTime", function(b, a) {
			a(TEAMS.nowTime)
		});
		$(document).off("currentDepartment").on("currentDepartment", function(b, a) {
			a(TEAMS.currentUser.department)
		});
		$(document).off("currentUser").on("currentUser", function(b, a) {
			a(TEAMS.currentUser)
		});
		$(document).off("saveComponentValue").on("saveComponentValue", function(b, a, c) {
			a = $(a);
			b = $(a).parents(".form-view_js");
			var d = b.data("form");
			null != d && null != d.dataId && formPlugin.saveFormData({
				parentEl: b,
				callback: function(b) {
					a.find(".form-error").text("修改成功");
					a.find(".form-error").fadeIn(500).fadeOut(2E3);
					window.formJsonStr = null;
					c && c(b)
				}
			})
		})
	});
	formPlugin.renderForm = function(b) {
		(function(a) {
			var c = a.parentEl;
			c.html(formPlugin.loadingImgEl);
			var b = a.formId,
				e = a.layoutId,
				f = a.readOnly,
				g = a.notDefault,
				k = a.layoutDetail,
				p = a.callback;
			null != k ? (formPlugin.analyseLayout(k, c, g, f), p && p()) : (a = {}, a.formId = b, a.layoutId = e, $.ajax({
				type: "POST",
				data: a,
				dataType: "json",
				url: "/form/findPreviewFrom.json",
				success: function(a) {
					if (null == a.formLayout) c.parents(".form-view").html(formPlugin.nullDataEl);
					else {
						var e = c.data("form");
						null == e ? e = {
							formId: b,
							layoutId: a.formLayout.id,
							readOnly: f
						} : (e.formId = b, e.layoutId = a.formLayout.id, e.readOnly = f);
						c.data("form", e);
						c.data("startTime", (new Date).getTime());
						formPlugin.analyseLayout(a.formLayout.layoutDetail, c, g, f)
					}
					p(a)
				},
				error: function() {}
			}))
		})(b)
	};
	formPlugin.renderFormDataByLayoutId = function(b) {
		var a = b.callback,
			c = b.parentEl;
		b.callback = function(b) {
			var e = c.data("form");
			e && delete e.dataId;
			a && a(b)
		};
		formPlugin.renderFormData(b)
	};
	formPlugin.renderFormData = function(b) {
		(function(a) {
			var c = a.parentEl;
			c.html(formPlugin.loadingImgEl);
			var b = a.readOnly,
				e = a.notDefault,
				f = a.layoutId,
				g = a.callback,
				k = {};
			k.dataId = a.dataId;
			k.layoutId = f;
			$.ajax({
				type: "POST",
				data: k,
				dataType: "json",
				url: "/formdata/findFormData.json",
				success: function(a) {
					if (null == a.formLayout) c.parents(".form-view").html(formPlugin.nullDataEl);
					else {
						null == b && (b = "submit" == a.formData.dataStatus ? !0 : !1);
						if (null == e || "" == e) e = !0;
						var f = c.data("form");
						null == f ? f = {
							formId: a.formData.form.id,
							layoutId: a.formLayout.id,
							dataId: a.formData.id,
							readOnly: b
						} : (f.formId = a.formData.form.id, f.layoutId = a.formLayout.id, f.dataId = a.formData.id, f.readOnly = b);
						c.data("form", f);
						c.data("startTime", (new Date).getTime());
						formPlugin.analyseLayout(a.formLayout.layoutDetail, c, e, b);
						formPlugin.subFormFillRows(a.maxSubFormIndexs, c);
						formPlugin.fillFieldContent(a.formData.dataDetails, c);
						"mobile" == window.systemInfo_form && (formPlugin.mobileShowSubForm(a.formData.dataDetails, c), b && c.addClass("form-noedit"))
					}
					g(a)
				},
				error: function() {}
			})
		})(b)
	};
	formPlugin.saveFormData = function(b) {
		var a = b.parentEl,
			c = b.callback;
		if (null != a.get(0)) {
			var d = a.data("form");
			d.readOnly ? c && c({
				type: "readOnly"
			}) : formPlugin.submitCheck(a, c) && (b = formPlugin.submitAssembleForm(b), $.ajax({
				contentType: "application/json;charset=UTF-8",
				type: "POST",
				dataType: "json",
				url: "/formdata/save.json",
				data: JSON.stringify(b),
				success: function(a) {
					a.formData && (d.dataId = a.formData.id);
					c(a)
				},
				error: function() {}
			}))
		}
	};
	formPlugin.saveFieldData = function(b) {
		var a = b.parentEl,
			c = b.callback;
		if (null != a.get(0)) {
			var d = $(a).parents(".form-view_js").data("form");
			!d.readOnly && formPlugin.submitCheck(a, c) && (b = formPlugin.submitAssembleForm(b), $.ajax({
				contentType: "application/json;charset=UTF-8",
				type: "POST",
				dataType: "json",
				url: "/formdata/saveFieldData.json",
				data: JSON.stringify(b),
				success: function(a) {
					d.dataId = a.formData.id;
					c(a)
				},
				error: function() {}
			}))
		}
	};
	formPlugin.filterBlankLines = function() {
		$("table.subtable_js").each(function() {
			$(this).find(".subtr_js").not(":eq(0)").each(function() {
				var b = !0;
				$(this).find(".field_js .check_js").each(function() {
					null != $(this).data("componentData").getValue($(this)) && (b = !1)
				});
				b && $(this).remove()
			})
		})
	};
	formPlugin.submitCheck = function(b, a) {
		var c = !0,
			d = b.find(".field_js .check_js");
		null == d.get(0) && (d = b.find(".check_js"));
		d.each(function(b) {
			$(this).data("componentData").submitCheck($(this), function(b) {
				formPlugin.checkPrompt(b) || (a && a(), c = !1)
			});
			if (!c && "mobile" == window.systemInfo_form) return !1
		});
		return c
	};
	formPlugin.submitAssembleForm = function(b) {
		var a = b.parentEl,
			c = 1 == b.dataStatus ? "submit" : "temporary";
		if (null != a.get(0)) {
			var d = a.data("form");
			null == d && (d = a.parents(".form-view_js").data("form"));
			if (null != d) {
				var e = d.formId,
					f = d.dataId,
					d = d.layoutId;
				null != f && null == b.dataStatus && (c = null);
				var g = 0,
					k = a.data("startTime");
				k && (g = ((new Date).getTime() - k) / 1E3, g = parseInt(g, 10), g = 0 < g ? g : 0);
				b = {
					formData: {
						id: f,
						form: {
							id: e
						},
						formLayout: {
							id: d
						},
						spentTime: g,
						dataStatus: c
					},
					isDel: b.isDel,
					clientSource: "pc"
				};
				"mobile" == window.systemInfo_form && (b.clientSource = "mobile");
				c = formPlugin.assembleFormFieldData(a);
				a = formPlugin.assembleSubFormData(a);
				b.formData.dataDetails = c;
				b.formData.subFormLogs = a;
				return b
			}
		}
	};
	formPlugin.assembleFormFieldData = function(b) {
		var a = [],
			c = 0,
			d = b.find(".field_js .check_js");
		null == d.get(0) && (d = b.find(".check_js"));
		d.each(function(b) {
			b = $(this).data("componentData");
			var d = b.getValue($(this)),
				g = $(this).parents(".subtable_js"),
				k = "",
				p = "";
			null != g.get(0) && (b = g.data("componentData"), k = b.componentSetup.subFormId, p = $(this).parents(".subtr_js").index());
			if ("[object Object]" == Object.prototype.toString.apply(d)) null != g.get(0) && (d.subForm = {
				id: k
			}, d.dataIndex = p), a[c] = d, c++;
			else if ("[object Array]" == Object.prototype.toString.apply(d)) for (b = 0; b < d.length; b++)
			null != g.get(0) && (d[b].subForm = {
				id: k
			}, d[b].dataIndex = p), a[c] = d[b], c++
		});
		return a
	};
	formPlugin.assembleSubFormData = function(b) {
		var a = [],
			c = b.find(".subtable_js");
		null == c.get(0) && (c = b.parents(".form-view_js").find(".subtable_js"));
		c.each(function(c) {
			var b = $(this).data("componentData").getValue($(this));
			a[c] = b
		});
		return a
	};
	formPlugin.subFormFillRows = function(b, a) {
		if (null != b && 0 != b.length) for (var c = 0; c < b.length; c++) {
			var d = b[c],
				e = d.maxIndex,
				f = a.find("#" + d.subFormId).find("table.subtable_js"),
				d = f.data("componentData");
			formPlugin.destroyEvents(f);
			f.find("tr.subtr_js").not(":eq(0)").remove();
			for (f = 0; f < e; f++)
			d.addRow()
		}
	};
	formPlugin.fillFieldContent = function(b, a) {
		if (null != b && 0 < b.length) for (var c = 0; c < b.length; c++) {
			var d = b[c];
			if (null != d.formField) {
				var e = d.formField.id,
					f = null;
				null != d.subForm ? (f = d.dataIndex, f = a.find("#" + d.subForm.id).find(".subtr_js").eq(f).find("#field_" + e)) : f = a.find("#field_" + e);
				0 != f.length && (e = f.find(".check_js"), null == e.get(0) && (e = f.parents(".check_js")), e.data("componentData").setValue(f, d))
			}
		}
		null != $(".subform_js").get(0) && this.renderTotal(a.find(".subform_js"))
	};
	formPlugin.renderTotal = function(b) {
		var a = this;
		b.find(".subtable_js tfoot span").each(function(c) {
			c = $(this).attr("name");
			var d = b.find('.subtable_js input[name="' + c + '"]'),
				d = new String(formPlugin.calculateTotal(d));
			"Money" == b.find('span[name="' + c + '"]').attr("type") && "人民币" == b.find('span[name="' + c + '"]').attr("tp") && (d = a.formatMoney(d, 0 < d.indexOf(".") ? d.length - (d.indexOf(".") + 1) : -1) + " " + ("" == a.numberToChinese(d) ? a.numberToChinese(d) : "(" + a.numberToChinese(d) + ")"));
			b.find('span[name="' + c + '"]').html(d)
		})
	};
	formPlugin.numberToChinese = function(b) {
		var a = "",
			c = "仟佰拾亿仟佰拾万仟佰拾元角分";
		b += "00";
		var d = b.indexOf(".");
		0 <= d && (b = b.substring(0, d) + b.substr(d + 1, 2));
		c = c.substr(c.length - b.length);
		for (d = 0; d < b.length; d++)
		a += "零壹贰叁肆伍陆柒捌玖".substr(b.substr(d, 1), 1) + c.substr(d, 1);
		return a.replace(/零分$/, "").replace(/零角零分$/, "").replace(/零[仟佰拾]/g, "零").replace(/零{2,}/g, "零").replace(/零([亿|万])/g, "$1").replace(/零+元/, "元").replace(/亿零{0,3}万/, "亿").replace(/^元/, "零元").replace(/零角$/, "").replace(/零元$/, "")
	};
	formPlugin.calculateTotal = function(b) {
		var a = this,
			c = 0;
		b.each(function(b) {
			b = parseFloat($(this).val().replace(/[^\d.-]/g, ""));
			if (!b || "" == b || isNaN(b)) return !0;
			c = a.accAdd(c, b)
		});
		return c
	};
	formPlugin.accAdd = function(b, a) {
		var c, d;
		try {
			c = b.toString().split(".")[1].length
		} catch (e) {
			c = 0
		}
		try {
			d = a.toString().split(".")[1].length
		} catch (f) {
			d = 0
		}
		c = Math.pow(10, Math.max(c, d));
		return Math.round(b * c + a * c) / c
	};
	formPlugin.checkPrompt = function(b) {
		var a = b.element;
		b = b.message;
		var c = !0;
		null != b && "" != b ? (a.parents(".field_js").find(".form-error").text(b), "mobile" == window.systemInfo_form ? formPlugin.notify(b) : a.parents(".field_js").find(".form-error").show(), c = !1) : (a.parents(".field_js").find(".form-error").text(""), a.parents(".field_js").find(".form-error").hide());
		return c
	};
	formPlugin.analyseLayout = function(b, a, c, d) {
		a.html("");
		b && (b = JSON.parse(b), formPlugin.analyseComponent(b, a, c, d));
		formPlugin.renderMonitorTitle(a)
	};
	formPlugin.renderMonitorTitle = function(b) {
		var a = $(b).find(".field_js[componentkey='Monitor']");
		a && 0 < a.length && $.each(a, function() {
			$(this).find(".check_js").data("componentData").setMonitorTitle(b, $(this))
		})
	};
	formPlugin.addComponentModel = function(b, a) {
		var c = a.data("reportId") || a.parents(".form-view_js").data("reportId");
		null == c || b.componentmodel || (cmpmodel = new l({
			reportId: c
		}), b.setComponentModel(cmpmodel))
	};
	formPlugin.analyseComponent = function(b, a, c, d) {
		var e = b.componentKey,
			f = new window[e](b);
		this.addComponentModel(f, a);
		var g = f.renderPreview(a, c, d);
		f.checkEvents(function(a) {
			formPlugin.checkPrompt(a)
		});
		if ("ColumnPanel" == e && null != b.layoutDetail) for (e = 0; e < b.layoutDetail.length; e++)
		if (f = b.layoutDetail[e]) {
			var k = "",
				k = 1 == b.size ? a : $(g[e]);
			formPlugin.analyseComponent(f, k, c, d)
		}
	};
	formPlugin.setFormReadOnly = function(b) {
		var a = b.parentEl,
			c = b.readOnly;
		null != a && null != c && (a.find(".field_js .check_js").each(function(b) {
			$(this).data("componentData").readOnly(a, c)
		}), a.find(".subform_js").each(function(b) {
			$(this).find(".subtable_js").data("componentData").readOnly(a, c)
		}))
	};
	formPlugin.setEmpty = function(b) {
		null != b && b.find(".field_js .check_js").each(function(a) {
			$(this).data("componentData").empty($(this).parents(".field_js "))
		})
	};
	formPlugin.mobileShowSubForm = function(b, a) {
		a.find(".widget-content").siblings(".j_subField").remove();
		if (null != b && 0 < b.length) for (var c = 0; c < b.length; c++) {
			var d = b[c],
				e = d.formField.id,
				f = null;
			if (null != d.subForm) {
				a.find("#" + d.subForm.id + " .widget-content").addClass("hide");
				f = d.dataIndex;
				f = a.find("#" + d.subForm.id).find(".subtr_js").eq(f).find("#field_" + e);
				a.find("#" + d.subForm.id + " .subtable_js .subtr_js").not(":eq(0)").each(function(a) {
					$(this).attr("index", a + 1)
				});
				var e = d.content,
					g = d.dataText,
					d = d.dataOptions,
					k = f.find(".widget-content");
				null == k.get(0) && (k = f.parents(".widget-content"));
				k.parent().append($('<div class="j_subField"></div>'));
				k.addClass("hide");
				k = k.next();
				if (d) for (var p = 0; p < d.length; p++) {
					var q = d[p].content,
						h = d[p].type,
						l = d[p].optionId;
					h && "imageFile" == h ? k.append('<img src="/base/download/img/' + l + '/small">') : k.append("<span class='mr-10'>" + q + "</span>")
				}
				e && ("startDate" == f.attr("datetype") ? k.prepend("<span class='mr-10 j_startDate'>" + e + "</span>") : "endDate" == f.attr("datetype") ? k.append("<span class='j_endDate'>" + e + "</span>") : k.append("<span class='mr-10'>" + e + "</span>"));
				g && g.content && k.append("<span>" + g.content + "</span>");
				k.siblings(".j_subField").remove()
			}
		}
	};
	formPlugin.renderStatSearch = function(b) {
		(new window[b.componentKey]).renderStatSearch(b)
	};
	formPlugin.datepickerHelper = {
		defaults: {
			el: "input.datepicker",
			callback: function(b) {},
			eventType: "focusin.datePicker"
		},
		init: function(b) {
			var a = [];
			$.isArray(b) ? a = b : a.push(b);
			for (var c = 0; c < a.length; c++) {
				b = a[c];
				if ($.isFunction(b)) {
					var d = b;
					b = {};
					b.callback = d
				}
				b = $.extend(!0, {}, this.defaults, b);
				(function(a) {
					var c = $(a.el),
						b = c.attr("format") || "yyyy-mm-dd",
						d = c.attr("startView") || "month",
						p = c.attr("minView") || "month",
						q = c.attr("maxView") || "decade",
						h = c.attr("position") || "bottom-right",
						l = c.attr("dateGroup"),
						n = a.callback,
						m = c.attr("writeValue"),
						v = c.attr("insertAfter");
					c.each(function() {
						var a = $(this);
						a.on("focusin.datePicker", function() {
							a.datetimepicker({
								format: b,
								language: "zh-CN",
								todayHighlight: !0,
								todayBtn: l,
								autoclose: !0,
								initialDate: new Date,
								startView: d,
								minView: p,
								maxView: q,
								pickerPosition: h,
								showMeridian: !1,
								writeValue: m
							}).on("show", function() {
								v && !a.attr("relocated") && (a.data("datetimepicker").picker.insertAfter(a).css("position", "fixed"), a.attr("relocated", !0))
							});
							a.datetimepicker("show");
							a.off("focusin.datePicker")
						}).on("changeDate", function(a) {
							n(a)
						})
					})
				})(b)
			}
		},
		remove: function(b) {
			if (arguments) for (var a = 0; a < arguments.length; a++)
			$(arguments[a]).datetimepicker("remove")
		}
	};
	formPlugin.datepicker = function(b) {
		formPlugin.datepickerHelper.init(b)
	};
	formPlugin.confirm = function(b, a) {
		bootbox.setLocale("zh_CN");
		bootbox.confirm(b, function(c) {
			a && a(c)
		})
	};
	formPlugin.formatMoney = function(b, a) {
		a = 2 < a && 20 >= a ? a : 2;
		b = parseFloat((b + "").replace(/[^\d\.-]/g, "")).toFixed(a) + "";
		var c = b.split(".")[0].split("").reverse(),
			d = b.split(".")[1];
		t = "";
		for (i = 0; i < c.length; i++)
		t += c[i] + (0 == (i + 1) % 3 && i + 1 != c.length ? "," : "");
		return t.split("").reverse().join("") + "." + d
	};
	formPlugin.notify = function(b, a, c, d) {
		void 0 == d && (d = !0);
		b = {
			sticker: !1,
			shadow: !1,
			history: !1,
			hide: d,
			opacity: .95,
			animation: {
				effect_in: "slide",
				effect_out: "none"
			},
			text: b,
			title: a
		};
		switch (c) {
		case "error":
			b.type = "error";
			break;
		case "info":
			b.type = "info";
			break;
		case "success":
			b.type = "success"
		}
		$.pnotify_remove_all();
		$.pnotify(b)
	};
	formPlugin.destroyEvents = function(b) {
		$(b) && $(b).get(0) && $(b).find("textarea").trigger("autosize.destroy")
	};
	n.exports = window.formPlugin
});
define("form/component/paragraph", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.Paragraph = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Paragraph",
				content: "空白的段落",
				style: "alert-success",
				order: 0,
				index: 0
			};
			null != b && (this.componentSetup.content = b.content, this.componentSetup.style = b.style, this.componentSetup.order = b.order, this.componentSetup.index = b.index);
			this.tpl = l.get("paragraph")
		},
		setContent: function(b) {
			this.componentSetup.content = b
		},
		setStyle: function(b) {
			this.componentSetup.style = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-paragraph");
			b.attr("class", a.attr("class"));
			a.find(".paragraph").html(this.componentSetup.content);
			var c = a.find(".paragraph").attr("class") + " " + this.componentSetup.style;
			a.find(".paragraph").attr("class", c);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-paragraph");
			b.find("input:radio[name='paragraphType'][value='" + this.componentSetup.style + "']").attr("checked", !0);
			$("#editor-component").html(b.html());
			$(document).trigger("renderCkEditor")
		},
		renderPreview: function(b) {
			var a = $(this.tpl).siblings("#preview-paragraph");
			a.find(".paragraph").html(this.componentSetup.content);
			var c = a.find(".paragraph").attr("class") + " " + this.componentSetup.style;
			a.find(".paragraph").attr("class", c);
			b.append(a)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-paragraph");
			a.find(".paragraph").html(this.componentSetup.content);
			var c = a.find(".paragraph").attr("class") + " " + this.componentSetup.style;
			a.find(".paragraph").attr("class", c);
			a.data("componentData", this);
			b.append(a)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {}
	});
	n.exports = window.Paragraph
});
define("form/component/tablestatcomponent", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = "#5CBAE3 #E5CF0D #B6A2DE #8D98B3 #95706D #E4B600 #89B600 #D87A80".split(" "),
		a = {
			etitle: "标题",
			eoptions: [{
				content: "选项一",
				percentage: "50.00%",
				bgcolor: b[0],
				votes: "50"
			}, {
				content: "选项二",
				percentage: "25.00%",
				bgcolor: b[1],
				votes: "25"
			}, {
				content: "选项三",
				percentage: "10.00%",
				bgcolor: b[2],
				votes: "10"
			}, {
				content: "选项四",
				percentage: "5.00%",
				bgcolor: b[3],
				votes: "5"
			}, {
				content: "选项五",
				percentage: "2.00%",
				bgcolor: b[4],
				votes: "2"
			}, {
				content: "选项六",
				percentage: "8.00%",
				bgcolor: b[5],
				votes: "8"
			}],
			etotalvotes: 100,
			statfields: []
		};
	window.TableStatComponent = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "TableStatComponent",
				title: "统计",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				fieldId: "",
				dataSetId: ""
			};
			null != a && (this.componentSetup.title = a.title, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.fieldId = a.fieldId, this.componentSetup.dataSetId = a.dataSetId);
			this.tpl = l.get("tablestat")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setDataSetId: function(a) {
			this.componentSetup.dataSetId = a
		},
		render: function(c) {
			a.etitle = this.componentSetup.title;
			var b = $(_.template(this.tpl, a)).siblings("#form-tablestat");
			c.attr("class", b.attr("class"));
			c.html(b.html());
			this.rendertabel(a, c)
		},
		rendertabel: function(a, b) {
			var e = b.find("tbody");
			$.each(a.eoptions, function() {
				var a = e.find("tr:first").clone().show();
				a.find(".j_content").text(this.content);
				a.find(".j_prograssbar").css({
					width: this.percentage,
					"background-color": this.bgcolor
				}).find(".j_percentage").text(this.percentage);
				a.find(".j_votes").text(this.votes);
				e.find("tr:last").before(a)
			})
		},
		renderEditor: function() {
			var c = this,
				b;
			c.statFields ? c.renderEditorValue() : this.componentmodel.getFormSelectFields(function(e) {
				e.etitle = a.etitle;
				e.eoptions = a.eoptions;
				e.etotalvotes = a.etotalvotes;
				b = $(_.template(c.tpl, e)).siblings("#editor-tablestat");
				c.statFields = e;
				null != e.statfields && 0 < e.statfields.length && (c.componentSetup.dataSetId = e.statfields[0].fieldId);
				c.el = b;
				c.renderEditorValue()
			})
		},
		renderEditorValue: function() {
			var a = this.el;
			a.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(a.html());
			var b = $("#component-dataset");
			$.each(this.statFields.statfields, function() {
				var a = b.find("option:first").clone().show();
				a.val(this.fieldId).text(this.title);
				b.append(a)
			});
			$("#editor-component").find("#component-dataset").val(this.componentSetup.dataSetId)
		},
		renderPreview: function(a, b, e) {
			var f, g = this,
				k, p = $("<div></div>");
			a.append(p);
			g.componentmodel.getFieldStat(this.componentSetup.dataSetId, function(a) {
				a = g.processData(a);
				f = $(_.template(g.tpl, a));
				k = f.siblings("#preview-tablestat");
				p.replaceWith(k);
				g.viewcon = k;
				g.rendertabel(a, k)
			})
		},
		processData: function(a) {
			for (var d = a.fieldChartStatData, e = 0, f = 0, g = d.length; f < g; f++)
			e += d[f].total;
			a.etotalvotes = e;
			f = 0;
			for (g = d.length; f < g; f++)
			d[f].percentage = (100 * d[f].total / e).toFixed(2) + "%", d[f].bgcolor = b[f % b.length], d[f].content = d[f].name, d[f].votes = d[f].total;
			a.eoptions = a.fieldChartStatData;
			a.etitle = this.componentSetup.title;
			a.statfields = [];
			return a
		},
		renderEditPreview: function(c) {
			a.etitle = this.componentSetup.title;
			var b = $(_.template(this.tpl, a)).siblings("#form-tablestat");
			b.attr("id", this.componentSetup.fieldId);
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			c.append(b);
			this.rendertabel(a, b)
		},
		renderStatSearch: function(a) {},
		submitCheck: function(a, b) {},
		checkEvents: function(a) {},
		check: function(a) {},
		getValue: function(a) {},
		setValue: function(a, b) {},
		empty: function(a) {},
		readOnly: function(a, b) {}
	});
	n.exports = window.TableStatComponent
});
define("form/component/dateinterval", ["form/component", "form/tplutil", "form/componentmodel", "form/component/datetimepicker", "form/component/datecomponent"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = h("form/componentmodel"),
		a = h("form/component/datetimepicker");
	h("form/component/datecomponent");
	window.DateInterval = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "DateInterval",
				title: "日期区间",
				fieldId: "",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				tempId: 0,
				start: (new DateComponent).componentSetup,
				end: (new DateComponent).componentSetup
			};
			this.componentSetup.start.title = this.componentSetup.title + "(开始时间)";
			this.componentSetup.end.title = this.componentSetup.title + "(结束时间)";
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.describe = a.describe, this.componentSetup.required = a.required, this.componentSetup.start = a.start, this.componentSetup.end = a.end, this.componentSetup.fieldId = a.fieldId, this.componentSetup.tempId = a.tempId || a.fieldId);
			a = l.get("dateinterval");
			this.componentModel = new b;
			this.tpl = a
		},
		setTitle: function(a) {
			this.componentSetup.title = a;
			this.componentSetup.start.title = a + "(开始时间)";
			this.componentSetup.end.title = a + "(结束时间)"
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a;
			this.componentSetup.start.describe = a;
			this.componentSetup.end.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a;
			this.componentSetup.start.required = a;
			this.componentSetup.end.required = a
		},
		setFormat: function(a) {
			this.componentSetup.start.format = a;
			this.componentSetup.end.format = a
		},
		setAccurateTime: function(a) {
			this.componentSetup.start.accurateTime = a;
			this.componentSetup.end.accurateTime = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var b = this,
				e = $(this.tpl).siblings("#form-dateinterval");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			a.attr("class", e.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			this.componentModel.generatorId(function(e) {
				e = e.generatorId;
				b.componentSetup.tempId = e;
				a.attr("tempId", e)
			});
			a.html(e.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-dateinterval");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			a.find("input:radio[name='dateFormat'][value='" + this.componentSetup.start.format + "']").attr("checked", "true");
			$("#editor-component").html(a.html())
		},
		renderPreview: function(a, b, e) {
			var f = $(this.tpl),
				g = f.siblings("#preview-dateinterval");
			"mobile" == window.systemInfo_form && (g = f.siblings("#mobile-preview"));
			g.attr("fieldId", this.componentSetup.fieldId || this.componentSetup.tempId);
			g.attr("id", "field_" + this.componentSetup.fieldId || this.componentSetup.tempId);
			g.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || g.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (g.find(".field-description").text(this.componentSetup.describe), g.find(".field-description").show());
			var k = this.componentSetup.start.format,
				f = "";
			"yyyy-MM-dd" == k ? (f = "年-月-日", "mobile" == window.systemInfo_form && (g.find(".j_date_selected").eq(0).attr("format", "{yyyy}-{MM}-{dd}").attr("minview", 2).attr("startview", "month"), g.find(".j_date_selected").eq(1).attr("format", "{yyyy}-{MM}-{dd}").attr("minview", 2).attr("startview", "month"))) : "yyyy-MM" == k ? (f = "年-月", "mobile" == window.systemInfo_form && (g.find(".j_date_selected").eq(0).attr("format", "{yyyy}-{MM}").attr("minview", 3).attr("startview", "year"), g.find(".j_date_selected").eq(1).attr("format", "{yyyy}-{MM}").attr("minview", 3).attr("startview", "year"))) : "yyyy-MM-dd HH:mm" == k && (f = "年-月-日 时:分", "mobile" == window.systemInfo_form && (g.find(".j_date_selected").eq(0).attr("format", "{yyyy}-{MM}-{dd} {HH}:{mm}").attr("minview", 1).attr("startview", "month"), g.find(".j_date_selected").eq(1).attr("format", "{yyyy}-{MM}-{dd} {HH}:{mm}").attr("minview", 1).attr("startview", "month")));
			g.find(".form-control").attr("placeholder", f);
			g.find(".form-control").eq(0).parent().attr("id", "field_" + this.componentSetup.start.fieldId).attr("name", this.componentSetup.start.fieldId);
			g.find(".form-control").eq(0).attr("cid", this.cid);
			g.find(".form-control").eq(1).parent().attr("id", "field_" + this.componentSetup.end.fieldId).attr("name", this.componentSetup.end.fieldId);
			g.find(".form-control").eq(1).attr("cid", this.cid);
			"mobile" == window.systemInfo_form && (g.find(".j_date_selected").eq(0).attr("id", this.componentSetup.start.fieldId), g.find(".j_date_selected").eq(1).attr("id", this.componentSetup.end.fieldId));
			g.find(".check_js").data("componentData", this);
			g.addClass(this.componentSetup.titleLayout);
			this.el = a;
			a.append(g);
			"yyyy-MM-dd HH:mm" == k ? k = "yyyy-mm-dd hh:ii" : "yyyy-MM-dd" == k ? k = "yyyy-mm-dd" : "yyyy-MM" == k && (k = "yyyy-mm");
			var p = "month",
				q = "month",
				h = !0;
			0 <= k.indexOf("hh:ii") ? p = "day" : 0 > k.indexOf("dd") && (q = p = "year", h = !1);
			b && g.find("input").val("");
			this.readOnly(g, e);
			if ("mobile" != window.systemInfo_form && !e) g.find(".form-control[cid='" + this.cid + "']").on("click", function() {
				$(this).datetimepicker({
					format: k,
					language: "zh-CN",
					todayHighlight: !0,
					todayBtn: h,
					autoclose: !0,
					minView: p,
					startView: q
				});
				$(this).datetimepicker("show")
			})
		},
		renderEditPreview: function(a) {
			var b = $(this.tpl).siblings("#form-dateinterval");
			b.attr("tempId", this.componentSetup.fieldId);
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			var e = this.componentSetup.start.format,
				f = this.componentSetup.end.format,
				g = "",
				k = "";
			"yyyy-MM-dd" == e ? g = "年-月-日" : "yyyy-MM" == e ? g = "年-月" : "yyyy-MM-dd HH:mm" == e && (g = "年-月-日 时:分");
			"yyyy-MM-dd" == f ? k = "年-月-日" : "yyyy-MM" == f ? k = "年-月" : "yyyy-MM-dd HH:mm" == f && (k = "年-月-日 时:分");
			b.find("input").eq(0).attr("placeholder", g);
			b.find("input").eq(1).attr("placeholder", k);
			b.find("input").eq(0).attr("id", this.componentSetup.start.fieldId);
			b.find("input").eq(1).attr("id", this.componentSetup.end.fieldId);
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			a.append(b)
		},
		renderStatSearch: function(a) {
			var b = $(this.tpl).siblings("#statsearch-dateinterval"),
				e = a.parentEl,
				f = (new Date).getTime();
			a = a.container;
			b.find(".j_datetime").attr("id", "j_datetime" + f);
			e.attr("class", "sch-group j_formFieldSearchGroup");
			e.find(".j_formField-condition").html(b);
			var g = $(a + " #j_datetime" + f + " #startDate"),
				k = $(a + " #j_datetime" + f + " #endDate");
			formPlugin.datepicker({
				el: a + " #j_datetime" + f + " #startDate",
				callback: function(a) {
					a = Date.create(a.date).format("{yyyy}-{MM}-{dd}");
					k.val() && a > k.val() ? (utils.notify("开始日期不能大于结束日期"), g.val("")) : g.val(a)
				}
			});
			formPlugin.datepicker({
				el: a + " #j_datetime" + f + " #endDate",
				callback: function(a) {
					a = Date.create(a.date).format("{yyyy}-{MM}-{dd}");
					g.val() && a < g.val() ? (utils.notify("结束日期不能小于开始日期"), k.val("")) : k.val(a)
				}
			})
		},
		submitCheck: function(a, b) {
			var e = this.check(a);
			b(e)
		},
		checkEvents: function(c) {
			var b = this,
				e = b.el || $(document);
			e.on("change", "#field_" + b.componentSetup.start.fieldId + "[datetype='startDate'] input[componentKey='DateInterval'][cid='" + this.cid + "']", function() {
				var a = $(this).val(),
					e = b.componentSetup.end.format;
				if ("yyyy-MM-dd HH:mm" == e) var e = "yyyy-mm-dd hh:ii",
					k = parseInt(a.substring(a.indexOf(":") + 1, a.length)) + 30 + "",
					a = a.substring(0, a.indexOf(":") + 1) + k;
				else "yyyy-MM-dd" == e ? e = "yyyy-mm-dd" : "yyyy-MM" == e && (e = "yyyy-mm");
				var p = k = "month",
					q = !0;
				0 <= e.indexOf("hh:ii") ? k = "day" : 0 > e.indexOf("dd") && (p = k = "year", q = !1);
				$("#field_" + b.componentSetup.end.fieldId + "[datetype='endDate'] input[componentKey='DateInterval'][cid='" + b.cid + "']").datetimepicker({
					format: e,
					language: "zh-CN",
					todayHighlight: !0,
					todayBtn: q,
					autoclose: !0,
					minView: k,
					startView: p,
					showMeridian: !1
				}).datetimepicker("setStartDate", a);
				a = b.check($(this).parents(".check_js"));
				c(a);
				null == a.message && b.saveComponentValue($(this))
			});
			e.on("change", "#field_" + b.componentSetup.end.fieldId + "[datetype='endDate'] input[componentKey='DateInterval'][cid='" + this.cid + "']", function() {
				var a = $(this).val(),
					e = b.componentSetup.start.format;
				if ("yyyy-MM-dd HH:mm" == e) {
					var e = "yyyy-mm-dd hh:ii",
						k = a.substring(a.indexOf(":") - 2, a.indexOf(":")),
						p = a.substr(0, a.indexOf(" ")),
						a = parseInt(a.substring(a.indexOf(":") + 1, a.length)),
						p = new Date(p);
					p.setHours(k, a - 30);
					a = Date.create(p.getTime()).format("{yyyy}-{MM}-{dd} {hh}:{mm}")
				} else "yyyy-MM-dd" == e ? e = "yyyy-mm-dd" : "yyyy-MM" == e && (e = "yyyy-mm");
				var p = k = "month",
					q = !0;
				0 <= e.indexOf("hh:ii") ? k = "day" : 0 > e.indexOf("dd") && (p = k = "year", q = !1);
				$("#field_" + b.componentSetup.start.fieldId + "[datetype='startDate'] input[componentKey='DateInterval'][cid='" + b.cid + "']").datetimepicker({
					format: e,
					language: "zh-CN",
					todayHighlight: !0,
					todayBtn: q,
					autoclose: !0,
					minView: k,
					startView: p,
					showMeridian: !1
				}).datetimepicker("setEndDate", a);
				e = b.check($(this).parents(".check_js"));
				c(e);
				null == e.message && b.saveComponentValue($(this))
			});
			"mobile" == window.systemInfo_form && (e.on("dateConfirm", "#" + b.componentSetup.start.fieldId, function(a, e) {
				$(this).val(e.date);
				$(this).parents(".check_js").find("#" + b.componentSetup.end.fieldId).attr("startdate", e.date);
				var k = b.check($(this).parents(".check_js"));
				c(k);
				null == k.message && b.saveComponentValue($(this));
				$(this).trigger("monitor_change")
			}), e.on("dateConfirm", "#" + b.componentSetup.end.fieldId, function(a, e) {
				$(this).val(e.date);
				$(this).parents(".check_js").find("#" + b.componentSetup.start.fieldId).attr("enddate", e.date);
				var k = b.check($(this).parents(".check_js"));
				c(k);
				null == k.message && b.saveComponentValue($(this));
				$(this).trigger("monitor_change")
			}), $("body").off("tap", ".j_date_selected").on("tap", ".j_date_selected", function(c) {
				c = $(this).parents(".j_page-view");
				var b = $(this).attr("format"),
					d = $(this).attr("minview"),
					e = $(this).attr("startview"),
					q = $(this).attr("startdate"),
					h = $(this).attr("enddate"),
					l = c.attr("id");
				(new a({
					el: $(this),
					format: b,
					minView: d,
					startView: e,
					startDate: q,
					endDate: h,
					preEl: "#" + l
				})).render();
				c.addClass("hide")
			}))
		},
		check: function(a) {
			var b = a.find("input").eq(0),
				e = a.find("input").eq(1),
				f = $.trim(b.val()),
				g = $.trim(e.val()),
				b = b.attr("placeholder"),
				e = e.attr("placeholder");
			f == b && (f = "");
			g == e && (g = "");
			1 == this.getCharCount(f, "-") && (f += "-01");
			1 == this.getCharCount(g, "-") && (g += "-01");
			var e = (new Date(f.replace(/-/g, "/"))).getTime(),
				b = (new Date(g.replace(/-/g, "/"))).getTime(),
				k = {};
			k.element = a;
			"" != f || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (k.message = "请输入" + this.componentSetup.title + "开始时间");
			"" != g || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (k.message = "请输入" + this.componentSetup.title + "结束时间");
			e > b && (k.message = "开始时间必须早于或等于结束时间");
			return k
		},
		getValue: function(a) {
			var b = [],
				e = $.trim(a.find("input").eq(0).val()),
				f = a.find("input").eq(0).attr("placeholder"),
				g = this.oldValue;
			e == f && (e = "");
			var f = {
				formField: {
					title: this.componentSetup.start.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.start.fieldId
				},
				oldContent: this.oldStartValue,
				content: e
			},
				k = $.trim(a.find("input").eq(1).val());
			a = a.find("input").eq(1).attr("placeholder");
			k == a && (k = "");
			b.push(f, {
				formField: {
					title: this.componentSetup.end.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.end.fieldId
				},
				oldContent: this.oldEndValue,
				content: k
			});
			this.oldStartValue = e;
			this.oldEndValue = k;
			return g && 0 < g.length ? b : "" == e && "" == k ? null : b
		},
		setValue: function(a, b) {
			if (null != b) {
				var e = b.content,
					f = a.attr("datetype");
				"startDate" == f ? this.oldStartValue = e : this.oldEndValue = e;
				"" == a.parent().siblings(".j_readOnly").text() ? a.parent().siblings(".j_readOnly").html(e) : a.parent().siblings(".j_readOnly").html(a.parent().siblings(".j_readOnly").text() + "<br/>" + e);
				a.find("input").val(e);
				if ("mobile" != window.systemInfo_form) {
					var g = this.componentSetup.start.format;
					if ("yyyy-MM-dd HH:mm" == g) {
						if (g = "yyyy-mm-dd hh:ii", null != e && "" != e) {
							var f = e.substring(e.indexOf(":") - 2, e.indexOf(":")),
								k = e.substr(0, e.indexOf(" ")),
								e = parseInt(e.substring(e.indexOf(":") + 1, e.length)),
								k = new Date(k);
							k.setHours(f, e - 30);
							e = Date.create(k.getTime()).format("{yyyy}-{MM}-{dd} {hh}:{mm}")
						}
					} else "yyyy-MM-dd" == g ? g = "yyyy-mm-dd" : "yyyy-MM" == g && (g = "yyyy-mm");
					var p = k = "month",
						q = !0;
					0 <= g.indexOf("hh:ii") ? k = "day" : 0 > g.indexOf("dd") && (p = k = "year", q = !1);
					f = a.attr("datetype");
					"startDate" == f ? a.next().next().find("input").datetimepicker({
						format: g,
						language: "zh-CN",
						todayHighlight: !0,
						todayBtn: q,
						autoclose: !0,
						minView: k,
						startView: p,
						showMeridian: !1
					}).datetimepicker("setStartDate", e) : "endDate" == f && a.prev().prev().find("input").datetimepicker({
						format: g,
						language: "zh-CN",
						todayHighlight: !0,
						todayBtn: q,
						autoclose: !0,
						minView: k,
						startView: p,
						showMeridian: !1
					}).datetimepicker("setEndDate", e)
				}
			}
		},
		empty: function(a) {
			a.find("input").val("")
		},
		readOnly: function(a, b) {
			a.find("div[id='field_" + this.componentSetup.start.fieldId + "'] input[cid=" + this.cid + "]").attr("disabled", b);
			a.find("div[id='field_" + this.componentSetup.end.fieldId + "'] input[cid=" + this.cid + "]").attr("disabled", b);
			b ? (a.find(".check_js").addClass("hide"), a.find(".j_readOnly").removeClass("hide")) : (a.find(".check_js").removeClass("hide"), a.find(".j_readOnly").addClass("hide"))
		},
		getCharCount: function(a, b) {
			for (var e = 0, f = 0; f < a.length; f++)
			a.charAt(f) == b && e++;
			return e
		}
	});
	n.exports = window.DateInterval
});
define("form/component/departselecter", ["form/tplutil"], function(h, m, n) {
	var l = h("form/tplutil");
	h = Backbone.View.extend({
		initialize: function() {},
		render: function(b, a) {
			"pc" == b ? this.initPC.init(a) : this.initMb.init(a)
		},
		initPC: {
			lightClass: "selected",
			fold: "icon-caret-right",
			unfold: "icon-caret-down",
			init: function(b) {
				this.target = b.target;
				this.el = "#selector-department";
				this.tpl = l.get("departselecter");
				$("body").append($(this.tpl).siblings("#selector-department"));
				this.delegateEvents();
				this.open()
			},
			delegateEvents: function() {
				var b = this,
					a = $(b.el);
				$("body").on("keydown.depart-win", function(c) {
					27 == c.which && a.modal("hide")
				});
				a.on("click", "." + b.unfold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle(400);
					$(this).removeClass(b.unfold).addClass(b.fold)
				});
				a.on("click", "." + b.fold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle(400);
					$(this).removeClass(b.fold).addClass(b.unfold)
				});
				a.on("click", ".treenode", function(a) {
					a.preventDefault();
					a = $(this).data("node");
					b.close();
					b.target.trigger("confirmHandler", {
						objs: a
					})
				});
				a.on("hidden.bs.modal", function() {
					$("#selector-department").remove()
				})
			},
			open: function() {
				$(this.el).modal("toggle");
				this.renderDepartment()
			},
			close: function() {
				$(this.el).modal("hide")
			},
			renderDepartment: function(b) {
				var a = this;
				a.id = b;
				a.data ? (a.initTree(a.data), a.bindData(a.data)) : a.loadData(function(c) {
					c = c.nodes;
					a.data = c;
					a.initTree(c);
					a.bindData(c)
				})
			},
			loadData: function(b) {
				$.ajax({
					url: "/base/tree/department.json",
					type: "post",
					dataType: "json",
					success: function(a) {
						b && b(a)
					}
				})
			},
			initTree: function(b) {
				var a = this.getRoot(b);
				b = this.createRootTree(a, b);
				$("#selector-org-tree").html(b)
			},
			createRootTree: function(b, a) {
				var c = "<ul>",
					d = this.createChild(b, a);
				return c = c + d + "</ul>"
			},
			createTree: function(b, a) {
				for (var c = "<ul class='ftl-child-ul'>", d = 0, e = 0, f = a.length; e < f; e++) {
					var g = a[e];
					if (!g) break;
					var k = g.nodeObj.parent;
					k && k.id == b.id && g.id != b.id && (g = this.createChild(g, a), c += g, d++)
				}
				return 0 == d ? "" : c + "</ul>"
			},
			createChild: function(b, a) {
				if (b) {
					var c = "root" == b.parentId ? "root" : "",
						d = "padding-left:" + 20 * b.rank + "px",
						e = this.createTree(b, a),
						f = e ? this.unfold : "",
						c = "<li>" + ('<div class="treenode router ' + c + '" style="' + d + '" id="' + b.id + '">'),
						d = '<span class="num fr">' + b.attachment + '</span><a class="router" title="' + b.name + '" href="＃"><span class="tree-name">' + b.name + "</span></a>",
						c = c + ("<i class='nodeicon " + f + "'></i>") + d,
						c = c + "</div>",
						c = c + e;
					return c += "</li>"
				}
			},
			getRoot: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					if (!d.nodeObj.parent) return d
				}
			},
			bindData: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					$(this.el).find("#" + d.id).data("node", d)
				}
			},
			remove: function() {
				$(this.el).remove()
			}
		},
		initMb: {
			lightClass: "selected",
			fold: "icon-caret-right",
			unfold: "icon-caret-down",
			init: function(b) {
				this.userId = b.userId || TEAMS.currentUser.id;
				this.preEl = b.preEl;
				this.container = b.el;
				this.multi = b.multi && "false" == b.multi ? !1 : !0;
				this.departments = b.departments;
				this.tpl = l.get("departselecter");
				$("body").append($(this.tpl).siblings("#department-component"));
				this.el = "#department-component";
				this.multi || $("#department-component #j_department-comfirm").remove();
				this.delegateEvents();
				this.renderDepartment()
			},
			delegateEvents: function() {
				var b = this,
					a = $("#department-component");
				a.on("click", ".j_department-info", function(a) {
					a = $(this).data("department");
					$(this).toggleClass("selected");
					1 == $("#seleted-department-list #seleted" + a.id).size() ? $("#seleted-department-list #seleted" + a.id).remove() : $("#seleted-department-list").append('<span id="seleted' + a.id + '" data-id="' + a.id + '">' + a.name + "</span>")
				});
				if (!b.multi) a.on("click", ".j_department-info", function(a) {
					a = $(this).data("department");
					b.container.trigger("departmentComfirm", {
						objs: a
					});
					$(b.preEl).removeClass("hide");
					$("#department-component").addClass("hide").remove()
				});
				a.on("click", "#j_department-comfirm", function(a) {
					a = b.getAllChecked();
					b.container.trigger("departmentComfirm", {
						objs: a
					});
					$(b.preEl).removeClass("hide");
					$("#department-component").addClass("hide").remove()
				});
				a.on("click", "#j_a-back", function(a) {
					$(b.preEl).removeClass("hide");
					$("#department-component").addClass("hide").remove()
				});
				a.on("click", "." + b.unfold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle();
					$(this).removeClass(b.unfold).addClass(b.fold)
				});
				a.on("click", "." + b.fold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle();
					$(this).removeClass(b.fold).addClass(b.unfold)
				})
			},
			renderDepartment: function() {
				var b = this;
				$.ajax({
					url: "/base/tree/department.json",
					type: "post",
					dataType: "json",
					data: {},
					success: function(a) {
						a = a.nodes;
						b.nodes = a;
						b.initTree(a);
						b.bindData(a);
						b.renderSeleted(b.departments)
					}
				})
			},
			getRoot: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					if (!d.nodeObj.parent) return d
				}
			},
			renderSeleted: function(b) {
				if (b) if ($("#seleted-department-list").empty(), this.mult) for (var a = 0; a < b.length; a++) {
					var c = b[a];
					$("#seleted-department-list").append('<span id="seleted' + c.id + '" data-id="' + c.id + '">' + c.name + "</span>");
					$("#j_dept-list-container #" + c.id).addClass("selected")
				} else $("#seleted-department-list").html('<span id="seleted' + b.id + '" data-id="' + b.id + '">' + b.name + "</span>"), $("#j_dept-list-container #" + b.id).addClass("selected");
				else if (this.container) for (b = this.container.find("span"), $("#seleted-department-list").empty(), a = 0; a < b.length; a++) {
					var c = $(b[a]).attr("data-id"),
						d = $(b[a]).text();
					$("#seleted-department-list").append('<span id="seleted' + c + '" data-id="' + c + '">' + d + "</span>");
					$("#j_dept-list-container #" + c).addClass("selected")
				}
			},
			getAllChecked: function() {
				var b = [];
				$("#j_dept-list-container .j_department-info.selected").each(function() {
					var a = $(this).data("department");
					b.push(a)
				});
				return b
			},
			initTree: function(b) {
				var a = this.getRoot(b);
				b = this.createRootTree(a, b);
				$("#j_dept-list-container").html(b)
			},
			createRootTree: function(b, a) {
				var c = "<ul class='ul-" + b.id + " org-rootTree dept-list'>",
					d = this.createChild(b, a, !0);
				return c = c + d + "</ul>"
			},
			createTree: function(b, a) {
				for (var c = "<ul class='ul-" + b.id + " org-subTree'>", d = 0, e = 0, f = a.length; e < f; e++) {
					var g = a[e];
					if (!g) break;
					var k = g.nodeObj.parent;
					k && k.id == b.id && g.id != b.id && (g = this.createChild(g, a), c += g, d++)
				}
				return 0 == d ? "" : c + "</ul>"
			},
			createChild: function(b, a, c) {
				if (b) {
					c = "root" == b.parentId ? "root" : "";
					var d = (a = this.createTree(b, a)) ? "<i class='j_nodeicon nodeicon " + this.unfold + "'></i>" : "";
					b = '<p  id="' + b.id + '" class="j_department-info j_name name ellipsis ' + this.edit + '" ><span class="tree-name">' + b.name + "</span></a>";
					c = "<li>" + ('<div class="j_treenode treenode ' + c + '" >') + d;
					c += b + '<i class="ico-r j_ico-check ico-check"></i>';
					c += "</div>";
					c += a;
					return c += "</li>"
				}
			},
			bindData: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					$(this.el).find("#" + d.id).data("department", d.nodeObj)
				}
			}
		}
	});
	n.exports = h
});
define("form/component/filecomponent", ["form/component", "form/component/preview", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/component/preview"),
		b = h("form/tplutil");
	window.FileComponent = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "FileComponent",
				title: "附件",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				isSingle: !1,
				fieldId: ""
			};
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.isSingle = a.isSingle, this.componentSetup.fieldId = a.fieldId, this.formId = a.formId);
			this.tpl = b.get("file")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSingle: function(a) {
			this.componentSetup.isSingle = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-file");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-file");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || a.find("#isSingle").attr("checked", "true");
			a.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			a.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(a.html())
		},
		renderPreview: function(a, c, b) {
			c = $(this.tpl);
			var e = null,
				e = null == TEAMS.currentUser ? c.siblings("#nouser-preview") : "mobile" != window.systemInfo_form ? c.siblings("#preview-file") : c.siblings("#mobile-preview");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".check_js").attr("id", this.componentSetup.fieldId + this.cid);
			e.find(".check_js").prev().attr("id", "fileInput" + this.componentSetup.fieldId + this.cid);
			e.find(".check_js").attr("cid", this.cid);
			e.attr("id", "field_" + this.componentSetup.fieldId);
			e.find(".check_js").data("componentData", this);
			e.addClass(this.componentSetup.titleLayout);
			e.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			this.el = a;
			a.append(e);
			if ("true" == b || 1 == b || b) e.find("#fileInput" + this.componentSetup.fieldId + this.cid).remove(), "mobile" == window.systemInfo_form && e.find("#" + this.componentSetup.fieldId + this.cid).attr("readOnly", "readOnly"), this.isReadOnly = b;
			this.initFancyBox($("#" + this.componentSetup.fieldId + this.cid))
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-file");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.attr("id", this.componentSetup.fieldId);
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		submitCheck: function(a, c) {
			var b = this.check(a);
			c(b)
		},
		checkEvents: function(a) {
			var c = this,
				b = c.el || $(document),
				e = c.componentSetup.fieldId + this.cid;
			c.isReadOnly && "false" != c.isReadOnly && 0 != c.isReadOnly || "mobile" == window.systemInfo_form || c.initUploader(a);
			b.on("click", "#" + e + " .j_deleteFile", function() {
				var b = $(this).parents("#" + e);
				$(this).parents(".check_js").prev().show();
				c.deleteFile($(this));
				b = c.check(b);
				null == b.message ? c.saveComponentValue($(this)) : a(b)
			});
			"mobile" == window.systemInfo_form && ($("#fileInput" + c.componentSetup.fieldId + c.cid).on("input change propertychange paste", function(a) {
				var b = $(this),
					d = 1 == c.componentSetup.isSingle || "true" == c.componentSetup.isSingle,
					e = $(this).find("#formFileToUpload").get(0).files[0];
				e && (a = 0, a = 1048576 < e.size ? (Math.round(100 * e.size / 1048576) / 100).toString() + "MB" : (Math.round(100 * e.size / 1024) / 100).toString() + "KB", e.size = a, a = $('<div class="info-subitem  attachment"><a id="' + e.id + '">' + e.name + '<i class="ml-3 c-grey"></i></a></div>'), $(this).next().append(a));
				a = new FormData;
				a.append("data", $(this).find("#formFileToUpload").get(0).files[0]);
				var q = new XMLHttpRequest;
				q.upload.addEventListener("progress", function(a) {
					a.lengthComputable && (a = Math.round(100 * a.loaded / a.total), $("#" + c.componentSetup.fieldId + c.cid + " i").html(a.toString() + "%"))
				}, !1);
				q.addEventListener("load", function(a) {
					a = jQuery.parseJSON(a.target.responseText).fileObj;
					var c = a.id,
						f = a.name,
						q = plupload.formatSize(e.size),
						h = "",
						h = "true" == a.image || 1 == a.image ? '<div id="' + c + '" fileid="' + c + '" class="file-item"><a class="j_fileView" data-value="' + c + '"  type="image">' + f + " (" + q + ")</span></a>" : '<div id="' + c + '" fileid="' + c + '" class="file-item"><a class="j_fileView" data-value="' + c + '"  type="file">' + f + " (" + q + ")</span></a>";
					d && b.hide();
					formPlugin.notify("文件上传成功");
					$("#" + e.id).parent().replaceWith(h)
				}, !1);
				q.addEventListener("error", function(a) {
					formPlugin.notify("文件上传失败")
				}, !1);
				q.open("POST", "/base/upload.json?module=form");
				q.send(a)
			}), $("#" + c.componentSetup.fieldId + c.cid).on("tap", ".j_fileView", function(a) {
				var b = $(c.tpl),
					d = $(this).parents(".j_page-view"),
					e = $(this).parent().attr("fileid");
				a = $(this).attr("type");
				var q = $(this).parents(".check_js").attr("readonly"),
					b = b.siblings("#form-moblefileView");
				q && b.find("#formFileDelete").remove();
				"image" == a ? b.find(".j_filePreview").attr("id", e).html('<img src="/base/download/' + e + '">') : b.find(".j_filePreview").html("该文件暂不支持预览");
				$("body").append(b);
				$(".j_fileViewBack").on("click", function() {
					$(this).parents(".j_page-view").remove();
					d.removeClass("hide")
				});
				$("#formFileDelete").on("tap", function(a) {
					var c = $(this),
						b = $('div[fileid="' + e + '"]');
					formPlugin.confirm("确定要删除吗？", function(a) {
						a && (b.parent().prev().show(), b.remove(), c.parents(".j_page-view").remove(), d.removeClass("hide"), formPlugin.notify("数据已删除"))
					})
				});
				d.addClass("hide")
			}))
		},
		check: function(a) {
			var c = $(a).find(".file-item"),
				b = c.length,
				e = {};
			e.element = a;
			0 != b || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			c.each(function(a) {
				$(this).attr("id") || (e.message = "文件尚未上传至服务器，请耐心等待")
			});
			return e
		},
		getValue: function(a) {
			var c = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			};
			a = a.find(".file-item");
			if (0 < a.length) {
				var b = [],
					e = "";
				a.each(function(a) {
					var c = $(this).find("a").eq(0).attr("data-value"),
						k = $(this).find("a").eq(0).text(),
						p = $(this).find("a").eq(0).attr("type");
					e += k + ",";
					b[a] = {
						optionId: c,
						content: k,
						type: p
					}
				});
				c.dataOptions = b;
				0 != b.length && (this.oldValue = e.substring(0, e.length - 1))
			} else this.oldValue && 0 < this.oldValue.length ? this.oldValue = null : c = null;
			return c
		},
		setValue: function(a, c) {
			if (null != c && null != c.dataOptions) {
				for (var b = "", e = 0; e < c.dataOptions.length; e++) {
					var f = c.dataOptions[e],
						g = null == f.content ? "" : f.content,
						k = f.optionId,
						p = f.type,
						q = null,
						b = b + (g + ","),
						h = crmContext.remoteDownloadUrl + "/remotedownload/" + k + "/" + ETEAMSID + "/true" + (TEAMS.currentUser ? "" : "?type=remote");
					"mobile" != window.systemInfo_form ? (q = $('<div class="file-item" id="' + k + '"><a type="' + p + '" class="fancybox-button" href="' + h + '" data-value="' + k + '" rel="fancybox-button">' + g + "</a>"), "image" != p && (q = $('<div class="file-item" id="' + k + '"><a type="' + p + '" href="' + h + '" data-value="' + k + '">' + g + "</a></div>")), null != a.find(".file-input").get(0) && q.append('<a class="close j_deleteFile" title="删除">&times;</a>')) : (q = $('<div fileid="' + k + '" id="' + this.componentSetup.fieldId + '" class="file-item"><a class="j_fileView" data-value="' + k + '"  type="image">' + g + "</span></a>"), "image" != p && q.attr("type", "file"));
					a.find(".check_js").append(q);
					(f = f.optionObj) && (new l({
						container: $("body"),
						afterJqObj: $("#" + f.id).children(":first"),
						fileObj: f,
						previewType: "remote"
					})).render()
				}
				"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || null == $("#" + this.componentSetup.fieldId + this.cid + " .file-item").get(0) || $("#fileInput" + this.componentSetup.fieldId + this.cid).hide();
				this.oldValue = "";
				0 != c.dataOptions.length && (this.oldValue = b.substring(0, b.length - 1))
			}
		},
		empty: function(a) {
			a.find(".file-item").remove()
		},
		readOnly: function(a, c) {
			var b = a.find("#fileInput" + this.componentSetup.fieldId + this.cid),
				e = a.find("#" + this.componentSetup.fieldId + this.cid);
			c && (b.remove(), e.find(".file-item .j_deleteFile").remove())
		},
		initUploader: function(a) {
			if (null != TEAMS.currentUser) {
				var c = this,
					b = "#fileInput" + this.componentSetup.fieldId + this.cid,
					e = "#" + this.componentSetup.fieldId + this.cid,
					f = 1 == c.componentSetup.isSingle || "true" == c.componentSetup.isSingle,
					g = this.uploader = new plupload.Uploader({
						runtimes: "html5,flash",
						file_data_name: "data",
						browse_button: b,
						container: $(e).parents("#field_" + this.componentSetup.fieldId),
						max_file_size: "50M",
						url: "/remote/uploadremote.json?module=form&refId=" + c.formId,
						flash_swf_url: "/static/swf/plupload.swf"
					});
				g.init();
				g.bind("FilesAdded", function(a, c) {
					f && (1 < c.length || null != $(e).find(".file-item").get(0)) ? ($.each(c, function(c, b) {
						a.removeFile(b)
					}), formPlugin.notify("此控件仅能上传一个文件附件", "文件数过多", "error")) : ($.each(c, function(a, c) {
						var b = c.id,
							d = c.name,
							f = plupload.formatSize(c.size);
						$(e).append('<div class="file-item"><a id=' + b + ">" + d + " " + f + '<i class="ml-3 c-grey"></i></a><a class="close j_deleteFile" title="删除">&times;</a></div>')
					}), a.refresh(), a.start())
				});
				g.bind("UploadProgress", function(a, c) {
					$("#" + c.id + " i").html(c.percent + "%")
				});
				g.bind("Error", function(a, c) {
					-600 == c.code && formPlugin.notify("只能上传最大不超过50M的文件", "文件大小超过限制", "error");
					a.refresh()
				});
				g.bind("FileUploaded", function(a, b, d) {
					a = jQuery.parseJSON(d.response).fileObj;
					d = a.id;
					var f = a.name,
						g = "",
						g = crmContext.remoteDownloadUrl + "/remotedownload/" + d + "/" + ETEAMSID + "/true" + (TEAMS.currentUser ? "" : "?type=remote"),
						g = a.image ? '<div id="' + d + '" class="file-item"><a data-value="' + d + '" href="' + g + '" class="fancybox-button" type="image" rel="fancybox-button">' + f + '</a><a class="close j_deleteFile" title="删除">&times;</a></div>' : '<div id="' + d + '" class="file-item"><a data-value="' + d + '" href="' + g + '" type="file">' + f + '</a><a class="close j_deleteFile" title="删除">&times;</a></div>';
					formPlugin.notify("文件上传成功");
					$("#" + b.id).parent().replaceWith(g);
					c.initFancyBox($(e));
					(new l({
						container: $("body"),
						afterJqObj: $("#" + a.id).children(":first"),
						fileObj: a,
						previewType: "remote"
					})).render()
				});
				g.bind("UploadComplete", function(g, p) {
					f && $(b).hide();
					c.saveComponentValue($(e));
					var h = c.check($(e));
					a(h)
				})
			}
		},
		deleteFile: function(a) {
			a = a.parent();
			"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || a.parent().prev().removeClass("hide");
			a.remove()
		},
		initFancyBox: function(a) {
			a.find(".fancybox-button").fancybox({
				nextEffect: "fade",
				prevEffect: "fade",
				closeBtn: !0,
				afterLoad: function() {
					this.title = "Image " + (this.index + 1) + " of " + this.group.length + (this.title ? " - " + this.title : "")
				}
			})
		}
	});
	n.exports = window.FileComponent
});
define("form/component/datecomponent", ["form/component", "form/tplutil", "form/component/datetimepicker"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = h("form/component/datetimepicker");
	window.DateComponent = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "DateComponent",
				title: "日期",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				format: "yyyy-MM-dd",
				isSystemDate: !1,
				isReadonly: !1
			};
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.describe = a.describe, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.format = a.format, this.componentSetup.isSystemDate = a.isSystemDate, this.componentSetup.isReadonly = a.isReadonly);
			this.tpl = l.get("date")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setFormat: function(a) {
			this.componentSetup.format = a
		},
		setIsSystemDate: function(a) {
			this.componentSetup.isSystemDate = a
		},
		setIsReadonly: function(a) {
			this.componentSetup.isReadonly = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-date");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-date");
			a.show();
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			a.find("input:radio[name='dateFormat'][value='" + this.componentSetup.format + "']").attr("checked", "true");
			var c = !1,
				b = !1;
			if ("true" == this.componentSetup.isSystemDate || 1 == this.componentSetup.isSystemDate) c = !0, a.find(".date_readonly_js").show();
			if ("true" == this.componentSetup.isReadonly || 1 == this.componentSetup.isReadonly) b = !0;
			a.find("#systemDate").attr("checked", c);
			a.find("#readonly").attr("checked", b);
			$("#editor-component").html(a.html())
		},
		renderPreview: function(a, c, b) {
			var e = $(this.tpl),
				f = e.siblings("#preview-date");
			"mobile" == window.systemInfo_form && (f = e.siblings("#mobile-preview"));
			f.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || f.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (f.find(".field-description").text(this.componentSetup.describe), f.find(".field-description").show());
			f.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			f.find(".check_js").attr("cid", this.cid);
			f.attr("id", "field_" + this.componentSetup.fieldId);
			f.find(".check_js").data("componentData", this);
			var g = "";
			"yyyy-MM-dd" == this.componentSetup.format ? (g = "年-月-日", "mobile" == window.systemInfo_form && f.find("#" + this.componentSetup.fieldId).attr("format", "{yyyy}-{MM}-{dd}").attr("minview", 2).attr("startview", "month")) : "yyyy-MM" == this.componentSetup.format ? (g = "年-月", "mobile" == window.systemInfo_form && f.find("#" + this.componentSetup.fieldId).attr("format", "{yyyy}-{MM}").attr("minview", 3).attr("startview", "year")) : "yyyy-MM-dd HH:mm" == this.componentSetup.format && (g = "年-月-日 时:分", "mobile" == window.systemInfo_form && f.find("#" + this.componentSetup.fieldId).attr("format", "{yyyy}-{MM}-{dd} {HH}:{mm}").attr("minview", 1).attr("startview", "month"));
			f.find(".check_js").attr("placeholder", g);
			f.addClass(this.componentSetup.titleLayout);
			this.el = a;
			a.append(f);
			a = this.componentSetup.isSystemDate;
			var g = this.componentSetup.format,
				k = new Date;
			a && $(document).trigger("currentTime", function(a) {
				k = new Date(a)
			});
			e = null;
			"yyyy-MM-dd HH:mm" == g ? (g = "yyyy-mm-dd hh:ii", e = Date.create(k.getTime()).format("{yyyy}-{MM}-{dd} {HH}:{mm}")) : "yyyy-MM-dd" == g ? (g = "yyyy-mm-dd", e = Date.create(k.getTime()).format("{yyyy}-{MM}-{dd}")) : "yyyy-MM" == g && (g = "yyyy-mm", e = Date.create(k.getTime()).format("{yyyy}-{MM}"));
			var p = "month",
				h = "month",
				l = !0;
			0 <= g.indexOf("hh:ii") ? p = "day" : 0 > g.indexOf("dd") && (h = p = "year", l = !1);
			"true" != a && 1 != a || f.find(".check_js").val(e);
			c && f.find(".check_js").val("");
			this.readOnly(f, b);
			if ("mobile" != window.systemInfo_form && !b) f.find(".check_js").off("click").on("click", function() {
				$(this).datetimepicker({
					format: g,
					language: "zh-CN",
					todayHighlight: !0,
					todayBtn: l,
					autoclose: !0,
					minView: p,
					startView: h
				});
				$(this).datetimepicker("show")
			})
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-date");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			var b = "";
			"yyyy-MM-dd" == this.componentSetup.format ? b = "年-月-日" : "yyyy-MM" == this.componentSetup.format ? b = "年-月" : "yyyy-MM-dd HH:mm" == this.componentSetup.format && (b = "年-月-日 时:分");
			c.find("input").attr("placeholder", b);
			c.attr("id", this.componentSetup.fieldId);
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		renderStatSearch: function(a) {
			var c = $(this.tpl).siblings("#statsearch-date"),
				b = a.parentEl,
				e = (new Date).getTime();
			a = a.container;
			c.find(".j_datetime").attr("id", "j_datetime" + e);
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(c);
			var f = $(a + " #j_datetime" + e + " #startDate"),
				g = $(a + " #j_datetime" + e + " #endDate");
			formPlugin.datepicker({
				el: a + " #j_datetime" + e + " #startDate",
				callback: function(a) {
					a = Date.create(a.date).format("{yyyy}-{MM}-{dd}");
					g.val() && a > g.val() ? (formPlugin.notify("开始日期不能大于结束日期"), f.val("")) : f.val(a)
				}
			});
			formPlugin.datepicker({
				el: a + " #j_datetime" + e + " #endDate",
				callback: function(a) {
					a = Date.create(a.date).format("{yyyy}-{MM}-{dd}");
					f.val() && a < f.val() ? (formPlugin.notify("结束日期不能小于开始日期"), g.val("")) : g.val(a)
				}
			})
		},
		submitCheck: function(a, c) {
			var b = this.check(a);
			c(b)
		},
		checkEvents: function(a) {
			var c = this,
				d = c.el || $(document);
			d.on("change", "input[componentKey='DateComponent'][id='" + c.componentSetup.fieldId + "'][cid='" + this.cid + "']", function() {
				var b = c.check($(this));
				a(b)
			});
			d.on("change", "input[id='" + c.componentSetup.fieldId + "'][cid='" + c.cid + "']", function() {
				null == c.check($(this)).message && c.saveComponentValue($(this))
			});
			"mobile" == window.systemInfo_form && (d.on("dateConfirm", "input[id='" + c.componentSetup.fieldId + "'][cid='" + c.cid + "']", function(b, d) {
				$(this).val(d.date);
				var g = c.check($(this));
				a(g);
				null == g.message && c.saveComponentValue($(this))
			}), $("body").off("tap", ".j_date_selected").on("tap", ".j_date_selected", function(a) {
				a = $(this).parents(".j_page-view");
				var c = $(this).attr("format"),
					d = $(this).attr("minview"),
					k = $(this).attr("startview"),
					p = $(this).attr("startdate"),
					h = $(this).attr("enddate"),
					l = a.attr("id");
				(new b({
					el: $(this),
					format: c,
					minView: d,
					startView: k,
					startDate: p,
					endDate: h,
					preEl: "#" + l
				})).render();
				a.addClass("hide")
			}))
		},
		check: function(a) {
			var c = $.trim(a.val()),
				b = a.attr("placeholder"),
				e = {};
			e.element = a;
			c == b && (c = "");
			"" != c || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			return e
		},
		getValue: function(a) {
			var c = $.trim(a.val());
			a = a.attr("placeholder");
			var b = this.oldValue,
				e = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: c
				};
			this.oldValue = c;
			return b && 0 < b.length ? e : "" == c || c == a ? null : e
		},
		setValue: function(a, c) {
			if (null != c) {
				var b = c.content;
				a.find("#" + this.componentSetup.fieldId).val(b);
				a.find(".j_readOnly").html(b);
				this.oldValue = b
			}
		},
		empty: function(a) {
			a.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(a, c) {
			var b = a.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", c);
			c ? (b.addClass("hide"), b.siblings(".j_readOnly").removeClass("hide")) : (b.removeClass("hide"), b.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.DateComponent
});
define("form/component/radiobox", ["form/component", "form/tplutil", "form/component/option"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = h("form/component/option");
	window.RadioBox = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "RadioBox",
				title: "单选框",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				layout: "choicelist-inline",
				options: []
			};
			var c = new b;
			c.setName("选项1");
			c.setOrder(0);
			var d = new b;
			d.setName("选项2");
			d.setOrder(1);
			var e = new b;
			e.setName("选项3");
			e.setOrder(2);
			this.componentSetup.options[0] = c.componentSetup;
			this.componentSetup.options[1] = d.componentSetup;
			this.componentSetup.options[2] = e.componentSetup;
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.layout = a.layout, this.componentSetup.options = a.options);
			this.tpl = l.get("radiobox")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setLayout: function(a) {
			this.componentSetup.layout = a
		},
		setOptions: function(a) {
			this.componentSetup.options = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-radiobox");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			var d = c.find(".choicelist_js");
			d.addClass(this.componentSetup.layout);
			for (var e = 0; e < this.componentSetup.options.length; e++)(new b(this.componentSetup.options[e])).render(d, this);
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-radiobox");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			a.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			a.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", "true");
			for (var c = a.find("ul.choicelistEdit_js"), d = 0; d < this.componentSetup.options.length; d++) {
				var e = this.componentSetup.options[d];
				(new b(e)).renderEditor(c, this);
				"true" != e.other && 1 != e.other || a.find(".btn-default_js").parent().hide()
			}
			$("#editor-component").html(a.html())
		},
		change: function(a) {
			var c = a.oldObj;
			a = a.changeEl;
			this.componentSetup.title = c.componentSetup.title;
			this.componentSetup.describe = c.componentSetup.describe;
			this.componentSetup.order = c.componentSetup.order;
			this.componentSetup.index = c.componentSetup.index;
			this.componentSetup.required = c.componentSetup.required;
			this.componentSetup.fieldId = c.componentSetup.fieldId;
			this.componentSetup.layout = null == c.componentSetup.layout || "" == c.componentSetup.layout ? "choicelist-inline" : c.componentSetup.layout;
			this.componentSetup.options = c.componentSetup.options;
			this.render(a);
			this.renderEditor();
			a.addClass("field-active")
		},
		renderPreview: function(a, c, d) {
			var e = $(this.tpl).siblings("#preview-radiobox");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".form-control").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			e.attr("id", "field_" + this.componentSetup.fieldId).attr("cid", this.cid);
			var f = e.find(".choicelist_js");
			f.addClass(this.componentSetup.layout);
			for (var g = 0; g < this.componentSetup.options.length; g++)(new b(this.componentSetup.options[g])).renderPreview(f, this);
			e.find(".check_js").attr("id", this.componentSetup.fieldId);
			e.find(".check_js").data("componentData", this);
			c && e.find(".check_js input:radio").attr("checked", !1);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, d);
			this.el = a;
			a.append(e);
			this.getValue(e)
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-radiobox");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.find(".form-control").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			c.attr("id", "field_" + this.componentSetup.fieldId);
			var d = c.find(".choicelist_js");
			d.addClass(this.componentSetup.layout);
			for (var e = 0; e < this.componentSetup.options.length; e++)(new b(this.componentSetup.options[e])).render(d, this);
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		renderStatSearch: function(a) {
			var c = a.parentEl;
			$.ajax({
				type: "get",
				url: "/formdatastat/getFiledOptions.json",
				dataType: "json",
				data: {
					fieldId: a.fieldId
				},
				success: function(a) {
					html = '<select class="form-control sch-item j_fieldOption"><option value="eq">等于</option><option value="neq">不等于</option></select>';
					for (var b = '<select class="form-control j_resultList"><option>请选择</option>', f = 0; f < a.fieldOptions.length; f++)
					var g = a.fieldOptions[f],
						b = b + ("<option id=" + g.id + ">" + g.name + "</option>");
					html += b + '</select><div class="j_selected entity-container sch-item"></div><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a>';
					c.attr("class", "sch-group j_formFieldSearchGroup");
					c.find(".j_formField-condition").html(html)
				}
			})
		},
		submitCheck: function(a, c) {
			var b = this.check(a);
			c(b)
		},
		checkEvents: function(a) {
			var c = this,
				b = c.el || $(document);
			b.on("change", "input:radio[name='" + c.componentSetup.fieldId + this.cid + "']", function() {
				var b = $(this).parents(".check_js"),
					d = $(this).data("componentData");
				"true" == d.componentSetup.other || 1 == d.componentSetup.other ? b.find("input:text").attr("disabled", !1).show() : b.find("input:text").attr("disabled", !0).hide();
				b = c.check(b);
				a(b);
				null == b.message && c.saveComponentValue($(this))
			});
			b.on("change", "#field_" + c.componentSetup.fieldId + "[cid='" + this.cid + "'] input:text", function() {
				var a = $(this).val();
				null != a && "" != $.trim(a) && c.saveComponentValue($(this))
			})
		},
		check: function(a) {
			var c = a.find("input:radio[name='" + this.componentSetup.fieldId + this.cid + "']:checked").val(),
				b = {};
			b.element = a;
			"" != c && null != c || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (b.message = this.componentSetup.title + "不能为空");
			return b
		},
		getValue: function(a) {
			var c = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			},
				b = a.find("input:radio[name='" + this.componentSetup.fieldId + this.cid + "']:checked"),
				e = b.val();
			if (null == b.get(0)) return null;
			var b = b.data("componentData"),
				f = "";
			"true" == b.componentSetup.other || 1 == b.componentSetup.other ? (f = a.find("input:text").val(), 0 == f.length && (f = "其他")) : f = b.componentSetup.name;
			c.dataOptions = [{
				optionId: e,
				content: f
			}];
			this.oldValue = f;
			return null == e || "" == $.trim(e) ? null : c
		},
		setValue: function(a, c) {
			if (null != c && null != c.dataOptions) {
				for (var b = 0; b < c.dataOptions.length; b++) {
					var e = c.dataOptions[b],
						f = e.content,
						e = a.find("input:radio[name='" + this.componentSetup.fieldId + this.cid + "'][value='" + e.optionId + "']");
					e.get(0).checked = !0;
					a.find(".j_readOnly").html(f);
					e = e.data("componentData").componentSetup.other;
					if ("true" == e || 1 == e) a.find("input:text").val(f), a.find("input:text").show()
				}
				this.oldValue = a.find(".j_readOnly").text()
			}
		},
		empty: function(a) {},
		readOnly: function(a, c) {
			a.find("input:radio[name='" + this.componentSetup.fieldId + this.cid + "']").attr("disabled", c);
			c ? (a.find(".check_js").addClass("hide"), a.find(".j_readOnly").removeClass("hide")) : (a.find(".check_js").removeClass("hide"), a.find(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.RadioBox
});
define("form/component/department", ["form/component", "form/tplutil", "form/component/departselecter"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = h("form/component/departselecter");
	window.Department = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "Department",
				title: "添加部门",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				isUnique: !1,
				isCurrentDepartment: !1,
				isReadonly: !1
			};
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.isUnique = a.isUnique, this.componentSetup.isCurrentDepartment = a.isCurrentDepartment, this.componentSetup.isReadonly = a.isReadonly);
			this.tpl = l.get("department")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setIsUnique: function(a) {
			this.componentSetup.isUnique = a
		},
		setIsCurrentDepartment: function(a) {
			this.componentSetup.isCurrentDepartment = a
		},
		setIsReadonly: function(a) {
			this.componentSetup.isReadonly = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-department");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-department");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			var c = !1,
				b = !1,
				e = !1;
			if ("true" == this.componentSetup.isUnique || 1 == this.componentSetup.isUnique) c = !0;
			if ("true" == this.componentSetup.isCurrentDepartment || 1 == this.componentSetup.isCurrentDepartment) b = !0, a.find(".department_readonly_js").show();
			if ("true" == this.componentSetup.isReadonly || 1 == this.componentSetup.isReadonly) e = !0;
			a.find("#isUnique").attr("checked", c);
			a.find("#isCurrentDepartment").attr("checked", b);
			a.find("#isReadonly").attr("checked", e);
			$("#editor-component").html(a.html())
		},
		renderPreview: function(a, c, b) {
			var e = $(this.tpl),
				f = null,
				f = null == TEAMS.currentUser ? e.siblings("#nouser-preview") : "mobile" == window.systemInfo_form ? e.siblings("#mobile-preview") : e.siblings("#preview-department");
			f.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || f.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (f.find(".field-description").text(this.componentSetup.describe), f.find(".field-description").show());
			f.find(".check_js").attr("id", this.componentSetup.fieldId + this.cid).attr("name", this.componentSetup.fieldId);
			f.attr("id", "field_" + this.componentSetup.fieldId);
			f.find(".check_js").data("componentData", this);
			"mobile" == window.systemInfo_form && f.find(".department-seleted").attr("id", this.componentSetup.fieldId);
			var e = this.componentSetup.fieldId + this.cid,
				g = this.componentSetup.isUnique,
				k = this.componentSetup.isReadonly;
			"mobile" != window.systemInfo_form || "true" != g && 1 != g || f.find(".js_departmentitem_container").attr("data-multi", "false");
			if ("true" == k || 1 == k || b)"mobile" != window.systemInfo_form ? this.readOnly(f, !0) : f.find(".js_departmentitem_container").removeClass("department-seleted").text("");
			c || (c = "true" == this.componentSetup.isCurrentDepartment || 1 == this.componentSetup.isCurrentDepartment, this.initCurrentSystemDept(f.find("#" + e), c, k));
			f.addClass(this.componentSetup.titleLayout);
			this.el = a;
			a.append(f);
			this.getValue(f)
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-department");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.attr("id", this.componentSetup.fieldId);
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		renderStatSearch: function(a) {
			var c = this,
				b = $(this.tpl).siblings("#statsearch-department"),
				e = a.parentEl;
			a = a.container;
			var f = (new Date).getTime();
			b.find(".j_deptcontainer").attr("id", "j_department" + f);
			e.attr("class", "sch-group j_formFieldSearchGroup");
			e.find(".j_formField-condition").html(b);
			var g = $(a + " #j_department" + f + " #typeahead-department");
			window.typeahead && window.typeahead.init && window.typeahead.init({
				el: a + " #j_department" + f + " #typeahead-department",
				callback: function(a) {
					if (a && !$.isEmptyObject(a)) {
						var b = g.parents(".j_deptcontainer").find(".j_selected");
						c.renderTypeheader(b, a)
					}
				}
			})
		},
		submitCheck: function(a, c) {
			var b = this.check(a, "submit");
			c(b)
		},
		checkEvents: function(a) {
			var c = this,
				d = c.el || $(document),
				e = c.componentSetup.fieldId + this.cid;
			(new this.departmentAhead({})).initAhead(e);
			d.on("mouseenter.typeahead", "#" + e + " .typeahead-wrapper", function(a) {
				$(this).data("enter", !0)
			}).on("mouseleave.typeahead", "#" + e + " .typeahead-wrapper", function(a) {
				$(this).data("enter", !1)
			});
			d.on("click", "#" + e + " .control-btn", function(a) {
				a.stopPropagation();
				$(this).addClass("hide");
				$(this).prev(".typeahead-wrapper").removeClass("hide");
				$(this).prev(".typeahead-wrapper").find(".control-input").focus()
			});
			d.on("focusout", "#" + e + " .control-input", function(a, c) {
				var b = $(this).parents(".typeahead-wrapper");
				b.data("enter") && "tt" != c || (b.addClass("hide"), b.next(".control-btn").removeClass("hide"))
			});
			d.on("click.tt", "#" + e + " #searchList>p", function() {
				var a = $("#" + e);
				a.parents(".field_js").find(".form-error").text("");
				a.parents(".field_js").find(".form-error").hide();
				var b = $(this).data("obj"),
					d = b.id,
					b = '<span class="js_form-userItem employee-item department-item" name="js_form-userItem"><a departmentid=' + d + ">" + b.name + '</a><a class="close js_deleteDepartment" title="删除">&times;</a></span>',
					p = c.componentSetup.isUnique,
					h = $("#" + e + " .js_departmentitem_container .js_form-userItem"),
					l = !0;
				"true" == p || 1 == p ? a.find(".js_departmentitem_container").empty() : h && h.each(function(a) {
					d == $(this).find("a[departmentid]").attr("departmentid") && ($(this).remove(), l = !1)
				});
				a.find(".js_departmentitem_container").append(b);
				l && c.saveComponentValue($(this))
			});
			d.on("click", "#" + e + " .js_deleteDepartment", function() {
				var b = $(this).parents("#" + e);
				$(this).parent().remove();
				var d = c.check(b, "change");
				a(d);
				null == d.message && c.saveComponentValue(b)
			});
			if ("mobile" == window.systemInfo_form) d.on("click", "#" + e + " .j_department-seleted", function(a) {
				a = $(this).attr("data-multi");
				var c = $(this).parents(".j_page-view"),
					d = c.attr("id"),
					e = $(this);
				(new b).render("mb", {
					el: e,
					multi: a,
					preEl: "#" + d
				});
				c.addClass("hide");
				$("#department-component").removeClass("hide")
			});
			else d.on("click", "#" + e + " #search-department", function(a) {
				(new b).render("pc", {
					target: $(this)
				});
				a = $(this).parents(".typeahead-wrapper");
				0 < a.length && a.find(".control-input").trigger("focusout", "tt")
			});
			d.on("confirmHandler", "#" + e + " #search-department", function(a, b) {
				var d = $("#" + e);
				d.parents(".field_js").find(".form-error").text("");
				d.parents(".field_js").find(".form-error").hide();
				var p = c.componentSetup.isUnique,
					d = $("#" + e + " .js_departmentitem_container"),
					h = $("#" + e + " .js_departmentitem_container .js_form-userItem"),
					h = c.getIdArray(h);
				"true" != p && 1 != p || d.empty();
				var p = b.objs,
					l = '<span name="js_form-userItem" class="js_form-userItem employee-item department-item"><a departmentid=' + p.id + ">" + p.name + '</a><a class="close js_deleteDepartment" title="删除">&times;</a></span>',
					n;
				for (n in h)
				p.id == h[n] && (l = null);
				d.append(l)
			});
			if ("mobile" == window.systemInfo_form) d.on("departmentComfirm", "#" + e, function(a, b) {
				var d = $("#" + e + " .js_departmentitem_container"),
					p = c.componentSetup.isUnique;
				d.text("");
				d.parents("#field_" + c.componentSetup.fieldId).find(".form-error").text("");
				"true" != p && 1 != p || d.empty();
				if (b.objs.length) {
					var p = b.objs,
						h;
					for (h in p) {
						var l = p[h];
						if (l) {
							var n = $('<span class="js_form-userItem" name="js_form-userItem" data-id=' + l.id + " id=" + l.id + ">" + l.name + "，</span>");
							d.append(n)
						}
					}
				} else l = b.objs, n = $('<span class="js_form-userItem" name="js_form-userItem" data-id=' + l.id + " id=" + l.id + ">" + l.name + "，</span>"), 0 == l.length ? d.text("请选择部门") : d.append(n);
				d = $(this).find("span:last").text();
				d = d.substring(0, d.indexOf("，"));
				$(this).find("span:last").text(d)
			})
		},
		check: function(a, c) {
			var b = $(a).find('span[name="js_form-userItem"]').length,
				e = {};
			e.element = a;
			0 != b || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			return e
		},
		getValue: function(a) {
			var c = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			};
			a = a.find(".js_departmentitem_container .js_form-userItem");
			if (0 < a.length) {
				var b = [],
					e = "";
				a.each(function(a) {
					var c = $(this).find("a").eq(0).attr("departmentid"),
						k = $(this).find("a").eq(0).text();
					e += k + ",";
					"mobile" == window.systemInfo_form && (c = $(this).attr("id"), k = $(this).text());
					b[a] = {
						optionId: c,
						content: k
					}
				});
				c.dataOptions = b;
				0 != b.length && (this.oldValue = e.substring(0, e.length - 1))
			} else c = null;
			return c
		},
		setValue: function(a, c) {
			a.find(".js_departmentitem_container").empty();
			if (null != c && null != c.dataOptions) {
				for (var b = "", e = 0; e < c.dataOptions.length; e++) {
					var f = c.dataOptions[e],
						g = null == f.content ? "" : f.content,
						f = f.optionId,
						b = b + (g + ",");
					"mobile" != window.systemInfo_form ? null != a.find(".js_form-userItem-add").get(0) ? a.find(".form-departmentList .js_departmentitem_container").append($('<span class="js_form-userItem employee-item department-item" name="js_form-userItem" data-id=' + f + "><a departmentid=" + f + ">" + g + '</a><a class="close js_deleteDepartment" title="删除">&times;</a></span>')) : a.find(".form-departmentList .js_departmentitem_container").append($('<span class="js_form-userItem employee-item department-item" name="js_form-userItem" data-id=' + f + "><a departmentid=" + f + ">" + g + "</a></span>")) : a.find(".form-departmentList .js_departmentitem_container").append($('<span class="js_form-userItem" name="js_form-userItem" data-id=' + f + " id=" + f + ">" + g + "</span>"))
				}
				this.oldValue = "";
				0 != c.dataOptions.length && (this.oldValue = b.substring(0, b.length - 1))
			}
		},
		empty: function(a) {
			a.find(".js_departmentitem_container").html("")
		},
		readOnly: function(a, c) {
			var b = this.componentSetup.fieldId + this.cid,
				e = a.find('div[id="' + b + '"] span[name="js_form-userItem-add"]'),
				f = a.find('div[id="' + b + '"] span[name="js_form-userItem"]'),
				g = a.find('div[id="' + b + '"] .js_deleteDepartment');
			c ? (e.remove(), g.remove()) : e && 0 != e.length && null != e || (e = $(this.tpl).siblings("#preview-department").find('span[name="js_form-userItem-add"]'), a.find('div[id="' + b + '"]').find(".js_departmentitem_container").after(e), f.append('<a class="close js_deleteDepartment">&times;</a>'))
		},
		getIdArray: function(a) {
			var c = [];
			a && a.each(function(a) {
				a = $(this).find("a[departmentid]").attr("departmentid");
				c.push(a)
			});
			return c
		},
		initCurrentSystemDept: function(a, c, b) {
			"true" != this.componentSetup.isCurrentDepartment && 1 != this.componentSetup.isCurrentDepartment || $(document).trigger("currentDepartment", function(c) {
				var f = c.name;
				c = c.id;
				var g = a.find(".js_departmentitem_container"),
					k = $('<span name="js_form-userItem" class="js_form-userItem employee-item department-item"><a departmentid=' + c + ">" + f + '</a><a class="close js_deleteDepartment" title="删除">&times;</a></span>');
				if ("true" == b || 1 == b) k = $('<span name="js_form-userItem" class="js_form-userItem employee-item department-item"><a departmentid=' + c + ">" + f + "</a></span>");
				"mobile" == window.systemInfo_form && (g.text(""), k = $("<span data-id=" + c + ' name="js_form-userItem" class="js_form-userItem" id=' + c + ">" + f + "</span>"));
				g.append(k)
			})
		},
		renderTypeheader: function(a, c) {
			if (c.length) for (var b = 0; b < c.length; b++) {
				var e = c[b],
					f = e.name,
					g = e.id;
				if (f && g) {
					var k = '<span class="entity-item"><a id=' + g + ">" + f + "</a></span>";
					a.find(".entity-item").each(function(a) {
						g == $(this).find("a").attr("id") && (k = null)
					});
					a.append(k)
				}
			} else f = c.name, g = c.id, f && g && (k = '<span class="entity-item"><a id=' + g + ">" + f + "</a></span>", a.find(".entity-item").each(function(a) {
				g == $(this).find("a").attr("id") && (k = null)
			}), a.append(k))
		},
		departmentAhead: m.extend({
			defaults: function() {
				this.suggestion = "";
				this.remote = "/search/suggestion.json";
				this.entity = "department";
				this.tpl = l.get("department")
			},
			initAhead: function(a) {
				this.defaults();
				this.fieldId = a;
				this.$continer = $("#" + this.fieldId);
				this._htmlEvents()
			},
			_htmlEvents: function() {
				var a = this,
					c = a.$continer,
					b = $("#" + a.fieldId + " #typeahead-form-department");
				b.off("focus.tt").on("focus.tt", function(c) {
					a._search($(this))
				});
				b.off("click.tt").on("click.tt", function(a) {
					a.stopPropagation()
				});
				b.off("keyup.tt").on("keyup.tt", function(b) {
					b = b.which;
					13 == b ? c.find("#typeahead-div p.active").trigger("click.tt") : 27 == b ? a.hide() : 38 == b ? (b = c.find("#typeahead-div p.active"), 1 > b.length ? c.find("#typeahead-div p").last().addClass("active") : (b.removeClass("active"), (0 < b.prev().length ? b.prev() : c.find("#typeahead-div p").last()).addClass("active"))) : 40 == b ? (b = c.find("#typeahead-div p.active"), 1 > b.length ? c.find("#typeahead-div p").first().addClass("active") : (b.removeClass("active"), (0 < b.next().length ? b.next() : c.find("#typeahead-div p").first()).addClass("active"))) : a._search($(this))
				});
				c.find("#typeahead-div").off("mouseenter.tt", "p").on("mouseenter.tt", "p", function() {
					$(this).addClass("active");
					c.find("#typeahead-div p.active").removeClass("active")
				});
				c.off("click.tt", "#typeahead-div p").on("click.tt", "#typeahead-div p", function(a) {
					b.trigger("focusout", "tt")
				})
			},
			_search: function(a) {
				var c = this,
					b = $.trim(a.val()),
					e = c.$continer;
				b == a.attr("placeholder") && (b = "");
				e.find("#typeahead-div #searchList").html("");
				e.find("#typeahead-div .loading_small").addClass(f).show();
				if (c.list && c.suggestion === b) c._loadList(c.list);
				else {
					var f = c.entity;
					a = c.remote;
					e = {};
					this.suggestion = b;
					e.keywords = b;
					e.searchType = c.entity;
					$.ajax({
						type: "get",
						url: a,
						dataType: "json",
						data: e,
						success: function(a) {
							a = a[f + "s"];
							c.list = a;
							c._loadList(a)
						}
					})
				}
			},
			_loadList: function(a) {
				var c = this.$continer;
				c.find("#typeahead-div .loading_small").hide();
				for (var b = 0, e = a.length; b < e; b++) {
					var f = a[b];
					f.name = f.name.replace(/</g, "&lt").replace(/>/g, "&gt").replace("/[\r\n]/g", " ");
					var g = $(this.tpl).siblings(".department");
					g.find(".j_name").text(f.name);
					g.data("obj", f);
					c.find("#typeahead-div #searchList").append(g)
				}
				c.find("#typeahead-div").show()
			}
		})
	});
	n.exports = window.Department
});
define("form/component/numbercomponent", ["form/component", "form/tplutil", "form/componentmodel"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = h("form/componentmodel");
	window.NumberComponent = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "NumberComponent",
				title: "数字输入框",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium",
				tempId: 0
			};
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.size = a.size, this.componentSetup.tempId = a.tempId || a.fieldId);
			this.tpl = l.get("numbercomponent");
			this.componentModel = new b
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var c = this,
				b = $(this.tpl).siblings("#form-number");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("class", b.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			this.componentModel.generatorId(function(b) {
				b = b.generatorId;
				c.componentSetup.tempId = b;
				a.attr("tempId", b)
			});
			a.html(b.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-number");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			a.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(a.html())
		},
		renderPreview: function(a, c, b) {
			var e = $(this.tpl).siblings("#preview-number");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".check_js").addClass(this.componentSetup.size);
			e.find(".check_js").attr("id", this.componentSetup.fieldId || this.componentSetup.tempId).attr("name", this.componentSetup.fieldId || this.componentSetup.tempId);
			e.find(".check_js").attr("cid", this.cid);
			e.attr("id", "field_" + (this.componentSetup.fieldId || this.componentSetup.tempId));
			e.attr("tempId", "field_" + (this.componentSetup.fieldId || this.componentSetup.tempId));
			e.attr("fieldId", this.componentSetup.fieldId || this.componentSetup.tempId);
			e.find(".check_js").data("componentData", this);
			c && e.find(".check_js").val("");
			e.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, b);
			this.el = a;
			a.append(e)
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-number");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.find(".form-control").addClass(this.componentSetup.size);
			c.attr("id", this.componentSetup.fieldId);
			c.attr("tempId", this.componentSetup.fieldId);
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		renderStatSearch: function(a) {
			var c = $(this.tpl).siblings("#statsearch-number");
			a = a.parentEl;
			a.attr("class", "sch-group j_formFieldSearchGroup");
			a.find(".j_formField-condition").html(c)
		},
		submitCheck: function(a, c) {
			var b = this.check(a);
			c(b)
		},
		checkEvents: function(a) {
			var c = this,
				b = c.el || $(document),
				e = c.componentSetup.fieldId || c.componentSetup.tempId;
			b.on("blur", "input[componentKey='NumberComponent'][id='" + e + "'][cid='" + this.cid + "']", function() {
				var b = c.check($(this));
				a(b)
			});
			b.on("keydown", "input[componentKey='NumberComponent'][id='" + e + "'][cid='" + this.cid + "']", function(a) {
				a = parseInt(a.keyCode);
				var c = $(this).val();
				if ((110 == a || 190 == a) && 0 <= c.indexOf(".") || (109 == a || 173 == a) && 0 <= c.indexOf("-")) return !1
			});
			b.on("keyup", "input[componentKey='NumberComponent'][id='" + e + "'][cid='" + this.cid + "']", function(a) {
				a = $(this).val();
				isNaN(a) && "-" != a && $(this).val(parseFloat(a));
				"." == a.charAt(0) && $(this).val(0 + parseFloat(a))
			});
			b.on("keyup", "input[componentKey='NumberComponent'][id='" + e + "'][cid='" + this.cid + "']", function(a) {
				a = $(this).val();
				$(this).val(a.replace(/[^\d.-]/g, ""))
			});
			b.on("blur", "input[componentKey='NumberComponent'][id='" + e + "'][cid='" + this.cid + "']", function(a) {
				a = $(this).val();
				$(this).val(a.replace(/[^\d.-]/g, ""))
			});
			b.on("change", "input[id='" + e + "'][cid='" + c.cid + "']", function() {
				null == c.check($(this)).message && c.saveComponentValue($(this))
			})
		},
		check: function(a) {
			var c = $.trim(a.val()),
				b = a.attr("placeholder"),
				e = {};
			e.element = a;
			c == b && (c = "");
			"" != c || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			return e
		},
		getValue: function(a) {
			var c = $.trim(a.val());
			a = a.attr("placeholder");
			var b = this.oldValue,
				e = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: c
				};
			this.oldValue = c;
			return b && 0 < b.length ? e : "" == c || c == a || isNaN(c) ? null : e
		},
		setValue: function(a, c) {
			if (null != c) {
				var b = c.content;
				a.find("#" + this.componentSetup.fieldId).val(b);
				a.find(".j_readOnly").html(b);
				this.oldValue = b
			}
		},
		empty: function(a) {
			a.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(a, c) {
			var b = a.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", c);
			c ? (b.addClass("hide"), b.siblings(".j_readOnly").removeClass("hide")) : (b.removeClass("hide"), b.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.NumberComponent
});
define("form/component/raty", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.Raty = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Raty",
				title: "评分",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium",
				half: "no",
				defaultstar: 0
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.fieldId = b.fieldId, this.componentSetup.size = b.size, this.componentSetup.half = b.half, this.componentSetup.defaultstar = b.defaultstar, this.rdOnly = !1);
			this.tpl = l.get("raty")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		sethalf: function(b) {
			this.componentSetup.half = b
		},
		setDefaultstar: function(b) {
			this.componentSetup.defaultstar = b
		},
		render: function(b) {
			for (var a = $(this.tpl), c = a.siblings("#form-raty"), d = 1; 5 >= d; d++) {
				var e = a.siblings("#img-clone").find("img").clone();
				e.attr("value", d);
				c.find("#star").append(e)
			}
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			b.attr("class", c.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(c.html())
		},
		renderEditor: function() {
			var b = $(this.tpl),
				a = b.siblings("#editor-raty");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("#component-describe").text(this.componentSetup.describe);
			a.find("input:radio[name='half'][value='" + this.componentSetup.half + "']").attr("checked", !0);
			var c = this.componentSetup.half,
				b = b.siblings("#img-clone");
			if ("no" == c) for (a.find(".j_default-star").empty(), c = 0; 5 >= c; c++) {
				var d = b.find("option").clone();
				d.attr("value", c);
				d.text(c);
				a.find(".j_default-star").append(d)
			} else for (a.find(".j_default-star").empty(), c = 0; 5 >= c; c += .5)
			d = b.find("option").clone(), d.attr("value", c), d.text(c), a.find(".j_default-star").append(d);
			a.find("option[value='" + this.componentSetup.defaultstar + "']").attr("selected", !0);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			$("#editor-component").html(a.html())
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl),
				e = d.siblings("#preview-raty"),
				f = this.componentSetup.defaultstar,
				g = Math.round(f),
				d = d.siblings("#img-clone");
			if (f == g) for (var k = 1; 5 >= k; k++) {
				if (k <= f) {
					var p = d.find("img").clone(),
						h = p.attr("src"),
						h = h.replace("off", "on");
					p.attr("src", h)
				} else p = d.find("img").clone();
				p.attr("value", k);
				e.find("#star-preview").append(p)
			} else for (k = 1; 5 >= k; k++)
			k <= g - 1 ? (p = d.find("img").clone(), h = p.attr("src"), h = h.replace("off", "on"), p.attr("src", h)) : k == g ? (p = d.find("img").clone(), h = p.attr("src"), h = h.replace("off", "half"), p.attr("src", h)) : p = d.find("img").clone(), p.attr("value", k), e.find("#star-preview").append(p);
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			e.find(".check_js").attr("cid", this.cid);
			e.attr("id", "field_" + this.componentSetup.fieldId);
			e.find(".check_js").data("componentData", this);
			a && e.find(".check_js").val("");
			e.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, c);
			b.append(e);
			this.getValue(e)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl),
				c = a.siblings("#form-raty"),
				d = this.componentSetup.defaultstar,
				e = Math.round(d),
				a = a.siblings("#img-clone");
			if (0 < d) if (d == e) for (var f = 1; 5 >= f; f++) {
				if (f <= d) {
					var g = a.find("img").clone(),
						k = g.attr("src"),
						k = k.replace("off", "on");
					g.attr("src", k)
				} else g = a.find("img").clone();
				g.attr("value", f);
				c.find("#star").append(g)
			} else for (f = 1; 5 >= f; f++)
			f <= e - 1 ? (g = a.find("img").clone(), k = g.attr("src"), k = k.replace("off", "on"), g.attr("src", k)) : f == e ? (g = a.find("img").clone(), k = g.attr("src"), k = k.replace("off", "half"), g.attr("src", k)) : g = a.find("img").clone(), g.attr("value", f), c.find("#star").append(g);
			else for (f = 1; 5 >= f; f++)
			g = a.find("img").clone(), g.attr("value", f), c.find("#star").append(g);
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.attr("id", this.componentSetup.fieldId);
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			b.append(c)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-raty");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = $("div[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']");
			if (this.rdOnly) c.attr("style", "");
			else {
				var d = this.componentSetup.half;
				b = c.find("img[src*='half']").length;
				var e = c.find("img[src*='on']").length,
					f = 0,
					f = 0 < b ? e + .5 : e;
				a.selectValue = this.componentSetup.defaultstar;
				c.on("mousemove", "img", function(a) {
					var b = $(this).offset().left,
						e = $(this).attr("value"),
						f = $(this).width(),
						h = b + f / 2,
						f = f + b;
					a.pageX >= b && a.pageX < h ? "no" == d ? c.find("img[value='" + e + "']").attr("src", "/iform/static/img/form/star-on-big.png") : c.find("img[value='" + e + "']").attr("src", "/iform/static/img/form/star-half-big.png") : a.pageX >= h && a.pageX < f && c.find("img[value='" + e + "']").attr("src", "/iform/static/img/form/star-on-big.png");
					g(e)
				});
				c.on("mouseout", "img", function() {
					var b = Math.round(a.selectValue);
					b == a.selectValue ? c.find("img[value='" + b + "']").attr("src", "/iform/static/img/form/star-on-big.png") : c.find("img[value='" + b + "']").attr("src", "/iform/static/img/form/star-half-big.png");
					g(b)
				});
				c.on("click", "img", function(b) {
					a.selectValue = $(this).attr("value");
					var e = $(this).offset().left,
						h = $(this).width(),
						l = e + h / 2,
						h = h + e;
					b.pageX >= e && b.pageX < l ? (a.selectValue = "no" == d ? a.selectValue : a.selectValue - 1 + .5, f == a.selectValue ? f = a.selectValue = 0 : ("no" == d ? c.find("img[value='" + a.selectValue + "']").attr("src", "/iform/static/img/form/star-on-big.png") : c.find("img[value='" + a.selectValue + "']").attr("src", "/iform/static/img/form/star-half-big.png"), f = a.selectValue)) : b.pageX >= l && b.pageX < h && (f == a.selectValue ? f = a.selectValue = 0 : (c.find("img[value='" + a.selectValue + "']").attr("src", "/iform/static/img/form/star-on-big.png"), f = a.selectValue));
					g(a.selectValue)
				});
				var g = function(a) {
						for (var b = 1; b <= a - 1; b++)
						c.find("img[value='" + b + "']").attr("src", "/iform/static/img/form/star-on-big.png");
						for (b = 5; b > a; b--)
						c.find("img[value='" + b + "']").attr("src", "/iform/static/img/form/star-off-big.png")
					}
			}
		},
		check: function(b) {
			var a = $.trim(b.val()),
				c = b.attr("placeholder"),
				d = {};
			d.element = b;
			a == c && (a = "");
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			return d
		},
		getValue: function(b) {
			var a = $(b).find("img[src*='on']").length;
			0 < $(b).find("img[src*='half']").length && (a += .5);
			b = b.attr("placeholder");
			var c = this.oldValue,
				d = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: a + ""
				};
			this.oldValue = a + "";
			return c && 0 < c.length ? d : 0 == a.length || a == b || isNaN(a) ? null : d
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content,
					d = Math.round(c);
				if (0 < c) if (c == d) for (var e = 1; 5 >= e; e++) {
					if (e <= d) var f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"),
						f = f.replace("off", "on"),
						f = f.replace("half", "on");
					else f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"), f = f.replace("on", "off"), f = f.replace("half", "off");
					b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src", f)
				} else for (e = 1; 5 >= e; e++)
				e <= d - 1 ? (f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"), f = f.replace("off", "on"), f = f.replace("half", "on")) : e == d ? (f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"), f = f.replace("off", "half"), f = f.replace("on", "off")) : (f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"), f = f.replace("on", "off"), f = f.replace("half", "off")), b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src", f);
				b.find(".j_readOnly").html(c);
				this.oldValue = c + "";
				this.selectValue = c || 0
			}
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			b.find("div[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']");
			a && (this.rdOnly = a)
		}
	});
	n.exports = window.Raty
});
define("form/component/datetimepicker", ["form/tplutil"], function(h, m, n) {
	var l = h("form/tplutil");
	DateTimePicker = Backbone.View.extend({
		initialize: function(b) {
			this.el = b.el;
			this.preEl = b.preEl;
			this.startView = b.startView ? b.startView : 2;
			this.format = b.format ? b.format : "{yyyy}-{MM}-{dd}";
			this.minView = b.minView ? b.minView : 2;
			this.startDate = b.startDate ? b.startDate : null;
			this.endDate = b.endDate ? b.endDate : null;
			$("body").append(l.get("datetimepicker"))
		},
		delegateEvents: function() {
			var b = this;
			$("#datetime-back").on("click", function() {
				$(b.preEl).removeClass("hide");
				$("#date-selected").addClass("hide");
				b.remove()
			})
		},
		render: function() {
			var b = this;
			$("#datetimepicker").datetimepicker({
				format: b.format,
				weekStart: 1,
				todayBtn: 1,
				todayHighlight: 1,
				startView: b.startView,
				minView: b.minView,
				startDate: b.startDate,
				endDate: b.endDate,
				language: "zh-CN"
			}).on("changeDate", function(a) {
				a = a.date;
				16 < b.format.length && a.setHours(a.getHours() - 8);
				a || (a = "");
				a instanceof Date && (a = a.format(b.format));
				b.el.trigger("dateConfirm", {
					date: a
				});
				$("#date-selected").addClass("hide");
				$(b.preEl).removeClass("hide");
				b.remove()
			});
			setTimeout(function() {
				$("#date-selected").removeClass("hide")
			}, 100)
		},
		remove: function() {
			$("#date-selected").remove()
		}
	});
	n.exports = DateTimePicker
});
define("form/component/textarea", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.TextArea = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "TextArea",
				title: "多行文本框",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium"
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.fieldId = b.fieldId, this.componentSetup.size = b.size);
			this.tpl = l.get("textarea")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-textarea");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-textarea");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", "true");
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			b.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		change: function(b) {
			var a = b.oldObj;
			b = b.changeEl;
			this.componentSetup.title = a.componentSetup.title;
			this.componentSetup.describe = a.componentSetup.describe;
			this.componentSetup.required = a.componentSetup.required;
			this.componentSetup.fieldId = a.componentSetup.fieldId;
			this.componentSetup.size = a.componentSetup.size;
			this.render(b);
			b.addClass("field-active")
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-textarea");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").addClass(this.componentSetup.size);
			d.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			a && d.find(".check_js").val("");
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			"mobile" != window.systemInfo_form && d.find(".form-control").autosize();
			d.addClass(this.componentSetup.titleLayout);
			this.readOnly(d, c);
			this.el = b;
			b.append(d)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-textarea");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-textarea");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			c.on("blur", "textarea[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "textarea[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
				c = {};
			c.element = b;
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (c.message = this.componentSetup.title + "不能为空");
			return c
		},
		getValue: function(b) {
			var a = $.trim(b.val());
			b = b.attr("placeholder");
			var c = this.oldValue,
				d = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					dataText: {
						content: a
					}
				};
			this.oldValue = a;
			return c && 0 < c.length ? d : "" == a || a == b ? null : d
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content;
				null != a.dataText && (c = a.dataText.content);
				b.find("#" + this.componentSetup.fieldId).val(c);
				var d = c.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
				b.find(".j_readOnly").html(d);
				"mobile" != window.systemInfo_form && (b.find("#" + this.componentSetup.fieldId).trigger("autosize.resize"), $(window).resize());
				this.oldValue = c
			}
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("textarea[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.TextArea
});
define("form/component/htmltext", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.HtmlText = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "TextArea",
				title: "Html片段",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium"
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.fieldId = b.fieldId, this.componentSetup.size = b.size);
			this.tpl = l.get("htmltext")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-htmltext");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-htmltext");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", "true");
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			b.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		change: function(b) {
			var a = b.oldObj;
			b = b.changeEl;
			this.componentSetup.title = a.componentSetup.title;
			this.componentSetup.describe = a.componentSetup.describe;
			this.componentSetup.required = a.componentSetup.required;
			this.componentSetup.fieldId = a.componentSetup.fieldId;
			this.componentSetup.size = a.componentSetup.size;
			this.render(b);
			b.addClass("field-active")
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-htmltext");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").addClass(this.componentSetup.size);
			d.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			a && d.find(".check_js").val("");
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			"mobile" != window.systemInfo_form && d.find(".form-control").autosize();
			d.addClass(this.componentSetup.titleLayout);
			this.readOnly(d, c);
			this.el = b;
			b.append(d)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-htmltext");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			c.on("blur", "textarea[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "textarea[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
				c = {};
			c.element = b;
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (c.message = this.componentSetup.title + "不能为空");
			return c
		},
		getValue: function(b) {
			var a = $.trim(b.val());
			b = b.attr("placeholder");
			var c = this.oldValue,
				d = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					dataText: {
						content: a
					}
				};
			this.oldValue = a;
			return c && 0 < c.length ? d : "" == a || a == b ? null : d
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content;
				null != a.dataText && (c = a.dataText.content);
				b.find("#" + this.componentSetup.fieldId).val(c);
				var d = c.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
				b.find(".j_readOnly").html(d);
				"mobile" != window.systemInfo_form && (b.find("#" + this.componentSetup.fieldId).trigger("autosize.resize"), $(window).resize());
				this.oldValue = c
			}
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("textarea[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.HtmlText
});
/**
 * 参照组件
 */
define("form/component/reference", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var components = h("form/tplutil");
	window.Reference = m.extend({
		initialize: function(b) {
			this.componentSetup = {
					componentKey: "Reference",
					title: "参照",
					titleLayout: "field-hoz",//控件设置属性--标题布局
					order: 0,
					index: 0,
					describe: "",            //控件设置属性--描述
					required: !1,            //控件设置属性--必填
					fieldId: "",             //组件id
					size: "medium"           //控件设置属性--控件大小
			};
			null != b && (this.componentSetup.title = b.title, 
					this.componentSetup.titleLayout = b.titleLayout, 
					this.componentSetup.describe = b.describe, 
					this.componentSetup.order = b.order, 
					this.componentSetup.index = b.index, 
					this.componentSetup.required = b.required, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.size = b.size);
			this.tpl = components.get("reference")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var formReferenceCompDiv = $(this.tpl).siblings("#form-reference");
			formReferenceCompDiv.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || formReferenceCompDiv.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (formReferenceCompDiv.find(".field-description").text(this.componentSetup.describe), formReferenceCompDiv.find(".field-description").show());
			formReferenceCompDiv.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", formReferenceCompDiv.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(formReferenceCompDiv.html())
		},
		renderEditor: function() {
			var editorReferenceDiv = $(this.tpl).siblings("#editor-reference");
			editorReferenceDiv.find("#component-title").attr("value", this.componentSetup.title);
			editorReferenceDiv.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", "true");
			editorReferenceDiv.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || editorReferenceDiv.find("#required").attr("checked", "true");
			editorReferenceDiv.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			editorReferenceDiv.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(editorReferenceDiv.html())
		},
		/**预览--渲染组件 */
		renderPreview: function(b, a, c) {
			var previewReferenceDiv = $(this.tpl).siblings("#preview-reference");
			previewReferenceDiv.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || previewReferenceDiv.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (previewReferenceDiv.find(".field-description").text(this.componentSetup.describe), previewReferenceDiv.find(".field-description").show());
			previewReferenceDiv.find(".check_js").addClass(this.componentSetup.size);
			previewReferenceDiv.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			previewReferenceDiv.find(".check_js").attr("cid", this.cid);
			previewReferenceDiv.attr("id", "field_" + this.componentSetup.fieldId);
			previewReferenceDiv.find(".check_js").data("componentData", this);
			a && previewReferenceDiv.find(".check_js").val("");
			previewReferenceDiv.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			"mobile" != window.systemInfo_form && previewReferenceDiv.find(".form-control").autosize();
			previewReferenceDiv.addClass(this.componentSetup.titleLayout);
			this.readOnly(previewReferenceDiv, c);
			this.el = b;
			b.append(previewReferenceDiv)
		},
		renderEditPreview: function(b) {
			var formReference = $(this.tpl).siblings("#form-reference");
			formReference.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || formReference.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (formReference.find(".field-description").text(this.componentSetup.describe), formReference.find(".field-description").show());
			formReference.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			formReference.attr("id", this.componentSetup.fieldId);
			formReference.data("componentData", this);
			formReference.addClass(this.componentSetup.titleLayout);
			b.append(formReference)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
			c = a.el || $(document);
			c.on("blur", "reference[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "reference[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
			c = {};
			c.element = b;
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (c.message = this.componentSetup.title + "不能为空");
			return c
		},
		getValue: function(b) {
		},
		setValue: function(b, a) {
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("reference[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Reference
});
/**
 * 超链接组件
 */
define("form/component/hyperlink", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var components = h("form/tplutil");
	window.Hyperlink = m.extend({
		initialize: function(b) {
			this.componentSetup = {
					componentKey: "Hyperlink",
					title: "超链接",
					titleLayout: "field-hoz",//控件设置属性--标题布局
					order: 0,
					index: 0,
					describe: "",            //控件设置属性--描述
					required: !1,            //控件设置属性--必填
					fieldId: "",             //组件id
					size: "medium"           //控件设置属性--控件大小
			};
			null != b && (this.componentSetup.title = b.title, 
					this.componentSetup.titleLayout = b.titleLayout, 
					this.componentSetup.describe = b.describe, 
					this.componentSetup.order = b.order, 
					this.componentSetup.index = b.index, 
					this.componentSetup.required = b.required, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.size = b.size);
			this.tpl = components.get("hyperlink")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var hyperlink = $(this.tpl).siblings("#form-hyperlink");
			hyperlink.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || hyperlink.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (hyperlink.find(".field-description").text(this.componentSetup.describe), hyperlink.find(".field-description").show());
			hyperlink.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", hyperlink.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(hyperlink.html())
		},
		renderEditor: function() {
			var editorHyperlink = $(this.tpl).siblings("#editor-hyperlink");
			editorHyperlink.find("#component-title").attr("value", this.componentSetup.title);
			editorHyperlink.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", "true");
			editorHyperlink.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || editorHyperlink.find("#required").attr("checked", "true");
			editorHyperlink.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			editorHyperlink.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(editorHyperlink.html())
		},
		renderPreview: function(b, a, c) {
			var pHyperlink = $(this.tpl).siblings("#preview-hyperlink");
			pHyperlink.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || pHyperlink.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (pHyperlink.find(".field-description").text(this.componentSetup.describe), pHyperlink.find(".field-description").show());
			pHyperlink.find(".check_js").addClass(this.componentSetup.size);
			pHyperlink.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			pHyperlink.find(".check_js").attr("cid", this.cid);
			pHyperlink.attr("id", "field_" + this.componentSetup.fieldId);
			pHyperlink.find(".check_js").data("componentData", this);
			a && pHyperlink.find(".check_js").val("");
			pHyperlink.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			"mobile" != window.systemInfo_form && pHyperlink.find(".form-control").autosize();
			pHyperlink.addClass(this.componentSetup.titleLayout);
			this.readOnly(pHyperlink, c);
			this.el = b;
			b.append(pHyperlink)
		},
		renderEditPreview: function(b) {
			var formHyperlink = $(this.tpl).siblings("#form-hyperlink");
			formHyperlink.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || formHyperlink.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (formHyperlink.find(".field-description").text(this.componentSetup.describe), formHyperlink.find(".field-description").show());
			formHyperlink.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			formHyperlink.attr("id", this.componentSetup.fieldId);
			formHyperlink.data("componentData", this);
			formHyperlink.addClass(this.componentSetup.titleLayout);
			b.append(formHyperlink)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
			c = a.el || $(document);
			c.on("blur", "reference[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "reference[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
			c = {};
			c.element = b;
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (c.message = this.componentSetup.title + "不能为空");
			return c
		},
		getValue: function(b) {
		},
		setValue: function(b, a) {
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("reference[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Hyperlink
});
/**
 * 密码组件
 */
define("form/component/password", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.Password = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "Password",
				title: "密码",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium"
			};
			null != a && (this.componentSetup.title = a.title,
					this.componentSetup.titleLayout = a.titleLayout, 
					this.componentSetup.describe = a.describe, 
					this.componentSetup.order = a.order, 
					this.componentSetup.index = a.index, 
					this.componentSetup.required = a.required,
					this.componentSetup.fieldId = a.fieldId, 
					this.componentSetup.size = a.size, 
					this.componentSetup.type = a.type, 
					this.componentSetup.tempId = a.tempId || a.fieldId);
			this.componentSetup = $.extend({}, this.componentSetup, a);
			this.tpl = l.get("password");
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setType: function(a) {
			this.componentSetup.type = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var b = this,
				formPassword = $(this.tpl).siblings("#form-password");
			formPassword.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || formPassword.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (formPassword.find(".field-description").text(this.componentSetup.describe), formPassword.find(".field-description").show());
			formPassword.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("class", formPassword.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.html(formPassword.html())
		},
		renderEditor: function() {
			var editPassword = $(this.tpl).siblings("#editor-password");
			editPassword.find("#component-title").attr("value", this.componentSetup.title);
			editPassword.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			editPassword.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || editPassword.find("#required").attr("checked", "true");
			editPassword.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(editPassword.html())
		},
		renderPreview: function(a, b, d) {
			var previewPassword = $(this.tpl).siblings("#preview-password");
			previewPassword.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || previewPassword.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (previewPassword.find(".field-description").text(this.componentSetup.describe), previewPassword.find(".field-description").show());
			previewPassword.find(".check_js").addClass(this.componentSetup.size);
			previewPassword.find(".check_js").attr("id", this.componentSetup.fieldId || this.componentSetup.tempId).attr("name", this.componentSetup.fieldId);
			previewPassword.find(".check_js").attr("cid", this.cid);
			previewPassword.attr("id", "field_" + (this.componentSetup.fieldId || this.componentSetup.tempId));
			previewPassword.attr("tempId", "field_" + this.componentSetup.fieldId);
			previewPassword.attr("fieldid", this.componentSetup.fieldId || this.componentSetup.tempId);
			previewPassword.find(".check_js").data("componentData", this);
			previewPassword.data("componentData", this);
			b && previewPassword.find(".check_js").val("");
			previewPassword.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			previewPassword.addClass(this.componentSetup.titleLayout);
			this.readOnly(previewPassword, d);
			this.el = a;
			a.append(previewPassword)
		},
		renderEditPreview: function(a) {
			var b = $(this.tpl).siblings("#form-password");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.find(".form-control").addClass(this.componentSetup.size);
			b.find(".form-amountbox .money_type_js").text("(" + this.componentSetup.type + ")");
			b.attr("id", this.componentSetup.fieldId);
			b.attr("tempId", this.componentSetup.fieldId);
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			a.append(b)
		},
		submitCheck: function(a, b) {
			var d = this.check(a);
			b(d)
		},
		checkEvents: function(b) {
			
		},
		check: function(a) {
			var b = $.trim(a.val()),
				d = a.attr("placeholder"),
				e = {};
			e.element = a;
			b == d && (b = "");
			"" != b || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			return e
		},
		empty: function(a) {
			a.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(a, b) {
			var d = a.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", b);
			b ? (d.hide(), d.siblings(".j_readOnly").removeClass("hide")) : (d.show(), d.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Password
});
/**
 * 百分比组件
 */
define("form/component/precent", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.Precent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Precent",
				title: "百分比",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium",
				type:"%"
			};
			null != b && (this.componentSetup.title = b.title, 
					this.componentSetup.titleLayout = b.titleLayout,
					this.componentSetup.describe = b.describe, 
					this.componentSetup.order = b.order, 
					this.componentSetup.index = b.index, 
					this.componentSetup.required = b.required, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.type = b.type);
			this.tpl = l.get("precent")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var formPrecent = $(this.tpl).siblings("#form-precent");
			formPrecent.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || formPrecent.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (formPrecent.find(".field-description").text(this.componentSetup.describe), formPrecent.find(".field-description").show());
			formPrecent.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			formPrecent.find(".form-amountbox .precent_type_js").text("(" + this.componentSetup.type + ")");
			b.attr("class", formPrecent.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(formPrecent.html())
		},
		/** 渲染右侧属性**/
		renderEditor: function() {
			var editorPrecent = $(this.tpl).siblings("#editor-precent");
			editorPrecent.find("#component-title").attr("value", this.componentSetup.title);
			editorPrecent.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			editorPrecent.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || editorPrecent.find("#required").attr("checked", "true");
			editorPrecent.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(editorPrecent.html())
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-precent");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").addClass(this.componentSetup.size);
			d.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			c && d.find(".check_js").prop("readOnly", !0);
			a && d.find(".check_js").val("");
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			d.addClass(this.componentSetup.titleLayout);
			this.readOnly(d, c);
			this.el = b;
			b.append(d)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-precent");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			a.find(".form-amountbox .precent_type_js").text("(" + this.componentSetup.type + ")");
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").addClass(this.componentSetup.size);
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-precent");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			c.on("blur", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
				c = b.attr("placeholder"),
				d = {};
			d.element = b;
			a == c && (a = "");
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			"" == a || this.precent(a) || (d.message = this.componentSetup.title + "格式有误，请输入有效的百分比");
			return d
		},
		/** 判断百分比格式 **/
		precent: function(b) {
			var a = !1;
			if(b<0){
				return !1;
			}else{
				return !0;
			}
		},
		getValue: function(b) {
			var a = $.trim(b.val());
			b = b.attr("placeholder");
			var c = this.oldValue,
				d = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: a
				};
			this.oldValue = a;
			return c && 0 < c.length || "" != a && a != b && this.mobile(a) ? d : null
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content;
				b.find("#" + this.componentSetup.fieldId).val(c);
				b.find(".j_readOnly").html(c);
				this.oldValue = c
			}
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("readOnly", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Precent
});
define("form/component/select", ["form/component", "form/tplutil", "form/component/option"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = h("form/component/option");
	window.Select = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "Select",
				title: "下拉菜单",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium",
				options: []
			};
			var c = new b;
			c.setName("选项1");
			c.setOrder(0);
			var d = new b;
			d.setName("选项2");
			d.setOrder(1);
			var e = new b;
			e.setName("选项3");
			e.setOrder(2);
			this.componentSetup.options[0] = c.componentSetup;
			this.componentSetup.options[1] = d.componentSetup;
			this.componentSetup.options[2] = e.componentSetup;
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.size = a.size, this.componentSetup.options = a.options);
			this.tpl = l.get("select")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setOptions: function(a) {
			this.componentSetup.options = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-select");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			for (var d = c.find(".choicelist_js"), e = 0; e < this.componentSetup.options.length; e++)(new b(this.componentSetup.options[e])).render(d, this);
			c.find(".choicelist_js").addClass(this.componentSetup.size);
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-select");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			a.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			a.find("input:radio[name='layout'][value='choicelist-" + this.componentSetup.layout + "']").attr("checked", "true");
			for (var c = a.find("ul.choicelistEdit_js"), d = 0; d < this.componentSetup.options.length; d++) {
				var e = this.componentSetup.options[d];
				(new b(e)).renderEditor(c, this);
				"true" != e.other && 1 != e.other || a.find(".btn-default_js").parent().hide()
			}
			a.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(a.html())
		},
		change: function(a) {
			var c = a.oldObj;
			a = a.changeEl;
			this.componentSetup.title = c.componentSetup.title;
			this.componentSetup.describe = c.componentSetup.describe;
			this.componentSetup.order = c.componentSetup.order;
			this.componentSetup.index = c.componentSetup.index;
			this.componentSetup.required = c.componentSetup.required;
			this.componentSetup.fieldId = c.componentSetup.fieldId;
			this.componentSetup.options = c.componentSetup.options;
			this.render(a);
			this.renderEditor();
			a.addClass("field-active")
		},
		renderPreview: function(a, c, d) {
			var e = $(this.tpl).siblings("#preview-select");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			e.find(".check_js").attr("cid", this.cid);
			e.attr("id", "field_" + this.componentSetup.fieldId);
			for (var f = e.find(".choicelist_js"), g = 0; g < this.componentSetup.options.length; g++)(new b(this.componentSetup.options[g])).renderPreview(f, this);
			e.find(".check_js").data("componentData", this);
			d && (e.find(".check_js").prop("disabled", !0), e.find(".check_js").siblings("input:text").prop("disabled", !0));
			c && e.find(".check_js").val("");
			e.find(".choicelist_js").addClass(this.componentSetup.size);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, d);
			this.isReadOnly = d;
			this.el = a;
			a.append(e)
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-select").clone();
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			c.attr("id", "field_" + this.componentSetup.fieldId);
			for (var d = c.find(".choicelist_js"), e = 0; e < this.componentSetup.options.length; e++)(new b(this.componentSetup.options[e])).renderPreview(d, this);
			c.find(".choicelist_js").addClass(this.componentSetup.size);
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		renderStatSearch: function(a) {
			var c = a.parentEl;
			$.ajax({
				type: "get",
				url: "/formdatastat/getFiledOptions.json",
				dataType: "json",
				data: {
					fieldId: a.fieldId
				},
				success: function(a) {
					html = '<select class="form-control sch-item j_fieldOption"><option value="eq">等于</option><option value="neq">不等于</option></select>';
					for (var b = '<select class="form-control j_resultList"><option>请选择</option>', f = 0; f < a.fieldOptions.length; f++)
					var g = a.fieldOptions[f],
						b = b + ("<option id=" + g.id + ">" + g.name + "</option>");
					html += b + '</select><div class="j_selected entity-container sch-item"></div><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a>';
					c.attr("class", "sch-group j_formFieldSearchGroup");
					c.find(".j_formField-condition").html(html)
				}
			})
		},
		submitCheck: function(a, c) {
			var b = this.check(a);
			c(b)
		},
		checkEvents: function(a) {
			var c = this,
				b = c.el || $(document);
			b.on("change", "select[id='" + c.componentSetup.fieldId + "'][cid='" + c.cid + "']", function() {
				var b = $(this).find("option:selected");
				$(this).attr("id", c.componentSetup.fieldId);
				b = b.data("componentData");
				"true" == b.componentSetup.other || 1 == b.componentSetup.other ? $(this).siblings("input:text").attr("disabled", !1).show() : $(this).siblings("input:text").attr("disabled", !0).hide();
				b = c.check($(this));
				a(b);
				null == b.message && c.saveComponentValue($(this))
			});
			b.on("change", "select[id='" + c.componentSetup.fieldId + "'][cid='" + c.cid + "']+input:text", function() {
				var a = $(this).val();
				null != a && "" != $.trim(a) && c.saveComponentValue($(this))
			})
		},
		check: function(a) {
			var c = a.val(),
				b = {};
			b.element = a;
			"" != c && null != c || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (b.message = this.componentSetup.title + "不能为空");
			return b
		},
		getValue: function(a) {
			if (!this.oldValue) {
				for (var b = 0; this.componentSetup.options.length > b; b++) {
					var d = this.componentSetup.options[b];
					if ("true" == d.defOption || 1 == d.defOption) this.oldValue = d.name
				}
				this.oldValue || (this.oldValue = this.componentSetup.options[0].name)
			}
			var b = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			},
				e = a.val(),
				d = a.find("option:selected"),
				d = d.data("componentData"),
				f = "";
			"true" == d.componentSetup.other || 1 == d.componentSetup.other ? (f = a.siblings("input:text").val(), 0 == f.length && (f = "其他")) : f = d.componentSetup.name;
			b.dataOptions = [{
				optionId: e,
				content: f
			}];
			this.oldValue = f;
			return null == e || "" == $.trim(e) ? null : b
		},
		setValue: function(a, b) {
			if (null != b && null != b.dataOptions) {
				for (var d = 0; d < b.dataOptions.length; d++) {
					var e = b.dataOptions[d],
						f = e.optionId,
						e = e.content;
					a.find("select#" + this.componentSetup.fieldId).val(f);
					a.find(".j_readOnly").html(e);
					f = a.find("[value=" + f + "]").data("componentData").componentSetup.other;
					if ("true" == f || 1 == f) a.find("input:text").val(e), this.isReadOnly || a.find("input:text").show()
				}
				this.oldValue = a.find(".j_readOnly").text()
			}
		},
		empty: function(a) {},
		readOnly: function(a, b) {
			a.find("select[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", b);
			b ? (a.find(".check_js").addClass("hide"), a.find(".j_readOnly").removeClass("hide")) : (a.find(".check_js").removeClass("hide"), a.find(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Select
});
define("form/component/dividingline", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.DividingLine = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "DividingLine",
				type: "solid",
				color: "#000000",
				order: 0,
				index: 0
			};
			null != b && (this.componentSetup.type = b.type, this.componentSetup.color = b.color, this.componentSetup.order = b.order, this.componentSetup.index = b.index);
			this.tpl = l.get("dividingline")
		},
		setType: function(b) {
			this.componentSetup.type = b
		},
		setColor: function(b) {
			this.componentSetup.color = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-dividingline");
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-dividingline"),
				a = this.componentSetup.type;
			"soliddouble" == a ? a = "solid-double" : "thicksoliddouble" == a && (a = "thicksolid-double");
			b.find("input:radio[name='dividingLineType'][value='" + a + "']").attr("checked", "true");
			$("#editor-component").html(b.html());
			$("#editor-component").find(".color-box").colpick({
				flat: !0,
				layout: "hex",
				color: this.componentSetup.color,
				submit: 0,
				onChange: function(a, b, e, f) {
					$("#widget-control .field-active .divider-line").css("border-color", "#" + b);
					$("#widget-control .field-active").data("componentData").setColor("#" + b)
				}
			})
		},
		renderPreview: function(b) {
			var a = $(this.tpl).siblings("#preview-dividingline");
			a.find(".divider-line").css("border-color", this.componentSetup.color);
			a.find(".divider-line").attr("class", "divider-line " + this.componentSetup.type);
			b.append(a)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-dividingline");
			a.find(".divider-line").css("border-color", this.componentSetup.color);
			var c = this.componentSetup.type;
			"soliddouble" == c ? c = "solid-double" : "thicksoliddouble" == c && (c = "thicksolid-double");
			a.find(".divider-line").attr("class", "divider-line " + c);
			a.data("componentData", this);
			b.append(a)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {}
	});
	n.exports = window.DividingLine
});
define("form/component/tablecomponent", ["form/component", "form/tplutil", "bootstrap-paginator"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	h("plugins/bootstrap-paginator");
	window.TableComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "TableComponent",
				title: "表格",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				fieldId: "",
				dataSetIds: {}
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.fieldId = b.fieldId, _.isObject(b.dataSetIds) ? this.componentSetup.dataSetIds = b.dataSetIds : this.componentSetup.dataSetIds = JSON.parse(b.dataSetIds));
			this.tpl = l.get("table");
			this.isAdmin = TEAMS.currentUser.admin
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		setDataSetId: function(b) {
			this.componentSetup.dataSetId = b
		},
		addDataSet: function(b, a) {
			var c = _.keys(this.componentSetup.dataSetIds),
				d = {};
			_.contains(c, b) || (d.id = b, d.title = a, this.componentSetup.dataSetIds[b] = d)
		},
		removeDataSet: function(b) {
			var a = _.keys(this.componentSetup.dataSetIds);
			_.contains(a, b) && delete this.componentSetup.dataSetIds[b]
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-table");
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {
			var b = this,
				a;
			b.statFields ? b.renderEditorValue() : this.componentmodel.getFormTableSelectFields(function(c) {
				c.formFields = [];
				c.listStats = [];
				a = $(_.template(b.tpl, c)).siblings("#editor-table");
				b.statFields = c;
				b.el = a;
				b.renderEditorValue()
			})
		},
		renderEditorValue: function() {
			var b = this.el,
				a = _.keys(this.componentSetup.dataSetIds);
			b.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(b.html());
			var c = $(".j_datasource");
			$.each(this.statFields.tablestatfields, function() {
				var a = c.find("li:first").clone().show();
				a.find(".table_field").val(this.fieldId).attr("title", this.title);
				a.find("span").text(this.title);
				c.append(a)
			});
			for (var d = 0, e = a.length; d < e; d++)
			b = $("#editor-component").find("input[value='" + a[d] + "']"), b.prop("checked", !0)
		},
		renderPreview: function(b, a, c) {
			var d = this,
				e = {},
				f = $(this.tpl).siblings("#preview-table");
			f.find(".panel-heading").html(this.componentSetup.title);
			b.append(f);
			this.viewcon = f;
			e.fieldIds = _.keys(this.componentSetup.dataSetIds).join(",");
			e.pageNo = 1;
			e.pageSize = 10;
			this.componentmodel.getTablePageData(e, function(a) {
				a = {
					currentPage: a.pageDatas.pageNo,
					totalPages: a.pageDatas.totalPages,
					onPageClicked: function(a, b, c, f) {
						e.pageNo = f;
						d.renderTableView(e)
					}
				};
				f.find(".pageNav").bootstrapPaginator(a);
				d.renderTableView(e)
			})
		},
		renderTableView: function(b) {
			var a = this;
			table = $(a.tpl).siblings("#formDatas");
			a.viewcon.find(".tablecontent").html("").append(table);
			var c = a.viewcon;
			this.componentmodel.getTablePageData(b, function(b) {
				pageNo = b.pageNo;
				1 == pageNo && ($(c).find("#stat_table tbody").html(), $(c).find("#stat_table tbody").empty());
				var e = b.formFields,
					f = b.formDatas,
					g = b.listStats;
				a.formFields = e;
				if (null == e || 0 == e.length) $(c).find("#formDatas").html('<div class="formstat-noresult">当前表单没有任何字段！</div>');
				else {
					if (0 == $(c).find("#stat_table thead tr th").length) for (b = 0; b < e.length; b++) {
						var k = e[b];
						$(c).find("#stat_table thead tr").append("<th title='" + k.title + "'><div>" + k.title + "</div></th>");
						var p = "",
							h = "";
						if ("Money" == k.componentKey || "NumberComponent" == k.componentKey) p = "ta-r";
						"Money" == k.componentKey && (h = "Money");
						$(c).find("#stat_table tfoot tr").append("<td id='tfoot_" + k.id + "' class='" + p + "' type='" + h + "'></td>")
					}
					if (null == f || 0 == f.length) $(c).find("#statbody #data_message").html("暂无数据...").show();
					else {
						$(c).find("#statbody #data_message").hide();
						h = {};
						if (g) for (b = 0; b < g.length; b++) {
							var l = g[b],
								p = l.FORM_DATA + "_" + l.DATA_INDEX;
							h[p] = l
						}
						for (b = 0; b < f.length; b++) {
							var g = f[b],
								l = g.maxIndex || 1,
								n = g.id;
							if (!(0 < $(" stat_table tr #" + n).length)) for (var r = 0; r < l; r++) {
								var p = n + "_" + (r + 1),
									m = h[p],
									v = $("<tr id=" + n + "></tr>");
								Date.create(g.flowCreateTime);
								for (var A = 0; A < e.length; A++) {
									var k = e[A],
										x = k.id,
										B = k.componentKey,
										y = "";
									m && (y = m["C_" + x] || "");
									var C = "noSub_" + n + "_" + x;
									k.subForm && (C = "");
									p = "";
									if ("Money" == B || "NumberComponent" == B) p = "ta-r";
									k = n + "_" + (r + 1) + "_" + x;
									try {
										var z = JSON.parse(y);
										ocount = "";
										if (0 < z.length && null != z[0].optionId) {
											for (x = 0; x < z.length; x++)
											option = z[x], ocount += option.content + ",";
											y = ocount.substring(0, ocount.length - 1)
										}
									} catch (D) {}
									v.append("<td id=" + k + " class='" + C + " " + p + "' title='" + y + "'>" + y + "</td>")
								}
								$(c).find("#stat_table tbody").append(v)
							}
						}
						a.mergerCells(e, f)
					}
				}
			})
		},
		mergerCells: function(b, a) {
			if (b && a) for (var c = this.viewcon, d = 0; d < a.length; d++) {
				var e = a[d],
					f = e.maxIndex || 1,
					e = e.id;
				this.isAdmin && ($(c).find("#stat_table .noSub_flowCheck_" + e + ":eq(0)").attr("rowspan", f), $(c).find("#stat_table .noSub_flowCheck_" + e + ":gt(0)").remove());
				for (var g = 0; g < b.length; g++) {
					var k = b[g];
					k.subForm || (k = k.id, $(c).find("#stat_table .noSub_" + e + "_" + k + ":eq(0)").attr("rowspan", f), $(c).find("#stat_table .noSub_" + e + "_" + k + ":gt(0)").remove())
				}
			}
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-table");
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {},
		check: function(b) {},
		getValue: function(b) {},
		setValue: function(b, a) {},
		empty: function(b) {},
		readOnly: function(b, a) {}
	});
	n.exports = window.TableComponent
});
define("form/component/numberstatcomponent", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.NumberStatComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "NumberStatComponent",
				title: "标题",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				fieldId: "",
				dataSetId: "",
				stattype: "sum"
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.fieldId = b.fieldId, this.componentSetup.dataSetId = b.dataSetId, this.componentSetup.stattype = b.stattype);
			this.tpl = l.get("numberstat")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		setDataSetId: function(b) {
			this.componentSetup.dataSetId = b
		},
		setStatType: function(b) {
			this.componentSetup.stattype = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-numberstat");
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {
			var b = this,
				a;
			b.statFields ? b.renderEditorValue() : this.componentmodel.getFormNumberSelectFields(function(c) {
				a = $(_.template(b.tpl, c)).siblings("#editor-numberstat");
				b.statFields = c;
				null != c.numberStatfields && 0 < c.numberStatfields.length && (b.componentSetup.dataSetId = c.numberStatfields[0].fieldId);
				b.el = a;
				b.renderEditorValue()
			})
		},
		renderEditorValue: function() {
			var b = this.el;
			b.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(b.html());
			var a = $("#component-dataset");
			$.each(this.statFields.numberStatfields, function() {
				var b = a.find("option:first").clone().show();
				b.val(this.fieldId).text(this.title);
				a.append(b)
			});
			$("#editor-component").find("#component-dataset").val(this.componentSetup.dataSetId);
			$("#editor-component").find("#component-stattype").val(this.componentSetup.stattype)
		},
		renderPreview: function(b, a, c) {
			var d = this;
			a = $(this.tpl).siblings("#preview-numberstat");
			b.append(a);
			this.viewcon = a;
			this.componentSetup.dataSetId ? (this.viewcon.find(".widget-title_js").html(this.componentSetup.title), this.componentmodel.getNumberFieldStatData(this, function(a) {
				d.viewcon.find(".statdata").html(a.numberData || 0)
			})) : (this.viewcon.find(".widget-title_js").html(this.componentSetup.title), this.viewcon.find(".statdata").html("无数字字段"))
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-numberstat");
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-text");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {},
		check: function(b) {},
		getValue: function(b) {},
		setValue: function(b, a) {},
		empty: function(b) {},
		readOnly: function(b, a) {}
	});
	n.exports = window.NumberStatComponent
});
define("form/component/imagecomponent", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.ImageComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "ImageComponent",
				title: "图片",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				isSingle: !1,
				fieldId: ""
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.isSingle = b.isSingle, this.componentSetup.fieldId = b.fieldId);
			this.tpl = l.get("image")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSingle: function(b) {
			this.componentSetup.isSingle = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-image");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-image");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || b.find("#isSingle").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			b.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		renderPreview: function(b, a, c) {
			a = $(this.tpl);
			var d = null,
				d = null == TEAMS.currentUser ? a.siblings("#nouser-preview") : "mobile" != window.systemInfo_form ? a.siblings("#preview-image") : a.siblings("#mobile-preview");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").attr("id", this.componentSetup.fieldId + this.cid);
			d.find(".check_js").prev().attr("id", "imageAdd" + this.componentSetup.fieldId + this.cid);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			d.addClass(this.componentSetup.titleLayout);
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			this.el = b;
			b.append(d);
			if ("true" == c || 1 == c || c) d.find("#imageAdd" + this.componentSetup.fieldId + this.cid).remove(), this.isReadOnly = c, "mobile" == window.systemInfo_form && d.find("#" + this.componentSetup.fieldId + this.cid).attr("readOnly", "readOnly");
			this.initFancyBox($("#" + this.componentSetup.fieldId + this.cid))
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-image");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document),
				d = a.componentSetup.fieldId + this.cid;
			a.isReadOnly && "false" != a.isReadOnly && 0 != a.isReadOnly || "mobile" == window.systemInfo_form || a.initUploader(b);
			c.on("click", "#" + d + " .j_deleteImage", function() {
				var c = $(this).parents("#" + d);
				$(this).parents(".check_js").prev().find(".j_imageAdd").show();
				a.deleteImage($(this), b);
				c = a.check(c);
				null == c.message ? a.saveComponentValue($(this)) : b(c)
			});
			"mobile" == window.systemInfo_form && ($("#imageAdd" + a.componentSetup.fieldId + a.cid).on("input change propertychange paste", function(b) {
				var c = $(this),
					d = 1 == a.componentSetup.isSingle || "true" == a.componentSetup.isSingle;
				if (b = $(this).find("#formFileToUpload").get(0).files[0]) {
					var k = 0,
						k = 1048576 < b.size ? (Math.round(100 * b.size / 1048576) / 100).toString() + "MB" : (Math.round(100 * b.size / 1024) / 100).toString() + "KB";
					b.size = k;
					b = $('<div class="info-subitem attachment"><a id="' + b.id + '">' + b.name + '<i class="ml-3 c-grey"></i></a></div>');
					$(this).next().append(b)
				}
				b = new FormData;
				b.append("data", $(this).find("#formFileToUpload").get(0).files[0]);
				k = new XMLHttpRequest;
				k.upload.addEventListener("progress", function(b) {
					b.lengthComputable && (b = Math.round(100 * b.loaded / b.total), $("#" + a.componentSetup.fieldId + a.cid + " i").html(b.toString() + "%"))
				}, !1);
				k.addEventListener("load", function(b) {
					var e = jQuery.parseJSON(b.target.responseText),
						k = e.fileObj;
					b = k.name;
					"true" == k.image || 1 == k.image ? (e = e.imageFile.id, e = $('<div id="' + e + '" imageid="' + e + '" class="img-item j_imageItem"><img src="/base/download/img/' + e + '/small" class="j_imageView"></div>'), e.data("name", b), $("#" + a.componentSetup.fieldId + a.cid).append(e), d && c.hide(), formPlugin.notify("文件上传成功")) : formPlugin.notify("文件格式不正确");
					$("#" + a.componentSetup.fieldId + a.cid).find(".info-subitem").remove()
				}, !1);
				k.addEventListener("error", function(a) {
					formPlugin.notify("文件上传失败")
				}, !1);
				k.open("POST", "/formdata/uploadImage.json?module=form");
				k.send(b)
			}), $("#" + a.componentSetup.fieldId + a.cid).on("tap", ".j_imageView", function(b) {
				var c = $(a.tpl),
					d = $(this).parents(".j_page-view"),
					k = $(this).parent().attr("imageid");
				b = $(this).parents(".check_js").attr("readonly");
				c = c.siblings("#form-mobleImageView");
				b && c.find("#formImageDelete").remove();
				c.find(".j_imagePreview").attr("id", k).html('<img src="/base/download/img/' + k + '/image">');
				$("body").append(c);
				$(".j_imageViewBack").on("click", function() {
					$(this).parents(".j_page-view").remove();
					d.removeClass("hide")
				});
				$("#formImageDelete").on("tap", function(a) {
					var b = $(this),
						c = $('div[imageid="' + k + '"]');
					formPlugin.confirm("确定要删除吗？", function(a) {
						a && (c.parent().prev().show(), c.remove(), b.parents(".j_page-view").remove(), d.removeClass("hide"), formPlugin.notify("数据已删除"))
					})
				});
				d.addClass("hide")
			}))
		},
		check: function(b) {
			var a = $(b).find(".j_imageItem"),
				c = a.length,
				d = {};
			d.element = b;
			0 != c || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			a.each(function(a) {
				$(this).attr("id") || (d.message = "图片尚未上传至服务器，请耐心等待")
			});
			return d
		},
		getValue: function(b) {
			var a = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			};
			b = b.find(".j_imageItem");
			if (0 < b.length) {
				var c = [],
					d = "";
				b.each(function(a) {
					var b = $(this).attr("imageid"),
						g = $(this).data("name");
					d += g + ",";
					c[a] = {
						optionId: b,
						content: g,
						type: "imageFile"
					}
				});
				a.dataOptions = c;
				0 != c.length && (this.oldValue = d.substring(0, d.length - 1))
			} else a = null;
			return a
		},
		setValue: function(b, a) {
			if (null != a && null != a.dataOptions) {
				for (var c = "", d = 0; d < a.dataOptions.length; d++) {
					var e = a.dataOptions[d],
						f = null == e.content ? "" : e.content,
						e = e.optionId,
						g = null,
						c = c + (f + ",");
					"mobile" != window.systemInfo_form ? (g = $('<div id="' + e + '" imageid="' + e + '" class="img-item j_imageItem"><div class="img-box"><a class="fancybox-button" rel="fancybox-button" type="image" href="/base/download/img/' + e + '/image"><img src="/base/download/img/' + e + '/small"></div><div class="img-opt"><a><i class="icon-minus-sign j_deleteImage"></i></a></div></div>'), g.data("name", f), null == b.find(".j_imageAdd").get(0) && g.find(".j_deleteImage").parent().remove()) : g = $('<div imageid="' + e + '" id="' + this.componentSetup.fieldId + '" class="img-item j_imageItem"><img src="/base/download/img/' + e + '/small" class="j_imageView"></div>');
					b.find(".check_js").append(g)
				}
				"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || null == $("#" + this.componentSetup.fieldId + this.cid + " .j_imageItem").get(0) || $("#imageAdd" + this.componentSetup.fieldId + this.cid).find(".j_imageAdd").hide();
				this.oldValue = "";
				0 != a.dataOptions.length && (this.oldValue = c.substring(0, c.length - 1))
			}
		},
		empty: function(b) {
			b.find(".j_imageItem").remove()
		},
		readOnly: function(b, a) {
			var c = b.find("#imageAdd" + this.componentSetup.fieldId + this.cid),
				d = b.find("#" + this.componentSetup.fieldId + this.cid);
			a && (c.remove(), d.find(".j_imageItem .j_deleteImage").parent().html(""))
		},
		initUploader: function(b) {
			if (null != TEAMS.currentUser) {
				var a = this,
					c = "#imageAdd" + this.componentSetup.fieldId + this.cid + " .j_imageAdd",
					d = "#" + this.componentSetup.fieldId + this.cid,
					e = 1 == a.componentSetup.isSingle || "true" == a.componentSetup.isSingle,
					f = this.uploader = new plupload.Uploader({
						runtimes: "html5,flash",
						file_data_name: "data",
						browse_button: c,
						container: $(d).parents("#field_" + this.componentSetup.fieldId),
						max_file_size: "50M",
						url: "/formdata/uploadImage.json?module=form",
						flash_swf_url: "/static/swf/plupload.swf"
					});
				f.init();
				f.bind("FilesAdded", function(a, b) {
					e && (1 < b.length || null != $(d).find(".j_imageItem").get(0)) ? ($.each(b, function(b, c) {
						a.removeFile(c)
					}), formPlugin.notify("此控件仅能上传一张图片", "图片数过多", "error")) : ($.each(b, function(a, b) {
						plupload.formatSize(b.size)
					}), a.refresh(), a.start())
				});
				f.bind("UploadProgress", function(a, b) {
					$("#" + b.id + " i").html(b.percent + "%")
				});
				f.bind("Error", function(a, b) {
					-600 == b.code && formPlugin.notify("只能上传最大不超过50M的文件", "文件大小超过限制", "error");
					a.refresh()
				});
				f.bind("FileUploaded", function(g, k, p) {
					k = jQuery.parseJSON(p.response);
					p = k.fileObj;
					g = p.name;
					p = p.image;
					"true" == p || 1 == p ? (k = k.imageFile.id, k = $('<div id="' + k + '" imageid="' + k + '" class="img-item j_imageItem"><div class="img-box"><a class="fancybox-button" rel="fancybox-button" type="image" href="/base/download/img/' + k + '/image"><img src="/base/download/img/' + k + '/small"></div><div class="img-opt"><a><i class="icon-minus-sign j_deleteImage"></i><a></div></div>'), k.data("name", g), $(d).append(k), a.saveComponentValue($(d)), g = a.check($(d)), b(g), e && ($(c).hide(), f.destroy()), formPlugin.notify("图片上传成功"), a.initFancyBox($(d))) : formPlugin.notify("请上传图片文件", "文件格式不正确", "error")
				})
			}
		},
		deleteImage: function(b, a) {
			var c = b.parents(".j_imageItem");
			if ("true" == this.componentSetup.isSingle || 1 == this.componentSetup.isSingle) c.parent().prev().find(".j_imageAdd").show(), this.initUploader(a);
			c.remove()
		},
		initFancyBox: function(b) {
			b.find(".fancybox-button").fancybox({
				nextEffect: "fade",
				prevEffect: "fade",
				closeBtn: !0,
				afterLoad: function() {
					this.title = "Image " + (this.index + 1) + " of " + this.group.length + (this.title ? " - " + this.title : "")
				}
			})
		}
	});
	n.exports = window.ImageComponent
});
define("form/component/employee", ["form/component", "form/tplutil", "form/component/userselecter"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = h("form/component/userselecter");
	window.Employee = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "Employee",
				title: "添加人员",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				isUnique: !1,
				isCurrentEmployee: !1,
				isReadonly: !1
			};
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.isUnique = a.isUnique, this.componentSetup.isCurrentEmployee = a.isCurrentEmployee, this.componentSetup.isReadonly = a.isReadonly);
			this.tpl = l.get("employee")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setIsUnique: function(a) {
			this.componentSetup.isUnique = a
		},
		setIsCurrentEmployee: function(a) {
			this.componentSetup.isCurrentEmployee = a
		},
		setIsReadonly: function(a) {
			this.componentSetup.isReadonly = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var b = $(this.tpl).siblings("#form-employee");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			a.attr("class", b.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.html(b.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-employee");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			var b = !1,
				d = !1,
				e = !1;
			if ("true" == this.componentSetup.isUnique || 1 == this.componentSetup.isUnique) b = !0;
			if ("true" == this.componentSetup.isCurrentEmployee || 1 == this.componentSetup.isCurrentEmployee) d = !0, a.find(".employee_readonly_js").show();
			if ("true" == this.componentSetup.isReadonly || 1 == this.componentSetup.isReadonly) e = !0;
			a.find("#isUnique").attr("checked", b);
			a.find("#isCurrentEmployee").attr("checked", d);
			a.find("#isReadonly").attr("checked", e);
			$("#editor-component").html(a.html())
		},
		renderPreview: function(a, b, d) {
			var e = $(this.tpl),
				f = null,
				f = null == TEAMS.currentUser ? e.siblings("#nouser-preview") : "mobile" != window.systemInfo_form ? e.siblings("#preview-employee") : e.siblings("#mobile-preview");
			f.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || f.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (f.find(".field-description").text(this.componentSetup.describe), f.find(".field-description").show());
			f.find(".check_js").attr("id", this.componentSetup.fieldId + this.cid).attr("name", this.componentSetup.fieldId);
			f.attr("id", "field_" + this.componentSetup.fieldId);
			f.find(".check_js").data("componentData", this);
			"mobile" == window.systemInfo_form && f.find(".entity-seleted").attr("id", this.componentSetup.fieldId);
			var g = this.componentSetup.isUnique,
				e = this.componentSetup.fieldId + this.cid,
				k = this.componentSetup.isReadonly;
			if ("true" == g || 1 == g)"mobile" != window.systemInfo_form ? f.find("#searchemployee").removeAttr("data-multi") : f.find(".js_useritem_container").attr("data-multi", "false");
			if ("true" == k || 1 == k || d)"mobile" != window.systemInfo_form ? this.readOnly(f, !0) : f.find(".js_useritem_container").removeClass("entity-seleted").text("");
			b || (b = "true" == this.componentSetup.isCurrentEmployee || 1 == this.componentSetup.isCurrentEmployee, this.initCurrentSystemUser(f.find("#" + e), b, k));
			f.addClass(this.componentSetup.titleLayout);
			this.el = a;
			a.append(f);
			this.getValue(f)
		},
		renderEditPreview: function(a) {
			var b = $(this.tpl).siblings("#form-employee");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.attr("id", this.componentSetup.fieldId);
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			a.append(b)
		},
		renderStatSearch: function(a) {
			var b = this,
				d = $(this.tpl).siblings("#statsearch-employee"),
				e = a.parentEl;
			a = a.container;
			var f = (new Date).getTime();
			d.find(".j_usercontainer").attr("id", "j_employee" + f);
			e.attr("class", "sch-group j_formFieldSearchGroup");
			e.find(".j_formField-condition").html(d);
			var g = $(a + " #j_employee" + f + " #typeahead-employee");
			window.typeahead && window.typeahead.init && window.typeahead.init({
				el: a + " #j_employee" + f + " #typeahead-employee",
				callback: function(a) {
					if (a && !$.isEmptyObject(a)) {
						var d = g.parents(".j_usercontainer").find(".j_selected");
						b.renderTypeheader(d, a)
					}
				}
			})
		},
		submitCheck: function(a, b) {
			var d = this.check(a, "submit");
			b(d)
		},
		checkEvents: function(a) {
			var c = this,
				d = c.el || $(document),
				e = c.componentSetup.fieldId + this.cid;
			(new this.employeeAhead({})).initAhead(e);
			var f = $("#" + e + " #searchemployee"),
				g = c.componentSetup.isUnique;
			if ("mobile" == window.systemInfo_form) d.on("click", "#" + e + " .employee-seleted", function(a) {
				if ($(this).attr("disabled")) utils.notify("没有权限");
				else {
					a = $(this).attr("data-module");
					var c = $(this).attr("data-targetId"),
						d = $(this).attr("data-multi"),
						e = $(this).attr("data-noempty") && "true" == $(this).attr("data-noempty") ? !0 : !1,
						f = $(this).parents(".j_page-view"),
						g = $(this).attr("data-title"),
						h = f.attr("id"),
						l = $(this);
					(new b).render("mb", {
						el: l,
						targetId: c,
						module: a,
						multi: d,
						preEl: "#" + h,
						noempty: e,
						title: g
					});
					f.addClass("hide");
					$("#employee-seleted").removeClass("hide")
				}
			});
			else f && 0 < f.size() && f.click(function() {
				var a = $("#" + e + " .js_useritem_container .js_form-userItem");
				$("#" + e + " .control-input").trigger("focusout", "tt");
				var c = [];
				a && 0 < a.length && a.each(function(a) {
					a = $(this).find(".usercard-toggle").attr("userid");
					var b = $(this).find(".usercard-toggle").text();
					c.push({
						username: b,
						id: a
					})
				});
				(new b).render("pc", {
					isMulti: "true" == g || 1 == g ? !1 : !0,
					users: c,
					target: f
				})
			});
			d.on("mouseenter.typeahead", "#" + e + " .typeahead-wrapper", function(a) {
				$(this).data("enter", !0)
			}).on("mouseleave.typeahead", "#" + e + " .typeahead-wrapper", function(a) {
				$(this).data("enter", !1)
			});
			d.on("click", "#" + e + " .control-btn", function(a) {
				a.stopPropagation();
				$(this).addClass("hide");
				$(this).prev(".typeahead-wrapper").removeClass("hide");
				$(this).prev(".typeahead-wrapper").find(".control-input").focus()
			});
			d.on("focusout", "#" + e + " .control-input", function(a, b) {
				var c = $(this).parents(".typeahead-wrapper");
				c.data("enter") && "tt" != b || (c.addClass("hide"), c.next(".control-btn").removeClass("hide"))
			});
			d.on("click.tt", "#" + e + " #searchList>p", function() {
				var a = $("#" + e);
				a.parents(".field_js").find(".form-error").text("");
				a.parents(".field_js").find(".form-error").hide();
				var b = $(this).data("obj"),
					d = b.id,
					b = '<span name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + d + ' class="usercard-toggle">' + b.username + '</a><a class="close js_deleteEmployee" title="删除">&times;</a></span>',
					f = c.componentSetup.isUnique,
					g = $("#" + e + " .js_useritem_container .js_form-userItem"),
					h = !0;
				"true" == f || 1 == f ? a.find(".js_useritem_container").empty() : g && g.each(function(a) {
					d == $(this).find(".usercard-toggle").attr("userid") && ($(this).remove(), h = !1)
				});
				a.find(".js_useritem_container").append(b);
				h && c.saveComponentValue($(this))
			});
			d.on("click", "#" + e + " .js_deleteEmployee", function() {
				var b = $(this).parents("#" + e);
				$(this).parent().remove();
				var d = c.check(b, "change");
				a(d);
				null == d.message && c.saveComponentValue(b)
			});
			d.on("confirmHandler", "#" + e + " #searchemployee", function(a, b) {
				var c = $("#" + e);
				c.parents(".field_js").find(".form-error").text("");
				c.parents(".field_js").find(".form-error").hide();
				c = $("#" + e + " .js_useritem_container").html("");
				if (0 < b.objs.length) {
					var d = b.objs,
						f;
					for (f in d) {
						var g = d[f],
							g = $('<span name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + g.id + ' class="usercard-toggle">' + g.username + '</a><a class="close js_deleteEmployee" title="删除">&times;</a></span>');
						c.append(g)
					}
				}
			});
			if ("mobile" == window.systemInfo_form) d.on("employeeComfirm", "#" + e, function(a, b) {
				var d = $("#" + e + " .js_useritem_container"),
					f = c.componentSetup.isUnique;
				d.text("");
				d.parents("#field_" + c.componentSetup.fieldId).find(".form-error").text("");
				"true" != f && 1 != f || d.empty();
				if (0 < b.objs.length) {
					var f = b.objs,
						g;
					for (g in f) {
						var h = f[g];
						if (h) {
							var l = $("<span data-id=" + h.id + ' name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + h.id + ' class="usercard-toggle">' + h.name + "，</a></span>");
							d.append(l)
						}
					}
				} else h = b.objs, l = $("<span data-id=" + h.id + ' name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + h.id + ' class="usercard-toggle">' + h.name + "，</a></span>"), 0 == h.length ? d.text("请选择人员") : d.append(l);
				d = $(this).find("span:last a").text();
				d = d.substring(0, d.indexOf("，"));
				$(this).find("span:last a").text(d)
			})
		},
		check: function(a, b) {
			var d = $(a).find('span[name="js_form-userItem"]').length,
				e = {};
			e.element = a;
			0 != d || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			return e
		},
		getValue: function(a) {
			var b = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			};
			a = a.find(".js_useritem_container .js_form-userItem");
			if (0 < a.length) {
				var d = [],
					e = "";
				a.each(function(a) {
					var b = $(this).find(".usercard-toggle").attr("userid"),
						c = $(this).find(".usercard-toggle").text();
					e += c + ",";
					d[a] = {
						optionId: b,
						content: c
					}
				});
				b.dataOptions = d;
				0 != d.length && (this.oldValue = e.substring(0, e.length - 1))
			} else b = null;
			return b
		},
		setValue: function(a, b) {
			a.find(".js_useritem_container").empty();
			if (null != b && null != b.dataOptions) {
				for (var d = "", e = 0; e < b.dataOptions.length; e++) {
					var f = b.dataOptions[e],
						g = null == f.content ? "" : f.content,
						f = f.optionId,
						d = d + (g + ",");
					null != a.find(".js_form-userItem-add").get(0) ? a.find(".js_useritem_container").append($('<span name="js_form-userItem" class="js_form-userItem employee-item" data-id=' + f + "><a userid=" + f + ' class="usercard-toggle">' + g + '</a><a class="close js_deleteEmployee" title="删除">&times;</a></span>')) : a.find(".js_useritem_container").append($('<span name="js_form-userItem" class="js_form-userItem employee-item" data-id=' + f + "><a userid=" + f + ' class="usercard-toggle">' + g + "</a></span>"))
				}
				this.oldValue = "";
				0 != b.dataOptions.length && (this.oldValue = d.substring(0, d.length - 1))
			}
		},
		empty: function(a) {
			a.find(".js_useritem_container").html("")
		},
		readOnly: function(a, b) {
			var d = this.componentSetup.fieldId + this.cid,
				e = a.find('div[id="' + d + '"] span[name="js_form-userItem-add"]'),
				f = a.find('div[id="' + d + '"] span[name="js_form-userItem"]'),
				g = a.find('div[id="' + d + '"] .js_deleteEmployee');
			b ? (e.remove(), g.remove()) : e && 0 != e.length && null != e || (e = $(this.tpl).siblings("#preview-employee").find('span[name="js_form-userItem-add"]'), a.find('div[id="' + d + '"]').find(".js_useritem_container").after(e), f.append('<a class="close js_deleteEmployee" title="删除">&times;</a>'))
		},
		getIdArray: function(a) {
			var b = [];
			a && a.each(function(a) {
				a = $(this).find(".usercard-toggle").attr("userid");
				b.push(a)
			});
			return b
		},
		initCurrentSystemUser: function(a, b, d) {
			b && $(document).trigger("currentUser", function(b) {
				var c = b.username;
				b = b.id;
				var g = a.find(".js_useritem_container"),
					k = $('<span name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + b + ' class="usercard-toggle">' + c + '</a><a class="close js_deleteEmployee" title="删除">&times;</a></span>');
				if ("true" == d || 1 == d) k = $('<span name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + b + ' class="usercard-toggle">' + c + "</a>");
				"mobile" == window.systemInfo_form && (g.text(""), k = $("<span data-id=" + b + ' name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + b + ' class="usercard-toggle">' + c + "</a>"));
				g.append(k)
			})
		},
		renderTypeheader: function(a, b) {
			if (b.length) for (var d = 0; d < b.length; d++) {
				var e = b[d],
					f = e.name,
					g = e.id;
				if (f && g) {
					var k = '<span class="entity-item"><a id=' + g + ">" + f + "</a></span>";
					a.find(".entity-item").each(function(a) {
						g == $(this).find("a").attr("id") && (k = null)
					});
					a.append(k)
				}
			} else f = b.name, g = b.id, f && g && (k = '<span class="entity-item"><a id=' + g + ">" + f + "</a></span>", a.find(".entity-item").each(function(a) {
				g == $(this).find("a").attr("id") && (k = null)
			}), a.append(k))
		},
		employeeAhead: m.extend({
			defaults: function() {
				this.suggestion = "";
				this.remote = "/search/suggestion.json";
				this.entity = "employee";
				this.tpl = l.get("employee")
			},
			initAhead: function(a) {
				this.defaults();
				this.fieldId = a;
				this.$continer = $("#" + this.fieldId);
				this._htmlEvents()
			},
			_htmlEvents: function() {
				var a = this,
					b = a.$continer,
					d = $("#" + a.fieldId + " #typeahead-form-employee");
				d.off("focus.tt").on("focus.tt", function(b) {
					a._search($(this))
				});
				d.off("click.tt").on("click.tt", function(a) {
					a.stopPropagation()
				});
				d.off("keyup.tt").on("keyup.tt", function(d) {
					d = d.which;
					13 == d ? b.find("#form-typeahead-div p.active").trigger("click.tt") : 27 == d ? a.hide() : 38 == d ? (d = $("#form-typeahead-div p.active"), 1 > d.length ? b.find("#form-typeahead-div p").last().addClass("active") : (d.removeClass("active"), (0 < d.prev().length ? d.prev() : b.find("#form-typeahead-div p").last()).addClass("active"))) : 40 == d ? (d = b.find("#form-typeahead-div p.active"), 1 > d.length ? b.find("#form-typeahead-div p").first().addClass("active") : (d.removeClass("active"), (0 < d.next().length ? d.next() : b.find("#form-typeahead-div p").first()).addClass("active"))) : a._search($(this))
				});
				b.find("#form-typeahead-div").off("mouseenter.tt", "p").on("mouseenter.tt", "p", function() {
					$(this).addClass("active");
					b.find("#form-typeahead-div p.active").removeClass("active")
				});
				b.off("click.tt", "#form-typeahead-div p").on("click.tt", "#form-typeahead-div p", function(a) {
					d.trigger("focusout", "tt")
				})
			},
			_search: function(a) {
				var b = this,
					d = b.$continer,
					e = $.trim(a.val());
				e == a.attr("placeholder") && (e = "");
				d.find("#form-typeahead-div #searchList").html("");
				d.find("#form-typeahead-div .loading_small").addClass(f).show();
				if (b.list && b.suggestion === e) b._loadList(b.list);
				else {
					var f = b.entity;
					a = b.remote;
					d = {};
					this.suggestion = e;
					d.keywords = e;
					d.searchType = b.entity;
					$.ajax({
						type: "get",
						url: a,
						dataType: "json",
						data: d,
						success: function(a) {
							a = a[f + "s"];
							b.list = a;
							b._loadList(a)
						}
					})
				}
			},
			_loadList: function(a) {
				var b = this.$continer;
				b.find("#form-typeahead-div .loading_small").hide();
				for (var d = 0, e = a.length; d < e; d++) {
					var f = a[d];
					f.name = f.name.replace(/</g, "&lt").replace(/>/g, "&gt").replace("/[\r\n]/g", " ");
					var g = $(this.tpl).siblings(".employee");
					g.find(".j_name").text(f.name);
					f.avatar && f.avatar.p5 && g.find(".avatar").attr("src", "/base/download/" + f.avatar.p5);
					g.data("obj", f);
					b.find("#form-typeahead-div #searchList").append(g)
				}
				b.find("#form-typeahead-div #searchList").show()
			}
		})
	});
	n.exports = window.Employee
});
define("form/component/columnpanel", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.ColumnPanel = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "ColumnPanel",
				title: "",
				layoutDetail: [],
				order: 0,
				index: 0,
				size: "1"
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.layoutDetail = b.layoutDetail, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.size = b.size);
			this.tpl = l.get("columnpanel")
		},
		render: function(b) {
			var a = $(this.tpl);
			this.componentSetup.size = b.attr("componentsize");
			a = a.siblings("#form-columnpanel-" + this.componentSetup.size);
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {},
		renderPreview: function(b) {
			if (1 < this.componentSetup.size) {
				var a = $(this.tpl).siblings("#preview-columnpanel-" + this.componentSetup.size);
				a.attr("id", "");
				b.append(a);
				return a.find(".columns_js").children()
			}
		},
		renderEditPreview: function(b) {
			if (1 < this.componentSetup.size) {
				var a = $(this.tpl).siblings("#form-columnpanel-" + this.componentSetup.size);
				a.attr("id", "");
				a.data("componentData", this);
				b.append(a);
				return a.find(".columns_js").children()
			}
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {}
	});
	n.exports = window.ColumnPanel
});
define("form/component/barcomponent", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.BarComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "BarComponent",
				title: "柱状图",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				fieldId: "",
				dataSetId: ""
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.fieldId = b.fieldId, this.componentSetup.dataSetId = b.dataSetId);
			this.tpl = l.get("bar")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		setDataSetId: function(b) {
			this.componentSetup.dataSetId = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-bar");
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {
			var b = this,
				a;
			b.statFields ? b.renderEditorValue() : this.componentmodel.getFormSelectFields(function(c) {
				a = $(_.template(b.tpl, c)).siblings("#editor-bar");
				b.statFields = c;
				null != c.statfields && 0 < c.statfields.length && (b.componentSetup.dataSetId = c.statfields[0].fieldId);
				b.el = a;
				b.renderEditorValue()
			})
		},
		renderEditorValue: function() {
			var b = this.el;
			b.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(b.html());
			var a = $("#component-dataset");
			$.each(this.statFields.statfields, function() {
				var b = a.find("option:first").clone().show();
				b.val(this.fieldId).text(this.title);
				a.append(b)
			});
			$("#editor-component").find("#component-dataset").val(this.componentSetup.dataSetId)
		},
		renderPreview: function(b, a, c) {
			var d = this;
			a = $(this.tpl).siblings("#preview-bar");
			b.append(a);
			this.viewcon = a;
			this.componentmodel.getFieldStat(this.componentSetup.dataSetId, function(a) {
				d.renderBarView(d, a.fieldChartStatData)
			})
		},
		renderBarView: function(b, a) {
			var c = [],
				d = [];
			b = this;
			for (var e, f = 0, g = a.length; f < g; f++)
			c.push(a[f].name), d.push(a[f].total);
			e = {
				title: {
					text: b.componentSetup.title,
					x: "center"
				},
				tooltip: {
					trigger: "axis"
				},
				legend: {
					data: ["次数"],
					x: "left"
				},
				toolbox: {
					show: !0,
					feature: {
						magicType: {
							show: !0,
							type: ["line", "bar"]
						},
						restore: {
							show: !0
						},
						saveAsImage: {
							show: !0
						}
					}
				},
				calculable: !0,
				xAxis: [{
					type: "category",
					data: c
				}],
				yAxis: [{
					type: "value"
				}],
				series: [{
					name: "总数",
					type: "bar",
					data: d,
					markPoint: {
						data: [{
							type: "max",
							name: "最大值"
						}, {
							type: "min",
							name: "最小值"
						}]
					},
					markLine: {
						data: [{
							type: "average",
							name: "平均值"
						}]
					}
				}]
			};
			h.async("https://static.eteams.cn/js/echarts.min.js", function() {
				var a = b.viewcon.find(".barview");
				this.barChart = echarts.init(a.get(0));
				this.barChart.setOption(e)
			})
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-bar");
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-text");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {},
		check: function(b) {},
		getValue: function(b) {},
		setValue: function(b, a) {},
		empty: function(b) {},
		readOnly: function(b, a) {}
	});
	n.exports = window.BarComponent
});
define("form/component/money", ["form/component", "form/tplutil", "form/componentmodel"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = h("form/componentmodel");
	window.Money = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "Money",
				title: "金额",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium",
				type: "人民币",
				tempId: 0,
				isMinus: !0
			};
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.size = a.size, this.componentSetup.type = a.type, this.componentSetup.tempId = a.tempId || a.fieldId);
			this.componentSetup = $.extend({}, this.componentSetup, a);
			this.tpl = l.get("money");
			this.componentModel = new b
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setType: function(a) {
			this.componentSetup.type = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var b = this,
				d = $(this.tpl).siblings("#form-money");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".form-amountbox .money_type_js").text("(" + this.componentSetup.type + ")");
			d.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("class", d.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			this.componentModel.generatorId(function(d) {
				d = d.generatorId;
				b.componentSetup.tempId = d;
				a.attr("tempId", d)
			});
			a.html(d.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-money");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			a.find("select[id='moneyType'] option[value='" + this.componentSetup.type + "']").attr("selected", "selected");
			a.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(a.html())
		},
		renderPreview: function(a, b, d) {
			var e = $(this.tpl).siblings("#preview-money");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".check_js").addClass(this.componentSetup.size);
			e.find(".form-amountbox .money_type_js").text("(" + this.componentSetup.type + ")");
			e.find(".check_js").attr("id", this.componentSetup.fieldId || this.componentSetup.tempId).attr("name", this.componentSetup.fieldId);
			e.find(".check_js").attr("cid", this.cid);
			e.attr("id", "field_" + (this.componentSetup.fieldId || this.componentSetup.tempId));
			e.attr("tempId", "field_" + this.componentSetup.fieldId);
			e.attr("fieldid", this.componentSetup.fieldId || this.componentSetup.tempId);
			e.find(".check_js").data("componentData", this);
			e.data("componentData", this);
			b && e.find(".check_js").val("");
			e.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, d);
			this.el = a;
			a.append(e)
		},
		renderEditPreview: function(a) {
			var b = $(this.tpl).siblings("#form-money");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.find(".form-control").addClass(this.componentSetup.size);
			b.find(".form-amountbox .money_type_js").text("(" + this.componentSetup.type + ")");
			b.attr("id", this.componentSetup.fieldId);
			b.attr("tempId", this.componentSetup.fieldId);
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			a.append(b)
		},
		renderStatSearch: function(a) {
			var b = $(this.tpl).siblings("#statsearch-money");
			a = a.parentEl;
			a.attr("class", "sch-group j_formFieldSearchGroup");
			a.find(".j_formField-condition").html(b)
		},
		submitCheck: function(a, b) {
			var d = this.check(a);
			b(d)
		},
		checkEvents: function(a) {
			var b = this,
				d = b.el || $(document),
				e = b.componentSetup.fieldId || b.componentSetup.tempId;
			d.on("blur", "input[componentKey='Money'][id='" + e + "'][cid='" + this.cid + "']", function() {
				var d = b.check($(this));
				a(d)
			});
			d.on("change", "input[id='" + e + "'][cid='" + b.cid + "']", function() {
				null == b.check($(this)).message && b.saveComponentValue($(this))
			});
			d.on("keydown", "input[componentKey='Money'][id='" + e + "'][cid='" + this.cid + "']", function(a) {
				a = parseInt(a.keyCode);
				var d = $(this).val();
				if ((110 == a || 190 == a) && 0 <= d.indexOf(".") || (!b.componentSetup.isMinus || 109 == a || 173 == a) && 0 <= d.indexOf("-")) return !1
			});
			d.on("keyup", "input[componentKey='Money'][id='" + e + "'][cid='" + this.cid + "']", function(a) {
				a = $(this).val();
				isNaN(a) && ("-" != a && $(this).val(parseFloat(a)), b.componentSetup.isMinus && "-" == a && $(this).val(a));
				"." == a.charAt(0) && $(this).val(0 + parseFloat(a))
			});
			d.on("keyup", "input[componentKey='Money'][id='" + e + "'][cid='" + this.cid + "']", function(a) {
				a = $(this).val();
				$(this).val(a.replace(/[^\d.-]/g, ""))
			});
			d.on("blur", "input[componentKey='Money'][id='" + e + "'][cid='" + this.cid + "']", function(a) {
				a = $(this).val();
				"-" == a ? $(this).val("") : a.replace(/[^\d.-]/g, "") && $(this).val(b.formatMoney(a, 0 < a.indexOf(".") ? a.length - (a.indexOf(".") + 1) : -1))
			});
			d.on("focus", "input[componentKey='Money'][id='" + e + "'][cid='" + this.cid + "']", function(a) {
				a = $(this).val();
				a.replace(/[^\d.-]/g, "") && $(this).val(parseFloat(a.replace(/[^\d.-]/g, "")))
			})
		},
		renderTotal: function(a) {
			var b = a.attr("name");
			a = a.parents(".subform_js");
			var d = a.find('input[name="' + b + '"]'),
				e, d = new String(formPlugin.calculateTotal(d));
			0 < d.length && (e = this.formatMoney(d, 0 < d.indexOf(".") ? d.length - (d.indexOf(".") + 1) : -1));
			"人民币" == a.find('span[name="' + b + '"]').attr("tp") && (a.find('span[name="' + b + '"]').attr("type", "Money"), d = e + " " + ("" == this.numberToChinese(d) ? this.numberToChinese(d) : "(" + this.numberToChinese(d) + ")"));
			a.find('span[name="' + b + '"]').html(d)
		},
		numberToChinese: function(a) {
			var b = "";
			0 == a.indexOf("-") && (b += "负", a = a.substring(1));
			strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
			a += "00";
			var d = a.indexOf(".");
			0 <= d && (a = a.substring(0, d) + a.substr(d + 1, 2));
			strUnit = strUnit.substr(strUnit.length - a.length);
			for (d = 0; d < a.length; d++)
			b += "零壹贰叁肆伍陆柒捌玖".substr(a.substr(d, 1), 1) + strUnit.substr(d, 1);
			return b.replace(/零分$/, "").replace(/零角零分$/, "").replace(/零[仟佰拾]/g, "零").replace(/零{2,}/g, "零").replace(/零([亿|万])/g, "$1").replace(/零+元/, "元").replace(/亿零{0,3}万/, "亿").replace(/^元/, "零元").replace(/零角$/, "").replace(/零元$/, "")
		},
		check: function(a) {
			var b = $.trim(a.val()),
				d = a.attr("placeholder"),
				e = {};
			e.element = a;
			b == d && (b = "");
			"" != b || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			return e
		},
		getValue: function(a) {
			var b = a.val();
			0 < b.length && (b = parseFloat(a.val().replace(/[^\d.-]/g, "")));
			a = a.attr("placeholder");
			var d = this.oldValue,
				e = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: b
				};
			this.oldValue = b;
			return d && 0 < d.length ? e : 0 == b.length || b == a || isNaN(b) ? null : e
		},
		setValue: function(a, b) {
			if (null != b) {
				var d = new String(b.content);
				0 < d.length && (d = this.formatMoney(d, 0 < d.indexOf(".") ? d.length - (d.indexOf(".") + 1) : -1));
				a.find("#" + this.componentSetup.fieldId).val(d);
				a.find(".j_readOnly").html(d);
				this.oldValue = parseFloat(d.replace(/[^\d.-]/g, ""))
			}
		},
		empty: function(a) {
			a.find("#" + this.componentSetup.fieldId).val("")
		},
		formatMoney: function(a, b) {
			b = 2 < b && 20 >= b ? b : 2;
			a = parseFloat((a + "").replace(/[^\d\.-]/g, "")).toFixed(b) + "";
			var d = a.split(".")[0].split("").reverse(),
				e = a.split(".")[1];
			t = "";
			for (i = 0; i < d.length; i++)
			t += d[i] + (0 == (i + 1) % 3 && i + 1 != d.length ? "," : "");
			return t.split("").reverse().join("") + "." + e
		},
		readOnly: function(a, b) {
			var d = a.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", b);
			b ? (d.hide(), d.siblings(".j_readOnly").removeClass("hide")) : (d.show(), d.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Money
});
define("form/component/mobile", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.Mobile = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Mobile",
				title: "手机",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium"
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.fieldId = b.fieldId, this.componentSetup.size = b.size);
			this.tpl = l.get("mobile")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-mobile");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-mobile");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-mobile");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").addClass(this.componentSetup.size);
			d.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			c && d.find(".check_js").prop("readOnly", !0);
			a && d.find(".check_js").val("");
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			d.addClass(this.componentSetup.titleLayout);
			this.readOnly(d, c);
			this.el = b;
			b.append(d)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-mobile");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").addClass(this.componentSetup.size);
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-mobile");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			c.on("blur", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
				c = b.attr("placeholder"),
				d = {};
			d.element = b;
			a == c && (a = "");
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			"" == a || this.mobile(a) || (d.message = this.componentSetup.title + "格式有误，请输入有效的手机号码");
			return d
		},
		mobile: function(b) {
			var a = !1;
			/^13\d{9}$/.test(b) && (a = !0);
			/^14\d{9}$/.test(b) && (a = !0);
			/^15\d{9}$/.test(b) && (a = !0);
			/^18\d{9}$/.test(b) && (a = !0);
			/^17\d{9}$/.test(b) && (a = !0);
			/^((\+)?86)?1(3|4|5|7|8)\d{9}$/.test(b) && (a = !0);
			return a ? !0 : !1
		},
		getValue: function(b) {
			var a = $.trim(b.val());
			b = b.attr("placeholder");
			var c = this.oldValue,
				d = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: a
				};
			this.oldValue = a;
			return c && 0 < c.length || "" != a && a != b && this.mobile(a) ? d : null
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content;
				b.find("#" + this.componentSetup.fieldId).val(c);
				b.find(".j_readOnly").html(c);
				this.oldValue = c
			}
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("readOnly", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Mobile
});
define("form/component/option", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.Option = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Option",
				name: "选项",
				order: 0,
				index: 0,
				selectionId: "",
				childOptions: [],
				defOption: !1,
				other: !1
			};
			null != b && (this.componentSetup.name = b.name, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.selectionId = b.selectionId, this.componentSetup.defOption = b.defOption, this.componentSetup.other = b.other);
			this.tpl = l.get("option")
		},
		setName: function(b) {
			this.componentSetup.name = b
		},
		setOrder: function(b) {
			this.componentSetup.order = b
		},
		setOther: function(b) {
			this.componentSetup.other = b
		},
		setDefOption: function(b) {
			this.componentSetup.defOption = b
		},
		render: function(b, a) {
			var c = $(this.tpl).siblings("#form-option"),
				c = c.find("." + a.componentSetup.componentKey + "_js").clone();
			if ("Select" == a.componentSetup.componentKey) c.text(this.componentSetup.name), c.attr("value", this.componentSetup.selectionId), "true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || c.attr("selected", "true");
			else {
				c.find("input").attr("value", this.componentSetup.selectionId);
				"true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || c.find("input").attr("checked", "true");
				var d = a.componentSetup.fieldId,d = "" == d || null == d ? a.cid : d;
				c.find("input").attr("name", d);
				c.find("span").text(this.componentSetup.name);
				"true" != this.componentSetup.other && 1 != this.componentSetup.other || c.append('<input type="text" class="form-control form-w120 input-otherchoice" disabled="disabled">')
			}
			b.append(c)
		},
		renderEditor: function(b, a, c) {
			var d = $(this.tpl).siblings("#editor-option"),
				d = "true" == this.componentSetup.other || 1 == this.componentSetup.other ? d.find(".otherOption_js") : d.find("." + a.componentSetup.componentKey + "_js");
			d.find(".option_js").attr("value", this.componentSetup.selectionId);
			"true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || d.find(".option_js").attr("checked", "true");
			d.find(".optionName_js").attr("value", this.componentSetup.name);
			c ? d.insertAfter(c) : b.append(d)
		},
		change: function(b) {},
		renderPreview: function(b, a) {
			var c = $(this.tpl).siblings("#preview-option"),
				c = c.find("." + a.componentSetup.componentKey + "_js").clone();
			this.componentSetup.selectionId = this.componentSetup.selectionId ? this.componentSetup.selectionId : this.cid;
			if ("Select" == a.componentSetup.componentKey) c.text(this.componentSetup.name), c.attr("value", this.componentSetup.selectionId), "true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || c.attr("selected", "true"), c.data("componentData", this);
			else {
				c.find("input").attr("value", this.componentSetup.selectionId);
				"true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || c.find("input").attr("checked", "true");
				var d = a.componentSetup.fieldId,
					d = "" == d || null == d ? a.cid : d + a.cid;
				c.find("input").attr("name", d);
				c.find("input").attr("id", this.componentSetup.selectionId);
				c.find("span").text(this.componentSetup.name);
				c.find("input").data("componentData", this);
				"true" != this.componentSetup.other && 1 != this.componentSetup.other || c.append('<input type="text" placeholder="请填写其他内容" style="display: none;" class="form-control form-w120 input-otherchoice">')
			}
			b.append(c)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {}
	});
	n.exports = window.Option
});
define("form/component/monitor", ["form/component", "form/tplutil", "form/componentmodel"], function(h, m, n) {
	function l(a, b, e, f) {
		this.value = a;
		this.type = b;
		this.monitorFields = e;
		this.monitorType = f
	}
	m = h("form/component");
	var b = h("form/tplutil"),
		a = h("form/componentmodel");
	window.Monitor = m.extend({
		initialize: function(c) {
			this.componentSetup = {
				componentKey: "Monitor",
				title: "运算控件",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				fieldId: "",
				monitorType: "number",
				value: "",
				format: "",
				tempId: 0,
				monitorFields: [],
				required: !1,
				isEdit: !0
			};
			null != c && (this.componentSetup.title = c.title, this.componentSetup.titleLayout = c.titleLayout, this.componentSetup.order = c.order, this.componentSetup.index = c.index, this.componentSetup.describe = c.describe, this.componentSetup.fieldId = c.fieldId, this.componentSetup.monitorType = c.monitorType || this.componentSetup.monitorType, this.componentSetup.componentIds = _.filter(c.componentIds, function(a) {
				return "" != a
			}), this.componentSetup.value = c.value, this.componentSetup.format = c.format, this.componentSetup.tempId = c.tempId || c.fieldId, this.componentSetup.monitorFields = c.monitorFields, this.componentSetup.isEdit = c.isEdit);
			this.tpl = b.get("monitor");
			this.componentModel = new a;
			this.count = this.componentSetup.monitorFields ? Math.floor(this.componentSetup.monitorFields.length / 2) + 1 : 0;
			this.eventFiled = [];
			this.monitors = []
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setMonitorType: function(a) {
			this.componentSetup.monitorType = a
		},
		setComponentIds: function(a) {
			this.componentSetup.componentIds = a
		},
		setText: function(a) {
			this.componentSetup.value = a
		},
		setMonitorFields: function(a) {
			this.componentSetup.monitorFields = a
		},
		setIsEdit: function(a) {
			this.componentSetup.isEdit = a
		},
		render: function(a) {
			var b = this,
				e = $(this.tpl).siblings("#form-monitor");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			a.attr("class", e.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			this.componentModel.generatorId(function(e) {
				e = e.generatorId;
				b.componentSetup.tempId = e;
				a.attr("tempId", e)
			});
			a.html(e.html())
		},
		renderEditor: function() {
			var a = this,
				b = $(this.tpl),
				e = this.componentSetup,
				f = e.monitorType,
				g = b.siblings("#editor-monitor");
			a.count = 0;
			g.find("#component-title").attr("value", e.title);
			g.find("input:radio[name='title-layout'][value='" + e.titleLayout + "']").attr("checked", !0);
			g.find("#component-describe").text(e.describe);
			g.find("input:radio[name='monitor-type'][value='" + f + "']").attr("checked", !0);
			g.find("div[type='" + f + "']").show();
			g.find("input:radio[name='isedit'][value='" + e.isEdit + "']").attr("checked", !0);
			var k = this.getAllNumberField(),
				h = "",
				e = this.componentSetup.monitorFields;
			if ("number" === f) {
				if (e && 0 < e.length) $.each(e, function(e, f) {
					"string" == typeof f && (f = JSON.parse(f));
					if ("field" === f.type || "number" === f.type) {
						var g = b.siblings("#j_monitor_item").clone();
						g.find(".js_signField").text("A" + a.count + ":");
						g.find(".js_signField").attr("title", "A" + a.count);
						g.find("select").html(k);
						"field" === f.type ? g.find("select option[value='" + f.value + "']").attr("selected", !0) : (g.find("select option[value='常量']").attr("selected", !0), g.find("select").next().removeClass("hide").attr("value", f.value ? f.value : 0));
						a.count++;
						h += g.html()
					}
					"operate" === f.type && (g = b.siblings("#j_operate_list").clone(), g.find("input").attr("name", "operate-type-" + a.count), g.find("input[value='" + f.value + "']").attr("checked", !0), h += g.html())
				});
				else {
					var l = b.siblings("#j_monitor_item").clone();
					l.find(".js_signField").text("A" + a.count + ":");
					l.find(".js_signField").attr("title", "A" + a.count);
					l.find("select").html(k);
					a.count++;
					h += l.html()
				}
				g.find(".j_choicelistEdit_number").html(h)
			}
			"date" === f && (g.find(".j_select_date").html(k), e && 0 < e.length && ($.each(e, function(a, b) {
				"string" == typeof b && (b = JSON.parse(b));
				"field" === b.type && g.find(".j_select_date option[value='" + b.value + "']").attr("selected", !0);
				"operate" === b.type && g.find("input[value='" + b.value + "']").attr("checked", !0);
				"number" === b.type && g.find(".j_number_input").attr("value", b.value)
			}), g.find("input[name='format'][value='" + a.componentSetup.format + "']").attr("checked", !0)));
			$("#editor-component").html(g.html());
			"number" === f && $(".j_operate_show").show();
			"date" === f && $(".j_format_show").show();
			a.getFormula()
		},
		renderPreview: function(a, b, e) {
			b = $(this.tpl).siblings("#preview-monitor");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.addClass(this.componentSetup.titleLayout);
			b.attr("id", "field_" + this.componentSetup.tempId);
			b.attr("tempId", "field_" + this.componentSetup.tempId);
			b.attr("fieldid", this.componentSetup.tempId);
			b.find(".check_js").data("componentData", this);
			b.find(".check_js").attr("id", this.componentSetup.fieldId || this.componentSetup.tempId).attr("name", this.componentSetup.fieldId || this.componentSetup.tempId);
			b.find(".check_js").attr("cid", this.cid);
			var f = this.componentSetup.isEdit || "true" === this.componentSetup.isEdit ? !1 : !0;
			b.find(".check_js").attr("readonly", f);
			this.el = a;
			this.readOnly(b, e);
			a.append(b)
		},
		setMonitorTitle: function(a, b) {
			var e = this,
				f = e.componentSetup.monitorFields,
				g = b.closest(".subtr_js");
			if (g && 0 < g.length) {
				var k = b.parent().index(),
					h = g.parent().children(":first"),
					g = h.find(".widget-title").eq(k);
				if (!g.attr("title") && f && 0 < f.length) {
					var l = g.text() + "=";
					$.each(f, function(b, d) {
						"string" === typeof d && (d = JSON.parse(d));
						if (d && d.type) if ("field" === d.type) {
							var f = a.find("div[id='field_" + d.value + "']").parent().index();
							l += h.find(".widget-title").eq(f).text()
						} else if ("number" === e.componentSetup.monitorType || e.componentSetup.format) l += d.value
					});
					g.attr("title", l)
				}
			} else f && 0 < f.length && (l = b.find(".widget-title_js").text() + "=", $.each(f, function(b, d) {
				"string" === typeof d && (d = JSON.parse(d));
				if (d && d.type) if ("field" === d.type) l += a.find("div[id='field_" + d.value + "']").find(".widget-title_js").text();
				else if ("number" === e.componentSetup.monitorType || e.componentSetup.format) l += d.value
			}), b.attr("title", l))
		},
		renderStatSearch: function(a) {
			var b = $(this.tpl).siblings("#statsearch-monitor");
			a = a.parentEl;
			a.attr("class", "sch-group j_formFieldSearchGroup");
			a.find(".j_formField-condition").html(b)
		},
		renderEditPreview: function(a) {
			var b = $(this.tpl).siblings("#form-monitor");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			var e = "true" === this.componentSetup.isEdit ? !1 : !0;
			b.find(".check_js").attr("readonly", e);
			b.attr("id", this.componentSetup.fieldId);
			b.attr("tempId", this.componentSetup.tempId);
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			a.append(b)
		},
		renderStatSearch: function(a) {
			var b = $(this.tpl).siblings("#statsearch-monitor");
			a = a.parentEl;
			a.attr("class", "sch-group j_formFieldSearchGroup");
			a.find(".j_formField-condition").html(b)
		},
		getValue: function(a) {
			var b = $.trim(a.val());
			0 < b.length && (b = parseFloat(a.val().replace(/[^\d.-]/g, "")));
			a = this.oldValue;
			var e = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue,
				content: b
			};
			this.oldValue = b;
			return a && 0 < a.length ? e : "" == b ? null : e
		},
		setValue: function(a, b) {
			if (null != b) {
				var e = b.content;
				a.find("#" + this.componentSetup.fieldId).val(e);
				a.find(".j_readOnly").html(e);
				this.oldValue = e && 0 < e.length ? parseFloat(e.replace(/[^\d.-]/g, "")) : e
			}
		},
		dateDiff: function(a) {
			if (0 == a) return "";
			var b = 0,
				e = 0,
				e = e = 0,
				b = Math.floor(a / 864E5),
				e = Math.floor(a % 864E5 / 36E5),
				b = "" + (0 == b ? "" : b + "天") + (0 == e ? "" : e + "小时"),
				e = Math.floor(a % 864E5 % 36E5 / 6E4),
				b = b + (0 == e ? "" : e + "分"),
				e = Math.floor(a % 864E5 % 36E5 % 6E4 / 1E3);
			return b += 0 == e ? "" : e + "秒"
		},
		getDateValue: function(a, b) {
			var e = "";
			if (0 == a) return "";
			switch (b) {
			case "d":
				e = a / 864E5;
				break;
			case "h":
				e = a / 36E5;
				break;
			case "m":
				e = a / 6E4;
				break;
			case "s":
				e = a / 1E3
			}
			return e ? e.toFixed(2) : ""
		},
		formatMoney: function(a, b) {
			b = 2 < b && 20 >= b ? b : 2;
			a = parseFloat((a + "").replace(/[^\d\.-]/g, "")).toFixed(b) + "";
			var e = a.split(".")[0].split("").reverse(),
				f = a.split(".")[1];
			t = "";
			for (i = 0; i < e.length; i++)
			t += e[i] + (0 == (i + 1) % 3 && i + 1 != e.length ? "," : "");
			return t.split("").reverse().join("") + "." + f
		},
		checkEvents: function(a) {
			a = this.componentSetup.monitorFields;
			var b = this.componentSetup.monitorType,
				e = ".monitor_" + (this.componentSetup.fieldId || this.componentSetup.tempId),
				f = $("input[id='" + (this.componentSetup.fieldId || this.componentSetup.tempId) + "'][cid='" + this.cid + "']"),
				g = f.closest(".subtr_js"),
				g = 1 == g.length ? g : f.closest(".form-view"),
				g = 1 > g.length ? $(document) : g;
			g.off(e);
			this.componentSetup.isEdit && (f.keydown(function(a) {
				a = parseInt(a.keyCode);
				var b = $(this).val();
				if ((110 == a || 190 == a) && 0 <= b.indexOf(".") || (109 == a || 173 == a) && 0 <= b.indexOf("-")) return !1
			}), f.keyup(function(a) {
				a = $(this).val();
				isNaN(a) && "-" != a && $(this).val(parseFloat(a));
				"." == a.charAt(0) && $(this).val(0 + parseFloat(a))
			}), f.keyup(function(a) {
				a = $(this).val();
				$(this).val(a.replace(/[^\d.-]/g, ""))
			}), f.blur(function(a) {
				a = $(this).val();
				$(this).val(a.replace(/[^\d.-]/g, ""))
			}));
			this.changeEvent(g, b, a, e)
		},
		changeEvent: function(a, b, e, f) {
			var g = this;
			e && 0 < e.length && $.each(e, function(e, h) {
				"string" == typeof h && (h = JSON.parse(h));
				if ("field" === h.type && 0 > $.inArray(h.value, g.eventFiled) && (g.eventFiled.push(h.value), "number" === b && (a.on("blur" + f, "input[id='" + h.value + "']", function() {
					g.getMonitorValue(h.value)
				}), h.monitorFields && 0 < h.monitorFields.length && g.changeEvent(a, h.monitorType, h.monitorFields, f)), "date" === b)) if ("mobile" == window.systemInfo_form) a.on("monitor_change", "div[fieldId='" + h.value + "'] input", function() {
					g.getMonitorValue(h.value)
				});
				else a.on("change" + f, "div[fieldId='" + h.value + "'] input", function() {
					g.getMonitorValue(h.value)
				})
			})
		},
		empty: function(a) {},
		readOnly: function(a, b) {
			var e = a.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", b);
			b ? (e.addClass("hide"), e.siblings(".j_readOnly").removeClass("hide")) : (e.removeClass("hide"), e.siblings(".j_readOnly").addClass("hide"))
		},
		getFormula: function() {
			var a = "",
				b = [],
				e = this.componentSetup.monitorType;
			"number" === e && ($(".j_choicelistEdit_number li").each(function() {
				var e = $(this);
				if (e.hasClass("j_monitor_item")) {
					var f = e.find("select"),
						h = f.find("option:selected").attr("type");
					"常量" == f.val() ? (f = e.find("select").next().val(), a += f ? f : "0 ", b.push(new l(f ? f : 0, "number"))) : h && 0 < h.length ? (a += e.find(".js_signField").attr("title") + " ", e = $("div[tempId='" + f.val() + "']").data("componentData").componentSetup.monitorFields, b.push(new l(f.val(), "field", e, h))) : (a += e.find(".js_signField").attr("title") + " ", b.push(new l(f.val(), "field")))
				} else if (f = e.find("input:checked").val()) a += f + " ", b.push(new l(f, "operate"));
				else return !1;
				return !0
			}), $("#operate_show").html(a));
			if ("date" === e) {
				b.push(new l($(".j_choicelistEdit_date .j_select_date").val(), "field"));
				var e = $(".j_choicelistEdit_date input[name='operate-type']:checked").val(),
					f = $(".j_choicelistEdit_date .j_number_input").val();
				e && f && (b.push(new l(e, "operate")), b.push(new l(f, "number")));
				this.componentSetup.format = $(".j_operate input[name='format']:checked").val()
			}
			e = $("#widget-control .field-active").data("componentData");
			e.setMonitorFields(b);
			e.changeMonitorsFields(b);
			e.changeClass(b)
		},
		changeClass: function(a) {
			$(".field_js").removeClass("monitor");
			a && 0 < a.length && $.each(a, function(a, b) {
				"string" == typeof b && (b = JSON.parse(b));
				b && "field" === b.type && $("#formContainer_js").find("div[tempId='" + b.value + "']").addClass("monitor")
			})
		},
		changeMonitorsFields: function(a) {
			var b = this.monitors,
				e = this.componentSetup.tempId;
			if (b && 0 < b.length) for (var f = 0; f < b.length; f++) {
				var g = b[f];
				g.changeFields(e, a, g.componentSetup.monitorFields)
			}
		},
		changeFields: function(a, b, e) {
			for (var f = 0; f < e.length; f++) {
				var g = e[f];
				g.value == a ? g.monitorFields = b : g.monitorFields && 0 < g.monitorFields.length && this.changeFields(a, b, g.monitorFields)
			}
		},
		getAllNumberField: function() {
			var a, b, e, f = $("div[tempId='" + this.componentSetup.tempId + "']").closest(".subtr_js");
			1 == f.length ? "number" === this.componentSetup.monitorType ? (a = f.find(".field_js[componentkey=NumberComponent]"), b = f.find(".field_js[componentkey=Money]"), e = f.find(".field_js[componentkey=Monitor]:not([tempid='" + this.componentSetup.tempId + "'])"), a = $.merge(a, b)) : a = f.find(".field_js[componentkey=DateInterval]") : "number" === this.componentSetup.monitorType ? (a = $("#formContainer_js").find(".field_js[componentkey=NumberComponent]:not(.subtd_js>.field_js)"), b = $("#formContainer_js").find(".field_js[componentkey=Money]:not(.subtd_js>.field_js)"), e = $("#formContainer_js").find(".field_js[componentkey=Monitor]:not(.subtd_js>.field_js,[tempid='" + this.componentSetup.tempId + "'])"), a = $.merge(a, b)) : a = $("#formContainer_js").find(".field_js[componentkey=DateInterval]:not(.subtd_js>.field_js)");
			var g = "";
			$.each(a, function() {
				var a = $(this),
					b = a.attr("tempid"),
					a = a.find(".widget-title_js").text();
				g += '<option value="' + b + '">' + a + "</option>"
			});
			$.each(this.filterMonitorComponents(e), function() {
				var a = $(this),
					b = a.attr("tempid"),
					c = a.find(".widget-title_js").text(),
					a = a.data("componentData").componentSetup.monitorType;
				g += '<option value="' + b + '" type="' + a + '">' + c + "</option>"
			});
			"number" === this.componentSetup.monitorType && 0 < g.length && (g += '<option value="常量">常量</option>');
			return g
		},
		getMonitorComponents: function(a, b) {
			if (b && 0 < b.length) for (var e = 0; e < b.length; e++) {
				var f = b[e];
				"string" == typeof f && (f = JSON.parse(f));
				"field" == f.type && 0 > $.inArray(f.value, a) && a.push(f.value);
				f && f.monitorFields && this.getMonitorComponents(a, f.monitorFields)
			}
		},
		getFilterMonitorComponents: function() {
			var a = [];
			this.getMonitorComponents(a, this.componentSetup.monitorFields);
			return a
		},
		filterMonitorComponents: function(a) {
			var b = [],
				e = this.componentSetup.tempId;
			if (a && 0 < a.length) for (var f = 0; f < a.length; f++) {
				var g = $(a[f]).data("componentData"),
					k = g.getFilterMonitorComponents();
				0 > $.inArray(e, k) ? b.push(a[f]) : 0 > $.inArray(g, this.monitors) && this.monitors.push(g)
			}
			return b
		},
		check: function(a) {
			$.trim(a.val());
			a.attr("placeholder");
			var b = {};
			b.element = a;
			return b
		},
		getMonitorValue: function(a) {
			var b = this,
				e = this.componentSetup.monitorFields,
				f = this.componentSetup.monitorType,
				g = "",
				k = $("input[id='" + (this.componentSetup.fieldId || this.componentSetup.tempId) + "'][cid='" + this.cid + "']"),
				h = k.closest(".subtr_js"),
				l = 1 == h.length ? h : k.closest(".form-view"),
				n = [];
			e && 0 < e.length && ("number" === f && $.each(e, function(e, f) {
				"string" == typeof f && (f = JSON.parse(f));
				if (f.monitorFields && 0 < f.monitorFields.length) {
					var k = [];
					b.getMonitorComponents(k, f.monitorFields); - 1 < $.inArray(a, k) && l.find("input[id='" + f.value + "']").data("componentData").getMonitorValue(a)
				}
				"field" === f.type && ((k = l.find("input[id='" + f.value + "']")) && 0 < k.length ? (k = k.val(), 0 < k.length && (k = parseFloat(k.replace(/[^\d.-]/g, "")), n.push(k)), k || (k = "0"), k && (0 < g.length ? (g += "(" + k + "))", g = "(" + g) : g += k)) : 0 < g.length && (g = g.substring(0, g.length - 1)));
				"operate" === f.type && f.value && g && 0 < g.length && (g += f.value);
				"number" === f.type && f.value && (0 < g.length ? (g += "(" + f.value + "))", g = "(" + g) : g += f.value)
			}), "date" === f && (isCount = !1, $.each(e, function(a, c) {
				"string" == typeof c && (c = JSON.parse(c));
				if ("field" === c.type) {
					var e = l.find("div[fieldId='" + c.value + "']"),
						f = e.find("input:first").val(),
						e = e.find("input:last").val();
					if (f && e) isCount = !0, f = (new Date(Date.parse(f.replace(" ", "T")))).getTime(), g = (new Date(Date.parse(e.replace(" ", "T")))).getTime() - f, b.componentSetup.format && (g = b.getDateValue(g, b.componentSetup.format));
					else return g = "", !1
				}
				"operate" === c.type && c.value && (b.componentSetup.format ? g && 0 < g.length && (g += c.value) : g = b.getDateValue(g, c.value));
				"number" === c.type && c.value && (0 < g.length ? (g += "(" + c.value + "))", g = "(" + g) : g += c.value)
			})));
			g && 0 < g.length && (g = -1 < (eval(g) + "").indexOf("Infinity") ? 0 : eval(g), g = isNaN(g) ? 0 : g, 0 < (g + "").length && (g = (new Number(g)).toFixed(b.getMaxPlace(n))), k.val(g));
			1 == h.length && h.closest(".subtable_js").data("componentData").countTotal(k)
		},
		submitCheck: function(a, b) {
			var e = this.check(a);
			b(e)
		},
		getMaxPlace: function(a) {
			var b = 0;
			if (a && 0 < a.length) for (var e = 0; e < a.length; e++) {
				var f = 0,
					f = a[e] + ""; - 1 < f.indexOf(".") && f.indexOf(".") != f.length - 1 && (f = f.substring(f.indexOf(".") + 1).length, b = f > b ? f : b)
			}
			return 0 == b ? 2 : b
		}
	});
	n.exports = window.Monitor
});
define("form/component/codeRule", ["form/component", "form/tplutil", "form/componentmodel"], function(h, m, n) {
	function l(a, b, e, f) {
		this.value = a;
		this.type = b;
		this.monitorFields = e;
		this.monitorType = f
	}
	m = h("form/component");
	var b = h("form/tplutil"),
	a = h("form/componentmodel");
	window.CodeRule = m.extend({
		initialize: function(c) {
			this.componentSetup = {
					componentKey: "CodeRule",
					title: "运算控件",
					titleLayout: "field-hoz",
					order: 0,
					index: 0,
					describe: "",
					fieldId: "",
					monitorType: "number",
					value: "",
					format: "",
					tempId: 0,
					monitorFields: [],
					required: !1,
					isEdit: !0
			};
			null != c && (this.componentSetup.title = c.title, this.componentSetup.titleLayout = c.titleLayout, this.componentSetup.order = c.order, this.componentSetup.index = c.index, this.componentSetup.describe = c.describe, this.componentSetup.fieldId = c.fieldId, this.componentSetup.monitorType = c.monitorType || this.componentSetup.monitorType, this.componentSetup.componentIds = _.filter(c.componentIds, function(a) {
				return "" != a
			}), this.componentSetup.value = c.value, this.componentSetup.format = c.format, this.componentSetup.tempId = c.tempId || c.fieldId, this.componentSetup.monitorFields = c.monitorFields, this.componentSetup.isEdit = c.isEdit);
			this.tpl = b.get("codeRule");
			this.componentModel = new a;
			this.count = this.componentSetup.monitorFields ? Math.floor(this.componentSetup.monitorFields.length / 2) + 1 : 0;
			this.eventFiled = [];
			this.monitors = []
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setMonitorType: function(a) {
			this.componentSetup.monitorType = a
		},
		setComponentIds: function(a) {
			this.componentSetup.componentIds = a
		},
		setText: function(a) {
			this.componentSetup.value = a
		},
		setMonitorFields: function(a) {
			this.componentSetup.monitorFields = a
		},
		setIsEdit: function(a) {
			this.componentSetup.isEdit = a
		},
		render: function(a) {
			var b = this,
			e = $(this.tpl).siblings("#form-monitor");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			a.attr("class", e.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			this.componentModel.generatorId(function(e) {
				e = e.generatorId;
				b.componentSetup.tempId = e;
				a.attr("tempId", e)
			});
			a.html(e.html())
		},
		renderEditor: function() {
			var a = this,
			b = $(this.tpl),
			e = this.componentSetup,
			f = e.monitorType,
			g = b.siblings("#editor-monitor");
			a.count = 0;
			g.find("#component-title").attr("value", e.title);
			g.find("input:radio[name='title-layout'][value='" + e.titleLayout + "']").attr("checked", !0);
			g.find("#component-describe").text(e.describe);
			g.find("input:radio[name='monitor-type'][value='" + f + "']").attr("checked", !0);
			g.find("div[type='" + f + "']").show();
			g.find("input:radio[name='isedit'][value='" + e.isEdit + "']").attr("checked", !0);
			var k = this.getAllNumberField(),
			h = "",
			e = this.componentSetup.monitorFields;
			if ("number" === f) {
				if (e && 0 < e.length) $.each(e, function(e, f) {
					"string" == typeof f && (f = JSON.parse(f));
					if ("field" === f.type || "number" === f.type) {
						var g = b.siblings("#j_monitor_item").clone();
						g.find(".js_signField").text("A" + a.count + ":");
						g.find(".js_signField").attr("title", "A" + a.count);
						g.find("select").html(k);
						"field" === f.type ? g.find("select option[value='" + f.value + "']").attr("selected", !0) : (g.find("select option[value='常量']").attr("selected", !0), g.find("select").next().removeClass("hide").attr("value", f.value ? f.value : 0));
						a.count++;
						h += g.html()
					}
					"operate" === f.type && (g = b.siblings("#j_operate_list").clone(), g.find("input").attr("name", "operate-type-" + a.count), g.find("input[value='" + f.value + "']").attr("checked", !0), h += g.html())
				});
				else {
					var l = b.siblings("#j_monitor_item").clone();
					l.find(".js_signField").text("A" + a.count + ":");
					l.find(".js_signField").attr("title", "A" + a.count);
					l.find("select").html(k);
					a.count++;
					h += l.html()
				}
				g.find(".j_choicelistEdit_number").html(h)
			}
			"date" === f && (g.find(".j_select_date").html(k), e && 0 < e.length && ($.each(e, function(a, b) {
				"string" == typeof b && (b = JSON.parse(b));
				"field" === b.type && g.find(".j_select_date option[value='" + b.value + "']").attr("selected", !0);
				"operate" === b.type && g.find("input[value='" + b.value + "']").attr("checked", !0);
				"number" === b.type && g.find(".j_number_input").attr("value", b.value)
			}), g.find("input[name='format'][value='" + a.componentSetup.format + "']").attr("checked", !0)));
			$("#editor-component").html(g.html());
			"number" === f && $(".j_operate_show").show();
			"date" === f && $(".j_format_show").show();
			a.getFormula()
		},
		renderPreview: function(a, b, e) {
			b = $(this.tpl).siblings("#preview-monitor");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.addClass(this.componentSetup.titleLayout);
			b.attr("id", "field_" + this.componentSetup.tempId);
			b.attr("tempId", "field_" + this.componentSetup.tempId);
			b.attr("fieldid", this.componentSetup.tempId);
			b.find(".check_js").data("componentData", this);
			b.find(".check_js").attr("id", this.componentSetup.fieldId || this.componentSetup.tempId).attr("name", this.componentSetup.fieldId || this.componentSetup.tempId);
			b.find(".check_js").attr("cid", this.cid);
			var f = this.componentSetup.isEdit || "true" === this.componentSetup.isEdit ? !1 : !0;
			b.find(".check_js").attr("readonly", f);
			this.el = a;
			this.readOnly(b, e);
			a.append(b)
		},
		setMonitorTitle: function(a, b) {
			var e = this,
			f = e.componentSetup.monitorFields,
			g = b.closest(".subtr_js");
			if (g && 0 < g.length) {
				var k = b.parent().index(),
				h = g.parent().children(":first"),
				g = h.find(".widget-title").eq(k);
				if (!g.attr("title") && f && 0 < f.length) {
					var l = g.text() + "=";
					$.each(f, function(b, d) {
						"string" === typeof d && (d = JSON.parse(d));
						if (d && d.type) if ("field" === d.type) {
							var f = a.find("div[id='field_" + d.value + "']").parent().index();
							l += h.find(".widget-title").eq(f).text()
						} else if ("number" === e.componentSetup.monitorType || e.componentSetup.format) l += d.value
					});
					g.attr("title", l)
				}
			} else f && 0 < f.length && (l = b.find(".widget-title_js").text() + "=", $.each(f, function(b, d) {
				"string" === typeof d && (d = JSON.parse(d));
				if (d && d.type) if ("field" === d.type) l += a.find("div[id='field_" + d.value + "']").find(".widget-title_js").text();
				else if ("number" === e.componentSetup.monitorType || e.componentSetup.format) l += d.value
			}), b.attr("title", l))
		},
		renderStatSearch: function(a) {
			var b = $(this.tpl).siblings("#statsearch-monitor");
			a = a.parentEl;
			a.attr("class", "sch-group j_formFieldSearchGroup");
			a.find(".j_formField-condition").html(b)
		},
		renderEditPreview: function(a) {
			var b = $(this.tpl).siblings("#form-monitor");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			var e = "true" === this.componentSetup.isEdit ? !1 : !0;
			b.find(".check_js").attr("readonly", e);
			b.attr("id", this.componentSetup.fieldId);
			b.attr("tempId", this.componentSetup.tempId);
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			a.append(b)
		},
		renderStatSearch: function(a) {
			var b = $(this.tpl).siblings("#statsearch-monitor");
			a = a.parentEl;
			a.attr("class", "sch-group j_formFieldSearchGroup");
			a.find(".j_formField-condition").html(b)
		},
		getValue: function(a) {
			var b = $.trim(a.val());
			0 < b.length && (b = parseFloat(a.val().replace(/[^\d.-]/g, "")));
			a = this.oldValue;
			var e = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: b
			};
			this.oldValue = b;
			return a && 0 < a.length ? e : "" == b ? null : e
		},
		setValue: function(a, b) {
			if (null != b) {
				var e = b.content;
				a.find("#" + this.componentSetup.fieldId).val(e);
				a.find(".j_readOnly").html(e);
				this.oldValue = e && 0 < e.length ? parseFloat(e.replace(/[^\d.-]/g, "")) : e
			}
		},
		dateDiff: function(a) {
			if (0 == a) return "";
			var b = 0,
			e = 0,
			e = e = 0,
			b = Math.floor(a / 864E5),
			e = Math.floor(a % 864E5 / 36E5),
			b = "" + (0 == b ? "" : b + "天") + (0 == e ? "" : e + "小时"),
			e = Math.floor(a % 864E5 % 36E5 / 6E4),
			b = b + (0 == e ? "" : e + "分"),
			e = Math.floor(a % 864E5 % 36E5 % 6E4 / 1E3);
			return b += 0 == e ? "" : e + "秒"
		},
		getDateValue: function(a, b) {
			var e = "";
			if (0 == a) return "";
			switch (b) {
			case "d":
				e = a / 864E5;
				break;
			case "h":
				e = a / 36E5;
				break;
			case "m":
				e = a / 6E4;
				break;
			case "s":
				e = a / 1E3
			}
			return e ? e.toFixed(2) : ""
		},
		formatMoney: function(a, b) {
			b = 2 < b && 20 >= b ? b : 2;
			a = parseFloat((a + "").replace(/[^\d\.-]/g, "")).toFixed(b) + "";
			var e = a.split(".")[0].split("").reverse(),
			f = a.split(".")[1];
			t = "";
			for (i = 0; i < e.length; i++)
				t += e[i] + (0 == (i + 1) % 3 && i + 1 != e.length ? "," : "");
			return t.split("").reverse().join("") + "." + f
		},
		checkEvents: function(a) {
			a = this.componentSetup.monitorFields;
			var b = this.componentSetup.monitorType,
			e = ".monitor_" + (this.componentSetup.fieldId || this.componentSetup.tempId),
			f = $("input[id='" + (this.componentSetup.fieldId || this.componentSetup.tempId) + "'][cid='" + this.cid + "']"),
			g = f.closest(".subtr_js"),
			g = 1 == g.length ? g : f.closest(".form-view"),
					g = 1 > g.length ? $(document) : g;
					g.off(e);
					this.componentSetup.isEdit && (f.keydown(function(a) {
						a = parseInt(a.keyCode);
						var b = $(this).val();
						if ((110 == a || 190 == a) && 0 <= b.indexOf(".") || (109 == a || 173 == a) && 0 <= b.indexOf("-")) return !1
					}), f.keyup(function(a) {
						a = $(this).val();
						isNaN(a) && "-" != a && $(this).val(parseFloat(a));
						"." == a.charAt(0) && $(this).val(0 + parseFloat(a))
					}), f.keyup(function(a) {
						a = $(this).val();
						$(this).val(a.replace(/[^\d.-]/g, ""))
					}), f.blur(function(a) {
						a = $(this).val();
						$(this).val(a.replace(/[^\d.-]/g, ""))
					}));
					this.changeEvent(g, b, a, e)
		},
		changeEvent: function(a, b, e, f) {
			var g = this;
			e && 0 < e.length && $.each(e, function(e, h) {
				"string" == typeof h && (h = JSON.parse(h));
				if ("field" === h.type && 0 > $.inArray(h.value, g.eventFiled) && (g.eventFiled.push(h.value), "number" === b && (a.on("blur" + f, "input[id='" + h.value + "']", function() {
					g.getMonitorValue(h.value)
				}), h.monitorFields && 0 < h.monitorFields.length && g.changeEvent(a, h.monitorType, h.monitorFields, f)), "date" === b)) if ("mobile" == window.systemInfo_form) a.on("monitor_change", "div[fieldId='" + h.value + "'] input", function() {
					g.getMonitorValue(h.value)
				});
				else a.on("change" + f, "div[fieldId='" + h.value + "'] input", function() {
					g.getMonitorValue(h.value)
				})
			})
		},
		empty: function(a) {},
		readOnly: function(a, b) {
			var e = a.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", b);
			b ? (e.addClass("hide"), e.siblings(".j_readOnly").removeClass("hide")) : (e.removeClass("hide"), e.siblings(".j_readOnly").addClass("hide"))
		},
		getFormula: function() {
			var a = "",
			b = [],
			e = this.componentSetup.monitorType;
			"number" === e && ($(".j_choicelistEdit_number li").each(function() {
				var e = $(this);
				if (e.hasClass("j_monitor_item")) {
					var f = e.find("select"),
					h = f.find("option:selected").attr("type");
					"常量" == f.val() ? (f = e.find("select").next().val(), a += f ? f : "0 ", b.push(new l(f ? f : 0, "number"))) : h && 0 < h.length ? (a += e.find(".js_signField").attr("title") + " ", e = $("div[tempId='" + f.val() + "']").data("componentData").componentSetup.monitorFields, b.push(new l(f.val(), "field", e, h))) : (a += e.find(".js_signField").attr("title") + " ", b.push(new l(f.val(), "field")))
				} else if (f = e.find("input:checked").val()) a += f + " ", b.push(new l(f, "operate"));
				else return !1;
				return !0
			}), $("#operate_show").html(a));
			if ("date" === e) {
				b.push(new l($(".j_choicelistEdit_date .j_select_date").val(), "field"));
				var e = $(".j_choicelistEdit_date input[name='operate-type']:checked").val(),
				f = $(".j_choicelistEdit_date .j_number_input").val();
				e && f && (b.push(new l(e, "operate")), b.push(new l(f, "number")));
				this.componentSetup.format = $(".j_operate input[name='format']:checked").val()
			}
			e = $("#widget-control .field-active").data("componentData");
			e.setMonitorFields(b);
			e.changeMonitorsFields(b);
			e.changeClass(b)
		},
		changeClass: function(a) {
			$(".field_js").removeClass("monitor");
			a && 0 < a.length && $.each(a, function(a, b) {
				"string" == typeof b && (b = JSON.parse(b));
				b && "field" === b.type && $("#formContainer_js").find("div[tempId='" + b.value + "']").addClass("monitor")
			})
		},
		changeMonitorsFields: function(a) {
			var b = this.monitors,
			e = this.componentSetup.tempId;
			if (b && 0 < b.length) for (var f = 0; f < b.length; f++) {
				var g = b[f];
				g.changeFields(e, a, g.componentSetup.monitorFields)
			}
		},
		changeFields: function(a, b, e) {
			for (var f = 0; f < e.length; f++) {
				var g = e[f];
				g.value == a ? g.monitorFields = b : g.monitorFields && 0 < g.monitorFields.length && this.changeFields(a, b, g.monitorFields)
			}
		},
		getAllNumberField: function() {
			var a, b, e, f = $("div[tempId='" + this.componentSetup.tempId + "']").closest(".subtr_js");
			1 == f.length ? "number" === this.componentSetup.monitorType ? (a = f.find(".field_js[componentkey=NumberComponent]"), b = f.find(".field_js[componentkey=Money]"), e = f.find(".field_js[componentkey=CodeRule]:not([tempid='" + this.componentSetup.tempId + "'])"), a = $.merge(a, b)) : a = f.find(".field_js[componentkey=DateInterval]") : "number" === this.componentSetup.monitorType ? (a = $("#formContainer_js").find(".field_js[componentkey=NumberComponent]:not(.subtd_js>.field_js)"), b = $("#formContainer_js").find(".field_js[componentkey=Money]:not(.subtd_js>.field_js)"), e = $("#formContainer_js").find(".field_js[componentkey=CodeRule]:not(.subtd_js>.field_js,[tempid='" + this.componentSetup.tempId + "'])"), a = $.merge(a, b)) : a = $("#formContainer_js").find(".field_js[componentkey=DateInterval]:not(.subtd_js>.field_js)");
			var g = "";
			$.each(a, function() {
				var a = $(this),
				b = a.attr("tempid"),
				a = a.find(".widget-title_js").text();
				g += '<option value="' + b + '">' + a + "</option>"
			});
			$.each(this.filterMonitorComponents(e), function() {
				var a = $(this),
				b = a.attr("tempid"),
				c = a.find(".widget-title_js").text(),
				a = a.data("componentData").componentSetup.monitorType;
				g += '<option value="' + b + '" type="' + a + '">' + c + "</option>"
			});
			"number" === this.componentSetup.monitorType && 0 < g.length && (g += '<option value="常量">常量</option>');
			return g
		},
		getMonitorComponents: function(a, b) {
			if (b && 0 < b.length) for (var e = 0; e < b.length; e++) {
				var f = b[e];
				"string" == typeof f && (f = JSON.parse(f));
				"field" == f.type && 0 > $.inArray(f.value, a) && a.push(f.value);
				f && f.monitorFields && this.getMonitorComponents(a, f.monitorFields)
			}
		},
		getFilterMonitorComponents: function() {
			var a = [];
			this.getMonitorComponents(a, this.componentSetup.monitorFields);
			return a
		},
		filterMonitorComponents: function(a) {
			var b = [],
			e = this.componentSetup.tempId;
			if (a && 0 < a.length) for (var f = 0; f < a.length; f++) {
				var g = $(a[f]).data("componentData"),
				k = g.getFilterMonitorComponents();
				0 > $.inArray(e, k) ? b.push(a[f]) : 0 > $.inArray(g, this.monitors) && this.monitors.push(g)
			}
			return b
		},
		check: function(a) {
			$.trim(a.val());
			a.attr("placeholder");
			var b = {};
			b.element = a;
			return b
		},
		getMonitorValue: function(a) {
			var b = this,
			e = this.componentSetup.monitorFields,
			f = this.componentSetup.monitorType,
			g = "",
			k = $("input[id='" + (this.componentSetup.fieldId || this.componentSetup.tempId) + "'][cid='" + this.cid + "']"),
			h = k.closest(".subtr_js"),
			l = 1 == h.length ? h : k.closest(".form-view"),
					n = [];
			e && 0 < e.length && ("number" === f && $.each(e, function(e, f) {
				"string" == typeof f && (f = JSON.parse(f));
				if (f.monitorFields && 0 < f.monitorFields.length) {
					var k = [];
					b.getMonitorComponents(k, f.monitorFields); - 1 < $.inArray(a, k) && l.find("input[id='" + f.value + "']").data("componentData").getMonitorValue(a)
				}
				"field" === f.type && ((k = l.find("input[id='" + f.value + "']")) && 0 < k.length ? (k = k.val(), 0 < k.length && (k = parseFloat(k.replace(/[^\d.-]/g, "")), n.push(k)), k || (k = "0"), k && (0 < g.length ? (g += "(" + k + "))", g = "(" + g) : g += k)) : 0 < g.length && (g = g.substring(0, g.length - 1)));
				"operate" === f.type && f.value && g && 0 < g.length && (g += f.value);
				"number" === f.type && f.value && (0 < g.length ? (g += "(" + f.value + "))", g = "(" + g) : g += f.value)
			}), "date" === f && (isCount = !1, $.each(e, function(a, c) {
				"string" == typeof c && (c = JSON.parse(c));
				if ("field" === c.type) {
					var e = l.find("div[fieldId='" + c.value + "']"),
					f = e.find("input:first").val(),
					e = e.find("input:last").val();
					if (f && e) isCount = !0, f = (new Date(Date.parse(f.replace(" ", "T")))).getTime(), g = (new Date(Date.parse(e.replace(" ", "T")))).getTime() - f, b.componentSetup.format && (g = b.getDateValue(g, b.componentSetup.format));
					else return g = "", !1
				}
				"operate" === c.type && c.value && (b.componentSetup.format ? g && 0 < g.length && (g += c.value) : g = b.getDateValue(g, c.value));
				"number" === c.type && c.value && (0 < g.length ? (g += "(" + c.value + "))", g = "(" + g) : g += c.value)
			})));
			g && 0 < g.length && (g = -1 < (eval(g) + "").indexOf("Infinity") ? 0 : eval(g), g = isNaN(g) ? 0 : g, 0 < (g + "").length && (g = (new Number(g)).toFixed(b.getMaxPlace(n))), k.val(g));
			1 == h.length && h.closest(".subtable_js").data("componentData").countTotal(k)
		},
		submitCheck: function(a, b) {
			var e = this.check(a);
			b(e)
		},
		getMaxPlace: function(a) {
			var b = 0;
			if (a && 0 < a.length) for (var e = 0; e < a.length; e++) {
				var f = 0,
				f = a[e] + ""; - 1 < f.indexOf(".") && f.indexOf(".") != f.length - 1 && (f = f.substring(f.indexOf(".") + 1).length, b = f > b ? f : b)
			}
			return 0 == b ? 2 : b
		}
	});
	n.exports = window.CodeRule
});
define("form/component/tablelayout", ["form/component", "form/tplutil", "table"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	/* 貌似"form/component/table"模块根本没有定义，应该是table.js才对，这里先注释掉试试
	h("form/component/table");
	*/
	window.TableLayout = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "TableLayout",
				layoutDetail: [],
				order: 0,
				index: 0,
				rows: 4,
				cols: 3,
				thArray: [],
				tableId: ""
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.layoutDetail = b.layoutDetail, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.rows = b.rows, this.componentSetup.cols = b.cols, this.componentSetup.thArray = b.thArray, this.componentSetup.tableId = b.tableId);
			this.tpl = l.get("tablelayout")
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#table-layout");
			b.attr("class", a.attr("class"));
			b.html(a.html());
			this.table = b.find(".j_table").table({
				rows: this.componentSetup.rows,
				cols: this.componentSetup.cols,
				afterCreateCell: function(a, b) {
					/*
						创建单元格之后触发afterCreateCell事件，
						这个事件在formlayout模块里面，负责重置设计区的拖放区域
					*/
					$(document).trigger("afterCreateCell", {
						cell: b
					})
				},
				beforeChangeCell: function(a, b) {
					return !0
				},
				afterChangeWidth: function(a, d) {
					/*
						每次添加或者删除单元格之后重新计算整个表格的宽度，
						要是比设计区宽就会添加滚动条，挪动一下工具条不被滚动条挡住
					*/
					if (d && 0 < d.length) {
						for (var e = 0, f = 0; f < d.length; f++)
						e += ~~d[f];
						e > $(".form-view").width() - 2 ? b.find(".form-layout-toolbar").css("margin-bottom", "17px") : b.find(".form-layout-toolbar").css("margin-bottom", "0px")
					}
				},
				afterDeleteCol: function(a) {
					0 == a.options.cols && a.$table.closest(".").remove()
				},
				afterDeleteRow: function(a) {
					0 == a.options.rows && a.$table.closest(".table_layout_js").remove()
				}
			})
		},
		renderEditor: function() {
			console.log("布局控件没有renderEditor方法不能被选中")
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl),
				e = this.componentSetup.layoutDetail;
			if ("mobile" != window.systemInfo_form) {
				d = d.siblings("#preview-tablelayout");
				b.append(d);
				var f = this.componentSetup.rows,
					g = $("<table class='table table-bordered'></table>");
				d.find(".j_tablelayout").append(g);
				if (f && 0 < f) for (var k = 0; k < f; k++)
				g.append($("<tr class=''></tr>"));
				if (e && 0 < e.length) for (k = 0; k < e.length; k++) {
					var f = e[k],
						h = Number(f.width) + Number(20);
					if (f && 0 < f.rowSpan && 0 < f.colSpan) {
						var h = $("<td rowspan='" + f.rowSpan + "' colspan='" + f.colSpan + "' style='width:" + (h || "255") + "px'></td>"),
							l = f.coordinate.split("_")[0];
						g.find("tr").eq(~~l).append(h);
						if(f.layoutDetail && 0 < f.layoutDetail.length) {
							f = new window[f.layoutDetail[0].componentKey](f.layoutDetail[0]);
							f.renderPreview(h, a, c)
							f.checkEvents(function(a) {
								formPlugin.checkPrompt(a)
							})
						}
					}
				}
				d.attr("id", "");
				d.attr("cid", this.cid)
			} else if (e && 0 < e.length) for (k = 0; k < e.length; k++)
			f = e[k], f.layoutDetail && 0 < f.layoutDetail.length && (f = new window[f.layoutDetail[0].componentKey](f.layoutDetail[0]), f.renderPreview(b.closest(".j_formpreview"), a, c), f.checkEvents(function(a) {
				formPlugin.checkPrompt(a)
			}));
			this.el = b
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#table-layout");
			this.table = a.find(".j_table").table({
				rows: this.componentSetup.rows,
				cols: this.componentSetup.cols,
				tdArray: this.componentSetup.layoutDetail,
				thArray: this.componentSetup.thArray,
				afterCreateCell: function(a, b) {
					$(document).trigger("afterCreateCell", {
						cell: b
					})
				},
				beforeChangeCell: function(a, b) {
					return !0
				},
				afterCreateBodyTd: function(a, b, e) {
					e.layoutDetail && 0 < e.layoutDetail.length && (new window[e.layoutDetail[0].componentKey](e.layoutDetail[0])).renderEditPreview(b)
				},
				afterChangeWidth: function(b, d) {
					if (d && 0 < d.length) {
						for (var e = 0, f = 0; f < d.length; f++)
						e += ~~d[f];
						e > $(".form-view").width() ? a.find(".form-layout-toolbar").css("margin-bottom", "17px") : a.find(".form-layout-toolbar").css("margin-bottom", "0px")
					}
				},
				afterDeleteCol: function(a) {
					0 == a.options.cols && a.$table.closest(".table_layout_js").remove()
				},
				afterDeleteRow: function(a) {
					0 == a.options.rows && a.$table.closest(".table_layout_js").remove()
				}
			});
			a.attr("id", "");
			a.attr("cid", this.cid);
			a.data("componentData", this);
			b.append(a)
		},
		getTableSerialize: function(b, a) {
			var c = this.table,
				d = c.persist.storage,
				e = c.options,
				f = [],
				g = [];
			if (d && 0 < d.length) for (var k = 0; k < d.length; k++) {
				var h = k,
					l = d[k];
				if (l && 0 < l.length) for (var n = 0; n < l.length; n++) {
					var m = l[n],
						r = {
							coordinate: h + e.separator + n,
							rowSpan: 0,
							colSpan: 0,
							width: null,
							height: null
						};
					if (m) {
						r.rowSpan = m.rowSpan;
						r.colSpan = m.colSpan;
						r.width = $(m).width();
						r.height = $(m).height();
						var m = b.assemComponent(a, $(m).find(".field_js")),
							w = [];
						null != m && w.push(m.componentSetup);
						r.componentKey = "TdLayout";
						r.layoutDetail = w
					}
					f.push(r)
				}
			}(c = c.$table.find("thead th")) && 0 < c.length && c.each(function() {
				g.push($(this).width() + 17)
			});
			this.componentSetup.layoutDetail = f;
			this.componentSetup.rows = e.rows;
			this.componentSetup.cols = e.cols;
			this.componentSetup.thArray = g
		},
		maximize: function() {
			var b = this,
				a = this.cid,
				c = $(this.tpl).siblings("#tableMaximize").clone();
			$("body").append("<div id='" + a + "'></div>");
			$("#" + a).append(c);
			var d = $("[cid=" + this.cid + "]"),
				c = $("#" + a + " #tableMaximize #maximizePreview");
			formPlugin.analyseComponent(this.componentSetup, c, null, this.isReadOnly);
			var e = formPlugin.assembleFormFieldData(d);
			formPlugin.fillFieldContent(e, c);
			formPlugin.setFormReadOnly({
				parentEl: c,
				readOnly: this.isReadOnly
			});
			c.on("input propertychange change", "input", function() {
				var a = $(this),
					b;
				if ("DateInterval" == a.attr("componentkey")) {
					b = a.parent().attr("name");
					var c = d.find("div[name='" + b + "']").find("input")
				} else b = a.closest(".field_js").attr("fieldid"), c = d.find("input[id='" + b + "']");
				b && c.val(a.val()).blur().change()
			});
			$("#tableMaximize").modal();
			$("#" + a).find(".j_maximize").remove();
			$("#" + a).on("hidden.bs.modal", function() {
				$(this).find("#tableMaximize").length && b.minimize();
				$(this).remove()
			})
		},
		minimize: function() {
			var b = $("[cid=" + this.cid + "]"),
				a = $("#tableMaximize .modal-body");
			formPlugin.destroyEvents(a);
			a = formPlugin.assembleFormFieldData(a);
			formPlugin.setEmpty(b);
			formPlugin.fillFieldContent(a, b.parent());
			this.saveComponentValue(b)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			this.checkCallback = b;
			c.on("click", "[cid=" + a.cid + "] .j_maximize", function() {
				a.maximize()
			})
		},
		readOnly: function(b, a) {
			console.error("you need to rewrite the method : readOnly")
		}
	});
	n.exports = TableLayout
});
define("form/component/datatable", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.DataTable = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "DataTable",
				subFormId: "",
				title: "",
				describe: "",
				layoutDetail: [],
				defaultRows: "3",
				order: 0,
				index: 0
			};
			null != b && (this.componentSetup.subFormId = b.subFormId, this.componentSetup.title = b.title, this.componentSetup.describe = b.describe, this.componentSetup.layoutDetail = b.layoutDetail, this.componentSetup.defaultRows = b.defaultRows, this.componentSetup.order = b.order, this.componentSetup.index = b.index);
			this.checkCallback = null;
			this.tpl = l.get("datatable")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setDefaultRows: function(b) {
			this.componentSetup.defaultRows = b
		},
		filterItme: {
			DividingLine: !1,
			Paragraph: !1,
			ColumnPanel: !1
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-datatable");
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-datatable");
			b.find("#component-title-datatable").attr("value", this.componentSetup.title);
			b.find("#component-describe-datatable").text(this.componentSetup.describe);
			$("#editor-component").html(b.html());
			$("#editor-component #datatable-defaultRows").val(this.componentSetup.defaultRows)
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl),
				e = d.siblings("#preview-datatable");
			"mobile" == window.systemInfo_form && (e = d.siblings("#mobile-preview"));
			e.find(".j_datatableTitle").text(this.componentSetup.title);
			this.componentSetup.describe && "" != this.componentSetup.describe && (e.find(".j_datatableDescription").text(this.componentSetup.describe), e.find(".j_datatableDescription").removeClass("hide"));
			this.componentSetup.title && "" != this.componentSetup.title && (e.find(".j_datatableTitle").text(this.componentSetup.title), e.find(".j_datatableTitle").removeClass("hide"));
			window.systemInfo_print && e.find(".j_setFiled").removeClass("hide");
			$("#formEdit_js").get(0) ? e.find(".j_maximize ").remove() : e.find(".j_datatableTitle").removeClass("hide");
			e.attr("id", null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId);
			e.attr("cid", this.cid);
			var f = this.componentSetup.layoutDetail;
			this.notDefault = a;
			this.isReadOnly = c;
			if ("mobile" != window.systemInfo_form) {
				a = d.siblings("#operating-datatable");
				for (var d = $("<tr class='subtr_js'>"), g = 0; g < f.length; g++) {
					var k = $("<th class='subtd_js'>"),
						h = f[g];
					k.append($("<label class='widget-title'>").append(h.title));
					"true" != h.required && 1 != h.required || k.find("label").append($("<span class='c-danger'>").append("*"));
					d.append(k);
					g != f.length - 1 || this.isReadOnly || (k = a.find(".subtradd_js").clone(), d.append(k))
				}
				3 <= f.length && e.find(".subtable_js").addClass("one-three");
				e.find(".subtable_js").append(d)
			} else {
				d = $("<tr class='subtr_js'>");
				for (g = 0; g < f.length; g++)
				k = $("<th class='subtd_js'>"), h = f[g], k.append($("<label class='widget-title'>").append(h.title)), "true" != h.required && 1 != h.required || k.find("label").append($("<span class='c-danger'>").append("*")), d.append(k);
				e.find(".subtable_js").append(d);
				f = f.length;
				a = e.find(".subtable_js .subtd_js");
				d = parseInt($(window).width() / 2);
				1 < f && 2 >= f ? (a.css("min-width", d + "px"), a.find("label").css("max-width", d - 2 + "px")) : 2 < f && (d = parseInt($(window).width() / 3), a.css("min-width", d + "px"), a.find("label").css("max-width", d - 2 + "px"));
				3 < f && e.find(".j_arrow-right").removeClass("hide");
				e.find(".j_subFormTitle").removeClass("hide").text(this.componentSetup.title);
				this.componentSetup.describe && "" != this.componentSetup.describe ? e.find(".j_subFormDesc").removeClass("hide").text(this.componentSetup.describe) : e.find(".j_subFormDesc").addClass("hide")
			}
			e.find(".subtable_js").data("componentData", this);
			this.el = b;
			b.append(e);
			"mobile" == window.systemInfo_form && c && b.find("#" + this.componentSetup.subFormId + " .j_mobileSubadd").remove();
			this.addTotalRow(b)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-datatable");
			a.find(".j_datatableTitle").text(this.componentSetup.title);
			this.componentSetup.describe && "" != this.componentSetup.describe && (a.find(".j_datatableDescription").text(this.componentSetup.describe), a.find(".j_datatableDescription").removeClass("hide"));
			this.componentSetup.title && "" != this.componentSetup.title && (a.find(".j_datatableTitle").text(this.componentSetup.title), a.find(".j_datatableTitle").removeClass("hide"));
			a.attr("id", null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId);
			a.attr("cid", this.cid);
			var c = a.find("tr.subtr_js");
			c.html("");
			for (var d = this.componentSetup.layoutDetail, e = 0; e < d.length; e++) {
				var f = d[e],
					g = $("<td class='subtd_js' style='height: 71px;'>");
				(new window[f.componentKey](f)).renderEditPreview(g);
				c.append(g)
			}
			3 <= d.length && a.find(".subtable_js").addClass("one-three");
			a.data("componentData", this);
			b.append(a);
			/msie 9\.0/i.test(window.navigator.userAgent.toLowerCase()) && a.find(".subtable_js .subtd_js").hover(function() {
				var a = $(this).parents(".form-databox"),
					b = $(this).parents(".subtable_js");
				a.height(b.height() + 17)
			})
		},
		formatMoney: function(b, a) {
			a = 2 < a && 20 >= a ? a : 2;
			b = parseFloat((b + "").replace(/[^\d\.-]/g, "")).toFixed(a) + "";
			var c = b.split(".")[0].split("").reverse(),
				d = b.split(".")[1];
			t = "";
			for (i = 0; i < c.length; i++)
			t += c[i] + (0 == (i + 1) % 3 && i + 1 != c.length ? "," : "");
			return t.split("").reverse().join("") + "." + d
		},
		submitCheck: function(b, a) {},
		countTotal: function(b) {
			var a = b.attr("name"),
				c = b.attr("componentKey");
			b = b.parents(".subform_js");
			var d = b.find('input[name="' + a + '"]'),
				e, d = new String(formPlugin.calculateTotal(d));
			"Money" === c && (0 < d.length && (e = this.formatMoney(d, 0 < d.indexOf(".") ? d.length - (d.indexOf(".") + 1) : -1)), "人民币" == b.find('span[name="' + a + '"]').attr("tp") && (b.find('span[name="' + a + '"]').attr("type", "Money"), d = e + " " + ("" == this.numberToChinese(d) ? this.numberToChinese(d) : "(" + this.numberToChinese(d) + ")")));
			b.find('span[name="' + a + '"]').html(d)
		},
		numberToChinese: function(b) {
			var a = "";
			0 == b.indexOf("-") && (a += "负", b = b.substring(1));
			strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
			b += "00";
			var c = b.indexOf(".");
			0 <= c && (b = b.substring(0, c) + b.substr(c + 1, 2));
			strUnit = strUnit.substr(strUnit.length - b.length);
			for (c = 0; c < b.length; c++)
			a += "零壹贰叁肆伍陆柒捌玖".substr(b.substr(c, 1), 1) + strUnit.substr(c, 1);
			return a.replace(/零分$/, "").replace(/零角零分$/, "").replace(/零[仟佰拾]/g, "零").replace(/零{2,}/g, "零").replace(/零([亿|万])/g, "$1").replace(/零+元/, "元").replace(/亿零{0,3}万/, "亿").replace(/^元/, "零元").replace(/零角$/, "").replace(/零元$/, "")
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			this.checkCallback = b;
			var d = null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId;
			if ("mobile" != window.systemInfo_form) {
				b = this.componentSetup.defaultRows;
				isNaN(b) && (b = 3);
				for (var e = 0; e < b; e++)
				this.addRow()
			}
			c.find("#" + d).on("blur", "input[componentKey='Money'],input[componentKey='Monitor'],input[componentKey='NumberComponent']", function() {
				a.countTotal($(this))
			});
			c.on("click", "#" + d + "[cid=" + a.cid + "] .subtradd_js a", function() {
				a.addRowNumber || (a.addRowNumber = 0);
				a.addRowNumber++;
				a.addRow()
			});
			c.on("click", "#" + d + "[cid=" + a.cid + "] .subtrdel_js a", function() {
				a.removeRow($(this))
			});
			c.on("click", "#" + d + "[cid=" + a.cid + "] .j_maximize", function() {
				a.maximize()
			});
			c.on("click", "#" + d + "[cid=" + a.cid + "] .j_setFiled", function() {
				a.setupFields()
			});
			$("body").off("change", "#setupFields .j_column").on("change", "#setupFields .j_column", function() {
				var b = $(this).data("field"),
					c = $(this).parents(".checkbox").index();
				$(this).is(":checked") ? ($("#" + d + "[cid=" + a.cid + "] table tr").each(function() {
					$(this).find("th,td").eq(c).addClass("hide")
				}), b.isHide = !0) : (b.isHide = !1, $("#" + d + "[cid=" + a.cid + "] table tr").each(function() {
					$(this).find("th,td").eq(c).removeClass("hide")
				}));
				$("#" + d + "[cid=" + a.cid + "] table tr").find("td,th").attr("style", "");
				$("#" + d + "[cid=" + a.cid + "] table tr").each(function() {
					$(this).find("th:not('.hide'):last,td:not('.hide'):last").css("border-right", "none")
				});
				$("#" + d + "[cid=" + a.cid + "] table tfoot").removeClass("hide");
				var e = !0;
				$("#" + d + "[cid=" + a.cid + "] table tfoot").find("td:visible").each(function() {
					if ($(this).text().trim()) return e = !1
				});
				e ? $("#" + d + "[cid=" + a.cid + "] table tfoot").addClass("hide") : $("#" + d + "[cid=" + a.cid + "] table tfoot").removeClass("hide")
			});
			/msie 9\.0/i.test(window.navigator.userAgent.toLowerCase()) && $("#" + d + "[cid=" + a.cid + "] .subtable_js .subtd_js").hover(function() {
				var a = $(this).parents(".form-databox"),
					b = $(this).parents(".subtable_js");
				a.height(b.height() + 17)
			});
			if ("mobile" == window.systemInfo_form && (c.on("tap", "#" + d + "[cid=" + a.cid + "] .j_mobileSubadd", function() {
				a.mobilefillDetail()
			}), $("body").on("tap", "#j_confirmAdd" + d + "[cid=" + a.cid + "]", function() {
				var b = $(this).attr("index"),
					c = $("#mobile-subFillDetail #subForm-fill-detail"),
					d = $(this).attr("cid"),
					d = $('.j_formpreview div[cid="' + d + '"]');
				formPlugin.submitCheck(c) ? (b ? a.mobileAddRow(b) : (a.addRow(), a.mobileAddRow(), d.find("tfoot").remove(), a.addTotalRow()), formPlugin.renderTotal(d), a.createSerial(), a.initPage(), window.form_error = !1) : window.form_error = !0
			}), $("body").on("tap", "#j_continueSave" + d + "[cid=" + a.cid + "]", function() {
				$(this).parents("#mobile-subFillDetail").find("#j_confirmAdd" + d + "[cid=" + a.cid + "]").trigger("tap");
				window.form_error || $(".j_formpreview").find("#" + d + "[cid=" + a.cid + "] .j_mobileSubadd").trigger("tap")
			}), $("body").on("tap", ".j_cancelAdd", function() {
				a.initPage()
			}), $("body").on("tap", "#j_deleteSubForm" + d + "[cid=" + a.cid + "]", function() {
				var b = $(this).data("removerEl");
				a.removeRow(b.find(".subtd_js").eq(0));
				a.createSerial();
				a.initPage()
			}), $("#" + d + "[cid=" + a.cid + "] .j_scrollSubform").scroll(function() {
				var a = $(this).scrollLeft(),
					b = this.offsetWidth,
					c = this.scrollWidth;
				0 == a ? $(this).find(".j_arrow-left").addClass("hide") : $(this).find(".j_arrow-left").removeClass("hide");
				c == a + b ? $(this).find(".j_arrow-right").addClass("hide") : $(this).find(".j_arrow-right").removeClass("hide")
			}), c.on("tap", "#" + d + "[cid=" + a.cid + "] .j_arrow-right", function() {
				var a = $(this).parents(".j_scrollSubform").get(0),
					b = a.offsetWidth,
					a = a.scrollWidth;
				$(this).parents(".j_scrollSubform").scrollLeft(a - b)
			}), c.on("tap", "#" + d + "[cid=" + a.cid + "] .j_arrow-left", function() {
				var a = $(this).parents(".j_scrollSubform").get(0),
					b = a.offsetWidth,
					a = a.scrollWidth;
				$(this).parents(".j_scrollSubform").scrollLeft(b - a)
			}), !a.isReadOnly)) c.on("tap", "#" + d + "[cid=" + a.cid + "] .subtable_js .subtr_js:not(:eq(0))", function() {
				$("#mobile-subFillDetail").remove();
				var b = a.componentSetup.subFormId,
					c = $(this).attr("index");
				a.mobilefillDetail(c);
				c = formPlugin.assembleFormFieldData($(this));
				if (null != c) for (var d = 0; d < c.length; d++)
				c[d].subForm = null;
				d = $("#mobile-subFillDetail");
				d.find(".j_continueSave").attr("id", "j_deleteSubForm" + b).attr("cid", a.cid).data("removerEl", $(this)).text("删除");
				formPlugin.fillFieldContent(c, d)
			})
		},
		addRow: function() {
			for (var b = null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId, a = this.checkCallback, c = this.componentSetup.layoutDetail, d = $(this.tpl).siblings("#operating-datatable"), e = $("<tr class='subtr_js'>"), f = [], g = 0; g < c.length; g++) {
				var k = c[g],
					h = $("<td class='subtd_js'>"),
					k = new window[k.componentKey](k);
				k.renderPreview(h, this.notDefault, this.isReadOnly);
				f[g] = k;
				e.append(h);
				g != c.length - 1 || this.isReadOnly || (h = d.find(".subtrdel_js").clone(), e.append(h))
			}
			e.find(".widget-title_js").parent().remove();
			e.find(".field-description").remove();
			$("#" + b + "[cid=" + this.cid + "] tbody").append(e);
			for (g = 0; g < f.length; g++)
			k = f[g], k.checkEvents(a)
		},
		removeRow: function(b) {
			var a = !1;
			formPlugin.destroyEvents(b.parents(".subtr_js"));
			b.parents(".subtr_js").find(".field_js").each(function(b) {
				null != $(this).find(".check_js").data("componentData").oldValue && (a = !0)
			});
			var c = b.parents(".subform_js");
			b.parents(".subtr_js").remove();
			a && (this.removeRowNumber || (this.removeRowNumber = 0), this.removeRowNumber++, this.saveComponentValue(c));
			formPlugin.renderTotal(c)
		},
		readOnly: function(b, a) {
			var c = b.find("#" + (null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId) + "[cid=" + this.cid + "] .subtable_js");
			if (this.isReadOnly = a) c.find(".subtr_js .subtradd_js").remove(), c.find(".subtr_js .subtrdel_js").remove();
			else if (null == c.find(".subtr_js .subtradd_js").get(0)) {
				var d = $(this.tpl).siblings("#operating-datatable"),
					e = d.find(".subtradd_js").clone(),
					d = d.find(".subtrdel_js").clone();
				c.find(".subtr_js").eq(0).append(e);
				c.find(".subtr_js").not(":eq(0)").append(d);
				c.find("tfoot tr").append('<td class="subtrdel_js"></td>')
			}
		},
		maximize: function() {
			var b = this,
				a = null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId,
				c = a + this.cid,
				d = $(this.tpl).siblings("#datatableMaximize").clone();
			$("body").append("<div id='" + c + "'></div>");
			$("#" + c).append(d);
			var d = $("#" + a + "[cid=" + this.cid + "]"),
				e = d.find("tbody tr").length - 1,
				c = $("#datatableMaximize #maximizePreview");
			formPlugin.analyseComponent(this.componentSetup, c, null, this.isReadOnly);
			formPlugin.subFormFillRows([{
				maxIndex: e,
				subFormId: a
			}], c);
			d = formPlugin.assembleFormFieldData(d);
			formPlugin.fillFieldContent(d, c);
			formPlugin.setFormReadOnly({
				parentEl: c,
				readOnly: this.isReadOnly
			});
			$("#datatableMaximize").modal();
			$("#" + a + b.cid).on("hidden.bs.modal", function() {
				$(this).find("#datatableMaximize").length && b.minimize();
				$(this).remove()
			})
		},
		minimize: function() {
			var b = null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId,
				a = $("#" + b + "[cid=" + this.cid + "]"),
				c = $("#datatableMaximize .modal-body");
			formPlugin.destroyEvents(c);
			var d = formPlugin.assembleFormFieldData(c);
			formPlugin.setEmpty(a);
			c = c.find("tbody tr").length - 1;
			formPlugin.subFormFillRows([{
				maxIndex: c,
				subFormId: b
			}], a.parent());
			formPlugin.fillFieldContent(d, a.parent());
			this.saveComponentValue(a)
		},
		setupFields: function() {
			var b = this.componentSetup.layoutDetail,
				a = $(this.tpl).siblings("#preview-filed");
			$("body").append("<div id='setupFields'></div>");
			$("#setupFields").append(a);
			for (var c = 0; c < b.length; c++) {
				var d = b[c],
					e = a.find("#columnFiledsClone li").clone(),
					f = e.find(".j_column"),
					g = e.find(".j_filedName");
				d.isHide && (f.attr("checked", !0), f.get(0).checked = !0);
				f.data("field", d);
				g.html(d.title);
				a.find("#columnFileds").append(e)
			}
			$("#preview-filed").modal()
		},
		addTotalRow: function(b) {
			for (var a = this.componentSetup.layoutDetail, c = [], d = 0; d < a.length; d++) {
				var e = a[d],
					f = e.componentKey,
					g = e.fieldId,
					k = e.order,
					h = {
						fieldId: g,
						order: k,
						componentKey: f,
						type: e.type
					};
				"Money" != f && "NumberComponent" != f && "Monitor" != f || c.push(h)
			}
			if (c && 0 < c.length) {
				e = $("<tfoot><tr></tr></tfoot>");
				for (d = 0; d < a.length; d++)
				e.find("tr").append("<td></td>");
				"mobile" == window.systemInfo_form || this.isReadOnly || e.find("tr").append('<td class="subtrdel_js"></td>');
				for (d = 0; d < c.length; d++)
				h = c[d], g = h.fieldId, k = h.order, f = h.componentKey, a = h.type, e.find("td").eq(k).html("合计：<span name=" + g + " type=" + f + " tp=" + a + ">0</span>");
				"mobile" != window.systemInfo_form ? b.find('div[cid="' + this.cid + '"]').find(".subtable_js").append(e) : $('.j_formpreview div[cid="' + this.cid + '"]').find(".subtable_js").append(e)
			}
		},
		mobilefillDetail: function(b) {
			var a = this.componentSetup.subFormId,
				c = this.cid;
			$("#flow-info,#preview_m,#datareport-info,#biaogeform-container").addClass("hide");
			for (var d = $(this.tpl).siblings("#mobile-subFillDetail"), e = this.checkCallback, f = this.componentSetup.layoutDetail, g = $('<div id="subForm-fill-detail"></div>'), k = [], h = 0; h < f.length; h++) {
				var l = f[h],
					l = new window[l.componentKey](l);
				l.renderPreview(g, this.notDefault, !1);
				k[h] = l
			}
			d.append(g);
			$("body").append(d);
			for (h = 0; h < k.length; h++)
			l = k[h], l.checkEvents(e);
			b ? $("#mobile-subFillDetail .j_confirmAdd").attr("index", b) : $("#mobile-subFillDetail .j_confirmAdd").removeAttr("index");
			$("#mobile-subFillDetail .j_moblieSubForm .j_continueSave").attr("id", "j_continueSave" + a).attr("cid", c);
			$("#mobile-subFillDetail .j_confirmAdd").attr("id", "j_confirmAdd" + a).attr("cid", c)
		},
		mobileAddRow: function(b) {
			var a = this,
				c = formPlugin.assembleFormFieldData($("#mobile-subFillDetail #subForm-fill-detail")),
				d = $(".j_formpreview #" + a.componentSetup.subFormId + " .subtable_js .subtr_js"),
				e = null,
				e = b ? d.eq(b) : d.eq(d.length - 1);
			e.find(".subtrdel_js").remove();
			e.find(".check_js").each(function(b) {
				b = $(this).data("componentData");
				var c = $(this).parents(".subtd_js");
				c.empty();
				b.renderPreview(c, a.notDefault, a.isReadOnly);
				c.find(".widget-title").remove()
			});
			formPlugin.fillFieldContent(c, e);
			e.find(".widget-content").siblings(".j_subField").remove();
			e.find(".widget-content").addClass("hide");
			for (b = 0; b < c.length; b++) {
				var f = c[b],
					d = f.content,
					g = f.dataText,
					k = f.dataOptions,
					f = e.find("#" + f.formField.id).parents(".widget-content");
				f.parent().append('<div class="j_subField"></div>');
				f.addClass("hide");
				f = f.next();
				if (k) for (var h = 0; h < k.length; h++) {
					var l = k[h].content,
						n = k[h].type,
						m = k[h].optionId;
					console.log(n);
					n && "imageFile" == n ? f.append('<img src="/base/download/img/' + m + '/small">') : f.append("<span class='mr-10'>" + l + "</span>")
				}
				d && f.append("<span class='mr-10'>" + d + "</span>");
				g && g.content && f.append("<span>" + g.content + "</span>")
			}
			null == e.find(".j_subField").get(0) && e.remove()
		},
		createSerial: function() {
			$("#" + this.componentSetup.subFormId + "[cid=" + this.cid + "] .subtable_js .subtr_js").not(":eq(0)").each(function(b) {
				$(this).attr("index", b + 1);
				$(this).find(".subtd_js .check_js").removeClass("date-selected");
				$(this).find(".subtd_js .check_js input").removeClass("date-selected");
				$(this).find(".subtd_js .check_js .js_useritem_container").removeClass("entity-seleted")
			})
		},
		initPage: function() {
			$("#flow-info,#preview_m,#datareport-info,#biaogeform-container").removeClass("hide");
			$("body #mobile-subFillDetail").remove()
		},
		getValue: function(b) {
			b = {
				title: this.componentSetup.title,
				subFormId: this.componentSetup.subFormId,
				removeRowNumber: this.removeRowNumber,
				addRowNumber: this.addRowNumber
			};
			this.removeRowNumber = this.removeRowNumber = 0;
			return b
		}
	});
	n.exports = window.DataTable
});
define("form/component/checkbox", ["form/component", "form/tplutil", "form/component/option"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil"),
		b = h("form/component/option");
	window.CheckBox = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "CheckBox",
				title: "复选框",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				layout: "choicelist-inline",
				options: []
			};
			var c = new b;
			c.setName("选项1");
			c.setOrder(0);
			var d = new b;
			d.setName("选项2");
			d.setOrder(1);
			var e = new b;
			e.setName("选项3");
			e.setOrder(2);
			this.componentSetup.options[0] = c.componentSetup;
			this.componentSetup.options[1] = d.componentSetup;
			this.componentSetup.options[2] = e.componentSetup;
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.layout = a.layout, this.componentSetup.options = a.options);
			this.tpl = l.get("checkbox")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setLayout: function(a) {
			this.componentSetup.layout = a
		},
		setOptions: function(a) {
			this.componentSetup.options = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-checkbox");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			var d = c.find(".choicelist_js");
			d.addClass(this.componentSetup.layout);
			for (var e = 0; e < this.componentSetup.options.length; e++)(new b(this.componentSetup.options[e])).render(d, this);
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-checkbox");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			a.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			a.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", "true");
			for (var c = a.find("ul.choicelistEdit_js"), d = 0; d < this.componentSetup.options.length; d++) {
				var e = this.componentSetup.options[d];
				(new b(e)).renderEditor(c, this);
				"true" != e.other && 1 != e.other || a.find(".btn-default_js").parent().hide()
			}
			$("#editor-component").html(a.html())
		},
		change: function(a) {
			var b = a.oldObj;
			a = a.changeEl;
			this.componentSetup.title = b.componentSetup.title;
			this.componentSetup.describe = b.componentSetup.describe;
			this.componentSetup.order = b.componentSetup.order;
			this.componentSetup.index = b.componentSetup.index;
			this.componentSetup.required = b.componentSetup.required;
			this.componentSetup.fieldId = b.componentSetup.fieldId;
			this.componentSetup.layout = null == b.componentSetup.layout || "" == b.componentSetup.layout ? "choicelist-inline" : b.componentSetup.layout;
			this.componentSetup.options = b.componentSetup.options;
			this.render(a);
			this.renderEditor();
			a.addClass("field-active")
		},
		renderPreview: function(a, c, d) {
			var e = $(this.tpl).siblings("#preview-checkbox");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".form-control").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			e.attr("id", "field_" + this.componentSetup.fieldId).attr("cid", this.cid);
			var f = e.find(".choicelist_js");
			f.addClass(this.componentSetup.layout);
			for (var g = 0; g < this.componentSetup.options.length; g++)(new b(this.componentSetup.options[g])).renderPreview(f, this);
			e.find(".check_js").attr("id", this.componentSetup.fieldId);
			e.find(".check_js").data("componentData", this);
			d && e.find(".check_js input").attr("disabled", !0);
			c && e.find(".check_js input:checkbox").attr("checked", !1);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, d);
			this.el = a;
			a.append(e);
			this.getValue(e)
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-checkbox");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.find(".form-control").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			c.attr("id", "field_" + this.componentSetup.fieldId);
			var d = c.find(".choicelist_js");
			d.addClass(this.componentSetup.layout);
			for (var e = 0; e < this.componentSetup.options.length; e++)(new b(this.componentSetup.options[e])).render(d, this);
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		renderStatSearch: function(a) {
			var b = a.parentEl;
			$.ajax({
				type: "get",
				url: "/formdatastat/getFiledOptions.json",
				dataType: "json",
				data: {
					fieldId: a.fieldId
				},
				success: function(a) {
					html = '<select class="form-control sch-item j_fieldOption"><option value="eq">等于</option><option value="neq">不等于</option></select>';
					for (var e = '<select class="form-control j_resultList"><option>请选择</option>', f = 0; f < a.fieldOptions.length; f++)
					var g = a.fieldOptions[f],
						e = e + ("<option id=" + g.id + ">" + g.name + "</option>");
					html += e + '</select><div class="j_selected entity-container sch-item"></div><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a>';
					b.attr("class", "sch-group j_formFieldSearchGroup");
					b.find(".j_formField-condition").html(html)
				}
			})
		},
		submitCheck: function(a, b) {
			var d = this.check(a);
			b(d)
		},
		checkEvents: function(a) {
			var b = this,
				d = b.el || $(document);
			d.on("change", "input:checkbox[name='" + b.componentSetup.fieldId + this.cid + "']", function() {
				var d = $(this).parents(".check_js"),
					f = $(this).data("componentData");
				if ("true" == f.componentSetup.other || 1 == f.componentSetup.other) $(this).is(":checked") ? d.find("input:text").attr("disabled", !1).show() : d.find("input:text").attr("disabled", !0).hide();
				d = b.check(d);
				a(d);
				null == d.message && b.saveComponentValue($(this))
			});
			d.on("change", "#field_" + b.componentSetup.fieldId + "[cid='" + this.cid + "'] input:text", function() {
				var a = $(this).val();
				null != a && "" != $.trim(a) && b.saveComponentValue($(this))
			})
		},
		check: function(a) {
			var b = a.find("input:checkbox[name='" + this.componentSetup.fieldId + this.cid + "']:checked").val(),
				d = {};
			d.element = a;
			"" != b && null != b || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			return d
		},
		getValue: function(a) {
			var b = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			},
				d = 0,
				e = [],
				f = "";
			a.find("li").each(function(b) {
				var c = $(this).find("input:checkbox");
				b = c.val();
				if (c.is(":checked")) {
					var h = "",
						c = c.data("componentData"),
						h = "true" == c.componentSetup.other || 1 == c.componentSetup.other ? a.find("input:text").val() : c.componentSetup.name;
					e[d] = {
						optionId: b,
						content: h
					};
					f += h + ",";
					d++
				}
			});
			0 != f.length && (this.oldValue = f.substring(0, f.length - 1));
			b.dataOptions = e;
			return 0 == d ? null : b
		},
		setValue: function(a, b) {
			if (null != b && null != b.dataOptions) {
				for (var d = "", e = 0; e < b.dataOptions.length; e++) {
					var f = b.dataOptions[e],
						g = f.content,
						f = a.find("input:checkbox[name='" + this.componentSetup.fieldId + this.cid + "'][value='" + f.optionId + "']"),
						k = f.get(0);
					null != k && (k.checked = !0, d += g + ",", f = f.data("componentData").componentSetup.other, "true" == f || 1 == f) && (a.find("input:text").val(g), a.find("input:text").show())
				}
				0 != d.length && a.find(".j_readOnly").html(d.substring(0, d.length - 1));
				this.oldValue = a.find(".j_readOnly").text()
			}
		},
		empty: function(a) {
			for (var b = a.find("input:checkbox[name='" + this.componentSetup.fieldId + this.cid + "']"), d = 0; d < b.length; d++) {
				var e = $(b[d]),
					f = e.get(0);
				null != f && (f.checked = !1, e = e.data("componentData").componentSetup.other, "true" == e || 1 == e) && (a.find("input:text").val(""), a.find("input:text").hide())
			}
		},
		readOnly: function(a, b) {
			a.find("input:checkbox[name='" + this.componentSetup.fieldId + this.cid + "']").attr("disabled", b);
			b ? (a.find(".check_js").addClass("hide"), a.find(".j_readOnly").removeClass("hide")) : (a.find(".check_js").removeClass("hide"), a.find(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.CheckBox
});
define("form/component/text", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.Text = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Text",
				title: "文本输入框",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium",
				width: "",
				height: ""
			};
			null != b && 
			(this.componentSetup.title = b.title, 
					this.componentSetup.titleLayout = b.titleLayout, 
					this.componentSetup.describe = b.describe, 
					this.componentSetup.order = b.order, 
					this.componentSetup.index = b.index, 
					this.componentSetup.required = b.required, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.size = b.size,
					this.componentSetup.width = b.width,
					this.componentSetup.height = b.height
			);
			this.tpl = l.get("text")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setWidth: function(b) {
			this.componentSetup.width = b
		},
		setHeight: function(b) {
			this.componentSetup.height = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-text");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			if(this.componentSetup.size == "user-defined"){
				 a.find(".form-control").css("width",this.componentSetup.width);
			     a.find(".form-control").css("height",this.componentSetup.height);
			}else{
				a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			}
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-text");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			this.componentSetup.size == "user-defined" && (b.find("div[name='user-defined-div']").show(),	b.find("input[id='user-defined-width']").attr("value",this.componentSetup.width),b.find("input[id='user-defined-height']").attr("value",this.componentSetup.height));
			b.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		change: function(b) {
			var a = b.oldObj;
			b = b.changeEl;
			this.componentSetup.title = a.componentSetup.title;
			this.componentSetup.describe = a.componentSetup.describe;
			this.componentSetup.required = a.componentSetup.required;
			this.componentSetup.fieldId = a.componentSetup.fieldId;
			this.componentSetup.size = a.componentSetup.size;
			this.componentSetup.width = a.componentSetup.width;
			this.componentSetup.heigth = a.componentSetup.heigth;
			this.render(b);
			b.addClass("field-active")
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-text");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			if(this.componentSetup.size == "user-defined"){
		        d.find(".check_js").css("width",this.componentSetup.width);
		        d.find(".check_js").css("height",this.componentSetup.height);
			}else{
				d.find(".check_js").addClass(this.componentSetup.size);
			}
			d.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			a && d.find(".check_js").val("");
			d.addClass(this.componentSetup.titleLayout);
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			this.readOnly(d, c);
			this.el = b;
			b.append(d)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-text");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			if(this.componentSetup.size == "user-defined"){
		        a.find(".form-control").css("width",this.componentSetup.width);
		        a.find(".form-control").css("height",this.componentSetup.height);
			}else{
				a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			}
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-text");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			c.on("blur", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
				c = b.attr("placeholder"),
				d = {};
			d.element = b;
			a == c && (a = "");
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			return d
		},
		getValue: function(b) {
			var a = $.trim(b.val());
			b = b.attr("placeholder");
			var c = this.oldValue,
				d = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: a
				};
			this.oldValue = a;
			return c && 0 < c.length ? d : "" == a || a == b ? null : d
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content;
				this.componentSetup.fieldId ? (b.find("#" + this.componentSetup.fieldId).val(c), b.find(".j_readOnly").html(c)) : b.find("[cid='" + this.cid + "']").val(c);
				this.oldValue = c
			}
		},
		empty: function(b) {
			this.componentSetup.fieldId ? b.find("#" + this.componentSetup.fieldId).val("") : b.find("[cid='" + this.cid + "']").val("")
		},
		readOnly: function(b, a) {
			var c = b.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("readOnly", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Text
});
define("form/component/preview", function(h, m, n) {
	h = Backbone.View.extend({
		initialize: function(h) {
			this.afterJqObj = h.afterJqObj;
			this.container = h.container;
			this.previewType = h.previewType || "";
			this.rel = h.rel || "0";
			this.maxSize = TEAMS.currentTenant ? h.maxSize || ("normal" == TEAMS.currentTenant.status ? 10 : 5) : 5;
			h.fileObj ? (h = h.fileObj, this.isImage = h.image, this.docFileType = h.docType, this.docFileId = h.id, this.fileSize = h.size, this.title = h.name || "预览") : h.document && (h = h.document, this.isImage = h.docFile.image, this.docFileType = h.docFile.docType, this.docFileId = h.docFile.id, this.fileSize = h.docFile.size)
		},
		initEvents: function() {},
		render: function() {
			var h = this.container,
				b = this.afterJqObj;
			this.isImage ? (b.after("<a id='document-preview-" + this.docFileId + "' rel='" + this.rel + "' title='" + this.title + "' class='document-preview-btn btn btn-xs btn-info' href=''>预览</a>"), "remote" == this.previewType ? h.find("#document-preview-" + this.docFileId).addClass("fancybox").attr("type", "image").attr("href", crmContext.remoteDownloadUrl + "/remotedownload/" + this.docFileId + "/ETEAMSID/true?type=remote") : h.find("#document-preview-" + this.docFileId).addClass("fancybox").attr("type", "image").attr("href", "/base/download/" + this.docFileId + "?type=" + this.previewType + "&timestamp=" + Date.parse(new Date)), h.find(".fancybox").fancybox({
				closeBtn: !0,
				afterLoad: function() {
					this.title = "Image " + (this.index + 1) + " of " + this.group.length + (this.title ? " - " + this.title : "")
				}
			})) : "office" == this.docFileType || "pdf" == this.docFileType ? (b.after("<a id='document-preview-" + this.docFileId + "'  data-value='" + this.docFileId + "'  title='预览' class='document-preview-btn btn btn-xs btn-info' href=''>预览</a>"), "version" == this.previewType ? h.find("#document-preview-" + this.docFileId).attr({
				href: "/wopi/files/preview?id=" + this.docFileId + "&type=" + this.previewType,
				target: "_blank"
			}) : "remote" == this.previewType ? h.find("#document-preview-" + this.docFileId).attr({
				href: "/remote/previewremote/allView?id=" + this.docFileId,
				target: "_blank"
			}) : h.find("#document-preview-" + this.docFileId).attr({
				href: "/wopi/files/preview?id=" + this.docFileId,
				target: "_blank"
			}), this.fileSize > 1048576 * this.maxSize && h.find("#document-preview-" + this.docFileId).attr("disabled", "true").css({
				"background-color": "#ccc",
				"border-color": "#ccc"
			}).after("<a data-value='" + this.docFileId + "'  style='color:#ccc;size:10px;text-decoration : none;cursor:default;margin-left:5px;'>超过预览最大限制" + this.maxSize + "M</a>")) : "text" == this.docFileType && (b.after("<a id='document-preview-" + this.docFileId + "'  data-value='" + this.docFileId + "'  title='预览' class='document-preview-btn btn btn-xs btn-info' href=''>预览</a>"), "remote" == this.previewType ? h.find("#document-preview-" + this.docFileId).attr({
				href: "/remote/previewremote/allView?id=" + this.docFileId,
				target: "_blank"
			}) : h.find("#document-preview-" + this.docFileId).attr({
				href: "/wopi/files/preview/txtView?id=" + this.docFileId + "&type=" + this.previewType,
				target: "_blank"
			}))
		},
		remove: function() {}
	});
	n.exports = h
});
define("form/component/userselecter", ["form/tplutil"], function(h, m, n) {
	var l = h("form/tplutil");
	h = Backbone.View.extend({
		initialize: function() {},
		render: function(b, a) {
			"pc" == b ? this.initPC.init(a) : this.initMb.init(a)
		},
		initPC: {
			lightClass: "selected",
			fold: "icon-caret-right",
			unfold: "icon-caret-down",
			init: function(b) {
				this.isMulti = b.isMulti || !1;
				this.target = b.target;
				this.height = 310;
				this.userOrg = !1;
				this.tpl = l.get("userselecter");
				$("body").append($(this.tpl).siblings("#selector-employee"));
				this.el = "#selector-employee";
				this.$el = $(this.el);
				this.render(b.users);
				this.delegateEvents()
			},
			delegateEvents: function() {
				var b = this,
					a = b.$el;
				$("body").off("keydown.user").on("keydown.user", function(b) {
					27 == b.which && a.modal("hide")
				});
				a.on("click", ".j_user_cancel", function() {
					a.find(".j_close").click()
				});
				$("#selector-employee").on("hidden.bs.modal", function() {
					$("#selector-employee").remove()
				});
				a.on("click", "#organization-users", function(c) {
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
					a.find("#organization-users").parent().addClass("active");
					a.find("#group-users").parent().removeClass("active");
					a.find("#org-tree-list").removeClass("hide");
					a.find("#org-group-list").addClass("hide");
					a.find(".users-list-pinyin .j_active").removeClass("j_active");
					b.userOrg = !1;
					a.find(".root").trigger("click")
				});
				a.on("click", "#group-users", function(c) {
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
					a.find("#organization-users").parent().removeClass("active");
					a.find("#group-users").parent().addClass("active");
					a.find("#org-tree-list").addClass("hide");
					a.find("#org-group-list").removeClass("hide");
					a.find(".users-list-pinyin .j_active").removeClass("j_active");
					b.userOrg = !0;
					b.initGroup()
				});
				a.on("click", "#org-tree-list .treenode,#org-group-list li", function(c) {
					a.find(".users-list-pinyin .j_active").removeClass("j_active");
					b.$el.find(".selected").removeClass("selected");
					$(this).addClass("selected");
					b.initPinyin()
				});
				a.on("click", "." + b.unfold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle(400);
					$(this).removeClass(b.unfold).addClass(b.fold)
				});
				a.on("click", "." + b.fold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle(400);
					$(this).removeClass(b.fold).addClass(b.unfold)
				});
				a.on("addUser", "#all-group-users", function(a, b) {
					var e = $("<a> " + b.username + " </a>");
					e.attr("id", b.id);
					e.data("user", b);
					0 == $("#userSelector-multi .selected-users #" + b.id).size() && $("#userSelector-multi .selected-users").prepend(e)
				});
				a.on("deleteUser", "#all-group-users", function(a, b) {
					$("#userSelector-multi .selected-users #" + b.id).remove()
				});
				a.on("addAllUser", "#all-group-users", function(a, d) {
					for (var e = 0; e < d.length; e++) {
						var f = d[e];
						if (!b.isExistUser(f)) {
							var g = $("<a> " + f.username + " </a>");
							g.attr("id", f.id);
							g.data("user", f);
							$("#userSelector-multi .selected-users").prepend(g)
						}
					}
				});
				a.on("deleteAllUser", "#all-group-users", function(a, b) {
					for (var e = 0; e < b.length; e++)
					$("#userSelector-multi .selected-users #" + b[e].id).remove()
				});
				a.on("click", "#employee-container li", function(a) {
					if (b.isMulti) $(this).find("div.username input").trigger("click");
					else if (a = $(this).data("user")) $(b.el).modal("hide"), a.sourceId = $(this).attr("id"), b.target.trigger("confirmHandler", {
						objs: [a]
					})
				});
				a.on("click", "#employee-container .clearfix div.username input", function(a) {
					var d = $(this).parents(".clearfix").data("user");
					len = $(this).filter(":checked").length;
					0 < len ? $(this).trigger("addUser", [d, b.id]) : $(this).trigger("deleteUser", [d, b.id]);
					var d = $(b.el + " #employee-container .clearfix div.username input:checked").length,
						e = $(b.el + " #employee-container .clearfix div.username input").length;
					0 == d && $(b.el + " #checkAll").prop("checked", !1);
					d == e ? $(b.el + " #checkAll").prop("checked", !0) : $(b.el + " #checkAll").prop("checked", !1);
					a.stopPropagation()
				});
				$(this.el).off("change", "#checkAll").on("click", "#checkAll", function() {
					var a = [];
					if ($(this).prop("checked")) {
						$(b.el + " #employee-container .clearfix div.username input").each(function() {
							if (0 == $(this).filter(":checked").length) {
								var d = $(this).parents(".clearfix").data("user");
								a.push(d);
								$(b.el + " #checkAll").removeAttr("checked");
								$(this).prop("checked", !0)
							}
						});
						var d = $(b.el + " #employee-container .clearfix div.username input:checked").length,
							e = $(b.el + " #employee-container .clearfix").length - 1;
						d == e && $(this).prop("checked", !0);
						$(this).trigger("addAllUser", [a, b.id])
					} else $(b.el + " #employee-container .clearfix div.username input").each(function() {
						var d = $(this).parents(".clearfix").data("user");
						if (d.id != TEAMS.currentUser.id || "editgroup" != b.userOrg) a.push(d), $(this).prop("checked", !1)
					}), $(this).prop("checked", !1), $(this).trigger("deleteAllUser", [a, b.id])
				});
				a.on("click.user-win", ".j_user_ok", function() {
					var a = [];
					$("#userSelector-multi .selected-users>a").each(function() {
						var b = $(this).data("user");
						a.push(b)
					});
					b.target.trigger("confirmHandler", {
						objs: a
					});
					$(b.el).modal("hide")
				})
			},
			render: function(b) {
				var a = this.$el;
				$("body").find("#selector-employee").modal();
				this.isMulti ? a.find(".selector-btns .j_user_ok").removeClass("hide") : (a.find("#userSelector-multi .user-selector-header").addClass("hide"), a.find("#userSelector-multi .user-wrapper").addClass("hide"));
				if (b && 0 < b.length) for (a = 0; a < b.length; a++) {
					var c = b[a],
						d = $("<a> " + c.username + " </a>");
					d.attr("id", c.id);
					d.data("user", c);
					0 == $("#userSelector-multi .selected-users #" + c.id).size() && $("#userSelector-multi .selected-users").prepend(d)
				}
				this.initTree()
			},
			initTree: function(b) {
				var a = this;
				(b = this.departmentData) ? a.renderTree(b) : $.ajax({
					url: "/base/tree/department.json",
					type: "post",
					dataType: "json",
					success: function(b) {
						a.departmentData = b.nodes;
						a.renderTree(a.departmentData)
					}
				})
			},
			initPinyin: function() {
				var b = this;
				b.userOrg ? b.findGroupPinyinIndexs(b.getParam(), function(a) {
					b.loadPinyin(a)
				}) : b.findPinyinIndexs(b.getParam(), function(a) {
					b.loadPinyin(a)
				});
				b.initUsers()
			},
			initGroup: function() {
				var b = this,
					a = b.groupData;
				a ? b.renderGroup(a) : $.ajax({
					url: "/group/group.json",
					type: "post",
					dataType: "json",
					data: {
						employeeId: TEAMS.currentUser.id
					},
					success: function(a) {
						b.groupData = a;
						b.renderGroup(b.groupData)
					}
				})
			},
			initUsers: function() {
				var b = this;
				$(b.el + " #userlistCon").empty();
				b.userOrg ? b.queryGroupEmp(b.getParam(), function(a) {
					b.renderUserList(a)
				}) : b.queryEmp(b.getParam(), function(a) {
					b.renderUserList(a)
				})
			},
			renderTree: function(b) {
				var a = this.getRoot(b);
				b = this.createRootTree(a, b);
				$("#org-tree-list").html(b);
				this.highLight();
				this.initPinyin()
			},
			getRoot: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					if (!d.nodeObj.parent) return d
				}
			},
			createRootTree: function(b, a) {
				var c = "<ul>",
					d = this.createChild(b, a);
				return c = c + d + "</ul>"
			},
			createChild: function(b, a) {
				if (b) {
					var c = "root" == b.parentId ? "root" : "",
						d = "padding-left:" + 20 * b.rank + "px",
						e = this.createTree(b, a),
						f = e ? this.unfold : "",
						c = "<li>" + ('<div class="treenode router ' + c + '" style="' + d + '" id="' + b.id + '">');
					nameTmp = '<a class="router" title="' + b.name + '"><span class="tree-name">' + b.name + "</span></a>";
					c += "<i class='nodeicon " + f + "'></i>";
					c += nameTmp;
					c = c + "</div>" + e;
					return c += "</li>"
				}
			},
			createTree: function(b, a) {
				for (var c = "<ul class='ftl-child-ul'>", d = 0, e = 0, f = a.length; e < f; e++) {
					var g = a[e];
					if (!g) break;
					var k = g.nodeObj.parent;
					k && k.id == b.id && g.id != b.id && (g = this.createChild(g, a), c += g, d++)
				}
				return 0 == d ? "" : c + "</ul>"
			},
			renderGroup: function(b) {
				if ((b = b.groups) && 0 < b.length) {
					if (0 == $("#org-group-list").find("ul>li").length) {
						for (var a = "<ul class='clearfix'>", c = 0, d = b.length; c < d; c++)
						var e = "",
							f = b[c].createTime ? Date.create(b[c].createTime).format("{yyyy}-{MM}-{dd}") : "",
							e = e + ("<li><a id='" + b[c].id + "' class='router' title='" + b[c].creator.username + "创建于" + f + "' href='#'>" + b[c].name + "【" + (null == b[c].member ? 0 : b[c].member.length) + "人】</a></li>"),
							a = a + e;
						a += "</ul>";
						$("#org-group-list").html(a)
					}
					$("#org-group-list").find("ul>li:first").addClass("selected");
					this.initPinyin()
				}
			},
			loadPinyin: function(b) {
				var a = this;
				b = b.indexs;
				var c = /[0-9]$/,
					d = /^[A-Za-z]+$/,
					e = $(a.el).find(".users-list-pinyin");
				e.find("a.highlight:not(#ALL)").removeClass("highlight");
				for (var f = 0; f < b.length; f++) {
					var g = b[f].toLocaleUpperCase();
					c.test(g) ? g = "degit" : d.test(g) || (g = "special");
					g && 0 < g.trim().length && e.find("#" + g).addClass("highlight")
				}
				e.off("click", "a.highlight").on("click", "a.highlight", function(b) {
					b = $(this);
					b.addClass("j_active");
					b.siblings().removeClass("j_active");
					a.initUsers()
				})
			},
			findPinyinIndexs: function(b, a) {
				$.ajax({
					type: "post",
					url: "/base/employee/findPinyinIndexs.json",
					dataType: "json",
					data: b,
					success: function(b) {
						a && a(b)
					}
				})
			},
			findGroupPinyinIndexs: function(b, a) {
				$.ajax({
					type: "post",
					url: "/base/employee/findGroupPinyinIndexs.json",
					dataType: "json",
					data: b,
					success: function(b) {
						a && a(b)
					}
				})
			},
			queryEmp: function(b, a) {
				$.ajax({
					url: "/base/employee/pageQuery.json",
					type: "post",
					dataType: "json",
					data: b,
					success: function(b) {
						a && a(b)
					}
				})
			},
			queryGroupEmp: function(b, a) {
				$.ajax({
					url: "/base/employee/queryGroupEmp.json",
					type: "post",
					dataType: "json",
					data: b,
					success: function(b) {
						a && a(b)
					}
				})
			},
			renderUserList: function(b) {
				users = this.getAllChecked();
				b = b.page;
				for (var a = 0; a < b.result.length; a++)
				this.renderUser(b.result[a], !1, users);
				0 < b.result.length && b.result.length == this.checkCount ? $(this.el + " #checkAll").prop("checked", !0) : $(this.el + " #checkAll").prop("checked", !1);
				a = $(this.el).find(".center-more");
				b.hasNext ? a.removeClass("hide") : a.addClass("hide");
				this.checkCount = 0
			},
			renderUser: function(b, a, c) {
				var d = $(this.tpl).siblings("#usersListClone").children("li").clone();
				this.isMulti ? (d.find("div.username input").removeClass("hide"), $(this.el).find("#group-user-checkall").removeClass("hide"), b.checked && 1 == b.checked && d.find("div.username input").prop("checked", !0)) : (d.find("div.username input").addClass("hide"), $(this.el).find("#group-user-checkall").addClass("hide"));
				if (c) for (var e = 0; e < c.length; e++)
				c[e].id == b.id && (this.checkCount += 1, d.find("div.username input").prop("checked", !0));
				d.data("user", b);
				d.attr("id", b.id);
				b.mobile ? d.find(".call").html(b.mobile) : d.find(".call").html(b.email);
				d.find(".dept").html(b.department.name);
				b.avatar && b.avatar.p4 && (d.find("a.avatar img").attr("src", "/base/download/" + b.avatar.p4), this.editable && (d.find("a.avatar img").attr("id", b.id), d.find("a.avatar img").data("user", b)));
				c = "";
				c = "normal" == b.status ? "" : "(离职)";
				c = "<font color='red'>" + c + "</font>";
				d.find("a.name").html(b.username + c);
				this.isMulti || (d.find("a.name").attr("id", b.id), d.find("a.name").data("user", b));
				c = b.email ? b.email : b.mobile;
				d.find("span.email").attr("title", c).html(c);
				$(this.el).find("#userlistCon");
				b.department && 1 == b.department.rank ? d.find("span.department").text("") : d.find("span.department").attr("title", b.department.name).html(b.department.name);
				TEAMS.currentUser.id != b.id ? d.find("span." + b.relation).removeClass("hide") : "editgroup" == this.userOrg && d.find("div.username input").attr("disabled", "disabled");
				a ? $(this.el).find("#userlistCon").prepend(d) : $(this.el).find("#userlistCon").append(d)
			},
			getParam: function() {
				var b = {
					pageSize: 500,
					pageNo: 1,
					isGroupEdit: 0,
					isContainsSub: !0
				},
					a = $(this.el).find("#org-group-list .selected");
				b.groupId = 0 < a.length ? a.children("a").attr("id") : "";
				b["employee.status"] = "normal";
				a = $(this.el).find("#org-tree-list .selected");
				b["employee.department"] = 0 < a.length ? a.attr("id") : "";
				a = "";
				0 < $(this.el).find(".users-list-pinyin .j_active").length && (a = $(this.el).find(".users-list-pinyin .j_active").attr("id").toLocaleLowerCase(), "all" == a && (a = ""));
				b["employee.index"] = a;
				return b
			},
			isExistUser: function(b) {
				var a = !1;
				$("#userSelector-multi .selected-users>a").each(function() {
					var c = $(this).data("user");
					b.id == c.id && (a = !0)
				});
				return a
			},
			isChecked: function() {
				var b = [],
					b = this.getAllChecked();
				return 0 < b.length ? !0 : !1
			},
			getAllChecked: function() {
				var b = [];
				$("#userSelector-multi .selected-users>a").each(function() {
					var a = $(this).data("user");
					b.push(a)
				});
				return b
			},
			highLight: function(b) {
				var a = this.$el,
					c = this.lightClass;
				a.find(".treenode").removeClass(c);
				a.find("#" + b).addClass(c);
				b || a.find(".root").addClass(c)
			}
		},
		initMb: {
			init: function(b) {
				this.container = b.el;
				this.targetId = b.targetId;
				this.preEl = b.preEl;
				this.multi = b.multi && "false" == b.multi ? !1 : !0;
				this.title = b.title;
				this.noempty = b.noempty;
				this.tpl = l.get("userselecter");
				this.reload = !1;
				$("body").append($(this.tpl).siblings("#employee-container"));
				$("#seleted-title").html(this.title);
				this.delegateEvents();
				this.render()
			},
			delegateEvents: function() {
				var b = this,
					a = $("#employee-container");
				$("#employee-container").off(".seleted");
				if (b.multi) a.on("click.seleted", ".j_employee-info", function(a) {
					$(this).toggleClass("selected");
					a = $(this).data("employee");
					1 == $("#j_memb-names #seleted" + a.id).size() ? ($("#j_memb-names #seleted" + a.id).remove(), $("#j_memb-list-container #" + a.id).removeClass("selected")) : ($("#j_memb-list-container #" + a.id).addClass("selected"), $("#j_memb-names").append('<span id="seleted' + a.id + '" data-id="' + a.id + '">' + a.username + "</span>"))
				});
				else a.on("click.seleted", ".j_employee-info", function(a) {
					a = $(this).data("employee");
					b.noempty ? ($(this).toggleClass("selected"), a = $(this).data("employee"), 1 == $("#j_memb-names #seleted" + a.id).size() ? ($("#j_memb-names #seleted" + a.id).remove(), $("#j_memb-list-container #" + a.id).removeClass("selected")) : ($("#j_memb-list-container .selected").removeClass("selected"), $("#j_memb-list-container #" + a.id).addClass("selected"), $("#j_memb-names").html('<span id="seleted' + a.id + '" data-id="' + a.id + '">' + a.username + "</span>"))) : (b.container.trigger("employeeComfirm", {
						objs: a
					}), $(b.preEl).removeClass("hide"), $("#employee-seleted").addClass("hide"), b.remove())
				});
				a.on("click.seleted", "#j_a-comfirm", function(a) {
					a = b.getAllChecked();
					b.container.trigger("employeeComfirm", {
						objs: a
					});
					$(b.preEl).removeClass("hide");
					$("#employee-seleted").addClass("hide");
					b.remove()
				});
				a.on("tap.seleted", "#search-keyword-tap", function(a) {
					setTimeout(function() {
						$("#employee-seleted").hide();
						$("#searchResult-employee").show();
						$("#search-keyword-employee").focus()
					}, 100)
				});
				a.on("tap.seleted", ".j_icon-cancel-circle", function(a) {
					$("#search-keyword-employee").val("");
					$("#j_memb-list-container-search").empty()
				});
				a.on("tap.seleted", ".j_cancle-search", function(a) {
					a.stopPropagation();
					setTimeout(function() {
						$("#employee-seleted").show();
						$("#searchResult-employee").hide;
						$("#search-keyword-employee").val("");
						$("#j_memb-list-container-search").empty()
					}, 100)
				});
				a.on("change", $("#search-keyword-employee"), function(a) {
					(a = $("#search-keyword-employee").val()) && 0 < $.trim(a).length && b.searchUser($("#j_memb-list-container-search"), a)
				});
				$("#employee-form").submit(function() {
					var a = $("#search-keyword-employee").val();
					a && 0 < $.trim(a).length && b.searchUser($("#j_memb-list-container-search"), a);
					return !1
				});
				a.on("click.seleted", "#j_a-back", function(a) {
					$(b.preEl).removeClass("hide");
					$("#employee-seleted").addClass("hide");
					b.remove()
				})
			},
			render: function() {
				this.renderUserList();
				this.reload || (this.searchUser($("#j_memb-list-container")), this.reload = !0)
			},
			searchUser: function(b, a) {
				var c = this,
					d = "";
				b.append($("#data-loading-clone").clone().removeAttr("id"));
				var e = {
					pageNo: 1,
					pageSize: 1E3,
					isContainsSub: !1,
					"employee.status": "normal"
				};
				a && (e["employee.username"] = a);
				"timecard" == c.module ? (d = "/users/others.json", e.id = TEAMS.currentUser.id, $("#seleted-title").html("人员选择"), $(".invite-row").remove()) : "subs" == c.shareType ? (d = "/users/allsubordinate/" + TEAMS.currentUser.id + ".json", e.allSubordinate = !0, $(".invite-row").remove()) : d = "/base/employee/pageQuery.json";
				$.ajax({
					type: "post",
					url: d,
					dataType: "json",
					data: e,
					success: function(a) {
						b.find(".j_data-loading").remove();
						if ((a = a.page) && a.result && 0 < a.result.length) {
							b.empty();
							a = a.result;
							for (var d = 0; d < a.length; d++) {
								var e = a[d],
									h = e.id,
									l = "";
								e.pinyin ? (l = e.pinyin.substring(0, 1).toLocaleUpperCase(), /^[A-Za-z]+$/.test(l) || (l = "degit")) : l = "degit";
								var n = b.find("#user-list-" + l);
								if (1 == n.size()) {
									var m = $("#employee-info-clone").clone().attr("id", h);
									m.find(".j_name").html(e.username);
									m.data("employee", e);
									e.avatar && m.find("img").attr("src", "/base/download/" + e.avatar.p5);
									m = c.isSeleted(e, m);
									n.append(m)
								} else m = $("#employee-clone").clone(), m.find(".j_com-list").attr("id", "user-list-" + l), m.find(".j_letter-hd").html("degit" == l ? "#" : l), b.append(m.html()), h = $("#employee-info-clone").clone().attr("id", h), h.find(".j_name").html(e.username), h.data("employee", e), e.avatar && h.find("img").attr("src", "/base/download/" + e.avatar.p5), h = c.isSeleted(e, h), b.find("#user-list-" + l).append(h)
							}
						} else b.empty(), b.append($("#load-tip-employee").clone().removeAttr("id"));
						1 >= TEAMS.currentTenant.usedLicense ? b.append($("#invite-clone").clone().removeAttr("id").removeClass("hide")) : b.append($("#invite-b-clone").clone().removeAttr("id").removeClass("hide"))
					}
				})
			},
			renderUserList: function() {
				this.container.find("span").each(function(b) {
					$(this).attr("data-id") && ($(this).hasClass("nochange") ? $("#j_memb-names").append('<span class="nochange" id="seleted' + $(this).attr("data-id") + '" data-id="' + $(this).attr("data-id") + '">' + $(this).text() + "</span>") : $("#j_memb-names").append('<span id="seleted' + $(this).attr("data-id") + '" data-id="' + $(this).attr("data-id") + '">' + $(this).text() + "</span>"))
				})
			},
			isSeleted: function(b, a) {
				for (var c = $("#j_memb-names").children(), d = 0; d < c.length; d++) {
					var e = $(c[d]);
					if (e.attr("data-id") == b.id) {
						a.addClass("selected");
						e.hasClass("nochange") && a.addClass("nochange");
						break
					}
				}
				return a
			},
			getAllChecked: function() {
				var b = [];
				$("#j_memb-list-container .j_employee-info.selected").each(function() {
					var a = $(this).data("employee");
					$(this).hasClass("nochange") && (a.nochange = !0);
					b.push(a)
				});
				return b
			},
			remove: function() {
				$("#employee-container").off(".seleted");
				$("#employee-container").remove()
			}
		}
	});
	n.exports = h
});
define("form/component/piecomponent", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.PieComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "PieComponent",
				title: "饼图",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				fieldId: "",
				dataSetId: ""
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.fieldId = b.fieldId, this.componentSetup.dataSetId = b.dataSetId);
			this.tpl = l.get("pie")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		setDataSetId: function(b) {
			this.componentSetup.dataSetId = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-pie");
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {
			var b = this,
				a;
			b.statFields ? b.renderEditorValue() : this.componentmodel.getFormSelectFields(function(c) {
				a = $(_.template(b.tpl, c)).siblings("#editor-pie");
				b.statFields = c;
				null != c.statfields && 0 < c.statfields.length && (b.componentSetup.dataSetId = c.statfields[0].fieldId);
				b.el = a;
				b.renderEditorValue()
			})
		},
		renderEditorValue: function() {
			var b = this.el;
			b.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(b.html());
			var a = $("#component-dataset");
			$.each(this.statFields.statfields, function() {
				var b = a.find("option:first").clone().show();
				b.val(this.fieldId).text(this.title);
				a.append(b)
			});
			$("#editor-component").find("#component-dataset").val(this.componentSetup.dataSetId)
		},
		renderPreview: function(b, a, c) {
			var d = this;
			a = $(this.tpl).siblings("#preview-pie");
			b.append(a);
			this.viewcon = a;
			this.componentmodel.getFieldStat(this.componentSetup.dataSetId, function(a) {
				d.renderpieView(d, a.fieldChartStatData)
			})
		},
		renderpieView: function(b, a) {
			var c = [],
				d = [];
			b = this;
			for (var e, f = 0, g = a.length; f < g; f++)
			c.push(a[f].name), d.push({
				value: a[f].total,
				name: a[f].name
			});
			e = {
				title: {
					text: b.componentSetup.title,
					x: "center"
				},
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: "vertical",
					x: "left",
					data: c
				},
				toolbox: {
					show: !0,
					feature: {
						magicType: {
							show: !1,
							type: ["pie"]
						},
						restore: {
							show: !0
						},
						saveAsImage: {
							show: !0
						}
					}
				},
				calculable: !0,
				series: [{
					name: "次数",
					type: "pie",
					radius: "55%",
					center: ["50%", "60%"],
					data: d
				}]
			};
			h.async("https://static.eteams.cn/js/echarts.min.js", function() {
				var a = b.viewcon.find(".pieview");
				this.pieChart = echarts.init(a.get(0));
				this.pieChart.setOption(e)
			})
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-pie");
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-text");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {},
		check: function(b) {},
		getValue: function(b) {},
		setValue: function(b, a) {},
		empty: function(b) {},
		readOnly: function(b, a) {}
	});
	n.exports = window.PieComponent
});
define("form/component/email", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.Email = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Email",
				title: "邮箱",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium"
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.fieldId = b.fieldId, this.componentSetup.size = b.size);
			this.tpl = l.get("email")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-email");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-email");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-email");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").addClass(this.componentSetup.size);
			d.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			a && d.find(".check_js").val("");
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			d.addClass(this.componentSetup.titleLayout);
			this.readOnly(d, c);
			this.el = b;
			b.append(d)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-email");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").addClass(this.componentSetup.size);
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-email");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			c.on("blur", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
				c = b.attr("placeholder"),
				d = {};
			d.element = b;
			a == c && (a = "");
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			"" == a || this.email(a) || (d.message = this.componentSetup.title + "格式有误，请输入有效的邮箱");
			return d
		},
		email: function(b) {
			return /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(b)
		},
		getValue: function(b) {
			var a = $.trim(b.val());
			b = b.attr("placeholder");
			var c = this.oldValue,
				d = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: a
				};
			this.oldValue = a;
			return c && 0 < c.length || "" != a && a != b && this.email(a) ? d : null
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content;
				b.find("#" + this.componentSetup.fieldId).val(c);
				b.find(".j_readOnly").html(c);
				this.oldValue = c
			}
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("readOnly", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Email
});
/*
	表格布局中实现表格的jquery插件
	与table.js里面的代码相同，可以不要，尝试删除掉
*/
/*
(function(h, m, n, l) {
	var b = function(a, b) {
			this.$element = a;
			this.defaults = {
				area: "area",
				current: "current",
				rows: 2,
				cols: 2,
				thead: !0,
				tfoot: !1,
				tableClass: "table table-bordered",
				headClass: "theader",
				bodyClass: "j_tablelayout",
				footClass: "foot",
				separator: "_",
				minColWidth: 255,
				defaultWidth: 255,
				maxColWidth: 765,
				tdArray: [],
				thArray: [],
				beforeChangeCell: function(a, b) {
					return !0
				},
				afterDeleteCol: function(a) {},
				afterDeleteRow: function(a) {},
				afterCreateCell: function(a, b) {},
				afterCreateBodyTd: function(a, b, c) {},
				afterChangeWidth: function(a, b) {}
			};
			this.options = h.extend({}, this.defaults, b);
			this.persist = {
				storage: [],
				place: [],
				selection: [],
				selected: [],
				range: {
					start: null,
					end: null
				},
				mouse: {
					status: 0
				}
			}
		};
	b.prototype = {
		init: function() {
			this.renderTable();
			this.events();
			return this
		},
		events: function() {
			var a = this.$element,
				b = this;
			a.on("mouseover", "td", function(a) {
				b.onCellMouseOver(a)
			});
			a.on("mousedown", "td", function(a) {
				if (1 == a.which) b.onCellMouseLeftDown(a);
				if (3 == a.which) b.onCellMouseRightDown(a)
			});
			h(n).on("mouseup", function(a) {
				b.onCellMouseUp(a)
			});
			h(n).on("mousedown", function(a) {
				a = a.target;
				"td" == a.tagName.toLowerCase() || h(a).hasClass("j_layout_menu") || b.clearSelection()
			});
			a.contextmenu({
				target: "#context-menu",
				onItem: function(a, e) {
					h(e.target).parent().hasClass("disabled") || b.rightEvents(h(e.target).attr("type"))
				},
				before: function(a, e) {
					b.initRightMenu()
				}
			})
		},
		rightEvents: function(a) {
			switch (a) {
			case "merge":
				this.merge();
				break;
			case "clearMerge":
				this.clearMerge();
				break;
			case "deleteRow":
				this.deleteRow();
				break;
			case "deleteCol":
				this.deleteCol();
				break;
			case "addRow":
				this.addRow();
				break;
			case "addCol":
				this.addCol();
				break;
			case "clearSelect":
				this.clearSelection()
			}
		},
		initRightMenu: function() {
			var a = this.persist.selection,
				b = this.persist.selected,
				d = this.persist.place,
				e = h(".dropdown-menu");
			a && 0 != a.length ? e.find("li").removeClass("disabled") : (e.find("a[type='deleteCol']").parent().addClass("disabled"), e.find("a[type='deleteRow']").parent().addClass("disabled"), e.find("a[type='merge']").parent().addClass("disabled"), e.find("a[type='clearSelect']").parent().addClass("disabled"));
			d && 0 < d.length ? e.find("a[type='clearMerge']").parent().removeClass("disabled") : e.find("a[type='clearMerge']").parent().addClass("disabled");
			1 == b.length && e.find("a[type='merge']").parent().addClass("disabled")
		},
		_checkMerge: function() {
			return 1 < this.persist.selection.length ? !0 : !1
		},
		renderTable: function() {
			var a = this.$element,
				b = this.options,
				d = "<table class='" + b.tableClass + "' >";
			if (b.tdArray && 0 < b.tdArray.length) for (var d = d + ("<tbody class ='" + b.bodyClass + "'>"), e = 0; e < b.rows; e++)
			d += "<tr></tr>";
			else for (d += "<tbody class ='" + b.bodyClass + "'>", e = 0; e < b.rows; e++) {
				for (var d = d + "<tr>", f = 0; f < b.cols; f++)
				d += "<td></td>";
				d += "</tr>"
			}
			d += "</tbody>";
			if (b.tfoot) {
				d += "<tfoot class='" + b.footClass + "'><tr>";
				for (e = 0; e < b.cols; e++)
				d += "<td></td>";
				d += "</tr></tfoot>"
			}
			a.html(d);
			this.$table = a.find("table");
			if (b.tdArray && 0 < b.tdArray.length) this.initBody();
			else for (a = this.$table.find("tbody tr"), e = 0; e < a.length; e++)
			b = h(a[e]).children(), this.persist.storage[e] = b;
			this.options.afterCreateCell(this, this.$table.find("tbody td"));
			this.initHeader()
		},
		initBody: function() {
			var a = this.options.tdArray,
				b = this.persist.storage;
			if (a && 0 < a.length) for (var d = 0; d < a.length; d++) {
				var e = a[d];
				"string" == typeof e && (e = JSON.parse(e));
				if (e) {
					var f = e.coordinate.split(this.options.separator),
						g = ~~f[0],
						f = ~~f[1];
					b[g] || (b[g] = []);
					if (0 < e.rowSpan && 0 < e.colSpan) {
						var k = h("<td rowspan='" + e.rowSpan + "' colspan='" + e.colSpan + "'></td>");
						this.$table.find("tbody tr").eq(g).append(k);
						this.options.afterCreateBodyTd(this, k, e);
						b[g][f] = k[0]
					} else b[g][f] = null
				}
			}
		},
		initHeader: function(a) {
			a = this.options;
			if (a.thead) {
				this.$table.find("thead").remove();
				var b = "";
				a.headClass = 2 == a.cols ? a.headClass.concat(" two-columns") : a.headClass.replace("two-columns", "");
				for (var b = b + ("<thead class='" + a.headClass + "'><tr>"), d = 0; d < a.cols; d++) {
					a.thArray[d] = a.thArray[d] ? a.thArray[d] : a.minColWidth;
					var e = parseInt(d / 26),
						e = e ? e + "" : "",
						b = b + ("<th style='width:" + a.thArray[d] + "px'>" + String.fromCharCode(65 + d % 26) + e + "</th>")
				}
				this.$table.prepend(b + "</tr></thead>");
				b = a.maxColWidth;
				2 == a.cols && (this.$table.find("thead>tr>th:last").attr("style", ""), b = 510)
			}
			this.options.afterChangeWidth(this, a.thArray);
			this.resizable(b)
		},
		onCellMouseOver: function(a) {
			a = a.target;
			var b = this.persist;
			0 != b.mouse.status && (b.range.end = this.getCellIndex(a), this.clearSelection(), this.selectCell(), this.renderSelection())
		},
		onCellMouseLeftDown: function(a) {
			a = a.target;
			var b = this.persist;
			b.mouse.status = 1;
			b.range.start = this.getCellIndex(a);
			h(a).trigger("mouseover")
		},
		onCellMouseRightDown: function(a) {
			a = a.target;
			var b = this.persist;
			if (h(a).hasClass(this.options.area)) return !0;
			b.range.start = this.getCellIndex(a);
			b.range.end = this.getCellIndex(a);
			this.clearSelection();
			this.selectCell();
			this.renderSelection()
		},
		onCellMouseUp: function() {
			this.persist.mouse.status = 0
		},
		getRange: function() {
			var a = this.persist,
				b = this.options;
			if (a.range.start && a.range.end) {
				var d = a.range.start.split(b.separator),
					e = parseInt(d[0]),
					d = parseInt(d[1]),
					f = a.range.end.split(b.separator),
					b = parseInt(f[0]),
					g = parseInt(f[1]),
					k;
				d > g ? (k = d + a.storage[e][d].colSpan - 1, f = g) : d < g ? (k = g + a.storage[b][g].colSpan - 1, f = d) : e > b ? (k = d + a.storage[e][d].colSpan - 1, f = g) : e < b ? (k = g + a.storage[b][g].colSpan - 1, f = d) : f = k = d;
				e > b ? (a = e + a.storage[e][d].rowSpan - 1, e = b) : e < b ? a = b + a.storage[b][g].rowSpan - 1 : d > g ? (a = e + a.storage[e][d].rowSpan - 1, e = b) : d < g ? a = b + a.storage[b][g].rowSpan - 1 : e = a = e;
				return this._getMaxRange({
					minX: f,
					maxX: k,
					minY: e,
					maxY: a
				})
			}
			return {}
		},
		_getMaxRange: function(a) {
			for (var b = this.persist, d = a.minX, e = a.maxX, f = a.minY, g = a.maxY, k = d, l = e, n = f, m = g; f <= g; f++)
			if (b.storage[f]) for (var u = d; u <= e; u++) {
				var r = this.findCell(f, u),
					w = r.colSpan,
					v = r.rowSpan;
				(1 < w || 1 < v) && -1 == h.inArray(r, b.place) && (b.place.push(r), r = this.getCellIndex(r).split(this.options.separator), 1 < w && (l = l > ~~r[1] + w - 1 ? l : ~~r[1] + w - 1, k = k < ~~r[1] ? k : ~~r[1]), 1 < v && (m = m > ~~r[0] + v - 1 ? m : ~~r[0] + v - 1, n = n < ~~r[0] ? n : ~~r[0]))
			}
			b = {
				minX: k,
				maxX: l,
				minY: n,
				maxY: m
			};
			return this._checkRange(a, b) ? b : this._getMaxRange(b)
		},
		_checkRange: function(a, b) {
			return a.minX == b.minX && a.maxX == b.maxX && a.minY == b.minY && a.maxY == b.maxY
		},
		clearSelection: function() {
			var a = this.persist,
				b = this.options;
			if (a.selection || 0 < a.selection.length) for (var d = 0; d < a.selection.length; d++) {
				var e = a.selection[d].split(b.separator),
					f = e[0],
					e = e[1];
				a.storage[f] && a.storage[f][e] && a.storage[f][e].setAttribute("class", "")
			}
			a.selection = [];
			a.selected = [];
			a.place = []
		},
		selectCell: function() {
			for (var a = this.persist, b = this.getRange(), d = b.minX, e = b.maxX, f = b.maxY, b = b.minY; b <= f; b++)
			for (var g = d; g <= e; g++)
			a.selection.push(b + this.options.separator + g), a.storage[b][g] && a.selected.push(a.storage[b][g])
		},
		renderSelection: function() {
			for (var a = this.persist, b = this.options, d = 0; d < a.selection.length; d++) {
				var e = a.selection[d].split(b.separator),
					f = e[0],
					e = e[1];
				a.storage[f][e] && a.storage[f][e].setAttribute("class", b.area)
			}
		},
		merge: function() {
			var a = this.persist,
				b = this.options;
			if (!this.options.beforeChangeCell(this, this.persist.selected)) return !1;
			if (this._checkMerge()) {
				for (var d = this._selectionTrans2ArrayStack(), e = 0, f = 0, g = 0; g < d[0].length; g++) {
					var k = d[0][g].split(b.separator),
						h = k[0],
						k = k[1];
					a.storage[h][k] && (e += a.storage[h][k].colSpan)
				}
				for (g = 0; g < d.length; g++)
				for (var l = 0; l < d[g].length; l++)
				k = d[g][l].split(b.separator), h = k[0], k = k[1], a.storage[h][k] && 0 === l && (f += a.storage[h][k].rowSpan, 1 < d[g][0].rowSpan && (g = g + a.storage[h][k].rowSpan - 1));
				a.place = [];
				a.selected = [];
				for (g = 0; g < d.length; g++)
				for (l = 0; l < d[g].length; l++)
				k = d[g][l].split(b.separator), h = k[0], k = k[1], a.storage[h][k] && (0 === g && 0 === l ? (a.place.push(a.storage[h][k]), a.selected.push(a.storage[h][k]), a.storage[h][k].rowSpan = f, a.storage[h][k].colSpan = e, a.range.start = d[g][l], a.range.end = d[g][l]) : (a.storage[h][k].parentNode.removeChild(a.storage[h][k]), a.storage[h][k] = null))
			}
		},
		clearMerge: function() {
			var a = this.persist,
				b = a.place;
			if (!this.options.beforeChangeCell(this, this.persist.selected)) return !1;
			if (b && 0 != b.length) {
				for (var d = 0; d < b.length; d++) {
					for (var e = b[d], f = this.getCellIndex(e).split(this.options.separator), g, k = 0; k < e.rowSpan; k++) {
						g = 0 === k ? e.parentNode : h(g).next()[0];
						for (var l = 0; l < e.colSpan; l++)
						if (0 !== l || 0 !== k) {
							var m = n.createElement(e.tagName.toLowerCase()),
								s = this.getPreviousSiblingStorageElementNotNull(~~f[0] + k, ~~f[1] + l);
							s ? this.nextSibling(s) ? g.insertBefore(m, this.nextSibling(s)) : g.appendChild(m) : this.firstChild(g) ? g.insertBefore(m, this.firstChild(g)) : g.appendChild(m);
							a.storage[~~f[0] + k][~~f[1] + l] = m;
							a.selected.push(m);
							this.options.afterCreateCell(this, h(m));
							m.setAttribute("class", this.options.area)
						}
					}
					e.rowSpan = 1;
					e.colSpan = 1
				}
				a.place = []
			}
		},
		deleteRow: function(a) {
			if (!this.options.beforeChangeCell(this, this.persist.selected)) return !1;
			a = this._selectionTrans2ArrayStack();
			for (var b, d = 0; d < a.length; d++) {
				var e = a[d][0].split(this.options.separator);
				0 === d && (b = new Number(e[0]));
				this._deleteRowHandler(b, new Number(e[1]));
				this.options.rows--
			}
			this.clearSelection();
			this.options.afterDeleteRow(this)
		},
		_deleteRowHandler: function(a, b, d) {
			var e = this.persist;
			b = e.storage[a][b];
			for (var f = 0; f < e.storage[a].length; f++) {
				var g = e.storage[a][f];
				if (g) {
					if (1 < g.rowSpan) {
						var k = this.nextRow(b.parentNode),
							l = n.createElement(g.tagName.toLowerCase());
						l.rowSpan = g.rowSpan - 1;
						l.colSpan = g.colSpan;
						if (0 === f) k.insertBefore(l, this.firstChild(k));
						else {
							for (var g = 0, m = e.storage[a + 1][f - 1]; !m;)
							g++, m = 0 > f - 1 - g ? this.firstChild(k) : e.storage[a][f - 1 - g];
							k.insertBefore(l, this.nextSibling(m))
						}
						e.storage[a + 1][f] = l;
						this.options.afterCreateCell(this, h(l))
					}
				} else {
					k = a - 1;
					if (-1 !== k) for (; !e.storage[k][f] && (k--, -1 !== k););
					if (-1 !== k) {
						if (e.storage[k][f]) if (1 < e.storage[k][f].rowSpan) e.storage[k][f].rowSpan--, 1 < e.storage[k][f].colSpan && (f += e.storage[k][f].colSpan - 1);
						else if (0 < f) if (e.storage[a][f - 1]) f += e.storage[a][f - 1].colSpan - 1 - 1;
						else {
							k = a - 1;
							if (-1 !== k) for (; !e.storage[k][f - 1] && (k--, -1 !== k););
							e.storage[k][f - 1] && (e.storage[k][f - 1].rowSpan--, f += e.storage[k][f - 1].colSpan - 2)
						}
					} else f += e.storage[a][f - 1].colSpan - 1 - 1
				}
			}
			e.storage.splice(a, 1);
			!0 === d ? (k = this.getRow(a), k.parentNode.removeChild(k)) : b.parentNode.parentNode.removeChild(b.parentNode)
		},
		deleteCol: function() {
			if (!this.options.beforeChangeCell(this, this.persist.selected)) return !1;
			if (this.persist.selection && 0 < this.persist.selection.length) for (var a, b, d = this._selectionTrans2ArrayStack(), e = 0; e < d[0].length; e++) {
				var f = d[0][e].split(this.options.separator);
				0 === e && (a = new Number(f[0]), b = new Number(f[1]));
				this._deleteColHandler(a, b);
				this.options.thArray.splice(b, 1);
				this.options.cols--
			}
			this.clearSelection();
			this.initHeader();
			this.options.afterDeleteCol(this)
		},
		_deleteColHandler: function(a, b) {
			for (var d = this.persist, e = 0; e < d.storage.length; e++) {
				var f = d.storage[e][b];
				if (f) 1 < f.colSpan ? f.colSpan -= 1 : (d.storage[e].splice(b, 1), f.parentNode.removeChild(f));
				else {
					var f = !1,
						g = b;
					if (0 <= g) for (; !d.storage[e][g] && !(g--, 0 > g););
					if (0 <= g) {
						var h = d.storage[e][g].rowSpan;
						if (d.storage[e][g].colSpan + g > b && 1 < d.storage[e][g].colSpan) {
							d.storage[e][g].colSpan--;
							if (1 < h) {
								for (g = 1; g < h; g++)
								d.storage[e + g].splice(b, 1);
								e += h - 1
							} else f = !0;
							d.storage[e - h + 1].splice(b, 1)
						}
					}!1 === f && d.storage[e].splice(b, 1)
				}
			}
		},
		addCol: function() {
			var a = this.persist;
			if (!this.options.beforeChangeCell(this, this.persist.selected)) return !1;
			a.selection && 0 < a.selection.length ? (a = this._selectionTrans2ArrayStack(), a = this.index2Obj(a[0][a[0].length - 1]), this._addColHandler(a.y, a.x)) : this._addLastColHandler();
			this.options.cols++;
			this.initHeader()
		},
		_addLastColHandler: function() {
			for (var a = this.persist.storage, b = [], d = 0; d < a.length; d++) {
				var e = n.createElement("td");
				a[d].push(e);
				this.getRow(d).appendChild(e);
				b.push(e)
			}
			this.options.thArray.push(this.options.minColWidth);
			this.options.afterCreateCell(this, b)
		},
		_addColHandler: function(a, b) {
			var d = this.persist,
				e = this.findCell(a, b);
			this.options.thArray.splice(b + 1, 0, this.options.minColWidth);
			var f = this.getCellIndex(e).split(this.options.separator);
			a = ~~f[0];
			b = ~~f[1];
			for (var f = [a, b], g = null, k = 0; k < d.storage.length; k++) {
				var l = !1,
					m = d.storage[k][b];
				null === g && (g = b + e.colSpan);
				if (m) {
					if (m.colSpan + b < g) {
						for (l = 0; l < d.storage[k].length; l++)
						if (d.storage[k][l] && d.storage[k][l].colSpan + l >= g) {
							m = d.storage[k][l];
							b = l;
							break
						}
						l = m.colSpan + b > g ? !0 : !1
					} else m.colSpan + b > g && (l = !0);
					if (!1 === l) {
						if (l = n.createElement(m.tagName.toLowerCase()), this.nextSibling(m) ? m.parentNode.insertBefore(l, this.nextSibling(m)) : m.parentNode.appendChild(l), this.options.afterCreateCell(this, h(l)), d.storage[k].splice(g, 0, l), 1 < m.rowSpan) {
							for (var s = null, u = 1; u < m.rowSpan; u++) {
								var l = n.createElement(m.tagName.toLowerCase()),
									s = s ? this.nextRow(s) : this.nextRow(m.parentNode),
									r = g - 1;
								if (0 <= r) for (; !d.storage[k + u][r] && !(r--, 0 > r););
								d.storage[k + u][r] ? this.nextSibling(d.storage[k + u][r]) ? s.insertBefore(l, this.nextSibling(d.storage[k + u][r])) : s.appendChild(l) : this.firstChild(s) ? s.insertBefore(l, this.firstChild(s)) : s.appendChild(l);
								this.options.afterCreateCell(this, h(l));
								d.storage[k + u].splice(g, 0, l)
							}
							k += m.rowSpan - 1
						}
					} else {
						d.storage[k].splice(g, 0, null);
						if (1 < m.rowSpan) {
							for (u = 1; u < m.rowSpan; u++)
							d.storage[k + u].splice(g, 0, null);
							k += m.rowSpan - 1
						}
						m.colSpan++
					}
				} else {
					m = b;
					if (0 <= m) for (; !d.storage[k][m] && !(m--, 0 > m););
					if (d.storage[k][m]) {
						if (m === parseInt(f[1])) for (s = null, u = 0; u < d.storage[k][m].rowSpan; u++) {
							0 === u ? s = d.storage[k][m].parentNode : s && (s = this.nextRow(s));
							l = n.createElement(d.storage[k][m].tagName.toLowerCase());
							if (0 === u) this.nextSibling(d.storage[k + u][m]) ? s.insertBefore(l, this.nextSibling(d.storage[k + u][m])) : s.appendChild(l);
							else {
								r = m;
								if (0 < r) for (; !d.storage[k + u][r] && !(r--, 0 > r););
								d.storage[k + u][r] ? TableUtils.nextSibling(d.storage[k + u][r]) ? s.insertBefore(l, this.nextSibling(d.storage[k + u][r])) : s.appendChild(l) : this.firstChild(s) ? s.insertBefore(l, this.firstChild(s)) : s.appendChild(l)
							}
							this.options.afterCreateCell(this, h(l));
							d.storage[k + u].splice(m + d.storage[k][m].colSpan, 0, l)
						} else {
							d.storage[k].splice(g, 0, null);
							if (1 < d.storage[k][m].rowSpan) for (u = 1; u < d.storage[k][m].rowSpan; u++)
							d.storage[k + u].splice(g, 0, null);
							d.storage[k][m].colSpan++
						}
						k += d.storage[k][m].rowSpan - 1
					}
				}
			}
		},
		addRow: function() {
			var a = this.persist;
			if (!this.options.beforeChangeCell(this, this.persist.selected)) return !1;
			a.selection && 0 < a.selection.length ? (a = this._selectionTrans2ArrayStack(), a = this.index2Obj(a[a.length - 1][0]), this._addRowHandler(a.y, a.x)) : this._addLastRowHandler();
			this.options.rows++
		},
		_addLastRowHandler: function() {
			for (var a = n.createElement("tr"), b = [], d = this.options.cols, e = 0; e < d; e++) {
				var f = n.createElement("td");
				a.appendChild(f);
				b.push(f)
			}
			this.persist.storage.push(b);
			this.$table.find("tbody")[0].appendChild(a);
			this.options.afterCreateCell(this, b)
		},
		_addRowHandler: function(a, b) {
			var d = this.persist,
				e = this.findCell(a, b),
				f = d.storage.length,
				g = d.storage[a].length,
				k = [
					[]
				],
				l = n.createElement(e.parentNode.tagName.toLowerCase());
			this.nextRow(e.parentNode) ? a === f - 1 ? e.parentNode.parentNode.appendChild(l) : e.parentNode.parentNode.insertBefore(l, this.getRow(a + 1)) : e.parentNode.parentNode.appendChild(l);
			if (a === f - 1) {
				for (f = 0; f < g; f++) {
					var m = n.createElement(e.tagName.toLowerCase());
					l.appendChild(m);
					this.options.afterCreateCell(this, h(m));
					k[0][f] = m
				}
				d.storage = d.storage.concat(k)
			} else {
				for (f = 0; f < d.storage[a].length; f++)
				if (d.storage[a][f]) if (1 < d.storage[a][f].rowSpan) {
					if (k[0][f] = null, d.storage[a][f].rowSpan++, 1 < d.storage[a][f].colSpan) {
						for (g = 1; g < d.storage[a][f].colSpan; g++)
						k[0][f + g] = null;
						f += d.storage[a][f].colSpan - 1
					}
				} else {
					if (m = n.createElement(e.tagName.toLowerCase()), l.appendChild(m), this.options.afterCreateCell(this, h(m)), k[0][f] = m, 1 < d.storage[a][f].colSpan) {
						for (g = 1; g < d.storage[a][f].colSpan; g++)
						m = n.createElement(e.tagName.toLowerCase()), l.appendChild(m), this.options.afterCreateCell(this, h(m)), k[0][f + g] = m;
						f += d.storage[a][f].colSpan - 1
					}
				} else {
					k[0][f] = null;
					for (var s = a; !d.storage[s][f];)
					s--;
					if (d.storage[s][f].rowSpan + s - 1 === a) {
						if (m = n.createElement(e.tagName.toLowerCase()), l.appendChild(m), k[0][f] = m, this.options.afterCreateCell(this, h(m)), 1 < d.storage[s][f].colSpan) {
							for (g = 1; g < d.storage[s][f].colSpan; g++)
							m = n.createElement(e.tagName.toLowerCase()), l.appendChild(m), this.options.afterCreateCell(this, h(m)), k[0][f + g] = m;
							f += d.storage[s][f].colSpan - 1
						}
					} else if (d.storage[s][f].rowSpan++, 1 < d.storage[s][f].colSpan) {
						for (g = 1; g < d.storage[s][f].colSpan; g++)
						k[0][f + g] = null;
						f += d.storage[s][f].colSpan - 1
					}
				}
				d.storage.splice(a + 1, 0, k[0])
			}
		},
		resizable: function(a) {
			var b = this;
			b.$table.find("th").resizable({
				handles: "e",
				minWidth: b.options.minColWidth,
				maxWidth: a,
				stop: function(a, e) {
					b.options.thArray[e.element.index()] = e.size.width;
					b.options.afterChangeWidth(b, b.options.thArray)
				}
			})
		},
		_selectionTrans2ArrayStack: function(a) {
			a = a ? a : this.persist.selection;
			for (var b = [], d = 0; d < a.length; d++) {
				var e = a[d].split(this.options.separator)[0];
				b[e] || (b[e] = []);
				b[e].push(a[d])
			}
			a = [];
			e = 0;
			for (d in b)
			a[e] = b[d], e++;
			return a
		},
		getRowIndex: function(a) {
			for (var b = a.parent().children(), d = 0; d < b.length; d++)
			if (b[d] == a[0]) return d
		},
		getCellIndex: function(a) {
			var b = this.persist,
				d = this.getRowIndex(h(a).parent());
			if (b.storage[d]) for (var e = 0; e < b.storage[d].length; e++)
			if (a == b.storage[d][e]) return d + this.options.separator + e
		},
		nextRow: function(a) {
			for (var b = this.getTableRows(), d = 0, e = 0; e < b.length; e++)
			if (b[e] === a) {
				d = e;
				break
			}
			return b[d + 1] ? b[d + 1] : null
		},
		findCell: function(a, b) {
			var d = this.persist,
				e = d.storage[a][b];
			if (!e) {
				var f = a;
				a: for (; 0 <= f; f--) {
					var g = b;
					b: for (; 0 <= g; g--)
					if (d.storage[f][g]) {
						var g = d.storage[f][g],
							h = g.colSpan,
							l = g.rowSpan,
							m = this.getCellIndex(g).split(this.options.separator);
						if (~~m[1] + h - 1 >= b && ~~m[0] + l - 1 >= a) {
							e = g;
							break a
						} else break b
					}
				}
			}
			return e
		},
		getPreviousSiblingStorageElementNotNull: function(a, b) {
			var d = this.persist,
				e = b - 1;
			if (0 <= e) for (; !d.storage[a][e] && !(e--, 0 > e););
			return d.storage[a][e]
		},
		nextSibling: function(a) {
			return a.nextElementSibling || a.nextSibling
		},
		firstChild: function(a) {
			return a.firstElementChild || a.firstChild
		},
		getRow: function(a) {
			return this.getTableRows()[a]
		},
		getTableRows: function() {
			return this.$element.find("tbody tr")
		},
		index2Obj: function(a) {
			return a ? (a = a.split(this.options.separator), {
				y: parseInt(a[0]),
				x: parseInt(a[1])
			}) : null
		}
	};
	h.fn.table = function(a) {
		return (new b(this, a)).init()
	}
})(jQuery, window, document);
*/
/*
	表格布局中实现右键菜单的jquery组件
	与table.js里面的代码相同，可以不要，尝试删除掉
*/
/*
(function(h) {
	var m = function(m, l) {
			this.$element = h(m);
			this.before = l.before || this.before;
			this.onItem = l.onItem || this.onItem;
			this.scopes = l.scopes || null;
			l.target && this.$element.data("target", l.target);
			this.listen()
		};
	m.prototype = {
		constructor: m,
		show: function(m) {
			var l, b, a = {
				relatedTarget: this,
				target: m.currentTarget
			};
			if (!this.isDisabled() && (this.closemenu(), !1 !== this.before.call(this, m, h(m.currentTarget)))) return l = this.getMenu(), l.trigger(h.Event("show.bs.context", a)), b = this.getPosition(m, l), l.attr("style", "").css(b).addClass("open").on("click.context.data-api", "li:not(.divider)", h.proxy(this.onItem, this, h(m.currentTarget))).trigger("shown.bs.context", a), l.find("ul").show(), h("html").on("click.context.data-api", l.selector, h.proxy(this.closemenu, this)), !1
		},
		closemenu: function(m) {
			var l;
			m = this.getMenu();
			m.hasClass("open") && (l = {
				relatedTarget: this
			}, m.trigger(h.Event("hide.bs.context", l)), m.removeClass("open").off("click.context.data-api", "li:not(.divider)").trigger("hidden.bs.context", l), m.find("ul").hide(), h("html").off("click.context.data-api", m.selector))
		},
		keydown: function(h) {
			27 == h.which && this.closemenu(h)
		},
		before: function(h) {
			return !0
		},
		onItem: function(h) {
			return !0
		},
		listen: function() {
			this.$element.on("contextmenu.context.data-api", this.scopes, h.proxy(this.show, this));
			h("html").on("click.context.data-api", h.proxy(this.closemenu, this));
			h("html").on("keydown.context.data-api", h.proxy(this.keydown, this));
			h("html").on("mousedown.context.data-api", h.proxy(this.mousedown, this))
		},
		mousedown: function(m) {
			0 == h(m.target).closest(".table_layout_js").length && this.closemenu(m)
		},
		destroy: function() {
			this.$element.off(".context.data-api").removeData("context");
			h("html").off(".context.data-api")
		},
		isDisabled: function() {
			return this.$element.hasClass("disabled") || this.$element.attr("disabled")
		},
		getMenu: function() {
			var m = this.$element.data("target"),
				l;
			m || (m = (m = this.$element.attr("href")) && m.replace(/.*(?=#[^\s]*$)/, ""));
			return (l = h(m)) && l.length ? l : this.$element.find(m)
		},
		getPosition: function(m, l) {
			var b = m.clientX,
				a = m.clientY,
				c = h(window).width(),
				d = h(window).height(),
				e = l.find(".dropdown-menu").outerWidth(),
				f = l.find(".dropdown-menu").outerHeight(),
				a = a + f > d ? {
					top: a - f + h(window).scrollTop()
				} : {
					top: a + h(window).scrollTop()
				},
				b = b + e > c && 0 < b - e ? {
					left: b - e + h(window).scrollLeft()
				} : {
					left: b + h(window).scrollLeft()
				},
				c = l.offsetParent().offset();
			b.left -= c.left;
			a.top -= c.top;
			return h.extend({
				position: "absolute",
				"z-index": 9999
			}, a, b)
		}
	};
	h.fn.contextmenu = function(n, l) {
		return this.each(function() {
			var b = h(this),
				a = b.data("context"),
				c = "object" == typeof n && n;
			a || b.data("context", a = new m(b, c));
			"string" == typeof n && a[n].call(a, l)
		})
	};
	h.fn.contextmenu.Constructor = m;
	h(document).on("contextmenu.context.data-api", function() {
		h('[data-toggle="context"]').each(function() {
			var m = h(this).data("context");
			m && m.closemenu()
		})
	}).on("contextmenu.context.data-api", '[data-toggle="context"]', function(m) {
		h(this).contextmenu("show", m);
		m.preventDefault();
		m.stopPropagation()
	})
})(jQuery);
*/
define("form/component/phone", ["form/component", "form/tplutil"], function(h, m, n) {
	m = h("form/component");
	var l = h("form/tplutil");
	window.Phone = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Phone",
				title: "电话",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: "",
				size: "medium"
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.fieldId = b.fieldId, this.componentSetup.size = b.size);
			this.tpl = l.get("phone")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-phone");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-phone");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-phone");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").addClass(this.componentSetup.size);
			d.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			a && d.find(".check_js").val("");
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			d.addClass(this.componentSetup.titleLayout);
			this.readOnly(d, c);
			this.el = b;
			b.append(d)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-phone");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").addClass(this.componentSetup.size);
			a.attr("id", this.componentSetup.fieldId);
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-phone");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			c.on("blur", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "input[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
				c = b.attr("placeholder"),
				d = {};
			d.element = b;
			a == c && (a = "");
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			"" == a || this.tel(a) || (d.message = this.componentSetup.title + "格式有误，请输入有效的电话号码");
			return d
		},
		tel: function(b) {
			return /(^(\d{7,8})$)|(^\((\d{3,4})\)(\d{7,8})$)|(^(\d{3,4})-(\d{7,8})$)|(^(\d{3,4})(\d{7,8})$)|(^(\d{3,4})(\d{7,8})-(\d{1,4})$)|(^(\d{3,4})-(\d{7,8})-(\d{1,4})$)|(^\((\d{3,4})\)(\d{7,8})-(\d{1,4})$)|(^(\d{7,8})-(\d{1,4})$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/.exec(b) ? !0 : !1
		},
		getValue: function(b) {
			var a = $.trim(b.val());
			b = b.attr("placeholder");
			var c = this.oldValue,
				d = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: a
				};
			this.oldValue = a;
			return c && 0 < c.length || "" != a && a != b && this.tel(a) ? d : null
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content;
				b.find("#" + this.componentSetup.fieldId).val(c);
				b.find(".j_readOnly").html(c);
				this.oldValue = c
			}
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("readOnly", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	n.exports = window.Phone
});
define("form/component", function(h, m, n) {
	h = Backbone.View.extend({
		el: "#form",
		componentSetup: {},
		initialize: function(h) {
			this.name = h.name;
			this.componentmodel = null
		},
		render: function(h) {
			console.error("you need to rewrite the method : render")
		},
		renderEditor: function() {
			console.error("you need to rewrite the method : renderSetUp")
		},
		renderPreview: function(h, b, a) {
			console.error("you need to rewrite the method : renderPreview")
		},
		renderEditPreview: function(h) {
			console.error("you need to rewrite the method : renderEditPreview")
		},
		submitCheck: function(h, b) {
			console.error("you need to rewrite the method : submitCheck")
		},
		checkEvents: function(h) {
			console.error("you need to rewrite the method : checkEvents")
		},
		readOnly: function(h, b) {
			console.error("you need to rewrite the method : readOnly")
		},
		stringify: function(h) {
			return JSON.stringify(h)
		},
		toStringify: function() {
			return null != this.componentSetup ? this.stringify(this.componentSetup) : null
		},
		toComponent: function(h) {
			if (null == JSON.parse(h).componentKey) return null
		},
		saveComponentValue: function(h, b) {
			"mobile" != window.systemInfo_form && h.parents(".field_js").get(0) && h.parents(".field_js")
		},
		setComponentModel: function(h) {
			this.componentmodel = h
		}
	});
	n.exports = h
});
define("form/tplutil", function(h, m, n) {
	n.exports = {
		text: '<div id="form-text" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">文本输入框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-text" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>此控件最大支持输入200个文字<br><b>2.</b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3.</b>您可以切换"控件大小"来改变控件的尺寸<br><b>4.</b>您可以切换单行或多行文本框</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label><label class="radio-inline"><input type="radio" value="user-defined" name="tSize">自定义</label><div name="user-defined-div" class="user-defined-div hide"><div class="comp-width fl"><span class="fl">宽度</span><div class="form-error fl"></div><div id="user-defined-width" contenteditable="true" class="user-defined-width fl"></div></div><div class="comp-height fl"><span class="fl">高度</span><div class="form-error fl"></div><div id="user-defined-height" contenteditable="true" class="user-defined-height fl"></div></div></div></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="Text">单行文本框</label><label class="radio-inline"><input type="radio" name="componentType" value="TextArea">多行文本框</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-text" componentKey="Text" class="field field_js"><label class="widget-title"><span class="widget-title_js">文本输入框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" componentKey="Text" class="form-control check_js"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		textarea: '<div id="form-textarea" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">多行文本框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><textarea class="form-control medium"></textarea></div></div><div id="editor-textarea" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件不限制输入文字个数<br><b>2. </b>如果勾选必填项的话，在填写表单是此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸<br><b>4. </b>您可以切换单行或多行文本框</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="Text">单行文本框</label><label class="radio-inline"><input type="radio" name="componentType" value="TextArea">多行文本框</label></div></div></div><div id="preview-textarea" componentKey="TextArea" class="field field_js"><label class="widget-title"><span class="widget-title_js">多行文本框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><textarea componentKey="TextArea" class="form-control check_js"></textarea><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-textarea" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		columnpanel: '<div id="form-columnpanel-2" class="form-layout form-layout_js"><div class="column-layout two-columns columns_js"><div class="cell cell_js"></div><div class="cell cell_js"></div></div><div class="form-layout-toolbar"><span class="j_layoutDrag layoutDrag-btn"><i class="icon-move"></i>拖拽</span><span class="j_layoutDele layoutDele-btn j_cancel-drag"><i class="icon-trash"></i>删除</span></div></div><div id="form-columnpanel-3" class="form-layout form-layout_js"><div class="column-layout three-columns columns_js"><div class="cell cell_js"></div><div class="cell cell_js"></div><div class="cell cell_js"></div></div><div class="form-layout-toolbar"><span class="j_layoutDrag layoutDrag-btn"><i class="icon-move"></i>拖拽</span><span class="j_layoutDele layoutDele-btn j_cancel-drag"><i class="icon-trash"></i>删除</span></div></div><div id="preview-columnpanel-2" componentkey="ColumnPanel" class="form-layout form-layout_js"><div class="column-layout two-columns columns_js"><div class="cell cell_js"></div><div class="cell cell_js"></div></div></div><div id="preview-columnpanel-3" componentkey="ColumnPanel" class="form-layout form-layout_js"><div class="column-layout three-columns columns_js"><div class="cell cell_js"></div><div class="cell cell_js"></div><div class="cell cell_js"></div></div></div>',
		datatable: '<div id="form-datatable" class="form-databox-wrap subform_js field"><div class="form-databox-head"><div class="title j_datatableTitle hide"></div><div class="desc j_datatableDescription hide"></div></div><div class="form-layout-toolbar"><span class="edit-btn j_cancel-drag field_subform_js"><i class="icon-pencil"></i>编辑子表</span><span class="addColum-btn j_cancel-drag addSubColum_js"><i class="icon-plus"></i>添加列</span><span class="layoutDrag-btn"><i class="icon-move"></i>拖拽子表</span><span class="layoutDele-btn j_cancel-drag j_layoutDele"><i class="icon-trash"></i>删除子表</span></div><div id="" class="form-databox j_cancel-drag"><table class="table table-bordered subtable_js"><tr class="subtr_js"><td class="subtd_js" style="height: 71px;"></td><td class="subtd_js" style="height: 71px;"></td></tr></table></div></div><div id="editor-datatable"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>您可以选择是否显示子表标题<br><b>2. </b>您可更改默认显示行数(注意：默认行数只允许输入0-10之间的正整数)<br></div></div><div class="form-group"><label>标题</label><input id="component-title-datatable" type="text" class="form-control w-full" maxlength="100"></div><div class="form-group"><label>描述</label><textarea id="component-describe-datatable" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>默认行数</label><div><input type="text" class="form-control w-100" id="datatable-defaultRows"></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-datatable" componentKey="DataTable" class="form-databox-wrap subform_js field"><div class="form-databox-head"><div class="j_maximize opt-maximize"><i class="icon-expand" title="最大化编辑"></i></div><div class="title j_datatableTitle hide"></div><div class="desc j_datatableDescription hide"></div><div class="j_setFiled opt-print hide"><i class="icon-hammer" title="设置显示列" style="z-index: 200;position: relative;"></i></div></div><div class="form-databox"><table class="table table-bordered subtable_js"></table></div></div><div id="preview-filed" class="hide modal fade wform-column-content" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h5 class="modal-title">设置列</h5></div><div  class="modal-body"><p class="wform-tip pv-10 mb-15">下方字段为当前明细表字段，勾选需要隐藏的字段。</p><ul id="columnFileds" class="wform-column-list"></ul><div id="columnFiledsClone" class="hide"><li class="checkbox"><label><span class="j_sort sn"></span><input class="j_column" type="checkbox" name="column"/><span class="j_filedName"></span><span class="tip j_bewrite"></span></label></li></div></div><div class="modal-footer"><a id="saveColumn" class="btn btn-sm btn-primary fr mr-10" data-dismiss="modal" aria-hidden="true">确定</a></div></div></div></div><div id="operating-datatable"><table><tr><th class="subtd_option subtradd_js"><label class="widget-title"><a title="添加">新建</a></label></th><td class="subtd_option subtrdel_js"><a title="删除">删除</a></td></tr></table></div><div id="mobile-preview" componentKey="DataTable" class="form-databox-wrap subform_js"><div class="form-databox"><div class="form-databox-hd"><div class="title j_subFormTitle"></div><span class="ico-add j_mobileSubadd"></span><div class="desc j_subFormDesc hide"></div></div><div class="clearfix ps-r"><div class="of-x-a j_scrollSubform"><span class="ico-scr-arrow icon-arrow-left j_arrow-left hide"></span><span class="ico-scr-arrow icon-arrow-right j_arrow-right hide"></span><table class="table table-bordered subtable_js subtable_tab_m"></table></div></div></div></div><div id="mobile-subFillDetail" class="j_page-view page-view form-view" data-role="page"><header class="header-fixed hide"><h1>子表明细</h1></header><section class="view-con"><div class="j_moblieSubForm"><div class="form-databox-opt"><a class="j_continueSave">保存并继续添加</a></div></div></section><div class="eui-foot-tools"><a class="j_cancelAdd">取消</a><a class="j_confirmAdd">确认</a></div></div><div id="datatableMaximize" class="modal form-databox-full fade " tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button aria-hidden="true" data-dismiss="modal" class="close" type="button"><i class="icon-contract"></i></button><h5 class="modal-title">子表预览</h5></div><div class="modal-body"><div class="form-preview"><div id="maximizePreview" class="form-view"></div></div></div></div></div></div>',
		dividingline: '<div id="form-dividingline" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="divider-line solid"></div></div><div id="editor-dividingline" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以用于划分您所制作的表单区域<br><b>2. </b>您可以随意切换线条的类型：实线、虚线、粗实线、粗虚线、双实线和双虚线<br><b>3. </b>您可以随意选择线条的颜色<br></div></div><div class="form-group"><label>切换分割线类型</label><div class="controls"><div class="dividerchoicelist"><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="solid"><div class="divider-line solid"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="dashed"><div class="divider-line dashed"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="thicksolid"><div class="divider-line thicksolid"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="thickdashed"><div class="divider-line thickdashed"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="solid-double"><div class="divider-line solid-double"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="thicksolid-double"><div class="divider-line thicksolid-double"></div></label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div><label>分割线颜色</label><div class="color-box"></div></div><div id="preview-dividingline" componentkey="DividingLine" class="field field-divider field_js"><div class="divider-line"></div></div>',
		date: '<div id="form-date" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">日期</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap"><div class="form-timebox"><input type="text" class="form-control form-w150" placeholder="年-月-日"></div></div></div></div><div id="editor-date" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以填写三种不同格式的日期<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以随意设置三种日期格式<br><b>4. </b>如果勾选"系统日期"，系统会默认显示当前时间作为您要填写的日期<br><b>5. </b>如果勾选"是否只读"，系统会默认这个当前日期不能被更改</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>日期格式设置</label><div class="controls"><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM-dd HH:mm">年-月-日     时:分</label></div><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM-dd">年-月-日</label></div><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM">年-月</label></div></div></div><div class="form-group"><label>默认日期设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="systemDate">系统日期</label></div><div class="checkbox date_readonly_js hide"><label><input type="checkbox" id="readonly">是否只读</label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-date" componentkey="DateComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">日期</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap"><div class="form-timebox"><input type="text" class="form-control form-w150 check_js j_datetimepicker" componentkey="DateComponent" placeholder="年-月-日"><div class="input-instead j_readOnly hide"></div></div></div></div></div><div id="mobile-preview" componentkey="DateComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">日期</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap"><div class="form-timebox"><input type="text" class="form-control form-w150 check_js j_date_selected" componentkey="DateComponent" placeholder="年-月-日" readonly="readonly"><div class="input-instead j_readOnly hide"></div></div></div></div></div><div id="statsearch-date" class="inner-el"><span class="sch-item-period j_datetime"><input type="text" id="startDate" name="startDate" class="form-control datepicker textinput"><span class="spline">-</span><input type="text" id="endDate" name="endDate" class="form-control datepicker textinput"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		dateinterval: '<div id="form-dateinterval" class="field field_js" componentKey="DateInterval"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">日期区间</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap"><div class="form-timebox"><input type="text" class="form-control" placeholder="年-月-日"></div><span class="space-line">-</span><div class="form-timebox"><input type="text" class="form-control" placeholder=年-月-日></div></div></div></div><div id="editor-dateinterval" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件相当于两个日期控件组合在一起的复合控件，它可以代表一段时间区间（起止时间）<br><b>2. </b>开始时间必须早于或等于结束时间，结束时间必须晚于或等于开始时间<br><b>3. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>4. </b>您可以随意设置三种日期格式</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>日期格式设置</label><div class="controls"><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM-dd HH:mm">年-月-日     时:分</label></div><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM-dd">年-月-日</label></div><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM">年-月</label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-dateinterval" componentKey="DateInterval" class="field field_js"><label class="widget-title"><span class="widget-title_js">日期区间</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content "><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap check_js"><div class="form-timebox" datetype="startDate"><input type="text" class="form-control form-w150" componentKey="DateInterval" placeholder="年-月-日"></div><span class="space-line">-</span><div class="form-timebox" datetype="endDate"><input type="text" class="form-control form-w150" componentKey="DateInterval" placeholder="年-月-日"></div></div><div class="input-instead j_readOnly hide"></div></div></div><div id="mobile-preview" componentKey="DateInterval" class="field field_js"><label class="widget-title"><span class="widget-title_js">日期区间</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content "><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap check_js"><div class="form-timebox" datetype="startDate"><input type="text" class="form-control form-w150 j_date_selected" componentKey="DateInterval" placeholder="年-月-日" readonly="readonly"></div><span class="space-line">-</span><div class="form-timebox" datetype="endDate"><input type="text" class="form-control form-w150 j_date_selected" componentKey="DateInterval" placeholder="年-月-日" readonly="readonly"></div></div><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-dateinterval" class="inner-el"><span class="sch-item-period j_datetime"><input type="text" id="startDate" name="startDate" class="form-control datepicker textinput"><span class="spline">-</span><input type="text" id="endDate" name="endDate" class="form-control datepicker textinput"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		option: '<div id="form-option" class=""><li class="RadioBox_js"><label><input type="radio" name="form-radiobox" value="" disabled=""><span>选项</span></label></li><li class="CheckBox_js"><label><input type="checkbox" name="form-checkbox" value="" disabled=""><span>选项</span></label></li><select><option class="Select_js">选项</option></select></div><div id="editor-option"><li class="RadioBox_js"><input type="radio" name="editor-option" class="option_js"><input type="text" class="form-control optionName_js"><span class="cs-p"><i class="icon-minus-sign minusoption_js"></i></span><span class="cs-p"><i class="icon-plus-sign plusoption_js"></i></span></li><li class="CheckBox_js"><input type="checkbox" name="editor-option" class="option_js"><input type="text" class="form-control optionName_js"><span class="cs-p"><i class="icon-minus-sign minusoption_js"></i></span><span class="cs-p"><i class="icon-plus-sign plusoption_js"></i></span></li><li class="Select_js"><input type="radio" name="editor-option" class="option_js"><input type="text" class="form-control optionName_js"><span class="cs-p"><i class="icon-minus-sign minusoption_js"></i></span><span class="cs-p"><i class="icon-plus-sign plusoption_js"></i></span></li><li class="otherOption_js input-otherchoice"><span>其他</span><input type="text" class="form-control" value="" disabled=""><span class="cs-p"><i class="icon-minus-sign minusoption_js"></i></span></li></div><div id="preview-option" componentkey="Option" class="field"><li class="RadioBox_js"><label><input type="radio" name="form-radiobox" componentkey="Option"  value=""><span>选项</span></label></li><li class="CheckBox_js"><label><input type="checkbox" name="form-checkbox" componentkey="Option"  value=""><span>选项</span></label></li><select><option class="Select_js" componentkey="Option" >选项</option></select></div>',
		radiobox: '<div id="form-radiobox" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">单选框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><ul class="choicelist choicelist_js"></ul></div></div><div id="editor-radiobox"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件的选项是单选<br><b>2. </b>如果勾选必填项的话,在填写表单时此项是必须填写的<br><b>3. </b>您可以设置选项的名称，同时也可以添加选项<br><b>4. </b>您可以任意切换单选框、多选框和下拉菜单<br><b>5. </b>您可以切换横向或者纵向布局<br><b>6. </b>批量编辑可以让您快速编辑选项</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>选项设置</label><div class="controls"><ul class="choicelistEdit choicelistEdit_js"></ul><div class="ds-ib-w"><div class="plus-othercheckbox-btn"><a class="btn-default_js">添加其他</a></div><div class="plus-othercheckbox-btn"><a class="j_optBatcEdit">批量编辑</a></div></div></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="RadioBox">单选框</label><label class="radio-inline"><input type="radio" name="componentType" value="CheckBox">多选框</label><label class="radio-inline"><input type="radio" name="componentType" value="Select">下拉菜单</label></div></div><div class="form-group"><label>切换布局</label><div class="controls"><label class="radio-inline"><input type="radio" name="layout" value="choicelist-inline">横向排列</label><label class="radio-inline"><input type="radio" name="layout" value="choicelist-line">纵向排列</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-radiobox" componentkey="RadioBox" class="field field_js"><label class="widget-title"><span class="widget-title_js">单选框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><ul class="choicelist choicelist_js check_js"></ul><div class="input-instead j_readOnly hide"></div></div></div>',
		checkbox: '<div id="form-checkbox" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">单选框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><ul class="choicelist choicelist_js"></ul></div></div><div id="editor-checkbox"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件的选项可多选<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3. </b>您可以设置选项的名称，同时也可以添加选项<br><b>4. </b>您可以任意切换单选框、多选框和下拉菜单<br><b>5. </b>您可以切换横向或者纵向布局<br><b>6. </b>批量编辑可以让您快速编辑选项</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>选项设置</label><div class="controls"><ul class="choicelistEdit choicelistEdit_js"></ul><div class="ds-ib-w"><div class="plus-othercheckbox-btn"><a class="btn-default_js">添加其他</a></div><div class="plus-othercheckbox-btn"><a class="j_optBatcEdit">批量编辑</a></div></div></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="RadioBox">单选框</label><label class="radio-inline"><input type="radio" name="componentType" value="CheckBox">多选框</label><label class="radio-inline"><input type="radio" name="componentType" value="Select">下拉菜单</label></div></div><div class="form-group"><label>切换布局</label><div class="controls"><label class="radio-inline"><input type="radio" name="layout" value="choicelist-inline">横向排列</label><label class="radio-inline"><input type="radio" name="layout" value="choicelist-line">纵向排列</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-checkbox" componentkey="CheckBox" class="field field_js"><label class="widget-title"><span class="widget-title_js">单选框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide"></div><ul class="choicelist choicelist_js check_js"></ul><div class="input-instead j_readOnly hide"></div></div></div>',
		select: '<div id="form-select" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">下拉菜单</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><select class="choicelist form-control choicelist_js"></select></div></div><div id="editor-select"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件的选项可下拉<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3. </b>您可以设置选项的名称，同时也可以添加选项<br><b>4. </b>您可以切换控件大小来改变控件的尺寸<br><b>5. </b>您可以任意切换单选框、多选框和下拉菜单<br><b>6. </b>批量编辑可以让您快速编辑选项</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>选项设置</label><div class="controls"><ul class="choicelistEdit choicelistEdit_js"></ul><div class="ds-ib-w"><div class="plus-othercheckbox-btn"><a class="btn-default_js">添加其他</a></div><div class="plus-othercheckbox-btn"><a class="j_optBatcEdit">批量编辑</a></div></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="RadioBox">单选框</label><label class="radio-inline"><input type="radio" name="componentType" value="CheckBox">多选框</label><label class="radio-inline"><input type="radio" name="componentType" value="Select">下拉菜单</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-select" componentkey="Select" class="field field_js"><label class="widget-title"><span class="widget-title_js">下拉菜单</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><select class="choicelist form-control choicelist_js check_js"></select><input type="text" style="display: none;" placeholder="请填写其他内容" class="form-control form-w120 input-otherchoice"><div class="input-instead j_readOnly hide"></div></div></div>',
		paragraph: '<div id="form-paragraph" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="paragraph alert"></div></div><div id="editor-paragraph" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以用于一些表单中需要被文字描述的地方<br><b>2. </b>您可以在"段落内容"中随意输入自己需要的文字。可以对文字进行一系列的操作，例如：变色、加粗、斜体、字体、文字大小、居中等等.....<br><b>3. </b>您可以随意选择这段描述文字的背景颜色，提供了5种背景色<br></div></div><div class="form-group"><label>段落内容</label><textarea id="descriptionEdit" class="form-control"></textarea></div><div class="form-group"><label>选择段落样式</label><div class="controls"><div class="paragraphchoicelist"><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-success"><div class="paragraph alert alert-success"></div></label><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-info"><div class="paragraph alert alert-info"></div></label><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-warning"><div class="paragraph alert alert-warning"></div></label><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-danger"><div class="paragraph alert alert-danger"></div></label><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-e-default"><div class="paragraph alert alert-e-default"></div></label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-paragraph" componentkey="Paragraph" class="field field_js"><div class="paragraph alert"></div></div>',
		numbercomponent: '<div id="form-number" class="field field_js" componentKey="NumberComponent"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">数字输入框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-number" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只能输入数字（包括正数、负数、小数，不能输入英文、汉字和特殊符号）<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-number" componentKey="NumberComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">数字输入框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control check_js" componentKey="NumberComponent"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-number" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		money: '<div id="form-money" class="field field_js" componentKey="Money"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">金额</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="text" class="form-control"><span class="money_unit_js m-type"></span><span class="money_type_js m-type"></span></div></div></div><div id="editor-money" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只能输入数字（包括正数和小数，不能输入负数、英文、汉字和特殊符号）<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸<br><b>4. </b>您可以切换"选择货币"改变币种，改变币种的同时，下面的货币单位会随之联动<br><b>5. </b>您可以切换"货币单位"改变金额的单位</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>选择货币</label><div class="controls"><select id="moneyType" class="form-control form-w150 mb-10"><option value="人民币">人民币</option><option value="美元">美元</option><option value="日元">日元</option><option value="欧元">欧元</option><option value="港币">港币</option><option value="台币">台币</option></select></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-money" componentKey="Money" class="field field_js"><label class="widget-title"><span class="widget-title_js">金额</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="text" class="form-control check_js" componentKey="Money"><div class="input-instead j_readOnly hide"></div><span class="money_unit_js m-type"></span><span class="money_type_js m-type"></span></div></div></div><div id="statsearch-money" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		department: '<p class="department"><span class="j_name"></span></p><div id="form-department" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">部门选择</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList form-departmentList"><span title="添加团队" class="btn btn-sm disabled js_form-userItem-add"><i class="icon-plus"></i></span></div></div></div><div id="editor-department" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以用于添加部门，这些部门来自于您团队的部门<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>如果勾选"是否唯一 "，则只能添加一个部门<br><b>4. </b>如果勾选"默认部门 "，则默认为系统当前登录人的所在部门<br><b>5. </b>如果勾选"是否只读 "，则这个唯一的部门不能被更改<br><b>6. </b>在控件输入框中手动输入您想要添加的部门吧！</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>部门选择设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="isUnique">是否唯一</label></div><div class="checkbox"><label><input type="checkbox" id="isCurrentDepartment">默认部门</label></div><div class="checkbox department_readonly_js hide"><label><input type="checkbox" id="isReadonly">是否只读</label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-department" componentKey="Department" class="field field_js"><label class="widget-title"><span class="widget-title_js">部门选择</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList form-departmentList check_js"><div class="js_departmentitem_container"></div><span class="typeahead-wrapper ds-ib hide"><input type="text" placeholder="输入部门名称" class="control-input form-control typeahead search" id="typeahead-form-department" data-entity="department" componentKey="Department"><div class="tt-suggestion border-dropdown" id="typeahead-div"><div class="loading_small" style="display: none;">正在加载数据 ... </div><div id="searchList"></div></div><a id="search-department" class="btn engine-search" data-entity="department"><i class="icon-search"></i></a></span><span title="添加团队" name="js_form-userItem-add" class="js_form-userItem-add btn btn-sm control-btn"><i class="icon-plus"></i></span></div></div></div><div id="mobile-preview" componentKey="Department" class="field field_js"><label class="widget-title"><span class="widget-title_js">部门选择</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList form-departmentList check_js"><div id="form-primary" class="js_departmentitem_container j_department-seleted" data-module="form" data-targetId="" data-multi="true" data-shareType="primary">请选择部门</div></div></div></div><div id="nouser-preview" class="field"><label class="widget-title"><span class="widget-title_js">部门选择</span><span class="c-danger widget-required_js"></span></label><div class="widget-content">该字段需要登录！</div></div><div id="statsearch-department" class="inner-el"><select class="form-control sch-item j_condition"><option value="eq">等于</option><option value="neq">不等于</option></select><div class="j_deptcontainer sch-item"><div class="j_selected entity-container"></div><span class="typeahead-wrapper hide"><input type="text" placeholder="输入部门名称" class="control-input form-control typeahead search" id="typeahead-department" data-entity="department"><a class="btn typeahead-search" data-entity="department"><i class="icon-search"></i></a></span><span title="选择部门" class="control-btn btn btn-sm"><i class="icon-pencil"></i></span></div><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></div>',
		employee: '<div id="form-employee" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">人员选择</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList"><span title="添加人员" class="btn btn-sm disabled js_form-userItem-add"><i class="icon-plus"></i></span></div></div></div><div id="editor-employee" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以用于添加人员，这些人员来自于您的团队<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>如果勾选"是否唯一 "，则只能添加一个人员<br><b>4. </b>如果勾选"默认人员 "，则默认为系统当前登录人<br><b>5. </b>如果勾选"是否只读 "，则这个唯一的人员不能被更改<br><b>6. </b>点击控件的输入框，您就可以看到人员下拉选择列表了</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>人员选择设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="isUnique">是否唯一</label></div><div class="checkbox"><label><input type="checkbox" id="isCurrentEmployee">默认人员</label></div><div class="checkbox employee_readonly_js hide"><label><input type="checkbox" id="isReadonly">是否只读</label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-employee" componentKey="Employee" class="field field_js"><label class="widget-title"><span class="widget-title_js">人员选择</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList check_js"><div class="js_useritem_container"></div><span class="typeahead-wrapper ds-ib hide"><input type="text" placeholder="输入姓名" class="control-input form-control typeahead search" id="typeahead-form-employee" data-entity="employee" componentKey="Employee"><div id="form-typeahead-div" class="tt-suggestion border-dropdown"><div class="loading_small">正在加载数据 ... </div><div id="searchList"></div></div><a id="searchemployee" class="btn engine-search" data-entity="employee" data-multi="true"><i class="icon-search js_search"></i></a></span><span title="添加人员" name="js_form-userItem-add" class="control-btn btn btn-sm js_form-userItem-add"><i class="icon-plus"></i></span></div></div></div><div id="mobile-preview" componentKey="Employee" class="field field_js"><label class="widget-title"><span class="widget-title_js">负责人</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList check_js"><div id="form-primary" class="js_useritem_container employee-seleted" data-module="form" data-targetId="" data-multi="true" data-shareType="primary">请选择人员</div></div></div></div><div id="nouser-preview" class="field"><label class="widget-title"><span class="widget-title_js">负责人</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content">该字段需要登录！</div></div><div id="statsearch-employee" class="inner-el"><select class="form-control sch-item j_condition"><option value="eq">等于</option><option value="neq">不等于</option></select><div class="j_usercontainer sch-item"><div class="j_selected entity-container"></div><span class="typeahead-wrapper hide"><input type="text" placeholder="输入姓名" class="control-input form-control typeahead search" id="typeahead-employee" data-entity="employee"><a class="btn typeahead-search" data-entity="employee" data-multi="true"><i class="icon-search"></i></a></span><span title="选择人员" class="control-btn btn btn-sm"><i class="icon-plus"></i></span></div><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div><p class="employee"><img class="avatar" src="https://www.eteams.cn/iform/static/img/avatar.png"><span class="j_name"></span></p>',
		email: '<div id="form-email" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">邮箱</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-email" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只限输入有效格式的邮箱地址<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="2000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-email" componentKey="Email" class="field field_js"><label class="widget-title"><span class="widget-title_js">邮箱</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control check_js" componentKey="Email" maxlength="50"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-email" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		phone: '<div id="form-phone" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">电话</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-phone" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只能限输入有效格式的电话号码<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="2000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-phone" componentKey="Phone" class="field field_js"><label class="widget-title"><span class="widget-title_js">电话</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control check_js" componentKey="Phone" maxlength="50"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-phone" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		mobile: '<div id="form-mobile" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">手机</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-mobile" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只能限输入有效格式的手机号码<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="2000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-mobile" componentKey="Mobile" class="field field_js"><label class="widget-title"><span class="widget-title_js">手机</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control check_js" componentKey="Mobile" maxlength="50"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-mobile" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		file: '<div id="form-file" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">附件</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="file-input form-control medium"><p class="file-tip ellipsis">请点击此处上传不大于50M的附件</p><span class="file-ico"><i class="icon-plus"></i></span></div></div></div><div id="editor-file" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件仅能上传不超过50M大小的文件<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3. </b>如果勾选"单文件上传"的话，在填写表单时能且仅能上传一个文件</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>附件上传设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="isSingle">单文件上传</label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-file" componentKey="FileComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">附件</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="file-input form-control medium" componentKey="FileComponent"><p class="file-tip ellipsis">请点击此处上传不大于50M的附件</p><span class="file-ico"><i class="icon-plus"></i></span></div><div class="j_formFileContainer  check_js" data-url="/base/upload/{id}.json"></div></div></div><div id="mobile-preview" componentKey="FileComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">手机附件</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="file-input form-control medium" componentKey="FileComponent"><div id="documentFiles" class="doc-upload-wgt r-acl-disabled p-0"><i class="glyphicon icon-attachment"></i>请点击此处上传不大于50M的附件 <input type="file" name="data" id="formFileToUpload"/></div></div><div class="j_formFileContainer check_js" data-url="/base/upload/{id}.json"></div></div></div><div id="nouser-preview" class="field"><label class="widget-title"><span class="widget-title_js">附件</span><span class="c-danger widget-required_js"></span></label><div class="widget-content">该字段需要登录！</div></div><div data-role="page" class="page-view j_page-view" id="form-moblefileView"><header><i class="a-back j_fileViewBack">返回</i><h1>预览</h1></header><section class="view-con view-info pb-60"><div id="view-con" class="j_filePreview"></div></section><div class="eui-foot-tools info-opt"><ul class="info-opt-list"><li class=""><a><span></span></a></li><li id="finish" class=""><a><span></span></a></li><li id="formFileDelete" class="dele"><a><i></i><span>删除</span></a></li><li id="watch" class=""><a><span></span></a></li><li id="shareOther" class=""><a><span></span></a></li></ul></div></div>',
		image: '<div id="form-image" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">图片</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="img-wedget"><div class="img-item img-add"><i class="icon-plus"></i><p>上传图片</p></div></div></div></div><div id="editor-image" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件仅能上传不超过50M大小的图片文件<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3. </b>如果勾选"单图片上传"的话，在填写表单时能且仅能上传一张图片文件<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>图片上传设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="isSingle">单图片上传</label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-image" componentKey="ImageComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">图片</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="img-wedget"><div class="img-item img-add j_imageAdd"><i class="icon-plus"></i><p>上传图片</p></div></div><div class="img-wedget j_formImageContainer check_js" data-url="/base/upload/{id}.json"></div></div></div><div id="mobile-preview" componentKey="ImageComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">图片</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="file-input form-control medium" componentKey="ImageComponent"><div id="documentFiles" class="doc-upload-wgt r-acl-disabled p-0"><i class="glyphicon icon-attachment"></i>请点击此处上传不大于50M的图片 <input type="file" name="data" id="formFileToUpload"/></div></div><div class="j_formFileContainer check_js" data-url="/base/upload/{id}.json"></div></div></div><div id="nouser-preview" class="field"><label class="widget-title"><span class="widget-title_js">图片</span><span class="c-danger widget-required_js"></span></label><div class="widget-content">该字段需要登录！</div></div><div data-role="page" class="page-view j_page-view" id="form-mobleImageView"><header><i class="a-back j_imageViewBack">返回</i><h1>预览</h1></header><section class="view-con view-info pb-60"><div id="view-con" class="j_imagePreview"></div></section><div class="eui-foot-tools info-opt"><ul class="info-opt-list"><li class=""><a><span></span></a></li><li id="finish" class=""><a><span></span></a></li><li id="formImageDelete" class="dele"><a><i></i><span>删除</span></a></li><li id="watch" class=""><a><span></span></a></li><li id="shareOther" class=""><a><span></span></a></li></ul></div></div>',
		bar: '<div id="form-bar" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="paragraph alert"><img class=\'statimg\' src=\'/iform/static/img/form/bar.png\'></div></div><div id="editor-bar" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><select id = \'component-dataset\' class=\'w-200 h-30\'><option value=\'\' style="display: none;"></option></select></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-bar" componentKey="Text" class="field field_js"><div class=\'barview\' style=\'width:100%;height:400px;\'></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		pie: '<div id="form-pie" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="paragraph alert"><img class=\'statimg\' src=\'/iform/static/img/form/pie.png\'></div></div><div id="editor-pie" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><select id = \'component-dataset\' class=\'w-200 h-30\'><option value=\'\' style="display: none;"></option></select></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-pie" componentKey="Text" class="field field_js"><div class=\'pieview\' style=\'width:100%;height:400px;\'></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		tablestat: '<div id="form-tablestat" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="form-tablestat paragraph alert"><div  class=\'panel panel-default\'><div class=\'panel-heading widget-title_js\'><%= etitle %></div><div class="panel-body"><table class=\'table table-bordered\'><colgroup><col width=\'40%\'><col width=\'30%\'><col width=\'30%\'></colgroup><thead><th>选项</th><th>百分比</th><th>票数</th></thead><tbody><tr style="display: none;"><td class="j_content"></td><td class=\'bartd\'><div class=\'prograssbar j_prograssbar\'><span class=\'percentage j_percentage\'></span></div></td><td class="j_votes"></td></tr><tr><td></td><td class=\'totalcount\'>总计</td><td><%=etotalvotes%></td></tr></tbody></table></div></div></div></div><div id="editor-tablestat" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><select id = \'component-dataset\' class=\'w-200 h-30\'><option value=\'\' style="display: none;"></option></select></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-tablestat" componentKey="TableStat" class="field field_js"><div class="form-tablestat paragraph alert"><div  class=\'panel panel-default\'><div class=\'panel-heading\'><%= etitle %></div><div class="panel-body"><table class=\'table table-bordered\'><colgroup><col width=\'30%\'><col width=\'60%\'><col width=\'10%\'></colgroup><thead><th>选项</th><th>百分比</th><th>票数</th></thead><tbody><tr style="display: none;"><td class="j_content"></td><td class=\'bartd\'><div class=\'prograssbar j_prograssbar\'><span class=\'percentage j_percentage\'></span></div></td><td class="j_votes"></td></tr><tr><td></td><td class=\'totalcount\'>总计</td><td><%=etotalvotes%></td></tr></tbody></table></div></div></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		numberstat: '<div id="form-numberstat" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="form-numberstat  paragraph alert"><strong class=\'stattitle widget-title_js\'>标题</strong><div class=\'statdata\'>1234</div></div></div><div id="editor-numberstat" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><select id = \'component-dataset\' class=\'w-200 h-30\'><option value=\'\' style="display: none;"></option></select></div></div><div class="form-group"><label>统计方式</label><div class="controls"><select id = \'component-stattype\' class=\'w-200 h-30\'><option value=\'sum\'>求和</option><option value=\'count\'>计数</option><option value=\'avg\'>平均</option><option value=\'max\'>最大值</option><option value=\'min\'>最小值</option></select></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-numberstat" componentKey="Text" class="field field_js"><div class="form-numberstat  paragraph alert"><strong class=\'stattitle widget-title_js\'>标题</strong><div class=\'statdata\'>1234</div></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		table: '<div id="form-table" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="paragraph alert"><img class=\'statimg\' src=\'/iform/static/img/form/table.png\'></div></div><div id="editor-table" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><ul class="j_datasource"><li style="display: none;"> <input class=\'table_field\' title=\'\' type=\'checkbox\' value=\'\'><span></span></li></ul></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-table" componentKey="Text" class="field field_js "><div  class=\'form-tablestat panel panel-default \'><div class=\'panel-heading\'></div><div class="panel-body  tablecontent"></div><div class=\'pageInfo\'><div class=\'pageNav\'></div></div></div></div><div id="formDatas" class="mr-10"><div id="statbody"><div class="j_formstarScr eform-data-tb"><table id="stat_table" class="table table-bordered"><thead><tr></tr></thead><tbody></tbody><tfoot class="hide bg-f0"><tr></tr></tfoot></table><div id="data_message" class="hide">暂无无数据...</div></div></div><div id="more_data" class="common-more hide mt-5"><a>查看更多</a></div></div>',
		historyversion: '<div id="form-historyVersions" class="newform-modal modal fade form-horizontal entity-info"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button><h5 class="modal-title">表单历史版本</h5></div><div class="modal-body"><ul class="j_versionList clearfix form-his-version"></ul></div><div class="modal-footer"><p class="c-999">温馨提示：当前布局版本的表单发生过填写操作后保存才会产生新的布局版本。</p></div></div></div></div>',
		monitor: '<div id="form-monitor" class="field field_js" componentKey="Monitor" tempId=""><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">运算控件</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-monitorbox"><input type="text" class="form-control"></div></div></div><div id="editor-monitor" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件用以监控统计其他控件的输入值<br><b>2. </b>您可以切换监控类型来监控不同控件的值<br><b>3. </b>运算控件计算顺序从左至右依次计算，无视数学计算优先级<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>是否可编辑</label><div class="controls"><label class="radio-inline"><input name="isedit" type="radio" value="true" checked="checked">是</label><label class="radio-inline"><input name="isedit" type="radio" value="false">否</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>监控类型</label><div class="controls"><label class="radio-inline"><input name="monitor-type" type="radio" value="number">数字</label><label class="radio-inline"><input name="monitor-type" type="radio" value="date">日期区间</label></div></div><div class="form-group j_numberDiv hide" type="number"><label>监控字段</label><div class="controls"><ul class="choicelistEdit j_choicelistEdit_number"></ul></div></div><div class="form-group j_numberDiv hide" type="date"><label>监控字段</label><div class="controls"><ul class="choicelistEdit j_choicelistEdit_date"><li class="j_monitor_item" index="0" type="date"><select class="choicelist form-control j_select_date j_select_monitor"></select></li><li class="j_operate_list"><span class="operate-group j_operate-group j_operate"><label class="radio-inline  j_operate-plus"><input name="operate-type" type="radio" value="+">加</label><label class="radio-inline  j_operate-minus"><input name="operate-type" type="radio" value="-">减</label><label class="radio-inline  j_operate-multiply"><input name="operate-type" type="radio" value="*">乘</label><label class="radio-inline  j_operate-divided"><input name="operate-type" type="radio" value="/">除</label></span></li><li><input type="text" class="form-control j_number_input" maxlength="15" value=""><li></ul></div></div><div class="form-group j_numberDiv j_operate_show hide"><label>表达式</label><div id="operate_show"></div></div><div class="form-group hide j_format_show"><label>日期格式设置</label><div class="controls j_operate"><div class="radio"><label><input type="radio" name="format" value="d" checked="checked">天</label></div><div class="radio"><label><input type="radio" name="format" value="h">时</label></div><div class="radio"><label><input type="radio" name="format" value="m">分</label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="j_monitor_item" class="hide"><li class="j_monitor_item" index="0"><label class="js_signField" title="A0">A0:</label><select class="choicelist form-control j_select_number w-120 j_select_monitor"><option></option></select><input type="text" class="form-control j_number_input hide w-50" maxlength="15" value=""><span class="cs-p"><i class="icon-minus-sign j_delField"></i></span><span class="cs-p"><i class="icon-plus-sign j_addField"></i></span></li></div><div id="j_operate_list" class="hide"><li class="j_operate_list"><label class="js_signField">运算:</label><span class="operate-group j_operate-group j_operate"><label class="radio-inline  j_operate-plus"><input name="operate-type" type="radio" value="+">加</label><label class="radio-inline  j_operate-minus"><input name="operate-type" type="radio" value="-">减</label><label class="radio-inline  j_operate-multiply"><input name="operate-type" type="radio" value="*">乘</label><label class="radio-inline  j_operate-divided"><input name="operate-type" type="radio" value="/">除</label></span></li></div><div id="preview-monitor" componentKey="Monitor" class="field field_js" tempId=""><label class="widget-title"><span class="widget-title_js">运算控件</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium check_js" componentKey="Monitor"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-monitor" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		userselecter: '<div id="selector-employee" class="modal fade selector-employee j_chat_filterSlip_js" role="dialog" aria-labelledby="modalLabel-employee" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close j_close" data-dismiss="modal" aria-hidden="true">×</button><h5 id="modalLabel-employee" class="modal-title">人员选择</h5></div><div id="userSelector-multi" class="modal-body"><div class="user-wrapper"><div class="selected-container clearfix"><div class="mb-10 fs-14">已选择：</div><div class="j_selectedUsersScr" auto-scroll="yes" style="max-height:70px"><div class="selected-users"></div></div></div><div class="user-container"></div></div><div class="user-selector-body clearfix"><div id="all-org-users" class="user-selector-body-l pull-left"><div class="org-left-header"><span class="tab"><a id="organization-users" class="active">团队</a><a id="group-users">群组</a></span></div><a id="show-first-group" class="hide router"></a><div id="org-tree" class="org-tree scrollwrapper" marginbottom="20"  style="height: 310px;"><div id="org-tree-list"><div id="list-loading" class="loading_small"><span>正在加载数据，请稍后...</span></div></div><div id="org-group-list" class="hide dept-grouplist"><div id="list-loading" class="loading_small"><span>正在加载数据，请稍后...</span></div></div></div></div><div id="all-group-users" class="user-selector-body-r"><div class="user-sort-view j-user-list"><div class="user-sortbar"><span id="group-user-checkall" class="hide"><input id="checkAll" class="user-id" type="checkbox"></span><span class="title">成员列表</span><span class="users-list-pinyin"><a class="highlight j_active" id="ALL">全部</a><a id="degit">#</a><a id="A">A</a><a id="B">B</a><a id="C">C</a><a id="D">D</a><a id="E">E</a><a id="F">F</a><a id="G">G</a><a id="H">H</a><a id="I">I</a><a id="J">J</a><a id="K">K</a><a id="L">L</a><a id="M">M</a><a id="N">N</a><a id="O">O</a><a id="P">P</a><a id="Q">Q</a><a id="R">R</a><a id="S">S</a><a id="T">T</a><a id="U">U</a><a id="V">V</a><a id="W">W</a><a id="X">X</a><a id="Y">Y</a><a id="Z">Z</a></span><label class="checkbox users-list-checkbox"><input type="checkbox" id="chk2" title="含离职人员"><i>含离职<span>人员</span></i></label></div><div id="user-container" class="users-container"><div id="employee-container"><ul class="employee-list users-list"><li class="list-tit clearfix"><div class="col-4 item username">姓名</div><div class="col-4 item call">联系方式</div><div class="col-4 item dept">部门</div></li><div class="j_userlistScr scrollwrapper" marginbottom="20" style="height: 280px;"><div id="userlistCon"><div id="list-loading" class="loading_small"><span>正在加载数据，请稍后...</span></div><div class="center-more hide">加载更多...</div></div></div></ul></div></div></div></div></div></div><div class="modal-footer"><span class="selector-btns"><a class="btn btn-middle btn-success hide j_user_ok">确定</a><a class="btn btn-middle j_user_cancel">取消</a></span></div></div></div></div><div id="usersListClone" class="hide"><li id="groupUserClone" class="clearfix"><div class="col-4 item username ellipsis"><a><input type="checkbox" name="userids" class="user-id hide"/></a><a class="avatar usercard-toggle"  userId><img alt="avatar"  src="https://www.eteams.cn/iform/static/img/avatar.png"></a><a class="name" userid="" data-id="" data-module="profile" ></a></div><div class="col-4 item call ellipsis"></div><div class="col-4 item dept ellipsis"></div></li></div><div id="employee-container" class="j_invite-parent view-h100"><div id="employee-seleted" data-role="page" class="page-view pb-60 page-memblist hide"><header class="header-fixed hide"><h1 id="seleted-title">人员选择</h1></header><section class="view-con js_mSerchClose"><div class="rt-sch-box"><i class="ico-l ico-memb"></i><i id="search-keyword-tap" class="ico-r ico-search"></i><div id="j_memb-names" class="rt-sch-list ellipsis"></div></div><div id="j_memb-list-container" class="j_memb-list-container memb-list-container sort-letter-container"></div></section><div class="eui-foot-tools"><a id="j_a-back">取消</a><a id="j_a-comfirm">确认</a></div></div><div id="searchResult-employee" data-role="page"  class="j_page-view page-view hide"><section class="view-con"><div class="sch-box"><form id="employee-form" method="post" action=""><div class="sch-input"><i class="icon-search"></i><i class="j_icon-cancel-circle icon-cancel-circle"></i><input id="search-keyword-employee" type="text" placeholder="搜索" value=""></div><div class="sch-input-opt"><a   class="j_cancle-search active">取消</a></div></form></div><div class="memb-list-container sort-letter-container"><ul id="j_memb-list-container-search" class="j_memb-list-container memb-list-container sort-letter-container"></ul></div></section></div><div class="hide"><li id="employee-info-clone" class="j_employee-info"><div class="j_avatar avatar"><img src="/iform/static/img/avatar.png"></div><div class="memb-list-info"><p class="j_name name ellipsis"></p></div><i class="j_ico-add ico-r ico-check"></i></li><div id="employee-clone" ><div  class="j_letter-hd letter-hd">Z</div><ul class="j_com-list com-list memb-list"></ul></div><div id="data-loading-clone" class="j_data-loading data-loading" id="loading">加载中...</div><div id="load-tip-employee" class="j_load-tip load-tip" id="no-result">没有成员</div></div></div>',
		departselecter: '<div id="selector-department" class="modal fade selector-department" role="dialog" aria-labelledby="modalLabel-department" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h5 id="modalLabel-department" class="modal-title">部门选择</h5></div><div id="selector-org-tree"  class="org-tree scrollwrapper modal-body"></div></div></div></div><div id="department-component" data-role="page" class="j_page-view page-view pb-60 hide"><header class="header-fixed hide"><h1 id="title">部门选择</h1></header><section class="view-con js_mSerchClose"><div id="search-box" class="rt-sch-box"><i class="ico-l ico-memb"></i><div id="seleted-department-list" class="rt-sch-list ellipsis"></div></div><div id="j_dept-list-container"></div></section><div class="eui-foot-tools"><a id="j_a-back">取消</a><a id="j_department-comfirm">确认</a></div></div>',
		datetimepicker: '<div data-role="page" id="date-selected" class="page-view page-datetime hide"><header class="hide"><h1>日期选择</h1></header><div class="view-con"><div id="datetimepicker"></div></div><div class="eui-foot-tools"><a id="datetime-back">取消</a></div></div>',
		tablelayout: '<div id="table-layout" class="table_layout_js"><div class="form-tablelayout-wrap"><div class="form-layout-toolbar"><span class="layoutDrag-btn"><i class="icon-move"></i>拖拽</span><span class="layoutDele-btn j_cancel-drag j_layoutDele"><i class="icon-trash"></i>删除</span></div><div class="form-tablelayout j_table j_cancel-drag"></div></div><div id="context-menu" calss="j_cancel-drag right-click-menu"><ul class="dropdown-menu" role="menu"><li><a  href="#" class="j_layout_menu" type="merge">合并</a></li><li><a  href="#" class="j_layout_menu" type="clearMerge">拆分</a></li><li class="divider"></li><li><a  href="#" class="j_layout_menu" type="deleteRow">删除行</a></li><li><a  href="#" class="j_layout_menu" type="deleteCol">删除列</a></li><li class="divider"></li><li><a  href="#" class="j_layout_menu" type="addRow">添加行</a></li><li><a  href="#" class="j_layout_menu" type="addCol">添加列</a></li><li class="divider"></li><li><a  href="#" class="j_layout_menu" type="clearSelect">清空选择</a></li></ul></div></div><div class="field nopd" id="preview-tablelayout" componentKey="TableLayout"><div class="form-tablelayout-wrap"><div class="j_maximize opt-maximize"><i class="icon-expand" title="最大化编辑"></i></div><div class="form-tablelayout j_tablelayout"></div></div></div><div id="tableMaximize" class="modal form-tablelayout-full fade " tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button aria-hidden="true" data-dismiss="modal" class="close" type="button"><i class="icon-contract"></i></button><h5 class="modal-title">预览</h5></div><div class="modal-body eui-scroll"><div class="form-preview"><div id="maximizePreview" class="form-view"></div></div></div></div></div></div>',
		raty: '<div id="form-raty" class="field field_js form-grade-widget"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">评分</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div id="star" class="star"></div></div></div><div id="editor-raty" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可设置是否支持半星<br><b>2. </b>如果勾选必填的话,在填写表单时此项是必须填的<br><b>3. </b>您可以设置此控件的默认评分<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>是否支持半星</label><div class="controls"><label class="radio-inline"><input type="radio" value="yes" name="half">是</label><label class="radio-inline"><input type="radio" value="no" name="half">否</label></div></div><div class="form-group"><label>默认选中星星个数</label><div class="controls"><select class="form-control j_default-star" name="defaultstar"></select></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-raty" componentKey="Raty" class="field field_js form-grade-widget"><label class="widget-title"><span class="widget-title_js">评分</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div id="star-preview" class="check_js star"></div></div></div><div id="statsearch-raty" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div><div id="img-clone" class="hide"><img src="/iform/static/img/form/star-off-big.png"><option value=""></option></div>',
		reference:'<div id="form-reference" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">参照</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-reference" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>2.</b>您可以切换"控件大小"来改变控件的尺寸<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>允许多选</label><div class="controls"><div class="checkbox"><label><input id="isMutiSelect" type="checkbox">允许多选</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-reference" componentKey="Reference" class="field field_js"><label class="widget-title"><span class="widget-title_js">参照</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" componentKey="Reference" class="form-control check_js"><div class="input-instead j_readOnly hide"></div></div></div>',
		precent:'<div id="form-precent" class="field field_js" componentKey="Precent"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">百分比</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="text" class="form-control"> <span class="precent_type_js m-type"></span></div></div></div><div id="editor-precent" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>此控件只能输入数字（包括正数和小数，不能输入负数、英文、汉字和特殊符号）<br><b>2.</b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3.</b>您可以切换"控件大小"来改变控件的尺寸<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-precent" componentKey="Precent" class="field field_js"><label class="widget-title"><span class="widget-title_js">百分比</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="text" class="form-control check_js" componentKey="Precent"><div class="input-instead j_readOnly hide"></div><span class="precent_type_js m-type"></span></div></div></div><div id="statsearch-precent" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		hyperlink:'<div id="form-hyperlink" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">超链接</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-hyperlink" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>2.</b>您可以切换"控件大小"来改变控件的尺寸<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-hyperlink" componentKey="Hyperlink" class="field field_js"><label class="widget-title"><span class="widget-title_js">超链接</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" componentKey="Hyperlink" class="form-control check_js"><div class="input-instead j_readOnly hide"></div></div></div>',
		password:'<div id="form-password" class="field field_js" componentKey="Password"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">密码</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="password" class="form-control"></div></div></div><div id="editor-password" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>2.</b>您可以切换"控件大小"来改变控件的尺寸<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-password" componentKey="Password" class="field field_js"><label class="widget-title"><span class="widget-title_js">密码</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="password" class="form-control check_js" componentKey="Password"><div class="input-instead j_readOnly hide"></div></div></div></div><div id="statsearch-password" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		htmltext:'<div id="form-htmltext" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">html片段</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><textarea class="form-control medium"></textarea></div></div><div id="editor-htmltext" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>此控件不限制输入文字个数<br><b>2.</b>如果勾选必填项的话，在填写表单是此项是必须填写的<br><b>3.</b>您可以切换"控件大小"来改变控件的尺寸<br><b>4.</b>您可以切换普通文本</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="Text">单行文本框</label><label class="radio-inline"><input type="radio" name="componentType" value="HtmlText">html片段</label></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="preview-htmltext" componentKey="HtmlText" class="field field_js"><label class="widget-title"><span class="widget-title_js">多行文本框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><textarea componentKey="HtmlText" class="form-control check_js"></textarea><div class="input-instead j_readOnly hide"></div></div></div>',
		codeRule: '<div id="form-monitor" class="field field_js" componentKey="CodeRule" tempId=""><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">编码规则</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-monitorbox"><input type="text" class="form-control"></div></div></div><div id="editor-monitor" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件用以监控统计其他控件的输入值<br><b>2. </b>您可以切换监控类型来监控不同控件的值<br><b>3. </b>运算控件计算顺序从左至右依次计算，无视数学计算优先级<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>是否可编辑</label><div class="controls"><label class="radio-inline"><input name="isedit" type="radio" value="true" checked="checked">是</label><label class="radio-inline"><input name="isedit" type="radio" value="false">否</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>监控类型</label><div class="controls"><label class="radio-inline"><input name="monitor-type" type="radio" value="number">数字</label><label class="radio-inline"><input name="monitor-type" type="radio" value="date">日期区间</label></div></div><div class="form-group j_numberDiv hide" type="number"><label>监控字段</label><div class="controls"><ul class="choicelistEdit j_choicelistEdit_number"></ul></div></div><div class="form-group j_numberDiv hide" type="date"><label>监控字段</label><div class="controls"><ul class="choicelistEdit j_choicelistEdit_date"><li class="j_monitor_item" index="0" type="date"><select class="choicelist form-control j_select_date j_select_monitor"></select></li><li class="j_operate_list"><span class="operate-group j_operate-group j_operate"><label class="radio-inline  j_operate-plus"><input name="operate-type" type="radio" value="+">加</label><label class="radio-inline  j_operate-minus"><input name="operate-type" type="radio" value="-">减</label><label class="radio-inline  j_operate-multiply"><input name="operate-type" type="radio" value="*">乘</label><label class="radio-inline  j_operate-divided"><input name="operate-type" type="radio" value="/">除</label></span></li><li><input type="text" class="form-control j_number_input" maxlength="15" value=""><li></ul></div></div><div class="form-group j_numberDiv j_operate_show hide"><label>表达式</label><div id="operate_show"></div></div><div class="form-group hide j_format_show"><label>日期格式设置</label><div class="controls j_operate"><div class="radio"><label><input type="radio" name="format" value="d" checked="checked">天</label></div><div class="radio"><label><input type="radio" name="format" value="h">时</label></div><div class="radio"><label><input type="radio" name="format" value="m">分</label></div></div></div><div class="form-group"><label>边框颜色</label><div class="in-color"></div></div></div><div id="j_monitor_item" class="hide"><li class="j_monitor_item" index="0"><label class="js_signField" title="A0">A0:</label><select class="choicelist form-control j_select_number w-120 j_select_monitor"><option></option></select><input type="text" class="form-control j_number_input hide w-50" maxlength="15" value=""><span class="cs-p"><i class="icon-minus-sign j_delField"></i></span><span class="cs-p"><i class="icon-plus-sign j_addField"></i></span></li></div><div id="j_operate_list" class="hide"><li class="j_operate_list"><label class="js_signField">运算:</label><span class="operate-group j_operate-group j_operate"><label class="radio-inline  j_operate-plus"><input name="operate-type" type="radio" value="+">加</label><label class="radio-inline  j_operate-minus"><input name="operate-type" type="radio" value="-">减</label><label class="radio-inline  j_operate-multiply"><input name="operate-type" type="radio" value="*">乘</label><label class="radio-inline  j_operate-divided"><input name="operate-type" type="radio" value="/">除</label></span></li></div><div id="preview-monitor" componentKey="CodeRule" class="field field_js" tempId=""><label class="widget-title"><span class="widget-title_js">编码规则</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium check_js" componentKey="CodeRule"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-monitor" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
		
//		text: '<div id="form-text" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">文本输入框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-text" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件最大支持输入200个文字<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸<br><b>4. </b>您可以切换单行或多行文本框</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="Text">单行文本框</label><label class="radio-inline"><input type="radio" name="componentType" value="TextArea">多行文本框</label></div></div></div><div id="preview-text" componentKey="Text" class="field field_js"><label class="widget-title"><span class="widget-title_js">文本输入框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" componentKey="Text" class="form-control check_js"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		textarea: '<div id="form-textarea" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">多行文本框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><textarea class="form-control medium"></textarea></div></div><div id="editor-textarea" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件不限制输入文字个数<br><b>2. </b>如果勾选必填项的话，在填写表单是此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸<br><b>4. </b>您可以切换单行或多行文本框</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="Text">单行文本框</label><label class="radio-inline"><input type="radio" name="componentType" value="TextArea">多行文本框</label></div></div></div><div id="preview-textarea" componentKey="TextArea" class="field field_js"><label class="widget-title"><span class="widget-title_js">多行文本框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><textarea componentKey="TextArea" class="form-control check_js"></textarea><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-textarea" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		columnpanel: '<div id="form-columnpanel-2" class="form-layout form-layout_js"><div class="column-layout two-columns columns_js"><div class="cell cell_js"></div><div class="cell cell_js"></div></div><div class="form-layout-toolbar"><span class="j_layoutDrag layoutDrag-btn"><i class="icon-move"></i>拖拽</span><span class="j_layoutDele layoutDele-btn j_cancel-drag"><i class="icon-trash"></i>删除</span></div></div><div id="form-columnpanel-3" class="form-layout form-layout_js"><div class="column-layout three-columns columns_js"><div class="cell cell_js"></div><div class="cell cell_js"></div><div class="cell cell_js"></div></div><div class="form-layout-toolbar"><span class="j_layoutDrag layoutDrag-btn"><i class="icon-move"></i>拖拽</span><span class="j_layoutDele layoutDele-btn j_cancel-drag"><i class="icon-trash"></i>删除</span></div></div><div id="preview-columnpanel-2" componentkey="ColumnPanel" class="form-layout form-layout_js"><div class="column-layout two-columns columns_js"><div class="cell cell_js"></div><div class="cell cell_js"></div></div></div><div id="preview-columnpanel-3" componentkey="ColumnPanel" class="form-layout form-layout_js"><div class="column-layout three-columns columns_js"><div class="cell cell_js"></div><div class="cell cell_js"></div><div class="cell cell_js"></div></div></div>',
//		datatable: '<div id="form-datatable" class="form-databox-wrap subform_js field"><div class="form-databox-head"><div class="title j_datatableTitle hide"></div><div class="desc j_datatableDescription hide"></div></div><div class="form-layout-toolbar"><span class="edit-btn j_cancel-drag field_subform_js"><i class="icon-pencil"></i>编辑子表</span><span class="addColum-btn j_cancel-drag addSubColum_js"><i class="icon-plus"></i>添加列</span><span class="layoutDrag-btn"><i class="icon-move"></i>拖拽子表</span><span class="layoutDele-btn j_cancel-drag j_layoutDele"><i class="icon-trash"></i>删除子表</span></div><div id="" class="form-databox j_cancel-drag"><table class="table table-bordered subtable_js"><tr class="subtr_js"><td class="subtd_js" style="height: 71px;"></td><td class="subtd_js" style="height: 71px;"></td></tr></table></div></div><div id="editor-datatable"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>您可以选择是否显示子表标题<br><b>2. </b>您可更改默认显示行数(注意：默认行数只允许输入0-10之间的正整数)<br></div></div><div class="form-group"><label>标题</label><input id="component-title-datatable" type="text" class="form-control w-full" maxlength="100"></div><div class="form-group"><label>描述</label><textarea id="component-describe-datatable" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>默认行数</label><div><input type="text" class="form-control w-100" id="datatable-defaultRows"></div></div></div><div id="preview-datatable" componentKey="DataTable" class="form-databox-wrap subform_js field"><div class="form-databox-head"><div class="j_maximize opt-maximize"><i class="icon-expand" title="最大化编辑"></i></div><div class="title j_datatableTitle hide"></div><div class="desc j_datatableDescription hide"></div><div class="j_setFiled opt-print hide"><i class="icon-hammer" title="设置显示列" style="z-index: 200;position: relative;"></i></div></div><div class="form-databox"><table class="table table-bordered subtable_js"></table></div></div><div id="preview-filed" class="hide modal fade wform-column-content" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h5 class="modal-title">设置列</h5></div><div  class="modal-body"><p class="wform-tip pv-10 mb-15">下方字段为当前明细表字段，勾选需要隐藏的字段。</p><ul id="columnFileds" class="wform-column-list"></ul><div id="columnFiledsClone" class="hide"><li class="checkbox"><label><span class="j_sort sn"></span><input class="j_column" type="checkbox" name="column"/><span class="j_filedName"></span><span class="tip j_bewrite"></span></label></li></div></div><div class="modal-footer"><a id="saveColumn" class="btn btn-sm btn-primary fr mr-10" data-dismiss="modal" aria-hidden="true">确定</a></div></div></div></div><div id="operating-datatable"><table><tr><th class="subtd_option subtradd_js"><label class="widget-title"><a title="添加">新建</a></label></th><td class="subtd_option subtrdel_js"><a title="删除">删除</a></td></tr></table></div><div id="mobile-preview" componentKey="DataTable" class="form-databox-wrap subform_js"><div class="form-databox"><div class="form-databox-hd"><div class="title j_subFormTitle"></div><span class="ico-add j_mobileSubadd"></span><div class="desc j_subFormDesc hide"></div></div><div class="clearfix ps-r"><div class="of-x-a j_scrollSubform"><span class="ico-scr-arrow icon-arrow-left j_arrow-left hide"></span><span class="ico-scr-arrow icon-arrow-right j_arrow-right hide"></span><table class="table table-bordered subtable_js subtable_tab_m"></table></div></div></div></div><div id="mobile-subFillDetail" class="j_page-view page-view form-view" data-role="page"><header class="header-fixed hide"><h1>子表明细</h1></header><section class="view-con"><div class="j_moblieSubForm"><div class="form-databox-opt"><a class="j_continueSave">保存并继续添加</a></div></div></section><div class="eui-foot-tools"><a class="j_cancelAdd">取消</a><a class="j_confirmAdd">确认</a></div></div><div id="datatableMaximize" class="modal form-databox-full fade " tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button aria-hidden="true" data-dismiss="modal" class="close" type="button"><i class="icon-contract"></i></button><h5 class="modal-title">子表预览</h5></div><div class="modal-body"><div class="form-preview"><div id="maximizePreview" class="form-view"></div></div></div></div></div></div>',
//		dividingline: '<div id="form-dividingline" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="divider-line solid"></div></div><div id="editor-dividingline" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以用于划分您所制作的表单区域<br><b>2. </b>您可以随意切换线条的类型：实线、虚线、粗实线、粗虚线、双实线和双虚线<br><b>3. </b>您可以随意选择线条的颜色<br></div></div><div class="form-group"><label>切换分割线类型</label><div class="controls"><div class="dividerchoicelist"><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="solid"><div class="divider-line solid"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="dashed"><div class="divider-line dashed"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="thicksolid"><div class="divider-line thicksolid"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="thickdashed"><div class="divider-line thickdashed"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="solid-double"><div class="divider-line solid-double"></div></label><label class="ds-ib-w"><input type="radio" name="dividingLineType" value="thicksolid-double"><div class="divider-line thicksolid-double"></div></label></div></div></div><label>分割线颜色</label><div class="color-box"></div></div><div id="preview-dividingline" componentkey="DividingLine" class="field field-divider field_js"><div class="divider-line"></div></div>',
//		date: '<div id="form-date" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">日期</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap"><div class="form-timebox"><input type="text" class="form-control form-w150" placeholder="年-月-日"></div></div></div></div><div id="editor-date" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以填写三种不同格式的日期<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以随意设置三种日期格式<br><b>4. </b>如果勾选"系统日期"，系统会默认显示当前时间作为您要填写的日期<br><b>5. </b>如果勾选"是否只读"，系统会默认这个当前日期不能被更改</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>日期格式设置</label><div class="controls"><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM-dd HH:mm">年-月-日     时:分</label></div><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM-dd">年-月-日</label></div><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM">年-月</label></div></div></div><div class="form-group"><label>默认日期设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="systemDate">系统日期</label></div><div class="checkbox date_readonly_js hide"><label><input type="checkbox" id="readonly">是否只读</label></div></div></div></div><div id="preview-date" componentkey="DateComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">日期</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap"><div class="form-timebox"><input type="text" class="form-control form-w150 check_js j_datetimepicker" componentkey="DateComponent" placeholder="年-月-日"><div class="input-instead j_readOnly hide"></div></div></div></div></div><div id="mobile-preview" componentkey="DateComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">日期</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap"><div class="form-timebox"><input type="text" class="form-control form-w150 check_js j_date_selected" componentkey="DateComponent" placeholder="年-月-日" readonly="readonly"><div class="input-instead j_readOnly hide"></div></div></div></div></div><div id="statsearch-date" class="inner-el"><span class="sch-item-period j_datetime"><input type="text" id="startDate" name="startDate" class="form-control datepicker textinput"><span class="spline">-</span><input type="text" id="endDate" name="endDate" class="form-control datepicker textinput"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		dateinterval: '<div id="form-dateinterval" class="field field_js" componentKey="DateInterval"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">日期区间</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap"><div class="form-timebox"><input type="text" class="form-control" placeholder="年-月-日"></div><span class="space-line">-</span><div class="form-timebox"><input type="text" class="form-control" placeholder=年-月-日></div></div></div></div><div id="editor-dateinterval" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件相当于两个日期控件组合在一起的复合控件，它可以代表一段时间区间（起止时间）<br><b>2. </b>开始时间必须早于或等于结束时间，结束时间必须晚于或等于开始时间<br><b>3. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>4. </b>您可以随意设置三种日期格式</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>日期格式设置</label><div class="controls"><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM-dd HH:mm">年-月-日     时:分</label></div><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM-dd">年-月-日</label></div><div class="radio"><label><input type="radio" name="dateFormat" value="yyyy-MM">年-月</label></div></div></div></div><div id="preview-dateinterval" componentKey="DateInterval" class="field field_js"><label class="widget-title"><span class="widget-title_js">日期区间</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content "><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap check_js"><div class="form-timebox" datetype="startDate"><input type="text" class="form-control form-w150" componentKey="DateInterval" placeholder="年-月-日"></div><span class="space-line">-</span><div class="form-timebox" datetype="endDate"><input type="text" class="form-control form-w150" componentKey="DateInterval" placeholder="年-月-日"></div></div><div class="input-instead j_readOnly hide"></div></div></div><div id="mobile-preview" componentKey="DateInterval" class="field field_js"><label class="widget-title"><span class="widget-title_js">日期区间</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content "><div class="field-description hide">描述</div><div class="ds-ib-w form-timebox-wrap check_js"><div class="form-timebox" datetype="startDate"><input type="text" class="form-control form-w150 j_date_selected" componentKey="DateInterval" placeholder="年-月-日" readonly="readonly"></div><span class="space-line">-</span><div class="form-timebox" datetype="endDate"><input type="text" class="form-control form-w150 j_date_selected" componentKey="DateInterval" placeholder="年-月-日" readonly="readonly"></div></div><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-dateinterval" class="inner-el"><span class="sch-item-period j_datetime"><input type="text" id="startDate" name="startDate" class="form-control datepicker textinput"><span class="spline">-</span><input type="text" id="endDate" name="endDate" class="form-control datepicker textinput"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		option: '<div id="form-option" class=""><li class="RadioBox_js"><label><input type="radio" name="form-radiobox" value="" disabled=""><span>选项</span></label></li><li class="CheckBox_js"><label><input type="checkbox" name="form-checkbox" value="" disabled=""><span>选项</span></label></li><select><option class="Select_js">选项</option></select></div><div id="editor-option"><li class="RadioBox_js"><input type="radio" name="editor-option" class="option_js"><input type="text" class="form-control optionName_js"><span class="cs-p"><i class="icon-minus-sign minusoption_js"></i></span><span class="cs-p"><i class="icon-plus-sign plusoption_js"></i></span></li><li class="CheckBox_js"><input type="checkbox" name="editor-option" class="option_js"><input type="text" class="form-control optionName_js"><span class="cs-p"><i class="icon-minus-sign minusoption_js"></i></span><span class="cs-p"><i class="icon-plus-sign plusoption_js"></i></span></li><li class="Select_js"><input type="radio" name="editor-option" class="option_js"><input type="text" class="form-control optionName_js"><span class="cs-p"><i class="icon-minus-sign minusoption_js"></i></span><span class="cs-p"><i class="icon-plus-sign plusoption_js"></i></span></li><li class="otherOption_js input-otherchoice"><span>其他</span><input type="text" class="form-control" value="" disabled=""><span class="cs-p"><i class="icon-minus-sign minusoption_js"></i></span></li></div><div id="preview-option" componentkey="Option" class="field"><li class="RadioBox_js"><label><input type="radio" name="form-radiobox" componentkey="Option"  value=""><span>选项</span></label></li><li class="CheckBox_js"><label><input type="checkbox" name="form-checkbox" componentkey="Option"  value=""><span>选项</span></label></li><select><option class="Select_js" componentkey="Option" >选项</option></select></div>',
//		radiobox: '<div id="form-radiobox" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">单选框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><ul class="choicelist choicelist_js"></ul></div></div><div id="editor-radiobox"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件的选项是单选<br><b>2. </b>如果勾选必填项的话,在填写表单时此项是必须填写的<br><b>3. </b>您可以设置选项的名称，同时也可以添加选项<br><b>4. </b>您可以任意切换单选框、多选框和下拉菜单<br><b>5. </b>您可以切换横向或者纵向布局<br><b>6. </b>批量编辑可以让您快速编辑选项</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>选项设置</label><div class="controls"><ul class="choicelistEdit choicelistEdit_js"></ul><div class="ds-ib-w"><div class="plus-othercheckbox-btn"><a class="btn-default_js">添加其他</a></div><div class="plus-othercheckbox-btn"><a class="j_optBatcEdit">批量编辑</a></div></div></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="RadioBox">单选框</label><label class="radio-inline"><input type="radio" name="componentType" value="CheckBox">多选框</label><label class="radio-inline"><input type="radio" name="componentType" value="Select">下拉菜单</label></div></div><div class="form-group"><label>切换布局</label><div class="controls"><label class="radio-inline"><input type="radio" name="layout" value="choicelist-inline">横向排列</label><label class="radio-inline"><input type="radio" name="layout" value="choicelist-line">纵向排列</label></div></div></div><div id="preview-radiobox" componentkey="RadioBox" class="field field_js"><label class="widget-title"><span class="widget-title_js">单选框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><ul class="choicelist choicelist_js check_js"></ul><div class="input-instead j_readOnly hide"></div></div></div>',
//		checkbox: '<div id="form-checkbox" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">单选框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><ul class="choicelist choicelist_js"></ul></div></div><div id="editor-checkbox"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件的选项可多选<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3. </b>您可以设置选项的名称，同时也可以添加选项<br><b>4. </b>您可以任意切换单选框、多选框和下拉菜单<br><b>5. </b>您可以切换横向或者纵向布局<br><b>6. </b>批量编辑可以让您快速编辑选项</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>选项设置</label><div class="controls"><ul class="choicelistEdit choicelistEdit_js"></ul><div class="ds-ib-w"><div class="plus-othercheckbox-btn"><a class="btn-default_js">添加其他</a></div><div class="plus-othercheckbox-btn"><a class="j_optBatcEdit">批量编辑</a></div></div></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="RadioBox">单选框</label><label class="radio-inline"><input type="radio" name="componentType" value="CheckBox">多选框</label><label class="radio-inline"><input type="radio" name="componentType" value="Select">下拉菜单</label></div></div><div class="form-group"><label>切换布局</label><div class="controls"><label class="radio-inline"><input type="radio" name="layout" value="choicelist-inline">横向排列</label><label class="radio-inline"><input type="radio" name="layout" value="choicelist-line">纵向排列</label></div></div></div><div id="preview-checkbox" componentkey="CheckBox" class="field field_js"><label class="widget-title"><span class="widget-title_js">单选框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide"></div><ul class="choicelist choicelist_js check_js"></ul><div class="input-instead j_readOnly hide"></div></div></div>',
//		select: '<div id="form-select" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">下拉菜单</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><select class="choicelist form-control choicelist_js"></select></div></div><div id="editor-select"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件的选项可下拉<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3. </b>您可以设置选项的名称，同时也可以添加选项<br><b>4. </b>您可以切换控件大小来改变控件的尺寸<br><b>5. </b>您可以任意切换单选框、多选框和下拉菜单<br><b>6. </b>批量编辑可以让您快速编辑选项</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>选项设置</label><div class="controls"><ul class="choicelistEdit choicelistEdit_js"></ul><div class="ds-ib-w"><div class="plus-othercheckbox-btn"><a class="btn-default_js">添加其他</a></div><div class="plus-othercheckbox-btn"><a class="j_optBatcEdit">批量编辑</a></div></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="RadioBox">单选框</label><label class="radio-inline"><input type="radio" name="componentType" value="CheckBox">多选框</label><label class="radio-inline"><input type="radio" name="componentType" value="Select">下拉菜单</label></div></div></div><div id="preview-select" componentkey="Select" class="field field_js"><label class="widget-title"><span class="widget-title_js">下拉菜单</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><select class="choicelist form-control choicelist_js check_js"></select><input type="text" style="display: none;" placeholder="请填写其他内容" class="form-control form-w120 input-otherchoice"><div class="input-instead j_readOnly hide"></div></div></div>',
//		paragraph: '<div id="form-paragraph" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="paragraph alert"></div></div><div id="editor-paragraph" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以用于一些表单中需要被文字描述的地方<br><b>2. </b>您可以在"段落内容"中随意输入自己需要的文字。可以对文字进行一系列的操作，例如：变色、加粗、斜体、字体、文字大小、居中等等.....<br><b>3. </b>您可以随意选择这段描述文字的背景颜色，提供了5种背景色<br></div></div><div class="form-group"><label>段落内容</label><textarea id="descriptionEdit" class="form-control"></textarea></div><div class="form-group"><label>选择段落样式</label><div class="controls"><div class="paragraphchoicelist"><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-success"><div class="paragraph alert alert-success"></div></label><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-info"><div class="paragraph alert alert-info"></div></label><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-warning"><div class="paragraph alert alert-warning"></div></label><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-danger"><div class="paragraph alert alert-danger"></div></label><label class="ds-ib-w"><input type="radio" name="paragraphType" value="alert-e-default"><div class="paragraph alert alert-e-default"></div></label></div></div></div></div><div id="preview-paragraph" componentkey="Paragraph" class="field field_js"><div class="paragraph alert"></div></div>',
//		numbercomponent: '<div id="form-number" class="field field_js" componentKey="NumberComponent"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">数字输入框</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-number" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只能输入数字（包括正数、负数、小数，不能输入英文、汉字和特殊符号）<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div></div><div id="preview-number" componentKey="NumberComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">数字输入框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control check_js" componentKey="NumberComponent"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-number" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		money: '<div id="form-money" class="field field_js" componentKey="Money"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">金额</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="text" class="form-control"><span class="money_unit_js m-type"></span><span class="money_type_js m-type"></span></div></div></div><div id="editor-money" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只能输入数字（包括正数和小数，不能输入负数、英文、汉字和特殊符号）<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸<br><b>4. </b>您可以切换"选择货币"改变币种，改变币种的同时，下面的货币单位会随之联动<br><b>5. </b>您可以切换"货币单位"改变金额的单位</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>选择货币</label><div class="controls"><select id="moneyType" class="form-control form-w150 mb-10"><option value="人民币">人民币</option><option value="美元">美元</option><option value="日元">日元</option><option value="欧元">欧元</option><option value="港币">港币</option><option value="台币">台币</option></select></div></div></div><div id="preview-money" componentKey="Money" class="field field_js"><label class="widget-title"><span class="widget-title_js">金额</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="text" class="form-control check_js" componentKey="Money"><div class="input-instead j_readOnly hide"></div><span class="money_unit_js m-type"></span><span class="money_type_js m-type"></span></div></div></div><div id="statsearch-money" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		department: '<p class="department"><span class="j_name"></span></p><div id="form-department" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">部门选择</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList form-departmentList"><span title="添加团队" class="btn btn-sm disabled js_form-userItem-add"><i class="icon-plus"></i></span></div></div></div><div id="editor-department" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以用于添加部门，这些部门来自于您团队的部门<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>如果勾选"是否唯一 "，则只能添加一个部门<br><b>4. </b>如果勾选"默认部门 "，则默认为系统当前登录人的所在部门<br><b>5. </b>如果勾选"是否只读 "，则这个唯一的部门不能被更改<br><b>6. </b>在控件输入框中手动输入您想要添加的部门吧！</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>部门选择设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="isUnique">是否唯一</label></div><div class="checkbox"><label><input type="checkbox" id="isCurrentDepartment">默认部门</label></div><div class="checkbox department_readonly_js hide"><label><input type="checkbox" id="isReadonly">是否只读</label></div></div></div></div><div id="preview-department" componentKey="Department" class="field field_js"><label class="widget-title"><span class="widget-title_js">部门选择</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList form-departmentList check_js"><div class="js_departmentitem_container"></div><span class="typeahead-wrapper ds-ib hide"><input type="text" placeholder="输入部门名称" class="control-input form-control typeahead search" id="typeahead-form-department" data-entity="department" componentKey="Department"><div class="tt-suggestion border-dropdown" id="typeahead-div"><div class="loading_small" style="display: none;">正在加载数据 ... </div><div id="searchList"></div></div><a id="search-department" class="btn engine-search" data-entity="department"><i class="icon-search"></i></a></span><span title="添加团队" name="js_form-userItem-add" class="js_form-userItem-add btn btn-sm control-btn"><i class="icon-plus"></i></span></div></div></div><div id="mobile-preview" componentKey="Department" class="field field_js"><label class="widget-title"><span class="widget-title_js">部门选择</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList form-departmentList check_js"><div id="form-primary" class="js_departmentitem_container j_department-seleted" data-module="form" data-targetId="" data-multi="true" data-shareType="primary">请选择部门</div></div></div></div><div id="nouser-preview" class="field"><label class="widget-title"><span class="widget-title_js">部门选择</span><span class="c-danger widget-required_js"></span></label><div class="widget-content">该字段需要登录！</div></div><div id="statsearch-department" class="inner-el"><select class="form-control sch-item j_condition"><option value="eq">等于</option><option value="neq">不等于</option></select><div class="j_deptcontainer sch-item"><div class="j_selected entity-container"></div><span class="typeahead-wrapper hide"><input type="text" placeholder="输入部门名称" class="control-input form-control typeahead search" id="typeahead-department" data-entity="department"><a class="btn typeahead-search" data-entity="department"><i class="icon-search"></i></a></span><span title="选择部门" class="control-btn btn btn-sm"><i class="icon-pencil"></i></span></div><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></div>',
//		employee: '<div id="form-employee" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">人员选择</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList"><span title="添加人员" class="btn btn-sm disabled js_form-userItem-add"><i class="icon-plus"></i></span></div></div></div><div id="editor-employee" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可以用于添加人员，这些人员来自于您的团队<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>如果勾选"是否唯一 "，则只能添加一个人员<br><b>4. </b>如果勾选"默认人员 "，则默认为系统当前登录人<br><b>5. </b>如果勾选"是否只读 "，则这个唯一的人员不能被更改<br><b>6. </b>点击控件的输入框，您就可以看到人员下拉选择列表了</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>人员选择设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="isUnique">是否唯一</label></div><div class="checkbox"><label><input type="checkbox" id="isCurrentEmployee">默认人员</label></div><div class="checkbox employee_readonly_js hide"><label><input type="checkbox" id="isReadonly">是否只读</label></div></div></div></div><div id="preview-employee" componentKey="Employee" class="field field_js"><label class="widget-title"><span class="widget-title_js">人员选择</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList check_js"><div class="js_useritem_container"></div><span class="typeahead-wrapper ds-ib hide"><input type="text" placeholder="输入姓名" class="control-input form-control typeahead search" id="typeahead-form-employee" data-entity="employee" componentKey="Employee"><div id="form-typeahead-div" class="tt-suggestion border-dropdown"><div class="loading_small">正在加载数据 ... </div><div id="searchList"></div></div><a id="searchemployee" class="btn engine-search" data-entity="employee" data-multi="true"><i class="icon-search js_search"></i></a></span><span title="添加人员" name="js_form-userItem-add" class="control-btn btn btn-sm js_form-userItem-add"><i class="icon-plus"></i></span></div></div></div><div id="mobile-preview" componentKey="Employee" class="field field_js"><label class="widget-title"><span class="widget-title_js">负责人</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-userList check_js"><div id="form-primary" class="js_useritem_container employee-seleted" data-module="form" data-targetId="" data-multi="true" data-shareType="primary">请选择人员</div></div></div></div><div id="nouser-preview" class="field"><label class="widget-title"><span class="widget-title_js">负责人</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content">该字段需要登录！</div></div><div id="statsearch-employee" class="inner-el"><select class="form-control sch-item j_condition"><option value="eq">等于</option><option value="neq">不等于</option></select><div class="j_usercontainer sch-item"><div class="j_selected entity-container"></div><span class="typeahead-wrapper hide"><input type="text" placeholder="输入姓名" class="control-input form-control typeahead search" id="typeahead-employee" data-entity="employee"><a class="btn typeahead-search" data-entity="employee" data-multi="true"><i class="icon-search"></i></a></span><span title="选择人员" class="control-btn btn btn-sm"><i class="icon-plus"></i></span></div><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div><p class="employee"><img class="avatar" src="https://www.eteams.cn/iform/static/img/avatar.png"><span class="j_name"></span></p>',
//		email: '<div id="form-email" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">邮箱</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-email" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只限输入有效格式的邮箱地址<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="2000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div></div><div id="preview-email" componentKey="Email" class="field field_js"><label class="widget-title"><span class="widget-title_js">邮箱</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control check_js" componentKey="Email" maxlength="50"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-email" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		phone: '<div id="form-phone" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">电话</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-phone" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只能限输入有效格式的电话号码<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="2000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div></div><div id="preview-phone" componentKey="Phone" class="field field_js"><label class="widget-title"><span class="widget-title_js">电话</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control check_js" componentKey="Phone" maxlength="50"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-phone" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		mobile: '<div id="form-mobile" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">手机</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-mobile" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件只能限输入有效格式的手机号码<br><b>2. </b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3. </b>您可以切换"控件大小"来改变控件的尺寸</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="2000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div></div><div id="preview-mobile" componentKey="Mobile" class="field field_js"><label class="widget-title"><span class="widget-title_js">手机</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control check_js" componentKey="Mobile" maxlength="50"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-mobile" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		file: '<div id="form-file" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">附件</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="file-input form-control medium"><p class="file-tip ellipsis">请点击此处上传不大于50M的附件</p><span class="file-ico"><i class="icon-plus"></i></span></div></div></div><div id="editor-file" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件仅能上传不超过50M大小的文件<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3. </b>如果勾选"单文件上传"的话，在填写表单时能且仅能上传一个文件</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>附件上传设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="isSingle">单文件上传</label></div></div></div></div><div id="preview-file" componentKey="FileComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">附件</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="file-input form-control medium" componentKey="FileComponent"><p class="file-tip ellipsis">请点击此处上传不大于50M的附件</p><span class="file-ico"><i class="icon-plus"></i></span></div><div class="j_formFileContainer  check_js" data-url="/base/upload/{id}.json"></div></div></div><div id="mobile-preview" componentKey="FileComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">手机附件</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="file-input form-control medium" componentKey="FileComponent"><div id="documentFiles" class="doc-upload-wgt r-acl-disabled p-0"><i class="glyphicon icon-attachment"></i>请点击此处上传不大于50M的附件 <input type="file" name="data" id="formFileToUpload"/></div></div><div class="j_formFileContainer check_js" data-url="/base/upload/{id}.json"></div></div></div><div id="nouser-preview" class="field"><label class="widget-title"><span class="widget-title_js">附件</span><span class="c-danger widget-required_js"></span></label><div class="widget-content">该字段需要登录！</div></div><div data-role="page" class="page-view j_page-view" id="form-moblefileView"><header><i class="a-back j_fileViewBack">返回</i><h1>预览</h1></header><section class="view-con view-info pb-60"><div id="view-con" class="j_filePreview"></div></section><div class="eui-foot-tools info-opt"><ul class="info-opt-list"><li class=""><a><span></span></a></li><li id="finish" class=""><a><span></span></a></li><li id="formFileDelete" class="dele"><a><i></i><span>删除</span></a></li><li id="watch" class=""><a><span></span></a></li><li id="shareOther" class=""><a><span></span></a></li></ul></div></div>',
//		image: '<div id="form-image" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">图片</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="img-wedget"><div class="img-item img-add"><i class="icon-plus"></i><p>上传图片</p></div></div></div></div><div id="editor-image" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件仅能上传不超过50M大小的图片文件<br><b>2. </b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>3. </b>如果勾选"单图片上传"的话，在填写表单时能且仅能上传一张图片文件<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>图片上传设置</label><div class="controls"><div class="checkbox"><label><input type="checkbox" id="isSingle">单图片上传</label></div></div></div></div><div id="preview-image" componentKey="ImageComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">图片</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="img-wedget"><div class="img-item img-add j_imageAdd"><i class="icon-plus"></i><p>上传图片</p></div></div><div class="img-wedget j_formImageContainer check_js" data-url="/base/upload/{id}.json"></div></div></div><div id="mobile-preview" componentKey="ImageComponent" class="field field_js"><label class="widget-title"><span class="widget-title_js">图片</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="file-input form-control medium" componentKey="ImageComponent"><div id="documentFiles" class="doc-upload-wgt r-acl-disabled p-0"><i class="glyphicon icon-attachment"></i>请点击此处上传不大于50M的图片 <input type="file" name="data" id="formFileToUpload"/></div></div><div class="j_formFileContainer check_js" data-url="/base/upload/{id}.json"></div></div></div><div id="nouser-preview" class="field"><label class="widget-title"><span class="widget-title_js">图片</span><span class="c-danger widget-required_js"></span></label><div class="widget-content">该字段需要登录！</div></div><div data-role="page" class="page-view j_page-view" id="form-mobleImageView"><header><i class="a-back j_imageViewBack">返回</i><h1>预览</h1></header><section class="view-con view-info pb-60"><div id="view-con" class="j_imagePreview"></div></section><div class="eui-foot-tools info-opt"><ul class="info-opt-list"><li class=""><a><span></span></a></li><li id="finish" class=""><a><span></span></a></li><li id="formImageDelete" class="dele"><a><i></i><span>删除</span></a></li><li id="watch" class=""><a><span></span></a></li><li id="shareOther" class=""><a><span></span></a></li></ul></div></div>',
//		bar: '<div id="form-bar" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="paragraph alert"><img class=\'statimg\' src=\'/iform/static/img/form/bar.png\'></div></div><div id="editor-bar" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><select id = \'component-dataset\' class=\'w-200 h-30\'><option value=\'\' style="display: none;"></option></select></div></div></div><div id="preview-bar" componentKey="Text" class="field field_js"><div class=\'barview\' style=\'width:100%;height:400px;\'></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		pie: '<div id="form-pie" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="paragraph alert"><img class=\'statimg\' src=\'/iform/static/img/form/pie.png\'></div></div><div id="editor-pie" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><select id = \'component-dataset\' class=\'w-200 h-30\'><option value=\'\' style="display: none;"></option></select></div></div></div><div id="preview-pie" componentKey="Text" class="field field_js"><div class=\'pieview\' style=\'width:100%;height:400px;\'></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		tablestat: '<div id="form-tablestat" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="form-tablestat paragraph alert"><div  class=\'panel panel-default\'><div class=\'panel-heading widget-title_js\'><%= etitle %></div><div class="panel-body"><table class=\'table table-bordered\'><colgroup><col width=\'40%\'><col width=\'30%\'><col width=\'30%\'></colgroup><thead><th>选项</th><th>百分比</th><th>票数</th></thead><tbody><tr style="display: none;"><td class="j_content"></td><td class=\'bartd\'><div class=\'prograssbar j_prograssbar\'><span class=\'percentage j_percentage\'></span></div></td><td class="j_votes"></td></tr><tr><td></td><td class=\'totalcount\'>总计</td><td><%=etotalvotes%></td></tr></tbody></table></div></div></div></div><div id="editor-tablestat" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><select id = \'component-dataset\' class=\'w-200 h-30\'><option value=\'\' style="display: none;"></option></select></div></div></div><div id="preview-tablestat" componentKey="TableStat" class="field field_js"><div class="form-tablestat paragraph alert"><div  class=\'panel panel-default\'><div class=\'panel-heading\'><%= etitle %></div><div class="panel-body"><table class=\'table table-bordered\'><colgroup><col width=\'30%\'><col width=\'60%\'><col width=\'10%\'></colgroup><thead><th>选项</th><th>百分比</th><th>票数</th></thead><tbody><tr style="display: none;"><td class="j_content"></td><td class=\'bartd\'><div class=\'prograssbar j_prograssbar\'><span class=\'percentage j_percentage\'></span></div></td><td class="j_votes"></td></tr><tr><td></td><td class=\'totalcount\'>总计</td><td><%=etotalvotes%></td></tr></tbody></table></div></div></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		numberstat: '<div id="form-numberstat" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="form-numberstat  paragraph alert"><strong class=\'stattitle widget-title_js\'>标题</strong><div class=\'statdata\'>1234</div></div></div><div id="editor-numberstat" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><select id = \'component-dataset\' class=\'w-200 h-30\'><option value=\'\' style="display: none;"></option></select></div></div><div class="form-group"><label>统计方式</label><div class="controls"><select id = \'component-stattype\' class=\'w-200 h-30\'><option value=\'sum\'>求和</option><option value=\'count\'>计数</option><option value=\'avg\'>平均</option><option value=\'max\'>最大值</option><option value=\'min\'>最小值</option></select></div></div></div><div id="preview-numberstat" componentKey="Text" class="field field_js"><div class="form-numberstat  paragraph alert"><strong class=\'stattitle widget-title_js\'>标题</strong><div class=\'statdata\'>1234</div></div></div><div id="statsearch-text" class="inner-el"><select class="form-control sch-item j_condition"><option value="like">包含</option><option value="eq">等于</option><option value="neq">不等于</option></select><input class="form-control sch-item" type="text" value=""><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		table: '<div id="form-table" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><div class="paragraph alert"><img class=\'statimg\' src=\'/iform/static/img/form/table.png\'></div></div><div id="editor-table" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore">选择要统计的字段<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>数据来源</label><div class="controls"><ul class="j_datasource"><li style="display: none;"> <input class=\'table_field\' title=\'\' type=\'checkbox\' value=\'\'><span></span></li></ul></div></div></div><div id="preview-table" componentKey="Text" class="field field_js "><div  class=\'form-tablestat panel panel-default \'><div class=\'panel-heading\'></div><div class="panel-body  tablecontent"></div><div class=\'pageInfo\'><div class=\'pageNav\'></div></div></div></div><div id="formDatas" class="mr-10"><div id="statbody"><div class="j_formstarScr eform-data-tb"><table id="stat_table" class="table table-bordered"><thead><tr></tr></thead><tbody></tbody><tfoot class="hide bg-f0"><tr></tr></tfoot></table><div id="data_message" class="hide">暂无无数据...</div></div></div><div id="more_data" class="common-more hide mt-5"><a>查看更多</a></div></div>',
//		historyversion: '<div id="form-historyVersions" class="newform-modal modal fade form-horizontal entity-info"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button><h5 class="modal-title">表单历史版本</h5></div><div class="modal-body"><ul class="j_versionList clearfix form-his-version"></ul></div><div class="modal-footer"><p class="c-999">温馨提示：当前布局版本的表单发生过填写操作后保存才会产生新的布局版本。</p></div></div></div></div>',
//		monitor: '<div id="form-monitor" class="field field_js" componentKey="Monitor" tempId=""><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">运算控件</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-monitorbox"><input type="text" class="form-control"></div></div></div><div id="editor-monitor" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件用以监控统计其他控件的输入值<br><b>2. </b>您可以切换监控类型来监控不同控件的值<br><b>3. </b>运算控件计算顺序从左至右依次计算，无视数学计算优先级<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>是否可编辑</label><div class="controls"><label class="radio-inline"><input name="isedit" type="radio" value="true" checked="checked">是</label><label class="radio-inline"><input name="isedit" type="radio" value="false">否</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>监控类型</label><div class="controls"><label class="radio-inline"><input name="monitor-type" type="radio" value="number">数字</label><label class="radio-inline"><input name="monitor-type" type="radio" value="date">日期区间</label></div></div><div class="form-group j_numberDiv hide" type="number"><label>监控字段</label><div class="controls"><ul class="choicelistEdit j_choicelistEdit_number"></ul></div></div><div class="form-group j_numberDiv hide" type="date"><label>监控字段</label><div class="controls"><ul class="choicelistEdit j_choicelistEdit_date"><li class="j_monitor_item" index="0" type="date"><select class="choicelist form-control j_select_date j_select_monitor"></select></li><li class="j_operate_list"><span class="operate-group j_operate-group j_operate"><label class="radio-inline  j_operate-plus"><input name="operate-type" type="radio" value="+">加</label><label class="radio-inline  j_operate-minus"><input name="operate-type" type="radio" value="-">减</label><label class="radio-inline  j_operate-multiply"><input name="operate-type" type="radio" value="*">乘</label><label class="radio-inline  j_operate-divided"><input name="operate-type" type="radio" value="/">除</label></span></li><li><input type="text" class="form-control j_number_input" maxlength="15" value=""><li></ul></div></div><div class="form-group j_numberDiv j_operate_show hide"><label>表达式</label><div id="operate_show"></div></div><div class="form-group hide j_format_show"><label>日期格式设置</label><div class="controls j_operate"><div class="radio"><label><input type="radio" name="format" value="d" checked="checked">天</label></div><div class="radio"><label><input type="radio" name="format" value="h">时</label></div><div class="radio"><label><input type="radio" name="format" value="m">分</label></div></div></div></div><div id="j_monitor_item" class="hide"><li class="j_monitor_item" index="0"><label class="js_signField" title="A0">A0:</label><select class="choicelist form-control j_select_number w-120 j_select_monitor"><option></option></select><input type="text" class="form-control j_number_input hide w-50" maxlength="15" value=""><span class="cs-p"><i class="icon-minus-sign j_delField"></i></span><span class="cs-p"><i class="icon-plus-sign j_addField"></i></span></li></div><div id="j_operate_list" class="hide"><li class="j_operate_list"><label class="js_signField">运算:</label><span class="operate-group j_operate-group j_operate"><label class="radio-inline  j_operate-plus"><input name="operate-type" type="radio" value="+">加</label><label class="radio-inline  j_operate-minus"><input name="operate-type" type="radio" value="-">减</label><label class="radio-inline  j_operate-multiply"><input name="operate-type" type="radio" value="*">乘</label><label class="radio-inline  j_operate-divided"><input name="operate-type" type="radio" value="/">除</label></span></li></div><div id="preview-monitor" componentKey="Monitor" class="field field_js" tempId=""><label class="widget-title"><span class="widget-title_js">运算控件</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium check_js" componentKey="Monitor"><div class="input-instead j_readOnly hide"></div></div></div><div id="statsearch-monitor" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		userselecter: '<div id="selector-employee" class="modal fade selector-employee j_chat_filterSlip_js" role="dialog" aria-labelledby="modalLabel-employee" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close j_close" data-dismiss="modal" aria-hidden="true">×</button><h5 id="modalLabel-employee" class="modal-title">人员选择</h5></div><div id="userSelector-multi" class="modal-body"><div class="user-wrapper"><div class="selected-container clearfix"><div class="mb-10 fs-14">已选择：</div><div class="j_selectedUsersScr" auto-scroll="yes" style="max-height:70px"><div class="selected-users"></div></div></div><div class="user-container"></div></div><div class="user-selector-body clearfix"><div id="all-org-users" class="user-selector-body-l pull-left"><div class="org-left-header"><span class="tab"><a id="organization-users" class="active">团队</a><a id="group-users">群组</a></span></div><a id="show-first-group" class="hide router"></a><div id="org-tree" class="org-tree scrollwrapper" marginbottom="20"  style="height: 310px;"><div id="org-tree-list"><div id="list-loading" class="loading_small"><span>正在加载数据，请稍后...</span></div></div><div id="org-group-list" class="hide dept-grouplist"><div id="list-loading" class="loading_small"><span>正在加载数据，请稍后...</span></div></div></div></div><div id="all-group-users" class="user-selector-body-r"><div class="user-sort-view j-user-list"><div class="user-sortbar"><span id="group-user-checkall" class="hide"><input id="checkAll" class="user-id" type="checkbox"></span><span class="title">成员列表</span><span class="users-list-pinyin"><a class="highlight j_active" id="ALL">全部</a><a id="degit">#</a><a id="A">A</a><a id="B">B</a><a id="C">C</a><a id="D">D</a><a id="E">E</a><a id="F">F</a><a id="G">G</a><a id="H">H</a><a id="I">I</a><a id="J">J</a><a id="K">K</a><a id="L">L</a><a id="M">M</a><a id="N">N</a><a id="O">O</a><a id="P">P</a><a id="Q">Q</a><a id="R">R</a><a id="S">S</a><a id="T">T</a><a id="U">U</a><a id="V">V</a><a id="W">W</a><a id="X">X</a><a id="Y">Y</a><a id="Z">Z</a></span><label class="checkbox users-list-checkbox"><input type="checkbox" id="chk2" title="含离职人员"><i>含离职<span>人员</span></i></label></div><div id="user-container" class="users-container"><div id="employee-container"><ul class="employee-list users-list"><li class="list-tit clearfix"><div class="col-4 item username">姓名</div><div class="col-4 item call">联系方式</div><div class="col-4 item dept">部门</div></li><div class="j_userlistScr scrollwrapper" marginbottom="20" style="height: 280px;"><div id="userlistCon"><div id="list-loading" class="loading_small"><span>正在加载数据，请稍后...</span></div><div class="center-more hide">加载更多...</div></div></div></ul></div></div></div></div></div></div><div class="modal-footer"><span class="selector-btns"><a class="btn btn-middle btn-success hide j_user_ok">确定</a><a class="btn btn-middle j_user_cancel">取消</a></span></div></div></div></div><div id="usersListClone" class="hide"><li id="groupUserClone" class="clearfix"><div class="col-4 item username ellipsis"><a><input type="checkbox" name="userids" class="user-id hide"/></a><a class="avatar usercard-toggle"  userId><img alt="avatar"  src="https://www.eteams.cn/iform/static/img/avatar.png"></a><a class="name" userid="" data-id="" data-module="profile" ></a></div><div class="col-4 item call ellipsis"></div><div class="col-4 item dept ellipsis"></div></li></div><div id="employee-container" class="j_invite-parent view-h100"><div id="employee-seleted" data-role="page" class="page-view pb-60 page-memblist hide"><header class="header-fixed hide"><h1 id="seleted-title">人员选择</h1></header><section class="view-con js_mSerchClose"><div class="rt-sch-box"><i class="ico-l ico-memb"></i><i id="search-keyword-tap" class="ico-r ico-search"></i><div id="j_memb-names" class="rt-sch-list ellipsis"></div></div><div id="j_memb-list-container" class="j_memb-list-container memb-list-container sort-letter-container"></div></section><div class="eui-foot-tools"><a id="j_a-back">取消</a><a id="j_a-comfirm">确认</a></div></div><div id="searchResult-employee" data-role="page"  class="j_page-view page-view hide"><section class="view-con"><div class="sch-box"><form id="employee-form" method="post" action=""><div class="sch-input"><i class="icon-search"></i><i class="j_icon-cancel-circle icon-cancel-circle"></i><input id="search-keyword-employee" type="text" placeholder="搜索" value=""></div><div class="sch-input-opt"><a   class="j_cancle-search active">取消</a></div></form></div><div class="memb-list-container sort-letter-container"><ul id="j_memb-list-container-search" class="j_memb-list-container memb-list-container sort-letter-container"></ul></div></section></div><div class="hide"><li id="employee-info-clone" class="j_employee-info"><div class="j_avatar avatar"><img src="/iform/static/img/avatar.png"></div><div class="memb-list-info"><p class="j_name name ellipsis"></p></div><i class="j_ico-add ico-r ico-check"></i></li><div id="employee-clone" ><div  class="j_letter-hd letter-hd">Z</div><ul class="j_com-list com-list memb-list"></ul></div><div id="data-loading-clone" class="j_data-loading data-loading" id="loading">加载中...</div><div id="load-tip-employee" class="j_load-tip load-tip" id="no-result">没有成员</div></div></div>',
//		departselecter: '<div id="selector-department" class="modal fade selector-department" role="dialog" aria-labelledby="modalLabel-department" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h5 id="modalLabel-department" class="modal-title">部门选择</h5></div><div id="selector-org-tree"  class="org-tree scrollwrapper modal-body"></div></div></div></div><div id="department-component" data-role="page" class="j_page-view page-view pb-60 hide"><header class="header-fixed hide"><h1 id="title">部门选择</h1></header><section class="view-con js_mSerchClose"><div id="search-box" class="rt-sch-box"><i class="ico-l ico-memb"></i><div id="seleted-department-list" class="rt-sch-list ellipsis"></div></div><div id="j_dept-list-container"></div></section><div class="eui-foot-tools"><a id="j_a-back">取消</a><a id="j_department-comfirm">确认</a></div></div>',
//		datetimepicker: '<div data-role="page" id="date-selected" class="page-view page-datetime hide"><header class="hide"><h1>日期选择</h1></header><div class="view-con"><div id="datetimepicker"></div></div><div class="eui-foot-tools"><a id="datetime-back">取消</a></div></div>',
//		tablelayout: '<div id="table-layout" class="table_layout_js"><div class="form-tablelayout-wrap"><div class="form-layout-toolbar"><span class="layoutDrag-btn"><i class="icon-move"></i>拖拽</span><span class="layoutDele-btn j_cancel-drag j_layoutDele"><i class="icon-trash"></i>删除</span></div><div class="form-tablelayout j_table j_cancel-drag"></div></div><div id="context-menu" calss="j_cancel-drag right-click-menu"><ul class="dropdown-menu" role="menu"><li><a  href="#" class="j_layout_menu" type="merge">合并</a></li><li><a  href="#" class="j_layout_menu" type="clearMerge">拆分</a></li><li class="divider"></li><li><a  href="#" class="j_layout_menu" type="deleteRow">删除行</a></li><li><a  href="#" class="j_layout_menu" type="deleteCol">删除列</a></li><li class="divider"></li><li><a  href="#" class="j_layout_menu" type="addRow">添加行</a></li><li><a  href="#" class="j_layout_menu" type="addCol">添加列</a></li><li class="divider"></li><li><a  href="#" class="j_layout_menu" type="clearSelect">清空选择</a></li></ul></div></div><div class="field nopd" id="preview-tablelayout" componentKey="TableLayout"><div class="form-tablelayout-wrap"><div class="j_maximize opt-maximize"><i class="icon-expand" title="最大化编辑"></i></div><div class="form-tablelayout j_tablelayout"></div></div></div><div id="tableMaximize" class="modal form-tablelayout-full fade " tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button aria-hidden="true" data-dismiss="modal" class="close" type="button"><i class="icon-contract"></i></button><h5 class="modal-title">预览</h5></div><div class="modal-body eui-scroll"><div class="form-preview"><div id="maximizePreview" class="form-view"></div></div></div></div></div></div>',
//		raty: '<div id="form-raty" class="field field_js form-grade-widget"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">评分</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div id="star" class="star"></div></div></div><div id="editor-raty" class="field field_js"><div class=" alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1. </b>此控件可设置是否支持半星<br><b>2. </b>如果勾选必填的话,在填写表单时此项是必须填的<br><b>3. </b>您可以设置此控件的默认评分<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>是否支持半星</label><div class="controls"><label class="radio-inline"><input type="radio" value="yes" name="half">是</label><label class="radio-inline"><input type="radio" value="no" name="half">否</label></div></div><div class="form-group"><label>默认选中星星个数</label><div class="controls"><select class="form-control j_default-star" name="defaultstar"></select></div></div></div><div id="preview-raty" componentKey="Raty" class="field field_js form-grade-widget"><label class="widget-title"><span class="widget-title_js">评分</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div id="star-preview" class="check_js star"></div></div></div><div id="statsearch-raty" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div><div id="img-clone" class="hide"><img src="/iform/static/img/form/star-off-big.png"><option value=""></option></div>',
//		reference:'<div id="form-reference" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">参照</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-reference" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>2.</b>您可以切换"控件大小"来改变控件的尺寸<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>允许多选</label><div class="controls"><div class="checkbox"><label><input id="isMutiSelect" type="checkbox">允许多选</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div></div><div id="preview-reference" componentKey="Reference" class="field field_js"><label class="widget-title"><span class="widget-title_js">参照</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" componentKey="Reference" class="form-control check_js"><div class="input-instead j_readOnly hide"></div></div></div>',
//		precent:'<div id="form-precent" class="field field_js" componentKey="Precent"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">百分比</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="text" class="form-control"> <span class="precent_type_js m-type"></span></div></div></div><div id="editor-precent" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>此控件只能输入数字（包括正数和小数，不能输入负数、英文、汉字和特殊符号）<br><b>2.</b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>3.</b>您可以切换"控件大小"来改变控件的尺寸<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div></div><div id="preview-precent" componentKey="Precent" class="field field_js"><label class="widget-title"><span class="widget-title_js">百分比</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="text" class="form-control check_js" componentKey="Precent"><div class="input-instead j_readOnly hide"></div><span class="precent_type_js m-type"></span></div></div></div><div id="statsearch-precent" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		hyperlink:'<div id="form-hyperlink" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">超链接</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><input type="text" class="form-control medium"></div></div><div id="editor-hyperlink" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>如果勾选必填项的话，在填写表单时此项是必须填写的<br><b>2.</b>您可以切换"控件大小"来改变控件的尺寸<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div></div><div id="preview-hyperlink" componentKey="Hyperlink" class="field field_js"><label class="widget-title"><span class="widget-title_js">超链接</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><input type="text" componentKey="Hyperlink" class="form-control check_js"><div class="input-instead j_readOnly hide"></div></div></div>',
//		password:'<div id="form-password" class="field field_js" componentKey="Password"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">密码</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="password" class="form-control"></div></div></div><div id="editor-password" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>如果勾选必填项，在填写表单时此项是必须填写的<br><b>2.</b>您可以切换"控件大小"来改变控件的尺寸<br></div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div></div><div id="preview-password" componentKey="Password" class="field field_js"><label class="widget-title"><span class="widget-title_js">密码</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><div class="form-amountbox"><input type="password" class="form-control check_js" componentKey="Password"><div class="input-instead j_readOnly hide"></div></div></div></div><div id="statsearch-password" class="inner-el"><span class="sch-item-period"><input class="form-control j_numberCheck" type="text"><span class="spline">-</span><input class="form-control j_numberCheck" type="text"></span><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a></div>',
//		htmltext:'<div id="form-htmltext" class="field field_js"><span class="j_widgetDele widgetDele-btn"><i class="icon-remove-sign"></i></span><label class="widget-title"><span class="widget-title_js">html片段</span><span class="c-danger widget-required_js"></span></label><div class="widget-content"><div class="field-description hide">描述</div><textarea class="form-control medium"></textarea></div></div><div id="editor-htmltext" class="field field_js"><div class="alert alert-success edit-tips cs-h js_eTips"><h5>控件使用说明</h5><div class="hide js_eTipsMore"><b>1.</b>此控件不限制输入文字个数<br><b>2.</b>如果勾选必填项的话，在填写表单是此项是必须填写的<br><b>3.</b>您可以切换"控件大小"来改变控件的尺寸<br><b>4.</b>您可以切换普通文本</div></div><div class="form-group"><label>标题</label><input id="component-title" type="text" class="form-control ds-b w-full" maxlength="100"></div><div class="form-group"><label>标题布局</label><div class="controls"><label class="radio-inline"><input name="title-layout" type="radio" value="field-hoz">横</label><label class="radio-inline"><input name="title-layout" type="radio" value="">列</label></div></div><div class="form-group"><label>描述</label><textarea id="component-describe" class="form-control ds-b w-full" maxlength="1000"></textarea></div><div class="form-group"><label>必填项目</label><div class="controls"><div class="checkbox"><label><input id="required" type="checkbox">这个是必填项</label></div></div></div><div class="form-group"><label>控件大小</label><div class="controls"><label class="radio-inline"><input type="radio" value="small" name="tSize">小尺寸</label><label class="radio-inline"><input type="radio" value="medium" name="tSize">标准尺寸</label><label class="radio-inline"><input type="radio" value="large" name="tSize">大尺寸</label></div></div><div class="form-group"><label>切换组件类型</label><div class="controls"><label class="radio-inline"><input type="radio" name="componentType" value="Text">单行文本框</label><label class="radio-inline"><input type="radio" name="componentType" value="HtmlText">html片段</label></div></div></div><div id="preview-htmltext" componentKey="HtmlText" class="field field_js"><label class="widget-title"><span class="widget-title_js">多行文本框</span><span class="c-danger widget-required_js"></span></label><div class="form-error"></div><div class="widget-content"><div class="field-description hide">描述</div><textarea componentKey="HtmlText" class="form-control check_js"></textarea><div class="input-instead j_readOnly hide"></div></div></div>',
		get: function(h) {
			return this[h]
		}
	}
});