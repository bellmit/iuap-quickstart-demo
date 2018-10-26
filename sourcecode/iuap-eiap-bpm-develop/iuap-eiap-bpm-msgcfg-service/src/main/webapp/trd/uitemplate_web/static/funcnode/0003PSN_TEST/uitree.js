
'use strict';

define(function(){
//+ function($) {
	var uitreeCtr = {};
	uitreeCtr.initTree = function(app, viewModel,templateModel,params){
		var treeDom = $('#form-treeObj');
		var TimeFn=null;
        var nodeClick = function (event, treeId, treeNode) {
			//单击展开树
			clearTimeout(TimeFn); //setTimeout用来屏蔽连续2次单击变成单击事件
			TimeFn = setTimeout(function() {
				var zTree = $.fn.zTree.getZTreeObj("form-treeObj");
				zTree.expandNode(treeNode,null, false,false,false);
	        }, 200);
			$("#"+treeId).toggleClass("eventflag");
			//var uictrl = require("uitemplate/controller");
			var uictrl = require(params.uitemplatectrl);
			uictrl.changeTable(app, viewModel,templateModel,treeId,treeNode); //回调controller.js里面对应方法
        }
		//树的双击事件
		var nodeDblClick = function (event, treeId, treeNode) {
			clearTimeout(TimeFn);
    	}
		
        var setting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid"
                    }
                },
                callback: {
					onDblClick: nodeDblClick,
                    onClick: nodeClick,
                },
                view: {
                    selectedMulti: true,
					dblClickExpand: false //屏蔽双击展开事件
                }
            };
        var treeData = [{"id":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","name":"lzy0727001","code":"lzy0727001","pid":"","entityId":"1f87dfaf-ee7e-4d40-b599-a1aee6a2e1cd","pk":"1f87dfaf-ee7e-4d40-b599-a1aee6a2e1cd","ctrltype":"TableLayout","readonly":"N","required":"N","is_hidden":"N","decimalPlace":0},{"id":"76f9dde6-d2d9-4d0c-bd62-420e84878833","name":"id","code":"lzy0727001.id","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"8ae540c9-41a2-4187-8546-2f3341689d5e","readonly":"N","required":"Y","is_hidden":"N","ctrltype":"Text"},{"id":"4944ecd3-5914-4910-952f-b70e63894e99","name":"姓名","code":"lzy0727001.name1","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"fa168f78-7218-41d3-b0c0-e0d03b9fd9c5","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"458a8798-24d6-4725-bf84-b49ce55f6a9c","name":"年龄","code":"lzy0727001.age1","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"324f16a5-713d-490c-a815-afaf0ba1a896","readonly":"N","required":"N","is_hidden":"Y","ctrltype":"NumberComponent"},{"id":"17811146-2791-425d-b2c4-87faadafb69e","name":"分数","code":"lzy0727001.score1","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"d2f9117b-ab9c-47f0-92ae-d9e917968901","readonly":"N","required":"Y","is_hidden":"N","ctrltype":"NumberComponent"},{"id":"f8597de6-9afd-48ca-b718-84c1ef0183b5","name":"学费","code":"lzy0727001.money1","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"e1ef69b5-1a46-4276-84bf-f9838e4ac7e9","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Money"},{"id":"84ed24a5-9bec-40b1-aac9-529bf1f669bf","name":"日期","code":"lzy0727001.aaa","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"6ea14e6a-339a-42d9-b547-38abcccd5aac","readonly":"N","required":"N","is_hidden":"Y","format":"YYYY-MM-DD","ctrltype":"DateComponent"},{"id":"e728a25d-c8c6-42cd-81a6-e7ac42d53ce7","name":"时间","code":"lzy0727001.bbb","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"950399f5-29b5-47fd-a6f4-4a907ef7d61a","readonly":"N","required":"Y","is_hidden":"N","format":"HH:mm:ss","ctrltype":"DateComponent"},{"id":"f61898b2-327c-4447-b832-d8bbb73e712e","name":"ccc","code":"lzy0727001.ccc","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"f1eb9a47-e9a0-4642-a334-ce50251bd721","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"a641a63e-cebe-4dae-8d0f-41cf3a981886","name":"ddd","code":"lzy0727001.ddd","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"dc9a8ded-08c5-4bd2-8357-d868b11adca9","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"1c8e4a3e-ba33-4a65-93fe-c23447ec50d7","name":"fff","code":"lzy0727001.fff","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","pk":"9ad3dd52-90f6-4862-a2a5-c67e04c06423","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Select","select_options":[{"selectKey":"1","selectVal":"男"},{"selectKey":"2","selectVal":"女"}],"select_type":"select"},{"id":"4e6c90ef-e2c8-401b-8688-d9587301585d","name":"id_lzy0727001sub","code":"lzy0727001.id_lzy0727001sub","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","entityId":"62e7d1ad-7281-4db9-8d9b-2da5b8625784","pk":"62e7d1ad-7281-4db9-8d9b-2da5b8625784","ctrltype":"DataTable","readonly":"N","required":"N","is_hidden":"N"},{"id":"5ee83ce7-95e6-4bf0-bb29-cb88ceb0afa7","name":"id","code":"lzy0727001.id_lzy0727001sub.id","pid":"4e6c90ef-e2c8-401b-8688-d9587301585d","pk":"9131b668-bb63-4125-8a97-0fc536c66429","readonly":"N","required":"Y","is_hidden":"N","ctrltype":"Text"},{"id":"01d2eac6-0b6c-4838-9057-ec569bd332f7","name":"名称11","code":"lzy0727001.id_lzy0727001sub.name1","pid":"4e6c90ef-e2c8-401b-8688-d9587301585d","pk":"78c23294-fad3-4a80-8bdc-e7034de1bd1a","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"ec4476bd-8aa6-4978-b5ea-ce94196d8809","name":"价格","code":"lzy0727001.id_lzy0727001sub.jiage","pid":"4e6c90ef-e2c8-401b-8688-d9587301585d","pk":"4c4b36b8-d390-4a83-9675-6360688f893b","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Money"},{"id":"202e8731-e150-40a7-ba04-f32ad0b3b193","name":"日期","code":"lzy0727001.id_lzy0727001sub.fff","pid":"4e6c90ef-e2c8-401b-8688-d9587301585d","pk":"b2533078-b815-484c-93ee-6bc1b62d4fe6","readonly":"N","required":"N","is_hidden":"N","format":"YYYY-MM-DD","ctrltype":"DateComponent"},{"id":"ddc904eb-1379-4f18-aa7f-4070d65ee8b7","name":"数值","code":"lzy0727001.id_lzy0727001sub.shuzhi","pid":"4e6c90ef-e2c8-401b-8688-d9587301585d","pk":"21cfc91d-a8e9-41ce-bc24-567fd69b2298","readonly":"N","required":"N","is_hidden":"N","ctrltype":"NumberComponent"},{"id":"bbb0eb4a-1cf3-4c2c-b571-caf546b01004","name":"金额","code":"lzy0727001.id_lzy0727001sub.jine","pid":"4e6c90ef-e2c8-401b-8688-d9587301585d","pk":"072d0e75-25a4-4b7a-bb86-0fbc75baca7d","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Money"},{"id":"c2044463-4f84-41d3-a0ee-3d899e5710db","name":"id_lzy0727001sub02","code":"lzy0727001.id_lzy0727001sub02","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","entityId":"de5f9b66-c200-416b-82cc-ef9f4cdd83a8","pk":"de5f9b66-c200-416b-82cc-ef9f4cdd83a8","ctrltype":"DataTable","readonly":"N","required":"N","is_hidden":"N"},{"id":"82275fcb-fcbd-4d59-b34d-d9cfc2894e4b","name":"id","code":"lzy0727001.id_lzy0727001sub02.id","pid":"c2044463-4f84-41d3-a0ee-3d899e5710db","pk":"826c6028-9806-4745-9df2-4f7b01492f60","readonly":"N","required":"Y","is_hidden":"N","ctrltype":"Text"},{"id":"0aea1a85-568e-472c-8b00-3f01d6037050","name":"111","code":"lzy0727001.id_lzy0727001sub02.111","pid":"c2044463-4f84-41d3-a0ee-3d899e5710db","pk":"8b0b6406-760f-43be-bc47-d482cf8e656b","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"21ed40e5-1923-4df5-8166-104950cc6ba6","name":"AAA","code":"lzy0727001.id_lzy0727001sub02.aaa","pid":"c2044463-4f84-41d3-a0ee-3d899e5710db","pk":"c45ff9bb-c728-4a93-8f1d-e8825df4e7b8","readonly":"N","required":"N","is_hidden":"N","ctrltype":"NumberComponent"},{"id":"a35a07f8-f241-4375-ab33-e762258927f1","name":"BBB","code":"lzy0727001.id_lzy0727001sub02.bbb","pid":"c2044463-4f84-41d3-a0ee-3d899e5710db","pk":"d7d01406-8ab1-4574-be38-9bc73b289e37","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Select","select_options":[{"selectKey":"1","selectVal":"男"},{"selectKey":"2","selectVal":"女"}],"select_type":"select"},{"id":"deadeba7-e0fa-4a4e-bb63-5ed7c22c95eb","name":"是否","code":"lzy0727001.id_lzy0727001sub02.ccc","pid":"c2044463-4f84-41d3-a0ee-3d899e5710db","pk":"13071cb2-24a8-4682-b372-34095ef1b846","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Select","select_options":[{"checkboxKey":"true","checkboxVal":"是否"}],"select_type":"checkbox"},{"id":"b963b6ec-56b5-4b68-96a5-c082a27691c7","name":"ddd","code":"lzy0727001.id_lzy0727001sub02.ddd","pid":"c2044463-4f84-41d3-a0ee-3d899e5710db","pk":"62b16b2d-7cc3-493a-8d99-0a5e41d50b31","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"4d3e4b74-51ba-4ad6-a391-1627afeebdab","name":"eee","code":"lzy0727001.id_lzy0727001sub02.eee","pid":"c2044463-4f84-41d3-a0ee-3d899e5710db","pk":"457f373f-31bf-4623-b67d-5ddf8245c23c","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"43618114-9edd-4b46-b1c4-b98b5200ceff","name":"id_lzy0727001sub03","code":"lzy0727001.id_lzy0727001sub03","pid":"4daad10f-b0bd-44f0-b3b9-7c18220d3c04","entityId":"5428b75c-1f4a-42af-ad00-c3267e1e006d","pk":"5428b75c-1f4a-42af-ad00-c3267e1e006d","ctrltype":"DataTable","readonly":"N","required":"N","is_hidden":"N"},{"id":"3669b519-5643-4806-8f29-a685f87d3f46","name":"id","code":"lzy0727001.id_lzy0727001sub03.id","pid":"43618114-9edd-4b46-b1c4-b98b5200ceff","pk":"92eb886e-367f-4fb2-86a4-e338a6178286","readonly":"N","required":"Y","is_hidden":"N","ctrltype":"Text"},{"id":"a450a06f-8240-4805-bc73-21d8d1110eb1","name":"aaa","code":"lzy0727001.id_lzy0727001sub03.aaa","pid":"43618114-9edd-4b46-b1c4-b98b5200ceff","pk":"ca6a6326-d0ce-4141-8987-516f03303277","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"3b21c7e0-578a-45d9-9b91-e8eb46d136a5","name":"bbb","code":"lzy0727001.id_lzy0727001sub03.bbb","pid":"43618114-9edd-4b46-b1c4-b98b5200ceff","pk":"fd0006ad-34dc-4ac4-8e6a-7103d434d109","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"aac657ec-1147-4afc-934c-97bbc63dfceb","name":"ccc","code":"lzy0727001.id_lzy0727001sub03.ccc","pid":"43618114-9edd-4b46-b1c4-b98b5200ceff","pk":"831aa264-b854-4298-8466-0ef7d22da7c5","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"867f3c22-c504-423b-8bc9-d7088829ca0d","name":"dd","code":"lzy0727001.id_lzy0727001sub03.dd","pid":"43618114-9edd-4b46-b1c4-b98b5200ceff","pk":"41c84a96-37a2-4d77-87e1-371d72b7263e","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"e3f1f7f1-40e6-4a7f-a0eb-f05fdb12fecb","name":"eee","code":"lzy0727001.id_lzy0727001sub03.eee","pid":"43618114-9edd-4b46-b1c4-b98b5200ceff","pk":"b9d33f48-b961-4393-86e9-cf80d5eb2262","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"},{"id":"e3fe7e94-aaee-48b0-b668-44cadc7bc48e","name":"fff","code":"lzy0727001.id_lzy0727001sub03.fff","pid":"43618114-9edd-4b46-b1c4-b98b5200ceff","pk":"3677964e-7926-415a-97de-d692f1b82390","readonly":"N","required":"N","is_hidden":"N","ctrltype":"Text"}];
        $.fn.zTree.init(treeDom, setting, treeData);
        var zTree = $.fn.zTree.getZTreeObj("form-treeObj");
        var nodes;
		if(zTree){
			nodes = zTree.transformToArray(zTree.getNodes());
		}
		//zTree.expandAll();
		zTree.expandNode(nodes[0],true, false,false,false);
	}	
		return uitreeCtr;
//}($)
});
