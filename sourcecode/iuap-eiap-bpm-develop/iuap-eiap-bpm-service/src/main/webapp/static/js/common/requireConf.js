/**
 * Created by wujiank on 2016/12/15.
 */
window.flowUrl="/iuap-eiap-bpm-service/";//项目名称
require.config({
	baseUrl: window.flowUrl,
	paths: {
		/*共有资源注释，如外层没有，放开相应模块的注释，并在相应模块引入依赖*/
		/*'jquery':"/uui/libs/jquery/dist/jquery",
		 'bootstrap':"/uui/libs/bootstrap/js/bootstrap",
		 'polyfill':"/uui/libs/uui/js/u-polyfill",
		 'knockout':"/uui/libs/knockout/dist/knockout.debug",
		 'uui':"/uui/libs/uui/js/u",*/
		'text': "/uui/libs/text/text",
		'css': '/uui/libs/require-css/css',
		'flowtkindex': '..' + window.flowUrl + 'static/js/flowTask/index',
		'procindex': '..' + window.flowUrl + 'static/js/process/proctreeindex',
		'instindex': '..' + window.flowUrl + 'static/js/instance/insttreeindex'
	},
	shim:{
		"flowtkindex":{
			exports:['flowtkindex']
		}
	}
})

