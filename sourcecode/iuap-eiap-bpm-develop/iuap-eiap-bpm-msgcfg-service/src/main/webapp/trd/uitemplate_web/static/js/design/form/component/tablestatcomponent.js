define("form/component/tablestatcomponent", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = "#5CBAE3 #E5CF0D #B6A2DE #8D98B3 #95706D #E4B600 #89B600 #D87A80".split(" "),
		a = {
			etitle: "标题",
			eoptions: [{
				content: "选项一",
				percentage: "50.00%",
				bgcolor: b[0],
				votes: "50"
			}, {
				content: "选项二",
				percentage: "25.00%",
				bgcolor: b[1],
				votes: "25"
			}, {
				content: "选项三",
				percentage: "10.00%",
				bgcolor: b[2],
				votes: "10"
			}, {
				content: "选项四",
				percentage: "5.00%",
				bgcolor: b[3],
				votes: "5"
			}, {
				content: "选项五",
				percentage: "2.00%",
				bgcolor: b[4],
				votes: "2"
			}, {
				content: "选项六",
				percentage: "8.00%",
				bgcolor: b[5],
				votes: "8"
			}],
			etotalvotes: 100,
			statfields: []
		};
	window.TableStatComponent = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "TableStatComponent",
				title: "统计",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				fieldId: "",
				borderColor:"",
				dataSetId: ""
			};
			null != a && (this.componentSetup.title = a.title,this.componentSetup.borderColor = a.borderColor, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.fieldId = a.fieldId, this.componentSetup.dataSetId = a.dataSetId);
			this.tpl = l.get("tablestat")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setDataSetId: function(a) {
			this.componentSetup.dataSetId = a
		},
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		render: function(c) {
			a.etitle = this.componentSetup.title;
			var b = $(_.template(this.tpl, a)).siblings("#form-tablestat");
			c.attr("class", b.attr("class"));
			c.html(b.html());
			this.rendertabel(a, c)
		},
		rendertabel: function(a, b) {
			var e = b.find("tbody");
			$.each(a.eoptions, function() {
				var a = e.find("tr:first").clone().show();
				a.find(".j_content").text(this.content);
				a.find(".j_prograssbar").css({
					width: this.percentage,
					"background-color": this.bgcolor
				}).find(".j_percentage").text(this.percentage);
				a.find(".j_votes").text(this.votes);
				e.find("tr:last").before(a)
			})
		},
		renderEditor: function() {
			var c = this,
				b;
			c.statFields ? c.renderEditorValue() : this.componentmodel.getFormSelectFields(function(e) {
				e.etitle = a.etitle;
				e.eoptions = a.eoptions;
				e.etotalvotes = a.etotalvotes;
				b = $(_.template(c.tpl, e)).siblings("#editor-tablestat");
				c.statFields = e;
				null != e.statfields && 0 < e.statfields.length && (c.componentSetup.dataSetId = e.statfields[0].fieldId);
				c.el = b;
				c.renderEditorValue()
			})
		},
		renderEditorValue: function() {
			var a = this.el;
			a.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(a.html());
			var b = $("#component-dataset");
			$.each(this.statFields.statfields, function() {
				var a = b.find("option:first").clone().show();
				a.val(this.fieldId).text(this.title);
				b.append(a)
			});
			$("#editor-component").find("#component-dataset").val(this.componentSetup.dataSetId)
		},
		renderPreview: function(a, b, e) {
			var f, g = this,
				k, p = $("<div></div>");
			a.append(p);
			g.componentmodel.getFieldStat(this.componentSetup.dataSetId, function(a) {
				a = g.processData(a);
				f = $(_.template(g.tpl, a));
				k = f.siblings("#preview-tablestat");
				p.replaceWith(k);
				g.viewcon = k;
				g.rendertabel(a, k)
			})
		},
		processData: function(a) {
			for (var d = a.fieldChartStatData, e = 0, f = 0, g = d.length; f < g; f++)
			e += d[f].total;
			a.etotalvotes = e;
			f = 0;
			for (g = d.length; f < g; f++)
			d[f].percentage = (100 * d[f].total / e).toFixed(2) + "%", d[f].bgcolor = b[f % b.length], d[f].content = d[f].name, d[f].votes = d[f].total;
			a.eoptions = a.fieldChartStatData;
			a.etitle = this.componentSetup.title;
			a.statfields = [];
			return a
		},
		renderEditPreview: function(c) {
			a.etitle = this.componentSetup.title;
			var b = $(_.template(this.tpl, a)).siblings("#form-tablestat");
			b.attr("id", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				b.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				b.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			b.data("componentData", this);
			b.addClass(this.componentSetup.titleLayout);
			c.append(b);
			this.rendertabel(a, b)
		},
		renderStatSearch: function(a) {},
		submitCheck: function(a, b) {},
		checkEvents: function(a) {},
		check: function(a) {},
		getValue: function(a) {},
		setValue: function(a, b) {},
		empty: function(a) {},
		readOnly: function(a, b) {}
	});
	return window.TableStatComponent
});
