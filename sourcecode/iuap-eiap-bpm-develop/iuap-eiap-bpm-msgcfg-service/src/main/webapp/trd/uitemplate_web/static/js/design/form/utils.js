define("form/utils", function() {
	return {
		alert: function(text, callback) {
			bootbox.alert(text, callback ||
			function() {})
		},
		confirm: function(text, callback) {
			bootbox.confirm(text,
			function(a) {
				callback && callback(a)
			})
		},
		prompt: function(text, callback) {
			bootbox.prompt(text,
			function(a) {
				callback && callback(a)
			})
		},
		notify: function(text, title, type, autoHide) {
			if (0 == autoHide) {
				autoHide = true;
			}
			var options = {
				sticker: false,
				shadow: false,
				history: false,
				hide: autoHide,
				opacity: .95,
				animation: {
					effect_in: "slide",
					effect_out: "none"
				},
				text: text,
				title: title
			};
			switch (type) {
				case "error":
					options.type = "error";
					break;
				case "success":
					options.type = "success";
				default:
					options.type = "info";
					break;
			}
			$.pnotify_remove_all();
			$.pnotify(options)
		},
		loading: function(fn) {
			var oldLoading = $('.modal-loading')
			if (oldLoading.length) {
				oldLoading.each(function(){
					$(this).modal('hide')
				})
			}
			var loading = bootbox.dialog().find('.modal-dialog').remove().end();
			loading.addClass('modal-loading').append([
				'<div class="loading-spinner">',
					'<div class="main-loader">',
						'<div class="wBall wBall_1">',
							'<div class="wInnerBall"> </div>',
						'</div>',
						'<div class="wBall wBall_2">',
							'<div class="wInnerBall"> </div>',
						'</div>',
						'<div class="wBall wBall_3">',
							'<div class="wInnerBall"> </div>',
						'</div>',
						'<div class="wBall wBall_4">',
							'<div class="wInnerBall"> </div>',
						'</div>',
						'<div class="wBall wBall_5">',
							'<div class="wInnerBall"> </div>',
						'</div>',
					'</div>',
				'</div>'
			].join(''));
			return typeof fn == 'function' ? function (data) {
				loading.modal('hide');
				fn(data)
			} : loading
		},
		hideLoading:function(e) {
			var oldLoading = $('.modal-loading')
			if (oldLoading.length) {
				oldLoading.each(function(){
					$(this).modal('hide')
				})
			}
		}
	}
});