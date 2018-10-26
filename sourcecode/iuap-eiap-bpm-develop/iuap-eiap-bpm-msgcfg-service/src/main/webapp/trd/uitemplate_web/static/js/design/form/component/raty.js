define("form/component/raty", ["form/component", "form/tplutil"], function() {
	var m = require("form/component");
	var l = require("form/tplutil");
	window.Raty = m.extend({
		initialize: function(b) {
			this.componentSetup = {
				componentKey: "Raty",
				title: "评分",
				titleLayout: "",
				order: 0,
				index: 0,
				describe: "",
				required: !1,
				fieldId: l.getFieldId(),
				size: "large",
				half: "no",
				borderColor:"",
				defaultstar: 0
			};
			null != b && (this.componentSetup.title = b.title,this.componentSetup.borderColor = a.borderColor, this.componentSetup.titleLayout = b.titleLayout, this.componentSetup.describe = b.describe, this.componentSetup.order = b.order, this.componentSetup.index = b.index, this.componentSetup.required = b.required, this.componentSetup.fieldId = b.fieldId, this.componentSetup.size = b.size, this.componentSetup.half = b.half, this.componentSetup.defaultstar = b.defaultstar, this.rdOnly = !1);
			this.tpl = l.get("raty")
		},
		setTitle: function(b) {
			this.componentSetup.title = b
		},
		setDescribe: function(b) {
			this.componentSetup.describe = b
		},
		setRequired: function(b) {
			this.componentSetup.required = b
		},
		setSize: function(b) {
			this.componentSetup.size = b
		},
		setTitleLayout: function(b) {
			this.componentSetup.titleLayout = b
		},
		sethalf: function(b) {
			this.componentSetup.half = b
		},
		setDefaultstar: function(b) {
			this.componentSetup.defaultstar = b
		},
		setBorderColor: function(b) {
			this.componentSetup.borderColor = b
		},
		render: function(b) {
			for (var a = $(this.tpl), c = a.siblings("#form-raty"), d = 1; 5 >= d; d++) {
				var e = a.siblings("#img-clone").find("img").clone();
				e.attr("value", d);
				c.find("#star").append(e)
			}
			c.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || c.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (c.find(".field-description").text(this.componentSetup.describe), c.find(".field-description").show());
			b.attr("class", c.attr("class"));
			b.addClass(this.componentSetup.titleLayout);
			b.attr("tempId",this.componentSetup.fieldId);
			b.html(c.html())
		},
		renderEditor: function() {
			var b = $(this.tpl),
				a = b.siblings("#editor-raty");
			a.find("#component-title").attr("value", this.componentSetup.title);
			a.find("#component-describe").text(this.componentSetup.describe);
			a.find("input:radio[name='half'][value='" + this.componentSetup.half + "']").attr("checked", !0);
			var c = this.componentSetup.half,
				b = b.siblings("#img-clone");
			if ("no" == c) for (a.find(".j_default-star").empty(), c = 0; 5 >= c; c++) {
				var d = b.find("option").clone();
				d.attr("value", c);
				d.text(c);
				a.find(".j_default-star").append(d)
			} else for (a.find(".j_default-star").empty(), c = 0; 5 >= c; c += .5)
			d = b.find("option").clone(), d.attr("value", c), d.text(c), a.find(".j_default-star").append(d);
			a.find("option[value='" + this.componentSetup.defaultstar + "']").attr("selected", !0);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || a.find("#required").attr("checked", "true");
			$("#editor-component").html(a.html())
		},
		renderPreview: function(b, a, c) {
			var d = $(this.tpl),
				e = d.siblings("#preview-raty"),
				f = this.componentSetup.defaultstar,
				g = Math.round(f),
				d = d.siblings("#img-clone");
			if (f == g) for (var k = 1; 5 >= k; k++) {
				if (k <= f) {
					var p = d.find("img").clone(),
						h = p.attr("src"),
						h = h.replace("off", "on");
					p.attr("src", h)
				} else p = d.find("img").clone();
				p.attr("value", k);
				e.find("#star-preview").append(p)
			} else for (k = 1; 5 >= k; k++)
			k <= g - 1 ? (p = d.find("img").clone(), h = p.attr("src"), h = h.replace("off", "on"), p.attr("src", h)) : k == g ? (p = d.find("img").clone(), h = p.attr("src"), h = h.replace("off", "half"), p.attr("src", h)) : p = d.find("img").clone(), p.attr("value", k), e.find("#star-preview").append(p);
			e.find(".widget-title .widget-title_js").text(this.componentSetup.title);
			"true" != this.componentSetup.required && 1 != this.componentSetup.required || e.find(".widget-title .widget-required_js").text(" *");
			"" != this.componentSetup.describe && (e.find(".field-description").text(this.componentSetup.describe), e.find(".field-description").show());
			e.find(".check_js").attr("id", this.componentSetup.fieldId).attr("name", this.componentSetup.fieldId);
			e.find(".check_js").attr("cid", this.cid);
			e.attr("id", "field_" + this.componentSetup.fieldId);
			e.find(".check_js").data("componentData", this);
			a && e.find(".check_js").val("");
			e.find(".form-control").attr("placeholder", "请填写" + this.componentSetup.title);
			e.addClass(this.componentSetup.titleLayout);
			this.readOnly(e, c);
			b.append(e);
			this.getValue(e)
		},
		renderEditPreview: function(b) {
			var a = $(this.tpl),
				c = a.siblings("#form-raty"),
				d = this.componentSetup.defaultstar,
				e = Math.round(d),
				a = a.siblings("#img-clone");
			if (0 < d) if (d == e) for (var f = 1; 5 >= f; f++) {
				if (f <= d) {
					var g = a.find("img").clone(),
						k = g.attr("src"),
						k = k.replace("off", "on");
					g.attr("src", k)
				} else g = a.find("img").clone();
				g.attr("value", f);
				c.find("#star").append(g)
			} else for (f = 1; 5 >= f; f++)
			f <= e - 1 ? (g = a.find("img").clone(), k = g.attr("src"), k = k.replace("off", "on"), g.attr("src", k)) : f == e ? (g = a.find("img").clone(), k = g.attr("src"), k = k.replace("off", "half"), g.attr("src", k)) : g = a.find("img").clone(), g.attr("value", f), c.find("#star").append(g);
			else for (f = 1; 5 >= f; f++)
			g = a.find("img").clone(), g.attr("value", f), c.find("#star").append(g);
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
			b.append(c)
		},
		renderStatSearch: function(b) {
			var a = $(this.tpl).siblings("#statsearch-raty");
			b = b.parentEl;
			b.attr("class", "sch-group j_formFieldSearchGroup");
			b.find(".j_formField-condition").html(a)
		},
		submitCheck: function(b, a) {
			var c = this.check(b);
			a(c)
		},
		checkEvents: function(b) {
			var a = this,
				c = $("div[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']");
			if (this.rdOnly) c.attr("style", "");
			else {
				var d = this.componentSetup.half;
				b = c.find("img[src*='half']").length;
				var e = c.find("img[src*='on']").length,
					f = 0,
					f = 0 < b ? e + .5 : e;
				a.selectValue = this.componentSetup.defaultstar;
				c.on("mousemove", "img", function(a) {
					var b = $(this).offset().left,
						e = $(this).attr("value"),
						f = $(this).width(),
						h = b + f / 2,
						f = f + b;
					a.pageX >= b && a.pageX < h ? "no" == d ? c.find("img[value='" + e + "']").attr("src", "/iform/static/img/form/star-on-big.png") : c.find("img[value='" + e + "']").attr("src", "/iform/static/img/form/star-half-big.png") : a.pageX >= h && a.pageX < f && c.find("img[value='" + e + "']").attr("src", "/iform/static/img/form/star-on-big.png");
					g(e)
				});
				c.on("mouseout", "img", function() {
					var b = Math.round(a.selectValue);
					b == a.selectValue ? c.find("img[value='" + b + "']").attr("src", "/iform/static/img/form/star-on-big.png") : c.find("img[value='" + b + "']").attr("src", "/iform/static/img/form/star-half-big.png");
					g(b)
				});
				c.on("click", "img", function(b) {
					a.selectValue = $(this).attr("value");
					var e = $(this).offset().left,
						h = $(this).width(),
						l = e + h / 2,
						h = h + e;
					b.pageX >= e && b.pageX < l ? (a.selectValue = "no" == d ? a.selectValue : a.selectValue - 1 + .5, f == a.selectValue ? f = a.selectValue = 0 : ("no" == d ? c.find("img[value='" + a.selectValue + "']").attr("src", "/iform/static/img/form/star-on-big.png") : c.find("img[value='" + a.selectValue + "']").attr("src", "/iform/static/img/form/star-half-big.png"), f = a.selectValue)) : b.pageX >= l && b.pageX < h && (f == a.selectValue ? f = a.selectValue = 0 : (c.find("img[value='" + a.selectValue + "']").attr("src", "/iform/static/img/form/star-on-big.png"), f = a.selectValue));
					g(a.selectValue)
				});
				var g = function(a) {
						for (var b = 1; b <= a - 1; b++)
						c.find("img[value='" + b + "']").attr("src", "/iform/static/img/form/star-on-big.png");
						for (b = 5; b > a; b--)
						c.find("img[value='" + b + "']").attr("src", "/iform/static/img/form/star-off-big.png")
					}
			}
		},
		check: function(b) {
			var a = $.trim(b.val()),
				c = b.attr("placeholder"),
				d = {};
			d.element = b;
			a == c && (a = "");
			"" != a || "true" != this.componentSetup.required && 1 != this.componentSetup.required || (d.message = this.componentSetup.title + "不能为空");
			return d
		},
		getValue: function(b) {
			var a = $(b).find("img[src*='on']").length;
			0 < $(b).find("img[src*='half']").length && (a += .5);
			b = b.attr("placeholder");
			var c = this.oldValue,
				d = {
					formField: {
						title: this.componentSetup.title,
						componentKey: this.componentSetup.componentKey,
						id: this.componentSetup.fieldId
					},
					oldContent: this.oldValue,
					content: a + ""
				};
			this.oldValue = a + "";
			return c && 0 < c.length ? d : 0 == a.length || a == b || isNaN(a) ? null : d
		},
		setValue: function(b, a) {
			if (null != a) {
				var c = a.content,
					d = Math.round(c);
				if (0 < c) if (c == d) for (var e = 1; 5 >= e; e++) {
					if (e <= d) var f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"),
						f = f.replace("off", "on"),
						f = f.replace("half", "on");
					else f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"), f = f.replace("on", "off"), f = f.replace("half", "off");
					b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src", f)
				} else for (e = 1; 5 >= e; e++)
				e <= d - 1 ? (f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"), f = f.replace("off", "on"), f = f.replace("half", "on")) : e == d ? (f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"), f = f.replace("off", "half"), f = f.replace("on", "off")) : (f = b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src"), f = f.replace("on", "off"), f = f.replace("half", "off")), b.find("#" + this.componentSetup.fieldId).find("img[value='" + e + "']").attr("src", f);
				b.find(".j_readOnly").html(c);
				this.oldValue = c + "";
				this.selectValue = c || 0
			}
		},
		empty: function(b) {
			b.find("#" + this.componentSetup.fieldId).val("")
		},
		readOnly: function(b, a) {
			b.find("div[id='" + this.componentSetup.fieldId + "'][cid='" + this.cid + "']");
			a && (this.rdOnly = a)
		}
	});
	return window.Raty
});
