define("form/component/approveuser", ["form/component", "form/tplutil", "form/component/userselecter"], function() {
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = require("form/component/userselecter");
	
	window.ApproveUser = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "ApproveUser",
				title: "审批人",
				titleLayout: "field-vertical",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				size: "large",  //控件尺寸 
				isWriteApproveOpinion: !1,//是否填写审批意见
				approveOpinion: "",//审批意见
				approveUser:"",//审批人-默认当前登录人
				approveTime:"",//审批时间
				approveOrder:"",//排列顺序-多人会签时的显示顺序  默认正序
				isShowCompName:!1,//用于描述审批意见中，是否显示控件的名称--默认否
				processActivity:"",//表单关联流程的环节
				isReadonly: !1,
				borderColor:"",//边框颜色
				islist:true //是否列表显示
			};
			null != a && (this.componentSetup.title = a.title, 
					this.componentSetup.titleLayout = a.titleLayout, 
					this.componentSetup.size = a.size, 
					this.componentSetup.isWriteApproveOpinion = a.isWriteApproveOpinion, 
					this.componentSetup.approveOpinion = a.approveOpinion, 
					this.componentSetup.approveUser = a.approveUser, 
					this.componentSetup.approveTime = a.approveTime, 
					this.componentSetup.approveOrder = a.approveOrder, 
					this.componentSetup.isShowCompName = a.isShowCompName, 
					this.componentSetup.processActivity = a.processActivity, 
					this.componentSetup.describe = a.describe, 
					this.componentSetup.order = a.order, 
					this.componentSetup.index = a.index, 
					this.componentSetup.required = a.required, 
					this.componentSetup.islist = a.islist,
					this.componentSetup.fieldId = a.fieldId, 
					this.componentSetup.borderColor = a.borderColor,
					this.componentSetup.isReadonly = a.isReadonly);
			this.tpl = l.get("approveuser")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setIsWriteApproveOpinion: function(a) {
			this.componentSetup.isWriteApproveOpinion = a
		},
		setApproveOpinion: function(a) {
			this.componentSetup.approveOpinion = a
		},
		setApproveUser: function(a) {
			this.componentSetup.approveUser = a
		},
		setApproveTime: function(a) {
			this.componentSetup.approveTime = a
		},
		setApproveOrder: function(a) {
			this.componentSetup.approveOrder = a
		},
		setIsShowCompName: function(a) {
			this.componentSetup.isShowCompName = a
		},
		setProcessActivity: function(a) {
			this.componentSetup.processActivity = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setIsList: function(b) {
			this.componentSetup.islist = b
		},
		setIsReadonly: function(a) {
			this.componentSetup.isReadonly = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setBorderColor:function(a){
			this.componentSetup.borderColor = a
		},
		render: function(a) {
			var b = $(this.tpl).siblings("#form-approveuser");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			a.attr("class", b.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.attr("tempId",this.componentSetup.fieldId);
			a.html(b.html())
		},
		renderEditor: function(f) {
			var a = $(this.tpl).siblings("#editor-approveuser");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			a.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			"true" != this.componentSetup.isWriteApproveOpinion && 1 != this.componentSetup.isWriteApproveOpinion || a.find("#approveOpinion").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || a.find("#isList").attr("checked", "true");
			var b = !1,
				e = !1;
			if ("true" == this.componentSetup.isWriteApproveOpinion || 1 == this.componentSetup.isWriteApproveOpinion) b = !0;
			a.find("#approveOpinion").attr("checked", b);
			$("#editor-component").html(a.html())
			this.getAllActivitis(a,this.componentSetup.processActivity,f);
		},
		renderPreview: function(a, b, d) {
			var e = $(this.tpl),
				f = null,
				f = null == TEAMS.currentUser ? e.siblings("#nouser-preview") : "mobile" != window.systemInfo_form ? e.siblings("#preview-employee") : e.siblings("#mobile-preview");
			f.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || f.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (f.find(".field-description").text(this.componentSetup.describe), f.find(".field-description").show());
			f.find(".check_js").attr("id", this.componentSetup.fieldId + this.cid).attr("name", this.componentSetup.fieldId);
			f.attr("id", "field_" + this.componentSetup.fieldId);
			f.find(".check_js").data("componentData", this);
			"mobile" == window.systemInfo_form && f.find(".entity-seleted").attr("id", this.componentSetup.fieldId);
			var g = this.componentSetup.isUnique,
				e = this.componentSetup.fieldId + this.cid,
				k = this.componentSetup.isReadonly;
			if ("true" == g || 1 == g)"mobile" != window.systemInfo_form ? f.find("#searchemployee").removeAttr("data-multi") : f.find(".js_useritem_container").attr("data-multi", "false");
			if ("true" == k || 1 == k || d)"mobile" != window.systemInfo_form ? this.readOnly(f, !0) : f.find(".js_useritem_container").removeClass("entity-seleted").text("");
			b || (b = "true" == this.componentSetup.isCurrentEmployee || 1 == this.componentSetup.isCurrentEmployee, this.initCurrentSystemUser(f.find("#" + e), b, k));
			f.addClass(this.componentSetup.titleLayout);
			this.el = a;
			a.append(f);
			this.getValue(f)
		},
		renderEditPreview: function(a) {
			var b = $(this.tpl).siblings("#form-approveuser");
			b.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (b.find(".field-description").text(this.componentSetup.describe), b.find(".field-description").show());
			b.attr("id", this.componentSetup.fieldId);
			b.data("componentData", this);
			b.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.addClass(this.componentSetup.titleLayout);
			if(this.componentSetup.borderColor!=""){
				b.find(".widget-title .widget-title_js").css({"color":this.componentSetup.borderColor});
				b.find(".widget-content .field-description").css({"color":this.componentSetup.borderColor});
			}
			a.append(b);
		},
		renderStatSearch: function(a) {
			var b = this,
				d = $(this.tpl).siblings("#statsearch-approveuser"),
				e = a.parentEl;
			a = a.container;
			var f = (new Date).getTime();
			d.find(".j_usercontainer").attr("id", "j_employee" + f);
			e.attr("class", "sch-group j_formFieldSearchGroup");
			e.find(".j_formField-condition").html(d);
			var g = $(a + " #j_employee" + f + " #typeahead-employee");
			window.typeahead && window.typeahead.init && window.typeahead.init({
				el: a + " #j_employee" + f + " #typeahead-employee",
				callback: function(a) {
					if (a && !$.isEmptyObject(a)) {
						var d = g.parents(".j_usercontainer").find(".j_selected");
						b.renderTypeheader(d, a)
					}
				}
			})
		},
		submitCheck: function(a, b) {
			var d = this.check(a, "submit");
			b(d)
		},
		getAllActivitis:function(a,b,f){
			if(!f.processDefinionId || f.processDefinionId=="" ){
				return;
			}else{
				d = f.processDefinionId;
			}
			$.ajax({
				type: "GET",
				data: {
					processDefinitionId: d
				},
				dataType: "json",
				url: "/iform/process_ctr/getAllActivitis",
				success: function(data) {
					if(data!=null || data!=""){
						var g = '<option value=""></option>';
						for(var i=0;i<data.length;i++){
							var activityId = data[i].id;
							var activityName = data[i].name;
							g += '<option value="' + activityId + '">' + activityName + "</option>"
						}
						a.find("#approve_allActivitis").html(g);
						a.find("select[id='approve_allActivitis'] option[value='" + b + "']").attr("selected", "selected");
						$("#editor-component").html(a.html());
					}
				},
				error: function() {
//					alert("error--获取不到流程环节");
				}
			})
		},
		checkEvents: function(a) {
			var c = this,
				d = c.el || $(document),
				e = c.componentSetup.fieldId + this.cid;
			(new this.employeeAhead({})).initAhead(e);
			var f = $("#" + e + " #searchemployee"),
				g = c.componentSetup.isUnique;
			if ("mobile" == window.systemInfo_form) d.on("click", "#" + e + " .employee-seleted", function(a) {
				if ($(this).attr("disabled")) utils.notify("没有权限");
				else {
					a = $(this).attr("data-module");
					var c = $(this).attr("data-targetId"),
						d = $(this).attr("data-multi"),
						e = $(this).attr("data-noempty") && "true" == $(this).attr("data-noempty") ? !0 : !1,
						f = $(this).parents(".j_page-view"),
						g = $(this).attr("data-title"),
						h = f.attr("id"),
						l = $(this);
					(new b).render("mb", {
						el: l,
						targetId: c,
						module: a,
						multi: d,
						preEl: "#" + h,
						noempty: e,
						title: g
					});
					f.addClass("hide");
					$("#employee-seleted").removeClass("hide")
				}
			});
			else f && 0 < f.size() && f.click(function() {
				var a = $("#" + e + " .js_useritem_container .js_form-userItem");
				$("#" + e + " .control-input").trigger("focusout", "tt");
				var c = [];
				a && 0 < a.length && a.each(function(a) {
					a = $(this).find(".usercard-toggle").attr("userid");
					var b = $(this).find(".usercard-toggle").text();
					c.push({
						username: b,
						id: a
					})
				});
				(new b).render("pc", {
					isMulti: "true" == g || 1 == g ? !1 : !0,
					users: c,
					target: f
				})
			});
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
			d.on("focusout", "#" + e + " .control-input", function(a, b) {
				var c = $(this).parents(".typeahead-wrapper");
				c.data("enter") && "tt" != b || (c.addClass("hide"), c.next(".control-btn").removeClass("hide"))
			});
			d.on("click.tt", "#" + e + " #searchList>p", function() {
				var a = $("#" + e);
				a.parents(".field_js").find(".form-error").text("");
				a.parents(".field_js").find(".form-error").hide();
				var b = $(this).data("obj"),
					d = b.id,
					b = '<span name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + d + ' class="usercard-toggle">' + b.username + '</a><a class="close js_deleteEmployee" title="删除">&times;</a></span>',
					f = c.componentSetup.isUnique,
					g = $("#" + e + " .js_useritem_container .js_form-userItem"),
					h = !0;
				"true" == f || 1 == f ? a.find(".js_useritem_container").empty() : g && g.each(function(a) {
					d == $(this).find(".usercard-toggle").attr("userid") && ($(this).remove(), h = !1)
				});
				a.find(".js_useritem_container").append(b);
				h && c.saveComponentValue($(this))
			});
			d.on("click", "#" + e + " .js_deleteEmployee", function() {
				var b = $(this).parents("#" + e);
				$(this).parent().remove();
				var d = c.check(b, "change");
				a(d);
				null == d.message && c.saveComponentValue(b)
			});
			d.on("confirmHandler", "#" + e + " #searchemployee", function(a, b) {
				var c = $("#" + e);
				c.parents(".field_js").find(".form-error").text("");
				c.parents(".field_js").find(".form-error").hide();
				c = $("#" + e + " .js_useritem_container").html("");
				if (0 < b.objs.length) {
					var d = b.objs,
						f;
					for (f in d) {
						var g = d[f],
							g = $('<span name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + g.id + ' class="usercard-toggle">' + g.username + '</a><a class="close js_deleteEmployee" title="删除">&times;</a></span>');
						c.append(g)
					}
				}
			});
			if ("mobile" == window.systemInfo_form) d.on("employeeComfirm", "#" + e, function(a, b) {
				var d = $("#" + e + " .js_useritem_container"),
					f = c.componentSetup.isUnique;
				d.text("");
				d.parents("#field_" + c.componentSetup.fieldId).find(".form-error").text("");
				"true" != f && 1 != f || d.empty();
				if (0 < b.objs.length) {
					var f = b.objs,
						g;
					for (g in f) {
						var h = f[g];
						if (h) {
							var l = $("<span data-id=" + h.id + ' name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + h.id + ' class="usercard-toggle">' + h.name + "，</a></span>");
							d.append(l)
						}
					}
				} else h = b.objs, l = $("<span data-id=" + h.id + ' name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + h.id + ' class="usercard-toggle">' + h.name + "，</a></span>"), 0 == h.length ? d.text("请选择人员") : d.append(l);
				d = $(this).find("span:last a").text();
				d = d.substring(0, d.indexOf("，"));
				$(this).find("span:last a").text(d)
			})
		},
		check: function(a, b) {
			var d = $(a).find('span[name="js_form-userItem"]').length,
				e = {};
			e.element = a;
			0 != d || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			return e
		},
		getValue: function(a) {
			var b = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			};
			a = a.find(".js_useritem_container .js_form-userItem");
			if (0 < a.length) {
				var d = [],
					e = "";
				a.each(function(a) {
					var b = $(this).find(".usercard-toggle").attr("userid"),
						c = $(this).find(".usercard-toggle").text();
					e += c + ",";
					d[a] = {
						optionId: b,
						content: c
					}
				});
				b.dataOptions = d;
				0 != d.length && (this.oldValue = e.substring(0, e.length - 1))
			} else b = null;
			return b
		},
		setValue: function(a, b) {
			a.find(".js_useritem_container").empty();
			if (null != b && null != b.dataOptions) {
				for (var d = "", e = 0; e < b.dataOptions.length; e++) {
					var f = b.dataOptions[e],
						g = null == f.content ? "" : f.content,
						f = f.optionId,
						d = d + (g + ",");
					null != a.find(".js_form-userItem-add").get(0) ? a.find(".js_useritem_container").append($('<span name="js_form-userItem" class="js_form-userItem employee-item" data-id=' + f + "><a userid=" + f + ' class="usercard-toggle">' + g + '</a><a class="close js_deleteEmployee" title="删除">&times;</a></span>')) : a.find(".js_useritem_container").append($('<span name="js_form-userItem" class="js_form-userItem employee-item" data-id=' + f + "><a userid=" + f + ' class="usercard-toggle">' + g + "</a></span>"))
				}
				this.oldValue = "";
				0 != b.dataOptions.length && (this.oldValue = d.substring(0, d.length - 1))
			}
		},
		empty: function(a) {
			a.find(".js_useritem_container").html("")
		},
		readOnly: function(a, b) {
			var d = this.componentSetup.fieldId + this.cid,
				e = a.find('div[id="' + d + '"] span[name="js_form-userItem-add"]'),
				f = a.find('div[id="' + d + '"] span[name="js_form-userItem"]'),
				g = a.find('div[id="' + d + '"] .js_deleteEmployee');
			b ? (e.remove(), g.remove()) : e && 0 != e.length && null != e || (e = $(this.tpl).siblings("#preview-employee").find('span[name="js_form-userItem-add"]'), a.find('div[id="' + d + '"]').find(".js_useritem_container").after(e), f.append('<a class="close js_deleteEmployee" title="删除">&times;</a>'))
		},
		getIdArray: function(a) {
			var b = [];
			a && a.each(function(a) {
				a = $(this).find(".usercard-toggle").attr("userid");
				b.push(a)
			});
			return b
		},
		initCurrentSystemUser: function(a, b, d) {
			b && $(document).trigger("currentUser", function(b) {
				var c = b.username;
				b = b.id;
				var g = a.find(".js_useritem_container"),
					k = $('<span name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + b + ' class="usercard-toggle">' + c + '</a><a class="close js_deleteEmployee" title="删除">&times;</a></span>');
				if ("true" == d || 1 == d) k = $('<span name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + b + ' class="usercard-toggle">' + c + "</a>");
				"mobile" == window.systemInfo_form && (g.text(""), k = $("<span data-id=" + b + ' name="js_form-userItem" class="js_form-userItem employee-item"><a userid=' + b + ' class="usercard-toggle">' + c + "</a>"));
				g.append(k)
			})
		},
		renderTypeheader: function(a, b) {
			if (b.length) for (var d = 0; d < b.length; d++) {
				var e = b[d],
					f = e.name,
					g = e.id;
				if (f && g) {
					var k = '<span class="entity-item"><a id=' + g + ">" + f + "</a></span>";
					a.find(".entity-item").each(function(a) {
						g == $(this).find("a").attr("id") && (k = null)
					});
					a.append(k)
				}
			} else f = b.name, g = b.id, f && g && (k = '<span class="entity-item"><a id=' + g + ">" + f + "</a></span>", a.find(".entity-item").each(function(a) {
				g == $(this).find("a").attr("id") && (k = null)
			}), a.append(k))
		},
		employeeAhead: m.extend({
			defaults: function() {
				this.suggestion = "";
				this.remote = "/search/suggestion.json";
				this.entity = "employee";
				this.tpl = l.get("employee")
			},
			initAhead: function(a) {
				this.defaults();
				this.fieldId = a;
				this.$continer = $("#" + this.fieldId);
				this._htmlEvents()
			},
			_htmlEvents: function() {
				var a = this,
					b = a.$continer,
					d = $("#" + a.fieldId + " #typeahead-form-employee");
				d.off("focus.tt").on("focus.tt", function(b) {
					a._search($(this))
				});
				d.off("click.tt").on("click.tt", function(a) {
					a.stopPropagation()
				});
				d.off("keyup.tt").on("keyup.tt", function(d) {
					d = d.which;
					13 == d ? b.find("#form-typeahead-div p.active").trigger("click.tt") : 27 == d ? a.hide() : 38 == d ? (d = $("#form-typeahead-div p.active"), 1 > d.length ? b.find("#form-typeahead-div p").last().addClass("active") : (d.removeClass("active"), (0 < d.prev().length ? d.prev() : b.find("#form-typeahead-div p").last()).addClass("active"))) : 40 == d ? (d = b.find("#form-typeahead-div p.active"), 1 > d.length ? b.find("#form-typeahead-div p").first().addClass("active") : (d.removeClass("active"), (0 < d.next().length ? d.next() : b.find("#form-typeahead-div p").first()).addClass("active"))) : a._search($(this))
				});
				b.find("#form-typeahead-div").off("mouseenter.tt", "p").on("mouseenter.tt", "p", function() {
					$(this).addClass("active");
					b.find("#form-typeahead-div p.active").removeClass("active")
				});
				b.off("click.tt", "#form-typeahead-div p").on("click.tt", "#form-typeahead-div p", function(a) {
					d.trigger("focusout", "tt")
				})
			},
			_search: function(a) {
				var b = this,
					d = b.$continer,
					e = $.trim(a.val());
				e == a.attr("placeholder") && (e = "");
				d.find("#form-typeahead-div #searchList").html("");
				d.find("#form-typeahead-div .loading_small").addClass(f).show();
				if (b.list && b.suggestion === e) b._loadList(b.list);
				else {
					var f = b.entity;
					a = b.remote;
					d = {};
					this.suggestion = e;
					d.keywords = e;
					d.searchType = b.entity;
					$.ajax({
						type: "get",
						url: a,
						dataType: "json",
						data: d,
						success: function(a) {
							a = a[f + "s"];
							b.list = a;
							b._loadList(a)
						}
					})
				}
			},
			_loadList: function(a) {
				var b = this.$continer;
				b.find("#form-typeahead-div .loading_small").hide();
				for (var d = 0, e = a.length; d < e; d++) {
					var f = a[d];
					f.name = f.name.replace(/</g, "&lt").replace(/>/g, "&gt").replace("/[\r\n]/g", " ");
					var g = $(this.tpl).siblings(".employee");
					g.find(".j_name").text(f.name);
					f.avatar && f.avatar.p5 && g.find(".avatar").attr("src", "/base/download/" + f.avatar.p5);
					g.data("obj", f);
					b.find("#form-typeahead-div #searchList").append(g)
				}
				b.find("#form-typeahead-div #searchList").show()
			}
		})
	});
	return window.ApproveUser
});
