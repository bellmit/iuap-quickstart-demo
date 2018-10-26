define("teams/form/formpage", 
[
    // "teams/utils",
    "teams/core/page",
    // "teams/form/formpersonalview",
    // "teams/form/formcompanyview",
    // "teams/form/formemployeeview",
    // "teams/form/formsubordinateview",
    "teams/form/formwriteview",
    // "teams/form/formdatareportlistview",
    // "teams/formstat/formstattabview",
    // "teams/formmanage/formwatchlistview",
    // "teams/formmanage/formwatchchartview",
    // "teams/formmanage/formlabelpageview",
    "teams/form/formcloudview",
    // "teams/component/trashbinview",
    "teams/formstat/formstatdatatableview",
    // "teams/formstat/formstatfieldview",
    // "teams/formstat/formstatreportview"
],
function() {
    // require("teams/utils");
    var q = require("teams/core/page");
    var /*f = require("teams/form/formpersonalview"),
    d = require("teams/form/formcompanyview"),
    c = require("teams/form/formemployeeview"),
    b = require("teams/form/formsubordinateview"),*/
    a = require("teams/form/formwriteview"),
    /*e = require("teams/form/formdatareportlistview"),
    g = require("teams/formstat/formstattabview"),
    l = require("teams/formmanage/formwatchlistview"),
    m = require("teams/formmanage/formwatchchartview"),
    k = require("teams/formmanage/formlabelpageview"),*/
    s = require("teams/form/formcloudview"),
    // p = require("teams/component/trashbinview"),
    r = require("teams/formstat/formstatdatatableview"),
    /*u = require("teams/formstat/formstatfieldview"),
    v = require("teams/formstat/formstatreportview"),*/
    h = q.extend({
        initialize: function(a) {
            // this.isAdmin = TEAMS.currentUser.admin;
            // this.userId = a.userId ? a.userId: TEAMS.currentUser.id;
            this.type = a.type ? a.type: "write";
            this.formId = a.formId;
            this.pageKey = "form#" + this.type /*+ this.userId + this.formId*/;
            this.reloadPage = a.reloadPage;
            this.options = a;
            this.template = "form.formpage";
            this.pageActive = "form";
            this.el = "#mainContainer";
            // this.isAdmin = TEAMS.currentUser.admin;
            // this.isWeaver = "t7akvdnf84" == TEAMS.currentTenant.tenantKey || "T7AKVDNF84" == TEAMS.currentTenant.tenantKey ? !0 : !1
        },
        delegateEvents: function() {
            // $(this.el)
        },
        render: function() {
            var h = this,
            n = $(h.el);
            h.initLayout({
                // userId: this.options.userId ? this.options.userId: TEAMS.currentUser.id,
                // isAdmin: this.isAdmin,
                // isWeaver: this.isWeaver
            }/*,
            function() {
                h.renderType()
            }*/);
            switch (h.type) {
                case 'form-manager':
                    alert(h.type + '注释了');
                    // h.mainView = new g({
                    //     formId: h.formId,
                    //     container: h.el + " #j_formContent"
                    // });
                    // n.find(".j_form-form-manager").removeClass("active");
                    break;
                case 'cloud':
                    h.mainView = new s({
                        // id: h.userId,
                        el: h.el + " #j_formContent",
                        module: "biaoge"
                    })
                    break;
                case 'monitor':
                case 'monitorList':
                    alert(h.type + '注释了');
                    // h.mainView = new l
                    break;
                case 'monitorChart':
                    alert(h.type + '注释了');
                    // h.mainView = new m
                    break;
                case 'label':
                    alert(h.type + '注释了');
                    // h.mainView = new k({
                    //     id: h.userId,
                    //     el: h.el + " #j_formContent"
                    // })
                    break;
                case 'personal':
                    alert(h.type + '注释了');
                    // h.mainView = new f({
                    //     userId: h.userId,
                    //     container: h.el + " #j_formContent",
                    //     type: h.type
                    // })
                    break;
                case 'company':
                    alert(h.type + '注释了');
                    // h.mainView = new d({
                    //     userId: h.userId,
                    //     container: h.el + " #j_formContent",
                    //     type: h.type
                    // })
                    break;
                case 'employee':
                    alert(h.type + '注释了');
                    // h.mainView = new c({
                    //     userId: h.userId,
                    //     container: h.el + " #j_formContent",
                    //     type: h.type
                    // })
                    break;
                case 'subordinate':
                    alert(h.type + '注释了');
                    // h.mainView = new b({
                    //     userId: h.userId,
                    //     container: h.el + " #j_formContent",
                    //     type: h.type
                    // })
                    // n.find(".j_form-subordinate").addClass("active")
                    break;
                case 'write':
                    h.mainView = new a({
                        // userId: h.userId,
                        container: h.el + " #j_formContent",
                        type: h.type
                    })
                    n.find(".j_form_write").addClass("active")
                    break;
                case 'usertempList':
                    h.mainView = new a({
                        // userId: h.userId,
                        container: h.el + " #j_formContent",
                        type: h.type
                    })
                    n.find(".j_form_usertempList").addClass("active")
                    break;    
                case 'mywrite':
                case 'employeewrite':
                case 'companywrite':
                    alert(h.type + '注释了');
                    // h.mainView = new a({
                    //     userId: h.userId,
                    //     container: h.el + " #j_formContent",
                    //     type: h.type
                    // })
                    // n.find(".j_form_write").addClass("active")
                    break;
                case 'trashbin':
                    alert(h.type + '注释了');
                    // h.mainView = new p({
                    //     userId: h.userId,
                    //     container: h.el + " #j_formContent",
                    //     module: "form"
                    // });
                    // break;
                case 'todo':
                case 'finshed':
                case 'subordinates':
                    alert(h.type + '注释了');
                    // h.mainView = new e({
                    //     userId: h.userId,
                    //     type: h.type
                    // })
                    // h.entityCallback = function(a) {
                    //     "finshed" == a && $("#report-list").find(".active .text").addClass("finished-line");
                    //     "back" == a && $("#report-list").find(".active .text").removeClass("finished-line")
                    // }
                    break;
                case 'formstat':
                    // alert(h.type + '注释了');
                    h.mainView = new r({
                        formId: h.formId,
                        container: h.el + " #j_formContent"
                    })
                    n.find(".j_form_write").addClass("active")
                    break;
                case 'statreport':
                    alert(h.type + '注释了');
                    // h.mainView = new v({
                    //     formId: h.formId,
                    //     el: h.el + " #j_formContent"
                    // })
                    // n.find(".j_form-form-manager").removeClass("active")
                    break;
                case 'statfield':
                    alert(h.type + '注释了');
                    // h.mainView = new u({
                    //     formId: h.formId,
                    //     el: h.el + " #j_formContent"
                    // })
                    // n.find(".j_form-form-manager").removeClass("active")
                    break;
                default:
                    break;
            }
            h._render(".j_form-" + h.type);
            // if ("form-manager" == h.type) {
            //     n.find(".j_form-form-manager").removeClass("active")
            // }
        },
        renderSubview: function() {},
        renderType: function() {
            /* 貌似没屌用啊这部分
            var a = "我的";
            TEAMS.blogUser && "female" == TEAMS.blogUser.sex ? a = "她的": TEAMS.blogUser && (a = "他的");
            $(".j_all_formMenu li").each(function() {
                var b = $(this);
                if (!b.hasClass("sub-indent")) {
                    var c = b.data("title");
                    if ("办理的审批" == c || "创建的审批" == c) a = a.substring(0, 1);
                    b.hasClass("shareToMe") ? b.find(".j_type-name").html("共享给" + a + "审批") : b.find(".j_type-name").html(a + c)
                }
            })
            */
        }
    });
    return h
});
