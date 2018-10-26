define("form/component/piecomponent", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.PieComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "PieComponent",
				title: "饼图",
				titleLayout: "",
				order: 0,
				index: 0,
				fieldId: l.getFieldId(),
				borderColor:"",
				dataSetId: ""
			};
			null != b && (this.componentSetup.title = b.title,this.componentSetup.borderColor = b.borderColor, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.fieldId = b.fieldId, this.componentSetup.dataSetId = b.dataSetId);
			this.tpl = l.get("pie")
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
		setBorderColor: function(b) {
			this.componentSetup.borderColor = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-pie");
			b.attr("class", a.attr("class"));
			b.attr("tempId",this.componentSetup.fieldId);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = this,
				a;
			b.statFields ? b.renderEditorValue() : this.componentmodel.getFormSelectFields(function(c) {
				a = $(_.template(b.tpl, c)).siblings("#editor-pie");
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
			a = $(this.tpl).siblings("#preview-pie");
			b.append(a);
			this.viewcon = a;
			this.componentmodel.getFieldStat(this.componentSetup.dataSetId, function(a) {
				d.renderpieView(d, a.fieldChartStatData)
			})
		},
		renderpieView: function(b, a) {
			var c = [],
				d = [];
			b = this;
			for (var e, f = 0, g = a.length; f < g; f++)
			c.push(a[f].name), d.push({
				value: a[f].total,
				name: a[f].name
			});
			e = {
				title: {
					text: b.componentSetup.title,
					x: "center"
				},
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: "vertical",
					x: "left",
					data: c
				},
				toolbox: {
					show: !0,
					feature: {
						magicType: {
							show: !1,
							type: ["pie"]
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
				series: [{
					name: "次数",
					type: "pie",
					radius: "55%",
					center: ["50%", "60%"],
					data: d
				}]
			};
			h.async("https://static.eteams.cn/js/echarts.min.js", function() {
				var a = b.viewcon.find(".pieview");
				this.pieChart = echarts.init(a.get(0));
				this.pieChart.setOption(e)
			})
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-pie");
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
	return window.PieComponent
});
