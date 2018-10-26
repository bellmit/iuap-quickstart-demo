define("teams/formstat/formstatmodel",
function() {
    var h = Backbone.Model.extend({
        initialize: function() {
            this.pageSize = 10
        },
        findForm: function(f, d) {
            f.pageSize = this.pageSize;
            $.ajax({
                type: "post",
                url: "/formdatastat/findCellListStat.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findRowListStatForBase: function(f, d) {
            f.pageSize = this.pageSize;
            $.ajax({
                type: "post",
//                url: "/iform/static/data/findRowListStatForBase.json",
                url: "/iform/bill_ctr/getBoinsList",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findRowListStat: function(f, d) {
            f.pageSize = this.pageSize;
            $.ajax({
                contentType: "application/json;charset=UTF-8",
                type: "post",
                url: "/formdatastat/findRowListStat.json",
                dataType: "json",
                data: JSON.stringify(f),
                success: function(c) {
                    d && d(c)
                }
            })
        },
        exportParam: function(f, d) {
            f.pageSize = this.pageSize;
            $.ajax({
                contentType: "application/json;charset=UTF-8",
                async: !1,
                type: "post",
                url: "/formdatastat/exportParam.json",
                dataType: "json",
                data: JSON.stringify(f),
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findColumnField: function(f, d) {
            $.ajax({
                type: "post",
                url: "/formdatastat/findColumnField.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        saveFormColumns: function(f, d) {
            $.ajax({
                contentType: "application/json;charset=UTF-8",
                type: "post",
                url: "/formdatastat/saveFormColumns.json",
                dataType: "json",
                data: JSON.stringify(f),
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findFiledOptions: function(f, d) {
            $.ajax({
                type: "get",
                url: "/formdatastat/findFiledOptions.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        deleteFlow: function(f, d) {
            $.ajax({
                contentType: "application/json;charset=UTF-8",
                type: "post",
                url: "/flow/destroy.json",
                dataType: "json",
                data: JSON.stringify(f),
                success: function(c) {
                    d && d(c)
                }
            })
        },
        getFormField: function(f, d) {
            $.ajax({
                type: "get",
                url: "/formdatastat/findFormFieldByFormId.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        incollect: function(f, d) {
            $.ajax({
                type: "post",
                url: "/formdatareport/incollect.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        }
    });
    return h
});
