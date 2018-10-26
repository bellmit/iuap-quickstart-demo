define("form/component/select", ["form/component", "form/tplutil", "form/component/option"], function() {
	var m = require("form/component");
	var l = require("form/tplutil"),
		b = require("form/component/option");
	window.Select = m.extend({
		initialize: function(a) {
			this.componentSetup = {
				componentKey: "Select",
				title: "选项控件",
				titleLayout: "",
				itemListener: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				size: "large",
				optionsType: "Select",
				borderColor:"",
				options: [],
				readOnly: !1,
				islist:true //是否列表显示
			};
			var c = new b;
			c.setName("选项1");
			c.setOrder(0);
			c.setSelectionId("select1");
			var d = new b;
			d.setName("选项2");
			d.setOrder(1);
			d.setSelectionId("select2");
			var e = new b;
			e.setName("选项3");
			e.setOrder(2);
			e.setSelectionId("select3");
			this.componentSetup.options[0] = c.componentSetup;
			this.componentSetup.options[1] = d.componentSetup;
			this.componentSetup.options[2] = e.componentSetup;
			null != a && (this.componentSetup.title = a.title, this.componentSetup.itemListener = a.itemListener,this.componentSetup.borderColor = a.borderColor,this.componentSetup.titleLayout = a.titleLayout, this.componentSetup.describe = a.describe, this.componentSetup.order = a.order, this.componentSetup.index = a.index, this.componentSetup.required = a.required, this.componentSetup.fieldId = a.fieldId, this.componentSetup.size = a.size, this.componentSetup.options = a.options,this.componentSetup.islist = a.islist,this.componentSetup.readOnly = a.readOnly);
			this.tpl = l.get("select")
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
		setIsList: function(b) {
			this.componentSetup.islist = b
		},
		setSize: function(a) {
			this.componentSetup.size = a
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
			var c = $(this.tpl).siblings("#form-select");
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			var renderdefchoice = true;//默认没有选中项
			for (var d = c.find(".choicelist_js"), e = 0; e < this.componentSetup.options.length; e++){
				var g = this.componentSetup.options[e]; 
				if(g.defOption){
					renderdefchoice = false;
				}
//				if(typeof g.componentKey =="undefined"){
//					for (var key in g){
//						g.name = g[key];
//						break;
//					}
//				}
//				var optionTypeVal = this.componentSetup.optionsType + e;
//				g.selectionId = optionTypeVal;
				if(typeof g.componentKey =="undefined"){
					g.name = g.selectVal;
					g.selectionId = g.selectKey;
				}
				(new b(g)).render(d, this);
			}
			renderdefchoice && (this.componentSetup.options[0].defOption=true);//如果没设选中项，默认选中第一项
			c.find(".choicelist_js").addClass(this.componentSetup.size);
			a.attr("class", c.attr("class"));
			a.addClass(this.componentSetup.titleLayout);
			a.attr("tempId",this.componentSetup.fieldId);
			c.find("select").attr("disabled","disabled");
			a.html(c.html())
		},
		renderEditor: function() {
			var a = $(this.tpl).siblings("#editor-select");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("#component-listener").attr("value", this.componentSetup.itemListener);
			a.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", !0);
			a.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly || a.find("#readOnly").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || a.find("#isList").attr("checked", "true");
			a.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			a.find("input:radio[name='layout'][value='choicelist-" + this.componentSetup.layout + "']").attr("checked", "true");
			var defchoice = true;//默认没有选中项
			for (var c = a.find("ul.choicelistEdit_js"), d = 0; d < this.componentSetup.options.length; d++) {
				var e = this.componentSetup.options[d];
				if(e.defOption){
					defchoice = false;
				}
//				var optionTypeVal = this.componentSetup.optionsType + d;
//				if(typeof e.componentKey =="undefined"){
//					for (var key in e){
//						e.name = e[key];
//						var flag = key;
//						e.defOption =key;
//						break;
//					}
//					$("#widget-control .field-active .choicelist_js .CheckBox_js").find("input:checkbox[value='"+optionTypeVal+"']").eq(d).attr("checked",flag);
//				}
//				e.selectionId = optionTypeVal;
				if(typeof e.componentKey =="undefined"){
					e.name = e.selectVal;
					e.selectionId = e.selectKey;
				}
				(new b(e)).renderEditor(c, this);
				"true" != e.other && 1 != e.other || a.find(".btn-default_js").parent().hide();
				a.find("input:radio[name='editor-option']").eq(d).attr("value",e.selectionId);
			}
			defchoice && (this.componentSetup.options[0].defOption=true);//如果没设选中项，默认选中第一项
			a.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
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
			a.addClass("field-active");
		},
		renderPreview: function(a, c, d) {
			var e = $(this.tpl).siblings("#preview-select");
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			e.find(".check_js").attr("cid", this.cid);
			e.attr("id", this.componentSetup.fieldId);
			for (var f = e.find(".choicelist_js"), g = 0; g < this.componentSetup.options.length; g++)(new b(this.componentSetup.options[g])).renderPreview(f, this);
			e.find(".check_js").data("componentData", this);
			d && (e.find(".check_js").prop("disabled", !0), e.find(".check_js").siblings("input:text").prop("disabled", !0));
			c && e.find(".check_js").val("");
			e.find(".choicelist_js").addClass(this.componentSetup.size);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, d);
			this.isReadOnly = d;
			this.el = a;
			a.append(e)
		},
		renderEditPreview: function(a) {
			var c = $(this.tpl).siblings("#form-select").clone();
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			c.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			c.attr("id", this.componentSetup.fieldId);
			for (var d = c.find(".choicelist_js"), e = 0; e < this.componentSetup.options.length; e++)(new b(this.componentSetup.options[e])).renderPreview(d, this);
			c.find(".choicelist_js").addClass(this.componentSetup.size);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				//c.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
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
			b.on("change", "select[id='" + c.componentSetup.fieldId + "'][cid='" + c.cid + "']", function() {
				var b = $(this).find("option:selected");
				$(this).attr("id", c.componentSetup.fieldId);
				b = b.data("componentData");
				"true" == b.componentSetup.other || 1 == b.componentSetup.other ? $(this).siblings("input:text").attr("disabled", !1).show() : $(this).siblings("input:text").attr("disabled", !0).hide();
				b = c.check($(this));
				a(b);
				null == b.message && c.saveComponentValue($(this))
			});
			b.on("change", "select[id='" + c.componentSetup.fieldId + "'][cid='" + c.cid + "']+input:text", function() {
				var a = $(this).val();
				null != a && "" != $.trim(a) && c.saveComponentValue($(this))
			})
		},
		check: function(a) {
			var c = a.val(),
				b = {};
			b.element = a;
			"" != c && null != c || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (b.message = this.componentSetup.title + "不能为空");
			return b
		},
		getValue: function(a) {
			if (!this.oldValue) {
				for (var b = 0; this.componentSetup.options.length > b; b++) {
					var d = this.componentSetup.options[b];
					if ("true" == d.defOption || 1 == d.defOption) this.oldValue = d.name
				}
				this.oldValue || (this.oldValue = this.componentSetup.options[0].name)
			}
			var b = {
				formField: {
					title: this.componentSetup.title,
					componentKey: this.componentSetup.componentKey,
					id: this.componentSetup.fieldId
				},
				oldContent: this.oldValue
			},
				e = a.val(),
				d = a.find("option:selected"),
				d = d.data("componentData"),
				f = "";
			"true" == d.componentSetup.other || 1 == d.componentSetup.other ? (f = a.siblings("input:text").val(), 0 == f.length && (f = "其他")) : f = d.componentSetup.name;
			b.dataOptions = [{
				optionId: e,
				content: f
			}];
			this.oldValue = f;
			return null == e || "" == $.trim(e) ? null : b
		},
		setValue: function(a, b) {
			if (null != b && null != b.dataOptions) {
				for (var d = 0; d < b.dataOptions.length; d++) {
					var e = b.dataOptions[d],
						f = e.optionId,
						e = e.content;
					a.find("select#" + this.componentSetup.fieldId).val(f);
					a.find(".j_readOnly").html(e);
					f = a.find("[value=" + f + "]").data("componentData").componentSetup.other;
					if ("true" == f || 1 == f) a.find("input:text").val(e), this.isReadOnly || a.find("input:text").show()
				}
				this.oldValue = a.find(".j_readOnly").text()
			}
		},
		empty: function(a) {},
		readOnly: function(a, b) {
			a.find("select[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", b);
			b ? (a.find(".check_js").addClass("hide"), a.find(".j_readOnly").removeClass("hide")) : (a.find(".check_js").removeClass("hide"), a.find(".j_readOnly").addClass("hide"))
		}
	});
	return window.Select
});
