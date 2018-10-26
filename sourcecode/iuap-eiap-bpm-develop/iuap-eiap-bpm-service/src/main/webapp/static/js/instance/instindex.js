/**
 * Created by Administrator on 2016/8/16.
 */

require([
    'static/js/instance/insttreeindex'
],function(instanceindex){
    var content=document.getElementById("content");
    instanceindex.init(content);
});