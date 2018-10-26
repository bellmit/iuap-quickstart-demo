define("form/component/money", ["form/component", "form/tplutil", "form/componentmodel"], function() {
	function setValue(a, b, e, f) {
		this.value = a;
		this.type = b;
		this.moneyFields = e;
		this.moneyType = f
	}
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = require("form/componentmodel");
	window.Money = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "Money",
				title: "金额",
				titleLayout: "field-vertical",
				itemListener: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,  
				fieldId: l.getFieldId(),
				size: "large",  //控件尺寸 默认标准
				numberToChinese:!1,//转换大写金额  默认不转换
				decimalPlace: 2,  //小数位数 默认为2
				calculate: !1,    //计算  默认不勾选
				isEdit:!0,         //默认可编辑  勾选计算后此控件不可编辑
				isTotal: !1,      //是否合计  默认不勾选
				mainTableField: "",//主表字段 默认为空
				calculationFormula:"",//计算公式 默认为空
				borderColor:"",//边框颜色
				inDataTable:"",//是否在明细子表中
				moneyFields: [],
				moneyFieldArr: [],
				moneyType: "人民币",
				tempId: 0,
				isMinus: !1,
				islist:true //是否列表显示
			};
			null != a && 
			(this.componentSetup.title = a.title, 
			 this.componentSetup.titleLayout = a.titleLayout,
			 this.componentSetup.itemListener = a.itemListener,
			 this.componentSetup.describe = a.describe, 
			 this.componentSetup.order = a.order, 
			 this.componentSetup.index = a.index, 
			 this.componentSetup.required = a.required, 
			 this.componentSetup.numberToChinese = a.numberToChinese, 
			 this.componentSetup.decimalPlace = a.decimalPlace, 
			 this.componentSetup.fieldId = a.fieldId, 
			 this.componentSetup.calculate = a.calculate, 
			 this.componentSetup.isTotal = a.isTotal, 
			 this.componentSetup.isEdit = a.isEdit, 
			 this.componentSetup.calculationFormula = a.calculationFormula, 
			 this.componentSetup.size = a.size, 
			 this.componentSetup.moneyType = a.moneyType, 
			 this.componentSetup.moneyFields = a.moneyFields, 
			 this.componentSetup.borderColor = a.borderColor, 
			 this.componentSetup.mainTableField = a.mainTableField, 
			 this.componentSetup.moneyFieldArr = a.moneyFieldArr, 
			 this.componentSetup.inDataTable = a.inDataTable, 
			 this.componentSetup.islist = a.islist,
			 this.componentSetup.tempId = a.tempId || a.fieldId);
			this.componentSetup = $.extend({}, this.componentSetup, a);
			this.tpl = l.get("money");
			this.componentModel = new b;
			this.count = this.componentSetup.moneyFieldArr ? Math.floor(this.componentSetup.moneyFieldArr.length / 2) + 1 : 0;
			this.eventFiled = [];
			this.moneys = []
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
		setBorderColor:function(a){
			this.componentSetup.borderColor = a
		},
		setNumberToChinese: function(a) {
			this.componentSetup.numberToChinese = a
		},
		setCalculate: function(a) {
			this.componentSetup.calculate = a
		},
		setCalculationFormula: function(a) {
			this.componentSetup.calculationFormula = a
		},
		setDecimalPlace: function(a) {
			this.componentSetup.decimalPlace = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setMoneyType: function(a) {
			this.componentSetup.moneyType = a
		},
		setMainTableField: function(a) {
			this.componentSetup.mainTableField = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setMoneyFields: function(a) {
			this.componentSetup.moneyFields = a
		},
		setMoneyFieldArr: function(a) {
			this.componentSetup.moneyFieldArr = a
		},
		setIsEdit: function(a) {
			this.componentSetup.isEdit = a
		},
		setIsTotal: function(a) {
			this.componentSetup.isTotal = a
		},
		render: function(a) {
			var b = this,
				d = $(this.tpl).siblings("#form-money");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
//			"true" != this.componentSetup.numberToChinese && 1 != this.componentSetup.numberToChinese || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".form-amountbox .money_type_js").text("(" + this.componentSetup.moneyType + ")");
			d.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("class", d.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
//			this.componentModel.generatorId(function(d) {
//				d = d.generatorId;
//				b.componentSetup.tempId = d;
//				a.attr("tempId", d)
//			});
//			var timeStamp = new Date().getTime().toString();
//			b.componentSetup.tempId = timeStamp;
//			b.componentSetup.fieldId = timeStamp;
			a.attr("tempId", this.componentSetup.fieldId);
			a.html(d.html());
			if((typeof a.parent()[0]!="undefined" && a.parent()[0].className.indexOf("subtd_js")<0) || $("#widget-control").find("li a:first > span:last[nodepk='"+a.attr("nodepk")+"']").length>0){
				//主表
				this.componentSetup.inDataTable = "false";
			}
		},
		renderEditor: function() {
			var b = this,
			    a = $(this.tpl).siblings("#editor-money");
			b.count = 0;
			//获取计算属性中下拉框显示值
			var k = this.getAllNumberField(),
			h = "",
			//主表字段下拉框显示值
			f = this.getAllNumberField("1"),
			e = this.componentSetup.moneyFieldArr;
			a.find("#mainTableFields").html(f);
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("#component-listener").attr("value", this.componentSetup.itemListener);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			"true" != this.componentSetup.numberToChinese && 1 != this.componentSetup.numberToChinese || a.find("#numberToChineseBtn").attr("checked", "true");
			"true" != this.componentSetup.isTotal && 1 != this.componentSetup.isTotal || a.find("#isTotalBtn").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || a.find("#isList").attr("checked", "true");
			//勾选合计则显示主表字段
			if(this.componentSetup.inDataTable == "false"){
				a.find("#isTotalBtn").parent().parent().parent().addClass("hide");
			}else{
				a.find("#isTotalBtn").parent().parent().parent().removeClass("hide");
			}
			if(this.componentSetup.inDataTable != "false" && "true"== this.componentSetup.isTotal || 1 == this.componentSetup.isTotal){
				a.find("#isTotalBtn").attr("checked", "true");
				a.find(".f-mainTableField")[0].className=a.find(".f-mainTableField")[0].className.replace("hide","");
				a.find("select[id='mainTableFields'] option[value='" + this.componentSetup.mainTableField + "']").attr("selected", "selected");
			}
			//勾选计算则显示计算公式
			if(true== this.componentSetup.calculate || 1 == this.componentSetup.calculate){
				a.find("#calculateBtn").attr("checked", "true");
				a.find(".f-calculate")[0].className=a.find(".f-calculate")[0].className.replace("hide","");
			}
			//渲染小数位
//			var val = this.componentSetup.decimalPlace?this.componentSetup.decimalPlace:"2";
			a.find("#decimalPlace").text(this.componentSetup.decimalPlace);
			//货币
			a.find("select[id='moneyType'] option[value='" + this.componentSetup.moneyType + "']").attr("selected", "selected");
			//控件尺寸
			a.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			//主表字段
			a.find("select[id='mainTableFields'] option[value='" + this.componentSetup.mainTableField + "']").attr("selected", "selected");
			
			//渲染计算属性
			if (e && 0 < e.length){
				$.each(e, function(e, f) {
						"string" == typeof f && (f = JSON.parse(f));
						if ("field" === f.type || "number" === f.type) {
							var g = a.siblings("#j_monitor_item").clone();
							g.find("select").html(k);
							"field" === f.type ? g.find("select option[value='" + f.value + "']").attr("selected", !0) : (g.find("select option[value='常量']").attr("selected", !0), g.find("select").next().removeClass("hide").attr("value", f.value ? f.value : 0));
							b.count++;
							h += g.html()
						}else if("operate" === f.type){
							g = a.siblings("#j_operate_list").clone();
							g.find("input").attr("name", "operate-type-" + b.count);
							g.find("input[value='" + f.value + "']").attr("checked", !0);
							h += g.html();
						}
					});
			}else{
						var l = $(this.tpl).siblings("#j_monitor_item").clone();
						l.find("select").html(k);
						b.count++;
						h += l.html()
			}
			a.find(".j_choicelistEdit_number").html(h);
			$("#editor-component").html(a.html());
			b.getFormula();
		},
		/*预览*/
		renderPreview: function(a, b, d) {
			var e = $(this.tpl).siblings("#preview-money");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".check_js").addClass(this.componentSetup.size);
			e.find(".form-amountbox .money_type_js").text("(" + this.componentSetup.moneyType + ")");
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
			a[0].className.indexOf("subtd_js")<0?this.componentSetup.inDataTable = "false":this.componentSetup.inDataTable = "true";
			this.componentSetup.calculate?this.componentSetup.calculate:this.componentSetup.calculate = !1;
			this.componentSetup.borderColor?this.componentSetup.borderColor:this.componentSetup.borderColor = "";
			this.componentSetup.isTotal?this.componentSetup.isTotal:this.componentSetup.isTotal = !1;
//			this.componentSetup.decimalPlace?this.componentSetup.decimalPlace:this.componentSetup.decimalPlace = "2";
			this.componentSetup.numberToChinese?this.componentSetup.numberToChinese:this.componentSetup.numberToChinese = !1;
			var b = $(this.tpl).siblings("#form-money");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.find(".form-control").addClass(this.componentSetup.size);
			this.componentSetup.moneyType?this.componentSetup.moneyType:this.componentSetup.moneyType = this.componentSetup.type;
			b.find(".form-amountbox .money_type_js").text("(" + this.componentSetup.moneyType + ")");
//			var val = this.componentSetup.decimalPlace?this.componentSetup.decimalPlace:"2";
			b.attr("id", this.componentSetup.fieldId);
			b.attr("tempId", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				//b.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				b.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			a.append(b);
			a.parent()
		},
		renderStatSearch: function(a) {
			var b = $(this.tpl).siblings("#statsearch-money");
			a = a.parentEl;
			a.attr("class", "sch-group j_formFieldSearchGroup");
			a.find(".j_formField-condition").html(b)
		},
		/* flg: 1  只获取主表中金额控件或数字控件或运算控件
		 * */
		getAllNumberField: function(flg) {
			var id = this.componentSetup.fieldId;
			var inDataTable = this.componentSetup.inDataTable;
			var a, b, e, f = $("div[tempId='" + this.componentSetup.tempId + "']").closest(".subtr_js");
			if(inDataTable=="false" || flg=="1"){
				//主表中金额控件
				a = $("#formContainer_js").find(".field_js[componentkey=NumberComponent]:not(.subtd_js>.field_js)"), 
				b = $("#formContainer_js").find(".field_js[componentkey=Money]:not(.subtd_js>.field_js)"), 
				e = $("#formContainer_js").find(".field_js[componentkey=Monitor]:not(.subtd_js>.field_js,[tempid='" + this.componentSetup.tempId + "'])"), 
				a = $.merge(a, b);
			}else{
				//子表中金额控件
				a = $("#"+this.componentSetup.fieldId).parents('.subform_js').find(".subtd_js>.field_js[componentkey=NumberComponent]"), 
				b = $("#"+this.componentSetup.fieldId).parents('.subform_js').find(".subtd_js>.field_js[componentkey=Money]"), 
				e = $("#"+this.componentSetup.fieldId).parents('.subform_js').find(".subtd_js>.field_js[componentkey=Monitor]"), 
				a = $.merge(a, b);
			}
			var g = "";
			if(flg){
				g += '<option value=""></option>';
			}
			$.each(a, function() {
				var a = $(this),
				b = a.attr("tempid"),
				a = a.find(".widget-title_js").text();
				if(b!=id){
					g += '<option value="' + b + '">' + a + "</option>"
				}
			});
			if(0 <= g.length && !flg){
				g += '<option value="常量">常量</option>';
			}
			return g
		},
		getFormula: function() {
			var that = this;
			var a = "",
				b = [];
			b.push(new setValue("(", "curves"));
			$(".j_choicelistEdit_number li").each(function() {
				var e = $(this);
				if (e.hasClass("j_monitor_item")) {
					var f = e.find("select"),
						h = f.find("option:selected").attr("type");
					if("常量" == f.val() || (false== that.componentSetup.calculate || 0 == that.componentSetup.calculate)){
						f = e.find("select").next().val();
						a += f ? f : "0 ";
						b.push(new setValue(f ? f : 0, "number"));
					}else{
						if(h && 0 < h.length){
							a += e.find(".js_signField").attr("title") + " ";
//							a += f.val() + " ";
							e = $("div[tempId='" + f.val() + "']").data("componentData").componentSetup.monitorFields;
							
						}else{
							a += e.find(".js_signField").attr("title") + " ";
//							a += f.val() + " ";
							b.push(new setValue(f.val(), "field"));
						}
					}
				} else if (
						f = e.find("input:checked").val()) a += f + " ", 
						b.push(new setValue(f, "operate")
						);
				else return !1;
				return !0
			});
			b.push(new setValue(")", "curves"));
			$("#operate_show").html(a);
			e = $("#widget-control .field-active").data("componentData");
			//计算公式待修改
			if(this.componentSetup.calculate){
				e.setCalculationFormula(a);
			}else{
				e.setCalculationFormula("");
			}
			e.setMoneyFieldArr(b);
			e.setMoneyFields(JSON.stringify(b));
			e.changeMoneyFields(b);
		},
		changeMoneyFields: function(a) {
			var b = this.moneys,
				e = this.componentSetup.tempId;
			if (b && 0 < b.length) for (var f = 0; f < b.length; f++) {
				var g = b[f];
				g.changeFields(e, a, g.componentSetup.moneyFieldArr);
				g.changeFields(e, a, g.componentSetup.moneyFields);
			}
		},
		changeFields: function(a, b, e) {
			for (var f = 0; f < e.length; f++) {
				var g = e[f];
				g.value == a ? g.moneyFieldArr = b : g.moneyFieldArr && 0 < g.moneyFieldArr.length && this.changeFields(a, b, g.moneyFieldArr)
			}
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
	return window.Money
});
