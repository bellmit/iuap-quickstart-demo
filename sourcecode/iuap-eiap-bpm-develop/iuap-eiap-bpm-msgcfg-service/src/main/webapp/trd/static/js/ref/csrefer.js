define(['text!./refIndex.html', 'knockout', 'borderLayout'], function (template, ko) {

    var init = function (refer) {
        var domID = refer.options.id;
        var dataUrl = refer.options.dataUrl;
       	var $dom=refer.options.dom;
		if($dom == null)
			$dom =$("#"+domID);
        var data = $dom.data();

        var refinfo = data.refinfo;
        var refName = refinfo.refName;
        var refType = refinfo.refType;
        var refparam = data.refparam;


        $('.modal').css({"display": "block"});
        $('.modal-dialog').css({"width": "600px", "height": "600px"});
        $('.modal-title').html(refinfo.title);

        $dom.autocomplete({
            width: 200,
            source: [
                {label: 'abc'},
                {label: 'acccc'}
            ],
            select: function (item) {
            }
        });

        var layout = {
            closable: false,
            east__initClosed: true,
            east__size: '80%',
            east__closable: true,
            east__spacing_open: 8,
            east__spacing_closed: 8,
            resizable: true,
            spacing_open: 0,
            spacing_closed: 0,
            west__size: '20%',
            west__minSize: 100,
            west__maxSize: 300,
            north__initClosed: true,
            south__size: 'auto',
            south__resizable: false,
            south__slidable: false
        };

        if ('tree' === refType) {
            var setting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid"
                    }
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "ps", "N": "ps" }
                },
                callback: {
                    onClick: nodeClick
                }
            };


            function nodeClick(event, treeId, treeNode) {

                submit = function (event, treeId, treeNode) {
                    if (this.promise_ && this.promise_.state() === 'pending') {
                        this.promise_.abort()
                    }

                    console.log(ko.toJS(vm));

                    this.promise_ = $.get('/iwebap/iref_ctr/blobRefSearch/' + refName,

                        $.extend(
                            {isIncludeSub: true,
                                isDisabledDataShow: false,
                                pk_group: '0001X1100000000008IZ',
                                pk_user: '1001X210000000000O11',
                                pk_org: '0001X1100000000019Z5',
                                filterCondition: '',
                                condition: treeNode.id,
                                refParam: JSON.stringify(refparam)
                            },refParam, ko.toJS(vm)),
                        function (data) {
                            var ref = {};
                            ref.values = JSON.parse(data)
                            ref_grid.setDataSource(ref);
                        });
                }
                submit(event, treeId, treeNode);

            }

            function searchNode(val) {
                var zTree = $.fn.zTree.getZTreeObj("ref-tree-basic");
                var nodes = zTree.getNodesByParam("isHidden", true);
                zTree.showNodes(nodes);
                nodes = zTree.getNodesByFilter(function (node) {
                    return ((!node.isParent) && node.name.indexOf(val.toUpperCase()) == -1);
                });
                for (var i = 0; i < nodes.length; i++) {
                    zTree.hideNode(nodes[i]);
                }
            }

            $.get('/iwebap/iref_ctr/blobRefClassSearch/' + refName,
                $.extend(
                    {isIncludeSub: true,
                        isDisabledDataShow: false,
                        pk_group: '0001X1100000000008IZ',
                        pk_user: '1001X210000000000O11',
                        filterCondition: '',
                        pk_org: '0001X1100000000019Z5',
                        refParam: JSON.stringify(refparam)
                    }, refparam,ko.toJS(vm)),
                function (data) {
                    var treeDom = $("#ref-tree-basic");
                    var treeData = JSON.parse(data);
                    treeData.push({name: treeDom.attr('rootName'), id: 'null', open: true});
                    $.fn.zTree.init(treeDom, setting, treeData);

                });
        } else if ('list' === refType) {
            layout.west__initClosed = true;
             
            $.get((typeof dataUrl!= "undefined")?dataUrl:'/iwebap/iref_ctr/commonRefsearch/'+ refName,
                $.extend(
                    {isIncludeSub: true,
                        isDisabledDataShow: false,
                        pk_group: '0001X1100000000008IZ',
                        pk_org: refName=='用户'?'':'0001X1100000000019Z5',
                        refParam: JSON.stringify(refparam)
                    }, refparam,ko.toJS(vm)),
                function (data) {
                    var ref = {};
                    ref.values = JSON.parse(data)
                    ref_grid.setDataSource(ref);
                });

        }


        $(".ref-main").layout(layout);

        var ref_grid = $(".ref-grid-body").grid({
            id: 'grid-lyks',
            width: "100%",//宽度
            height: "450",//高度
            editable: true,//是否可修改
            sortable: false,
            showNumCol: true,
            multiSelect: true,
            columns: [
                {
                    field: "refcode",
                    title: "编码",
                    width: 200,
                    sortable: true
                }
                ,
                {
                    field: "refname",
                    title: "名称",
                    width: 250
                }
                ,
                {
                    field: "refpk",
                    title: "pk",
                    visible: false,
                    width: 50
                }
            ],
            transMap: {
                ml_clear_set: '清除设置'
            }

        });


        var viewModel = function () {
            this.refQuery = ko.observable();
            this.treeQuery = ko.observable();
            this.isIncludeSub = ko.observable(true);
            this.isDisabledDataShow = ko.observable(true);
            this.treeQuery.subscribe(function (val) {
                searchNode(val);
            });

        }
        var vm = new viewModel();
        ko.applyBindings(vm ,document.getElementById("uui_ref_modal_dialog"));

        refer.registerSubmitFunc(function () {
            return ref_grid.getSelectRows();
        })
    }
    return {
        template: template,
        init: init
    }
})