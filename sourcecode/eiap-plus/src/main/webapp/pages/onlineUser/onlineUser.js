define(['text!./onlineUser.html', 'css!./onlineUser.css'], function(html) {
    //./表示根目录
    var app, viewModel, basicDatas, events, inputDom, inputlen, searchflag, localbrowser;
    window.localurl = '/eiap-plus/';
    basicDatas = {
        listData: new u.DataTable({
            meta: {
                "id": {
                    type: 'string'
                },
                "name": {
                    type: 'string'
                },
                "login_name": {
                    type: 'string'
                },
                "loginType": {
                    type: 'string',
                    'default': ' '
                },
                "loginCount": {
                    type: 'string',
                    'default': ' '
                },
                "token": {
                    type: 'string'
                },
                "lastTs": {}
            }
        }),
        countData: new u.DataTable({
            meta: {
                "id": {
                    type: 'string'
                },
                "name": {
                    type: 'string'
                },
                "login_name": {
                    type: 'string'
                },
                "loginType": {
                    type: 'string',
                    'default': ' '
                },
                "token": {
                    type: 'string'
                },
                "lastTs": {}
            }
        }),
    };

    events = {
        pageChangeFunc: function(index) {
            var params = {},
                querydata = {};
            querydata.queryType = 'pageNum'; //特定页面检索
            querydata.pageNum = index + 1; //第几页数据
            querydata.pageSize = $("#pagination select").find("option:selected").text();
            params.querydata = querydata;
            params.pageSize = $("#pagination select").find("option:selected").text();
            params.pageNum = index + 1;
            ajaxFunction(params);
        },
        sizeChangeFunc: function(newsize) {
            var params = {},
                querydata = {};
            querydata.queryType = 'pageSizeChange'; //特定页面检索
            querydata.pageSize = newsize; //每页数据条数
            params.querydata = querydata;
            params.pageSize = newsize;
            ajaxFunction(params);
        },
        //页面初始化
        loadData: function() {
            searchflag = false; //判断查询按钮是否点击过
            var params = {},
                querydata = {};
            querydata.queryType = 'all'; //全检索
            querydata.pageSize = 10; //全检索
            params.querydata = querydata;
            params.pageSize = 10;
            ajaxFunction(params);
        },

        /*页面初始加载*/
        pageInit: function() {
            u.createApp({
                el: '.busslog',
                model: viewModel
            });
            viewModel.loadData();

            localbrowser = myBrowser();

            inputDom = document.querySelectorAll('input[class*="searchinput"]'); //所有条件输入框
            inputlen = inputDom.length;
            var searchbtn = document.querySelector('[data-role="searchbtn"]'); //检索条件按钮
            var clearbtn = document.querySelector('[data-role="clearbtn"]'); //清除条件按钮
            var toggleBtn = document.querySelector('#condition-toggle'); //高级检索按钮
            var returnbtn = document.querySelector('[data-role="returnbtn"]'); //返回按钮
            var ifuse = false; //是否可用

            //高级检索功能
            u.on(toggleBtn, 'click', function() {
                var conditionRow = document.querySelector('#condition-row');
                var toggleIcon = this.querySelector('i');
                if (u.hasClass(conditionRow, 'u-visible')) {
                    u.removeClass(conditionRow, 'u-visible').addClass(conditionRow, 'u-not-visible');
                    u.removeClass(toggleIcon, 'uf-uparrow').addClass(toggleIcon, 'uf-anglearrowdown');
                    this.querySelector('span').innerText = '高级';
                    //清空查询条件
                    for (var i = 0; i < inputlen; i++) {
                        if (inputDom[i].value.length > 0) {
                            inputDom[i].value = "";
                        }
                    }
                } else {
                    u.removeClass(conditionRow, 'u-not-visible').addClass(conditionRow, 'u-visible');
                    u.removeClass(toggleIcon, 'uf-anglearrowdown').addClass(toggleIcon, 'uf-uparrow');
                    this.querySelector('span').innerText = '收起';
                }
            })

            u.on(searchbtn, 'click', function() { //检索按钮
                var searchhascondition = domshasvalue();
                if (searchhascondition) {
                    searchflag = true;
                    //ajax请求
                    var searchData = [],
                        login_name = $('#login_name').val(),
                        name = $('#name').val(),
                        login_time = $('#login_time').val();


                    for (var i = 0; i < viewModel.countData.getData().length; i++) {
                        if (login_name == viewModel.countData.getSimpleData()[i].login_name && !name && !login_time) {
                            searchData.push(viewModel.countData.getSimpleData()[i]);
                        } else if (name == viewModel.countData.getSimpleData()[i].name && !login_name && !login_time) {
                            searchData.push(viewModel.countData.getSimpleData()[i]);
                        } else if (login_time == viewModel.countData.getSimpleData()[i].login_time && !login_name && !name) {
                            searchData.push(viewModel.countData.getSimpleData()[i]);
                        } else if (login_time == viewModel.countData.getSimpleData()[i].login_time && viewModel.countData.getSimpleData()[i].login_name == login_name && !name) {
                            searchData.push(viewModel.countData.getSimpleData()[i]);
                        } else if (login_time == viewModel.countData.getSimpleData()[i].login_time && !login_name && viewModel.countData.getSimpleData()[i].name == name) {
                            searchData.push(viewModel.countData.getSimpleData()[i]);
                        } else if (!login_time && login_name == viewModel.countData.getSimpleData()[i].login_name && viewModel.countData.getSimpleData()[i].name == name) {
                            searchData.push(viewModel.countData.getSimpleData()[i]);
                        } else if (!login_name && !name && !login_time) {
                            searchData.push(viewModel.countData.getSimpleData()[i]);
                        }
                    }
                    viewModel.listData.removeAllRows();
                    viewModel.listData.setSimpleData(searchData);
                    var totalCount = searchData.length,
                        totalpages = Math.ceil(totalCount / 10),
                        element = document.getElementById('pagination');
                    var comp = new u.pagination({ el: element, jumppage: true, showState: false });
                    comp.update({ totalPages: totalpages ? totalpages : 0, pageSize: 10, currentPage: 0, totalCount: totalCount ? totalCount : 0 });
                    comp.on('pageChange', viewModel.pageChangeFunc);
                    comp.on('sizeChange', viewModel.sizeChangeFunc);
                } else { //全检索
                    var params = {},
                        querydata = {};
                    querydata.queryType = 'all'; //高级条件检索
                    querydata.pageSize = 10;
                    params.querydata = querydata;
                    params.pageSize = 10;
                    ajaxFunction(params);
                }
            });

            u.on(clearbtn, 'click', function() { //清除按钮
                for (var i = 0; i < inputlen; i++) {
                    if (inputDom[i].value.length > 0) {
                        inputDom[i].value = "";
                        $(inputDom[i]).parent().attr("title", ""); //去掉tooltip
                    }
                }
            })

            u.on(returnbtn, 'click', function() { //清除按钮
                history.back();
            });


        }
    }
    viewModel = u.extend({}, basicDatas, events)

    var searchFunction = function() {
        //检索按钮
        var searchhascondition = domshasvalue();
        if (searchhascondition) {
            searchflag = true;
            //ajax请求
            var searchData = [],
                login_name = $('#login_name').val(),
                name = $('#name').val(),
                token = $('#token').val(),
                login_time = $('#login_time').val();


            for (var i = 0; i < viewModel.countData.getData().length; i++) {
                if (login_name == viewModel.countData.getSimpleData()[i].login_name && !name && !token) {
                    searchData.push(viewModel.countData.getSimpleData()[i]);
                } else if (name == viewModel.countData.getSimpleData()[i].name && !login_name && !token) {
                    searchData.push(viewModel.countData.getSimpleData()[i]);
                } else if (token == viewModel.countData.getSimpleData()[i].token && !login_name && !name) {
                    searchData.push(viewModel.countData.getSimpleData()[i]);
                } else if (token == viewModel.countData.getSimpleData()[i].token && viewModel.countData.getSimpleData()[i].login_name == login_name && !name) {
                    searchData.push(viewModel.countData.getSimpleData()[i]);
                } else if (token == viewModel.countData.getSimpleData()[i].token && !login_name && viewModel.countData.getSimpleData()[i].name == name) {
                    searchData.push(viewModel.countData.getSimpleData()[i]);
                } else if (!token && login_name == viewModel.countData.getSimpleData()[i].login_name && viewModel.countData.getSimpleData()[i].name == name) {
                    searchData.push(viewModel.countData.getSimpleData()[i]);
                } else if (!login_name && !name && !token) {
                    searchData.push(viewModel.countData.getSimpleData()[i]);
                }
            }
            viewModel.listData.removeAllRows();
            viewModel.listData.setSimpleData(searchData);
            var totalCount = searchData.length,
                totalpages = Math.ceil(totalCount / 10),
                element = document.getElementById('pagination');
            var comp = new u.pagination({ el: element, jumppage: true, showState: false });
            comp.update({ totalPages: totalpages ? totalpages : 0, pageSize: 10, currentPage: 0, totalCount: totalCount ? totalCount : 0 });
            comp.on('pageChange', viewModel.pageChangeFunc);
            comp.on('sizeChange', viewModel.sizeChangeFunc);
        } else { //全检索
            var params = {},
                querydata = {};
            querydata.queryType = 'all'; //高级条件检索
            querydata.pageSize = 10;
            params.querydata = querydata;
            params.pageSize = 10;
            ajaxFunction(params);
        }

    };

    //所有ajax请求
    var ajaxFunction = function(params) {
        $.ajaxSetup({ cache: false });
        //分页初始化
        var element = document.getElementById('pagination');
        var comp = new u.pagination({ el: element, jumppage: true, showState: false });
        var url = window.localurl + "session/onlineUsers";
        $.ajax({
            type: "get",
            data: {
                "querydata": JSON.stringify(params.querydata)
            },
            dataType: "json",
            url: url,
            success: function(result) {
                if (!result || result == null) {
                    return;
                }
                if (result.status != 1 && result.msg) {
                    u.alert(result.msg)
                    return
                }
                if (result.onlineUserIds.length > 0) {
                    var pageSize = 10;
                    var totalpages = Math.ceil(parseInt(result.countOnlineUsers) / pageSize);
                    var currentPage = params.pageNum ? params.pageNum : 1;
                    viewModel.listData.removeAllRows();
                    viewModel.countData.setSimpleData(result.onlineUserIds);
                    var data = [];
                    if ((currentPage != totalpages) || (result.countOnlineUsers % pageSize == 0)) {
                        for (var i = (currentPage - 1) * pageSize; i < pageSize * currentPage; i++) {
                            data.push(result.onlineUserIds[i]);
                        }
                    } else {
                        for (var i = 1; i < result.countOnlineUsers % pageSize + 1; i++) {
                            var length = result.onlineUserIds.length;
                            data.push(result.onlineUserIds[length - i]);
                        }
                    }

                    viewModel.listData.setSimpleData(data, { unSelect: true });
                    if (totalpages > 1) {
                        $(".paginate-box").removeClass("hide");
                    } else {
                        $(".paginate-box").addClass("hide");
                    }
                    comp.update({ totalPages: totalpages, pageSize: pageSize, currentPage: currentPage, totalCount: result.countOnlineUsers });

                    comp.on('pageChange', viewModel.pageChangeFunc);
                    comp.on('sizeChange', viewModel.sizeChangeFunc);
                } else {
                    comp.update({ totalPages: 0, pageSize: 0, currentPage: 0, totalCount: 0 });
                    viewModel.listData.removeAllRows();
                    viewModel.listData.createEmptyRow().setSimpleData({ "logdate": "无数据！" })
                }
            }
        })
    };

    var domshasvalue = function() {
        for (var i = 0; i < inputlen; i++) {
            if (inputDom[i].value.length > 0) {
                return true;
            }
        }
        return false;
    }

    var myBrowser = function() {
        var userAgent = navigator.userAgent;
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera";
        } else if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } else if (userAgent.indexOf("Chrome") > -1) {
            return "Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } else if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }; //判断是否IE浏览器
    }

    $(document).on("click", "#logCloseBtn", function(e) {
        $("#logtable tr[id='logtr']").remove();
    });
    return {
        init: function(content) {
            // 插入内容
            content.innerHTML = html;
            window.headerInit($('#onlineUserHead')[0], '在线用户')
            viewModel.pageInit();
            $(".searchinput").keydown(function(e) {
                if (e.keyCode == 13) {
                    searchFunction();
                }
            });
        }
    }
})