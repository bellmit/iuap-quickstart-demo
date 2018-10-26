define("form/component/tablelayout", ["form/component", "form/tplutil", "table"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	/* 貌似"form/component/table"模块根本没有定义，应该是table.js才对，这里先注释掉试试
	h("form/component/table");
	*/
	window.TableLayout = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "TableLayout",
				layoutDetail: [],
				order: 0,
				index: 0,
				rows: 4,
				cols: 3,
				thArray: [],
				borderColor:"",
				tableId: l.getFieldId(),
				tableFlowlayout:"flowLayout",
				required:false
			};
			null != b && (
				this.componentSetup.title = b.title, 
				this.componentSetup.layoutDetail = b.layoutDetail, 
				this.componentSetup.order = b.order, 
				this.componentSetup.index = b.index, 
				this.componentSetup.rows = b.rows, 
				this.componentSetup.cols = b.cols, 
				this.componentSetup.thArray = b.thArray, 
				this.componentSetup.borderColor = b.borderColor,
				this.componentSetup.tableId = b.tableId,
				this.componentSetup.tableFlowlayout = b.tableFlowlayout
			);
			this.tpl = l.get("tablelayout")
		},
		setTableFlowlayout: function(b) {
			this.componentSetup.tableFlowlayout = b
		},
		setTableId: function(b) {
			this.componentSetup.tableId = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#table-layout");
			b.attr("class", a.attr("class"));
			b.attr("id", this.componentSetup.tableId);
			b.html(a.html());
			this.table = b.find(".j_table").table({
				rows: this.componentSetup.rows,
				cols: this.componentSetup.cols,
				afterCreateCell: function(a, b) {
					/*
						创建单元格之后触发afterCreateCell事件，
						这个事件在formlayout模块里面，负责重置设计区的拖放区域
					*/
					$(document).trigger("afterCreateCell", {
						cell: b
					})
				},
				beforeChangeCell: function(a, b) {
					return !0
				},
				afterChangeWidth: function(a, d) {
					/*
						每次添加或者删除单元格之后重新计算整个表格的宽度，
						要是比设计区宽就会添加滚动条，挪动一下工具条不被滚动条挡住
					*/
					if (d && 0 < d.length) {
						for (var e = 0, f = 0; f < d.length; f++)
						e += ~~d[f];
						e > $(".form-view").width() - 2 ? b.find(".form-layout-toolbar").css("margin-bottom", "17px") : b.find(".form-layout-toolbar").css("margin-bottom", "0px")
					}
				},
				afterDeleteCol: function(a) {
					0 == a.options.cols && a.$table.closest(".table_layout_js").remove()
				},
				afterDeleteRow: function(a) {
					0 == a.options.rows && a.$table.closest(".table_layout_js").remove()
				}
			})
		},
		renderEditor: function() {
			//console.log("布局控件没有renderEditor方法不能被选中")
			var b = $(this.tpl).siblings("#editor-flowTablelayout");
			b.find("input:radio[name='isFlow-layout'][value='" + this.componentSetup.tableFlowlayout + "']").attr("checked", "true");
			b.find("#component-tableId").attr("value", this.componentSetup.tableId);
			$("#editor-component").html(b.html());
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl),
				e = this.componentSetup.layoutDetail;
			if ("mobile" != window.systemInfo_form) {
				d = d.siblings("#preview-tablelayout");
				b.append(d);
				var f = this.componentSetup.rows,
					g = $("<table class='table table-bordered'></table>");
				d.find(".j_tablelayout").append(g);
				if (f && 0 < f) for (var k = 0; k < f; k++)
				g.append($("<tr class=''></tr>"));
				if (e && 0 < e.length) for (k = 0; k < e.length; k++) {
					var f = e[k],
						h = Number(f.width) + Number(20);
					if (f && 0 < f.rowSpan && 0 < f.colSpan) {
						var h = $("<td rowspan='" + f.rowSpan + "' colspan='" + f.colSpan + "' style='width:" + (h || "255") + "px'></td>"),
							l = f.coordinate.split("_")[0];
						g.find("tr").eq(~~l).append(h);
						if(f.layoutDetail && 0 < f.layoutDetail.length) {
							f = new window[f.layoutDetail[0].componentKey](f.layoutDetail[0]);
							f.renderPreview(h, a, c)
							f.checkEvents(function(a) {
								formPlugin.checkPrompt(a)
							})
						}
					}
				}
				d.attr("id", "");
				d.attr("cid", this.cid)
			} else if (e && 0 < e.length) for (k = 0; k < e.length; k++)
			f = e[k], f.layoutDetail && 0 < f.layoutDetail.length && (f = new window[f.layoutDetail[0].componentKey](f.layoutDetail[0]), f.renderPreview(b.closest(".j_formpreview"), a, c), f.checkEvents(function(a) {
				formPlugin.checkPrompt(a)
			}));
			this.el = b
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#table-layout");
			this.table = a.find(".j_table").table({
				rows: this.componentSetup.rows,
				cols: this.componentSetup.cols,
				tdArray: this.componentSetup.layoutDetail,
				thArray: this.componentSetup.thArray,
				afterCreateCell: function(a, b) {
					$(document).trigger("afterCreateCell", {
						cell: b
					})
				},
				beforeChangeCell: function(a, b) {
					return !0
				},
				afterCreateBodyTd: function(a, b, e) {
					e.layoutDetail && 0 < e.layoutDetail.length && (new window[e.layoutDetail[0].componentKey](e.layoutDetail[0])).renderEditPreview(b)
				},
				afterChangeWidth: function(b, d) {
					if (d && 0 < d.length) {
						for (var e = 0, f = 0; f < d.length; f++)
						e += ~~d[f];
						e > $(".form-view").width() ? a.find(".form-layout-toolbar").css("margin-bottom", "17px") : a.find(".form-layout-toolbar").css("margin-bottom", "0px")
					}
				},
				afterDeleteCol: function(a) {
					0 == a.options.cols && a.$table.closest(".table_layout_js").remove()
				},
				afterDeleteRow: function(a) {
					0 == a.options.rows && a.$table.closest(".table_layout_js").remove()
				}
			});
			a.attr("id", "");
			a.attr("cid", this.cid);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				a.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				a.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			a.data("componentData", this);
			b.append(a)
		},
		getTableSerialize: function(b, a) {
			var c = this.table,
				d = c.persist.storage,
				e = c.options,
				f = [],
				g = [];
			if (d && 0 < d.length) for (var k = 0; k < d.length; k++) {
				var h = k,
					l = d[k];
				if (l && 0 < l.length) for (var n = 0; n < l.length; n++) {
					var m = l[n],
						r = {
							coordinate: h + e.separator + n,
							rowSpan: 0,
							colSpan: 0,
							width: null,
							height: null
						};
					if (m) {
						r.rowSpan = m.rowSpan;
						r.colSpan = m.colSpan;
						r.width = $(m).width();
						r.height = $(m).height();
						var m = b.assemComponent(a, $(m).find(".field_js")),
							w = [];
						null != m && w.push(m.componentSetup);
						r.componentKey = "TdLayout";
						r.layoutDetail = w
					}
					f.push(r)
				}
			}(c = c.$table.find("thead th")) && 0 < c.length && c.each(function() {
				g.push($(this).width() + 17)
			});
			this.componentSetup.layoutDetail = f;
			this.componentSetup.rows = e.rows;
			this.componentSetup.cols = e.cols;
			this.componentSetup.thArray = g
		},
		maximize: function() {
			var b = this,
				a = this.cid,
				c = $(this.tpl).siblings("#tableMaximize").clone();
			$("body").append("<div id='" + a + "'></div>");
			$("#" + a).append(c);
			var d = $("[cid=" + this.cid + "]"),
				c = $("#" + a + " #tableMaximize #maximizePreview");
			formPlugin.analyseComponent(this.componentSetup, c, null, this.isReadOnly);
			var e = formPlugin.assembleFormFieldData(d);
			formPlugin.fillFieldContent(e, c);
			formPlugin.setFormReadOnly({
				parentEl: c,
				readOnly: this.isReadOnly
			});
			c.on("input propertychange change", "input", function() {
				var a = $(this),
					b;
				if ("DateInterval" == a.attr("componentkey")) {
					b = a.parent().attr("name");
					var c = d.find("div[name='" + b + "']").find("input")
				} else b = a.closest(".field_js").attr("fieldid"), c = d.find("input[id='" + b + "']");
				b && c.val(a.val()).blur().change()
			});
			$("#tableMaximize").modal();
			$("#" + a).find(".j_maximize").remove();
			$("#" + a).on("hidden.bs.modal", function() {
				$(this).find("#tableMaximize").length && b.minimize();
				$(this).remove()
			})
		},
		minimize: function() {
			var b = $("[cid=" + this.cid + "]"),
				a = $("#tableMaximize .modal-body");
			formPlugin.destroyEvents(a);
			a = formPlugin.assembleFormFieldData(a);
			formPlugin.setEmpty(b);
			formPlugin.fillFieldContent(a, b.parent());
			this.saveComponentValue(b)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document);
			this.checkCallback = b;
			c.on("click", "[cid=" + a.cid + "] .j_maximize", function() {
				a.maximize()
			})
		},
		readOnly: function(b, a) {
			console.error("you need to rewrite the method : readOnly")
		}
	});
	return TableLayout
});
