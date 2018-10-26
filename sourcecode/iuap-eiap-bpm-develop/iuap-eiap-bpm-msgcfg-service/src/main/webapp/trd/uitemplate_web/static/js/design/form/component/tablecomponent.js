define("form/component/tablecomponent", ["form/component", "form/tplutil", "bootstrap-paginator"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	// require("plugins/bootstrap-paginator");
	window.TableComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "TableComponent",
				title: "表格",
				titleLayout: "",
				order: 0,
				index: 0,
				fieldId: l.getFieldId(),
				borderColor:"",
				dataSetIds: {}
			};
			null != b && (this.componentSetup.title = b.title,this.componentSetup.borderColor = b.borderColor, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.fieldId = b.fieldId, _.isObject(b.dataSetIds) ? this.componentSetup.dataSetIds = b.dataSetIds : this.componentSetup.dataSetIds = JSON.parse(b.dataSetIds));
			this.tpl = l.get("table");
			this.isAdmin = TEAMS.currentUser.admin
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
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		addDataSet: function(b, a) {
			var c = _.keys(this.componentSetup.dataSetIds),
				d = {};
			_.contains(c, b) || (d.id = b, d.title = a, this.componentSetup.dataSetIds[b] = d)
		},
		removeDataSet: function(b) {
			var a = _.keys(this.componentSetup.dataSetIds);
			_.contains(a, b) && delete this.componentSetup.dataSetIds[b]
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-table");
			b.attr("class", a.attr("class"));
			a.attr("tempId",this.componentSetup.fieldId);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = this,
				a;
			b.statFields ? b.renderEditorValue() : this.componentmodel.getFormTableSelectFields(function(c) {
				c.formFields = [];
				c.listStats = [];
				a = $(_.template(b.tpl, c)).siblings("#editor-table");
				b.statFields = c;
				b.el = a;
				b.renderEditorValue()
			})
		},
		renderEditorValue: function() {
			var b = this.el,
				a = _.keys(this.componentSetup.dataSetIds);
			b.find("#component-title").attr("value", this.componentSetup.title);
			$("#editor-component").html(b.html());
			var c = $(".j_datasource");
			$.each(this.statFields.tablestatfields, function() {
				var a = c.find("li:first").clone().show();
				a.find(".table_field").val(this.fieldId).attr("title", this.title);
				a.find("span").text(this.title);
				c.append(a)
			});
			for (var d = 0, e = a.length; d < e; d++)
			b = $("#editor-component").find("input[value='" + a[d] + "']"), b.prop("checked", !0)
		},
		renderPreview: function(b, a, c) {
			var d = this,
				e = {},
				f = $(this.tpl).siblings("#preview-table");
			f.find(".panel-heading").html(this.componentSetup.title);
			b.append(f);
			this.viewcon = f;
			e.fieldIds = _.keys(this.componentSetup.dataSetIds).join(",");
			e.pageNo = 1;
			e.pageSize = 10;
			this.componentmodel.getTablePageData(e, function(a) {
				a = {
					currentPage: a.pageDatas.pageNo,
					totalPages: a.pageDatas.totalPages,
					onPageClicked: function(a, b, c, f) {
						e.pageNo = f;
						d.renderTableView(e)
					}
				};
				f.find(".pageNav").bootstrapPaginator(a);
				d.renderTableView(e)
			})
		},
		renderTableView: function(b) {
			var a = this;
			table = $(a.tpl).siblings("#formDatas");
			a.viewcon.find(".tablecontent").html("").append(table);
			var c = a.viewcon;
			this.componentmodel.getTablePageData(b, function(b) {
				pageNo = b.pageNo;
				1 == pageNo && ($(c).find("#stat_table tbody").html(), $(c).find("#stat_table tbody").empty());
				var e = b.formFields,
					f = b.formDatas,
					g = b.listStats;
				a.formFields = e;
				if (null == e || 0 == e.length) $(c).find("#formDatas").html('<div class="formstat-noresult">当前表单没有任何字段！</div>');
				else {
					if (0 == $(c).find("#stat_table thead tr th").length) for (b = 0; b < e.length; b++) {
						var k = e[b];
						$(c).find("#stat_table thead tr").append("<th title='" + k.title + "'><div>" + k.title + "</div></th>");
						var p = "",
							h = "";
						if ("Money" == k.componentKey || "NumberComponent" == k.componentKey) p = "ta-r";
						"Money" == k.componentKey && (h = "Money");
						$(c).find("#stat_table tfoot tr").append("<td id='tfoot_" + k.id + "' class='" + p + "' type='" + h + "'></td>")
					}
					if (null == f || 0 == f.length) $(c).find("#statbody #data_message").html("暂无数据...").show();
					else {
						$(c).find("#statbody #data_message").hide();
						h = {};
						if (g) for (b = 0; b < g.length; b++) {
							var l = g[b],
								p = l.FORM_DATA + "_" + l.DATA_INDEX;
							h[p] = l
						}
						for (b = 0; b < f.length; b++) {
							var g = f[b],
								l = g.maxIndex || 1,
								n = g.id;
							if (!(0 < $(" stat_table tr #" + n).length)) for (var r = 0; r < l; r++) {
								var p = n + "_" + (r + 1),
									m = h[p],
									v = $("<tr id=" + n + "></tr>");
								Date.create(g.flowCreateTime);
								for (var A = 0; A < e.length; A++) {
									var k = e[A],
										x = k.id,
										B = k.componentKey,
										y = "";
									m && (y = m["C_" + x] || "");
									var C = "noSub_" + n + "_" + x;
									k.subForm && (C = "");
									p = "";
									if ("Money" == B || "NumberComponent" == B) p = "ta-r";
									k = n + "_" + (r + 1) + "_" + x;
									try {
										var z = JSON.parse(y);
										ocount = "";
										if (0 < z.length && null != z[0].optionId) {
											for (x = 0; x < z.length; x++)
											option = z[x], ocount += option.content + ",";
											y = ocount.substring(0, ocount.length - 1)
										}
									} catch (D) {}
									v.append("<td id=" + k + " class='" + C + " " + p + "' title='" + y + "'>" + y + "</td>")
								}
								$(c).find("#stat_table tbody").append(v)
							}
						}
						a.mergerCells(e, f)
					}
				}
			})
		},
		mergerCells: function(b, a) {
			if (b && a) for (var c = this.viewcon, d = 0; d < a.length; d++) {
				var e = a[d],
					f = e.maxIndex || 1,
					e = e.id;
				this.isAdmin && ($(c).find("#stat_table .noSub_flowCheck_" + e + ":eq(0)").attr("rowspan", f), $(c).find("#stat_table .noSub_flowCheck_" + e + ":gt(0)").remove());
				for (var g = 0; g < b.length; g++) {
					var k = b[g];
					k.subForm || (k = k.id, $(c).find("#stat_table .noSub_" + e + "_" + k + ":eq(0)").attr("rowspan", f), $(c).find("#stat_table .noSub_" + e + "_" + k + ":gt(0)").remove())
				}
			}
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-table");
			a.attr("id", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				a.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				a.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		renderStatSearch: function(b) {},
		submitCheck: function(b, a) {},
		checkEvents: function(b) {},
		check: function(b) {},
		getValue: function(b) {},
		setValue: function(b, a) {},
		empty: function(b) {},
		readOnly: function(b, a) {}
	});
	return window.TableComponent
});
