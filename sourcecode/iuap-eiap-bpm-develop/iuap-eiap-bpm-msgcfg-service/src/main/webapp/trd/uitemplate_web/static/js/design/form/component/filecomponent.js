define("form/component/filecomponent", ["form/component", "form/component/preview", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/component/preview"),
		b = require("form/tplutil");
	window.FileComponent = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "FileComponent",
				title: "附件",
				titleLayout: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				isSingle: !1,
				borderColor:"",
				fieldId: b.getFieldId()
			};
			null != a && (this.componentSetup.title = a.title, this.componentSetup.borderColor = a.borderColor,this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.isSingle = a.isSingle, this.componentSetup.fieldId = a.fieldId, this.formId = a.formId);
			this.tpl = b.get("file")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setSingle: function(a) {
			this.componentSetup.isSingle = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-file");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.attr("tempId",b.getFieldId());
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-file");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || a.find("#isSingle").attr("checked", "true");
			a.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			a.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(a.html())
		},
		renderPreview: function(a, c, b) {
			c = $(this.tpl);
			var e = null,
				e = null == TEAMS.currentUser ? c.siblings("#nouser-preview") : "mobile" != window.systemInfo_form ? c.siblings("#preview-file") : c.siblings("#mobile-preview");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".check_js").attr("id", this.componentSetup.fieldId + this.cid);
			e.find(".check_js").prev().attr("id", "fileInput" + this.componentSetup.fieldId + this.cid);
			e.find(".check_js").attr("cid", this.cid);
			e.attr("id", "field_" + this.componentSetup.fieldId);
			e.find(".check_js").data("componentData", this);
			e.addClass(this.componentSetup.titleLayout);
			e.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			this.el = a;
			a.append(e);
			if ("true" == b || 1 == b || b) e.find("#fileInput" + this.componentSetup.fieldId + this.cid).remove(), "mobile" == window.systemInfo_form && e.find("#" + this.componentSetup.fieldId + this.cid).attr("readOnly", "readOnly"), this.isReadOnly = b;
			this.initFancyBox($("#" + this.componentSetup.fieldId + this.cid))
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-file");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.attr("id", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				c.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				c.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		submitCheck: function(a, c) {
			var b = this.check(a);
			c(b)
		},
		checkEvents: function(a) {
			var c = this,
				b = c.el || $(document),
				e = c.componentSetup.fieldId + this.cid;
			c.isReadOnly && "false" != c.isReadOnly && 0 != c.isReadOnly || "mobile" == window.systemInfo_form || c.initUploader(a);
			b.on("click", "#" + e + " .j_deleteFile", function() {
				var b = $(this).parents("#" + e);
				$(this).parents(".check_js").prev().show();
				c.deleteFile($(this));
				b = c.check(b);
				null == b.message ? c.saveComponentValue($(this)) : a(b)
			});
			"mobile" == window.systemInfo_form && ($("#fileInput" + c.componentSetup.fieldId + c.cid).on("input change propertychange paste", function(a) {
				var b = $(this),
					d = 1 == c.componentSetup.isSingle || "true" == c.componentSetup.isSingle,
					e = $(this).find("#formFileToUpload").get(0).files[0];
				e && (a = 0, a = 1048576 < e.size ? (Math.round(100 * e.size / 1048576) / 100).toString() + "MB" : (Math.round(100 * e.size / 1024) / 100).toString() + "KB", e.size = a, a = $('<div class="info-subitem  attachment"><a id="' + e.id + '">' + e.name + '<i class="ml-3 c-grey"></i></a></div>'), $(this).next().append(a));
				a = new FormData;
				a.append("data", $(this).find("#formFileToUpload").get(0).files[0]);
				var q = new XMLHttpRequest;
				q.upload.addEventListener("progress", function(a) {
					a.lengthComputable && (a = Math.round(100 * a.loaded / a.total), $("#" + c.componentSetup.fieldId + c.cid + " i").html(a.toString() + "%"))
				}, !1);
				q.addEventListener("load", function(a) {
					a = jQuery.parseJSON(a.target.responseText).fileObj;
					var c = a.id,
						f = a.name,
						q = plupload.formatSize(e.size),
						h = "",
						h = "true" == a.image || 1 == a.image ? '<div id="' + c + '" fileid="' + c + '" class="file-item"><a class="j_fileView" data-value="' + c + '"  type="image">' + f + " (" + q + ")</span></a>" : '<div id="' + c + '" fileid="' + c + '" class="file-item"><a class="j_fileView" data-value="' + c + '"  type="file">' + f + " (" + q + ")</span></a>";
					d && b.hide();
					formPlugin.notify("文件上传成功");
					$("#" + e.id).parent().replaceWith(h)
				}, !1);
				q.addEventListener("error", function(a) {
					formPlugin.notify("文件上传失败")
				}, !1);
				q.open("POST", "/base/upload.json?module=form");
				q.send(a)
			}), $("#" + c.componentSetup.fieldId + c.cid).on("tap", ".j_fileView", function(a) {
				var b = $(c.tpl),
					d = $(this).parents(".j_page-view"),
					e = $(this).parent().attr("fileid");
				a = $(this).attr("type");
				var q = $(this).parents(".check_js").attr("readonly"),
					b = b.siblings("#form-moblefileView");
				q && b.find("#formFileDelete").remove();
				"image" == a ? b.find(".j_filePreview").attr("id", e).html('<img src="/base/download/' + e + '">') : b.find(".j_filePreview").html("该文件暂不支持预览");
				$("body").append(b);
				$(".j_fileViewBack").on("click", function() {
					$(this).parents(".j_page-view").remove();
					d.removeClass("hide")
				});
				$("#formFileDelete").on("tap", function(a) {
					var c = $(this),
						b = $('div[fileid="' + e + '"]');
					formPlugin.confirm("确定要删除吗？", function(a) {
						a && (b.parent().prev().show(), b.remove(), c.parents(".j_page-view").remove(), d.removeClass("hide"), formPlugin.notify("数据已删除"))
					})
				});
				d.addClass("hide")
			}))
		},
		check: function(a) {
			var c = $(a).find(".file-item"),
				b = c.length,
				e = {};
			e.element = a;
			0 != b || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (e.message = this.componentSetup.title + "不能为空");
			c.each(function(a) {
				$(this).attr("id") || (e.message = "文件尚未上传至服务器，请耐心等待")
			});
			return e
		},
		getValue: function(a) {
			var c = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			};
			a = a.find(".file-item");
			if (0 < a.length) {
				var b = [],
					e = "";
				a.each(function(a) {
					var c = $(this).find("a").eq(0).attr("data-value"),
						k = $(this).find("a").eq(0).text(),
						p = $(this).find("a").eq(0).attr("type");
					e += k + ",";
					b[a] = {
						optionId: c,
						content: k,
						type: p
					}
				});
				c.dataOptions = b;
				0 != b.length && (this.oldValue = e.substring(0, e.length - 1))
			} else this.oldValue && 0 < this.oldValue.length ? this.oldValue = null : c = null;
			return c
		},
		setValue: function(a, c) {
			if (null != c && null != c.dataOptions) {
				for (var b = "", e = 0; e < c.dataOptions.length; e++) {
					var f = c.dataOptions[e],
						g = null == f.content ? "" : f.content,
						k = f.optionId,
						p = f.type,
						q = null,
						b = b + (g + ","),
						h = crmContext.remoteDownloadUrl + "/remotedownload/" + k + "/" + ETEAMSID + "/true" + (TEAMS.currentUser ? "" : "?type=remote");
					"mobile" != window.systemInfo_form ? (q = $('<div class="file-item" id="' + k + '"><a type="' + p + '" class="fancybox-button" href="' + h + '" data-value="' + k + '" rel="fancybox-button">' + g + "</a>"), "image" != p && (q = $('<div class="file-item" id="' + k + '"><a type="' + p + '" href="' + h + '" data-value="' + k + '">' + g + "</a></div>")), null != a.find(".file-input").get(0) && q.append('<a class="close j_deleteFile" title="删除">&times;</a>')) : (q = $('<div fileid="' + k + '" id="' + this.componentSetup.fieldId + '" class="file-item"><a class="j_fileView" data-value="' + k + '"  type="image">' + g + "</span></a>"), "image" != p && q.attr("type", "file"));
					a.find(".check_js").append(q);
					(f = f.optionObj) && (new l({
						container: $("body"),
						afterJqObj: $("#" + f.id).children(":first"),
						fileObj: f,
						previewType: "remote"
					})).render()
				}
				"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || null == $("#" + this.componentSetup.fieldId + this.cid + " .file-item").get(0) || $("#fileInput" + this.componentSetup.fieldId + this.cid).hide();
				this.oldValue = "";
				0 != c.dataOptions.length && (this.oldValue = b.substring(0, b.length - 1))
			}
		},
		empty: function(a) {
			a.find(".file-item").remove()
		},
		readOnly: function(a, c) {
			var b = a.find("#fileInput" + this.componentSetup.fieldId + this.cid),
				e = a.find("#" + this.componentSetup.fieldId + this.cid);
			c && (b.remove(), e.find(".file-item .j_deleteFile").remove())
		},
		initUploader: function(a) {
			if (null != TEAMS.currentUser) {
				var c = this,
					b = "#fileInput" + this.componentSetup.fieldId + this.cid,
					e = "#" + this.componentSetup.fieldId + this.cid,
					f = 1 == c.componentSetup.isSingle || "true" == c.componentSetup.isSingle,
					g = this.uploader = new plupload.Uploader({
						runtimes: "html5,flash",
						file_data_name: "data",
						browse_button: b,
						container: $(e).parents("#field_" + this.componentSetup.fieldId),
						max_file_size: "50M",
						url: "/remote/uploadremote.json?module=form&refId=" + c.formId,
						flash_swf_url: "/static/swf/plupload.swf"
					});
				g.init();
				g.bind("FilesAdded", function(a, c) {
					f && (1 < c.length || null != $(e).find(".file-item").get(0)) ? ($.each(c, function(c, b) {
						a.removeFile(b)
					}), formPlugin.notify("此控件仅能上传一个文件附件", "文件数过多", "error")) : ($.each(c, function(a, c) {
						var b = c.id,
							d = c.name,
							f = plupload.formatSize(c.size);
						$(e).append('<div class="file-item"><a id=' + b + ">" + d + " " + f + '<i class="ml-3 c-grey"></i></a><a class="close j_deleteFile" title="删除">&times;</a></div>')
					}), a.refresh(), a.start())
				});
				g.bind("UploadProgress", function(a, c) {
					$("#" + c.id + " i").html(c.percent + "%")
				});
				g.bind("Error", function(a, c) {
					-600 == c.code && formPlugin.notify("只能上传最大不超过50M的文件", "文件大小超过限制", "error");
					a.refresh()
				});
				g.bind("FileUploaded", function(a, b, d) {
					a = jQuery.parseJSON(d.response).fileObj;
					d = a.id;
					var f = a.name,
						g = "",
						g = crmContext.remoteDownloadUrl + "/remotedownload/" + d + "/" + ETEAMSID + "/true" + (TEAMS.currentUser ? "" : "?type=remote"),
						g = a.image ? '<div id="' + d + '" class="file-item"><a data-value="' + d + '" href="' + g + '" class="fancybox-button" type="image" rel="fancybox-button">' + f + '</a><a class="close j_deleteFile" title="删除">&times;</a></div>' : '<div id="' + d + '" class="file-item"><a data-value="' + d + '" href="' + g + '" type="file">' + f + '</a><a class="close j_deleteFile" title="删除">&times;</a></div>';
					formPlugin.notify("文件上传成功");
					$("#" + b.id).parent().replaceWith(g);
					c.initFancyBox($(e));
					(new l({
						container: $("body"),
						afterJqObj: $("#" + a.id).children(":first"),
						fileObj: a,
						previewType: "remote"
					})).render()
				});
				g.bind("UploadComplete", function(g, p) {
					f && $(b).hide();
					c.saveComponentValue($(e));
					var h = c.check($(e));
					a(h)
				})
			}
		},
		deleteFile: function(a) {
			a = a.parent();
			"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || a.parent().prev().removeClass("hide");
			a.remove()
		},
		initFancyBox: function(a) {
			a.find(".fancybox-button").fancybox({
				nextEffect: "fade",
				prevEffect: "fade",
				closeBtn: !0,
				afterLoad: function() {
					this.title = "Image " + (this.index + 1) + " of " + this.group.length + (this.title ? " - " + this.title : "")
				}
			})
		}
	});
	return window.FileComponent
});
