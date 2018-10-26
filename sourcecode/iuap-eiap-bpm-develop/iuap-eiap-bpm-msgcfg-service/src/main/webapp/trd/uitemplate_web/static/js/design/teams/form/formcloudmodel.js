define("teams/form/formcloudmodel", ["teams/utils"],
function() {
    var f = require("teams/utils"),
    h = Backbone.Model.extend({
        initialize: function(d) {},
        defaults: {
            pageNo: 1,
            pageSize: 10,
            order: "default"
        },
        load: function() {
            this.loadLabel();
            this.searchForm()
        },
        loadLabel: function(/*d*/) {
            var c = this;
            $.ajax({
                type: "post",
                url: "/iform/static/data/findFormLabel.json",
                dataType: "json",
                success: function(b) {
                    if (b && b.msg) {
                        f.notify(b.msg, null, "error")
                    } else {
                        c.set("formLabels", b.formLabels)
                        // d && d(b)
                    }
                }
            })
        },
        getFormByLabels: function(d, c) {
            this.set({
                keyword: "",
                labelIds: d,
                pageNo: "1",
                order: "default"
            });
            this.searchForm(c)
        },
        getFormByKeyword: function(d, c) {
            this.set({
                keyword: d,
                pageNo: "1",
                order: "default"
            });
            this.searchForm(c)
        },
        sortFormList: function(d, c) {
            this.set({
                pageNo: "1",
                order: d || "default"
            });
            this.searchForm(c)
        },
        nextPage: function(d) {
            this.set({
                pageNo: this.get("nextPage")
            });
            this.searchForm(d)
        },
        searchForm: function(d) {
            var c = this,
            b = _.pick(c.attributes, "keyword", "labelIds", "pageNo", "pageSize", "order");
            $.ajax({
                type: "post",
                url: "/iform/static/data/searchForm.json",
                dataType: "json",
                data: {data:JSON.stringify(b)},
                success: function(a) {
                    if (a && a.msg) f.notify(a.msg, null, "error");
                    else {
                        var b = a && a.formPage;
                        c.set({
                            forms: b.result,
                            pageNo: b.pageNo,
                            nextPage: b.nextPage,
                            hasNext: b.hasNext
                        });
                        if (0 == b.result) {
                            $(".j_formlist .j_no-result").removeClass("hide")
                        } else {
                            $(".j_formlist .j_no-result").addClass("hide");
                        }
                        d && d(a)
                    }
                }
            })
        },
        popularityForm: function(d, c) {
            $.ajax({
                type: "post",
                url: "/biaoge/popularityForm.json",
                dataType: "json",
                data: d,
                success: function(b) {
                    b && b.actionMsg ? f.notify(b.actionMsg.message, null, "error") : c && c(b)
                }
            })
        }
    });
    return h
});
