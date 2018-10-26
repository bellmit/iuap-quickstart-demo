/**
 * 百分比组件
 */
define("form/component/precent", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.Precent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Precent",
				title: "百分比",
				titleLayout: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				size: "large",
				borderColor:"",
				type:"%",
				islist:true //是否列表显示
			};
			null != b && (this.componentSetup.title = b.title, 
					this.componentSetup.titleLayout = b.titleLayout,
					this.componentSetup.describe = b.describe, 
					this.componentSetup.order = b.order, 
					this.componentSetup.index = b.index, 
					this.componentSetup.required = b.required, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.borderColor = b.borderColor,
					this.componentSetup.type = b.type,
					this.componentSetup.islist = b.islist);
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
		setIsList: function(b) {
			this.componentSetup.islist = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		setBorderColor: function(b) {
			this.componentSetup.borderColor = b
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
			b.attr("tempId",this.componentSetup.fieldId);
			b.html(formPrecent.html())
		},
		/** 渲染右侧属性**/
		renderEditor: function() {
			var editorPrecent = $(this.tpl).siblings("#editor-precent");
			editorPrecent.find("#component-title").attr("value", this.componentSetup.title);
			editorPrecent.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			editorPrecent.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || editorPrecent.find("#required").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || editorPrecent.find("#isList").attr("checked", "true");
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
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				a.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				a.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
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
	return window.Precent
});
