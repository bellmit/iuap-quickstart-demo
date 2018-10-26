
var printCtx = "/eiap-plus";
var printWebCtx = "/cloud_print_service/print";

var goback = function() {
	window.history.go(-1);
}
$("#rtnBtn").on('click', goback);

// 模板全选
var selectAll = function(e) {
	var templateList = $(".template_check");
	if (e.target.checked) {
		for (i in templateList) {
			templateList[i].checked = true;
		}
	} else {
		for (i in templateList) {
			templateList[i].checked = false;
		}
	}
}
// 模板下载
$("#template_download").on(
		'click',
		function() {
			var selected = [];
			var templateList = $(".template_check");
			for (var i = 0; i < templateList.length; i++) {
				if (templateList[i].checked == true) {
					selected.push(templateList[i].value);
				}
			}
			if (selected.length > 0) {
				var tenantId = $('#tenantId')[0].value;
				var templates = selected.join(",");
				var url = printCtx + '/remote/export?tenantId=' + tenantId
						+ '&templates=' + templates;
				url = encodeURI(encodeURI(url));
				window.open(url);
			} else {
				showMessage("请先选择模板！");
			}
		});
// 模板下载并上传
$("#exportAndUpload").on('click', function() {
			var selected = [];
			var templateList = $(".template_check");
			for (var i = 0; i < templateList.length; i++) {
				if (templateList[i].checked == true) {
					selected.push(templateList[i].value);
				}
			}
			if (selected.length > 0) {
				var tenantId = $('#tenantId')[0].value;
				var templates = selected.join(",");
				var url = printCtx + '/remote/exportAndUpload?tenantId=' + tenantId + '&templates=' + templates;
				url = encodeURI(encodeURI(url));
				window.open(url);
			} else {
				showMessage("请先选择模板！");
			}
		});

// 新建模板
$('#addTemplate').on('click', function() {
					var bocode = $('#bocode')[0].value;
					if (bocode === 'undefined' || bocode == '') {
						showMessage('请先选择业务对象！');
						return;
					}
					var new_temp = $('#new_temp')[0].value;
					if (new_temp === 'undefined' || new_temp == '') {
						showMessage('新建模板名称不能为空！');
						return;
					}

					var tenantId = $('#tenantId')[0].value;

					var templateType = tenantId === 'undefined'
							|| tenantId === 'sys' ? "52a7f32d-fbb3-49d5-9700-01605b80bd9c"
							: "48a8206f-6759-431e-bf84-e973935e2fcc";

					var url = printWebCtx + '/design?tenantId=' + tenantId
							+ '&reportName=' + new_temp + '&bocode=' + bocode
							+ '&type=' + templateType;
					// var url = printCtx + '/print/adddesign?tenantId=' +
					// tenantId + '&reportName=' + new_temp + '&bocode=' +bocode
					// + '&type='+templateType;
					url = encodeURI(encodeURI(url));
					window.open(url);
				});

// 模板复制测试
$('#copyTemplate')
		.on(
				'click',
				function() {
					var template = $('#template')[0].value;
					var pk_template = $('#template_list option[value="'
							+ template + '"]')[0].id;
					if (template === 'undefined' || template == '') {
						showMessage('被复制模板不能为空！');
						return;
					}
					var copytemplatecode = $('#copytemplatecode')[0].value;
					if (copytemplatecode === 'undefined'
							|| copytemplatecode == '') {
						showMessage('复制后模板编码不能为空！');
						return;
					}

					var copytemplatename = $('#copytemplatename')[0].value;
					if (copytemplatename === 'undefined'
							|| copytemplatename == '') {
						showMessage('复制后模板名称不能为空！');
						return;
					}

					var tenantId = $('#tenantId')[0].value;

					var url = printCtx + '/remote/copyTemplate?tenantId='
							+ tenantId + '&copytemplatecode='
							+ copytemplatecode + '&pk_template=' + pk_template
							+ '&copytemplatename=' + copytemplatename;
					url = encodeURI(encodeURI(url));

					$
							.ajax({
								type : 'GET',
								url : url,
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									var deleteresult = JSON.parse(data).copyMsg;
									if (deleteresult) {
										showMessage("成功复制模板" + template);
									} else {
										showMessage(JSON.parse(data).copyResult);
									}
								},
								error : function(xhr, errorType, error) {
									showMessage('复制失败！');
								}
							});
				});
// 模板删除测试
$('#deleteTemplate')
		.on(
				'click',
				function() {
					var templateCode = $('#template')[0].value;
					if (!templateCode) {
						showMessage('被删除模板不能为空！');
						return;
					}

					var tenantId = $('#tenantId')[0].value;
					
					var pk_template = templateMap[templateCode];

					var url = printCtx + '/remote/deleteTemplate?tenantId=' + tenantId + '&pk_template=' +pk_template;
					
					url = encodeURI(encodeURI(url));
					$.ajax({
								type : 'POST',
								url : url,
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									var result = JSON.parse(data);
									var deleteresult = result.delresult;
									if(deleteresult){
										showMessage("成功删除模板"+templateCode);
									}else{
										showMessage(result.delMsg);
									}
								},
								error : function(xhr, errorType, error) {
									showMessage('删除失败！');
								}
							});
				});

// 模板编辑
$('#edittemp')
		.on(
				'click',
				function() {
					var template = $('#template')[0].value;
					if (template === 'undefined' || template == '') {
						showMessage('被删除模板不能为空！');
						return;
					}

					var tenantId = $('#tenantId')[0].value;
					var url = printCtx
							+ '/print-demo/remote/edittemplate?tenantId='
							+ tenantId + '&template=' + template;
					url = encodeURI(encodeURI(url));
					$
							.ajax({
								type : 'POST',
								url : url,
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									var editurl = JSON.parse(data).data;
									window.open(editurl);
								},
								error : function(xhr, errorType, error) {
									showMessage('error');
								}
							});
				});
// 新增模板（老）
$('#addedittemp')
		.on(
				'click',
				function() {
					var bocode = $('#bocode')[0].value;
					if (bocode === 'undefined' || bocode == '') {
						showMessage('请先选择业务对象！');
						return;
					}
					var new_temp = $('#new_temp')[0].value;
					if (new_temp === 'undefined' || new_temp == '') {
						showMessage('新建模板名称不能为空！');
						return;
					}
					var tenantId = $('#tenantId')[0].value;
					var templateType = tenantId === 'undefined'
							|| tenantId === 'sys' ? "52a7f32d-fbb3-49d5-9700-01605b80bd9c"
							: "48a8206f-6759-431e-bf84-e973935e2fcc";
					var url = 'remote/addprintdesign?tenantId=' + tenantId
							+ '&reportName=' + new_temp + '&bocode=' + bocode
							+ '&type=' + templateType;
					url = encodeURI(encodeURI(url));
					$
							.ajax({
								type : 'POST',
								url : url,
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									var editurl = JSON.parse(data).data;
									window.open(editurl);
								},
								error : function(xhr, errorType, error) {
									showMessage('error');
								}
							});
				});
// 打印
$('#printbtn').on(
		'click',
		function() {
			var template = $('#template')[0].value;
			if (template === 'undefined' || template == '') {
				showMessage('请先选择模板！');
				return;
			}
			var tenantId = $('#tenantId')[0].value;

			var url = '/print-demo/remote/getdata?tenantId=' + tenantId
					+ '&printcode=' + template + '&print_ext='
					+ "static/js/print_ext.js";
			url = encodeURI(encodeURI(url));
			window.open(url);
		});

// 删除业务对象
$('#deletebo')
		.on(
				'click',
				function() {
					var bocode = $('#bocode')[0].value;
					if (!bocode) {
						showMessage('请先选择业务对象！');
						return;
					}
					var tenantId = $('#tenantId')[0].value;
					
					var pk_bo = boMap[bocode];

					var url = printCtx + '/remote/deletebo?tenantId=' + tenantId + '&pk_bo=' +pk_bo;
					url = encodeURI(encodeURI(url));

					$.ajax({
								type : 'GET',
								url : url,
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									var bos =JSON.parse(data);
									var deleteresult = bos.deleteResult;
									if(deleteresult){
										showMessage("成功删除业务对象"+bocode);
									}else{
										showMessage(bos.delMsg);
									}
								},
								error : function(xhr, errorType, error) {
									showMessage('删除失败！');
								}
							});
				});

// 新增业务对象
$('#addbo').on(
		'click',
		function() {
			var tenantId = $('#tenantId')[0].value;
			var namespace = $('#namespace')[0].value;
			var mainEntityName = $('#mainEntityName')[0].value;
			var url = printCtx + '/remote/addbo?tenantId=' + tenantId
					+ '&namespace=' + namespace + '&mainEntityName='
					+ mainEntityName;
			window.open(url);
		});
// 修改业务对象
$('#updatebo').on(
		'click',
		function() {
			var bocode = $('#bocode')[0].value;
					if (!bocode) {
						showMessage('请先选择业务对象！');
						return;
					}
			var tenantId = $('#tenantId')[0].value;
			var namespace = $('#namespace')[0].value;
			var mainEntityName = $('#mainEntityName')[0].value;
			if(namespace == null || namespace == "" || mainEntityName == null || mainEntityName == ""){
				showMessage('请填写元数据命名空间或者元数据实体名称！');
				return;
			}
			
			var pk_bo = boMap[bocode];
			
			var url = printCtx + '/remote/updatebo?tenantId=' + tenantId
					+ '&namespace=' + namespace + '&mainEntityName='
					+ mainEntityName +"&pk_bo=" + pk_bo;
			window.open(url);
		});

var boMap = {};

// 加载业务对象
$('#querybo')
		.on(
				'click',
				function() {
					var tenantId = $('#tenantId')[0].value;

					var url = printCtx + '/remote/querybo?' + 'tenantId=' + tenantId;

					$.ajax({
								type : 'GET',
								url : url,
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									$('#bo_list').html('');
									// var bos =JSON.parse(data).bos;
									for(key in data){
										 $('#bo_list').append('<option label="' + data[key].bo_name + '" value="' + data[key].bo_code + '">');
										 boMap[data[key].bo_code] = data[key].pk_bo;
									}
								},
								error : function(xhr, errorType, error) {
									showMessage('加载业务对象失败！');
								}
							});

				});


var templateMap = {};

// 加载模板
$('#queryTemplate')
		.on(
				'click',
				function() {
					var tenantId = $('#tenantId')[0].value;

					var url = printCtx + '/remote/queryTemplate?' + 'tenantId=' + tenantId;

					$.ajax({
								type : 'GET',
								url : url,
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									// var temps = JSON.parse(data).temps;
									var temps = data;
									$('#template_list').html('');
									$('#template_table')
											.html('<tr><th><input onclick="selectAll(event)" type="checkbox" value=""/>全选 </th><th>模板名称</th><th>模板编码</th><th>模板PK</th></tr>');
									for (key in temps) {
										templateMap[temps[key].templatecode] = temps[key].pk_print_template;
										$('#template_list')
												.append(
														'<option label="'
																+ temps[key].templatename
																+ '"id="'
																+ temps[key].pk_print_template
																+ '" value="'
																+ temps[key].templatecode
																+ '">');
										$('#template_table')
												.append(
														'<tr><th><input class="template_check" type="checkbox" value="'
																+ temps[key].pk_print_template
																+ '" /></th><td>'
																+ temps[key].templatename
																+ '</td><td>'
																+ temps[key].templatecode
																+ '</td><td>'
																+ temps[key].pk_print_template
																+ '</td></tr>');
									}
								},
								error : function(xhr, errorType, error) {
									showMessage('加载模板失败！');
								}
							});

				});

// 获取模板对应的数据格式
$('#getformat')
		.on(
				'click',
				function() {
					var template = $('#template')[0].value;
					if (template === 'undefined' || template == '') {
						showMessage('请先选择模板！');
						return;
					}
					var tenantId = $('#tenantId')[0].value;

					var url = 'remote/getdataformat?tenantId=' + tenantId
							+ '&template=' + template;
					url = encodeURI(encodeURI(url));
					$
							.ajax({
								type : 'GET',
								url : url,
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									var str = getFormatJsonStrFromString(data)
									$('#json-src').val(str);
								},
								error : function(xhr, errorType, error) {
									showMessage('获取数据格式失败！');
								}
							});
				});

// 获取模板对应的数据格式
$('#preview').on('click', function() {
	var template = $('#template')[0].value;
	if (template === 'undefined' || template == '') {
		showMessage('请先选择模板！');
		return;
	}
	var tenantId = $('#tenantId')[0].value;

	var url = 'remote/preview?tenantId=' + tenantId + '&template=' + template;
	url = encodeURI(encodeURI(url));
	var datajson = $('#json-src')[0].value;
	$.ajax({
		type : 'POST',
		url : url,
		data : {
			'datajson' : datajson
		},
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data, status, xhr) {
			var url = data;
			window.open(url);
		},
		error : function(xhr, errorType, error) {
			showMessage('error');
		}
	});
});

// 获取模板对应的数据格式
$('#openurl').on('click', function() {
	var url = printCtx + '/remote/openurl';
	url = encodeURI(encodeURI(url));
	window.open(url);
});

// 获取模板对应的数据格式
$('#previewNew')
		.on(
				'click',
				function() {
					var template = $('#template')[0].value;
					if (template === 'undefined' || template == '') {
						alert('请先选择模板！');
						return;
					}
					var tenantId = $('#tenantId')[0].value;

					// 存储打印数据
					var url = 'remote/savepreviewdata?tenantId=' + tenantId
							+ '&template=' + template;
					url = encodeURI(encodeURI(url));
					var datajson = $('#json-src')[0].value;
					$
							.ajax({
								type : 'POST',
								url : url,
								data : {
									'datajson' : datajson
								},
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									// 打印预览界面
									var serverUrl = window.location.href
											+ "remote/preview/getdata";
									var params = template;
									var url = 'remote/previewnew?tenantId='
											+ tenantId + '&template='
											+ template + '&printcode='
											+ template + '&serverUrl='
											+ serverUrl + '&params=' + params;
									window.open(url);
								},
								error : function(xhr, errorType, error) {
									alert('error');
								}
							});

				}

		);

// 模板修改入口
$('#updateTemplate').on(
		'click',
		function() {
			var template = $('#template')[0].value;
			if (template === 'undefined' || template == '') {
				showMessage('请先选择模板！');
				return;
			}
			var tenantId = $('#tenantId')[0].value;

			// var url = 'remote/editdesign?tenantId=' + tenantId +	// '&printcode='
			// var url = printCtx + '/remote/updateTemplate?tenantId=' +
			// tenantId + '&printcode=' + template;
			var url = printWebCtx + '/design?tenantId=' + tenantId
					+ '&printcode=' + template;
			window.open(url);

		});

$('#runtimetest').on('click', function() {
	document.getElementById('rttestcontent').style.display = 'block';
	var template = $('#template')[0].value;
});

getFormatJsonStrFromString = function(jsonStr) {
	var res = "";
	for (var i = 0, j = 0, k = 0, ii, ele; i < jsonStr.length; i++) {// k:缩进，j:""个数
		ele = jsonStr.charAt(i);
		if (j % 2 == 0 && ele == "}") {
			k--;
			for (ii = 0; ii < k; ii++)
				ele = "    " + ele;
			ele = "\n" + ele;
		} else if (j % 2 == 0 && ele == "{") {
			ele += "\n";
			k++;
			for (ii = 0; ii < k; ii++)
				ele += "    ";
		} else if (j % 2 == 0 && ele == ",") {
			ele += "\n";
			for (ii = 0; ii < k; ii++)
				ele += "    ";
		} else if (ele == "\"")
			j++;
		res += ele;
	}
	return res;
}

function showDiv() {
	document.getElementById('popWindow').style.display = 'block';
}

function closeDiv() {
	document.getElementById('popWindow').style.display = 'none';
}

// 获取模板对应的数据格式
var dataPk;
$('#savedata')
		.on(
				'click',
				function() {
					var template = $('#template')[0].value;
					if (template === 'undefined' || template == '') {
						showMessage('请先选择模板！');
						return;
					}
					var tenantId = $('#tenantId')[0].value;

					// 存储打印数据
					var url = 'remote/savebodata?tenantId=' + tenantId
							+ '&template=' + template;
					url = encodeURI(encodeURI(url));
					var datajson = $('#json-src')[0].value;
					if (datajson === 'undefined' || datajson == '') {
						showMessage('请先点击获取数据格式！');
						return;
					}
					$
							.ajax({
								type : 'POST',
								url : url,
								data : {
									'data' : datajson
								},
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									var jsonObj = JSON.parse(data);
									if (jsonObj && jsonObj.dataFlag) {
										dataPk = jsonObj.datapk;
									}
								},
								error : function(xhr, errorType, error) {
									showMessage('error');
								}
							});

				});

// 获取模板对应的数据格式
$('#savepreview')
		.on(
				'click',
				function() {
					var template = $('#template')[0].value;
					if (template === 'undefined' || template == '') {
						showMessage('请先选择模板！');
						return;
					}
					var tenantId = $('#tenantId')[0].value;
					// 存储打印数据
					var datajson = $('#json-src')[0].value;
					if (datajson === 'undefined' || datajson == '') {
						showMessage('请先点击获取数据格式！');
						return;
					}
					// 打印预览界面
					// var serverUrl = window.location.href +
					// "remote/preview/getdata";
					// var params=template;
					/*
					 * var url = 'remote/previewnew?tenantId=' + tenantId +
					 * '&template=' + template + '&printcode=' +
					 * template+'&datapk='+dataPk + '&sendType=1';
					 * window.open(url);
					 */

					// 存储打印数据
					var url = 'remote/savepreviewdata?tenantId=' + tenantId
							+ '&template=' + template;
					url = encodeURI(encodeURI(url));
					var datajson = $('#json-src')[0].value;
					$
							.ajax({
								type : 'POST',
								url : url,
								data : {
									'datajson' : datajson
								},
								contentType : "application/x-www-form-urlencoded; charset=utf-8",
								success : function(data, status, xhr) {
									// 打印预览界面
									var serverUrl = "preview/getdata";
									var params = template;
									var url = 'remote/previewnew?tenantId='
											+ tenantId + '&template='
											+ template + '&printcode='
											+ template + '&serverUrl='
											+ serverUrl + '&params=' + params
											+ '&sendType=2';
									;
									window.open(url);
								},
								error : function(xhr, errorType, error) {
									showMessage('error');
								}
							});

				});

// 提示信息框
var showMessage = function(message) {
	if (message) {
		$(".model-message")[0].innerHTML = message;
		$(".modal-dialog").fadeIn();
		setTimeout(function() {
			$(".modal-dialog").fadeOut();
		}, 2000);
	}
}
$("#close-modal").click(function() {
	$(".modal-dialog").fadeOut();
})
