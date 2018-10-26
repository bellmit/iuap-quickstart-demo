define("teams/form/formwriteview", [
    "teams/utils",
    "teams/form/formmanagemodel",
    "teams/form/formoperationview",
    // "teams/component/entityslider",
    // "teams/component/typeahead",
    // "teams/formmanage/formdistributeview",
    // "teams/formmanage/formloglistview",
    // "teams/formmanage/formcollectloglistview",
    // "teams/component/filter",
    "teams/form/formcolor"//,
    // "teams/form/formreportconfigview",
    // "teams/form/formauthconfigview",
    // "teams/form/formcontinuewriteview",
    // "teams/form/formtag"
],
function() {
    var f = require("teams/utils"),
    d = require("teams/form/formmanagemodel"),
    c = require("teams/form/formoperationview");
    // require("teams/component/entityslider");
    // require("teams/component/typeahead");
    var /*b = require("teams/formmanage/formdistributeview"),*/
    // a = require("teams/component/filter"),
    e = require("teams/form/formcolor"),
    // g = require("teams/form/formreportconfigview"),
    // l = require("teams/form/formauthconfigview"),
    // m = require("teams/form/formcontinuewriteview"),
    h = Backbone.View.extend({
        initialize: function(a) {
            this.userId = a.userId;
            this.el = a.container ? a.container: "#j_workflowcenter";
            // this.isAdmin = TEAMS.currentUser.admin;
            // this.isWeaver = "t7akvdnf84" == TEAMS.currentTenant.tenantKey || "T7AKVDNF84" == TEAMS.currentTenant.tenantKey ? !0 : !1;
            this.type = a.type;
            a.type == "write" && (this.operationname = "复制");
            a.type == "usertempList" && (this.operationname = "定制");
            this.tpl = f.template("form.formwrite",{operationname:this.operationname}/*, {
                userId: this.userId,
                isWeaver: this.isWeaver,
                isAdmin: this.isAdmin
            }*/);
            this.model = new d(a);
            this.pageModule = "biaoge"
        },
        delegateEvents: function() {
            var d = this,
            e = d.model,
            h = $(d.tpl),
            n = $(d.el);
            /*n.off("click.FormWriteView", ".js_reportConf").on("click.FormWriteView", ".js_reportConf",
            function() {
                if ($(this).parents(".js_formboxli").hasClass("unpublished") || $(this).parents(".js_formboxli").hasClass("stopped")) return f.notify("请发布表单后再上报！"),
                !1;
                var a = $(this).attr("formId");
                e.getFiledByForm({
                    formId: a
                },
                function(b) {
                    if (b.formFields && 0 != b.formFields.length) d.formreportconfigview = new g({
                        parentEl: d.el,
                        userId: d.userId,
                        formId: a,
                        callback: function(a) {
                            d.formreportconfigview.hide()
                        }
                    }),
                    d.formreportconfigview.render();
                    else return f.notify("请为表单添加内容再上报！"),
                    !1
                })
            });*/
            /*n.on("click.FormWriteView", ".j_dataReportConfig",
            function() {
                if ($(this).parents(".js_formboxli").hasClass("unpublished") || $(this).parents(".js_formboxli").hasClass("stopped")) return f.notify("请发布表单后再操作！"),
                !1
            });*/
            /*n.on("click.FormWriteView", ".js_authConfig",
            function() {
                if ($(this).parents(".js_formboxli").hasClass("unpublished") || $(this).parents(".js_formboxli").hasClass("stopped")) return f.notify("请发布表单后再上报！"),
                !1;
                var a = $(this).attr("formId");
                e.getFiledByForm({
                    formId: a
                },
                function(b) {
                    if (b.formFields && 0 != b.formFields.length) d.formauthconfigview = new l({
                        parentEl: d.el,
                        userId: d.userId,
                        formId: a,
                        callback: function(a) {
                            d.formauthconfigview.hide()
                        }
                    }),
                    d.formauthconfigview.render();
                    else return f.notify("请为表单添加内容再上报！"),
                    !1
                })
            });*/
            /*n.on("click.FormCompanyView", ".js_continueWrite",
            function() {
                if ($(this).parents(".js_formboxli").hasClass("unpublished") || $(this).parents(".js_formboxli").hasClass("stopped")) return f.notify("请发布表单后再持续填写！"),
                !1;
                var a = $(this).attr("formId");
                e.getFiledByForm({
                    formId: a
                },
                function(b) {
                    if (b.formFields && 0 != b.formFields.length) d.formcontinuewriteview = new m({
                        parentEl: d.el,
                        userId: d.userId,
                        formId: a,
                        callback: function(a) {
                            d.formcontinuewriteview.hide()
                        }
                    }),
                    d.formcontinuewriteview.render();
                    else return f.notify("请为表单添加内容再持续填写！"),
                    !1
                })
            });*/
            $("body").on("click.FormWriteView", ".goto-top",
            function(a) {
                f.gotoTop(".js_forms." + d.activeTab)
            });
            n.on("click.FormWriteView", ".js_copyForm",
            function() {
                var a = $(this).attr("formId"),
                b = $(this).parents(".js_formListBox").find("#form-title").text(),
                e,
                g = $(this).attr("osp");
                "personal" == g ? e = !1 : "company" == g && (e = !0);
                var l = {};
                l.formId = a;
                l.module = d.pageModule;
                l.el = "#copy-form";
                l.formTitle = b;
                l.ownership = g;
                l.tpl = f.template("flow.formcopy", {
                    userId: d.userId,
                    operationtype: "复制",
                    admin: e
                });
                l.copyCallback = function(a) {
                    //var b = n.find(".js_forms." + d.activeTab + " .js_form-list .js_other .j_formlist"),
                    //var b = n.find(".js_forms." + d.activeTab + " .js_form-list .j_formlist"),
                    var b = n.find(".js_formcategory .j_formlist .js_formboxli[formid='"+a.form.sys_pk_temp+"']").closest(".j_formlist"),
                    c = h.siblings("#formitems." + d.activeTab).find(".js_formitemsli").clone();
                    d.renderPersonalForm(a.form, b, c, "prepend",a.form.temptype);
                };
                d.formoperationView = new c(l);
                d.formoperationView.render()
            });
            // 预览
            n.on("click.FormWriteView", ".js_formPreview",
            function() {
                var a = $(this).attr("formId");
                window.open("/iform/rt_ctr/open?pk_bo=" + a)
            });
            /*n.on("click.FormWriteView", ".js_formPreview-only",
            function() {
                var a = $(this).attr("formId");
                window.open("/form/preview/" + a)
            });*/
            // 重命名表单
            n.on("click.FormWriteView", ".js_renameForm",
            function() {
                var a = $(this).attr("formId");
                if (0 == $(this).parents(".js_formListBox").find('input[name="formTitle"]').length) {
                    var a = $('<input type="text" name="formTitle" style="width:100%" class="input-formTitle form-control" maxLength="50" formId=' + a + ">"),
                    b = $(this).parents(".js_formListBox").find("#form-title").text();
                    $(this).parents(".js_formListBox").find("#form-title").hide();
                    $(this).parents(".js_formListBox").find("#form-title").after(a);
                    $(this).parents(".js_formListBox").find('input[name="formTitle"]').focus().val(b)
                }
            });
            var keyCode = 0;
            // 重命名表单
            n.on("blur.FormWriteView", 'input[name="formTitle"]',
            function(event) {
                var a = $(this).attr("formId"),
                b = $.trim($(this).val()),
                c = this;
                if ("" == b || b == $(c).prev().text() || 27 == keyCode) {
                    $(c).prev().show()
                    $(c).remove()
                    keyCode = 0
                } else {
                    var d = {
                        form: {}
                    };
                    d.form.id = a;
                    d.form.name = $.trim(b);
                    // d.ownership = "personal";
                    e.renameForm(d, function(a) {
                        if (a && a.message) {
                        	$(c).prev().text(b).attr("title", b).show();
                            $(c).remove();
                            f.notify(a.message);
                        } else {
                            $(c).prev().text(b).attr("title", b).show();
                            $(c).remove();
                            f.notify("模板名称修改成功");
                        }
                    })
                }
            });
            // 重命名表单
            n.on("keydown.FormWriteView", 'input[name="formTitle"]',
            function(a) {
                keyCode = a.keyCode;
                // var b = $.trim($(this).val());
                if (keyCode == 27 || keyCode == 13) {
                    $(this).trigger("blur.FormWriteView")
                }
            });
            //启用功能
            n.on("click.FormWriteView", '.js_enableForm',
                    function(event) {
		            	var tenantid = ""; //123
		                //从cookie里面取租户id
		                if(document.cookie.split("tenantid=").length>1){
		                	document.cookie.split("tenantid=")[1].split(";") && (tenantid = document.cookie.split("tenantid=")[1].split(";")[0]);
		                }
                        var a = $(this).attr("formId"),
                        funnode = $(this).attr("funnode"),
                        nexuskey = $(this).attr("nexuskey"),
                        tenant_id = tenantid,
                        b = $.trim($(this).val()),
                        c = this;
                        var d = {
                            form: {}
                        };
                        d.form.id = a;
                        d.form.name = $.trim(b);
                        d.form.funnode = funnode;
                        d.form.nexuskey = nexuskey;
                        d.form.tenant_id = tenant_id;
                        e.enableForm(d, function(a) {
                            if (a && a.message) {
                            	$(c).closest(".js_formcategory").find("span.enablebtn").remove();
                            	$(c).closest(".js_formcategory").find("div[formid="+d.form.id+"]").find("a.j_fillCount ").append("<span class='enablebtn' style='color:blue;'>（启用）</span>");
                                f.notify(a.message);
                            } else {
                            	$(c).closest(".js_formcategory").find("span.enablebtn").remove();
                            	$(c).closest(".js_formcategory").find("div[formid="+d.form.id+"]").find("a.j_fillCount ").append("<span class='enablebtn' style='color:blue;'>（启用）</span>");
                                f.notify("模板启用成功");
                            }
                        });
            });
            
            // 新建表单
            n.off("click.FormWriteView", ".js_buildNewForm").on("click.FormWriteView", ".js_buildNewForm",
            function() {
                var a = {};
                a.module = d.pageModule;
                a.el = "#build-newform";
                a.tpl = f.template("biaoge.formnew");
                a.ownership = "personal";
                a.formwrite = "formwrite";
                a.saveCallback = function(a) {
                    d.render()
                };
                a.formCategories = []
                $(d.el).find("#custom-category .js_formcategory." + d.activeTab).each(function() {
                    var c = $(this).find("#cate-name .js_categoryname")
                    a.formCategories.push({
                        id: c.attr("id"),
                        name: c.text()
                    })
                })
                d.formoperationView = new c(a);
                d.formoperationView.render()
            });
            // 搜索
            /*n.off("click.FormWriteView", ".j_form_search").on("click.FormWriteView", ".j_form_search",
            function(a) {
                a = n.find(".js_searchkeyword");
                a = $.trim(a.val());
                var b = {
                    module: "biaoge"
                };
                b.keyword = a;
                n.find(".js_forms." + d.activeTab + " .js_form-list").empty();
                a ? d.renderKeywords(b) : (
                    n.find(".js_forms." + d.activeTab + " .js_form-list").html('<div id="custom-category"></div><div id="other-category"></div>'),
                    d.renderPersonalForms(b)
                )
            });*/
            // 搜索输入
            /*n.on("keyup.FormWriteView", ".js_searchkeyword",
            function(a) {
                13 == (a ? a: window.event ? window.event: null).keyCode && n.find(".j_form_search").click()
            });*/
            // 新建分组
            n.on("click.FormWriteView", ".js_newcategory",
            function(a) {
                a = h.siblings(".js_formcategory." + d.activeTab).clone().attr("id", "newCateId");
                a.find(".j_formcateInfo").remove();
                var b = $('<input type="text" class="form-control js_createcategory" placeholder="分类名称(ESC取消，回车键保存)" maxLength="20">');
                a.find(".js_categoryname").append(b);
                var c = n.find(".js_forms." + d.activeTab + " .js_form-list #custom-category #newCateId");
                1 == c.length ? c.find(".js_createcategory").focus() : (n.find(".js_forms." + d.activeTab + " .js_form-list #custom-category").prepend(a), b.focus())
            });
            // 新建分组
            n.on("blur.FormWriteView", ".js_createcategory",
            function(a) {
                $(this);
                var b = $.trim($(this).val());
                a = $(this).attr("placeholder");
                var c = $(this).parent(),
                g = $(this).parents(".js_formcategory." + d.activeTab);
                b == a || "" == b ? $(".js_forms." + d.activeTab + " .js_form-list #newCateId").remove() : e.createCategory({
                    "formCategory": {
                        "name": b
                    }//,
                    // "formCategory.type": "company",
                    // module: d.pageModule
                },
                function(a) {
                    a.message ? f.notify(a.message) : (
                        c.empty().text(b).next().text("(0)"),
                        c.attr("id", a.formCategory.id),
                        g.removeAttr("id"),
                        f.notify("新建表单分类成功"),
                        d.drag()
                    )
                })
            });
            // 新建分组
            n.on("keydown.FormWriteView", ".js_createcategory",
            function(a) {
                a = a.keyCode;
                var b = $.trim($(this).val());
                27 == a ? ($(this).val(""), $(this).parents(".js_formcategory." + d.activeTab).remove()) : 13 == a && ("" == b ? f.notify("请输入表单分类名称") : $(this).trigger("blur.FormWriteView"))
            });
            // 显示删除分组按钮
//            n.on("mouseenter.FormWriteView", "#custom-category #cate-name",
//            function(a) {
//                if (null == $(this).parents(".js_cloudforms").get(0)/* || d.isWeaver*/) {
//                    0 < $(this).parents(".js_other").length || 0 == $(this).find(".js_createcategory").length && (
//                        0 != $(this).find(".js_formcount .js_deletecategory").length ? 
//                            $(this).find(".js_formcount .js_deletecategory").show() : 
//                            $(this).find(".js_formcount").append('<a class="js_deletecategory btn-delecategory" title="删除">&times;</a>')
//                        )
//                }
//            });
            // 显示删除分组按钮
//            n.on("mouseleave.FormWriteView", "#custom-category #cate-name",
//            function(a) {
//                $(this).find(".js_formcount .js_deletecategory").hide()
//            });
            // 删除分组
//            n.on("click.FormWriteView", ".js_deletecategory",
//            function(a) {
//                var b = $(this);
//                f.confirm("删除分类后，该分类的表单会自动归类到【其他】中，确认删除该分类？",
//                function(a) {
//                    if (a) {
//                        a = {
//                            "formCategory": {
//                                "id": b.parents("#cate-name").find(".js_categoryname").attr("id")
//                            }
//                        };
//                        var c = b.parents(".js_formcategory." + d.activeTab).find(".j_formlist"),
//                        g = c.html(),
//                        c = c.find(".js_formitemsli");
//                        if (0 != c.length) {
//                            var h = "";
//                            c.each(function(a) {
//                                a = $(this).attr("formid");
//                                h += a + ","
//                            });
//                            a.formIds = h
//                        }
//                        e.deleteCategory(a,
//                        function(a) {
//                            b.parents(".js_formcategory." + d.activeTab).remove();
//                            n.find(".js_other .j_formlist").prepend(g);
//                            f.notify("表单类别删除成功")
//                        })
//                    }
//                })
//            });
            // 修改分组名
//            n.on("click.FormWriteView", "#formmanagelist #custom-category .js_formcategory .js_categoryname",
//            function(a) {
//                if (null == $(this).parents(".js_cloudforms").get(0)/* || d.isWeaver*/) {
//                    a = $(this).text();
//                    var b = $('<input type="text" class="form-control js_updatecatename" maxLength="20">');
//                    0 == $(this).find(".js_createcategory").length && ($(this).before(b).hide(), b.focus().val(a))
//                }
//            });
            // 修改分组名
            n.on("keydown.FormWriteView", ".js_updatecatename",
            function(a, b) {
                var c = $(this),
                g = $.trim($(this).val()),
                h = $(this).next().text(),
                l = $(this).next().attr("id"),
                m = $(this).next().attr("type"),
                p = {
                    formCategory: {}
                },
                n = a.keyCode || b;
                27 == n ? (
                    $(this).next().show(),
                    c.val(h)/*,
                    $(this).remove()*/
                ) : 13 == n && (
                    "" == g ? 
                        f.notify("请输入表单分类名称") : 
                        g != h ? (
                            p.formCategory.id = l,
                            p.formCategory.name = g,
                            // p["formCategory.type"] = m,
                            // p.module = d.pageModule,
                            e.updateCategoryName(p, function(a) {
                                a.message ? 
                                    f.notify(a.message) :
                                    (
                                        f.notify("表单分类名称修改成功"),
                                        c.next().text(g).show(),
                                        c.remove()
                                    )
                            })
                        ) : (
                            $(this).next().show(),
                            $(this).remove()
                        )
                    )
            });
            // 修改分组名
            n.on("blur.FormWriteView", ".js_updatecatename",
            function(a) {
                a = $.trim($(this).val());
                var b = $(this).next().text();
                a === b ? ($(this).next().show(), $(this).remove()) : $(this).trigger("keydown.FormWriteView", 13)
            });
            // 分组标题提示信息
            n.on("mouseenter.FormWriteView", ".j_form-category",
            function(a) { (null == $(this).parents(".js_cloudforms").get(0)/* || d.isWeaver*/) && $(this).find(".j_formcateInfo").removeClass("hide")
            });
            // 分组标题提示信息
            n.on("mouseleave.FormWriteView", ".form-category-hd",
            function(a) { (null == $(this).parents(".js_cloudforms").get(0)/* || d.isWeaver*/) && $(this).find(".j_formcateInfo").addClass("hide")
            });
            // $("body").on("relatedFlow.FormWriteView",
            // function(a, b, c) {
            //     d.setFlowsequenceIcon(b, c)
            // });
            /*n.on("mouseenter.FormWriteView", "#forms-filter",
            function(b) {
                var c = $(this).attr("data-toggle");
                d.filter || (d.filter = new a({
                    el: c,
                    module: "biaoge",
                    targetObj: $(this),
                    userId: d.userId
                }), d.filter.render(b));
                b = setTimeout(function() {
                    $(c).slideDown("fast")
                },
                300);
                $(this).data("showTimer", b);
                $(this).addClass("open")
            }).on("mouseleave.FormWriteView", "#forms-filter",
            function(a) {
                a = $(this).attr("data-toggle");
                var b = $(this).data("showTimer");
                b && clearTimeout(b);
                $(this).removeData("showTimer");
                $(a).slideUp(100);
                $(this).removeClass("open")
            }).on("filter.FormWriteView", "#forms-filter",
            function(a) {
                e.pageNo = 1;
                d.search({
                    pageNo: e.pageNo,
                    pageSize: 1E6
                })
            });*/
            /*n.on("click.FormWriteView", "#form-title",
            function() {
                switch (d.pageModule) {
                case "workflow":
                    var a = $(this).attr("skiptype");
                    void 0 != a && ("edit" === a ? $(this).parents(".js_formListBox").find(".js_editForm").trigger("click.FormWriteView") : $(this).parents(".js_formListBox").find(".js_formPreview").trigger("click.FormWriteView"))
                }
            });*/
            // 编辑表单
            n.on("click.FormWriteView", ".js_editForm",
            function() {
                var a = $(this).attr("formId");
                var b = $(this).attr("temptype");
                window.open("/uitemplate_web/?pk_temp=" + a+"&temptype="+b)
            });
            /*n.on("click.FormWriteView", ".js_shareForm",
            function() {
                var a = this;
                if ($(this).parents(".js_formboxli").hasClass("unpublished") || $(this).parents(".js_formboxli").hasClass("stopped")) f.notify("请发布表单后再分发！");
                else if ($(this).parents(".js_formboxli").hasClass("collecting")) {
                    var c = $(this).attr("formId");
                    e.getFiledByForm({
                        formId: c
                    },
                    function(d) {
                        if (d.formFields && 0 < d.formFields.length) {
                            d = $(a).parents("ul").parents("li").find("#form-title").text();
                            var e = $(a).parents("ul").parents("li").find("#form-describe").text();
                            new b({
                                container: "#baidushare",
                                shareTitle: d,
                                shareDesc: e,
                                shareUrl: window.location.protocol + "//" + window.location.host + "/biaoge/fill/" + c
                            });
                            $("#distributeModal").modal("show")
                        } else f.notify("请为表单添加内容再分发！")
                    })
                }
            });*/
            /*n.on("confirmHandler.FormWriteView", ".j_employee",
            function(a, b) {
                var c = $(this).parents("li"),
                d = c.attr("formid"),
                c = c.find("#form-title").text(),
                g = b.objs;
                if (b && g && 0 < g.length) {
                    for (var h = {},
                    k = 0; k < g.length; k++) h["userIds[" + k + "]"] = g[k].id;
                    h["form.id"] = d;
                    h["form.name"] = c;
                    e.incollect(h,
                    function(a) {
                        a.actionMsg ? f.notify(a.actionMsg.message) : f.notify("操作成功！")
                    })
                } else f.notify("请选择人员！")
            });*/
            /*n.on("click.FormWriteView", ".j_insideCollect",
            function(a, b) {
                if ($(this).parents(".js_formboxli").hasClass("unpublished") || $(this).parents(".js_formboxli").hasClass("stopped")) return f.notify("请发布表单后再内部收集！"),
                !1;
                var c = $(this).parents("ul").parents("li"),
                d = c.attr("formid");
                e.getFiledByForm({
                    formId: d
                },
                function(a) {
                    a.formFields && 0 != a.formFields.length ? c.find(".j_employee").click() : f.notify("请为表单添加内容再分发！")
                })
            });*/
            // 删除表单
            n.on("click.FormWriteView", ".js_deleteForm",
            function() {
                // if ($(this).parents(".js_formitemsli").hasClass("collecting")) f.notify("删除失败，请停用表单后重新操作！");
                // else {
                    var a = this,
                    b = $(this).attr("formId"),
                    // c = $(this).attr("type"),
                    g = {
                        form: {
                            id: b
                        }
                    };
                    /*"cloud" === c ? */d.deleteForm(a, g, c)/* : e.findCount({
                        formId: b
                    },
                    function(b) {
                        d.deleteForm(a, g, c, b.count)
                    })*/
                // }
            });
            /*
             * 停用启用
            n.on("click.FormWriteView", ".j_changeStatus",
            function() {
                var a = this,
                b = $(this).attr("formId"),
                c = $(this).attr("target-status"),
                g = $(this).text(),
                h = "",
                l = {
                    "form.id": b,
                    "form.status": c
                };
                updateStatus = function(c) {
                    c && e.updateStatus(l,
                    function(c) {
                        c = c.form.status;
                        if ("j_biaoge" == d.activeTab) {
                            var e = $(a).parents(".js_formitemsli");
                            switch (c) {
                            case "disable":
                                h = "停用";
                                e.find("#form-title").removeClass("j_entityslider-toggle");
                                e.find(".reportConfig-btn").removeClass("dropdown-menu-toggle");
                                e.removeClass("collecting unpublished").addClass("stopped");
                                e.find(".j_gatherStatus > ul").html('<li><a class="j_changeStatus" target-status="disable" formid="' + b + '">启用</a></li>');
                                break;
                            case "enable":
                                h = "启用",
                                e.find("#form-title").addClass("j_entityslider-toggle"),
                                e.find(".reportConfig-btn").addClass("dropdown-menu-toggle"),
                                e.removeClass("stopped unpublished").addClass("collecting"),
                                e.find(".j_gatherStatus > ul").html('<li><a class="j_changeStatus" target-status="enable" formid="' + b + '">停止</a></li>')
                            }
                            e.find(".j_gatherStatus > a").html(h + '<i class="caret ml-3"></i>')
                        }
                        f.notify("表单状态修改成功")
                    })
                };
                f.confirm("确定要" + g + "此表单吗？", updateStatus)
            });*/
            /*
             * 使用审批
            n.on("click.FormWriteView", ".js_useflow",
            function(a) {
                a = $(this);
                var b = TEAMS.currentUser.admin ? !0 : !1,
                e = {};
                e.formId = a.attr("formId");
                e.module = "workflow";
                e.el = "#copy-form";
                e.formTitle = a.attr("name");
                e.ownership = a.attr("ownership");
                e.tpl = f.template("flow.formcopy", {
                    userId: TEAMS.currentUser.id,
                    operationtype: "使用审批",
                    admin: b
                });
                e.copyCallback = function(a) {
                    a && a.form && "company" == a.form.ownership ? ROUTER.navigate("/workflows/" + TEAMS.currentUser.id + "/company", {
                        trigger: !0
                    }) : ROUTER.navigate("/workflows/" + TEAMS.currentUser.id + "/personal", {
                        trigger: !0
                    })
                };
                d.formoperationView = new c(e);
                d.formoperationView.render()
            });*/
            /*n.on("click.FormWriteView", ".js_changeFormStatus",
            function() {
                var a = this,
                b = $(this).attr("formId"),
                c = $(this).attr("status"),
                d = $(this).text(),
                g = {
                    "form.id": b,
                    "form.status": c
                },
                h = $(a).parents(".js_formitemsli").attr("formtype");
                updateStatus = function(c) {
                    c && e.updateStatus(g,
                    function(c) {
                        c = c.form.status;
                        var g = "";
                        if ("enable" == c) g = "personal" == h ? "停用": "下架",
                        $(a).parents(".js_formitemsli").find(".icon-lock").hide(),
                        $(a).parents(".js_formitemsli").find(".j_formRecommend").show();
                        else if ("disable" == c) {
                            g = "personal" == h ? "启用": "发布";
                            $(a).parents(".js_formitemsli").find(".icon-lock").show();
                            $(a).parents(".js_formitemsli").find(".j_formRecommend").hide();
                            var k = $(a).parents(".js_formitemsli").find(".j_star"),
                            l = k.data("recommend");
                            0 == l && e.recommend({
                                formId: b,
                                recommend: l
                            },
                            function(a) {
                                k.data("recommend", 1);
                                k.removeClass("icon-star").addClass("icon-star-empty").attr("title", "推荐")
                            })
                        }
                        $(a).attr("status", c);
                        $(a).text(g);
                        f.notify("表单已" + d)
                    })
                };
                f.confirm("确定要" + d + "此表单吗？", updateStatus)
            });*/
            /*n.on("click.FormWriteView", "#pop-forms .j_preview",
            function() {
                var a = $(this).parents("#pop-forms").attr("data-form-id");
                window.open("/biaoge/preview/" + a + "/biaoge")
            });*/
            /*n.on("click.FormWriteView", "#pop-forms .j_use",
            function() {
                var a = $(this).parents("#pop-forms").attr("data-form-id"),
                b = $(this).parents("#pop-forms").find(".item-title").text();
                d.formoperationView = new c({
                    el: "#copy-form",
                    formId: a,
                    module: d.pageModule,
                    formTitle: b,
                    ownership: "personal",
                    tpl: f.template("flow.formcopy", {
                        userId: d.userId,
                        operationtype: "启用",
                        admin: TEAMS.currentUser.admin
                    }),
                    copyCallback: function(a) {
                        f.notify("表单启用成功!");
                        d.render()
                    }
                });
                d.formoperationView.render()
            });*/
            /*n.on("click.FormWriteView", "#pop-forms .j_title",
            function() {
                var a = $(this).parents("#pop-forms").attr("data-form-id");
                window.open("/biaoge/preview/" + a + "/biaoge")
            })*/
        },
        /*cloneeForm: function() {
            var a = $(this.tpl).siblings("#formitems.j_biaoge").find(".js_formitemsli").clone();
            a.find(".j_fillCount").html("0份数据");
            a.find("#form-title").html("查看介绍");
            a.addClass("unpublished");
            var b = $(this.tpl).siblings(".js_formcategory.j_biaoge").find(".j_formlist").clone();
            b.attr("id", "intro_clonee");
            b.append(a);
            $(this.el).find(".js_forms.j_biaoge .js_form-list").append(b)
        },*/
        // 没有表单的时候显示提示信息
        ifShowIntro: function(a) {
            var b = this//,
            // c = b.model,
            // d = {},
            // e;
            // d["config.configKey"] = "guide.biaoge.showintro";
            // 判断用户是不是第一次使用，是第一次使用显示提示信息
            // c.queryIntroCount(d, function(d) {
                // (
                    // 1 == !d.introCount ? (
                        // 1 > a ? (
                            // e = "N",
                            // b.cloneeForm()
                        // ) : 
                        // e = "Y",b.renderIntro(e)
                    // ) : 1 > a ? (
                    if (a) {
                        $("#noformsShow").remove()
                    } else {
                        $(".j_biaoge .js_form-list").show()//,
                        var d = $(b.tpl).siblings("#noform-clone").find("#noformsShow").clone();//,
                        // d.find(".router").attr("href", "forms/" + TEAMS.currentUser.id + "/cloud"),
                        $(".j_biaoge .js_form-list").append(d)//,
                        // $(".j_biaoge .js_form-list").append('<div id="propforms-con"></div>'),
                        /*c.queryRecommend({}, function(a) {
                            a = a.forms;
                            if (null != a && "" != a) for (var c in a) {
                                var d = a[c],
                                e = $(b.tpl).siblings("#noform-clone").find("#pop-forms").clone();
                                e.attr("data-form-id", d.id);
                                e.find(".item-title").text(d.name);
                                e.find(".item-info").text(Date.create(d.createTime).format("{yyyy}-{MM}-{dd}") + " | 查看" + d.viewCount + "次");
                                e.find(".dlcnt").attr("title", "使用" + d.copyCount + "次");
                                e.find(".dlcnt .countnum").text(d.copyCount);
                                $(".j_biaoge .js_form-list #propforms-con").append(e)
                            }
                        })*/
                    }
            //     )
            // })
        },
        /* 提示信息
        renderIntro: function(a) {
            var b = this;
            $("body").addClass("introjs-open");
            introJs().setOptions({
                showStepNumbers: !1,
                steps: [{
                    element: ".aside .j_aside-nav",
                    intro: "<h5>菜单区</h5>1、“数据记录”可以对自己的表单数据进行管理；<br>2、待填写上报和未填写上报以及下属上报可以填写或查看自己或下属的上报信息；<br>3、“云表单库”可挑选适合自己的表单；<br><br>",
                    position: "right"
                },
                {
                    element: ".j_toolList .j_form_new",
                    intro: "<h5>新建表单</h5>点击新建表单创建新的表单，如果是管理员，可创建团队表单；<br><br>",
                    position: "left"
                },
                {
                    element: ".j_toolList .j_formIntroduction",
                    intro: "<h5>新建分类</h5>1、新建分类可更好管理您的表单，只有管理员可见此按钮；<br><br>",
                    position: "left"
                },
                {
                    element: ".js_forms.j_biaoge .js_formitemsli",
                    intro: "<h5>表单概况</h5>1、对表单基本信息进行管理，包括编辑预览等；<br>2、内部收集，以审批形式分发给团队成员收集数据；<br>3、外部分发，分享链接至朋友圈收集数据；<br><br>",
                    position: "right"
                },
                {
                    element: ".js_forms.j_biaoge .j_fillCount",
                    intro: "<h5>数据收集统计</h5>可对收集的数据进行多维度统计分析；<br><br>",
                    position: "right"
                }]
            }).onbeforechange(function(a) {}).onchange(function(a) {}).oncomplete(function() {
                b.introSaveConf(a)
            }).onexit(function() {
                b.introSaveConf(a)
            }).start().refresh()
        },*/
        /* 保存是否需要提示信息
        introSaveConf: function(a) {
            var b = this,
            c = b.model;
            window.onbeforeunload = null;
            $("body").removeClass("introjs-open");
            $.ajax({
                type: "POST",
                data: {
                    "config.configKey": "guide.biaoge.showintro",
                    "config.configValue": "1"
                },
                dataType: "json",
                url: "/base/configuration/saveConfig.json",
                success: function(a) {}
            });
            $("#intro_clonee").remove();
            "N" == a ? ($(".j_biaoge .js_form-list").show(), a = $(b.tpl).siblings("#noform-clone").find("#noformsShow").clone(), a.find(".router").attr("href", "forms/" + TEAMS.currentUser.id + "/cloud"), $(".j_biaoge .js_form-list").append(a), $(".j_biaoge .js_form-list").append('<div id="propforms-con"></div>'), c.queryRecommend({},
            function(a) {
                a = a.forms;
                if (null != a && "" != a) for (var c in a) {
                    var d = a[c],
                    e = $(b.tpl).siblings("#noform-clone").find("#pop-forms").clone();
                    e.attr("data-form-id", d.id);
                    e.find(".item-title").text(d.name);
                    e.find(".item-info").text(Date.create(d.createTime).format("{yyyy}-{MM}-{dd}") + " | 查看" + d.viewCount + "次");
                    e.find(".dlcnt").attr("title", "使用" + d.copyCount + "次");
                    e.find(".dlcnt .countnum").text(d.copyCount);
                    $(".j_biaoge .js_form-list #propforms-con").append(e)
                }
            })) : "Y" == a && $("#noformsShow").remove()
        },*/
        render: function() {
            var a = $(this.el),
            b = this.tpl,
            b = $(b).siblings("#formmanage-container");
            a.html(b.html());
            this.rendertab();
            // a.find(".j_toolList .j_cloudpage-a").addClass("router");
            // a.find(".j_toolList .j_cloudpage-a").attr("href", "/forms/" + TEAMS.currentUser.id + "/cloud")
        },
        getPageModule: function() {
            this.activeTab = "j_" + this.pageModule
        },
        rendertab: function() {
            var a = $(this.el);
            this.getPageModule();
            f.layout(this.el + " .js_forms." + this.activeTab);
            a.find(".js_forms." + this.activeTab + " #formlist-loading").show();
            a.find(".js_forms.j_" + this.pageModule).show();
            a.find(".js_formtab li[module='" + this.pageModule + "']").attr("data-load", "true").addClass("active");
            // this.isAdmin || a.find(".j_formIntroduction .js_newcategory").remove();
            this.renderPersonalForms({
                module: "biaoge"
            });
            $(".js_forms." + this.activeTab + " .js_form-list").removeClass("hide")
        },
//        drag: function() {
//            var a = this,
//            b = a.model;
//            $(a.el).find(".js_forms." + a.activeTab + " .js_form-list #custom-category ul.form-list,.js_forms." + a.activeTab + " .js_form-list #other-category ul.form-list,.js_formcategory." + a.activeTab + " ul.j_formlist").sortable({
//                placeholder: "form-placeholder",
//                connectWith: ".js_forms." + a.activeTab + " .js_form-list ul.form-list,.js_forms." + a.activeTab + " .js_form-list ul.form-list,.js_formcategory." + a.activeTab + " ul.j_formlist",
//                update: function(b, c) {
//                    a.buildCount($(this));
//                    a.buildSerialNumber($(this));
//                    c.item.data("update", !0)
//                },
//                receive: function(a, b) {
//                    b.item.data("receive", !0)
//                },
//                stop: function(c, d) {
//                    if (d.item.data("update")) if (d.item.data("update", !1), d.item.data("receive")) {
//                        d.item.data("receive", !1);
//                        var e = d.item.attr("formid"),
//                        g = d.item.parents(".js_formcategory." + a.activeTab).find(".form-category-hd .js_categoryname").attr("id");
//                        b.updateCategory({
//                            "form": {
//                                "id": e,
//                                "formCategory": {
//                                    "id": g
//                                }
//                            }
//                        },
//                        function(b) {
//                            b.message || (f.notify("表单修改分类成功"), a.sort(d.item))
//                        })
//                    } else a.sort(d.item)
//                }
//            })
//        },
        loadCateAndForms: function(a, b, c) {
            // $(this.el);
            c = this.tpl;
            var d = b.find("#custom-category");
            b = b.find("#other-category");
            a = a.formCategories;
            var temptype = "";
            var formsval = "";
            for(var i in a){
            	if(a[i].type=="usertempList"){
            		temptype = "user";
            		var f = a[i],
            		g = f.name,
            		h = f.id,
            		l = f.sort,
            		m = f.forms,
            		n = m.length,
            		q = f.type,
            		f = $(c).siblings(".js_formcategory." + this.activeTab);
            		f.find(".form-category-hd").addClass("tempCard");
            		"其他" == g ? f.addClass("js_other").find(".j_form-category").removeClass("j_form-category") : f.find(".js_categoryname").attr("id", h).attr("sort", l).attr("type", q);
            		f.find(".js_categoryname").text(g);
            		f.find(".js_categoryname").attr("title", g);
            		f.find(".form-acount").text("(" + n + ")");
            		f.hasClass("js_other") ? b.append(f) : d.append(f);
            		formsval = a[i].forms;
            	}else{
            		temptype = "sys";
            		formsval = [a[i]];
            	}
            	for (var e in formsval) {
                    var f = formsval[e],
                    //var f = formsval,
                    g = f.name,
                    h = f.id,
                    l = f.sort,
                    m = f.forms,
                    n = m.length,
                    q = f.type,
                    f = $(c).siblings(".js_formcategory." + this.activeTab);
                    "其他" == g ? f.addClass("js_other").find(".j_form-category").removeClass("j_form-category") : f.find(".js_categoryname").attr("id", h).attr("sort", l).attr("type", q);
                    f.find(".js_categoryname").text(g);
                    f.find(".js_categoryname").attr("title", g);
                    f.find(".form-acount").text("(" + n + ")");
                    for (var F in m){
    	                g = m[F];
    	                h = f.find(".j_formlist");
    	                l = $(c).siblings("#formitems." + this.activeTab).find(".js_formitemsli").clone();
    	                this.renderPersonalForm(g, h, l,"",temptype);
                    }
                    f.hasClass("js_other") ? b.append(f) : d.append(f);
                    this.buildSerialNumber(f.find(".j_formlist"))
                }
            }
        },
        renderPersonalForms: function(a) {
            var b = this,
            c = b.model,
            d = $(b.el);
            a.module = "biaoge";
            a.tenant_id="";
            var tenantid = ""; //123
            //从cookie里面取租户id
            if(document.cookie.split("tenantid=").length>1){
            	document.cookie.split("tenantid=")[1].split(";") && (tenantid = document.cookie.split("tenantid=")[1].split(";")[0]);
            }
            this.type == "usertempList" && (a.tenant_id=tenantid);
            this.type == "usertempList" && (a.type="user");
            this.type == "usertempList" && $(".aside").find("li[data-type='form-write']").hide();
            this.type == "write" && $(".aside").find("li[data-type='form-usertempList']").hide();
            this.type == "write" && (a.type="sys");
            c.queryMyForms(a, function(a) {
                var e = d.find("#formmanagelist .js_forms." + b.activeTab + " .js_form-list");
                b.loadCateAndForms(a, e, "personal");
                "j_biaoge" == b.activeTab && (a = d.find(".js_forms.j_biaoge .js_formitemsli").length, b.ifShowIntro(a));
                d.find(".js_forms." + b.activeTab + " #formlist-loading").hide();
                //b.drag();
//                d.find(".js_forms." + b.activeTab + " .js_form-list #custom-category").sortable({
//                    handle: ".form-category-hd",
//                    update: function(a, b) {
//                        b.item.data("update", !0)
//                    },
//                    stop: function(a, d) {
//                        if (d.item.data("update")) {
//                            b.sortCategory($(this));
//                            var e = {
//                                formCategories:[]
//                            };
//                            e = e.formCategories;
//                            $(this).find(".js_formcategory." + b.activeTab + " #cate-name .js_categoryname").each(function(a) {
//                                e[a] = {
//                                    id: $(this).attr("id"),
//                                    sort: $(this).attr("sort")
//                                }
//                            });
//                            c.formCategorSort(e, function(a) {
//                                a.message || ($(".js_updatecatename").trigger("keydown.FormListView", 13), f.notify("表单分类排序成功"))
//                            })
//                        }
//                    }
//                })
            })
        },
        renderBiageForm: function(a, b, c, d,w) {
            c = this.tpl;
            // $(this.el);
            var f = a.name,
            // g = a.describe,
            h = a.id || a.pk_temp,
            l = a.newFillCount,
            funnode = a.funnode,
            nexuskey = a.nexuskey,
            rootname = a.rootsysname,
            // m = a.operator.id,
            // n = TEAMS.currentUser.id;
            c = $(c).siblings("#formitems." + this.activeTab).find(".js_formitemsli");
            c.find("#form-number").css("background-color", e.getRandomColor());
            c.attr("formid", h).attr("sort", a.sort);
            c.attr("formid", h);
            c.attr("id", h);
            c.find(".js_formPreview").attr("formId", h);
            // "company" == a.ownership && c.find(".j_team-icon").removeClass("hide");
            c.find("#form-title").text(f);
            c.find("#form-title").attr("title", f);
            c.find("#form-title").attr("data-id", h);
            c.find("#form-title").attr("userId", this.userId);
            //c.find("#form-title").attr("href", "/#forms/formstat/" + h);
            // if (void 0 == g || "" === g) g = "暂无表单描述",
            // c.find("#form-describe").removeClass("description").addClass("nodescription");
            // c.find("#form-describe").text(g);
            // c.find("#form-describe").attr("title", g);
            c.find(".js_formListBox").attr("formId", h);
            //c.find(".j_fillCount").text(l + "份数据");
            // c.find(".j_fillCount").attr("href", "/forms/" + TEAMS.currentUser.id + "/formstat/" + h);
            // c.find(".form-message").addClass("hide").hide();
            c.find(".js_enableForm").attr("formId", h).attr("funnode",funnode).attr("nexuskey",nexuskey);
            c.find(".js_renameForm").attr("formId", h);
            c.find(".js_editForm").attr("formId", h).attr("tempType",w);
            var isdefault = "";
            var sysusername = "";
            a.isdefault=="Y" && (isdefault="<span class='enablebtn' style='color:#0070FE;float: right;'>（启用）</span>");
            rootname && (sysusername = "<a class='ellipsis nameFrom' title='用户模板——来源于"+rootname+"' style='color:#F3A50F;width: 199px;'>用户模板——来源于"+rootname+"</a>");
            w=="user" && a.sysflag=="Y" && c.find(".j_fillCount").html("系统模板"+isdefault);
            w=="user" && a.sysflag=="N" && c.find(".j_fillCount").html(sysusername+isdefault);
            w=="user" && a.sysflag=="Y" && c.find(".js_editForm span").text("浏览");
            w=="sys" && c.find("a.js_enableForm").remove();
            // c.find(".js_shareForm").attr("formId", h);
            c.find(".js_copyForm").attr("formId", h).attr("tempType",w).attr("osp", a.ownership).attr("funnode",funnode).attr("nexuskey",nexuskey);
            c.find(".js_deleteForm").attr("formId", h);
            // c.find(".js_useflow").attr("formId", h).attr("ownership", a.ownership).attr("name", f);
            // c.find(".js_reportConf").attr("formId", h);
            // c.find(".js_authConfig").attr("formId", h);
            // c.find(".js_continueWrite").attr("formId", h);
            /* 别人创建的表单
            m != n && (
                c.find(".js_manager_btn .js_editForm").remove(),
                c.find(".js_manager_btn .reportConfig-btn").remove(),
                c.find(".js_manager_btn .formmore-btn").remove(),
                c.find(".js_manager_btn .js_formPreview-only").removeClass("hide"),
                c.find(".js_formPreview-only").attr("formId", h),
                c.find(".js_formListBox .j_gatherStatus").remove(),
                c.find(".j_recover-icon").removeClass("hide"),
                c.find(".j_recover-icon").attr("title", Date.create(a.createTime).format("{yyyy}-{MM}-{dd}") + "由" + a.operator.name + "创建")
            );*/
            // this.createStatus(c, a);
            "prepend" == d ? b.prepend(c) : b.append(c);
            this.buildSerialNumber(b)
        },
        renderPersonalForm: function(a, b, c, d,e) {
            this.renderBiageForm(a, b, c, d,e)
        },
        /*renderPersonalKeyword: function(a) {
            var b = $(this.el),
            c = $(this.tpl),
            d = b.find(".js_forms." + this.activeTab + " .js_form-list"),
            b = c.siblings("#search-boxlist").find(".j_Search." + this.activeTab).clone();
            d.html(b);
            var b = d.find(".js_searchlist"),
            e = a.formPage,
            f = e.result;
            a = a.pageNo;
            d.find("#pageNo").val(a);
            a = d.find(".j_Search." + this.activeTab + " .j_formcount").text();
            a = a.substring(1, a.length - 1);
            a = parseInt(a) ? f.length + parseInt(a) : f.length;
            d.find(".j_Search." + this.activeTab + " .j_formcount").text("(" + a + ")");
            1 == e.pageNo && 0 == e.result.length ? d.find(".js_noresult").show() : d.find(".js_noresult").hide();
            e.hasNext ? d.find("#loadMore").show() : d.find("#loadMore").hide();
            for (d = 0; d < f.length; d++) e = f[d],
            a = c.siblings("#formitems." + this.activeTab).find(".js_formitemsli").clone(),
            this.renderPersonalForm(e, b, a, "append");
            this.buildSerialNumber(b)
        },
        renderKeywords: function(a) {
            var b = this,
            c = b.model,
            d = $(b.el);
            a.pageNo = 1;
            a.pageSize = 1E7;
            c.queryMyFormsKeywords(a,
            function(a) {
                b.renderPersonalKeyword(a);
                d.find("#loadMore").attr("isKeyword", "isKeyword")
            })
        },*/
        deleteForm: function(a, b, c, d) {
            var e = this,
            g = e.model,
            h = $(a).parents(".j_formlist");
            // "cloud" === c && (h = $(a).parents("#cloudformul"));
            var l = function(c) {
                c && g.deleteForm(b,
                function(b) {
                    if (b.message) {
                    	$(a).parents("li").remove()
                        f.notify(b.message)
                        e.buildCount(h)
                        e.buildSerialNumber(h)
                    } else {
                        $(a).parents("li").remove()
                        f.notify("模板删除成功")
                        e.buildCount(h)
                        e.buildSerialNumber(h)
                    }
                })
            };
            // "cloud" === c ? f.confirm("云表单删除后不可恢复,确定删除吗？", l) : f.confirm("此表单已填写过" + d + "次,确定删除吗？", l)
            l(true)
        },
        buildSerialNumber: function(a) {
            this.buildCount(a);
            a.find(".js_formitemsli").each(function(a) {
                $(this).find("#form-number").text(a + 1)
            })
        },
        buildCount: function(a) {
            var b = a.parents(".js_formcategory." + this.activeTab).find(".js_formitemsli").length;
            a.parents(".js_formcategory." + this.activeTab).find(".js_formcount").text("(" + b + ")")
        },
        sortCategory: function(a) {
            a.find(".js_formcategory." + this.activeTab).each(function(a) {
                $(this).find("#cate-name .js_categoryname").attr("sort", a + 1)
            })
        },
//        sort: function(a) {
//            $(this.el);
//            var b = this.model,
//            c = {},
//            d = a.prevAll(),
//            e = a.next(),
//            g = a.prev()//,
//            /*h = a.parents(".j_formlist").find(".js_formitemsli").eq(0)*/;
//            d.each(function(a) {
//                c["forms[" + a + "].id"] = $(this).attr("formid")
//            }); (d = parseInt(e.attr("sort")) + 1) || (d = parseInt(g.attr("sort")));
//            if (isNaN(d) || !a.parents(".js_formcategory." + this.activeTab).find('.j_formlist li').length) {
//                d = 0;
//            }
//            var /*g = h.attr("formid"),
//            h = parseInt(h.attr("sort")),*/
//            e = a.attr("formid"),
//            l = a.parents(".js_formcategory." + this.activeTab).find(".form-category-hd .js_categoryname").attr("id");
//            c.form = {
//                id: e,
//                formCategory: {
//                    id: l
//                }
//            };
//            c.sort = d;
//            // 49990 <= h && (c.firstFormId = g);
//            b.sort(c, function(b) {
//                if (b.message) {
//                    f.notify(b.message)
//                } else {
//                    a.attr("sort", d);
//                    a.prevAll().each(function(a) {
//                        $(this).attr("sort", parseInt($(this).attr("sort")) + 1)
//                    });
//                    f.notify("表单排序成功")
//                }
//            })
//        },
        /*createStatus: function(a, b) {
            var c = b.status,
            d = b.id,
            e = "";
            if ("j_biaoge" == this.activeTab) {
                switch (c) {
                case "submit":
                    e = "停用";
                    a.find("#form-title").removeClass("j_entityslider-toggle");
                    a.find(".reportConfig-btn").removeClass("dropdown-menu-toggle");
                    a.removeClass("collecting stopped").addClass("unpublished");
                    a.find(".j_gatherStatus > ul").html('<li><a class="j_changeStatus" target-status="submit" formid="' + d + '">启用</a></li>');
                    break;
                case "disable":
                    e = "停用";
                    a.find("#form-title").removeClass("j_entityslider-toggle");
                    a.find(".reportConfig-btn").removeClass("dropdown-menu-toggle");
                    a.removeClass("collecting unpublished").addClass("stopped");
                    a.find(".j_gatherStatus > ul").html('<li><a class="j_changeStatus" target-status="disable" formid="' + d + '">启用</a></li>');
                    break;
                case "enable":
                    e = "启用",
                    a.find("#form-title").addClass("j_entityslider-toggle"),
                    a.removeClass("stopped unpublished").addClass("collecting"),
                    a.find(".j_gatherStatus > ul").html('<li><a class="j_changeStatus" target-status="enable" formid="' + d + '">停用</a></li>')
                }
                a.find(".j_gatherStatus > a").html(e + '<i class="caret ml-3"></i>')
            }
        },*/
        remove: function() {
            $(this.el).off(".FormWriteView");
            this.formoperationView && (this.formoperationView.remove(), this.formoperationView = null);
            this.header && (this.header.remove(), this.header = null)
        }/*,
        setFlowsequenceIcon: function(a, b) {
            "show" == b ? $(this.el).find(".js_formboxli[formid=" + a + "]").find(".form-message").show() : $(this.el).find(".js_formboxli[formid=" + a + "]").find(" .form-message").hide()
        },
        search: function(a) {
            var b = $(this.el);
            a.creators = this.filter ? this.filter.managers: null;
            a.tags = this.filter ? this.filter.tags: null;
            a.stats = this.filter ? this.filter.status: null;
            a.formtypes = this.filter ? this.filter.formtypes: null;
            a.startTime = b.find("#form-filter-dropdown #formcreate-time-begin").val();
            a.endTime = b.find("#form-filter-dropdown #formcreate-time-end").val();
            b.find(".js_forms." + this.activeTab + " .js_form-list").html('<div id="custom-category"></div><div id="other-category"></div>');
            a.module = "biaoge";
            this.filterPersonalForms(a);
            $(".js_forms." + this.activeTab + " .js_form-list").removeClass("hide")
        },
        filterPersonalForms: function(a) {
            var b = this,
            c = b.model,
            d = $(b.el);
            $(b.tpl);
            c.queryMyForms(a,
            function(a) {
                var e = d.find("#formmanagelist .js_forms." + b.activeTab + " .js_form-list");
                b.loadCateAndForms(a, e, "personal");
                "j_biaoge" == b.activeTab && (0 < d.find(".js_forms.j_biaoge .js_formitemsli").length ? d.find("#noformsShow").remove() : $(".j_biaoge .js_form-list").show().append('<div id="noformsShow" class="js_noresult eform-nodata text-center c-777 mb-15">无数据</div>'));
                d.find(".js_forms." + b.activeTab + " #formlist-loading").hide();
                b.drag();
                d.find(".js_forms." + b.activeTab + " .js_form-list #custom-category").sortable({
                    handle: ".form-category-hd",
                    update: function(a, b) {
                        b.item.data("update", !0)
                    },
                    stop: function(a, d) {
                        if (d.item.data("update")) {
                            b.sortCategory($(this));
                            var e = {};
                            $(this).find(".js_formcategory." + b.activeTab + " #cate-name .js_categoryname").each(function(a) {
                                e["formCategories[" + a + "].id"] = $(this).attr("id");
                                e["formCategories[" + a + "].sort"] = $(this).attr("sort")
                            });
                            c.formCategorSort(e,
                            function(a) {
                                a.message || ($(".js_updatecatename").trigger("keydown.FormListView", 13), f.notify("表单分类排序成功"))
                            })
                        }
                    }
                })
            })
        }*/
    });
    return h
});
