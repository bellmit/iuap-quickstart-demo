define("form/component/email", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.Email = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Email",
				title: "邮箱",
				titleLayout: "",
				itemListener: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				borderColor:"",
				size: "large",
				readOnly: !1,
				islist:true //是否列表显示
			};
			null != b && (this.componentSetup.title = b.title,this.componentSetup.itemListener = b.itemListener,this.componentSetup.borderColor = b.borderColor, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.fieldId = b.fieldId, this.componentSetup.size = b.size,this.componentSetup.islist = b.islist,this.componentSetup.readOnly = b.readOnly);
			this.tpl = l.get("email")
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
		setReadOnly: function(b) {
			this.componentSetup.readOnly = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-email");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.attr("tempId",this.componentSetup.fieldId);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-email");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("#component-listener").attr("value", this.componentSetup.itemListener);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly || b.find("#readOnly").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || b.find("#isList").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-email");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").addClass(this.componentSetup.size);
			d.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			a && d.find(".check_js").val("");
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			d.addClass(this.componentSetup.titleLayout);
			this.readOnly(d, c);
			this.el = b;
			b.append(d)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-email");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
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
			var a = $(this.tpl).siblings("#statsearch-email");
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
			"" == a || this.email(a) || (d.message = this.componentSetup.title + "格式有误，请输入有效的邮箱");
			return d
		},
		email: function(b) {
			return /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(b)
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
			return c && 0 < c.length || "" != a && a != b && this.email(a) ? d : null
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
	return window.Email
});