define(['model/pageModel'], function(pageModel){
	var viewModels = pageModel.viewModels
	return {
		extendViewModel: function(viewModel, param) {
			// extendViewModel的实现还不能够好用，需要再做扩展
			var key = param.name
			if (!key) {
				console.error('未获取到组件名')
				return;
			}
			if (viewModels[key]) {
				console.error('当前viewModel已经存在')
				return;
			}
			viewModel.headform.createEmptyRow()
			viewModel.headform.setRowFocus(0)
			viewModels[key] = viewModel
			if (pageModel.status != 'new') {
				var data = localStorage.testData
				if (data) {
					_.each(JSON.parse(data)[param.name], function (v, i) {
						if (v.value) {
							viewModel.headform.setValue(i, v.value)
						}
					})
				}
			}
			if (typeof param.enable != "undefined" && String(param.enable) == 'false') {
				viewModel.headform.setEnable(false)
			}
		}
	}
})