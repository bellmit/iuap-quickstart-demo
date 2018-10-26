define([
	'jquery',
	'bootstrap',
	'uui',
	'u.biz',
	'templetutil'
], function (){
	var tpl = _.template([
			'<ul class="nav nav-tabs">',
				'<% _.each(forms, function(v, i){%>',
					'<li><a href="#tab<%=i%>" data-index=<%=i%>><%=v.title%></a></li>',
				'<%})%>',
			'</ul>',
			'<div class="tab-content">',
				'<%_.each(forms, function(v, i){%>',
					'<div class="tab-pane" id="tab<%=i%>" data-index="<%=i%>" data-pk="<%=v.pk%>"><%=v.title%> <span class="load-stat">loading……</span></div>',
				'<%})%>',
			'</div>',
		].join(''));
	var inertia = function (tabpanel) {
		if(tabpanel.data('loaded')) return;
		var billData = this.forms[tabpanel.data('index')]
		var name = billData.name
		var pk = tabpanel.data('pk')
		var app = $.createApp()
		var templetUtils = new TempletUtils(app)
		var uiTemplate = billData.uiTemplate = templetUtils.queryBillList(pk)
		// var name = uiTemplate.name
		var url = uiTemplate.url
		var params = JSON.stringify(_.extend({name: name}, this.forms[tabpanel.data('index')].params))
			.replace(/\{\"/g, "{")
			.replace(/\,\"/g, ",")
			.replace(/\"\:/g, ":")
		window.tangram.register(name, url);
		var str = _.template([
				'<div class="<%=name%>">',
					'<<%=name%> params=<%=params%>></<%=name%>>',
				'</div>'
			].join(''))({
				name: name,
				params: params
			})
		tabpanel.html(str);
		ko.applyBindings({},tabpanel[0]);
		tabpanel.data('loaded', 1);
		tabpanel.find('.load-stat').text('loaded')
	};

	var Tab = function (options) {
		var self = this
		this.apps = []
		this.forms = options.forms
		this.curTabIndex = 0
		this.wrap = $(options.selector).html(tpl(options))
			.on('click', '.nav-tabs a', function (e) {
				var tab = $(this)
				e.preventDefault()
				tab.tab('show')
				options.onChange && options.onChange()
				self.curTabIndex = tab.data('index')
			})
		this.tabs = this.wrap.find('.nav-tabs a')
		if (options.inertia) {
			this.tabs.on("show.bs.tab", function (e) {
				var tabpanel = $(e.target.getAttribute('href'));
				inertia.call(self, tabpanel)
			})
		} else {
			this.tabs.each(function (i, v) {
				var tabpanel = $(this.getAttribute('href'));
				inertia.call(self, tabpanel)
			})
		}
		this.tabs.eq(options.startTab).trigger('click')
	}
	return Tab
})
