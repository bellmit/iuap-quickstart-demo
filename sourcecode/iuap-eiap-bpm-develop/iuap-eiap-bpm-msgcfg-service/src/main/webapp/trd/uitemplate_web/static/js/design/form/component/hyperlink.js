/**
 * 超链接组件
 */
define("form/component/hyperlink", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var components = require("form/tplutil");
	window.Hyperlink = m.extend({
		initialize: function(b) {
			this.componentSetup = {
					componentKey: "Hyperlink",
					title: "超链接",
					titleLayout: "",//控件设置属性--标题布局
					order: 0,
					index: 0,
					describe: "",            //控件设置属性--描述
					required: !1,            //控件设置属性--必填
					fieldId: components.getFieldId(),             //组件id
					borderColor:"",
					islist:true,//是否列表显示
					size: "large"           //控件设置属性--控件大小
					
			};
			null != b && (this.componentSetup.title = b.title, 
					this.componentSetup.titleLayout = b.titleLayout, 
					this.componentSetup.describe = b.describe, 
					this.componentSetup.order = b.order, 
					this.componentSetup.index = b.index, 
					this.componentSetup.required = b.required, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.islist = b.islist,
					this.componentSetup.borderColor = b.borderColor,
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
			var hyperlink = $(this.tpl).siblings("#form-hyperlink");
			hyperlink.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || hyperlink.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (hyperlink.find(".field-description").text(this.componentSetup.describe), hyperlink.find(".field-description").show());
			hyperlink.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", hyperlink.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.attr("tempId",components.getFieldId());
			b.html(hyperlink.html())
		},
		renderEditor: function() {
			var editorHyperlink = $(this.tpl).siblings("#editor-hyperlink");
			editorHyperlink.find("#component-title").attr("value", this.componentSetup.title);
			editorHyperlink.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", "true");
			editorHyperlink.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || editorHyperlink.find("#required").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || editorHyperlink.find("#isList").attr("checked", "true");
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
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				formHyperlink.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				formHyperlink.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
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
	return window.Hyperlink
});