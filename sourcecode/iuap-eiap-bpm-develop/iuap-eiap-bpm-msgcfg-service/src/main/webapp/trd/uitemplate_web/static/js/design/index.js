var needCopy = !0;
// 在某种情况下可以在未登录的情况下看到表单模板库的预览，在“选用此模板建表单”操作时会弹出登陆框，
// 登陆成功后登录框内的iframe会调用这个函数
// 貌似这部分代码是给表格网(http://www.ebiaoge.com/)用的，咱们不一定用得上
function loginCallback(h) {
	$("#login-dialog").modal("hide");
	h = h.uid;
	needCopy ? copyForm(h) : ($(".btn-login").addClass("hide"), window.location.reload())
}
// '选用此模板建表单'时的复制模板操作，这个操作是同步的，要区分到底是在流程中复制还是在业务表单中复制
// 貌似这部分代码是给表格网(http://www.ebiaoge.com/)用的，咱们不一定用得上
function copyForm(h) {
	h = $("#formId").val();
	var m = $("#module").val();
	"workflow" == m ? $.ajax({
		type: "post",
		url: "/form/copy.json",
		dataType: "json",
		async: !1,
		data: {
			formId: h,
			module: m
		},
		success: function(h) {
			h && h.form ? (TEAMS.currentUser || window.location.reload(), window.open("/workflows/" + TEAMS.currentUser.id + "/formsPersonal")) : formPlugin.notify("服务器请求失败，请联系系统管理员!")
		}
	}) : $.ajax({
		type: "post",
		url: "/biaoge/copy.json",
		dataType: "json",
		async: !1,
		data: {
			formId: h
		},
		success: function(h) {
			h && h.form ? (TEAMS.currentUser || window.location.reload(), window.open("/forms")) : formPlugin.notify("服务器请求失败，请联系系统管理员!")
		}
	})
}

require.config({
	baseUrl : window.ctx+'/static/js/design',
	paths : {
		jquery: "/uui/libs/jquery/dist/jquery",
		'knockout': "/uui/libs/knockout/dist/knockout.debug",
		'uui': "/uui/libs/uui/js/u",
		'u.biz': "/uui/libs/uui/js/u.biz" ,
		'i18next':"/uui/libs/i18next/i18next",
		'text': "/uui/libs/text/text",
		'bootstrap':"/uui/libs/bootstrap/dist/js/bootstrap",
		'templetutil':"/uitemplate_web/static/js/rt/templetutils",
		css: "/uui/libs/require-css/css"
	},
	waitSeconds:60
})
require(['form/formlayout','knockout','templetutil']);