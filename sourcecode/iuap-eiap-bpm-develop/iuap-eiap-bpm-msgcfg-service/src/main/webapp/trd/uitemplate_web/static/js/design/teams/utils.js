define("teams/utils", ["teams/component/template"],
function() {
    var f = require("teams/component/template"),
    d = {
        defaults: {
            el: "input.datepicker",
            callback: function(a) {},
            eventType: "focusin.datePicker"
        },
        init: function(a) {
            var b = [];
            $.isArray(a) ? b = a: b.push(a);
            for (var c = 0; c < b.length; c++) {
                a = b[c];
                if ($.isFunction(a)) {
                    var d = a;
                    a = {};
                    a.callback = d
                }
                a = $.extend(!0, {},
                this.defaults, a); (function(a) {
                    var b = $(a.el),
                    c = b.attr("format") || "yyyy-mm-dd",
                    e = b.attr("startView") || "month",
                    d = b.attr("minView") || "month",
                    g = b.attr("maxView") || "decade",
                    f = b.attr("position") || "bottom-right",
                    l = b.attr("dateGroup"),
                    h = b.attr("writeValue"),
                    y = b.attr("insertAfter"),
                    z = a.startDate || null,
                    n = a.endDate || null,
                    q = a.callback;
                    b.each(function() {
                        var a = $(this);
                        a.on("focusin.datePicker",
                        function() {
                            a.datetimepicker({
                                format: c,
                                language: "zh-CN",
                                todayHighlight: !0,
                                todayBtn: l,
                                autoclose: !0,
                                initialDate: new Date,
                                startView: e,
                                minView: d,
                                maxView: g,
                                pickerPosition: f,
                                showMeridian: !1,
                                writeValue: h,
                                startDate: z,
                                endDate: n
                            }).on("show",
                            function() {
                                y && !a.attr("relocated") && (a.data("datetimepicker").picker.insertAfter(a).css("position", "fixed"), a.attr("relocated", !0))
                            });
                            a.datetimepicker("show");
                            a.off("focusin.datePicker")
                        }).on("changeDate",
                        function(a) {
                            q(a)
                        })
                    })
                })(a)
            }
        },
        remove: function(a) {
            if (arguments) for (var b = 0; b < arguments.length; b++) $(arguments[b]).datetimepicker("remove")
        }
    },
    c = {
        setLayout: function(a, b, c) {
            if (0 == a.indexOf("#print")) $(a).removeClass("scrollwrapper");
            else {
                var d = $(a);
                if (d) {
                    var f = d.attr("height"),
                    k = d.attr("auto-scroll");
                    if (!f) var f = d.attr("marginbottom") || 0,
                    h = d.offset().top,
                    f = $(window).height() - h - f;
                    if (null != d.parents("#entitybox").get(0)) var p = d.parents("#entitybox").find(".modal-content"),
                    h = p.height(),
                    p = p.offset().top,
                    h = $(window).height() - h - p,
                    f = f - h;
                    h = d.attr("theme") ? d.attr("theme") : "darkblue";
                    if (!d.hasClass("mCustomScrollbar")) {
                        p = {
                            onScroll: function() {
                                $("body .goto-top").removeClass("hide")
                            },
                            onTotalScrollBack: function() {
                                $("body .goto-top").addClass("hide")
                            }
                        };
                        if (b) {
                            $.isArray(b) && (c = b);
                            c && !c[0].gotoTopButton && (p.onScroll = null, p.onTotalScrollBack = null);
                            var r = $.extend(p, b)
                        }
                        b = {
                            theme: h,
                            callbacks: r ? r: p
                        };
                        if (c) var u = $.extend(b, c[0]);
                        c && "x" == c[0].axis && (k = "yes");
                        f && "yes" != k && d.css("height", f);
                        d.mCustomScrollbar(u ? u: b);
                        c && !c[0].bottomBlank && null != d.parents("#entitybox").get(0) && d.children().children(".mCSB_container").addClass("pb-0");
                        "#chat-container" == a && (d.mCustomScrollbar("update"), d.mCustomScrollbar("scrollTo", "bottom"));
                        setTimeout(function() {
                            $("body .goto-top").addClass("hide")
                        },
                        200)
                    }
                }
            }
        },
        destroy: function(a) {
            $(a).mCustomScrollbar("destroy")
        }
    },
    b = function(a, b, c) {
        "function" == typeof b && (c = b);
        var d = 1,
        f = 0,
        k = a.find(".slide-con .slide-item"),
        h = k.length,
        p = function(a) {
            k.eq(a).css({
                display: "block",
                opacity: 0
            }).animate({
                opacity: 1
            }).siblings().css({
                display: "none",
                opacity: 0
            });
            b.count && null != v.get(0) && v.eq(a).addClass("active").siblings().removeClass("active");
            c && c()
        };
        if (b.count) {
            a.prepend('\x3cdiv class\x3d"slide-num"\x3e\x3c/div\x3e');
            a.find(".slide-num").prepend("\x3cul\x3e\x3c/ul\x3e");
            for (var r = a.find(".slide-num ul"), u = 0; u < h; u++) num = u + 1,
            r.append("\x3cli\x3e\x3cspan\x3e" + num + "\x3c/span\x3e\x3c/li\x3e");
            var v = a.find(".slide-num ul li");
            v.click(function() {
                d = f = $(this).index();
                p(d)
            });
            v.eq(0).trigger("click")
        }
        if (b.pager) {
            var r = b.pager.prev || ".prev",
            u = b.pager.next || ".next",
            w = r.slice(r.indexOf(".") + 1),
            x = u.slice(u.indexOf(".") + 1);
            a.prepend('\x3cdiv class\x3d"' + w + '"\x3e\x3ca\x3e\x3c/a\x3e\x3c/div\x3e\x3cdiv class\x3d"' + x + '"\x3e\x3ca\x3e\x3c/a\x3e\x3c/div\x3e');
            a.find(u).click(function() {
                d = d == h - 1 ? 0 : ++d;
                p(d)
            });
            a.find(r).click(function() {
                d = 0 == d ? h - 1 : --d;
                p(d)
            })
        }
        if (b.autoslide) {
            var y = b.speed || 4E3,
            z = function() {
                d = d == h - 1 ? 0 : ++d;
                p(d)
            };
            t = setInterval(z, y);
            a.hover(function() {
                clearInterval(t)
            },
            function() {
                t = setInterval(z, y)
            })
        }
        b.facybox && a.find(".slide-item").fancybox(b.facybox)
    },
    h = {
        layout: function(a, b, d) {
            c.setLayout(a, b, d)
        },
        gotoTop: function(a, b) {
            a ? $(a).hasClass("mCustomScrollbar") && ($(a).mCustomScrollbar("update"), $(a).mCustomScrollbar("scrollTo", "top")) : ($(".mCustomScrollbar").mCustomScrollbar("update"), $(".mCustomScrollbar").mCustomScrollbar("scrollTo", "top"));
            b && b();
            setTimeout(function() {
                $("body .goto-top").addClass("hide")
            },
            200)
        },
        destroyLayout: function(a) {
            c.destroy(a)
        },
        template: function(a, b) {
            var c = f[a];
            return b ? _.template(c, b) : c
        },
        datepicker: function(a) {
            d.init(a)
        },
        removeDatepicker: function(a) {
            d.remove(a)
        },
        alert: function(a, b) {
            bootbox.alert(a, b ||
            function() {})
        },
        confirm: function(a, b) {
            bootbox.confirm(a,
            function(a) {
                b && b(a)
            })
        },
        prompt: function(a, b) {
            bootbox.prompt(a,
            function(a) {
                b && b(a)
            })
        },
        notify: function(a, b, c, d) {
            void 0 == d && (d = !0);
            a = {
                sticker: !1,
                shadow: !1,
                history: !1,
                hide: d,
                opacity: .95,
                animation: {
                    effect_in: "slide",
                    effect_out: "none"
                },
                text: a,
                title: b
            };
            switch (c) {
            case "error":
                a.type = "error";
                break;
            case "info":
                a.type = "info";
                break;
            case "success":
                a.type = "success"
            }
            $.pnotify_remove_all();
            $.pnotify(a)
        },
        serialize: function(a) {
            $form = $(a);
            var b = "";
            $form.find("input[type!\x3d'radio'],textarea").each(function() {
                var a = $(this).attr("name"),
                c = $(this).val();
                a && c && (b += a + "\x3d" + c.replace(/\r\n|\n/g, "") + "\x26")
            });
            $form.find("input[type\x3d'radio']").each(function() {
                var a = $(this).attr("name"),
                c = $(this).val();
                a && c && $(this).prop("checked") && (b += a + "\x3d" + c + "\x26")
            });
            return b = b.substring(0, b.length - 1)
        },
        toSimpleJSONString: function(a) {
            var b = "";
            if (a) {
                a = a.split("\x26");
                for (var c = 0,
                d = a.length; c < d; c++) {
                    var f = a[c].split("\x3d");
                    f[1] && (b += '"' + f[0] + '":"' + f[1] + '",')
                }
                b && (b = b.substring(0, b.length - 1), b = "{" + b + "}")
            }
            return b
        },
        initUrl: function(a, b) {
            if (!a) return b;
            for (var c = "",
            d = 0; d < a.length; d++) {
                var f = $.trim(a[d]);
                if (! (0 <= c.indexOf(f))) {
                    if (0 == f.indexOf("http") || 0 == f.indexOf("https") || 0 == f.indexOf("ftp")) for (var k = b.split(f), h = "", p = 0; p < k.length - 1; p++) h += k[p] + '\x3ca target\x3d"_blank" href\x3d"' + f + '"\x3e' + f + "\x3c/a\x3e";
                    else for (k = b.split(f), h = "", p = 0; p < k.length - 1; p++) h += k[p] + '\x3ca target\x3d"_blank" href\x3d"http://' + f + '"\x3e' + f + "\x3c/a\x3e";
                    b = h + k[k.length - 1];
                    c += a[d] + "  "
                }
            }
            return b
        },
        initMessage: function(a) {
            a = a.replace(/</g, "\x26lt").replace(/>/g, "\x26gt").replace(/\r\n|\n/g, " \x3cbr/\x3e").replace(/ /g, "  ");
            var b = a.match(RegExp("(((ht|f)tp(s?))://)?(www.|([a-zA-Z]+[.]{1}))[a-zA-Z0-9-.]*(com|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk|cn)(/($|[a-zA-Z0-9:.;?'\\+\x26amp;%$#\x3d~_-])+)*", "g"));
            return a = this.initUrl(b, a)
        },
        toJSONString: function(a) {
            $form = $(a);
            return this.toSimpleJSONString(this.serialize(a))
        },
        getList: function(a) {
            var b = "",
            c = this;
            $(a).each(function() {
                var a = c.toJSONString(this);
                a && (b += a + ",")
            });
            b && (b = b.substring(0, b.length - 1));
            return "[" + b + "]"
        },
        getMap: function(a) {
            var b = "",
            c = this;
            $(a).each(function() {
                var a = c.toJSONString(this);
                a && (b += a.substring(0, a.length - 1).substring(1) + ",")
            });
            b && (b = b.substring(0, b.length - 1));
            return "{" + b + "}"
        },
        getPrev: function(a) {
            var b = 0;
            a = $(a);
            a.each(function(a) {
                $(this).hasClass("active") && (b = a)
            });
            return 0 == b ? null: $(a[b - 1])
        },
        getNext: function(a) {
            var b = 0;
            a = $(a);
            a.each(function(a) {
                $(this).hasClass("active") && (b = a)
            });
            return b == a.length - 1 ? null: $(a[b + 1])
        },
        highLight: function(a, b) {
            $(a + " li.active").removeClass("active");
            $(a + " #" + b).addClass("active");
            $(a + " #" + b).find(".title").focus()
        },
        rebuildSN: function(a) {
            var b = $(a).children();
            a.data("index", b.length);
            for (a = 0; a < b.length; a++) $(b[a]).find(".sn,.sn-link").html(a + 1)
        },
        convert2Html: function(a) {
            return a ? a.replace(/\r\n|\n/g, "\x3cbr/\x3e").replace(/[ ]/g, "\x26nbsp;") : a
        },
        getDocTypeImgClass: function(a) {
            return "image" === a ? "doctype-image": "office" === a ? "doctype-office": "video" === a ? "doctype-video": "audio" === a ? "doctype-audio": "pdf" === a ? "doctype-pdf": "text" === a ? "doctype-txt": "html" === a ? "doctype-html": "doctype-other"
        },
        bindIframeToJQScroll: function(a, b) {
            var c = this.browser;
            a.get(0).onload = function() {
                var d = a.get(0).contentWindow.document,
                f = function(a) {
                    a = a || window.event;
                    var d = Math.abs($("#" + b.children().attr("id") + "_container")[0].offsetTop),
                    d = c && c.ie ? d - a.wheelDelta: d + a.detail / 3 * 120;
                    0 <= d ? b.mCustomScrollbar("scrollTo", {
                        y: d,
                        x: Math.abs($("#" + b.children().attr("id") + "_container")[0].offsetLeft) + ""
                    }) : b.mCustomScrollbar("scrollTo", {
                        y: "0",
                        x: Math.abs($("#" + b.children().attr("id") + "_container")[0].offsetLeft) + ""
                    });
                    a.preventDefault && a.preventDefault();
                    return ! 1
                };
                c && c.chrome || (c && c.ie ? d.addEventListener("mousewheel", f, !1) : d.addEventListener("DOMMouseScroll", f, !1))
            }
        },
        gallery: function(a, c, d) {
            a = a.split(",");
            for (var f = [], h = 0; h < a.length; h++) {
                f[h] = $.trim(a[h]);
                var k = $(f[h]);
                b(k, c, d)
            }
        },
        browser: function() {
            var a = navigator.userAgent.toLowerCase(),
            b = window.opera,
            c = {
                ie: /(msie\s|trident.*rv:)([\w.]+)/.test(a),
                opera: !!b && b.version,
                webkit: -1 < a.indexOf(" applewebkit/"),
                mac: -1 < a.indexOf("macintosh"),
                quirks: "BackCompat" == document.compatMode
            };
            c.gecko = "Gecko" == navigator.product && !c.webkit && !c.opera && !c.ie;
            var d = 0;
            if (c.ie) {
                var d = a.match(/(?:msie\s([\w.]+))/),
                f = a.match(/(?:trident.*rv:([\w.]+))/),
                d = d && f && d[1] && f[1] ? Math.max(1 * d[1], 1 * f[1]) : d && d[1] ? 1 * d[1] : f && f[1] ? 1 * f[1] : 0;
                c.ie11Compat = 11 == document.documentMode;
                c.ie9Compat = 9 == document.documentMode;
                c.ie8 = !!document.documentMode;
                c.ie8Compat = 8 == document.documentMode;
                c.ie7Compat = 7 == d && !document.documentMode || 7 == document.documentMode;
                c.ie6Compat = 7 > d || c.quirks;
                c.ie9above = 8 < d;
                c.ie9below = 9 > d;
                c.ie11above = 10 < d;
                c.ie11below = 11 > d
            }
            c.gecko && (f = a.match(/rv:([\d\.]+)/)) && (f = f[1].split("."), d = 1E4 * f[0] + 100 * (f[1] || 0) + 1 * (f[2] || 0));
            /chrome\/(\d+\.\d)/i.test(a) && (c.chrome = +RegExp.$1);
            /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(a) && !/chrome/i.test(a) && (c.safari = +(RegExp.$1 || RegExp.$2));
            c.opera && (d = parseFloat(b.version()));
            c.webkit && (d = parseFloat(a.match(/ applewebkit\/(\d+)/)[1]));
            c.version = d;
            c.isCompatible = !c.mobile && (c.ie && 6 <= d || c.gecko && 10801 <= d || c.opera && 9.5 <= d || c.air && 1 <= d || c.webkit && 522 <= d || !1);
            return c
        } (),
        getCurParaJson: function() {
            var a = {},
            b = window.location.href;
            if ( - 1 != b.indexOf("?")) for (var b = b.split("?")[1].split("|"), c = 0; c < b.length; c++) a[b[c].split("_")[0]] = unescape(b[c].split("_")[1]);
            return a
        },
        getWeekDate: function(a) {
            a = a.clone().endOfISOWeek();
            return {
                year: a.getFullYear(),
                month: a.getMonth() + 1,
                week: 1 + Math.floor(a.daysSince(a.clone().beginningOfYear()) / 7)
            }
        },
        getWeeksOfYear: function(a) {
            var b = 0 == a % 4 && 0 != a % 100 || 0 == a % 400 ? 366 : 365;
            a = new Date(a, 11, 31);
            7 > a.getDay() && (b -= a.getDay());
            return Math.ceil(b / 7)
        }
    };
    return h
});
