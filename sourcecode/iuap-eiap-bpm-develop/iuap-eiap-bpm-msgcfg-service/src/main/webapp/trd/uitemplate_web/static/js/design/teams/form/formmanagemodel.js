define("teams/form/formmanagemodel",
function() {
    var h = Backbone.Model.extend({
        formId: 0,
        pageNo: 1,
        pageSize: 10,
        initialize: function(f) {},
        createUserStream: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/createUserStream.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        createDepartmentStream: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/createDepartmentStream.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        saveShareConfig: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/saveShareConfig.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        queryLastConfig: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/queryLastConfig.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        queryCompanyAndEmployForms: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/queryCompanyAndEmployForms.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        //查询模板列表
        queryMyForms: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryUITemplateList",
                dataType: "json",
                // 只需要module，现在先不传
                data: {data:JSON.stringify(f)},
                //data: {tenant_id:f.tenant_id},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        queryMyFormsKeywords: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/queryMyFormsKeywords.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        queryMyWriteForms: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/queryMyWriteForms.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findSubordinateForms: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/findSubordinateForms.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findPersonal: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/findPersonal.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findCompany: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/findCompany.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findCloud: function(f, d) {
            $.ajax({
                type: "get",
                url: "/uitemplate_web/static/data/findCloud.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        //删除模板
        deleteForm: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/deleteTemplate",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        queryMaxSort: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/queryMaxSort.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        //复制模板
        copyForm: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/copyUITemplate",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        //启用模板
        enableForm: function(f, d) {
        	$.ajax({
        		type: "post",
        		url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/enableUITemplate",
        		dataType: "json",
        		data: {data:JSON.stringify(f)},
        		success: function(c) {
        			d && d(c)
        		}
        	})
        },
        saveForm: function(f, d) {
            $.ajax({
                type: "post",
                // async: !1,
//                contentType: "application/json;charset=UTF-8",
//                url: "/uitemplate_web/static/data/saveForm.json",
                url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/saveBillModel",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        //模板重命名
        renameForm: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/renameTemplate",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        checkFormName: function(f, d) {
            $.ajax({
                type: "get",
                url: "/uitemplate_web/static/data/checkFormName.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        updateStatus: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/updateStatus.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        queryKeywords: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/queryKeywords.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findCount: function(f, d) {
            $.ajax({
                type: "get",
                url: "/uitemplate_web/static/data/findCount.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        suggestion: function(f) {
            $.ajax({
                type: "get",
                url: "/search/suggestion.json",
                dataType: "json",
                success: function(d) {
                    f && f(d)
                }
            })
        },
        updateCategory: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/updateCategory.json",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findAll: function(f, d) {
            $.ajax({
                type: "get",
                url: "/uitemplate_web/static/data/findAll.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findCateAndCompany: function(f, d) {
            $.ajax({
                type: "get",
                url: "/uitemplate_web/static/data/findCateAndCompany.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findCateAndPersonal: function(f, d) {
            $.ajax({
                type: "get",
                url: "/uitemplate_web/static/data/findCateAndPersonal.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findCateAndCloud: function(f, d) {
            $.ajax({
                type: "get",
                url: "/uitemplate_web/static/data/findCateAndCloud.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        createCategory: function(f, d) {
            $.ajax({
                type: "post",
//                url: "/uitemplate_web/static/data/createCategory.json",
                url: "/uitemplate_web/bo_type_ctr/saveType",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        deleteCategory: function(f, d) {
            $.ajax({
                type: "post",
//                url: "/uitemplate_web/static/data/deleteCategory.json",
                url: "/uitemplate_web/bo_type_ctr/deleteType",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        formCategorSort: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/iform/static/formCategorSort.json",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        updateCategoryName: function(f, d) {
            $.ajax({
                type: "post",
//                url: "/uitemplate_web/static/data/updateCategoryName.json",
                url: "/uitemplate_web/bo_type_ctr/saveType",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        sort: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/sort.json",
                dataType: "json",
                data: {data:JSON.stringify(f)},
                success: function(c) {
                    d && d(c)
                }
            })
        },
        recommend: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/recommend.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        updateRelateFlow: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/updateRelateFLow.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        queryCategory: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/queryCategory.json",
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
                url: "/uitemplate_web/static/datadatareport/incollect.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        queryIntroCount: function(f, d) {
            $.ajax({
                type: "post",
                url: "/base/configuration/queryIntroCount.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        useflow: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/useflow.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        getFiledByForm: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/getFiledByForm.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        findMember: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/findMember.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        queryRecommend: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/queryRecommend.json",
                dataType: "json",
                data: f,
                success: function(c) {
                    d && d(c)
                }
            })
        },
        getNewestLayout: function(f, d) {
            $.ajax({
                type: "post",
                url: "/uitemplate_web/static/data/getNewestLayout.json",
                dataType: "json",
                data: {
                    formId: f
                },
                success: function(c) {
                    d && d(c)
                }
            })
        }
    });
    return h
});
