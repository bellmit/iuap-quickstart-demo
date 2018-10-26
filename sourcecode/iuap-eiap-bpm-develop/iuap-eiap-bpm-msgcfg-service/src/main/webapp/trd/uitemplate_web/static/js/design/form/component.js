define("form/component", function() {
	return Backbone.View.extend({
		el: "#form",
		componentSetup: {},
		initialize: function(h) {
			this.name = h.name;
			this.componentmodel = null
		},
		render: function(h) {
			console.error("you need to rewrite the method : render")
		},
		renderEditor: function() {
			console.error("you need to rewrite the method : renderSetUp")
		},
		renderPreview: function(h, b, a) {
			console.error("you need to rewrite the method : renderPreview")
		},
		renderEditPreview: function(h) {
			console.error("you need to rewrite the method : renderEditPreview")
		},
		submitCheck: function(h, b) {
			console.error("you need to rewrite the method : submitCheck")
		},
		checkEvents: function(h) {
			console.error("you need to rewrite the method : checkEvents")
		},
		readOnly: function(h, b) {
			console.error("you need to rewrite the method : readOnly")
		},
		stringify: function(h) {
			return JSON.stringify(h)
		},
		toStringify: function() {
			return null != this.componentSetup ? this.stringify(this.componentSetup) : null
		},
		toComponent: function(h) {
			if (null == JSON.parse(h).componentKey) return null
		},
		saveComponentValue: function(h, b) {
			"mobile" != window.systemInfo_form && h.parents(".field_js").get(0) && h.parents(".field_js")
		},
		setComponentModel: function(h) {
			this.componentmodel = h
		}
	});
});
