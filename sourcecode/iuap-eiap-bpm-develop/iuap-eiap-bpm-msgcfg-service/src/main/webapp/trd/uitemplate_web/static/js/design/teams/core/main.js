// 貌似是整个app的启动模块
define("teams/core/main",
[
    // "teams/core/polling",
    // "teams/core/setting",
    "teams/core/router"
],
function() {
    var //q = require("teams/core/polling"),
    // n = require("teams/core/setting"),
    f = require("teams/core/router")//,
    /* q = new q*/;
    // window.POLLING = q;
    // n = new n;
    // window.SETTING = n;
    var d = new f;
    window.ROUTER = d;
    Backbone.history.start({
        pushState: false,
        root: '/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/manage'
    });
    $("body").on("click", ".router", function(e) {
        e.preventDefault();
        var c = $(this).attr("href");
        if (c && "#" != c) {
            $(".modal").trigger("click")
            d.navigate(c, {
                trigger: true
            })
        }
    });
    // if (!window.clickedCrmModule) {
    //     f = "";
    //     if ("develop" == TEAMS.runMode) {
    //         f = TEAMS.service.crm + "/static/js/crm-dev.js";
    //     } else {
    //         f = TEAMS.service.crm + "/static/js/crm.js?v=" + TEAMS.version
    //     }
    //     require.async(f);
    // }
});
