define("teams/form/formcloudview", ["teams/utils", "teams/form/formcloudmodel", "teams/form/formoperationview"],
function() {
    var f = require("teams/utils"),
    d = require("teams/form/formcloudmodel"),
    c = require("teams/form/formoperationview"),
    h = Backbone.View.extend({
        initialize: function(b) {
            b = b || {};
            this.el = b.el;
            // this.userId = b.userId;
            this.model = new d;
            $(this.el).html(f.template("form.cloud"));
            this.currentForm = {};
            this.pageModule = b.module
        },
        delegateEvents: function() {
            var b = this,
            a = $(b.el);
            $("body").off("click.FormCloud", ".goto-top").on("click.FormCloud", ".goto-top",
            function(a) {
                f.gotoTop(".j_formcloudmain")
            });
            $(window).off("resize.FormCloud").on("resize.FormCloud",
            function() {
                0 < $(".j_formlabel").length && ($(".j_formlabel")[0].scrollHeight > $(".j_formlabel").data("maxHeight") ? $(".j_labelmore").show() : $(".j_labelmore").hide())
            });
            this.model.on("change:formLabels",
            function(a, c) {
                b.$(".j_formlabel").html(f.template("form.cloud.label", {
                    data: c
                }));
                $(".j_formlabel")[0].scrollHeight > $(".j_formlabel").data("maxHeight") ? $(".j_labelmore").show() : $(".j_labelmore").hide()
            }).on("change:forms",
            function(a, c) {
                b.$(".form-more").hide();
                1 === a.get("pageNo") ? b.$(".j_formlist .j_table").html(f.template("form.cloud.list", {
                    data: c
                })) : b.$(".j_formlist .j_table").append(f.template("form.cloud.list", {
                    data: c
                }));
                a.get("hasNext") && b.$(".form-more").show()
            }).on("change:order",
            function(a, c) {
                var d = c || "default";
                b.$('.j_toolkit a[data-order="' + d + '"]').hasClass("current") || (b.$(".j_toolkit a").removeClass("current"), b.$('.j_toolkit a[data-order="' + d + '"]').addClass("current"))
            }).on("change:keyword",
            function(a, b) {
                $("#formsearch-keywords").val() !== b && $("#formsearch-keywords").val(b)
            });
            this.$(".j_formlist").off("click.FormCloud", "a").on("click.FormCloud", "a",
            function() {
                var a = $(this).data("operate"),
                d = $(this).parents(".eform-cloud-item").data("formId"),
                h = $(this).parents(".eform-cloud-item").find(".item-title").text();
                switch (a) {
                case "preview":
                    f.alert('还不知道预览地址是什么……')
                    // "biaoge" == b.pageModule ? window.open("/biaoge/preview/" + d + "/biaoge") : "workflow" == b.pageModule && window.open("/biaoge/preview/" + d + "/workflow");
                    break;
                case "copy":
                    b.formoperationView = new c({
                        el: "#copy-form",
                        formId: d,
                        module: b.pageModule,
                        formTitle: h,
                        ownership: "personal",
                        tpl: f.template("flow.formcopy", {
                            // userId: b.userId,
                            operationtype: "启用",
                            admin: false//TEAMS.currentUser.admin
                        }),
                        copyCallback: function(a) {
                            f.notify("表单启用成功!");
                            var c;
                            /*"workflow" == b.pageModule ?
                                c = "personal" == a.form.ownership ?
                                    "/workflows/" + TEAMS.currentUser.id + "/personal":
                                    "/workflows/" + TEAMS.currentUser.id + "/company":
                                    "biaoge" == b.pageModule && (*/c = "/#forms/write"//);
                            ROUTER.navigate(c, {
                                trigger: !0
                            })
                        }
                    })
                    b.formoperationView.render()
                }
                return ! 1
            });
            this.$(".j_formlabel").off("click.FormCloud", "a[data-label-id]").on("click.FormCloud", "a[data-label-id]",
            function() {
                var a = $(this).parent();
                if (a.hasClass("selected")) {
                    var c = $(this).data("labelId");
                    a.removeClass("selected");
                    $(".j_formresult a[data-label-id=" + c + "]").parent().remove()
                } else a.addClass("selected"),
                $(".j_formresult dl").append(a.clone());
                var d = [];
                $(".j_formresult a[data-label-id]").each(function() {
                    d.add($(this).data("labelId"))
                });
                b.model.getFormByLabels(d);
                return ! 1
            });
            this.$(".j_formresult").off("click.FormCloud", "a[data-label-id]").on("click.FormCloud", "a[data-label-id]",
            function() {
                var a = $(this).data("labelId");
                $(this).parent().remove();
                $(".j_formlabel a[data-label-id=" + a + "]").parent().removeClass("selected");
                var c = [];
                $(".j_formresult a[data-label-id]").each(function() {
                    c.add($(this).data("labelId"))
                });
                b.model.getFormByLabels(c);
                return ! 1
            });
            this.$(".j_toolkit").off("click.FormCloud", "a[data-order]").on("click.FormCloud", "a[data-order]",
            function() {
                var a = $(this);
                if (a.hasClass("current")) return ! 1;
                var c = a.data("order");
                b.$(".j_toolkit a").removeClass("current");
                a.addClass("current");
                c && b.model.sortFormList(c);
                return ! 1
            });
            this.$(".form-more").off("click.FormCloud").on("click.FormCloud",
            function() {
                b.model.nextPage()
            });
            this.$(".j_labelmore").off("click.FormCloud", "span").on("click.FormCloud", "span",
            function() {
                b.$(".j_formlabel").hasClass("formcloud-sub") ? (b.$(".j_formlabel").removeClass("formcloud-sub"), b.$(".j_labelmore i").removeClass().addClass("icon-angle-up")) : (b.$(".j_formlabel").addClass("formcloud-sub"), b.$(".j_labelmore i").removeClass().addClass("icon-angle-down"))
            });
            this.$(".j_toolkit").off("search.FormCloud", "#formsearch-keywords").on("search.FormCloud", "#formsearch-keywords",
            function(a) {
                a = $.trim($(this).val());
                b.model.getFormByKeyword(a)
            });
            this.$(".j_toolkit").off("keyup.FormCloud", "#formsearch-keywords").on("keyup.FormCloud", "#formsearch-keywords",
            function(a) {
                13 == a.which && $(this).trigger("search")
            });
            this.$(".j_toolkit").off("click.FormCloud", ".icon-search").on("click.FormCloud", ".icon-search",
            function(c) {
                c = a.find("#formsearch-keywords");
                c = $.trim(c.val());
                b.model.getFormByKeyword(c)
            })
        },
        render: function() {
            $(".j_formlist .j_no-result").addClass("hide");
            this.model.load();
            /* 这个使用来给主要区域加滚动条的 */
            f.layout(".j_formcloudmain");
            /* 热门表单，暂时不用
            this.popularityForm()*/
        },
        remove: function() {
            $(this.el).off(".FormCloud");
            $(window).off(".FormCloud");
            $(this.el).html("")
        }/*,
         * 热门表单，暂时不用
        popularityForm: function() {
            var b = this.pageModule;
            this.model.popularityForm({
                pageNo: 1,
                pageSize: 5
            },
            function(a) {
                $.each(a.forms,
                function(a) {
                    var c = $(".j_hotform-wrap .hotform-list:first").clone().show();
                    a += 1;
                    4 <= a && a++;
                    c.find(".catalog-logo img").attr("src", "/iform/static/img/global/formcloudview/" + a + ".png");
                    c.find(".j_formname").attr("title", this.name).text(this.name);
                    c.find(".hotform-card").attr("href", "/biaoge/preview/" + this.id + "/" + b);
                    $(".j_hotform-wrap").append(c)
                })
            })
        }*/
    });
    return h
});
