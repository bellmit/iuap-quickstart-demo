define("form/component/dateinterval", ["form/component", "form/tplutil", "form/componentmodel", "form/component/datetimepicker", "form/component/datecomponent"], function() {
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = require("form/componentmodel"),
		a = require("form/component/datetimepicker");
	require("form/component/datecomponent");
	window.DateInterval = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "DateInterval",
				title: "日期区间",
				fieldId: l.getFieldId(),
				titleLayout: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				tempId: 0,
				borderColor:"",
				format:"yyyy-MM-dd",
				islist:true, //是否列表显示
				start: (new DateComponent).componentSetup,
				end: (new DateComponent).componentSetup
			};
			this.componentSetup.start.title = this.componentSetup.title + "(开始时间)";
			this.componentSetup.end.title = this.componentSetup.title + "(结束时间)";
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.describe = a.describe, this.componentSetup.required = a.required, this.componentSetup.start = a.start, this.componentSetup.end = a.end, this.componentSetup.fieldId = a.fieldId,this.componentSetup.borderColor = a.borderColor, this.componentSetup.tempId = a.tempId || a.fieldId,this.componentSetup.islist = a.islist);
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
		setIsList: function(b) {
			this.componentSetup.islist = b
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
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		render: function(a) {
			var b = this,
				e = $(this.tpl).siblings("#form-dateinterval");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			a.attr("class", e.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.attr("tempId",this.componentSetup.fieldId);
			a.html(e.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-dateinterval");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || a.find("#isList").attr("checked", "true");
			a.find("input:radio[name='dateFormat'][value='"+ this.componentSetup.format +"']").attr("checked", "true");
			this.setFormat(this.componentSetup.format);
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
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				b.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				b.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
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
	return window.DateInterval
});
