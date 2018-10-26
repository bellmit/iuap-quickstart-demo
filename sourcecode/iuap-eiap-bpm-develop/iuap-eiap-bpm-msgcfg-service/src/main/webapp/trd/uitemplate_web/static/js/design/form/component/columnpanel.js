define("form/component/columnpanel", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.ColumnPanel = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "ColumnPanel",
				title: "",
				layoutDetail: [],
				order: 0,
				index: 0,
				size: "1",
				required:false,
				columnkind:""//针对一行一列
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.layoutDetail = b.layoutDetail, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.size = b.size,this.componentSetup.columnkind = b.columnkind);
			this.tpl = l.get("columnpanel")
		},
		render: function(b) {
			var a = $(this.tpl);
			this.componentSetup.size = b.attr("componentsize");
			if(this.componentSetup.size==1){
				this.componentSetup.columnkind="one-columns";
			}
			a = a.siblings("#form-columnpanel-" + this.componentSetup.size);
			b.attr("class", a.attr("class"));
			b.html(a.html())
		},
		renderEditor: function() {},
		renderPreview: function(b) {
			if (1 < this.componentSetup.size) {
				var a = $(this.tpl).siblings("#preview-columnpanel-" + this.componentSetup.size);
				a.attr("id", "");
				b.append(a);
				return a.find(".columns_js").children()
			}
		},
		renderEditPreview: function(b) {
			if (1 < this.componentSetup.size || (this.componentSetup.columnkind!="" && typeof this.componentSetup.columnkind!="undefined")) {
				var a = $(this.tpl).siblings("#form-columnpanel-" + this.componentSetup.size);
				a.attr("id", "");
				a.data("componentData", this);
				b.append(a);
				return a.find(".columns_js").children()
			}
		},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {}
	});
	return window.ColumnPanel
});
