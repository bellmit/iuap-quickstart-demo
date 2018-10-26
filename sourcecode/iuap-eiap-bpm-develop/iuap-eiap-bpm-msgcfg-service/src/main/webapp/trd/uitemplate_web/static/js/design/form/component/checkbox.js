define("form/component/checkbox", ["form/component", "form/tplutil", "form/component/option"], function() {
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = require("form/component/option");
	window.CheckBox = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "CheckBox",
				title: "复选框",
				titleLayout: "",
				itemListener: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				layout: "choicelist-inline",
				optionsType: "CheckBox",
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
			null != a && (this.componentSetup.title = a.title, this.componentSetup.itemListener = a.itemListener,this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.layout = a.layout,this.componentSetup.borderColor = a.borderColor, this.componentSetup.options = a.options,this.componentSetup.islist = a.islist,this.componentSetup.readOnly = a.readOnly);
			this.tpl = l.get("checkbox")
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
		setItemListener: function(b) {
			this.componentSetup.itemListener = b
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
			var c = $(this.tpl).siblings("#form-checkbox");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			var d = c.find(".choicelist_js");
			d.addClass(this.componentSetup.layout);
			for (var e = 0; e < this.componentSetup.options.length; e++){
				var g = this.componentSetup.options[e]; 
				if(typeof g.componentKey =="undefined"){
					g.name = g.checkboxVal;
					//g.selectionId = g.checkboxKey;
				}
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
			var a = $(this.tpl).siblings("#editor-checkbox");
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
				if(typeof e.componentKey =="undefined"){
					e.name = e.checkboxVal;
					//e.selectionId = e.checkboxKey;
					var flag = e.checkboxKey;
					e.defOption = e.checkboxKey;
					$("#widget-control .field-active .choicelist_js .CheckBox_js").find("input:checkbox[value='"+optionTypeVal+"']").eq(d).attr("checked",flag);
					flag=="false" && $("#widget-control .field-active .choicelist_js .CheckBox_js").find("input:checkbox[value='"+optionTypeVal+"']").eq(d).removeAttr("checked");
				}
				e.selectionId = optionTypeVal;
				(new b(e)).renderEditor(c, this);
				"true" != e.other && 1 != e.other || a.find(".btn-default_js").parent().hide();
				a.find("input:checkbox[name='editor-option']").eq(d).attr("value",optionTypeVal);
				a.find("input:checkbox[name='editor-option']").eq(d).attr("checked",e.defOption);
				(flag=="false" || e.defOption=="false") && a.find("input:checkbox[name='editor-option']").eq(d).removeAttr("checked");
			}
			$("#editor-component").html(a.html())
		},
		change: function(a) {
			var currentObj = a.currentObj;
			var b = a.oldObj;
			a = a.changeEl;
			this.componentSetup.title = b.componentSetup.title;
			this.componentSetup.describe = b.componentSetup.describe;
			this.componentSetup.order = b.componentSetup.order;
			this.componentSetup.index = b.componentSetup.index;
			this.componentSetup.required = b.componentSetup.required;
			this.componentSetup.fieldId = b.componentSetup.fieldId;
			this.componentSetup.layout = null == b.componentSetup.layout || "" == b.componentSetup.layout ? "choicelist-inline" : b.componentSetup.layout;
			this.componentSetup.options = b.componentSetup.options;
			this.componentSetup.optionsType = currentObj.componentSetup.componentKey;
			this.componentSetup.borderColor = b.componentSetup.borderColor;
			this.componentSetup.readOnly = b.componentSetup.readOnly;
			this.componentSetup.itemListener = b.componentSetup.itemListener;
			var itemcodeDiv = $("#editor-component .itemcodeDiv");
			var comptypeDiv = $("#editor-component .j_comptypeDiv");
			b.componentSetup.itemCode && (this.componentSetup.itemCode = b.componentSetup.itemCode);
			b.componentSetup.itemId && (this.componentSetup.itemId = b.componentSetup.itemId);
			b.componentSetup.itemKey && (this.componentSetup.itemKey = b.componentSetup.itemKey);
			this.render(a);
			this.renderEditor();
			//增加控件类型和控件编码
			$("#editor-component .formeditcontent-titlelayout").after(comptypeDiv);
			$("#editor-component .formeditcontent-titlelayout").after(itemcodeDiv);
			a.addClass("field-active")
		},
		renderPreview: function(a, c, d) {
			var e = $(this.tpl).siblings("#preview-checkbox");
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
			d && e.find(".check_js input").attr("disabled", !0);
			c && e.find(".check_js input:checkbox").attr("checked", !1);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, d);
			this.el = a;
			a.append(e);
			this.getValue(e)
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-checkbox");
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
			var b = a.parentEl;
			$.ajax({
				type: "get",
				url: "/formdatastat/getFiledOptions.json",
				dataType: "json",
				data: {
					fieldId: a.fieldId
				},
				success: function(a) {
					html = '<select class="form-control sch-item j_fieldOption"><option value="eq">等于</option><option value="neq">不等于</option></select>';
					for (var e = '<select class="form-control j_resultList"><option>请选择</option>', f = 0; f < a.fieldOptions.length; f++)
					var g = a.fieldOptions[f],
						e = e + ("<option id=" + g.id + ">" + g.name + "</option>");
					html += e + '</select><div class="j_selected entity-container sch-item"></div><a class="j_deletesearch dele" title="删除此搜索项"><i class="icon-remove"></i></a>';
					b.attr("class", "sch-group j_formFieldSearchGroup");
					b.find(".j_formField-condition").html(html)
				}
			})
		},
		submitCheck: function(a, b) {
			var d = this.check(a);
			b(d)
		},
		checkEvents: function(a) {
			var b = this,
				d = b.el || $(document);
			d.on("change", "input:checkbox[name='" + b.componentSetup.fieldId + this.cid + "']", function() {
				var d = $(this).parents(".check_js"),
					f = $(this).data("componentData");
				if ("true" == f.componentSetup.other || 1 == f.componentSetup.other) $(this).is(":checked") ? d.find("input:text").attr("disabled", !1).show() : d.find("input:text").attr("disabled", !0).hide();
				d = b.check(d);
				a(d);
				null == d.message && b.saveComponentValue($(this))
			});
			d.on("change", "#" + b.componentSetup.fieldId + "[cid='" + this.cid + "'] input:text", function() {
				var a = $(this).val();
				null != a && "" != $.trim(a) && b.saveComponentValue($(this))
			})
		},
		check: function(a) {
			var b = a.find("input:checkbox[name='" + this.componentSetup.fieldId + this.cid + "']:checked").val(),
				d = {};
			d.element = a;
			"" != b && null != b || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			return d
		},
		getValue: function(a) {
			var b = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			},
				d = 0,
				e = [],
				f = "";
			a.find("li").each(function(b) {
				var c = $(this).find("input:checkbox");
				b = c.val();
				if (c.is(":checked")) {
					var h = "",
						c = c.data("componentData"),
						h = "true" == c.componentSetup.other || 1 == c.componentSetup.other ? a.find("input:text").val() : c.componentSetup.name;
					e[d] = {
						optionId: b,
						content: h
					};
					f += h + ",";
					d++
				}
			});
			0 != f.length && (this.oldValue = f.substring(0, f.length - 1));
			b.dataOptions = e;
			return 0 == d ? null : b
		},
		setValue: function(a, b) {
			if (null != b && null != b.dataOptions) {
				for (var d = "", e = 0; e < b.dataOptions.length; e++) {
					var f = b.dataOptions[e],
						g = f.content,
						f = a.find("input:checkbox[name='" + this.componentSetup.fieldId + this.cid + "'][value='" + f.optionId + "']"),
						k = f.get(0);
					null != k && (k.checked = !0, d += g + ",", f = f.data("componentData").componentSetup.other, "true" == f || 1 == f) && (a.find("input:text").val(g), a.find("input:text").show())
				}
				0 != d.length && a.find(".j_readOnly").html(d.substring(0, d.length - 1));
				this.oldValue = a.find(".j_readOnly").text()
			}
		},
		empty: function(a) {
			for (var b = a.find("input:checkbox[name='" + this.componentSetup.fieldId + this.cid + "']"), d = 0; d < b.length; d++) {
				var e = $(b[d]),
					f = e.get(0);
				null != f && (f.checked = !1, e = e.data("componentData").componentSetup.other, "true" == e || 1 == e) && (a.find("input:text").val(""), a.find("input:text").hide())
			}
		},
		readOnly: function(a, b) {
			a.find("input:checkbox[name='" + this.componentSetup.fieldId + this.cid + "']").attr("disabled", b);
			b ? (a.find(".check_js").addClass("hide"), a.find(".j_readOnly").removeClass("hide")) : (a.find(".check_js").removeClass("hide"), a.find(".j_readOnly").addClass("hide"))
		}
	});
	return window.CheckBox
});
