define("form/component/datatable", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.DataTable = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "DataTable",
				subFormId: "",
				title: "",
				describe: "",
				isDisplayNo : !1, //默认不勾选，不显示序号
				displayTitle : "序号",
				layoutDetail: [],
				defaultRows: "1",
				borderColor:"",
				order: 0,
				index: 0,
				required:false
			};
			null != b && 
			(this.componentSetup.subFormId = b.subFormId, 
			this.componentSetup.title = b.title, 
			this.componentSetup.describe = b.describe, 
			this.componentSetup.isDisplayNo = b.isDisplayNo,
			this.componentSetup.displayTitle = b.displayTitle,
			this.componentSetup.layoutDetail = b.layoutDetail, 
			this.componentSetup.defaultRows = b.defaultRows, 
			this.componentSetup.borderColor = b.borderColor,
			this.componentSetup.order = b.order, 
			this.componentSetup.index = b.index);
			this.checkCallback = null;
			this.tpl = l.get("datatable")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setIsDisplayNo : function(b){ //显示序号
			this.componentSetup.isDisplayNo = b;
		},
		setDisplayTitle : function(b){ //序号标题
			this.componentSetup.displayTitle = b;
		},
		setDefaultRows: function(b) {
			this.componentSetup.defaultRows = b;
		},
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		filterItme: {
			DividingLine: !1,
			Paragraph: !1,
			ColumnPanel: !1,
			Label: !1
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-datatable");
			b.attr("class", a.attr("class"));
			var ts = new Date().getTime().toString();
			this.componentSetup.subFormId = ts;
			b.html(a.html());
			//拖拽业务对象树时设置子表标题
			this.componentSetup.title && "" != this.componentSetup.title && (b.find('.form-databox-head .j_datatableTitle').text(this.componentSetup.title).removeClass("hide"));
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-datatable");
			b.find("#component-title-datatable").attr("value", this.componentSetup.title);
			b.find("#component-describe-datatable").text(this.componentSetup.describe);
			if(this.componentSetup.isDisplayNo || "true" === this.componentSetup.isDisplayNo){
				b.find("#component-isDisplayNo-datatable").attr("checked","true");
				b.find("#component-displayTitle-datatable").removeClass("hide");
			}
			b.find("#component-displayTitle-datatable").attr("value", this.componentSetup.displayTitle);
			$("#editor-component").html(b.html());
			var val = this.componentSetup.defaultRows?this.componentSetup.defaultRows: "1";
			$("#editor-component #datatable-defaultRows").text(val);
			//拖拽业务对象树时设置子表标题
			this.componentSetup.title && "" != this.componentSetup.title && ($("#widget-control .field-active .form-databox-head .j_datatableTitle").text(this.componentSetup.title).removeClass("hide"));
			//Grid表控件设置增加显示序号项
			this.componentSetup.componentKey=="Grid" && $("#editor-component #component-isDisplayNo-datatable").parents(".form-group").removeClass("hide");
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl),
				e = d.siblings("#preview-datatable");
			"mobile" == window.systemInfo_form && (e = d.siblings("#mobile-preview"));
			e.find(".j_datatableTitle").text(this.componentSetup.title);
			this.componentSetup.describe && "" != this.componentSetup.describe && (e.find(".j_datatableDescription").text(this.componentSetup.describe), e.find(".j_datatableDescription").removeClass("hide"));
			this.componentSetup.title && "" != this.componentSetup.title && (e.find(".j_datatableTitle").text(this.componentSetup.title), e.find(".j_datatableTitle").removeClass("hide"));
			if(e && e.find(".row_no")){
				e.find(".row_no").text(this.componentSetup.displayTitle);
			} 
			if(this.componentSetup.defaultRows==undefined){
				this.componentSetup.defaultRows = "1";
			}
			window.systemInfo_print && e.find(".j_setFiled").removeClass("hide");
			$("#formEdit_js").get(0) ? e.find(".j_maximize ").remove() : e.find(".j_datatableTitle").removeClass("hide");
			e.attr("id", null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId);
			e.attr("cid", this.cid);
			var f = this.componentSetup.layoutDetail;
			this.notDefault = a;
			this.isReadOnly = c;
			if ("mobile" != window.systemInfo_form) {
				a = d.siblings("#operating-datatable");
				var isDisplay = this.componentSetup.isDisplayNo;
				for (var d = $("<tr class='subtr_js'>"), g = 0; g < f.length; g++) {
					if(isDisplay){ //添加序号
						var dT = $("<th class='subtd_js'>").append($("<label class='widget-title row_no' style='text-align: center;'>").append(this.componentSetup.displayTitle));
						d.append(dT);
						isDisplay = false;
					}
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
			if(e && e.find(".row_no")){
				e.find(".row_no").text(this.componentSetup.displayTitle);
			} 
			if(this.componentSetup.defaultRows==undefined){
				this.componentSetup.defaultRows = "1";
			}
			a.attr("id", null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId);
			a.attr("cid", this.cid);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				a.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				a.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			var c = a.find("tr.subtr_js");
			c.html("");
			var isDisplay = this.componentSetup.isDisplayNo;
			for (var d = this.componentSetup.layoutDetail, e = 0; e < d.length; e++) {
				var f = d[e],
					g = $("<td class='subtd_js' style='height: 71px;'>");
				if(isDisplay){ //单独针对明细子表序号
					c.append($("<td class='subtd_js display_no' style='height: 71px;'>").append($("<label class='row_no' style='text-align: center;'>").append($("<span class='widget-title_js l_display_no'>").text(this.componentSetup.displayTitle))));
					isDisplay = false;
				}
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
				this.addRow(e)
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
		addRow: function(o) {
			var isDisplay = this.componentSetup.isDisplayNo;
			for (var b = null == this.componentSetup.subFormId || "" == this.componentSetup.subFormId ? this.cid : this.componentSetup.subFormId, a = this.checkCallback, c = this.componentSetup.layoutDetail, d = $(this.tpl).siblings("#operating-datatable"), e = $("<tr class='subtr_js'>"), f = [], g = 0; g < c.length; g++) {
				if(isDisplay){ //添加序号
					var no = o?(parseInt(o) + 1):1;
					var dT = $("<td class='subtd_js subtd_no_ts' style='text-align: center;'>").append(no);
					e.append(dT);
					isDisplay = false;
				}
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
	return window.DataTable
});
