/**
 * 参照组件
 */
define("form/component/reference", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var components = require("form/tplutil");
	window.Reference = m.extend({
		initialize: function(b) {
			this.componentSetup = {
					componentKey: "Reference",
					title: "参照",
					titleLayout: "",//控件设置属性--标题布局
					itemListener: "",
					refParam: "",
					order: 0,
					index: 0,
					describe: "",            //控件设置属性--描述
					required: !1,            //控件设置属性--必填
					fieldId: components.getFieldId(),             //组件id
					size: "large",          //控件设置属性--控件大小
					isMutiSelect:false,        //控件设置属性--允许多选
					borderColor:"",          //控件设置属性--边框颜色
					contMeta:"",              //控件设置属性--关联元数据
					islist:true, //是否列表显示
					pkMd:"",
					readOnly: !1,
					leafSelect: !1
			};
			null != b && (this.componentSetup.title = b.title, 
					this.componentSetup.titleLayout = b.titleLayout, 
					this.componentSetup.itemListener = b.itemListener,
					this.componentSetup.refParam = b.refParam,
					this.componentSetup.describe = b.describe, 
					this.componentSetup.order = b.order, 
					this.componentSetup.index = b.index, 
					this.componentSetup.required = b.required, 
					this.componentSetup.fieldId = b.fieldId, 
					this.componentSetup.size = b.size,
					this.componentSetup.contMeta = b.contMeta,
					this.componentSetup.borderColor = b.borderColor,
					this.componentSetup.isMutiSelect = b.isMutiSelect,
					this.componentSetup.islist = b.islist,
					this.componentSetup.contMeta = b.contMeta,
					this.componentSetup.readOnly = b.readOnly,
					this.componentSetup.leafSelect = b.leafSelect);
					
			this.tpl = components.get("reference")
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
		setRefParam: function(b) {
			this.componentSetup.refParam = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setIsList: function(b) {
			this.componentSetup.islist = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		setIsMutiSelect:function(b){
			this.componentSetup.isMutiSelect = b
		},
		setBorderColor:function(b){
			this.componentSetup.borderColor = b
		},
		setContMeta:function(b){
			this.componentSetup.contMeta = b
		},
		setPkMd:function(b){
			this.componentSetup.pkMd = b
		},
		setReadOnly: function(b) {
			this.componentSetup.readOnly = b
		},
		setLeafSelect: function(b) {
			this.componentSetup.leafSelect = b
		},
		render: function(b) {
			var formReferenceCompDiv = $(this.tpl).siblings("#form-reference");
			formReferenceCompDiv.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || formReferenceCompDiv.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"true" != this.componentSetup.leafSelect && 1 != this.componentSetup.leafSelect;
			"" != this.componentSetup.describe && (formReferenceCompDiv.find(".field-description").text(this.componentSetup.describe), formReferenceCompDiv.find(".field-description").show());
			formReferenceCompDiv.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			b.attr("class", formReferenceCompDiv.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			//formReferenceCompDiv.find(".widget-content .form-control").after('<span class="widgetMark input-group-addon-new"><span class="icon-caret-down fa fa-angle-down"></span></span>');
			b.attr("tempId",components.getFieldId());
			b.html(formReferenceCompDiv.html())
		},
		renderEditor: function() {
			//this.componentSetup.fieldId = this.RndNum(9);
			this.readContMetaArr();//加载相关元数据数组
			var editorReferenceDiv = $(this.tpl).siblings("#editor-reference");
			editorReferenceDiv.find("#component-title").attr("value", this.componentSetup.title);
			editorReferenceDiv.find("#component-listener").attr("value", this.componentSetup.itemListener);
			editorReferenceDiv.find("#component-refParam").attr("value", this.componentSetup.refParam);
			editorReferenceDiv.find("input:radio[name='title-layout'][value='" + this.componentSetup.titleLayout + "']").attr("checked", "true");
			editorReferenceDiv.find("#component-describe").text(this.componentSetup.describe);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || editorReferenceDiv.find("#required").attr("checked", "true");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly || editorReferenceDiv.find("#readOnly").attr("checked", "true");
			"true" != this.componentSetup.leafSelect && 1 != this.componentSetup.leafSelect || editorReferenceDiv.find("#leafselect").attr("checked", "true");
			"true" != this.componentSetup.isMutiSelect && 1 != this.componentSetup.isMutiSelect || editorReferenceDiv.find("#isMutiSelect").attr("checked", "true");
			"true" != this.componentSetup.islist && 1 != this.componentSetup.islist || editorReferenceDiv.find("#isList").attr("checked", "true");
			editorReferenceDiv.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", "true");
			editorReferenceDiv.find(".in-color").css({"background-color":this.componentSetup.borderColor});
			if(this.contMetaArr && this.contMetaArr.length>0){
				var optionStr="";
				for(var i=0;i<this.contMetaArr.length;i++){
					if((this.componentSetup.contMeta == "" && i==0) || this.componentSetup.contMeta.pk_ref == this.contMetaArr[i].pk_ref){
						if(this.componentSetup.contMeta == "" && i == 0){
							this.setContMeta(this.contMetaArr[i]);
						}
						optionStr += "<option refpk='"+this.contMetaArr[i].pk_ref+"' refcode='"+this.contMetaArr[i].refcode+"' refname='"+this.contMetaArr[i].refname+"' mdEntitypk='"+this.contMetaArr[i].md_entitypk+"' refurl='"+this.contMetaArr[i].refurl+"' refclass='"+this.contMetaArr[i].refclass+"' productType='"+this.contMetaArr[i].productType+"' selected=true>"+this.contMetaArr[i].refname+"</option>";
					}else{
						optionStr += "<option refpk='"+this.contMetaArr[i].pk_ref+"' refcode='"+this.contMetaArr[i].refcode+"' refname='"+this.contMetaArr[i].refname+"' mdEntitypk='"+this.contMetaArr[i].md_entitypk+"' refurl='"+this.contMetaArr[i].refurl+"' refclass='"+this.contMetaArr[i].refclass+"' productType='"+this.contMetaArr[i].productType+"'>"+this.contMetaArr[i].refname+"</option>";
					}
				}
			}else{
				optionStr += '<option value=""></option>';
			}
			editorReferenceDiv.find("#component_dataMeta_ref").append(optionStr);
			
			//editorReferenceDiv.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", "true");
			
			$("#editor-component").html(editorReferenceDiv.html())
		},
		/**预览--渲染组件 */
		renderPreview: function(b, a, c) {
			var previewReferenceDiv = $(this.tpl).siblings("#preview-reference");
			previewReferenceDiv.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || previewReferenceDiv.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"true" != this.componentSetup.leafSelect && 1 != this.componentSetup.leafSelect;
			"" != this.componentSetup.describe && (previewReferenceDiv.find(".field-description").text(this.componentSetup.describe), previewReferenceDiv.find(".field-description").show());
			previewReferenceDiv.find(".check_js").addClass(this.componentSetup.size);
			previewReferenceDiv.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			previewReferenceDiv.find(".check_js").attr("cid", this.cid);
			previewReferenceDiv.attr("id", "field_" + this.componentSetup.fieldId);
			previewReferenceDiv.find(".check_js").data("componentData", this);
			a && previewReferenceDiv.find(".check_js").val("");
			previewReferenceDiv.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			//文本框高度设置
			previewReferenceDiv.find(".form-control").css("height","30px");
			//颜色设置
			if(this.componentSetup.borderColor && this.componentSetup.borderColor!='#ccc'){
				previewReferenceDiv.find(".form-control").css({"border-color":this.componentSetup.borderColor});
				//previewReferenceDiv.find(".widget-title .widget-title_js").css({"color":this.componentSetup.borderColor});
			}
			"mobile" != window.systemInfo_form && previewReferenceDiv.find(".form-control").autosize();
			previewReferenceDiv.addClass(this.componentSetup.titleLayout);
			this.readOnly(previewReferenceDiv, c);
			this.el = b;
			b.append(previewReferenceDiv)
		},
		renderEditPreview: function(b) {
			var formReference = $(this.tpl).siblings("#form-reference");
			formReference.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || formReference.find(".widget-title .widget-required_js").text(" *");
			"true" != this.componentSetup.readOnly && 1 != this.componentSetup.readOnly;
			"true" != this.componentSetup.leafSelect && 1 != this.componentSetup.leafSelect;
			"" != this.componentSetup.describe && (formReference.find(".field-description").text(this.componentSetup.describe), formReference.find(".field-description").show());
			formReference.find(".form-control").attr("class", "form-control " + this.componentSetup.size);
			formReference.attr("id", this.componentSetup.fieldId);
			if(this.componentSetup.borderColor !="" && this.componentSetup.borderColor != "rgb(204, 204, 204)"){
				//formReference.find(".widget-title span.widget-title_js").css("color",this.componentSetup.borderColor);
				formReference.find(".form-control").css("border-color",this.componentSetup.borderColor);
			}
			formReference.data("componentData", this);
			formReference.addClass(this.componentSetup.titleLayout);
			b.append(formReference)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
			c = a.el || $(document);
			c.on("blur", "reference[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				var c = a.check($(this));
				b(c)
			});
			c.on("change", "reference[id='" + a.componentSetup.fieldId + "'][cid='" + a.cid + "']", function() {
				null == a.check($(this)).message && a.saveComponentValue($(this))
			})
		},
		check: function(b) {
			var a = $.trim(b.val()),
			c = {};
			c.element = b;
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (c.message = this.componentSetup.title + "不能为空");
			return c
		},
		getValue: function(b) {
		},
		setValue: function(b, a) {
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			var c = b.find("reference[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']").attr("disabled", a);
			a ? (c.addClass("hide"), c.siblings(".j_readOnly").removeClass("hide")) : (c.removeClass("hide"), c.siblings(".j_readOnly").addClass("hide"))
		},
		readContMetaArr:function(){  //控件设置属性 --关联元数据的数组
			var that = this;
			$.ajax({ 
				type: "POST", 
				url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryRef", 
				data:{
					pk_md: that.componentSetup.entityId
					//pk_md: '123456'
				}, 
				dataType: "json" ,
				async: false,
				success: function(result) {
					//解析result返回元数据数组
					that.contMetaArr = result;
					//that.contMetaArr = [{code:'money',name:'币种',pk:'0000'},{code:'dept',name:'部门',pk:'0001'},{code:'user',name:'用户',pk:'0002'},{code:'role',name:'角色',pk:'0003'},{code:'org',name:'组织',pk:'0004'}];
				},
				error:function(){
					that.contMetaArr = null;
				}
			});
		},
		RndNum:function(n){
			var rnd="";
			for(var i=0;i<n;i++)
			rnd+=Math.floor(Math.random()*10);
			return rnd;
		}
	
	});
	return window.Reference
});