define("teams/formstat/formstatdatatableview", [
    "teams/utils",
    "teams/formstat/formstatmodel",
    // "teams/formstat/formcolumnview",
    // "teams/formstat/baseformstatsearchview",
    // "teams/formstat/formstatdatafieldview",
    "teams/form/formoperationview",
    "teams/form/formmanagemodel",
    // "teams/formmanage/formincollectlogview",
    // "teams/formstat/formcollectchartview",
    // "teams/form/formreportconfigview",
    // "teams/form/formauthconfigview",
    // "teams/form/formcontinuewriteview",
    // "teams/formstat/formstatdatatabview",
    // "teams/form/formtagview",
    // "teams/formmanage/formdistributeview"
],
function() {
    var f = require("teams/utils"),
    d = require("teams/formstat/formstatmodel"),
    // c = require("teams/formstat/formcolumnview"),
    // b = require("teams/formstat/baseformstatsearchview"),
    // a = require("teams/formstat/formstatdatafieldview"),
    e = require("teams/form/formoperationview"),
    g = require("teams/form/formmanagemodel"),
    // l = require("teams/formmanage/formincollectlogview"),
    // m = require("teams/formstat/formcollectchartview"),
    // k = require("teams/form/formreportconfigview"),
    // s = require("teams/form/formauthconfigview"),
    // p = require("teams/form/formcontinuewriteview"),
    // r = require("teams/formstat/formstatdatatabview"),
    // u = require("teams/form/formtagview"),
    // v = require("teams/formmanage/formdistributeview"),
    w = [
//         {
//        title: "类型",
//        position: "left"
//    },
//    {
//        title: "提交时间",
//        position: "left"
//    },
//    {
//        title: "提交人",
//        position: "left"
//    },
//    {
//        title: "上报名称",
//        position: "left"
//    }
    ],
    h = Backbone.View.extend({
        initialize: function(a) {
            this.formId = a.formId;
            this.el = a.container ? a.container: "#j_formContent";
            this.model = new d;
            this.fileds = w;
            this.formModel = new g;
            // this.isKeyword = !1;
            // this.userId = TEAMS.currentUser.id;
            $(this.el).html(f.template("formstat.formstatdatatable"))
        },
        delegateEvents: function() {
            var d = this,
            g = $(d.el),
            h = d.model;
            /*g.off("click.FormStatView", ".j_tag").on("click.FormStatView", ".j_tag",
            function(a) {
                $(this).parents(".j_tagLi").find(".j_tagcontainer").slideToggle("fast"); (new u({
                    targetId: d.formId,
                    module: "biaoge",
                    parentEl: ".j_formstat .js_formtab .j_tagLi",
                    container: ".j_tagcontainer"
                })).render()
            });*/
            /* 分类按钮
            $("body").off("click.FormStatDataTableView").on("click.FormStatDataTableView",
            function(a) {
                a = $(a.target);
                $(a).hasClass("j_tag") || 0 < $(a).parents(".j_tag").length || 0 < $(a).parents(".j_tagcontainer").length || $(".j_tagcontainer").slideUp("fast")
            });*/
            // gotop
            $("body").off("click.FormStatDataTableView", ".goto-top").on("click.FormStatDataTableView", ".goto-top",
            function(a) {
                f.gotoTop(d.el + " .j_eformstatScr")
            });
            /* 搜索
            $("body").off("confirmSearch").on("confirmSearch",
            function(a) {
                d.renderListStatByRow(1)
            });*/
            // 点击顶部导航按钮划出侧边栏，用来切换表单的，现在暂时做成返回按钮
            g.on("click.FormStatTabView", ".j_form_goalSlideCtrl",
            function() {
                ROUTER.navigate("/#forms/write", {
                    trigger: true
                });
                // null == d.formStatDataTabView ? (d.formStatDataTabView = new r({
                //     formId: d.formId,
                //     container: d.el + " .j_form_tab",
                //     type: "formstat"
                // }), d.formStatDataTabView.render()) : d.formStatDataTabView.show()
            });
            // 加载更多按钮
            g.on("click.FormStatDataTableView", "#more_data",
            function(a) {
                a = $(this).data("page");
                d.renderListStatByRow(a.nextPage)
            });
            //跳转到详细数据页面
            g.on("click.FormStatDataTableView", ".js_loadData",
            function() {
                var a = $(this).attr("pk_boins");
                var b = $(this).attr("pk_bo");
                $.ajax({
                    type: "get",
                    url: "/iform/rt_ctr/open?pk_bo="+b+"&turn2list=true",
                    dataType: "json",
                    success: function() {
                        window.open("/iform/freebill/" + b+"/bill.html?pk_boins="+a)
                    }
                })
            });
            /* 不知道干嘛用的，貌似没用
            g.on("click.FormStatDataTableView", ".j_field_chart",
            function(b) {
                g.find(".j_field_data").toggle();
                $(this).attr("load-data") || (d.chartView = new a({
                    formId: d.formId,
                    el: ".j_field_data"
                }), $(this).attr("load-data", !0), d.chartView.render(d.getParam()))
            });
            g.on("click.FormStatDataTableView", ".j_field_chart",
            function(b) {
                g.find(".j_field_data").toggle();
                $(this).attr("load-data") || (d.chartView = new a({
                    formId: d.formId,
                    el: ".j_field_data"
                }), $(this).attr("load-data", !0), d.chartView.render(d.getParam()))
            });*/
            /* 导出按钮
            g.on("click.FormStatDataTableView", "#export_formdata",
            function(a) {
                0 != $(this).data("isClick") && ($(this).data("isClick", !1), a = {},
                d.searchView && (a = d.searchView.assembleParam()), a.formId = d.formId, d.model.exportParam(a,
                function(a) {}), window.open("/formdatastat/exportXlsForBaseForm.json?_t=" + (new Date).getTime()), $(this).data("isClick", !0))
            });*/
            /*设置表头显示按钮
            g.on("click.FormStatDataTableView", ".j_columnField",
            function(a) {
                $("body").append("<div id='setupColumnField'></div>");
                d.formColumnView = new c({
                    formId: d.formId,
                    container: "body #setupColumnField",
                    parentObj: d
                });
                d.formColumnView.render()
            });*/
            /* 高级搜索
            g.on("click.FormStatDataTableView", "#initAdvanceSearch",
            function(a) {
                $(this).data("open") ? ($(this).find("i").attr("class", "icon-angle-down cs-p"), g.find(".j_advanceSearch").slideUp(), $(this).data("open", !1)) : ($(this).find("i").attr("class", "icon-angle-up cs-p"), null == g.find(".j_advanceSearch .j_formstat-search").get(0) && (d.searchView && d.searchView.remove(), d.searchView = new b({
                    el: d.el + " .j_advanceSearch",
                    formFields: d.formFields,
                    module: d.module,
                    parentView: d
                }), d.searchView.render()), g.find(".j_advanceSearch").slideDown(), $(this).data("open", !0))
            });*/
            /* 表单设置
            g.on("click.FormStatDataTableView", ".j_form_set li",
            function() {
                var a = $(this).children("a").attr("data-target");
                switch (a) {
                case "reportconf":
                    f.notify(a);
                    break;
                case "useflow":
                    var a = TEAMS.currentUser.admin ? !0 : !1,
                    b = {};
                    b.formId = d.formId;
                    b.module = "workflow";
                    b.el = "#copy-form";
                    b.formTitle = d.form.name;
                    b.ownership = d.form.ownership;
                    b.tpl = f.template("flow.formcopy", {
                        userId: TEAMS.currentUser.id,
                        operationtype: "使用审批",
                        admin: a
                    });
                    b.copyCallback = function(a) {
                        a && a.form && "company" == a.form.ownership ? ROUTER.navigate("/workflows/" + TEAMS.currentUser.id + "/company", {
                            trigger: !0
                        }) : ROUTER.navigate("/workflows/" + TEAMS.currentUser.id + "/personal", {
                            trigger: !0
                        })
                    };
                    d.formoperationView = new e(b);
                    d.formoperationView.render();
                    break;
                case "editform":
                    window.open("/form/edit/" + d.formId);
                    break;
                case "copyform":
                    a = TEAMS.currentUser.admin ? !0 : !1;
                    b = {};
                    b.formId = d.formId;
                    b.module = "biaoge";
                    b.el = "#copy-form";
                    b.formTitle = d.form.name;
                    b.ownership = d.form.ownership;
                    b.tpl = f.template("flow.formcopy", {
                        userId: TEAMS.currentUser.id,
                        operationtype: "复制",
                        admin: a
                    });
                    b.copyCallback = function(a) {
                        ROUTER.navigate("/forms/" + TEAMS.currentUser.id + "/write", {
                            trigger: !0
                        })
                    };
                    d.formoperationView = new e(b);
                    d.formoperationView.render();
                    break;
                case "deleteform":
                    if ("enable" == d.form.status) {
                        f.notify("删除失败，请停用表单后重新操作！");
                        break
                    }
                    h.findCount({
                        formId: d.formId
                    },
                    function(a) {
                        f.confirm("此表单已填写过" + a.count + "次,确定删除吗？",
                        function(a) {
                            a && d.formModel.deleteForm({
                                formId: d.formId
                            },
                            function(a) {
                                a.message ? f.notify(a.message) : (f.notify("表单删除成功"), setTimeout(function() {
                                    ROUTER.navigate("/forms/" + TEAMS.currentUser.id + "/write", {
                                        trigger: !0
                                    })
                                },
                                1E3))
                            })
                        })
                    });
                    break;
                case "dataTrend":
                    (new m({
                        formId:
                        d.formId
                    })).render();
                    break;
                case "insidCollect":
                    (new l({
                        formId:
                        d.formId
                    })).render();
                    break;
                case "authConfig":
                    d.formauthconfigview = new s({
                        parentEl: d.el,
                        userId: d.userId,
                        formId: d.formId,
                        callback: function(a) {
                            d.formauthconfigview.hide()
                        }
                    });
                    d.formauthconfigview.render();
                    break;
                case "continueWrite":
                    d.formcontinuewriteview = new p({
                        parentEl: d.el,
                        userId: d.userId,
                        formId: d.formId,
                        callback: function(a) {
                            d.formcontinuewriteview.hide()
                        }
                    });
                    d.formcontinuewriteview.render();
                    break;
                case "reportConf":
                    d.formreportconfigview = new k({
                        parentEl: d.el,
                        userId: d.userId,
                        formId: d.formId,
                        callback: function(a) {
                            d.formreportconfigview.hide()
                        }
                    }),
                    d.formreportconfigview.render()
                }
            });*/
            /* 内部上传
            g.on("click.FormStatDataTableView", ".j_insideNotice",
            function(a, b) {
                g.find(".j_form_set .j_employee").click()
            });*/
            /* 貌似是人员
            g.on("confirmHandler.FormStatDataTableView", ".j_employee",
            function(a, b) {
                var c = d.formId,
                e = d.form.name,
                g = b.objs;
                if (b && g && 0 < g.length) {
                    for (var k = {},
                    l = 0; l < g.length; l++) k["userIds[" + l + "]"] = g[l].id;
                    k["form.id"] = c;
                    k["form.name"] = e;
                    h.incollect(k,
                    function(a) {
                        a.actionMsg ? f.notify(a.actionMsg.message) : f.notify("操作成功！")
                    })
                } else f.notify("请选择人员！")
            });*/
            /* 搜索按钮
            g.on("click.FormStatDataTableView", ".j_form_keyword",
            function() {
                d.isKeyword = !0;
                d.renderListStatByRow(1)
            });*/
            /* 搜索输入框
            g.on("keyup.FormStatDataTableView", ".j_keyword_input",
            function(a) {
                d.isKeyword = !0;
                13 == a.keyCode && d.renderListStatByRow(1)
            });*/
            /* 外部分发
            g.on("click.FormStatDataTableView", ".js_shareForm",
            function() {
                if ("enable" != d.form.status) f.notify("请发布表单后再分发！");
                else {
                    var a = d.formId;
                    d.formModel.getFiledByForm({
                        formId: a
                    },
                    function(b) {
                        b.formFields && 0 < b.formFields.length ? (new v({
                            container: "#baidushare",
                            shareTitle: d.form.name,
                            shareDesc: d.form.describe,
                            shareUrl: window.location.protocol + "//" + window.location.host + "/biaoge/fill/" + a
                        }), $("#distributeModal").modal("show")) : f.notify("请为表单添加内容再分发！")
                    })
                }
            })*/
        },
        /* 貌似没有调用的地方
        _renderAgain: function(a) {
            11 > $(this.el).find("#stat_table tbody tr").length ? this.render() : a.remove()
        },*/
        render: function() {
            this.renderListStatByRow(1);
            this.talbeScrollbar()
        },
        numberToChinese: function(a) {
            var b = "",
            c = "仟佰拾亿仟佰拾万仟佰拾元角分";
            a += "00";
            var e = a.indexOf(".");
            0 <= e && (a = a.substring(0, e) + a.substr(e + 1, 2));
            c = c.substr(c.length - a.length);
            for (e = 0; e < a.length; e++) b += "零壹贰叁肆伍陆柒捌玖".substr(a.substr(e, 1), 1) + c.substr(e, 1);
            return b.replace(/零角零分$/, "").replace(/零[仟佰拾]/g, "零").replace(/零{2,}/g, "零").replace(/零([亿|万])/g, "$1").replace(/零+元/, "元").replace(/亿零{0,3}万/, "亿").replace(/^元/, "零元")
        },
        getParam: function() {
            var a = {
                form: {}
            };
            /*this.isKeyword ? a.names = [{
                content: $(this.el).find(".j_keyword_input").val(),
                term: "like"
            }] : this.searchView && (a = this.searchView.assembleParam());*/
            a.form.id = this.formId;
            // a.module = this.module;
            return a
        },
        renderListStatByRow: function(a) {
            var b = this,
            c = b.el,
            e = $(c),
            d = b.getParam();
            // 貌似是图片分析
            // b.chartView && b.chartView.render(d);
            d.pageNo = a;
            // 获取表单的数据
            b.model.findRowListStatForBase(d, function(d) {
                //设计的表单的各个字段名称
            	var g = d.formFields,
                //表单详细数据
                h = d.formDatas,

                // k = d.listStats,
                // l = d.numberFieldStats,
                //页面的数据，如当前页、及每次传输条数
                m = d.pageDatas,
                p = d.form,
                //表单的pk_bo
                i = d.form.id,
                r = d.form.name;
                b.form = p;
                // if (p.permission) {
                    /*"WRITE" == p.permission && (
                        e.find(".js_shareForm").remove(),
                        e.find(".j_form_set_btn").remove(),
                        e.find(".j_form_router").remove(),
                        e.find(".j_form_name").next().remove(),
                        e.find(".j_form_name").parent().css("cursor", "default")
                    );*/
                    // "STATISTICS" == p.permission && e.find(".j_form_set_btn").remove();
                    // b.renderFormRouter();
                    /*var s = $(b.el).find("#write_report");
                    p && p.operator && p.operator.department && (
                        s.attr("data-id", p.id),
                        s.attr("userid", TEAMS.currentUser.id)
                    );*/
                    $(b.el).find(".j_form_name").text(r).attr("title", r);
                    if (d.message) {
                        $(c).find("#formDatas").html('<div class="formstat-noresult">' + d.message + "</div>");
                    } else if (null == p) {
                        $(c).find("#formDatas").html('<div class="formstat-noresult" style="color:#e60000;">表单不存在</div>');
                    } else if (null == g || 0 == g.length) {
                        $(c).find("#formDatas").html('<div class="formstat-noresult">当前表单没有任何字段！</div>');
                    } else {
                        1 == a && ($(b.el).find("#stat_table tbody").empty(),$(c).find(".j_form_empty").addClass("hide"));
                        b.formFields = g;
                        if (0 == $(c).find("#stat_table thead tr th").length) {
                            p = $(c).find("#stat_table thead tr");
                            r = $(c).find("#stat_table tfoot tr");
                            //循环写出列表各个字段名称
                            for (d = 0; d < g.length; d++) {
                                s = g[d];
                                p.append("<th title='" + s.title + "'><div>" + s.title + "</div></th>");
                                /*
                                var w = "",
                                u = "";
                                if ("Money" == s.componentKey || "NumberComponent" == s.componentKey) w = "ta-r";
                                "Money" == s.componentKey && (u = "Money");
                                r.append("<td id='tfoot_" + s.id + "' class='" + w + "' type='" + u + "'></td>")
                          		*/
                            }
                            for (d = 0; d < b.fileds.length; d++) s = b.fileds[d],
                            "left" === s.position ? (p.prepend("<th title='" + s.title + "'><div>" + s.title + "</div></th>"), r.prepend("<td></td>")) : (p.append("<th title='" + s.title + "'><div>" + s.title + "</div></th>"), r.append("<td></td>"))
                        }
                        if (m && m.hasNext) {
                            $(b.el + " #more_data").show(),
                            $(b.el + " #more_data").data("page", m);
                        } else if ($(b.el + " #more_data").hide(), 1 == a) {
                            if (null == h || 1 > h.length) {
                                $(c).find(".j_form_empty").removeClass("hide");
                                $(c).find("#stat_table tfoot").hide();
                                return
                            }
                            $(c).find(".j_form_empty").addClass("hide");
                            $(c).find("#stat_table tfoot").show()
                        } else 0 < h.length && $(c).find(".j_form_empty").addClass("hide");
                        /* 这段是用来显示footer的，里面内容可能是金额合计
                        if (l && 0 < l.length) {
                            for (d = 0; d < l.length; d++) p = l[d],
                            m = p.fieldId,
                            p = p.sumVal,
                            "Money" == $(c).find("#stat_table tfoot #tfoot_" + m).attr("type") && (p = p + " " + b.numberToChinese(p)),
                            $(c).find("#stat_table tfoot #tfoot_" + m).html("总和：" + p).attr("title", "总和：" + p);
                            $(c).find("#stat_table tfoot").show()
                        } else $(c).find("#stat_table tfoot").hide();
                        l = {};
                        if (k) for (d = 0; d < k.length; d++) m = k[d],
                        l[m.FORM_DATA + "_" + m.DATA_INDEX] = m;*/
                        b.renderDataReport(h, i,/*l,*/ g);
                        f.layout(c + " .j_eformstatScr");
                        // b.mergerCells(g, h)
                    }
                /*} else $(b.el).html(f.template("base.nopermission", {
                    msg: null
                }))*/
            })
        },
        /*renderFormRouter: function() {
            var a = this;
            $(a.el).find(".j_form_router li").each(function() {
                $(this).attr("href", "/forms/" + TEAMS.currentUser.id + "/" + $(this).attr("type") + "/" + a.formId)
            })
        },*/
        renderDataReport: function(formdatas, pk_bo, formfields) {
            for (var e = this.el,
            // d = TEAMS.currentTenant.tenantKey,
            f = 0; f < formdatas.length; f++) {
                var g = formdatas[f],
                // h = g.maxIndex || 1,
                k = g.pk_boins,
                //l = Date.create(g.createTime),
                //m = g.name ? g.name: ""/*,
                p = "formdatareport" === g.module ? "数据上报": "外部分发";
                if (! (0 < $(e + " stat_table tr #" + k).length)) /*for (var r = 0; r < h; r++) */{
                    var /*s = formfields[k + "_" + (r + 1)],*/
                    w = $("<tr id=" + k + "></tr>");
                    // "formdatareport" === g.module ? 
                        // w.append("<td class='noSub_name_" + k + '\'><a class="j_entityslider-toggle" data-id="' + k + '" formData="' + k + '" data-module="formdatareport" renderType="subordinates">' + m + "</a></td>") : 
                        // w.append("<td class='noSub_name_" + k + '\'><a class="j_entityslider-toggle" data-id="' + k + '" data-module="biaogeform" renderType="loadForm">' + m + "</a></td>");
                    
                    //循环显示表单数据
                    for (var i = 0; i < formfields.length; i++) {
                    	var h = formfields[i];
                    	var j = h.columncode;
                    	w.append("<td class='" + k + "'><a class='js_loadData' style='color:black' pk_boins='" + k+  "' pk_bo='"+pk_bo+"'>" + g[j]+ "</a></td>");
                   		//w.append("<td class=" + k + '>' + g[j]+ "</td>");
	                  //  w.append("<td class='" + k + "'><a class='router usercard-toggle' style='color:black' userid='" + k + "'>" + g[j]+ "</a></td>");
	                    //g.operator && g.operator.id && g.tenantKeyTemp /*&& g.tenantKeyTemp.toLowerCase() == d.toLowerCase()*/ ? 
	                        // w.append("<td class='noSub_operate_" + k + "'><a class='router usercard-toggle' userid='" + g.operator.id + "'>" + g.operator.username + "</a></td>") : 
	                    //    w.append("<td class='noSub_operate_" + k + "'>" + g.operator.username + "</td>") : 
	                  //      w.append("<td class='noSub_operate_" + k + "'>游客</td>");
	                 //   w.append("<td class='noSub_time_" + k + "'>" + l.format("{yyyy}-{MM}-{dd}") + "</td>");
	                    // w.append("<td class='noSub_type_" + k + "'>" + p + "</td>");
	                    /* 这部分是用来拼上传表单字段的
	                    for (var u = 0; u < formfields.length; u++) {
	                        var v = c[u],
	                        n = v.id,
	                        q = v.componentKey,
	                        I = "";
	                        s && (I = s["C_" + n] || "");
	                        var J = "noSub_" + k + "_" + n;
	                        v.subForm && (J = "");
	                        v = "";
	                        if ("Money" == q || "NumberComponent" == q) v = "ta-r";
	                        n = k + "_" + (r + 1) + "_" + n;
	                        q = !0;
	                        try {
	                            var L = JSON.parse(I);
	                            ocount = "";
	                            if (0 < L.length && null != L[0].optionId) {
	                                for (var N = 0; N < L.length; N++) option = L[N],
	                                "image" == option.type || "imageFile" == option.type ? 
	                                    (ocount += '<p class="ellipsis" title="' + option.content + '"><a target="_blank" rel="fancybox_js" href="/base/download/img/' + option.optionId + '/image" class="fancybox_js" type="image">' + option.content + "</a></p>", q = !1) : 
	                                    "file" == option.type ? 
	                                        (ocount += '<p class="ellipsis" title="' + option.content + '"><a target="_blank" data-value="' + option.optionId + '" href="/base/download/' + option.optionId + '">' + option.content + "</a></p>", q = !1) : 
	                                        ocount += option.content + ",";
	                                I = ocount.substring(0, ocount.length - 1)
	                            }
	                        } catch(U) {}
	                        q ? 
	                            w.append("<td id=" + n + " class='" + J + " " + v + "' title='" + I + "'>" + I + "</td>") : 
	                            w.append("<td id=" + n + " class='" + J + " " + v + "'>" + I + "</td>");
	                        $("#" + n).find(".fancybox_js").fancybox({
	                            closeBtn: !0,
	                            nextEffect: "fade",
	                            prevEffect: "fade",
	                            afterLoad: function() {
	                                this.title = "Image " + (this.index + 1) + " of " + this.group.length + (this.title ? " - " + this.title: "")
	                            }
	                        })
	                    }*/
	                   
                	};
                	 $(e).find("#stat_table tbody").append(w)
                }
            }
        },
        /*mergerCells: function(a, b) {
            if (a && b) for (var c = 0; c < b.length; c++) {
                var e = b[c],
                d = e.maxIndex || 1,
                f = e.id;
                "task" === this.module && (f = e.taskId);
                $(this.el).find("#stat_table .noSub_name_" + f + ":eq(0)").attr("rowspan", d);
                $(this.el).find("#stat_table .noSub_name_" + f + ":gt(0)").remove();
                $(this.el).find("#stat_table .noSub_operate_" + f + ":eq(0)").attr("rowspan", d);
                $(this.el).find("#stat_table .noSub_operate_" + f + ":gt(0)").remove();
                $(this.el).find("#stat_table .noSub_time_" + f + ":eq(0)").attr("rowspan", d);
                $(this.el).find("#stat_table .noSub_time_" + f + ":gt(0)").remove();
                $(this.el).find("#stat_table .noSub_type_" + f + ":eq(0)").attr("rowspan", d);
                $(this.el).find("#stat_table .noSub_type_" + f + ":gt(0)").remove();
                $(this.el).find("#stat_table .j_opreate_" + f + ":eq(0)").attr("rowspan", d);
                $(this.el).find("#stat_table .j_opreate_" + f + ":gt(0)").remove();
                $(this.el).find("#stat_table .noSub_content_" + f + ":eq(0)").attr("rowspan", d);
                $(this.el).find("#stat_table .noSub_content_" + f + ":gt(0)").remove();
                $(this.el).find("#stat_table .noSub_priority_" + f + ":eq(0)").attr("rowspan", d);
                $(this.el).find("#stat_table .noSub_priority_" + f + ":gt(0)").remove();
                $(this.el).find("#stat_table .noSub_status_" + f + ":eq(0)").attr("rowspan", d);
                $(this.el).find("#stat_table .noSub_status_" + f + ":gt(0)").remove();
                for (e = 0; e < a.length; e++) {
                    var g = a[e];
                    g.subForm || (g = g.id, $(this.el).find("#stat_table .noSub_" + f + "_" + g + ":eq(0)").attr("rowspan", d), $(this.el).find("#stat_table .noSub_" + f + "_" + g + ":gt(0)").remove())
                }
            }
        },*/
        againRenderTable: function() {
            $(this.el).find("#formDatas").html($(f.template("formstat.formstatdatatable")).find("#formDatas").html());
            this.talbeScrollbar();
            $(window).resize();
            this.renderListStatByRow(1)
        },
        talbeScrollbar: function() {
            $(this.el).find(".j_formstarScr").mCustomScrollbar({
                axis: "x",
                scrollButtons: {
                    enable: !0
                },
                mouseWheel: "false",
                theme: "darkblue",
                scrollbarPosition: "inside"
            })
        },
        remove: function() {
            this.formColumnView && (this.formColumnView.remove(), this.formColumnView = null);
            this.formoperationView && (this.formoperationView.remove(), this.formoperationView = null);
            this.formStatDataTabView && (this.formStatDataTabView.remove(), this.formStatDataTabView = null);
            $(this.el).off(".FormStatDataTableView")
        }
    });
    return h
});
