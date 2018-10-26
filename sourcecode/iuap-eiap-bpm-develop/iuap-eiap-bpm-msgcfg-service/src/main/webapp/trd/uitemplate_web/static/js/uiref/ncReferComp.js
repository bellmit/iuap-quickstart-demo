//require(['refer'],function(ko){
//	window.ko = ko;
//})

+ function($) {

	var NcRefComp = $.InputComp.extend({ 
		initialize: function(element, options, viewModel) {
			var self = this
			var refmodel = '', refparam = '',refcfg = ''
			this.fieldId = ''
			NcRefComp.superclass.initialize.apply(this, arguments)
			this.validType = 'string'
			if (this.hasDataTable) {
				refcfg = this.dataModel.getMeta(this.field, 'refcfg')
				refmodel = this.dataModel.getMeta(this.field, 'refmodel')
				refparam = this.dataModel.getMeta(this.field, 'refparam')
				
				var els = $(this.element);
				var $inputed = els.find("input");
				var inputid = $inputed.attr('id');

				this.fieldId = inputid || this.field;
				//this.fieldId = this.field
				this.dataModel.refMeta(this.field, 'refparam').subscribe(function(value){
					$(element).attr('data-refparam', value)
				})
				this.dataModel.refMeta(this.field, 'refcfg').subscribe(function(value){
					$(element).attr('data-refcfg', value)
				})
			}
			/*else{
				refmodel = options['refmodel']
				refcfg = options['refcfg']
				this.fieldId = options['fieldId']
			}*/
			$(element).attr('data-refmodel', refmodel)
			$(element).attr('data-refcfg', refcfg)
			$(element).attr('data-refparam', refparam)
			var pageUrl = '/uitemplate_web/static/js/ref/refDList.js'; //默认地址
			var extendUrl = '/static/js/ref/refDList.js';
			var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
			if(rbrace.test( refcfg )){
				refcfg=jQuery.parseJSON(refcfg);
			}
			if (refcfg && refcfg.pageUrl) {
				pageUrl ="/"+refcfg.pageUrl + extendUrl;
			}
			
			
			var refInitFunc = pageUrl.substr(pageUrl.lastIndexOf('/') +1).replace('.js','');
			
			var contentId = 'refContainer' + this.fieldId;
			var refContainerID=contentId.replace(/[^\w\s]/gi, '\\$&');
			if ($('#' + refContainerID).length > 0)
				$('#' + refContainerID).remove()

				
			if(!window[refInitFunc]){
				var scriptStr = '';	
				$.ajax({
					url:pageUrl,
					dataType:'script',
					async : false,
					cache: true,
					success : function(data){
						scriptStr  = data
					}
				});
				(new Function(scriptStr))();
			}
			
			
			window[refInitFunc]({contentId: contentId,
				dom: $(this.element),
				pageUrl: pageUrl,
				setVal: function(data, noFocus) {
					if (data) {
						var options = $('#' + refContainerID).Refer('getOptions');
						var pk = $.map(data, function(val, index) {
							return val.refpk
						}).join(',');
						var name = $.map(data, function(val, index) {
							return val.refname
						}).join(',');
						var code = $.map(data, function(val, index) {
							return val.refcode
						}).join(',');
						var oldVal = self.trueValue,
						showValue = options.isReturnCode ? code : name,
						valObj = {trueValue:pk,showValue:showValue}
						if (pk == '') {
							if (oldVal != null && oldVal != '') {
								self.setValue(valObj);
							}
						} else {
							self.setValue(valObj);
						}
	//					ele.find("input").val(options.isReturnCode ? code : name).trigger('change');
						//self.setShowValue(options.isReturnCode ? code : name)
						if (!noFocus) {
							$(self.element).find("input").focus();
						}
					}
				},
				onOk: function(data) {
					this.setVal(data);
					this.onCancel();
				},
				onCancel: function() {
					$('#' + refContainerID).Refer('hide');
				}
			})

			this.create()
		},
		modelValueChange: function(val) {
			var self = this
			var ele = $(this.element)
			var $input = ele.find("input");
//			var inpuid = $input.attr('id');
			var modelValue = val;
			var inputVal = ele.find("input").val();
			var refName = ele.attr('refname');
			
			this.trueValue = modelValue;
			var autoCheck;
			if(typeof ele.attr("data-refcfg") !=='undefined'){
				autoCheck = JSON.parse(ele.attr("data-refcfg")).autoCheck;
			}
			
			//解决直接通过KO设置PK
			//TODO:autochck=false不处理
//			if ("" !== inputVal && modelValue === refName) {
				if (!val){
					if(autoCheck!==false){
						ele.find("input").val('');
					}
					return;
				} 
				
				var mdisp = this.dataModel.getCurrentRow().getMeta(this.field, 'display'),
				mvalue = this.dataModel.getCurrentRow().getValue(this.field)
				if(val == mvalue && mdisp != null) {
//				if(val == mvalue) {
					self.setShowValue(mdisp)
//					self.setShowValue(val)
					return;
				}

				//"#refContainer1bodys_project.pk_projectclass" "Str1.str2%str3".replace(/[^\w\s]/gi, '\\$&')
				var contentId = 'refContainer' + self.fieldId;
				var refContainerID = contentId.replace(/[^\w\s]/gi, '\\$&');
				//TODO:Refer.js加载延迟bug
				if (!$('#' + refContainerID).Refer) return
				var data = $('#' + refContainerID).Refer('getRefValByPK', modelValue.split(','));
				if (data  && data.length > 0) {
					var options = $('#' + refContainerID).Refer('getOptions');
					var pk = $.map(data, function(val, index) {
						return val.refpk
					}).join(',');
					var name = $.map(data, function(val, index) {
						return val.refname
					}).join(',');
					var code = $.map(data, function(val, index) {
						return val.refcode
					}).join(',');
//					var value = valueAccessor();
//					value(pk);
//					ele.find("input").val(options.isReturnCode ? code : name).trigger('change');\n
					self.setShowValue(options.isReturnCode ? code : name)
				}
//			}
		},
		setValue: function(value) {
			this.trueValue = value.trueValue
			this.slice = true
			this.setModelShowValue(value.showValue)
			this.setModelValue(this.trueValue)
			this.setShowValue(value.showValue)
			this.slice = false
			if(!this.hasDataTable) {
				this.trigger('valueChange', value)
			}
		},
		setModelShowValue: function(showValue) {
			this.dataModel.getCurrentRow().setMeta(this.field, 'display', showValue)
		},
		setShowValue : function(showValue){
			$(this.element).find('input').val(showValue)
			this.trigger('showValueChange', showValue)
		},
		addDomEvent: function(name, callback){
			$(this.element).find("input").on(name, callback)
			return this
		},
		setEnable: function(enable){
			var contentId = 'refContainer' + this.fieldId;
			var refContainerID=contentId.replace(/[^\w\s]/gi, '\\$&');
			if(enable === true || enable === 'true'){
				this.enable = true
				$(this.element).find('input').removeAttr('readonly') 
				$(this.element).removeClass('disablecover').find('.covershade').remove()
			}	
			else if(enable === false || enable === 'false'){	
				this.enable = false
				$(this.element).find('input').attr('readonly','readonly')	
				$(this.element).addClass('disablecover').prepend('<div class="covershade"></div>');
			}
			
			if(!$('#' + refContainerID).Refer){
				var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
				refcfg = this.dataModel.getMeta(this.field, 'refcfg')
				var refcfg=rbrace.test( refcfg ) ? jQuery.parseJSON( refcfg ) :{};
				$.extend(refcfg, {isEnable:this.enable});
				$(this.element).attr('data-refcfg', JSON.stringify(refcfg))
			}else{
				if ($('#' + refContainerID).Refer('getInstance').setEnable)
					$('#' + refContainerID).Refer('getInstance').setEnable(this.enable);	
			}
		},
		Statics: {
			compName: 'ncRefer'
		}
	})

	/**
	 * grid控件 edittype
	 * @param {Object} options
	 * options:{gridObj,element,value,field,rowObj}
	 */
	var ncReferEditType = function(options) {
		var grid = options.gridObj,
		datatable = grid.dataTable,
		viewModel = grid.viewModel,
		field = options.field,
		element = options.element,
		column = grid.getColumnByField(field)
		var htmlStr = '<div class="input-group date form_date">' +
			'<input  class="form-control" type="text">' +
			'<span class="input-group-addon"><span class="fa fa-angle-down"></span></span>' +
			'</div>'
		//element.innerHTML = htmlStr
		$(element).html(htmlStr)
		
		var refmodel = datatable.getMeta(field,'refmodel')
		var refparam = datatable.getMeta(field,'refparam')
//		grid._editComp || grid._editComp = {}
//		var ncrefer = grid._editComp[field] 
//		if (!ncrefer){
		var refOptions =  column.options.editOptions 
		refOptions['refmodel'] = refmodel
		refOptions['refparam'] = refparam

		var ncrefer = new NcRefComp($(element).find('div')[0], refOptions, viewModel)
		
		grid.gridModel.editComponent[field] = ncrefer;
		
		
		var rowId = options.rowObj['$_#_@_id'];
		var row = datatable.getRowByRowId(rowId);
		var display = row.getMeta(field, 'display')	|| ''	
			ncrefer.on('valueChange', function(value){
				grid.editValueChange(field,value);
//				$(options.rowObj).attr(options.field,value);
			})
		
		$(element).find('input').val(display)

	}
	
	/**
	 *grid 控件 render 
	 */
	var ncReferRender = function(options){
//		obj.value = v;
//		obj.element = span;
//		obj.gridObj = oThis;
//		obj.row = this;
//		obj.gridCompColumn = gridCompColumn;
//		obj.rowIndex = j;
		var grid = options.gridObj						
		var datatable = grid.dataTable
		var column = options.gridCompColumn
		var field = column.options.field
		var rowIndex = options.rowIndex
		var rowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
		var row = datatable.getRowByRowId(rowId);
	
		var display = row.getMeta(field, 'display') || ''
		options.element.innerHTML = display
		$(options.element).attr('title', display)								
	}

	window.ncReferEditType = ncReferEditType
	window.ncReferRender = ncReferRender

	if ($.compManager)
		$.compManager.addPlug(NcRefComp)

}($)
