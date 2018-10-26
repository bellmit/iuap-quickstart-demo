define(['jquery','uui'],function($){	
/**
 * 日期区间控件
 */
	var DateIntervalComp = $.InputComp.extend({
		initialize: function(element, options, viewModel) {
			var self = this;
			DateIntervalComp.superclass.initialize.apply(this, arguments);
			this.validType = 'string';
			this.maxLength = options['maxLength'];
			this.minLength = options['minLength'];
			if (this.dataModel) {
				if (this.hasDataTable) {
					this.minLength = this.dataModel.getMeta(this.field, "minLength") || this.minLength
					this.maxLength = this.dataModel.getMeta(this.field, "maxLength") || this.maxLength
				}
			}	
			this.create();

		},
		modelValueChange: function(value) {
			if (this.slice) return
			value = value || "";
			this.trueValue = value
			this.showValue = value
			this.setShowValue(this.showValue);
		},
		setValue: function(value) {
			
			this.trueValue = value
			this.setShowValue(this.trueValue) //TODO fomat格式			
			this.slice = true
			this.setModelValue(value)
			this.slice = false
			this.trigger(DateInterval.EVENT_VALUE_CHANGE, this.trueValue)
		},
		getValue : function() {
			return this.trueValue
		},
		setShowValue : function(showValue) {
			this.showValue = showValue;
			this.element.value = showValue;
			this.element.title = showValue;
		},
		getShowValue: function() {
			return this.showValue
		},
		Statics: {
			compName: 'dateinterval'
		}
	});
	
	
	if ($.compManager){
		$.compManager.addPlug(DateIntervalComp);
	}
});