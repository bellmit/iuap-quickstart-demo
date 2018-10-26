define(['lib/bootbox'], function(bootbox) {
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
		}
	}
});