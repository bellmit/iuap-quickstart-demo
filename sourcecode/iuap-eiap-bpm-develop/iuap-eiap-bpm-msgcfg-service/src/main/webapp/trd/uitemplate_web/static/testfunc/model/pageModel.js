define(['lib/underscore'], function () {
	var pageModel = {}
	var params = _.object(_.map(location.search.slice(1).split('&'), function (v) {
		v = v.split('=')
		return v.length == 1 ? (v.push(true),v) : v
	}))
	pageModel.forms = [
		{
			name: "test1",
			title: "基本信息",
			pk: "fb15f329-3c82-43c2-b41c-94a03a56ebb2",
			params: { }
		}, {
			name: "test2",
			title: "入职办理",
			pk: "8685aaba-4461-42af-b99d-cd06dec0147e",
			params: { }
		}
	]
	var pk = pageModel.pk = params.pk

	var status = "new"

	if (params.edit && pk) {
		status = "edit"
	}
	if (pk && status == "new") {
		status = "see"
		_.each(pageModel.forms, function (v) {
			v.params.enable = false
		})
	}

	if (status == "new") {
		localStorage.clear()
	}

	pageModel.status = status

	pageModel.getViewModel = function (key) {
		var viewModel = this.viewModels[key]
		if (viewModel) {
			return viewModel
		}
		console.error('未找到viewModel')
		return;
	}
	pageModel.getViewModelData = function () {
		return _.mapObject(this.viewModels, function(v) {
			return v.headform.getAllRows()[0].data
		})
	}

	pageModel.viewModels = {};

	return pageModel
})