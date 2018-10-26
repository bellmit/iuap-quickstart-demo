define("form/component/numbercomponent", ["form/component", "form/tplutil", "form/componentmodel"], function() {
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = require("form/componentmodel");
	function setValue(a, b) {
		this.value = a;
		this.type = b;
	}
	window.NumberComponent = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "NumberComponent",
				title: "数值",
				titleLayout: "field-vertical",
				itemListener: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				size: "large",
				decimalPlace: 0,  //小数位数 默认为0
				calculate: !1,    //计算  默认不勾选
				isEdit:!0,         //默认可编辑  勾选计算后此控件不可编辑
				isTotal: !1,      //是否合计  默认不勾选
				mainTableField: "",//主表字段 默认为空
				calculationFormula:"",//计算公式 默认为空
				borderColor:"",//边框颜色
				inDataTable:"",//是否在明细子表中
				numberFields: [],
				numberFieldArr: [],
				tempId: 0,
				islist:true //是否列表显示
			};
			null != a && (
					this.componentSetup.title = a.title, 
					this.componentSetup.titleLayout = a.titleLayout,
					this.componentSetup.itemListener = a.itemListener,
					this.componentSetup.describe = a.describe, 
					this.componentSetup.order = a.order, 
					this.componentSetup.index = a.index, 
					this.componentSetup.required = a.required, 
					this.componentSetup.fieldId = a.fieldId, 
					this.componentSetup.calculate = a.calculate, 
					this.componentSetup.isEdit = a.isEdit, 
					this.componentSetup.isTotal = a.isTotal, 
					this.componentSetup.mainTableField = a.mainTableField, 
					this.componentSetup.borderColor = a.borderColor, 
					this.componentSetup.inDataTable = a.inDataTable, 
					this.componentSetup.numberFieldArr = a.numberFieldArr,
					this.componentSetup.numberFields = a.numberFields, 
					this.componentSetup.decimalPlace = a.decimalPlace, 
					this.componentSetup.calculationFormula = a.calculationFormula, 
					this.componentSetup.size = a.size, 
					this.componentSetup.islist = a.islist,
					this.componentSetup.tempId = a.tempId || a.fieldId);
			this.tpl = l.get("numbercomponent");
			this.componentModel = new b;
			this.count = this.componentSetup.numberFieldArr ? Math.floor(this.componentSetup.numberFieldArr.length / 2) + 1 : 0;

		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setDecimalPlace: function(a) {
			this.componentSetup.decimalPlace = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setItemListener: function(a) {
			this.componentSetup.itemListener = a
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
		setBorderColor:function(a){
			this.componentSetup.borderColor = a
		},
		setCalculate: function(a) {
			this.componentSetup.calculate = a
		},
		setCalculationFormula: function(a) {
			this.componentSetup.calculationFormula = a
		},
		setMainTableField: function(a) {
			this.componentSetup.mainTableField = a
		},
		setNumberFields: function(a) {
			this.componentSetup.numberFields = a
		},
		setNumberFieldArr: function(a) {
			this.componentSetup.numberFieldArr = a
		},
		setIsEdit: function(a) {
			this.componentSetup.isEdit = a
		},
		setIsTotal: function(a) {
			this.componentSetup.isTotal = a
		},
		/* 首次拖动 */
		render: function(a) {
			var c = this,
				b = $(this.tpl).siblings("#form-number");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("class", b.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
//			this.componentModel.generatorId(function(b) {
//				b = b.generatorId;
//				c.componentSetup.tempId = b;
//				a.attr("tempId", b)
//			});
//			var timeStamp = new Date().getTime().toString();
//			c.componentSetup.tempId = timeStamp;
//			c.componentSetup.fieldId = timeStamp;
			a.attr("tempId", this.componentSetup.fieldId);
			a.html(b.html());
			if((typeof a.parent()[0] !="undefined" && a.parent()[0].className.indexOf("subtd_js")<0) || $("#widget-control").find("li a:first > span:last[nodepk='"+a.attr("nodepk")+"']").length>0){
				//主表
				this.componentSetup.inDataTable = "false";
			}
		},
		renderEditor: function() {
			//获取计算属性中下拉框显示值
			var b = this,
			    a = $(this.tpl).siblings("#editor-number");
			var k = this.getAllNumberField(),
			h = "",
			//主表字段下拉框显示值
			f = this.getAllNumberField("1"),
			e = this.componentSetup.numberFieldArr;
			a.find("#mainTableFields").html(f);
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("#component-listener").attr("value", this.componentSetup.itemListener);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || a.find("#isList").attr("checked", "true");
			a.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			//合计
			"true" != this.componentSetup.isTotal && 1 != this.componentSetup.isTotal || a.find("#isTotalBtn").attr("checked", "true");
			//勾选合计则显示主表字段
			if(this.componentSetup.inDataTable == "false"){
				a.find("#isTotalBtn").parent().parent().parent().addClass("hide");
			}else{
				a.find("#isTotalBtn").parent().parent().parent().removeClass("hide");
			}
			//主表字段
			a.find("select[id='mainTableFields'] option[value='" + this.componentSetup.mainTableField + "']").attr("selected", "selected");
			
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
			if(!this.componentSetup.decimalPlace && this.componentSetup.decimalPlace!=0){
				this.componentSetup.decimalPlace = 0;
			}
			a.find("#decimalPlace").text(this.componentSetup.decimalPlace);
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
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				//c.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				c.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
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
			e.setNumberFieldArr(b);
			e.setNumberFields(JSON.stringify(b));
			e.changeNumberFields(b);
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
		changeNumberFields: function(a) {
			var b = this.numbers,
				e = this.componentSetup.tempId;
			if (b && 0 < b.length) for (var f = 0; f < b.length; f++) {
				var g = b[f];
				g.changeFields(e, a, g.componentSetup.numberFieldArr);
				g.changeFields(e, a, g.componentSetup.numberFields);
			}
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
	return window.NumberComponent
});
