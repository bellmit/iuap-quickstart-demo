require.config({
	paths: {
		'ajaxfileupload':"/uitemplate_web/static/js/attach/ajaxfileupload"
	},
	shim: {}
})
define(['ajaxfileupload'],function(ajaxfileupload){

	var addAttachEvent = function(){
		
		var filepath="/hr/fileupload/";
        var groupname="hr";
        $(document).on("change", "#uploadbatch_id", function(e) {
        	var fieldid = $(this).parent().attr("fieldid");//用于绑定url信息
        	var timestamp=new Date().getTime();
        	if($("#uploadbatch_id")[0].files[0]!=null){
        		filesystem_fileUpload(filepath+timestamp,groupname,true,fieldid);
        	}
		});
        
		$("#fileList").hover(function(){
				$("#filePicker").removeClass("hide");
				$("#uploadbatch_id").removeClass("hide");
		   },function(){
				   $("#filePicker").addClass("hide");
				   $("#uploadbatch_id").addClass("hide");
		});
	}
	 function filesystem_fileUpload(filepath,groupname,imageflag,fieldid) {
		 	$.ajaxFileUpload({
		 		url : "/filesrv/file/upload",
		 		secureuri:false,
		 		fileElementId : 'uploadbatch_id',
		 		type : 'post',//固定 post类型 不可修改 
		 		dataType : 'json', //返回值类型 一般设置为json
		 		data : {
			        filepath:filepath,//[单据相关的唯一标示，一般包含单据ID，如果有多个附件的时候由业务自己制定规则]
			        groupname:groupname, //[分組名称,未来会提供树节点]
			        url:true,  //是否返回附件的连接地址,
			        permission: "read",
			        thumbnail :  "500w",//【选填】缩略图--可调节大小，和url参数配合使用，不会存储到数据库
					//cross_url : "/filesrv/" //【选填】跨iuap-saas-fileservice-base 时候必填
				},
		 		success : function(result) //服务器成功响应处理函数
		 		{
		 			if(result && 1 == result.status && result.data.length > 0){
		 				if(imageflag){//如果是头像上传
		 					var pictureUrl = result.data[0].url;
							if(pictureUrl.indexOf("http")<0){
								pictureUrl="http://"+pictureUrl;
							}
							$(".touxiangimg")[0].src=pictureUrl;
							//绑定url
				        	app.dataTables.headform.getCurrentRow().setValue(fieldid,pictureUrl);
 				        }
					}else {
						var message = result.message;
						u.showMessageDialog({type:"info",title:"头像上传错误信息",msg: message,backdrop:true});
					}
		 		}
		 	}) 
	 };
	
	return {
		addAttachEvent: addAttachEvent
	}
	
})