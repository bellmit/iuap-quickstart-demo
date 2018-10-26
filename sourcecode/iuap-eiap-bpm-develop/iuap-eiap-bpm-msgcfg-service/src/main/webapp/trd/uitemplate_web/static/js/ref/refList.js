require.config({
	urlArgs: "dev=" + (new Date()).getTime(),
	baseUrl: "../",
	paths: {
		text: "/uui1/libs/requirejs/text",
		css: "/uui1/libs/requirejs/css",
		jquery: "/uui1/libs/jquery/jquery-1.11.2.min",
		knockout: "/uui1/libs/knockout/knockout-3.2.0.debug",
		'u.base': "/uui1/libs/uui/js/u.base",
		'u.ext': "/uui1/libs/uui/js/u.ext",
		model:"js/baseModel",
		zTree:"trd/zTree_v3/js/jquery.ztree.all-3.5.min",
		borderLayout:"js/ref/jquery.layout_and_plugins"
	},
	shim: {
		zTree: {
			deps: ["jquery"]
		},
		borderLayout: {
			deps: ["jquery"]
		},
		'u.base': {
			deps: ["jquery"]
		},
		'u.ext': {
			deps: ["jquery"]
		}
	}
});


require(['jquery', 'knockout', 'model', 'u.base', 'u.ext','zTree','borderLayout'], function($, ko, model) {
 

$('.refer_nav li').click(function(){
	var $this=$(this);
	//deploy li skip
	if($this.hasClass('ref_class_deploy'))
		return ;
	//分类模式切换	
	var hasfold=$( ".ref_class_deploy" ).hasClass('ref_class_fold');
	if(hasfold)
	  $('.ref_class_deploy span').trigger('click');
	
	
		
	var currentIndex=$('.refer_nav li.action').toggleClass('action').attr('index');
	$('#ul_list'+currentIndex).hide();
	
	var clickedIndex=$this.attr('index');
	$('#ul_list'+clickedIndex).show();
	$('#nav_list'+clickedIndex).toggleClass('action');
	
});

$('.refer_list li').click(function(){
	var $this=$(this);
	$('#ref').val($this.attr('data'));
	$('#form_cities2').hide();
});

$('.ref_class_deploy span').click(function(){
	var hasfold=$( ".ref_class_deploy" ).hasClass('ref_class_fold');
	$( ".ref_class_deploy" ).toggleClass('ref_class_fold');
	
	var currentIndex=$('.refer_nav li.action').attr('index');
	
	
	if(!hasfold){
		$('.refer_nav').css({overflow:'visible',height:'214px'});
		$('#ul_list'+currentIndex).hide();
	}else{
		$('.refer_nav').css({overflow:'hidden',height:'25px'});
		$('#ul_list'+currentIndex).show();
	}
});


$('#ref').autocomplete({
					width:200,
					source:[{label:'abc'},{label:'acccc'}],
					select:function(item){
					   }
				    });
$('#ref').focus(function(){
	 
	     var $this=$(this);
	     
		function findPos(obj) {
			var curleft = obj.offsetLeft || 0;
			var curtop = obj.offsetTop || 0;
			while (obj = obj.offsetParent) {
				curleft += obj.offsetLeft
				curtop += obj.offsetTop
			}
			return {
				x: curleft,
				y: curtop
			};
		}
		
	
	    var pos = findPos($this[0]);
		// reposition
		$('#outerContainer').css({
			top: (pos.y + $this[0].offsetHeight) + "px",
			left: pos.x + "px"
		}).find('#form_cities2').show();
	
	 
	  $.post('http://127.0.0.1/iwebap/iref_ctr/blobRefClassSearch',{ 
                //参数一
                isDisabledDataShow:true,
                pk_group:'0001X1100000000008IZ',
                pk_user:'1001X210000000000O11',
                reftype:'%E4%BA%BA%E5%91%98',
                filterCondition:'',
                pk_org:'0001X1100000000019Z5'
            },
            //回调函数 
            function(theback) 
            {
               console.log(theback);
            },
            "json"
            );
	
}).blur(function(){
	 //$("#form_cities2").css("display", "none");
	
}).keyup(function(){
	var $this=$(this);
	if($this.val()===''){
		 $("#form_cities2").css("display", "block");
	}else{
	     $("#form_cities2").css("display", "none");
	}
	
	
}).keydown(function(e){
	$("#form_cities2").css("display", "none");
}).click(function(){
	var $this=$(this);
	$this.select();
});

})
