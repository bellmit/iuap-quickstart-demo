define(['jquery','uui'],function($,formula){	
/**
 * 金额控件
 */
	u.MoneyAdapter = u.BaseAdapter.extend({
		mixins:[u.ValueMixin,u.EnableMixin, u.RequiredMixin, u.ValidateMixin],
		init: function () {
			var self = this
			//MoneyComp.superclass.initialize.apply(this, arguments)
			this.validType = 'float'
			this.maxLength = this.options['maxLength']
			this.minLength = this.options['minLength']
			this.max = this.options['max']
			this.precision = this.getOption('precision') || this.precision;
			if (this.dataModel) {
				//if (this.hasDataTable) {
					this.minLength = this.dataModel.getMeta(this.field, "minLength") || this.minLength
					this.maxLength = this.dataModel.getMeta(this.field, "maxLength") || this.maxLength
				//}
			}	
			//this.create()
			if (this.element.nodeName == 'INPUT') {
				
				$(this.element).keyup(function(e) {
					self.checkEvent(e)
				})
				u.on(this.element, 'focus', function(){
		            if(self.enable){
		                self.setShowValue(self.getValue())
		            }
		        })

		        u.on(this.element, 'blur',function(){
		            if(self.enable){
		                if (!self.doValidate() && self._needClean()) {
		                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
		                        // 因必输项清空导致检验没通过的情况
		                        self.setValue('')
		                    } else {
		                        self.element.value = self.getShowValue()
		                    }
		                }
		                else
		                    self.setValue(self.element.value)
		            }
		        });
			}		
		},
		modelValueChange: function(value) {
			if (this.slice) return
			value = value || ""
			this.setValue(value);
		},
		setValue: function(value) {
			value = decodeURI(value);
			var curComp = this.dataModel.meta[this.field];
			var reg = /^([\u4E00-\u9FA5]+,?)+$/;
			if(value != "" && !reg.test(value)){
				this.showValue = parseFloat(value).toFixed(curComp.decimalPlace)
			}else{
				this.showValue =value;
			}
			this.trueValue = value//this.formater.format(value)
			this.slice = true
			this.setModelValue(this.trueValue)
			this.slice = false
			if(this.showValue == "NaN"){
				this.setShowValue(value)
				return;
			}
			//大写属性
			if(curComp && curComp.numberToChinese == "true" && value!="" && !reg.test(value)){
				var numValue = numberToChinese(this.showValue);
				this.setShowValue(numValue)
				this.dataModel.meta[this.field].display = numValue;
			}else{
				this.setShowValue(this.showValue);
			}
		},
//		getValue : function() {
//			return this.trueValue
//		},
//		setShowValue : function(showValue) {
//			if(showValue.toString()=="NaN"){
//				return;
//			}
//			this.showValue = showValue
//			this.element.value = showValue
//			this.element.title = showValue
//		},
//		getShowValue: function() {
//			return this.showValue
//		},
        checkEvent: function(a) {
        	a = parseInt(a.keyCode);
			var d = $("#"+this.field).val();
			isNaN(d) && ("-" != d && $("#"+this.field).val(parseFloat(d)), "-" == a && $("#"+this.field).val(d));
			"." == d.charAt(0) && $("#"+this.field).val(0 + parseFloat(d))
			var f = $("#"+this.field).val();
			$("#"+this.field).val(f.replace(/[^\d.-]/g, ""))
        },
//		Statics: {
//			compName: 'money'
//		}
	})
	
	
	/* 转换大写金额 */
	var numberToChinese = function(n){
	
		    var fraction = ['角', '分'];  
		    var digit = [  
		            '零', '壹', '贰', '叁', '肆',  
		            '伍', '陆', '柒', '捌', '玖'  
		    ];  
		    var unit = [  
		            ['元', '万', '亿'],  
		            ['', '拾', '佰', '仟']  
		        ];  
		    var head = n < 0 ? '欠' : '';  
		    n = Math.abs(n);  
		    var s = '';  
		    for (var i = 0; i < fraction.length; i++) {  
		         s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');  
		    }  
		    s = s || '整';  
		    n = Math.floor(n);  
		    for (var i = 0; i < unit[0].length && n > 0; i++) {  
		         var p = '';  
		         for (var j = 0; j < unit[1].length && n > 0; j++) {  
		                p = digit[n % 10] + unit[1][j] + p;  
		                n = Math.floor(n / 10);  
		            }  
		            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;  
		    }  
		    return head + s.replace(/(零.)*零元/, '元')  
		            .replace(/(零.)+/g, '零')  
		            .replace(/^整$/, '零元整');  
		  
       
	}
	/**
	 * grid控件 edittype
	 * @param {Object} options
	 * options:{gridObj,element,value,field,rowObj}
	 */
	var moneyEditType = function(options) {
		var grid = options.gridObj,
		datatable = grid.dataTable,
		viewModel = grid.viewModel,
		field = options.field,
		element = options.element,
		column = grid.getColumnByField(field)
		var htmlStr = '<div class="eType-input"><input id="'+field+'" type="text" maxlength=10 class="u-grid-edit-item-float"></div>'
		$(element).find('div').attr("style","text-align:right");
		$(element).find('div').html(htmlStr);
		var comp = app.init(viewModel,document.getElementById('girdMoney'+field));
		
//		var mOptions = column.options.editOptions;
//		var money = new MoneyComp($(element).find('div')[0], mOptions, viewModel)
//		grid.gridModel.editComponent[field] = money;
//		
//		
//		var rowId = options.rowObj['$_#_@_id'];
//		var row = datatable.getRowByRowId(rowId);
////		var display = row.getMeta(field, 'display')	|| ''	; 
//		var display = options.value;
//		$($(element).find('div').find('input')[0]).blur(function(e) {
//			        var value = this.value;
//			        var trueValue;
//			        var curComp = grid.dataTable.meta[this.id];
//			        var reg = /^([\u4E00-\u9FA5]+,?)+$/;
//					if(value != "" && !reg.test(value)){
//						trueValue = parseFloat(value).toFixed(curComp.decimalPlace)
//					}else{
//						trueValue = value;
//					}
//					grid.editValueChange(field,trueValue);
//			})
//			$($(element).find('div').find('input')[0]).keyup(function(a) {
//				a = parseInt(a.keyCode);
//				var d = $("#"+options.field).val();
////				if(d.toString().length>10){
////					d = d.toString().substring(0,10);
////				}
//				isNaN(d) && ("-" != d && $("#"+options.field).val(parseFloat(d)), "-" == a && $("#"+options.field).val(d));
//				"." == d.charAt(0) && $("#"+options.field).val(0 + parseFloat(d))
//				var f = $("#"+options.field).val();
//				$("#"+options.field).val(f.replace(/[^\d.-]/g, ""))
//			})
//		//显示值
//		$(element).find('input').val(display)

	}
	
	/**
	 *grid 控件 render 
	 */
	var moneyRender = function(options){
		var grid = options.gridObj						
		var datatable = grid.dataTable
		var column = options.gridCompColumn
		var field = column.options.field
		var rowIndex = options.rowIndex
		var rowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
		var row = datatable.getRowByRowId(rowId);
	
//		var display = row.getMeta(field, 'display') || ''
//		options.element.innerHTML = display
		var a = options.value;
		var reg = /^([\u4E00-\u9FA5]+,?)+$/;
		if(reg.test(a) ){
				return;
			}else if(a!=""){
				a = parseFloat(a).toFixed(grid.dataTable.meta[field].decimalPlace);
			}
		if(a!="" && grid.dataTable.meta[field].componentKey == "Money" && grid.dataTable.meta[field].numberToChinese == "true"){
		    	a = numberToChinese(a);
		 }
		$(options.element).attr("style","text-align:right");
		$(options.element).text(a);								
		$(options.element).attr('title', a)								
	}

	window.moneyEditType = moneyEditType
	window.moneyRender = moneyRender
	
//	$.MoneyComp = MoneyComp
//	if ($.compManager)
//		$.compManager.addPlug(MoneyComp)
	
	u.compMgr.addDataAdapter({
        adapter: u.MoneyAdapter,
        name: 'money'
    });
    
})