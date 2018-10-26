/**
 * 工具模块
 */
define(function (exports, module, require) {
    "use strict";
    var tool = {
        /**
         * 判断输入字符串是否为空
         * @method isStringValid
         * @param  {[type]}      s [传入的字符串参数]
         * @return {Boolean}       [返回bool类型]
         */
        isStringValid: function isStringValid(s) {
            if (typeof s !== 'string') {
                return false;
            }
            return s.trim().length !== 0;
        },
        /**
         * 获取地址参数
         * @param {[type]} name [description]
         */
        getUrlParams: function getUrlParams(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var str = location.href;
            var num = str.indexOf("?");
            str = str.substr(num + 1);
            // var r = window.location.search.substr(1).match(reg);
            var r = str.match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        /**
         *动态添加移除类名
         *@param: (类名，父级节点ID，子节点标签名<也可以是类名，如：.class>)
         */
        addRemoveClass: function addRemoveClass(className, parentNode, childTag) {
            var parent = $('#' + parentNode);
            $(parent).on('click', childTag, function (e) {
                $(parent).find(childTag).removeClass(className);
                $(this).addClass(className);
            });
        },
        /**
         * 获取参照元信息
         * @param  {[type]} dataTable viewModel.formData!!!
         * @param  {[type]} ref_code  [description]
         * @param  {[type]} field     [description]
         * @param  {[type]} ref_param [description]
         * @return {[type]}           [description]
         */
        getRef: function getRef(dataTable, ref_code, field, ref_param) {
            // 设置参照参数
            if (ref_param !== undefined) {
                ref_param = JSON.stringify(ref_param);
            }
            $.ajax({
                type: 'get',
                url: '/uitemplate_web/iref_ctr/refInfo/',
                data: {
                    refCode: ref_code
                },
                dataType: 'json',
                async: false,
                success: function success(res) {
                    res = JSON.stringify(res);
                    dataTable.createField(field, {refmodel: res, refparam: ref_param, translations: 'parent'});
                }
            });
        },
        /**
         * 内部方法，用于联动设置请求参数
         * @method setParam
         */
        setParam: function (domId, paramKey, paramValue) {
            // 设置新的请求参数
            var param = $('div[data-ref="' + domId + '"]').attr('data-refparam');
            param = JSON.parse(param);
            param[paramKey] = paramValue;
            param = JSON.stringify(param);
            $('div[data-ref="' + domId + '"]').attr('data-refparam', param);
        },
        /**
         *
         * @param dataTable datatable
         * @param ref_code  参照类型对应code
         * @param childField 绑定参照的id
         * @param viewModel viewModel
         * @param ele       参照绑定的父级div
         * @param meta_child  具有下级结构的key值
         * @param meta_childchild 最下级key值
         * @param ref_param 附加参数
         */
        getChildRef: function getChildRef(dataTable, ref_code, childField, viewModel, ele, meta_child, meta_childchild, app, ref_param) {
            // 设置参照参数
            if (ref_param !== undefined) {
                ref_param = JSON.stringify(ref_param);
            }
            $.ajax({
                type: 'get',
                url: '/uitemplate_web/iref_ctr/refInfo/',
                data: {
                    refCode: ref_code
                },
                dataType: 'json',
                async: false,
                success: function success(res) {
                    //添加参照多选功能
                    res.isMultiSelectedEnabled = true;
                    res = JSON.stringify(res);
                    var obj = {};
                    obj = {refmodel: res, refparam: ref_param, type: 'string'};
                    //var params = {
                    //    type:'child',
                    //    meta:obj
                    //};
                    //TODO:u.js提供相应方法
                    dataTable.meta[meta_child].meta[meta_childchild].meta[childField] = obj;
                    //dataTable.createField(meta_child + '.' + meta_childchild,params);

                    ////标识有child层
                    //viewModel.meta_translations = 'child';
                    ////child
                    //viewModel.meta_child =meta_child;
                    ////childchild
                    //viewModel.meta_childchild = meta_child+'.'+meta_childchild;
                    //初始化参照赋值
                    var element = $('.input-group', $(ele));
                    app.createComp(element[0], viewModel);
                }
            });
        },
        /**
         *
         * @param obj {type:'get',dataType:'json',url:'sdsd',data:{id:'sds'}||null}
         * @param successCallback
         */
        createLoadingAjax: function (obj, successCallback) {
            return function () {
                $("#LoadingImage").show();
                $("#emptyImage").hide();
                $('#LoadingImage').parent().find('table tbody').hide();
                $.ajax({
                    type: obj.type || 'get',
                    dataType: obj.dataType || 'json',
                    url: obj.url,
                    data: obj.data || null,
                    success: function (res) {
                        $("#LoadingImage").hide();
                        $('#LoadingImage').parent().find('table tbody').show();
                        $('#emptyImage').show();
                        successCallback(res);
                    },
                    //timeout:3000,
                    error: function (e) {
                        if (e.status == 500 && e.responseText == 'Internal Server Error') {
                            $('#emptyImage').show();
                            $('#emptyImage span').html('服务连接错误');
                            $('#emptyImage span').css({'margin-left': '-46px'});
                        }
                        $("#LoadingImage").hide();
                    }
                });
            }();
        },

        /**
         *
         * @param 保存时加载页面
         * @param successCallback
         */
        showLoading: function (id) {
            var htmlStr = '<div class="save-waiting"><img src="../../images/loading.gif" /><span>请稍候...</span></div>';
            if (id) {
                document.getElementById(id).appendChild(tool.makeDOM(htmlStr));
            } else {
                document.body.appendChild(tool.makeDOM(htmlStr));
            }
            htmlStr = '<div class="save-backdrop"></div>';
            if (id) {
                document.getElementById(id).appendChild(tool.makeDOM(htmlStr));
            } else {
                document.body.appendChild(tool.makeDOM(htmlStr));
            }
        },
        hideLoading: function (id) {
            var divs;
            if (id) {
                divs = document.getElementById(id).querySelectorAll('.save-waiting,.save-backdrop');
            } else {
                divs = document.querySelectorAll('.save-waiting,.save-backdrop');
            }
            if (id) {
                for (var i = 0; i < divs.length; i++) {
                    document.getElementById(id).removeChild(divs[i]);
                }
            } else {
                for (i = 0; i < divs.length; i++) {
                    document.body.removeChild(divs[i]);
                }
            }
        },
        makeDOM: function (htmlString) {
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlString;
            var _dom = tempDiv.children[0];
            return _dom;
        },

        /**
         * 给项目中的搜索框添加focus样式
         * @param containerID .默认给容器下面的input和button增加focus修改样式
         * @param options .options可以不传，如果要传，就必须要传{inputID:id,buttonID:id}
         */
        changeFocusStyle: function (containerID, options) {
            var $containerID = $('#' + containerID);
            var $input = options ? $('#' + options.inputID) : $containerID.find('input');
            var $button = options ? $('#' + options.buttonID) : $containerID.find('button');
            $input.focus(function () {
                $input.css('border-color', "#6bcaea");
                $button.css('border-color', "#6bcaea");
                $button.find('i').css('color', "#b4b4b4");
            });
            $input.keypress(function (event) {
                $button.find('i').css('color', "#6bcaea");
                if (event.keyCode == 13) {
                    $button.click();
                }
            });
            $input.blur(function () {
                $input.css('border-color', "#cecece");
                $button.css('border-color', "#cecece");
                $button.find('i').css('color', "#b4b4b4");
            });
        },
        /**
         * 创建打印容器
         * @return {[type]} [printBody：打印内容容器ID（必传），divID：设置创建外层打印容器ID（可不传）]
         */
        printContent: function (printBody, divID) {
            //判断是否隐藏框架左边菜单
            var btnFirst = $('body button')[0];
            var status = $(btnFirst).attr('aria-expanded');
            if (status == 'true') {
                $(btnFirst).click();
            }
            //创建div
            var printDiv = document.createElement('div');
            divID ? divID : 'print-div';
            printDiv.setAttribute('id', divID);
            //设置样式
            printDiv.className = 'print-content';
            //隐藏其他元素
            var children = document.body.children;
            for (var i = 0, j = children.length; i < j; i++) {
                if (children[i].tagName.toUpperCase() != 'SCRIPT' && children[i].tagName.toUpperCase() != 'STYLE') {
                    children[i].style.display = 'none';
                }
            }

            //将打印内容放置新的div
            document.body.appendChild(printDiv);
            var template = $('#' + printBody)[0].cloneNode(true);
            $(printDiv).html(template);

            //打印
            window.print();

            //还原元素
            for (i = 0, j = children.length; i < j; i++) {
                if (children[i].tagName.toUpperCase() != 'SCRIPT' && children[i].tagName.toUpperCase() != 'STYLE') {
                    children[i].style.display = '';
                }
            }

            //移除创建的div
            printDiv.remove();
        },
        /**
         * 创建一个会自动消失的提示语
         */
        fadeOutInfo: function (info) {
            var dom = document.createElement('div');
            $(dom).css({
                'position': 'fixed',
                'top': '10%',
                'left': '50%',
                'margin-left': '-70px',
                'padding': '0 0 0 20px',
                'width': '140px',
                'height': '36px',
                'line-height': '36px',
                'background-color': '#f4fff3',
                'border': '1px solid #c2e5c8',
                'color': '#32aa57'
            });
            var str = '<i style="margin-right: 5px;" class="icon hrfont">&#xe64a;</i>${info}';
            $(dom).html(str);
            document.body.appendChild(dom);
            $(dom).fadeOut(3000);
        },
        /**
         * [dateFormat description] 时间格式校验
         * @param  {[type]} fmt [description]
         * @return {[type]}     [description]
         */
        formateDate: function (date, fmt) {
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },

        /**
         * UI模板联动设置参数
         */
        uiSetParam: function (templateModel, code, paramKey, paramValue) {
            if (paramValue !== null && paramValue !== undefined) {
                // 被联动的值需要清空
                templateModel.setItemCodeValue('headform', code, '', '');
                // 设置新的请求参数
                var domId = templateModel.getFieldIdByCode('headform', code);
                domId = 'edit_' + domId;
                var param = $('div#' + domId).find('div').first().attr('data-refparam');
                param = JSON.parse(param);
                param[paramKey] = paramValue;
                param = JSON.stringify(param);
                $('div#' + domId).find('div').first().attr('data-refparam', param);
            }
        },
        /**
         * placeholder
         * @param  {[type]} str   [需要展示的字符]
         * @param  {[type]} color [颜色]
         * @return {[type]}       [description]
         */
        placeholderShiv: function (str, color) {
            var isInputSupported = 'placeholder' in document.createElement('input');
            color = color || 'red';
            if (isInputSupported) {
                return;
            } else {
                var inputArr = $('input[placeholder]');
                $.each(inputArr, function (k, v) {
                    v = ($(v).attr('placeholder')).trim();
                    $(this).val(v);
                    if (v == str) {
                        $(this).attr({style: "color:red;background-color:#fff"});
                    }
                });
                $('input').on('focus', function () {
                    var $this = $(this);
                    if ($this.attr('placeholder') === $this.val()) {
                        $this.val('');
                        $this.attr('style', 'color:""');

                    } else {
                        $this.attr('style', 'color:""');
                    }
                    $(this).attr({style: "background-color:#fff"});
                });
                $('input').on('blur', function () {
                    var $this = $(this),
                        trimVal = $this.val().trim(),
                        plhVal = $this.attr('placeholder');
                    if (trimVal === '') {
                        if (plhVal == str) {
                            $(this).attr('style', 'color:' + color);
                        } else {
                            $this.attr('style', 'color:""');
                        }
                        $this.val(plhVal);
                    } else {
                        $this.attr('style', 'color:""');
                    }
                    $(this).attr({style: "background-color:#fff"});
                });
            }
        },
        
        /**
         * 控制下拉框不可手动录入,只能删除
         */
        comboboxInit: function comboboxInit() {
            var comboboxProto = u.Combo.prototype;
            var oldInitFun = comboboxProto.init;
            comboboxProto.init = function () {
                oldInitFun.apply(this, arguments);
                var self = this;
                this.onlySelect = true;
                if (this.onlySelect) {
                    u.on(this._input, 'keydown', function (e) {
                        if (e.keyCode === 8 || e.keyCode === 46) {

                            self.value = '';
                            self._input.value = '';
                            self._updateItemSelect();
                            self.trigger('select', {value: this.value});
                        } else {
                            e.returnValue = false;//禁止其他键输入

                        }

                    });

                    u.on(this._input, 'input', function (e) {
                        var selectLi = self._ul.querySelector('li.is-selected');
                        if (selectLi) {
                            e.target.value = selectLi.innerText;
                        } else {
                            e.target.value = "";
                        }

                        return false;

                    });
                }
            };
        },
        
        //创建遮罩
        createZz: function() {
            var overlayer = document.createElement('div');
            overlayer.id = "conf_overlayer";
            overlayer.style.cssText = "display: yes; position: fixed; top:0%; left: 0%; width:100%; height: 100%; background-color: black; z-index:1090; -moz-opacity: 0.8; opacity:0.0; filter: alpha(opacity=20);";
            document.body.appendChild(overlayer);
            return overlayer;
        },
        
        /**
         * 自定义短暂提示框
         * 调用方式shortMessage("提示信息",1000);
         * @param msg：提示消息
         * @param duration:显示时间,单位为毫秒
         */
        shortMessage: function(msg, duration) {
            var maindiv = document.createElement('div');
            maindiv.id = "conf_window";
            var tempmsg = '<div id="shortMsgdiv">' + msg + '</div>';
            maindiv.innerHTML = tempmsg;
            //将生成的div添加到body中
            document.body.appendChild(maindiv);
            var width = $('#shortMsgdiv')[0].offsetWidth;
            document.body.removeChild(maindiv);

            width = document.body.clientWidth / 2 - width / 2 - 40;
            duration = isNaN(duration) ? 3000 : duration;
            var m = document.createElement('div');
            m.innerHTML = '<i id="shortMsg-i" class="hrfont">&#xe64a;</i><span id="shortMsg-span">' + msg + '</span>';
            m.style.cssText = 'padding-left:10px; padding-right:10px; background:#F4FFF3; opacity:1.0; color:#3abe10; height:32px; line-height:32px; text-align:left; border: 1px solid #c2e5c8; position:fixed; top:53px; z-index:1111; left:' + width + 'px;';
            document.body.appendChild(m);

            //添加遮罩层
            var overlayer = tool.createZz();

            setTimeout(function () {
                var d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(function () {
                    document.body.removeChild(m), 
                    document.body.removeChild(overlayer);
                }, d * 1000);
            }, duration);
        },
        
        closeMsg: function(){
            tool.doCancel("conf_window");//加入此行的目的是销毁弹框的div对象
            tool.doCancel("conf_overlayer");
        },
        
        /**
         * 弹框取消按钮事件,销毁弹出的div对象
         * @param val
         */
        doCancel: function(val){
            var rediv = document.getElementById(val);
            document.body.removeChild(rediv);
        },
        
        /**
         * 警告提示框
         * @param msg:提示信息
         */
        warningMessage: function(msg){
            var maindiv = document.createElement('div');
            maindiv.id = "conf_window";
            msg = '<div id="warnmsgdiv">' 
            + '<i class="hrfont warn-i">&#xe63b;</i>' 
            + '<span>' + msg + '</span>' 
            + '</div>' 
            + '<i id="warncloseIco" class="hrfont">&#xe60c;</i>';
            
            maindiv.innerHTML = msg ;
            //将生成的div添加到body中
            document.body.appendChild(maindiv);
            var width = document.body.clientWidth/2 - $('#warnmsgdiv')[0].offsetWidth/2 - 23;
            document.body.removeChild(maindiv);
            maindiv.style.cssText='padding-top:0px; background:#fffef0; opacity:1.0; color:#000; height:34px; line-height:34px; text-align:left; position:fixed; top:53px; z-index:1111; border: 1px solid #F5CD87; left:' + width + 'px;';
            document.body.appendChild(maindiv);
            //添加遮罩层
            tool.createZz();
            $('#warncloseIco').on('click',function(){
                this.closeMsg();
            }.bind(this));
        },
        
        /**
         * 错误提示框
         * @param {Object} msg:错误提示信息
         * @param {Object} title:提示框标题
         */
        errorMessage: function(msg, title){
            var temptitle = null;
            if (title !== null && title !== undefined && title.length > 0) {
                temptitle = title + '<br/>';
            }else{
                temptitle = '';
            }
            var maindiv = document.createElement('div');
            maindiv.id = "conf_window";
            var tempmsg = '<div id="msgdiv" style="text-align: center; height:32px; line-height:32px; z-index:133; float: left;">' + msg + '</div>';
            maindiv.innerHTML = tempmsg ;
            //将生成的div添加到body中
            document.body.appendChild(maindiv);
            var width = $('#msgdiv')[0].offsetWidth;
            document.body.removeChild(maindiv);
            if(width < 450){
                //如果提示内容长度小于450px则调用errtoMsg1方法,显示内容为一行
                tool.errorMsg1(title, msg, width);
            }else{
                tool.errorMsg2(temptitle, msg, width);
            }
        },
        
        errorMsg1: function(title, msg, width){
            width = document.body.clientWidth/2 - width/2 - 55;
            var maindiv = document.createElement('div');
            maindiv.id = "conf_window";
            msg = title + "&nbsp;&nbsp;"+ msg;
            msg = '<div id="errMsgdiv"><i class="hrfont">&#xe63b;</i><span>' + msg + '</span></div><i id="errCloseIco" class="hrfont">&#xe60c;</i>';
            maindiv.innerHTML = msg ;
            maindiv.style.cssText='padding-top:0px; background:#fff6f7; color:#000; height:34px; line-height:34px; text-align:left; position:fixed; top:53px; border: 1px solid #F5CD87; z-index:1111; left:' + width + 'px;';
            //将生成的div添加到body中
            document.body.appendChild(maindiv);
            //添加遮罩层
            tool.createZz();
            $('#errCloseIco').on('click',function(){
                this.closeMsg();
            }.bind(this));
        },
        
        errorMsg2: function(title, msg, width){
            var maindiv = document.createElement('div');
            maindiv.id = "conf_window";
            width = document.body.clientWidth/2 - 200;
            msg = title + msg;
            var head = '<div id="outerdiv"><div class="icon-div"><i class="hrfont">&#xe63b;</i></div><div class="msg-div">' + msg +'</div><div class="clo-icon-div"><i id="closeIco" class="hrfont">&#xe60c;</i></div></div>';
            msg = head; 
            maindiv.innerHTML = msg ;
            maindiv.style.cssText = 'padding-top:0px; background:#fff6f7; opacity:1.0; color:#000; line-height:34px; text-align:left; position:fixed; border: 1px solid #f8aea9; top:53px; z-index:1111; left:' + width + 'px;';
            //将生成的div添加到body中
            document.body.appendChild(maindiv);
            
            //添加遮罩层
            tool.createZz();
            $('#closeIco').on('click',function(){
                this.closeMsg();
            }.bind(this));
        },
        
        confirmDialog: function(options){
            var title,msg, okText,cancelText,template,onOk,onCancel;
            msg = options['msg'] || "";
            title = options['title'] || "确认";
            okText = options['okText'] || "确定";
            cancelText = options['cancelText'] || "取消";
            onOk = options['onOk'] || function(){};
            onCancel = options['onCancel'] || function(){};
            var colorval = "#039BE5";
            
            
            //确认框
            var confirmDialogTemplate = '<div class="u-msg-dialog" id="u-confirm-dialog">'+
                '<div class="u-msg-title confirm-title">'+
                    '<div id="titleDiv" class="title">{title}</div>'+
                    '<div id="cloDiv" class="closediv"><i id="closeIco" class="hrfont closeicon">&#xe60c;</i></div>'+
                '</div>'+
                '<div class="u-msg-content">'+
                '<p>{msg}</p>'+
                '</div>'+
                '<div class="u-msg-footer"><button id="cancelbtn" style="border-radius: 4px;height: 30px;line-height: 30px;padding: 0;color:#039BE5;border-color:#039BE5;" class="u-msg-cancel u-button">{cancelText}</button><button id="okbtn" class="u-msg-ok u-button" style="background:' + colorval + ';border-radius: 4px;height: 30px;line-height: 30px;padding: 0;">{okText}</button></div>'+
                '</div>';    
            
            template = options['template'] || confirmDialogTemplate;
        
            template = template.replace('{msg}', msg);
            template = template.replace('{title}', title);
            template = template.replace('{okText}', okText);
            template = template.replace('{cancelText}', cancelText);
        
            var msgDom = tool.makeDOM(template);
            var okBtn = msgDom.querySelector('.u-msg-ok');
            var cancelBtn = msgDom.querySelector('.u-msg-cancel');
            new u.Button({el:okBtn});
            new u.Button({el:cancelBtn});
            u.on(okBtn, 'click', function(){
                if (onOk() !== false) {
                    document.body.removeChild(msgDom);
                    document.body.removeChild(overlayDiv);
                }
            });
            u.on(cancelBtn, 'click', function(){
                if (onCancel() !== false) {
                    document.body.removeChild(msgDom);
                    document.body.removeChild(overlayDiv);
                }
            });
            
            var overlayDiv = u.makeModal(msgDom);
            document.body.appendChild(msgDom);
        
            this.resizeFun = function(){
                var cDom = msgDom.querySelector('.u-msg-content');
                if (!cDom) return;
                cDom.style.height = '';
                var wholeHeight = msgDom.offsetHeight;
                var contentHeight = msgDom.scrollHeight;
                if(contentHeight > wholeHeight && cDom)
                    cDom.style.height = wholeHeight - (56+46) + 'px';
        
            }.bind(this);
        
            this.resizeFun();
            $('#closeIco').on('click',function(){
                document.body.removeChild(msgDom);
                document.body.removeChild(overlayDiv);
            }.bind(this));
        }

    };

    return tool;
});