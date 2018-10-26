define("form/formpreview", ["form/form-plugin"], function() {
	var l = require("form/form-plugin"),
		b = {
			laodForm: function() {
				var a = $("#formId").val(),
					c = $("#formLayoutId").val(),
					d = $("#dataId").val(),
					e = $("#reportId").val();
				e && 0 < e.length && $("#widget-control").data("reportId", e);
				var e = $("#filterName").val(),
					f = $("#filterDescription").val();
				$(".form-name").text(e).attr("title", e);
				$(".form-description").text(f).attr("title", f);
				$("#widget-control").html("");
				null == TEAMS.currentUser && ($(".btn-login").removeClass("hide"), needCopy = !1);
				null != d && "" != d ? l.renderFormData({
					parentEl: $("#widget-control"),
					dataId: d,
					notDefault: !0,
					callback: function(a) {
						"submit" == a.formData.dataStatus ? $("#submit").parent().remove() : ($("#submit").removeClass("hide"), $("#temporary").show())
					}
				}) : l.renderForm({
					parentEl: $("#widget-control"),
					formId: a,
					layoutId: c,
					callback: function(a) {
						0 < window.location.href.indexOf("/fill/") ? ($("#submit").removeClass("hide"), $("#temporary").show()) : $("#submit").parent().remove()
					}
				});
				b.comment.loadComment({
					formId: a,
					pageSize: b.comment.pageSize,
					pageNo: b.comment.pageNo
				});
				0 != window.location.pathname.indexOf("/biaoge/preview/") ? $(".form-preview-wrapper .j_cloneForm").remove() : null != TEAMS.currentUser && $(".form-preview-wrapper .j_cloneForm").removeClass("hide"); - 1 == window.location.pathname.indexOf("/previewFill") && $(".form-preview-wrapper .comment-box").removeClass("hide"); - 1 < window.location.pathname.indexOf("/biaoge") && $(".j_go-home").removeClass("hide")
			},
			calculateHeight: function() {
				var a = $(window).height();
				$("#form-preview").attr("style", "min-height:" + (a - 30) + "px;")
			},
			comment: {
				pageNo: 1,
				pageSize: 10,
				search: function(a, c) {
					$.ajax({
						type: "post",
						url: "/biaoge/searchFormcomment.json",
						dataType: "json",
						data: a,
						success: function(a) {
							c && c(a)
						}
					})
				},
				create: function(a, c) {
					$.ajax({
						type: "post",
						url: "/biaoge/createFormcomment.json",
						dataType: "json",
						data: a,
						success: function(a) {
							c && c(a)
						}
					})
				},
				loadComment: function(a) {
					this.search(a, function(a) {
						$.each(a.pageFormComment.result, function() {
							var a = $(".j_module-container .j_comment:first").clone().removeClass("hide");
							a.find(".j_time").text("评论于：" + (new Date(this.createTime)).format("{yyyy}-{MM}-{dd} {HH}:{mm}"));
							a.find(".j_content").text(this.content);
							this.operator && !this.anonymous && (this.operator.username && a.find(".j_pic").text(this.operator.username).removeClass("pic-anonymous"), this.operator.avatar.p3 && TEAMS.currentUser && a.find("img").attr("src", "/base/download/" + this.operator.avatar.p3));
							a.appendTo($(".j_module-container .preview-list"))
						});
						a.pageFormComment.hasNext ? $(".j_module-container .j_morecontent").removeClass("hide") : $(".j_module-container .j_morecontent").addClass("hide")
					})
				}
			}
		};
	$(function() {
		"mobile" != window.systemInfo_form && ($("body").off("resizeSroll").on("resizeSroll", "div.scroll-wrapper", function(a) {
			a = $(this);
			if (a.attr("horizontal")) {
				var b = $(window).width(),
					e = a.offset().left;
				a.css("width", b - e)
			} else {
				var b = $(window).height(),
					e = a.attr("marginbottom") || 0,
					f = a.offset().top;
				a.css("height", b - f - e)
			}
			a.mCustomScrollbar("update")
		}), function(a) {
			var b = a.attr("marginbottom") || 0,
				e = a.offset().top,
				f = $(window).height();
			a.height(f - e - b);
			b = a.attr("theme") ? a.attr("theme") : "darkblue";
			a.hasClass("mCustomScrollbar") || a.mCustomScrollbar({
				theme: b
			})
		}($(".j_module-container")), b.calculateHeight(), $(window).off("resize.formpreview").on("resize.formpreview", function(a) {
			b.calculateHeight();
			setTimeout(function() {
				$("body div.scroll-wrapper").each(function(a) {
					$(this).trigger("resizeSroll", a)
				})
			}, 100)
		}), $(".preview_btn").click(function(a) {
			$(".comment-box").hasClass("in") ? ($(".comment-box").removeClass("in"), $(this).addClass("preview_btn_off").attr("title", "显示评论")) : ($(".comment-box").addClass("in"), $(this).removeClass("preview_btn_off").attr("title", "隐藏评论"), a.stopPropagation())
		}), $("body").off("click").on("click", function(a) {
			a = $(a.target);
			!a.hasClass("comment-box") && null == a.parents(".comment-box").get(0) && $(".comment-box").hasClass("in") && ($(".comment-box").removeClass("in"), $(".preview_btn").addClass("preview_btn_off").attr("title", "显示评论"))
		}), $(".j_module-container").off("click.formpreview", ".j_addcomment").on("click.formpreview", ".j_addcomment", function() {
			console.log(b.model);
			var a = $("#formId").val(),
				d = $.trim($(".j_module-container .j_content").val()),
				a = {
					"formComment.formID": a,
					"formComment.content": d
				},
				d = $.trim($(".j_module-container .j_content").val());
			0 == d.length ? l.notify("评论内容不能为空") : 200 < d.length ? l.notify("评论内容不能超过200个字符") : b.comment.create(a, function(a) {
				a = $(".j_module-container .j_comment:first").clone().removeClass("hide");
				a.find(".j_time").text("评论于：" + (new Date).format("{yyyy}-{MM}-{dd} {HH}:{mm}"));
				a.find(".j_content").text(d);
				TEAMS.currentUser && (TEAMS.currentUser.username && a.find(".j_pic").text(TEAMS.currentUser.username).removeClass("pic-anonymous"), TEAMS.currentUser.avatar && a.find("img").attr("src", "/base/download/" + TEAMS.currentUser.avatar.p3));
				$(".j_module-container .j_comment:first").after(a);
				$(".j_module-container .j_content").val("")
			})
		}), $(".j_module-container .j_morecontent").click(function() {
			$(this).addClass("hide");
			b.comment.pageNo++;
			var a = {
				formId: $("#formId").val(),
				pageSize: b.comment.pageSize,
				pageNo: b.comment.pageNo
			};
			b.comment.loadComment(a)
		}), $(".form-preview-wrapper .j_cloneForm").on("click.formpreview", function() {
			TEAMS.currentUser ? copyForm(TEAMS.currentUser.userId) : $("#login-dialog").modal("show");
			return !1
		}), $(".btn-login").on("click.formpreview", function() {
			$("#login-dialog").modal("show")
		}), $(".j_module-container .j_content").on("keyup.formpreview", function(a) {
			13 == (a ? a : window.event ? window.event : null).keyCode && $(".j_module-container .j_addcomment").trigger("click.formpreview")
		}));
		b.laodForm();
		var a = "click";
		"mobile" == window.systemInfo_form && (a = "tap");
		$(document).on(a, "#submit", function(a) {
			var b = $(this);
			0 != b.data("isSubmit") && (b.data("isSubmit", !1), l.saveFormData({
				parentEl: $("#widget-control"),
				dataStatus: 1,
				callback: function(a) {
					b.data("isSubmit", !0);
					a.actionMsg && l.notify(a.actionMsg.message);
					a.formData && (window.location.href = "/biaoge/previewFill/" + a.formData.id)
				}
			}))
		});
		$(document).on("click", "#temporary", function(a) {
			l.saveFormData({
				parentEl: $("#widget-control"),
				dataStatus: 0,
				callback: function(a) {
					a.formData && (window.location.href = "/biaoge/previewFill/" + a.formData.id)
				}
			})
		});
		$(document).on("click", "#readOnly", function(a) {
			l.setFormReadOnly({
				parentEl: $("#widget-control"),
				readOnly: !0
			})
		});
		$(document).on("click", "#notReadOnly", function(a) {
			l.setFormReadOnly({
				parentEl: $("#widget-control"),
				readOnly: !1
			})
		});
		$("#login-dialog .tab-list").on("click", "li", function() {
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			var a = $(this).find("a").attr("href");
			$("#login-dialog .tab-pane").removeClass("active");
			$("#login-dialog").find(a).addClass("active")
		})
	});
	return b
});