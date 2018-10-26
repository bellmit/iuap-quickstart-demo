!function ($) {
    "use strict";

    // 工具方法
    // ======================
    function wrapAjax(params) {
        var orignSuccess = params.success;
        params.success = function (data, state, xhr) {
            if (window.processXHRError) {
                if (window.processXHRError(data, state, xhr)) {
                    orignSuccess.call(null, data);
                }
            } else {
                orignSuccess.call(null, data);
            }
        };
        if (window.context) {
            var parm = {};
			try{
				parm.nodepath = window.nodepath;
	            parm.cntparm = JSON.stringify(window.context.parameters);
	            parm.environment = JSON.stringify(window.context.environment);
			}catch (e){}
            $.extend(params.data, parm);
        }

        return $.ajax(params);
    }

	  /**
	   * 一个时间区间防止多次调用
	   * @param {Object} func
	   * @param {Object} wait
	   * @param {Object} immediate
	   */
	  function debounce (func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	
	    var later = function() {
	      var last = _.now() - timestamp;
	
	      if (last < wait && last > 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };
	
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }
	
	      return result;
	    };
	   }
	
	/**
	 * 获取当前页面选中状态的文本
	 */
	function getSelectedText(){
			try {
                if (window.getSelection) {
                        return window.getSelection().toString();
                } else if (document.selection) {
                        return doc.selection.createRange().text;
                }
            } catch (e) {
                /* give up */
            }
            return '';
	}
  
    function objIsEmpty(o) {
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }

    function setLocalStore(refName, refHotData) {
        localStorage.setItem(refName, JSON.stringify(refHotData));
    }

    function getLocalStore(refName) {
        return JSON.parse(localStorage.getItem(refName));
    }

    /**
     * 更新常用数据 
     * @param {Object} refName 参照名称
     * @param {Object} refItems 数组或数组项
     * @param {Object} hotDataSize 容量
     */
    function updateHotData(refName, refItems, hotDataSize) {
        if (!refItems) {
            return;
        }
        var refItemArray = [];
        if (!(refItems instanceof Array)) {
            refItemArray.push(refItems);
        } else {
            refItemArray = refItems;
        }

        var refHotData = getLocalStore(refName) || []; //取出存于本地浏览器里面的数据

        $.each(refItemArray, function (i, refItem) { 
            var old = $.grep(refHotData, function (e) { 
                return e.refpk === refItem.refpk; 
            });
            if (old.length === 0) { //如果refItem数据没有存在于常用数据中，则将此数据count置为1，并将此数据增加到常用数据中
                refItem.count = 1;
                refHotData.push(refItem);
            } else {
                old[0].count = parseInt(old[0].count) + 1;
            }

        });
		//常用数据里面的位置排序，如果b.count - a.count大于0，则把a→b的位置互换为b→a，反之如果小于0，则还是维持原来的排序
        var orderedRefHotData = refHotData.sort(function (a, b) {
            return b.count - a.count;
        });
        if (orderedRefHotData.length >= hotDataSize) { //hotDataSize默认20，如果选中的数据大于20，则从第一个截取到前20个，slice(0,20)
            setLocalStore(refName, orderedRefHotData.slice(0, hotDataSize));
        } else {
            setLocalStore(refName, orderedRefHotData); //将数据保存到本地浏览器的常用数据中
        }
    }

	/**
	 * 递归获取 pnode 的所有父节点
	 * @param {Object} treeData 树数据集
	 * @param {Object} parents  
	 * @param {Object} pnode
	 */
    function getParents(treeData, parents, pnode) {
        var parent = [];
       
        if (pnode && (typeof pnode.pid !== 'undefined')) { //Tree 普通树
            parent = $.grep(treeData, function (e) {
                return pnode.pid === e.id;
            });
        } else {//GridTree 表格树
            parent = $.grep(treeData, function (e) {
                return pnode.id === e.id;
            });
        }

        if (parent.length === 1) {
            parents.unshift(parent[0]);
            if (pnode && (typeof pnode.pid !== 'undefined')) {
                    getParents(treeData, parents, parent[0]);
            } else {
                if (parent[0].pid !== 'null') {
                    getParents(treeData, parents, parent[0]);
                }
            }
        }
        return parents;
    }

	/**
	 * 获取dom控件的(left,top)，内部容器显示到指定位置
	 * @param {Object} obj dom控件
	 * @param {Object} refObj 参照容器
	 */
    function findPos(obj, refObj) {
        var that = obj;
        var refxy = refObj.getRefWH();
		var objx = that.offsetWidth;
        var curleft = obj.offsetLeft || 0; //offsetLeft 是控件相对于父级 左边界的值  //scrollLeft 网页被卷去的左
        var curtop = obj.offsetTop || 0; //offsetTop 是控件相对于父级 上边界的值
        while (obj = obj.offsetParent) {
            curleft += (obj.offsetLeft - obj.scrollLeft);
            curtop += obj.offsetTop;
        }
        var billItemWidth = refObj.billItemWidth || objx;
        var refSize = refxy.width;
		//由于document.documentElement.scrollTop(网页可见内容距离最上面的值,即看不到的值)和document.body.scrollTop在标准模式或者是奇怪模式下都只有一个会返回有效的值，所以都加上也不会有问题,适配不同浏览器
        var scrollHeight = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		//refxy.height + curtop - scrollHeight是参照容器本身+obj距离最上面的值-网页可见内容距离最上面的值，document.documentElement.clientHeight 网页可见区域高,document.documentElement.clientWidth 网页可见区域宽 
        var isOverflowing =  curtop - scrollHeight > document.documentElement.clientHeight; 
		//curleft + refSize 是参照容器距离左边的值加上本身的值
        var isOverX = curleft + that.offsetWidth > document.documentElement.clientWidth;
        var isOverXplace = curleft + refSize > document.documentElement.clientWidth; //old
		var isOverflowingplace =curtop - scrollHeight > refxy.height; //input框距离可见网页最下面的值小于参照本身的高度，如果小于则参照显示在input框上面，否则显示在下面
			
        return {
            x: isOverX ? curleft - refSize + billItemWidth : curleft,
            y: isOverflowing ? curtop - refxy.height - $(that).innerHeight() - 2 : curtop,
            //x1: isOverXplace ? curleft - refSize + billItemWidth : curleft,
            x1: isOverXplace ? (curleft - refSize + billItemWidth)<0 ? 50 : curleft - refSize + billItemWidth : curleft,
            y1: isOverflowingplace ? curtop - refxy.height - $(that).innerHeight() - 2 : curtop,
			y2:curtop,
			x3:$(window).width() - refxy.width >0 ? ($(window).width() - refxy.width)/2 : 50,
			y3:$(window).height()- refxy.height >0 ? ($(window).height() - refxy.height)/2 + scrollHeight: 50+scrollHeight	
        };
    }

    function arrayUniqBy(a, key) {
        var seen = {}; //装item值的集合
        var out = [];
        var len = a.length;
        var j = 0;
        for (var i = 0; i < len; i++) {
			if (typeof a[i] !== 'undefined') {
				var item = a[i][key];
				//如果是新数据进来，则把新数据放到out数组里面，且这个数据对应的seen集合里面为1，下次如果有相同的这条数据时，则不会走到if里面，因为seen集合已经有这条数据了，值为1，那么也不会加到out数组里面
				if (seen[item] !== 1) {
					seen[item] = 1;
					out[j++] = a[i];
				}
			}
        }
        return out;
    }
	
    function isArrayEq(s,t){
        if (!s||s.length != t.length) {
            return false;
        }
        var a = s.sort(), b = t.sort();
        for (var i = 0; t[i]; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    };
	//已选择  里面的移除按钮(X)
    function operateFormatter(value, row, index) {
        return [
            '<a class="remove" href="javascript:void(0)" title="移除">',
            '<i class="ref-remove"></i>',
            '</a>'
        ].join('');
    }
	/**
	 * 获取dom 节点属性值，无缓存(区别$.data())
	 * return json
	 * @param {Object} elem dom元素
	 * @param {Object} key
	 * @param {Object} data
	 */
	function dataAttr( elem, key, data ) {
		var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,rmultiDash = /([A-Z])/g;
		  if ( data === undefined && elem.nodeType === 1 ) {
			var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
			data = elem.getAttribute( name );
			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch( e ) {}
			} else {
				data = undefined;
			}
		}
		return data;
	}


    var referUUIDMaker = ((function(uuidRegEx, uuidReplacer){
        return function(){
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    })(/[xy]/g, function(c){
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    }));

	/**
	 * 模板辅助函数
	 */
    var viewHelper = {
        notLeafSelected: false,
		//树的样式
        navName: function (isLast,ctx) {
            return isLast ? '' : '<img src="'+ctx+'/static/images/canzhao_1.png" class="folder" style="width: 7px;height: 10px;vertical-align: baseline;">';
        },
		//非叶节点(父节点)是否选中
        notLeafSelectedclass: function () {
            return this.notLeafSelected;
        },
		//tips提示
		getCustomizeTips:function(item){
			return item.refcode+':'+item.refname;
		}
    };
	
	/**
	 * 异步，防止事件阻塞
	 * @param {Object} that
	 * @param {Object} eventName
	 */
	function referFireEvent (that,eventName){
		that.$el.closest(".queryAreaItem .refer-value[data-type='5']").trigger(eventName);
	}
    // Refer Class
    // ======================

    var Refer = function (el, options) {
        this.options = options;
		this.ajax = wrapAjax;
        this.$el = this.options.wrapRefer.contentEle||el;
		this.referUUID=referUUIDMaker();
		this.isLocalModel=false;
		if(this.options.data.length>0){
				this.isLocalModel=true;
		}
		if(this.options.isBillType||this.isLocalModel){//指定数据集(列表与树)
	        this.init(); //初始化
		}else{
			this.getRefInfo(this.init);
		}
    };
	/*
	 * 导出给外部使用的方法
	 */
	Refer.exports = {
			updateHotData:updateHotData,
			getParents:getParents,
			findPos:findPos,
			operateFormatter:operateFormatter
	};
	/**
	 * 数据模型，参数对应RefViewModel.java里面的属性
	 */
    Refer.DEFAULTS = {
		isEnable:true,
		isBillType: true,//否则是Bill
        ctx: undefined,//请求上下文
        cfg_pk_org: '',
        isOrgRefer: false,//是否是组织参照
        isMaintenanceDocAddEnable: false,//维护档案新增按钮
        isquerytpl:false,//是否是查询模板
        wrapRefer: undefined,//控件wrap
        defaultFieldCount:2,//默认显示字段中的显示字段数----表示显示前几个字段
        isClickToHide: true,//当弹出模式，点击时是否自动关闭
        refInput: undefined,//指定input时，有模糊过滤
        refUIType: 'CommonRef',//参照样式类型
        isClassDoc: false,//档案列表(分类只有一个层级,对应树只有一个可展开节点)
        isZtreeStyle:true,//单选树，ztree样式
        autoCheck: true,//是否自动检查
        focusShowCode: false,//获取焦点后是否显示Code
        refName: undefined,
        refCode: undefined,
        refModelClassName: undefined,//自定义参照模型类
        refModelHandlerClass: undefined,//参照后端业务切入处理类
        refModel: {},//参照配置集合
        selectedVals: [],//多选的值
		values: [],//参照选择结果
        rootName: undefined,//根节点名称
        isRootCheckEnabled: false,//根节点可选
        isReturnCode: false,//input框显示编码
        isNotLeafSelected: true,//非叶子节点是否可选(默认为true 父节点可以选择)
        isMultiSelectedEnabled: false, //是否多选标志,默认单选
        isCheckListEnabled: true, //焦点进入是否显示搜索的数据，默认显示
        refTempl: undefined,//参照容器模板
        isClearData:false,
        hotDataSize: 20,
        pageSize: 50,
        cache: true,
        refModelUrl:{},
        data: [],
        classData: [],//分类数据集
        getRefHotDataKey: function () {
            var userinfo = window.context  ? window.context.userinfo : window.iweb ? iweb.Core.getEnvironment().usercode:{userid:''};
            var pk_org = this.getPKOrg();
            
            if (this.isOrgRefer) {//TODO:当前参照自己是组织，则不需要这个纬度
                pk_org = '';
            }
            return this.refName + this.refCode + '-' + (userinfo && userinfo.groudid) + '-' + (userinfo && userinfo.userid) + '-' + pk_org;
        },
		getCustomizeTips:function(item){
			return item.refcode+':'+item.refname;		
		},
        getClientParam: function () {
            var param = this.options.dataOfdom.attr('data-refparam');
            var ret = '';
            if (param && "" !== param) {
                ret = param;
            }
            this.lastClientParam = ret;

            return ret;
        },
		getCfgParam: function () {
            var param = this.options.dataOfdom.attr('data-refcfg');
            var ret = '';
            if (param && "" !== param) {
                ret = param;
            }
            return ret;
        },
        /*
         * 后端对结果集过滤
         */
        getFilterPKs: function () {
            var filterPksVal;
	        if(typeof this.options.dataOfdom.attr('data-refparam') !== 'undefined'){
			    filterPksVal = JSON.parse(this.options.dataOfdom.attr('data-refparam')).filterPk;
			}
            return this.options.filterPk || filterPksVal || "";
        },
        getPKval: function () {
            var pkVal;
	        if(typeof this.dataOfdom.attr('data-refparam') !== 'undefined'){
			    pkVal = JSON.parse(this.dataOfdom.attr('data-refparam')).pk_val;
			}
            return pkVal || "";
        },
		
		getPageUrl: function () {
            var pageUrl;
	        if(typeof this.dataOfdom.attr('data-refparam') !== 'undefined'){
			    pageUrl = JSON.parse(this.dataOfdom.attr('data-refparam')).pageUrl;
			}
            return pageUrl || "";
        },
        getPKOrg: function () {
            var pk_org;
            if (window.getPKOrg && typeof window.getPKOrg ==='function') {
                pk_org = getPKOrg.call(window);
            }
			var pkOrgRefParam;
			if(typeof this.dataOfdom.attr('data-refparam') !== 'undefined'){
				pkOrgRefParam = JSON.parse(this.dataOfdom.attr('data-refparam')).pk_org;
			}
            return pk_org || this.cfg_pk_org || pkOrgRefParam || '';
        },
        getPageInfo: function (refreshCache) {
            refreshCache = refreshCache || this.refreshCache;
            var ret = {
                'refClientPageInfo.pageSize': ('RefTree' === this.options.refUIType && !this.options.isClassDoc) ? '-1' : this.options.pageSize,
                'refClientPageInfo.currPageIndex': refreshCache ? 0 : (this.pageState[this.pageDefault] ? this.pageState[this.pageDefault].currentPage : -1)
                //'refClientPageInfo.currPageIndex': refreshCache ? -1 : (this.pageState[this.pageDefault] ? this.pageState[this.pageDefault].currentPage : -1)
            };
            this.refreshCache = false;
            return ret;
        },
        onAll: function (name, args) {
            return false;
        },
        onChange: function () {
            return false;
        },
        onLoadSuccess: function (data) {
            return false;
        },
        onLoadError: function (status) {
            return false;
        }
    };
    Refer.EVENTS = {
        'all.uui.refer': 'onAll',
		'valueChange.uui.refer': 'onChange',
        'load-success.uui.refer': 'onLoadSuccess',
        'load-error.uui.refer': 'onLoadError'
    };
	//数据初始化
    Refer.prototype.init = function () {
        this.refreshCache = false;
        this.refreshHotCache = false;
        this.needRefresh = false;
        this.hasSyncHotData = false;
        this.isPaging = false;
		
		var $dom = this.options.dataOfdom;
		if(!$dom){
			this.options.dataOfdom=this.$el;
			$dom=this.$el;
		}
		this.lastClientParam = this.options.getClientParam.call(this);
        var data = $dom.data();//TODO:data()有缓存，获取此dom里面data-开头的属性信息，data()是jQuery内部方法
        var refmodel = data.refmodel;
        var refcfg = data.refcfg;
		var isquerytpl =data.isquerytpl;
        
        this.options.refModel = refmodel;//保存初始参数
        $.extend(this.options, refmodel);
        $.extend(this.options, refcfg);
		$.extend(this.options, isquerytpl);

        this.options.classData = [];
		this.pageState = [];
        this.initPage('2');//默认初始化全部页签数据(1=常用，2=全部)
        this.bindFirstEvent();
        
		this.initedRefUI = false;
//        if (this.isQuerytpl()) {
//        	this.initRef();
//        } 
    };
    	
    Refer.prototype.initRefUI = function () {
    	this.initedRefUI = true;
    	var refListTpl = this.getContainerTpl(true ,this.options.isquerytpl);
        var refGridTpl = this.getContainerTpl(false,this.options.isquerytpl);
        this.options.refTempl = refListTpl;
        this.options.refTreeTempl = refGridTpl;
        this.$el.html(this.options.refTempl);
        this.pk_org = this.options.getPKOrg();

        this.buildUI();
        this.initToolbar(); //参数容器里面 最下面的一行  确定、取消 或新增 按钮
        this.initSearch(); //自动搜索初始化
        this.initRef();
        this.initSelectedTab(); //初始化已选择列表
    }    

	Refer.prototype.getDefaultLoader = function(){
		return this.$el.find('.tab .ref_class_refresh');
	};
	
	Refer.prototype.setEnable = function(enable){
		this.options.isEnable=enable;
	};
	
	Refer.prototype.isEnable = function(enable){
		return this.options.isEnable;
	};
	/**
	 * 根据参照的名称或自定义类获取配置信息
	 * @param {Object} callback
	 */
	Refer.prototype.getRefInfo=function(callback){
		var that=this;
		that.ajax({
            type: "get",
            url: that.options.ctx + '/iref_ctr/refInfo/',
            data: {
				refName: encodeURIComponent(encodeURIComponent(this.options.refName)),
				refModelClassName: encodeURIComponent(encodeURIComponent(this.options.refModelClassName))
			},
            traditional: true,
            async: true,
            dataType: "json",
            success: function (refmodel) {
				var $dom = that.options.dataOfdom;
				$dom.attr('data-refmodel',JSON.stringify(refmodel));
                 if(callback){
				 	callback.call(that);
				 }
            }
        });
		
	};
	/**
	 * 同步dom的配置参数
	 */
	Refer.prototype.updateOptions = function () {
		var $dom = this.options.dataOfdom;
		var refmodel = dataAttr($dom[0],'refmodel');
        var refcfg   = dataAttr($dom[0],'refcfg');
        $.extend(this.options, refmodel);
        $.extend(this.options, refcfg);
        return this.options;
    };
	Refer.prototype.setFilterPKs = function (pks) {
		var that=this;
		var $dom = this.options.dataOfdom;
			if(!isArrayEq(this.options.filterPk,pks)){
				this.options.filterPk=pks;
				var refcfg = dataAttr($dom[0],'refcfg');
				if(!refcfg){
					refcfg={filterPk:{}};
				}
				refcfg.filterPk=pks;
				$dom.attr('data-refcfg',JSON.stringify(refcfg));
				that.markRefresh(true);
			}
            return this.options.filterPk;
    };
		
    Refer.prototype.getOptions = function () {
        return this.options;
    };
	
	/**
	 * 参照有分类时，会有多个分页对象，否则只有一个全部(2)
	 * @param {Object} pageTabIndex 页签
	 */
    Refer.prototype.initPage = function (pageTabIndex) {
        this.pageDefault = pageTabIndex;
        if (!this.pageState[this.pageDefault]) {
            this.pageState[this.pageDefault] = {
                data: [],
                refreshCache: false,
                firstPage: 0,
                lastPage: null,
                currentPage: 0,
                pageSize: this.options.pageSize,
                totalPages: null
            };
        }
        return this.pageState[this.pageDefault];
    };
    Refer.prototype.initRef = function () {
		if(this.isQuerytpl()){
			this.bindQueryTplEvent();
			this.initSearch();
			this.bindQueryMore();
		}else{
	        if (this.isGridTree()) {
	            this.initGridTree();
	        } else if (this.isTree()) {
	            this.initTree();
	        } else {
	            this.initList();
	        }
		}
    };

	Refer.prototype.getContainerID = function(){
		var id=this.options.wrapRefer.contentId;
		if(typeof(this.$el.attr('id'))!="undefined"&&''===this.$el.attr('id').trim()){
			 id=this.$el.attr('id');
		}else{
			id=this.referUUID;
		}
		return id;
	};

    Refer.prototype.isTableContainer = function () {
        return this.isTable;
    };

    Refer.prototype.getListUrl = function () {
		var ret;
		var that = this;
		var pageUrl = that.options.getPageUrl();
		if(pageUrl && pageUrl!==""){
			ret = pageUrl;
		}else{
	        ret = that.options.ctx + '/iref_ctr/commonRefsearch';
	        if (this.isGridTree() || this.options.isClassDoc) {
	            ret = that.options.ctx + '/iref_ctr/blobRefSearch';
	        }
		}
        return ret;
    };

    Refer.prototype.isGridTree = function () {
        return 'RefGridTree' === this.options.refUIType;
    };

    Refer.prototype.isTree = function () {
        return 'RefTree' === this.options.refUIType;
    };

    Refer.prototype.isGrid = function () {
        return 'RefGrid' === this.options.refUIType;
    };

    Refer.prototype.isList = function () {
        return 'CommonRef' === this.options.refUIType;
    };


    Refer.prototype.markRefresh = function (refresh) {
        this.needRefresh = refresh;
    };

	/**
	 * 业务参数变化时，需要刷新缓存
	 */
    Refer.prototype.checkIsNeedRefreshCache = function () {
        var that = this;
        var lastClientParam = that.lastClientParam;
        var ret = that.options.getClientParam.call(this);
        if (lastClientParam !== ret) {
            that.refreshCache = true;
            that.refreshHotCache = true;
            that.needRefresh = true;
            that.hasSyncHotData = false;
        }
        return that.refreshCache;

    };
    
	/**
	 * 数据是否刷新(清后端缓存必刷新)
	 */
    Refer.prototype.isNeedRefresh = function () {
        var that = this;
        var orgChanged = false;
        var curr_pk_org = that.options.getPKOrg();
        if (that.pk_org === curr_pk_org) {
            orgChanged = false;
        } else {
            that.pk_org = curr_pk_org;
            orgChanged = true;
        }
        that.checkIsNeedRefreshCache();
        return orgChanged || that.needRefresh;
    };
	
	/**
	 * 不是档案类型，隐藏分类展开图标
	 */
	Refer.prototype.hideDeploy = function(){
	   if (!this.options.isClassDoc) {
            this.$el.find('.ref_class_deploy').hide();
        }
	};

    Refer.prototype.initList = function () {
        this.hideDeploy();
        this.bindEvent();
    };

    Refer.prototype.initTree = function () {
        this.hideDeploy();
        this.bindEvent();
    };

    Refer.prototype.initGridTree = function () {
        this.bindEvent();
    };

    /**
     * 组装表格表头数据
     * @param {Object} isMultiSelected
     */
     Refer.prototype.buildTableColumn = function (isMultiSelected) {
         var codes = this.options.strFieldCode;
         var names = this.options.strFieldName;
         var hides = this.options.strHiddenFieldCode;
         var refCodeNamePK = this.options.refCodeNamePK;
         if (refCodeNamePK) {
             var codeField = refCodeNamePK[0];
             var nameField = refCodeNamePK[1];
         }
       var showMaxCount=this.options.defaultFieldCount;
         var cols = [];
          cols.push({
                field: 'refpk',
                title: '主键',
                checkbox: false,
                visible: false
            });
            showMaxCount=showMaxCount+1;
           
         if (isMultiSelected) {
          showMaxCount=showMaxCount+1;
             cols.push({
                 field: 'selected',
                 title: 'selected',
                 checkbox: true,
                 visible: true
             });
         }
         if (codes) {
          var showCount=0;
             $.each(codes, function (i, v) {
                 var isHide = $.inArray(v, hides);
             if(-1===isHide){
                 showCount++;
             }
             //默认显示字段中的显示字段数----表示显示前几个字段
             if(showCount>=showMaxCount){
                 isHide=false;
             }
            
                 if (v === nameField) {
                     v = 'refname';
                 }
                 if (v === codeField) {
                     v = 'refcode';
                 }
                 cols.push(
                     {
                        sortable: true,
                        field: v,
                        title: names[i],
                        visible: isHide
                     }
                 );
             });
         } else {
             cols.push({
                 sortable: true,
                 field: 'refcode',
                 title: '编码'
             });
             cols.push({
			 	 sortable: true,
                 field: 'refname',
                 title: '名称'
             });
         }
  
         return cols;
     };
    /**
     * 组装表格表头数据
     * @param {Object} isMultiSelected
     */
     Refer.prototype.buildSelectTableColumn = function (isMultiSelected,operateEvents) {
         var codes = this.options.strFieldCode;
         var names = this.options.strFieldName;
         var hides = this.options.strHiddenFieldCode;
         var refCodeNamePK = this.options.refCodeNamePK;
         if (refCodeNamePK) {
             var codeField = refCodeNamePK[0];
             var nameField = refCodeNamePK[1];
         }
       var showMaxCount=this.options.defaultFieldCount;
         var cols = [];
          cols.push({
                field: 'refpk',
                title: '主键',
                checkbox: false,
                visible: false
            });
            showMaxCount=showMaxCount+1;
           
         if (isMultiSelected) {
          showMaxCount=showMaxCount+1;
             cols.push({
                field: 'refpk',
                title: '<span class="remove_all">清空</span>',
                events: operateEvents,
                formatter: operateFormatter
             });
         }
         if (codes) {
          var showCount=0;
             $.each(codes, function (i, v) {
                 var isHide = $.inArray(v, hides);
             if(-1===isHide){
                 showCount++;
             }
             //默认显示字段中的显示字段数----表示显示前几个字段
             if(showCount>=showMaxCount){
                 isHide=false;
             }
            
                 if (v === codeField) {
                     v = 'refcode';
                 }
                 if (v === nameField) {
                     v = 'refname';
                 }
                 cols.push(
                     {
                        sortable: true,
                        field: v,
                        title: names[i],
                        visible: isHide
                     }
                 );
             });
         } else {
             cols.push({
                 sortable: true,
                 field: 'refcode',
                 title: '编码'
             });
             cols.push({
			 	 sortable: true,
                 field: 'refname',
                 title: '名称'
             });
         }
  
         return cols;
     };

	/**
	 * 同步校验常用数据，防止无效数据
	 * @param {Object} hotData
	 */
    Refer.prototype.syncHotData = function (hotData) {
        var that = this;
        var validHotData = [];
        var realHotData = [];
        if (hotData && hotData.length > 0 && !that.hasSyncHotData || that.refreshHotCache) {
            var pks = $.map(hotData, function (val, index) {
                return val.refpk;
            });
            validHotData = that.getRefValByPK(pks);
            if (hotData) {
                $.each(hotData, function (index, val) {
                    var nodes = $.grep(validHotData, function (e) {
                        return e.refpk === val.refpk;
                    });
                    if (nodes && nodes.length === 1) {
                        val.count = nodes[0].count;
						realHotData.push(nodes[0]); //检验数据没问题，则存放常用数据
                    }
                });
                setLocalStore(this.options.getRefHotDataKey(), realHotData);
            }
            that.hasSyncHotData = true;
            that.refreshHotCache = false;
        } else if (that.hasSyncHotData) {
            realHotData = hotData;
        }
        return realHotData;
    };
	Refer.prototype.loadFirstShow = function(refreshCache){
		var that = this;
		//第一次加载时 参照 有常用数据时 显示常用，没有则显示 全部
//		if(that.isFirstShowFlag){
//			var hotData = getLocalStore(that.options.getRefHotDataKey());
//			var hasHotData=(hotData && hotData.length > 0);
//			if(hasHotData){
//				that.$el.find('.ul_list1').show();
//	            that.$el.find('.ul_list2').hide();
//				if (that.isTree()) {
//					that.$el.find('.navtree').hide();
//				}
//				that.$el.find('.nav_list1').siblings().removeClass('action');
//				that.$el.find('.nav_list1').addClass('action');	
//			}else{
//				that.$el.find('.ul_list2').show();
//	            that.$el.find('.ul_list1').hide();
//				if (that.isTree()) {
//					that.$el.find('.navtree').show();
//				}
//				that.$el.find('.nav_list2').siblings().removeClass('action');
//				that.$el.find('.nav_list2').addClass('action');
//				if (that.isGrid() || that.isGridTree()) {
//					that.$el.find('.refer_results2 .refer_nav li.nav_list2').trigger('click');//表格分类初始化
//				}
//				if(that.options.isClassDoc || that.isList()){
//					that.$el.find('.refer_results .refer_nav li.nav_list2').trigger('click');
//				}
//			}
//		}
		//参照第一次点击进来显示全部，不再显示常用，常用需要自己切换
		if(that.isFirstShowFlag){
			that.$el.find('.ul_list2').show();
			that.$el.find('.ul_list1').hide();
			that.$el.find('.refer_results > .ul_list2').siblings(':not(".refer_nav")').hide();
			that.$el.find('.refer_results2 > .ul_list2').siblings(':not(".refer_nav")').hide();
			if (that.isTree()) {
				that.$el.find('.navtree').show();
			}
			that.$el.find('.nav_list2').siblings().removeClass('action');
			that.$el.find('.nav_list2').addClass('action');
			if (that.isGrid() || that.isGridTree()) {
				that.$el.find('.refer_results2 .refer_nav li.nav_list2').trigger('click');//表格分类初始化
			}
			if(that.options.isClassDoc || that.isList()){
				that.$el.find('.refer_results .refer_nav li.nav_list2').trigger('click');
			}
		}
		that.isFirstShowFlag=false;
	}

    Refer.prototype.loadClassData = function (refreshCache,searchContent) {
        var that = this;
        !searchContent && (searchContent="");
        that.ajax({
            type: "post",
            url: that.options.ctx + '/iref_ctr/blobRefClassSearch/',
            data: $.extend({content:searchContent}, that.getRefParam(refreshCache)),
            traditional: true,
            async: false,
            dataType: "json",
            success: function (ret) {
                that.options.classData = ret.data;
				//遍历表格树里面左边树节点数据，纠正数据里面根节点的pid
				var dataArray = that.options.classData;
				for(var i=0; i<dataArray.length;i++){
					if(dataArray[i].pid==="null"){
						break;
					}
					var flag = true;
					for(var j=0; j<dataArray.length;j++){
						if(dataArray[i].pid === dataArray[j].id){
							flag=false;
						}
					}
					if(flag){
						dataArray[i].pid="null";
					}
				}
				that.markRefresh(false);
				//参照 有常用数据时 显示常用，没有则显示 全部
				that.loadFirstShow();
            }
        });

    };

	/**
	 * 通过pk获取参照值对象
	 * @param {Object} pks
	 */
    Refer.prototype.getRefValByPK = function (pks) {
        var that = this;
        var ret = [];
		var readonlyParam;
        if( typeof that.options.refInput.attr('readonly') !=='undefined'){
        	readonlyParam = that.options.refInput.attr('readonly');
        }
		var refParam = that.getRefParam(that.refreshHotCache);
		if (pks instanceof Array &&  (refParam.refName !=="undefined"|| refParam.refModelClassName !=="undefined")) {
            that.checkIsNeedRefreshCache();
            that.ajax({
                type: "post",
                url: that.options.ctx + '/iref_ctr/matchPKRefJSON/',
                async: false,
                //data: $.extend({pk_val: pks,readonlyParam:readonlyParam}, that.getRefParam(that.refreshHotCache)),
                data: $.extend({readonlyParam:readonlyParam}, that.getRefParam(that.refreshHotCache,pks)),
                traditional: true,
                dataType: "json",
                success: function (rets) {
                    ret = rets.data;
                }
            });
        }
        return ret;
    };

	/**
	 * 渲染刷新校验常用数据
	 * @param {Object} isClick
	 */
    Refer.prototype.refreshHotData = function (isClick,sysnDataFlag) {
        var that = this;
		var hasRefreshedHotData=false;
        var hotData = getLocalStore(that.options.getRefHotDataKey());
		
		var hasHotData=(hotData && hotData.length > 0);
		if(!hasHotData){
			if (!isClick) {
				if(typeof that.options.dataOfdom.attr('data-refparam') !== 'undefined'){
					//that.$el.find('.nav_list2').trigger('click');
					//that.$el.find('.hotData').hide();
				}
			}
			!(that.isGrid() || that.isGridTree()) && that.$el.find("ul.ul_list1 .noHotDataTips").length==0 && that.$el.find("ul.ul_list1").append('<div class="noHotDataTips">没有数据</div>');
			return hasRefreshedHotData;
		}else{
			that.$el.find("ul.ul_list1 .noHotDataTips").length>0 && that.$el.find("ul.ul_list1 .noHotDataTips").remove();
		}
		
		var validHotData = that.syncHotData(hotData);//有效性校验
		var hasValidHotData=validHotData&&validHotData.length > 0;
		if(!hasValidHotData){
			if (!isClick) {
				that.$el.find('.nav_list2').trigger('click');
				that.$el.find('.hotData').hide();
			}
			!(that.isGrid() || that.isGridTree()) && that.$el.find("ul.ul_list1 .noHotDataTips").length==0 && that.$el.find("ul.ul_list1").append('<div class="noHotDataTips">没有数据</div>');
			return hasRefreshedHotData;
		}else{
			that.$el.find("ul.ul_list1 .noHotDataTips").length>0 && that.$el.find("ul.ul_list1 .noHotDataTips").remove();
		}
		
		if (that.isQuerytpl()) {
			var tplItem = '\
						<% _.each(refList,function(ref,index){%>\
						<li id="<%=ref.refpk%>" title="<%-getCustomizeTips(ref)%>" data-value="<%=ref.refpk%>" data-name="<%=ref.refname%>" data-code="<%=ref.refcode%>"  data-initial="hotData">\
		                        <span><i></i><%-ref.refname%></span>\
		                </li>\
						<% }) %>\
						';
			
			var hotTpl='<li data-initial="hotData" class="curr">常用</li>';
			
			viewHelper.getCustomizeTips=that.options.getCustomizeTips;
			var data = _.extend({refList: validHotData},viewHelper);
			
			var notInited=that.$el.find('.classContainer').find('li[data-initial="hotData"]').length==0;
			if(notInited){
			  that.$el.find('.classContainer').append(hotTpl);
			}
			that.$el.find('ul.valueList').addClass('hotData').html(_.template(tplItem)(data));
			hasRefreshedHotData=true;
			
			setTimeout($.proxy(referFireEvent,that,that,'loaded.refer'),100);//常用数据已经加载，同样标示参照加载完成
		
		}else {
			if (!isClick&&!hasValidHotData) {
				that.$el.find('.nav_list2').trigger('click');
				that.$el.find('.hotData').hide();
			}else {
				if (that.options.isMultiSelectedEnabled) {
					var selecteds = that.getSelections(null,sysnDataFlag);//同步已选
					$.each(validHotData, function(i, v){
						v.selected = $.grep(selecteds, function(e){
							return e.refpk === v.refpk;
						}).length >0;
					});
				}
				
				viewHelper.getCustomizeTips=that.options.getCustomizeTips;
				var data = _.extend({refList: validHotData},viewHelper);
				if (that.isGrid() || (that.isGridTree() && (!that.options.isClassDoc)) ) {
					that.$el.find(".msgtype-table2").bootstrapTable('load', {data: validHotData});
	                that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
				}else{
					that.$el.find('ul.ul_list1').html(_.template(that.getItemTpl())(data));
				}
				hasRefreshedHotData=true;
			}
		}
		(that.isGrid() || that.isGridTree()) && that.uCheckboxInit();
		return hasRefreshedHotData;
    };
    Refer.prototype.isPopModel = function () {
        return this.options.wrapRefer.isPOPMode;
    };
	/**
	 * 移动端标示
	 */
	Refer.prototype.isAppModel = function () {
        return this.$el.attr('data-showType')==='app';
    };
	/**
	 * 查询模板标示
	 */
	Refer.prototype.isQuerytpl = function () {
        return this.options.isquerytpl;
    };
	/**
	 * 内部容器显示到指定位置(refInput)
	 */
    Refer.prototype.place = function () {
        var that = this;
        var $input = that.options.refInput[0];
        if (!$input) {
        	$input = that.options.dataOfdom;
        }
        var pos = findPos($input, that);
        that.$el.find('.outerContainer').css({
//            top: (pos.y1 + $input.offsetHeight) + "px",
//            left: pos.x1 + "px"
            top: pos.y3,
            left: pos.x3
        });
		if(typeof $($input).closest('.modal-content') !=='undefined' && $($input).closest('.modal-content') !== null && $($input).closest('.modal-content').length>0){
			that.$el.find('.outerContainer').css("position","fixed");
		}
    };
	
    Refer.prototype.setValue = function(items,noFocus){
		this.values=items;
	    this.trigger('valueChange',items);
		this.options.wrapRefer.setVal(items,noFocus);
	};

	Refer.prototype.getValue = function(){
		return this.getSelections();
	};
		
	Refer.prototype.refreshUI = function(){
		var that = this;
		if (that.isNeedRefresh()) {
            that.init();
            that.markRefresh(false);
        }
	};
	//焦点移开 check val 
	Refer.prototype.blurEventVal = function () {
		var that = this;
		var $this = $(that.options.refInput);
		var val = $this.val();
		var item = {};
		if (that.options.autoCheck) {
	       if ('' !== val.trim()) {
	    	   if(that.values && !that.isManualInput()){
	    		   return;
	    	   }
		       var toValidVals = val.split(',');
		       if (toValidVals.length > 1) {
		           return;
		       }
		       var valueIndex;
		       var matched;
		       if(val.lastIndexOf("\\")>=0){
		           valueIndex = val.slice(val.lastIndexOf("\\")+1,val.length);
		       }
		       if(valueIndex){
		           matched = that.checkVal(valueIndex.trim());
		       }else{
		           matched = that.checkVal(val.trim());
		       }
		       if (matched.length > 0) {
					if(that.values&&matched.length>1){
						var val=that.values[0];
						var matcheds = $.grep(matched, function (e) {
					                return e.refpk === val.refpk;
					            });
						if(matcheds.length>0){
							item=matcheds[0];
						}else{
							if(val && val.refpk !==""){
								item=val;
							}else{
								item = matched[0];
							}
						}
					}else{
		               item = matched[0];
					}
					
		           that.setValue([item], true);
		           updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
		       } else {
		           $this.val('');
		           item = {};
		           item.refpk = '';
		           item.refname = '';
		           item.refcode = '';
		           that.setValue([item], true);
				   that.uncheckAll();//check fail and clear
		       }
		   } else {
		       $this.val('');
		       item = {};
		       item.refpk = '';
		       item.refname = '';
		       item.refcode = '';
		       that.setValue([item], true);
		   }
	   } else {
	       item = {};
	       item.refpk = val;
	       item.refname = val;
	       item.refcode = val;
	       that.setValue([item], true);
	   }
	}
    Refer.prototype.show = function () {
    	$("body").find(".popWindow").length===0 && $("body").append('<div id="popWindow" class="popWindow" style="display: none;"></div>');
    	$(".popWindow").css("display","block");
        var that = this;
		if(!that.isEnable()){
			return;
		}
//        if (that.isNeedRefresh() && that.initedRefUI) {
//            that.$el.html(that.options.refTempl);
//            that.init();
//            that.initRefUI();
//            that.markRefresh(false);
//        }
        that.isFirstRefreshFlag=false;
		if (!that.initedRefUI) {
			that.initRefUI();
			that.isFirstShowFlag=true; //第一次打开参照的标志位
			that.isFirstRefreshFlag=true; //第一次打开参照刷新的标志位
		}

        if ((!this.isPopModel()) && this.$el.hasClass('active')) { //has showed
            return;
        }
        that.$el.addClass('active');
        that.$el.find('.innerContainer').css("display", "block");
        //$(document).on('click.refer', $.proxy(that.outsideClick, that));
        that.$el.on('mousedown', false);//keep focus
        
        that.$el.off('mouseenter').on('mouseenter',function(){
			that.options.refInput.off('blur');
		});
		that.$el.off('mouseleave').on('mouseleave',function(e){
			that.options.refInput.focus();
			that.options.refInput.next("span").addClass("refpic");
			that.options.refInput.on('blur',function(){
				 that.options.refInput.next("span").removeClass("refpic");
                 that.$el.closest("body").find(".ref_ac_results").css("display","none");//焦点移开隐藏模糊搜索
				 var $input = that.options.refInput;
				 if(e.relatedTarget&&e.relatedTarget.tagName ==='LI'){//ztree.selectNode ignore
				 	return;
				 }
				 if(e.relatedTarget&&e.relatedTarget.tagName ==='A'){ //焦点移开，如果点击x先清空input框的值
				 	$input.parent().find('.clearAuto').trigger('click');
				 }
					$input.parent().find('.clearAuto').css("display","none"); //焦点移开隐藏x清空按钮
                    that.blurEventVal();
                    //uui非空校验
                    var parValidate = $input.parent()[0]['u-meta'];
               	 	parValidate && parValidate.doValidate({trueValue:true,showMsg:true});
			});
		});
		
        if (that.options.isMultiSelectedEnabled) {//sync selectedTab
            that.updateSelectedTab(true);
        }

        if (this.isPopModel()) { //弹出类型 参照
            that.options.wrapRefer.dialog.modal('show');
        } else if(this.isAppModel()){ //app移动端 暂时没用到
            $(window).on('resize', $.proxy(that.place, that));
            that.place();
        }else{
			$(window).on('resize', $.proxy(that.place, that));
            that.place();
		}
		
        if ((that.isGridTree() || that.options.isClassDoc ) && that.options.classData.length === 0) {
            that.loadClassData();//树表分类初始化
        }
        if (that.isTree() && (!that.options.isClassDoc ) && that.options.classData.length === 0) {
            that.loadTreeData();//树分类初始化
        }
		if (that.isList() && that.options.classData.length === 0) {
            //参照 有常用数据时 显示常用，没有则显示 全部
			that.loadFirstShow();
        }
		if (that.isGrid() && that.options.classData.length === 0) {
			//参照 有常用数据时 显示常用，没有则显示 全部
			that.loadFirstShow();
        }
		//that.loadFirstShow();
        var hasClassDocInited = that.$el.find('.refer_nav.tab li.classItem').length > 0;
        if (that.options.isClassDoc && !hasClassDocInited && that.options.classData.length !== 0) {
           
            $.each(that.options.classData, function (i, v) { //mark refreshCache
                v.isRefreshCache = false;
            });
			
			viewHelper.getCustomizeTips=that.options.getCustomizeTips;
			var data = _.extend({refClassList: that.options.classData},viewHelper);
			
            that.$el.find('.refer_nav.tab').append(_.template(that.getClassItemTpl())(data));
        }

        that.refreshHotData(false,true);
		if((that.isGrid() || that.isList()) && !that.isFirstRefreshFlag){
			that.refreshUIData(true); //如果不是第一次打开参照,则刷新数据
		}
		!that.isFirstRefreshFlag && (that.isGrid() || that.isGridTree() || that.isTree()) && that.$el.find('.refer_results2 .refer_nav li.nav_list2.action').trigger('click',true);
		!that.isFirstRefreshFlag && that.isList() && that.$el.find('.refer_results .refer_nav li.nav_list2.action').trigger('click',true);
		//(that.isGrid() || that.isGridTree()) && that.uCheckboxInit();
		
    };

    Refer.prototype.hide = function () {
        var that = this;
        //$(document).off('click.refer', that.outsideClick);
        
        this.$el.removeClass('active');
        that.$el.off('mousedown', false);

        if (this.isPopModel()) {
            that.options.wrapRefer.dialog.modal('hide');
        } else if(this.isAppModel()){
			$.app.closeModal(".picker-modal");
        }else{
			$(window).off('resize', $.proxy(that.place, that));
            that.$el.find('.innerContainer').css("display", "none");
		}
        $(".popWindow").css("display","none");
    };

	/**
	 * 点击参照容器范围之外
	 * @param {Object} e
	 */
    Refer.prototype.outsideClick = function (e) {
			var target = $(e.target);
			var that = this;
			var input;
			var $input = that.options.refInput;
			if (target.hasClass('input-group-addon')) {
				input = target.parent().find('input');
			} else  if (target.hasClass('fa-angle-down')) {
				input = target.parent().parent().find('input');
			}
			if (target.attr('id') === $input.attr('id') ||
			target.parents('.innerContainer').length === 1 ||
			(input && input.attr('id') === $input.attr('id'))) {//noinspection JSHint
			
			}else {
				if (this.isAppModel()) {
					 if ($(e.target).parents('.picker-modal').length === 0){
					 }
				}else{
						that.hide();
				}
			}
    };

    /**
     * 点击分类
     * return 计算后的新位置
     */
    Refer.prototype.reBuilderClassNav = function (clickItemID) {
        var that = this;
        var newClassIndex = -1;
        if (this.isGridTree()) {
            newClassIndex = this.reOrderClassItem(clickItemID);
        } else if (this.isTree() && that.options.isClassDoc) {
            newClassIndex = this.reOrderClassItem(clickItemID);
        }
        return newClassIndex;
    };

	/**
	 * 档案类参照，选中的分类项排到页签最后一位
	 * @param {Object} clickItem
	 */
    Refer.prototype.reOrderClassItem = function (clickItem) {
        if (!clickItem) {
            return -1;
        }
        var that = this;
        var allClaas = that.options.classData;
        var clickItemIndex = -1;
        var item;
        $(allClaas).each(function (i, val) {
            if (val.id === clickItem) {
                clickItemIndex = i;
                item = val;
                return false;
            }
        });

        var baseTop = findPos(that.$el.find('.refer_nav.clx')[0], that).y2;
        var lastClassItem = -1;
        var needwidth = that.$el.find('li[condition=' + clickItem + ']').width();
        var maxLeft = findPos(that.$el.find('.ref_class_more')[0], that).x;
        var lastClassItemWidth = -1;
        var replaceIndex = -1;

        
        $(allClaas).each(function (i, val) {//定位第一列最后一个Item
            var $li = that.$el.find('li[condition=' + val.id + ']');
            var top = findPos($li[0], that).y2;
            //if (top - baseTop === 25) {
            if (top - baseTop === 34) {
                lastClassItem = i - 1;
                lastClassItemWidth = $li.width();
                return false;
            }
        });
		//第一列最后一个Item的索引值
        var lastClassIndex = -1;
		lastClassIndex = lastClassItem;
		
        if ((-1 === lastClassItem) || clickItemIndex <= lastClassItem) {//第一排分类就直接返回
            return -1;
        }
        for (lastClassItem; lastClassItem >= 0; lastClassItem--) {//当前Item的最小宽,计算分类占用几个位置
            var $li = that.$el.find('li[condition=' + allClaas[lastClassItem].id + ']');
            var left = findPos($li[0], that).x;
            var width = $li.width();
            
            //if (maxLeft - left - width >= needwidth) {//展开按钮距离最左边像素offset - 当前元素距离最左边像素offset - 当前元素的宽width
            if (maxLeft - left >= needwidth) {//展开按钮距离最左边像素offset - 当前元素距离最左边像素offset - 当前元素的宽width
                replaceIndex = lastClassItem;
                break;
            }
        }
		//将第一列最后的值 与 点击的值 互换
        var temp = allClaas[replaceIndex];
        allClaas[replaceIndex] = item;
        allClaas[clickItemIndex] = temp;

		viewHelper.getCustomizeTips=that.options.getCustomizeTips;
		
		//每一列加上lastClassIndex属性，值为最后一列的索引值
		$(allClaas).each(function (i, val) {
			val.lastClassIndex = lastClassIndex;
        });
		var data = _.extend({refClassList: allClaas},viewHelper);

        that.$el.find('.refer_nav.tab li.classItem').remove();
        that.$el.find('.refer_nav.tab').append(_.template(that.getClassItemTpl())(data));

        return replaceIndex;
    };

    Refer.prototype.getChildNode = function (treeData, pnode) {
        return $.grep(treeData, function (e) {
            return e.pid === pnode.id;
        });
    };

    Refer.prototype.getRefParam = function (refreshCache,pks) {
		this.updateOptions();
        var getClientParam = this.options.getClientParam;
		var getCfgParam   =  this.options.getCfgParam;
		
        var getPKOrg = this.options.getPKOrg();
        var getPageInfo = this.options.getPageInfo;
        var getFilterPKs = this.options.getFilterPKs;
        var getPKval =  this.options.getPKval();
        if(getPKval!=="" && getPKval instanceof Array){
        	//向后台传递参数时保证一个pk_val传递所有的数组参数，否则数组数据过多时会导致报错参数传不了(pk_val参数会分开传递)
			getPKval = new Array(getPKval.join(",")); 
		}
        if(typeof pks !=='undefined' && pks instanceof Array){
        	getPKval = pks;
        }
        
		var filterPks = getFilterPKs.call(this);
		var filterPksVal = "";
		if(filterPks!=="" && filterPks instanceof Array){
			filterPksVal = new Array(filterPks.join(","));
		}
        return $.extend({}, {
            pk_val:getPKval, //参照处理联动的参数和常用数据根据pks去后台校验，放到refparam里面
			filterPks: filterPksVal,  //过滤参照数据，权限限制某些数据不显示等，放到refcfg里面
			refModelUrl: this.options.refModelUrl || '',
            pk_org: getPKOrg,
            refName: encodeURIComponent(encodeURIComponent(this.options.refName)),
            refCode: encodeURIComponent(encodeURIComponent(this.options.refCode)),
            refModelClassName: this.options.refModelClassName || '',
            refModelHandlerClass: this.options.refModelHandlerClass || '',
            dataPowerOperation_Code: this.options.dataPowerOperation_Code,
			cfgParam:getCfgParam.call(this),
            clientParam: getClientParam.call(this)
        }, getPageInfo.call(this, refreshCache));

    };

	Refer.prototype.renderData = function(ret){
		return ret;
	};
	
	Refer.prototype.loadSuccess = function(pageInfo,refreshCache,clickedIndex,appendData){
		var that=this;
		
		viewHelper.getCustomizeTips=that.options.getCustomizeTips;
        var data = _.extend({refList: pageInfo.data, classIndex: clickedIndex},viewHelper);
        var inited = that.$el.find('ul.ul_list' + clickedIndex).length;
        if (inited === 0 || refreshCache) {
            if(that.isGrid()){
				that.options.data=pageInfo.data;
				that.$el.find(".msgtype-table").bootstrapTable('load', appendData);
                that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
            }else{
            	that.$el.find('ul.ul_list' + clickedIndex).remove();
                that.$el.find('div.ul_list' + clickedIndex).remove();
                that.$el.find('.refer_results').append(_.template(that.getClassWithItemTpl())(data));
            }
        } else {
            that.$el.find('ul.ul_list' + clickedIndex + ' li').remove();
			if (that.isGridTree() && (!that.options.isClassDoc)) {
				that.$el.find(".msgtype-table2").bootstrapTable('load', {data: pageInfo.data});
                that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
			}else if(that.isGrid()){
				that.options.data=pageInfo.data;
				that.$el.find(".msgtype-table").bootstrapTable('append', appendData);
                that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
			}else{
				that.$el.find('ul.ul_list' + clickedIndex).html(_.template(that.getItemTpl())(data));
			}
        }
        that.$el.find('.ul_list2').show();
        that.$el.find('.ul_list1').hide();
        that.$el.find('.nav_list2').siblings().removeClass('action');
        that.$el.find('.nav_list2').addClass('action');
//		if(clickedIndex==='1' || clickedIndex==='2'){
//            that.isFirstShowFlag=false;
//			//参照 有常用数据时 显示常用，没有则显示 全部
//			that.loadFirstShow();		
//		}
	};
	
	
    Refer.prototype.loadData = function (needRefreshCache,searchContent) {
        var that = this;
        var $that = this.selectedTab;
        var clickedIndex, condition;
        !searchContent && (searchContent="");
        that.searchFlag && !searchContent && (searchContent=that.$el.find('.refer_nav li.searchInput input[type="text"]').val());
        if (!$that) {
            clickedIndex = "2";
            condition = '';
        } else {
            clickedIndex = $that.attr('index');
            condition = $that.attr('condition');
        }
        
        var pageInfo = that.initPage(condition);//根据分类初始化分页信息
        var refreshCache = needRefreshCache || false;
		
		if(that.isLocalModel&&that.options.data.length>0){//指定数据集(列表与树)
			 pageInfo.data = that.options.data;
			 that.loadSuccess(pageInfo,refreshCache,clickedIndex);
			return;
		}
		
        var classItems = $.grep(that.options.classData, function (e) {
            return condition === e.id;
        });
        if (classItems && classItems.length === 1 && classItems[0].isRefreshCache) {
            classItems[0].isRefreshCache = false;
            refreshCache = true;
        }
		//url 里面 condition 改为pk的值conditionUrl： classItems[0].refpk
		var conditionUrl=''; 
		if(classItems && classItems.length === 1){
			conditionUrl=classItems[0].refpk;
		}else{
			conditionUrl=condition;
		}
        that.showLoading();
		that.isPaging = true;
        that.ajax({
            type: "post",
			url: that.getListUrl(),
            data: $.extend({condition:conditionUrl,content:searchContent}, that.getRefParam(refreshCache)),
            traditional: true,
            async: true,
            dataType: "json",
            success: function (ret) {
				var res = that.renderData(ret);
				if (refreshCache) {
                    pageInfo.data = ret.data;
                } else {
                    pageInfo.data = pageInfo.data.concat(ret.data);
                }
                that.updatePagination(ret.page);
				
                that.loadSuccess(pageInfo,refreshCache,clickedIndex,ret.data);
                that.trigger('load-success', ret);
				
                that.markRefresh(false);
				if(that.isList() || that.options.isClassDoc){
					that.addScroll(); //添加滚动条
				}
            },
            complete: function () {
                that.hideLoading();
				that.isPaging = false;
				(that.isGrid() || that.isGridTree()) && that.uCheckboxInit();
				//needRefreshCache && (that.isGrid() || that.isGridTree()) && that.uCheckboxInit();
            }
        });

    };

	Refer.prototype.loadQuerySuccess = function(ret,refreshCache,clickedIndex){
			var that=this;
			if(that.isGridTree()){
				var tplItem = '\
							<% _.each(refList,function(ref,index){%>\
							<li id="<%=ref.refpk%>" title="<%-getCustomizeTips(ref)%>" data-value="<%=ref.refpk%>" data-name="<%=ref.refname%>" data-code="<%=ref.refcode%>"  data-initial="<%=ref.refjoin%>">\
			                        <span><i></i><%-ref.refname%></span>\
			                </li>\
							<% }) %>\
							';
						viewHelper.getCustomizeTips=that.options.getCustomizeTips;
						var data = _.extend({refList: ret.data},viewHelper);
						that.$el.find('ul.valueList').append(_.template(tplItem)(data));
			}else if(that.isTree()){
						var tplItem = '\
		                        <% _.each(refTreeNodeList,function(ref,index){%>\
		                              <li class="openLi" title="<%-getCustomizeTips(ref)%>" id="<%=ref.refpk%>" data-value="<%=ref.refpk%>" pk="<%=ref.refpk%>"  data-name="<%=ref.refname%>" data-code="<%=ref.refcode%>" isLeaf="<%=ref.isLeaf%>" >\
		                                 <%=notLeafSelectedclass()?\'<img src="/static/iwebap/images/danxuan_1.png" class="selected" style="float:left;margin-top:4px;width: 16px;height: 16px;">\':""%>\
		                                 <span style="width:118px;padding-left:5px;margin-right: 1px;overflow:hidden;display:block; float:left;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;">\
										 <i></i><%-ref.refname%>\
										 </span>\
										 <%=ref.isLeaf?"":\'<img src="/static/iwebap/images/canzhao_1.png" class="folder" style="float:right;margin-top:7px;width: 7px;height: 12px">\' %>\
		                              </li>\
		                        <% }) %>\
		                     ';
					
						var hasHotData=that.$el.find('ul.valueList').hasClass('hotData');
						var hotTpl=hasHotData?'<li data-initial="hotData">常用</li>':'';
						var navItemTpl = hotTpl+'\
									<% _.each(refTreeNavList,function(ref,index){%>\
						                <li class="<%=(_.size(refTreeNavList)===(index+1))?\'curr\':\'\'%>" pk="<%=ref.refpk%>" data-initial="<%=ref.id%>"><%-ref.refname%><%=navName(_.size(refTreeNavList)===(index+1),"'+that.options.ctx+'") %></li>\
									<% }) %>\
									';
					
					that.$el.find('.navtree').show();
					var treeData = that.options.classData;
					var rootItem = that.getRoot();
					var parents = [];
					getParents(treeData, parents, rootItem);
					parents.push(rootItem);
					var nodes = that.getChildNode(treeData, rootItem);
					
					viewHelper.notLeafSelected = that.options.isNotLeafSelected;
					viewHelper.getCustomizeTips=that.options.getCustomizeTips;
					var data = _.extend({
						refTreeNavList: parents,
						refTreeNodeList: nodes
					}, viewHelper);
					that.$el.find('ul.valueList').append(_.template(tplItem)(data));
					that.$el.find('.classContainer').html(_.template(navItemTpl)(data));
							
					that.$el.find('ul.valueList').on('click', 'li.openLi', function(e){
						var $that = $(this);
						var isLeaf = $that.attr('isLeaf');
						var treeData = that.options.classData;
						var item = that.getNodeByPK($that.attr('pk'));
						if (isLeaf === 'true') {
						
						}
						else {
							var target = $(e.target);
							var clickImg = target.is('img') && target.hasClass('selected');
							
							if (that.options.isNotLeafSelected && clickImg) {//对非叶子节点选择处理
								return;
							}
							var rootItem = item;
							var parents = [];
							getParents(treeData, parents, rootItem);
							parents.push(rootItem);
							var nodes = that.getChildNode(treeData, rootItem);
							
							viewHelper.notLeafSelected = that.options.isNotLeafSelected;
							viewHelper.getCustomizeTips=that.options.getCustomizeTips;
							var data = _.extend({
								refTreeNavList: parents,
								refTreeNodeList: nodes
							}, viewHelper);
							that.$el.find('ul.valueList').html(_.template(tplItem)(data));
							that.$el.find('.classContainer').html(_.template(navItemTpl)(data));
							var moreItemBtn = that.$el.parent().find(".refer-ext > .moreItem");
							
							if (!moreItemBtn.hasClass("opened")) {//选择非叶子，触发展开
								moreItemBtn.trigger('click');
							}
							
						}
					}).on('mouseenter', 'li.openLi', function(){
						var $that = $(this);
						$that.find('img.folder').attr("src", "/static/iwebap/images/canzhao_2.png");
						$that.find('img.selected').attr("src", "/static/iwebap/images/danxuan_2.png");
					}).on('mouseleave', 'li.openLi', function(){
						var $that = $(this);
						$that.find('img.folder').attr("src", "/static/iwebap/images/canzhao_1.png");
						$that.find('img.selected').attr("src", "/static/iwebap/images/danxuan_1.png");
					});
					that.$el.find(".classContainer.RefTree").on('click', "li", function(){
						var $that = $(this);
						if($that.attr('data-initial')==='hotData'){
							that.refreshHotData();
							referFireEvent(that,'resetHotData.refer');
							return ;
						}
						that.$el.find(".classContainer").find("li:first").removeClass("curr");
						 
						var node = that.getNodeByPK($that.attr('pk'));
						var treeData = that.options.classData;
						var parents = [];
						
						getParents(treeData, parents, node);
						parents.push(node);
						var nodes = that.getChildNode(treeData, node);
						viewHelper.getCustomizeTips=that.options.getCustomizeTips;
						var data = _.extend({
							refTreeNavList: parents,
							refTreeNodeList: nodes
						}, viewHelper);
						that.$el.find('ul.valueList').html(_.template(tplItem)(data));
						that.$el.find('.classContainer').html(_.template(navItemTpl)(data));
						
					});
							
			}else if(that.isList()){
				var tplItem = '\
				<% _.each(refList,function(ref,index){%>\
				<li id="<%=ref.refpk%>" title="<%-getCustomizeTips(ref)%>" data-value="<%=ref.refpk%>" data-name="<%=ref.refname%>" data-code="<%=ref.refcode%>"  data-initial="<%=ref.refjoin%>">\
                        <span><i></i><%-ref.refname%></span>\
                </li>\
				<% }) %>\
				';
				
				var classTplItem = '\
					<li data-initial="0" class="curr">全部</li>\
				<% _.each(refClassList,function(ref,index){%>\
	                <li data-initial="<%=ref.id%>"><%-ref.name%></li>\
				<% }) %>\
				';
	
				viewHelper.getCustomizeTips=that.options.getCustomizeTips;
				var data = _.extend({refList: ret.data,refClassList:{}},viewHelper);
				that.$el.find('ul.valueList').append(_.template(tplItem)(data));
				that.$el.find('.classContainer').append(_.template(classTplItem)(data));
								
	    }
		that.addScroll();
	};
	
	Refer.prototype.loadQueryData = function (refreshCache) {
        var that = this;
		var pageInfo = that.initPage('');
        that.showLoading();
		that.ajax({
				type: "post",
				url: that.getListUrl(),
				data: $.extend({
					condition: ''
				}, that.getRefParam(refreshCache)),
				traditional: true,
				async: true,
				dataType: "json",
				success: function(ret){
					ret = that.renderData(ret);
					
					if(that.isTree()){//兼容Tree
						ret.data=that.prehandle(ret.data);
						that.options.classData = ret.data;
					}
					
					if (refreshCache) {
	                    pageInfo.data = ret.data;
	                } else {
	                    pageInfo.data = pageInfo.data.concat(ret.data);
	                }
	                that.updatePagination(ret.page);
					
	                that.loadQuerySuccess(pageInfo,refreshCache,'');
	                that.trigger('load-success', ret);
	                that.markRefresh(false);
					
					referFireEvent(that,'loaded.refer');
					referFireEvent(that,'resetHotData.refer');
					
					},
					complete: function () {
                		that.hideLoading();
            		}
				});
				
    };
	//初始化u_checkbox复选框
    Refer.prototype.uCheckboxInit = function () {
    	var that = this;
    	u.compMgr.updateComp();
        that.$el.find('.u-checkbox').each(function(){
        	var _checkBox = this['u.Checkbox'];
        	if (_checkBox){
            	_checkBox.on('change', function(event){
            		var _table = that.$el.find(".msgtype-table")[1];
            		that.$el.find('.refer_nav li.action').attr("index")==="1" && (_table = that.$el.find(".msgtype-table2")[1]);
            		_table && $(_table).data('bootstrap.table')._selectItem($(this.element).closest('tr'),event.isChecked);
            		$(this.element).closest("li").trigger("click");
            	})
        	}
        })
    }
    Refer.prototype.loadGridTreeData = function (treeNode, isNextPage,searchContent) {
        var that = this;
        !searchContent && (searchContent="");
        var pageInfo = that.initPage(treeNode.id);//不同分类节点初始化不同分页信息
        if ((!treeNode.isRefreshCache) && pageInfo.data.length > 0 && !isNextPage && !searchContent) {
            that.$el.find(".msgtype-table").bootstrapTable('load', {data: pageInfo.data});
            that.uCheckboxInit();
            return;
        }
        var refreshCache = treeNode.isRefreshCache;
        if (that.promise_ && that.promise_.state() === 'pending') {
            that.promise_.abort();
        }
		that.showLoading();
		that.isPaging = true;
        that.promise_ = that.ajax({
			url: that.getListUrl(),
            dataType: "json",
            traditional: true,
            type: "post",
            async: true,
            data: $.extend({condition: treeNode.refpk,content:searchContent}, that.getRefParam(refreshCache)),
            success: function (data) {
				if (!isNextPage) {
					pageInfo.data = data.data;
					that.$el.find(".msgtype-table").bootstrapTable('load', {data: data.data});
                } else if(that.isPaging && isNextPage) {
					that.$el.find(".msgtype-table").bootstrapTable('append',data.data);
                    pageInfo.data = pageInfo.data.concat(data.data);
                }
                that.updatePagination(data.page);
                treeNode.isRefreshCache = false;
            },
			complete: function () {
                that.hideLoading();
				that.isPaging = false;
				that.uCheckboxInit();
            }
        });

    };

	Refer.prototype.successLoadTreeData = function(ret,refreshCache){
		var that=this;
		if (that.options.isMultiSelectedEnabled) {
			var beforeCheck = function(treeId, treeNode) {
				//对非叶子节点选择处理
	        	if(!that.options.isNotLeafSelected && treeNode.isParent){
					var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
	        		treeNode.chkDisabled = true;
					treeObj.updateNode(treeNode);//当是父节点  不让选取
	        	}else if(treeNode.isParent){
	        		var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
	                treeObj.checkNode(treeNode, !treeNode.checked, false, false); //不触发级联子节点
	                nodeClick(event, treeId, treeNode);//手动checknode
	        	}
	            return !treeNode.isParent;
			}
	   var TimeFn = null;
       var nodeClick = function (event, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
            var nodes = treeObj.getCheckedNodes(true);
            that.$el.find(".msgtype-table").bootstrapTable('load', {data: nodes});
            if (!treeNode.checked) {
                that.unSelections(treeNode.refpk);
            }
            that.updateSelectedTab();
        }

        var nodeDblClick = function (event, treeId, treeNode) {
            if (!treeNode) {
                var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
                var tId = $(event.target).closest('li[treenode]').attr('id');
                treeNode = treeObj.getNodeByTId(tId);
               
                treeObj.checkNode(treeNode, !treeNode.checked, true, false); //触发级联子节点
                
                nodeClick(event, treeId, treeNode);//手动checknode
            }
			clearTimeout(TimeFn);
        }
		//单击展开树
        var onClick = function (event, treeId, treeNode) {
			clearTimeout(TimeFn); //setTimeout用来屏蔽连续2次单击变成单击事件
			TimeFn = setTimeout(function() {
					var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
					zTree.expandNode(treeNode);
		        }, 200);
        }
        
        var setting = {
                data: {
                    key: {
                        name: 'refname'
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid"
                    }
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "s", "N": "s" }
                },
                callback: {
                    beforeCheck: beforeCheck,
                    onCheck: nodeClick,
                    onDblClick: nodeDblClick,
					onClick: onClick
                },
                view: {
                    selectedMulti: false,
                    showIcon: false,
					dblClickExpand: false //屏蔽双击展开事件
                }
            };
        
		 	var treeDom = $('#' + that.getTreeID());
            that.options.classData = ret.data;
			that.getRoot();
            $.fn.zTree.init(treeDom, setting, that.options.classData);
			if (!that.options.isNotLeafSelected) { //非叶子节点是否可选，false时让复选框不显示
				var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
				var treeNodeRoot = treeObj.getNodes();
				var treeNodes = treeObj.transformToArray(treeNodeRoot); 
				for(var i=0;i<treeNodes.length;i++){
					if(!treeNodes[i].isLeaf && treeNodes[i].isParent){
						treeNodes[i].nocheck = true; //当是父节点  复选框不让显示
						treeObj.updateNode(treeNodes[i]);
					}
				}
			}
            that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
            that.$el.find(".ztree").addClass('scrollbar-dynamic').scrollbar();
		}else if(that.options.isZtreeStyle){
			var zTreeBeforeClick=function (treeId, treeNode, clickFlag) {
	        	//对非叶子节点选择处理
	        	if(!that.options.isNotLeafSelected){
	        		//return !treeNode.isParent;//当是父节点 返回false 不让选取
	        	}else{
	        		return true;
	        	}
	        };
	        var TimeFn=null;
	        var nodeClick=function (event, treeId, treeNode) {
				//单击展开树
				clearTimeout(TimeFn); //setTimeout用来屏蔽连续2次单击变成单击事件
				TimeFn = setTimeout(function() {
					var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
					zTree.expandNode(treeNode);
		        }, 200);
				//叶子节点(子节点)选中
				if(!treeNode.isParent){
			         var item={};
			         item.refpk =   treeNode.refpk;
			         item.refname = treeNode.name || treeNode.refname;
			         item.refcode = treeNode.refcode;
		            that.setValue([item]);
		            updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
		            that.hide();
				}
	        }
			//ztree点击前面的小圆圈选中数据
	        var nodeCheck=function (event, treeId, treeNode) {
				if(that.options.isNotLeafSelected && treeNode.isParent){ 
			         var item={};
			         item.refpk =   treeNode.refpk;
			         item.refname = treeNode.name || treeNode.refname;
			         item.refcode = treeNode.refcode;
		            that.setValue([item]);
		            updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
		            that.hide();
				}else if (!treeNode.isParent) {
						var item = {};
						item.refpk = treeNode.refpk;
						item.refname = treeNode.name || treeNode.refname;
						item.refcode = treeNode.refcode;
						that.setValue([item]);
						updateHotData(that.options.getRefHotDataKey(), item, that.options.hotDataSize);
						that.hide();
					}
	        }
			//双击事件
			var nodeDblClick = function (event, treeId, treeNode) {
				clearTimeout(TimeFn);
        	}
	        var setting = {
	                data: {
	                    key: {
	                        name: 'refname'
	                    },
	                    simpleData: {
	                        enable: true,
	                        idKey: "id",
	                        pIdKey: "pid"
	                    }
	                },
	                callback: {
	                	beforeClick: zTreeBeforeClick,
						onDblClick: nodeDblClick,
	                    onClick: nodeClick,
						onCheck:nodeCheck
	                },
					check: {
	                    enable: true,
	                    chkStyle: "radio",
	                    chkboxType: { "Y": "s", "N": "s" }
	                },
					view: {
						showIcon: false,
						dblClickExpand: false //屏蔽双击展开事件
	                }
	            };
			 var treeDom = $('#' + that.getTreeID());
             that.options.classData = ret.data;
             that.getRoot();
             $.fn.zTree.init(treeDom, setting, that.options.classData);
			 if (!that.options.isNotLeafSelected) { //设置非叶子节点不可选时 隐藏前面的小圆圈
					var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
					var treeNodeRoot = treeObj.getNodes();
					var treeNodes = treeObj.transformToArray(treeNodeRoot); 
					for(var i=0;i<treeNodes.length;i++){
						if(!treeNodes[i].isLeaf && treeNodes[i].isParent){
							treeNodes[i].nocheck = true; //当是父节点  复选框不让显示
							treeObj.updateNode(treeNodes[i]);
						}
					}
			 }
             that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
             that.$el.find(".ztree").addClass('scrollbar-dynamic').scrollbar();
		}else{
			var treeData = ret.data;
            that.options.classData = treeData;
            var rootItem = that.getRoot();
            var parents = [];
            getParents(treeData, parents, rootItem);
            parents.push(rootItem);
            var nodes = that.getChildNode(treeData, rootItem);

            viewHelper.notLeafSelected = that.options.isNotLeafSelected;
			viewHelper.getCustomizeTips=that.options.getCustomizeTips;
			
            var data = _.extend({refTreeNavList: parents, refTreeNodeList: nodes}, viewHelper);

            that.$el.find('.refer_list.ul_list2').remove();
            that.$el.find('.refer_nav.navtree').remove();

            that.$el.find('.refer_results').append(_.template(that.getTreeClassTpl())(data));
            that.$el.find('.refer_results').append(_.template(that.getTreeNodeTpl())(data));
			if(that.$el.find('.refer_nav li.nav_list2').hasClass('action')){
	            that.$el.find('.ul_list1').hide();
				that.$el.find('.ul_list2').show();
	            that.$el.find('.navtree').show();
			}
			that.addScroll(); //添加滚动条
		}
		//树形参照 有常用数据时 显示常用，没有则显示 全部
		that.loadFirstShow();
	};

    Refer.prototype.loadTreeData = function (refreshCache) {
        var that = this;
		
		if (that.promise_ && that.promise_.state() === 'pending') {
            that.promise_.abort();
        }

		that.showLoading();
        that.promise_ = that.ajax({
            type: "post",
			url: that.getListUrl(),
            data: that.getRefParam(refreshCache),
            traditional: true,
            async: false,//检索出现重复数据，必须先加载
            dataType: "json",
            success: function (ret) {
                that.successLoadTreeData(ret,refreshCache);
				that.markRefresh(false);
            },
			complete: function () {
                that.hideLoading();
            }
        });
    };

	/**
	 * 添加滚动条
	 * @param {Object} isTable
	 */
    Refer.prototype.addScroll = function (isTable) {
        var that = this;
        var currentToScroll;
        if (isTable) {
            currentToScroll = that.$el.find('.fixed-table-body');
        } else {
			if(that.$el.find('.refer_list').length>0){
				currentToScroll = that.$el.find('.refer_list')
			}else{
            	currentToScroll = that.$el.find('.refer_list2'); //ztree 常用数据 添加滚动条
			}
        }
        if (currentToScroll.length > 0) {
            currentToScroll.addClass('scrollbar-dynamic');
            currentToScroll.scrollbar({
                "onScroll": function (y, x) {
                    if (y.scroll === y.maxScroll && 0 !== y.scroll && !that.isPaging) {
                        that.onPageNext();
						//return false;
                    } else if (y.scroll === 0) {
						//y.scroll = y.maxScroll;
						//return y;
						//TODO:往上滚动，移除上一页的数据 that.onPagePre();
                    }
                }
            });
        }
    };

    /**
     * 获取根节点
     * 没找到父节点，则虚拟'null'根节点
     */
    Refer.prototype.getRoot = function (isAdd) {
        var VRoot = {};
        VRoot.refpk = 'null';
        VRoot.pid = '';
        VRoot.id = 'null';
        VRoot.refname = this.options.rootName;
        VRoot.name = this.options.rootName;
        VRoot.refcode = '';
        VRoot.isLeaf = false;
        VRoot.open = true;
        VRoot.nocheck = !this.options.isRootCheckEnabled;
		this.defineTreeIcon();
        this.fixedNoFatherTree();
        !isAdd && this.options.classData.push(VRoot);
        return VRoot;
    };


    Refer.prototype.getNodeByPK = function (pk) {
        var node = $.grep(this.options.classData, function (e) {
            return e.refpk === pk;
        });
        return (node.length === 1) ? node[0] : null;
    };

	/**
	 * 对没有父节点的树修正
	 * @param {Object} datas
	 */
    Refer.prototype.fixedNoFatherTree = function (datas) {
    	// MODIFY BY CYL 校验数据改在后台
//        var that = this;
//        var treeData = datas || this.options.classData;
//		//pid==id
//        $(treeData).each(function (index, item) {
//            if (item.id===item.pid) {
//                item.pid = 'null';
//            }
//        });
//		
//        $(treeData).each(function (index, item) {
//            var parents = [];
//            getParents(treeData, parents, item);
//            if (parents.length === 0) {//没找到父节点，则虚拟'null'根节点
//                item._pid = item.pid;
//                item.pid = 'null';
//            }
//        });
    };

	/**
	 * 自定义树图标
	 * 参考 referSelf.js
	 * @param {Object} nodes
	 */
	Refer.prototype.defineTreeIcon = function(nodes){
		 // icon:"/iwebap/trd/zTree_v3/css/zTreeStyle/img/diy/1_open.png" iconOpen:"/img/open.gif", iconClose:"/img/close.gif"
		  
	};
	
	/**
	 * 处理参照树型数据集，标示是否是叶子节点
	 * @param {Object} data
	 */	
    Refer.prototype.prehandle = function (data) {
        var that = this;
        return $(data).each(function (index, item) {
            var childs = that.getChildNode(data, item);
            item.isLeaf = (childs.length === 0);
        });
    };


    Refer.prototype.getRefWH = function () {
        var that = this;
        var container = that.$el.find('.outerContainer');
        if (that.isPopModel()) {
            return {width: that.isTableContainer() ? 600 : 345, height: container.height()};
        }else if(that.isAppModel()){
			return {width: that.isTableContainer() ? 600 : 345, height: container.height()};
		}
        return {width: container.width(), height: container.height()};
    };

	/**
	 * 对手工录入的参照，校验
	 * @param {Object} val
	 */
    Refer.prototype.checkVal = function (val) {
        var that = this;
		var data = that.options.data;
		if(that.isTree()){
			data= that.options.classData;
		}
        var matched = [];
        if (that.isGridTree() || that.options.isClassDoc || data.length === 0) {
            that.ajax({
                type: "post",
                url: that.options.ctx + '/iref_ctr/matchBlurRefJSON/',
                data: $.extend({content: encodeURIComponent(encodeURIComponent(val))}, that.getRefParam()),
                traditional: true,
                async: false,
                dataType: "json",
                success: function (data) {
                    matched = data.data;
                }
            });
        } else {
            matched = $.grep(data, function (e) {
                return e.refname === val || e.refcode === val || e.refpk === val;
            });
        }
        return matched;
    };

    Refer.prototype.bindzTreeEvent = function () {
        var that = this;
        $.fn.treeViewModel && $.fn.treeViewModel.referbindzTreeEvent(that);
    };
    
    Refer.prototype.bindTreeEvent = function () {
        var that = this;
        $.fn.treeViewModel && $.fn.treeViewModel.referbindTreeEvent(that);
    };

    Refer.prototype.bindGridTreeEvent = function () {
        var that = this;
        $.fn.gridTreeViewModel && $.fn.gridTreeViewModel.referbindGridTreeEvent(that);
    };
	
	/*
	 * autocomplete 触发的select setValue 延时 
	 */
	Refer.prototype.isManualInput = function(){
		var that=this;
		var ret=false;
		var values=this.values;
		if(values){
			var $input = this.options.refInput;
			var inputStr=$input.val().trim();
			var refNames=inputStr.split(',');
			if(values.length===refNames.length){
				$.each(refNames,function(i,v){
					 var name=values[i].refname;
					 var code=values[i].refcode;
					 if(v!==(that.options.isReturnCode?code:name)){
						 	ret=true;
							return;
					 }
				});
			}
		}
		
		return ret;
	};
	
    Refer.prototype.bindMultiGridTreeEvent = function () {
        var that = this;
        $.fn.gridTreeViewModel && $.fn.gridTreeViewModel.referbindMultiGridTreeEvent(that);
    };

    Refer.prototype.bindFirstEvent = function () {
    	 var that = this;
         var $input = this.options.refInput;
		 $input.off('click.refer').on('click.refer', function (e) {
			 var code = e.keyCode || e.which || e.charCode; 
			 if(that.options.isCheckListEnabled && code){ //判断点击input框
					//that.show();
				 	$input.next("span").addClass("refpic");
				 	!$input.data('ref.util.autocomplete') && that.initSearch();
					var autoInstance = $input.data('ref.util.autocomplete');
					if (($input.css("display") !== "none" && !$input.is(":disabled")) && autoInstance) { //触发模糊搜索
						//that.hide();
						autoInstance.onChange();
						$input.focus();
	                }
				}else{
					$input.next("span").removeClass("refpic");
					($input.css("display") !== "none" && !$input.is(":disabled")) && that.show();
					$input.focus();
					$input.find("input[type='text']") && $input.find("input[type='text']").focus();
				} 
         });
	 	 //that.hide();
		 $input.off('focus.refer').on('focus.refer',function (e) {
			 	
         }).off('keyup.refer').on('keyup.refer',function (e) {
        	 var code = e.keyCode || e.which || e.charCode; 
        	 if(code === 9){
        		 $input.next("span").addClass("refpic");
        		 !$input.data('ref.util.autocomplete') && that.initSearch();
        		 var autoInstance = $input.data('ref.util.autocomplete');
        		 if (($input.css("display") !== "none" && !$input.is(":disabled")) && autoInstance) { //触发模糊搜索
        			 autoInstance.onChange();
        		 }
        	 }
         }).off('blur.refer').on('blur.refer',function (e) {
			 $input.next("span").removeClass("refpic");
        	 var autoInstance = $input.data('ref.util.autocomplete');
        	 autoInstance && autoInstance.hideResultsNow();
        	 
        	 that.blurEventVal();
        	 
        	 //uui非空校验
             var parValidate = $input.parent()[0]['u-meta'];
        	 parValidate && parValidate.doValidate({trueValue:true,showMsg:true});
         });
		 $input.next("span").off("click.refer").on("click.refer",function(){
		     	$input.trigger("click.refer");
		 });
    };

    Refer.prototype.buildUI = function () {
        var that = this;
        var $input = this.options.refInput;
        if (that.options.isMultiSelectedEnabled) {
            that.isTable = true;
            if (that.isTree()) {
                that.$el.html(that.options.refTreeTempl);
                that.bindMultiTreeEvent(); //多选树
            } else if (that.isGrid()) {
                that.$el.html(that.options.refTreeTempl);
                that.bindMultiGridEvent(); //多表格
            } else if (that.isGridTree()) {
                if (that.options.isClassDoc) {
                    that.isTable = false;
                    that.bindListEvent(); //普通列表
                } else {
                    that.$el.html(that.options.refTreeTempl);
                    that.bindMultiGridTreeEvent(); //多选表格树
                }
            } else {
                that.isTable = false;
                that.bindListEvent(); //普通列表
            }
        } else {
            that.isTable = false;
            if (that.isTree()) {
                if (that.options.isClassDoc) { //档案类型
                    that.bindListEvent(); //普通列表
                }else if (that.options.isZtreeStyle) {
                	that.$el.html(that.options.refTreeTempl);
                	that.bindzTreeEvent();
                }else {
                    that.bindTreeEvent(); //树
                }
			} else if (that.isGrid()) {
                that.$el.html(that.options.refTreeTempl);
                that.bindGridEvent(); //表格
            } else if (that.isGridTree()) {
                if (that.options.isClassDoc) {
                    that.bindListEvent(); //普通列表
                } else {
                    that.isTable = true;
                    that.$el.html(that.options.refTreeTempl);
                    that.bindGridTreeEvent(); //单选表格树
                }
            } else {
                that.bindListEvent(); //普通列表
            }
        }
    };   
        
     Refer.prototype.bindEvent = function () {
    	 var that = this;
         var $input = this.options.refInput;
        if (this.isPopModel()) {//弹出
            that.$el.parent().css("width", that.getRefWH().width).find('.modal-title').html(that.options.refName);
            that.$el.css({padding: '0 0 0 0'});
            that.$el.find('.outerContainer').css("position", "relative");
            that.$el.find('.innerContainer').css("display", "block");
        } else {
			if(this.isAppModel()){
				that.$el.find('.outerContainer').css("position", "relative");
	            that.$el.find('.innerContainer').css("display", "block");
			}
            
			that.$el.find('.refer_btn').on('click', '.btn-add', function (e) {
                     that.maintenanceDocAdd(e,this);
                });
			if("" !== $input.val()){
				$input.parent().find('.clearAuto').css("display","inline");
			}
			//点击input框里清空按钮	
			$input.parent().find('.clearAuto').on('click', function (e) {
                $input.val('');
				$input.parent().find('.clearAuto').css("display","none");
            });
			that.$el.find('.hideAuto').on('click', function (e) {
				that.hide();
				that.options.wrapRefer.onCancel();
			});
			
            if (that.options.isMultiSelectedEnabled) {//关闭
                that.$el.find('.refer_btn').on('click', '.btn-ok', function () {
					var selectValues = that.getSelections();
                    that.setValue(selectValues);
					var refnameAll="";
					$.each(selectValues,function(i,val){
						var nameCode = that.options.isReturnCode?val.refcode:val.refname;
						if(i===selectValues.length-1){
							refnameAll+=nameCode;
						}else{
							refnameAll+=nameCode+",";
						}
					});
					$input.attr("title",refnameAll); //input框加上title属性
                    updateHotData(that.options.getRefHotDataKey(), selectValues, that.options.hotDataSize);
                    that.hide();
                });
            }
            that.$el.find('.refer_btn').on('click', '.btn-cancel', function () {
            	that.hide();
            });

			//.refer 命名空间，让事件(比如click)不会涉及到别的元素
			$input.parent().parent().find('label[for="'+$input.attr('id')+'"]').off('click.refer').on('click.refer', function (e) {
				 e.preventDefault();//remove association label click  阻止默认事件行为的触发
			});
            $input.off('focus.refer').on('focus.refer',function (e) {
            	
            }).off('blur.refer').on('blur.refer',function (e) {
            	 $input.next("span").removeClass("refpic");
        		 that.$el.closest("body").find(".ref_ac_results").css("display","none");//焦点移开隐藏模糊搜索
				 if(e.relatedTarget&&e.relatedTarget.tagName ==='LI'){//ztree.selectNode ignore
				 	return;
				 }
				 if(e.relatedTarget&&e.relatedTarget.tagName ==='A'){ //焦点移开，如果点击x先清空input框的值
				 	$input.parent().find('.clearAuto').trigger('click');
				 }
					$input.parent().find('.clearAuto').css("display","none"); //焦点移开隐藏x清空按钮
                    //that.hide();
					that.blurEventVal();
					//uui非空校验
					var parValidate = $input.parent()[0]['u-meta'];
		        	parValidate && parValidate.doValidate({trueValue:true,showMsg:true});
                }).off('keyup.refer').on('keyup.refer',function (e) {
					//input框里清空按钮的显示与隐藏
					if("" !== $input.val().trim()){
						$input.parent().find('.clearAuto').css("display","inline");
					}else{
						$input.parent().find('.clearAuto').css("display","none");
					}
					
                    var $this = $(this);
                    if ($this.val() === '' || e.which === 9) {
						if(that.options.isCheckListEnabled){
							that.hide();
						}else{
	                        that.show();
						}
                    } else {
                        that.hide();
                    }
                    var code = e.keyCode || e.which || e.charCode; 
	               	if(code === 9){
	               		 $input.next("span").addClass("refpic");
	               		 !$input.data('ref.util.autocomplete') && that.initSearch();
	               		 var autoInstance = $input.data('ref.util.autocomplete');
	               		 if (($input.css("display") !== "none" && !$input.is(":disabled")) && autoInstance) { //触发模糊搜索
	               			 autoInstance.onChange();
	               		 }
	               	 }
                }).off('keydown.refer').on('keydown.refer',function (e) {
					//添加回车事件
					var code = e.keyCode || e.which || e.charCode;    
				    if (code === 13) {  
						var selectValues = that.getSelections();  
				        that.setValue(selectValues);
						var refnameAll="";
						$.each(selectValues,function(i,val){
							var nameCode = that.options.isReturnCode?val.refcode:val.refname;
							if(i===selectValues.length-1){
								refnameAll+=nameCode;
							}else{
								refnameAll+=nameCode+",";
							}
						});
						$input.attr("title",refnameAll); //input框加上title属性
	                    updateHotData(that.options.getRefHotDataKey(), selectValues, that.options.hotDataSize);
	                    that.hide();
				    }
                    if (e.which === 8 || e.which === 46) {
                        var refStr = $input.val();
                        if ("" !== refStr.trim()) {
                            var toValidVals = refStr.split(',');
                            if (toValidVals.length > 1) {
                                $input.val('');
                                that.uncheckAll();
                            }else{
								var selected=getSelectedText();
								if(refStr===selected){
									 that.uncheckAll();
								}
							}
						}
                    } else {
                        that.hide();
                    }
                }).off('click.refer').on('click.refer', function (e) {
                    var $this = $(this);
                    var code = e.keyCode || e.which || e.charCode; 
                    var autoInstance = $input.data('ref.util.autocomplete');
					if(that.options.isCheckListEnabled && code){
						if (autoInstance) { //触发模糊搜索
							autoInstance.onChange();
							$input.focus();
                    	}
						$input.next("span").addClass("refpic");
					}else{
						$input.next("span").removeClass("refpic");
	                    if (autoInstance) { //try hide Autocomplete
	                        autoInstance.hideResultsNow();
	                    }
	                    //$this.select();
                        ($input.css("display") !== "none" && !$input.is(":disabled")) && that.show();
						$input.focus();
					}
                });
            var searchInputIcon = that.$el.find(".search-context"); //参照里面的搜索框
            searchInputIcon.off('focus.refer').on('focus.refer',function (e) {
            	searchInputIcon.next("span").addClass("refpic");
            }).off('blur.refer').on('blur.refer',function (e) {
            	searchInputIcon.next("span").removeClass("refpic");
            }).off('keydown.refer').on('keydown.refer',function (e) {
				//添加回车事件
				var code = e.keyCode || e.which || e.charCode;    
			    if (code === 13) {  
			    	that.$el.find(".innerContainer .refer_nav li .pic-search").trigger("click");
			    }
            });
        }
    };


    Refer.prototype.bindMultiTreeEvent = function () {
        var that = this;
        $.fn.treeViewModel && $.fn.treeViewModel.referbindMultiTreeEvent(that);
    };

	Refer.prototype.bindGridEvent = function () {
        var that = this;
        $.fn.gridViewModel &&  $.fn.gridViewModel.referbindGridEvent(that);
    };
	
    Refer.prototype.bindMultiGridEvent = function () {
        var that = this;
        $.fn.gridViewModel &&  $.fn.gridViewModel.referbindMultiGridEvent(that);
    };

	Refer.prototype.loadQueryTplData = function(refreshCache){
			var that=this;
			if (that.isGridTree()&&that.options.classData.length === 0) {
					that.loadClassData();
			}		
			var pageInfo = that.initPage('');
			if (pageInfo.data.length === 0) {
				that.loadQueryData(refreshCache);
			}else{
				that.loadQuerySuccess(pageInfo,refreshCache,'');
			}
	
	};

	/**
	 * 对查询模板点击更多时，加载数据
	 */
	Refer.prototype.bindQueryMore = function(){
		var that=this;
		this.$el.closest(".queryAreaItem .refer-value[data-type='5']").on('more.query',function(e,opened){
			 if ($(this).find('ul.valueList').hasClass('hotData')) {
				if(!opened){
					var pageInfo = that.initPage('');
					if(pageInfo.data.length===0)
						that.loadQueryTplData();
				}
			 }
		});
	};
	
	Refer.prototype.bindQueryTplEvent = function (refreshCache) {
        var that = this;
		if (!that.refreshHotData(false)) {
			that.loadQueryTplData(refreshCache);
		}
    };
	
    Refer.prototype.bindListEvent = function () {
        var that = this;
        $.fn.commonViewModel &&  $.fn.commonViewModel.referbindListEvent(that);
    };


    /**
     * 树型参照，检索时，如果出现同名的多个条目，则增加这个条目的分类作为前缀以区分
     * @param {Object} data
     */
    Refer.prototype.buildClassLevelTips = function (data) {
        var that = this;
        var ret = false;

        if (data && (that.isTree() || that.isGridTree())) {
            $.each(data, function (i, val) {
                var node = $.grep(data, function (e) {
                    return e.refname === val.refname;
                });
                if (node.length > 1) { //存在名称相同的参照选项
                    var treeData;
                    var parents = [];
                    ret = true;
                    treeData = that.options.classData;
                    getParents(treeData, parents, val);
                    val.classLevel = $.map(parents,function (value, index) {
                        return value.refname || value.name;
                    }).join('/');
                }
            });
        }
        return ret;
    };

	/**
	 * 更新 已选择 页签
	 */
    Refer.prototype.updateSelectedTab = function (sysnDataFlag) {
        var that = this;
        var selected = that.getSelections(null,sysnDataFlag);
        that.$el.find(".fixed-table-body .msgtype-table-selectedData").bootstrapTable('load', {data: selected});
        //update selectedData
        var currentIndex = that.$el.find('.refer_nav li.action').attr('index');
        if (that.options.isClassDoc && currentIndex === 'selectedData') {
			viewHelper.getCustomizeTips=that.options.getCustomizeTips;
			var data = _.extend({refList: selected, classIndex: 'selectedData'},viewHelper);
		
            that.$el.find('.ul_listselectedData').remove();
            that.$el.find('.refer_results').append(_.template(that.getSelectedItemTpl())(data));
        }
        that.$el.find('li.selectedData span').html('已选择(' + selected.length+')');
    };

    Refer.prototype.initSelectedTab = function () {
        var that = this;
        var selectedTab = that.$el.find('.selectedData');
        if (!that.options.isMultiSelectedEnabled) {
            selectedTab.hide();
            return;
        }

        if (that.isTableContainer()) {

            that.$el.find('.refer_results2').append(_.template(that.getGridTpl('selectedData'))({}));

            var operateEvents = {
                'click .remove': function (e, value, row, index) {
                    e.stopPropagation();
                    row.selected = false;
                    that.$el.find(".fixed-table-body .msgtype-table-selectedData").bootstrapTable('remove', {
                        field: 'refpk',
                        values: [row.refpk]
                    });
                    //联动选中状态
                    if (that.isGrid()) { //表格
                        $.each(that.options.data, function (i, val) {
                            if (val.refpk === row.refpk) {
                                val.selected = false;
                            }
                        });
                        that.$el.find(".fixed-table-body .msgtype-table").bootstrapTable('load', {data: that.options.data});
                    } else if (that.isTree()) { //树
                        var treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
                        if (treeObj) {
                            var node = treeObj.getNodeByParam("refpk", value, null);
                            treeObj.checkNode(node, false, false);
                        }
                        that.$el.find(".fixed-table-body .msgtype-table").bootstrapTable('remove', {
                            field: 'id',
                            values: [row.id]
                        });
                    } else {
                        var pageData;
                        var zTree = $.fn.zTree.getZTreeObj(that.getTreeID());
                        if (zTree) {
                            //同步选择状态
                            var pageInfo = that.pageState;
                            for (var key in pageInfo) {
                                if (pageInfo.hasOwnProperty(key)) {
                                    pageData = pageInfo[key].data;
                                    if (pageData) {
                                        for (var ii = 0; ii < pageData.length; ii++) {
                                            if (pageData[ii].refpk === row.refpk) {
                                                pageData[ii].selected = false;
                                            }
                                        }
                                    }
                                }
                            }
                            //更新当前页
                            var nodes = zTree.getSelectedNodes();
                            if (nodes && nodes[0]) {
                                pageData = that.pageState[nodes[0].id].data;
                                that.$el.find(".fixed-table-body .msgtype-table").bootstrapTable('load', {data: pageData});
                            }
                        }
                    }
                    //常用数据联动(zTree using id)
                    that.unSelections(row.id || row.refpk);
                }
            };

			var cols = that.buildSelectTableColumn(that.options.isMultiSelectedEnabled,operateEvents);
            that.$el.find(".msgtype-table-selectedData").bootstrapTable({
				columns:cols
            });
            that.$el.find(".fixed-table-header").css('background', '#EBEFF0');
            that.addScroll(true);

            that.$el.find(".msgtype-table-selectedData thead").on('click', '.remove_all', function () {
                that.uncheckAll();
            });

        }

        that.$el.find('.refer_results').on('click', 'li a.remove', function (e) {
            e.stopPropagation();
            var $li = $(this).closest('li');
            $li.remove();
            that.unSelections($li.attr('pk'));
        });

        that.$el.find('.refer_results2').on('click', 'li a.remove', function (e) {
            e.stopPropagation();
            var $li = $(this).closest();
            $li.remove();
            that.unSelections($li.attr('pk'));
        });


        selectedTab.on('click', function () {
            var selected = that.getSelections();
			viewHelper.getCustomizeTips=that.options.getCustomizeTips;
			var data = _.extend({refList: selected, classIndex: 'selectedData'},viewHelper);

            if (that.isTableContainer()) {
                that.$el.find('.ul_listselectedData').show();
                that.$el.find(".msgtype-table-selectedData").bootstrapTable('load', {data: selected});
            } else {
                that.$el.find('.ul_listselectedData').remove();
                that.$el.find('.refer_results').append(_.template(that.getSelectedItemTpl())(data));
                that.$el.find('.refer_results2').append(_.template(that.getSelectedItemTpl())(data));
                that.addScroll();
            }

            that.$el.find('li.selectedData span').html('已选择(' + selected.length+')');

            var currentIndex = that.$el.find('.action').toggleClass('action').attr('index');
            currentIndex!=='selectedData' && that.$el.find('.ul_list' + currentIndex).hide();
            selectedTab.toggleClass('action');

        });

    };
	
	/**
	 * 获取已选数据完整记录
	 */
	Refer.prototype.getSelectedRecords = function () {
		var that=this;
		var ret=[];
		var selecteds =that.getSelections();
   		var srcData  = that.options.data;
		if (selecteds && selecteds.length > 0) {
			if (!srcData) {//Grid 
			  ret=$.map(selecteds,function(val, index){
				var recoredData = $.grep(srcData, function (e) {
                    return e.refpk === val.refpk;
                });
				return recoredData.length===1 ? recoredData[0]:{};
			   });
			   
			} else {//TreeGrid
			ret=$.map(selecteds,function(val, index){
				 var pageInfo = that.pageState;
				 var record={};
				 for (var key in pageInfo) {//同步选择状态
					if (pageInfo.hasOwnProperty(key)) {
						var pageData = pageInfo[key].data;
						if (pageData) {
						  for (var ii = 0; ii < pageData.length; ii++) {
                                if (pageData[ii].refpk === val.refpk) {
                                    record=pageData[ii];
									break;
                                }
                              }
						}
					}
				}
				return record;
			   });
			}
		}
		return ret;
    };
	
    /**
     * 参照刷新
     */
	Refer.prototype.refreshUIData = function (refreshParam) {
   		this.$el.find('.ref_class_refresh span').trigger('click',refreshParam);
    };

    /**
	 * 档案增加回调
	 * @param {Object} e 事件对象
	 * @param {Object} self dom
	 */
	Refer.prototype.maintenanceDocAdd = function (e,self) {
   
    };
   
    Refer.prototype.initToolbar = function () {
        if (!this.options.isMaintenanceDocAddEnable && (this.isPopModel())) {
            return;
        }
        var btnTpl = '';
//        if (this.options.isMaintenanceDocAddEnable) {
//            btnTpl = '<button  type="button" class="btn btn-default btn-mini ref-btn btn-add">新增</button>';
//        }
		if(this.options.isMultiSelectedEnabled){
			var btn = '\
           <div class="refer_btn pull-right" style="width:100%;">\
                        ' + btnTpl + '<div class="btn-group pull-right">\
                        <button  type="button" class="btn btn-primary btn-mini ref-btn btn-ok">确定</button>\
                        <button  type="button" class="btn btn-default btn-mini ref-btn btn-cancel" data-dismiss="modal">取消</button>\
                    </div>\
            </div>\
            ';
		}else{
			var btn = '\
           <div class="refer_btn pull-right" style="width:100%;">\
                        <div class="btn-group pull-right">\
						' + btnTpl + '\
						<button  type="button" class="btn btn-default btn-mini ref-btn btn-cancel" data-dismiss="modal">取消</button>\
                    </div>\
            </div>\
            ';
		}
		this.$el.find('.innerContainer').append(btn);
    };


    Refer.prototype.getContainerTpl = function (isList,isQuery) {
    	var that = this;
		var ctx= this.options.ctx;
		var mobileCss=$.app?'<link href="'+ctx+'/css/ref/ref-mobile.css" rel="stylesheet">':'';
		//维护档案新增按钮
		var btnTpl = '';
        if (this.options.isMaintenanceDocAddEnable) {
            //btnTpl = '<button  type="button" style="float:right" class="btn btn-default btn-mini ref-btn btn-add">新增</button>';
	        btnTpl = '<li class="btn-add" ><span  title="新增">&nbsp;</span></li>';
        }
		var hotTpl = '';
		if((this.isGrid() || (this.isGridTree() && (!this.options.isClassDoc))) ){ //表格树
			hotTpl = '<ul class="refer_list ul_list1 hotData grid" style="max-height: 346px; height: 346px;padding: 0px;margin: 10px 0px;border: 1px solid #c8cac9;display: block;">';
		}else{
			hotTpl = '<ul class="refer_list ul_list1 hotData" style="max-height: 346px; height: 346px;padding: 0px;margin: 10px 0px;border: 1px solid #c8cac9; display: block;">';
		}
		var searchTpl = '';
		if(this.isGridTree() && (!this.options.isClassDoc)){
			searchTpl = '<li class="searchInput searchbt u-input-group u-has-feedback"><input type="text" class="form-control search-context" placeholder="搜索"><input type="button" class="btn btn-default btn-mini ref-btn btn-search" value="搜索全部"><span class="u-form-control-feedback fa fa-search pic-search searchIcon"></span></li>';
		}else{
			searchTpl = '<li class="searchInput u-input-group u-has-feedback"><input type="text" class="form-control search-context" placeholder="搜索"><span class="u-form-control-feedback fa fa-search pic-search searchcont"></span></li>';
		}
		var refreshTpl = '<span class="ref_class_refresh"><span title="刷新">&nbsp;</span></span>';
        var listTpl = '\
				'+mobileCss+'\
                <div class="outerContainer">\
                    <div class="innerContainer" style="border:1px solid #c8cac9">\
		                    <div class="refer_results_top">\
			                	<ul class="refer_nav">\
			                	<li><span>'+that.options.refName+'</span><span title="关闭" class="hideAuto"></span>'+refreshTpl+'</li>\
			                	</ul>\
			                </div>\
                            <div class="refer_results" style="height:380px;">\
                                    <ul class="refer_nav clx tab" >\
                                        <li index="1"    class="nav_list1 action">\
                                            <span>常用</span>\
                                        </li>\
                                        <li index="2" condition="" class="nav_list2 allData" ><span>全部</span></li>\
                                        <li index="selectedData" condition="" class="nav_listselectedData selectedData" ><span>已选&nbsp;0</span></li>\
                                        ' + searchTpl + '\
										' + btnTpl + '\
                                        <li class="ref_class_more ref_class_deploy">\
                                                <span  title="展开">&nbsp;</span>\
                                        </li>\
                                    </ul>\
                                    ' + hotTpl + '\
                                    </ul>\
                            </div>\
                    </div>\
                </div>\
                ';
        var treeTpl = '\
				'+mobileCss+'\
                <div class="outerContainer">\
                    <div class="innerContainer" style="border:1px solid #c8cac9">\
		                    <div class="refer_results_top">\
			                	<ul class="refer_nav">\
			                	<li><span>'+that.options.refName+'</span><span title="关闭" class="hideAuto"></span>'+refreshTpl+'</li>\
			                	</ul>\
			                </div>\
                            <div class="refer_results2" style="height:380px;">\
                                    <ul class="refer_nav clx tab" >\
                                        <li index="1"    class="nav_list1 action">\
                                            <span>常用</span>\
                                        </li>\
                                        <li index="2" condition="" class="nav_list2 allData" ><span>全部</span></li>\
                                        <li index="selectedData" condition="" class="nav_listselectedData selectedData" ><span>已选&nbsp;0</span></li>\
                                        ' + searchTpl + '\
                                        ' + btnTpl + '\
                                    </ul>\
                                    ' + hotTpl + '\
                                    </ul>\
                            </div>\
                    </div>\
                </div>\
                ';
        var ztreeTpl = '\
			'+mobileCss+'\
            <div class="outerContainer">\
                <div class="innerContainer" style="border:1px solid #c8cac9">\
		                <div class="refer_results_top">\
			            	<ul class="refer_nav">\
			            	<li><span>'+that.options.refName+'</span><span title="关闭" class="hideAuto"></span>'+refreshTpl+'</li>\
			            	</ul>\
			            </div>\
                        <div class="refer_results2" style="width:920px;height:380px">\
                                <ul class="refer_nav clx tab" >\
                                    <li index="1"    class="nav_list1 action">\
                                        <span>常用</span>\
                                    </li>\
                                    <li index="2" condition="" class="nav_list2 allData" ><span>全部</span></li>\
                                    <li index="selectedData" condition="" class="nav_listselectedData selectedData" ><span>已选&nbsp;0</span></li>\
                                    ' + searchTpl + '\
                                    ' + btnTpl + '\
                                </ul>\
                                <ul class="refer_list2 ul_list1 hotData" style="border-bottom:1px solid #c8cac9;height: 346px;/*overflow: auto;*/display: block;">\
                                </ul>\
                        </div>\
                </div>\
            </div>\
            ';
		var isTree=this.isTree()?'RefTree':'';
		var queryTpl='\
				<ul class="refer-class classContainer '+isTree+'">\
	            </ul>\
				<div class="clr"></div>\
				<div class="q-valueList">\
	                <ul class="valueList refer_list" style="overflow: auto;">\
	                </ul>\
	            </div>\
				<div style="display: none;" class="refer-b-selected selectedContainer"><span class="refer-b-key">已选条件：</span>\
	                <ul class="q-list brand-selected"></ul>\
	            </div>\
				<div class="refer-btns">\
					<a href="javascript:;" class="btn  btn-primary btn-sm ok-btn disabled">确定</a>\
	            	<a href="javascript:;" class="btn  btn-default btn-sm cancel-btn">取消</a>\
	            </div>\
					';
		var queryCommonTpl='\
				<div class="q-list">\
                	<ul class="valueList refer_list" style="overflow: auto;">\
                	</ul>\
				</div>\
				<div style="display: none;" class="refer-b-selected selectedContainer"><span class="refer-b-key">已选条件：</span>\
	                <ul class="q-list brand-selected"></ul>\
	            </div>\
				<div class="refer-btns">\
					<a href="javascript:;" class="btn  btn-primary btn-sm ok-btn disabled">确定</a>\
	            	<a href="javascript:;" class="btn  btn-default btn-sm cancel-btn">取消</a>\
	            </div>\
					';
		if(isQuery){
			 return this.isList()?queryTpl:queryTpl;
		}else{
        	 return isList ? listTpl : ((this.options.isZtreeStyle && this.isTree()) ? ztreeTpl : treeTpl);
		}
    };

    Refer.prototype.getClassItemTpl = function () {
        var itemTpl = '\
                <% _.each(refClassList,function(ref,index){%>\
                         <li index="<%=(index+3)%>"  condition="<%=ref.id%>"  class="classItem nav_list<%=(index+3)%> <%=(index)>ref.lastClassIndex?"classStyleDocItem":"" %>">\
                             <span><%-ref.name%></span>\
                         </li>\
                 <% }) %>\
                 ';
        return itemTpl;
    };

    Refer.prototype.getSelectedItemTpl = function () {
        var selectedItemTpl = '\
            <ul  style="max-height: 346px;overflow: hidden !important; margin: 0px !important;"  class="refer_list ul_list<%=(classIndex)%> selectedData_ul">\
                <% _.each(refList,function(ref,index){%>\
                <li class="openLi" title="<%-getCustomizeTips(ref)%>" name="<%=ref.refname%>"  pk="<%-ref.refpk%>" code="<%-ref.refcode%>">\
                <a class="remove" href="javascript:void(0)" title="移除">\
                <i class="ref-remove"></i>\
                </a>\
                <label>\
                <span  style="width:250px;padding-left:5px;margin-right: 1px;overflow:hidden;display:block; float:right;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;"><%-ref.refcode%>:<%-ref.refname%></span>\
                </label>\
                </li>\
                <% }) %>\
             </ul>\
              ';
        return  selectedItemTpl;
    };
	//常用数据样式
    Refer.prototype.getItemTpl = function () {
        var itemTpl = '\
                <% _.each(refList,function(ref,index){%>\
                <li class="openLi" title="<%-getCustomizeTips(ref)%>" name="<%=ref.refname%>"  pk="<%-ref.refpk%>" code="<%-ref.refcode%>">\
				<span style="width:250px;padding-left:5px;margin-right: 1px;overflow:hidden;display:block; float:left;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;"><%-ref.refcode%>:<%-ref.refname%></span>\
				</li>\
                <% }) %>\
                 ';

        var multiItemTpl = '\
                <% _.each(refList,function(ref,index){%>\
                <li class="openLi" title="<%-getCustomizeTips(ref)%>" name="<%=ref.refname%>"  pk="<%-ref.refpk%>" code="<%-ref.refcode%>">\
        		<label class="u-checkbox is-upgraded <%-ref.selected?"is-checked":""%>"><input id="boxMul857c41b7-e1a3-11e5-aa70-0242ac11001d" type="checkbox" name="checkbox" <%-ref.selected?"checked":""%>><span class="u-checkbox-label"><%-ref.refcode%>:<%-ref.refname%></span><span class="u-checkbox-outline"><span class="u-checkbox-tick-outline"></span></span><span style="overflow: hidden; position: relative;"><span class="u-ripple"></span></span></label>\
        		</li>\
                <% }) %>\
                 ';
           		//old checkbox
                //<label  class="u-checkbox <%-ref.selected?"is-checked":""%>"><input id="boxMul<%-ref.refpk%>" class="u-checkbox-input" type="checkbox" name="checkbox"  /><span class="u-checkbox-label"><%-ref.refcode%>:<%-ref.refname%></span></label>\
        		//<input id="hotbox<%-ref.refpk%>" type="checkbox" name="checkbox" class="<%-ref.selected?"selected":""%>" <%-ref.selected?"checked":""%> />\
        		//<label for="hotbox<%-ref.refpk%>" style="width:250px;padding-left:5px;margin-right: 1px;overflow:hidden;display:block; float:right;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;"><span></span><%-ref.refcode%>:<%-ref.refname%></label>\
        	return this.options.isMultiSelectedEnabled ? multiItemTpl : itemTpl;
    };

    Refer.prototype.getClassWithItemTpl = function () {
        var itemTpl = '\
            <ul  style="overflow: auto; max-height: 346px; height: 344px;padding-left:0px;"  class="refer_list normal_list ul_list<%=(classIndex)%>">\
                <% _.each(refList,function(ref,index){%>\
                <li class="openLi" title="<%-getCustomizeTips(ref)%>" name="<%=ref.refname%>"  pk="<%-ref.refpk%>" code="<%-ref.refcode%>">\
				<span style="width:250px;padding-left:5px;margin-right: 1px;overflow:hidden;display:block; float:left;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;"><%-ref.refcode%>:<%-ref.refname%></span>\
				</li>\
                <% }) %>\
             </ul>\
              ';
        var multiItemTpl = '\
            <ul  style="overflow: auto; max-height: 346px; height: 344px;padding-left:0px;"  class="refer_list normal_list ul_list<%=(classIndex)%>">\
                <% _.each(refList,function(ref,index){%>\
                <li class="openLi" title="<%-getCustomizeTips(ref)%>" name="<%=ref.refname%>"  pk="<%-ref.refpk%>" code="<%-ref.refcode%>">\
	        	<label class="u-checkbox is-upgraded <%-ref.selected?"is-checked":""%>"><input id="boxMul857c41b7-e1a3-11e5-aa70-0242ac11001d" type="checkbox" name="checkbox" <%-ref.selected?"checked":""%>><span class="u-checkbox-label"><%-ref.refcode%>:<%-ref.refname%></span><span class="u-checkbox-outline"><span class="u-checkbox-tick-outline"></span></span><span style="overflow: hidden; position: relative;"><span class="u-ripple"></span></span></label>\
	        	</li>\
                <% }) %>\
             </ul>\
              ';
        //old checkbox
        //<label  class="u-checkbox"><input id="boxMul<%-ref.refpk%>" class="u-checkbox-input" type="checkbox" name="checkbox"  /><span class="u-checkbox-label"><%-ref.refcode%>:<%-ref.refname%></span></label>\
        //<input id="boxMul<%-ref.refpk%>" type="checkbox" name="checkbox"  />\
        //<label for="boxMul<%-ref.refpk%>" style="width:250px;padding-left:5px;margin-right: 1px;overflow:hidden;display:block; float:right;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;"><span></span><%-ref.refcode%>:<%-ref.refname%></label>\
        return this.options.isMultiSelectedEnabled ? multiItemTpl : itemTpl;
    };
    //普通树形类型 表头区域
    Refer.prototype.getTreeClassTpl = function () {
    	var that = this;
    	var ctx = "";
    	if(typeof that.options.ctx !=='undefined'){
    		ctx = that.options.ctx;
    	}
        var itemTpl = '\
                    <ul class="refer_nav clx navtree">\
                       <% _.each(refTreeNavList,function(ref,index){%>\
                         <li index="<%=(index+1)%>"   condition="<%=ref.refpk%>"  class="nav_list<%=(index+1)%> <%=(_.size(refTreeNavList)!==(index+1))?\' action\':\'\'%>" >\
                              <span><%-ref.refname%></span><%=navName(_.size(refTreeNavList)===(index+1),"'+ctx+'") %>\
                         </li>\
                        <% }) %>\
                      </ul>\
                        ';
        return itemTpl;
    };
    //普通树形类型 数据区域
    Refer.prototype.getTreeNodeTpl = function () {
    	var that = this;
    	var ctx = "";
    	if(typeof that.options.ctx !=='undefined'){
    		ctx = that.options.ctx;
    	}
    	var searchcontval = '<span style="width:200px;padding-left:5px;margin-right: 1px;overflow:hidden;display:block; float:left;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;" class="hoverBackground"><%-ref.refcode%>:<%-ref.refname%></span>';
        if(that.searchFlag){
        	searchcontval = '<span style="width:200px;padding-left:5px;margin-right: 1px;overflow:hidden;display:block; float:left;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;" class="hoverBackground"><%-ref.refcode%>:<%=ref.name%></span>';
        }
    	var itemTpl = '\
                       <ul class="refer_list ul_list2 treeNodeStyle" style="overflow: auto; max-height: 346px; height: 300px; display: none;padding: 0px;border: 1px solid #cecece;margin-bottom: 0px;">\
                        <% _.each(refTreeNodeList,function(ref,index){%>\
                              <li class="openLi" title="<%-getCustomizeTips(ref)%>" name="<%=ref.refname%>" id="<%-ref.id%>" pid="<%-ref.pid%>" pk="<%-ref.refpk%>" code="<%-ref.refcode%>" isLeaf="<%=ref.isLeaf%>" >\
                                 <%=notLeafSelectedclass()?\'<img src="'+ctx+'/static/images/danxuan_1.png" class="selected" style="float:left;margin-top:3px;width: 16px;height: 16px;background-color: #ffffff;">\':""%>\
                                 ' + searchcontval + '\
                                 <%=ref.isLeaf?"":\'<img src="'+ctx+'/static/images/canzhao_1.png" class="folder" style="width: 7px;height: 12px">\' %>\
                              </li>\
                        <% }) %>\
                    </ul>\
                    ';
        return itemTpl;
    };

    Refer.prototype.getTreeID = function () {
        return  'ztree-' + this.getContainerID().replace(/[^\w\s]/gi, '-');
    };
    //树表类型
    Refer.prototype.getTreeListTpl = function () {
        var id = this.getTreeID();
        var itemTpl = '\
                       <ul class="ul_list2" style="/*border-bottom:1px solid #c8cac9;*/height: 346px;padding:0px;margin-top: 10px;display: none;">\
                        <div    style="float:left; width:21%;background: #F9F9F9;height: 346px;border: 1px solid #C8CAC9;padding-top: 20px;padding-left: 20px;">\
                          <div id="' + id + '" class="ztree h280" ></div>\
                        </div>\
                         <div  class="ref-grid-body"   style="float:right;width:78%;height: 346px;border: 1px solid #C8CAC9;">\
                          <table class="msgtype-table table-hover table table-no-bordered" style="white-space:nowrap;width:100%;" \
                               data-click-to-select="true"\
                               data-height="346"\
                               data-classes="table table-no-bordered"\
                               >\
                        </table>\
                         </div>\
                    </ul>\
                    ';
        return itemTpl;
    };
    //ztree类型
    Refer.prototype.getzTreeTpl = function () {
        var id = this.getTreeID();
        var itemTpl = '\
                    <ul class="ul_list2" style="/*border-bottom:1px solid #c8cac9;background: #F9F9F9;*/ height: 346px;display: none;padding: 0px;border: 1px solid #cecece;margin-top: 10px;margin-bottom: 0px;">\
                        <div    style="float:left; width:915px;height: 346px;/*background: #F9F9F9;*/">\
                          <div id="' + id + '" class="ztree h280 ztreewidth" ></div>\
                        </div>\
                    </ul>\
                    ';
        return itemTpl;
    };

    Refer.prototype.getGridTpl = function (index) {
        var indexed = index || 2;
        var tableSuffix = '';
        if (index) {
            tableSuffix = '-' + index;
        }
        var itemTpl = '\
                       <ul class="ul_list' + indexed + '" style="border:1px solid #c8cac9;height: 346px;display: none;padding:0px;margin: 10px 0px">\
                         <div  class="ref-grid-body"   style="">\
                          <table class="msgtype-table' + tableSuffix + ' table-hover table table-no-bordered" style="white-space:nowrap;width:100%;" \
                               data-click-to-select="true"\
                               data-height="346"\
                               data-classes="table table-no-bordered"\
                               >\
                          </table>\
                         </div>\
                    </ul>\
                    ';
        return itemTpl;
    };
	
    Refer.prototype.getGridhotTpl = function (index) {
        var indexed = index || 2;
        var tableSuffix = '';
        if (index) {
            tableSuffix = '-' + index;
        }
        var itemTpl = '\
                         <div  class="ref-grid-body"   style="">\
                          <table class="msgtype-table2 table-hover table table-no-bordered" style="white-space:nowrap;width:100%;" \
                               data-click-to-select="true"\
                               data-height="346"\
                               data-classes="table table-no-bordered"\
                               >\
                          </table>\
                         </div>\
                    ';
        return itemTpl;
    };
	/**
	 * 获取模糊检索的宽
	 */
	Refer.prototype.getSearchWidth = function(){
	 	var that = this;
        var $input = this.options.refInput;
		var searchWidth=0;
		if($input.parent('.input-group').length>0){
			searchWidth=$input.parent('.input-group').width();
		}else{
			searchWidth=$input.outerWidth();
		}
		return searchWidth;
	};
	//模糊搜索
    Refer.prototype.initSearch = function () {
        var that = this;
        var $input = that.options.refInput;
        if(!$input.autocomplete) {
        	return;
        }
        $input.autocomplete({
			autoFill:true,
			autoFocus: true, //自动聚焦第一个
			selectFirst:true, //下拉列表的第一个值按回车键时将被自动选择
            cacheLength: 0,//disableCahe bug to fix
            maxItemsToShow: 10,
            formatItem: function (item, j, num) {
                var classLevelTips = '';
                if (item.classLevel) {
                    classLevelTips = '<span style="margin-left:10px;color:gray">在</span><span style="color:#BBBBBB">' + item.classLevel + '</span><span style="color:gray">分类下</span>';
                }
				//用空格来分隔
				var inputVal= $input.val().split(' ');
				if(item.label===''){
					return '<span >无匹配结果</span>';
				}
				var labelVal = item.label;
				var lastVal = "";
				for(var i=0;i<$input.val().split(' ').length;i++){
					if(item.label.toLowerCase().indexOf(inputVal[i].toLowerCase())>=0){
						var reg = new RegExp(inputVal[i],"i");
						if(item.label.indexOf(inputVal[i].toLowerCase())>=0){
							lastVal=inputVal[i].toLowerCase();
						}else{
							lastVal=inputVal[i].toUpperCase();
						}
						labelVal = labelVal.replace(reg,'<span style="color:#2C9AEF">'+lastVal+'</span>');
					}
				}
				//显示扩展字段值
				var otherVal = '<br/><span class="othercontext">'+item.value+"  "+item.code+'</span>';
				return '<span title="' + item.code + ' ' + item.label + '">' + labelVal + classLevelTips + '</span>';
                //return '<span title="' + item.code + ' ' + item.label + '">' + item.label + classLevelTips + otherVal +'</span>';
            },
            select: function (item) {
                var node = {
                    refname: item.label,
                    refcode: item.code,
                    refpk: item.value
                };
                //keep autocompleteVal
				if(node.refpk==='' && node.refcode==='' && node.refname===''){
                	$input.val('');
                }else{
	                that.autocompleteVal = node;
	                if (that.options.isMultiSelectedEnabled) {
	                    var selections = that.getSelections();
	                    that.setValue(selections);
	                } else {
	                    that.setValue([node]);
	                }
	                updateHotData(that.options.getRefHotDataKey(), item.itemVal, that.options.hotDataSize);
				}
            },
            width: that.getSearchWidth(),
            source: function (request, response) {
                var innerThis = this;
				var context = request.term;
				var urlVal = that.options.ctx + '/iref_ctr/filterRefJSON';
				//弹出框时改变搜索div的定位
				if(typeof $input.closest('.wrappdept-content')[0] !=='undefined'){
			        innerThis.$results.css("position","fixed");
				}
				//var context = request.term.replace(/(^\s+)|(\s+$)/g,"").replace(/\s/g,"");
				//var context = request.term.split(' ')[request.term.split(' ').length-1];
				var isNotLeafParam = that.options.refModel.isNotLeafSelected;
				if((that.options.isCheckListEnabled && context==="") || (typeof context !== 'undefined' && context.trim() !== '')){
					that.ajax({
	                    url: urlVal,
	                    dataType: "json",
	                    traditional: true,
	                    type: "post",
	                    async: false,
	                    data: $.extend({}, {
	                        "content": encodeURIComponent(encodeURIComponent(context))
	                    },{"isNotLeafParam":String(isNotLeafParam)}, that.getRefParam()),
	                    success: function (data) {
							innerThis.hasFocus = true;
	                        var items = data.data;
							if(items.length>0){
		                        response($.map(items, function (item) {
		                            return {
		                                label: item.refname,
		                                classLevel: item.classLevel,
		                                code: item.refcode,
		                                value: item.refpk,
		                                itemVal:item
		                            };
		                        }));
							}else{
								 response([{ label: "",classLevel:"",code:"",value:""}]);
							}
	                    }
	                });
				}else{
					response([{ label: "",classLevel:"",code:"",value:""}]);
				}
            },
            minLength: 2
        })
    };


    Refer.prototype.onPagePre = function () {
        this.pageState[this.pageDefault].currentPage--;
    };

    Refer.prototype.onPageNext = function () {
        if (this.hasNextPage()) {
            this.pageState[this.pageDefault].currentPage++;
           
            if (this.isGridTree() && !this.options.isClassDoc) {
                var treeObj = $.fn.zTree.getZTreeObj(this.getTreeID());
                var nodes = treeObj.getSelectedNodes();
                if (nodes && nodes.length > 0) {
                    this.loadGridTreeData(nodes[0], true);
                }
            } else {
                this.loadData();
            }
            //this.isPaging = false;
        }
    };
	//分页
    Refer.prototype.updatePagination = function (page) {
        var state = this.pageState[this.pageDefault];
        state.totalPages = page.pageCount;
        state.currentPage = page.currPageIndex;
        state.lastPage = state.firstPage === 0 ? state.totalPages - 1 : state.totalPages;
        if (state.currentPage > state.totalPages) {
            state.currentPage = state.lastPage;
        }

    };

    Refer.prototype.hasNextPage = function () {
        var state = this.pageState[this.pageDefault];
        var currentPage = state.currentPage;
        return currentPage < state.lastPage;
    };

	/**
	 * 内部封装命名空间,触发事件
	 * @param {Object} name
	 */
    Refer.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);
        name += '.uui.refer';
        this.$el.trigger($.Event(name), args);

        this.options.onAll(name, args);
        this.$el.trigger($.Event('all.uui.refer'), [name, args]);
    };

	/**
	 * 对已选的增加css样式
	 * @param {Object} clickedItem
	 */
    Refer.prototype.markSelection = function (clickedItem) {
        var that = this;
        that.$el.find('ul.hotData li').each(function () {
            var $this = $(this);
            $this.removeClass('selected');
        });
        //allData
        that.$el.find('ul.ul_list2 li').each(function () {
            var $this = $(this);
            $this.removeClass('selected');
        });
        clickedItem.toggleClass('selected');
    };
	//常用数据联动
    Refer.prototype.unSelections = function (unSelectedPK) {
        var that = this;
        //autocompleteVal
        var autoVal = that.autocompleteVal;
        if (autoVal && autoVal.refpk === unSelectedPK) {
            that.autocompleteVal = null;
        }
        //hotData
        that.$el.find('ul.hotData li').each(function () {
            var $this = $(this);
            var pk = $this.attr('pk');
            if (unSelectedPK === pk) {
                $this.find('input').attr("checked", false);
            }
        });
        //allData
        that.$el.find('ul.ul_list2 li').each(function () {
            var $this = $(this);
            var pk = $this.attr('pk');
            if (unSelectedPK === pk) {
                $this.find('input').attr("checked", false);
                $this.find("label").removeClass("is-checked");
            }
        });
        //docClass
        that.$el.find('ul.refer_list li').each(function () {
            var $this = $(this);
            var pk = $this.attr('pk');
            if (unSelectedPK === pk) {
                $this.find('input').attr("checked", false);
                $this.find("label").removeClass("is-checked");
            }
        });
        var tableData = that.$el.find(".msgtype-table").bootstrapTable('getData');
        if(typeof tableData !=='undefined' && tableData.length>0){
        	$.each(tableData, function (i, val) {
        		if (unSelectedPK === val.refpk) {
        			val.selected = false;
        		}
        	});
        }
        var tablehotData = that.$el.find(".msgtype-table2").bootstrapTable('getData');
        if(typeof tableData !=='undefined' && tableData.length>0){
        	$.each(tablehotData, function (i, val) {
        		if (unSelectedPK === val.refpk) {
        			val.selected = false;
        		}
        	});
        }
        that.updateSelectedTab();
    };

    Refer.prototype.unSelectedAllHotData = function () {
        var that = this;
        //hotData
        that.$el.find('ul.hotData li').each(function () {
            $(this).find('input').attr("checked", false);
        });
    };

	/**
	 * 获取已选的数据
	 * @param {Object} needUpdateHotData
	 */
    Refer.prototype.getSelections = function (needUpdateHotData,sysnDataFlag) {
        var that = this;
        that.options.selectedVals = [];
        //模糊匹配
//        if (that.autocompleteVal) {
//            that.options.selectedVals.push(that.autocompleteVal);
//        }
        //hotData
        that.$el.find('ul.hotData li').each(function () {
            var $this = $(this);
            var item = {};
            item.refpk = $this.attr('pk');
            item.refname = $this.attr('name');
            item.refcode = $this.attr('code');
            if ($this.find('input:checked').length === 1) {
                that.options.selectedVals.push(item);
            }
            if ($this.hasClass('selected')) {
                that.options.selectedVals.push(item);
            }

        });
        //allData
        that.$el.find('ul.ul_list2 li').each(function () {
            var $this = $(this);
            var item = {};
            item.refpk = $this.attr('pk');
            item.refname = $this.attr('name');
            item.refcode = $this.attr('code');

            if ($this.find('input:checked').length === 1) {
                that.options.selectedVals.push(item);
            }
            if ($this.hasClass('selected')) {
                that.options.selectedVals.push(item);
            }
        });
        //docClass
        that.$el.find('ul.refer_list li').each(function () {
            var $this = $(this);
            var item = {};
            item.refpk = $this.attr('pk');
            item.refname = $this.attr('name');
            item.refcode = $this.attr('code');

            if ($this.find('input:checked').length === 1) {
                that.options.selectedVals.push(item);
            }
            if ($this.hasClass('selected')) {
                that.options.selectedVals.push(item);
            }
        });
		//模糊匹配
        if (that.autocompleteVal){
            that.options.selectedVals.push(that.autocompleteVal);
        }
        //---------------------------------------------------
        //GridTree table
        if (that.isGridTree() && (!that.options.isClassDoc)) {
            if (!that.options.isMultiSelectedEnabled) {
                var selected = that.$el.find(".msgtype-table").find('tr.selected');
                if (selected) {
                    var dataIndex = selected.attr('data-index');
                    that.options.selectedVals.push(that.$el.find(".msgtype-table").bootstrapTable('getData')[dataIndex]);
                }
            } else {
                var pageInfo = that.pageState;
                var allSelected = [];
                for (var key in pageInfo) {
                    if (pageInfo.hasOwnProperty(key)) {
                        var classSelected = $.grep(pageInfo[key].data, function (e) {
                            return e.selected === true;
                        });
                        allSelected = allSelected.concat(classSelected);
                    }
                }
                that.options.selectedVals = that.options.selectedVals.concat(allSelected);
                that.$el.find('.refer_nav li.action').attr("index")==="1" && (that.options.selectedVals = that.options.selectedVals.concat(that.$el.find(".msgtype-table2").bootstrapTable('getSelections')));
            }
        }
        if (that.isTree() && that.options.isMultiSelectedEnabled) {
        	var getdata = that.$el.find(".msgtype-table").bootstrapTable('getData');
        	var val = $.map(getdata, function(val, index) {
        		val.refname = val.name || val.refname;
				return val;
			})
			that.options.selectedVals = that.options.selectedVals.concat(val);
            //that.options.selectedVals = that.options.selectedVals.concat(that.$el.find(".msgtype-table").bootstrapTable('getData'));
        }
        if (that.isGrid() && that.options.isMultiSelectedEnabled) {
            that.options.selectedVals = that.options.selectedVals.concat(that.$el.find(".msgtype-table").bootstrapTable('getSelections'));
            that.options.selectedVals = that.options.selectedVals.concat(that.$el.find(".msgtype-table2").bootstrapTable('getSelections'));
        }
        //多选情况下 根据input框里默认值  同步参照里面的数据
        if(typeof that.values !=='undefined' && that.values.length>0 && sysnDataFlag){
        	if(that.values.length===1 && that.values[0].refpk===""){
        		that.options.selectedVals = [];
        	}else{
        		that.options.selectedVals = that.values;
        	}
        }
        //hotData duplicate with AllData Items 过滤掉重复数据，使常用数据里面不会出现重复相同的数据
        that.options.selectedVals = arrayUniqBy(that.options.selectedVals, 'refpk');

        if (needUpdateHotData) {
            updateHotData(that.options.getRefHotDataKey(), that.options.selectedVals, that.options.hotDataSize);
        }
        //that.options.isClearData && (that.options.selectedVals = []) && (that.values = []);
        return that.options.selectedVals;
    };


    Refer.prototype.uncheckAll = function () {
        var that = this, treeObj, pageInfo;
        //autocompleteVal
        that.autocompleteVal = null;

        that.$el.find(".msgtype-table-selectedData").bootstrapTable('load', {data: []});
        that.unSelectedAllHotData();
        
         //allData
        that.$el.find('ul.ul_list2 li').each(function () {
            var $this = $(this);
                $this.find('input').attr("checked", false);
        });
        //docClass
        that.$el.find('ul.refer_list li').each(function () {
            var $this = $(this);
            $this.find('input').attr("checked", false);
        });
                
        //Tree
        if (that.isTree()) {
            treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
            if (treeObj) {
                treeObj.checkAllNodes(false);
            }
            that.$el.find(".fixed-table-body .msgtype-table").bootstrapTable('load', {data: []});
        }

        //Grid
        if (that.isGrid() && that.options.data) {
            $.each(that.options.data, function (i, val) {
                val.selected = false;
            });
            that.$el.find(".fixed-table-body .msgtype-table").bootstrapTable('load', {data: that.options.data});
            //that.$el.find(".fixed-table-body .msgtype-table2").bootstrapTable('load', {data: that.options.data});
        }

        //GridTree
        if (that.isGridTree()) {
            treeObj = $.fn.zTree.getZTreeObj(that.getTreeID());
            pageInfo = that.pageState;
            for (var key in pageInfo) {
                if (pageInfo.hasOwnProperty(key)) {
                    if (pageInfo[key].data) {
                        $.each(pageInfo[key].data, function (i, val) {
                            val.selected = false;
                        });
                    }
                }
            }
            if (treeObj) {
                var nodes = treeObj.getSelectedNodes();
                if (nodes && nodes[0]) {
                    var treeNode = nodes[0];
                    pageInfo = that.initPage(treeNode.id);
                    if (pageInfo.data.length > 0) {
                        that.$el.find(".fixed-table-body .msgtype-table").bootstrapTable('load', {data: pageInfo.data});
                        that.$el.find(".fixed-table-body .msgtype-table2").bootstrapTable('load', {data: pageInfo.data});
                    }
                }
            }else{
				 var hotData = getLocalStore(that.options.getRefHotDataKey());
				 var validHotData = that.syncHotData(hotData);//有效性校验
				 if(validHotData && validHotData.length>0){
					 $.each(validHotData, function (i, val) {
		                 val.selected = false;
		             });
				 }
            	 that.$el.find(".fixed-table-body .msgtype-table2").bootstrapTable('load', {data: validHotData});
			}
        }
        that.updateSelectedTab();
        this.trigger('uncheck-all');
    };

    Refer.prototype.destroy = function () {
        this.$el.remove();
    };
	
	Refer.prototype.getInstance = function () {
       return  this;
    };
	
    Refer.prototype.showLoading = function () {
		var loaderEl = this.options.loaderEl;
		if (loaderEl) {
			loaderEl.show();
		}else{
			this.getDefaultLoader().toggleClass('loader');	
		}
    };

    Refer.prototype.hideLoading = function () {
		var loaderEl = this.options.loaderEl;
		if (loaderEl) {
			loaderEl.hide();
		}else{
			this.getDefaultLoader().removeClass('loader');
		}
    };

    Refer.prototype.refresh = function (params) {
        if (params && params.url) {
            this.options.url = params.url;
        }
        this.initServer(params && params.silent);
    };
    
    // Refer PLUGIN DEFINITION
    // =======================
    $.fn.Refer = function (option, _relatedTarget) {
        var allowedMethods = [
                'getSelections', 'getData', 'show', 'hide',
                'load', 'append', 'remove',
                'checkAll', 'uncheckAll','getInstance',
                'refresh', 'getRefValByPK', 'getOptions',
                'destroy'
            ],
            value;

        this.each(function () {
            var $this = $(this);
            var data = $this.data('uui.refer');
            var options = $.extend({}, Refer.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }

                if (!data) {
                    return;
                }

                value = data[option](_relatedTarget);

                if (option === 'destroy') {
                    $this.removeData('uui.refer');
                }
            }

            if (!data) {
                $this.data('uui.refer', (data = new Refer(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.Refer.Constructor = Refer;
    $.fn.Refer.defaults = Refer.DEFAULTS;
	//Tools Method
	$.Refer={};
	$.Refer.exports = Refer.exports;
	$.Refer.viewHelper = viewHelper;

}(jQuery);
