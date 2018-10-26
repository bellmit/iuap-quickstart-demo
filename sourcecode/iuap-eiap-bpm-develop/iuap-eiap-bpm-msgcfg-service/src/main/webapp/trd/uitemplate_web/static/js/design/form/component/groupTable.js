define("form/component/groupTable", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.GroupTable = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "GroupTable",
				title: "分组布局",
				layoutDetail: [],
				order: 0,
				index: 0,
				size: "1",
				tableId: l.getFieldId(),
				required:false
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.layoutDetail = b.layoutDetail, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.size = b.size,this.componentSetup.groupTableId = b.groupTableId);
			this.tpl = l.get("groupTable")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setTableId: function(b) {
			this.componentSetup.tableId = b
		},
		render: function(b) {
			var a = $(this.tpl);
			a = a.siblings("#form-groupTable");
			b.attr("class", a.attr("class"));
			b.attr("id", this.componentSetup.tableId);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-groupTable");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("#component-groupTableId").attr("value", this.componentSetup.tableId);
			b.find("#component-describe").text(this.componentSetup.describe);
			$("#editor-component").html(b.html())
		},
		renderPreview: function(b) {
			if (1 < this.componentSetup.size) {
				var a = $(this.tpl).siblings("#preview-columnpanel-" + this.componentSetup.size);
				a.attr("id", "");
				b.append(a);
				return a.find(".columns_js").children()
			}
		},
		renderEditPreview: function(b) {
			if (1 <= this.componentSetup.size) {
				var a = $(this.tpl).siblings("#form-groupTable");
				a.attr("id", "");
				a.find(".groupTitle .widget-title_js").text(this.componentSetup.title);
				a.data("componentData", this);
				b.append(a);
				return a.find(".columns_js").children()
			}
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {}
	});
	return window.GroupTable
});
