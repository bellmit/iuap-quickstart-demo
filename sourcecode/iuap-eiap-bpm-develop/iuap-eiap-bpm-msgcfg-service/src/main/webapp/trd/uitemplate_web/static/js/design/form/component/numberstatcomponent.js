define("form/component/numberstatcomponent", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.NumberStatComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "NumberStatComponent",
				title: "标题",
				titleLayout: "",
				order: 0,
				index: 0,
				fieldId: l.getFieldId(),
				dataSetId: "",
				borderColor:"",
				stattype: "sum"
			};
			null != b && (this.componentSetup.title = b.title,this.componentSetup.borderColor = b.borderColor, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.fieldId = b.fieldId, this.componentSetup.dataSetId = b.dataSetId, this.componentSetup.stattype = b.stattype);
			this.tpl = l.get("numberstat")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		setDataSetId: function(b) {
			this.componentSetup.dataSetId = b
		},
		setStatType: function(b) {
			this.componentSetup.stattype = b
		},
		setBorderColor: function(b) {
			this.componentSetup.borderColor = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-numberstat");
			b.attr("class", a.attr("class"));
			b.attr("tempId",this.componentSetup.fieldId);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = this,
				a;
			b.statFields ? b.renderEditorValue() : this.componentmodel.getFormNumberSelectFields(function(c) {
				a = $(_.template(b.tpl, c)).siblings("#editor-numberstat");
				b.statFields = c;
				null != c.numberStatfields && 0 < c.numberStatfields.length && (b.componentSetup.dataSetId = c.numberStatfields[0].fieldId);
				b.el = a;
				b.renderEditorValue()
			})
		},
		renderEditorValue: function() {
			var b = this.el;
			b.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(b.html());
			var a = $("#component-dataset");
			$.each(this.statFields.numberStatfields, function() {
				var b = a.find("option:first").clone().show();
				b.val(this.fieldId).text(this.title);
				a.append(b)
			});
			$("#editor-component").find("#component-dataset").val(this.componentSetup.dataSetId);
			$("#editor-component").find("#component-stattype").val(this.componentSetup.stattype)
		},
		renderPreview: function(b, a, c) {
			var d = this;
			a = $(this.tpl).siblings("#preview-numberstat");
			b.append(a);
			this.viewcon = a;
			this.componentSetup.dataSetId ? (this.viewcon.find(".widget-title_js").html(this.componentSetup.title), this.componentmodel.getNumberFieldStatData(this, function(a) {
				d.viewcon.find(".statdata").html(a.numberData || 0)
			})) : (this.viewcon.find(".widget-title_js").html(this.componentSetup.title), this.viewcon.find(".statdata").html("无数字字段"))
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-numberstat");
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
			var a = $(this.tpl).siblings("#statsearch-text");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {},
		check: function(b) {},
		getValue: function(b) {},
		setValue: function(b, a) {},
		empty: function(b) {},
		readOnly: function(b, a) {}
	});
	return window.NumberStatComponent
});
