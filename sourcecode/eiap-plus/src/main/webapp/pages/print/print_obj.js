var printCtx = "/eiap-plus";
var comp=null;
var viewModal = {
    loadShow:function(){
        try{
            window.parent.loadShow();
        }catch (err){

        }
    },
    loadHide:function(){
        try{
            window.parent.loadHide();
        }catch (err){
            
        }
    },
    tipContent: ko.observable('操作成功！'),
    openTitle: ko.observable('高级查询<i class="uf uf-arrow-down"></i>'),
    delId: ko.observable(''),
    totalPages:ko.observable(0),
    totalCount:ko.observable(0),
    pageIndex:ko.observable(1),
    searchObj:ko.observable({
        name:'',
        code:''
    }),
    tipShow:function(msg,type){
        viewModal.tipContent(msg);
        window.tipContent = u.dialog({
            id: 'tipContentModal',
            content: "#tipContent",
            hasCloseMenu: true
        });
        if(type=='success'){
            window.setTimeout(function(){
                window.tipContent.close();
            },1000);
        }
    },
    tipClose:function(){
        window.tipContent.close();
    },
    loadData: function () {
        try {
            window.freshListModal.close();
        } catch (error) {
            
        }     
        var pageIndex=viewModal.pageIndex();
        var name = $("#name").val();
        var code = $('#code').val();
        var oldName=viewModal.searchObj().name;
        var oldCode=viewModal.searchObj().code;
        if((name!=oldName)||(code!=oldCode)){
            pageIndex=1;
            viewModal.pageIndex(1);
            viewModal.searchObj({
                name:name,
                code:code
            })
        }
        var tenantId = $('#tenantId')[0].value;
        var url = printCtx + '/remote/queryBOByPage?' + 
        'tenantId=' + tenantId+'&startIndex='+(pageIndex-1)+'&count=10&code='+code+'&name='+encodeURIComponent(name)+'&r='+Math.random();
        viewModal.loadShow();
        $.ajax({
            url: url,
            type: 'get',
            success: function (res) {
                viewModal.loadHide();
                if(res.dataResult && res.dataResult.length>0){
                    viewModal.tableData(res.dataResult);
                    $('#printObj .no-data').hide();
                    comp.update({ totalPages: Math.ceil(Number(res.recordCount)/10), pageSize: 10, currentPage: pageIndex, totalCount: res.recordCount*10 });
                }else{
                    viewModal.tableData([]);
                    $('#printObj .no-data').show();

                }
            },
            error: function () {
                viewModal.loadHide();
                viewModal.tipShow('操作失败','error');
            }
        })
    },
    tableData: ko.observable([]),
    editData: ko.observable({
        code: '',
        name: ''
    }),
    openClick: function () {
        if ($('#searchPanel').css('height') == '0px') {
            $('#searchPanel').css('height', 'auto');
            viewModal.openTitle('高级查询<i class="uf uf-arrow-up"></i>');
        } else {
            $('#searchPanel').css('height', '0px');
            viewModal.openTitle('高级查询<i class="uf uf-arrow-down"></i>');
        }

    },
    searchClick: function () {
        viewModal.loadData();
    },
    clearClick: function () {
        $("#name").val('');
        $('#code').val('');
    },
    addClick: function () {
         window.freshListModal = u.dialog({
             id: 'freshListModal',
             content: "#freshList",
             hasCloseMenu: true
         });
        var tenantId = $('#tenantId')[0].value;
        window.open(window.location.protocol+'//'+window.location.host+'/cloud_print_service/print/addbo?tenantId='+tenantId+'&pk_bo=');
    },
    saveClick:function(){
        window.printObjAdd.close();
        var tenantId = $('#tenantId')[0].value;
        var name=$("#saveName").val();
        var code=$('#saveCode').val()
        window.open('http://172.20.8.30:8891/print_service/print/design?tenantId='+tenantId+'&bocode='+code+'&reportName='+name+'&type=48a8206f-6759-431e-bf84-a973935e2fcc');
    },
    cancelClick:function(type){
        window.printObjAdd.close();
    },
    editClick: function (item) {
        window.freshListModal = u.dialog({
            id: 'freshListModal',
            content: "#freshList",
            hasCloseMenu: true
        });
        //跳转到打印
        var tenantId = $('#tenantId')[0].value;
        var code=item.bo_code;
        var name=item.bo_name;
        var pk=item.pk_bo;
        window.open(window.location.protocol+'//'+window.location.host+'/cloud_print_service/print/addbo?tenantId='+tenantId+'&pk_bo='+pk+'#./index');
    },
    delClick: function (pk) {
        viewModal.delId(pk);
        window.printObjDel = u.dialog({
            id: 'printObjModalDel',
            content: "#delModal",
            hasCloseMenu: true
        });
    },
    backClick: function () {
        window.history.go(-1)
    },
    delOk: function () {
        var tenantId = $('#tenantId')[0].value;
        var pk = viewModal.delId();
        var url = printCtx + '/remote/deletebo?tenantId=' + tenantId + '&pk_bo=' + pk;
        viewModal.loadShow();
        $.ajax({
            url: url,
            type: 'get',
            success: function (res) {
                viewModal.loadHide();
                res=JSON.parse(res);
                if(res.deleteResult){
                    viewModal.loadData();
                    window.printObjDel.close();
                    viewModal.tipShow('删除成功！','success');
                }else{
                    window.printObjDel.close();
                    viewModal.tipShow(res.delMsg,'error');
                }
            },
            error: function () {
                viewModal.loadHide();
                window.printObjDel.close();
                viewModal.tipShow('操作失败','error');
            }
        })
    },
    delCancel: function () {
        window.printObjDel.close();
    },
    init:function(){
        $('#tenantId').val(u.getCookie("tenantid"));
        viewModal.loadData();
        var element = document.getElementById("pagination");
        comp = new u.pagination({ el: element,showState:false });
        comp.update({ totalPages: 1, pageSize: 10, currentPage: 1, totalCount: 10 });
        comp.on('pageChange', function(pageIndex) {
            viewModal.pageIndex(pageIndex+1);
            viewModal.loadData();
        });
        $("#printObj").on("keypress","#code,#name",function(event){
            if(event.keyCode == 13){
                viewModal.loadData();
            }
        })
        // comp.on('sizeChange', function(arg) {
        //     console.log('每页显示条数为' + arg[0]);
        // });
    }
}

ko.applyBindings(viewModal, document.getElementById('printObj'));
viewModal.init();