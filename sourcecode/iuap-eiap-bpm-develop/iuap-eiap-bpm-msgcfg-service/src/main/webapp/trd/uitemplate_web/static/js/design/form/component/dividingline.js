define("form/component/dividingline", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.DividingLine = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "DividingLine",
				type: "solid",
				color: "#000000",
				order: 0,
				index: 0
			};
			null != b && (this.componentSetup.type = b.type, this.componentSetup.color = b.color, this.componentSetup.order = b.order, this.componentSetup.index = b.index);
			this.tpl = l.get("dividingline")
		},
		setType: function(b) {
			this.componentSetup.type = b
		},
		setColor: function(b) {
			this.componentSetup.color = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-dividingline");
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-dividingline"),
				a = this.componentSetup.type;
			"soliddouble" == a ? a = "solid-double" : "thicksoliddouble" == a && (a = "thicksolid-double");
			b.find("input:radio[name='dividingLineType'][value='" + a + "']").attr("checked", "true");
			$("#editor-component").html(b.html());
			$("#editor-component").find(".color-box").colpick({
				flat: !0,
				layout: "hex",
				color: this.componentSetup.color,
				submit: 0,
				onChange: function(a, b, e, f) {
					$("#widget-control .field-active .divider-line").css("border-color", "#" + b);
					$("#widget-control .field-active").data("componentData").setColor("#" + b)
				}
			})
		},
		renderPreview: function(b) {
			var a = $(this.tpl).siblings("#preview-dividingline");
			a.find(".divider-line").css("border-color", this.componentSetup.color);
			a.find(".divider-line").attr("class", "divider-line " + this.componentSetup.type);
			b.append(a)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-dividingline");
			a.find(".divider-line").css("border-color", this.componentSetup.color);
			var c = this.componentSetup.type;
			"soliddouble" == c ? c = "solid-double" : "thicksoliddouble" == c && (c = "thicksolid-double");
			a.find(".divider-line").attr("class", "divider-line " + c);
			a.data("componentData", this);
			b.append(a)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {}
	});
	return window.DividingLine
});
