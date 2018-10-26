define("form/component/userselecter", ["form/tplutil"], function() {
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
				this.isMulti = b.isMulti || !1;
				this.target = b.target;
				this.height = 310;
				this.userOrg = !1;
				this.tpl = l.get("userselecter");
				$("body").append($(this.tpl).siblings("#selector-employee"));
				this.el = "#selector-employee";
				this.$el = $(this.el);
				this.render(b.users);
				this.delegateEvents()
			},
			delegateEvents: function() {
				var b = this,
					a = b.$el;
				$("body").off("keydown.user").on("keydown.user", function(b) {
					27 == b.which && a.modal("hide")
				});
				a.on("click", ".j_user_cancel", function() {
					a.find(".j_close").click()
				});
				$("#selector-employee").on("hidden.bs.modal", function() {
					$("#selector-employee").remove()
				});
				a.on("click", "#organization-users", function(c) {
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
					a.find("#organization-users").parent().addClass("active");
					a.find("#group-users").parent().removeClass("active");
					a.find("#org-tree-list").removeClass("hide");
					a.find("#org-group-list").addClass("hide");
					a.find(".users-list-pinyin .j_active").removeClass("j_active");
					b.userOrg = !1;
					a.find(".root").trigger("click")
				});
				a.on("click", "#group-users", function(c) {
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
					a.find("#organization-users").parent().removeClass("active");
					a.find("#group-users").parent().addClass("active");
					a.find("#org-tree-list").addClass("hide");
					a.find("#org-group-list").removeClass("hide");
					a.find(".users-list-pinyin .j_active").removeClass("j_active");
					b.userOrg = !0;
					b.initGroup()
				});
				a.on("click", "#org-tree-list .treenode,#org-group-list li", function(c) {
					a.find(".users-list-pinyin .j_active").removeClass("j_active");
					b.$el.find(".selected").removeClass("selected");
					$(this).addClass("selected");
					b.initPinyin()
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
				a.on("addUser", "#all-group-users", function(a, b) {
					var e = $("<a> " + b.username + " </a>");
					e.attr("id", b.id);
					e.data("user", b);
					0 == $("#userSelector-multi .selected-users #" + b.id).size() && $("#userSelector-multi .selected-users").prepend(e)
				});
				a.on("deleteUser", "#all-group-users", function(a, b) {
					$("#userSelector-multi .selected-users #" + b.id).remove()
				});
				a.on("addAllUser", "#all-group-users", function(a, d) {
					for (var e = 0; e < d.length; e++) {
						var f = d[e];
						if (!b.isExistUser(f)) {
							var g = $("<a> " + f.username + " </a>");
							g.attr("id", f.id);
							g.data("user", f);
							$("#userSelector-multi .selected-users").prepend(g)
						}
					}
				});
				a.on("deleteAllUser", "#all-group-users", function(a, b) {
					for (var e = 0; e < b.length; e++)
					$("#userSelector-multi .selected-users #" + b[e].id).remove()
				});
				a.on("click", "#employee-container li", function(a) {
					if (b.isMulti) $(this).find("div.username input").trigger("click");
					else if (a = $(this).data("user")) $(b.el).modal("hide"), a.sourceId = $(this).attr("id"), b.target.trigger("confirmHandler", {
						objs: [a]
					})
				});
				a.on("click", "#employee-container .clearfix div.username input", function(a) {
					var d = $(this).parents(".clearfix").data("user");
					len = $(this).filter(":checked").length;
					0 < len ? $(this).trigger("addUser", [d, b.id]) : $(this).trigger("deleteUser", [d, b.id]);
					var d = $(b.el + " #employee-container .clearfix div.username input:checked").length,
						e = $(b.el + " #employee-container .clearfix div.username input").length;
					0 == d && $(b.el + " #checkAll").prop("checked", !1);
					d == e ? $(b.el + " #checkAll").prop("checked", !0) : $(b.el + " #checkAll").prop("checked", !1);
					a.stopPropagation()
				});
				$(this.el).off("change", "#checkAll").on("click", "#checkAll", function() {
					var a = [];
					if ($(this).prop("checked")) {
						$(b.el + " #employee-container .clearfix div.username input").each(function() {
							if (0 == $(this).filter(":checked").length) {
								var d = $(this).parents(".clearfix").data("user");
								a.push(d);
								$(b.el + " #checkAll").removeAttr("checked");
								$(this).prop("checked", !0)
							}
						});
						var d = $(b.el + " #employee-container .clearfix div.username input:checked").length,
							e = $(b.el + " #employee-container .clearfix").length - 1;
						d == e && $(this).prop("checked", !0);
						$(this).trigger("addAllUser", [a, b.id])
					} else $(b.el + " #employee-container .clearfix div.username input").each(function() {
						var d = $(this).parents(".clearfix").data("user");
						if (d.id != TEAMS.currentUser.id || "editgroup" != b.userOrg) a.push(d), $(this).prop("checked", !1)
					}), $(this).prop("checked", !1), $(this).trigger("deleteAllUser", [a, b.id])
				});
				a.on("click.user-win", ".j_user_ok", function() {
					var a = [];
					$("#userSelector-multi .selected-users>a").each(function() {
						var b = $(this).data("user");
						a.push(b)
					});
					b.target.trigger("confirmHandler", {
						objs: a
					});
					$(b.el).modal("hide")
				})
			},
			render: function(b) {
				var a = this.$el;
				$("body").find("#selector-employee").modal();
				this.isMulti ? a.find(".selector-btns .j_user_ok").removeClass("hide") : (a.find("#userSelector-multi .user-selector-header").addClass("hide"), a.find("#userSelector-multi .user-wrapper").addClass("hide"));
				if (b && 0 < b.length) for (a = 0; a < b.length; a++) {
					var c = b[a],
						d = $("<a> " + c.username + " </a>");
					d.attr("id", c.id);
					d.data("user", c);
					0 == $("#userSelector-multi .selected-users #" + c.id).size() && $("#userSelector-multi .selected-users").prepend(d)
				}
				this.initTree()
			},
			initTree: function(b) {
				var a = this;
				(b = this.departmentData) ? a.renderTree(b) : $.ajax({
					url: "/base/tree/department.json",
					type: "post",
					dataType: "json",
					success: function(b) {
						a.departmentData = b.nodes;
						a.renderTree(a.departmentData)
					}
				})
			},
			initPinyin: function() {
				var b = this;
				b.userOrg ? b.findGroupPinyinIndexs(b.getParam(), function(a) {
					b.loadPinyin(a)
				}) : b.findPinyinIndexs(b.getParam(), function(a) {
					b.loadPinyin(a)
				});
				b.initUsers()
			},
			initGroup: function() {
				var b = this,
					a = b.groupData;
				a ? b.renderGroup(a) : $.ajax({
					url: "/group/group.json",
					type: "post",
					dataType: "json",
					data: {
						employeeId: TEAMS.currentUser.id
					},
					success: function(a) {
						b.groupData = a;
						b.renderGroup(b.groupData)
					}
				})
			},
			initUsers: function() {
				var b = this;
				$(b.el + " #userlistCon").empty();
				b.userOrg ? b.queryGroupEmp(b.getParam(), function(a) {
					b.renderUserList(a)
				}) : b.queryEmp(b.getParam(), function(a) {
					b.renderUserList(a)
				})
			},
			renderTree: function(b) {
				var a = this.getRoot(b);
				b = this.createRootTree(a, b);
				$("#org-tree-list").html(b);
				this.highLight();
				this.initPinyin()
			},
			getRoot: function(b) {
				for (var a = 0, c = b.length; a < c; a++) {
					var d = b[a];
					if (!d.nodeObj.parent) return d
				}
			},
			createRootTree: function(b, a) {
				var c = "<ul>",
					d = this.createChild(b, a);
				return c = c + d + "</ul>"
			},
			createChild: function(b, a) {
				if (b) {
					var c = "root" == b.parentId ? "root" : "",
						d = "padding-left:" + 20 * b.rank + "px",
						e = this.createTree(b, a),
						f = e ? this.unfold : "",
						c = "<li>" + ('<div class="treenode router ' + c + '" style="' + d + '" id="' + b.id + '">');
					nameTmp = '<a class="router" title="' + b.name + '"><span class="tree-name">' + b.name + "</span></a>";
					c += "<i class='nodeicon " + f + "'></i>";
					c += nameTmp;
					c = c + "</div>" + e;
					return c += "</li>"
				}
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
			renderGroup: function(b) {
				if ((b = b.groups) && 0 < b.length) {
					if (0 == $("#org-group-list").find("ul>li").length) {
						for (var a = "<ul class='clearfix'>", c = 0, d = b.length; c < d; c++)
						var e = "",
							f = b[c].createTime ? Date.create(b[c].createTime).format("{yyyy}-{MM}-{dd}") : "",
							e = e + ("<li><a id='" + b[c].id + "' class='router' title='" + b[c].creator.username + "创建于" + f + "' href='#'>" + b[c].name + "【" + (null == b[c].member ? 0 : b[c].member.length) + "人】</a></li>"),
							a = a + e;
						a += "</ul>";
						$("#org-group-list").html(a)
					}
					$("#org-group-list").find("ul>li:first").addClass("selected");
					this.initPinyin()
				}
			},
			loadPinyin: function(b) {
				var a = this;
				b = b.indexs;
				var c = /[0-9]$/,
					d = /^[A-Za-z]+$/,
					e = $(a.el).find(".users-list-pinyin");
				e.find("a.highlight:not(#ALL)").removeClass("highlight");
				for (var f = 0; f < b.length; f++) {
					var g = b[f].toLocaleUpperCase();
					c.test(g) ? g = "degit" : d.test(g) || (g = "special");
					g && 0 < g.trim().length && e.find("#" + g).addClass("highlight")
				}
				e.off("click", "a.highlight").on("click", "a.highlight", function(b) {
					b = $(this);
					b.addClass("j_active");
					b.siblings().removeClass("j_active");
					a.initUsers()
				})
			},
			findPinyinIndexs: function(b, a) {
				$.ajax({
					type: "post",
					url: "/base/employee/findPinyinIndexs.json",
					dataType: "json",
					data: b,
					success: function(b) {
						a && a(b)
					}
				})
			},
			findGroupPinyinIndexs: function(b, a) {
				$.ajax({
					type: "post",
					url: "/base/employee/findGroupPinyinIndexs.json",
					dataType: "json",
					data: b,
					success: function(b) {
						a && a(b)
					}
				})
			},
			queryEmp: function(b, a) {
				$.ajax({
					url: "/base/employee/pageQuery.json",
					type: "post",
					dataType: "json",
					data: b,
					success: function(b) {
						a && a(b)
					}
				})
			},
			queryGroupEmp: function(b, a) {
				$.ajax({
					url: "/base/employee/queryGroupEmp.json",
					type: "post",
					dataType: "json",
					data: b,
					success: function(b) {
						a && a(b)
					}
				})
			},
			renderUserList: function(b) {
				users = this.getAllChecked();
				b = b.page;
				for (var a = 0; a < b.result.length; a++)
				this.renderUser(b.result[a], !1, users);
				0 < b.result.length && b.result.length == this.checkCount ? $(this.el + " #checkAll").prop("checked", !0) : $(this.el + " #checkAll").prop("checked", !1);
				a = $(this.el).find(".center-more");
				b.hasNext ? a.removeClass("hide") : a.addClass("hide");
				this.checkCount = 0
			},
			renderUser: function(b, a, c) {
				var d = $(this.tpl).siblings("#usersListClone").children("li").clone();
				this.isMulti ? (d.find("div.username input").removeClass("hide"), $(this.el).find("#group-user-checkall").removeClass("hide"), b.checked && 1 == b.checked && d.find("div.username input").prop("checked", !0)) : (d.find("div.username input").addClass("hide"), $(this.el).find("#group-user-checkall").addClass("hide"));
				if (c) for (var e = 0; e < c.length; e++)
				c[e].id == b.id && (this.checkCount += 1, d.find("div.username input").prop("checked", !0));
				d.data("user", b);
				d.attr("id", b.id);
				b.mobile ? d.find(".call").html(b.mobile) : d.find(".call").html(b.email);
				d.find(".dept").html(b.department.name);
				b.avatar && b.avatar.p4 && (d.find("a.avatar img").attr("src", "/base/download/" + b.avatar.p4), this.editable && (d.find("a.avatar img").attr("id", b.id), d.find("a.avatar img").data("user", b)));
				c = "";
				c = "normal" == b.status ? "" : "(离职)";
				c = "<font color='red'>" + c + "</font>";
				d.find("a.name").html(b.username + c);
				this.isMulti || (d.find("a.name").attr("id", b.id), d.find("a.name").data("user", b));
				c = b.email ? b.email : b.mobile;
				d.find("span.email").attr("title", c).html(c);
				$(this.el).find("#userlistCon");
				b.department && 1 == b.department.rank ? d.find("span.department").text("") : d.find("span.department").attr("title", b.department.name).html(b.department.name);
				TEAMS.currentUser.id != b.id ? d.find("span." + b.relation).removeClass("hide") : "editgroup" == this.userOrg && d.find("div.username input").attr("disabled", "disabled");
				a ? $(this.el).find("#userlistCon").prepend(d) : $(this.el).find("#userlistCon").append(d)
			},
			getParam: function() {
				var b = {
					pageSize: 500,
					pageNo: 1,
					isGroupEdit: 0,
					isContainsSub: !0
				},
					a = $(this.el).find("#org-group-list .selected");
				b.groupId = 0 < a.length ? a.children("a").attr("id") : "";
				b["employee.status"] = "normal";
				a = $(this.el).find("#org-tree-list .selected");
				b["employee.department"] = 0 < a.length ? a.attr("id") : "";
				a = "";
				0 < $(this.el).find(".users-list-pinyin .j_active").length && (a = $(this.el).find(".users-list-pinyin .j_active").attr("id").toLocaleLowerCase(), "all" == a && (a = ""));
				b["employee.index"] = a;
				return b
			},
			isExistUser: function(b) {
				var a = !1;
				$("#userSelector-multi .selected-users>a").each(function() {
					var c = $(this).data("user");
					b.id == c.id && (a = !0)
				});
				return a
			},
			isChecked: function() {
				var b = [],
					b = this.getAllChecked();
				return 0 < b.length ? !0 : !1
			},
			getAllChecked: function() {
				var b = [];
				$("#userSelector-multi .selected-users>a").each(function() {
					var a = $(this).data("user");
					b.push(a)
				});
				return b
			},
			highLight: function(b) {
				var a = this.$el,
					c = this.lightClass;
				a.find(".treenode").removeClass(c);
				a.find("#" + b).addClass(c);
				b || a.find(".root").addClass(c)
			}
		},
		initMb: {
			init: function(b) {
				this.container = b.el;
				this.targetId = b.targetId;
				this.preEl = b.preEl;
				this.multi = b.multi && "false" == b.multi ? !1 : !0;
				this.title = b.title;
				this.noempty = b.noempty;
				this.tpl = l.get("userselecter");
				this.reload = !1;
				$("body").append($(this.tpl).siblings("#employee-container"));
				$("#seleted-title").html(this.title);
				this.delegateEvents();
				this.render()
			},
			delegateEvents: function() {
				var b = this,
					a = $("#employee-container");
				$("#employee-container").off(".seleted");
				if (b.multi) a.on("click.seleted", ".j_employee-info", function(a) {
					$(this).toggleClass("selected");
					a = $(this).data("employee");
					1 == $("#j_memb-names #seleted" + a.id).size() ? ($("#j_memb-names #seleted" + a.id).remove(), $("#j_memb-list-container #" + a.id).removeClass("selected")) : ($("#j_memb-list-container #" + a.id).addClass("selected"), $("#j_memb-names").append('<span id="seleted' + a.id + '" data-id="' + a.id + '">' + a.username + "</span>"))
				});
				else a.on("click.seleted", ".j_employee-info", function(a) {
					a = $(this).data("employee");
					b.noempty ? ($(this).toggleClass("selected"), a = $(this).data("employee"), 1 == $("#j_memb-names #seleted" + a.id).size() ? ($("#j_memb-names #seleted" + a.id).remove(), $("#j_memb-list-container #" + a.id).removeClass("selected")) : ($("#j_memb-list-container .selected").removeClass("selected"), $("#j_memb-list-container #" + a.id).addClass("selected"), $("#j_memb-names").html('<span id="seleted' + a.id + '" data-id="' + a.id + '">' + a.username + "</span>"))) : (b.container.trigger("employeeComfirm", {
						objs: a
					}), $(b.preEl).removeClass("hide"), $("#employee-seleted").addClass("hide"), b.remove())
				});
				a.on("click.seleted", "#j_a-comfirm", function(a) {
					a = b.getAllChecked();
					b.container.trigger("employeeComfirm", {
						objs: a
					});
					$(b.preEl).removeClass("hide");
					$("#employee-seleted").addClass("hide");
					b.remove()
				});
				a.on("tap.seleted", "#search-keyword-tap", function(a) {
					setTimeout(function() {
						$("#employee-seleted").hide();
						$("#searchResult-employee").show();
						$("#search-keyword-employee").focus()
					}, 100)
				});
				a.on("tap.seleted", ".j_icon-cancel-circle", function(a) {
					$("#search-keyword-employee").val("");
					$("#j_memb-list-container-search").empty()
				});
				a.on("tap.seleted", ".j_cancle-search", function(a) {
					a.stopPropagation();
					setTimeout(function() {
						$("#employee-seleted").show();
						$("#searchResult-employee").hide;
						$("#search-keyword-employee").val("");
						$("#j_memb-list-container-search").empty()
					}, 100)
				});
				a.on("change", $("#search-keyword-employee"), function(a) {
					(a = $("#search-keyword-employee").val()) && 0 < $.trim(a).length && b.searchUser($("#j_memb-list-container-search"), a)
				});
				$("#employee-form").submit(function() {
					var a = $("#search-keyword-employee").val();
					a && 0 < $.trim(a).length && b.searchUser($("#j_memb-list-container-search"), a);
					return !1
				});
				a.on("click.seleted", "#j_a-back", function(a) {
					$(b.preEl).removeClass("hide");
					$("#employee-seleted").addClass("hide");
					b.remove()
				})
			},
			render: function() {
				this.renderUserList();
				this.reload || (this.searchUser($("#j_memb-list-container")), this.reload = !0)
			},
			searchUser: function(b, a) {
				var c = this,
					d = "";
				b.append($("#data-loading-clone").clone().removeAttr("id"));
				var e = {
					pageNo: 1,
					pageSize: 1E3,
					isContainsSub: !1,
					"employee.status": "normal"
				};
				a && (e["employee.username"] = a);
				"timecard" == c.module ? (d = "/users/others.json", e.id = TEAMS.currentUser.id, $("#seleted-title").html("人员选择"), $(".invite-row").remove()) : "subs" == c.shareType ? (d = "/users/allsubordinate/" + TEAMS.currentUser.id + ".json", e.allSubordinate = !0, $(".invite-row").remove()) : d = "/base/employee/pageQuery.json";
				$.ajax({
					type: "post",
					url: d,
					dataType: "json",
					data: e,
					success: function(a) {
						b.find(".j_data-loading").remove();
						if ((a = a.page) && a.result && 0 < a.result.length) {
							b.empty();
							a = a.result;
							for (var d = 0; d < a.length; d++) {
								var e = a[d],
									h = e.id,
									l = "";
								e.pinyin ? (l = e.pinyin.substring(0, 1).toLocaleUpperCase(), /^[A-Za-z]+$/.test(l) || (l = "degit")) : l = "degit";
								var n = b.find("#user-list-" + l);
								if (1 == n.size()) {
									var m = $("#employee-info-clone").clone().attr("id", h);
									m.find(".j_name").html(e.username);
									m.data("employee", e);
									e.avatar && m.find("img").attr("src", "/base/download/" + e.avatar.p5);
									m = c.isSeleted(e, m);
									n.append(m)
								} else m = $("#employee-clone").clone(), m.find(".j_com-list").attr("id", "user-list-" + l), m.find(".j_letter-hd").html("degit" == l ? "#" : l), b.append(m.html()), h = $("#employee-info-clone").clone().attr("id", h), h.find(".j_name").html(e.username), h.data("employee", e), e.avatar && h.find("img").attr("src", "/base/download/" + e.avatar.p5), h = c.isSeleted(e, h), b.find("#user-list-" + l).append(h)
							}
						} else b.empty(), b.append($("#load-tip-employee").clone().removeAttr("id"));
						1 >= TEAMS.currentTenant.usedLicense ? b.append($("#invite-clone").clone().removeAttr("id").removeClass("hide")) : b.append($("#invite-b-clone").clone().removeAttr("id").removeClass("hide"))
					}
				})
			},
			renderUserList: function() {
				this.container.find("span").each(function(b) {
					$(this).attr("data-id") && ($(this).hasClass("nochange") ? $("#j_memb-names").append('<span class="nochange" id="seleted' + $(this).attr("data-id") + '" data-id="' + $(this).attr("data-id") + '">' + $(this).text() + "</span>") : $("#j_memb-names").append('<span id="seleted' + $(this).attr("data-id") + '" data-id="' + $(this).attr("data-id") + '">' + $(this).text() + "</span>"))
				})
			},
			isSeleted: function(b, a) {
				for (var c = $("#j_memb-names").children(), d = 0; d < c.length; d++) {
					var e = $(c[d]);
					if (e.attr("data-id") == b.id) {
						a.addClass("selected");
						e.hasClass("nochange") && a.addClass("nochange");
						break
					}
				}
				return a
			},
			getAllChecked: function() {
				var b = [];
				$("#j_memb-list-container .j_employee-info.selected").each(function() {
					var a = $(this).data("employee");
					$(this).hasClass("nochange") && (a.nochange = !0);
					b.push(a)
				});
				return b
			},
			remove: function() {
				$("#employee-container").off(".seleted");
				$("#employee-container").remove()
			}
		}
	});
});
