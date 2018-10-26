/**
 * Created by Administrator on 2016/8/16.
 */

require([
    'static/js/process/proctreeindex'
],function(proctreeindex){
    var content=document.getElementById("content");
    proctreeindex.init(content);
});