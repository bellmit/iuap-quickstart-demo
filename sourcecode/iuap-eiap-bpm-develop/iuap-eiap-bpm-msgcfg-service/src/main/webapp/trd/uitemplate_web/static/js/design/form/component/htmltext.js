define("form/component/htmltext", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.HtmlText = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "TextArea",
				title: "Html片段",
				titleLayout: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				borderColor:"",
				size: "large"
			};
			null != b && (this.componentSetup.title = b.title,this.componentSetup.borderColor = b.borderColor, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.fieldId = b.fieldId, this.componentSetup.size = b.size);
			this.tpl = l.get("htmltext")
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
			var a = $(this.tpl).siblings("#form-htmltext");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.attr("tempId",this.componentSetup.fieldId);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-htmltext");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", "true");
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			b.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		change: function(b) {
			var a = b.oldObj;
			b = b.changeEl;
			this.componentSetup.title = a.componentSetup.title;
			this.componentSetup.describe = a.componentSetup.describe;
			this.componentSetup.required = a.componentSetup.required;
			this.componentSetup.fieldId = a.componentSetup.fieldId;
			this.componentSetup.size = a.componentSetup.size;
			this.componentSetup.borderColor = a.componentSetup.borderColor;
			this.render(b);
			b.addClass("field-active")
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl).siblings("#preview-htmltext");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").addClass(this.componentSetup.size);
			d.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			a && d.find(".check_js").val("");
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			"mobile" != window.systemInfo_form && d.find(".form-control").autosize();
			d.addClass(this.componentSetup.titleLayout);
			this.readOnly(d, c);
			this.el = b;
			b.append(d)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-htmltext");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("id", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				a.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				a.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			c.on("blur", "textarea[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "textarea[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
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
					dataText: {
						content: a
					}
				};
			this.oldValue = a;
			return c && 0 < c.length ? d : "" == a || a == b ? null : d
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content;
				null != a.dataText && (c = a.dataText.content);
				b.find("#" + this.componentSetup.fieldId).val(c);
				var d = c.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
				b.find(".j_readOnly").html(d);
				"mobile" != window.systemInfo_form && (b.find("#" + this.componentSetup.fieldId).trigger("autosize.resize"), $(window).resize());
				this.oldValue = c
			}
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("textarea[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		}
	});
	return window.HtmlText
});
