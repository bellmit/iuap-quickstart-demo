define("form/component/datecomponent", ["form/component", "form/tplutil", "form/component/datetimepicker"], function() {
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = require("form/component/datetimepicker");
	window.DateComponent = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "DateComponent",
				title: "日期",
				titleLayout: "",
				itemListener: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				islist:true, //是否列表显示
				fieldId: l.getFieldId(),
				format: "YYYY-MM-DD",
				isSystemDate: !1,
				borderColor:"",
				isReadonly: !1
			};
			null != a && (this.componentSetup.title = a.title,this.componentSetup.itemListener = a.itemListener, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.describe = a.describe, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.format = a.format, this.componentSetup.isSystemDate = a.isSystemDate, this.componentSetup.isReadonly = a.isReadonly,this.componentSetup.borderColor = a.borderColor,
			this.componentSetup.islist = a.islist);
			this.tpl = l.get("date")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setItemListener: function(a) {
			this.componentSetup.itemListener = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setIsList: function(b) {
			this.componentSetup.islist = b
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
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-date");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.attr("tempId",this.componentSetup.fieldId);
			//修改placeholder
			var newplaceholder="";
			"YYYY-MM-DD" == this.componentSetup.format ?(newplaceholder = "年-月-日") : "YYYY-MM" == this.componentSetup.format ? (newplaceholder = "年-月") : "YYYY-MM-DD HH:mm" == this.componentSetup.format ? (newplaceholder = "年-月-日 时:分"): "YYYY-MM-DD HH:mm:ss" == this.componentSetup.format &&(newplaceholder = "年-月-日 时:分:秒");
			c.find("input").attr("placeholder",newplaceholder);
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-date");
			a.show();
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("#component-listener").attr("value", this.componentSetup.itemListener);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			//a.find("input:radio[name='dateFormat'][value='" + this.componentSetup.format + "']").attr("checked", "true");
			a.find("option[value='" + this.componentSetup.format + "']").attr("selected", "selected");
			var c = !1,
				b = !1;
			if ("true" == this.componentSetup.isSystemDate || 1 == this.componentSetup.isSystemDate) c = !0;//, a.find(".date_readonly_js").show();
			if ("true" == this.componentSetup.isReadonly || 1 == this.componentSetup.isReadonly) b = !0;
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || a.find("#isList").attr("checked", "true");
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
			"YYYY-MM-DD" == this.componentSetup.format ?(g = "年-月-日", "mobile" == window.systemInfo_form && f.find("#" + this.componentSetup.fieldId).attr("format","{YYYY}-{MM}-{DD}").attr("minview", 2).attr("startview", "month")) : "YYYY-MM" == this.componentSetup.format ? (g = "年-月", "mobile" == window.systemInfo_form && f.find("#" + this.componentSetup.fieldId).attr("format", "{YYYY}-{MM}").attr("minview", 3).attr("startview", "year")) : "YYYY-MM-DD HH:mm" == this.componentSetup.format ? (g = "年-月-日 时:分", "mobile" == window.systemInfo_form && f.find("#" + this.componentSetup.fieldId).attr("format", "{YYYY}-{MM}-{DD} {HH}:{mm}").attr("minview", 1).attr("startview", "month")): "YYYY-MM-DD HH:mm:ss" == this.componentSetup.format &&(g = "年-月-日 时:分:秒", "mobile" == window.systemInfo_form && f.find("#" + this.componentSetup.fieldId).attr("format", "{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}").attr("minview", 4).attr("startview", "month"));
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
		    "YYYY-MM-DD HH:mm" == g ? (g = "YYYY-mm-DD hh:ii", e = Date.create(k.getTime()).format("{YYYY}-{MM}-{DD} {HH}:{mm}")) : "YYYY-MM-DD" == g ? (g = "YYYY-mm-DD", e = Date.create(k.getTime()).format("{YYYY}-{MM}-{DD}")) : "YYYY-MM" == g ? (g = "YYYY-mm", e = Date.create(k.getTime()).format("{YYYY}-{MM}")):"YYYY-MM-DD HH:mm:ss" == g && (g = "YYYY-mm-DD hh:ii:ss", e = Date.create(k.getTime()).format("{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}"));
			var p = "month",
				h = "month",
				l = !0;
			0 <= g.indexOf("hh:ii") ? p = "day" : 0 > g.indexOf("DD") && (h = p = "year", l = !1);
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
			"YYYY-MM-DD" == this.componentSetup.format ? b = "年-月-日" : "YYYY-MM" == this.componentSetup.format ? b = "年-月" : "YYYY-MM-DD HH:mm" == this.componentSetup.format ? (b = "年-月-日 时:分"): "YYYY-MM-DD HH:mm:ss" == this.componentSetup.format && (b = "年-月-日 时:分:秒");
			c.find("input").attr("placeholder", b);
			c.attr("id", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				//c.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				c.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
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
					a = Date.create(a.date).format("{YYYY}-{MM}-{DD}");
					g.val() && a > g.val() ? (formPlugin.notify("开始日期不能大于结束日期"), f.val("")) : f.val(a)
				}
			});
			formPlugin.datepicker({
				el: a + " #j_datetime" + e + " #endDate",
				callback: function(a) {
					a = Date.create(a.date).format("{YYYY}-{MM}-{DD}");
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
	return window.DateComponent
});
