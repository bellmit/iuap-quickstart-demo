define("form/component/option", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.Option = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Option",
				name: "选项",
				order: 0,
				index: 0,
				selectionId: "",
				childOptions: [],
				defOption: !1,
				borderColor:"",
				other: !1
			};
			null != b && (this.componentSetup.name = b.name,this.componentSetup.borderColor = b.borderColor, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.selectionId = b.selectionId, this.componentSetup.defOption = b.defOption, this.componentSetup.other = b.other);
			this.tpl = l.get("option")
		},
		setName: function(b) {
			this.componentSetup.name = b
		},
		setOrder: function(b) {
			this.componentSetup.order = b
		},
		setOther: function(b) {
			this.componentSetup.other = b
		},
		setDefOption: function(b) {
			this.componentSetup.defOption = b
		},
		setSelectionId: function(b) {
			this.componentSetup.selectionId = b
		},
		setBorderColor: function(b) {
			this.componentSetup.borderColor = b
		},
		render: function(b, a) {
			var c = $(this.tpl).siblings("#form-option"),
				c = c.find("." + a.componentSetup.componentKey + "_js").clone();
			if ("Select" == a.componentSetup.componentKey) c.text(this.componentSetup.name), c.attr("value", this.componentSetup.selectionId), "true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || c.attr("selected", "true");
			else {
				c.find("input").attr("value", this.componentSetup.selectionId);
				"true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || c.find("input").attr("checked", "true");
				var d = a.componentSetup.fieldId,d = "" == d || null == d ? a.cid : d;
				c.find("input").attr("name", d);
				c.find("span").text(this.componentSetup.name);
				"true" != this.componentSetup.other && 1 != this.componentSetup.other || c.append('<input type="text" class="form-control form-w120 input-otherchoice" disabled="disabled">')
			}
			b.append(c)
		},
		renderEditor: function(b, a, c) {
			var d = $(this.tpl).siblings("#editor-option"),
				d = "true" == this.componentSetup.other || 1 == this.componentSetup.other ? d.find(".otherOption_js") : d.find("." + a.componentSetup.componentKey + "_js");
			var optionsVal = a.componentSetup.optionsType + a.componentSetup.options.length; //设置选项val值
			this.componentSetup.selectionId = optionsVal;
			d.find(".option_js").attr("value", this.componentSetup.selectionId);
			"true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || d.find(".option_js").attr("checked", "true");
			d.find(".optionName_js").attr("value", this.componentSetup.name);
			c ? d.insertAfter(c) : b.append(d)
		},
		change: function(b) {},
		renderPreview: function(b, a) {
			var c = $(this.tpl).siblings("#preview-option"),
				c = c.find("." + a.componentSetup.componentKey + "_js").clone();
			this.componentSetup.selectionId = this.componentSetup.selectionId ? this.componentSetup.selectionId : this.cid;
			if ("Select" == a.componentSetup.componentKey) c.text(this.componentSetup.name), c.attr("value", this.componentSetup.selectionId), "true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || c.attr("selected", "true"), c.data("componentData", this);
			else {
				c.find("input").attr("value", this.componentSetup.selectionId);
				"true" != this.componentSetup.defOption && 1 != this.componentSetup.defOption || c.find("input").attr("checked", "true");
				var d = a.componentSetup.fieldId,
					d = "" == d || null == d ? a.cid : d + a.cid;
				c.find("input").attr("name", d);
				c.find("input").attr("id", this.componentSetup.selectionId);
				c.find("span").text(this.componentSetup.name);
				c.find("input").data("componentData", this);
				"true" != this.componentSetup.other && 1 != this.componentSetup.other || c.append('<input type="text" placeholder="请填写其他内容" style="display: none;" class="form-control form-w120 input-otherchoice">')
			}
			b.append(c)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {}
	});
	return window.Option
});
