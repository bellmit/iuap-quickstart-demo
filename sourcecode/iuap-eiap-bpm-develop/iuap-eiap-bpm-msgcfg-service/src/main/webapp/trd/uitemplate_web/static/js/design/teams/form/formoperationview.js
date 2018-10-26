define("teams/form/formoperationview", ["teams/utils", "teams/form/formmanagemodel"],
function() {
    var f = require("teams/utils");
    var d = require("teams/form/formmanagemodel"),
    h = Backbone.View.extend({
        initialize: function(c) {
            this.param = c;
            this.model = new d(c);
            // this.userId = TEAMS.currentUser.id;
            this.tpl = c.tpl;
            this.saveCallback = c.saveCallback;
            this.el = c.el;
            this.ownership = c.ownership;
            this.formwrite = c.formwrite;
            this.formTitle = c.formTitle;
            this.copyCallback = c.copyCallback;
            // this.isAdmin = TEAMS.currentUser.admin;
            this.formCategories = c.formCategories;
            $("body").append(this.tpl);
            this.initElement()
        },
        initElement: function() {
            var c = $(this.el);
            // "t7akvdnf84" == TEAMS.currentTenant.tenantKey ? 
            //     c.find(".js_formowner .js_cloudform").removeClass("hide") :
                c.find(".js_formowner .js_cloudform").remove();
            "cloud" == this.ownership ? c.find(".js_formowner").parent().addClass("hide") : c.find(".js_formowner .js_cloudform").addClass("hide")
        },
        delegateEvents: function() {
            var c = this,
            b = c.model,
            a = $(c.el),
            d = c.el;
            a.on("hidden.bs.modal",
            function(a) {
                c.remove()
            });
            /*a.on("keydown.FormoperationView", "#form-name",
            function(b) {
                13 === b.keyCode && (a.find("#form-btn-save").trigger("click"), b.preventDefault())
            });
            a.on("keydown.FormoperationView", "#form-name-copy",
            function(b) {
                13 === b.keyCode && (a.find("#form-btn-copy").trigger("click"), b.preventDefault())
            });*/
            a.on("click.FormoperationView", "#form-btn-cancel",
            function() {
                a.modal("hide")
            });
            a.on("shown.bs.modal",
            function() {
                "#build-newform" == d ? a.find("#form-name").focus() : a.find("#form-name-copy").focus().val(c.formTitle)
            });
            /*a.on("blur.FormoperationView", "#form-name",
            function() {
                var d = $(this).val(),
                e = a.find('.js_forminfo input[name="ownership"]:checked').val(),
                h = {};
                e || (e = "personal");
                "personal" == e && (h["form.operator"] = c.userId);
                h["form.name"] = $.trim(d);
                h["form.ownership"] = e;
                c.param["form.report.id"] && (h["form.report.id"] = c.param["form.report.id"]);
                h.module = c.param.module;
                "" != $.trim(d) && b.checkFormName(h,
                function(a) { (a = a.message) && f.notify(a)
                })
            });*/
            /*a.on("click.BuildnewformView", "#form-btn-save",
            function() {
                var d = $.trim(a.find(".js_forminfo #form-name").val()),
                e = $.trim(a.find(".js_forminfo #form-describe").val()),
                h = a.find('.js_forminfo input[name="ownership"]:checked').val(),
                k = {
                    form : {
                        formCategory: {}
                    }
                };
                h || (h = "personal");
                c.param["form.report.id"] && (k["form.report.id"] = c.param["form.report.id"]);
                if ("" == $.trim(d)) f.notify("请输入表单名称");
                else {
                    k.form.name = d;
                    k.form.describe = e;
                    k.form.ownership = h;
                    k.module = c.param.module;
                    void 0 != c.param && void 0 != c.param.formLabelId && (k["formLabel.id"] = c.param.formLabelId);
                    var n = null;
                    b.saveForm(k,
                    function(b) {
                        var d = b.message;
                        d ? f.notify(d) : (n = b.form.id, c.saveCallback && c.saveCallback(b), f.notify("表单保存成功"), a.modal("hide"))
                    });
                    null != n && c.isReportForm ? window.open("/form/editreport/" + n) : null != n && window.open("/form/edit/" + n)
                }
            });*/
            a.on("click.BuildnewformView", "#biaoge-form-btn-save",
            function() {
                var d = $.trim(a.find(".js_forminfo #form-name").val()),
                e = $.trim(a.find(".js_forminfo #form-describe").val()),
                // h = a.find('.js_forminfo input[name="ownership"]:checked').val(),
                // k = a.find('.js_forminfo input[name="asCompany-form"]').is(":checked"),
                n = {
                    form: {
                        formCategory: {},
                        operator: {}
                    }
                };
                // h || (h = "personal");
                // c.param["form.report.id"] && (n["form.report.id"] = c.param["form.report.id"]);
                if ("" == $.trim(d)) f.notify("请输入模板名称");
                else {
                    var p;
                    // "company" == h ? 
                        // p = a.find(".js_company_select").val() : 
                        // "personal" == h && (
                            // null != c.formwrite && "" != c.formwrite ? (
                                p = a.find(".js_company_select").val(),
                                // n["form.formwrite"] = "formwrite",
                                // k && (h = "company")
                            // ) : p = a.find(".js_personal_select").val()
                        // );
                    n.form.name = d;
                    // n.formName = d
                    n.form.describe = e;
                    // n["form.ownership"] = h;
                    // n.module = c.param.module;
                    "其他" != p && (n.form.formCategory.id = p);
                    // "其他" != p && (n.formCategoryId = p);
                    // void 0 != c.param.formLabelId && (n["formLabel.id"] = c.param.formLabelId);
                    //租户信息
                    n.form.operator.tenant_id='';
                    n.form.operator.user_id='';
                    n.form.operator.id='';
                    var r = null;
                    b.saveForm(n, function(b) {
                        if (b.message) {
                            f.notify(b.message)
                        } else {
                            c.saveCallback && c.saveCallback(b)
                            f.notify("模板保存成功")
                            a.modal("hide")
                            window.open("/uitemplate_web/?pk_temp=" + b.pk_bo)
                        }
                    });
                    // null != r && c.isReportForm ? window.open("/form/editreport/" + r) : null != r && window.open("/form/edit/" + r)
                }
            });
            a.on("click.FormoperationView", "#form-btn-copy",
            function() {
                var d = {
                    form: {}
                },
                e = $.trim(a.find(".js_forminfo #form-name-copy").val());
                var ischecked = a.find(".js_forminfo #form-type-check").is(':checked');
                if(ischecked){
                	d.form.ischecked = "yes";
                }else{
                	d.form.ischecked = "no";
                }
                /*h = $(this).parents(".js_forminfo").find(".js_formowner").find('input[name="ownership"]:checked').val();*/
                if ("" == $.trim(e)) {
                    f.notify("请输入模板名称")
                } else {
                    // h = "personal"
                    d.form.name = e;
                    // d.formName = e
                    // d["form.ownership"] = h
                    // d.ownership = h
                    //"personal" == h && (d["form.operator"] = c.userId)
                    // d.operator = c.userId
                    // d.module = c.param.module
                    // d.formId = c.param.formId
                    d.form.id = c.param.formId;
                    var tempType = $(".js_formcategory .js_copyForm[formid='"+c.param.formId+"']").attr("tempType");
                    var tenantid = ""; //123
                    //从cookie里面取租户id
                    if(document.cookie.split("tenantid=").length>1){
                    	document.cookie.split("tenantid=")[1].split(";") && (tenantid = document.cookie.split("tenantid=")[1].split(";")[0]);
                    }
                    tempType=="user" && (d.form.tenant_id = tenantid); //租户id
                    d.form.funnode = $(".js_formcategory .js_copyForm[formid='"+c.param.formId+"']").attr("funnode");
                    d.form.nexuskey = $(".js_formcategory .js_copyForm[formid='"+c.param.formId+"']").attr("nexuskey");
                    d.form.tempType = tempType;
                    // b.checkFormName(d, function(e) {
                    b.copyForm(d, function(e) {
                        //e = e.message;
                        if (e.message) {
                            f.notify(e.message)
                        } else {
                            // b.queryMaxSort(d, function(e) {
                                // d.newSort = e.newSort;
                                // b.copyForm(d, function(b) {
                                    // f.notify("表单复制成功");
                                    c.copyCallback && c.copyCallback(e);
                                    a.modal("hide");
                                    f.notify("模板复制成功");
                                // })
                            // })
                        }
                    })
                }
            });
            a.on("hidden.bs.modal",
            function(a) {
                c.remove()
            })
        },
        render: function() {
            var c = $(this.el);
            c.modal();
            if (this.formwrite) {
                c.find(".js_personal_select").remove()
                c.find(".js_personal_label").remove()
                for (var b = 0, l = this.formCategories.length; b < l; b++) {
                    var d = this.formCategories[b];
                    c.find(".js_company_select").append('<option value="' + d.id + '">' + d.name + "</option>")
                }
                c.find(".js_company_select").append('<option selected="selected">其他</option>')
            }
            // c.find('input[name="ownership"][id="' + this.ownership + '"]').attr("checked", !0);
            // var b = {
            //     ownership: this.ownership,
            //     module: this.param.module
            // };
            /*"company" == this.ownership ? (c.find(".js_personal_select").remove(), c.find(".js_personal_label").remove(), this.model.queryCategory(b,
            function(a) {
                for (var b = 0; b < a.formCategories.length; b++) c.find(".js_company_select").append('<option value="' + a.formCategories[b].id + '">' + a.formCategories[b].name + "</option>");
                c.find(".js_company_select").append('<option selected="selected">其他</option>')
            })) : "personal" == this.ownership && (null != this.formwrite && "" != this.formwrite ? (c.find(".js_personal_select").remove(), c.find(".js_personal_label").remove(), this.model.queryCategory({
                ownership: "company",
                module: "biaoge"
            },
            function(a) {
                for (var b = 0; b < a.formCategories.length; b++) c.find(".js_company_select").append('<option value="' + a.formCategories[b].id + '">' + a.formCategories[b].name + "</option>");
                c.find(".js_company_select").append('<option selected="selected">其他</option>')
            }), this.isAdmin && c.find(".j_asCompany").removeClass("hide")) : (c.find(".js_company_select").remove(), c.find(".js_company_label").remove(), this.model.queryCategory(b,
            function(a) {
                for (var b = 0; b < a.formCategories.length; b++) c.find(".js_personal_select").append('<option value="' + a.formCategories[b].id + '">' + a.formCategories[b].name + "</option>");
                c.find(".js_personal_select").append('<option selected="selected">其他</option>')
            })));*/
            c.find("#form-describe").autosize();
            // this.param.ownership_display && "false" == this.param.ownership_display && $(".js_formowner").parent().addClass("hide")
        },
        remove: function() {
            $(this.el).off(".FormoperationView");
            $(this.el).remove()
        }
    });
    return h
});
