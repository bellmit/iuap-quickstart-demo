define([
	'jquery',
	'bootstrap'
], function ($){
	var tpl = _.template([
			'<div class="navbar-collapse">',
				'<div class="navbar navbar-<%=float%>">',
					'<%_.each(btns, function(v, i){%>',
						'<%if (typeof v == "string" && v == "split") {%>',
							' <span> | </span> ',
						'<%} else {%>',
							' <button type="button" class="btn btn-default navbar-btn" data-index=<%=i%>',
								'<%if (disabled(v)) {%>',
									' disabled',
								'<%}%>',
							'>',
								'<span class="glyphicon glyphicon-<%=v.icon%>"></span> ',
								'<span class="text"><%=v.text%></span>',
							'</button> ',
						'<%}%>',
					'<%})%>',
				'</div>',
			'</div>'
		].join(''));

	var Toolbar = function (options) {
		this.disabled = typeof options.isDisabled == 'function' ? options.isDisabled : $.noop
		this.wrap = $(options.selector).html(tpl({
				btns: options.btns,
				disabled: this.disabled,
				float: options.float
			}))
			.on('click', '.btn', function (e) {
				e.preventDefault()
				var index = $(this).data('index')
				options.btns[index].fn.call(this, options.btns[index].data)
			})
		this.btns = this.wrap.find('.btn')
	}
	return Toolbar
})