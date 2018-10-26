define("form/component/departselecter", ["form/tplutil"], function() {
	var l = require("form/tplutil");
	return Backbone.View.extend({
		initialize: function() {},
		render: function(b, a) {
			"pc" == b ? this.initPC.init(a) : this.initMb.init(a)
		},
		initPC: {
			lightClass: "selected",
			fold: "icon-caret-right",
			unfold: "icon-caret-down",
			init: function(b) {
				this.target = b.target;
				this.el = "#selector-department";
				this.tpl = l.get("departselecter");
				$("body").append($(this.tpl).siblings("#selector-department"));
				this.delegateEvents();
				this.open()
			},
			delegateEvents: function() {
				var b = this,
					a = $(b.el);
				$("body").on("keydown.depart-win", function(c) {
					27 == c.which && a.modal("hide")
				});
				a.on("click", "." + b.unfold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle(400);
					$(this).removeClass(b.unfold).addClass(b.fold)
				});
				a.on("click", "." + b.fold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle(400);
					$(this).removeClass(b.fold).addClass(b.unfold)
				});
				a.on("click", ".treenode", function(a) {
					a.preventDefault();
					a = $(this).data("node");
					b.close();
					b.target.trigger("confirmHandler", {
						objs: a
					})
				});
				a.on("hidden.bs.modal", function() {
					$("#selector-department").remove()
				})
			},
			open: function() {
				$(this.el).modal("toggle");
				this.renderDepartment()
			},
			close: function() {
				$(this.el).modal("hide")
			},
			renderDepartment: function(b) {
				var a = this;
				a.id = b;
				a.data ? (a.initTree(a.data), a.bindData(a.data)) : a.loadData(function(c) {
					c = c.nodes;
					a.data = c;
					a.initTree(c);
					a.bindData(c)
				})
			},
			loadData: function(b) {
				$.ajax({
					url: "/base/tree/department.json",
					type: "post",
					dataType: "json",
					success: function(a) {
						b && b(a)
					}
				})
			},
			initTree: function(b) {
				var a = this.getRoot(b);
				b = this.createRootTree(a, b);
				$("#selector-org-tree").html(b)
			},
			createRootTree: function(b, a) {
				var c = "<ul>",
					d = this.createChild(b, a);
				return c = c + d + "</ul>"
			},
			createTree: function(b, a) {
				for (var c = "<ul class='ftl-child-ul'>", d = 0, e = 0, f = a.length; e < f; e++) {
					var g = a[e];
					if (!g) break;
					var k = g.nodeObj.parent;
					k && k.id == b.id && g.id != b.id && (g = this.createChild(g, a), c += g, d++)
				}
				return 0 == d ? "" : c + "</ul>"
			},
			createChild: function(b, a) {
				if (b) {
					var c = "root" == b.parentId ? "root" : "",
						d = "padding-left:" + 20 * b.rank + "px",
						e = this.createTree(b, a),
						f = e ? this.unfold : "",
						c = "<li>" + ('<div class="treenode router ' + c + '" style="' + d + '" id="' + b.id + '">'),
						d = '<span class="num fr">' + b.attachment + '</span><a class="router" title="' + b.name + '" href="＃"><span class="tree-name">' + b.name + "</span></a>",
						c = c + ("<i class='nodeicon " + f + "'></i>") + d,
						c = c + "</div>",
						c = c + e;
					return c += "</li>"
				}
			},
			getRoot: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					if (!d.nodeObj.parent) return d
				}
			},
			bindData: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					$(this.el).find("#" + d.id).data("node", d)
				}
			},
			remove: function() {
				$(this.el).remove()
			}
		},
		initMb: {
			lightClass: "selected",
			fold: "icon-caret-right",
			unfold: "icon-caret-down",
			init: function(b) {
				this.userId = b.userId || TEAMS.currentUser.id;
				this.preEl = b.preEl;
				this.container = b.el;
				this.multi = b.multi && "false" == b.multi ? !1 : !0;
				this.departments = b.departments;
				this.tpl = l.get("departselecter");
				$("body").append($(this.tpl).siblings("#department-component"));
				this.el = "#department-component";
				this.multi || $("#department-component #j_department-comfirm").remove();
				this.delegateEvents();
				this.renderDepartment()
			},
			delegateEvents: function() {
				var b = this,
					a = $("#department-component");
				a.on("click", ".j_department-info", function(a) {
					a = $(this).data("department");
					$(this).toggleClass("selected");
					1 == $("#seleted-department-list #seleted" + a.id).size() ? $("#seleted-department-list #seleted" + a.id).remove() : $("#seleted-department-list").append('<span id="seleted' + a.id + '" data-id="' + a.id + '">' + a.name + "</span>")
				});
				if (!b.multi) a.on("click", ".j_department-info", function(a) {
					a = $(this).data("department");
					b.container.trigger("departmentComfirm", {
						objs: a
					});
					$(b.preEl).removeClass("hide");
					$("#department-component").addClass("hide").remove()
				});
				a.on("click", "#j_department-comfirm", function(a) {
					a = b.getAllChecked();
					b.container.trigger("departmentComfirm", {
						objs: a
					});
					$(b.preEl).removeClass("hide");
					$("#department-component").addClass("hide").remove()
				});
				a.on("click", "#j_a-back", function(a) {
					$(b.preEl).removeClass("hide");
					$("#department-component").addClass("hide").remove()
				});
				a.on("click", "." + b.unfold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle();
					$(this).removeClass(b.unfold).addClass(b.fold)
				});
				a.on("click", "." + b.fold, function(a) {
					a.stopPropagation();
					$(this).parent().parent().find("ul").slideToggle();
					$(this).removeClass(b.fold).addClass(b.unfold)
				})
			},
			renderDepartment: function() {
				var b = this;
				$.ajax({
					url: "/base/tree/department.json",
					type: "post",
					dataType: "json",
					data: {},
					success: function(a) {
						a = a.nodes;
						b.nodes = a;
						b.initTree(a);
						b.bindData(a);
						b.renderSeleted(b.departments)
					}
				})
			},
			getRoot: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					if (!d.nodeObj.parent) return d
				}
			},
			renderSeleted: function(b) {
				if (b) if ($("#seleted-department-list").empty(), this.mult) for (var a = 0; a < b.length; a++) {
					var c = b[a];
					$("#seleted-department-list").append('<span id="seleted' + c.id + '" data-id="' + c.id + '">' + c.name + "</span>");
					$("#j_dept-list-container #" + c.id).addClass("selected")
				} else $("#seleted-department-list").html('<span id="seleted' + b.id + '" data-id="' + b.id + '">' + b.name + "</span>"), $("#j_dept-list-container #" + b.id).addClass("selected");
				else if (this.container) for (b = this.container.find("span"), $("#seleted-department-list").empty(), a = 0; a < b.length; a++) {
					var c = $(b[a]).attr("data-id"),
						d = $(b[a]).text();
					$("#seleted-department-list").append('<span id="seleted' + c + '" data-id="' + c + '">' + d + "</span>");
					$("#j_dept-list-container #" + c).addClass("selected")
				}
			},
			getAllChecked: function() {
				var b = [];
				$("#j_dept-list-container .j_department-info.selected").each(function() {
					var a = $(this).data("department");
					b.push(a)
				});
				return b
			},
			initTree: function(b) {
				var a = this.getRoot(b);
				b = this.createRootTree(a, b);
				$("#j_dept-list-container").html(b)
			},
			createRootTree: function(b, a) {
				var c = "<ul class='ul-" + b.id + " org-rootTree dept-list'>",
					d = this.createChild(b, a, !0);
				return c = c + d + "</ul>"
			},
			createTree: function(b, a) {
				for (var c = "<ul class='ul-" + b.id + " org-subTree'>", d = 0, e = 0, f = a.length; e < f; e++) {
					var g = a[e];
					if (!g) break;
					var k = g.nodeObj.parent;
					k && k.id == b.id && g.id != b.id && (g = this.createChild(g, a), c += g, d++)
				}
				return 0 == d ? "" : c + "</ul>"
			},
			createChild: function(b, a, c) {
				if (b) {
					c = "root" == b.parentId ? "root" : "";
					var d = (a = this.createTree(b, a)) ? "<i class='j_nodeicon nodeicon " + this.unfold + "'></i>" : "";
					b = '<p  id="' + b.id + '" class="j_department-info j_name name ellipsis ' + this.edit + '" ><span class="tree-name">' + b.name + "</span></a>";
					c = "<li>" + ('<div class="j_treenode treenode ' + c + '" >') + d;
					c += b + '<i class="ico-r j_ico-check ico-check"></i>';
					c += "</div>";
					c += a;
					return c += "</li>"
				}
			},
			bindData: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					$(this.el).find("#" + d.id).data("department", d.nodeObj)
				}
			}
		}
	});
});
