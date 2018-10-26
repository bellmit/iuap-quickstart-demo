define("teams/component/event", 
[
    "teams/utils"/*,
    "teams/component/locus",
    "teams/component/entityselector",
    "teams/component/wechat",
    "teams/component/usercard",
    "teams/component/remindcard",
    "teams/component/entitybox",
    "teams/component/remind",
    "teams/component/shareout",
    "teams/component/userselector",
    "teams/component/tagselector",
    "teams/component/formtagselector",
    "teams/component/departmentselector",
    "teams/component/groupselector",
    "teams/component/formlabelselector",
    "teams/tag/tagrecentview",
    "teams/core/relogin"*/
],
function() {
    var f = require("teams/utils"),
    // d = require("teams/component/locus"),
    // c = require("teams/component/entityselector");
    // require("teams/component/wechat");
    /*var b = require("teams/component/usercard"),
    a = require("teams/component/remindcard"),
    e = require("teams/component/entitybox"),
    g = require("teams/component/remind"),
    l = require("teams/component/shareout"),
    m = require("teams/component/userselector"),
    k = require("teams/component/tagselector"),
    s = require("teams/component/formtagselector"),
    p = require("teams/component/departmentselector"),
    r = require("teams/component/groupselector"),
    u = require("teams/component/formlabelselector"),
    v = require("teams/tag/tagrecentview"),
    w = require("teams/core/relogin"),*/
    x = {};
    return {
        setLastPage: function(a) {
            x = a
        },
        initEvent: function() {
            $.ajaxSetup({
                cache: !1
            });
            var h = this;
            /* 验证是否需要重新登录用的
            $(document).ajaxComplete(function(a, b, e) {
                a = {};
                try {
                    a = $.parseJSON(b.responseText)
                } catch(c) {}
                h.relogin && a.actionMsg && -1 == a.actionMsg.code ? (h.relogin = !1, (new w({
                    currentUser: TEAMS.currentUser
                })).render()) : h.relogin = !0
            });*/
            /*$("body").on("click", "table.j_stripedTable td:first-child",
            function(a) {
                $(this).parent("tr").addClass("active").siblings().removeClass("active")
            });*/
            $("body").on("mouseenter.dropdownmenu", ".dropdown-menu-toggle",
            function(a) {
                var b = $(this);
                // $(this).hasClass("j_tag") && (new v).render();
                b.addClass("open");
                a = null != b.find(".dropdown-user").get(0) ? setTimeout(function() {
                    b.find(".dropdown-user").slideDown("fast")
                },
                300) : null != b.find(".dropdown-tag").get(0) ? setTimeout(function() {
                    b.find(".dropdown-tag").slideDown("fast")
                },
                300) : setTimeout(function() {
                    b.children(".dropdown-menu").slideDown("fast")
                },
                300);
                b.data("showTimer", a);
                $(this).hasClass("user-panel") && (null == $("body").find(".user-menu-backdrop").get(0) && $("body").append('\x3cdiv class\x3d"user-menu-backdrop fade"\x3e\x3c/div\x3e'), a = setTimeout(function() {
                    $("body").find(".user-menu-backdrop").addClass("in")
                },
                150), $(this).data("dropTimer", a))
            }).on("mouseleave.dropdownmenu", ".dropdown-menu-toggle",
            function(a) {
                a = $(this).data("showTimer");
                $(this).removeClass("open");
                a && clearTimeout(a);
                $(this).removeData("showTimer");
                $(this).children(".dropdown-menu").slideUp(100);
                $(this).find(".dropdown-user,.dropdown-tag").slideUp(100);
                $(this).hasClass("user-panel") && (a = $(this).data("dropTimer")) && (clearTimeout(a), $("body").find(".user-menu-backdrop").removeClass("in"), setTimeout(function() {
                    $("body").find(".user-menu-backdrop").remove()
                },
                150), $(this).removeData("dropTimer"))
            });
            $("body").on("click.dropdownmenu", ".dropdown-menu a",
            function(a) {
                a = $(this).closest(".dropdown-menu-toggle");
                if (0 < a.length) {
                    var b = a.data("mode");
                    if (b && "select" == b) {
                        var b = a.find(".title"),
                        e = a.data("entity"),
                        c = $(this).data("entity");
                        e != c && (b.html($(this).html()), a.data("entity", c), a.trigger("change"))
                    }
                }
                a = $($(this).parents(".dropdown")[0]);
                a.hasClass("dropdown-gettext") && (b = $(this).text(), a.find(".dropdown-toggle").html(b + ' \x3ci class\x3d"icon-caret-down"\x3e\x3c/i\x3e'));
                $(this).closest(".dropdown-menu-toggle");
                $(this).closest(".dropdown-menu").slideUp(100)
            });
            /*
            $("body").off("mouseenter.typeahead", ".typeahead-wrapper").on("mouseenter.typeahead", ".typeahead-wrapper",
            function(a) {
                $(this).data("enter", !0)
            }).off("mouseleave.typeahead", ".typeahead-wrapper").on("mouseleave.typeahead", ".typeahead-wrapper",
            function(a) {
                $(this).data("enter", !1)
            });
            $("body").off("click.controlbtn", ".control-btn").on("click.controlbtn", ".control-btn",
            function(a) {
                a.stopPropagation();
                $(this).addClass("hide");
                $(this).siblings(".typeahead-wrapper").removeClass("hide");
                $(this).siblings(".typeahead-wrapper").find(".control-input").focus()
            });
            $("body").off("focusout.controlinput", ".control-input").on("focusout.controlinput", ".control-input",
            function(a, b) {
                a.stopPropagation();
                var e = $(this).parents(".typeahead-wrapper");
                e.data("enter") && "tt" != b || (e.addClass("hide"), e.siblings(".control-btn").removeClass("hide"), e.trigger("hide"))
            });
            $("body").off("click", ".links-control-group a").on("click", ".links-control-group a",
            function(a) {
                $(this).addClass("hide");
                if (a = $(this).attr("for")) if ("#task-subtask" == a) {
                    var b = $("#subtaskClone").clone();
                    b.find(".title .text").replaceWith("\x3cinput type\x3d'text' style\x3d'border:none;background-color:transparent;width:450px;' class\x3d'title j_nameInput ellipsis new' value\x3d'' tabindex\x3d'-1' maxlength\x3d'100' /\x3e");
                    b.removeAttr("id");
                    0 < $("#entitybox-container #task-subtask").length ? ($("#entitybox-container #task-subtask").find(".task-list").append(b), $("#entitybox-container #task-subtask").removeClass("hide"), $("#entitybox-container #task-subtask").find(".j_nameInput").focus()) : ($("#entitySlider #task-subtask").find(".task-list").append(b), $(a).removeClass("hide"), $(a).find(".j_nameInput").focus())
                } else a = $(this).parents(".links-control-group").parent().find(a),
                a.removeClass("hide"),
                a.find(".control-btn").trigger("click"),
                a.trigger("addAttachment")
            });*/
            /* 各种卡片的触发器
            $("body").on("click", ".remind-toggle",
            function(a) {
                if ($(this).attr("userId") || $(this).attr("targetId") || $(this).attr("module"))(0 == $(this).parents("#entitybox").size() ? new g({
                    obj: $(this),
                    el: "body"
                }) : new g({
                    obj: $(this),
                    el: "#entitybox"
                })).render(),
                0 < $("#htmleditmodeEsc").length ? $("body").find("#remind-div").css("z-index", "1036") : null != $(".modal-backdrop.fade.in").get(0) && $("body").find("#remind-div").addClass("highIdex")
            });
            $("body").on("click", ".shareout-toggle",
            function(a) {
                $(this).attr("targetId") && $(this).attr("module") && ((0 == $(this).parents("#entitybox").size() ? new l({
                    obj: $(this),
                    el: "body"
                }) : new l({
                    obj: $(this),
                    el: "#entitybox"
                })).render(), 0 < $("#htmleditmodeEsc").length ? $("body").find("#shareout-div").css("z-index", "1036") : null != $(".modal-backdrop.fade.in").get(0) && $("body").find("#shareout-div").addClass("highIdex"))
            });
            $("body").on("click", ".agenda-toggle",
            function(a) {
                if (($(this).attr("userId") || $(this).attr("targetId") || $(this).attr("module")) && $(this).attr("targetId") && $(this).attr("module")) {
                    a = $(this).attr("targetId");
                    var b = $(this).attr("module"),
                    c = $(this).attr("entity-title"),
                    g = new Date,
                    d = g.getFullYear(),
                    k = g.getMonth(),
                    k = k + 1,
                    k = 10 > k ? "0" + k: k,
                    l = g.getDate(),
                    g = l,
                    l = l + 1,
                    g = d + "-" + k + "-" + (10 > g ? "0" + g: g),
                    d = d + "-" + k + "-" + (10 > l ? "0" + l: l),
                    g = Date.create(g).getTime(),
                    d = Date.create(d).getTime(),
                    m = new e({
                        entityModule: "agenda",
                        obj: $(this),
                        entityId: "new",
                        allDay: !0,
                        start: g,
                        end: d,
                        fromTargetId: a,
                        fromModule: b,
                        fromTargetName: c,
                        callbacks: {
                            afterOpen: function() {
                                $("#entitybox-container .j_title").focus()
                            },
                            afterOperate: function() {
                                m.close();
                                f.notify("\u65e5\u7a0b\u521b\u5efa\u6210\u529f")
                            }
                        }
                    });
                    m.render()
                }
            });
            $("body").on("click", ".entitybox-toggle",
            function(a) {
                var b = $(this).attr("data-module");
                a = $(this).attr("data-id");
                var c = $(this).attr("data-target"),
                g = $(this).attr("data-value"),
                d = $(this).attr("userId"),
                f = $(this).data("style") ? $(this).data("style").autoheight: !1,
                k = $(this).attr("data-type");
                if (b && a) {
                    var l = new e({
                        entityModule: b,
                        entityId: a,
                        entityValue: g,
                        autoHeight: f,
                        dataType: k,
                        target: $(this),
                        userId: d,
                        callbacks: {
                            afterOpen: function() {
                                c && $("#entitybox-container " + c).focus()
                            },
                            afterOperate: function() {
                                l.close();
                                "agenda" == b && (1 == $("#portal-container #calendar-list").size() && $("#portal-container #calendar-list").trigger("refresh"), $("#calendar").trigger("refetch"))
                            }
                        },
                        page: x
                    });
                    l.render()
                }
            });
            $("body").on("click", ".usercard-toggle",
            function(a) { (a = $(this).attr("userId")) && "10000" != a && (new b({
                    targetEl: $(this),
                    userId: a
                })).render()
            });
            $("body").on("click", ".remindcard-toggle",
            function(b) { (b = $(this).attr("data-id")) && (new a({
                    targetEl: $(this),
                    userId: b
                })).render()
            });
            $("body").on("click", ".locus-toggle",
            function(a) {
                a = $(this).attr("user-id");
                var b = $(this).attr("user-name");
                a && (new d({
                    userId: a,
                    userName: b
                })).render()
            });*/
            /*$("body").on("click", ".entity-toggle",
            function(a) {
                a = $(this);
                var b = $(this).parents(".mainline-controls"),
                e = [],
                g = $(this).find("#js_customer-import-btn").attr("taskid");
                1 == b.size() && b.find(".entity-container .entity-item").each(function() {
                    e.push($(this).data("object"))
                });
                b = a.prev("input"); (new c({
                    targetEl: a,
                    keyword: b ? b.val() : "",
                    currentTaskId: g,
                    module: a.attr("module"),
                    type: a.attr("data-type"),
                    seletedList: e
                })).render()
            });*/
            /*$("body").off("mouseenter", ".entity-item").on("mouseenter", ".entity-item",
            function(a) {
                $(this).attr("undeletable") || $(this).parents(".entity-container").attr("undeletable") || $(this).find("a:first").after('\x3ca class\x3d"close" title\x3d"\u5220\u9664"\x3e\x26times;\x3c/a\x3e')
            });
            $("body").off("mouseleave", ".entity-item").on("mouseleave ", ".entity-item",
            function(a) {
                $(this).find(".close").remove()
            });
            $("body").off("click", ".entity-item .close").on("click ", ".entity-item .close",
            function(a) {
                a = $(this).prevAll("a").attr("id");
                var b = $(this).prevAll("a").attr("data-value"),
                e = $(this).parents(".entity-container"),
                c = e.attr("data-url");
                if (c && b) {
                    var g = $(this).parent(),
                    d = e.data("param") || {};
                    d._method = "delete";
                    a = function(a) {
                        a && $.ajax({
                            type: "POST",
                            dataType: "json",
                            data: d,
                            url: c.replace("{id}", b),
                            success: function(a) {
                                g.remove();
                                e.trigger("removeEntity", a);
                                $("#stream").trigger("insertStream", a.streams || a.stream);
                                $("#readinfo").trigger("updateReadInfo");
                                f.notify("\u6570\u636e\u5df2\u5220\u9664")
                            }
                        })
                    };
                    e.attr("data-noConfirm") ? a(!0) : f.confirm("确定要删除吗？", a)
                } else $(this).parent().hasClass("tag") || ($(this).parent(".entity-item").remove(), e.trigger("removeEntity", a))
            });
            $("body").off("click", ".j_btn_close").on("click ", ".j_btn_close",
            function(a) {
                a = $(this);
                window.formJsonStr = null; (a = a.parents("#entitybox")) && 0 < a.length ? a.find(".modal-header .close").click() : $("body").trigger("slideClose")
            });*/
            /*$("body").off("triggerClose").on("triggerClose",
            function(a) {
                var b = location.pathname;
                a = location.hash;
                b = b.substring(0, b.lastIndexOf("/"));
                "" == b && "" != a && (b = "/" + a.substring(1, a.lastIndexOf("/")));
                ROUTER.navigate(b, {
                    trigger: !0
                })
            });*/
            /* 给checkbox用的
            $("body").off("click", ".j_center .e-list .checkbox").on("click", ".j_center .e-list .checkbox",
            function(a) {
                var b = !1;
                $(this).find("i").hasClass("icon-checkbox-checked") && (b = !0);
                a.stopPropagation();
                $(this).find("i").toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
                $(this).parent("li").toggleClass("selected");
                b ? $(".main .j_check-all").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked") : 0 == $(".j_center .e-list i.icon-checkbox-unchecked").size() && $(".main .j_check-all").removeClass("icon-checkbox-unchecked").addClass("icon-checkbox-checked");
                $("body").trigger("batch")
            });
            $("body").off("click", ".j_check-all").on("click", ".j_check-all",
            function() {
                var a = !1;
                $(this).hasClass("icon-checkbox-checked") && (a = !0);
                a ? $(this).parents(".main").find(".j_center span.checkbox").each(function() {
                    $(this).find("i").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
                    $(this).parent("li").removeClass("selected")
                }) : $(this).parents(".main").find(".j_center span.checkbox").each(function() {
                    $(this).find("i").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
                    $(this).parent("li").addClass("selected")
                });
                $(".main .j_check-all").toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
                $("body").trigger("batch")
            });
            $("body").off("batch").on("batch",
            function(a) {
                0 < $(".main").find(".j_center .selected").size() ? ($("body").addClass("batch-open"), $(".j_batchEl").removeClass("hide")) : ($("body").removeClass("batch-open"), $(".j_batchEl").addClass("hide"))
            });*/
            /*$("body").off("click", ".typeahead-search,.selector-toggle").on("click", ".typeahead-search,.selector-toggle",
            function() {
                var a = $(this);
                switch (a.attr("data-entity")) {
                case "employee":
                    (new m({
                        $target:
                        $(this)
                    })).open();
                    break;
                case "department":
                    (new p({
                        $el:
                        $(this)
                    })).open();
                    break;
                case "group":
                    (new r({
                        $el:
                        $(this)
                    })).open();
                    break;
                case "formLabel":
                    (new u({
                        $el:
                        $(this)
                    })).open();
                    break;
                case "tag":
                    var b = "1" == a.siblings("input").attr("privacy") ? !0 : !1; (new k({
                        $el: $(this),
                        privacy: b
                    })).open();
                    break;
                case "formtag":
                    b = "1" == a.siblings("input").attr("privacy") ? !0 : !1,
                    (new s({
                        $el: $(this),
                        privacy: b,
                        module: "biaoge"
                    })).open()
                }
                a = a.parents(".typeahead-wrapper");
                0 < a.length && a.find(".control-input").trigger("focusout.controlinput", "tt")
            });*/
            $("body").off("click", ".btn-back,.btn-group .back").on("click", ".btn-back,.btn-group .back",
            function(a) {
                0 < $(this).parents("#entitySlider").size() ? $("body").trigger("slideClose") : 0 < $(this).parents("#entitybox").size() ? $("#entitybox").modal("hide") : history.back();
                return ! 1
            });
            /*$("body").off("click", ".btn-feedback").on("click", ".btn-feedback",
            function() {
                var a = $(this).parents("#entitybox");
                0 == a.length && (a = $("#entitySlider"));
                a.find(".extend-comment").hasClass("active") ? a.find("#comment-textarea").focus() : a.find(".extend-comment").trigger("click.extend");
                var b = a.find(".extend-panel").position().top;
                a.find(".scrollwrapper").mCustomScrollbar("scrollTo", b - 100)
            });
            $("body").off("click", ".share-join").on("click", ".share-join",
            function() {
                var a = $(this).attr("entityId"),
                b = $(this).attr("module");
                $.ajax({
                    type: "post",
                    dataType: "json",
                    data: {
                        entityId: a,
                        module: b
                    },
                    url: "/blog-message/shareApply.json",
                    success: function(a) {
                        f.notify("\u5171\u4eab\u7533\u8bf7\u5df2\u53d1\u9001")
                    }
                })
            });*/
            $(window).on("resize",
            function(a) {
                setTimeout(function() {
                    $("body div.scrollwrapper").each(function(a) {
                        $(this).trigger("resizeSroll", a)
                    })
                },
                100);
                if (0 < $("body").find("#navigation .j_basenav").length) {
                    a = $("body").find("#navigation .j_basenav").offset().top || 0;
                    for (var b = $("body").find("#navigation .j_baseautolis li"), e = 0, c = b.length; e < c; e++) if ($(b[e]).hasClass("active")) { ($(b[e]).offset().top || 0) > a ? $("#navigation .j_activeli").addClass("active").html($(b[e]).find("a").clone() || "") : $("#navigation .j_activeli").empty();
                        break
                    }
                }
            });
            $("body").off("resizeSroll").on("resizeSroll", "div.scrollwrapper",
            function(a) {
                a = $(this);
                if (a.attr("horizontal")) {
                    var b = $(window).width(),
                    e = a.offset().left;
                    a.css("width", b - e)
                } else {
                    b = a.attr("height");
                    b || (b = a.attr("marginbottom") || 0, e = a.offset().top, b = $(window).height() - e - b);
                    if (null != a.parents("#entitybox").get(0)) var c = a.parents("#entitybox").find(".modal-content"),
                    e = c.height(),
                    c = c.offset().top,
                    e = $(window).height() - e - c,
                    b = b - e;
                    a.css("height", b)
                }
                a.mCustomScrollbar("update")
            });
            $("body").off("rViewSlide").on("rViewSlide",
            function(a) {
                1439 < $(window).width() ? ($(".j_sidebarPren").addClass("sidebar-in"), $(".j_sidebarCtrl").data("open", !0).addClass("on")) : ($(".j_sidebarPren").removeClass("sidebar-in"), $(".j_sidebarCtrl").data("open", !1).removeClass("on"));
                setTimeout(function() {
                    $(window).trigger("resize.customerTable")
                },
                400)
            });
            /*$("body").off("click", ".j_sidebarCtrl").on("click", ".j_sidebarCtrl",
            function() {
                $(this).data("open") ? ($(".j_sidebarPren").removeClass("sidebar-in"), $(this).data("open", !1).removeClass("on")) : ($(".j_sidebarPren").addClass("sidebar-in"), $(this).data("open", !0).addClass("on"));
                setTimeout(function() {
                    $(window).trigger("resize.customerTable")
                },
                400)
            });*/
            /*setInterval(function() {
                $('[data-toggle\x3d"tooltip"]').tooltip({
                    container: "body",
                    animation: !0,
                    html: !0
                })
            },
            1E3);*/
            $("body").off("mouseenter", "li.search").on("mouseenter", "li.search",
            function() {
                var a = $(this).find("input");
                a.focus().addClass("on").attr("placeholder", a.next().attr("title"))
            });
            $("body").off("mouseleave", "li.search").on("mouseleave", "li.search",
            function() {
                var a = $(this).find("input");
                "" == $.trim(a.val()) && a.removeAttr("placeholder").blur().removeClass("on")
            });
            $("body").off("blur", "li.search input").on("blur", "li.search input",
            function() {
                var a = $(this);
                "" == $.trim(a.val()) && a.removeAttr("placeholder").removeClass("on")
            });
            /*$("body").off("paste", "textarea.smart-title").on("paste", "textarea.smart-title",
            function(a) {
                if ((a = ((a.originalEvent || a).clipboardData || window.clipboardData).getData("text")) && (0 < a.indexOf("\n") || 0 < a.indexOf("\r"))) return a = a.replace(/[\n\r]/g, ""),
                $(this).val($(this).val() + a),
                !1
            });*/
            $("body").click(function(a) {
                a = $(a.target);
                0 == a.closest(".j_form_goalSlideCtrl").length && 0 == a.closest(".j_form_list_head").length && $(".j_form_goalSlideObj").removeClass("sidebar-in")
            })
        }
    }
});
