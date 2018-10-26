define("form/component/datetimepicker", ["form/tplutil"], function() {
	var l = require("form/tplutil");
	window.DateTimePicker = Backbone.View.extend({
		initialize: function(b) {
			this.el = b.el;
			this.preEl = b.preEl;
			this.startView = b.startView ? b.startView : 2;
			this.format = b.format ? b.format : "{yyyy}-{MM}-{dd}";
			this.minView = b.minView ? b.minView : 2;
			this.startDate = b.startDate ? b.startDate : null;
			this.endDate = b.endDate ? b.endDate : null;
			$("body").append(l.get("datetimepicker"))
		},
		delegateEvents: function() {
			var b = this;
			$("#datetime-back").on("click", function() {
				$(b.preEl).removeClass("hide");
				$("#date-selected").addClass("hide");
				b.remove()
			})
		},
		render: function() {
			var b = this;
			$("#datetimepicker").datetimepicker({
				format: b.format,
				weekStart: 1,
				todayBtn: 1,
				todayHighlight: 1,
				startView: b.startView,
				minView: b.minView,
				startDate: b.startDate,
				endDate: b.endDate,
				language: "zh-CN"
			}).on("changeDate", function(a) {
				a = a.date;
				16 < b.format.length && a.setHours(a.getHours() - 8);
				a || (a = "");
				a instanceof Date && (a = a.format(b.format));
				b.el.trigger("dateConfirm", {
					date: a
				});
				$("#date-selected").addClass("hide");
				$(b.preEl).removeClass("hide");
				b.remove()
			});
			setTimeout(function() {
				$("#date-selected").removeClass("hide")
			}, 100)
		},
		remove: function() {
			$("#date-selected").remove()
		}
	});
	return window.DateTimePicker
});
