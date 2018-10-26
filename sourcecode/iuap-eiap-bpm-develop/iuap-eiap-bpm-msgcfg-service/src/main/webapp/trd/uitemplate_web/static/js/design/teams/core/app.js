define("teams/core/app",
[
    "teams/utils",
    // "teams/component/top",
    // "teams/task/taskpage",
    // "teams/workflow/workflowpage",
    // "teams/base/clientview",
    // "teams/pages/searchpage",
    // "teams/feed/feedpage",
    // "teams/org/orgpage",
    // "teams/blog/blogpage",
    // "teams/pages/simplepage",
    // "teams/pages/logpage",
    // "teams/doc/documentpage",
    // "teams/mainline/mainlinelinkpage",
    // "teams/tag/tagpage",
    // "teams/tag/tagrecentview",
    // "teams/pages/wechatpage",
    // "teams/pages/messagespage",
    // "teams/pages/unreadfeedbackpage",
    // "teams/base/pwdview",
    // "teams/base/avatarview",
    // "teams/base/adviseview",
    // "teams/component/invitemodalview",
    // "teams/component/chatHistoryView",
    // "teams/component/quickInviteView",
    // "teams/component/guideview",
    // "teams/calendar/calendarpage",
    // "teams/calendar/agenda",
    // "teams/workreport/workreporttypepage",
    // "teams/workreport/workreportpage",
    // "teams/pages/printpage",
    // "teams/report/reportpage",
    // "teams/system/systempage",
    // "teams/profile/profilepage",
    // "teams/mainline/mainlinepage",
    // "teams/follow/followpage",
    // "teams/concerns/concernspage",
    // "teams/component/entityslider",
    "teams/form/formpage",
    // "teams/portal/portalmodel",
    // "teams/feed/eteamscounter",
    // "teams/websocket/websocket",
    // "teams/portal/portalpage",
    "teams/component/event"/*,
    "crm/CrmApp"*/
],
function() {
    var f = require("teams/utils")//,
    // d = require("teams/component/top"),
    // c = require("teams/task/taskpage"),
    // b = require("teams/workflow/workflowpage"),
    // a = require("teams/base/clientview"),
    // e = require("teams/pages/searchpage"),
    // g = require("teams/feed/feedpage"),
    /* l = require("teams/org/orgpage")*/;
    // m = require("teams/blog/blogpage"),
    // k = require("teams/pages/simplepage");
    // require("teams/pages/logpage");
    // var s = require("teams/doc/documentpage"),
    // p = require("teams/mainline/mainlinelinkpage"),
    // r = require("teams/tag/tagpage");
    // require("teams/tag/tagrecentview");
    // var u = require("teams/pages/wechatpage");
    // require("teams/pages/messagespage");
    // var v = require("teams/pages/unreadfeedbackpage"),
    // w = require("teams/base/pwdview"),
    // x = require("teams/base/avatarview"),
    // y = require("teams/base/adviseview"),
    // z = require("teams/component/invitemodalview"),
    // C = require("teams/component/chatHistoryView"),
    /*D = require("teams/component/quickInviteView")*/;
    // require("teams/component/guideview");
    // var F = require("teams/calendar/calendarpage");
    // require("teams/calendar/agenda");
    var /*B = require("teams/workreport/workreporttypepage"),
    A = require("teams/workreport/workreportpage"),*/
    // E = require("teams/pages/printpage"),
    // G = require("teams/report/reportpage"),
    // H = require("teams/system/systempage"),
    // K = require("teams/profile/profilepage"),
    // M = require("teams/mainline/mainlinepage"),
    // P = require("teams/follow/followpage"),
    // O = require("teams/concerns/concernspage"),
    // Q = require("teams/component/entityslider"),
    S = require("teams/form/formpage")//,
    //T = require("teams/portal/portalmodel"),
    /* R = require("teams/feed/eteamscounter")*/;
    // require("teams/websocket/websocket");
    var /*I = require("teams/portal/portalpage"),*/
    J = require("teams/component/event"),
    q = Backbone.View.extend({
        initialize: function(a) {
            // this.relogin = true;
            // if (document.location.href && -1 == document.location.href.indexOf("print/")) {
            //     this.top = new d
            //     this.top.render();
            // }
            // this.portalModel = new T
        },
        delegateEvents: function() {
            var b = this;
            J.initEvent();
            /* 团队成员里面打开企业微信窗口的事件
            $("body").on("click", ".wechat-toggle",
            function(a) {
                a.stopPropagation();
                a = $(this).data("employee");
                if (a) {
                    if (a.id != TEAMS.currentUser.id) {
                        if (b.lastPage && "portal" == b.lastPage.pageActive) {
                            $("#entitybox").modal("hide");
                            b.lastPage.trigger("showChat", a);
                        } else {
                            if (b.top.newmessage) {
                                b.top.newmessage.openChatWindow(a, "employee");
                                R.markMessageRead(b.type);
                            }
                        }
                    }
                }
            });*/
            /* 官方qq
            $("body").on("mouseenter", ".popover-toggle",
            function(a) {
                $(this).find(".popover-bottom").fadeTo(100, 1)
            }).on("mouseleave", ".popover-toggle",
            function(a) {
                $(this).find(".popover-bottom").fadeTo(0).hide()
            });*/
            /* 客户端下载
            $("body").off("click", "a.client-toggle").on("click", "a.client-toggle",
            function() { (new a).render()
            });*/
            /* 意见反馈
            $("body").on("click", ".advise-toggle",
            function(a) { (new y).render()
            });*/
            /*var c = -1;
            $(document).off("keydown").on("keydown",
            function(a) {
                c = a.keyCode;
                if (null == $(".modal-backdrop.fade.in").get(0) && 27 == c) {
                    b.initSlider({
                        callBack: function(a) {
                            a && (window.formJsonStr = null, $("body").trigger("slideClose"))
                        }
                    })
                }
            });*/
            /*$(window).off("beforeunload.dropdownmenu").on("beforeunload.dropdownmenu",
            function() {
                if (116 == c) c = -1;
                else if ( - 1 == navigator.userAgent.toLowerCase().indexOf("firefox") && TEAMS.currentUser.loginCount && 1 > TEAMS.currentUser.loginCount) return "您可以通过快捷键Ctrl+D将eteams加入到收藏夹"
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
            /* 修改密码
            $("body").off("click", "a.pwd-toggle").on("click", "a.pwd-toggle",
            function() {
                var a = $(this).attr("userId"),
                b = $(this).attr("type"); (new w({
                    userId: a,
                    type: b
                })).render()
            });*/
            /* 邀请同事弹窗
            $("body").off("click", "a.invite-toggle").on("click", "a.invite-toggle",
            function(a) { (new z).render()
            });
            $("body").off("click", "div.invite-toggle").on("click", "div.invite-toggle",
            function(a) { (new z).render()
            });*/
            /* 微信历史消息
            $("body").off("click", "a.chat-history-toggle").on("click", "a.chat-history-toggle",
            function(a) {
                a = $(this).data("chatType");
                if ("employee" == a) var b = $(this).data("targetId");
                else if ("channel" == a) var c = $(this).data("targetId"); (new C({
                    userId: b,
                    channelId: c,
                    chatType: a
                })).render()
            });*/
            /* 快速邀请
            $("body").off("click", "p.quick-invite-toggle").on("click", "p.quick-invite-toggle",
            function(a) {
                a = $(this).find("span").text();
                a = new D({
                    userName: a
                });
                a.render();
                setTimeout(a.focusInput, 200)
            });*/
            // $("body").off("click", "a.upload-toggle").on("click", "a.upload-toggle",
            // function() { (new x({})).renderBox()
            // });
            /* 共享，貌似也没用
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
                        f.notify("共享申请已发送")
                    }
                })
            });*/
            /* 侧边栏打开表单填写表单的按钮事件*/
            /*$("body").on("click", ".j_entityslider-toggle",
            function(a) {
                var c = $(this);
                $(this).parents(".unread").removeClass("unread");
                $(this).parents(".newComment").removeClass("newComment");
                b.initSlider({
                    callBack: function(a) {
                        if (a) {
                            a = c.attr("barType");
                            var b = c.attr("idList"),
                            e = c.attr("mainlineId"),
                            d = c.attr("group"),
                            f = c.attr("checkDate"),
                            g = c.attr("userName"),
                            h = c.attr("data-module"),
                            k = c.attr("data-id"),
                            l = c.attr("userId"),
                            m = c.attr("renderType"),
                            p = c.data("tolink"),
                            r = c.attr("formData"),
                            d = "mainlineState" == a && "新增" == d ? "add": c.attr("group");
                            $("body").trigger("slideOpen", {
                                barType: a,
                                mainlineId: e,
                                group: d,
                                checkDate: f,
                                userName: g,
                                module: h,
                                id: k,
                                idList: b,
                                userId: l,
                                renderType: m,
                                tolink: p,
                                formData: r
                            })
                        }
                    }
                })
            });*/
            /* 打开新slide页面*/
            /*$("body").off("slideOpen").on("slideOpen",
            function(a, c) {
                var e = c.barType,
                d = c.mainlineId,
                f = c.group,
                g = c.checkDate,
                h = c.userName,
                k = c.module,
                l = c.id,
                m = c.idList,
                p = c.userId,
                r = c.renderType,
                w = c.slideCallback,
                u = c.tolink,
                v = c.formData;
                "task" != k || $(this).hasClass("btn") || $(this).addClass("active");
                k && l && (b.entitySlider && b.entitySlider.remove(), e = new Q({
                    barType: e,
                    mainlineId: d,
                    group: f,
                    checkDate: g,
                    userName: h,
                    module: k,
                    id: l,
                    idList: m,
                    userId: p,
                    renderType: r,
                    page: b.lastPage,
                    slideCallback: w,
                    tolink: u,
                    formData: v
                }), e.render(), b.entitySlider = e)
            });*/
            /*$("body").on("click",
            function(a) {
                a = $(a.target);
                null == $("#entitybox").get(0) && 
                null == $(".modal-backdrop.fade.in").get(0) && 
                (a.hasClass("j_entityslider-toggle") || 
                    null != a.parents(".j_entityslider-toggle").get(0) || 
                    a.hasClass(".smwx-box") || 
                    null != a.parents(".smwx-box").get(0) || 
                    null != a.parents("body").get(0) && 
                    (a.hasClass("filterSlip_js") || 
                        null == a.parents(".filterSlip_js").get(0) && 
                        null == a.parents(".ui-pnotify ").get(0) && 
                        null == $(".fancybox-overlay.fancybox-overlay-fixed").get(0) && 
                        $("#entitySlider").hasClass("in") && 
                        (a.hasClass("fc-event-inner") || 
                            null != a.parents(".fc-event-inner").get(0) || 
                            null != a.parents("#fc-week").get(0) || 
                            "j_content" == a.context.id || 
                            "newAgenda" == a.context.id || 
                            0 < $(".js_stopExecute").size() || 
                            0 == a.closest("#entitySlider").length && 
                            b.initSlider({
                                callBack: function(a) {
                                    a && (window.formJsonStr = null, $("body").trigger("slideClose"))
                                }
                            })
                        )
                    )
                )
            });*/
            /* 关闭slide页面*/
            /*$("body").off("slideClose").on("slideClose",
            function(a) {
                $("#entitySlider").removeClass("in");
                b.entitySlider && b.entitySlider.remove();
                f.router && f.router.isInCrm() && ROUTER.navigate(f.router.getUrl({
                    info: {
                        view: ""
                    }
                }), {
                    trigger: !0
                })
            });*/
            /* 侧边栏导航的init貌似 */
            $("body").off("sideNav").on("sideNav",
            function() {
                $('.aside-nav[data-nav="fold"] li>div.link-item').each(function() {
                    null != $(this).next(".sub-nav").get(0) && $(this).css("cursor", "pointer");
                    $(this).append('<i class="icon-angle-down fr"></i>')
                });
                $("body").off("click", '.aside-nav[data-nav="fold"] li>div.link-item').on("click", '.aside-nav[data-nav="fold"] li>div.link-item',
                function(a) {
                    a = $(this).parent("li");
                    var b = $(this).next(".sub-nav");
                    null != b.get(0) && (b.is(":visible") ? (b.slideUp("fast"), $(this).removeClass("on")) : (b.slideDown("fast"), a.siblings().find("div.link-item").removeClass("on").end().find(".sub-nav").slideUp("fast"), $(this).addClass("on")))
                })
            });
            /* 下载什么玩意儿
            $("body").off("mouseenter", ".remoteDownload").on("mouseenter", ".remoteDownload",
            function(a) {
                a = $(this).data("dlid");
                a = crmContext.remoteDownloadUrl + "/remotedownload/" + a + "/" + ETEAMSID + "/true";
                $(this).data("dltype") && (a += "?type=" + $(this).data("dltype"));
                $(this).attr("href", a)
            });*/
            /* top导航的按钮事件
            $("#navigation").off("click", ".j_nav_ul a[class*='j_modnav-'], .j_nav_ul li.j_homeli a, #user-panel .j_user_menu_portal").on("click", ".j_nav_ul a[class*='j_modnav-'], .j_nav_ul li.j_homeli a, #user-panel .j_user_menu_portal",
            function(a) {
                var c = $(this);
                a = c.attr("href");
                c = c.data("url");
                a == c && b.setConfig(TEAMS.currentUser.id, a)
            })*/
        },
        /*initSlider: function(a) {
            a = a.callBack;
            if (window.formJsonStr && $("body .form-view_js").get(0) && window.formPlugin) {
                var b = formPlugin.submitAssembleForm({
                    parentEl: $("body .form-view_js")
                });
                b && (JSON.stringify(b.formData.dataDetails) != window.formJsonStr ? f.confirm("确定放弃填写表单吗？放弃后数据将不会被保存！", a) : a({
                    result: !0
                }))
            } else a({
                result: !0
            })
        },*/
        render: function(a, b) {
            if (this.crmApp && this.crmApp.lastPage) {
                this.crmApp.lastPage.remove();
                this.crmApp.lastPage = null
            }
            if (null == this.lastPage) {
                this.lastPage = a;
            } else if (this.lastPage.pageKey != a.pageKey || b) {
                if (this.lastPage.remove) {
                    this.lastPage.remove()
                } else {
                    if (this.lastPage.mainView) {
                        this.lastPage.mainView.remove();
                    }
                }
                this.lastPage = a;
            } else {
                this.update(a);
                this.lastPage.subView && (this.lastPage.subView.remove(), this.lastPage.renderSubview());
                return
            }
            this.lastPage.render();
            J.setLastPage(this.lastPage);
            $("body").trigger("rViewSlide");
            $(window).trigger("resize")
        },
        update: function(a) {
            this.lastPage.initialize(a);
            a.remove()
        },
        /*documents: function(a, b, c, e) {
            a || (a = TEAMS.currentUser.id);
            var d = new s({
                userId: a,
                id: b,
                type: c,
                folderId: e
            });
            this.top && this.top.renderNavUrl(a,
            function() {
                d.renderType()
            });
            this.render(d, !0)
        },
        mainline: function(a, b, c) {
            var e = new M({
                pageKey: "mainline-" + (b ? b: "mine"),
                userId: a,
                id: c,
                filterType: b
            });
            this.top && this.top.renderNavUrl(a,
            function() {
                e.renderType()
            });
            this.render(e)
        },
        mainlinelink: function(a, b, c, e, d, f) {
            $("#" + b + " .j_goalname").tooltip("hide");
            var g = new p({
                id: b,
                userId: a,
                mainlineType: c,
                module: d,
                objId: f,
                filterType: e
            });
            this.top && this.top.renderNavUrl(a,
            function() {
                g.renderType()
            });
            this.render(g)
        },
        tag: function(a, b) {
            var c = new r({
                type: a,
                id: b
            });
            this.render(c)
        },*/
        /*
        messages: function(a, b) {
            var c = new g({
                type: a,
                module: "messages",
                param: b,
                newMessage: this.top.newmessage
            });
            this.top && this.top.renderNavUrl();
            this.render(c)
        },
        wechats: function() {
            var a = new u({
                chatType: "unread",
                pageKey: "wechats"
            });
            this.render(a)
        },
        chat: function(a) {
            a = new u({
                id: a,
                pageKey: "chats"
            });
            this.render(a)
        },
        channel: function(a) {
            a = new u({
                id: a,
                chatType: "channel",
                pageKey: "channels"
            });
            this.render(a)
        },
        unreadfeedback: function(a, b) {
            var c = new v({
                userId: TEAMS.currentUser.id,
                module: a,
                id: b
            });
            this.render(c)
        },
        versioninfo: function(a) {
            a = new H({
                pageKey: "versioninfo",
                type: a
            });
            this.top && this.top.renderNavUrl();
            this.render(a)
        },*/
        renderForms: function(/*a, */b, c) {
            // var a || (a = TEAMS.currentUser.id);
            var e = new S({
                type: b,
                // userId: a,
                formId: c
            });
            /*this.top && this.top.renderNavUrl(a,
            function() {
                e.renderType()
            });*/
            this.render(e)
        },
        /*print: function(a, b) {
            var c = new E({
                pageKey: b,
                id: a
            });
            this.render(c)
        },
        invitation: function() {
            var a = new l({
                type: "invitation"
            });
            this.render(a)
        },
        showCrmPage: function(a) {
            var b = this;
            window.clickedCrmModule = !0;
            if (window.loadedCrmModule) {
                b.lastPage && (b.lastPage.mainView && b.lastPage.mainView.remove(), b.lastPage.remove(), null == b.lastPage);
                if (!b.crmApp) {
                    var c = require("crm/CrmApp");
                    b.crmApp = new c
                }
                b.crmApp.showPage(a, b.top, b)
            } else c = "",
            c = "develop" == TEAMS.runMode ? TEAMS.service.crm + "/static/js/crm-dev.js": TEAMS.service.crm + "/static/js/crm.js?v\x3d" + TEAMS.version + "\x26time\x3d" + (new Date).getTime(),
            seajs.use(c,
            function() {
                b.lastPage && (b.lastPage.mainView && b.lastPage.mainView.remove(), b.lastPage.remove(), null == b.lastPage);
                if (!b.crmApp) {
                    var c = require("crm/CrmApp");
                    b.crmApp = new c
                }
                b.crmApp.showPage(a, b.top, b)
            })
        },*/
        /*setConfig: function(a, b) {
            if (b && TEAMS.userConfig && a == TEAMS.currentUser.id) {
                for (var c = this.portalModel,
                e = null,
                d = !1,
                f = 0; f < TEAMS.userConfig.length; f++) if (e = TEAMS.userConfig[f], "system.menu.display" == e.configKey) {
                    d = !0;
                    f = e.configValue;
                    e.configValue = b;
                    f != b && c.updateConfigValue(e);
                    break
                }
                d || (e = {
                    configKey: "system.menu.display",
                    configValue: b
                },
                c.saveConfig(e,
                function() {
                    TEAMS.userConfig.push(e)
                }))
            }
        },*/
        /*getDispalyConfig: function(a, b) {
            if (a == TEAMS.currentUser.id && TEAMS.userConfig) if (b) {
                var c = new I({
                    userId: a,
                    channel: b
                });
                this.render(c)
            } else {
                var e = this._getConfig("system.menu.display", a);
                if (e) {
                    switch (e) {
                    case "/blog":
                        this.renderBlog(a);
                        break;
                    case "/workreport":
                        this.renderWorkReport(a);
                        break;
                    case "/workflows":
                        this.renderWorkflowByType(a);
                        break;
                    case "/mainlines":
                        this.mainline(a);
                        break;
                    case "/tasks":
                        this.renderTask(a);
                        break;
                    case "/calendar":
                        this.renderCalendar(a);
                        break;
                    case "/documents":
                        this.documents(a);
                        break;
                    case "/report/taskstatistics":
                        this.renderTaskStatistics(a);
                        break;
                    case "/info/wechat":
                        this.renderInfoByType("wechat");
                        break;
                    case "/info/wechatservice":
                        this.renderInfoByType("wechatservice");
                        break;
                    case "/forms":
                        this.renderForms(a);
                        break;
                    case "/crms/customer":
                        this.showCrmPage("customer");
                        break;
                    case "/crms/contact":
                        this.showCrmPage("contact");
                        break;
                    case "/crms/saleChance":
                        this.showCrmPage("saleChance");
                        break;
                    case "/crms/production":
                        this.showCrmPage("production");
                        break;
                    default:
                        c = new I({
                            userId: a,
                            pageKey: "portal"
                        }),
                        this.render(c)
                    }
                    ROUTER.navigate(e, {
                        trigger: !1
                    })
                } else c = new I({
                    userId: a,
                    pageKey: "portal"
                }),
                this.render(c)
            }
        },
        _getConfig: function(a, b) {
            var c = null;
            return b != TEAMS.currentUser.id ? null: (c = TEAMS.userConfig.find(function(b) {
                return b.configKey == a
            })) ? c.configValue: null
        },
        syncData_channel: function() {
            $.ajax({
                type: "get",
                url: "/synchronizeddata/syncData.json",
                dataType: "json",
                success: function(a) {
                    f.notify("\u66f4\u65b0\u5b8c\u6210")
                }
            })
        }*/
    });
    return q
});
