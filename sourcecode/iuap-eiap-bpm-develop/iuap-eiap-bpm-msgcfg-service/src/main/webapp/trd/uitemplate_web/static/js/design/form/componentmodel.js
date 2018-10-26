define("form/componentmodel", function() {
	return Backbone.Model.extend({
		initialize: function(h) {
			null != h && (this.formId = h.reportId)
		},
		getFormSelectFields: function(h) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/getFormStatFields.json",
				dataType: "json",
				data: JSON.stringify({
					formId: this.formId
				}),
				success: function(b) {
					h && h(b)
				}
			})
		},
		getFormTableSelectFields: function(h) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/findFormTableStatFields.json",
				dataType: "json",
				data: JSON.stringify({
					formId: this.formId
				}),
				success: function(b) {
					h && h(b)
				}
			})
		},
		getFormNumberSelectFields: function(h) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/getFormNumberStatFields.json",
				dataType: "json",
				data: JSON.stringify({
					formId: this.formId
				}),
				success: function(b) {
					h && h(b)
				}
			})
		},
		getNumberFieldStatData: function(h, b) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/countNumberStatData.json",
				dataType: "json",
				data: JSON.stringify({
					fieldId: h.componentSetup.dataSetId,
					statType: h.componentSetup.stattype
				}),
				success: function(a) {
					b && b(a)
				}
			})
		},
		getFieldStat: function(h, b) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formfieldstat/getFieldChartData.json",
				dataType: "json",
				data: JSON.stringify({
					fieldId: h
				}),
				success: function(a) {
					b && b(a)
				}
			})
		},
		getTablePageData: function(h, b) {
			$.ajax({
				type: "post",
				contentType: "application/json;charset=UTF-8",
				url: "/formdatastat/findRowListByFieldIds.json",
				dataType: "json",
				data: JSON.stringify({
					formId: this.formId,
					fieldIds: h.fieldIds,
					pageNo: h.pageNo,
					pageSize: h.pageSize
				}),
				success: function(a) {
					b && b(a)
				}
			})
		},
		generatorId: function(h) {
			$.ajax({
				type: "post",
				url: "/form/generatorId.json",
				dataType: "json",
				async: !1,
				success: function(b) {
					h && h(b)
				}
			})
		}
	});
});
