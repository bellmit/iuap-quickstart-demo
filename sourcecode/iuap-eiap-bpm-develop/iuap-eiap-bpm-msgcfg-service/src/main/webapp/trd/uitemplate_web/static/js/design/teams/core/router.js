/*路由，用的backbone的路由功能*/
define("teams/core/router", 
["teams/core/app"],
function() {
    var f = require("teams/core/app"),
    h = Backbone.Router.extend({
        initialize: function(d) {
            this.app = new f
        },
        routes: {
            // backbone貌似只是根据字符串判断路由，不知道有没有baseurl之类的设置，先这么搞吧
            "": "forms",
            "/": "forms",
            "forms": "forms",
            "forms/": "forms",
            "forms/:type": "forms",
            "forms/:type/": "forms",
            "forms/:type/:formId": "forms",
            "forms/:type/:formId/": "forms"
        },
        forms: function(/*d, */c, b) {
            this.app.renderForms(/*d, */c, b)
        }
    });
    return h
});
