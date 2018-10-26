define("form/component/formLabel", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.Label = m.extend({
		initialize: function(options) {
			this.componentSetup = {
				componentKey: "FormLabel",
				borderColor:"",
				title: "简单文本"
			};
			if (options) {
				$.extend(this.componentSetup, options)
			};
			null != options && (this.componentSetup.title = options.title,this.componentSetup.borderColor = options.borderColor);
			this.tpl = l.get("label")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setBorderColor: function(b) {
			this.componentSetup.borderColor = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-label");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-label");
			b.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(b.html())
		},
		renderPreview: function(a, b, e) {
			b = $(this.tpl).siblings("#preview-label");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			a.append(b)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-label");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				a.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				a.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			a.data("componentData", this);
			b.append(a)
		}
	});
	return window.Label
});
