define(['jquery'],function($){
    var bootbox = function(w, r) {
        function m(b, a) {
            "undefined" === typeof a && (a = t);
            return "string" === typeof p[a][b] ? p[a][b] : "en" != a ? m(b, "en") : b
        }
        var t = "en"
          , u = !0
          , s = "static"
          , v = ""
          , h = {}
          , k = {}
          , n = {
            setLocale: function(b) {
                for (var a in p)
                    if (a == b) {
                        t = b;
                        return
                    }
                throw Error("Invalid locale: " + b);
            },
            addLocale: function(b, a) {
                "undefined" === typeof p[b] && (p[b] = {});
                for (var c in a)
                    p[b][c] = a[c]
            },
            setIcons: function(b) {
                k = b;
                if ("object" !== typeof k || null  === k)
                    k = {}
            },
            setBtnClasses: function(b) {
                h = b;
                if ("object" !== typeof h || null  === 
                h)
                    h = {}
            },
            alert: function() {
                var b = ""
                  , a = m("OK")
                  , c = null ;
                switch (arguments.length) {
                case 1:
                    b = arguments[0];
                    break;
                case 2:
                    b = arguments[0];
                    "function" == typeof arguments[1] ? c = arguments[1] : a = arguments[1];
                    break;
                case 3:
                    b = arguments[0];
                    a = arguments[1];
                    c = arguments[2];
                    break;
                default:
                    throw Error("Incorrect number of arguments: expected 1-3");
                }
                var e = n.dialog(b, {
                    label: a,
                    icon: k.OK,
                    "class": h.OK,
                    callback: c
                }, {
                    header: '\x3ci class\x3d"icon-ok-sign"\x3e\x3c/i\x3e \u6d88\u606f',
                    onEscape: c || !0
                });
                e.off("keyup.alert").on("keyup.alert", 
                function(a) {
                    13 == a.which && e.modal("hide")
                });
                return e
            },
            confirm: function() {
                var b = ""
                  , a = m("CANCEL")
                  , c = m("CONFIRM")
                  , e = null ;
                switch (arguments.length) {
                case 1:
                    b = arguments[0];
                    break;
                case 2:
                    b = arguments[0];
                    "function" == typeof arguments[1] ? e = arguments[1] : a = arguments[1];
                    break;
                case 3:
                    b = arguments[0];
                    a = arguments[1];
                    "function" == typeof arguments[2] ? e = arguments[2] : c = arguments[2];
                    break;
                case 4:
                    b = arguments[0];
                    a = arguments[1];
                    c = arguments[2];
                    e = arguments[3];
                    break;
                default:
                    throw Error("Incorrect number of arguments: expected 1-4");
                }
                var g = function() {
                    if ("function" === typeof e)
                        return e(!1)
                }
                  , l = function() {
                    if ("function" === typeof e)
                        return e(!0)
                }
                  , d = n.dialog(b, [{
                    label: c,
                    icon: k.CONFIRM,
                    "class": h.CONFIRM,
                    callback: l
                }, {
                    label: a,
                    icon: k.CANCEL,
                    "class": h.CANCEL,
                    callback: g
                }], {
                    header: '\x3ci class\x3d"icon-info-sign"\x3e\x3c/i\x3e \u786e\u8ba4',
                    onEscape: g
                });
                d.off("keyup.confirm").on("keyup.confirm", function(a) {
                    13 == a.which && (d.modal("hide"),
                    l())
                });
                return d
            },
            prompt: function() {
                var b = ""
                  , a = m("CANCEL")
                  , c = m("CONFIRM")
                  , e = null 
                  , g = "";
                switch (arguments.length) {
                case 1:
                    b = 
                    arguments[0];
                    break;
                case 2:
                    b = arguments[0];
                    "function" == typeof arguments[1] ? e = arguments[1] : a = arguments[1];
                    break;
                case 3:
                    b = arguments[0];
                    a = arguments[1];
                    "function" == typeof arguments[2] ? e = arguments[2] : c = arguments[2];
                    break;
                case 4:
                    b = arguments[0];
                    a = arguments[1];
                    c = arguments[2];
                    e = arguments[3];
                    break;
                case 5:
                    b = arguments[0];
                    a = arguments[1];
                    c = arguments[2];
                    e = arguments[3];
                    g = arguments[4];
                    break;
                default:
                    throw Error("Incorrect number of arguments: expected 1-5");
                }
                var l = r("\x3cform\x3e\x3c/form\x3e");
                l.append("\x3cinput class\x3d'input-block-level' autocomplete\x3doff type\x3dtext value\x3d'" + 
                g + "' /\x3e");
                var g = function() {
                    if ("function" === typeof e)
                        return e(null )
                }
                  , d = n.dialog(l, [{
                    label: c,
                    icon: k.CONFIRM,
                    "class": h.CONFIRM,
                    callback: function() {
                        if ("function" === typeof e)
                            return e(l.find("input[type\x3dtext]").val())
                    }
                }, {
                    label: a,
                    icon: k.CANCEL,
                    "class": h.CANCEL,
                    callback: g
                }], {
                    header: b,
                    show: !1,
                    onEscape: g
                });
                d.on("shown", function() {
                    l.find("input[type\x3dtext]").focus();
                    l.on("submit", function(a) {
                        a.preventDefault();
                        d.find(".btn-primary").click()
                    })
                });
                d.modal("show");
                return d
            },
            dialog: function(b, a, c) {
                function e(a) {
                    a = 
                    null ;
                    "function" === typeof c.onEscape && (a = c.onEscape());
                    !1 !== a && f.modal("hide")
                }
                var g = ""
                  , l = [];
                c || (c = {});
                "undefined" === typeof a ? a = [] : "undefined" == typeof a.length && (a = [a]);
                for (var d = a.length; d--; ) {
                    var h = null 
                      , k = null 
                      , q = null 
                      , m = ""
                      , p = null ;
                    if ("undefined" == typeof a[d].label && "undefined" == typeof a[d]["class"] && "undefined" == typeof a[d].callback) {
                        var h = 0, k = null , n;
                        for (n in a[d])
                            if (k = n,
                            1 < ++h)
                                break;
                        1 == h && "function" == typeof a[d][n] && (a[d].label = k,
                        a[d].callback = a[d][n])
                    }
                    "function" == typeof a[d].callback && (p = a[d].callback);
                    a[d]["class"] ? q = a[d]["class"] : 0 == d && 2 >= a.length && (q = "btn-primary");
                    !0 !== a[d].link && (q = "btn btn-sm " + q);
                    h = a[d].label ? a[d].label : "Option " + (d + 1);
                    a[d].icon && (m = "\x3ci class\x3d'" + a[d].icon + "'\x3e\x3c/i\x3e ");
                    a[d].href ? (k = a[d].href,
                    g = "\x3ca data-handler\x3d'" + d + "' class\x3d'" + q + "' href\x3d'" + k + "'\x3e" + m + "" + h + "\x3c/a\x3e" + g) : g = "\x3ca data-handler\x3d'" + d + "' class\x3d'" + q + "'\x3e" + m + "" + h + "\x3c/a\x3e" + g;
                    l[d] = p
                }
                d = ["\x3cdiv class\x3d'bootbox modal' tabindex\x3d'-1' style\x3d'overflow:hidden;'\x3e\x3cdiv class\x3d'modal-dialog'\x3e\x3cdiv class\x3d'modal-content'\x3e"];
                if (c.header) {
                    q = "";
                    if ("undefined" == typeof c.headerCloseButton || c.headerCloseButton)
                        q = "\x3ca href\x3d'javascript:;' class\x3d'close'\x3e\x26times;\x3c/a\x3e";
                    d.push("\x3cdiv class\x3d'modal-header'\x3e" + q + "\x3ch5 class\x3d'modal-title'\x3e" + c.header + "\x3c/h5\x3e\x3c/div\x3e")
                }
                d.push("\x3cdiv class\x3d'modal-body'\x3e\x3c/div\x3e");
                g && d.push("\x3cdiv class\x3d'modal-footer'\x3e" + g + "\x3c/div\x3e");
                d.push("\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e");
                var f = r(d.join("\n"));
                ("undefined" === typeof c.animate ? u : c.animate) && 
                f.addClass("fade");
                (g = "undefined" === typeof c.classes ? v : c.classes) && f.addClass(g);
                f.find(".modal-body").html(b);
                f.on("keyup.dismiss.modal", function(a) {
                    27 === a.which && c.onEscape && e("escape")
                });
                f.on("click", "a.close", function(a) {
                    a.preventDefault();
                    e("close")
                });
                f.on("shown", function() {
                    f.find("a.btn-primary:first").focus()
                });
                f.on("hidden.bs.modal", function(a) {
                    a.target === this && f.remove()
                });
                f.off("keyup").on("keyup", function(a) {
                    27 == a.which && f.modal("hide")
                });
                f.on("click", ".modal-footer a", function(b) {
                    var c = 
                    r(this).data("handler")
                      , d = l[c]
                      , e = null ;
                    if ("undefined" === typeof c || "undefined" === typeof a[c].href)
                        b.preventDefault(),
                        "function" === typeof d && (e = d(b)),
                        !1 !== e && f.modal("hide")
                });
                r("body").append(f);
                f.modal({
                    backdrop: "undefined" === typeof c.backdrop ? s : c.backdrop,
                    keyboard: !1,
                    show: !1
                });
                f.on("show", function(a) {
                    r(w).off("focusin.modal")
                });
                "undefined" !== typeof c.show && !0 !== c.show || f.modal("show");
                return f
            },
            modal: function() {
                var b, a, c, e = {
                    onEscape: null ,
                    keyboard: !0,
                    backdrop: s
                };
                switch (arguments.length) {
                case 1:
                    b = arguments[0];
                    break;
                case 2:
                    b = arguments[0];
                    "object" == typeof arguments[1] ? c = arguments[1] : a = arguments[1];
                    break;
                case 3:
                    b = arguments[0];
                    a = arguments[1];
                    c = arguments[2];
                    break;
                default:
                    throw Error("Incorrect number of arguments: expected 1-3");
                }
                e.header = a;
                c = "object" == typeof c ? r.extend(e, c) : e;
                return n.dialog(b, [], c)
            },
            hideAll: function() {
                r(".bootbox").modal("hide")
            },
            animate: function(b) {
                u = b
            },
            backdrop: function(b) {
                s = b
            },
            classes: function(b) {
                v = b
            }
        }
          , p = {
            en: {
                OK: "OK",
                CANCEL: "Cancel",
                CONFIRM: "OK"
            },
            zh_CN: {
                OK: "OK",
                CANCEL: "\u53d6\u6d88",
                CONFIRM: "\u786e\u8ba4"
            },
            zh_TW: {
                OK: "OK",
                CANCEL: "\u53d6\u6d88",
                CONFIRM: "\u78ba\u8a8d"
            }
        };
        return n
    }(document, $);
    return bootbox
})