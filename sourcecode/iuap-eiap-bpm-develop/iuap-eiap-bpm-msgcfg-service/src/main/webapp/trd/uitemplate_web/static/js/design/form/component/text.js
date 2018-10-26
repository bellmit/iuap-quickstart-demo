define("form/component/text", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.Text = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Text",
				title: "文本输入框",
				titleLayout: "",
				itemListener: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				readOnly: !1,
				isIdentity: !1,
				fieldId: l.getFieldId(),
				size: "large",
				borderColor:"",
				width: "",
				height: "",
				islist:true, //是否列表显示
				formula:"" //显示公式
			};
			null != b && 
			(this.componentSetup.title = b.title, 
					this.componentSetup.titleLayout = b.titleLayout,
					this.componentSetup.itemListener = b.itemListener,
					this.componentSetup.describe = b.describe, 
					this.componentSetup.order = b.order, 
					this.componentSetup.index = b.index, 
					this.componentSetup.required = b.required, 
					this.componentSetup.readOnly = b.readOnly, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.size = b.size,
					this.componentSetup.borderColor = b.borderColor,
					this.componentSetup.width = b.width,
					this.componentSetup.height = b.height,
					this.componentSetup.islist = b.islist,
					this.componentSetup.formula = b.formula,
					this.componentSetup.isIdentity = b.isIdentity
			);
			this.tpl = l.get("text")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setItemListener: function(b) {
			this.componentSetup.itemListener = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setReadOnly: function(b) {
			this.componentSetup.readOnly = b
		},
		setIsList: function(b) {
			this.componentSetup.islist = b
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
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		setFormula: function(a) {
			this.componentSetup.formula = a
		},
		setIsIdentity: function(a) {
			this.componentSetup.isIdentity = a
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-text");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"true" != this.componentSetup.isIdentity && 1 != this.componentSetup.isIdentity;
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			if(this.componentSetup.size == "user-defined"){
				 a.find(".form-control").css("width",this.componentSetup.width);
			     a.find(".form-control").css("height",this.componentSetup.height);
			}else{
				a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			}
			if(this.componentSetup.fieldId == undefined || ""===this.componentSetup.fieldId){
				var timeStamp = new Date().getTime().toString();
				this.componentSetup.fieldId = timeStamp;
			}
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.attr("tempId",this.componentSetup.fieldId);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-text");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("#component-listener").attr("value", this.componentSetup.itemListener);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly || b.find("#readOnly").attr("checked", "true");
			"true" != this.componentSetup.isIdentity && 1 != this.componentSetup.isIdentity || b.find("#isidentity").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || b.find("#isList").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			this.componentSetup.size == "user-defined" && (b.find("div[name='user-defined-div']").show(),	b.find("input[id='user-defined-width']").attr("value",this.componentSetup.width),b.find("input[id='user-defined-height']").attr("value",this.componentSetup.height));
			b.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			//显示公式
			this.componentSetup.formula && b.find("input[name='isFormula']").attr("checked", "true") && b.find("input[name='formula-content']").removeClass("hide");
			$("#editor-component").html(b.html());
			$("#editor-component").find("input[name='formula-content']").val(this.componentSetup.formula);
		},
		change: function(b) {
			var a = b.oldObj;
			b = b.changeEl;
			this.componentSetup.title = a.componentSetup.title;
			this.componentSetup.describe = a.componentSetup.describe;
			this.componentSetup.required = a.componentSetup.required;
			this.componentSetup.fieldId = a.componentSetup.fieldId;
			this.componentSetup.islist = a.componentSetup.islist;
			this.componentSetup.size = a.componentSetup.size;
			this.componentSetup.width = a.componentSetup.width;
			this.componentSetup.heigth = a.componentSetup.heigth;
			this.componentSetup.borderColor = a.componentSetup.borderColor;
			//增加属性
			this.componentSetup.isDisplay = a.componentSetup.isDisplay;
			this.componentSetup.isLabelDisplay = a.componentSetup.isLabelDisplay;
			this.componentSetup.formula = a.componentSetup.formula;
			this.componentSetup.itemCode = a.componentSetup.itemCode;
			this.componentSetup.itemId = a.componentSetup.itemId;
			this.componentSetup.itemKey = a.componentSetup.itemKey;
			this.componentSetup.index = a.componentSetup.index;
			this.componentSetup.titleLayout = a.componentSetup.titleLayout;
			this.componentSetup.isbusinessObj = a.componentSetup.isbusinessObj;
			this.componentSetup.readOnly = a.componentSetup.readOnly;
			this.componentSetup.isIdentity = a.componentSetup.isIdentity;
			this.componentSetup.itemListener = a.componentSetup.itemListener;
			this.render(b);
			b.addClass("field-active")
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-text");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"true" != this.componentSetup.isIdentity && 1 != this.componentSetup.isIdentity;
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
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"true" != this.componentSetup.isIdentity && 1 != this.componentSetup.isIdentity;
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			if(this.componentSetup.size == "user-defined"){
		        a.find(".form-control").css("width",this.componentSetup.width);
		        a.find(".form-control").css("height",this.componentSetup.height);
			}else{
				a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			}
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				//a.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				a.find(".form-control").css("border-color",this.componentSetup.borderColor);
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
	return window.Text
});
