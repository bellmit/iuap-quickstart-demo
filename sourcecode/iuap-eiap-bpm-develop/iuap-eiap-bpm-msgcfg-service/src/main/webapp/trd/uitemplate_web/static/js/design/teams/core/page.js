define("teams/core/page", ["teams/utils"],
function() {
    var f = require("teams/utils"),
    h = Backbone.View.extend({
        initialize: function(d) {
            this.el = "#mainContainer"
        },
        render: function() {
            console.error("you need to rewrite the method : render")
        },
        renderSubview: function() {
            console.error("you need to rewrite the method : renderSubview")
        },
        _render: function(d) {
            $(".modal-backdrop,.modal").remove();
            if (d) {
                $(d).parents("aside.aside").find(".active").removeClass("active")
                $(d).addClass("active")
                if ($("body").find(".aside-nav").data("nav")) {
                    $(".aside-nav>li>ul").find(".active").parents(".sub-nav").show().prev().addClass("on")
                }
                $("body").trigger("sideNav")
            }
            this.mainView.render()
        },
        _renderSubview: function() {
            var d = this;
            if (this.mainView.subView = this.subView) this.subView.on("all",
            function(c, b) {
                d.trigger(c, b)
            }),
            this.subView.render()
        },
        initLayout: function(d, c) {
            $(this.el);
            if ("portal" == this.pageActive) {
                $("body").find("#smwx_box").addClass("hide");
            } else {
                $("body").find("#smwx_box").removeClass("hide")
            }
            $("body").trigger("slideClose");
            var b = !1,
            a = "j_modnav-" + this.pageActive;
            $("#navigation .j_nav_ul li").removeClass("active");
            for (var e = $("#navigation .j_nav_ul .j_baseautolis li"), g = 0, h = e.length; g < h; g++) if ($(e[g]).find("a").hasClass(a)) {
                b = !0;
                break
            }
            b ? ($("#navigation").find(".j_modnav-" + this.pageActive).parent().addClass("active"), $("#navigation .j_activeli").empty()) : (b = $(".j_pageActive").find(".j_modnav-" + this.pageActive).clone(), b.find("span").eq(1).remove(), $("#navigation .j_activeli").addClass("active").html(b || ""));
            null == this.pageActive ? $("#navigation .j_activeli,#navigation .j_homeli").removeClass("active") : "portal" == this.pageActive ? ($("#navigation .j_activeli").removeClass("active"), $("#navigation .j_homeli").addClass("active")) : ($("#navigation .j_activeli").addClass("active"), $("#navigation .j_homeli").removeClass("active"));
            // this.browserTit();
            this.template && (
                $("#mainContainer").html(f.template(this.template, d))//,
                // TEAMS.blogUser && c && c(),
                // TEAMS.noSubordinates && $("#mainContainer").find(".j_subordinates,.j_subordinate").remove(),
                // null != this.userId && this.userId != TEAMS.currentUser.id && $("#mainContainer").find(".aside-nav>li").not(":first").remove()
            );
            0 < $(".aside-nav-scroll:not(.mCustomScrollbar)").length && f.layout(".aside-nav-scroll", [{
                gotoTopButton: !1
            }])
        },
        /* 修改title的函数
        browserTit: function() {
            var d, c = $(".j_pageActive").find(".j_modnav-" + this.pageActive + " span:eq(0)").text() || "eteams";
            oldbt = document.title;
            d = oldbt.slice(oldbt.indexOf(" - "));
            c && (document.title = "portal" == this.pageActive || null == this.pageActive ? "eteams" + d: c + d);
            if (this.isPrintPage) switch (this.pageKey) {
            case "flow":
                document.title = "\u5ba1\u6279\u6253\u5370" + d;
                break;
            case "task":
                document.title = "\u4efb\u52a1\u6253\u5370" + d;
                break;
            case "workreport":
                document.title = "\u62a5\u544a\u6253\u5370" + d
            }
        },*/
        remove: function() {
            this.off();
            this.undelegateEvents();
            this.subView && (this.subView.off(), this.subView.remove(), this.subView = null);
            this.mainView && (this.mainView.off(), this.mainView.remove(), this.mainView = null)
        }
    });
    return h
});
