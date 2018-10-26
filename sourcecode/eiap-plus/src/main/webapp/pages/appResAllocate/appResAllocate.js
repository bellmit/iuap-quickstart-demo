var models = [
  "text!./appResAllocate.html",
  "./meta.js",
  "css!./productmgr.css",
  "../../config/sys_const.js",
  "css!../../style/style.css",
  "css!../../style/widget.css",
  "css!/uitemplate_web/static/css/ref/ref.css",
  "css!/uitemplate_web/static/css/ref/jquery.scrollbar.css",
  "css!/uitemplate_web/static/trd/bootstrap-table/src/bootstrap-table.css",
  "css!/uitemplate_web/static/fontIcon/iconfont.css",
  "reflib",
  "refer",
  "refGrid",
  "refGridtree",
  "refTree",
  "refcommon",
  "uiReferComp"
];
define(models, function(html) {
  "use strict";
  //,'uiReferComp','refer'
  /*require('/uitemplate_web/static/js/uiref/reflib.js');
		    require('/uitemplate_web/static/js/uiref/refer.js');
		    require('/uitemplate_web/static/js/uiref/refGrid.js');
		    require('/uitemplate_web/static/js/uiref/refGridtree.js');
		    require('/uitemplate_web/static/js/uiref/refTree.js');
		    require('/uitemplate_web/static/js/uiref/refcommon.js');
		    require('/uitemplate_web/static/js/uiref/uiReferComp.js');*/

  var app, viewModel, basicDatas, events, treeSetting, oper;
  window.appCtx = "/eiap-plus";
  function getClickList(funcCode){
    $.ajax({
      type: "get",
      url:
        "/eiap-plus/resourceAllocate/getEnableBpm?funcCode=" +funcCode,
      dataType: "json",
      contentType: "application/json ; charset=utf-8",
      success: function(result) {
        var enableBpm = result.detailMsg.data;
        viewModel.activityData.setValue("enableBpm", enableBpm);
      }
    });
    var data={
      pageSize:999,
      pageIndex:0
    }
    $.ajax({
      type: "get",
      url:
        "/eiap-plus/resourceAllocate/list?search_funccode=" + funcCode,
      dataType: "json",
      data:data,
      contentType: "application/json ; charset=utf-8",
      success: function(result) {
        var data = result.detailMsg.data.content;
        viewModel.appResAllocateDa.setSimpleData(data);
        viewModel.appResAllocateDa.setAllRowsUnSelect();
        viewModel.appResAllocateDa.setRowUnFocus();
      }
    });
  }
  treeSetting = {
    view: {
      showLine: false,
      autoCancelSelected: true,
      selectedMulti: false
    },
    check: {
      chkboxType: { Y: "ps", N: "ps" }
    },
    callback: {
      onClick: function(e, id, node) {
        viewModel.setCurrentRow(node.id); // 设置选中行
        var isleaf = viewModel.treeData.getCurrentRow().getSimpleData().isleaf;
        if ("Y" == isleaf) {
          viewModel.gridStatus("init");
          //							$("#dicttype_list_button_2 button").css("display","block");
        } else if ("N" == isleaf) {
          viewModel.gridStatus("read");
        }
        getClickList(node.funcCode);
      }
    }
  };
  basicDatas = {
    treeSetting: treeSetting,
    treeData: new u.DataTable({
      meta: {
        id: {
          type: "string"
        },
        parentId: {
          type: "string"
        },
        isleaf: {
          type: "string"
        },
        funcCode: {
          type: "string"
        },
        funcName: {
          type: "string"
        }
      }
    }),
    activityData: new u.DataTable({
      meta: {
        funcCode: {
          type: "string"
        },
        funcName: {
          type: "string"
        },
        enableBpm: {
          type: "string"
        },
        id: {
          type: "string"
        }
      }
    }),
    appResAllocateDa: new u.DataTable(AppResAllocatemeta),
    gridStatus: ko.observable("read"),
    restypeComItems: [
      {
        value: "print",
        name: "打印"
      },
      {
        value: "bpm",
        name: "流程"
      }
    ]
  };
  events = {
    searchClick: function() {
      var funcName = window.encodeURI($("#searchtxt").val());
      $.ajax({
        type: "get",
        url:
          "/wbalone/security/extfunction/page?page.size=1000&search_LIKE_funcName=" +
          funcName,
        dataType: "json",
        contentType: "application/json ; charset=utf-8",
        success: function(data) {
          var data = data["content"];
          viewModel.treeData.setSimpleData(data);
          viewModel.activityData.setSimpleData(data);
          viewModel.activityData.setAllRowsUnSelect();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          errors.error(XMLHttpRequest);
        }
      });
    },
    setCurrentRow: function(id) {
      // 设置选中行
      var allrow = viewModel.activityData.getAllRows();
      if (allrow && id) {
        for (var i in allrow) {
          var row = allrow[i];
          if (row instanceof u.Row)
            if (row.getValue("id") == id) {
              viewModel.activityData.setRowSelect(row);
            }
        }
      }
    },
    addClick: function() {
      var row = viewModel.activityData.getCurrentRow();
      if (row != null) {
        if (row.getSimpleData().id.length == undefined) {
          u.messageDialog({
            msg: "请先选择功能节点",
            title: "提示",
            btnText: "OK"
          });
          return;
        }
      } else {
        u.messageDialog({
          msg: "请先选择功能节点",
          title: "提示",
          btnText: "OK"
        });
        return;
      }
      viewModel.gridStatus("edit");
      oper = "add";
      //document.getElementById("funcaction_zhezhao").style.display ="block";//树遮照
      // 增加时，付默认值
      var funcCode = viewModel.activityData.getCurrentRow().getSimpleData()
        .funcCode;
      var pid = viewModel.activityData.getCurrentRow().getSimpleData().id;
      var r = viewModel.appResAllocateDa.createEmptyRow();
      viewModel.appResAllocateDa.setRowFocus(r);
      viewModel.appResAllocateDa.setValue("funccode", funcCode); // 用于显示
      viewModel.appResAllocateDa.setValue("funcid", pid); // 用于保存
      viewModel.appResAllocateDa.setValue("restype", "bpm");
    },
    editClick: function() {

      if (viewModel.appResAllocateDa.getCurrentRow()==null) {
        u.messageDialog({
          msg: "请选择一行操作数据",
          title: "提示",
          btnText: "OK"
        });
        return;
      }
      viewModel.aa = viewModel.appResAllocateDa.getCurrentRow().rowId; // getSimpleData().id;
      //					viewModel.appResAllocateDa.setEnable(true);// 设置可编辑
      //document.getElementById("funcaction_zhezhao").style.display ="block";//树遮照
      viewModel.gridStatus("edit");
      oper = "edit";
    },
    delClick: function() {
      var row = viewModel.appResAllocateDa.getCurrentRow();
      if (row == null) {
        u.messageDialog({
          msg: "请选择要删除的数据",
          title: "提示",
          btnText: "OK"
        });
        return;
      }
      u.confirmDialog({
        title: "确认",
        msg: "请确认是否删除选中的数据？",
        onOk: function() {
          $.ajax({
            url: "/eiap-plus/resourceAllocate/del/" + row.getSimpleData().pk,
            type: "DELETE",
            dataType: "json",
            contentType: "application/json ; charset=utf-8",
            success: function(data) {
              viewModel.appResAllocateDa.removeRows(
                viewModel.appResAllocateDa.getSelectedRows()
              );
              getClickList(row.getSimpleData().funccode);
              u.messageDialog({
                msg: "删除成功",
                title: "提示",
                btnText: "OK"
              });
            }
          });
        }
      });
    },
    cancelClick: function() {
      viewModel.gridStatus("read");
      if (oper == "add") {
        oper = "int";
        viewModel.appResAllocateDa.removeRows(
          viewModel.appResAllocateDa.getSelectedRows()
        );
      } else if (oper == "edit") {
        oper = "int";
      }
      //					viewModel.appResAllocateDa.setEnable(false);// 设置可编辑
      document.getElementById("funcaction_zhezhao").style.display = "none"; //树遮照
    },
    saveClick: function(row, e) {
      var result = app.compsValidateMultiParam({ element: $("#gridid")[0] }); //  element:document.querySelector("#gridid")
      if (result.passed == false) {
        u.messageDialog({
          msg: result.notPassedArr[0].Msg,
          title: "操作提示",
          btnText: "确定"
        });
      } else {
          var dat = viewModel.appResAllocateDa.getCurrentRow();
          if (dat.getSimpleData().nodekey.trim().length < 1) {
              var index = viewModel.appResAllocateDa.getCurrentIndex();
              var msg = "第" + (1 + index) + "行:(nodekey)不能为空！"
              u.messageDialog({
                  msg: msg,
                  title: "操作提示",
                  btnText: "确定"
              });
          } else {
              // 新增保存
              if (oper == "add") {
                  $.ajax({
                      type: "POST",
                      url: "/eiap-plus/resourceAllocate/save",
                      dataType: "json",
                      contentType: "application/json ; charset=utf-8",
                      data: JSON.stringify(dat.getSimpleData()),
                      success: function (data) {
                          if (data.success == "success") {
                              getClickList(dat.getSimpleData().funccode);
                              viewModel.gridStatus("read");
                              oper = "int";
                              //											viewModel.appResAllocateDa.setEnable(false);
                              u.messageDialog({
                                  msg: "保存成功",
                                  title: "提示",
                                  btnText: "OK"
                              });
                          } else {
                              u.messageDialog({
                                  msg: data.detailMsg.msg,
                                  title: "提示",
                                  btnText: "OK"
                              });
                          }
                      }
                  });
              } else if (oper == "edit") {
                  // 编辑保存
                  $.ajax({
                      type: "POST",
                      url: "/eiap-plus/resourceAllocate/update",
                      dataType: "json",
                      contentType: "application/json ; charset=utf-8",
                      data: JSON.stringify(dat.getSimpleData()),
                      success: function (data) {
                          if (data.success == "success") {
                              getClickList(dat.getSimpleData().funccode);
                              viewModel.gridStatus("read");
                              //									viewModel.appResAllocateDa.setEnable(false);
                              u.messageDialog({
                                  msg: "修改成功",
                                  title: "提示",
                                  btnText: "OK"
                              });
                              oper = "int";
                          } else {
                              u.messageDialog({
                                  msg: data.detailMsg.msg,
                                  title: "提示",
                                  btnText: "OK"
                              });
                          }
                      }
                  });
              }
              document.getElementById("funcaction_zhezhao").style.display = "none"; //树遮照
          }
      }
    },
    //树搜索事件
    searchclick: function() {
      //alert($("#searchtxt").val());
    },
      //grid参照 编辑
      childGridEditType:function(options){
          var grid = options.gridObj,
              datatable = grid.dataTable,
              viewModel = grid.viewModel,
              field = options.field,

              showField = options.gridObj.getColumnByField(options.field).options.showField,
              element = options.element,
              column = grid.getColumnByField(field);
          //grid控件加上一个是否只读的属性判断
          var referInputReadonly = column.options.editOptions.referInputReadonly;
          var readOnly = 'readonly="readonly"';
          var placeholder = column.options.editOptions.placeholder?column.options.editOptions.placeholder:"";
          var htmlStr = '<div class="input-group date form_date">' +
              '<input  placeholder="'+placeholder+'" class="form-control" type="text" '+readOnly+'/>' +
              '<span class="input-group-addon refer"><span class="fa fa-angle-down"></span></span>' +
              '</div>';

          var refmodel = datatable.getMeta(field,'refmodel');
          var refparam = datatable.getMeta(field,'refparam');

          var refOptions =  column.options.editOptions;
          refOptions['refmodel'] = refmodel;
          refOptions['refparam'] = refparam;
          // songyd3 优先使用已创建的实例，避免重复创建实例
          var ncrefer = grid.gridModel.editComponent[field];
          options.element.innerHTML = '';
          // if(ncrefer instanceof u.NcRefComp) {
          //     if(grid.gridModel.editComponentDiv[field] && grid.gridModel.editComponentDiv[field].length > 0) {
          //         $(options.element).html(grid.gridModel.editComponentDiv[field]);
          //         var referComp = $("#refContainer"+ncrefer.fieldId).data("uui.refer");
          //         referComp.init();
          //         referComp.options.data = [];
          //         if(options.value && options.value != "") {
          //             var pks = options.value.split(",");
          //             var items = referComp.getRefValByPK(pks);
          //             setTimeout(function() {
          //                 referComp.setValue(items);
          //             });
          //         }
          //         referComp.bindFirstEvent();
          //     }
          //     // $(options.element).html($(ncrefer.element).clone(true,true));
          // }
          // else {
          ncrefer = new u.NcRefComp({
              // el:$(element).find('div')[0],
              el:$(htmlStr)[0],
              options: refOptions,
              model:viewModel});
          $(options.element).html($(ncrefer.element));
          grid.gridModel.editComponent[field] = ncrefer;
          grid.gridModel.editComponentDiv[field] = $(ncrefer.element);
          // }
          ncrefer.updateMeta();
          options.gridObj.editComp = ncrefer;

          var rowId = options.rowObj['$_#_@_id'];
          var row = datatable.getRowByRowId(rowId);
          var display
          if (showField){
              display = row.getValue(showField);
          }else{
              display = row.getMeta(field, 'display')	|| '';
          }
          $(element).find('input').val(display);
      },
    enableBPMClick: function() {
      var row = viewModel.activityData.getCurrentRow();
      if (row != null) {
        if (row.getSimpleData().id.length == undefined) {
          u.messageDialog({
            msg: "请先选择功能节点",
            title: "提示",
            btnText: "OK"
          });
          return;
        }
      } else {
        u.messageDialog({
          msg: "请先选择功能节点",
          title: "提示",
          btnText: "OK"
        });
        return;
      }
      var funcCode = viewModel.activityData.getCurrentRow().getSimpleData()
        .funcCode;
      var enableBpm = "Y";
      $.ajax({
        type: "get",
        url:
          "/eiap-plus/resourceAllocate/setEnableBpm?funcCode=" +
          funcCode +
          "&enableBpm=" +
          enableBpm,
        dataType: "json",
        contentType: "application/json ; charset=utf-8",
        success: function(result) {
          if (result.success == "success") {
            viewModel.activityData.setValue("enableBpm", enableBpm);
            u.messageDialog({
              msg: "成功启用",
              title: "提示",
              btnText: "OK"
            });
          } else {
            u.messageDialog({
              msg: result.detailMsg.msg,
              title: "提示",
              btnText: "OK"
            });
          }
        }
      });
    },
    stopBPMClick: function() {
      var row = viewModel.activityData.getCurrentRow();
      if (row != null) {
        if (row.getSimpleData().id.length == undefined) {
          u.messageDialog({
            msg: "请先选择功能节点",
            title: "提示",
            btnText: "OK"
          });
          return;
        }
      } else {
        u.messageDialog({
          msg: "请先选择功能节点",
          title: "提示",
          btnText: "OK"
        });
        return;
      }
      var funcCode = viewModel.activityData.getCurrentRow().getSimpleData()
        .funcCode;
      var enableBpm = "N";
      $.ajax({
        type: "get",
        url:
          "/eiap-plus/resourceAllocate/setEnableBpm?funcCode=" +
          funcCode +
          "&enableBpm=" +
          enableBpm,
        dataType: "json",
        contentType: "application/json ; charset=utf-8",
        success: function(result) {
          viewModel.activityData.setValue("enableBpm", enableBpm);
          if (result.success == "success") {
            u.messageDialog({
              msg: "成功停用",
              title: "提示",
              btnText: "OK"
            });
          } else {
            u.messageDialog({
              msg: result.detailMsg.msg,
              title: "提示",
              btnText: "OK"
            });
          }
        }
      });
    },
    //点击行事件
    rowClick: function(obj) {
      var datatableRowId = obj.rowObj.value["$_#_@_id"];
      var rowOjb = viewModel.appResAllocateDa.getRowByRowId(datatableRowId);
      var status = rowOjb.status;
      var id = rowOjb.rowId;
      var restype = rowOjb.getSimpleData().restype;
      if (restype == "bpm") {
        viewModel.appResAllocateDa.setMeta(
          "pk_res",
          "refmodel",
          JSON.stringify(refinfo["repositoryRef"])
        );
      } else if (restype == "print") {
        viewModel.appResAllocateDa.setMeta(
          "pk_res",
          "refmodel",
          JSON.stringify(refinfo["printTemplate"])
        );
      }
      if (oper == "add" && status == "new") {
        viewModel.appResAllocateDa.setEnable(true);
        return true;
      } else if (oper == "edit" && viewModel.aa == id) {
        viewModel.appResAllocateDa.setEnable(true);
        return true;
      } else {
        viewModel.appResAllocateDa.setEnable(true);
        return false;
      }
    },
    //返回事件
    listBack: function() {
      window.history.go(-1);
      return false;
    }
  };

  viewModel = u.extend(basicDatas, events);

  var getInitData = function() {
    viewModel.gridStatus("read");
    $.ajax({
      type: "get", //extfunctiondefine
      url: "/wbalone/security/extfunction/page?page.size=1000",
      success: function(data) {
        var data = data["content"];
        viewModel.treeData.setSimpleData(data);
        viewModel.activityData.setSimpleData(data);
        viewModel.activityData.setAllRowsUnSelect();
        var funcCode = viewModel.activityData.getCurrentRow().getSimpleData()
          .funcCode;
        $.ajax({
          type: "get",
          url:
            "/eiap-plus/resourceAllocate/getEnableBpm?funcCode=" + funcCode,
          dataType: "json",
          contentType: "application/json ; charset=utf-8",
          success: function(result) {
            var enableBpm = result.detailMsg.data;
            viewModel.activityData.setValue("enableBpm", enableBpm);
          }
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        //errors.error(XMLHttpRequest);
        u.messageDialog({
          msg: "请求发生错误" + XMLHttpRequest,
          title: "提示",
          btnText: "OK"
        });
        return;
      }
    });
  };

  //			去掉pk_res模版的参照逻辑为文本输入框
  viewModel.appResAllocateDa.on("restype.valueChange", function(e) {
    var restype = e.rowObj.getSimpleData().restype;
    if (restype == "bpm") {
      viewModel.appResAllocateDa.setMeta(
        "pk_res",
        "refmodel",
        JSON.stringify(refinfo["repositoryRef"])
      );
    } else if (restype == "print") {
      viewModel.appResAllocateDa.setMeta(
        "pk_res",
        "refmodel",
        JSON.stringify(refinfo["printTemplate"])
      );
    }
  });

  return {
    init: function(content, tabid) {
      content.innerHTML = html;
      $('body').css('overflow','hidden');
      $("#ctxBody").css('height',$('body').height()-41);
      window.headerInit($('#demo-mdlayout .function-head-row')[0],'资源分配');
      window.vm = viewModel;

      app = u.createApp({
        el: "#content",
        model: viewModel
      });
      getInitData();
      $("#demo-mdlayout").on("keyup","#searchtxt",function(event){
        console.log(viewModel)
        if(event.keyCode == 13){
          viewModel.searchClick();
        }
      })
      //					$("#searchtxt").click(function(){
      //						$(this).val("");
      //					})
      //					$("#searchtxt").blur(function(){
      //						if($(this).val() == "" || $(this).val() == "请输入关键词")
      //						$(this).val("请输入关键词");
      //					})

      //					去掉pk_res模版的参照逻辑为文本输入框
      var temp = $("#grid_appResAllocate");
      linkage(temp, viewModel.appResAllocateDa, "funccode", "pk_res");
    }
  };
});
