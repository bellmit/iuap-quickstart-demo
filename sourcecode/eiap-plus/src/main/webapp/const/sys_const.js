define(['jquery'], function() {
	var dialogmin=require('dialogmin');
	
	//系统常量，被系统各个页面使用。
	window._CONST={
			//卡片(form)操作类型（增加-ADD,编辑-EDIT,查看-VIEW,列表-LIST,删除-DELETE）
			FORM_STATUS_ADD: 'ADD',
			FORM_STATUS_EDIT: 'EDIT',
			FORM_STATUS_VIEW: 'VIEW',
			FORM_STATUS_LIST: 'LIST',//返回列表界面
			FORM_STATUS_DEL: 'DELETE',//删除
			
			//树类型（组织树、部门树、岗位数、字典树...）。其中，同一页面使用同一树，但作用不同，则用常量做维度进行区别树。
			TREE_ORG: 'ORG_TREE',//默认组织树。			
			TREE_BUSINESS_UNIT:'BUSINESS_UNIT',//业务单元（组织树）
			TREE_FUN_ORG: 'FUN_ORG_TREE',//默认功能组织树：如借款组织等
			TREE_DEPT: 'DEPT_TREE',//默认部门树。
			TREE_POST: 'POST_TREE',//默认岗位树。
			TREE_ORG_SEARCH: 'ORG_TREE_SEARCH',//查询时，使用组织树。
			TREE_ORG_USERJOB: 'ORG_TREE_USERJOB',//用户任职时：用户及用户任职都使用组织树，用此变量做维度。
			TYPE_DICT:'DICT_TREE',//默认字典树。
			
			//窗口选择
			CONTRACT: 'CONTRACT',//选择合同
			GROWER: 'GROWER',//选择种植户
			USER:'USER',//选择用户		
			
			//审核
			APPROVE:'APPROVE',
			//弃审
			ABANDON:'ABANDON',
			//批量审核
			BATCHAPPROVE:'BATCHAPPROVE',
			
	};	
	
	//系统单据常量，系统各个页面使用。
	window._BILL={
			//新增（开立）
			BILL_NEW: "1",
			//提交（审核申请或审核中）
			BILL_SUBMIT: "2",
			//已审核（审核通过）
			BILL_APPROVE: "3",
			//拒绝（审核不通过）
			BILL_REJECT: "4",
			//废弃（也可表示弃审单据）
			BILL_ABANDON: "5",
			//结算中（不能修改、审核、删除操作，仅查看）
			BILL_SETTLING: "6",
			//已结算（不能修改、审核、删除操作，仅查看）
			BILL_SETTLED: "7",
			//归档（此状态单据不能做任何操作，仅查看）
			BILL_FILED: "9",
			
			//展期申请
			EXTEND: "1",
			//展期申请通过
			EXTEND_APPROVE: "2",
			
			//种植户还款
			WHOPAY_GROWER:"1",
			//区域公司还款
			WHOPAY_AREA_COMPAY:"2",
	};
	
	window._CODE={
			//权属物类别
			SYS_DICT_TYPE_01:"01",
			//公司类别
			SYS_DICT_TYPE_02:"02",
			//币种
			SYS_DICT_TYPE_03:"03",
			//种植户自身风险档案
			SYS_DICT_TYPE_04:"04",
			//自然风险类别
			SYS_DICT_TYPE_05:"05",
			//风险等级
			SYS_DICT_TYPE_06:"06",
			//性别
			SYS_DICT_TYPE_07:"07",
			//身体状况
			SYS_DICT_TYPE_08:"08",
			//职业
			SYS_DICT_TYPE_09:"09",
			//民族
			SYS_DICT_TYPE_10:"10",
			//种植户类别
			SYS_DICT_TYPE_11:"11",
			//家庭成员关系
			SYS_DICT_TYPE_12:"12",
			//开户行档案
			SYS_DICT_TYPE_13:"13",
			//农作物
			SYS_DICT_TYPE_14:"14",
			//资产类型
			SYS_DICT_TYPE_15:"15",
			//土地类型
			SYS_DICT_TYPE_16:"16",
			//交通状况
			SYS_DICT_TYPE_17:"17",
			//借款用途
			SYS_DICT_TYPE_18:"18",
			//等级
			SYS_DICT_TYPE_19:"19",
			//消息类别
			SYS_DICT_TYPE_20:"20",
	};
	//档案明细编码
	window._DICT_CODE={
			//水稻
			SYS_DICT_RICE:"1401",
			//玉米
			SYS_DICT_CORN:"1402",
			//自然人
			SYS_DICT_NATURAL_PERSON:"1101",
			//法人
			SYS_DICT_ARTIFICIAL_PERSON:"1102",
	};
	//打印模板对应的rest的url
	window._WORDPRINT_TEMPLATE_REST_URL="http://127.0.0.1:8083";
	window._WORDPRINT_TEMPLATE_REST_WORDPRINTFILE="/wordprint/word/file/merger?word_file=";
	window._WORDPRINT_TEMPLATE_REST_WORDPRINTJSP="/wordprint/static/officeedit/word.jsp?pageId=officeedit&&canopen=true&&noieopen=true&&readonly=true&&filesave=false&&filesaveas=true&&TrackRevisions=false&&showRevisions=false&&savepk=1234567890&&openurl=";
	//打印模板编码
	window._WORDPRINT_TEMPLATE_CODE={
			//个人种植户考察考实表
			SYS_WORDPRINTTEMPLATE_GROWER:"GrowersExam",
			//企业种植户考察考实表
			SYS_WORDPRINTTEMPLATE_ORGGROWER:"GrowersExamOrg",
			//借款合同
			SYS_WORDPRINTTEMPLATE_CONBORROW:"ConBorrow",	
			//附件3农业种植服务协议
			SYS_WORDPRINTTEMPLATE_PLANTAGREEMENT:"PlantAgreement",	
			//附件6.1：抵押合同模板【房产，车辆、农机具（不交付我司）】 -适用土地经营权			
			SYS_WORDPRINTTEMPLATE_MORTGAGECONTRACT:"MortgageContract",
			//附件6.1：抵押合同模板【房产，车辆、农机具（不交付我司）】 -适用房产，车辆、农机具			
			SYS_WORDPRINTTEMPLATE_CMORTGAGECONTRACT:"CMortgageContract",
			//附件6.2：股权质押合同模板
			SYS_WORDPRINTTEMPLATE_STOCKCONTRACT:"StockContract",
			//附件6.3：质押合同模板【车辆、农机具，交付我司】
			SYS_WORDPRINTTEMPLATE_PLEDGECONTRACT:"PledgeContract",
			//附件9：保证合同
			SYS_WORDPRINTTEMPLATE_GURACONTRACT:"GuraContract",
			//林权转让协议书
			SYS_WORDPRINTTEMPLATE_AGREEMENTCONTRACT:"AgreementContract",
			//土地转让协议书
			SYS_WORDPRINTTEMPLATE_LANDAGREEMENTCONTRACT:"LandAgreementContract",
			//附件8：联保合同
			SYS_WORDPRINTTEMPLATE_UNIONGUARACTY:"UnionGuaranty",
			//附件5：借款借据
			SYS_WORDPRINTTEMPLATE_LOANBILL:"LoanBill",
			//独立保证合同
			SYS_WORDPRINTTEMPLATE_DGURACONTRACT:"DGuraContract",
			//独立抵押合同模板	-适用土地经营权	
			SYS_WORDPRINTTEMPLATE_DMORTGAGECONTRACT:"DMortgageContract",
			//独立抵押合同模板	-适用房产，车辆、农机具		
			SYS_WORDPRINTTEMPLATE_CDMORTGAGECONTRACT:"CDMortgageContract",
			//独立质押合同模板
			SYS_WORDPRINTTEMPLATE_DPLEDGECONTRACT:"DPledgeContract",
			//个人种植户考察考实表，打印流程图
			SYS_WORDPRINTTEMPLATE_FLOWHISGROWER:"FlowHisGrowersExam",
			//合同审批，打印流程图
			SYS_WORDPRINTTEMPLATE_FLOWHISCONTRACTAPPROVE:"FlowHisContractApprove",
			//收粮加价审批单，打印流程图
			SYS_WORDPRINTTEMPLATE_FLOWHISGRAINFARE:"FlowHisGrainFare",
			//区域结算单审批单，打印流程图
			SYS_WORDPRINTTEMPLATE_FLOWHISSETTLEMENT:"FlowHisSettlement"				
	};
	//161201 xdx 小合同及土地档案的报表查询单据查询下拉框显示状态
	window.fieldBillStatusItems= [{
		"value": "1",
		"name": "开立"
      }, {
    	"value": "2",
    	"name": "审核中"
      },{
	    "value": "3",
	    "name": "已审核"
      },{     
        "value": "5",
        "name": "弃审"
    }];
	//单据查询下拉框显示状态
	window.billStatusItems= [{
		"value": "1",
		"name": "开立"
      }, {
    	"value": "2",
    	"name": "审核中"
      },{
	    "value": "3",
	    "name": "已审核"
      },{
        "value": "4",
        "name": "拒绝"
      },{
        "value": "5",
        "name": "弃审"
      },{
        "value": "6",
        "name": "结算中"
      },{
        "value": "7",
        "name": "已结算"
      },{
        "value": "9",
        "name": "归档"
       }];
	
	//定义通过是否的字典属性
	window.YesOrNo = [{
        "value": "N",
        "name": "否"
      }, {
        "value": "Y",
        "name": "是"
      }];
	
	//定义通过是否的字典属性
	window.YesOrNoOrNull = [
	  {
	     "value":"",
	     "name": ""
	  },
	  {
        "value": "N",
        "name": "否"
      }, {
        "value": "Y",
        "name": "是"
      }];
	
	//定义通过是否的字典属性
	window.BPMBillStateItems = [
	  {
        "value": "NotStart",
        "name": "开立"
      }, 
	  {
          "value": "Submit",
          "name": "已提交"
      },
      {
        "value": "Run",
        "name": "审批中"
      }, 
      {
         "value": "End",
         "name": "审批通过"
      }, 
      {
          "value": "Settling",
          "name": "结算中"
       }, 
       {
           "value": "Settled",
           "name": "已结算"
        }, 
//      {
//          "value": "Cancellation",
//          "name": "审批不通过"
//      },
      {
          "value": "Termination",
          "name": "审批不通过"
      },       
      {
          "value": "Suspended",
          "name": "挂起"
       }
      ];
	
	/**
	 * 判断某一日期是否在某一年年份之内：
	 * true:是
	 * false:否
	 */
	checkDateInYear = function(temDate,temYear){
		var starDateTime = new Date(temYear + "-01-01 00:00:00").getTime();
		var endDateTime =  new Date(temYear + "-12-31 23:59:59").getTime();
		var temDateTime = new Date(temDate).getTime();
		
		if(temDateTime <= endDateTime && temDateTime >= starDateTime){
			return true;
		}else{				
			return false;
		}			
	};
	//获取包含当前年度后的options(数量)个年度字典，参数options为数量。
	getYearItems = function(options) {
		var nowYear = new Date().getFullYear();
		var years = [];
		
		for(var i=0;i<options;i++){
			var yearOptions = {};
			var yearValue = nowYear+i;
			yearOptions.value = ""+yearValue;
			yearOptions.name = yearValue + "年";
			years.push(yearOptions);
		}
		return years;
	}
	//获取历年种植年份
	getPlantHisYear = function(options) {
		var nowYear = new Date().getFullYear();
		var years = [];
		for(var i=0;i<options;i++){
			var yearOptions = {};
			var yearValue = nowYear-i;
			yearOptions.value = ""+yearValue;
			yearOptions.name = yearValue;
			years.push(yearOptions);
		}
		return years;
	}
	//定义字典所需的meta对象
	window.dictMeta = {
		meta:{
			value:{type:'string'},
			name:{type:'string'}
		}
	};
	
	/*动态加载字典
	 * 
	 * jsonData：ajax向后台请求的json数据对象
	 * ajaxurl：ajax向后台请求url
	 * dictDa：需要赋值（已定义dictMeta）的字典
	 * 
	 * */
	getDictData = function(jsonData,ajaxurl,dictDa) {
		$.ajax({
			type:'post',
			datatype:'json',
//			async:false,
			data:JSON.stringify(jsonData),
			url:ajaxurl,
			contentType: 'application/json;charset=utf-8',
			success:function(res){
				if(res){
					if (res.statusCode == '200') {
						dictDa.removeAllRows();
						dictDa.clear();
						dictDa.setSimpleData(res.data);
					} else {
						u.showMessage({
							msg: '<i class="fa fa-times-circle margin-r-5"></i>' + res.message,
							position: "center",
							msgType: "error"
						});
					}
				} else {
					u.showMessage({
						msg: '<i class="fa fa-times-circle margin-r-5"></i>未返回任何数据',
						position: "center",
						msgType: "error"
					});
				}
			},
			error: function(er) {
				u.showMessage({
					msg: '<i class="fa fa-times-circle margin-r-5"></i>' + er.responseText,
					position: "center",
					msgType: "error"
				});
			}
		});
	};
	

	/*
	 * 访问远程接口并返回数据
	 * jsonData：ajax向后台请求的json数据对象
	 * ajaxurl：ajax向后台请求url
	 * cb：返回数据（rs.data）
	 * 
	 * */
	callRemoteData = function(jsonData,ajaxurl,cb) {
		$.ajax({
			type:'post',
			datatype:'json',
//			async:false,
			data:JSON.stringify(jsonData),
			url:ajaxurl,
			contentType: 'application/json;charset=utf-8',
			success:function(res){
				if(res){
					if (res.statusCode == '200') {
						cb(res.data);
					} else {
						u.showMessage({
							msg: '<i class="fa fa-times-circle margin-r-5"></i>' + res.message,
							position: "center",
							msgType: "error"
						});
					}
				} else {
					u.showMessage({
						msg: '<i class="fa fa-times-circle margin-r-5"></i>未返回任何数据',
						position: "center",
						msgType: "error"
					});
				}
			},
			error: function(er) {
				u.showMessage({
					msg: '<i class="fa fa-times-circle margin-r-5"></i>' + er.responseText,
					position: "center",
					msgType: "error"
				});
			}
		});
	};
	
	/*绑定数据
	 * dictObj：需要绑定的字典对象
	 * dictDa：已赋值（定义dictMeta）的字典
	 * */
	dictBindData = function(dictObj,dictDa) {
		dictObj.setComboData(dictDa.getSimpleData());
	}
	
    /*
     * 检查唯一性
     */
	checkedIsUnique = function(jsonData,ajaxUrl,dialogminInfo){
//		u.messageDialog({msg: "检查唯一性!",title: "提示",btnText: "OK"});
		$.ajax({
			type:"post",
			url:ajaxUrl,
			contentType: 'application/json;charset=utf-8',
			data:JSON.stringify(jsonData),
			success:function(res){
				if(res.result !='true'){
					dialogmin(dialogminInfo);
				}
			},
			error:function(er){
				u.messageDialog({msg:'请求失败'+er,title:'操作提示',btnText:'确定'});
			}
		});
	}
	
    /*
     * 两日期天数差（不考虑时间）
     * 
     * startDate 起始日期
     * endDate 结束日期
     */
	diffDate = function(startDate,endDate){	
        var sDate = new Date(startDate.substr(0,4),startDate.substr(5,2)-1,startDate.substr(8,2));
        var eDate = new Date(endDate.substr(0,4),endDate.substr(5,2)-1,endDate.substr(8,2));
        var days = (eDate.getTime()-sDate.getTime())/24/60/60/1000;
        
        return days;
	}
	
    /*
     * 日期格式（用于显示）
     * 格式：2016-01-01
     * 
     * newDate 需要格式的日期
     */
	dateFormat = function(newDate){
		return (newDate.getFullYear()+"-"+(newDate.getMonth()>8?(newDate.getMonth()+1):"0"+(newDate.getMonth()+1))+"-"+(newDate.getDate()>9?newDate.getDate():"0"+newDate.getDate()));
        //return (newDate.substr(0,4)+"-"+(newDate.substr(5,2)-1)+"-"+newDate.substr(8,2));
	},	
	reportDateFormat = function(reportDate){	
		if(reportDate == null ||reportDate == "" || reportDate == undefined ||  reportDate.length == 0){
			return dateFormat(new Date());
		}		
		return dateFormat(new Date(reportDate));
	},
	//四舍五入，保留两位小数点，并用财务千分位显示
	gridNumToformat=function(obj){
    	var newNum = obj.value;        	
    	var n=numHalfUp(newNum,2);        	
    	var re=/-?\d{1,3}(?=(\d{3})+$)/g;
    	var n1=n.replace(/^(-?\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});        		
		obj.element.innerHTML = "" + n1;
    },	 
    //四舍五入，保留两位小数点，并用财务千分位显示
    tableNumToformat=function(newKey){    	
    	if(typeof(newKey)=='function'){
			var value= newKey();
		}else{
			var value = newKey;
		}	
    	if(value ==null){
    		value = 0;
    	}
    	var newNum = value;        	
    	var n=numHalfUp(newNum,2);        	
    	var re=/-?\d{1,3}(?=(\d{3})+$)/g;
    	var n1=n.replace(/^(-?\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});        		
		return "" + n1;
    },	  
    //四舍五入，保留3位小数点，并用财务千分位显示  
    tableThreeNumToformat=function(newKey){    	
    	if(typeof(newKey)=='function'){
			var value= newKey();
		}else{
			var value = newKey;
		}	
    	if(value ==null){
    		return value;
    	}
    	var newNum = value;        	
    	var n=numHalfUp(newNum,3);        	
    	var re=/-?\d{1,3}(?=(\d{3})+$)/g;
    	var n1=n.replace(/^(-?\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});        		
		return "" + n1;
    },	 
	//数字金额自动转换为大写中文字符,返回大写中文字符串，最大处理到999兆。
	changeMoneyToChinese = function(money){
		var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); //汉字的数字
		var cnIntRadice = new Array("","拾","佰","仟"); //基本单位
		var cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位
		var cnDecUnits = new Array("角","分","毫","厘"); //对应小数部分单位
		var cnInteger = "整"; //整数金额时后面跟的字符
		var cnIntLast = "元"; //整型完以后的单位
		var maxNum = 999999999999999.9999; //最大处理的数字

		var IntegerNum; //金额整数部分
		var DecimalNum; //金额小数部分
		var ChineseStr=""; //输出的中文金额字符串
		var parts; //分离金额后用的数组，预定义

		if( money == "" ){
			return "";
		}

		money = parseFloat(money);
		//alert(money);
		if( money >= maxNum ){
			u.messageDialog({msg:'当前金额【'+money+'】超出最大处理数字【999兆】，请联系系统管理。',title:'操作提示',btnText:'确定'});
			return "";
		}
		if( money == 0 ){
			ChineseStr = cnNums[0]+cnIntLast+cnInteger;
			return ChineseStr;
		}
		money = money.toString(); //转换为字符串
		if( money.indexOf(".") == -1 ){
			IntegerNum = money;
			DecimalNum = '';
			}else{
			parts = money.split(".");
			IntegerNum = parts[0];
			DecimalNum = parts[1].substr(0,4);
		}
		if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换
			zeroCount = 0;
			IntLen = IntegerNum.length;
			for( i=0;i<IntLen;i++ ){
				n = IntegerNum.substr(i,1);
				p = IntLen - i - 1;
				q = p / 4;
				m = p % 4;
				if( n == "0" ){
					zeroCount++;
				}else{
					if( zeroCount > 0 ){
						ChineseStr += cnNums[0];
					}
					zeroCount = 0; //归零
					ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
				}
				if( m==0 && zeroCount<4 ){
					ChineseStr += cnIntUnits[q];
				}
			}
			ChineseStr += cnIntLast;
			//整型部分处理完毕
		}
		if( DecimalNum!= '' ){//小数部分
			decLen = DecimalNum.length;
			for( i=0; i<decLen; i++ ){
				n = DecimalNum.substr(i,1);
				if( n != '0' ){
					ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
				}
			}
		}
		if( ChineseStr == '' ){
			ChineseStr += cnNums[0]+cnIntLast+cnInteger;
		}
		else if( DecimalNum == '' ){
			ChineseStr += cnInteger;
		}
		return ChineseStr;
	}
	
    /**
     * 数字四舍五入
     * 
     * numValue 数字
     * scale 小数点位数
     */
	numHalfUp = function(numValue,scale){
		if(numValue==undefined || numValue=='' ||  numValue.length == 0){
			return "0.00";
		}
		//
		if(typeof(numValue) == 'function'){
			var newNum = numValue();
		}else{
			var newNum = numValue;
		}
		
		newNum = parseFloat(newNum)
		
		return newNum.toFixed(scale);
	}
	
	strToFloat = function(newStr){
		if(newStr == undefined || newStr == '' ||  newStr.length == 0){
			return "0.00";
		}
		//
		if(typeof(newStr) == 'function'){
			var newFloat = newStr();
		}else{
			var newFloat = newStr;
		}
		
		return parseFloat(newFloat)
	}
	
	/**
	 * 去除前后空格
	 */
	removeSpace = function(newStr){
		return newStr.replace(/(^\s*)|(\s*$)/g,"");
	}
	
	/**
	 * 去除所有空格（前后及中间）
	 */
	removeAllSpace = function(newStr){
		return newStr.replace(/\s+/g, "");
	};
	
	/*
	 * 
	 * 默认方式，异步执行AJAX
	 * 
	 * 执行AJAX并返回数据
	 * ajaxurl：ajax向后台请求url
	 * jsonData：ajax向后台请求的json数据对象
	 * 
	 * cb：返回数据（rs）
	 * 
	 * */
	doAjax = function(ajaxUrl,jsonData,cb) {
		//执行ajax
		$.ajax({
			type:'post',
			contentType: 'application/json;charset=utf-8',
			datatype:'json',
			url:ajaxUrl,
			data:JSON.stringify(jsonData),
			async:true,//异步
			beforeSend: function() {
//				dialogmin("处理中，请等待...");
				u.showLoading();
		    },
			success:function(res){
				if(res){
					if (res.statusCode == '200'){
						cb(res);
					}else{
						//操作错误，停留在当前操作界面
						u.messageDialog({msg:'操作错误:'+res.message,title:'操作提示',btnText:'确定'});
					}
				}else{
					//无返回数据，停留在当前操作界面
					u.messageDialog({msg:'无返回数据',title:'操作提示',btnText:'确定'});
				}
			},
			error: function(er) {
				//请求失败，停留在当前操作界面
				u.messageDialog({msg:'请求失败，'+er,title:'操作提示',btnText:'确定'});
			},
            complete: function(){
            	//执行ajax完成。
//            	dialogmin("加载完.");
            	u.hideLoading();
			}
		});
	};
	
	/*
	 * 
	 * 执行AJAX并返回数据
	 * ajaxurl：ajax向后台请求url
	 * jsonData：ajax向后台请求的json数据对象
	 * asyncFlag：是否异步（false-异步，true-同步）。
	 * cb：返回数据（rs）
	 * 
	 * */
	doAjaxAsync = function(ajaxUrl,jsonData,asyncFlag,cb) {
		var newAsyncFlag = false;//同步
		if(asyncFlag == "true"){
			newAsyncFlag = true;//异步
		}
		//执行ajax
		$.ajax({
			type:'post',
			contentType: 'application/json;charset=utf-8',
			datatype:'json',
			url:ajaxUrl,
			data:JSON.stringify(jsonData),
			async:newAsyncFlag,
			beforeSend: function() {
//				dialogmin("处理中，请等待...");
				u.showLoading();
		    },
			success:function(res){
				if(res){
					if (res.statusCode == '200') {
						cb(res);
					}else{
						//操作错误，停留在当前操作界面
						u.messageDialog({msg:'操作错误:'+res.message,title:'操作提示',btnText:'确定'});
					}
				} else {
					//无返回数据，停留在当前操作界面
					u.messageDialog({msg:'无返回数据',title:'操作提示',btnText:'确定'});
				}
			},
			error: function(er) {
				//请求失败，停留在当前操作界面
				u.messageDialog({msg:'请求失败，'+er,title:'操作提示',btnText:'确定'});
			},
            complete: function(){
            	//执行ajax完成。
//            	dialogmin("加载完.");
            	u.hideLoading();
			}
		});
	};
	
	/*
	 * 
	 * 检查身份证号码的合法号码。
	 * 
	 * newIdNumber：验证的身份号码。
	 * 
	 * */
	checkIdNumber = function(newIdNumber){
		var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",
				23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",
				37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",
				46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
				61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
		var iSum = 0;
		if(!/^\d{17}(\d|x)$/i.test(newIdNumber)){
			u.showMessage({msg:"身份证长度或格式错误",position:"center",msgType: "error",showSeconds:1});
			return false;
		}
		newIdNumber = newIdNumber.replace(/x$/i,"a");
		if(aCity[parseInt(newIdNumber.substr(0,2))]==null){
		u.showMessage({msg:"身份证地区非法",position:"center",msgType: "error",showSeconds:1});
			return false;
		}
		sBirthday = newIdNumber.substr(6,4)+"-"+Number(newIdNumber.substr(10,2))+"-"+Number(newIdNumber.substr(12,2));
		var d=new Date(sBirthday.replace(/-/g,"/")) ;
		if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
			u.showMessage({msg:"身份证上的出生日期非法",position:"center",msgType: "error",showSeconds:1});
			return false;
		}
		for(var i = 17;i>=0;i --) {
			iSum += (Math.pow(2,i) % 11) * parseInt(newIdNumber.charAt(17 - i),11);
		}
		if(iSum%11!=1){
			u.showMessage({msg:"身份证号非法",position:"center",msgType: "error",showSeconds:1});
			return false;
		}
		
		return true;
	};
	
	/*
	 * 
	 * 检查字符串是否为空(没有去空格判断)。
	 * 
	 * newStr：待检验字符串。
	 * 
	 * */
	isEmpty = function(newStr){
		if(newStr == undefined || newStr == null){
			return true;
		}else{
			return false;
		}
	};
	
	/*
	 * 
	 * 检查字符串是否为空（去空格判断）。
	 * 
	 * newStr：待检验字符串。
	 * 
	 * */
	isEmptyWithTrim = function(newStr){
		if(newStr == undefined || newStr == null){
			return true;
		}else{
			newStr = removeSpace(newStr);
			if(newStr.length == 0){
				return true;
			}else{
				return false;
			}
		}
	};
	
	/*
	 * 
	 * 验证固定电话、手机号码。
	 * 
	 * newTel：待检验电话（固定电话、手机号码）。
	 * 
	 * 注：手机号码前面以1开头，第二位现在是3或者5，后面是9位数字，则：/^1[35]\d{9}$/。
	 * 
	 * 区号：前面一个0，后面跟2-3位数字 ： 0\d{2,3}，电话号码：7-8位数字： \d{7,8}，分机号：一般都是3位数字： \d{3,}，这样连接起来就是验证电话的正则表达式了：/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
	 * 
	 * 
	 * 验证电话号码：^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$：
	 * 
	 * */
	checkTel = function(newTel){
		var re = /^0\d{2,3}[-_－—]?\d{7,8}|^0?1[358]\d{9}$/;
		
		return re.test(newTel);
//		var result = newTel.match(/^((0\d{2,3})[-_－—]?)?\d{3,8}([-_－—]?\d{3,8})?([-_－—]?\d{1,7})?$)|(^0?1[35]\d{9}$/);
//		if(result == null)
//			return false;
//		else
//			return true;
	};
	
//	window.onload = function (){
//		debugger;
//	};
	
	
	var xyViewModel={
			growerType: [{name:"自然人",value:"自然人"},{name:"法人",value:"法人"}] ,  // 种植户类型  ，  抵/质押人类型
			//formStatus:[{name:"开立",value:"开立"},{name:"通过",value:"通过"}] , //表单状态
			pledgeType:[{name:"抵押合同",value:"抵押合同"},{name:"质押合同",value:"质押合同"}] , // 抵/质押类型
			assetType:[{name:"汽车",value:"汽车"},{name:"房屋",value:"房屋"},{name:"农机具",value:"农机具"},{name:"林权",value:"林权"}
			            ,{name:"土地承包经营权",value:"土地承包经营权"},{name:"股权",value:"股权"}] ,// 资产分类
			register:[{name:'是',value:'是'},{name:'否',value:'否'}],//是否签订抵押合同            
			recycleCre:[{name:"是",value:"是"},{name:"否",value:"否"},{name:"不需要",value:"不需要"}] ,
			goodsType:[{name:"林权",value:"林权"},{name:"土地",value:"土地"},{name:"草原",value:"草原"},{name:"五荒",value:"五荒"}] , // 权属物类别
			//表单的状态
			formStatus:[{name:"草稿",value:"草稿"},{name:"开立",value:"开立"},{name:"已拒绝",value:"已拒绝"},
			           {name:"审核中",value:"审核中"},{name:"已审核",value:"已审核"},{name:"拒绝",value:"拒绝"},
			           {name:"归档",value:"归档"}],
			
			/*动态加载字典
			 * jsonData：ajax向后台请求的json数据对象
			 * ajaxurl：ajax向后台请求url
			 * dictObj：需要赋值  表示被绑定下拉数据的 html 对象,数组对象  
			 * */
			getDictData :function(jsonData,ajaxurl,dictObj){  //dictObj  表示被绑定下拉数据的 html 对象
				$.ajax({
					type:'post',
					datatype:'json',
//					async:false,
					data:JSON.stringify(jsonData),
					url:ajaxurl,
					contentType: 'application/json;charset=utf-8',
					success:function(res){
						if(res){
							if (res.statusCode == '200') {
//								dictObj.setComboData(  res.data  );
								for(var i = 0 ; i< dictObj.length ; i++){
									dictObj[i].setComboData(  res.data  );
								}
							} else {
								u.showMessage({ msg: res.message ,position: "center",  msgType: "error" });
							}
						} else {
							u.showMessage({ msg: '未返回任何数据',position: "center",  msgType: "error" });
						}
					},
					error: function(er) {
						u.showMessage({
							msg: er.responseText,	position: "center",	msgType: "error"
						});
					}
				});
				
			},
	
		   getDictDataCB :function(jsonData,ajaxurl,cb){  //cb  回调函数
				$.ajax({
					type:'post',
					datatype:'json',
					async:false,
					data:JSON.stringify(jsonData),
					url:ajaxurl,
					contentType: 'application/json;charset=utf-8',
					success:function(res){
						if(res){
							if (res.statusCode == '200') {
								cb(res.data) ;
							} else {
								u.showMessage({ msg: res.message ,position: "center",  msgType: "error" });
							}
						} else {
							u.showMessage({ msg: '未返回任何数据',position: "center",  msgType: "error" });
						}
					},
					error: function(er) {
						u.showMessage({
							msg: er.responseText,	position: "center",	msgType: "error"
						});
					}
				});
		}
			
	}
	
	return {
		'model': xyViewModel,
	}
});