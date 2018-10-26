define("form/component/paragraph", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.Paragraph = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Paragraph",
				content: "空白的段落",
				style: "alert-success",
				borderColor:"",
				order: 0,
				index: 0
			};
			null != b && (this.componentSetup.content = b.content,this.componentSetup.borderColor = b.borderColor, this.componentSetup.style = b.style, this.componentSetup.order = b.order, this.componentSetup.index = b.index);
			this.tpl = l.get("paragraph")
		},
		setContent: function(b) {
			b=b.replace(new RegExp("\n","gm"),"");
			this.componentSetup.content = b
		},
		setStyle: function(b) {
			this.componentSetup.style = b
		},
		setBorderColor: function(b) {
			this.componentSetup.borderColor = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-paragraph");
			b.attr("class", a.attr("class"));
			a.find(".paragraph").html(this.componentSetup.content);
			var c = a.find(".paragraph").attr("class") + " " + this.componentSetup.style;
			a.find(".paragraph").attr("class", c);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-paragraph");
			b.find("input:radio[name='paragraphType'][value='" + this.componentSetup.style + "']").attr("checked", !0);
			$("#editor-component").html(b.html());
			$(document).trigger("renderCkEditor")
		},
		renderPreview: function(b) {
			var a = $(this.tpl).siblings("#preview-paragraph");
			a.find(".paragraph").html(this.componentSetup.content);
			var c = a.find(".paragraph").attr("class") + " " + this.componentSetup.style;
			a.find(".paragraph").attr("class", c);
			b.append(a)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-paragraph");
			a.find(".paragraph").html(this.componentSetup.content);
			var c = a.find(".paragraph").attr("class") + " " + this.componentSetup.style;
			a.find(".paragraph").attr("class", c);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				a.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				a.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			a.data("componentData", this);
			b.append(a)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {}
	});
	return window.Paragraph
});
