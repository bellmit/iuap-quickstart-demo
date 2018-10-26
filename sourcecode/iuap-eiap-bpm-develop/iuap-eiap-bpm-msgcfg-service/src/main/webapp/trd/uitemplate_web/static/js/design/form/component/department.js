define("form/component/department", ["form/component", "form/tplutil", "form/component/departselecter"], function() {
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = require("form/component/departselecter");
	window.Department = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "Department",
				title: "添加部门",
				titleLayout: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				isUnique: !1,
				isCurrentDepartment: !1,
				borderColor:"",
				isReadonly: !1,
				islist:true //是否列表显示
			};
			null != a && (this.componentSetup.title = a.title, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.isUnique = a.isUnique, this.componentSetup.isCurrentDepartment = a.isCurrentDepartment,this.componentSetup.borderColor = a.borderColor, this.componentSetup.isReadonly = a.isReadonly,this.componentSetup.islist = a.islist);
			this.tpl = l.get("department")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setIsUnique: function(a) {
			this.componentSetup.isUnique = a
		},
		setIsList: function(b) {
			this.componentSetup.islist = b
		},
		setIsCurrentDepartment: function(a) {
			this.componentSetup.isCurrentDepartment = a
		},
		setIsReadonly: function(a) {
			this.componentSetup.isReadonly = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-department");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.attr("tempId",this.componentSetup.fieldId);
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-department");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || a.find("#isList").attr("checked", "true");
			var c = !1,
				b = !1,
				e = !1;
			if ("true" == this.componentSetup.isUnique || 1 == this.componentSetup.isUnique) c = !0;
			if ("true" == this.componentSetup.isCurrentDepartment || 1 == this.componentSetup.isCurrentDepartment) b = !0, a.find(".department_readonly_js").show();
			if ("true" == this.componentSetup.isReadonly || 1 == this.componentSetup.isReadonly) e = !0;
			a.find("#isUnique").attr("checked", c);
			a.find("#isCurrentDepartment").attr("checked", b);
			a.find("#isReadonly").attr("checked", e);
			$("#editor-component").html(a.html())
		},
		renderPreview: function(a, c, b) {
			var e = $(this.tpl),
				f = null,
				f = null == TEAMS.currentUser ? e.siblings("#nouser-preview") : "mobile" == window.systemInfo_form ? e.siblings("#mobile-preview") : e.siblings("#preview-department");
			f.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || f.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (f.find(".field-description").text(this.componentSetup.describe), f.find(".field-description").show());
			f.find(".check_js").attr("id", this.componentSetup.fieldId + this.cid).attr("name", this.componentSetup.fieldId);
			f.attr("id", "field_" + this.componentSetup.fieldId);
			f.find(".check_js").data("componentData", this);
			"mobile" == window.systemInfo_form && f.find(".department-seleted").attr("id", this.componentSetup.fieldId);
			var e = this.componentSetup.fieldId + this.cid,
				g = this.componentSetup.isUnique,
				k = this.componentSetup.isReadonly;
			"mobile" != window.systemInfo_form || "true" != g && 1 != g || f.find(".js_departmentitem_container").attr("data-multi", "false");
			if ("true" == k || 1 == k || b)"mobile" != window.systemInfo_form ? this.readOnly(f, !0) : f.find(".js_departmentitem_container").removeClass("department-seleted").text("");
			c || (c = "true" == this.componentSetup.isCurrentDepartment || 1 == this.componentSetup.isCurrentDepartment, this.initCurrentSystemDept(f.find("#" + e), c, k));
			f.addClass(this.componentSetup.titleLayout);
			this.el = a;
			a.append(f);
			this.getValue(f)
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-department");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.attr("id", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				c.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				c.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		renderStatSearch: function(a) {
			var c = this,
				b = $(this.tpl).siblings("#statsearch-department"),
				e = a.parentEl;
			a = a.container;
			var f = (new Date).getTime();
			b.find(".j_deptcontainer").attr("id", "j_department" + f);
			e.attr("class", "sch-group j_formFieldSearchGroup");
			e.find(".j_formField-condition").html(b);
			var g = $(a + " #j_department" + f + " #typeahead-department");
			window.typeahead && window.typeahead.init && window.typeahead.init({
				el: a + " #j_department" + f + " #typeahead-department",
				callback: function(a) {
					if (a && !$.isEmptyObject(a)) {
						var b = g.parents(".j_deptcontainer").find(".j_selected");
						c.renderTypeheader(b, a)
					}
				}
			})
		},
		submitCheck: function(a, c) {
			var b = this.check(a, "submit");
			c(b)
		},
		checkEvents: function(a) {
			var c = this,
				d = c.el || $(document),
				e = c.componentSetup.fieldId + this.cid;
			(new this.departmentAhead({})).initAhead(e);
			d.on("mouseenter.typeahead", "#" + e + " .typeahead-wrapper", function(a) {
				$(this).data("enter", !0)
			}).on("mouseleave.typeahead", "#" + e + " .typeahead-wrapper", function(a) {
				$(this).data("enter", !1)
			});
			d.on("click", "#" + e + " .control-btn", function(a) {
				a.stopPropagation();
				$(this).addClass("hide");
				$(this).prev(".typeahead-wrapper").removeClass("hide");
				$(this).prev(".typeahead-wrapper").find(".control-input").focus()
			});
			d.on("focusout", "#" + e + " .control-input", function(a, c) {
				var b = $(this).parents(".typeahead-wrapper");
				b.data("enter") && "tt" != c || (b.addClass("hide"), b.next(".control-btn").removeClass("hide"))
			});
			d.on("click.tt", "#" + e + " #searchList>p", function() {
				var a = $("#" + e);
				a.parents(".field_js").find(".form-error").text("");
				a.parents(".field_js").find(".form-error").hide();
				var b = $(this).data("obj"),
					d = b.id,
					b = '<span class="js_form-userItem employee-item department-item" name="js_form-userItem"><a departmentid=' + d + ">" + b.name + '</a><a class="close js_deleteDepartment" title="删除">&times;</a></span>',
					p = c.componentSetup.isUnique,
					h = $("#" + e + " .js_departmentitem_container .js_form-userItem"),
					l = !0;
				"true" == p || 1 == p ? a.find(".js_departmentitem_container").empty() : h && h.each(function(a) {
					d == $(this).find("a[departmentid]").attr("departmentid") && ($(this).remove(), l = !1)
				});
				a.find(".js_departmentitem_container").append(b);
				l && c.saveComponentValue($(this))
			});
			d.on("click", "#" + e + " .js_deleteDepartment", function() {
				var b = $(this).parents("#" + e);
				$(this).parent().remove();
				var d = c.check(b, "change");
				a(d);
				null == d.message && c.saveComponentValue(b)
			});
			if ("mobile" == window.systemInfo_form) d.on("click", "#" + e + " .j_department-seleted", function(a) {
				a = $(this).attr("data-multi");
				var c = $(this).parents(".j_page-view"),
					d = c.attr("id"),
					e = $(this);
				(new b).render("mb", {
					el: e,
					multi: a,
					preEl: "#" + d
				});
				c.addClass("hide");
				$("#department-component").removeClass("hide")
			});
			else d.on("click", "#" + e + " #search-department", function(a) {
				(new b).render("pc", {
					target: $(this)
				});
				a = $(this).parents(".typeahead-wrapper");
				0 < a.length && a.find(".control-input").trigger("focusout", "tt")
			});
			d.on("confirmHandler", "#" + e + " #search-department", function(a, b) {
				var d = $("#" + e);
				d.parents(".field_js").find(".form-error").text("");
				d.parents(".field_js").find(".form-error").hide();
				var p = c.componentSetup.isUnique,
					d = $("#" + e + " .js_departmentitem_container"),
					h = $("#" + e + " .js_departmentitem_container .js_form-userItem"),
					h = c.getIdArray(h);
				"true" != p && 1 != p || d.empty();
				var p = b.objs,
					l = '<span name="js_form-userItem" class="js_form-userItem employee-item department-item"><a departmentid=' + p.id + ">" + p.name + '</a><a class="close js_deleteDepartment" title="删除">&times;</a></span>',
					n;
				for (n in h)
				p.id == h[n] && (l = null);
				d.append(l)
			});
			if ("mobile" == window.systemInfo_form) d.on("departmentComfirm", "#" + e, function(a, b) {
				var d = $("#" + e + " .js_departmentitem_container"),
					p = c.componentSetup.isUnique;
				d.text("");
				d.parents("#field_" + c.componentSetup.fieldId).find(".form-error").text("");
				"true" != p && 1 != p || d.empty();
				if (b.objs.length) {
					var p = b.objs,
						h;
					for (h in p) {
						var l = p[h];
						if (l) {
							var n = $('<span class="js_form-userItem" name="js_form-userItem" data-id=' + l.id + " id=" + l.id + ">" + l.name + "，</span>");
							d.append(n)
						}
					}
				} else l = b.objs, n = $('<span class="js_form-userItem" name="js_form-userItem" data-id=' + l.id + " id=" + l.id + ">" + l.name + "，</span>"), 0 == l.length ? d.text("请选择部门") : d.append(n);
				d = $(this).find("span:last").text();
				d = d.substring(0, d.indexOf("，"));
				$(this).find("span:last").text(d)
			})
		},
		check: function(a, c) {
			var b = $(a).find('span[name="js_form-userItem"]').length,
				e = {};
			e.element = a;
			0 != b || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			return e
		},
		getValue: function(a) {
			var c = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			};
			a = a.find(".js_departmentitem_container .js_form-userItem");
			if (0 < a.length) {
				var b = [],
					e = "";
				a.each(function(a) {
					var c = $(this).find("a").eq(0).attr("departmentid"),
						k = $(this).find("a").eq(0).text();
					e += k + ",";
					"mobile" == window.systemInfo_form && (c = $(this).attr("id"), k = $(this).text());
					b[a] = {
						optionId: c,
						content: k
					}
				});
				c.dataOptions = b;
				0 != b.length && (this.oldValue = e.substring(0, e.length - 1))
			} else c = null;
			return c
		},
		setValue: function(a, c) {
			a.find(".js_departmentitem_container").empty();
			if (null != c && null != c.dataOptions) {
				for (var b = "", e = 0; e < c.dataOptions.length; e++) {
					var f = c.dataOptions[e],
						g = null == f.content ? "" : f.content,
						f = f.optionId,
						b = b + (g + ",");
					"mobile" != window.systemInfo_form ? null != a.find(".js_form-userItem-add").get(0) ? a.find(".form-departmentList .js_departmentitem_container").append($('<span class="js_form-userItem employee-item department-item" name="js_form-userItem" data-id=' + f + "><a departmentid=" + f + ">" + g + '</a><a class="close js_deleteDepartment" title="删除">&times;</a></span>')) : a.find(".form-departmentList .js_departmentitem_container").append($('<span class="js_form-userItem employee-item department-item" name="js_form-userItem" data-id=' + f + "><a departmentid=" + f + ">" + g + "</a></span>")) : a.find(".form-departmentList .js_departmentitem_container").append($('<span class="js_form-userItem" name="js_form-userItem" data-id=' + f + " id=" + f + ">" + g + "</span>"))
				}
				this.oldValue = "";
				0 != c.dataOptions.length && (this.oldValue = b.substring(0, b.length - 1))
			}
		},
		empty: function(a) {
			a.find(".js_departmentitem_container").html("")
		},
		readOnly: function(a, c) {
			var b = this.componentSetup.fieldId + this.cid,
				e = a.find('div[id="' + b + '"] span[name="js_form-userItem-add"]'),
				f = a.find('div[id="' + b + '"] span[name="js_form-userItem"]'),
				g = a.find('div[id="' + b + '"] .js_deleteDepartment');
			c ? (e.remove(), g.remove()) : e && 0 != e.length && null != e || (e = $(this.tpl).siblings("#preview-department").find('span[name="js_form-userItem-add"]'), a.find('div[id="' + b + '"]').find(".js_departmentitem_container").after(e), f.append('<a class="close js_deleteDepartment">&times;</a>'))
		},
		getIdArray: function(a) {
			var c = [];
			a && a.each(function(a) {
				a = $(this).find("a[departmentid]").attr("departmentid");
				c.push(a)
			});
			return c
		},
		initCurrentSystemDept: function(a, c, b) {
			"true" != this.componentSetup.isCurrentDepartment && 1 != this.componentSetup.isCurrentDepartment || $(document).trigger("currentDepartment", function(c) {
				var f = c.name;
				c = c.id;
				var g = a.find(".js_departmentitem_container"),
					k = $('<span name="js_form-userItem" class="js_form-userItem employee-item department-item"><a departmentid=' + c + ">" + f + '</a><a class="close js_deleteDepartment" title="删除">&times;</a></span>');
				if ("true" == b || 1 == b) k = $('<span name="js_form-userItem" class="js_form-userItem employee-item department-item"><a departmentid=' + c + ">" + f + "</a></span>");
				"mobile" == window.systemInfo_form && (g.text(""), k = $("<span data-id=" + c + ' name="js_form-userItem" class="js_form-userItem" id=' + c + ">" + f + "</span>"));
				g.append(k)
			})
		},
		renderTypeheader: function(a, c) {
			if (c.length) for (var b = 0; b < c.length; b++) {
				var e = c[b],
					f = e.name,
					g = e.id;
				if (f && g) {
					var k = '<span class="entity-item"><a id=' + g + ">" + f + "</a></span>";
					a.find(".entity-item").each(function(a) {
						g == $(this).find("a").attr("id") && (k = null)
					});
					a.append(k)
				}
			} else f = c.name, g = c.id, f && g && (k = '<span class="entity-item"><a id=' + g + ">" + f + "</a></span>", a.find(".entity-item").each(function(a) {
				g == $(this).find("a").attr("id") && (k = null)
			}), a.append(k))
		},
		departmentAhead: m.extend({
			defaults: function() {
				this.suggestion = "";
				this.remote = "/search/suggestion.json";
				this.entity = "department";
				this.tpl = l.get("department")
			},
			initAhead: function(a) {
				this.defaults();
				this.fieldId = a;
				this.$continer = $("#" + this.fieldId);
				this._htmlEvents()
			},
			_htmlEvents: function() {
				var a = this,
					c = a.$continer,
					b = $("#" + a.fieldId + " #typeahead-form-department");
				b.off("focus.tt").on("focus.tt", function(c) {
					a._search($(this))
				});
				b.off("click.tt").on("click.tt", function(a) {
					a.stopPropagation()
				});
				b.off("keyup.tt").on("keyup.tt", function(b) {
					b = b.which;
					13 == b ? c.find("#typeahead-div p.active").trigger("click.tt") : 27 == b ? a.hide() : 38 == b ? (b = c.find("#typeahead-div p.active"), 1 > b.length ? c.find("#typeahead-div p").last().addClass("active") : (b.removeClass("active"), (0 < b.prev().length ? b.prev() : c.find("#typeahead-div p").last()).addClass("active"))) : 40 == b ? (b = c.find("#typeahead-div p.active"), 1 > b.length ? c.find("#typeahead-div p").first().addClass("active") : (b.removeClass("active"), (0 < b.next().length ? b.next() : c.find("#typeahead-div p").first()).addClass("active"))) : a._search($(this))
				});
				c.find("#typeahead-div").off("mouseenter.tt", "p").on("mouseenter.tt", "p", function() {
					$(this).addClass("active");
					c.find("#typeahead-div p.active").removeClass("active")
				});
				c.off("click.tt", "#typeahead-div p").on("click.tt", "#typeahead-div p", function(a) {
					b.trigger("focusout", "tt")
				})
			},
			_search: function(a) {
				var c = this,
					b = $.trim(a.val()),
					e = c.$continer;
				b == a.attr("placeholder") && (b = "");
				e.find("#typeahead-div #searchList").html("");
				e.find("#typeahead-div .loading_small").addClass(f).show();
				if (c.list && c.suggestion === b) c._loadList(c.list);
				else {
					var f = c.entity;
					a = c.remote;
					e = {};
					this.suggestion = b;
					e.keywords = b;
					e.searchType = c.entity;
					$.ajax({
						type: "get",
						url: a,
						dataType: "json",
						data: e,
						success: function(a) {
							a = a[f + "s"];
							c.list = a;
							c._loadList(a)
						}
					})
				}
			},
			_loadList: function(a) {
				var c = this.$continer;
				c.find("#typeahead-div .loading_small").hide();
				for (var b = 0, e = a.length; b < e; b++) {
					var f = a[b];
					f.name = f.name.replace(/</g, "&lt").replace(/>/g, "&gt").replace("/[\r\n]/g", " ");
					var g = $(this.tpl).siblings(".department");
					g.find(".j_name").text(f.name);
					g.data("obj", f);
					c.find("#typeahead-div #searchList").append(g)
				}
				c.find("#typeahead-div").show()
			}
		})
	});
	return window.Department
});
