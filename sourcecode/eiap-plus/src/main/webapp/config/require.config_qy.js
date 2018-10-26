require.config({
	paths: {
		'reflib':'/uitemplate_web/static/js/uiref/reflib',
		'refer':'/uitemplate_web/static/js/uiref/refer',
		'refGrid':'/uitemplate_web/static/js/uiref/refGrid',
		'refGridtree':'/uitemplate_web/static/js/uiref/refGridtree',
		'refTree':'/uitemplate_web/static/js/uiref/refTree',
		'refcommon':'/uitemplate_web/static/js/uiref/refcommon',
		'uiReferComp':'/uitemplate_web/static/js/uiref/uiReferComp',
	},
	shim: {
		'refer':{
			deps:["css!/uitemplate_web/static/css/ref/ref.css",
			      "css!/uitemplate_web/static/css/ref/jquery.scrollbar.css",
			      "css!/uitemplate_web/static/trd/bootstrap-table/src/bootstrap-table.css"]
		},
		'uiReferComp':{
			deps: ["reflib","refGrid","refGridtree","refTree","refcommon"]
		},
		
		'refGridtree':{
			deps: ["refer"]
		},
		'refGrid':{
			deps: ["refer"]
		},
		'refTree':{
			deps: ["refer"]
		},
		'refcommon':{
			deps: ["refer"]
		}
	}
});

define(['refer','uiReferComp']);
