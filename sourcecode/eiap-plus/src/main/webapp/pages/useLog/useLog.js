define(['text!./useLog.html','css!./useLog.css'],function(html){
    //./表示根目录
	var app, viewModel, basicDatas, events, inputDom, inputlen, searchflag, usersearchflag,localbrowser;
	var useLogUrl = '/wbalone/';
	basicDatas = {
		listData: new u.DataTable({
			meta: {
				"id":{},
				"clientIp": {},
				"operUser":{},
				"operUserName":{},
				"logCategory":{},
				"logContent":{},
				"sysId":{},
				"logDate":{
					type: 'datetime',
					format:'YYYY-MM-DD'
				},
				"userType":{},
				"loginType":{}
			}
		})
	};


	events = {
		pageChangeFunc: function(index) {
			var params={},querydata={};
//			querydata.queryType='pageNum';//特定页面检索
//			querydata.pageNum=index+1;//第几页数据
//			querydata.pageSize=$("#pagination select").find("option:selected").text();
			params.querydata=querydata;
			params.pageSize=$("#pagination select").find("option:selected").text();
			params.pageNum=index+1;
			ajaxFunction(params);
		},
		sizeChangeFunc: function(newsize) {
			var params={},querydata={};
//			querydata.queryType='pageSizeChange';//特定页面检索
//			querydata.pageSize=newsize;//每页数据条数
			params.querydata=querydata;
			params.pageSize=newsize;
			ajaxFunction(params);
		},
		//页面初始化
		loadData:function(){
			searchflag=false;//判断查询按钮是否点击过
			var params={},querydata={};
//			querydata.queryType='all';//全检索
//			querydata.pageSize=10;//全检索
			params.querydata=querydata;
			params.pageSize=10;
			ajaxFunction(params);
		},
	
       /*页面初始加载*/
	    pageInit:function(){
	        u.createApp({
	            el:'#uselog',
	            model:viewModel
	        });
	        viewModel.loadData();
	        
	        localbrowser = myBrowser();
	    	
	    	inputDom=document.querySelectorAll('input[class*="searchinput"]');//所有条件输入框
	    	inputlen=inputDom.length;
	    	var searchbtn=document.querySelector('[data-role="searchbtn"]');//检索条件按钮
	    	var clearbtn=document.querySelector('[data-role="clearbtn"]');//清除条件按钮
	    	var toggleBtn = document.querySelector('#condition-toggle');//高级检索按钮
			var returnbtn=document.querySelector('[data-role="returnbtn"]');//返回按钮
			var ifuse=false;//是否可用
			
			$("#logCategory").keyup(function(e){
				if(e.keyCode == 13){
					dosearch();
				}
			})

	    	//高级检索功能
	    	u.on(toggleBtn, 'click', function(){
	    	  var conditionRow = document.querySelector('#condition-row');
	    	  var toggleIcon = this.querySelector('i');
	    	  if (u.hasClass(conditionRow, 'u-visible')){
	    	      u.removeClass(conditionRow, 'u-visible').addClass(conditionRow, 'u-not-visible');
	    	      u.removeClass(toggleIcon, 'uf-uparrow').addClass(toggleIcon, 'uf-anglearrowdown');
	    	       this.querySelector('span').innerText='高级';
	    	       //清空查询条件
	    	       for(var i=0;i<inputlen;i++){
	    		        if(inputDom[i].value.length>0){
	    		           inputDom[i].value="";
	    		        }   
	    		     }
	    	  }else{
	    	    u.removeClass(conditionRow, 'u-not-visible').addClass(conditionRow, 'u-visible');
	    	    u.removeClass(toggleIcon, 'uf-anglearrowdown').addClass(toggleIcon, 'uf-uparrow');
	    	     this.querySelector('span').innerText='收起';
	    	  }
	    	})
			
	    	u.on(searchbtn, 'click', function(){//检索按钮
	    		dosearch()
	    	});
	    	
	    	u.on(clearbtn, 'click', function(){//清除按钮
	    		for(var i=0;i<inputlen;i++){
	    	        if(inputDom[i].value.length>0){
	    	           inputDom[i].value="";
	    	           $(inputDom[i]).parent().attr("title","");//去掉tooltip
	    	        }   
	    	     }
	    	})
	    	
	    	u.on(returnbtn, 'click', function(){//清除按钮
	    		history.back();
	    	});
            var element = document.getElementById('pagination');
            viewModel.comp = new u.pagination({el:element,jumppage:true});
            viewModel.comp.on('pageChange',viewModel.pageChangeFunc);
            viewModel.comp.on('sizeChange',viewModel.sizeChangeFunc);
			
	    }
	}
	viewModel = u.extend({}, basicDatas, events)
	
	//所有ajax请求
	var ajaxFunction = function(params) {
		
		var searchhascondition = domshasvalue();
		if(searchhascondition){
			searchflag=true;
			//ajax请求
			var querydata= {};
			var logDate = $('#logDate').val();
            var operUserName = $("#logCategory").val();
			querydata['logDate'] = logDate;
            querydata['operUserName']=operUserName;
			params['querydata'] = querydata;
		}else{//全检索
			params.pageSize=10;
		}
		$.ajaxSetup({cache:false});

		var url = useLogUrl+"compLog/listPostCompLogPage";
		$.ajax({
			type: "post",
			data:JSON.stringify(params),
			dataType: "json",
			contentType:"application/json;charset=utf-8",
			url: url,
			success: function(result) {
				if(!result || result==null){
					return;
				}
				if (result.status!=1 && result.msg) {
					u.messageDialog({msg:result.msg,title:'请求出错',btnText:'确定'});
					return
				}
				var length = result.data.content.length;
				if(length>0){
//					var pageSize=result.pageSize?result.pageSize:params.pageSize;
//					var totalpages=Math.ceil(length/pageSize);
					var totalpages=result.data.totalPages;
					var pageSize=result.data.size;
					var currentPage=result.data.number?(result.data.number+1):1;
					var totalCount=result.data.totalElements;
					viewModel.listData.removeAllRows();
					
					viewModel.listData.setSimpleData(result.data.content,{unSelect:true});
                    if(totalpages>1){
                      $(".paginate-box").removeClass("hide");	
                    }else{
                    	$(".paginate-box").addClass("hide");
                    }
                    viewModel.comp.update({totalPages: totalpages,pageSize:pageSize,currentPage:currentPage,totalCount:totalCount});
                    $('#userLogLLL').hide();
				}else{
                    viewModel.comp.update({totalPages: 0,pageSize:0,currentPage:0,totalCount:0});
                    viewModel.listData.removeAllRows();
					viewModel.listData.setSimpleData([]);
					$('#userLogLLL').show();
				}
			},
			error: function() {}
		})
	};

	var domshasvalue=function(){
	     for(var i=0;i<inputlen;i++){
	        if(inputDom[i].value.length>0){
	            return true;
	        }   
	     }
	     return false;
	}

	//搜索
	function dosearch(){
		var searchhascondition = domshasvalue();
		if(searchhascondition){
			searchflag=true;
			//ajax请求
			var logDate = $('#logDate').val();
			var operUserName = $("#logCategory").val();
			
			var params = {},querydata= {};
			params.pageSize=10;
			querydata['logDate'] = logDate;
			querydata['operUserName']=operUserName;
			params['querydata'] = querydata;
			
			ajaxFunction(params);
			
		}else{//全检索
			var params={},querydata={};
//	    			querydata.queryType='all';//高级条件检索
//	    			querydata.pageSize=10;
			params.querydata=querydata;
			params.pageSize=10;
			ajaxFunction(params);
		}
	}
	
	var myBrowser = function(){
	    var userAgent = navigator.userAgent;
	    var isOpera = userAgent.indexOf("Opera") > -1;
	    if (isOpera) {
	        return "Opera";
	    }else if (userAgent.indexOf("Firefox") > -1) {
	        return "FF";
	    }else if (userAgent.indexOf("Chrome") > -1){
	        return "Chrome";
	    }else if (userAgent.indexOf("Safari") > -1) {
	        return "Safari";
	    }else if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
	        return "IE";
	    }; //判断是否IE浏览器
   	}
	
	$(document).on("click", "#logCloseBtn", function(e) {
		$("#logtable tr[id='logtr']").remove();
	});
    return {
        init:function(content) {
            // 插入内容
			content.innerHTML = html;
			window.headerInit($('#uselogHead')[0],'上机日志')
            viewModel.pageInit();
        }
    }
})

