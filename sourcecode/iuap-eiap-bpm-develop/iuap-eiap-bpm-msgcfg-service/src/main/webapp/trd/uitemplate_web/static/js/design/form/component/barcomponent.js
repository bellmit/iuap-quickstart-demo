define("form/component/barcomponent", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.BarComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "BarComponent",
				title: "柱状图",
				titleLayout: "field-hoz",
				order: 0,
				index: 0,
				fieldId: l.getFieldId(),
				dataSetId: ""
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.fieldId = b.fieldId, this.componentSetup.dataSetId = b.dataSetId);
			this.tpl = l.get("bar")
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
		render: function(b) {
			var a = $(this.tpl).siblings("#form-bar");
			b.attr("class", a.attr("class"));
			b.attr("tempId",this.componentSetup.fieldId);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = this,
				a;
			b.statFields ? b.renderEditorValue() : this.componentmodel.getFormSelectFields(function(c) {
				a = $(_.template(b.tpl, c)).siblings("#editor-bar");
				b.statFields = c;
				null != c.statfields && 0 < c.statfields.length && (b.componentSetup.dataSetId = c.statfields[0].fieldId);
				b.el = a;
				b.renderEditorValue()
			})
		},
		renderEditorValue: function() {
			var b = this.el;
			b.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(b.html());
			var a = $("#component-dataset");
			$.each(this.statFields.statfields, function() {
				var b = a.find("option:first").clone().show();
				b.val(this.fieldId).text(this.title);
				a.append(b)
			});
			$("#editor-component").find("#component-dataset").val(this.componentSetup.dataSetId)
		},
		renderPreview: function(b, a, c) {
			var d = this;
			a = $(this.tpl).siblings("#preview-bar");
			b.append(a);
			this.viewcon = a;
			this.componentmodel.getFieldStat(this.componentSetup.dataSetId, function(a) {
				d.renderBarView(d, a.fieldChartStatData)
			})
		},
		renderBarView: function(b, a) {
			var c = [],
				d = [];
			b = this;
			for (var e, f = 0, g = a.length; f < g; f++)
			c.push(a[f].name), d.push(a[f].total);
			e = {
				title: {
					text: b.componentSetup.title,
					x: "center"
				},
				tooltip: {
					trigger: "axis"
				},
				legend: {
					data: ["次数"],
					x: "left"
				},
				toolbox: {
					show: !0,
					feature: {
						magicType: {
							show: !0,
							type: ["line", "bar"]
						},
						restore: {
							show: !0
						},
						saveAsImage: {
							show: !0
						}
					}
				},
				calculable: !0,
				xAxis: [{
					type: "category",
					data: c
				}],
				yAxis: [{
					type: "value"
				}],
				series: [{
					name: "总数",
					type: "bar",
					data: d,
					markPoint: {
						data: [{
							type: "max",
							name: "最大值"
						}, {
							type: "min",
							name: "最小值"
						}]
					},
					markLine: {
						data: [{
							type: "average",
							name: "平均值"
						}]
					}
				}]
			};
			h.async("https://static.eteams.cn/js/echarts.min.js", function() {
				var a = b.viewcon.find(".barview");
				this.barChart = echarts.init(a.get(0));
				this.barChart.setOption(e)
			})
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-bar");
			a.attr("id", this.componentSetup.fieldId);
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
	return window.BarComponent
});
