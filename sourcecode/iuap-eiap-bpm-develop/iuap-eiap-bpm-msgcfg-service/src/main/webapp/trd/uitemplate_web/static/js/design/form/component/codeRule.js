define("form/component/codeRule", ["form/component", "form/tplutil", "form/componentmodel"], function() {
	function l(a, b, e, f) {
		this.value = a;
		this.name = b;
	}
	var m = require("form/component");
	var b = require("form/tplutil"),
		a = require("form/componentmodel");
	window.CodeRule = m.extend({
		initialize: function(c) {
			this.componentSetup = {
				componentKey: "CodeRule",
				title: "编号", //标题
				titleLayout: "",
				order: 0,
				index: 0,
				describe: "", //描述
				fieldId: b.getFieldId(),
				ruleType: "number",
				codeRuleType: "", //编码规则
				fields: "", //字段
				decimals: 0, //位数
				codeValue: "",
				borderColor:"",
				value: "",
				format: "",
				tempId: 0,
				monitorFields: [],
				required: !1,
				isEdit: !1,
				islist:true //是否列表显示
			};
			null != c && (this.componentSetup.title = c.title, this.componentSetup.titleLayout = c.titleLayout, this.componentSetup.order = c.order, this.componentSetup.index = c.index, 
						this.componentSetup.describe = c.describe, this.componentSetup.fieldId = c.fieldId, this.componentSetup.codeRuleType = c.codeRuleType || this.componentSetup.codeRuleType, 
						this.componentSetup.componentIds = _.filter(c.componentIds, function(a) {
						return "" != a}), 
						this.componentSetup.value = c.value, this.componentSetup.format = c.format, this.componentSetup.tempId = c.tempId || c.fieldId, this.componentSetup.monitorFields = c.monitorFields, 
						this.componentSetup.isEdit = c.isEdit,this.componentSetup.fields = c.fields,this.componentSetup.decimals = c.decimals,this.componentSetup.codeValue = c.codeValue,this.componentSetup.borderColor = c.borderColor,
						this.componentSetup.islist = c.islist);
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
		setIsList: function(b) {
			this.componentSetup.islist = b
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setCodeRuleType: function(a) {
			this.componentSetup.codeRuleType = a
		},
		setRuleType: function(a) {
			this.componentSetup.ruleType = a
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
		setFields: function(a) {
			this.componentSetup.fields = a
		},
		setDecimals: function(a) {
			this.componentSetup.decimals = a
		},
		setCodeValue: function(a) {
			this.componentSetup.codeValue = a
		},
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		render: function(a) {
			var d = this,
				e = $(this.tpl).siblings("#form-monitor");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			a.attr("class", e.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			//this.componentModel.generatorId(function(e) {
			//	e = e.generatorId;
			//	b.componentSetup.tempId = e;
			//	a.attr("tempId", e)
			//});
//			var timeStamp = new Date().getTime().toString();
//			b.componentSetup.tempId = timeStamp;
//			b.componentSetup.fieldId = timeStamp;
			a.attr("tempId", this.componentSetup.fieldId);
			a.html(e.html())
		},
		renderEditor: function(form) {
			var formid = form.formId;
			var a = this,
				b = $(this.tpl),
				e = this.componentSetup,
				f = e.ruleType,
				g = b.siblings("#editor-monitor");
			a.count = 0;
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || g.find("#isList").attr("checked", "true");
			g.find("#component-title").attr("value", e.title);
			g.find("input:radio[name='title-layout'][value='" + e.titleLayout + "']").attr("checked", !0);
			g.find("#component-describe").text(e.describe);
			g.find("input:radio[name='monitor-type'][value='" + f + "']").attr("checked", !0);
			g.find("div[type='" + f + "']").show();
			g.find("input:radio[name='isedit'][value='" + e.isEdit + "']").attr("checked", !0);
			var k = this.getAllNumberField(), //获取表单中各个字段的name和value
				h = "",
				e = this.componentSetup.monitorFields;
				var l = b.siblings("#j_monitor_item").clone();
				l.find("select").html(k);
				a.count++;
				h += l.html();
				
				var x = this.getAllCodeRules(formid),
				//var x = "<option>年+(字段)+流水号</option><option>年+流水号</option><option>(字段)+流水号</option>";
				y = "";
				var z = b.siblings("#j_codeRule_item").clone();
				z.find("select").html(x);
				y += z.html();
				
				g.find(".j_choicelistEdit_number").html(h);
				g.find(".j_choicelistEdit_codeRule").html(y);
			
			$("#editor-component").html(g.html());
			$(".j_operate_show").show();
			a.getcodeRuleFormula(); //设置编码规则，字段，位数，边框颜色等信息
			//a.getCodeValue();
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
						} else if (e.componentSetup.format) l += d.value
					});
					g.attr("title", l)
				}
			} else f && 0 < f.length && (l = b.find(".widget-title_js").text() + "=", $.each(f, function(b, d) {
				"string" === typeof d && (d = JSON.parse(d));
				if (d && d.type) if ("field" === d.type) l += a.find("div[id='field_" + d.value + "']").find(".widget-title_js").text();
				else if (e.componentSetup.format) l += d.value
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
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				b.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				b.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
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
			var b = this.componentSetup.codeRuleType,
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
				}), h.monitorFields && 0 < h.monitorFields.length && g.changeEvent(a, h.codeRuleType, h.monitorFields, f)), "date" === b)) if ("mobile" == window.systemInfo_form) a.on("monitor_change", "div[fieldId='" + h.value + "'] input", function() {
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
			
		},
		getcodeRuleFormula: function() {
			var a = "",
				b = [],
				c = [],
				e = this.componentSetup.ruleType;
			"number" === e && ($(".j_choicelistEdit_number li").each(function() {
				var e = $(this);
				var f = e.find("select"),
				h = f.find("option:selected").text();
				if (e.hasClass("j_monitor_item")) {
					b.push(new l(f.val(), h));
				}
				return !0
			}));
			"number" === e && ($(".j_choicelistEdit_codeRule li").each(function() {
				var e = $(this);
				var f = e.find("select"),
				h = f.find("option:selected").text();
				if(e.hasClass("j_codeRule_item")){
					c.push(new l(f.val(), h));
				}
				return !0
			}));
			var color = $("#edit-widget .form-group .in-color").css("background-color");
			e = $("#widget-control .field-active").data("componentData");
			b = this.componentSetup.fields=="" || (this.componentSetup.fields!="" && this.componentSetup.fields[0]["name"] != b[0]["name"]) ? b : this.componentSetup.fields; 
			c = this.componentSetup.codeRuleType=="" || (this.componentSetup.codeRuleType!="" && this.componentSetup.codeRuleType[0]["name"] != c[0]["name"]) ? c : this.componentSetup.codeRuleType; 
			if(typeof c !="undefined" && c != "" && c[0].value.indexOf("yearsn")>=0  ){
				$("#editor-component .j_fieldsDiv").css("display","none");
			}else{
				$("#editor-component .j_fieldsDiv").css("display","block");
			}
			e.setFields(b); //字段
			e.setCodeRuleType(c); //编码规则
			var decimalsNum = this.componentSetup.decimals!==0?this.componentSetup.decimals : $("#codeDecimals").text();
			$("#codeDecimals").text(decimalsNum);
			e.setDecimals(decimalsNum); //位数
			//e.setBorderColor(color); //边框颜色
			if(typeof e.options.fields !="undefined"){
				e.options.fields = this.componentSetup.fields;
			}
			e.options.codeRuleType ? e.options.codeRuleType = this.componentSetup.codeRuleType : this.componentSetup.codeRuleType;
			e.options.decimals ? e.options.decimals = this.componentSetup.decimals : this.componentSetup.decimals;
			e.options.borderColor ? e.options.borderColor = this.componentSetup.borderColor : this.componentSetup.borderColor;
		},
		addDecimals: function() {
			var codeDecimalsVal = $("#codeDecimals").text();
			codeDecimalsVal++;
			$("#codeDecimals").text(codeDecimalsVal);
			var e = $("#widget-control .field-active").data("componentData");
			e.setDecimals(codeDecimalsVal);
			e.options.decimals = this.componentSetup.decimals;
		},
		delDecimals: function() {
			var codeDecimalsVal = $("#codeDecimals").text();
			var rulecode = this.componentSetup.codeRuleType[0]["value"];
			$.ajax({
				type: "POST",
				data: {
					rulecode: rulecode
				},
				dataType: "json",
				async: false,
				url: "/iform/iform_design_ctr/getSNCode",
				success: function(a) {
					if(typeof a !="undefined" && a !=null){
						for(var i = 0;i < JSON.stringify(a).split(",").length/2;i++){
							var j = "ruleSN"+i;
							var compTitle = $("#edit-widget").find("#codeDecimals");
							var codenum = Number(a[j]).toString().length;
							if(codenum>=codeDecimalsVal){
								compTitle.siblings(".form-error").length==0 && compTitle.before('<div class="form-error fl errorStyle"></div>');
								compTitle.siblings(".form-error").text("当前流水号为"+codenum+"位数，所以流水号位数不能少于"+codenum);
								compTitle.siblings(".form-error").show();
								return false;
							}else{
								compTitle.siblings(".form-error").text("");
								compTitle.siblings(".form-error").hide();
							} 
						}
					}
				}
			})
			
			codeDecimalsVal--;
			$("#codeDecimals").text(codeDecimalsVal);
			var e = $("#widget-control .field-active").data("componentData");
			e.setDecimals(codeDecimalsVal);
			e.options.decimals = this.componentSetup.decimals;
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
			var that = this;
			var a, b, e, f = $("div[tempId='" + this.componentSetup.tempId + "']").closest(".subtr_js");
			var g = "";
			a = $("#formContainer_js").find(".field_js").not("[componentkey=CodeRule]");
			$.each(a, function() {
				var a = $(this),
					b = a.attr("id") || a.attr("tempid"),
					a = a.find(".widget-title_js").text();
				if(typeof a !="undefined" && a !=""){
					//g += '<option value="' + b + '">' + a + "</option>"
					if(that.componentSetup.fields!="" && that.componentSetup.fields[0]["name"]==a){
						g += '<option value="' + b + '" selected="selected">' + a + "</option>"
					}else{
						g += '<option value="' + b + '">' + a + "</option>"
					}
				}
			});
//			0 < g.length && (g += '<option value="常量">常量</option>');
			return g
		},
		//根据用户id获取所有的编码规则
		getAllCodeRules: function(formid) {
			var that = this;
			var g = "";
			that.componentSetup.codeRuleType && that.componentSetup.codeRuleType[0]['name']=="年+(字段)+流水号" ? g += '<option value="yearFiledsn_' + formid + '" selected="selected">年+(字段)+流水号</option>' : g += '<option value="yearFiledsn_' + formid + '">年+(字段)+流水号</option>';
			that.componentSetup.codeRuleType && that.componentSetup.codeRuleType[0]['name']=="(字段)+流水号" ? g += '<option value="filedsn_' + formid + '" selected="selected">(字段)+流水号</option>' : g += '<option value="filedsn_' + formid + '">(字段)+流水号</option>';
			that.componentSetup.codeRuleType && that.componentSetup.codeRuleType[0]['name']=="年+流水号" ? g += '<option value="yearsn_' + formid + '" selected="selected">年+流水号</option>' : g += '<option value="yearsn_' + formid + '">年+流水号</option>';
			
//			$.ajax({
//				type: "POST",
//				data: {
//					userId: '10001'
//				},
//				dataType: "json",
//				async: false,
//				url: "/iform/iform_design_ctr/getCodeRules",
//				success: function(a) {
//					if(typeof a !="undefined" && a !=null){
//						for(var i = 0;i < JSON.stringify(a).split(",").length/2;i++){
//							var j = "rulecode"+i;
//							var k = "rulename"+i;
//							if(that.componentSetup.codeRuleType!="" && that.componentSetup.codeRuleType[0]["name"]==a[k]){
//								g += '<option value="' + a[j] + '" selected="selected">' + a[k] + "</option>"
//							}else{
//								g += '<option value="' + a[j] + '">' + a[k] + "</option>"
//							}
//							//g += '<option value="' + a[j] + '">' + a[k] + "</option>"
//						}
//					}
//				}
//			})
			return g
		},
		//生成编码
		getCodeValue: function() {
			var e;
			var fieldId = $(".j_choicelistEdit_number li").find("select").find("option:selected").val();
			$.ajax({
				type: "POST",
				data: {
					rulecode:this.componentSetup.codeRuleType[0]["value"],
					rulename:this.componentSetup.codeRuleType[0]["name"],
					ruleFieldId: fieldId,
					snum:this.componentSetup.decimals
				},
				dataType: "json",
				async: false,
				url: "/iform/iform_design_ctr/getCodeValue",
				success: function(a) {
					var b = a.codeValue;
					e = $("#widget-control .field-active").data("componentData");
					e.setCodeValue(b); 
				}
			})
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
				f = this.componentSetup.codeRuleType,
				g = "",
				k = $("input[id='" + (this.componentSetup.fieldId || this.componentSetup.tempId) + "'][cid='" + this.cid + "']"),
				h = k.closest(".subtr_js"),
				l = 1 == h.length ? h : k.closest(".form-view"),
				n = [];
			e && 0 < e.length && ($.each(e, function(e, f) {
				"string" == typeof f && (f = JSON.parse(f));
				if (f.monitorFields && 0 < f.monitorFields.length) {
					var k = [];
					b.getMonitorComponents(k, f.monitorFields); - 1 < $.inArray(a, k) && l.find("input[id='" + f.value + "']").data("componentData").getMonitorValue(a)
				}
				"field" === f.type && ((k = l.find("input[id='" + f.value + "']")) && 0 < k.length ? (k = k.val(), 0 < k.length && (k = parseFloat(k.replace(/[^\d.-]/g, "")), n.push(k)), k || (k = "0"), k && (0 < g.length ? (g += "(" + k + "))", g = "(" + g) : g += k)) : 0 < g.length && (g = g.substring(0, g.length - 1)));
				"operate" === f.type && f.value && g && 0 < g.length && (g += f.value);
				"number" === f.type && f.value && (0 < g.length ? (g += "(" + f.value + "))", g = "(" + g) : g += f.value)
			}));
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
	return window.CodeRule
});
