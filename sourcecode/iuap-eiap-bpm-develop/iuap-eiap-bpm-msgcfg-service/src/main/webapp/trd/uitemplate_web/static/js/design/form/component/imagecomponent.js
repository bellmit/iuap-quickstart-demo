define("form/component/imagecomponent", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.ImageComponent = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "ImageComponent",
				title: "图片",
				titleLayout: "",
				itemListener: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				isSingle: !1,
				borderColor:"",
				fieldId: l.getFieldId()
			};
			null != b && (this.componentSetup.title = b.title, this.componentSetup.itemListener = b.itemListener,this.componentSetup.borderColor = b.borderColor,this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.isSingle = b.isSingle, this.componentSetup.fieldId = b.fieldId);
			this.tpl = l.get("image")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setItemListener: function(b) {
			this.componentSetup.itemListener = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSingle: function(b) {
			this.componentSetup.isSingle = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		setBorderColor: function(b) {
			this.componentSetup.borderColor = b
		},
		render: function(b) {
			var a = $(this.tpl).siblings("#form-image");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			b.attr("class", a.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.attr("tempId",this.componentSetup.fieldId);
			b.html(a.html())
		},
		renderEditor: function() {
			var b = $(this.tpl).siblings("#editor-image");
			b.find("#component-title").attr("value", this.componentSetup.title);
			b.find("#component-listener").attr("value", this.componentSetup.itemListener);
			b.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			b.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || b.find("#required").attr("checked", "true");
			"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || b.find("#isSingle").attr("checked", "true");
			b.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			b.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			$("#editor-component").html(b.html())
		},
		renderPreview: function(b, a, c) {
			a = $(this.tpl);
			var d = null,
				d = null == TEAMS.currentUser ? a.siblings("#nouser-preview") : "mobile" != window.systemInfo_form ? a.siblings("#preview-image") : a.siblings("#mobile-preview");
			d.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || d.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (d.find(".field-description").text(this.componentSetup.describe), d.find(".field-description").show());
			d.find(".check_js").attr("id", this.componentSetup.fieldId + this.cid);
			d.find(".check_js").prev().attr("id", "imageAdd" + this.componentSetup.fieldId + this.cid);
			d.find(".check_js").attr("cid", this.cid);
			d.attr("id", "field_" + this.componentSetup.fieldId);
			d.find(".check_js").data("componentData", this);
			d.addClass(this.componentSetup.titleLayout);
			d.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			this.el = b;
			b.append(d);
			if ("true" == c || 1 == c || c) d.find("#imageAdd" + this.componentSetup.fieldId + this.cid).remove(), this.isReadOnly = c, "mobile" == window.systemInfo_form && d.find("#" + this.componentSetup.fieldId + this.cid).attr("readOnly", "readOnly");
			this.initFancyBox($("#" + this.componentSetup.fieldId + this.cid))
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl).siblings("#form-image");
			a.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (a.find(".field-description").text(this.componentSetup.describe), a.find(".field-description").show());
			a.attr("id", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				//a.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				a.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			a.data("componentData", this);
			a.addClass(this.componentSetup.titleLayout);
			b.append(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = a.el || $(document),
				d = a.componentSetup.fieldId + this.cid;
			a.isReadOnly && "false" != a.isReadOnly && 0 != a.isReadOnly || "mobile" == window.systemInfo_form || a.initUploader(b);
			c.on("click", "#" + d + " .j_deleteImage", function() {
				var c = $(this).parents("#" + d);
				$(this).parents(".check_js").prev().find(".j_imageAdd").show();
				a.deleteImage($(this), b);
				c = a.check(c);
				null == c.message ? a.saveComponentValue($(this)) : b(c)
			});
			"mobile" == window.systemInfo_form && ($("#imageAdd" + a.componentSetup.fieldId + a.cid).on("input change propertychange paste", function(b) {
				var c = $(this),
					d = 1 == a.componentSetup.isSingle || "true" == a.componentSetup.isSingle;
				if (b = $(this).find("#formFileToUpload").get(0).files[0]) {
					var k = 0,
						k = 1048576 < b.size ? (Math.round(100 * b.size / 1048576) / 100).toString() + "MB" : (Math.round(100 * b.size / 1024) / 100).toString() + "KB";
					b.size = k;
					b = $('<div class="info-subitem attachment"><a id="' + b.id + '">' + b.name + '<i class="ml-3 c-grey"></i></a></div>');
					$(this).next().append(b)
				}
				b = new FormData;
				b.append("data", $(this).find("#formFileToUpload").get(0).files[0]);
				k = new XMLHttpRequest;
				k.upload.addEventListener("progress", function(b) {
					b.lengthComputable && (b = Math.round(100 * b.loaded / b.total), $("#" + a.componentSetup.fieldId + a.cid + " i").html(b.toString() + "%"))
				}, !1);
				k.addEventListener("load", function(b) {
					var e = jQuery.parseJSON(b.target.responseText),
						k = e.fileObj;
					b = k.name;
					"true" == k.image || 1 == k.image ? (e = e.imageFile.id, e = $('<div id="' + e + '" imageid="' + e + '" class="img-item j_imageItem"><img src="/base/download/img/' + e + '/small" class="j_imageView"></div>'), e.data("name", b), $("#" + a.componentSetup.fieldId + a.cid).append(e), d && c.hide(), formPlugin.notify("文件上传成功")) : formPlugin.notify("文件格式不正确");
					$("#" + a.componentSetup.fieldId + a.cid).find(".info-subitem").remove()
				}, !1);
				k.addEventListener("error", function(a) {
					formPlugin.notify("文件上传失败")
				}, !1);
				k.open("POST", "/formdata/uploadImage.json?module=form");
				k.send(b)
			}), $("#" + a.componentSetup.fieldId + a.cid).on("tap", ".j_imageView", function(b) {
				var c = $(a.tpl),
					d = $(this).parents(".j_page-view"),
					k = $(this).parent().attr("imageid");
				b = $(this).parents(".check_js").attr("readonly");
				c = c.siblings("#form-mobleImageView");
				b && c.find("#formImageDelete").remove();
				c.find(".j_imagePreview").attr("id", k).html('<img src="/base/download/img/' + k + '/image">');
				$("body").append(c);
				$(".j_imageViewBack").on("click", function() {
					$(this).parents(".j_page-view").remove();
					d.removeClass("hide")
				});
				$("#formImageDelete").on("tap", function(a) {
					var b = $(this),
						c = $('div[imageid="' + k + '"]');
					formPlugin.confirm("确定要删除吗？", function(a) {
						a && (c.parent().prev().show(), c.remove(), b.parents(".j_page-view").remove(), d.removeClass("hide"), formPlugin.notify("数据已删除"))
					})
				});
				d.addClass("hide")
			}))
		},
		check: function(b) {
			var a = $(b).find(".j_imageItem"),
				c = a.length,
				d = {};
			d.element = b;
			0 != c || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			a.each(function(a) {
				$(this).attr("id") || (d.message = "图片尚未上传至服务器，请耐心等待")
			});
			return d
		},
		getValue: function(b) {
			var a = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			};
			b = b.find(".j_imageItem");
			if (0 < b.length) {
				var c = [],
					d = "";
				b.each(function(a) {
					var b = $(this).attr("imageid"),
						g = $(this).data("name");
					d += g + ",";
					c[a] = {
						optionId: b,
						content: g,
						type: "imageFile"
					}
				});
				a.dataOptions = c;
				0 != c.length && (this.oldValue = d.substring(0, d.length - 1))
			} else a = null;
			return a
		},
		setValue: function(b, a) {
			if (null != a && null != a.dataOptions) {
				for (var c = "", d = 0; d < a.dataOptions.length; d++) {
					var e = a.dataOptions[d],
						f = null == e.content ? "" : e.content,
						e = e.optionId,
						g = null,
						c = c + (f + ",");
					"mobile" != window.systemInfo_form ? (g = $('<div id="' + e + '" imageid="' + e + '" class="img-item j_imageItem"><div class="img-box"><a class="fancybox-button" rel="fancybox-button" type="image" href="/base/download/img/' + e + '/image"><img src="/base/download/img/' + e + '/small"></div><div class="img-opt"><a><i class="icon-minus-sign j_deleteImage"></i></a></div></div>'), g.data("name", f), null == b.find(".j_imageAdd").get(0) && g.find(".j_deleteImage").parent().remove()) : g = $('<div imageid="' + e + '" id="' + this.componentSetup.fieldId + '" class="img-item j_imageItem"><img src="/base/download/img/' + e + '/small" class="j_imageView"></div>');
					b.find(".check_js").append(g)
				}
				"true" != this.componentSetup.isSingle && 1 != this.componentSetup.isSingle || null == $("#" + this.componentSetup.fieldId + this.cid + " .j_imageItem").get(0) || $("#imageAdd" + this.componentSetup.fieldId + this.cid).find(".j_imageAdd").hide();
				this.oldValue = "";
				0 != a.dataOptions.length && (this.oldValue = c.substring(0, c.length - 1))
			}
		},
		empty: function(b) {
			b.find(".j_imageItem").remove()
		},
		readOnly: function(b, a) {
			var c = b.find("#imageAdd" + this.componentSetup.fieldId + this.cid),
				d = b.find("#" + this.componentSetup.fieldId + this.cid);
			a && (c.remove(), d.find(".j_imageItem .j_deleteImage").parent().html(""))
		},
		initUploader: function(b) {
			if (null != TEAMS.currentUser) {
				var a = this,
					c = "#imageAdd" + this.componentSetup.fieldId + this.cid + " .j_imageAdd",
					d = "#" + this.componentSetup.fieldId + this.cid,
					e = 1 == a.componentSetup.isSingle || "true" == a.componentSetup.isSingle,
					f = this.uploader = new plupload.Uploader({
						runtimes: "html5,flash",
						file_data_name: "data",
						browse_button: c,
						container: $(d).parents("#field_" + this.componentSetup.fieldId),
						max_file_size: "50M",
						url: "/formdata/uploadImage.json?module=form",
						flash_swf_url: "/static/swf/plupload.swf"
					});
				f.init();
				f.bind("FilesAdded", function(a, b) {
					e && (1 < b.length || null != $(d).find(".j_imageItem").get(0)) ? ($.each(b, function(b, c) {
						a.removeFile(c)
					}), formPlugin.notify("此控件仅能上传一张图片", "图片数过多", "error")) : ($.each(b, function(a, b) {
						plupload.formatSize(b.size)
					}), a.refresh(), a.start())
				});
				f.bind("UploadProgress", function(a, b) {
					$("#" + b.id + " i").html(b.percent + "%")
				});
				f.bind("Error", function(a, b) {
					-600 == b.code && formPlugin.notify("只能上传最大不超过50M的文件", "文件大小超过限制", "error");
					a.refresh()
				});
				f.bind("FileUploaded", function(g, k, p) {
					k = jQuery.parseJSON(p.response);
					p = k.fileObj;
					g = p.name;
					p = p.image;
					"true" == p || 1 == p ? (k = k.imageFile.id, k = $('<div id="' + k + '" imageid="' + k + '" class="img-item j_imageItem"><div class="img-box"><a class="fancybox-button" rel="fancybox-button" type="image" href="/base/download/img/' + k + '/image"><img src="/base/download/img/' + k + '/small"></div><div class="img-opt"><a><i class="icon-minus-sign j_deleteImage"></i><a></div></div>'), k.data("name", g), $(d).append(k), a.saveComponentValue($(d)), g = a.check($(d)), b(g), e && ($(c).hide(), f.destroy()), formPlugin.notify("图片上传成功"), a.initFancyBox($(d))) : formPlugin.notify("请上传图片文件", "文件格式不正确", "error")
				})
			}
		},
		deleteImage: function(b, a) {
			var c = b.parents(".j_imageItem");
			if ("true" == this.componentSetup.isSingle || 1 == this.componentSetup.isSingle) c.parent().prev().find(".j_imageAdd").show(), this.initUploader(a);
			c.remove()
		},
		initFancyBox: function(b) {
			b.find(".fancybox-button").fancybox({
				nextEffect: "fade",
				prevEffect: "fade",
				closeBtn: !0,
				afterLoad: function() {
					this.title = "Image " + (this.index + 1) + " of " + this.group.length + (this.title ? " - " + this.title : "")
				}
			})
		}
	});
	return window.ImageComponent
});
