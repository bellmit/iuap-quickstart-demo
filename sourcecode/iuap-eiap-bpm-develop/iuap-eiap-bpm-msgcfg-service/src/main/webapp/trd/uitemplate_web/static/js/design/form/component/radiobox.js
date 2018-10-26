define("form/component/radiobox", ["form/component", "form/tplutil", "form/component/option"], function() {
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = require("form/component/option");
	window.RadioBox = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "RadioBox",
				title: "单选框",
				titleLayout: "",
				itemListener: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				layout: "choicelist-inline",
				optionsType: "RadioBox",
				borderColor:"",
				options: [],
				readOnly: !1,
				islist:true //是否列表显示
			};
			var c = new b;
			c.setName("选项1");
			c.setOrder(0);
			var d = new b;
			d.setName("选项2");
			d.setOrder(1);
			var e = new b;
			e.setName("选项3");
			e.setOrder(2);
			this.componentSetup.options[0] = c.componentSetup;
			this.componentSetup.options[1] = d.componentSetup;
			this.componentSetup.options[2] = e.componentSetup;
			null != a && (this.componentSetup.title = a.title,this.componentSetup.itemListener = a.itemListener,this.componentSetup.borderColor = a.borderColor, this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.layout = a.layout, this.componentSetup.options = a.options,this.componentSetup.islist = a.islist,this.componentSetup.readOnly = a.readOnly);
			this.tpl = l.get("radiobox")
		},
		setTitle: function(a) {
			this.componentSetup.title = a
		},
		setDescribe: function(a) {
			this.componentSetup.describe = a
		},
		setItemListener: function(a) {
			this.componentSetup.itemListener = a
		},
		setRequired: function(a) {
			this.componentSetup.required = a
		},
		setIsList: function(a) {
			this.componentSetup.islist = a
		},
		setSize: function(a) {
			this.componentSetup.size = a
		},
		setLayout: function(a) {
			this.componentSetup.layout = a
		},
		setOptions: function(a) {
			this.componentSetup.options = a
		},
		setTitleLayout: function(a) {
			this.componentSetup.titleLayout = a
		},
		setOptionsType: function(a) {
			this.componentSetup.optionsType = a
		},
		setBorderColor: function(a) {
			this.componentSetup.borderColor = a
		},
		setReadOnly: function(a) {
			this.componentSetup.readOnly = a
		},
		render: function(a) {
			var c = $(this.tpl).siblings("#form-radiobox");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			c.find("#component-listener").attr("value", this.componentSetup.itemListener);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			var d = c.find(".choicelist_js");
			d.addClass(this.componentSetup.layout);
			for (var e = 0; e < this.componentSetup.options.length; e++){
				var g = this.componentSetup.options[e]; 
				var optionTypeVal = this.componentSetup.optionsType + e;
				g.selectionId = optionTypeVal;
				(new b(g)).render(d, this);
			}
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.attr("tempId",this.componentSetup.fieldId);
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-radiobox");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("#component-listener").attr("value", this.componentSetup.itemListener);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly || a.find("#readOnly").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || a.find("#isList").attr("checked", "true");
			a.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			a.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", "true");
			for (var c = a.find("ul.choicelistEdit_js"), d = 0; d < this.componentSetup.options.length; d++) {
				var e = this.componentSetup.options[d];
				var optionTypeVal = this.componentSetup.optionsType + d;
				e.selectionId = optionTypeVal;
				(new b(e)).renderEditor(c, this);
				"true" != e.other && 1 != e.other || a.find(".btn-default_js").parent().hide();
				a.find("input:radio[name='editor-option']").eq(d).attr("value",optionTypeVal);
			}
			$("#editor-component").html(a.html())
		},
		change: function(a) {
			var currentObj = a.currentObj;
			var c = a.oldObj;
			a = a.changeEl;
			this.componentSetup.title = c.componentSetup.title;
			this.componentSetup.describe = c.componentSetup.describe;
			this.componentSetup.order = c.componentSetup.order;
			this.componentSetup.index = c.componentSetup.index;
			this.componentSetup.required = c.componentSetup.required;
			this.componentSetup.fieldId = c.componentSetup.fieldId;
			this.componentSetup.layout = null == c.componentSetup.layout || "" == c.componentSetup.layout ? "choicelist-inline" : c.componentSetup.layout;
			this.componentSetup.options = c.componentSetup.options;
			this.componentSetup.optionsType = currentObj.componentSetup.componentKey;
			this.componentSetup.borderColor = c.componentSetup.borderColor;
			this.componentSetup.readOnly = c.componentSetup.readOnly;
			this.componentSetup.itemListener = c.componentSetup.itemListener;
			var itemcodeDiv = $("#editor-component .itemcodeDiv");
			var comptypeDiv = $("#editor-component .j_comptypeDiv");
			c.componentSetup.itemCode && (this.componentSetup.itemCode = c.componentSetup.itemCode);
			c.componentSetup.itemId && (this.componentSetup.itemId = c.componentSetup.itemId);
			c.componentSetup.itemKey && (this.componentSetup.itemKey = c.componentSetup.itemKey);
			this.render(a);
			this.renderEditor();
			//增加控件类型和控件编码
			$("#editor-component .formeditcontent-titlelayout").after(comptypeDiv);
			$("#editor-component .formeditcontent-titlelayout").after(itemcodeDiv);
			a.addClass("field-active")
		},
		renderPreview: function(a, c, d) {
			var e = $(this.tpl).siblings("#preview-radiobox");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".form-control").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			e.attr("id", this.componentSetup.fieldId).attr("cid", this.cid);
			var f = e.find(".choicelist_js");
			f.addClass(this.componentSetup.layout);
			for (var g = 0; g < this.componentSetup.options.length; g++)(new b(this.componentSetup.options[g])).renderPreview(f, this);
			e.find(".check_js").attr("id", this.componentSetup.fieldId);
			e.find(".check_js").data("componentData", this);
			c && e.find(".check_js input:radio").attr("checked", !1);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, d);
			this.el = a;
			a.append(e);
			this.getValue(e)
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-radiobox");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.find(".form-control").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			c.attr("id", this.componentSetup.fieldId);
			var d = c.find(".choicelist_js");
			d.addClass(this.componentSetup.layout);
			for (var e = 0; e < this.componentSetup.options.length; e++)(new b(this.componentSetup.options[e])).render(d, this);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				c.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				c.find(".form-control").css("border-color",this.componentSetup.borderColor);
				c.find(".choicelist").css("color",this.componentSetup.borderColor);
				c.find(".field-description").css("color",this.componentSetup.borderColor);
			}
			c.data("componentData", this);
			c.addClass(this.componentSetup.titleLayout);
			a.append(c)
		},
		renderStatSearch: function(a) {
			var c = a.parentEl;
			$.ajax({
				type: "get",
				url: "/formdatastat/getFiledOptions.json",
				dataType: "json",
				data: {
					fieldId: a.fieldId
				},
				success: function(a) {
					html = '<select class="form-control sch-item j_fieldOption"><option value="eq">等于</option><option value="neq">不等于</option></select>';
					for (var b = '<select class="form-control j_resultList"><option>请选择</option>', f = 0; f < a.fieldOptions.length; f++)
					var g = a.fieldOptions[f],
						b = b + ("<option id=" + g.id + ">" + g.name + "</option>");
					html += b + '</select><div class="j_selected entity-container sch-item"></div><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a>';
					c.attr("class", "sch-group j_formFieldSearchGroup");
					c.find(".j_formField-condition").html(html)
				}
			})
		},
		submitCheck: function(a, c) {
			var b = this.check(a);
			c(b)
		},
		checkEvents: function(a) {
			var c = this,
				b = c.el || $(document);
			b.on("change", "input:radio[name='" + c.componentSetup.fieldId + this.cid + "']", function() {
				var b = $(this).parents(".check_js"),
					d = $(this).data("componentData");
				"true" == d.componentSetup.other || 1 == d.componentSetup.other ? b.find("input:text").attr("disabled", !1).show() : b.find("input:text").attr("disabled", !0).hide();
				b = c.check(b);
				a(b);
				null == b.message && c.saveComponentValue($(this))
			});
			b.on("change", "#" + c.componentSetup.fieldId + "[cid='" + this.cid + "'] input:text", function() {
				var a = $(this).val();
				null != a && "" != $.trim(a) && c.saveComponentValue($(this))
			})
		},
		check: function(a) {
			var c = a.find("input:radio[name='" + this.componentSetup.fieldId + this.cid + "']:checked").val(),
				b = {};
			b.element = a;
			"" != c && null != c || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (b.message = this.componentSetup.title + "不能为空");
			return b
		},
		getValue: function(a) {
			var c = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			},
				b = a.find("input:radio[name='" + this.componentSetup.fieldId + this.cid + "']:checked"),
				e = b.val();
			if (null == b.get(0)) return null;
			var b = b.data("componentData"),
				f = "";
			"true" == b.componentSetup.other || 1 == b.componentSetup.other ? (f = a.find("input:text").val(), 0 == f.length && (f = "其他")) : f = b.componentSetup.name;
			c.dataOptions = [{
				optionId: e,
				content: f
			}];
			this.oldValue = f;
			return null == e || "" == $.trim(e) ? null : c
		},
		setValue: function(a, c) {
			if (null != c && null != c.dataOptions) {
				for (var b = 0; b < c.dataOptions.length; b++) {
					var e = c.dataOptions[b],
						f = e.content,
						e = a.find("input:radio[name='" + this.componentSetup.fieldId + this.cid + "'][value='" + e.optionId + "']");
					e.get(0).checked = !0;
					a.find(".j_readOnly").html(f);
					e = e.data("componentData").componentSetup.other;
					if ("true" == e || 1 == e) a.find("input:text").val(f), a.find("input:text").show()
				}
				this.oldValue = a.find(".j_readOnly").text()
			}
		},
		empty: function(a) {},
		readOnly: function(a, c) {
			a.find("input:radio[name='" + this.componentSetup.fieldId + this.cid + "']").attr("disabled", c);
			c ? (a.find(".check_js").addClass("hide"), a.find(".j_readOnly").removeClass("hide")) : (a.find(".check_js").removeClass("hide"), a.find(".j_readOnly").addClass("hide"))
		}
	});
	return window.RadioBox
});
