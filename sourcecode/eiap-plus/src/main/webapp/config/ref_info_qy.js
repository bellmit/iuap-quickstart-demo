/**
 * author:zhanghy7
 * time:20170524
 */

(function(win){
	win.refinfo = {};
	refinfo['wbUser'] = {
			"refClientPageInfo":{"currPageIndex":0,
				"pageCount":0,"pageSize":100},
				"refCode":"wbUser",
				"refModelUrl":"/wbalone/wbUserRef/",
				"refName":"负责人",
				"refUIType":"RefGrid",
				"rootName":"负责人列表"
	};
	
	refinfo['dept'] = {
			"refClientPageInfo":{"currPageIndex":0,
				"pageCount":0,"pageSize":100},
				"refCode":"dept",
				"refModelUrl":"/wbalone/deptUnderOrgRef/",
				"refName":"组织下部门",
				"refUIType":"RefTree",
				"rootName":"部门列表"
	};
	
	refinfo['organization'] = {
			"refClientPageInfo":{"currPageIndex":0,
				"pageCount":0,"pageSize":100},
				"refCode":"organization",
				"refModelUrl":"/wbalone/organizationRef/",
				"refName":"组织",
				"refUIType":"RefTree",
				"rootName":"组织列表"
	};
	
	refinfo['people'] = {
			"refClientPageInfo":{"currPageIndex":0,
				"pageCount":0,"pageSize":100},
				"refCode":"people",
				"refModelUrl":"/iuap_qy/peopledocRef/",
				"refName":"组织",
				"refUIType":"RefGrid",
				"rootName":"档案列表"
	};

	refinfo['AuthorizedUsers'] = {
		"refClientPageInfo": {
		  "currPageIndex": 0,
		  "pageCount": 0,
		  "pageSize": 100
		},
		"refCode": "",
		"refModelUrl": "/iuap_qy/internalmsg/users/",
		"refName": "用户",
		"refUIType": "RefTree",
		"rootName": "用户"
	  };
	
	return refinfo;
})(window);