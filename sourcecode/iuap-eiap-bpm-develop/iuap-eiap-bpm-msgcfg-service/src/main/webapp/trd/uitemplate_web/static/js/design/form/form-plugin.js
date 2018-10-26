define("form/form-plugin", [
	"form/component/text",
	"form/component/textarea",
	"form/component/columnpanel",
	"form/component/datatable",
	"form/component/dividingline",
	"form/component/datecomponent",
	"form/component/dateinterval",
	"form/component/option",
	"form/component/radiobox",
	"form/component/checkbox",
	"form/component/select",
	"form/component/paragraph",
	"form/component/numbercomponent",
	"form/component/money",
	"form/component/department",
	"form/component/employee",
	"form/component/email",
	"form/component/phone",
	"form/component/mobile",
	"form/component/filecomponent",
	"form/component/imagecomponent",
	"form/component/barcomponent",
	"form/component/piecomponent",
	"form/component/tablestatcomponent",
	"form/component/numberstatcomponent",
	"form/component/tablecomponent",
	"form/component/monitor",
	"form/component/tablelayout",
	"form/component/raty",
	"form/componentmodel",
	"form/component/reference",
	"form/component/htmltext",
	"form/component/precent",
	"form/component/hyperlink",
	"form/component/password",
	"form/component/codeRule",
	"form/component/label",
	"form/component/approveuser",
	"form/component/assignuser",
	"form/component/approveopinion",
	"form/component/billmaker",
	"form/component/processhistory",
	"form/component/groupTable",
], function() {
	require("form/component/text");
	require("form/component/textarea");
	require("form/component/columnpanel");
	require("form/component/datatable");
	require("form/component/dividingline");
	require("form/component/datecomponent");
	require("form/component/dateinterval");
	require("form/component/option");
	require("form/component/radiobox");
	require("form/component/checkbox");
	require("form/component/select");
	require("form/component/paragraph");
	require("form/component/numbercomponent");
	require("form/component/money");
	require("form/component/department");
	require("form/component/employee");
	require("form/component/email");
	require("form/component/phone");
	require("form/component/mobile");
	require("form/component/filecomponent");
	require("form/component/imagecomponent");
	require("form/component/barcomponent");
	require("form/component/piecomponent");
	require("form/component/tablestatcomponent");
	require("form/component/numberstatcomponent");
	require("form/component/tablecomponent");
	require("form/component/monitor");
	require("form/component/tablelayout");
	require("form/component/raty");
	require("form/component/reference");
	require("form/component/precent");
	require("form/component/hyperlink");
	require("form/component/password");
	require("form/component/htmltext");
	require("form/component/codeRule");
	require("form/component/label");
	require("form/component/approveuser");
	require("form/component/assignuser");
	require("form/component/approveopinion");
	require("form/component/billmaker");
	require("form/component/processhistory");
	require("form/component/groupTable");
	var l = require("form/componentmodel");
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
	/*formPlugin.addComponentModel = function(b, a) {
		var c = a.data("reportId") || a.parents(".form-view_js").data("reportId");
		null == c || b.componentmodel || (cmpmodel = new l({
			reportId: c
		}), b.setComponentModel(cmpmodel))
	};*/
	formPlugin.analyseComponent = function(b, a, c, d) {
		var e = b.componentKey,
			f = new window[e](b);
		// this.addComponentModel(f, a);
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
	return window.formPlugin
});
