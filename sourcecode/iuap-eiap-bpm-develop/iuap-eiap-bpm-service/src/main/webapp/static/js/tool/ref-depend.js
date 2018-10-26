"use strict";
require.config({
    paths: {
        uui_tree: "/uui/libs/uui/js/u-tree",
        reflib: "/uitemplate_web/static/js/uiref/reflib",
        refer: "/uitemplate_web/static/js/uiref/refer",
        uiReferComp: "/uitemplate_web/static/js/uiref/uiReferComp",
        refGridtree: "/uitemplate_web/static/js/uiref/refGridtree",
        refTree: "/uitemplate_web/static/js/uiref/refTree",
        refGrid: "/uitemplate_web/static/js/uiref/refGrid",
        refcommon: "/uitemplate_web/static/js/uiref/refcommon"
    },
    shim: {
        refer: {
            deps: ["reflib"]
        }
    }
}),
define(function(require, module, exports) {
    return require("css!/uitemplate_web/static/css/ref/ref.css"),
    require("css!/uitemplate_web/static/css/ref/jquery.scrollbar.css"),
    require("css!/uitemplate_web/static/trd/bootstrap-table/src/bootstrap-table.css"),
    require("css!/uui/libs/uui/css/tree.css"),
    require("uui_tree"),
    require("reflib"),
    require("refer"),
    require("uiReferComp"),
    require("refGridtree"),
    require("refTree"),
    require("refGrid"),
    require("refcommon"),
    ""
}
);
