
+ function($) {

	u.NcRefComp = u.BaseAdapter.extend({ 
		mixins:[u.EnableMixin, u.RequiredMixin, u.ValidateMixin],
		init: function() {
			element = this.element;
			options = this.options;
			viewModel = this.viewModel;
			//增加锚点
			this.meta_translations = options.meta_translations;
			this.meta_childmeta = options.meta_childmeta;
			if(this.meta_childmeta)
				this.childmetaArr = this.meta_childmeta.split('.');
			this.childIndex = options.childIndex;
			if(this.childIndex)
				this.childIndexArr = this.childIndex.split('-');
			this.hasDataTable = true;
			var self = this;
			var refmodel = '', refparam = '',refcfg = '';
			this.fieldId = '';
			this.showField = this.options['showField'];
			this.validType = 'string';
			if (this.hasDataTable) {
				refcfg = this.dataModel.getMeta(this.field, 'refcfg');
				//新增
				if(this.meta_childmeta){
					var nowChildMeta = this.dataModel;
					for(var i = 0; i < this.childmetaArr.length; i++){
						nowChildMeta = nowChildMeta.meta[this.childmetaArr[i]];
					}
					refmodel = nowChildMeta.meta[this.field].refmodel;
				}else{
					refmodel = this.dataModel.getMeta(this.field, 'refmodel')
				}
				refparam = this.dataModel.getMeta(this.field, 'refparam');
				var els = $(this.element);
				var $inputed = els.find("input");
				var inputid = $inputed.attr('id');

				this.fieldId = inputid || this.field;
				this.dataModel.refMeta(this.field, 'refparam').subscribe(function(value){
					$(element).attr('data-refparam', value);
				})
				this.dataModel.refMeta(this.field, 'refcfg').subscribe(function(value){
					$(element).attr('data-refcfg', value);
				})
			}
			$(element).attr('data-refmodel', refmodel);
			$(element).attr('data-refcfg', refcfg);
			$(element).attr('data-refparam', refparam);
			var pageUrl = '/uitemplate_web/static/js/uiref/refDList.js'; //默认地址
			var extendUrl = '/static/js/uiref/refDList.js';
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
				$('#' + refContainerID).remove();

				
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
					//$('#' + refContainerID).Refer('hide');
				}
			})
			if(this.meta_childmeta){
				var nowRow = this.dataModel.getCurrentRow();
				if(nowRow && this.childmetaArr && this.childIndexArr && this.childmetaArr.length == this.childIndexArr.length){ 
					for(var i = 0; i < this.childmetaArr.length; i++){
						nowRow = nowRow.getValue(this.childmetaArr[i]).getRow(this.childIndexArr[i]);
					}
					nowRow.ref(this.field).subscribe(function(value){
						self.modelValueChange(value)
					});

					var v = nowRow.getValue(this.field);
					this.modelValueChange(v);
				}
			}else{
				this.dataModel.ref(this.field).subscribe(function(value) {
					self.modelValueChange(value)
				});
				this.modelValueChange(this.dataModel.getValue(this.field))
			}

		},
		modelValueChange: function(val) {
			var self = this;
			var ele = $(this.element);
			var $input = ele.find("input");
			var modelValue = val;
			var inputVal = ele.find("input").val();
			var refName = ele.attr('refname');
			var oldValue = this.trueValue;
			
			this.trueValue = modelValue;
			var autoCheck;
			if(ele.attr("data-refcfg") != ''  && typeof ele.attr("data-refcfg") !=='undefined'){
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

				var mdisp;
				var mvalue = this.dataModel.getCurrentRow().getValue(this.field);
				if (this.showField){
					//新增
					//if(this.dataModel.getCurrentRow().data[this.showField] && this.meta_translations!="child"){
					if(!this.meta_childmeta){
						mdisp = this.dataModel.getCurrentRow().getValue(this.showField);
					}else{
						//mdisp = this.dataModel.getCurrentRow().data['childsets']['value'].getValue(this.showField);
						mdisp = this.dataModel.getCurrentRow().getChildValue(this.meta_childmeta+'.'+this.showField);
						mvalue = this.dataModel.getCurrentRow().getChildValue(this.meta_childmeta+'.'+this.field);
					}
				}else{
					mdisp = this.dataModel.getCurrentRow().getMeta(this.field, 'display');
				}

				if(val == mvalue && mdisp != null && (oldValue=="" || oldValue==null || oldValue == mvalue)) {
					self.setShowValue(mdisp);
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
					self.setShowValue(options.isReturnCode ? code : name)
				}
//			}
		},
		setValue: function(value) {
			this.trueValue = value.trueValue;
			this.slice = true
			this.setModelShowValue(value.showValue);
//			this.setModelValue(this.trueValue)

			//新增
			//if(this.dataModel.getCurrentRow().data[this.field]!=='undefined' && this.meta_translations!="child"){
			if(!this.meta_childmeta){
				this.dataModel.getCurrentRow().setChildValue(this.field,this.trueValue);
			}else{
				//this.dataModel.getCurrentRow().data['childsets']['value'].setValue(this.field, this.trueValue)
				this.dataModel.getCurrentRow().setChildValue(this.meta_childmeta +'.'+ this.field,this.trueValue);
			}

			this.setShowValue(value.showValue);
			this.slice = false;
			if(!this.hasDataTable) {
				this.trigger('valueChange', value);
			}
		},

		getValue: function () {
			return this.trueValue;
		},
		setModelShowValue: function(showValue) {
			if (this.showField){
				//新增
				//if(this.dataModel.getCurrentRow().data[this.showField]!="undefined" && this.meta_translations!="child"){
				if(!this.meta_childmeta){
					this.dataModel.getCurrentRow().setValue(this.showField, showValue);
				}else{
					//this.dataModel.getCurrentRow().data['childsets']['value'].setValue(this.showField, showValue)
					this.dataModel.getCurrentRow().setChildValue(this.meta_childmeta+'.'+this.showField, showValue);
				}
			}else{
				this.dataModel.getCurrentRow().setMeta(this.field, 'display', showValue);
			}

		},

		getShowValue: function () {
			return this.showValue
		},
		setShowValue : function(showValue){
			$(this.element).find('input').length>0 ? $(this.element).find('input').val(showValue) : $(this.element).val(showValue);
			//$(this.element).find('input').val(showValue);
			//this.trigger('showValueChange', showValue)
		},
		addDomEvent: function(name, callback){
			$(this.element).find("input").on(name, callback);
			return this;
		},
		setEnable: function(enable){
			var contentId = 'refContainer' + this.fieldId;
			var refContainerID=contentId.replace(/[^\w\s]/gi, '\\$&');
			if(enable === true || enable === 'true'){
				this.enable = true
				$(this.element).find('input').removeAttr('readonly');
				$(this.element).removeClass('disablecover').find('.covershade').remove();
			}	
			else if(enable === false || enable === 'false'){	
				this.enable = false
				$(this.element).find('input').attr('readonly','readonly');
				$(this.element).addClass('disablecover').prepend('<div class="covershade"></div>');
			}
			
			if(!$('#' + refContainerID).Refer){
				var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
				refcfg = this.dataModel.getMeta(this.field, 'refcfg');
				var refcfg=rbrace.test( refcfg ) ? jQuery.parseJSON( refcfg ) :{};
				$.extend(refcfg, {isEnable:this.enable});
				$(this.element).attr('data-refcfg', JSON.stringify(refcfg));
			}else{
				if ($('#' + refContainerID).Refer('getInstance').setEnable)
					$('#' + refContainerID).Refer('getInstance').setEnable(this.enable);	
			}
		},
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
		showField = options.showField,
		element = options.element,
		column = grid.getColumnByField(field);
		var htmlStr = '<div class="input-group date form_date">' +
			'<input  class="form-control" type="text">' +
			'<span class="input-group-addon"><span class="fa fa-angle-down"></span></span>' +
			'</div>';
		//element.innerHTML = htmlStr
		$(element).html(htmlStr);
		
		var refmodel = datatable.getMeta(field,'refmodel');
		var refparam = datatable.getMeta(field,'refparam');
//		grid._editComp || grid._editComp = {}
//		var ncrefer = grid._editComp[field] 
//		if (!ncrefer){
		var refOptions =  column.options.editOptions; 
		refOptions['refmodel'] = refmodel;
		refOptions['refparam'] = refparam;

		var ncrefer = new u.NcRefComp({
			el:$(element).find('div')[0],
			options: refOptions, 
			model:viewModel});
		
		grid.gridModel.editComponent[field] = ncrefer;
		
		
		var rowId = options.rowObj['$_#_@_id'];
		var row = datatable.getRowByRowId(rowId);
		var display
		if (showField){
			display = row.getValue(showField)
		}else{
			display = row.getMeta(field, 'display')	|| ''
		}
//		datatable.ref(field).subscribe(function(vakue){
//			grid.editValueChange(field,value);
//		})
		
		$(element).find('input').val(display);

	};
	
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
		var grid = options.gridObj;						
		var datatable = grid.dataTable;
		var column = options.gridCompColumn;
		var field = column.options.field;
		var showField = column.options.showField;
		var rowIndex = options.rowIndex;
		var rowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
		var row = datatable.getRowByRowId(rowId);

		var display;
		if (showField){
			display = row.getValue(showField);
		}else{
			display = row.getMeta(field, 'display') || ''
		}
		options.element.innerHTML = display;
		$(options.element).attr('title', display);								
	}

	window.ncReferEditType = ncReferEditType;
	window.ncReferRender = ncReferRender;

	
	u.compMgr.addDataAdapter({
        adapter: u.NcRefComp,
        name: 'uiRefer'
    });

}($)
