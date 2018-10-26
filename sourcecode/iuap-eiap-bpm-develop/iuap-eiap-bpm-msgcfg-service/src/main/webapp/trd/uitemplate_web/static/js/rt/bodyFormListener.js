var BodyFormListener = function(app, viewModel,templateModel){
	this.app = app;
	this.viewModel = viewModel;
	this.templateModel = templateModel;
	this.registerListenerActions();
}

BodyFormListener.fn = BodyFormListener.prototype;

BodyFormListener.fn.registerListenerActions = function(){
	var self = this;
	var dataTables = this.app.getDataTables();
	var bindId;
	for(var key in dataTables){
		if(key == "headform"){
			continue;
		}
		$("tbody#" + key + "_content_tbody").on('click','[role="row"]',function(e){
			key = e.target.parentNode.getAttribute('dataTableID');
			if(key ==='undefined'){
				key = e.target.getAttribute('dataTableID');
			}
			var editTrIndex = e.target.parentNode.getAttribute('index');
			if(editTrIndex === 'undefined'){
				editTrIndex = e.target.getAttribute('index');
			}
			var divClass = key + "_hidearea_div";
			var curTableTrWidth = e.target.parentNode.offsetWidth + "px";
			var $clcikDiv = $('.'+divClass);
			if($clcikDiv.length > 0){
				$clcikDiv.each(function(index,ele){
					var tmpIndex = ele.getAttribute('index');
					if(editTrIndex == tmpIndex){
						if($(this).css('display')=='block'){
							if($($(this).find('.tableformedit')[0]).css('display') != 'none'){//form正在编辑状态，不能隐藏
								
							}else{
								$(this).css('display','none');
								$(this).parent().css('display','none');
								$(this).parent().parent().css('display','none');
							}
						}else{
							//修改reference中的input的id，保证唯一性
							var suffix = new Date().getTime().toString();
							$(this).find('.input_ref').each(function(i,ele){
								var id = $(ele)[0].getAttribute('id');
								var id = id + "_" + suffix;
								$(ele)[0].setAttribute('id',id);
							});
							$(this).css({'display':'block','width':curTableTrWidth});
							var $btnDiv = $(this).find('div[role="row_btn"]');
							if($btnDiv){
								var divs = $btnDiv.find("div");
								var f = false;
								for(var i=0; i < divs.length; i++){
									var div = divs[i];
									if($(div).css("display") && $(div).css("display") != "none"){
										f = true;
										break;
									}
								}
								if(!f){
									$btnDiv.hide();
								}
							}
							$(this).parent().css('display','block');
							$(this).parent().parent().css('display','block');
							$(this).parent().parent().css('height',($(this)[0].offsetHeight - 1) + 'px');
							var element = $(this)[0];
							if(element){
					            element.querySelectorAll('[u-meta]').forEach(function (ele) {
					                var options = JSON.parse(ele.getAttribute('u-meta'));
					                options['type'] = options['type'] || 'string';
					                if (options && options['type']) {
					                    if(options['type'] == 'u-radio' || options['type'] =='u-checkbox'){
					                    	// 保证此元素下只有一个label
					                    	var $l = $('label',$(ele));
					                    	for(var i = 1; i < $l.length;i++){
					                    		$l[i].remove();
					                    	}
					                    }
					                }
					            })
					        }
							self.app.init(self.viewModel,$(this)[0], false);
						}
						
					}
				});
			}
		});
	}
}

function changeDataTableRowClick(o){
	if(o==undefined){
		return;
	}
	var datatableId = o.getAttribute('datatableid');
	if(datatableId == undefined){
		return;
	}
	var datatable = app.getDataTable(datatableId);
	var index = o.getAttribute('index');
	if(datatable && index && index > 0){
		datatable.setRowSelect(index);
	}
}