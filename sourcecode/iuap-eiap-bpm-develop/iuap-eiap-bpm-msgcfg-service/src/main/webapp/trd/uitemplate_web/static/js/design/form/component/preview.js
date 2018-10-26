define("form/component/preview", function() {
	return Backbone.View.extend({
		initialize: function(h) {
			this.afterJqObj = h.afterJqObj;
			this.container = h.container;
			this.previewType = h.previewType || "";
			this.rel = h.rel || "0";
			this.maxSize = TEAMS.currentTenant ? h.maxSize || ("normal" == TEAMS.currentTenant.status ? 10 : 5) : 5;
			h.fileObj ? (h = h.fileObj, this.isImage = h.image, this.docFileType = h.docType, this.docFileId = h.id, this.fileSize = h.size, this.title = h.name || "预览") : h.document && (h = h.document, this.isImage = h.docFile.image, this.docFileType = h.docFile.docType, this.docFileId = h.docFile.id, this.fileSize = h.docFile.size)
		},
		initEvents: function() {},
		render: function() {
			var h = this.container,
				b = this.afterJqObj;
			this.isImage ? (b.after("<a id='document-preview-" + this.docFileId + "' rel='" + this.rel + "' title='" + this.title + "' class='document-preview-btn btn btn-xs btn-info' href=''>预览</a>"), "remote" == this.previewType ? h.find("#document-preview-" + this.docFileId).addClass("fancybox").attr("type", "image").attr("href", crmContext.remoteDownloadUrl + "/remotedownload/" + this.docFileId + "/ETEAMSID/true?type=remote") : h.find("#document-preview-" + this.docFileId).addClass("fancybox").attr("type", "image").attr("href", "/base/download/" + this.docFileId + "?type=" + this.previewType + "&timestamp=" + Date.parse(new Date)), h.find(".fancybox").fancybox({
				closeBtn: !0,
				afterLoad: function() {
					this.title = "Image " + (this.index + 1) + " of " + this.group.length + (this.title ? " - " + this.title : "")
				}
			})) : "office" == this.docFileType || "pdf" == this.docFileType ? (b.after("<a id='document-preview-" + this.docFileId + "'  data-value='" + this.docFileId + "'  title='预览' class='document-preview-btn btn btn-xs btn-info' href=''>预览</a>"), "version" == this.previewType ? h.find("#document-preview-" + this.docFileId).attr({
				href: "/wopi/files/preview?id=" + this.docFileId + "&type=" + this.previewType,
				target: "_blank"
			}) : "remote" == this.previewType ? h.find("#document-preview-" + this.docFileId).attr({
				href: "/remote/previewremote/allView?id=" + this.docFileId,
				target: "_blank"
			}) : h.find("#document-preview-" + this.docFileId).attr({
				href: "/wopi/files/preview?id=" + this.docFileId,
				target: "_blank"
			}), this.fileSize > 1048576 * this.maxSize && h.find("#document-preview-" + this.docFileId).attr("disabled", "true").css({
				"background-color": "#ccc",
				"border-color": "#ccc"
			}).after("<a data-value='" + this.docFileId + "'  style='color:#ccc;size:10px;text-decoration : none;cursor:default;margin-left:5px;'>超过预览最大限制" + this.maxSize + "M</a>")) : "text" == this.docFileType && (b.after("<a id='document-preview-" + this.docFileId + "'  data-value='" + this.docFileId + "'  title='预览' class='document-preview-btn btn btn-xs btn-info' href=''>预览</a>"), "remote" == this.previewType ? h.find("#document-preview-" + this.docFileId).attr({
				href: "/remote/previewremote/allView?id=" + this.docFileId,
				target: "_blank"
			}) : h.find("#document-preview-" + this.docFileId).attr({
				href: "/wopi/files/preview/txtView?id=" + this.docFileId + "&type=" + this.previewType,
				target: "_blank"
			}))
		},
		remove: function() {}
	});
});
