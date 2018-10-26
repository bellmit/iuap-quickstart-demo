/**
 * 密码组件
 */
define("form/component/password", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.Password = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "Password",
				title: "密码",
				titleLayout: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				borderColor:"",
				fieldId: l.getFieldId(),
				size: "large"
			};
			null != a && (this.componentSetup.title = a.title,
					this.componentSetup.titleLayout = a.titleLayout, 
					this.componentSetup.describe = a.describe, 
					this.componentSetup.order = a.order, 
					this.componentSetup.index = a.index, 
					this.componentSetup.required = a.required,
					this.componentSetup.fieldId = a.fieldId, 
					this.componentSetup.size = a.size, 
					this.componentSetup.type = a.type, 
					this.componentSetup.borderColor = a.borderColor,
					this.componentSetup.tempId = a.tempId || a.fieldId);
			this.componentSetup = $.extend({}, this.componentSetup, a);
			this.tpl = l.get("password");
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
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setType: function(a) {
			this.componentSetup.type = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		render: function(a) {
			var b = this,
				formPassword = $(this.tpl).siblings("#form-password");
			formPassword.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || formPassword.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (formPassword.find(".field-description").text(this.componentSetup.describe), formPassword.find(".field-description").show());
			formPassword.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("class", formPassword.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.attr("tempId",this.componentSetup.fieldId);
			a.html(formPassword.html())
		},
		renderEditor: function() {
			var editPassword = $(this.tpl).siblings("#editor-password");
			editPassword.find("#component-title").attr("value", this.componentSetup.title);
			editPassword.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			editPassword.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || editPassword.find("#required").attr("checked", "true");
			editPassword.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(editPassword.html())
		},
		renderPreview: function(a, b, d) {
			var previewPassword = $(this.tpl).siblings("#preview-password");
			previewPassword.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || previewPassword.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (previewPassword.find(".field-description").text(this.componentSetup.describe), previewPassword.find(".field-description").show());
			previewPassword.find(".check_js").addClass(this.componentSetup.size);
			previewPassword.find(".check_js").attr("id", this.componentSetup.fieldId || this.componentSetup.tempId).attr("name", this.componentSetup.fieldId);
			previewPassword.find(".check_js").attr("cid", this.cid);
			previewPassword.attr("id", "field_" + (this.componentSetup.fieldId || this.componentSetup.tempId));
			previewPassword.attr("tempId", "field_" + this.componentSetup.fieldId);
			previewPassword.attr("fieldid", this.componentSetup.fieldId || this.componentSetup.tempId);
			previewPassword.find(".check_js").data("componentData", this);
			previewPassword.data("componentData", this);
			b && previewPassword.find(".check_js").val("");
			previewPassword.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			previewPassword.addClass(this.componentSetup.titleLayout);
			this.readOnly(previewPassword, d);
			this.el = a;
			a.append(previewPassword)
		},
		renderEditPreview: function(a) {
			var b = $(this.tpl).siblings("#form-password");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.find(".form-control").addClass(this.componentSetup.size);
			b.find(".form-amountbox .money_type_js").text("(" + this.componentSetup.type + ")");
			b.attr("id", this.componentSetup.fieldId);
			b.attr("tempId", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				b.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				b.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			a.append(b)
		},
		submitCheck: function(a, b) {
			var d = this.check(a);
			b(d)
		},
		checkEvents: function(b) {
			
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
		empty: function(a) {
			a.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(a, b) {
			var d = a.find("input[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", b);
			b ? (d.hide(), d.siblings(".j_readOnly").removeClass("hide")) : (d.show(), d.siblings(".j_readOnly").addClass("hide"))
		}
	});
	return window.Password
});