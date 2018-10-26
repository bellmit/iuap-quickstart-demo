define([], function () {
	var pageModel = {};

	// 节点功能号
	pageModel.funcnode = "001PSN_TEST";

	// 模板信息
	pageModel.uitemplates = [
		{
			tagname: "template-psn",
			title: "基本信息",
			nexuskey: "wujd",
			params: { }
		},
		{
			tagname: "template-psn2",
			title: "基本信息",
			nexuskey: "wujd2",
			params: { }
		}
	];
	return pageModel
})